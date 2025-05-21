from flask import Blueprint
from datetime import datetime
from os import path
from services import prediction_service

prediction_route_bp = Blueprint("prediction", __name__, url_prefix="/prediction")

prediction_route_bp.add_url_rule("/upload", view_func=prediction_service.predict, methods=["POST"])

@prediction_route_bp.route("/", methods=["GET"])
def home_page():
    return {"message": "Hello Prediction", "date": datetime.now()}

