import json
import os
import hmac
import hashlib
import base64
import secrets
import mimetypes
import urllib.request
import urllib.parse
import uuid as _uuid
from http.server import HTTPServer, BaseHTTPRequestHandler
from http.cookies import SimpleCookie
from urllib.parse import urlparse, parse_qs

# ─── Config ──────────────────────────────────────────────────────────────────
PORT               = int(os.environ.get("PORT", 8090))
MONGODB_URI        = os.environ.get("MONGODB_URI", "")
GOOGLE_CLIENT_ID   = os.environ.get("GOOGLE_CLIENT_ID", "")
GOOGLE_CLIENT_SECRET = os.environ.get("GOOGLE_CLIENT_SECRET", "")
REDIRECT_URI       = os.environ.get("REDIRECT_URI", f"http://localhost:{PORT}/auth/callback")
SESSION_SECRET     = os.environ.get("SESSION_SECRET", secrets.token_hex(32))
ANTHROPIC_API_KEY  = os.environ.get("ANTHROPIC_API_KEY", "")

BASE = os.path.dirname(__file__)
STATIC_DIR    = os.path.join(BASE, "static")
TEMPLATES_DIR = os.path.join(BASE, "templates")
DATA_DIR      = os.path.join(BASE, "userdata")
os.makedirs(DATA_DIR, exist_ok=True)

# ─── Default settings ─────────────────────────────────────────────────────────
DEFAULT_SETTINGS = {
    "language": "en",
    "notifications": {
        "taskReminders": True,
        "dailyDigest": False,
        "taskCompleted": True,
        "overdueTasks": True,
        "weeklyReport": False,
        "notificationSound": True,
        "badgeCount": True,
        "doNotDisturb": False
    }
}

# ─── MongoDB ──────────────────────────────────────────────────────────────────
db = None
DB_STATUS = "local_files"
if MONGODB_URI:
    try:
        from pymongo import MongoClient
        import certifi
        client = MongoClient(MONGODB_URI, tlsCAFile=certifi.where(), serverSelectionTimeoutMS=5000)
        client.admin.command('ping')
        db = client["tododb"]
        DB_STATUS = "mongodb"
        print("✓ MongoDB connected successfully")
    except Exception as e:
        print(f"✗ MongoDB connection failed: {e}")
        db = None
else:
    pass

if DB_STATUS == "local_files":
    print("╔══════════════════════════════════════════════════════════╗")
    print("║  ⚠ WARNING: MongoDB not connected!                      ║")
    print("║  Using local file storage — DATA WILL BE LOST ON DEPLOY  ║")
    print("║  Set MONGODB_URI environment variable to fix this.       ║")
    print("╚══════════════════════════════════════════════════════════╝")

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

def load_settings(user_id):
    if db is not None:
        doc = db["settings"].find_one({"_id": user_id})
        return doc["data"] if doc else DEFAULT_SETTINGS
    path = os.path.join(DATA_DIR, f"{user_id}_settings.json")
    return json.load(open(path)) if os.path.exists(path) else DEFAULT_SETTINGS

def save_settings(user_id, data):
    if db is not None:
        db["settings"].replace_one({"_id": user_id}, {"_id": user_id, "data": data}, upsert=True)
        return
    with open(os.path.join(DATA_DIR, f"{user_id}_settings.json"), "w") as f:
        json.dump(data, f, indent=2)

# ─── Groups helpers ───────────────────────────────────────────────────────────
def new_id():
    return str(_uuid.uuid4())

def load_groups_for_user(user_id):
    """Return all groups where user is an active member."""
    if db is None: return []
    return list(db["groups"].find({"members": {"$elemMatch": {"userId": user_id, "status": "active"}}}))

def load_group(group_id):
    if db is None: return None
    return db["groups"].find_one({"_id": group_id})

def save_group(group):
    if db is None: return
    db["groups"].replace_one({"_id": group["_id"]}, group, upsert=True)

