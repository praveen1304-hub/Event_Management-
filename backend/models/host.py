from datetime import datetime, timezone
from werkzeug.security import generate_password_hash, check_password_hash
from backend.extensions import db

class Host(db.Model):
    __tablename__ = 'hosts'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    department = db.Column(db.String(120), nullable=False)
    organization = db.Column(db.String(150), default='Department Host')
    phone = db.Column(db.String(30), default='')
    avatar = db.Column(db.String(255), default='https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120')
    role = db.Column(db.String(20), default='host', nullable=False)
    status = db.Column(db.String(20), default='active', nullable=False) # 'active', 'deactivated', 'blocked'
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    # Relationship to Events
    events = db.relationship('Event', backref='host_ref', lazy=True, cascade="all, delete-orphan")

    def set_password(self, password: str):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password: str) -> bool:
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        total_events = len(self.events) if self.events else 0
        total_regs = sum(len(e.registrations) for e in self.events) if self.events else 0
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "department": self.department,
            "organization": self.organization,
            "phone": self.phone,
            "avatar": self.avatar,
            "role": self.role,
            "status": self.status,
            "total_events": total_events,
            "totalEventsCreated": total_events,
            "total_registrations": total_regs,
            "totalRegistrationsReceived": total_regs,
            "created_date": self.created_at.strftime('%Y-%m-%d') if self.created_at else None,
            "createdDate": self.created_at.strftime('%Y-%m-%d') if self.created_at else None,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
        }
