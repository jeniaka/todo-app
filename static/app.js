'use strict';

// ─── State ────────────────────────────────────────────────────────────────────
const state = {
  todos: [],
  filter: 'all',
  lang: localStorage.getItem('lang') || 'en',
  newPriority: 'none',
  activeDrawer: null,
  aiOpen: false,
};

// ─── i18n ─────────────────────────────────────────────────────────────────────
const T = {
  en: {
    title: 'My Tasks', date_locale: 'en-US',
    placeholder: 'What needs to be done?',
    add: 'Add', all: 'All', active: 'Active', done: 'Done',
    remaining: n => `${n} task${n !== 1 ? 's' : ''} remaining`,
    completed: n => `${n} completed`,
    clear: 'Clear completed',
    empty_all: 'No tasks yet',      empty_all_sub: 'Add something above to get started.',
    empty_active: 'All done!',      empty_active_sub: 'Everything is checked off.',
    empty_done: 'Nothing completed yet', empty_done_sub: 'Complete a task to see it here.',
    subtasks: 'Sub-tasks', add_sub_ph: 'Add a sub-task…',
    priority: 'Priority', high: 'High', medium: 'Medium', low: 'Low', none: 'None',
    notes: 'Notes', notes_ph: 'Add notes…',
    time: 'Time',
    created: 'Created', completed_at: 'Completed', took: 'Took',
    ago: 'ago', just_now: 'just now',
    delete: 'Delete task', save: 'Save',
    ai_title: 'AI Assistant',
    ai_suggest: 'Suggest Next Task', ai_suggest_sub: 'AI picks what to tackle next',
    ai_summary: 'Daily Summary',    ai_summary_sub: "Overview of today's progress",
    ai_split: 'Split with AI', ai_apply: 'Apply selected',
    ai_thinking: 'Thinking…',
    sign_out: 'Sign out',
    confirm_delete: 'Delete this task?',
  },
  he: {
    title: 'המשימות שלי', date_locale: 'he-IL',
    placeholder: 'מה צריך לעשות?',
    add: 'הוסף', all: 'הכל', active: 'פעיל', done: 'הושלם',
    remaining: n => `נותרו ${n} משימות`,
    completed: n => `${n} הושלמו`,
    clear: 'נקה שהושלמו',
    empty_all: 'אין משימות עדיין', empty_all_sub: 'הוסף משימה למעלה.',
    empty_active: 'הכל הושלם!',    empty_active_sub: 'כל המשימות מסומנות.',
    empty_done: 'עדיין לא הושלם כלום', empty_done_sub: 'השלם משימה כדי לראות אותה כאן.',
    subtasks: 'תתי-משימות', add_sub_ph: 'הוסף תת-משימה…',
    priority: 'עדיפות', high: 'גבוהה', medium: 'בינונית', low: 'נמוכה', none: 'ללא',
    notes: 'הערות', notes_ph: 'הוסף הערות…',
    time: 'זמן',
    created: 'נוצר', completed_at: 'הושלם', took: 'לקח',
    ago: 'לפני', just_now: 'עכשיו',
    delete: 'מחק משימה', save: 'שמור',
    ai_title: 'עוזר AI',
    ai_suggest: 'הצע משימה הבאה', ai_suggest_sub: 'AI בוחר מה לטפל בו הבא',
    ai_summary: 'סיכום יומי',       ai_summary_sub: 'סקירה של ההתקדמות של היום',
    ai_split: 'פצל עם AI', ai_apply: 'הוסף שנבחרו',
    ai_thinking: 'חושב…',
    sign_out: 'התנתק',
    confirm_delete: 'למחוק את המשימה?',
  }
};
const t = () => T[state.lang];

// ─── Time helpers ─────────────────────────────────────────────────────────────
function relativeTime(ts) {
  if (!ts) return '';
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  const hrs  = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  const l = t();
  if (mins < 1)  return l.just_now;
  if (mins < 60) return `${mins}m ${l.ago}`;
  if (hrs  < 24) return `${hrs}h ${l.ago}`;
  return `${days}d ${l.ago}`;
}

