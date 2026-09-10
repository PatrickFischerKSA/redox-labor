import { answers, diagnosticAnswers, scoreAnswer } from './answers';

type Json = Record<string, unknown>;
type AuthenticatedLearner = { id: string; alias: string; class_code: string };
type StateRow = { lesson_index: number; level: number; streak: number; diagnostic_done: number };
type MasteryRow = { question_id: string; best_score: number; attempt_count: number };

const encoder = new TextEncoder();

function json(data: unknown, status = 200, headers: HeadersInit = {}): Response {
  return Response.json(data, { status, headers: { 'Cache-Control': 'no-store', ...headers } });
}

function corsHeaders(request: Request, env: Env): HeadersInit {
  const origin = request.headers.get('Origin');
  const allowed = env.ALLOWED_ORIGINS.split(',').map(value => value.trim()).filter(Boolean);
  if (!origin || !allowed.includes(origin)) return { Vary: 'Origin' };
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET,POST,PATCH,OPTIONS',
    'Access-Control-Allow-Headers': 'Authorization,Content-Type',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin'
  };
}

function error(message: string, status: number, request: Request, env: Env): Response {
  return json({ error: message }, status, corsHeaders(request, env));
}

async function body(request: Request): Promise<Json> {
  const length = Number(request.headers.get('Content-Length') || 0);
  if (length > 16_384) throw new Error('REQUEST_TOO_LARGE');
  const parsed: unknown = await request.json();
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error('INVALID_JSON');
  return parsed as Json;
}

function hex(bytes: Uint8Array): string {
  return [...bytes].map(byte => byte.toString(16).padStart(2, '0')).join('');
}

function randomHex(size: number): string {
  const bytes = new Uint8Array(size);
  crypto.getRandomValues(bytes);
  return hex(bytes);
}

async function sha256(value: string): Promise<string> {
  return hex(new Uint8Array(await crypto.subtle.digest('SHA-256', encoder.encode(value))));
}

async function hashPin(pin: string, saltHex: string, pepper: string): Promise<string> {
  const key = await crypto.subtle.importKey('raw', encoder.encode(pepper), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(`${saltHex}:${pin}`));
  return hex(new Uint8Array(signature));
}

function constantTimeEqual(left: string, right: string): boolean {
  const size = Math.max(left.length, right.length);
  let difference = left.length ^ right.length;
  for (let index = 0; index < size; index += 1) difference |= (left.charCodeAt(index) || 0) ^ (right.charCodeAt(index) || 0);
  return difference === 0;
}

function bearer(request: Request): string | null {
  const value = request.headers.get('Authorization');
  return value?.startsWith('Bearer ') ? value.slice(7) : null;
}

function credentials(data: Json): { alias: string; pin: string } | null {
  if (typeof data.alias !== 'string' || typeof data.pin !== 'string') return null;
  const alias = data.alias.trim();
  if (alias.length < 2 || alias.length > 40 || /[\u0000-\u001F\u007F]/.test(alias) || data.pin.length < 6 || data.pin.length > 12) return null;
  return { alias, pin: data.pin };
}

async function createSession(learnerId: string, env: Env): Promise<string> {
  const token = randomHex(32);
  const tokenHash = await sha256(token);
  const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
  await env.DB.batch([
    env.DB.prepare('INSERT INTO sessions (token_hash, learner_id, expires_at) VALUES (?1, ?2, ?3)').bind(tokenHash, learnerId, expires),
    env.DB.prepare('DELETE FROM sessions WHERE expires_at<=CURRENT_TIMESTAMP')
  ]);
  return token;
}

async function authenticateLearner(request: Request, env: Env): Promise<AuthenticatedLearner | null> {
  const token = bearer(request);
  if (!token || token.length !== 64) return null;
  const tokenHash = await sha256(token);
  const learner = await env.DB.prepare(`SELECT l.id, l.alias, c.code AS class_code FROM sessions s JOIN learners l ON l.id=s.learner_id JOIN classes c ON c.id=l.class_id WHERE s.token_hash=?1 AND s.expires_at>CURRENT_TIMESTAMP`).bind(tokenHash).first<AuthenticatedLearner>();
  if (learner) await env.DB.prepare('UPDATE learners SET last_seen_at=CURRENT_TIMESTAMP WHERE id=?1').bind(learner.id).run();
  return learner;
}

async function progressPayload(learner: AuthenticatedLearner, env: Env): Promise<Json> {
  const [stateResult, masteryResult] = await env.DB.batch([
    env.DB.prepare('SELECT lesson_index, level, streak, diagnostic_done FROM learner_state WHERE learner_id=?1').bind(learner.id),
    env.DB.prepare('SELECT question_id, best_score, attempt_count FROM mastery WHERE learner_id=?1').bind(learner.id)
  ]);
  if (!stateResult || !masteryResult) throw new Error('PROGRESS_QUERY_FAILED');
  const state = stateResult.results[0] as StateRow | undefined;
  const rows = masteryResult.results as MasteryRow[];
  return {
    learner: { alias: learner.alias },
    progress: {
      lessonIndex: state?.lesson_index ?? 0,
      level: state?.level ?? 1,
      streak: state?.streak ?? 0,
      diagnosticDone: Boolean(state?.diagnostic_done),
      completed: Object.fromEntries(rows.map(row => [row.question_id, row.best_score])),
      attempts: Object.fromEntries(rows.map(row => [row.question_id, row.attempt_count]))
    }
  };
}

