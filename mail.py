"""Email sending and template helpers for MyTasks."""

import os
import json
import smtplib
import traceback
import datetime
import urllib.request
import urllib.error
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

# ─── Email Config ─────────────────────────────────────────────────────────────
# Preferred: Brevo HTTP API (works on Render free tier — port 443, never blocked)
BREVO_API_KEY = os.environ.get("BREVO_API_KEY", "")

# Fallback: SMTP (may be blocked on some hosting providers)
SMTP_HOST  = os.environ.get("SMTP_HOST", "")
SMTP_PORT  = int(os.environ.get("SMTP_PORT", "587"))
SMTP_USER  = os.environ.get("SMTP_USER", "")
SMTP_PASS  = os.environ.get("SMTP_PASS", "")
SMTP_FROM  = os.environ.get("SMTP_FROM", "noreply@mytasks.bar")
SMTP_DEBUG = os.environ.get("SMTP_DEBUG", "").lower() in ("1", "true", "yes")

BREVO_API_URL = "https://api.brevo.com/v3/smtp/email"


def smtp_configured():
    """True if any email method is available."""
    return bool(BREVO_API_KEY or (SMTP_HOST and SMTP_USER and SMTP_PASS))


def smtp_status():
    """Return email configuration state (safe to expose in API responses)."""
    return {
        "email_configured": smtp_configured(),
        "method": "brevo_api" if BREVO_API_KEY else ("smtp" if SMTP_HOST else "none"),
        "BREVO_API_KEY_SET": bool(BREVO_API_KEY),
        "SMTP_HOST": SMTP_HOST,
        "SMTP_PORT": SMTP_PORT,
        "SMTP_USER": (SMTP_USER[:3] + "***") if SMTP_USER else "",
        "SMTP_FROM": SMTP_FROM,
        "SMTP_PASS_SET": bool(SMTP_PASS),
        "SMTP_DEBUG": SMTP_DEBUG,
    }


def print_smtp_status():
    """Print email configuration to stdout at startup."""
    print("─── Email Configuration ───")
    if BREVO_API_KEY:
        print("  ✓ Method: Brevo HTTP API (port 443)")
        print(f"  ✓ From:   {SMTP_FROM}")
        print(f"  ✓ API key: {BREVO_API_KEY[:6]}***")
    elif SMTP_HOST and SMTP_USER and SMTP_PASS:
        mode = "SSL" if SMTP_PORT == 465 else "STARTTLS"
        print(f"  ✓ Method: SMTP {mode} — {SMTP_HOST}:{SMTP_PORT}")
        print(f"  ✓ From:   {SMTP_FROM}")
        print(f"  ✓ User:   {SMTP_USER}")
        if SMTP_USER and SMTP_FROM and SMTP_USER != SMTP_FROM:
            print(f"  ⚠ SMTP_USER != SMTP_FROM — some providers require these to match")
    else:
        print("  ⚠ Email not configured — invitation emails disabled")
        print("  ⚠ Set BREVO_API_KEY (recommended) or SMTP_HOST+SMTP_USER+SMTP_PASS")
    print("────────────────────────────")


def _send_via_brevo_api(to_email, subject, html_body):
    """Send using Brevo's REST API over HTTPS (works on all hosts)."""
    payload = json.dumps({
        "sender":      {"name": "MyTasks", "email": SMTP_FROM},
        "to":          [{"email": to_email}],
        "subject":     subject,
        "htmlContent": html_body,
    }).encode()
    req = urllib.request.Request(
        BREVO_API_URL,
        data=payload,
        headers={
            "api-key":      BREVO_API_KEY,
            "Content-Type": "application/json",
            "Accept":       "application/json",
        },
    )
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            print(f"✓ Email sent to {to_email} via Brevo API (status {resp.status})")
            return True, ""
    except urllib.error.HTTPError as e:
        body = e.read().decode(errors="replace")
        err = f"Brevo API HTTP {e.code}: {body[:200]}"
        print(f"✗ {err}")
        return False, err
    except Exception as e:
        err = f"Brevo API error: {type(e).__name__}: {e}"
        print(f"✗ {err}")
        return False, err


