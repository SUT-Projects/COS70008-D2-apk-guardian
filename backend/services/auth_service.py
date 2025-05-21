from services import UserService
from flask import request
from hashlib import sha256


class AuthService:
    def __init__(self, user_service: UserService):
        self.user_service = user_service

    def login(self):
        request_json = request.get_json()
        password = sha256(
        request_json["password"].encode()).hexdigest()
        # Check for required fields in request body
        if "email" not in request_json or "password" not in request_json:
            return {
                "error": True,
                "message": "Missing required fields in request body",
                "status": 400  # Bad Request
            }
            
            
        user = self.user_service.find_user_by_email_and_password(request_json["email"], password)
        if not user:
            return None

    def register(self, username, password):
        if self.user_service.get_user_by_username(username):
            return None
        return self.user_service.create_user(username, password)