async function register(request: Request, env: Env): Promise<Response> {
  const values = credentials(await body(request));
  if (!values) return error('Lernname oder PIN sind ungültig.', 400, request, env);
  const classroom = await env.DB.prepare('SELECT id FROM classes WHERE code=?1').bind(env.DEFAULT_CLASS_CODE).first<{ id: string }>();
  if (!classroom) return error('Der gemeinsame Lernbereich ist noch nicht eingerichtet.', 503, request, env);
  const learnerId = crypto.randomUUID();
  const salt = randomHex(16);
  const pinHash = await hashPin(values.pin, salt, env.AUTH_PEPPER);
  try {
    await env.DB.batch([
      env.DB.prepare('INSERT INTO learners (id,class_id,alias,pin_hash,pin_salt) VALUES (?1,?2,?3,?4,?5)').bind(learnerId,classroom.id,values.alias,pinHash,salt),
      env.DB.prepare('INSERT INTO learner_state (learner_id) VALUES (?1)').bind(learnerId)
    ]);
  } catch {
    return error('Dieser Lernname ist bereits vergeben.', 409, request, env);
  }
  const token = await createSession(learnerId, env);
  return json({ token, ...(await progressPayload({ id: learnerId, alias: values.alias, class_code: env.DEFAULT_CLASS_CODE }, env)) }, 201, corsHeaders(request, env));
}

async function login(request: Request, env: Env): Promise<Response> {
  const values = credentials(await body(request));
  if (!values) return error('Anmeldedaten sind ungültig.', 400, request, env);
  const row = await env.DB.prepare(`SELECT l.id,l.alias,l.pin_hash,l.pin_salt,c.code AS class_code FROM learners l JOIN classes c ON c.id=l.class_id WHERE c.code=?1 AND l.alias=?2`).bind(env.DEFAULT_CLASS_CODE, values.alias).first<AuthenticatedLearner & { pin_hash: string; pin_salt: string }>();
  const candidateHash = await hashPin(values.pin, row?.pin_salt ?? '00000000000000000000000000000000', env.AUTH_PEPPER);
  if (!row || !constantTimeEqual(candidateHash, row.pin_hash)) return error('Lernname oder PIN stimmen nicht.', 401, request, env);
  const token = await createSession(row.id, env);
  return json({ token, ...(await progressPayload(row, env)) }, 200, corsHeaders(request, env));
}

async function recordAttempt(request: Request, learner: AuthenticatedLearner, env: Env): Promise<Response> {
  const data = await body(request);
  if (typeof data.questionId !== 'string' || !(data.questionId in answers) || !('response' in data) || !Number.isInteger(data.lessonIndex) || Number(data.lessonIndex) < 0 || Number(data.lessonIndex) > 5) return error('Aufgabendaten sind ungültig.', 400, request, env);
  const rule = answers[data.questionId];
  if (!rule) return error('Unbekannte Aufgabe.', 404, request, env);
  const score = scoreAnswer(rule, data.response);
  const [state, mastery] = await Promise.all([
    env.DB.prepare('SELECT level,streak FROM learner_state WHERE learner_id=?1').bind(learner.id).first<{ level: number; streak: number }>(),
    env.DB.prepare('SELECT attempt_count FROM mastery WHERE learner_id=?1 AND question_id=?2').bind(learner.id,data.questionId).first<{ attempt_count: number }>()
  ]);
  const previousStreak = state?.streak ?? 0;
  const nextStreak = score === 1 ? previousStreak + 1 : 0;
  let nextLevel = state?.level ?? 1;
  if (score === 1 && nextStreak >= 3) nextLevel = Math.min(3, nextLevel + 1);
  if (score < 1 && (mastery?.attempt_count ?? 0) + 1 >= 2) nextLevel = Math.max(1, nextLevel - 1);
  await env.DB.batch([
    env.DB.prepare('INSERT INTO attempts (id,learner_id,question_id,response_json,score) VALUES (?1,?2,?3,?4,?5)').bind(crypto.randomUUID(),learner.id,data.questionId,JSON.stringify(data.response),score),
    env.DB.prepare(`INSERT INTO mastery (learner_id,question_id,best_score,attempt_count) VALUES (?1,?2,?3,1) ON CONFLICT(learner_id,question_id) DO UPDATE SET best_score=MAX(best_score,excluded.best_score),attempt_count=attempt_count+1,updated_at=CURRENT_TIMESTAMP`).bind(learner.id,data.questionId,score),
    env.DB.prepare('UPDATE learner_state SET lesson_index=?1,level=?2,streak=?3,updated_at=CURRENT_TIMESTAMP WHERE learner_id=?4').bind(data.lessonIndex,nextLevel,nextStreak,learner.id)
  ]);
  return json({ score, ...(await progressPayload(learner, env)) }, 201, corsHeaders(request, env));
}

