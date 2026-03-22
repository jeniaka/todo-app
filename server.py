import json
import os
import hmac
import hashlib
import base64
import secrets
import mimetypes
import urllib.request
import urllib.parse
from http.server import HTTPServer, BaseHTTPRequestHandler
from http.cookies import SimpleCookie
from urllib.parse import urlparse, parse_qs

PORT = int(os.environ.get("PORT", 8090))
MONGODB_URI = os.environ.get("MONGODB_URI", "")
GOOGLE_CLIENT_ID = os.environ.get("GOOGLE_CLIENT_ID", "")
GOOGLE_CLIENT_SECRET = os.environ.get("GOOGLE_CLIENT_SECRET", "")
REDIRECT_URI = os.environ.get("REDIRECT_URI", f"http://localhost:{PORT}/auth/callback")
SESSION_SECRET = os.environ.get("SESSION_SECRET", secrets.token_hex(32))

STATIC_DIR = os.path.join(os.path.dirname(__file__), "static")
DATA_DIR = os.path.join(os.path.dirname(__file__), "userdata")
os.makedirs(DATA_DIR, exist_ok=True)

# ── MongoDB ──────────────────────────────────────────────────────────────────
db = None
if MONGODB_URI:
    try:
        from pymongo import MongoClient
        import certifi
        client = MongoClient(MONGODB_URI, tlsCAFile=certifi.where())
        db = client["tododb"]
        print("Connected to MongoDB Atlas")
    except Exception as e:
        print(f"MongoDB failed, using local files: {e}")


def load_todos(user_id):
    if db is not None:
        doc = db["todos"].find_one({"_id": user_id})
        return doc["data"] if doc else []
    path = os.path.join(DATA_DIR, f"{user_id}.json")
    return json.load(open(path)) if os.path.exists(path) else []


def save_todos(user_id, data):
    if db is not None:
        db["todos"].replace_one({"_id": user_id}, {"_id": user_id, "data": data}, upsert=True)
        return
    with open(os.path.join(DATA_DIR, f"{user_id}.json"), "w") as f:
        json.dump(data, f, indent=2)


# ── Session ───────────────────────────────────────────────────────────────────
def sign(data: str) -> str:
    return hmac.new(SESSION_SECRET.encode(), data.encode(), hashlib.sha256).hexdigest()

def create_session(user: dict) -> str:
    payload = base64.urlsafe_b64encode(json.dumps(user).encode()).decode()
    return f"{payload}.{sign(payload)}"

def verify_session(token: str):
    try:
        payload, sig = token.rsplit(".", 1)
        if hmac.compare_digest(sign(payload), sig):
            return json.loads(base64.urlsafe_b64decode(payload))
    except Exception:
        pass
    return None

def create_state() -> str:
    s = secrets.token_urlsafe(16)
    return f"{s}.{sign(s)[:16]}"

def verify_state(state: str) -> bool:
    try:
        s, sig = state.rsplit(".", 1)
        return hmac.compare_digest(sign(s)[:16], sig)
    except Exception:
        return False


# ── Google OAuth ──────────────────────────────────────────────────────────────
def google_auth_url(state: str) -> str:
    params = urllib.parse.urlencode({
        "client_id": GOOGLE_CLIENT_ID,
        "redirect_uri": REDIRECT_URI,
        "response_type": "code",
        "scope": "openid email profile",
        "state": state,
        "prompt": "select_account",
    })
    return f"https://accounts.google.com/o/oauth2/v2/auth?{params}"

def exchange_code(code: str) -> dict:
    data = urllib.parse.urlencode({
        "code": code,
        "client_id": GOOGLE_CLIENT_ID,
        "client_secret": GOOGLE_CLIENT_SECRET,
        "redirect_uri": REDIRECT_URI,
        "grant_type": "authorization_code",
    }).encode()
    req = urllib.request.Request("https://oauth2.googleapis.com/token", data=data)
    with urllib.request.urlopen(req) as r:
        return json.loads(r.read())

def get_google_user(access_token: str) -> dict:
    req = urllib.request.Request(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        headers={"Authorization": f"Bearer {access_token}"}
    )
    with urllib.request.urlopen(req) as r:
        return json.loads(r.read())


