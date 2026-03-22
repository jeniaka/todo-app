import json
import os
import mimetypes
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse

STATIC_DIR = os.path.join(os.path.dirname(__file__), "static")

MANIFEST = json.dumps({
    "name": "My Tasks",
    "short_name": "Tasks",
    "description": "A vibrant to-do app with Hebrew support",
    "start_url": "/",
    "display": "standalone",
    "background_color": "#0a0015",
    "theme_color": "#0a0015",
    "orientation": "portrait",
    "icons": [
        {"src": "/static/icon-192.png", "sizes": "192x192", "type": "image/png", "purpose": "any maskable"},
        {"src": "/static/icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any maskable"}
    ]
}).encode()

SERVICE_WORKER = b"""
const CACHE = 'todo-v1';
const ASSETS = ['/'];
self.addEventListener('install', e => e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS))));
self.addEventListener('fetch', e => {
  if (e.request.url.includes('/api/')) return;
  e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
});
"""

PORT = int(os.environ.get("PORT", 8090))
MONGODB_URI = os.environ.get("MONGODB_URI", "")
DATA_FILE = os.path.join(os.path.dirname(__file__), "todos.json")

# Try to connect to MongoDB if URI is provided
db_collection = None
if MONGODB_URI:
    try:
        from pymongo import MongoClient
        import certifi
        client = MongoClient(MONGODB_URI, tlsCAFile=certifi.where())
        db_collection = client["tododb"]["todos"]
        print("Connected to MongoDB Atlas")
    except Exception as e:
        print(f"MongoDB connection failed, using local file: {e}")


def load_todos():
    if db_collection is not None:
        doc = db_collection.find_one({"_id": "todos"})
        return doc["data"] if doc else []
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, "r") as f:
            return json.load(f)
    return []


def save_todos(data):
    if db_collection is not None:
        db_collection.replace_one({"_id": "todos"}, {"_id": "todos", "data": data}, upsert=True)
        return
    with open(DATA_FILE, "w") as f:
        json.dump(data, f, indent=2)


