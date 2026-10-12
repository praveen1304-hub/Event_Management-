import re
from datetime import datetime, date

EMAIL_REGEX = r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$'

def is_valid_email(email: str) -> bool:
    if not email or not isinstance(email, str):
        return False
    return bool(re.match(EMAIL_REGEX, email.strip()))

def validate_registration_input(data: dict) -> tuple[bool, str]:
    if not data:
        return False, "Request payload is empty."
    
    student_name = (data.get('student_name') or data.get('studentName') or '').strip()
    roll_number = (data.get('roll_number') or data.get('rollNumber') or '').strip()
    department = (data.get('department') or '').strip()
    year = str(data.get('year') or '').strip()
    email = (data.get('email') or '').strip()
    
    if not student_name or len(student_name) < 2:
        return False, "Student Name must be at least 2 characters long."
        
    if not roll_number or len(roll_number) < 2:
        return False, "Valid College Roll Number / ID is required."
        
    if not department:
        return False, "Department is required."
        
    if not year:
        return False, "Year of study is required."
        
    if not email or not is_valid_email(email):
        return False, "A valid email address is required."
        
    return True, ""

def validate_event_input(data: dict) -> tuple[bool, str]:
    if not data:
        return False, "Request payload is empty."
        
    name = (data.get('event_name') or data.get('name') or '').strip()
    category = (data.get('category') or '').strip()
    description = (data.get('description') or '').strip()
    event_date = str(data.get('event_date') or data.get('date') or '').strip()
    start_time = str(data.get('start_time') or data.get('startTime') or '').strip()
    venue = (data.get('venue') or '').strip()
    capacity = data.get('capacity')
    
    if not name:
        return False, "Event Name is required."
        
    if not category:
        return False, "Event Category is required."
        
    if not description:
        return False, "Event Description is required."
        
    if not event_date:
        return False, "Event Date is required."
        
    if not start_time:
        return False, "Start Time is required."
        
    if not venue:
        return False, "Venue location is required."
        
    try:
        cap_val = int(capacity)
        if cap_val <= 0:
            return False, "Capacity must be a positive integer."
    except (ValueError, TypeError):
        return False, "Capacity must be a valid number."
        
    return True, ""
