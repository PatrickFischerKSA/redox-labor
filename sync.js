const apiUrl = String(window.REDOX_API_URL || '').replace(/\/$/, '');
const tokenKey = 'redox-session-token';
let session = { token: sessionStorage.getItem(tokenKey), alias: null, classCode: null };

export function isConfigured() { return Boolean(apiUrl); }
export function isConnected() { return Boolean(apiUrl && session.token); }
export function currentAccount() { return { ...session }; }

async function request(path, options = {}) {
  if (!apiUrl) throw new Error('Die Datenbank-API ist noch nicht konfiguriert.');
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (session.token) headers.Authorization = `Bearer ${session.token}`;
  const response = await fetch(`${apiUrl}${path}`, { ...options, headers });
  let data = {};
  try { data = await response.json(); } catch { /* Responses are expected to be JSON. */ }
  if (!response.ok) throw new Error(data.error || `Serverfehler ${response.status}`);
  return data;
}

export async function authenticate(mode, credentials) {
  const data = await request(`/v1/session/${mode}`, { method: 'POST', body: JSON.stringify(credentials) });
  session = { token: data.token, alias: data.learner.alias, classCode: data.learner.classCode };
  sessionStorage.setItem(tokenKey, data.token);
  return data;
}

export async function restoreSession() {
  if (!isConnected()) return null;
  try {
    const data = await request('/v1/progress');
    session.alias = data.learner.alias;
    session.classCode = data.learner.classCode;
    return data;
  } catch (error) {
    if (/Anmeldung|Sitzung/.test(error.message)) logout();
    throw error;
  }
}

export async function submitAttempt(questionId, response, lessonIndex) {
  return request('/v1/attempts', {
    method: 'POST',
    body: JSON.stringify({ questionId, response, lessonIndex })
  });
}

export async function submitDiagnostic(answers) {
  return request('/v1/diagnostic', { method: 'POST', body: JSON.stringify({ answers }) });
}

export async function updatePosition(lessonIndex) {
  if (!isConnected()) return null;
  return request('/v1/profile', { method: 'PATCH', body: JSON.stringify({ lessonIndex }) });
}

export function logout() {
  sessionStorage.removeItem(tokenKey);
  session = { token: null, alias: null, classCode: null };
}
