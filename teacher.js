const apiUrl = String(window.REDOX_API_URL || '').replace(/\/$/, '');
let currentReport = null;

const $ = selector => document.querySelector(selector);

async function api(path, token, options = {}) {
  if (!apiUrl) throw new Error('Trage zuerst die Worker-URL in config.js ein.');
  const response = await fetch(`${apiUrl}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, ...options.headers }
  });
  let data = {};
  try { data = await response.json(); } catch { /* Server errors can have an empty body. */ }
  if (!response.ok) throw new Error(data.error || `Serverfehler ${response.status}`);
  return data;
}

function date(value) {
  return new Intl.DateTimeFormat('de-CH', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(value));
}

function renderReport(data) {
  currentReport = data;
  $('#reportTitle').textContent = 'Alle Lernenden';
  $('#reportMeta').textContent = `Stand: ${date(data.generatedAt)}`;
  const learners = data.learners;
  const average = learners.length ? Math.round(learners.reduce((sum, learner) => sum + Number(learner.mastery_percent), 0) / learners.length) : 0;
  $('#reportSummary').innerHTML = `<article><strong>${learners.length}</strong><span>Lernende</span></article><article><strong>${average} %</strong><span>Ø Mastery</span></article><article><strong>${learners.reduce((sum, learner) => sum + Number(learner.attempts), 0)}</strong><span>gespeicherte Versuche</span></article>`;
  $('#reportRows').innerHTML = learners.map(learner => `<tr><td>${escapeHtml(learner.alias)}</td><td><strong>${learner.mastery_percent} %</strong></td><td>${learner.answered} / 34</td><td>${learner.attempts}</td><td>${['Basis','Aufbau','Transfer'][Number(learner.level)-1]}</td><td>${date(learner.last_seen_at)}</td></tr>`).join('') || '<tr><td colspan="6">Noch keine Lernenden registriert.</td></tr>';
  $('#report').hidden = false;
}

function escapeHtml(value) {
  const div = document.createElement('div'); div.textContent = String(value); return div.innerHTML;
}

function exportCsv() {
  if (!currentReport) return;
  const header = ['Lernname','Mastery Prozent','Aufgaben','Versuche','Niveau','Letzte Aktivität'];
  const rows = currentReport.learners.map(learner => [learner.alias,learner.mastery_percent,learner.answered,learner.attempts,learner.level,learner.last_seen_at]);
  const csv = [header,...rows].map(row => row.map(value => {
    const raw = String(value);
    const safe = /^[=+\-@]/.test(raw) ? `'${raw}` : raw;
    return `"${safe.replaceAll('"','""')}"`;
  }).join(';')).join('\n');
  const link = document.createElement('a');
  link.href = URL.createObjectURL(new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8' }));
  link.download = 'redox-lernstand.csv';
  link.click(); URL.revokeObjectURL(link.href);
}

$('#reportForm').addEventListener('submit', async event => {
  event.preventDefault(); const data = new FormData(event.currentTarget);
  $('#reportMessage').textContent = 'Daten werden geladen …';
  try { renderReport(await api('/v1/admin/report', String(data.get('adminToken')))); $('#reportMessage').textContent = ''; }
  catch (error) { $('#reportMessage').textContent = error.message; }
});

$('#csvButton').addEventListener('click', exportCsv);
