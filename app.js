import { lessons, questions, diagnostic, glossary } from './data.js';

const storageKey = 'redox-labor-progress-v1';
const initialState = { lesson: 0, completed: {}, attempts: {}, streak: 0, level: 1, diagnosticDone: false };
let state = loadState();
let activeQuestions = {};
let currentIndex = 0;
let selected = [];
let sortItems = [];
let hintIndex = 0;
let checked = false;

const $ = (selector) => document.querySelector(selector);
const lessonNav = $('#lessonNav');
const mobileNav = $('#mobileNav');
const workspace = $('#workspace');
const questionCard = $('#questionCard');

function loadState() {
  try { return { ...initialState, ...JSON.parse(localStorage.getItem(storageKey) || '{}') }; }
  catch { return { ...initialState }; }
}

function saveState() {
  localStorage.setItem(storageKey, JSON.stringify(state));
  updateProgress();
}

function normalized(value) {
  return String(value).toLowerCase().trim()
    .replaceAll('−','-').replaceAll('–','-').replaceAll('→','->')
    .replaceAll('²','2').replaceAll('³','3').replaceAll('⁺','+').replaceAll('⁻','-')
    .replace(/\s+/g,' ').replace(/\s*([+;,])\s*/g,'$1').replace(/\s*->\s*/g,'->');
}

function lessonQuestions(lessonId) {
  if (!activeQuestions[lessonId]) {
    const pool = questions.filter(q => q.lesson === lessonId);
    // The diagnostic level controls the entry point. Every task remains available,
    // but learners meet questions nearest to their current level first.
    activeQuestions[lessonId] = pool.sort((a,b) =>
      Math.abs(a.level - state.level) - Math.abs(b.level - state.level) || a.level - b.level
    );
  }
  return activeQuestions[lessonId];
}

function renderNav() {
  const html = lessons.map((lesson, i) => {
    const done = masteryFor(lesson.id) >= 80;
    return `<button class="nav-item ${i === state.lesson ? 'active' : ''}" data-lesson="${i}">
      <span class="nav-index">${String(i+1).padStart(2,'0')}</span><span>${lesson.title}</span><span class="nav-check">${done ? '✓' : ''}</span>
    </button>`;
  }).join('');
  lessonNav.innerHTML = html;
  mobileNav.innerHTML = html;
  document.querySelectorAll('[data-lesson]').forEach(btn => btn.addEventListener('click', () => openLesson(Number(btn.dataset.lesson))));
}

function masteryFor(lessonId) {
  const qs = questions.filter(q => q.lesson === lessonId);
  const points = qs.reduce((sum,q) => sum + (state.completed[q.id] || 0), 0);
  return qs.length ? Math.round(points / qs.length * 100) : 0;
}

function updateProgress() {
  const total = questions.reduce((sum,q) => sum + (state.completed[q.id] || 0), 0);
  const pct = Math.round(total / questions.length * 100);
  $('#progressBar').style.width = `${pct}%`;
  $('#progressLabel').textContent = `${pct} % gemeistert`;
  $('#continueButton').hidden = !state.diagnosticDone;
  renderNav();
}

function openLesson(index) {
  state.lesson = Math.max(0, Math.min(lessons.length - 1, index));
  currentIndex = 0; selected = []; hintIndex = 0; checked = false;
  saveState();
  const lesson = lessons[state.lesson];
  activeQuestions[lesson.id] = null;
  $('#lessonKicker').textContent = lesson.kicker;
  $('#lessonTitle').textContent = lesson.title;
  $('#lessonIntro').textContent = lesson.intro;
  $('#conceptPanel').innerHTML = lesson.concept;
  $('#masteryValue').textContent = masteryFor(lesson.id);
  $('#difficultyLabel').textContent = `Niveau: ${['Basis','Aufbau','Transfer'][state.level-1]}`;
  $('#prevLesson').disabled = state.lesson === 0;
  $('#nextLesson').textContent = state.lesson === lessons.length - 1 ? 'Auswertung' : 'Nächste Etappe';
  workspace.hidden = false;
  renderQuestion();
  workspace.scrollIntoView({behavior:'smooth', block:'start'});
  mobileNav.hidden = true;
  $('#menuButton').setAttribute('aria-expanded','false');
}

