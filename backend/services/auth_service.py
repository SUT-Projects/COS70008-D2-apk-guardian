from services import UserService
from flask import request, jsonify
from schemas import User
from flask_jwt_extended import create_access_token, create_refresh_token
from datetime import timedelta, datetime
from bson.timestamp import Timestamp
from hashlib import sha256
from factory import get_database_instance


class AuthService:
    def __init__(self, user_service: UserService):
        self.user_service = user_service
        self.db = get_database_instance()
        self.collection_name = "login_history"

    def login(self):
        try:
            request_json = request.get_json()
            # Check for required fields in request body
            if "email" not in request_json or "password" not in request_json:
                return {
                    "error": True,
                    "message": "Missing required fields in request body",
                    "status": 400  # Bad Request
                }

            fetch_user = self.user_service.find_user_by_email(
                request_json["email"],
                password=request_json["password"]
            )
            if fetch_user is None:
                return {
                    "error": True,
                    "message": "Invalid email or password",
                    "status": 401  # Unauthorized
                }

            user = User.to_object(fetch_user)
            if user.account_status == 2:
                return jsonify({
                    "error": True,
                    "message": "Login Failed: Account has been suspended",
                    "status": 200
                })

            if user.account_status == 3:
                return jsonify({
                    "error": True,
                    "message": "Login Failed: Account has been deactivated",
                    "status": 200
                })

            access_token = create_access_token(
                identity=user.to_json(), expires_delta=timedelta(minutes=60))
            refresh_token = create_refresh_token(
                identity=user.to_json(), expires_delta=timedelta(days=7))

            self.user_service.update_user(
                user_id=user._id,
                user_data={
                    "last_login_date": Timestamp(datetime.now(), 1),
                    "updated_date": Timestamp(datetime.now(), 1)
                }
            )
            self.db.get_collection(self.collection_name).insert_one({
                "user_id": user._id,
                "email": user.email,
                "login_date": Timestamp(datetime.now(), 1),
                "ip_address": request.remote_addr,
                "user_agent": request.headers.get('User-Agent')
            })

            return jsonify({
                "error": False,
                "message": "Login successful",
                "access_token": access_token,
                "refresh_token": refresh_token,
                "user": user.to_json(),
                "status": 200
            }), 200

        except Exception as ex:
            return {
                "error": True,
                "message": str(ex),
                "status": 500  # Internal Server Error
            }

    def register(self, username, password):
        if self.user_service.get_user_by_username(username):
            return None
        return self.user_service.create_user(username, password)

    def forgot_password(self):
        try:
            request_json = request.get_json()
            # Check for required fields in request body
            if "email" not in request_json:
                return {
                    "error": True,
                    "message": "Email is required",
                    "status": 400  # Bad Request
                }

            email = request_json["email"]
            # Validate email format
            user = self.user_service.find_user_by_email(email)
            if user is None:
                return {
                    "error": True,
                    "message": "User not found",
                    "status": 404  # Not Found
                }

            reset_token = create_refresh_token(
                identity=email, expires_delta=timedelta(minutes=10))

            return jsonify({
                "error": False,
                "message": "Reset token generated successfully",
                "reset_token": reset_token,
                "status": 200
            }), 200

        except Exception as ex:
            return {
                "error": True,
                "message": str(ex),
                "status": 500  # Internal Server Error
            }

    def reset_password(self, email, new_password):
        try:
            fetched_user = self.user_service.find_user_by_email(email)
            if fetched_user is None:
                return {
                    "error": True,
                    "message": "User not found",
                    "status": 404  # Not Found
                }

            user: User = User.to_object(fetched_user)
            hashed_password = sha256(new_password.encode()).hexdigest()
            self.user_service.update_user(user._id, {
                "password": hashed_password,
                "updated_date": Timestamp(datetime.now(), 1)
            })

            return {
                "error": False,
                "message": "Password reset successfully",
                "status": 200
            }

        except Exception as ex:
            return {
                "error": True,
                "message": str(ex),
                "status": 500  # Internal Server Error
            }