def get_member_role(group, user_id):
    for m in group.get("members", []):
        if m.get("userId") == user_id and m.get("status") == "active":
            return m.get("role")
    return None

def create_notification(user_id, notif_type, group_id, group_name, task_text=None, from_user=None):
    if db is None: return
    if not user_id: return
    db["notifications"].insert_one({
        "_id": new_id(),
        "userId": user_id,
        "type": notif_type,
        "groupId": group_id,
        "groupName": group_name,
        "taskText": task_text,
        "fromUser": from_user,
        "createdAt": int(__import__("time").time() * 1000),
        "read": False,
    })

# ─── Anthropic AI ─────────────────────────────────────────────────────────────
def ai_suggest_next(todos):
    if not ANTHROPIC_API_KEY:
        return {"result": "AI is not configured. Add ANTHROPIC_API_KEY to your environment variables."}
    import anthropic
    client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)
    open_tasks = [t for t in todos if not t.get("done")]
    if not open_tasks:
        return {"result": "All tasks are complete — great work! Add new tasks to get a suggestion."}
    task_list = "\n".join(f"- [{t.get('priority','none')}] {t['text']} (created {t.get('createdAt',0)})" for t in open_tasks[:20])
    message = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=256,
        messages=[{"role": "user", "content": f"Given these open tasks, which one should I tackle next and why? Be concise (2-3 sentences).\n\n{task_list}"}]
    )
    return {"result": message.content[0].text}

def ai_daily_summary(todos):
    if not ANTHROPIC_API_KEY:
        return {"result": "AI is not configured. Add ANTHROPIC_API_KEY to your environment variables."}
    import anthropic
    client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)
    done  = [t for t in todos if t.get("done")]
    open_ = [t for t in todos if not t.get("done")]
    summary_input = f"Done today: {len(done)} tasks. Still open: {len(open_)} tasks.\nCompleted: {', '.join(t['text'] for t in done[:10])}\nOpen: {', '.join(t['text'] for t in open_[:10])}"
    message = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=200,
        messages=[{"role": "user", "content": f"Give a brief, encouraging daily summary for this task list. Keep it to 2-3 sentences.\n\n{summary_input}"}]
    )
    return {"result": message.content[0].text}

def ai_split_task(title, description):
    if not ANTHROPIC_API_KEY:
        return {"subtasks": ["Set up the project", "Research the topic", "Draft the outline", "Review and finalize"]}
    import anthropic
    client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)
    prompt = f"Break this task into 3-6 specific, actionable sub-tasks. Return ONLY a JSON array of strings, nothing else.\n\nTask: {title}"
    if description:
        prompt += f"\nDescription: {description}"
    message = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=300,
        messages=[{"role": "user", "content": prompt}]
    )
    text = message.content[0].text.strip()
    try:
        start = text.index('[')
        end   = text.rindex(']') + 1
        subtasks = json.loads(text[start:end])
        return {"subtasks": subtasks}
    except Exception:
        lines = [l.strip().lstrip('-•*123456789. ') for l in text.split('\n') if l.strip()]
        return {"subtasks": [l for l in lines if l][:6]}

# ─── Session ──────────────────────────────────────────────────────────────────
def sign(data):
    return hmac.new(SESSION_SECRET.encode(), data.encode(), hashlib.sha256).hexdigest()

def create_session(user):
    payload = base64.urlsafe_b64encode(json.dumps(user).encode()).decode()
    return f"{payload}.{sign(payload)}"

def verify_session(token):
    try:
        payload, sig = token.rsplit(".", 1)
        if hmac.compare_digest(sign(payload), sig):
            return json.loads(base64.urlsafe_b64decode(payload))
    except Exception:
        pass
    return None

def create_state():
    s = secrets.token_urlsafe(16)
    return f"{s}.{sign(s)[:16]}"

def verify_state(state_tok):
    try:
        s, sig = state_tok.rsplit(".", 1)
        return hmac.compare_digest(sign(s)[:16], sig)
    except Exception:
        return False

