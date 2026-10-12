import os
import sys
import logging
from flask import Flask, jsonify, redirect, request
from dotenv import load_dotenv

BASE_DIR = os.path.abspath(os.path.dirname(__file__))
PARENT_DIR = os.path.abspath(os.path.join(BASE_DIR, '..'))
if PARENT_DIR not in sys.path:
    sys.path.insert(0, PARENT_DIR)

# Explicitly load .env from backend directory
load_dotenv(os.path.join(BASE_DIR, '.env'))

# Setup structured logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] [%(name)s] %(message)s'
)

from backend.config import Config
from backend.extensions import db, jwt, cors, migrate
from backend.routes import register_routes
from backend.utils.response import error_response, unauthorized_response

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Initialize CORS for all origins (Localhost, 127.0.0.1, and Local Wi-Fi network IPs)
    cors.init_app(
        app,
        resources={r"/api/*": {"origins": "*"}},
        supports_credentials=False
    )

    # Initialize SQLAlchemy & Migrations
    db.init_app(app)
    migrate.init_app(app, db)

    # Initialize JWT
    jwt.init_app(app)

    # JWT Error Callbacks
    @jwt.unauthorized_loader
    def custom_unauthorized_response(err_str):
        return unauthorized_response(f"Authentication required: {err_str}")

    @jwt.invalid_token_loader
    def custom_invalid_token_response(err_str):
        return unauthorized_response(f"Invalid authentication token: {err_str}")

    @jwt.expired_token_loader
    def custom_expired_token_response(jwt_header, jwt_payload):
        return unauthorized_response("Authentication token has expired. Please login again.")

    # Register API Blueprints
    register_routes(app)

    # Root redirect to Frontend (prevents 404 on localhost:5000/)
    @app.route('/', methods=['GET'])
    def root_index():
        frontend_url = os.getenv('FRONTEND_URL', 'http://localhost:3000').strip()
        return redirect(frontend_url)

    # Smart 404 Handler: Redirect non-API browser requests to Frontend port 3000
    @app.errorhandler(404)
    def handle_not_found(e):
        path = request.path
        if not path.startswith('/api'):
            frontend_url = os.getenv('FRONTEND_URL', 'http://localhost:3000').strip().rstrip('/')
            return redirect(f"{frontend_url}{path}")
        return jsonify({
            "success": False,
            "message": f"API endpoint '{path}' not found on backend."
        }), 404

    # Health Check API
    @app.route('/api/health', methods=['GET'])
    def health_check():
        return jsonify({
            "status": "healthy",
            "service": "CampusPulse Backend API",
            "version": "1.0.0",
            "database": app.config['SQLALCHEMY_DATABASE_URI'].split('://')[0],
            "smtp_configured": bool(os.getenv('SMTP_SERVER') and os.getenv('SMTP_USERNAME'))
        }), 200

    # Auto-initialize database tables
    with app.app_context():
        db.create_all()

    return app

app = create_app()

if __name__ == '__main__':
    print("=" * 60)
    print("[CampusPulse] College Event & RSVP Tracker API Server")
    print("[CampusPulse] Backend running on all interfaces: http://0.0.0.0:5000")
    print(f"[CampusPulse] SMTP server configured: {bool(os.getenv('SMTP_SERVER'))}")
    print(f"[CampusPulse] SMTP username configured: {bool(os.getenv('SMTP_USERNAME'))}")
    print(f"[CampusPulse] SMTP password configured: {bool(os.getenv('SMTP_PASSWORD'))}")
    print(f"[CampusPulse] SMTP from email configured: {bool(os.getenv('SMTP_FROM_EMAIL'))}")
    print("=" * 60)
    app.run(host='0.0.0.0', port=5000, debug=False)
