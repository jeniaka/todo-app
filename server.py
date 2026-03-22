import json
import os
import re
import hmac
import hashlib
import base64
import secrets
import mimetypes
import smtplib
import urllib.request
import urllib.parse
import uuid as _uuid
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
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

# ─── SMTP / Email ─────────────────────────────────────────────────────────────
SMTP_HOST = os.environ.get("SMTP_HOST", "")
SMTP_PORT = int(os.environ.get("SMTP_PORT", "587"))
SMTP_USER = os.environ.get("SMTP_USER", "")
SMTP_PASS = os.environ.get("SMTP_PASS", "")
SMTP_FROM = os.environ.get("SMTP_FROM", "noreply@mytasks.bar")

def smtp_configured():
    return bool(SMTP_HOST and SMTP_USER and SMTP_PASS)

def send_email(to_email, subject, html_body):
    """Send an HTML email via Brevo SMTP. Returns True on success, False on failure."""
    if not smtp_configured():
        print(f"⚠ SMTP not configured — cannot send email to {to_email}")
        return False
    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"]    = f"MyTasks <{SMTP_FROM}>"
        msg["To"]      = to_email
        msg["Reply-To"] = SMTP_FROM
        msg.attach(MIMEText(html_body, "html", "utf-8"))
        with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
            server.ehlo()
            server.starttls()
            server.login(SMTP_USER, SMTP_PASS)
            server.send_message(msg)
        print(f"✓ Email sent to {to_email}")
        return True
    except Exception as e:
        print(f"✗ Email failed to {to_email}: {e}")
        return False

def build_email(title, body_html, cta_text=None, cta_url=None, footer_note=None):
    """Reusable branded email template (table layout + inline CSS for email clients)."""
    cta_block = ""
    if cta_text and cta_url:
        cta_block = f"""
        <tr><td style="padding:0 32px 28px;text-align:center;">
          <a href="{cta_url}" style="display:inline-block;background:#2563EB;color:#FFFFFF;text-decoration:none;padding:14px 40px;border-radius:12px;font-weight:600;font-size:15px;letter-spacing:0.01em;">{cta_text}</a>
        </td></tr>"""
    footer_text = footer_note or "If you didn't expect this email, you can safely ignore it."
    return f"""<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>{title}</title></head>
<body style="margin:0;padding:0;background-color:#F2F1ED;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F2F1ED;padding:40px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background:#FFFFFF;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.06);">

        <!-- Header -->
        <tr><td style="background:linear-gradient(135deg,#1A1A1A 0%,#2D2D2D 100%);padding:36px 32px;text-align:center;">
          <h1 style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:28px;font-weight:400;color:#FFFFFF;letter-spacing:-0.5px;">MyTasks</h1>
          <p style="margin:8px 0 0 0;font-size:13px;color:rgba(255,255,255,0.5);">Collaborative Task Management</p>
        </td></tr>

        <!-- Body -->
        <tr><td style="padding:36px 32px 8px;">
          {body_html}
        </td></tr>

        <!-- CTA -->
        {cta_block}

        <!-- Footer -->
        <tr><td style="padding:20px 32px;border-top:1px solid #F0F0F0;text-align:center;">
          <p style="margin:0;font-size:12px;color:#BBBBBB;">
            Sent from <a href="https://www.mytasks.bar" style="color:#2563EB;text-decoration:none;">mytasks.bar</a>
          </p>
          <p style="margin:6px 0 0 0;font-size:11px;color:#D0D0D0;">{footer_text}</p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>"""

def build_invite_email(inviter_name, inviter_picture, group_name, group_color, invite_url):
    avatar_html = ""
    if inviter_picture:
        avatar_html = f'<img src="{inviter_picture}" width="52" height="52" style="border-radius:50%;display:block;margin:0 auto 12px;" alt="{inviter_name}">'
    body = f"""
    <div style="text-align:center;margin-bottom:24px;">
      {avatar_html}
      <p style="margin:0;font-size:15px;color:#6B6B6B;">
        <strong style="color:#1A1A1A;">{inviter_name}</strong> invited you to join
      </p>
    </div>
    <div style="background:#FAFAF8;border-radius:12px;padding:20px 24px;text-align:center;border-left:4px solid {group_color};margin-bottom:8px;">
      <h2 style="margin:0;font-size:20px;color:#1A1A1A;font-weight:600;">{group_name}</h2>
    </div>
    <p style="margin:20px 0 0 0;font-size:13px;color:#9B9B9B;text-align:center;line-height:1.5;">
      Click below to join. If you don't have a MyTasks account yet, you'll sign in with Google first.
    </p>"""
    return build_email(
        title=f'Join "{group_name}" on MyTasks',
        body_html=body,
        cta_text="Join Group",
        cta_url=invite_url,
    )

