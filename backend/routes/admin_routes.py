from flask import Blueprint, request
from backend.utils.decorators import admin_required
from backend.models.admin import Admin
from backend.models.host import Host
from backend.models.event import Event
from backend.models.registration import Registration
from backend.models.attendance import Attendance
from backend.services.event_service import EventService
from backend.extensions import db
from backend.utils.response import success_response, error_response, not_found_response, created_response

admin_bp = Blueprint('admin', __name__, url_prefix='/api/admin')

@admin_bp.route('/dashboard', methods=['GET'])
@admin_required()
def get_admin_dashboard():
    events = Event.query.all()
    hosts = Host.query.all()
    registrations = Registration.query.order_by(Registration.created_at.desc()).all()
    attendances = Attendance.query.filter_by(attendance_status='PRESENT').all()

    total_events = len(events)
    upcoming_events = [e for e in events if e.status in ['Upcoming', 'Live']]
    total_hosts = len(hosts)
    total_registrations = len(registrations)
    total_attendance = len(attendances)
    
    unique_students = len(set(r.roll_number for r in registrations))
    attendance_rate = round((total_attendance / total_registrations * 100)) if total_registrations > 0 else 0

    recent_events = [e.to_dict() for e in events[:6]]
    recent_registrations = [r.to_dict() for r in registrations[:8]]

    return success_response(data={
        "total_events": total_events,
        "totalEvents": total_events,
        "upcoming_events_count": len(upcoming_events),
        "upcomingEventsCount": len(upcoming_events),
        "total_hosts": total_hosts,
        "totalHosts": total_hosts,
        "total_students_registered": unique_students,
        "totalStudentsRegistered": unique_students,
        "total_registrations": total_registrations,
        "totalRegistrations": total_registrations,
        "total_attendance": total_attendance,
        "totalAttendance": total_attendance,
        "overall_attendance_rate": attendance_rate,
        "overallAttendanceRate": attendance_rate,
        "upcoming_events": [e.to_dict() for e in upcoming_events[:5]],
        "upcomingEvents": [e.to_dict() for e in upcoming_events[:5]],
        "recent_events": recent_events,
        "recent_registrations": recent_registrations,
        "recentRegistrations": recent_registrations
    }, message="Admin dashboard metrics retrieved.")

@admin_bp.route('/events', methods=['GET'])
@admin_required()
def get_all_events():
    events = Event.query.order_by(Event.event_date.desc()).all()
    return success_response(data=[e.to_dict() for e in events], message="All college events retrieved.")

@admin_bp.route('/events/<int:event_id>/status', methods=['PATCH'])
@admin_required()
def update_event_status(event_id):
    data = request.get_json() or {}
    new_status = data.get('status')
    if not new_status:
        return error_response("Status field is required.", status_code=400)

    event, error_msg = EventService.update_status(event_id, new_status)
    if not event:
        return not_found_response(error_msg)

    return success_response(data=event, message=f"Event status updated to {new_status}.")

@admin_bp.route('/hosts', methods=['GET'])
@admin_required()
def get_all_hosts():
    hosts = Host.query.order_by(Host.created_at.desc()).all()
    return success_response(data=[h.to_dict() for h in hosts], message="All organizers retrieved.")

@admin_bp.route('/hosts', methods=['POST'])
@admin_required()
def create_host():
    data = request.get_json() or {}
    email = (data.get('email') or '').strip().lower()
    name = (data.get('name') or '').strip()
    department = (data.get('department') or 'Computer Science & Engineering').strip()
    organization = (data.get('organization') or 'Department Host').strip()
    phone = (data.get('phone') or '').strip()
    password = data.get('password') or 'host123'

    if not name or not email:
        return error_response("Name and email are required.", status_code=400)

    if Host.query.filter(Host.email.ilike(email)).first():
        return error_response("A host with this email already exists.", status_code=409)

    host = Host(
        name=name,
        email=email,
        department=department,
        organization=organization,
        phone=phone,
        role='host',
        status='active'
    )
    host.set_password(password)

    db.session.add(host)
    db.session.commit()

    return created_response(data=host.to_dict(), message="New faculty host created successfully.")

@admin_bp.route('/hosts/<int:host_id>', methods=['PUT'])
@admin_required()
def update_host(host_id):
    host = Host.query.get(host_id)
    if not host:
        return not_found_response("Host not found.")

    data = request.get_json() or {}
    if 'name' in data:
        host.name = data['name'].strip()
    if 'department' in data:
        host.department = data['department'].strip()
    if 'organization' in data:
        host.organization = data['organization'].strip()
    if 'phone' in data:
        host.phone = data['phone'].strip()
    if 'password' in data and data['password']:
        host.set_password(data['password'])

    db.session.commit()
    return success_response(data=host.to_dict(), message="Host account updated successfully.")

@admin_bp.route('/hosts/<int:host_id>/status', methods=['PATCH'])
@admin_required()
def update_host_status(host_id):
    host = Host.query.get(host_id)
    if not host:
        return not_found_response("Host not found.")

    data = request.get_json() or {}
    new_status = data.get('status') # 'active', 'deactivated', 'blocked'
    if not new_status:
        return error_response("Status field is required.", status_code=400)

    host.status = new_status.lower()
    db.session.commit()

    return success_response(data=host.to_dict(), message=f"Host status updated to '{new_status}'.")