HTML = """<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover"/>
  <meta name="mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  <meta name="theme-color" content="#0a0015">
  <link rel="manifest" href="/manifest.json">
  <link rel="apple-touch-icon" href="/static/icon-192.png">
  <title>My Tasks</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --accent: #007AFF;
      --accent2: #BF5AF2;
      --accent3: #FF375F;
      --green: #30D158;
      --card-bg: rgba(255,255,255,0.10);
      --card-border: rgba(255,255,255,0.18);
      --text: #fff;
      --text-sub: rgba(255,255,255,0.55);
      --text-muted: rgba(255,255,255,0.30);
      --blur: blur(28px);
      --safe-top: env(safe-area-inset-top, 0px);
      --safe-bottom: env(safe-area-inset-bottom, 0px);
    }

    html { height: 100%; }

    body {
      font-family: 'Heebo', -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
      min-height: 100%;
      min-height: 100dvh;
      display: flex;
      justify-content: center;
      background: #0a0015;
      overflow-x: hidden;
      padding: calc(40px + var(--safe-top)) 16px calc(40px + var(--safe-bottom));
    }

    body::before {
      content: '';
      position: fixed;
      inset: 0;
      background:
        radial-gradient(ellipse 80% 60% at 20% 10%, rgba(120,40,200,0.55) 0%, transparent 60%),
        radial-gradient(ellipse 60% 50% at 80% 20%, rgba(0,122,255,0.45) 0%, transparent 55%),
        radial-gradient(ellipse 70% 60% at 60% 80%, rgba(255,55,95,0.35) 0%, transparent 60%),
        radial-gradient(ellipse 50% 40% at 10% 80%, rgba(48,209,88,0.25) 0%, transparent 50%);
      z-index: 0;
      animation: bgShift 12s ease-in-out infinite alternate;
    }
    @keyframes bgShift {
      0%   { filter: hue-rotate(0deg) brightness(1); }
      100% { filter: hue-rotate(25deg) brightness(1.1); }
    }

    .app {
      position: relative;
      z-index: 1;
      width: 100%;
      max-width: 580px;
    }

    /* ── Header ── */
    .header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      margin-bottom: 28px;
      gap: 12px;
    }
    h1 {
      font-size: clamp(1.8rem, 6vw, 2.6rem);
      font-weight: 800;
      letter-spacing: -1.5px;
      line-height: 1;
      background: linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.7) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .subtitle {
      color: var(--text-sub);
      font-size: clamp(0.75rem, 2.5vw, 0.88rem);
      font-weight: 400;
      margin-top: 6px;
    }

    /* ── Language Toggle ── */
    .lang-toggle {
      display: flex;
      align-items: center;
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 20px;
      padding: 4px;
      backdrop-filter: var(--blur);
      -webkit-backdrop-filter: var(--blur);
      gap: 2px;
      flex-shrink: 0;
      margin-top: 4px;
    }
    .lang-toggle button {
      padding: 7px 14px;
      border-radius: 16px;
      border: none;
      background: transparent;
      color: var(--text-sub);
      font-size: 0.8rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.25s cubic-bezier(0.34,1.56,0.64,1);
      font-family: inherit;
      -webkit-tap-highlight-color: transparent;
      touch-action: manipulation;
    }
    .lang-toggle button.active {
      background: rgba(255,255,255,0.18);
      color: #fff;
      box-shadow: 0 2px 8px rgba(0,0,0,0.25);
    }

    /* ── Progress bar ── */
    .progress-wrap {
      background: rgba(255,255,255,0.08);
      border-radius: 99px;
      height: 5px;
      margin-bottom: 24px;
      overflow: hidden;
    }
    .progress-bar {
      height: 100%;
      border-radius: 99px;
      background: linear-gradient(90deg, var(--accent), var(--accent2));
      transition: width 0.5s cubic-bezier(0.34,1.1,0.64,1);
      box-shadow: 0 0 10px rgba(0,122,255,0.6);
    }

    /* ── Add form ── */
    .add-form {
      display: flex;
      gap: 10px;
      margin-bottom: 18px;
    }
    .add-form input {
      flex: 1;
      min-width: 0;
      padding: 15px 18px;
      border-radius: 16px;
      border: 1.5px solid var(--card-border);
      background: var(--card-bg);
      backdrop-filter: var(--blur);
      -webkit-backdrop-filter: var(--blur);
      color: #fff;
      font-size: 16px; /* prevents iOS zoom */
      font-family: inherit;
      font-weight: 400;
      outline: none;
      transition: border-color 0.2s, box-shadow 0.2s;
      -webkit-appearance: none;
    }
    .add-form input::placeholder { color: var(--text-muted); }
    .add-form input:focus {
      border-color: rgba(0,122,255,0.7);
      box-shadow: 0 0 0 3px rgba(0,122,255,0.18);
    }
    .add-form button {
      padding: 15px 20px;
      border-radius: 16px;
      border: none;
      background: linear-gradient(135deg, #007AFF, #5E5CE6);
      color: #fff;
      font-size: 0.95rem;
      font-weight: 700;
      font-family: inherit;
      cursor: pointer;
      transition: transform 0.15s, box-shadow 0.15s, filter 0.15s;
      box-shadow: 0 4px 20px rgba(0,122,255,0.45);
      white-space: nowrap;
      -webkit-tap-highlight-color: transparent;
      touch-action: manipulation;
      flex-shrink: 0;
    }
    @media (hover: hover) {
      .add-form button:hover {
        transform: translateY(-2px) scale(1.03);
        box-shadow: 0 8px 28px rgba(0,122,255,0.55);
        filter: brightness(1.1);
      }
    }
    .add-form button:active { transform: scale(0.96); }

    /* ── Filters ── */
    .filters {
      display: flex;
      gap: 8px;
      margin-bottom: 16px;
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
      scrollbar-width: none;
      padding-bottom: 2px;
    }
    .filters::-webkit-scrollbar { display: none; }
    .filters button {
      padding: 9px 18px;
      border-radius: 20px;
      border: 1.5px solid var(--card-border);
      background: var(--card-bg);
      backdrop-filter: var(--blur);
      -webkit-backdrop-filter: var(--blur);
      color: var(--text-sub);
      font-size: 0.82rem;
      font-weight: 600;
      font-family: inherit;
      cursor: pointer;
      transition: all 0.2s cubic-bezier(0.34,1.3,0.64,1);
      white-space: nowrap;
      -webkit-tap-highlight-color: transparent;
      touch-action: manipulation;
      flex-shrink: 0;
    }
    .filters button.active {
      background: linear-gradient(135deg, rgba(0,122,255,0.75), rgba(94,92,230,0.75));
      border-color: rgba(0,122,255,0.5);
      color: #fff;
      box-shadow: 0 4px 16px rgba(0,122,255,0.35);
    }
    @media (hover: hover) {
      .filters button:not(.active):hover {
        border-color: rgba(255,255,255,0.3);
        color: #fff;
        transform: translateY(-1px);
      }
    }

    /* ── Todo list ── */
    .todo-list { display: flex; flex-direction: column; gap: 10px; }

    .todo-item {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 16px 16px;
      background: var(--card-bg);
      backdrop-filter: var(--blur);
      -webkit-backdrop-filter: var(--blur);
      border-radius: 18px;
      border: 1.5px solid var(--card-border);
      transition: transform 0.2s, box-shadow 0.2s, opacity 0.3s, border-color 0.2s;
      animation: slideIn 0.3s cubic-bezier(0.34,1.4,0.64,1);
      -webkit-tap-highlight-color: transparent;
    }
    @keyframes slideIn {
      from { opacity: 0; transform: translateY(12px) scale(0.97); }
      to   { opacity: 1; transform: none; }
    }
    @media (hover: hover) {
      .todo-item:hover {
        transform: translateY(-2px);
        box-shadow: 0 12px 40px rgba(0,0,0,0.3);
        border-color: rgba(255,255,255,0.28);
      }
    }
    .todo-item.done { opacity: 0.38; }

    /* Custom checkbox */
    .check-wrap {
      flex-shrink: 0;
      width: 26px; height: 26px;
      position: relative;
      cursor: pointer;
    }
    .check-wrap input { position: absolute; opacity: 0; width: 0; height: 0; }
    .check-box {
      width: 26px; height: 26px;
      border-radius: 50%;
      border: 2px solid rgba(255,255,255,0.3);
      display: flex; align-items: center; justify-content: center;
      transition: all 0.25s cubic-bezier(0.34,1.56,0.64,1);
      background: rgba(255,255,255,0.05);
    }
    .check-wrap input:checked + .check-box {
      background: linear-gradient(135deg, var(--green), #25a244);
      border-color: transparent;
      box-shadow: 0 0 14px rgba(48,209,88,0.5);
    }
    .check-box svg { opacity: 0; transform: scale(0.5); transition: all 0.2s cubic-bezier(0.34,1.56,0.64,1); }
    .check-wrap input:checked + .check-box svg { opacity: 1; transform: scale(1); }

    .todo-text {
      flex: 1;
      font-size: clamp(0.9rem, 3.5vw, 0.97rem);
      font-weight: 400;
      color: #fff;
      word-break: break-word;
      line-height: 1.45;
    }
    .todo-item.done .todo-text {
      text-decoration: line-through;
      text-decoration-color: rgba(255,255,255,0.35);
    }
    .edit-input {
      flex: 1;
      min-width: 0;
      background: rgba(255,255,255,0.08);
      border: 1.5px solid rgba(0,122,255,0.6);
      border-radius: 8px;
      color: #fff;
      font-size: 16px;
      font-family: inherit;
      font-weight: 400;
      outline: none;
      padding: 4px 10px;
      box-shadow: 0 0 0 3px rgba(0,122,255,0.15);
      -webkit-appearance: none;
    }

    .btn-icon {
      background: none;
      border: none;
      cursor: pointer;
      color: rgba(255,255,255,0.28);
      font-size: 0.9rem;
      padding: 8px;
      border-radius: 10px;
      transition: color 0.2s, background 0.2s, transform 0.15s;
      line-height: 1;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
      -webkit-tap-highlight-color: transparent;
      touch-action: manipulation;
    }
    @media (hover: hover) {
      .btn-icon:hover { color: #fff; background: rgba(255,255,255,0.12); transform: scale(1.15); }
      .btn-delete:hover { color: var(--accent3); background: rgba(255,55,95,0.12); }
    }
    .btn-icon:active { transform: scale(0.9); opacity: 0.7; }

    /* ── Empty state ── */
    .empty {
      text-align: center;
      color: var(--text-muted);
      padding: 52px 0;
      font-size: 0.92rem;
      display: flex; flex-direction: column; align-items: center; gap: 10px;
    }
    .empty-icon { font-size: 2.8rem; opacity: 0.4; }

    /* ── Stats ── */
    .stats {
      margin-top: 20px;
      color: var(--text-sub);
      font-size: clamp(0.75rem, 2.5vw, 0.82rem);
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 8px;
    }
    .clear-btn {
      background: none;
      border: none;
      color: var(--text-sub);
      font-size: clamp(0.75rem, 2.5vw, 0.82rem);
      font-family: inherit;
      cursor: pointer;
      padding: 6px 12px;
      border-radius: 8px;
      transition: color 0.2s, background 0.2s;
      -webkit-tap-highlight-color: transparent;
      touch-action: manipulation;
    }
    @media (hover: hover) {
      .clear-btn:hover { color: var(--accent3); background: rgba(255,55,95,0.10); }
    }

    /* ── Mobile tweaks ── */
    @media (max-width: 400px) {
      body { padding-left: 12px; padding-right: 12px; }
      .btn-icon { padding: 6px; }
      .todo-item { gap: 10px; padding: 14px 12px; }
    }

    /* RTL */
    [dir="rtl"] .header { flex-direction: row-reverse; }
    [dir="rtl"] .add-form { flex-direction: row-reverse; }
    [dir="rtl"] .filters { flex-direction: row-reverse; }
    [dir="rtl"] .stats { flex-direction: row-reverse; }
    [dir="rtl"] .todo-item { flex-direction: row-reverse; }
    [dir="rtl"] .todo-text { text-align: right; }
    [dir="rtl"] .empty { direction: rtl; }
  </style>
</head>
<body>
<div class="app">

  <div class="header">
    <div class="header-text">
      <h1 id="title">My Tasks</h1>
      <p class="subtitle" id="date"></p>
    </div>
    <div class="lang-toggle">
      <button class="active" onclick="setLang('en')">EN</button>
      <button onclick="setLang('he')">עב</button>
    </div>
  </div>

  <div class="progress-wrap">
    <div class="progress-bar" id="progressBar" style="width:0%"></div>
  </div>

  <form class="add-form" id="addForm">
    <input id="newTodo" type="text" autocomplete="off" />
    <button type="submit" id="addBtn">+ Add</button>
  </form>

  <div class="filters">
    <button class="active" data-filter="all" onclick="setFilter('all')" id="fAll">All</button>
    <button data-filter="active" onclick="setFilter('active')" id="fActive">Active</button>
    <button data-filter="done" onclick="setFilter('done')" id="fDone">Done</button>
  </div>

  <div class="todo-list" id="list"></div>

  <div class="stats">
    <span id="statsText"></span>
    <button class="clear-btn" id="clearBtn" onclick="clearDone()">Clear completed</button>
  </div>
</div>

<script>
  const T = {
    en: {
      title: 'My Tasks', placeholder: 'Add a new task…', add: '+ Add',
      all: 'All', active: 'Active', done: 'Done',
      remaining: n => `${n} remaining`, completed: n => `${n} done`,
      clear: 'Clear completed', empty: 'No tasks here.', emptySub: 'Add something above!',
    },
    he: {
      title: 'המשימות שלי', placeholder: 'הוסף משימה חדשה…', add: '+ הוסף',
      all: 'הכל', active: 'פעיל', done: 'הושלם',
      remaining: n => `נותרו ${n}`, completed: n => `${n} הושלמו`,
      clear: 'נקה שהושלמו', empty: 'אין משימות כאן.', emptySub: 'הוסף משימה למעלה!',
    }
  };

  let todos = [], filter = 'all', lang = 'en';

  function setLang(l) {
    lang = l;
    document.documentElement.lang = l;
    document.documentElement.dir = l === 'he' ? 'rtl' : 'ltr';
    document.querySelectorAll('.lang-toggle button').forEach((b,i) =>
      b.classList.toggle('active', (i===0&&l==='en')||(i===1&&l==='he')));
    applyTranslations(); render();
  }

  function applyTranslations() {
    const t = T[lang];
    document.getElementById('title').textContent = t.title;
    document.getElementById('newTodo').placeholder = t.placeholder;
    document.getElementById('addBtn').textContent = t.add;
    document.getElementById('fAll').textContent = t.all;
    document.getElementById('fActive').textContent = t.active;
    document.getElementById('fDone').textContent = t.done;
    document.getElementById('clearBtn').textContent = t.clear;
    const locale = lang === 'he' ? 'he-IL' : 'en-US';
    document.getElementById('date').textContent = new Date().toLocaleDateString(locale,
      {weekday:'long', year:'numeric', month:'long', day:'numeric'});
  }

  async function load() {
    const r = await fetch('/api/todos');
    todos = await r.json();
    applyTranslations(); render();
  }

  async function saveTodos() {
    await fetch('/api/todos', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(todos) });
  }

  function esc(s) {
    return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  function render() {
    const t = T[lang];
    const visible = todos.filter(todo => filter==='all'||(filter==='done'?todo.done:!todo.done));
    const list = document.getElementById('list');
    if (visible.length === 0) {
      list.innerHTML = `<div class="empty"><div class="empty-icon">${filter==='done'?'✅':'🌟'}</div><div>${t.empty}</div><div style="font-size:0.8rem;opacity:0.6">${t.emptySub}</div></div>`;
    } else {
      list.innerHTML = visible.map(todo => `
        <div class="todo-item ${todo.done?'done':''}" id="item-${todo.id}">
          <label class="check-wrap">
            <input type="checkbox" ${todo.done?'checked':''} onchange="toggle(${todo.id})" />
            <div class="check-box">
              <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                <path d="M1 5L4.5 8.5L11 1" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
          </label>
          <span class="todo-text" ondblclick="startEdit(${todo.id})">${esc(todo.text)}</span>
          <button class="btn-icon" onclick="startEdit(${todo.id})">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </button>
          <button class="btn-icon btn-delete" onclick="del(${todo.id})">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
              <path d="M10 11v6"/><path d="M14 11v6"/>
              <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
            </svg>
          </button>
        </div>`).join('');
    }
    const done = todos.filter(t => t.done).length;
    const pct = todos.length ? Math.round((done/todos.length)*100) : 0;
    document.getElementById('progressBar').style.width = pct + '%';
    document.getElementById('statsText').textContent = t.remaining(todos.length-done) + ' · ' + t.completed(done);
  }

  document.getElementById('addForm').onsubmit = async e => {
    e.preventDefault();
    const input = document.getElementById('newTodo');
    const text = input.value.trim();
    if (!text) { input.focus(); return; }
    todos.unshift({ id: Date.now(), text, done: false });
    input.value = '';
    await saveTodos(); render();
  };

  async function toggle(id) {
    todos = todos.map(t => t.id===id ? {...t, done:!t.done} : t);
    await saveTodos(); render();
  }

  async function del(id) {
    const el = document.getElementById('item-'+id);
    if (el) { el.style.transition='opacity 0.2s,transform 0.2s'; el.style.opacity='0'; el.style.transform='scale(0.95)'; }
    await new Promise(r => setTimeout(r,180));
    todos = todos.filter(t => t.id!==id);
    await saveTodos(); render();
  }

  function startEdit(id) {
    const item = document.getElementById('item-'+id);
    const span = item.querySelector('.todo-text');
    const todo = todos.find(t => t.id===id);
    const input = document.createElement('input');
    input.className = 'edit-input';
    input.value = todo.text;
    if (document.documentElement.dir==='rtl') input.dir='rtl';
    span.replaceWith(input);
    input.focus(); input.select();
    const finish = async () => {
      const val = input.value.trim();
      if (val && val!==todo.text) { todos=todos.map(t=>t.id===id?{...t,text:val}:t); await saveTodos(); }
      render();
    };
    input.onblur = finish;
    input.onkeydown = e => { if(e.key==='Enter') input.blur(); if(e.key==='Escape'){input.value=todo.text;input.blur();} };
  }

  async function clearDone() {
    todos = todos.filter(t => !t.done);
    await saveTodos(); render();
  }

  function setFilter(f) {
    filter = f;
    document.querySelectorAll('.filters button').forEach(b => b.classList.toggle('active', b.dataset.filter===f));
    render();
  }

  load();

  // Register service worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  }
</script>
</body>
</html>
"""