function duration(from, to) {
  if (!from || !to) return '';
  const diff = to - from;
  const mins = Math.floor(diff / 60000);
  const hrs  = Math.floor(diff / 3600000);
  if (mins < 60) return `${mins}m`;
  const remMins = mins % 60;
  return remMins > 0 ? `${hrs}h ${remMins}m` : `${hrs}h`;
}

function absTime(ts) {
  if (!ts) return '';
  const locale = state.lang === 'he' ? 'he-IL' : 'en-US';
  return new Date(ts).toLocaleString(locale, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

// ─── API ──────────────────────────────────────────────────────────────────────
async function apiLoad() {
  const r = await fetch('/api/todos');
  if (r.status === 401) { location.href = '/login'; return []; }
  return r.json();
}

async function apiSave() {
  await fetch('/api/todos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(state.todos),
  });
}

async function apiFetch(endpoint, body) {
  const r = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!r.ok) throw new Error('API error');
  return r.json();
}

// ─── Data migration ───────────────────────────────────────────────────────────
function migrateTodo(raw) {
  return {
    id:          raw.id          || Date.now(),
    text:        raw.text        || '',
    done:        !!raw.done,
    priority:    raw.priority    || 'none',
    description: raw.description || '',
    tags:        raw.tags        || [],
    subtasks:    (raw.subtasks   || []).map(s => ({
      id:   s.id   || Date.now() + Math.random(),
      text: s.text || '',
      done: !!s.done,
    })),
    createdAt:   raw.createdAt   || Date.now(),
    completedAt: raw.completedAt || null,
  };
}

// ─── Confetti ─────────────────────────────────────────────────────────────────
function burst(x, y) {
  const colors = ['#2563EB','#7C3AED','#16A34A','#F97316','#EF4444','#FBBF24'];
  for (let i = 0; i < 14; i++) {
    const el = document.createElement('div');
    el.className = 'cp';
    el.style.left = x + 'px';
    el.style.top  = y + 'px';
    el.style.background = colors[i % colors.length];
    document.body.appendChild(el);
    const tx = (Math.random() - 0.5) * 100;
    const ty = -(Math.random() * 80 + 20);
    el.animate([
      { transform: 'translate(0,0) rotate(0deg)', opacity: 1 },
      { transform: `translate(${tx}px,${ty}px) rotate(${Math.random()*360}deg)`, opacity: 0 },
    ], { duration: 900, easing: 'cubic-bezier(0,0,0.2,1)', fill: 'forwards' })
      .finished.then(() => el.remove());
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function esc(s) {
  return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ─── Task card HTML ───────────────────────────────────────────────────────────
function subBarHTML(todo) {
  const subs = todo.subtasks || [];
  if (!subs.length) return '';
  const done = subs.filter(s => s.done).length;
  const pct  = Math.round(done / subs.length * 100);
  return `<div class="sub-bar">
    <div class="sub-bar-track"><div class="sub-bar-fill" style="width:${pct}%"></div></div>
    <span class="sub-bar-label">${done}/${subs.length}</span>
  </div>`;
}

function taskCardHTML(todo) {
  const l   = t();
  const dur = todo.done && todo.completedAt ? duration(todo.createdAt, todo.completedAt) : '';
  const p   = todo.priority || 'none';
  return `<div class="task-card${todo.done ? ' done-card' : ''}" data-id="${todo.id}" data-p="${p}" role="button" tabindex="0">
  <div class="task-inner">
    <button class="task-cb${todo.done ? ' ticked' : ''}" data-check="${todo.id}" aria-label="Toggle">
      <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
        <path d="M1 4L3.5 6.5L9 1" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>
    <div class="task-body">
      <div class="task-title">${esc(todo.text)}</div>
      <div class="task-meta">
        <span class="task-time">${relativeTime(todo.createdAt)}</span>
        ${dur ? `<span class="task-dur">${l.took} ${dur}</span>` : ''}
      </div>
      ${subBarHTML(todo)}
    </div>
  </div>
</div>`;
}

function skeletonHTML() {
  return Array(3).fill(0).map((_, i) => `
    <div class="skel" style="animation-delay:${i * 0.08}s">
      <div class="skel-line" style="width:${[70,50,85][i]}%;margin-block-end:8px"></div>
      <div class="skel-line" style="width:30%"></div>
    </div>`).join('');
}

// ─── Intersection observer ────────────────────────────────────────────────────
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  });
}, { threshold: 0.05 });

