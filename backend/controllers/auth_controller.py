from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, decode_token
from services import auth_service


auth_router_bp = Blueprint('auth', __name__, url_prefix='/auth')

#
auth_router_bp.add_url_rule(
    '/login', view_func=auth_service.login, methods=['POST'])
auth_router_bp.add_url_rule(
    '/register', view_func=auth_service.register, methods=['POST'])
auth_router_bp.add_url_rule(
    '/forgot-password', view_func=auth_service.forgot_password, methods=['POST'])
# auth_router_bp.add_url_rule('/reset-password', view_func=auth_service.reset_password, methods=['POST'])


@auth_router_bp.route('/reset-password', methods=['POST'])
@jwt_required(refresh=True)  # Ensure only refresh tokens are accepted
def reset_password_route():
    try:
        request_json = request.get_json()

        # Check for new_password field
        if "new_password" not in request_json:
            return jsonify({
                "error": True,
                "message": "Missing 'new_password' in request body",
                "status": 400
            }), 400

        # Extract token from Authorization header
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return jsonify({
                "error": True,
                "message": "Missing Authorization header",
                "status": 401
            }), 401

        token = auth_header.split()[1]  # Extract the actual token
        decoded_token = decode_token(token)
        email = decoded_token.get("sub")

        if not email:
            return jsonify({
                "error": True,
                "message": "Invalid or missing email in token",
                "status": 401
            }), 401

        result = auth_service.reset_password(email, request_json["new_password"])

        if result["error"]:
            return jsonify({
                "error": True,
                "message": result["message"],
                "status": 400
            }), 400

        return jsonify({
            "error": False,
            "message": "Password reset successful",
            "status": 200
        }), 200

    except Exception as e:
        return jsonify({
            "error": True,
            "message": str(e),
            "status": 500
        }), 500