class Handler(BaseHTTPRequestHandler):
    def log_message(self, fmt, *args):
        print(f"  {self.address_string()} - {fmt % args}")

    def do_GET(self):
        path = urlparse(self.path).path

        if path == "/api/todos":
            data = json.dumps(load_todos()).encode()
            self._respond(200, "application/json", data)
        elif path == "/manifest.json":
            self._respond(200, "application/manifest+json", MANIFEST)
        elif path == "/sw.js":
            self._respond(200, "application/javascript", SERVICE_WORKER)
        elif path.startswith("/static/"):
            filename = os.path.basename(path)
            filepath = os.path.join(STATIC_DIR, filename)
            if os.path.exists(filepath):
                mime = mimetypes.guess_type(filepath)[0] or "application/octet-stream"
                with open(filepath, "rb") as f:
                    self._respond(200, mime, f.read())
            else:
                self._respond(404, "text/plain", b"Not found")
        else:
            self._respond(200, "text/html; charset=utf-8", HTML.encode())

    def _respond(self, code, content_type, body):
        self.send_response(code)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", len(body))
        self.end_headers()
        self.wfile.write(body)

    def do_POST(self):
        path = urlparse(self.path).path
        if path == "/api/todos":
            length = int(self.headers.get("Content-Length", 0))
            body = self.rfile.read(length)
            save_todos(json.loads(body))
            self.send_response(200)
            self.end_headers()
        else:
            self.send_response(404)
            self.end_headers()


if __name__ == "__main__":
    server = HTTPServer(("0.0.0.0", PORT), Handler)
    print(f"To-Do app running at http://localhost:{PORT}")
    print("Press Ctrl+C to stop.")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nServer stopped.")
