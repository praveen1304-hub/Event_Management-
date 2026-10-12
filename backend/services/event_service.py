from datetime import datetime, timezone, date
from sqlalchemy import or_
from backend.extensions import db
from backend.models.event import Event
from backend.models.host import Host

class EventService:
    @staticmethod
    def get_public_events(category=None, search=None, date_filter=None):
        """
        Fetches all public visible events.
        Excludes Cancelled and Draft events — only shows 'Upcoming' and 'Live' events.
        """
        query = Event.query.filter(Event.status.in_(['Upcoming', 'Live']))

        if category and category != 'All':
            query = query.filter(Event.category == category)

        if search:
            search_pattern = f"%{search.strip()}%"
            query = query.filter(
                or_(
                    Event.event_name.ilike(search_pattern),
                    Event.description.ilike(search_pattern),
                    Event.venue.ilike(search_pattern),
                    Event.category.ilike(search_pattern)
                )
            )

        today_str = date.today().strftime('%Y-%m-%d')
        if date_filter == 'today':
            query = query.filter(Event.event_date == today_str)
        elif date_filter == 'upcoming':
            query = query.filter(Event.event_date >= today_str)
        elif date_filter == 'this-month':
            this_month_prefix = today_str[:7]
            query = query.filter(Event.event_date.startswith(this_month_prefix))

        # Order by date ascending
        events = query.order_by(Event.event_date.asc(), Event.start_time.asc()).all()
        return [e.to_dict() for e in events]

    @staticmethod
    def get_event_by_id(event_id: int):
        event = Event.query.get(event_id)
        if not event:
            return None
        return event.to_dict()

    @staticmethod
    def get_host_events(host_id: int):
        events = Event.query.filter_by(host_id=host_id).order_by(Event.event_date.desc()).all()
        return [e.to_dict() for e in events]

    @staticmethod
    def create_event(host_id: int, data: dict):
        event = Event(
            host_id=host_id,
            event_name=(data.get('event_name') or data.get('name') or '').strip(),
            category=(data.get('category') or 'Workshop').strip(),
            description=(data.get('description') or '').strip(),
            poster=(data.get('poster') or 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800').strip(),
            event_date=str(data.get('event_date') or data.get('date') or '').strip(),
            start_time=str(data.get('start_time') or data.get('startTime') or '10:00').strip(),
            end_time=str(data.get('end_time') or data.get('endTime') or '').strip(),
            venue=(data.get('venue') or '').strip(),
            registration_deadline=str(data.get('registration_deadline') or data.get('registrationDeadline') or data.get('event_date') or data.get('date') or '').strip(),
            capacity=int(data.get('capacity') or 100),
            status=data.get('status', 'Upcoming')
        )
        
        rules_input = data.get('rules', [])
        event.set_rules_list(rules_input)

        db.session.add(event)
        db.session.commit()
        return event.to_dict()

    @staticmethod
    def update_event(event_id: int, host_id: int, data: dict, is_admin: bool = False):
        event = Event.query.get(event_id)
        if not event:
            return None, "Event not found."

        # Ownership check unless admin
        if not is_admin and event.host_id != host_id:
            return None, "You do not have permission to edit this event."

        if 'event_name' in data or 'name' in data:
            event.event_name = (data.get('event_name') or data.get('name')).strip()
        if 'category' in data:
            event.category = data['category'].strip()
        if 'description' in data:
            event.description = data['description'].strip()
        if 'poster' in data and data['poster']:
            event.poster = data['poster'].strip()
        if 'event_date' in data or 'date' in data:
            event.event_date = str(data.get('event_date') or data.get('date')).strip()
        if 'start_time' in data or 'startTime' in data:
            event.start_time = str(data.get('start_time') or data.get('startTime')).strip()
        if 'end_time' in data or 'endTime' in data:
            event.end_time = str(data.get('end_time') or data.get('endTime')).strip()
        if 'venue' in data:
            event.venue = data['venue'].strip()
        if 'registration_deadline' in data or 'registrationDeadline' in data:
            event.registration_deadline = str(data.get('registration_deadline') or data.get('registrationDeadline')).strip()
        if 'capacity' in data and data['capacity']:
            event.capacity = int(data['capacity'])
        if 'status' in data:
            event.status = data['status']
        if 'rules' in data:
            event.set_rules_list(data['rules'])

        db.session.commit()
        return event.to_dict(), ""

    @staticmethod
    def update_status(event_id: int, new_status: str):
        event = Event.query.get(event_id)
        if not event:
            return None, "Event not found."
            
        event.status = new_status
        db.session.commit()
        return event.to_dict(), ""

    @staticmethod
    def delete_event(event_id: int, host_id: int, is_admin: bool = False):
        event = Event.query.get(event_id)
        if not event:
            return False, "Event not found."

        if not is_admin and event.host_id != host_id:
            return False, "You do not have permission to delete this event."

        # Safety check: if registrations exist, mark as CANCELLED rather than destroying history
        if event.registrations and len(event.registrations) > 0 and not is_admin:
            event.status = 'Cancelled'
            db.session.commit()
            return True, "Event has existing registrations. Marked as Cancelled."

        db.session.delete(event)
        db.session.commit()
        return True, "Event deleted successfully."
