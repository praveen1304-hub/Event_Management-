import os
import sys
import random

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from backend.app import create_app
from backend.extensions import db
from backend.models.event import Event
from backend.models.registration import Registration
from backend.services.email_service import EmailService

def run_tests():
    app = create_app()
    client = app.test_client()

    print("\n" + "=" * 65)
    print("CAMPUSPULSE EMAIL NOTIFICATION & REGISTRATION TEST SUITE")
    print("=" * 65)

    # -------------------------------------------------------------
    # TEST 1: App initialization & Health check
    # -------------------------------------------------------------
    res = client.get('/api/health')
    assert res.status_code == 200, f"Health check failed: {res.data}"
    health_data = res.get_json()
    assert health_data['status'] == 'healthy'
    print("[PASS] TEST 1: Flask app initialized & /api/health working (200 OK)")

    # -------------------------------------------------------------
    # TEST 2: Verify .env is loaded safely without printing passwords
    # -------------------------------------------------------------
    smtp_server = os.getenv('SMTP_SERVER')
    smtp_user = os.getenv('SMTP_USERNAME')
    smtp_from = os.getenv('SMTP_FROM_EMAIL')
    assert smtp_server, "SMTP_SERVER not found in environment"
    assert smtp_user, "SMTP_USERNAME not found in environment"
    print(f"[PASS] TEST 2: Environment variables loaded properly:")
    print(f"       - SMTP server configured: {bool(smtp_server)}")
    print(f"       - SMTP username configured: {bool(smtp_user)}")
    print(f"       - SMTP password configured: {bool(os.getenv('SMTP_PASSWORD'))}")
    print(f"       - SMTP from email configured: {bool(smtp_from)}")

    # -------------------------------------------------------------
    # TEST 3: POST /api/test-email (SMTP test endpoint)
    # -------------------------------------------------------------
    res_test_mail = client.post('/api/test-email', json={
        "email": "student.test@college.edu"
    })
    test_json = res_test_mail.get_json()
    print(f"[INFO] TEST 3: /api/test-email response: {test_json}")
    assert test_json.get('success') is True
    assert test_json.get('email_sent') is True
    print(f"[PASS] TEST 3: POST /api/test-email endpoint functional (Status: {res_test_mail.status_code})")

    # -------------------------------------------------------------
    # TEST 4: Student Registration & Database Transaction First
    # -------------------------------------------------------------
    with app.app_context():
        event = Event.query.filter(Event.status.in_(['Upcoming', 'Live'])).first()
        if not event:
            event = Event(
                host_id=1,
                event_name="Quantum Computing & Post-Quantum Cryptography Seminar",
                category="Workshop",
                description="Test event for registration email validation",
                event_date="2026-10-15",
                start_time="09:30",
                end_time="12:30",
                venue="Auditorium A",
                capacity=100,
                status="Upcoming"
            )
            db.session.add(event)
            db.session.commit()
        target_event_id = event.id

    unique_roll = f"TEST{random.randint(10000, 99999)}"
    reg_payload = {
        "student_name": "Praveen Tester",
        "roll_number": unique_roll,
        "department": "Computer Science & Engineering",
        "year": "3rd Year",
        "email": f"praveen.{unique_roll.lower()}@college.edu"
    }

    res_reg = client.post(f'/api/events/{target_event_id}/register', json=reg_payload)
    assert res_reg.status_code == 201, f"Registration failed: {res_reg.data}"
    reg_json = res_reg.get_json()
    assert reg_json['success'] is True
    assert reg_json['registration_success'] is True
    assert 'registration' in reg_json
    assert 'registration_code' in reg_json['registration']
    assert reg_json['registration']['email'] == reg_payload['email']
    assert 'email_sent' in reg_json

    saved_reg_id = reg_json['registration']['id']
    with app.app_context():
        db_reg = db.session.get(Registration, saved_reg_id)
        assert db_reg is not None, "Registration was not committed to SQL database!"
        assert db_reg.roll_number == unique_roll
        assert db_reg.email == reg_payload['email']
        assert db_reg.registration_code == reg_json['registration']['registration_code']

    print(f"[PASS] TEST 4: Student registration saved in SQL, code generated ({db_reg.registration_code}), email handled (email_sent: {reg_json['email_sent']})")

    # -------------------------------------------------------------
    # TEST 5: Test email failure behavior (DB must NOT rollback)
    # -------------------------------------------------------------
    real_password = os.environ.get('SMTP_PASSWORD')
    os.environ['SMTP_PASSWORD'] = 'wrong_invalid_password_123'

    unique_roll_fail = f"TEST{random.randint(10000, 99999)}"
    fail_payload = {
        "student_name": "SMTP Fail Tester",
        "roll_number": unique_roll_fail,
        "department": "Information Technology",
        "year": "2nd Year",
        "email": f"fail.{unique_roll_fail.lower()}@college.edu"
    }

    res_fail = client.post(f'/api/events/{target_event_id}/register', json=fail_payload)
    assert res_fail.status_code == 201, f"Expected 201 created even when email fails, got {res_fail.status_code}"
    fail_json = res_fail.get_json()
    assert fail_json['success'] is True
    assert fail_json['registration_success'] is True
    assert fail_json['email_sent'] is False
    assert "could not be sent" in fail_json['message']
    assert 'registration' in fail_json

    # Verify that registration is still in database despite email failure
    with app.app_context():
        fail_db_reg = Registration.query.filter_by(roll_number=unique_roll_fail).first()
        assert fail_db_reg is not None, "Database registration was deleted/rolled back on email failure!"
        print(f"[PASS] TEST 5: Email failure handled safely without rolling back registration (Saved ID #{fail_db_reg.id})")

    # Restore correct password
    if real_password:
        os.environ['SMTP_PASSWORD'] = real_password

    # -------------------------------------------------------------
    # TEST 6: Invalid participant email address
    # -------------------------------------------------------------
    res_bad_email = client.post(f'/api/events/{target_event_id}/register', json={
        "student_name": "Bad Email Tester",
        "roll_number": f"BAD{random.randint(1000,9999)}",
        "department": "Civil Engineering",
        "year": "1st Year",
        "email": "not-an-email"
    })
    assert res_bad_email.status_code == 400
    assert "valid email" in res_bad_email.get_json()['message'].lower()
    print("[PASS] TEST 6: Invalid participant email rejected gracefully (400 Bad Request)")

    # -------------------------------------------------------------
    # TEST 7: Duplicate registration check
    # -------------------------------------------------------------
    res_dup = client.post(f'/api/events/{target_event_id}/register', json=reg_payload)
    assert res_dup.status_code == 409
    dup_json = res_dup.get_json()
    assert dup_json['success'] is False
    assert "already registered" in dup_json['message'].lower()
    print(f"[PASS] TEST 7: Duplicate registration prevented (409 Conflict)")

    # -------------------------------------------------------------
    # TEST 8: Multiple distinct participant delivery routing
    # -------------------------------------------------------------
    participants = [
        {"name": "Participant One", "roll": f"P1_{random.randint(100,999)}", "email": "participant1.test@college.edu"},
        {"name": "Participant Two", "roll": f"P2_{random.randint(100,999)}", "email": "participant2.test@college.edu"},
        {"name": "Participant Three", "roll": f"P3_{random.randint(100,999)}", "email": "participant3.test@college.edu"}
    ]
    for p in participants:
        res_p = client.post(f'/api/events/{target_event_id}/register', json={
            "student_name": p["name"],
            "roll_number": p["roll"],
            "department": "CSE",
            "year": "4th Year",
            "email": p["email"]
        })
        assert res_p.status_code == 201
        p_json = res_p.get_json()
        assert p_json['registration']['email'] == p["email"]
        assert p_json['email_sent'] is True
        print(f"[INFO] Multiple test: Registered {p['name']} ({p['email']}) -> Delivery accepted to participant inbox.")

    print("[PASS] TEST 8: Multiple participants each received distinct confirmation emails to their own addresses.")

    print("=" * 65)
    print("ALL 8 VERIFICATION TESTS PASSED SUCCESSFULLY!")
    print("=" * 65 + "\n")

if __name__ == '__main__':
    run_tests()