def build_task_assigned_email(assigner_name, task_text, group_name, group_color, app_url):
    body = f"""
    <p style="margin:0 0 20px 0;font-size:15px;color:#6B6B6B;text-align:center;">
      <strong style="color:#1A1A1A;">{assigner_name}</strong> assigned you a new task
    </p>
    <div style="background:#FAFAF8;border-radius:12px;padding:20px 24px;border-left:4px solid {group_color};margin-bottom:8px;">
      <p style="margin:0;font-size:16px;font-weight:600;color:#1A1A1A;">{task_text}</p>
      <p style="margin:6px 0 0 0;font-size:13px;color:#9B9B9B;">in {group_name}</p>
    </div>"""
    return build_email(
        title=f'New task assigned: "{task_text}"',
        body_html=body,
        cta_text="View Task",
        cta_url=app_url,
    )

def build_member_joined_email(member_name, member_picture, group_name, app_url):
    avatar_html = ""
    if member_picture:
        avatar_html = f'<img src="{member_picture}" width="52" height="52" style="border-radius:50%;display:block;margin:0 auto 12px;" alt="{member_name}">'
    body = f"""
    <div style="text-align:center;">
      {avatar_html}
      <p style="margin:0;font-size:15px;color:#6B6B6B;">
        <strong style="color:#1A1A1A;">{member_name}</strong> accepted your invitation and joined
        <strong style="color:#1A1A1A;">{group_name}</strong>.
      </p>
    </div>"""
    return build_email(
        title=f"{member_name} joined your group",
        body_html=body,
        cta_text="View Group",
        cta_url=app_url,
    )

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

def generate_slug(name, existing_slugs=None):
    """Generate a URL-friendly slug from a group name."""
    s = name.lower().strip()
    s = re.sub(r'[^a-z0-9]+', '-', s)
    s = s.strip('-')[:50]
    if not s:
        s = secrets.token_hex(4)
    if existing_slugs is None:
        existing_slugs = []
    base = s
    counter = 2
    while s in existing_slugs:
        s = f"{base}-{counter}"
        counter += 1
    return s