# ─── Google OAuth ─────────────────────────────────────────────────────────────
def request_redirect_uri(handler):
    """Build redirect_uri from the incoming request's Host header so the app
    works on any domain (mytasks.bar, onrender.com, localhost) without needing
    to update the REDIRECT_URI env var each time the domain changes."""
    host = handler.headers.get("Host", "")
    if not host:
        return REDIRECT_URI  # fallback to env var
    is_local = host.startswith("localhost") or host.startswith("127.")
    scheme = "http" if is_local else "https"
    return f"{scheme}://{host}/auth/callback"

def google_auth_url(state_tok, redirect_uri):
    params = urllib.parse.urlencode({
        "client_id": GOOGLE_CLIENT_ID, "redirect_uri": redirect_uri,
        "response_type": "code", "scope": "openid email profile",
        "state": state_tok, "prompt": "select_account",
    })
    return f"https://accounts.google.com/o/oauth2/v2/auth?{params}"

def exchange_code(code, redirect_uri):
    data = urllib.parse.urlencode({
        "code": code, "client_id": GOOGLE_CLIENT_ID,
        "client_secret": GOOGLE_CLIENT_SECRET, "redirect_uri": redirect_uri,
        "grant_type": "authorization_code",
    }).encode()
    req = urllib.request.Request("https://oauth2.googleapis.com/token", data=data)
    with urllib.request.urlopen(req) as r:
        return json.loads(r.read())

def get_google_user(access_token):
    req = urllib.request.Request(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        headers={"Authorization": f"Bearer {access_token}"}
    )
    with urllib.request.urlopen(req) as r:
        return json.loads(r.read())

# ─── Templates ────────────────────────────────────────────────────────────────
def load_template(name):
    path = os.path.join(TEMPLATES_DIR, name)
    with open(path, "r", encoding="utf-8") as f:
        return f.read()

def render_app(user):
    name    = user.get("name", "")
    email   = user.get("email", "")
    picture = user.get("picture", "")
    avatar  = (f'<img class="user-avatar" src="{picture}" referrerpolicy="no-referrer" alt="{name}">'
               if picture else
               f'<div class="user-avatar-fallback">{name[:1].upper()}</div>')
    user_json = json.dumps({"name": name, "email": email, "picture": picture})
    html = load_template("app.html")
    html = (html.replace("{{AVATAR}}", avatar)
                .replace("{{NAME}}", name)
                .replace("{{EMAIL}}", email)
                .replace("{{USER_JSON}}", user_json))
    return html.encode()

# ─── Static assets ────────────────────────────────────────────────────────────
MANIFEST = json.dumps({
    "name": "My Tasks", "short_name": "Tasks",
    "start_url": "/", "display": "standalone",
    "background_color": "#F8F7F4", "theme_color": "#F8F7F4",
    "icons": [
        {"src": "/static/icon-192.png", "sizes": "192x192", "type": "image/png", "purpose": "any maskable"},
        {"src": "/static/icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any maskable"},
    ]
}).encode()

SERVICE_WORKER = b"""
const CACHE = 'tasks-v3';
self.addEventListener('install', e => e.waitUntil(caches.open(CACHE).then(c => c.addAll(['/login', '/static/style.css', '/static/app.js']))));
self.addEventListener('fetch', e => {
  if (e.request.url.includes('/api/') || e.request.url.includes('/auth/')) return;
  e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
});
"""

