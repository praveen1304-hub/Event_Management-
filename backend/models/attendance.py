from datetime import datetime, timezone
from backend.extensions import db

class Attendance(db.Model):
    __tablename__ = 'attendance'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    event_id = db.Column(db.Integer, db.ForeignKey('events.id', ondelete='CASCADE'), nullable=False, index=True)
    registration_id = db.Column(db.Integer, db.ForeignKey('registrations.id', ondelete='CASCADE'), unique=True, nullable=False, index=True)
    student_name = db.Column(db.String(120), nullable=False)
    roll_number = db.Column(db.String(60), nullable=False)
    entry_code = db.Column(db.String(60), nullable=False)
    attendance_status = db.Column(db.String(30), default='PRESENT', nullable=False) # PRESENT, NOT_ATTENDED
    scanned_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    def to_dict(self):
        return {
            "id": self.id,
            "event_id": self.event_id,
            "registration_id": self.registration_id,
            "student_name": self.student_name,
            "roll_number": self.roll_number,
            "entry_code": self.entry_code,
            "attendance_status": self.attendance_status,
            "scanned_at": self.scanned_at.strftime('%Y-%m-%d %H:%M:%S') if self.scanned_at else None
        }
