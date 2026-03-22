'use strict';

// ─── State ───────────────────────────────────────────────────────────────────
const state = {
  todos: [],
  filter: 'all',
  lang: 'en',
  theme: 'auto',
  newPriority: 'none',
  activeModal: null,
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
    empty_all: 'No tasks yet', empty_all_sub: 'Add something above to get started.',
    empty_active: 'All done!', empty_active_sub: 'Everything is checked off.',
    empty_done: 'Nothing completed yet', empty_done_sub: 'Complete a task to see it here.',
    subtasks: 'Sub-tasks', add_subtask: 'Add sub-task', add_sub_ph: 'Sub-task title…',
    priority: 'Priority', high: 'High', medium: 'Medium', low: 'Low', none: 'None',
    description: 'Notes', desc_ph: 'Add notes…',
    created: 'Created', completed_at: 'Completed',
    took: 'Took', ago: 'ago', just_now: 'just now',
    delete: 'Delete task', close: 'Close',
    ai_title: 'AI Assistant', ai_suggest: 'Suggest Next Task',
    ai_suggest_desc: 'AI picks what to tackle next',
    ai_summary: 'Daily Summary', ai_summary_desc: 'Overview of today\'s progress',
    ai_split: 'Split with AI', ai_split_apply: 'Apply selected',
    ai_thinking: 'Thinking…', ai_empty: 'Add some tasks first.',
    sign_out: 'Sign out',
    confirm_delete: 'Delete this task?',
    save: 'Save',
  },
  he: {
    title: 'המשימות שלי', date_locale: 'he-IL',
    placeholder: 'מה צריך לעשות?',
    add: 'הוסף', all: 'הכל', active: 'פעיל', done: 'הושלם',
    remaining: n => `נותרו ${n} משימות`,
    completed: n => `${n} הושלמו`,
    clear: 'נקה שהושלמו',
    empty_all: 'אין משימות עדיין', empty_all_sub: 'הוסף משימה למעלה כדי להתחיל.',
    empty_active: 'הכל הושלם!', empty_active_sub: 'כל המשימות מסומנות.',
    empty_done: 'עדיין לא הושלם כלום', empty_done_sub: 'השלם משימה כדי לראות אותה כאן.',
    subtasks: 'תתי-משימות', add_subtask: 'הוסף תת-משימה', add_sub_ph: 'כותרת תת-משימה…',
    priority: 'עדיפות', high: 'גבוהה', medium: 'בינונית', low: 'נמוכה', none: 'ללא',
    description: 'הערות', desc_ph: 'הוסף הערות…',
    created: 'נוצר', completed_at: 'הושלם',
    took: 'לקח', ago: 'לפני', just_now: 'עכשיו',
    delete: 'מחק משימה', close: 'סגור',
    ai_title: 'עוזר AI', ai_suggest: 'הצע משימה הבאה',
    ai_suggest_desc: 'AI בוחר מה לטפל בו הבא',
    ai_summary: 'סיכום יומי', ai_summary_desc: 'סקירה של ההתקדמות של היום',
    ai_split: 'פצל עם AI', ai_split_apply: 'הוסף שנבחרו',
    ai_thinking: 'חושב…', ai_empty: 'הוסף קודם כמה משימות.',
    sign_out: 'התנתק',
    confirm_delete: 'למחוק את המשימה?',
    save: 'שמור',
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
    body: JSON.stringify(state.todos)
  });
}

async function aiSuggest(action) {
  const r = await fetch('/api/ai/' + action, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ todos: state.todos })
  });
  if (!r.ok) throw new Error('AI error');
  return r.json();
}

async function aiSplitTask(todo) {
  const r = await fetch('/api/ai/split', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: todo.text, description: todo.description || '' })
  });
  if (!r.ok) throw new Error('AI error');
  return r.json();
}