def migrate_group_slugs():
    """Add slugs to groups that don't have them (idempotent)."""
    if db is None:
        return
    groups_without = list(db["groups"].find({"slug": {"$exists": False}}))
    if not groups_without:
        return
    existing = [g.get("slug","") for g in db["groups"].find({"slug": {"$exists": True}}, {"slug": 1})]
    for g in groups_without:
        slug = generate_slug(g.get("name","group"), existing)
        db["groups"].update_one({"_id": g["_id"]}, {"$set": {"slug": slug}})
        existing.append(slug)
        print(f"  Migrated group '{g.get('name')}' → slug: {slug}")

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
                joined_group = None
                if invite_token and db is not None:
                    joined_group = db["groups"].find_one({"members.inviteToken": invite_token})
                    if joined_group:
                        for m in joined_group["members"]:
                            if m.get("inviteToken") == invite_token and m.get("status") == "pending":
                                m["userId"] = user["id"]
                                m["name"] = user.get("name","")
                                m["picture"] = user.get("picture","")
                                m["status"] = "active"
                                m["joinedAt"] = int(__import__("time").time() * 1000)
                                m.pop("inviteToken", None)
                                break
                        save_group(joined_group)
                # Determine redirect destination after login
                redirect_to = "/mytasks"
                if joined_group and joined_group.get("slug"):
                    redirect_to = f"/groups/{joined_group['slug']}"
                elif "redirect_after_login" in cookies:
                    rval = cookies["redirect_after_login"].value
                    if rval and rval.startswith("/") and "//" not in rval and "@" not in rval:
                        redirect_to = rval
                # Send response manually to support clearing cookies
                self.send_response(302)
                self.send_header("Location", redirect_to)
                self.send_header("Set-Cookie", self.session_cookie(user))
                if invite_token:
                    self.send_header("Set-Cookie", "pending_invite=; Path=/; Max-Age=0")
                self.send_header("Set-Cookie", "redirect_after_login=; Path=/; Max-Age=0")
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
                    "slug": g.get("slug",""),
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
            # GET /api/groups/by-slug/{slug}
            if len(parts) == 5 and parts[3] == "by-slug":
                slug = parts[4]
                user = self.get_session()
                if not user: return self.ok("application/json", b'{"error":"unauthorized"}')
                if db is None: return self.ok("application/json", b'{"error":"not found"}')
                g = db["groups"].find_one({"slug": slug})
                if not g: return self.ok("application/json", b'{"error":"not found"}')
                role = get_member_role(g, user["id"])
                if not role: return self.ok("application/json", b'{"error":"forbidden"}')
                out = dict(g); out["myRole"] = role
                return self.ok("application/json", json.dumps(out).encode())

            # /api/groups/{id}
            if len(parts) == 4:
                group_id = parts[3]
                user = self.get_session()
                if not user: return self.ok("application/json", b'{"error":"unauthorized"}')
                g = load_group(group_id)
                if not g: return self.ok("application/json", b'{"error":"not found"}')
                role = get_member_role(g, user["id"])
                if not role: return self.ok("application/json", b'{"error":"forbidden"}')
                out = dict(g); out["_id"] = g["_id"]; out["slug"] = g.get("slug",""); out["myRole"] = role
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
            # Email the group admin (creator) that someone joined
            if smtp_configured() and g.get("createdBy"):
                admin_member = next((m for m in g["members"] if m.get("userId") == g["createdBy"]), None)
                if admin_member and admin_member.get("email") and admin_member["email"] != user.get("email",""):
                    host = self.headers.get("Host","")
                    is_local = host.startswith("localhost") or host.startswith("127.")
                    app_url = f"{'http' if is_local else 'https'}://{host}/"
                    html = build_member_joined_email(
                        member_name=user.get("name","Someone"),
                        member_picture=user.get("picture",""),
                        group_name=g["name"],
                        app_url=app_url,
                    )
                    send_email(
                        to_email=admin_member["email"],
                        subject=f'{user.get("name","Someone")} joined your group "{g["name"]}"',
                        html_body=html,
                    )
            # Redirect to the group board
            group_slug = g.get("slug","")
            redirect_target = f"/groups/{group_slug}" if group_slug else "/groups"
            return self.redirect(redirect_target)

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

        # Root redirect
        if path == "/":
            user = self.get_session()
            if not user:
                return self.redirect("/login")
            return self.redirect("/mytasks")

        # SPA app routes — serve app.html (frontend handles routing)
        SPA_ROUTES = {"/mytasks", "/analytics", "/groups"}
        if path in SPA_ROUTES or path.startswith("/groups/"):
            user = self.get_session()
            if not user:
                # Validate redirect target (must be a safe relative path)
                safe_path = path if path.startswith("/") and "//" not in path and "@" not in path else "/mytasks"
                self.send_response(302)
                self.send_header("Location", "/login")
                self.send_header("Set-Cookie", f"redirect_after_login={safe_path}; Path=/; Max-Age=300; HttpOnly")
                self.end_headers()
                return
            return self.ok("text/html; charset=utf-8", render_app(user))

        # 404 for unknown routes
        self.send_response(404)
        self.send_header("Content-Type", "text/plain")
        self.end_headers()
        self.wfile.write(b"404 Not Found")

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
            group_name = body.get("name","").strip()
            # Generate unique slug for the new group
            existing_slugs = [g.get("slug","") for g in db["groups"].find({}, {"slug": 1})] if db is not None else []
            group_slug = generate_slug(group_name, existing_slugs)
            group = {
                "_id": new_id(),
                "name": group_name,
                "slug": group_slug,
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
            return self.ok("application/json", json.dumps({"_id": group["_id"], "slug": group_slug}).encode())

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
                    # Send email to assignee if SMTP configured
                    if smtp_configured():
                        assignee_member = next((m for m in g["members"] if m.get("userId") == assigned_to), None)
                        if assignee_member and assignee_member.get("email"):
                            host = self.headers.get("Host","")
                            is_local = host.startswith("localhost") or host.startswith("127.")
                            app_url = f"{'http' if is_local else 'https'}://{host}/"
                            html = build_task_assigned_email(
                                assigner_name=user.get("name","Someone"),
                                task_text=task["text"],
                                group_name=g["name"],
                                group_color=g.get("color","#2563EB"),
                                app_url=app_url,
                            )
                            send_email(
                                to_email=assignee_member["email"],
                                subject=f'New task: "{task["text"]}" assigned to you in {g["name"]}',
                                html_body=html,
                            )
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
                email_sent = False
                if smtp_configured():
                    html = build_invite_email(
                        inviter_name=user.get("name", "Someone"),
                        inviter_picture=user.get("picture", ""),
                        group_name=g["name"],
                        group_color=g.get("color", "#2563EB"),
                        invite_url=invite_url,
                    )
                    email_sent = send_email(
                        to_email=email,
                        subject=f'{user.get("name","Someone")} invited you to "{g["name"]}" on MyTasks',
                        html_body=html,
                    )
                return self.ok("application/json", json.dumps({
                    "token": token, "inviteUrl": invite_url, "emailSent": email_sent
                }).encode())

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
    # Migrate existing groups to have slugs
    if db is not None:
        migrate_group_slugs()
    server = HTTPServer(("0.0.0.0", PORT), Handler)
    print(f"✓ Running at http://localhost:{PORT}")
    if not GOOGLE_CLIENT_ID:   print("⚠  GOOGLE_CLIENT_ID not set")
    if not ANTHROPIC_API_KEY:  print("⚠  ANTHROPIC_API_KEY not set — AI features disabled")
    if smtp_configured():
        print(f"✓ SMTP configured — emails will be sent from {SMTP_FROM}")
    else:
        print("⚠  SMTP not configured — invitation emails will use copy-link fallback only")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nStopped.")
