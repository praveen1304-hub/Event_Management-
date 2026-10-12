from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from backend.services.auth_service import AuthService
from backend.utils.response import success_response, error_response, unauthorized_response
from backend.models.host import Host
from backend.models.admin import Admin

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

@auth_bp.route('/host/login', methods=['POST'])
def host_login():
    data = request.get_json() or {}
    email = data.get('email', '')
    password = data.get('password', '')

    success, message, result = AuthService.host_login(email, password)
    if not success:
        return error_response(message=message, status_code=401)

    return success_response(data=result, message=message)

@auth_bp.route('/admin/login', methods=['POST'])
def admin_login():
    data = request.get_json() or {}
    email = data.get('email', '')
    password = data.get('password', '')

    success, message, result = AuthService.admin_login(email, password)
    if not success:
        return error_response(message=message, status_code=401)

    return success_response(data=result, message=message)

@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_current_user():
    claims = get_jwt()
    user_id = get_jwt_identity()
    role = claims.get('role')

    if role == 'host':
        host = Host.query.get(user_id)
        if not host:
            return unauthorized_response("Host account not found.")
        return success_response(data={"role": "host", "user": host.to_dict()})
    elif role == 'admin':
        admin = Admin.query.get(user_id)
        if not admin:
            return unauthorized_response("Admin account not found.")
        return success_response(data={"role": "admin", "user": admin.to_dict()})

    return error_response("Invalid role in token.", status_code=400)
