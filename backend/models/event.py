import json
from datetime import datetime, timezone
from backend.extensions import db

class Event(db.Model):
    __tablename__ = 'events'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    host_id = db.Column(db.Integer, db.ForeignKey('hosts.id', ondelete='CASCADE'), nullable=False, index=True)
    event_name = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    category = db.Column(db.String(80), nullable=False, index=True)
    poster = db.Column(db.String(500), default='https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800')
    event_date = db.Column(db.String(20), nullable=False, index=True) # YYYY-MM-DD
    start_time = db.Column(db.String(20), nullable=False) # HH:MM
    end_time = db.Column(db.String(20), default='')
    venue = db.Column(db.String(250), nullable=False)
    registration_deadline = db.Column(db.String(20), nullable=True) # YYYY-MM-DD
    capacity = db.Column(db.Integer, default=100, nullable=False)
    registration_count = db.Column(db.Integer, default=0, nullable=False)
    status = db.Column(db.String(30), default='Upcoming', nullable=False) # Upcoming, Live, Completed, Cancelled, Draft
    rules = db.Column(db.Text, default='[]') # JSON serialized list of strings
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    # Relationships
    registrations = db.relationship('Registration', backref='event_ref', lazy=True, cascade="all, delete-orphan")
    attendances = db.relationship('Attendance', backref='event_ref', lazy=True, cascade="all, delete-orphan")

    def get_rules_list(self):
        if not self.rules:
            return []
        try:
            parsed = json.loads(self.rules)
            return parsed if isinstance(parsed, list) else [str(parsed)]
        except Exception:
            return [r.strip() for r in self.rules.split('\n') if r.strip()]

    def set_rules_list(self, rules_list):
        if isinstance(rules_list, list):
            self.rules = json.dumps(rules_list)
        elif isinstance(rules_list, str):
            lines = [r.strip() for r in rules_list.split('\n') if r.strip()]
            self.rules = json.dumps(lines)
        else:
            self.rules = json.dumps([])

    def to_dict(self):
        # Auto-fetch host details
        host_name = self.host_ref.name if self.host_ref else "Campus Organizer"
        organizer = self.host_ref.organization if (self.host_ref and self.host_ref.organization) else (self.host_ref.department if self.host_ref else "College Department")

        # Live registered count sync
        reg_count = len(self.registrations) if self.registrations else self.registration_count

        return {
            "id": self.id,
            "host_id": self.host_id,
            "hostId": self.host_id,
            "host_name": host_name,
            "hostName": host_name,
            "organizer": organizer,
            "name": self.event_name,
            "event_name": self.event_name,
            "description": self.description,
            "category": self.category,
            "poster": self.poster,
            "date": self.event_date,
            "event_date": self.event_date,
            "start_time": self.start_time,
            "startTime": self.start_time,
            "end_time": self.end_time,
            "endTime": self.end_time,
            "venue": self.venue,
            "registration_deadline": self.registration_deadline,
            "registrationDeadline": self.registration_deadline,
            "capacity": self.capacity,
            "registered_count": reg_count,
            "registeredCount": reg_count,
            "status": self.status,
            "rules": self.get_rules_list(),
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
        }
