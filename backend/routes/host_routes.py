from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from backend.utils.decorators import host_required
from backend.services.event_service import EventService
from backend.services.registration_service import RegistrationService
from backend.services.attendance_service import AttendanceService
from backend.models.event import Event
from backend.models.registration import Registration
from backend.models.attendance import Attendance
from backend.utils.validators import validate_event_input
from backend.utils.response import success_response, error_response, not_found_response, forbidden_response

host_bp = Blueprint('host', __name__, url_prefix='/api/host')

@host_bp.route('/dashboard', methods=['GET'])
@host_required()
def get_host_dashboard():
    host_id = int(get_jwt_identity())
    events = Event.query.filter_by(host_id=host_id).all()
    
    total_events = len(events)
    upcoming_events = [e for e in events if e.status in ['Upcoming', 'Live']]
    
    total_registrations = 0
    total_attendance = 0
    for e in events:
        total_registrations += len(e.registrations)
        total_attendance += sum(1 for a in e.attendances if a.attendance_status == 'PRESENT')
        
    attendance_rate = round((total_attendance / total_registrations * 100)) if total_registrations > 0 else 0

    return success_response(data={
        "total_events": total_events,
        "totalEvents": total_events,
        "upcoming_events": len(upcoming_events),
        "upcomingEventsCount": len(upcoming_events),
        "total_registrations": total_registrations,
        "totalRegistrations": total_registrations,
        "total_attendance": total_attendance,
        "totalAttendance": total_attendance,
        "attendance_rate": attendance_rate,
        "attendanceRate": attendance_rate,
        "events": [e.to_dict() for e in events]
    }, message="Host dashboard statistics loaded.")

@host_bp.route('/events', methods=['GET'])
@host_required()
def get_host_events():
    host_id = int(get_jwt_identity())
    events = EventService.get_host_events(host_id)
    return success_response(data=events, message="Host events loaded successfully.")

@host_bp.route('/events', methods=['POST'])
@host_required()
def create_host_event():
    host_id = int(get_jwt_identity())
    data = request.get_json() or {}

    is_valid, validation_msg = validate_event_input(data)
    if not is_valid:
        return error_response(message=validation_msg, status_code=400)

    event = EventService.create_event(host_id=host_id, data=data)
    return success_response(data=event, message="Event created and published successfully.", status_code=201)

@host_bp.route('/events/<int:event_id>', methods=['PUT'])
@host_required()
def update_host_event(event_id):
    host_id = int(get_jwt_identity())
    claims = get_jwt()
    is_admin = claims.get('role') == 'admin'
    data = request.get_json() or {}

    event, error_msg = EventService.update_event(event_id=event_id, host_id=host_id, data=data, is_admin=is_admin)
    if not event:
        return error_response(message=error_msg, status_code=403 if "permission" in error_msg else 404)

    return success_response(data=event, message="Event updated successfully.")

@host_bp.route('/events/<int:event_id>', methods=['DELETE'])
@host_required()
def delete_host_event(event_id):
    host_id = int(get_jwt_identity())
    claims = get_jwt()
    is_admin = claims.get('role') == 'admin'

    success, message = EventService.delete_event(event_id=event_id, host_id=host_id, is_admin=is_admin)
    if not success:
        return error_response(message=message, status_code=403 if "permission" in message else 404)

    return success_response(message=message)

@host_bp.route('/events/<int:event_id>/registrations', methods=['GET'])
@host_required()
def get_event_registrations(event_id):
    host_id = int(get_jwt_identity())
    claims = get_jwt()
    is_admin = claims.get('role') == 'admin'

    event = Event.query.get(event_id)
    if not event:
        return not_found_response("Event not found.")

    if not is_admin and event.host_id != host_id:
        return forbidden_response("You do not own this event.")

    regs = RegistrationService.get_event_registrations(event_id)
    return success_response(data=regs, message="Event registrations retrieved.")

@host_bp.route('/events/<int:event_id>/attendance', methods=['POST'])
@host_required()
def mark_attendance(event_id):
    host_id = int(get_jwt_identity())
    claims = get_jwt()
    is_admin = claims.get('role') == 'admin'
    data = request.get_json() or {}

    raw_code = data.get('registration_code') or data.get('registrationCode') or data.get('code') or data.get('codeOrId') or ''
    if not raw_code:
        return error_response(message="Registration code or QR payload is required.", status_code=400)

    success, message, result, tag = AttendanceService.verify_and_mark_attendance(
        event_id=event_id,
        host_id=host_id,
        raw_code=raw_code,
        is_admin=is_admin
    )

    if not success:
        return error_response(message=message, status_code=400 if tag != 'FORBIDDEN' else 403, errors=result)

    return success_response(data=result, message=message)

@host_bp.route('/registrations/<int:registration_id>/toggle-attendance', methods=['PATCH'])
@host_required()
def toggle_attendance(registration_id):
    host_id = int(get_jwt_identity())
    claims = get_jwt()
    is_admin = claims.get('role') == 'admin'

    result, error_msg = AttendanceService.toggle_attendance(registration_id=registration_id, host_id=host_id, is_admin=is_admin)
    if not result:
        return error_response(message=error_msg, status_code=404)

    return success_response(data=result, message="Attendance status updated.")
