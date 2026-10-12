import logging
from datetime import datetime, date
from backend.extensions import db
from backend.models.event import Event
from backend.models.registration import Registration
from backend.services.qr_service import generate_registration_code
from backend.services.email_service import EmailService

logger = logging.getLogger('campuspulse.registration')

class RegistrationService:
    @staticmethod
    def register_student(event_id: int, data: dict) -> tuple[bool, str, dict, int, bool]:
        """
        Public student registration logic:
        1. Validate request
        2. Validate event status, capacity, and deadline
        3. Check duplicate registration by roll number (support allow_update to refresh email & resend pass)
        4. Create registration and COMMIT TO DB FIRST
        5. Attempt to send confirmation email
        6. Return proper status without rolling back DB if email fails

        Returns: (success: bool, message: str, registration_data: dict, status_code: int, email_sent: bool)
        """
        # STEP 1: Validate input
        student_name = (data.get('student_name') or data.get('studentName') or '').strip()
        roll_number = (data.get('roll_number') or data.get('rollNumber') or '').strip().upper()
        department = (data.get('department') or '').strip()
        year = str(data.get('year') or '').strip()
        email = (data.get('email') or '').strip().lower()
        allow_update = bool(data.get('allow_update', False))

        if not student_name or not roll_number or not department or not year or not email:
            return False, "Missing required fields (student_name, roll_number, department, year, email).", {}, 400, False

        if not EmailService.is_valid_email(email):
            return False, f"Invalid email address format: '{email}'.", {}, 400, False

        # STEP 2: Validate Event
        event = Event.query.get(event_id)
        if not event:
            return False, "Event does not exist.", {}, 404, False

        if event.status == 'Cancelled':
            return False, "Registration closed: This event has been cancelled.", {}, 400, False

        if event.status == 'Completed':
            return False, "Registration closed: This event has already concluded.", {}, 400, False

        today_str = date.today().strftime('%Y-%m-%d')
        if event.registration_deadline and today_str > event.registration_deadline:
            return False, f"Registration closed: Deadline passed on {event.registration_deadline}.", {}, 400, False

        # STEP 3: Duplicate Registration Check
        existing_reg = Registration.query.filter(
            Registration.event_id == event_id,
            Registration.roll_number == roll_number
        ).first()

        if existing_reg:
            if allow_update:
                # Update details and dispatch confirmation email to the new address
                existing_reg.student_name = student_name
                existing_reg.department = department
                existing_reg.year = year
                existing_reg.email = email
                db.session.commit()
                logger.info("Updated existing registration #%s (Roll: %s) with email %s", existing_reg.id, roll_number, email)

                reg_dict = existing_reg.to_dict()
                email_sent, email_msg = EmailService.send_confirmation_email(reg_dict)
                reg_dict['email_sent'] = email_sent
                
                if email_sent:
                    msg = "Registration updated successfully. Confirmation email sent."
                else:
                    msg = "Registration updated, but confirmation email could not be delivered."
                return True, msg, reg_dict, 200, email_sent
            else:
                reg_dict = existing_reg.to_dict()
                return False, f"Student ({roll_number}) is already registered for this event. Your pass code is {existing_reg.registration_code}.", reg_dict, 409, False

        # Check Capacity
        current_regs_count = len(event.registrations)
        if current_regs_count >= event.capacity:
            return False, "Event is at full capacity. No seats available.", {}, 400, False

        # STEP 4: Create Registration
        reg_code = generate_registration_code(category=event.category, roll_number=roll_number)
        while Registration.query.filter_by(registration_code=reg_code).first():
            reg_code = generate_registration_code(category=event.category, roll_number=roll_number)

        now_str = datetime.now().strftime('%Y-%m-%d %H:%M')

        registration = Registration(
            event_id=event_id,
            student_name=student_name,
            roll_number=roll_number,
            department=department,
            year=year,
            email=email,
            registration_code=reg_code,
            registration_date=now_str,
            status='CONFIRMED'
        )

        db.session.add(registration)
        event.registration_count = current_regs_count + 1

        # STEP 5: COMMIT TO SQL FIRST
        try:
            db.session.commit()
            logger.info("Saved registration #%s (Code: %s) for student %s in database.", registration.id, reg_code, roll_number)
        except Exception as e:
            db.session.rollback()
            logger.error("Database commit failed for registration: %s", str(e))
            return False, "Database error saving registration.", {}, 500, False

        reg_dict = registration.to_dict()

        # STEP 6: SEND CONFIRMATION EMAIL TO PARTICIPANT
        email_sent, email_msg = EmailService.send_confirmation_email(reg_dict)
        reg_dict['email_sent'] = email_sent

        # STEP 7: RESPONSE FORMAT
        if email_sent:
            message = "Registration successful. Confirmation email sent."
            return True, message, reg_dict, 201, True
        else:
            logger.warning("Registration #%s saved, but email delivery failed: %s", registration.id, email_msg)
            message = "Registration successful, but confirmation email could not be sent."
            return True, message, reg_dict, 201, False

    @staticmethod
    def get_registration_by_id(identifier):
        if identifier is None:
            return None
            
        clean_str = str(identifier).strip()
        
        if clean_str.lower().startswith('reg-'):
            sub_id = clean_str[4:]
            if sub_id.isdigit():
                reg = Registration.query.get(int(sub_id))
                if reg:
                    return reg.to_dict()

        if clean_str.isdigit():
            reg = Registration.query.get(int(clean_str))
            if reg:
                return reg.to_dict()

        reg = Registration.query.filter(Registration.registration_code.ilike(clean_str)).first()
        if reg:
            return reg.to_dict()

        return None

    @staticmethod
    def get_event_registrations(event_id: int):
        regs = Registration.query.filter_by(event_id=event_id).order_by(Registration.created_at.desc()).all()
        return [r.to_dict() for r in regs]
