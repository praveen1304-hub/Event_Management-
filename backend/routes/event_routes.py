from flask import Blueprint, request
from backend.services.event_service import EventService
from backend.utils.response import success_response, error_response, not_found_response

event_bp = Blueprint('events', __name__, url_prefix='/api/events')

@event_bp.route('', methods=['GET'])
def get_events():
    category = request.args.get('category')
    search = request.args.get('search')
    date_filter = request.args.get('dateFilter') or request.args.get('date_filter')

    events = EventService.get_public_events(category=category, search=search, date_filter=date_filter)
    return success_response(data=events, message="Events retrieved successfully.")

@event_bp.route('/<int:event_id>', methods=['GET'])
def get_event(event_id):
    event = EventService.get_event_by_id(event_id)
    if not event:
        return not_found_response("Event not found.")
    return success_response(data=event, message="Event details retrieved successfully.")