function renderQuestion() {
  const lesson = lessons[state.lesson];
  const qs = lessonQuestions(lesson.id);
  if (currentIndex >= qs.length) return renderLessonSummary();
  const q = qs[currentIndex];
  selected = []; checked = false; hintIndex = 0;
  if (q.type === 'sort') sortItems = [...q.items];
  const response = renderResponse(q);
  questionCard.innerHTML = `<div class="question-meta"><span>AUFGABE ${currentIndex+1} / ${qs.length}</span><span>${q.level === 1 ? 'BASIS' : q.level === 2 ? 'AUFBAU' : 'TRANSFER'}</span></div>
    <h4>${q.prompt}</h4>${response}
    <div class="question-actions"><button class="primary" id="checkAnswer">Prüfen</button><button class="secondary" id="showHint">Hinweis</button></div>
    <p class="hint" id="hintText" hidden></p><div id="feedback"></div>`;
  bindQuestion(q);
}

function renderResponse(q) {
  if (q.type === 'single' || q.type === 'multi') return `<div class="options" role="group" aria-label="Antwortmöglichkeiten">${q.options.map((o,i) => `<button class="option" data-option="${i}" aria-pressed="false"><span class="option-key">${String.fromCharCode(65+i)}</span><span>${o}</span></button>`).join('')}</div>`;
  if (q.type === 'text') return `<label><span class="eyebrow">DEINE ANTWORT</span><input class="answer-input" id="textAnswer" autocomplete="off" spellcheck="false" placeholder="Antwort eingeben"></label>`;
  if (q.type === 'sort') return `<div class="sort-list" id="sortList">${renderSortRows()}</div>`;
  return '';
}

function renderSortRows() {
  return sortItems.map((item,i) => `<div class="sort-row"><span><span class="option-key">${i+1}</span>&nbsp; ${item}</span><button data-up="${i}" aria-label="${item} nach oben">↑</button><button data-down="${i}" aria-label="${item} nach unten">↓</button></div>`).join('');
}

function bindQuestion(q) {
  document.querySelectorAll('[data-option]').forEach(btn => btn.addEventListener('click', () => {
    if (checked) return;
    const i = Number(btn.dataset.option);
    if (q.type === 'single') selected = [i];
    else selected = selected.includes(i) ? selected.filter(x => x !== i) : [...selected, i];
    document.querySelectorAll('[data-option]').forEach(b => {
      const isSelected = selected.includes(Number(b.dataset.option));
      b.classList.toggle('selected', isSelected); b.setAttribute('aria-pressed', String(isSelected));
    });
  }));
  bindSortButtons(q);
  $('#checkAnswer').addEventListener('click', () => checkAnswer(q));
  $('#showHint').addEventListener('click', () => showHint(q));
  $('#textAnswer')?.addEventListener('keydown', e => { if (e.key === 'Enter') checkAnswer(q); });
}

function bindSortButtons(q) {
  document.querySelectorAll('[data-up]').forEach(btn => btn.addEventListener('click', () => moveSort(Number(btn.dataset.up), -1, q)));
  document.querySelectorAll('[data-down]').forEach(btn => btn.addEventListener('click', () => moveSort(Number(btn.dataset.down), 1, q)));
}

function moveSort(index, direction, q) {
  const target = index + direction;
  if (target < 0 || target >= sortItems.length || checked) return;
  [sortItems[index], sortItems[target]] = [sortItems[target], sortItems[index]];
  $('#sortList').innerHTML = renderSortRows(); bindSortButtons(q);
}

function evaluate(q) {
  if (q.type === 'single') return selected[0] === q.answer ? 1 : 0;
  if (q.type === 'multi') {
    if (!selected.length) return 0;
    const correctHits = selected.filter(x => q.answer.includes(x)).length;
    const wrongHits = selected.filter(x => !q.answer.includes(x)).length;
    return Math.max(0, Math.min(1, (correctHits - wrongHits * .5) / q.answer.length));
  }
  if (q.type === 'text') {
    const value = normalized($('#textAnswer').value);
    return q.answers.some(a => normalized(a) === value) ? 1 : 0;
  }
  if (q.type === 'sort') {
    const positions = sortItems.reduce((sum,item,i) => sum + (item === q.answer[i] ? 1 : 0), 0);
    return positions / q.answer.length;
  }
  return 0;
}

