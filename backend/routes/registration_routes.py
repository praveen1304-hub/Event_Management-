from flask import Blueprint, request, jsonify
from backend.services.registration_service import RegistrationService
from backend.services.email_service import EmailService
from backend.utils.validators import validate_registration_input
from backend.utils.response import success_response, error_response, not_found_response

registration_bp = Blueprint('registrations', __name__, url_prefix='/api')

@registration_bp.route('/events/<int:event_id>/register', methods=['POST'])
def register_student(event_id):
    """
    Public student RSVP endpoint. No student login required.
    Saves registration in database first, then dispatches confirmation email to the participant.
    """
    data = request.get_json() or {}
    
    is_valid, validation_msg = validate_registration_input(data)
    if not is_valid:
        return jsonify({
            "success": False,
            "registration_success": False,
            "email_sent": False,
            "message": validation_msg
        }), 400

    success, message, result, status_code, email_sent = RegistrationService.register_student(event_id, data)
    if not success:
        return jsonify({
            "success": False,
            "registration_success": False,
            "email_sent": False,
            "message": message,
            "registration": result if result else None
        }), status_code

    return jsonify({
        "success": True,
        "registration_success": True,
        "email_sent": email_sent,
        "message": message,
        "registration": result
    }), status_code

@registration_bp.route('/test-email', methods=['POST'])
def test_email():
    """
    Endpoint to test SMTP configuration and send test email to the requested address.
    """
    data = request.get_json() or {}
    recipient_email = data.get('email', '').strip()
    if not recipient_email:
        return jsonify({
            "success": False,
            "email_sent": False,
            "message": "Email address is required in JSON payload (e.g. {'email': 'participant@example.com'})."
        }), 400

    if not EmailService.is_valid_email(recipient_email):
        return jsonify({
            "success": False,
            "email_sent": False,
            "message": "Invalid recipient email address format."
        }), 400

    success, msg = EmailService.send_test_email(recipient_email)
    if success:
        return jsonify({
            "success": True,
            "email_sent": True,
            "message": f"Test email accepted by SMTP server and sent to {recipient_email}."
        }), 200
    else:
        return jsonify({
            "success": False,
            "email_sent": False,
            "message": "Test email failed.",
            "error": msg
        }), 500

@registration_bp.route('/registrations/<registration_id>', methods=['GET'])
def get_registration(registration_id):
    reg = RegistrationService.get_registration_by_id(registration_id)
    if not reg:
        return not_found_response("Entry pass registration not found.")
    return success_response(data=reg, message="Registration entry pass details retrieved successfully.")

@registration_bp.route('/registrations/<registration_id>/resend-email', methods=['POST'])
def resend_verification_email(registration_id):
    reg = RegistrationService.get_registration_by_id(registration_id)
    if not reg:
        return not_found_response("Registration not found.")

    email_sent, email_msg = EmailService.send_confirmation_email(reg)
    if email_sent:
        return jsonify({
            "success": True,
            "message": f"Confirmation email resent successfully to {reg.get('email')}.",
            "email_sent": True
        }), 200
    else:
        return jsonify({
            "success": False,
            "message": f"Failed to resend email: {email_msg}",
            "email_sent": False
        }), 500
