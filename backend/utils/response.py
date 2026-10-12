from flask import jsonify

def success_response(data=None, message="Operation successful", status_code=200):
    """
    Standard successful JSON API response.
    Format:
    {
        "success": true,
        "message": "...",
        "data": { ... }
    }
    """
    payload = {
        "success": True,
        "message": message
    }
    if data is not None:
        payload["data"] = data
    return jsonify(payload), status_code

def error_response(message="An error occurred", status_code=400, errors=None):
    """
    Standard error JSON API response.
    Format:
    {
        "success": false,
        "message": "...",
        "errors": [...]
    }
    """
    payload = {
        "success": False,
        "message": message
    }
    if errors is not None:
        payload["errors"] = errors
    return jsonify(payload), status_code

def created_response(data=None, message="Resource created successfully"):
    return success_response(data=data, message=message, status_code=201)

def not_found_response(message="Resource not found"):
    return error_response(message=message, status_code=404)

def unauthorized_response(message="Unauthorized access"):
    return error_response(message=message, status_code=401)

def forbidden_response(message="You do not have permission to perform this action"):
    return error_response(message=message, status_code=403)

def conflict_response(message="Conflict with existing resource"):
    return error_response(message=message, status_code=409)
