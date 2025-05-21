from flask import Blueprint
from services import user_service

user_router_bp = Blueprint('user', __name__, url_prefix='/user')

user_router_bp.add_url_rule('/get-all-users', view_func=user_service.find_all, methods=['GET'])
user_router_bp.add_url_rule('/create-new-user', view_func=user_service.create_user, methods=['POST'])