# ── Static assets ─────────────────────────────────────────────────────────────
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
const CACHE = 'todo-v2';
self.addEventListener('install', e => e.waitUntil(caches.open(CACHE).then(c => c.addAll(['/login']))));
self.addEventListener('fetch', e => {
  if (e.request.url.includes('/api/') || e.request.url.includes('/auth/')) return;
  e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
});
"""


# ── Login page HTML ───────────────────────────────────────────────────────────
LOGIN_HTML = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover"/>
  <meta name="theme-color" content="#0a0015">
  <title>My Tasks — Sign In</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Heebo:wght@400;600;700;800&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Heebo', -apple-system, sans-serif;
      min-height: 100dvh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #0a0015;
      padding: 24px;
    }
    body::before {
      content: '';
      position: fixed; inset: 0;
      background:
        radial-gradient(ellipse 80% 60% at 20% 10%, rgba(120,40,200,0.55) 0%, transparent 60%),
        radial-gradient(ellipse 60% 50% at 80% 20%, rgba(0,122,255,0.45) 0%, transparent 55%),
        radial-gradient(ellipse 70% 60% at 60% 80%, rgba(255,55,95,0.35) 0%, transparent 60%);
      animation: bg 12s ease-in-out infinite alternate;
      z-index: 0;
    }
    @keyframes bg { to { filter: hue-rotate(25deg) brightness(1.1); } }
    .card {
      position: relative; z-index: 1;
      background: rgba(255,255,255,0.08);
      backdrop-filter: blur(28px);
      -webkit-backdrop-filter: blur(28px);
      border: 1.5px solid rgba(255,255,255,0.15);
      border-radius: 28px;
      padding: 48px 40px;
      width: 100%; max-width: 400px;
      text-align: center;
    }
    .icon { font-size: 3rem; margin-bottom: 16px; }
    h1 {
      font-size: 2rem; font-weight: 800; letter-spacing: -1px;
      background: linear-gradient(135deg, #fff, rgba(255,255,255,0.7));
      -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
      margin-bottom: 8px;
    }
    p { color: rgba(255,255,255,0.5); font-size: 0.9rem; margin-bottom: 36px; }
    .google-btn {
      display: flex; align-items: center; justify-content: center; gap: 12px;
      width: 100%; padding: 14px 20px;
      background: #fff; color: #1f1f1f;
      border: none; border-radius: 14px;
      font-size: 0.95rem; font-weight: 600; font-family: inherit;
      cursor: pointer; text-decoration: none;
      transition: transform 0.15s, box-shadow 0.15s;
      box-shadow: 0 4px 20px rgba(0,0,0,0.3);
    }
    .google-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(0,0,0,0.4); }
    .google-btn:active { transform: scale(0.97); }
    .google-logo { width: 20px; height: 20px; flex-shrink: 0; }
  </style>
</head>
<body>
<div class="card">
  <div class="icon">✅</div>
  <h1>My Tasks</h1>
  <p>Sign in to access your personal task list</p>
  <a class="google-btn" href="/auth/google">
    <svg class="google-logo" viewBox="0 0 48 48">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
    </svg>
    Continue with Google
  </a>
</div>
</body>
</html>
"""