async function saveDiagnostic(request: Request, learner: AuthenticatedLearner, env: Env): Promise<Response> {
  const data = await body(request);
  if (!Array.isArray(data.answers) || data.answers.length !== diagnosticAnswers.length || data.answers.some(value => !Number.isInteger(value))) return error('Diagnoseantworten sind ungültig.', 400, request, env);
  const count = data.answers.reduce<number>((sum, value, index) => sum + (value === diagnosticAnswers[index] ? 1 : 0), 0);
  const level = count <= 1 ? 1 : count <= 3 ? 2 : 3;
  await env.DB.prepare('UPDATE learner_state SET level=?1,diagnostic_done=1,updated_at=CURRENT_TIMESTAMP WHERE learner_id=?2').bind(level,learner.id).run();
  return json(await progressPayload(learner, env), 200, corsHeaders(request, env));
}

async function adminAuthorized(request: Request, env: Env): Promise<boolean> {
  const token = bearer(request) || '';
  if (!env.ADMIN_TOKEN || !token) return false;
  return constantTimeEqual(await sha256(token), await sha256(env.ADMIN_TOKEN));
}

async function adminRoute(request: Request, url: URL, env: Env): Promise<Response> {
  if (!(await adminAuthorized(request, env))) return error('Lehrpersonen-Zugriff verweigert.', 401, request, env);
  if (request.method === 'GET' && url.pathname === '/v1/admin/report') {
    const result = await env.DB.prepare(`SELECT l.alias,l.created_at,l.last_seen_at,s.lesson_index,s.level,s.diagnostic_done,COUNT(m.question_id) AS answered,COALESCE(ROUND(SUM(m.best_score)*100.0/34),0) AS mastery_percent,COALESCE(SUM(m.attempt_count),0) AS attempts FROM learners l JOIN learner_state s ON s.learner_id=l.id LEFT JOIN mastery m ON m.learner_id=l.id GROUP BY l.id ORDER BY l.alias`).all();
    return json({ learners: result.results, generatedAt: new Date().toISOString() }, 200, corsHeaders(request, env));
  }
  return error('Admin-Endpunkt nicht gefunden.', 404, request, env);
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const cors = corsHeaders(request, env);
    if (request.method === 'OPTIONS') {
      const origin = request.headers.get('Origin');
      if (!origin || !env.ALLOWED_ORIGINS.split(',').map(value => value.trim()).includes(origin)) return new Response(null, { status: 403, headers: cors });
      return new Response(null, { status: 204, headers: cors });
    }
    try {
      if (request.method === 'GET' && url.pathname === '/health') return json({ status: 'ok' }, 200, cors);
      if (request.method === 'POST' && url.pathname === '/v1/session/register') return await register(request, env);
      if (request.method === 'POST' && url.pathname === '/v1/session/login') return await login(request, env);
      if (url.pathname.startsWith('/v1/admin/')) return await adminRoute(request, url, env);
      const learner = await authenticateLearner(request, env);
      if (!learner) return error('Anmeldung oder Sitzung ist ungültig.', 401, request, env);
      if (request.method === 'GET' && url.pathname === '/v1/progress') return json(await progressPayload(learner, env), 200, cors);
      if (request.method === 'POST' && url.pathname === '/v1/attempts') return await recordAttempt(request, learner, env);
      if (request.method === 'POST' && url.pathname === '/v1/diagnostic') return await saveDiagnostic(request, learner, env);
      if (request.method === 'PATCH' && url.pathname === '/v1/profile') {
        const data = await body(request);
        if (!Number.isInteger(data.lessonIndex) || Number(data.lessonIndex) < 0 || Number(data.lessonIndex) > 5) return error('Etappe ist ungültig.', 400, request, env);
        await env.DB.prepare('UPDATE learner_state SET lesson_index=?1,updated_at=CURRENT_TIMESTAMP WHERE learner_id=?2').bind(data.lessonIndex,learner.id).run();
        return json({ saved: true }, 200, cors);
      }
      return error('Endpunkt nicht gefunden.', 404, request, env);
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : String(caught);
      console.error(JSON.stringify({ message: 'request_failed', method: request.method, path: url.pathname, error: message }));
      if (message === 'REQUEST_TOO_LARGE') return error('Anfrage ist zu gross.', 413, request, env);
      if (message === 'INVALID_JSON' || caught instanceof SyntaxError) return error('Ungültige JSON-Anfrage.', 400, request, env);
      return error('Interner Datenbankfehler.', 500, request, env);
    }
  }
} satisfies ExportedHandler<Env>;
