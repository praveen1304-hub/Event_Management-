from datetime import datetime, timezone
from backend.extensions import db

class Registration(db.Model):
    __tablename__ = 'registrations'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    event_id = db.Column(db.Integer, db.ForeignKey('events.id', ondelete='CASCADE'), nullable=False, index=True)
    student_name = db.Column(db.String(120), nullable=False)
    roll_number = db.Column(db.String(60), nullable=False, index=True)
    department = db.Column(db.String(120), nullable=False)
    year = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    registration_code = db.Column(db.String(60), unique=True, nullable=False, index=True)
    registration_date = db.Column(db.String(30), default=lambda: datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M'))
    status = db.Column(db.String(30), default='CONFIRMED', nullable=False) # CONFIRMED, CANCELLED
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    # Relationship to Attendance
    attendance = db.relationship('Attendance', backref='registration_ref', uselist=False, lazy=True, cascade="all, delete-orphan")

    __table_args__ = (
        db.UniqueConstraint('event_id', 'roll_number', name='uq_event_roll'),
    )

    def to_dict(self):
        attended = bool(self.attendance and self.attendance.attendance_status == 'PRESENT')
        attended_at = self.attendance.scanned_at.strftime('%Y-%m-%d %H:%M') if (self.attendance and self.attendance.scanned_at) else None
        
        event_name = self.event_ref.event_name if self.event_ref else "Campus Event"
        event_date = self.event_ref.event_date if self.event_ref else ""
        event_time = self.event_ref.start_time if self.event_ref else ""
        event_venue = self.event_ref.venue if self.event_ref else ""

        return {
            "id": self.id,
            "registration_id": self.id,
            "registrationId": f"reg-{self.id}",
            "event_id": self.event_id,
            "eventId": self.event_id,
            "event_name": event_name,
            "eventName": event_name,
            "event_date": event_date,
            "eventDate": event_date,
            "event_time": event_time,
            "eventTime": event_time,
            "event_venue": event_venue,
            "eventVenue": event_venue,
            "student_name": self.student_name,
            "studentName": self.student_name,
            "roll_number": self.roll_number,
            "rollNumber": self.roll_number,
            "department": self.department,
            "year": self.year,
            "email": self.email,
            "registration_code": self.registration_code,
            "event_code": self.registration_code,
            "eventCode": self.registration_code,
            "registration_date": self.registration_date,
            "registrationDate": self.registration_date,
            "status": self.status,
            "attended": attended,
            "attended_at": attended_at,
            "attendedAt": attended_at
        }
