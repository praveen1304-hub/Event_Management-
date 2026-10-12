from backend.routes.auth_routes import auth_bp
from backend.routes.event_routes import event_bp
from backend.routes.registration_routes import registration_bp
from backend.routes.host_routes import host_bp
from backend.routes.admin_routes import admin_bp

def register_routes(app):
    app.register_blueprint(auth_bp)
    app.register_blueprint(event_bp)
    app.register_blueprint(registration_bp)
    app.register_blueprint(host_bp)
    app.register_blueprint(admin_bp)
