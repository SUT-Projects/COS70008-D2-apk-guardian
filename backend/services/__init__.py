
from .user_service import UserService
from .auth_service import AuthService
from .prediction_service import PredictionService
from os import path

user_service = UserService()
auth_service = AuthService(user_service)

model_dir = path.join(path.dirname(__file__).replace("/services", ""), 'model')
prediction_service = PredictionService(model_dir)