// ─── Confetti ─────────────────────────────────────────────────────────────────
function burst(x, y) {
  const colors = ['#2563EB','#7C3AED','#16A34A','#F97316','#EF4444','#FBBF24'];
  for (let i = 0; i < 12; i++) {
    const el = document.createElement('div');
    el.className = 'confetti-particle';
    el.style.cssText = `left:${x}px;top:${y}px;background:${colors[i%colors.length]};
      transform-origin:center;
      --tx:${(Math.random()-0.5)*80}px;--ty:${-(Math.random()*60+20)}px;`;
    el.style.animation = `confettiFall 0.9s ease-out forwards`;
    el.addEventListener('animationend', () => el.remove());
    document.body.appendChild(el);
    el.animate([
      { transform: 'translate(0,0) rotate(0deg)', opacity: 1 },
      { transform: `translate(${(Math.random()-0.5)*80}px,${-(Math.random()*70+20)}px) rotate(${Math.random()*360}deg)`, opacity: 0 }
    ], { duration: 900, easing: 'cubic-bezier(0,0,0.2,1)', fill: 'forwards' });
  }
}

// ─── Render helpers ───────────────────────────────────────────────────────────
function esc(s) {
  return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function subtaskProgress(todo) {
  if (!todo.subtasks || !todo.subtasks.length) return '';
  const done = todo.subtasks.filter(s => s.done).length;
  const pct = Math.round(done / todo.subtasks.length * 100);
  return `<div class="subtask-progress">
    <div class="subtask-track"><div class="subtask-fill" style="width:${pct}%"></div></div>
    <span class="subtask-label">${done}/${todo.subtasks.length}</span>
  </div>`;
}

function taskCardHTML(todo) {
  const l = t();
  const dur = todo.done && todo.completedAt ? duration(todo.createdAt, todo.completedAt) : '';
  const tags = (todo.tags || []).map(tag => `<span class="tag-pill">${esc(tag)}</span>`).join('');
  return `
  <div class="task-card" data-id="${todo.id}" data-priority="${todo.priority||'none'}" role="button" tabindex="0" aria-label="${esc(todo.text)}">
    <div class="task-card-inner">
      <button class="task-check ${todo.done?'checked':''}" data-check="${todo.id}" aria-label="Toggle complete">
        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
          <path d="M1 4L3.5 6.5L9 1" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <div class="task-body">
        <div class="task-title">${esc(todo.text)}</div>
        <div class="task-meta">
          <span class="task-time">${relativeTime(todo.createdAt)}</span>
          ${dur ? `<span class="task-duration">${l.took} ${dur}</span>` : ''}
          ${tags}
        </div>
        ${subtaskProgress(todo)}
      </div>
    </div>
  </div>`;
}

function skeletonHTML() {
  return Array(3).fill(0).map((_,i) => `
    <div class="skeleton" style="animation-delay:${i*0.08}s">
      <div class="skeleton-line" style="width:${[70,50,85][i]}%;margin-block-end:8px"></div>
      <div class="skeleton-line" style="width:30%"></div>
    </div>`).join('');
}

// ─── Main render ─────────────────────────────────────────────────────────────
function render() {
  const l = t();
  const visible = state.todos.filter(todo =>
    state.filter === 'all' ||
    (state.filter === 'done' ? todo.done : !todo.done)
  );

  // Hero title + date
  document.getElementById('hero-title').textContent = l.title;
  document.getElementById('hero-date').textContent = new Date().toLocaleDateString(
    l.date_locale, { weekday:'long', year:'numeric', month:'long', day:'numeric' }
  );

  // Filters
  document.getElementById('fAll').textContent    = l.all;
  document.getElementById('fActive').textContent = l.active;
  document.getElementById('fDone').textContent   = l.done;

  // Add form
  document.getElementById('addInput').placeholder = l.placeholder;
  document.getElementById('addSubmit').textContent = l.add;

  // Stats
  const doneCount = state.todos.filter(x => x.done).length;
  const pct = state.todos.length ? Math.round(doneCount / state.todos.length * 100) : 0;
  document.getElementById('progFill').style.width = pct + '%';
  document.getElementById('progPct').textContent  = pct + '%';
  document.getElementById('statsText').textContent = l.remaining(state.todos.length - doneCount) + ' · ' + l.completed(doneCount);
  document.getElementById('clearDoneBtn').textContent = l.clear;

  // Task list
  const listEl = document.getElementById('taskList');
  if (!visible.length) {
    const [title, sub] = {
      all:    [l.empty_all,    l.empty_all_sub],
      active: [l.empty_active, l.empty_active_sub],
      done:   [l.empty_done,   l.empty_done_sub],
    }[state.filter];
    listEl.innerHTML = `<div class="empty-state">
      <div class="empty-icon">${state.filter === 'done' ? '🎉' : '✦'}</div>
      <div class="empty-title">${title}</div>
      <div class="empty-sub">${sub}</div>
    </div>`;
  } else {
    listEl.innerHTML = visible.map(taskCardHTML).join('');
    // Stagger entrance animation
    listEl.querySelectorAll('.task-card').forEach((el, i) => {
      el.style.transitionDelay = `${i * 0.04}s`;
      requestAnimationFrame(() => el.classList.add('visible'));
    });
  }

  // AI popover texts
  document.getElementById('aiPopTitle').textContent   = l.ai_title;
  document.getElementById('aiSuggestTitle').textContent = l.ai_suggest;
  document.getElementById('aiSuggestDesc').textContent  = l.ai_suggest_desc;
  document.getElementById('aiSummaryTitle').textContent = l.ai_summary;
  document.getElementById('aiSummaryDesc').textContent  = l.ai_summary_desc;
  document.getElementById('logoutBtnNav').textContent = l.sign_out;
}

// ─── Toggle complete ──────────────────────────────────────────────────────────
async function toggleTodo(id, checkEl) {
  const todo = state.todos.find(t => t.id === id);
  if (!todo) return;
  todo.done = !todo.done;
  todo.completedAt = todo.done ? Date.now() : null;
  if (todo.done) {
    const rect = checkEl.getBoundingClientRect();
    burst(rect.left + rect.width/2, rect.top + rect.height/2);
  }
  render();
  await apiSave();
}

// ─── Add task ─────────────────────────────────────────────────────────────────
async function addTodo(text) {
  if (!text.trim()) return;
  state.todos.unshift({
    id: Date.now(),
    text: text.trim(),
    done: false,
    priority: state.newPriority,
    description: '',
    tags: [],
    subtasks: [],
    createdAt: Date.now(),
    completedAt: null,
  });
  state.newPriority = 'none';
  document.querySelector('.priority-dot').style.background = '';
  document.querySelector('.priority-pick').dataset.p = 'none';
  render();
  await apiSave();
}

// ─── Delete task ──────────────────────────────────────────────────────────────
async function deleteTodo(id) {
  state.todos = state.todos.filter(t => t.id !== id);
  render();
  await apiSave();
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
function setLang(l) {
  state.lang = l;
  document.documentElement.lang = l;
  document.documentElement.dir  = l === 'he' ? 'rtl' : 'ltr';
  document.querySelectorAll('.lang-btn').forEach((b,i) =>
    b.classList.toggle('active', (i===0 && l==='en') || (i===1 && l==='he'))
  );
  if (state.activeModal) renderModal(state.activeModal);
  render();
}

// ─── Theme ───────────────────────────────────────────────────────────────────
function toggleTheme() {
  const isDark = document.documentElement.dataset.theme === 'dark' ||
    (!document.documentElement.dataset.theme && window.matchMedia('(prefers-color-scheme:dark)').matches);
  document.documentElement.dataset.theme = isDark ? 'light' : 'dark';
  document.getElementById('themeBtn').textContent = isDark ? '🌙' : '☀️';
  localStorage.setItem('theme', document.documentElement.dataset.theme);
}

// ─── Modal ────────────────────────────────────────────────────────────────────
function openModal(id) {
  const todo = state.todos.find(t => t.id === id);
  if (!todo) return;
  state.activeModal = id;
  renderModal(todo);
  document.getElementById('modalOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
  document.body.style.overflow = '';
  state.activeModal = null;
}

function renderModal(todoOrId) {
  const todo = typeof todoOrId === 'number' ? state.todos.find(t => t.id === todoOrId) : todoOrId;
  if (!todo) return;
  const l = t();

  // Title
  document.getElementById('modalTitleInput').value = todo.text;

  // Description
  document.getElementById('modalDesc').value = todo.description || '';
  document.getElementById('modalDesc').placeholder = l.desc_ph;
  document.getElementById('modalDescLabel').textContent = l.description;

  // Meta chips
  document.getElementById('modalCreated').textContent = l.created + ': ' + absTime(todo.createdAt);
  const compEl = document.getElementById('modalCompleted');
  compEl.textContent = todo.completedAt ? l.completed_at + ': ' + absTime(todo.completedAt) : '';
  compEl.style.display = todo.completedAt ? '' : 'none';

  const durEl = document.getElementById('modalDuration');
  if (todo.done && todo.completedAt) {
    durEl.textContent = l.took + ': ' + duration(todo.createdAt, todo.completedAt);
    durEl.style.display = '';
  } else { durEl.style.display = 'none'; }

  // Priority
  document.getElementById('pLabel').textContent = l.priority;
  ['high','medium','low','none'].forEach(p => {
    const btn = document.getElementById('pBtn_' + p);
    btn.textContent = l[p];
    btn.className = 'p-btn' + (todo.priority === p ? ` active-${p}` : '');
  });

  // Sub-tasks
  document.getElementById('subtaskLabel').textContent = l.subtasks;
  document.getElementById('subtaskAddInput').placeholder = l.add_sub_ph;
  document.getElementById('subtaskAddBtn').textContent = '+';
  document.getElementById('aiSplitBtn').innerHTML =
    `<span class="ai-badge">AI</span> ${l.ai_split}`;
  renderSubtasks(todo);

  // Actions
  document.getElementById('modalDeleteBtn').textContent = l.delete;
  document.getElementById('modalCloseBtn').title = l.close;
  document.getElementById('modalSaveBtn').textContent = l.save;
}

function renderSubtasks(todo) {
  const list = document.getElementById('subtaskList');
  if (!todo.subtasks || !todo.subtasks.length) {
    list.innerHTML = '';
    return;
  }
  list.innerHTML = todo.subtasks.map(s => `
    <div class="subtask-item ${s.done?'done':''}" data-sid="${s.id}">
      <button class="subtask-check ${s.done?'checked':''}" data-stoggle="${s.id}">
        <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
          <path d="M1 3.5L3 5.5L8 1" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <span class="subtask-text" contenteditable="true" data-sedit="${s.id}">${esc(s.text)}</span>
      <button class="subtask-del" data-sdel="${s.id}">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    </div>`).join('');
}

function saveModalChanges() {
  const todo = state.todos.find(t => t.id === state.activeModal);
  if (!todo) return;
  todo.text        = document.getElementById('modalTitleInput').value.trim() || todo.text;
  todo.description = document.getElementById('modalDesc').value;
}

// ─── AI features ─────────────────────────────────────────────────────────────
async function runAiAction(action) {
  const responseEl = document.getElementById('aiResponse');
  responseEl.style.display = 'block';
  responseEl.innerHTML = `<div class="ai-loading"><div class="ai-dot"></div><div class="ai-dot"></div><div class="ai-dot"></div></div>`;
  try {
    const data = await aiSuggest(action);
    typewrite(responseEl, data.result || data.message || 'Done.');
  } catch {
    responseEl.textContent = 'Error — please try again.';
  }
}

function typewrite(el, text) {
  el.textContent = '';
  let i = 0;
  const tick = () => {
    if (i < text.length) {
      el.textContent += text[i++];
      el.scrollTop = el.scrollHeight;
      setTimeout(tick, 12);
    }
  };
  tick();
}

async function runAiSplit() {
  const todo = state.todos.find(t => t.id === state.activeModal);
  if (!todo) return;
  const btn = document.getElementById('aiSplitBtn');
  const orig = btn.innerHTML;
  btn.textContent = t().ai_thinking;
  btn.disabled = true;
  const sugBox = document.getElementById('aiSuggestBox');
  sugBox.innerHTML = `<div class="ai-loading"><div class="ai-dot"></div><div class="ai-dot"></div><div class="ai-dot"></div></div>`;
  try {
    const data = await aiSplitTask(todo);
    const subs = data.subtasks || [];
    sugBox.innerHTML = `<div class="ai-suggestions">
      ${subs.map((s,i) => `<label class="ai-suggestion-item">
        <input type="checkbox" checked data-si="${i}" value="${esc(s)}"> ${esc(s)}
      </label>`).join('')}
    </div>
    <button class="ai-apply-btn" id="aiApplyBtn">${t().ai_split_apply}</button>`;
    document.getElementById('aiApplyBtn').onclick = () => applyAiSubs(subs);
  } catch {
    sugBox.innerHTML = '<p style="font-size:0.8rem;color:var(--red)">Error — try again.</p>';
  }
  btn.innerHTML = orig;
  btn.disabled = false;
}

function applyAiSubs(subs) {
  const todo = state.todos.find(t => t.id === state.activeModal);
  if (!todo) return;
  const checked = document.querySelectorAll('#aiSuggestBox input[type=checkbox]:checked');
  checked.forEach(cb => {
    const text = subs[parseInt(cb.dataset.si)] || cb.value;
    if (!todo.subtasks) todo.subtasks = [];
    todo.subtasks.push({ id: Date.now() + Math.random(), text, done: false });
  });
  renderSubtasks(todo);
  document.getElementById('aiSuggestBox').innerHTML = '';
  render();
  apiSave();
}

// ─── Intersection observer for scroll animations ──────────────────────────────
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });

// ─── Event wiring ─────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
  // Load saved theme
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) document.documentElement.dataset.theme = savedTheme;

  // Show skeleton
  document.getElementById('taskList').innerHTML = skeletonHTML();

  state.todos = await apiLoad();
  render();

  // Add form
  document.getElementById('addForm').addEventListener('submit', async e => {
    e.preventDefault();
    const inp = document.getElementById('addInput');
    await addTodo(inp.value);
    inp.value = '';
    inp.focus();
  });

  // Filters
  document.querySelectorAll('.filter-btn').forEach(b => {
    b.addEventListener('click', () => setFilter(b.dataset.filter));
  });

  // Lang toggle
  document.querySelectorAll('.lang-btn').forEach((b, i) => {
    b.addEventListener('click', () => setLang(i === 0 ? 'en' : 'he'));
  });

  // Theme
  document.getElementById('themeBtn').addEventListener('click', toggleTheme);

  // Task list delegation
  document.getElementById('taskList').addEventListener('click', async e => {
    const checkBtn = e.target.closest('[data-check]');
    if (checkBtn) {
      e.stopPropagation();
      await toggleTodo(parseInt(checkBtn.dataset.check), checkBtn);
      return;
    }
    const card = e.target.closest('.task-card');
    if (card) openModal(parseInt(card.dataset.id));
  });

  document.getElementById('taskList').addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      const card = e.target.closest('.task-card');
      if (card) { e.preventDefault(); openModal(parseInt(card.dataset.id)); }
    }
  });

  // Priority picker
  const priorityPick = document.querySelector('.priority-pick');
  const priorityColors = { high: 'var(--p-high)', medium: 'var(--p-med)', low: 'var(--p-low)', none: 'var(--p-none)' };
  document.getElementById('priorityPopover').querySelectorAll('.priority-opt').forEach(opt => {
    opt.addEventListener('click', () => {
      state.newPriority = opt.dataset.p;
      priorityPick.dataset.p = opt.dataset.p;
      priorityPick.querySelector('.priority-dot').style.background = priorityColors[opt.dataset.p] || '';
      document.getElementById('priorityPopover').style.display = 'none';
    });
  });
  priorityPick.addEventListener('click', e => {
    e.stopPropagation();
    const pop = document.getElementById('priorityPopover');
    pop.style.display = pop.style.display === 'block' ? 'none' : 'block';
  });
  document.addEventListener('click', () => {
    document.getElementById('priorityPopover').style.display = 'none';
  });

  // Clear done
  document.getElementById('clearDoneBtn').addEventListener('click', async () => {
    state.todos = state.todos.filter(x => !x.done);
    render(); await apiSave();
  });

  // Modal overlay click-outside
  document.getElementById('modalOverlay').addEventListener('click', e => {
    if (e.target === document.getElementById('modalOverlay')) closeModal();
  });
  document.getElementById('modalCloseBtn').addEventListener('click', closeModal);

  // Modal save
  document.getElementById('modalSaveBtn').addEventListener('click', async () => {
    saveModalChanges(); render(); await apiSave(); closeModal();
  });

  // Modal delete
  document.getElementById('modalDeleteBtn').addEventListener('click', async () => {
    if (!confirm(t().confirm_delete)) return;
    await deleteTodo(state.activeModal);
    closeModal();
  });

  // Modal priority buttons
  ['high','medium','low','none'].forEach(p => {
    document.getElementById('pBtn_' + p).addEventListener('click', async () => {
      const todo = state.todos.find(x => x.id === state.activeModal);
      if (todo) { todo.priority = p; renderModal(todo); render(); await apiSave(); }
    });
  });

  // Modal title edit
  document.getElementById('modalTitleInput').addEventListener('blur', () => saveModalChanges());
  document.getElementById('modalDesc').addEventListener('blur', () => saveModalChanges());

  // Subtask add
  document.getElementById('subtaskAddBtn').addEventListener('click', async () => {
    const inp = document.getElementById('subtaskAddInput');
    const text = inp.value.trim();
    if (!text) return;
    const todo = state.todos.find(x => x.id === state.activeModal);
    if (!todo) return;
    if (!todo.subtasks) todo.subtasks = [];
    todo.subtasks.push({ id: Date.now(), text, done: false });
    inp.value = '';
    renderSubtasks(todo); render(); await apiSave();
  });
  document.getElementById('subtaskAddInput').addEventListener('keydown', async e => {
    if (e.key === 'Enter') { e.preventDefault(); document.getElementById('subtaskAddBtn').click(); }
  });

  // Subtask delegation
  document.getElementById('subtaskList').addEventListener('click', async e => {
    const todo = state.todos.find(x => x.id === state.activeModal);
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
  });

  // Subtask text edit
  document.getElementById('subtaskList').addEventListener('blur', async e => {
    const el = e.target.closest('[data-sedit]');
    if (!el) return;
    const todo = state.todos.find(x => x.id === state.activeModal);
    if (!todo) return;
    const sid = parseFloat(el.dataset.sedit);
    const sub = todo.subtasks.find(s => s.id === sid);
    if (sub) { sub.text = el.textContent.trim() || sub.text; render(); await apiSave(); }
  }, true);

  // AI Split
  document.getElementById('aiSplitBtn').addEventListener('click', runAiSplit);

  // AI FAB
  document.getElementById('aiFab').addEventListener('click', e => {
    e.stopPropagation();
    state.aiOpen = !state.aiOpen;
    document.getElementById('aiPopover').classList.toggle('open', state.aiOpen);
    if (!state.aiOpen) document.getElementById('aiResponse').style.display = 'none';
  });
  document.addEventListener('click', e => {
    if (!e.target.closest('#aiFab') && !e.target.closest('#aiPopover')) {
      state.aiOpen = false;
      document.getElementById('aiPopover').classList.remove('open');
    }
  });
  document.getElementById('aiSuggestBtn').addEventListener('click', () => runAiAction('suggest'));
  document.getElementById('aiSummaryBtn').addEventListener('click', () => runAiAction('summary'));

  // Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { closeModal(); state.aiOpen = false; document.getElementById('aiPopover').classList.remove('open'); }
  });
});