function checkAnswer(q) {
  if (checked) return nextQuestion();
  if ((q.type === 'single' || q.type === 'multi') && !selected.length) return toast('Wähle zuerst eine Antwort.');
  if (q.type === 'text' && !$('#textAnswer').value.trim()) return toast('Gib zuerst eine Antwort ein.');
  checked = true;
  const score = evaluate(q);
  state.attempts[q.id] = (state.attempts[q.id] || 0) + 1;
  state.completed[q.id] = Math.max(state.completed[q.id] || 0, score);
  if (score === 1) { state.streak += 1; if (state.streak >= 3) state.level = Math.min(3, state.level + 1); }
  else { state.streak = 0; if ((state.attempts[q.id] || 0) >= 2) state.level = Math.max(1, state.level - 1); }
  saveState();
  markOptions(q);
  const kind = score === 1 ? 'correct' : score >= .5 ? 'partial' : 'incorrect';
  const title = score === 1 ? 'Stimmt.' : score >= .5 ? 'Teilweise richtig.' : 'Noch nicht.';
  let repair = score === 1 ? q.explain : `${diagnose(q)} ${q.explain}`;
  $('#feedback').innerHTML = `<div class="feedback ${kind}"><strong>${title}</strong><span>${repair}</span></div>`;
  $('#checkAnswer').textContent = currentIndex === lessonQuestions(q.lesson).length - 1 ? 'Etappe auswerten' : 'Weiter';
  $('#showHint').hidden = true;
  $('#masteryValue').textContent = masteryFor(q.lesson);
  $('#difficultyLabel').textContent = `Niveau: ${['Basis','Aufbau','Transfer'][state.level-1]}`;
}

function diagnose(q) {
  if (q.type === 'multi') return 'Prüfe jede Aussage einzeln: Wer gibt Elektronen ab, wer nimmt sie auf?';
  if (q.type === 'sort') return 'Einige Positionen stimmen noch nicht. Orientiere dich am Vorzeichen von E°.';
  if (q.type === 'text') return 'Kontrolliere Ladung, Vorzeichen und Koeffizienten.';
  if (q.id.startsWith('n')) return 'Setze zuerst die sicheren Oxidationszahlen ein und nutze dann die Summenregel.';
  if (q.id.startsWith('s')) return 'Vergleiche Donatorstärke und Reduktionspotentiale.';
  return 'Verfolge den Weg der Elektronen statt nur die Stoffnamen.';
}

function markOptions(q) {
  if (!['single','multi'].includes(q.type)) return;
  const answers = q.type === 'single' ? [q.answer] : q.answer;
  document.querySelectorAll('[data-option]').forEach(btn => {
    const i = Number(btn.dataset.option);
    if (answers.includes(i)) btn.classList.add('correct');
    else if (selected.includes(i)) btn.classList.add('wrong');
  });
}

function showHint(q) {
  const hint = q.hint[Math.min(hintIndex, q.hint.length - 1)];
  $('#hintText').textContent = `Hinweis ${Math.min(hintIndex+1, q.hint.length)}: ${hint}`;
  $('#hintText').hidden = false;
  hintIndex += 1;
  if (hintIndex >= q.hint.length) $('#showHint').disabled = true;
}

function nextQuestion() { currentIndex += 1; renderQuestion(); questionCard.scrollIntoView({behavior:'smooth', block:'center'}); }

function renderLessonSummary() {
  const lesson = lessons[state.lesson];
  const mastery = masteryFor(lesson.id);
  const weak = lessonQuestions(lesson.id).filter(q => (state.completed[q.id] || 0) < 1).length;
  questionCard.innerHTML = `<div class="question-meta"><span>ETAPPE ABGESCHLOSSEN</span><span>${mastery} %</span></div><h4>${mastery >= 80 ? 'Bereit für den nächsten Schritt.' : 'Die Grundlage steht. Ein zweiter Durchgang lohnt sich.'}</h4><p>${weak ? `${weak} Aufgabe${weak === 1 ? '' : 'n'} kannst du noch festigen. Beim Wiederholen bleiben deine besten Ergebnisse erhalten.` : 'Alle Aufgaben dieser Etappe sind korrekt gelöst.'}</p><div class="question-actions"><button class="primary" id="summaryNext">${state.lesson === lessons.length-1 ? 'Gesamtauswertung' : 'Weiter zur nächsten Etappe'}</button><button class="secondary" id="retryLesson">Etappe wiederholen</button></div>`;
  $('#retryLesson').addEventListener('click', () => { currentIndex = 0; renderQuestion(); });
  $('#summaryNext').addEventListener('click', () => state.lesson === lessons.length-1 ? renderFinalSummary() : openLesson(state.lesson + 1));
}

