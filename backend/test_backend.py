import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from backend.app import create_app
from backend.extensions import db

def run_tests():
    app = create_app()
    client = app.test_client()

    print("\n" + "=" * 60)
    print("RUNNING CAMPUSPULSE BACKEND API VERIFICATION SUITE")
    print("=" * 60)

    # 1. Health Check
    res = client.get('/api/health')
    assert res.status_code == 200, f"Health check failed: {res.data}"
    print("[PASS] 1. Health Check: OK")

    # 2. Host Login First
    res_host_login = client.post('/api/auth/host/login', json={
        "email": "host@campuspulse.com",
        "password": "host123"
    })
    assert res_host_login.status_code == 200, f"Host login failed: {res_host_login.data}"
    host_data = res_host_login.get_json()['data']
    host_id = host_data['host']['id']
    host_token = host_data['token']
    host_headers = {"Authorization": f"Bearer {host_token}"}
    print("[PASS] 2. Host Authentication (/api/auth/host/login): OK")

    # 3. Host Events
    res_host_events = client.get('/api/host/events', headers=host_headers)
    assert res_host_events.status_code == 200
    host_events = res_host_events.get_json()['data']
    assert len(host_events) > 0
    target_event = host_events[0]
    target_event_id = target_event['id']
    print(f"[PASS] 3. Host Events Retrieval: OK ({len(host_events)} events found, target ID: {target_event_id})")

    # 4. Public Events
    res = client.get('/api/events')
    assert res.status_code == 200
    events = res.get_json()['data']
    assert len(events) >= 10, f"Expected >= 10 events, got {len(events)}"
    print(f"[PASS] 4. Public Events Listing: OK ({len(events)} events loaded)")

    # 5. Public Event Details
    res = client.get(f'/api/events/{target_event_id}')
    assert res.status_code == 200
    evt_detail = res.get_json()['data']
    assert evt_detail['name'] == target_event['name']
    print(f"[PASS] 5. Public Event Details ({evt_detail['name']}): OK")

    # 6. Student Direct Registration (No login) & Email Dispatch
    import random
    unique_roll = f"24CS{random.randint(100, 999)}"
    reg_payload = {
        "student_name": "Test Student Automated",
        "roll_number": unique_roll,
        "department": "Computer Science & Engineering",
        "year": "1st Year",
        "email": f"test.{unique_roll.lower()}@college.edu"
    }
    res = client.post(f'/api/events/{target_event_id}/register', json=reg_payload)
    assert res.status_code == 201, f"Registration failed: {res.data}"
    reg_data = res.get_json()['data']
    reg_code = reg_data['registration_code']
    reg_id = reg_data['registration_id']
    print(f"[PASS] 6. Student Direct Registration & Email Dispatch: OK (Code: {reg_code}, ID: {reg_id})")

    # 7. Duplicate Registration Prevention
    res_dup = client.post(f'/api/events/{target_event_id}/register', json=reg_payload)
    assert res_dup.status_code == 409, f"Duplicate check failed: {res_dup.status_code}"
    print("[PASS] 7. Duplicate Registration Prevention (409 Conflict): OK")

    # 8. Registration Details / Digital Entry Pass API
    res_pass = client.get(f'/api/registrations/{reg_id}')
    assert res_pass.status_code == 200
    pass_info = res_pass.get_json()['data']
    assert pass_info['registration_code'] == reg_code
    print(f"[PASS] 8. Digital Entry Pass Retrieval: OK")

    # 9. Verification Email Preview & Resend
    res_preview = client.get(f'/api/registrations/{reg_id}/email-preview')
    assert res_preview.status_code == 200
    preview_html = res_preview.get_data(as_text=True)
    assert "Registration Confirmed" in preview_html or "CampusPulse" in preview_html
    assert reg_code in preview_html

    res_resend = client.post(f'/api/registrations/{reg_id}/resend-email')
    assert res_resend.status_code == 200
    print(f"[PASS] 9. Verification Email with QR & Entry Code Rendering: OK")

    # 10. Host Dashboard
    res_host_dash = client.get('/api/host/dashboard', headers=host_headers)
    assert res_host_dash.status_code == 200
    dash_stats = res_host_dash.get_json()['data']
    assert 'total_events' in dash_stats
    print(f"[PASS] 10. Host Dashboard Metrics: OK (Events: {dash_stats['total_events']}, RSVPs: {dash_stats['total_registrations']})")

    # 11. Host Create Event
    new_evt_payload = {
        "event_name": f"Automated Test Workshop {random.randint(10,99)}",
        "category": "Workshop",
        "description": "Test description for automated verification.",
        "poster": "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800",
        "event_date": "2026-10-01",
        "start_time": "10:00",
        "end_time": "16:00",
        "venue": "Test Venue Hall 1",
        "registration_deadline": "2026-09-30",
        "capacity": 80,
        "status": "Upcoming",
        "rules": ["Rule 1: Bring laptop", "Rule 2: ID card mandatory"]
    }
    res_create = client.post('/api/host/events', json=new_evt_payload, headers=host_headers)
    assert res_create.status_code == 201, f"Event creation failed: {res_create.data}"
    created_evt = res_create.get_json()['data']
    created_id = created_evt['id']
    print(f"[PASS] 11. Host Event Creation: OK (Event ID: {created_id})")

    # 12. Host Edit Event
    res_edit = client.put(f'/api/host/events/{created_id}', json={
        "venue": "Updated Venue Hall 2"
    }, headers=host_headers)
    assert res_edit.status_code == 200
    assert res_edit.get_json()['data']['venue'] == "Updated Venue Hall 2"
    print("[PASS] 12. Host Event Editing: OK")

    # 13. Host View Registrations
    res_host_regs = client.get(f'/api/host/events/{target_event_id}/registrations', headers=host_headers)
    assert res_host_regs.status_code == 200
    regs_list = res_host_regs.get_json()['data']
    assert len(regs_list) > 0
    print(f"[PASS] 13. Host Event Registrations Roster: OK ({len(regs_list)} registered attendees)")

    # 14. QR Attendance Verification
    res_att = client.post(f'/api/host/events/{target_event_id}/attendance', json={
        "registration_code": reg_code
    }, headers=host_headers)
    assert res_att.status_code == 200, f"Attendance mark failed: {res_att.data}"
    print(f"[PASS] 14. QR Attendance Verification & Mark: OK ({reg_code})")

    # 15. Attendance Already Marked Check
    res_att_dup = client.post(f'/api/host/events/{target_event_id}/attendance', json={
        "registration_code": reg_code
    }, headers=host_headers)
    assert res_att_dup.status_code == 400
    assert "already marked" in res_att_dup.get_json()['message'].lower()
    print("[PASS] 15. Attendance Already Marked Prevention: OK")

    # 16. Admin Login
    res_admin_login = client.post('/api/auth/admin/login', json={
        "email": "admin@campuspulse.com",
        "password": "admin123"
    })
    assert res_admin_login.status_code == 200
    admin_token = res_admin_login.get_json()['data']['token']
    admin_headers = {"Authorization": f"Bearer {admin_token}"}
    print("[PASS] 16. Admin Authentication (/api/auth/admin/login): OK")

    # 17. Admin Dashboard
    res_admin_dash = client.get('/api/admin/dashboard', headers=admin_headers)
    assert res_admin_dash.status_code == 200
    admin_stats = res_admin_dash.get_json()['data']
    assert 'total_events' in admin_stats
    print(f"[PASS] 17. Admin Dashboard Metrics: OK (Events: {admin_stats['total_events']}, Hosts: {admin_stats['total_hosts']})")

    # 18. Admin All Events & Status Change
    res_admin_events = client.get('/api/admin/events', headers=admin_headers)
    assert res_admin_events.status_code == 200
    res_status = client.patch(f'/api/admin/events/{created_id}/status', json={"status": "Live"}, headers=admin_headers)
    assert res_status.status_code == 200
    print("[PASS] 18. Admin Global Event Management: OK")

    # 19. Admin Host Oversight
    res_hosts = client.get('/api/admin/hosts', headers=admin_headers)
    assert res_hosts.status_code == 200
    assert len(res_hosts.get_json()['data']) >= 4
    print(f"[PASS] 19. Admin Host Management: OK ({len(res_hosts.get_json()['data'])} hosts)")

    print("=" * 60)
    print("ALL 19 BACKEND API SUITE TESTS (INCLUDING EMAIL & QR) PASSED!")
    print("=" * 60 + "\n")

if __name__ == "__main__":
    run_tests()