# ── Main app HTML ─────────────────────────────────────────────────────────────
def build_app_html(user: dict) -> str:
    name = user.get("name", "")
    picture = user.get("picture", "")
    avatar = f'<img src="{picture}" referrerpolicy="no-referrer" style="width:32px;height:32px;border-radius:50%;border:2px solid rgba(255,255,255,0.2)">' if picture else f'<div style="width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,#007AFF,#BF5AF2);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.85rem">{name[:1].upper()}</div>'

    return f"""<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
  <meta charset="UTF-8"/>
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
    *, *::before, *::after {{ box-sizing: border-box; margin: 0; padding: 0; }}
    :root {{
      --accent: #007AFF; --accent2: #BF5AF2; --accent3: #FF375F; --green: #30D158;
      --card-bg: rgba(255,255,255,0.10); --card-border: rgba(255,255,255,0.18);
      --text-sub: rgba(255,255,255,0.55); --text-muted: rgba(255,255,255,0.30);
      --blur: blur(28px);
      --safe-top: env(safe-area-inset-top,0px); --safe-bottom: env(safe-area-inset-bottom,0px);
    }}
    html {{ height: 100%; }}
    body {{
      font-family: 'Heebo', -apple-system, BlinkMacSystemFont, sans-serif;
      min-height: 100dvh; display: flex; justify-content: center;
      background: #0a0015; overflow-x: hidden;
      padding: calc(40px + var(--safe-top)) 16px calc(40px + var(--safe-bottom));
    }}
    body::before {{
      content: ''; position: fixed; inset: 0;
      background:
        radial-gradient(ellipse 80% 60% at 20% 10%, rgba(120,40,200,0.55) 0%, transparent 60%),
        radial-gradient(ellipse 60% 50% at 80% 20%, rgba(0,122,255,0.45) 0%, transparent 55%),
        radial-gradient(ellipse 70% 60% at 60% 80%, rgba(255,55,95,0.35) 0%, transparent 60%),
        radial-gradient(ellipse 50% 40% at 10% 80%, rgba(48,209,88,0.25) 0%, transparent 50%);
      z-index: 0; animation: bgShift 12s ease-in-out infinite alternate;
    }}
    @keyframes bgShift {{ to {{ filter: hue-rotate(25deg) brightness(1.1); }} }}
    .app {{ position: relative; z-index: 1; width: 100%; max-width: 580px; }}
    .header {{ display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 28px; gap: 12px; }}
    h1 {{
      font-size: clamp(1.8rem,6vw,2.6rem); font-weight: 800; letter-spacing: -1.5px; line-height: 1;
      background: linear-gradient(135deg,#fff 0%,rgba(255,255,255,0.7) 100%);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
    }}
    .subtitle {{ color: var(--text-sub); font-size: clamp(0.75rem,2.5vw,0.88rem); font-weight: 400; margin-top: 6px; }}
    .header-right {{ display: flex; align-items: center; gap: 8px; flex-shrink: 0; margin-top: 4px; }}
    .user-info {{ display: flex; align-items: center; gap: 8px; background: var(--card-bg); backdrop-filter: var(--blur); -webkit-backdrop-filter: var(--blur); border: 1px solid var(--card-border); border-radius: 20px; padding: 4px 12px 4px 4px; }}
    .user-name {{ color: rgba(255,255,255,0.8); font-size: 0.8rem; font-weight: 600; max-width: 100px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }}
    .lang-toggle {{ display: flex; align-items: center; background: var(--card-bg); border: 1px solid var(--card-border); border-radius: 20px; padding: 4px; backdrop-filter: var(--blur); -webkit-backdrop-filter: var(--blur); gap: 2px; }}
    .lang-toggle button {{ padding: 7px 14px; border-radius: 16px; border: none; background: transparent; color: var(--text-sub); font-size: 0.8rem; font-weight: 600; cursor: pointer; transition: all 0.25s cubic-bezier(0.34,1.56,0.64,1); font-family: inherit; -webkit-tap-highlight-color: transparent; }}
    .lang-toggle button.active {{ background: rgba(255,255,255,0.18); color: #fff; box-shadow: 0 2px 8px rgba(0,0,0,0.25); }}
    .logout-btn {{ background: none; border: none; color: var(--text-sub); font-size: 0.78rem; font-family: inherit; cursor: pointer; padding: 6px 10px; border-radius: 8px; transition: color 0.2s, background 0.2s; white-space: nowrap; -webkit-tap-highlight-color: transparent; }}
    .logout-btn:hover {{ color: var(--accent3); background: rgba(255,55,95,0.10); }}
    .progress-wrap {{ background: rgba(255,255,255,0.08); border-radius: 99px; height: 5px; margin-bottom: 24px; overflow: hidden; }}
    .progress-bar {{ height: 100%; border-radius: 99px; background: linear-gradient(90deg,var(--accent),var(--accent2)); transition: width 0.5s cubic-bezier(0.34,1.1,0.64,1); box-shadow: 0 0 10px rgba(0,122,255,0.6); }}
    .add-form {{ display: flex; gap: 10px; margin-bottom: 18px; }}
    .add-form input {{ flex: 1; min-width: 0; padding: 15px 18px; border-radius: 16px; border: 1.5px solid var(--card-border); background: var(--card-bg); backdrop-filter: var(--blur); -webkit-backdrop-filter: var(--blur); color: #fff; font-size: 16px; font-family: inherit; outline: none; transition: border-color 0.2s, box-shadow 0.2s; -webkit-appearance: none; }}
    .add-form input::placeholder {{ color: var(--text-muted); }}
    .add-form input:focus {{ border-color: rgba(0,122,255,0.7); box-shadow: 0 0 0 3px rgba(0,122,255,0.18); }}
    .add-form button {{ padding: 15px 20px; border-radius: 16px; border: none; background: linear-gradient(135deg,#007AFF,#5E5CE6); color: #fff; font-size: 0.95rem; font-weight: 700; font-family: inherit; cursor: pointer; transition: transform 0.15s, box-shadow 0.15s; box-shadow: 0 4px 20px rgba(0,122,255,0.45); white-space: nowrap; flex-shrink: 0; -webkit-tap-highlight-color: transparent; touch-action: manipulation; }}
    .add-form button:active {{ transform: scale(0.96); }}
    @media (hover:hover) {{ .add-form button:hover {{ transform: translateY(-2px) scale(1.03); box-shadow: 0 8px 28px rgba(0,122,255,0.55); }} }}
    .filters {{ display: flex; gap: 8px; margin-bottom: 16px; overflow-x: auto; -webkit-overflow-scrolling: touch; scrollbar-width: none; padding-bottom: 2px; }}
    .filters::-webkit-scrollbar {{ display: none; }}
    .filters button {{ padding: 9px 18px; border-radius: 20px; border: 1.5px solid var(--card-border); background: var(--card-bg); backdrop-filter: var(--blur); -webkit-backdrop-filter: var(--blur); color: var(--text-sub); font-size: 0.82rem; font-weight: 600; font-family: inherit; cursor: pointer; transition: all 0.2s cubic-bezier(0.34,1.3,0.64,1); white-space: nowrap; flex-shrink: 0; -webkit-tap-highlight-color: transparent; touch-action: manipulation; }}
    .filters button.active {{ background: linear-gradient(135deg,rgba(0,122,255,0.75),rgba(94,92,230,0.75)); border-color: rgba(0,122,255,0.5); color: #fff; box-shadow: 0 4px 16px rgba(0,122,255,0.35); }}
    .todo-list {{ display: flex; flex-direction: column; gap: 10px; }}
    .todo-item {{ display: flex; align-items: center; gap: 14px; padding: 16px; background: var(--card-bg); backdrop-filter: var(--blur); -webkit-backdrop-filter: var(--blur); border-radius: 18px; border: 1.5px solid var(--card-border); transition: transform 0.2s, box-shadow 0.2s, opacity 0.3s; animation: slideIn 0.3s cubic-bezier(0.34,1.4,0.64,1); -webkit-tap-highlight-color: transparent; }}
    @keyframes slideIn {{ from {{ opacity:0; transform:translateY(12px) scale(0.97); }} to {{ opacity:1; transform:none; }} }}
    @media (hover:hover) {{ .todo-item:hover {{ transform: translateY(-2px); box-shadow: 0 12px 40px rgba(0,0,0,0.3); border-color: rgba(255,255,255,0.28); }} }}
    .todo-item.done {{ opacity: 0.38; }}
    .check-wrap {{ flex-shrink: 0; width: 26px; height: 26px; position: relative; cursor: pointer; }}
    .check-wrap input {{ position: absolute; opacity: 0; width: 0; height: 0; }}
    .check-box {{ width: 26px; height: 26px; border-radius: 50%; border: 2px solid rgba(255,255,255,0.3); display: flex; align-items: center; justify-content: center; transition: all 0.25s cubic-bezier(0.34,1.56,0.64,1); background: rgba(255,255,255,0.05); }}
    .check-wrap input:checked + .check-box {{ background: linear-gradient(135deg,var(--green),#25a244); border-color: transparent; box-shadow: 0 0 14px rgba(48,209,88,0.5); }}
    .check-box svg {{ opacity: 0; transform: scale(0.5); transition: all 0.2s cubic-bezier(0.34,1.56,0.64,1); }}
    .check-wrap input:checked + .check-box svg {{ opacity: 1; transform: scale(1); }}
    .todo-text {{ flex: 1; font-size: clamp(0.9rem,3.5vw,0.97rem); color: #fff; word-break: break-word; line-height: 1.45; }}
    .todo-item.done .todo-text {{ text-decoration: line-through; text-decoration-color: rgba(255,255,255,0.35); }}
    .edit-input {{ flex: 1; min-width: 0; background: rgba(255,255,255,0.08); border: 1.5px solid rgba(0,122,255,0.6); border-radius: 8px; color: #fff; font-size: 16px; font-family: inherit; outline: none; padding: 4px 10px; box-shadow: 0 0 0 3px rgba(0,122,255,0.15); -webkit-appearance: none; }}
    .btn-icon {{ background: none; border: none; cursor: pointer; color: rgba(255,255,255,0.28); padding: 8px; border-radius: 10px; transition: color 0.2s, background 0.2s, transform 0.15s; display: flex; align-items: center; justify-content: center; flex-shrink: 0; -webkit-tap-highlight-color: transparent; }}
    @media (hover:hover) {{ .btn-icon:hover {{ color: #fff; background: rgba(255,255,255,0.12); transform: scale(1.15); }} .btn-delete:hover {{ color: var(--accent3); background: rgba(255,55,95,0.12); }} }}
    .btn-icon:active {{ transform: scale(0.9); opacity: 0.7; }}
    .empty {{ text-align: center; color: var(--text-muted); padding: 52px 0; display: flex; flex-direction: column; align-items: center; gap: 10px; font-size: 0.92rem; }}
    .empty-icon {{ font-size: 2.8rem; opacity: 0.4; }}
    .stats {{ margin-top: 20px; color: var(--text-sub); font-size: clamp(0.75rem,2.5vw,0.82rem); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px; }}
    .clear-btn {{ background: none; border: none; color: var(--text-sub); font-size: clamp(0.75rem,2.5vw,0.82rem); font-family: inherit; cursor: pointer; padding: 6px 12px; border-radius: 8px; transition: color 0.2s, background 0.2s; -webkit-tap-highlight-color: transparent; }}
    @media (hover:hover) {{ .clear-btn:hover {{ color: var(--accent3); background: rgba(255,55,95,0.10); }} }}
    @media (max-width:400px) {{ .user-name {{ display: none; }} .btn-icon {{ padding: 6px; }} .todo-item {{ gap: 10px; padding: 14px 12px; }} }}
    [dir="rtl"] .header {{ flex-direction: row-reverse; }} [dir="rtl"] .header-right {{ flex-direction: row-reverse; }} [dir="rtl"] .add-form {{ flex-direction: row-reverse; }} [dir="rtl"] .filters {{ flex-direction: row-reverse; }} [dir="rtl"] .stats {{ flex-direction: row-reverse; }} [dir="rtl"] .todo-item {{ flex-direction: row-reverse; }} [dir="rtl"] .todo-text {{ text-align: right; }}
  </style>
</head>
<body>
<div class="app">
  <div class="header">
    <div>
      <h1 id="title">My Tasks</h1>
      <p class="subtitle" id="date"></p>
    </div>
    <div class="header-right">
      <div class="user-info">
        {avatar}
        <span class="user-name">{name}</span>
      </div>
      <div class="lang-toggle">
        <button class="active" onclick="setLang('en')">EN</button>
        <button onclick="setLang('he')">עב</button>
      </div>
      <form method="post" action="/auth/logout" style="margin:0">
        <button class="logout-btn" type="submit">Sign out</button>
      </form>
    </div>
  </div>
  <div class="progress-wrap"><div class="progress-bar" id="progressBar" style="width:0%"></div></div>
  <form class="add-form" id="addForm">
    <input id="newTodo" type="text" autocomplete="off"/>
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
  const T = {{
    en: {{ title:'My Tasks', placeholder:'Add a new task…', add:'+ Add', all:'All', active:'Active', done:'Done', remaining:n=>`${{n}} remaining`, completed:n=>`${{n}} done`, clear:'Clear completed', empty:'No tasks here.', emptySub:'Add something above!' }},
    he: {{ title:'המשימות שלי', placeholder:'הוסף משימה חדשה…', add:'+ הוסף', all:'הכל', active:'פעיל', done:'הושלם', remaining:n=>`נותרו ${{n}}`, completed:n=>`${{n}} הושלמו`, clear:'נקה שהושלמו', empty:'אין משימות כאן.', emptySub:'הוסף משימה למעלה!' }}
  }};
  let todos=[], filter='all', lang='en';

  function setLang(l) {{
    lang=l; document.documentElement.lang=l; document.documentElement.dir=l==='he'?'rtl':'ltr';
    document.querySelectorAll('.lang-toggle button').forEach((b,i)=>b.classList.toggle('active',(i===0&&l==='en')||(i===1&&l==='he')));
    applyT(); render();
  }}
  function applyT() {{
    const t=T[lang];
    document.getElementById('title').textContent=t.title;
    document.getElementById('newTodo').placeholder=t.placeholder;
    document.getElementById('addBtn').textContent=t.add;
    document.getElementById('fAll').textContent=t.all;
    document.getElementById('fActive').textContent=t.active;
    document.getElementById('fDone').textContent=t.done;
    document.getElementById('clearBtn').textContent=t.clear;
    document.getElementById('date').textContent=new Date().toLocaleDateString(lang==='he'?'he-IL':'en-US',{{weekday:'long',year:'numeric',month:'long',day:'numeric'}});
  }}
  async function load() {{ todos=await(await fetch('/api/todos')).json(); applyT(); render(); }}
  async function saveTodos() {{ await fetch('/api/todos',{{method:'POST',headers:{{'Content-Type':'application/json'}},body:JSON.stringify(todos)}}); }}
  function esc(s) {{ return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }}
  function render() {{
    const t=T[lang];
    const visible=todos.filter(x=>filter==='all'||(filter==='done'?x.done:!x.done));
    const list=document.getElementById('list');
    if(!visible.length) {{ list.innerHTML=`<div class="empty"><div class="empty-icon">${{filter==='done'?'✅':'🌟'}}</div><div>${{t.empty}}</div><div style="font-size:0.8rem;opacity:0.6">${{t.emptySub}}</div></div>`; }}
    else list.innerHTML=visible.map(x=>`<div class="todo-item ${{x.done?'done':''}}" id="item-${{x.id}}"><label class="check-wrap"><input type="checkbox" ${{x.done?'checked':''}} onchange="toggle(${{x.id}})"/><div class="check-box"><svg width="12" height="10" viewBox="0 0 12 10" fill="none"><path d="M1 5L4.5 8.5L11 1" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></div></label><span class="todo-text" ondblclick="startEdit(${{x.id}})">${{esc(x.text)}}</span><button class="btn-icon" onclick="startEdit(${{x.id}})"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button><button class="btn-icon btn-delete" onclick="del(${{x.id}})"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg></button></div>`).join('');
    const done=todos.filter(x=>x.done).length;
    document.getElementById('progressBar').style.width=(todos.length?Math.round(done/todos.length*100):0)+'%';
    document.getElementById('statsText').textContent=t.remaining(todos.length-done)+' · '+t.completed(done);
  }}
  document.getElementById('addForm').onsubmit=async e=>{{ e.preventDefault(); const inp=document.getElementById('newTodo'); const text=inp.value.trim(); if(!text)return; todos.unshift({{id:Date.now(),text,done:false}}); inp.value=''; await saveTodos(); render(); }};
  async function toggle(id) {{ todos=todos.map(t=>t.id===id?{{...t,done:!t.done}}:t); await saveTodos(); render(); }}
  async function del(id) {{ const el=document.getElementById('item-'+id); if(el){{el.style.transition='opacity 0.2s,transform 0.2s';el.style.opacity='0';el.style.transform='scale(0.95)';}} await new Promise(r=>setTimeout(r,180)); todos=todos.filter(t=>t.id!==id); await saveTodos(); render(); }}
  function startEdit(id) {{ const item=document.getElementById('item-'+id); const span=item.querySelector('.todo-text'); const todo=todos.find(t=>t.id===id); const inp=document.createElement('input'); inp.className='edit-input'; inp.value=todo.text; if(document.documentElement.dir==='rtl')inp.dir='rtl'; span.replaceWith(inp); inp.focus(); inp.select(); const finish=async()=>{{ const val=inp.value.trim(); if(val&&val!==todo.text){{todos=todos.map(t=>t.id===id?{{...t,text:val}}:t);await saveTodos();}} render(); }}; inp.onblur=finish; inp.onkeydown=e=>{{if(e.key==='Enter')inp.blur();if(e.key==='Escape'){{inp.value=todo.text;inp.blur();}}}}; }}
  async function clearDone() {{ todos=todos.filter(t=>!t.done); await saveTodos(); render(); }}
  function setFilter(f) {{ filter=f; document.querySelectorAll('.filters button').forEach(b=>b.classList.toggle('active',b.dataset.filter===f)); render(); }}
  if('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js').catch(()=>{{}});
  load();
</script>
</body>
</html>"""


