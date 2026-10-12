from functools import wraps
from flask_jwt_extended import verify_jwt_in_request, get_jwt, get_jwt_identity
from backend.utils.response import unauthorized_response, forbidden_response
from backend.models.host import Host
from backend.models.admin import Admin

def host_required():
    """
    Decorator requiring a valid JWT with role 'host' or 'admin'.
    """
    def wrapper(fn):
        @wraps(fn)
        def decorator(*args, **kwargs):
            try:
                verify_jwt_in_request()
            except Exception as e:
                return unauthorized_response(f"Invalid or missing token: {str(e)}")
                
            claims = get_jwt()
            role = claims.get('role', '').lower()
            user_id = get_jwt_identity()
            
            if role not in ['host', 'admin']:
                return forbidden_response("Host or Admin access required.")
                
            # If role is host, verify host exists and is active
            if role == 'host':
                host = Host.query.get(user_id)
                if not host:
                    return unauthorized_response("Host account not found.")
                if host.status.lower() in ['inactive', 'deactivated', 'blocked']:
                    return forbidden_response("Host account is deactivated or blocked.")
                    
            return fn(*args, **kwargs)
        return decorator
    return wrapper

def admin_required():
    """
    Decorator requiring a valid JWT with role 'admin'.
    """
    def wrapper(fn):
        @wraps(fn)
        def decorator(*args, **kwargs):
            try:
                verify_jwt_in_request()
            except Exception as e:
                return unauthorized_response(f"Invalid or missing token: {str(e)}")
                
            claims = get_jwt()
            role = claims.get('role', '').lower()
            user_id = get_jwt_identity()
            
            if role != 'admin':
                return forbidden_response("Superadmin access required.")
                
            admin = Admin.query.get(user_id)
            if not admin:
                return unauthorized_response("Admin account not found.")
            if admin.status.lower() in ['inactive', 'deactivated', 'blocked']:
                return forbidden_response("Admin account is deactivated or blocked.")
                
            return fn(*args, **kwargs)
        return decorator
    return wrapper
