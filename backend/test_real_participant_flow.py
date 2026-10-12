import os
import sys
import random

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from backend.app import create_app
from backend.extensions import db
from backend.models.event import Event
from backend.models.registration import Registration

def run_participant_tests():
    app = create_app()
    client = app.test_client()

    print("\n" + "=" * 70)
    print("VERIFYING LOCALHOST MULTI-PARTICIPANT & MULTI-EVENT DELIVERY FLOW")
    print("=" * 70)

    with app.app_context():
        # Ensure at least 3 distinct active events exist
        events = Event.query.filter(Event.status.in_(['Upcoming', 'Live'])).all()
        if len(events) < 3:
            e1 = Event(host_id=1, event_name="AI & Deep Learning Symposium", category="Workshop", description="Test Event A", event_date="2026-09-10", start_time="10:00", venue="Lab 1", capacity=100, status="Upcoming")
            e2 = Event(host_id=1, event_name="Cybersecurity & Cryptography Challenge", category="Coding Event", description="Test Event B", event_date="2026-09-15", start_time="11:00", venue="Lab 2", capacity=100, status="Upcoming")
            e3 = Event(host_id=1, event_name="National Level Project Expo", category="Project Presentation", description="Test Event C", event_date="2026-09-20", start_time="09:00", venue="Hall A", capacity=100, status="Upcoming")
            db.session.add_all([e1, e2, e3])
            db.session.commit()
            events = Event.query.filter(Event.status.in_(['Upcoming', 'Live'])).all()

        evt_a = events[0].id
        evt_b = events[1].id
        evt_c = events[2].id

    # Scenario 1: Person One registers for Event A
    roll_1 = f"P1_{random.randint(1000, 9999)}"
    p1_email = "personone.test@gmail.com"
    res1 = client.post(f'/api/events/{evt_a}/register', json={
        "student_name": "Person One",
        "roll_number": roll_1,
        "department": "CSE",
        "year": "3rd Year",
        "email": p1_email
    })
    assert res1.status_code == 201
    json1 = res1.get_json()
    assert json1['registration']['email'] == p1_email
    assert json1['email_sent'] is True
    print(f"[SUCCESS] Scenario 1: Person One ({p1_email}) registered for Event {evt_a} -> Confirmation sent to {p1_email}")

    # Scenario 2: Person One registers for Event B (Same person, different event)
    res2 = client.post(f'/api/events/{evt_b}/register', json={
        "student_name": "Person One",
        "roll_number": roll_1,
        "department": "CSE",
        "year": "3rd Year",
        "email": p1_email
    })
    assert res2.status_code == 201
    json2 = res2.get_json()
    assert json2['registration']['email'] == p1_email
    assert json2['email_sent'] is True
    assert json2['registration']['registration_code'] != json1['registration']['registration_code']
    print(f"[SUCCESS] Scenario 2: Person One ({p1_email}) registered for Event {evt_b} -> NEW distinct confirmation sent to {p1_email}")

    # Scenario 3: Person Two registers for Event C (Different person, different email)
    roll_2 = f"P2_{random.randint(1000, 9999)}"
    p2_email = "persontwo.test@gmail.com"
    res3 = client.post(f'/api/events/{evt_c}/register', json={
        "student_name": "Person Two",
        "roll_number": roll_2,
        "department": "IT",
        "year": "2nd Year",
        "email": p2_email
    })
    assert res3.status_code == 201
    json3 = res3.get_json()
    assert json3['registration']['email'] == p2_email
    assert json3['email_sent'] is True
    print(f"[SUCCESS] Scenario 3: Person Two ({p2_email}) registered for Event {evt_c} -> Confirmation sent to {p2_email}")

    # Scenario 4: Person Three (Outlook domain) registers for Event A
    roll_3 = f"P3_{random.randint(1000, 9999)}"
    p3_email = "kumar.test@outlook.com"
    res4 = client.post(f'/api/events/{evt_a}/register', json={
        "student_name": "Kumar",
        "roll_number": roll_3,
        "department": "ECE",
        "year": "4th Year",
        "email": p3_email
    })
    assert res4.status_code == 201
    json4 = res4.get_json()
    assert json4['registration']['email'] == p3_email
    assert json4['email_sent'] is True
    print(f"[SUCCESS] Scenario 4: Kumar ({p3_email}) registered for Event {evt_a} -> Confirmation sent to {p3_email}")

    print("=" * 70)
    print("ALL MULTI-PARTICIPANT LOCALHOST REGISTRATION TESTS VERIFIED 100%!")
    print("=" * 70 + "\n")

if __name__ == '__main__':
    run_participant_tests()