// ─── Main render ──────────────────────────────────────────────────────────────
function render() {
  const l = t();

  document.getElementById('navBrand').textContent      = l.title;
  document.getElementById('logoutBtnNav').textContent  = l.sign_out;
  document.getElementById('heroTitle').textContent     = l.title;
  document.getElementById('heroDate').textContent      = new Date().toLocaleDateString(
    l.date_locale, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
  );

  document.getElementById('addInput').placeholder     = l.placeholder;
  document.getElementById('addSubmit').textContent    = l.add;
  document.getElementById('fAll').textContent         = l.all;
  document.getElementById('fActive').textContent      = l.active;
  document.getElementById('fDone').textContent        = l.done;

  // Priority dropdown labels
  document.querySelectorAll('#pDropdown [data-i18n]').forEach(el => {
    el.textContent = l[el.dataset.i18n] || el.textContent;
  });

  // Progress
  const doneCount = state.todos.filter(x => x.done).length;
  const total     = state.todos.length;
  const pct       = total ? Math.round(doneCount / total * 100) : 0;
  document.getElementById('progFill').style.width    = pct + '%';
  document.getElementById('progPct').textContent     = pct + '%';
  document.getElementById('statsText').textContent   = l.remaining(total - doneCount) + ' · ' + l.completed(doneCount);
  document.getElementById('statsCount').textContent  = total ? `${total - doneCount} / ${total}` : '';
  document.getElementById('clearDoneBtn').textContent = l.clear;

  // AI popover
  const ids = {
    aiPopTitle: 'ai_title', aiSuggestTitle: 'ai_suggest', aiSuggestSub: 'ai_suggest_sub',
    aiSummaryTitle: 'ai_summary', aiSummarySub: 'ai_summary_sub',
  };
  Object.entries(ids).forEach(([id, key]) => {
    const el = document.getElementById(id);
    if (el) el.textContent = l[key];
  });

  // Task list
  const visible = state.todos.filter(todo =>
    state.filter === 'all' ||
    (state.filter === 'done' ? todo.done : !todo.done)
  );

  const listEl = document.getElementById('taskList');
  if (!visible.length) {
    const map = {
      all:    [l.empty_all,    l.empty_all_sub],
      active: [l.empty_active, l.empty_active_sub],
      done:   [l.empty_done,   l.empty_done_sub],
    };
    const [title, sub] = map[state.filter];
    listEl.innerHTML = `<div class="empty">
      <div class="empty-icon">${state.filter === 'done' ? '🎉' : '✦'}</div>
      <div class="empty-title">${title}</div>
      <div class="empty-sub">${sub}</div>
    </div>`;
  } else {
    listEl.innerHTML = visible.map(taskCardHTML).join('');
    listEl.querySelectorAll('.task-card').forEach((el, i) => {
      el.style.transitionDelay = `${i * 0.04}s`;
      io.observe(el);
      // Also trigger immediately for cards already in view
      requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('in')));
    });
  }
}

// ─── Live time refresh (every minute) ────────────────────────────────────────
setInterval(() => {
  document.querySelectorAll('.task-time').forEach(el => {
    const card = el.closest('[data-id]');
    if (!card) return;
    const todo = state.todos.find(x => x.id === parseInt(card.dataset.id));
    if (todo) el.textContent = relativeTime(todo.createdAt);
  });
}, 60000);

// ─── Toggle complete ──────────────────────────────────────────────────────────
async function toggleTodo(id, checkEl) {
  const todo = state.todos.find(x => x.id === id);
  if (!todo) return;
  todo.done        = !todo.done;
  todo.completedAt = todo.done ? Date.now() : null;
  if (todo.done && checkEl) {
    const rect = checkEl.getBoundingClientRect();
    burst(rect.left + rect.width / 2, rect.top + rect.height / 2);
  }
  render();
  await apiSave();
}

// ─── Add task ─────────────────────────────────────────────────────────────────
async function addTodo(text) {
  if (!text.trim()) return;
  const todo = migrateTodo({
    id: Date.now(), text: text.trim(), done: false,
    priority: state.newPriority, createdAt: Date.now(),
  });
  state.todos.unshift(todo);
  resetPriorityPicker();
  render();
  await apiSave();
}

