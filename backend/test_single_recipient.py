import os
import sys

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from backend.services.email_service import EmailService

def test_headers():
    print("\n" + "=" * 70)
    print("VERIFYING STRICT SINGLE RECIPIENT HEADERS & ENVELOPE ROUTING")
    print("=" * 70)

    config = EmailService.get_smtp_config()
    participant = "kavinkishore714@gmail.com"

    test_data = {
        "student_name": "Kavin Kishore",
        "roll_number": "21CS084",
        "department": "CSE",
        "year": "3rd Year",
        "email": participant,
        "event_name": "National Level Tech Hackathon",
        "category": "Coding Event",
        "event_date": "2026-09-15",
        "start_time": "10:00 AM",
        "end_time": "05:00 PM",
        "event_venue": "Tech Park Auditorium",
        "registration_code": "CP-CODE-99999",
        "registration_id": 99
    }

    msg = EmailService.build_confirmation_message(test_data, config)

    print(f"1. FROM Header:     '{msg['From']}'")
    print(f"2. TO Header:       '{msg['To']}'")
    print(f"3. Reply-To Header: '{msg['Reply-To']}'")
    print(f"4. CC Header:       '{msg['Cc']}'")
    print(f"5. BCC Header:      '{msg['Bcc']}'")

    # Assertions
    assert msg['To'] == participant, f"Expected TO to be {participant}, got {msg['To']}"
    assert config['from_email'] in msg['From'], f"Expected FROM to contain sender email"
    assert msg['Reply-To'] is None, "Reply-To header MUST be None"
    assert msg['Cc'] is None, "CC header MUST be None"
    assert msg['Bcc'] is None, "BCC header MUST be None"

    print("\n[SUCCESS] Strict single recipient verification: ALL HEADERS CLEAN & VERIFIED 100%!")
    print("=" * 70 + "\n")

if __name__ == '__main__':
    test_headers()
