import os
import re
import io
import time
import socket
import smtplib
import logging
from email.message import EmailMessage
from email.utils import formatdate, make_msgid, formataddr
from dotenv import load_dotenv
import qrcode

# Explicitly load .env from backend folder
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
load_dotenv(os.path.join(BASE_DIR, '.env'))

logger = logging.getLogger('campuspulse.email')

EMAIL_REGEX = re.compile(r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$')

class EmailService:
    @staticmethod
    def is_valid_email(email: str) -> bool:
        if not email or not isinstance(email, str):
            return False
        return bool(EMAIL_REGEX.match(email.strip()))

    @staticmethod
    def generate_qr_bytes(data_str: str) -> bytes:
        """
        Generates scannable QR code PNG image bytes for the registration entry code.
        """
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_M,
            box_size=6,
            border=2,
        )
        qr.add_data(data_str)
        qr.make(fit=True)
        img = qr.make_image(fill_color="#0f172a", back_color="#ffffff")
        buffered = io.BytesIO()
        img.save(buffered, format="PNG")
        return buffered.getvalue()

    @staticmethod
    def get_smtp_config():
        mode = os.getenv('EMAIL_MODE', 'smtp').strip().lower()
        server = os.getenv('SMTP_SERVER', '').strip()
        port_raw = os.getenv('SMTP_PORT', '587').strip()
        try:
            port = int(port_raw)
        except ValueError:
            port = 587

        use_ssl = os.getenv('SMTP_USE_SSL', 'false').strip().lower() == 'true' or port == 465
        use_tls = os.getenv('SMTP_USE_TLS', 'true').strip().lower() == 'true' and not use_ssl

        username = os.getenv('SMTP_USERNAME', '').strip()
        password = os.getenv('SMTP_PASSWORD', '').strip()
        from_email = os.getenv('SMTP_FROM_EMAIL', '').strip() or username or 'events@campuspulse.edu'
        frontend_url = os.getenv('FRONTEND_URL', 'http://localhost:3000').strip().rstrip('/')

        return {
            'mode': mode,
            'server': server,
            'port': port,
            'use_ssl': use_ssl,
            'use_tls': use_tls,
            'username': username,
            'password': password,
            'from_email': from_email,
            'frontend_url': frontend_url
        }

    @staticmethod
    def build_confirmation_message(reg_data: dict, config: dict) -> EmailMessage:
        student_name = reg_data.get('student_name') or reg_data.get('studentName') or 'Student'
        roll_number = reg_data.get('roll_number') or reg_data.get('rollNumber') or 'N/A'
        department = reg_data.get('department') or 'N/A'
        year = reg_data.get('year') or 'N/A'
        event_name = reg_data.get('event_name') or reg_data.get('eventName') or 'College Event'
        category = reg_data.get('category') or reg_data.get('event_category') or 'General'
        event_date = reg_data.get('event_date') or reg_data.get('eventDate') or 'TBA'
        start_time = reg_data.get('event_time') or reg_data.get('start_time') or reg_data.get('startTime') or 'TBA'
        end_time = reg_data.get('end_time') or reg_data.get('endTime') or ''
        time_display = f"{start_time} - {end_time}" if end_time else start_time
        venue = reg_data.get('event_venue') or reg_data.get('venue') or 'College Campus'
        reg_code = reg_data.get('registration_code') or reg_data.get('eventCode') or 'N/A'
        reg_id = reg_data.get('registration_id') or reg_data.get('id') or ''
        recipient_email = reg_data.get('email', '').strip()

        pass_url = f"{config['frontend_url']}/entry-pass/{reg_id}" if reg_id else config['frontend_url']
        subject = f"Event Registration Confirmation – {event_name}"

        # Plain Text Content
        text_content = f"""CampusPulse / EventTracker

Hello {student_name},

Your registration for the following event has been confirmed.

Event:           {event_name}
Category:        {category}
Date:            {event_date}
Time:            {time_display}
Venue:           {venue}
Registration Code / Pass ID: {reg_code}
Roll Number:     {roll_number}
Department:      {department} ({year})

Please keep this code for event entry and attendance verification.
View and print your digital entry pass here:
{pass_url}

Thank you,
CampusPulse
College Event Management System
"""

        # HTML Content with inline QR Code
        html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Event Registration Confirmation – {event_name}</title>
  <style>
    body {{
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: #f1f5f9;
      color: #0f172a;
      margin: 0;
      padding: 24px;
    }}
    .email-container {{
      max-width: 580px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0,0,0,0.06);
      border: 1px solid #e2e8f0;
    }}
    .header {{
      background: linear-gradient(135deg, #1e40af 0%, #2563eb 100%);
      color: #ffffff;
      padding: 24px 28px;
      text-align: center;
    }}
    .header h1 {{
      margin: 4px 0 0;
      font-size: 20px;
      font-weight: 800;
      letter-spacing: -0.02em;
    }}
    .content {{
      padding: 28px;
    }}
    .greeting {{
      font-size: 15px;
      margin-top: 0;
      color: #1e293b;
    }}
    .code-box {{
      background-color: #eff6ff;
      border: 2px dashed #93c5fd;
      border-radius: 10px;
      padding: 14px;
      text-align: center;
      margin: 20px 0;
    }}
    .code-label {{
      font-size: 11px;
      font-weight: 700;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }}
    .code-value {{
      font-family: 'Courier New', Courier, monospace;
      font-size: 24px;
      font-weight: 800;
      color: #1d4ed8;
      letter-spacing: 2px;
      margin-top: 4px;
    }}
    .qr-box {{
      text-align: center;
      margin: 18px 0;
    }}
    .qr-img {{
      width: 140px;
      height: 140px;
      border: 1px solid #cbd5e1;
      padding: 6px;
      border-radius: 8px;
      background: #ffffff;
      display: inline-block;
    }}
    .details-table {{
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
      font-size: 14px;
    }}
    .details-table td {{
      padding: 9px 12px;
      border-bottom: 1px solid #f1f5f9;
    }}
    .details-table td.label {{
      color: #64748b;
      font-weight: 600;
      width: 38%;
    }}
    .details-table td.val {{
      color: #0f172a;
      font-weight: 700;
    }}
    .btn-container {{
      text-align: center;
      margin: 24px 0 10px;
    }}
    .btn {{
      display: inline-block;
      background-color: #2563eb;
      color: #ffffff !important;
      text-decoration: none;
      font-weight: 700;
      padding: 11px 22px;
      border-radius: 8px;
      font-size: 14px;
    }}
    .footer {{
      background-color: #f8fafc;
      padding: 18px 24px;
      text-align: center;
      font-size: 12px;
      color: #64748b;
      border-top: 1px solid #e2e8f0;
      line-height: 1.5;
    }}
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #bfdbfe;">
        CampusPulse / EventTracker
      </div>
      <h1>Registration Confirmed</h1>
    </div>

    <div class="content">
      <p class="greeting">
        Hello <strong>{student_name}</strong>,
      </p>
      <p style="font-size: 14px; color: #334155; line-height: 1.6;">
        Your registration for <strong>{event_name}</strong> has been confirmed.
      </p>

      <div class="code-box">
        <div class="code-label">Registration Code / Pass ID</div>
        <div class="code-value">{reg_code}</div>
      </div>

      <div class="qr-box">
        <img class="qr-img" src="cid:qrcode_image" alt="Digital Pass QR Code" />
        <div style="font-size: 11px; color: #64748b; margin-top: 6px;">
          Present this QR Code or Entry Code at the event entrance
        </div>
      </div>

      <h3 style="font-size: 14px; margin: 18px 0 8px; color: #1e293b; text-transform: uppercase; letter-spacing: 0.04em;">
        Event Details:
      </h3>
      <table class="details-table">
        <tr>
          <td class="label">Event Name:</td>
          <td class="val">{event_name}</td>
        </tr>
        <tr>
          <td class="label">Category:</td>
          <td class="val">{category}</td>
        </tr>
        <tr>
          <td class="label">Date:</td>
          <td class="val">{event_date}</td>
        </tr>
        <tr>
          <td class="label">Time:</td>
          <td class="val">{time_display}</td>
        </tr>
        <tr>
          <td class="label">Venue:</td>
          <td class="val">{venue}</td>
        </tr>
        <tr>
          <td class="label">Student Roll No:</td>
          <td class="val">{roll_number}</td>
        </tr>
        <tr>
          <td class="label">Department:</td>
          <td class="val">{department} ({year})</td>
        </tr>
      </table>

      <p style="font-size: 13px; color: #475569; line-height: 1.5;">
        Please keep this code for event entry and attendance verification.
      </p>

      <div class="btn-container">
        <a href="{pass_url}" class="btn" target="_blank">
          View Digital Entry Pass
        </a>
      </div>
    </div>

    <div class="footer">
      <strong>CampusPulse</strong><br>
      College Event Management System
    </div>
  </div>
</body>
</html>"""

        msg = EmailMessage()
        msg["Subject"] = subject
        msg["From"] = formataddr(("EventTracker", config['from_email']))
        msg["To"] = recipient_email
        msg["Date"] = formatdate(localtime=True)
        domain = config['from_email'].split('@')[-1] if '@' in config['from_email'] else 'gmail.com'
        msg["Message-ID"] = make_msgid(domain=domain)

        # STRICT RULE: No Reply-To, No CC, No BCC
        # msg["Reply-To"] is omitted completely
        # msg["Cc"] is omitted completely
        # msg["Bcc"] is omitted completely

        msg.set_content(text_content)
        msg.add_alternative(html_content, subtype="html")

        # Generate and attach inline QR code
        try:
            qr_bytes = EmailService.generate_qr_bytes(reg_code)
            msg.get_payload()[1].add_related(qr_bytes, 'image', 'png', cid='<qrcode_image>')
        except Exception as e:
            logger.warning("Could not generate inline QR code attachment: %s", e)

        return msg

    @staticmethod
    def send_confirmation_email(reg_data: dict) -> tuple[bool, str]:
        """
        Sends registration confirmation email via real internet SMTP ONLY to the participant's exact email address.
        Includes automatic retry for transient socket/throttling delays.
        Returns: (success: bool, message: str)
        """
        recipient_email = (reg_data.get('email') or '').strip()

        # Step 1: Validate recipient email
        if not EmailService.is_valid_email(recipient_email):
            error_msg = f"Invalid participant email address: '{recipient_email}'"
            logger.warning("Email validation failed: %s", error_msg)
            return False, error_msg

        logger.info("[campuspulse.email] Preparing confirmation email for participant: %s", recipient_email)

        config = EmailService.get_smtp_config()

        # Check for optional mock mode
        if config['mode'] == 'mock':
            logger.info("[campuspulse.email] [MOCK MODE ACTIVE] Simulated email sent to participant: %s (Event: '%s')", recipient_email, reg_data.get('event_name', ''))
            return True, "Mock confirmation email simulated successfully."

        # Step 2: Validate SMTP config
        if not config['server']:
            error_msg = "SMTP_SERVER is not configured in environment."
            logger.warning("SMTP skipped: %s", error_msg)
            return False, error_msg

        if not config['username'] or not config['password']:
            error_msg = "SMTP_USERNAME or SMTP_PASSWORD is not configured in environment."
            logger.warning("SMTP skipped: %s", error_msg)
            return False, error_msg

        msg = EmailService.build_confirmation_message(reg_data, config)

        max_retries = 2
        for attempt in range(1, max_retries + 1):
            smtp = None
            try:
                # Step 3: Connect
                logger.info("[campuspulse.email] Connecting to SMTP server (attempt %s/%s): %s:%s...", attempt, max_retries, config['server'], config['port'])
                if config['use_ssl']:
                    smtp = smtplib.SMTP_SSL(config['server'], config['port'], timeout=30)
                    smtp.ehlo()
                    logger.info("[campuspulse.email] SSL connection established successfully.")
                else:
                    smtp = smtplib.SMTP(config['server'], config['port'], timeout=30)
                    smtp.ehlo()
                    logger.info("[campuspulse.email] SMTP socket connected.")
                    if config['use_tls']:
                        logger.info("[campuspulse.email] Starting TLS handshake...")
                        smtp.starttls()
                        smtp.ehlo()
                        logger.info("[campuspulse.email] TLS handshake successful.")

                # Step 4: Authenticate
                logger.info("[campuspulse.email] Authenticating as: %s...", config['username'])
                smtp.login(config['username'], config['password'])
                logger.info("[campuspulse.email] SMTP authentication successful.")

                # Step 5: Send Message to Real Participant ONLY
                logger.info("[campuspulse.email] Sending confirmation email message to single recipient: %s...", recipient_email)
                
                # Envelope recipient list contains strictly ONLY the single participant email
                rejected = smtp.send_message(msg, from_addr=config['from_email'], to_addrs=[recipient_email])
                if rejected:
                    logger.error("[campuspulse.email] Recipient rejected by SMTP server: %s", rejected)
                    return False, f"Recipient rejected by mail server: {rejected}"

                logger.info("[campuspulse.email] SMTP accepted message for participant: %s (Event: '%s')", recipient_email, reg_data.get('event_name', ''))
                return True, "Confirmation email sent successfully."

            except smtplib.SMTPAuthenticationError as e:
                err_details = e.smtp_error.decode('utf-8', errors='ignore') if hasattr(e, 'smtp_error') and isinstance(e.smtp_error, bytes) else str(e)
                if 'gmail' in config['server'].lower():
                    logger.error("[campuspulse.email] Gmail SMTP Authentication failed for %s: %s. (Gmail requires a 16-character App Password from https://myaccount.google.com/apppasswords)", config['username'], err_details)
                    return False, "Gmail authentication failed. Please configure your 16-character Google App Password in backend/.env (SMTP_PASSWORD)."
                else:
                    logger.error("[campuspulse.email] SMTP Authentication failed for %s: %s", config['server'], err_details)
                    return False, "SMTP authentication failed. Check username and password in backend/.env."

            except (smtplib.SMTPConnectError, smtplib.SMTPServerDisconnected, socket.timeout, TimeoutError, ConnectionError) as e:
                if attempt < max_retries:
                    logger.warning("[campuspulse.email] Transient connection issue on attempt %s (%s). Retrying in 2 seconds...", attempt, e)
                    time.sleep(2)
                    continue
                else:
                    logger.error("[campuspulse.email] SMTP Connection failed after %s attempts: %s", max_retries, e)
                    return False, f"SMTP connection failed: {str(e)}"

            except Exception as e:
                logger.error("[campuspulse.email] Unexpected error sending email to %s: %s", recipient_email, str(e))
                return False, f"Email delivery failed: {str(e)}"
            finally:
                if smtp is not None:
                    try:
                        smtp.quit()
                    except Exception:
                        pass

        return False, "Email delivery timed out."

    @staticmethod
    def send_registration_confirmation(
        recipient_email: str,
        student_name: str,
        event_name: str,
        category: str = "General",
        event_date: str = "TBA",
        start_time: str = "TBA",
        end_time: str = "",
        venue: str = "College Campus",
        registration_code: str = "N/A",
        registration_id: int = None,
        roll_number: str = "N/A",
        department: str = "N/A",
        year: str = "N/A"
    ) -> tuple[bool, str]:
        """
        Standardized registration confirmation email sender with single recipient.
        """
        reg_data = {
            "email": recipient_email,
            "student_name": student_name,
            "roll_number": roll_number,
            "department": department,
            "year": year,
            "event_name": event_name,
            "category": category,
            "event_date": event_date,
            "start_time": start_time,
            "end_time": end_time,
            "event_venue": venue,
            "registration_code": registration_code,
            "registration_id": registration_id
        }
        return EmailService.send_confirmation_email(reg_data)

    @staticmethod
    def send_test_email(recipient_email: str) -> tuple[bool, str]:
        """
        Sends a test email to verify SMTP server configuration to the specified test recipient.
        """
        if not EmailService.is_valid_email(recipient_email):
            return False, "Invalid recipient email address format."

        test_data = {
            "student_name": "CampusPulse Admin Tester",
            "roll_number": "TEST-ADMIN",
            "department": "Computer Science & Engineering",
            "year": "Faculty / Admin",
            "email": recipient_email.strip(),
            "event_name": "CampusPulse SMTP Test",
            "category": "Testing",
            "event_date": "2026-09-01",
            "start_time": "10:00 AM",
            "end_time": "11:30 AM",
            "event_venue": "Main Auditorium",
            "registration_code": "CP-TEST-PASS-01",
            "registration_id": 1
        }

        return EmailService.send_confirmation_email(test_data)


# Direct Function Exports
def send_registration_confirmation(*args, **kwargs):
    return EmailService.send_registration_confirmation(*args, **kwargs)

def send_test_email(recipient_email: str):
    return EmailService.send_test_email(recipient_email)