function resetPriorityPicker() {
  state.newPriority = 'none';
  document.getElementById('pIndicator').style.background = 'var(--p-none)';
  document.getElementById('pDropdown').style.display = 'none';
}

// ─── Filter ───────────────────────────────────────────────────────────────────
function setFilter(f) {
  state.filter = f;
  document.querySelectorAll('.filter-btn').forEach(b =>
    b.classList.toggle('active', b.dataset.filter === f)
  );
  render();
}

// ─── Language ─────────────────────────────────────────────────────────────────
function setLang(lang) {
  state.lang = lang;
  localStorage.setItem('lang', lang);
  document.documentElement.lang = lang;
  document.documentElement.dir  = lang === 'he' ? 'rtl' : 'ltr';
  document.querySelectorAll('.lang-btn').forEach(b =>
    b.classList.toggle('active', b.dataset.lang === lang)
  );
  if (state.activeDrawer !== null) renderDrawer(state.activeDrawer);
  render();
}

// ─── Theme ────────────────────────────────────────────────────────────────────
function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  document.getElementById('themeBtn').textContent = theme === 'dark' ? '☀️' : '🌙';
}

function toggleTheme() {
  const cur    = document.documentElement.dataset.theme;
  const isDark = cur === 'dark' || (!cur && window.matchMedia('(prefers-color-scheme:dark)').matches);
  const next   = isDark ? 'light' : 'dark';
  applyTheme(next);
  localStorage.setItem('theme', next);
}

// ─── Drawer ───────────────────────────────────────────────────────────────────
let saveDebounce = null;

