from flask_jwt_extended import create_access_token
from backend.models.host import Host
from backend.models.admin import Admin

class AuthService:
    @staticmethod
    def host_login(email: str, password: str) -> tuple[bool, str, dict]:
        if not email or not password:
            return False, "Email and password are required.", {}

        clean_email = email.strip().lower()
        host = Host.query.filter(Host.email.ilike(clean_email)).first()

        if not host:
            return False, "Invalid host email or password.", {}

        if not host.check_password(password):
            return False, "Invalid host email or password.", {}

        if host.status.lower() in ['inactive', 'deactivated', 'blocked']:
            return False, f"Your host account has been {host.status}. Please contact college administration.", {}

        # Generate JWT Token with role claim
        additional_claims = {
            "role": "host",
            "email": host.email,
            "name": host.name,
            "department": host.department
        }
        token = create_access_token(identity=str(host.id), additional_claims=additional_claims)

        return True, "Host authentication successful.", {
            "token": token,
            "host": host.to_dict()
        }

    @staticmethod
    def admin_login(email: str, password: str) -> tuple[bool, str, dict]:
        if not email or not password:
            return False, "Email and password are required.", {}

        clean_email = email.strip().lower()
        admin = Admin.query.filter(Admin.email.ilike(clean_email)).first()

        if not admin:
            return False, "Invalid admin email or password.", {}

        if not admin.check_password(password):
            return False, "Invalid admin email or password.", {}

        if admin.status.lower() in ['inactive', 'deactivated', 'blocked']:
            return False, f"Your administrator account has been {admin.status}.", {}

        # Generate JWT Token with admin role claim
        additional_claims = {
            "role": "admin",
            "email": admin.email,
            "name": admin.name
        }
        token = create_access_token(identity=str(admin.id), additional_claims=additional_claims)

        return True, "Admin authentication successful.", {
            "token": token,
            "admin": admin.to_dict()
        }