function renderFinalSummary() {
  const pct = Math.round(questions.reduce((s,q)=>s+(state.completed[q.id]||0),0)/questions.length*100);
  const lowest = [...lessons].sort((a,b)=>masteryFor(a.id)-masteryFor(b.id))[0];
  questionCard.innerHTML = `<div class="question-meta"><span>GESAMTAUSWERTUNG</span><span>${pct} %</span></div><h4>${pct >= 85 ? 'Du beherrschst den Redox-Werkzeugkasten.' : 'Du hast einen tragfähigen Lernstand aufgebaut.'}</h4><p>Dein stärkster nächster Schritt: <strong>${lowest.title}</strong> wiederholen. Dort liegt dein aktuelles Etappen-Ergebnis bei ${masteryFor(lowest.id)} %.</p><div class="question-actions"><button class="primary" id="targetPractice">Gezielt wiederholen</button><button class="secondary" id="printResult">Ergebnis drucken</button></div>`;
  $('#targetPractice').addEventListener('click', () => openLesson(lessons.findIndex(l=>l.id===lowest.id)));
  $('#printResult').addEventListener('click', () => window.print());
}

function startDiagnostic() {
  let i = 0, score = 0;
  const dialog = $('#diagnosticDialog'); dialog.showModal();
  const render = () => {
    if (i >= diagnostic.length) {
      state.level = score <= 1 ? 1 : score <= 3 ? 2 : 3;
      state.diagnosticDone = true; saveState();
      $('#diagnosticContent').innerHTML = `<div class="feedback correct"><strong>Dein Startniveau: ${['Basis','Aufbau','Transfer'][state.level-1]}</strong><span>Die Aufgaben passen sich weiter an deine Antworten an. Keine Etappe bleibt gesperrt.</span></div><button class="primary" id="beginLearning">Lernpfad öffnen</button>`;
      $('#beginLearning').addEventListener('click', () => { dialog.close(); openLesson(state.level === 3 ? 2 : 0); });
      return;
    }
    const q = diagnostic[i];
    $('#diagnosticContent').innerHTML = `<p class="question-meta">FRAGE ${i+1} / ${diagnostic.length}</p><h3>${q.prompt}</h3>${q.options.map((o,j)=>`<button class="option diagnostic-option" data-diagnostic="${j}">${o}</button>`).join('')}`;
    document.querySelectorAll('[data-diagnostic]').forEach(btn => btn.addEventListener('click', () => { if (Number(btn.dataset.diagnostic) === q.answer) score++; i++; render(); }));
  };
  render();
}

function renderGlossary(filter='') {
  const found = glossary.filter(([term,def]) => `${term} ${def}`.toLowerCase().includes(filter.toLowerCase()));
  $('#glossaryList').innerHTML = `<dl>${found.map(([term,def])=>`<div class="glossary-item"><dt>${term}</dt><dd>${def}</dd></div>`).join('') || '<p>Kein Begriff gefunden.</p>'}</dl>`;
}

function toast(message) { const el=$('#toast'); el.textContent=message; el.classList.add('show'); setTimeout(()=>el.classList.remove('show'),2200); }

$('#startButton').addEventListener('click', startDiagnostic);
$('#continueButton').addEventListener('click', () => openLesson(state.lesson));
$('#prevLesson').addEventListener('click', () => openLesson(state.lesson - 1));
$('#nextLesson').addEventListener('click', () => state.lesson === lessons.length - 1 ? renderFinalSummary() : openLesson(state.lesson + 1));
$('#glossaryButton').addEventListener('click', () => { renderGlossary(); $('#glossaryDialog').showModal(); });
$('#glossarySearch').addEventListener('input', e => renderGlossary(e.target.value));
$('#resetButton').addEventListener('click', () => { if (confirm('Gesamten Lernfortschritt auf diesem Gerät löschen?')) { localStorage.removeItem(storageKey); state={...initialState}; activeQuestions={}; updateProgress(); workspace.hidden=true; toast('Lernfortschritt gelöscht.'); } });
$('#menuButton').addEventListener('click', e => { const open=e.currentTarget.getAttribute('aria-expanded')==='true'; e.currentTarget.setAttribute('aria-expanded',String(!open)); mobileNav.hidden=open; });
document.querySelectorAll('[data-close]').forEach(btn => btn.addEventListener('click', () => document.getElementById(btn.dataset.close).close()));
document.querySelectorAll('dialog').forEach(dialog => dialog.addEventListener('click', e => { if (e.target === dialog) dialog.close(); }));

updateProgress();
