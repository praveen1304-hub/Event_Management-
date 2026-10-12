from datetime import datetime, timezone
from backend.extensions import db
from backend.models.event import Event
from backend.models.registration import Registration
from backend.models.attendance import Attendance
from backend.services.qr_service import extract_code_from_raw

class AttendanceService:
    @staticmethod
    def verify_and_mark_attendance(event_id: int, host_id: int, raw_code: str, is_admin: bool = False) -> tuple[bool, str, dict, str]:
        """
        Verifies QR registration code and marks student attendance.
        Returns: (success: bool, message: str, data: dict, status_tag: str)
        status_tag: 'VERIFIED', 'ALREADY_MARKED', 'INVALID', 'WRONG_EVENT'
        """
        event = Event.query.get(event_id)
        if not event:
            return False, "Event does not exist.", {}, "INVALID"

        if not is_admin and event.host_id != host_id:
            return False, "You are not authorized to mark attendance for this event.", {}, "FORBIDDEN"

        code = extract_code_from_raw(raw_code)
        if not code:
            return False, "Registration code is empty.", {}, "INVALID"

        # Lookup registration by code, ID (e.g. reg-101 or 101), or roll number
        query = Registration.query.filter(
            (Registration.registration_code == code) |
            (Registration.roll_number.ilike(code))
        )
        
        # Also check numeric ID if string is integer or 'reg-<id>'
        if code.isdigit():
            query = query.union(Registration.query.filter(Registration.id == int(code)))
        elif code.lower().startswith('reg-') and code[4:].isdigit():
            query = query.union(Registration.query.filter(Registration.id == int(code[4:])))

        registration = query.first()

        if not registration:
            return False, f"Invalid registration code: '{code}'. No matching student record found.", {}, "INVALID"

        # Check if registration is for this specific event
        if registration.event_id != event_id:
            return False, f"Wrong event: This entry pass belongs to '{registration.event_ref.event_name if registration.event_ref else 'another event'}'.", {
                "registration": registration.to_dict()
            }, "WRONG_EVENT"

        if registration.status != 'CONFIRMED':
            return False, f"Registration is marked as {registration.status}.", {
                "registration": registration.to_dict()
            }, "INVALID"

        # Check if already marked present
        existing_att = Attendance.query.filter_by(registration_id=registration.id).first()
        if existing_att and existing_att.attendance_status == 'PRESENT':
            return False, f"Attendance was already marked at {existing_att.scanned_at.strftime('%H:%M:%S')} for {registration.student_name}.", {
                "registration": registration.to_dict(),
                "attendance": existing_att.to_dict()
            }, "ALREADY_MARKED"

        # Create or update attendance record
        now_dt = datetime.now(timezone.utc)
        if not existing_att:
            att = Attendance(
                event_id=event_id,
                registration_id=registration.id,
                student_name=registration.student_name,
                roll_number=registration.roll_number,
                entry_code=registration.registration_code,
                attendance_status='PRESENT',
                scanned_at=now_dt
            )
            db.session.add(att)
        else:
            existing_att.attendance_status = 'PRESENT'
            existing_att.scanned_at = now_dt

        db.session.commit()

        return True, f"Entry Verified: Attendance marked for {registration.student_name} ({registration.roll_number}).", {
            "registration": registration.to_dict(),
            "student": {
                "name": registration.student_name,
                "roll_number": registration.roll_number,
                "department": registration.department
            }
        }, "VERIFIED"

    @staticmethod
    def toggle_attendance(registration_id: int, host_id: int, is_admin: bool = False):
        reg = Registration.query.get(registration_id)
        if not reg:
            return None, "Registration record not found."

        if not is_admin and reg.event_ref and reg.event_ref.host_id != host_id:
            return None, "You do not own this event."

        att = Attendance.query.filter_by(registration_id=registration_id).first()
        if not att:
            att = Attendance(
                event_id=reg.event_id,
                registration_id=reg.id,
                student_name=reg.student_name,
                roll_number=reg.roll_number,
                entry_code=reg.registration_code,
                attendance_status='PRESENT',
                scanned_at=datetime.now(timezone.utc)
            )
            db.session.add(att)
        else:
            if att.attendance_status == 'PRESENT':
                att.attendance_status = 'NOT_ATTENDED'
            else:
                att.attendance_status = 'PRESENT'
                att.scanned_at = datetime.now(timezone.utc)

        db.session.commit()
        return reg.to_dict(), ""