# ── Request handler ───────────────────────────────────────────────────────────
class Handler(BaseHTTPRequestHandler):
    def log_message(self, fmt, *args):
        print(f"  {self.address_string()} - {fmt % args}")

    def get_session(self):
        cookie_header = self.headers.get("Cookie", "")
        cookies = SimpleCookie(cookie_header)
        if "session" in cookies:
            return verify_session(cookies["session"].value)
        return None

    def set_session_cookie(self, user):
        token = create_session(user)
        return f"session={token}; HttpOnly; SameSite=Lax; Path=/; Max-Age=2592000"

    def redirect(self, location, extra_headers=None):
        self.send_response(302)
        self.send_header("Location", location)
        if extra_headers:
            for k, v in extra_headers.items():
                self.send_header(k, v)
        self.end_headers()

    def respond(self, code, content_type, body):
        self.send_response(code)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", len(body))
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        path = urlparse(self.path).path
        qs = parse_qs(urlparse(self.path).query)

        if path == "/manifest.json":
            return self.respond(200, "application/manifest+json", MANIFEST)
        if path == "/sw.js":
            return self.respond(200, "application/javascript", SERVICE_WORKER)
        if path.startswith("/static/"):
            fp = os.path.join(STATIC_DIR, os.path.basename(path))
            if os.path.exists(fp):
                mime = mimetypes.guess_type(fp)[0] or "application/octet-stream"
                return self.respond(200, mime, open(fp, "rb").read())
            return self.respond(404, "text/plain", b"Not found")

        if path == "/login":
            return self.respond(200, "text/html; charset=utf-8", LOGIN_HTML.encode())

        if path == "/debug-env":
            info = {
                "GOOGLE_CLIENT_ID_set": bool(os.environ.get("GOOGLE_CLIENT_ID")),
                "GOOGLE_CLIENT_SECRET_set": bool(os.environ.get("GOOGLE_CLIENT_SECRET")),
                "REDIRECT_URI": os.environ.get("REDIRECT_URI", "NOT SET"),
                "SESSION_SECRET_set": bool(os.environ.get("SESSION_SECRET")),
            }
            return self.respond(200, "application/json", json.dumps(info).encode())

        if path == "/auth/google":
            if not GOOGLE_CLIENT_ID:
                return self.respond(500, "text/plain", b"GOOGLE_CLIENT_ID not configured")
            state = create_state()
            return self.redirect(google_auth_url(state))

        if path == "/auth/callback":
            code = qs.get("code", [None])[0]
            state = qs.get("state", [None])[0]
            if not code or not state or not verify_state(state):
                return self.redirect("/login")
            try:
                tokens = exchange_code(code)
                user_info = get_google_user(tokens["access_token"])
                user = {
                    "id": user_info["sub"],
                    "name": user_info.get("name", ""),
                    "email": user_info.get("email", ""),
                    "picture": user_info.get("picture", ""),
                }
                return self.redirect("/", {"Set-Cookie": self.set_session_cookie(user)})
            except Exception as e:
                print(f"OAuth error: {e}")
                return self.redirect("/login")

        if path == "/api/todos":
            user = self.get_session()
            if not user:
                return self.respond(401, "application/json", b'{"error":"unauthorized"}')
            data = json.dumps(load_todos(user["id"])).encode()
            return self.respond(200, "application/json", data)

        # Main app — require auth
        user = self.get_session()
        if not user:
            return self.redirect("/login")
        return self.respond(200, "text/html; charset=utf-8", build_app_html(user).encode())

    def do_POST(self):
        path = urlparse(self.path).path

        if path == "/auth/logout":
            self.send_response(302)
            self.send_header("Location", "/login")
            self.send_header("Set-Cookie", "session=; HttpOnly; Path=/; Max-Age=0")
            self.end_headers()
            return

        if path == "/api/todos":
            user = self.get_session()
            if not user:
                return self.respond(401, "application/json", b'{"error":"unauthorized"}')
            length = int(self.headers.get("Content-Length", 0))
            body = self.rfile.read(length)
            save_todos(user["id"], json.loads(body))
            return self.respond(200, "application/json", b'{"ok":true}')

        self.respond(404, "text/plain", b"Not found")


if __name__ == "__main__":
    server = HTTPServer(("0.0.0.0", PORT), Handler)
    print(f"Running at http://localhost:{PORT}")
    if not GOOGLE_CLIENT_ID:
        print("WARNING: GOOGLE_CLIENT_ID not set — auth will not work")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nStopped.")