# ─── Request Handler ──────────────────────────────────────────────────────────
class Handler(BaseHTTPRequestHandler):
    def log_message(self, fmt, *args):
        print(f"  {self.address_string()} — {fmt % args}")

    def get_session(self):
        cookies = SimpleCookie(self.headers.get("Cookie", ""))
        if "session" in cookies:
            return verify_session(cookies["session"].value)
        return None

    def session_cookie(self, user):
        token = create_session(user)
        host = self.headers.get("Host", "")
        is_local = host.startswith("localhost") or host.startswith("127.")
        secure = "" if is_local else "Secure; "
        return f"session={token}; HttpOnly; {secure}SameSite=Lax; Path=/; Max-Age=2592000"

    def ok(self, content_type, body):
        self.send_response(200)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", len(body))
        self.end_headers()
        self.wfile.write(body)

    def redirect(self, location, extra=None):
        self.send_response(302)
        self.send_header("Location", location)
        if extra:
            for k, v in extra.items():
                self.send_header(k, v)
        self.end_headers()

    def do_GET(self):
        path = urlparse(self.path).path
        qs   = parse_qs(urlparse(self.path).query)

        # Static files
        if path == "/manifest.json":
            return self.ok("application/manifest+json", MANIFEST)
        if path == "/sw.js":
            return self.ok("application/javascript", SERVICE_WORKER)
        if path.startswith("/static/"):
            fp = os.path.join(STATIC_DIR, os.path.basename(path))
            if os.path.exists(fp):
                mime = mimetypes.guess_type(fp)[0] or "application/octet-stream"
                with open(fp, "rb") as f:
                    return self.ok(mime, f.read())
            self.send_response(404); self.end_headers(); return

        # Login
        if path == "/login":
            return self.ok("text/html; charset=utf-8", load_template("login.html").encode())

        # OAuth
        if path == "/auth/google":
            if not GOOGLE_CLIENT_ID:
                return self.ok("text/plain", b"GOOGLE_CLIENT_ID not configured")
            redirect_uri = request_redirect_uri(self)
            return self.redirect(google_auth_url(create_state(), redirect_uri))

        if path == "/auth/callback":
            code  = qs.get("code",  [None])[0]
            state_tok = qs.get("state", [None])[0]
            if not code or not state_tok or not verify_state(state_tok):
                return self.redirect("/login")
            try:
                redirect_uri = request_redirect_uri(self)
                tokens    = exchange_code(code, redirect_uri)
                user_info = get_google_user(tokens["access_token"])
                user = {
                    "id":      user_info["sub"],
                    "name":    user_info.get("name", ""),
                    "email":   user_info.get("email", ""),
                    "picture": user_info.get("picture", ""),
                }
                # Check for pending invite cookie
                cookies = SimpleCookie(self.headers.get("Cookie",""))
                invite_token = cookies["pending_invite"].value if "pending_invite" in cookies else None
                if invite_token and db is not None:
                    g = db["groups"].find_one({"members.inviteToken": invite_token})
                    if g:
                        for m in g["members"]:
                            if m.get("inviteToken") == invite_token and m.get("status") == "pending":
                                m["userId"] = user["id"]
                                m["name"] = user.get("name","")
                                m["picture"] = user.get("picture","")
                                m["status"] = "active"
                                m["joinedAt"] = int(__import__("time").time() * 1000)
                                m.pop("inviteToken", None)
                                break
                        save_group(g)
                # Send response manually to support clearing invite cookie
                self.send_response(302)
                self.send_header("Location", "/")
                self.send_header("Set-Cookie", self.session_cookie(user))
                if invite_token:
                    self.send_header("Set-Cookie", "pending_invite=; Path=/; Max-Age=0")
                self.end_headers()
                return
            except Exception as e:
                print(f"OAuth error: {e}")
                return self.redirect("/login")

        # API — require auth
        if path == "/api/health":
            health = {"status": "ok", "database": DB_STATUS}
            if DB_STATUS == "local_files":
                health["warning"] = "Data will be lost on deploy. Set MONGODB_URI to use MongoDB."
            return self.ok("application/json", json.dumps(health).encode())

        # Groups
        if path == "/api/groups":
            user = self.get_session()
            if not user: return self.ok("application/json", b'{"error":"unauthorized"}')
            groups = load_groups_for_user(user["id"])
            result = []
            for g in groups:
                result.append({
                    "_id": g["_id"], "name": g["name"],
                    "description": g.get("description",""),
                    "color": g.get("color","#3B82F6"),
                    "createdBy": g.get("createdBy"),
                    "members": g.get("members",[]),
                    "taskCount": len(g.get("tasks",[])),
                    "doneCount": sum(1 for t in g.get("tasks",[]) if t.get("done")),
                })
            return self.ok("application/json", json.dumps(result).encode())

        if path.startswith("/api/groups/"):
            parts = path.split("/")
            # /api/groups/{id}
            if len(parts) == 4:
                group_id = parts[3]
                user = self.get_session()
                if not user: return self.ok("application/json", b'{"error":"unauthorized"}')
                g = load_group(group_id)
                if not g: return self.ok("application/json", b'{"error":"not found"}')
                role = get_member_role(g, user["id"])
                if not role: return self.ok("application/json", b'{"error":"forbidden"}')
                out = dict(g); out["_id"] = g["_id"]; out["myRole"] = role
                return self.ok("application/json", json.dumps(out).encode())

        # Notifications
        if path == "/api/notifications":
            user = self.get_session()
            if not user: return self.ok("application/json", b'{"error":"unauthorized"}')
            if db is None: return self.ok("application/json", b'[]')
            notifs = list(db["notifications"].find({"userId": user["id"]}).sort("createdAt", -1).limit(50))
            for n in notifs:
                n.pop("_id_obj", None)
                n["_id"] = n.get("_id","")
            return self.ok("application/json", json.dumps(notifs).encode())

        # Invite token handler
        if path.startswith("/invite/"):
            token = path[8:]
            user = self.get_session()
            if db is None:
                return self.ok("text/html; charset=utf-8", b"<p>Database not available</p>")
            g = db["groups"].find_one({"members.inviteToken": token})
            if not g:
                return self.ok("text/html; charset=utf-8", b"<p>Invalid or expired invite link.</p>")
            if not user:
                # Store token in cookie, redirect to login
                self.send_response(302)
                self.send_header("Location", "/login")
                self.send_header("Set-Cookie", f"pending_invite={token}; Path=/; Max-Age=600")
                self.end_headers()
                return
            # Join the group
            for m in g["members"]:
                if m.get("inviteToken") == token and m.get("status") == "pending":
                    m["userId"] = user["id"]
                    m["name"] = user.get("name","")
                    m["picture"] = user.get("picture","")
                    m["status"] = "active"
                    m["joinedAt"] = int(__import__("time").time() * 1000)
                    m.pop("inviteToken", None)
                    break
            save_group(g)
            create_notification(g["createdBy"], "member_joined", g["_id"], g["name"], from_user=user.get("name",""))
            return self.redirect("/")

        if path == "/api/settings":
            user = self.get_session()
            if not user:
                return self.ok("application/json", b'{"error":"unauthorized"}')
            data = json.dumps(load_settings(user["id"])).encode()
            return self.ok("application/json", data)

        if path == "/api/todos":
            user = self.get_session()
            if not user:
                return self.ok("application/json", b'{"error":"unauthorized"}')
            data = json.dumps(load_todos(user["id"])).encode()
            return self.ok("application/json", data)

        # Main app — require auth
        user = self.get_session()
        if not user:
            return self.redirect("/login")
        return self.ok("text/html; charset=utf-8", render_app(user))

    def do_POST(self):
        path = urlparse(self.path).path

        if path == "/auth/logout":
            self.send_response(302)
            self.send_header("Location", "/login")
            self.send_header("Set-Cookie", "session=; HttpOnly; Path=/; Max-Age=0")
            self.end_headers()
            return

        user = self.get_session()

        if path == "/api/todos":
            if not user:
                return self.ok("application/json", b'{"error":"unauthorized"}')
            length = int(self.headers.get("Content-Length", 0))
            body   = self.rfile.read(length)
            save_todos(user["id"], json.loads(body))
            return self.ok("application/json", b'{"ok":true}')

        if path == "/api/settings":
            if not user:
                return self.ok("application/json", b'{"error":"unauthorized"}')
            length = int(self.headers.get("Content-Length", 0))
            body   = json.loads(self.rfile.read(length))
            save_settings(user["id"], body)
            return self.ok("application/json", b'{"ok":true}')

        if path in ("/api/ai/suggest", "/api/ai/summary", "/api/ai/split"):
            if not user:
                return self.ok("application/json", b'{"error":"unauthorized"}')
            length = int(self.headers.get("Content-Length", 0))
            body   = json.loads(self.rfile.read(length))
            try:
                if path == "/api/ai/suggest":
                    result = ai_suggest_next(body.get("todos", []))
                elif path == "/api/ai/summary":
                    result = ai_daily_summary(body.get("todos", []))
                else:
                    result = ai_split_task(body.get("title", ""), body.get("description", ""))
                return self.ok("application/json", json.dumps(result).encode())
            except Exception as e:
                return self.ok("application/json", json.dumps({"error": str(e)}).encode())

        # Groups POST
        if path == "/api/groups":
            if not user: return self.ok("application/json", b'{"error":"unauthorized"}')
            length = int(self.headers.get("Content-Length", 0))
            body = json.loads(self.rfile.read(length))
            group = {
                "_id": new_id(),
                "name": body.get("name","").strip(),
                "description": body.get("description","").strip(),
                "color": body.get("color","#3B82F6"),
                "createdBy": user["id"],
                "createdAt": int(__import__("time").time() * 1000),
                "members": [{
                    "userId": user["id"],
                    "email": user.get("email",""),
                    "name": user.get("name",""),
                    "picture": user.get("picture",""),
                    "role": "admin",
                    "status": "active",
                    "joinedAt": int(__import__("time").time() * 1000),
                }],
                "tasks": [],
            }
            if db is not None:
                db["groups"].insert_one(group)
            return self.ok("application/json", json.dumps({"_id": group["_id"]}).encode())

        if path.startswith("/api/groups/"):
            parts = path.split("/")
            if not user: return self.ok("application/json", b'{"error":"unauthorized"}')
            length = int(self.headers.get("Content-Length", 0))
            body = json.loads(self.rfile.read(length)) if length else {}

            # POST /api/groups/{id}/tasks
            if len(parts) == 5 and parts[4] == "tasks":
                group_id = parts[3]
                g = load_group(group_id)
                if not g: return self.ok("application/json", b'{"error":"not found"}')
                role = get_member_role(g, user["id"])
                if not role: return self.ok("application/json", b'{"error":"forbidden"}')
                assigned_to = body.get("assignedTo", user["id"])
                if role == "member": assigned_to = user["id"]
                task = {
                    "id": new_id(),
                    "text": body.get("text","").strip(),
                    "description": "",
                    "done": False,
                    "priority": body.get("priority","low"),
                    "createdAt": int(__import__("time").time() * 1000),
                    "completedAt": None,
                    "createdBy": user["id"],
                    "assignedTo": assigned_to,
                    "subtasks": [],
                }
                g["tasks"].insert(0, task)
                save_group(g)
                if assigned_to and assigned_to != user["id"]:
                    create_notification(assigned_to, "task_assigned", group_id, g["name"],
                        task_text=task["text"], from_user=user.get("name",""))
                return self.ok("application/json", json.dumps(task).encode())

            # POST /api/groups/{id}/invite
            if len(parts) == 5 and parts[4] == "invite":
                group_id = parts[3]
                g = load_group(group_id)
                if not g: return self.ok("application/json", b'{"error":"not found"}')
                role = get_member_role(g, user["id"])
                if role != "admin": return self.ok("application/json", b'{"error":"forbidden"}')
                email = body.get("email","").strip().lower()
                invite_role = body.get("role","member")
                token = new_id()
                for m in g["members"]:
                    if m.get("email","").lower() == email:
                        return self.ok("application/json", b'{"error":"already invited"}')
                g["members"].append({
                    "userId": None,
                    "email": email,
                    "name": email.split("@")[0],
                    "picture": None,
                    "role": invite_role,
                    "status": "pending",
                    "joinedAt": None,
                    "inviteToken": token,
                })
                save_group(g)
                host = self.headers.get("Host","")
                is_local = host.startswith("localhost") or host.startswith("127.")
                scheme = "http" if is_local else "https"
                invite_url = f"{scheme}://{host}/invite/{token}"
                smtp_user = os.environ.get("SMTP_USER","")
                smtp_pass = os.environ.get("SMTP_PASS","")
                if smtp_user and smtp_pass:
                    try:
                        import smtplib
                        from email.mime.text import MIMEText
                        from email.mime.multipart import MIMEMultipart
                        msg = MIMEMultipart("alternative")
                        msg["Subject"] = f'{user.get("name","")} invited you to join "{g["name"]}" on MyTasks'
                        msg["From"] = f"MyTasks <{smtp_user}>"
                        msg["To"] = email
                        html_body = f"""<div style="font-family:sans-serif;max-width:500px;margin:0 auto;padding:40px 24px;">
                          <h1 style="color:#6366F1">MyTasks</h1>
                          <div style="background:#F8F7F4;border-radius:16px;padding:32px;text-align:center;">
                            <h2>{g["name"]}</h2>
                            <p>{user.get("name","")} wants you to join their group</p>
                            <a href="{invite_url}" style="display:inline-block;background:#6366F1;color:white;text-decoration:none;padding:14px 32px;border-radius:12px;font-weight:600">Join Group</a>
                          </div></div>"""
                        msg.attach(MIMEText(html_body, "html"))
                        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as srv:
                            srv.login(smtp_user, smtp_pass)
                            srv.send_message(msg)
                    except Exception as e:
                        print(f"SMTP error: {e}")
                return self.ok("application/json", json.dumps({"token": token, "inviteUrl": invite_url}).encode())

        # POST /api/notifications/read
        if path == "/api/notifications/read":
            if not user or db is None: return self.ok("application/json", b'{"ok":true}')
            length = int(self.headers.get("Content-Length", 0))
            body = json.loads(self.rfile.read(length)) if length else {}
            if body.get("all"):
                db["notifications"].update_many({"userId": user["id"]}, {"$set": {"read": True}})
            elif body.get("ids"):
                db["notifications"].update_many({"_id": {"$in": body["ids"]}}, {"$set": {"read": True}})
            return self.ok("application/json", b'{"ok":true}')

        self.send_response(404); self.end_headers()

    def do_PUT(self):
        path = urlparse(self.path).path
        parts = path.split("/")
        user = self.get_session()
        if not user:
            self.ok("application/json", b'{"error":"unauthorized"}'); return
        length = int(self.headers.get("Content-Length", 0))
        body = json.loads(self.rfile.read(length)) if length else {}

        # PUT /api/groups/{id}
        if len(parts) == 4 and parts[1]=="api" and parts[2]=="groups":
            g = load_group(parts[3])
            if not g: return self.ok("application/json", b'{"error":"not found"}')
            if get_member_role(g, user["id"]) != "admin":
                return self.ok("application/json", b'{"error":"forbidden"}')
            if "name" in body: g["name"] = body["name"]
            if "description" in body: g["description"] = body["description"]
            if "color" in body: g["color"] = body["color"]
            save_group(g)
            return self.ok("application/json", b'{"ok":true}')

        # PUT /api/groups/{id}/tasks/{taskId}
        if len(parts) == 6 and parts[1]=="api" and parts[2]=="groups" and parts[4]=="tasks":
            g = load_group(parts[3])
            if not g: return self.ok("application/json", b'{"error":"not found"}')
            role = get_member_role(g, user["id"])
            if not role: return self.ok("application/json", b'{"error":"forbidden"}')
            for t in g["tasks"]:
                if t["id"] == parts[5]:
                    if "text" in body: t["text"] = body["text"]
                    if "description" in body: t["description"] = body["description"]
                    if "priority" in body: t["priority"] = body["priority"]
                    if "subtasks" in body: t["subtasks"] = body["subtasks"]
                    if "done" in body:
                        t["done"] = body["done"]
                        t["completedAt"] = int(__import__("time").time()*1000) if body["done"] else None
                        if body["done"]:
                            for m in g["members"]:
                                if m.get("status")=="active" and m.get("userId") != user["id"]:
                                    create_notification(m["userId"],"task_completed",g["_id"],g["name"],
                                        task_text=t["text"],from_user=user.get("name",""))
                    if "assignedTo" in body and role in ("admin","manager"):
                        old = t.get("assignedTo")
                        t["assignedTo"] = body["assignedTo"]
                        if body["assignedTo"] and body["assignedTo"] != user["id"] and body["assignedTo"] != old:
                            create_notification(body["assignedTo"],"task_assigned",g["_id"],g["name"],
                                task_text=t["text"],from_user=user.get("name",""))
                    break
            save_group(g)
            return self.ok("application/json", b'{"ok":true}')

        # PUT /api/groups/{id}/members/{userId}
        if len(parts) == 6 and parts[1]=="api" and parts[2]=="groups" and parts[4]=="members":
            g = load_group(parts[3])
            if not g: return self.ok("application/json", b'{"error":"not found"}')
            if get_member_role(g, user["id"]) != "admin":
                return self.ok("application/json", b'{"error":"forbidden"}')
            target_id = parts[5]
            for m in g["members"]:
                if m.get("userId") == target_id:
                    m["role"] = body.get("role", m["role"])
                    break
            save_group(g)
            return self.ok("application/json", b'{"ok":true}')

        self.send_response(404); self.end_headers()

    def do_DELETE(self):
        path = urlparse(self.path).path
        parts = path.split("/")
        user = self.get_session()
        if not user:
            self.ok("application/json", b'{"error":"unauthorized"}'); return

        # DELETE /api/groups/{id}
        if len(parts) == 4 and parts[1]=="api" and parts[2]=="groups":
            g = load_group(parts[3])
            if not g: return self.ok("application/json", b'{"error":"not found"}')
            if get_member_role(g, user["id"]) != "admin":
                return self.ok("application/json", b'{"error":"forbidden"}')
            if db is not None: db["groups"].delete_one({"_id": parts[3]})
            return self.ok("application/json", b'{"ok":true}')

        # DELETE /api/groups/{id}/tasks/{taskId}
        if len(parts) == 6 and parts[1]=="api" and parts[2]=="groups" and parts[4]=="tasks":
            g = load_group(parts[3])
            if not g: return self.ok("application/json", b'{"error":"not found"}')
            role = get_member_role(g, user["id"])
            if not role: return self.ok("application/json", b'{"error":"forbidden"}')
            task = next((t for t in g["tasks"] if t["id"]==parts[5]), None)
            if task:
                if role in ("admin","manager") or task.get("createdBy")==user["id"]:
                    g["tasks"] = [t for t in g["tasks"] if t["id"]!=parts[5]]
            save_group(g)
            return self.ok("application/json", b'{"ok":true}')

        # DELETE /api/groups/{id}/members/{userId}
        if len(parts) == 6 and parts[1]=="api" and parts[2]=="groups" and parts[4]=="members":
            g = load_group(parts[3])
            if not g: return self.ok("application/json", b'{"error":"not found"}')
            role = get_member_role(g, user["id"])
            target_id = parts[5]
            if target_id != user["id"] and role != "admin":
                return self.ok("application/json", b'{"error":"forbidden"}')
            g["members"] = [m for m in g["members"] if m.get("userId") != target_id]
            for t in g["tasks"]:
                if t.get("assignedTo") == target_id: t["assignedTo"] = None
            save_group(g)
            return self.ok("application/json", b'{"ok":true}')

        self.send_response(404); self.end_headers()


if __name__ == "__main__":
    server = HTTPServer(("0.0.0.0", PORT), Handler)
    print(f"✓ Running at http://localhost:{PORT}")
    if not GOOGLE_CLIENT_ID:   print("⚠  GOOGLE_CLIENT_ID not set")
    if not ANTHROPIC_API_KEY:  print("⚠  ANTHROPIC_API_KEY not set — AI features disabled")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nStopped.")
