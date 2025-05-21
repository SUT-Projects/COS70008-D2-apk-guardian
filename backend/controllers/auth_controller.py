from flask import Blueprint, request, jsonify
from services import auth_service


auth_router_bp = Blueprint('auth', __name__, url_prefix='/auth')

# 
auth_router_bp.add_url_rule('/login', view_func=auth_service.login, methods=['POST'])