function openDrawer(id) {
  const todo = state.todos.find(x => x.id === id);
  if (!todo) return;
  state.activeDrawer = id;
  renderDrawer(todo);
  document.getElementById('overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeDrawer() {
  flushDrawerSave();
  document.getElementById('overlay').classList.remove('open');
  document.body.style.overflow = '';
  state.activeDrawer = null;
}

function renderDrawer(todoOrId) {
  const todo = typeof todoOrId === 'number'
    ? state.todos.find(x => x.id === todoOrId)
    : todoOrId;
  if (!todo) return;
  const l = t();

  // Priority bar (uses data-p attribute, not inline style)
  const bar = document.getElementById('drawerPriorityBar');
  bar.removeAttribute('data-p');
  if (todo.priority && todo.priority !== 'none') bar.setAttribute('data-p', todo.priority);

  // Title & desc
  document.getElementById('drawerTitle').value = todo.text;
  document.getElementById('descLabel').textContent  = l.notes;
  document.getElementById('drawerDesc').value       = todo.description || '';
  document.getElementById('drawerDesc').placeholder = l.notes_ph;

  // Priority chips
  document.getElementById('priorityLabel').textContent = l.priority;
  ['none','low','medium','high'].forEach(p => {
    const btn = document.getElementById('dp_' + p);
    if (!btn) return;
    btn.textContent = l[p];
    const isActive = todo.priority === p || (!todo.priority && p === 'none');
    btn.className = 'p-chip' + (isActive ? (p === 'none' ? ' active-none' : ' cur') : '');
  });

  // Time
  document.getElementById('timeLabel').textContent = l.time;
  let timeHTML = `<div class="time-row"><span class="time-badge">${l.created}</span>${absTime(todo.createdAt)}</div>`;
  if (todo.completedAt) {
    timeHTML += `<div class="time-row"><span class="time-badge">${l.completed_at}</span>${absTime(todo.completedAt)}</div>`;
    timeHTML += `<div class="time-row"><span class="time-badge">${l.took}</span>${duration(todo.createdAt, todo.completedAt)}</div>`;
  }
  document.getElementById('timeInfo').innerHTML = timeHTML;

  // Subtasks
  document.getElementById('subtasksLabel').textContent  = l.subtasks;
  document.getElementById('subtaskInput').placeholder   = l.add_sub_ph;
  document.getElementById('aiSplitLabel').textContent   = l.ai_split;
  renderSubtasks(todo);

  // Actions
  document.getElementById('drawerDeleteBtn').textContent = l.delete;
  document.getElementById('drawerSaveBtn').textContent   = l.save;

  // Hide AI preview
  document.getElementById('aiPreview').style.display = 'none';
}

function renderSubtasks(todo) {
  const subs  = todo.subtasks || [];
  const done  = subs.filter(s => s.done).length;
  const count = subs.length;

  document.getElementById('subtaskCount').textContent = count ? `${done}/${count}` : '';

  const wrap = document.getElementById('subProgressWrap');
  if (count > 0) {
    const pct = Math.round(done / count * 100);
    wrap.style.display = '';
    document.getElementById('subProgressFill').style.width  = pct + '%';
    document.getElementById('subProgressLabel').textContent = pct + '%';
  } else {
    wrap.style.display = 'none';
  }

  document.getElementById('subtaskList').innerHTML = subs.map(s => `
    <div class="sub-item${s.done ? ' done-sub' : ''}" data-sid="${s.id}">
      <button class="sub-cb${s.done ? ' ticked' : ''}" data-stoggle="${s.id}">
        <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
          <path d="M1 3.5L3 5.5L8 1" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <span class="sub-text" contenteditable="true" data-sedit="${s.id}">${esc(s.text)}</span>
      <button class="sub-del" data-sdel="${s.id}">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    </div>`).join('');
}

function flushDrawerSave() {
  if (saveDebounce) { clearTimeout(saveDebounce); saveDebounce = null; }
  if (state.activeDrawer === null) return;
  const todo = state.todos.find(x => x.id === state.activeDrawer);
  if (!todo) return;
  const titleEl = document.getElementById('drawerTitle');
  const descEl  = document.getElementById('drawerDesc');
  if (titleEl) todo.text        = titleEl.value.trim() || todo.text;
  if (descEl)  todo.description = descEl.value;
}

function scheduleDrawerSave() {
  if (saveDebounce) clearTimeout(saveDebounce);
  saveDebounce = setTimeout(async () => {
    flushDrawerSave();
    render();
    await apiSave();
  }, 800);
}

// ─── AI Split ─────────────────────────────────────────────────────────────────
async function runAiSplit() {
  const todo = state.todos.find(x => x.id === state.activeDrawer);
  if (!todo) return;
  const btn      = document.getElementById('aiSplitBtn');
  const labelEl  = document.getElementById('aiSplitLabel');
  const preview  = document.getElementById('aiPreview');
  const prevList = document.getElementById('aiPreviewList');

  labelEl.textContent = t().ai_thinking;
  btn.disabled = true;
  preview.style.display = 'none';

  try {
    const data = await apiFetch('/api/ai/split', { title: todo.text, description: todo.description || '' });
    const subs = data.subtasks || [];
    prevList.innerHTML = subs.map((s, i) => `
      <label class="ai-sugg-item">
        <input type="checkbox" checked data-si="${i}"> ${esc(s)}
      </label>`).join('');
    preview.style.display = '';

    document.getElementById('aiApplyBtn').onclick = () => {
      prevList.querySelectorAll('input[type=checkbox]:checked').forEach(cb => {
        const text = subs[parseInt(cb.dataset.si)];
        if (text) todo.subtasks.push({ id: Date.now() + Math.random(), text, done: false });
      });
      preview.style.display = 'none';
      renderSubtasks(todo);
      render();
      apiSave();
    };
    document.getElementById('aiCancelBtn').onclick = () => {
      preview.style.display = 'none';
    };
  } catch {
    prevList.innerHTML = '<p style="font-size:0.8rem;color:var(--red)">Error — try again.</p>';
    preview.style.display = '';
  }

  labelEl.textContent = t().ai_split;
  btn.disabled = false;
}

// ─── AI FAB ───────────────────────────────────────────────────────────────────
function typewrite(el, text) {
  el.textContent = '';
  let i = 0;
  const tick = () => {
    if (i < text.length) {
      el.textContent += text[i++];
      el.scrollTop = el.scrollHeight;
      setTimeout(tick, 14);
    }
  };
  tick();
}

async function runAiAction(action) {
  const resultEl = document.getElementById('aiResult');
  resultEl.style.display = 'block';
  resultEl.innerHTML = '<div class="ai-loading-dots"><div class="ai-d"></div><div class="ai-d"></div><div class="ai-d"></div></div>';
  try {
    const data = await apiFetch('/api/ai/' + action, { todos: state.todos });
    typewrite(resultEl, data.result || 'Done.');
  } catch {
    resultEl.textContent = 'Error — please try again.';
  }
}

function setAiPop(open) {
  state.aiOpen = open;
  document.getElementById('aiFab').setAttribute('aria-expanded', String(open));
  document.getElementById('aiPop').setAttribute('aria-hidden', String(!open));
  document.getElementById('aiPop').classList.toggle('open', open);
  if (!open) {
    const r = document.getElementById('aiResult');
    r.style.display = 'none';
    r.textContent = '';
  }
}

// ─── Boot ─────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {

  // Theme
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) applyTheme(savedTheme);

  // Language
  const savedLang = state.lang;
  document.documentElement.lang = savedLang;
  document.documentElement.dir  = savedLang === 'he' ? 'rtl' : 'ltr';
  document.querySelectorAll('.lang-btn').forEach(b =>
    b.classList.toggle('active', b.dataset.lang === savedLang)
  );

  // Skeleton while loading
  document.getElementById('taskList').innerHTML = skeletonHTML();

  // Load todos
  const raw = await apiLoad();
  state.todos = raw.map(migrateTodo);
  render();

  // ── Add form ──────────────────────────────────────────────────────────────
  document.getElementById('addForm').addEventListener('submit', async e => {
    e.preventDefault();
    const inp = document.getElementById('addInput');
    await addTodo(inp.value);
    inp.value = '';
    inp.focus();
  });

  // ── Priority picker ───────────────────────────────────────────────────────
  const pColors = { high: 'var(--p-high)', medium: 'var(--p-med)', low: 'var(--p-low)', none: 'var(--p-none)' };

  document.getElementById('priorityTrigger').addEventListener('click', e => {
    e.stopPropagation();
    const drop = document.getElementById('pDropdown');
    drop.style.display = drop.style.display === 'none' ? '' : 'none';
  });

  document.getElementById('pDropdown').addEventListener('click', e => {
    const opt = e.target.closest('[data-p]');
    if (!opt) return;
    state.newPriority = opt.dataset.p;
    document.getElementById('pIndicator').style.background = pColors[opt.dataset.p] || '';
    document.getElementById('pDropdown').style.display = 'none';
  });

  document.addEventListener('click', e => {
    if (!e.target.closest('#priorityTrigger') && !e.target.closest('#pDropdown'))
      document.getElementById('pDropdown').style.display = 'none';
  });

  // ── Filters ───────────────────────────────────────────────────────────────
  document.querySelectorAll('.filter-btn').forEach(b =>
    b.addEventListener('click', () => setFilter(b.dataset.filter))
  );

  // ── Language toggle ───────────────────────────────────────────────────────
  document.querySelectorAll('.lang-btn').forEach(b =>
    b.addEventListener('click', () => setLang(b.dataset.lang))
  );

  // ── Theme ─────────────────────────────────────────────────────────────────
  document.getElementById('themeBtn').addEventListener('click', toggleTheme);

  // ── Task list delegation ──────────────────────────────────────────────────
  document.getElementById('taskList').addEventListener('click', async e => {
    const checkBtn = e.target.closest('[data-check]');
    if (checkBtn) {
      e.stopPropagation();
      await toggleTodo(parseInt(checkBtn.dataset.check), checkBtn);
      return;
    }
    const card = e.target.closest('.task-card');
    if (card) openDrawer(parseInt(card.dataset.id));
  });

  document.getElementById('taskList').addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      const card = e.target.closest('.task-card');
      if (card) { e.preventDefault(); openDrawer(parseInt(card.dataset.id)); }
    }
  });

  // ── Clear done ────────────────────────────────────────────────────────────
  document.getElementById('clearDoneBtn').addEventListener('click', async () => {
    state.todos = state.todos.filter(x => !x.done);
    render();
    await apiSave();
  });

  // ── Drawer ────────────────────────────────────────────────────────────────
  document.getElementById('overlay').addEventListener('click', e => {
    if (e.target === document.getElementById('overlay')) closeDrawer();
  });

  document.getElementById('drawerClose').addEventListener('click', closeDrawer);

  document.getElementById('drawerTitle').addEventListener('input', scheduleDrawerSave);
  document.getElementById('drawerDesc').addEventListener('input', scheduleDrawerSave);

  // Priority chips
  ['none','low','medium','high'].forEach(p => {
    document.getElementById('dp_' + p).addEventListener('click', async () => {
      const todo = state.todos.find(x => x.id === state.activeDrawer);
      if (!todo) return;
      todo.priority = p;
      renderDrawer(todo);
      render();
      await apiSave();
    });
  });

  // Save button
  document.getElementById('drawerSaveBtn').addEventListener('click', async () => {
    flushDrawerSave();
    render();
    await apiSave();
    closeDrawer();
  });

  // Delete button
  document.getElementById('drawerDeleteBtn').addEventListener('click', async () => {
    if (!confirm(t().confirm_delete)) return;
    const id = state.activeDrawer;
    closeDrawer();
    state.todos = state.todos.filter(x => x.id !== id);
    render();
    await apiSave();
  });

  // ── Subtask add ───────────────────────────────────────────────────────────
  async function addSubtask() {
    const inp  = document.getElementById('subtaskInput');
    const text = inp.value.trim();
    if (!text || state.activeDrawer === null) return;
    const todo = state.todos.find(x => x.id === state.activeDrawer);
    if (!todo) return;
    todo.subtasks.push({ id: Date.now(), text, done: false });
    inp.value = '';
    renderSubtasks(todo);
    render();
    await apiSave();
  }

  document.getElementById('subtaskAddBtn').addEventListener('click', addSubtask);
  document.getElementById('subtaskInput').addEventListener('keydown', e => {
    if (e.key === 'Enter') { e.preventDefault(); addSubtask(); }
  });

  // Subtask list delegation
  document.getElementById('subtaskList').addEventListener('click', async e => {
    const todo = state.todos.find(x => x.id === state.activeDrawer);
    if (!todo) return;

    const toggleBtn = e.target.closest('[data-stoggle]');
    if (toggleBtn) {
      const sid = parseFloat(toggleBtn.dataset.stoggle);
      const sub = todo.subtasks.find(s => s.id === sid);
      if (sub) { sub.done = !sub.done; renderSubtasks(todo); render(); await apiSave(); }
      return;
    }

    const delBtn = e.target.closest('[data-sdel]');
    if (delBtn) {
      const sid = parseFloat(delBtn.dataset.sdel);
      todo.subtasks = todo.subtasks.filter(s => s.id !== sid);
      renderSubtasks(todo); render(); await apiSave();
    }
  }, true);

  // Subtask inline text edit
  document.getElementById('subtaskList').addEventListener('blur', async e => {
    const el = e.target.closest('[data-sedit]');
    if (!el) return;
    const todo = state.todos.find(x => x.id === state.activeDrawer);
    if (!todo) return;
    const sid = parseFloat(el.dataset.sedit);
    const sub = todo.subtasks.find(s => s.id === sid);
    if (sub) { sub.text = el.textContent.trim() || sub.text; render(); await apiSave(); }
  }, true);

  // ── AI Split ──────────────────────────────────────────────────────────────
  document.getElementById('aiSplitBtn').addEventListener('click', runAiSplit);

  // ── AI FAB ────────────────────────────────────────────────────────────────
  document.getElementById('aiFab').addEventListener('click', e => {
    e.stopPropagation();
    setAiPop(!state.aiOpen);
  });

  document.getElementById('aiPopClose').addEventListener('click', () => setAiPop(false));

  document.addEventListener('click', e => {
    if (!e.target.closest('#aiFab') && !e.target.closest('#aiPop'))
      setAiPop(false);
  });

  document.getElementById('aiSuggestBtn').addEventListener('click', () => runAiAction('suggest'));
  document.getElementById('aiSummaryBtn').addEventListener('click', () => runAiAction('summary'));

  // ── Escape key ────────────────────────────────────────────────────────────
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      if (state.activeDrawer !== null) closeDrawer();
      else setAiPop(false);
    }
  });
});
