from flask import Blueprint, request, jsonify
from services import user_service
from schemas import User
import inspect

user_router_bp = Blueprint('user', __name__, url_prefix='/user')

user_router_bp.add_url_rule(
    '/get-all-users', view_func=user_service.find_all, methods=['GET'])
user_router_bp.add_url_rule(
    '/create-new-user', view_func=user_service.create_user, methods=['POST'])


@user_router_bp.route('/get-filtered-users', methods=['GET'])
def get_user_by_filters():
    filters = request.args.to_dict()
    if "user_type" in filters:
        filters["user_type"] = int(filters["user_type"])
    
    return user_service.get_user_by_filters(filters)


@user_router_bp.route('/update-user', methods=['PUT'])
def update_user():
    query_params = request.args.to_dict()
    if "user_id" not in query_params:
        return jsonify({ "error": True, "message": "Bad Request: missing user_id" }), 400
        
    # 2. Parse JSON body and ensure it's a non‐empty dict
    request_body = request.get_json()
    if not isinstance(request_body, dict) or len(request_body) == 0:
        return jsonify({ "error": True, "message": "Bad Request: no filter data provided" }), 400
    
    allowed_keys = list(inspect.signature(User.__init__).parameters)[1:]
    valid_keys = set(allowed_keys) - { "_id" }
    
    # 3. Check for any invalid keys
    invalid = set(request_body) - valid_keys
    if invalid:
        return jsonify({
            "error": True,
            "message": f"Bad Request: invalid filter keys: {', '.join(invalid)}"
        }), 400
    
    
    return user_service.update_user(query_params["user_id"], request_body)
