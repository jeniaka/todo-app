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
    avatar = f'<img src="{picture}" referrerpolicy="no-referrer" style="width:34px;height:34px;border-radius:50%;border:2px solid rgba(255,255,255,0.25);flex-shrink:0">' if picture else f'<div style="width:34px;height:34px;border-radius:50%;background:linear-gradient(135deg,#007AFF,#BF5AF2);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.9rem;flex-shrink:0">{name[:1].upper()}</div>'

    return f"""<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover"/>
  <meta name="mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  <meta name="theme-color" content="#08000f">
  <link rel="manifest" href="/manifest.json">
  <link rel="apple-touch-icon" href="/static/icon-192.png">
  <title>My Tasks</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after {{ box-sizing: border-box; margin: 0; padding: 0; }}
    :root {{
      --accent: #7B5CFA;
      --accent2: #E040FB;
      --accent3: #FF375F;
      --green: #00E096;
      --card-bg: rgba(255,255,255,0.07);
      --card-border: rgba(255,255,255,0.12);
      --text: #F0EEFF;
      --text-sub: rgba(240,238,255,0.5);
      --text-muted: rgba(240,238,255,0.25);
      --blur: blur(24px);
      --radius: 20px;
      --safe-top: env(safe-area-inset-top,0px);
      --safe-bottom: env(safe-area-inset-bottom,0px);
    }}
    html {{ height:100%; }}
    body {{
      font-family: 'Heebo', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      min-height: 100dvh;
      background: #08000f;
      color: var(--text);
      overflow-x: hidden;
      padding-bottom: calc(32px + var(--safe-bottom));
    }}

    /* ── Animated background ── */
    .bg {{
      position: fixed; inset: 0; z-index: 0; overflow: hidden;
    }}
    .bg-orb {{
      position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.55;
      animation: drift 18s ease-in-out infinite alternate;
    }}
    .bg-orb:nth-child(1) {{ width:60vw; height:60vw; top:-15%; left:-15%; background: radial-gradient(circle, #5B2FD4, transparent 70%); animation-delay:0s; }}
    .bg-orb:nth-child(2) {{ width:50vw; height:50vw; top:10%; right:-10%; background: radial-gradient(circle, #1565C0, transparent 70%); animation-delay:-6s; }}
    .bg-orb:nth-child(3) {{ width:45vw; height:45vw; bottom:-10%; left:20%; background: radial-gradient(circle, #AD1457, transparent 70%); animation-delay:-12s; }}
    @keyframes drift {{ 0% {{ transform: translate(0,0) scale(1); }} 100% {{ transform: translate(4%, 6%) scale(1.08); }} }}

    /* ── Top navigation bar ── */
    .navbar {{
      position: sticky; top: 0; z-index: 100;
      padding: calc(12px + var(--safe-top)) 20px 12px;
      display: flex; align-items: center; justify-content: space-between;
      background: rgba(8,0,15,0.6);
      backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
      border-bottom: 1px solid var(--card-border);
    }}
    .nav-left {{ display: flex; align-items: center; gap: 10px; }}
    .nav-right {{ display: flex; align-items: center; gap: 8px; }}
    .user-pill {{
      display: flex; align-items: center; gap: 8px;
      background: var(--card-bg); border: 1px solid var(--card-border);
      border-radius: 99px; padding: 4px 14px 4px 4px;
    }}
    .user-name {{
      font-size: 0.82rem; font-weight: 600; color: var(--text);
      max-width: 120px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    }}
    .lang-toggle {{
      display: flex; align-items: center;
      background: var(--card-bg); border: 1px solid var(--card-border);
      border-radius: 99px; padding: 3px; gap: 2px;
    }}
    .lang-toggle button {{
      padding: 5px 13px; border-radius: 99px; border: none;
      background: transparent; color: var(--text-sub);
      font-size: 0.78rem; font-weight: 700; font-family: inherit;
      cursor: pointer; transition: all 0.22s cubic-bezier(0.34,1.56,0.64,1);
      -webkit-tap-highlight-color: transparent;
    }}
    .lang-toggle button.active {{
      background: linear-gradient(135deg, var(--accent), var(--accent2));
      color: #fff; box-shadow: 0 2px 10px rgba(123,92,250,0.45);
    }}
    .logout-btn {{
      background: none; border: none; color: var(--text-sub);
      font-size: 0.78rem; font-family: inherit; font-weight: 500;
      cursor: pointer; padding: 7px 12px; border-radius: 99px;
      transition: all 0.2s; -webkit-tap-highlight-color: transparent;
      border: 1px solid transparent;
    }}
    .logout-btn:hover {{ color: var(--accent3); border-color: rgba(255,55,95,0.3); background: rgba(255,55,95,0.08); }}

    /* ── Main content ── */
    .main {{
      position: relative; z-index: 1;
      max-width: 600px; margin: 0 auto;
      padding: 0 16px;
    }}

    /* ── Hero section (always centered) ── */
    .hero {{
      text-align: center;
      padding: 36px 0 28px;
    }}
    .hero-icon {{ font-size: 2.6rem; margin-bottom: 12px; display: block; }}
    h1 {{
      font-size: clamp(2rem, 7vw, 3rem);
      font-weight: 900;
      letter-spacing: -2px;
      line-height: 1;
      background: linear-gradient(135deg, #fff 30%, rgba(180,150,255,0.85) 100%);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
      margin-bottom: 8px;
    }}
    .subtitle {{
      color: var(--text-sub); font-size: 0.88rem; font-weight: 400;
    }}

    /* ── Progress ── */
    .progress-section {{
      margin-bottom: 24px;
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: var(--radius);
      padding: 16px 20px;
      backdrop-filter: var(--blur); -webkit-backdrop-filter: var(--blur);
    }}
    .progress-labels {{
      display: flex; justify-content: space-between; align-items: center;
      margin-bottom: 10px; font-size: 0.8rem; color: var(--text-sub); font-weight: 500;
    }}
    .progress-pct {{ font-size: 1.1rem; font-weight: 800; color: var(--text); }}
    .progress-track {{
      height: 6px; background: rgba(255,255,255,0.08); border-radius: 99px; overflow: hidden;
    }}
    .progress-fill {{
      height: 100%; border-radius: 99px;
      background: linear-gradient(90deg, var(--accent), var(--accent2));
      transition: width 0.6s cubic-bezier(0.34,1.1,0.64,1);
      box-shadow: 0 0 12px rgba(123,92,250,0.6);
    }}

    /* ── Add form ── */
    .add-form {{
      display: flex; gap: 10px; margin-bottom: 16px;
    }}
    .add-form input {{
      flex: 1; min-width: 0;
      padding: 16px 20px;
      border-radius: var(--radius);
      border: 1.5px solid var(--card-border);
      background: var(--card-bg);
      backdrop-filter: var(--blur); -webkit-backdrop-filter: var(--blur);
      color: var(--text); font-size: 16px; font-family: inherit;
      outline: none; transition: border-color 0.2s, box-shadow 0.2s;
      -webkit-appearance: none;
    }}
    .add-form input::placeholder {{ color: var(--text-muted); }}
    .add-form input:focus {{
      border-color: var(--accent);
      box-shadow: 0 0 0 3px rgba(123,92,250,0.2);
    }}
    .add-form button {{
      padding: 16px 22px; border-radius: var(--radius); border: none;
      background: linear-gradient(135deg, var(--accent), var(--accent2));
      color: #fff; font-size: 0.95rem; font-weight: 700; font-family: inherit;
      cursor: pointer; flex-shrink: 0;
      box-shadow: 0 4px 20px rgba(123,92,250,0.4);
      transition: transform 0.15s, box-shadow 0.15s;
      -webkit-tap-highlight-color: transparent; touch-action: manipulation;
    }}
    .add-form button:active {{ transform: scale(0.96); }}
    @media (hover:hover) {{ .add-form button:hover {{ transform: translateY(-2px); box-shadow: 0 8px 28px rgba(123,92,250,0.55); }} }}

    /* ── Segmented filter ── */
    .filters-wrap {{
      background: var(--card-bg); border: 1px solid var(--card-border);
      border-radius: var(--radius); padding: 5px;
      display: flex; gap: 4px; margin-bottom: 16px;
      backdrop-filter: var(--blur); -webkit-backdrop-filter: var(--blur);
    }}
    .filters-wrap button {{
      flex: 1; padding: 9px 8px; border-radius: 14px; border: none;
      background: transparent; color: var(--text-sub);
      font-size: 0.82rem; font-weight: 600; font-family: inherit;
      cursor: pointer; transition: all 0.22s cubic-bezier(0.34,1.3,0.64,1);
      -webkit-tap-highlight-color: transparent;
    }}
    .filters-wrap button.active {{
      background: linear-gradient(135deg, rgba(123,92,250,0.8), rgba(224,64,251,0.7));
      color: #fff; box-shadow: 0 2px 12px rgba(123,92,250,0.4);
    }}

    /* ── Todo list ── */
    .todo-list {{ display: flex; flex-direction: column; gap: 8px; }}
    .todo-item {{
      display: flex; align-items: center; gap: 14px;
      padding: 16px 18px;
      background: var(--card-bg);
      backdrop-filter: var(--blur); -webkit-backdrop-filter: var(--blur);
      border-radius: var(--radius); border: 1.5px solid var(--card-border);
      transition: transform 0.2s, box-shadow 0.2s, opacity 0.3s, border-color 0.2s;
      animation: slideIn 0.28s cubic-bezier(0.34,1.4,0.64,1);
    }}
    @keyframes slideIn {{ from {{ opacity:0; transform:translateY(10px) scale(0.98); }} to {{ opacity:1; transform:none; }} }}
    @media (hover:hover) {{ .todo-item:hover {{ transform: translateY(-2px); box-shadow: 0 10px 36px rgba(0,0,0,0.35); border-color: rgba(123,92,250,0.35); }} }}
    .todo-item.done {{ opacity: 0.35; }}

    /* Custom checkbox */
    .check-wrap {{ flex-shrink: 0; width: 26px; height: 26px; position: relative; cursor: pointer; }}
    .check-wrap input {{ position: absolute; opacity: 0; width: 0; height: 0; }}
    .check-box {{
      width: 26px; height: 26px; border-radius: 50%;
      border: 2px solid rgba(255,255,255,0.25);
      display: flex; align-items: center; justify-content: center;
      transition: all 0.25s cubic-bezier(0.34,1.56,0.64,1);
      background: rgba(255,255,255,0.04);
    }}
    .check-wrap input:checked + .check-box {{
      background: linear-gradient(135deg, var(--green), #00b96b);
      border-color: transparent;
      box-shadow: 0 0 16px rgba(0,224,150,0.5);
    }}
    .check-box svg {{ opacity:0; transform:scale(0.4); transition: all 0.2s cubic-bezier(0.34,1.56,0.64,1); }}
    .check-wrap input:checked + .check-box svg {{ opacity:1; transform:scale(1); }}

    .todo-text {{
      flex: 1; font-size: 0.97rem; font-weight: 400; color: var(--text);
      word-break: break-word; line-height: 1.5;
    }}
    .todo-item.done .todo-text {{ text-decoration: line-through; text-decoration-color: rgba(255,255,255,0.3); }}

    .edit-input {{
      flex: 1; min-width: 0;
      background: rgba(123,92,250,0.1); border: 1.5px solid var(--accent);
      border-radius: 10px; color: var(--text); font-size: 16px; font-family: inherit;
      outline: none; padding: 5px 12px;
      box-shadow: 0 0 0 3px rgba(123,92,250,0.15);
      -webkit-appearance: none;
    }}
    .btn-icon {{
      background: none; border: none; cursor: pointer;
      color: rgba(255,255,255,0.22); padding: 7px; border-radius: 10px;
      transition: color 0.2s, background 0.2s, transform 0.15s;
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
      -webkit-tap-highlight-color: transparent;
    }}
    @media (hover:hover) {{
      .btn-icon:hover {{ color: var(--text); background: rgba(255,255,255,0.1); transform: scale(1.18); }}
      .btn-delete:hover {{ color: var(--accent3); background: rgba(255,55,95,0.12); }}
    }}
    .btn-icon:active {{ transform: scale(0.88); }}

    /* ── Empty state ── */
    .empty {{
      text-align: center; color: var(--text-muted); padding: 56px 0;
      display: flex; flex-direction: column; align-items: center; gap: 12px;
    }}
    .empty-icon {{ font-size: 3rem; opacity: 0.35; }}
    .empty-title {{ font-size: 1rem; font-weight: 600; color: var(--text-sub); }}
    .empty-sub {{ font-size: 0.82rem; }}

    /* ── Stats bar ── */
    .stats {{
      margin-top: 18px; display: flex; justify-content: space-between; align-items: center;
      color: var(--text-sub); font-size: 0.8rem; flex-wrap: wrap; gap: 8px;
    }}
    .clear-btn {{
      background: none; border: none; color: var(--text-sub); font-size: 0.8rem;
      font-family: inherit; cursor: pointer; padding: 6px 12px; border-radius: 8px;
      transition: all 0.2s; -webkit-tap-highlight-color: transparent;
    }}
    .clear-btn:hover {{ color: var(--accent3); background: rgba(255,55,95,0.1); }}

    /* ── Mobile ── */
    @media (max-width:420px) {{
      .user-name {{ display: none; }}
      .navbar {{ padding-left: 14px; padding-right: 14px; }}
      .main {{ padding: 0 12px; }}
      .todo-item {{ padding: 14px; gap: 10px; }}
    }}

    /* ── RTL support ── */
    /* Navbar: reverse order so lang-toggle is on the right, user on left */
    [dir="rtl"] .navbar {{ flex-direction: row-reverse; }}
    [dir="rtl"] .nav-left {{ flex-direction: row-reverse; }}
    [dir="rtl"] .nav-right {{ flex-direction: row-reverse; }}
    /* Hero stays centered — no change needed */
    /* Add form: button on left side in RTL */
    [dir="rtl"] .add-form {{ flex-direction: row-reverse; }}
    [dir="rtl"] .add-form input {{ text-align: right; }}
    /* Filters: right-to-left order */
    [dir="rtl"] .filters-wrap {{ flex-direction: row-reverse; }}
    /* Todo items: checkbox on right, buttons on left */
    [dir="rtl"] .todo-item {{ flex-direction: row-reverse; }}
    [dir="rtl"] .todo-text {{ text-align: right; }}
    [dir="rtl"] .edit-input {{ text-align: right; direction: rtl; }}
    /* Stats: reverse */
    [dir="rtl"] .stats {{ flex-direction: row-reverse; }}
    [dir="rtl"] .progress-labels {{ flex-direction: row-reverse; }}
  </style>
</head>
<body>
<div class="bg">
  <div class="bg-orb"></div>
  <div class="bg-orb"></div>
  <div class="bg-orb"></div>
</div>

<!-- Sticky navbar -->
<nav class="navbar">
  <div class="nav-left">
    <div class="user-pill">
      {avatar}
      <span class="user-name">{name}</span>
    </div>
  </div>
  <div class="nav-right">
    <div class="lang-toggle">
      <button class="active" onclick="setLang('en')">EN</button>
      <button onclick="setLang('he')">עב</button>
    </div>
    <form method="post" action="/auth/logout" style="margin:0">
      <button class="logout-btn" type="submit" id="logoutBtn">Sign out</button>
    </form>
  </div>
</nav>

<div class="main">
  <!-- Centered hero -->
  <div class="hero">
    <span class="hero-icon">✦</span>
    <h1 id="title">My Tasks</h1>
    <p class="subtitle" id="date"></p>
  </div>

  <!-- Progress card -->
  <div class="progress-section">
    <div class="progress-labels">
      <span id="statsText">0 remaining</span>
      <span class="progress-pct" id="progressPct">0%</span>
    </div>
    <div class="progress-track">
      <div class="progress-fill" id="progressBar" style="width:0%"></div>
    </div>
  </div>

  <!-- Add form -->
  <form class="add-form" id="addForm">
    <input id="newTodo" type="text" autocomplete="off"/>
    <button type="submit" id="addBtn">+ Add</button>
  </form>

  <!-- Segmented filters -->
  <div class="filters-wrap">
    <button class="active" data-filter="all" onclick="setFilter('all')" id="fAll">All</button>
    <button data-filter="active" onclick="setFilter('active')" id="fActive">Active</button>
    <button data-filter="done" onclick="setFilter('done')" id="fDone">Done</button>
  </div>

  <!-- Task list -->
  <div class="todo-list" id="list"></div>

  <!-- Bottom stats -->
  <div class="stats">
    <span id="clearInfo"></span>
    <button class="clear-btn" id="clearBtn" onclick="clearDone()">Clear completed</button>
  </div>
</div>

<script>
  const T = {{
    en: {{
      title:'My Tasks', placeholder:'What needs to be done?', add:'Add',
      all:'All', active:'Active', done:'Done',
      remaining: n => n === 1 ? '1 task left' : `${{n}} tasks left`,
      completed: n => `${{n}} done`,
      clear:'Clear completed', empty:'All clear!', emptySub:'Add a task above to get started.',
      logout: 'Sign out'
    }},
    he: {{
      title:'המשימות שלי', placeholder:'מה צריך לעשות?', add:'הוסף',
      all:'הכל', active:'פעיל', done:'הושלם',
      remaining: n => `נותרו ${{n}} משימות`,
      completed: n => `${{n}} הושלמו`,
      clear:'נקה שהושלמו', empty:'הכל נקי!', emptySub:'הוסף משימה כדי להתחיל.',
      logout: 'התנתק'
    }}
  }};

  let todos = [], filter = 'all', lang = 'en';

  function setLang(l) {{
    lang = l;
    document.documentElement.lang = l;
    document.documentElement.dir = l === 'he' ? 'rtl' : 'ltr';
    document.querySelectorAll('.lang-toggle button').forEach((b,i) =>
      b.classList.toggle('active', (i===0 && l==='en') || (i===1 && l==='he')));
    applyT(); render();
  }}

  function applyT() {{
    const t = T[lang];
    document.getElementById('title').textContent = t.title;
    document.getElementById('newTodo').placeholder = t.placeholder;
    document.getElementById('addBtn').textContent = t.add;
    document.getElementById('fAll').textContent = t.all;
    document.getElementById('fActive').textContent = t.active;
    document.getElementById('fDone').textContent = t.done;
    document.getElementById('clearBtn').textContent = t.clear;
    document.getElementById('logoutBtn').textContent = t.logout;
    const locale = lang === 'he' ? 'he-IL' : 'en-US';
    document.getElementById('date').textContent = new Date().toLocaleDateString(locale,
      {{weekday:'long', year:'numeric', month:'long', day:'numeric'}});
  }}

  async function load() {{
    todos = await (await fetch('/api/todos')).json();
    applyT(); render();
  }}

  async function saveTodos() {{
    await fetch('/api/todos', {{
      method: 'POST',
      headers: {{'Content-Type': 'application/json'}},
      body: JSON.stringify(todos)
    }});
  }}

  function esc(s) {{
    return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }}

  function render() {{
    const t = T[lang];
    const visible = todos.filter(x => filter==='all' || (filter==='done' ? x.done : !x.done));
    const list = document.getElementById('list');

    if (!visible.length) {{
      list.innerHTML = `<div class="empty">
        <div class="empty-icon">${{filter==='done' ? '🎉' : '✦'}}</div>
        <div class="empty-title">${{t.empty}}</div>
        <div class="empty-sub">${{t.emptySub}}</div>
      </div>`;
    }} else {{
      list.innerHTML = visible.map(x => `
        <div class="todo-item ${{x.done ? 'done' : ''}}" id="item-${{x.id}}">
          <label class="check-wrap">
            <input type="checkbox" ${{x.done ? 'checked' : ''}} onchange="toggle(${{x.id}})"/>
            <div class="check-box">
              <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
                <path d="M1 4L4 7.5L10 1" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
          </label>
          <span class="todo-text" ondblclick="startEdit(${{x.id}})">${{esc(x.text)}}</span>
          <button class="btn-icon" onclick="startEdit(${{x.id}})" title="Edit">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </button>
          <button class="btn-icon btn-delete" onclick="del(${{x.id}})" title="Delete">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
              <path d="M10 11v6"/><path d="M14 11v6"/>
              <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
            </svg>
          </button>
        </div>`).join('');
    }}

    const doneCount = todos.filter(x => x.done).length;
    const pct = todos.length ? Math.round(doneCount / todos.length * 100) : 0;
    document.getElementById('progressBar').style.width = pct + '%';
    document.getElementById('progressPct').textContent = pct + '%';
    document.getElementById('statsText').textContent = t.remaining(todos.length - doneCount) + ' · ' + t.completed(doneCount);
  }}

  document.getElementById('addForm').onsubmit = async e => {{
    e.preventDefault();
    const inp = document.getElementById('newTodo');
    const text = inp.value.trim();
    if (!text) return;
    todos.unshift({{ id: Date.now(), text, done: false }});
    inp.value = '';
    await saveTodos(); render();
  }};

  async function toggle(id) {{
    todos = todos.map(t => t.id === id ? {{...t, done: !t.done}} : t);
    await saveTodos(); render();
  }}

  async function del(id) {{
    const el = document.getElementById('item-' + id);
    if (el) {{ el.style.transition = 'opacity 0.18s, transform 0.18s'; el.style.opacity = '0'; el.style.transform = 'scale(0.94)'; }}
    await new Promise(r => setTimeout(r, 170));
    todos = todos.filter(t => t.id !== id);
    await saveTodos(); render();
  }}

  function startEdit(id) {{
    const item = document.getElementById('item-' + id);
    const span = item.querySelector('.todo-text');
    const todo = todos.find(t => t.id === id);
    const inp = document.createElement('input');
    inp.className = 'edit-input';
    inp.value = todo.text;
    inp.dir = document.documentElement.dir;
    span.replaceWith(inp);
    inp.focus(); inp.select();
    const finish = async () => {{
      const val = inp.value.trim();
      if (val && val !== todo.text) {{
        todos = todos.map(t => t.id === id ? {{...t, text: val}} : t);
        await saveTodos();
      }}
      render();
    }};
    inp.onblur = finish;
    inp.onkeydown = e => {{
      if (e.key === 'Enter') inp.blur();
      if (e.key === 'Escape') {{ inp.value = todo.text; inp.blur(); }}
    }};
  }}

  async function clearDone() {{
    todos = todos.filter(t => !t.done);
    await saveTodos(); render();
  }}

  function setFilter(f) {{
    filter = f;
    document.querySelectorAll('.filters-wrap button').forEach(b => b.classList.toggle('active', b.dataset.filter === f));
    render();
  }}

  if ('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js').catch(() => {{}});
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