def _send_via_smtp(to_email, subject, html_body):
    """Send via SMTP with auto-detection of SSL (port 465) vs STARTTLS."""
    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"]  = subject
        msg["From"]     = f"MyTasks <{SMTP_FROM}>"
        msg["To"]       = to_email
        msg["Reply-To"] = SMTP_FROM
        msg.attach(MIMEText(html_body, "html", "utf-8"))
        if SMTP_PORT == 465:
            ctx = __import__("ssl").create_default_context()
            with smtplib.SMTP_SSL(SMTP_HOST, SMTP_PORT, timeout=10, context=ctx) as srv:
                if SMTP_DEBUG: srv.set_debuglevel(2)
                srv.login(SMTP_USER, SMTP_PASS)
                srv.send_message(msg)
        else:
            with smtplib.SMTP(SMTP_HOST, SMTP_PORT, timeout=10) as srv:
                if SMTP_DEBUG: srv.set_debuglevel(2)
                srv.ehlo()
                srv.starttls()
                srv.ehlo()
                srv.login(SMTP_USER, SMTP_PASS)
                srv.send_message(msg)
        print(f"✓ Email sent to {to_email} via SMTP")
        return True, ""
    except smtplib.SMTPAuthenticationError as e:
        err = f"Auth failed ({e.smtp_code}): {e.smtp_error.decode() if isinstance(e.smtp_error, bytes) else e.smtp_error}"
        print(f"✗ SMTP AUTH ERROR to {to_email}: {err}")
        return False, err
    except smtplib.SMTPSenderRefused as e:
        err = f"Sender refused ({e.smtp_code}): {e.sender}"
        print(f"✗ SMTP SENDER REFUSED: {err}")
        return False, err
    except smtplib.SMTPRecipientsRefused as e:
        err = f"Recipients refused: {list(e.recipients.keys())}"
        print(f"✗ SMTP RECIPIENTS REFUSED: {err}")
        return False, err
    except smtplib.SMTPException as e:
        err = f"SMTP error: {type(e).__name__}: {e}"
        print(f"✗ {err}")
        return False, err
    except OSError as e:
        err = f"Network error connecting to {SMTP_HOST}:{SMTP_PORT}: {e}"
        print(f"✗ {err}")
        return False, err
    except Exception as e:
        err = f"{type(e).__name__}: {e}"
        print(f"✗ Unexpected email error to {to_email}: {err}")
        traceback.print_exc()
        return False, err


def send_email(to_email, subject, html_body):
    """Send an HTML email. Uses Brevo API if BREVO_API_KEY is set, else SMTP.
    Returns (True, "") on success or (False, error_message) on failure.
    """
    if not smtp_configured():
        msg = "Email not configured (set BREVO_API_KEY or SMTP credentials)"
        print(f"⚠ {msg}")
        return False, msg
    if BREVO_API_KEY:
        return _send_via_brevo_api(to_email, subject, html_body)
    return _send_via_smtp(to_email, subject, html_body)


# ─── Email Templates ──────────────────────────────────────────────────────────

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


def build_overdue_email(task_text, due_date_ms, group_name):
    """Build an overdue task notification email."""
    due_str = ""
    if due_date_ms:
        try:
            dt = datetime.datetime.fromtimestamp(due_date_ms / 1000)
            due_str = dt.strftime("%b %d, %Y %H:%M")
        except Exception:
            due_str = ""
    group_info = f"<p style='margin:6px 0 0 0;font-size:13px;color:#9B9B9B;'>in {group_name}</p>" if group_name else ""
    body = f"""
    <div style="text-align:center;margin-bottom:16px;">
      <div style="font-size:32px;">⚠️</div>
      <p style="margin:8px 0 0 0;font-size:15px;color:#6B6B6B;">A task is overdue</p>
    </div>
    <div style="background:#FEF2F2;border-radius:12px;padding:20px 24px;border-left:4px solid #EF4444;margin-bottom:8px;">
      <p style="margin:0;font-size:16px;font-weight:600;color:#1A1A1A;">{task_text}</p>
      {group_info}
      {"<p style='margin:6px 0 0 0;font-size:13px;color:#9B9B9B;'>Was due: " + due_str + "</p>" if due_str else ""}
    </div>
    <p style="margin:16px 0 0 0;font-size:13px;color:#9B9B9B;text-align:center;">
      Update or complete this task to clear the overdue status.
    </p>"""
    return build_email(
        title=f'Overdue: "{task_text}"',
        body_html=body,
        cta_text="View Tasks",
        cta_url="https://www.mytasks.bar/mytasks",
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
