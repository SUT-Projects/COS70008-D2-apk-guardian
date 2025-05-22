from flask import Blueprint, jsonify
from datetime import datetime
from os import path
from services import prediction_service

prediction_route_bp = Blueprint("prediction", __name__, url_prefix="/prediction")

prediction_route_bp.add_url_rule("/upload", view_func=prediction_service.predict, methods=["POST"])
prediction_route_bp.add_url_rule("/", view_func=prediction_service.get_all_predictions, methods=["GET"])

@prediction_route_bp.route("/<prediction_id>", methods=["GET"])
def fetch_prediction(prediction_id):
    doc, error = prediction_service.get_prediction_by_id(prediction_id)

    if error == "invalid_format":
        return jsonify({"error": "Invalid prediction ID format"}), 400

    if error == "not_found":
        return jsonify({"error": "Prediction not found"}), 404

    # success!
    return jsonify(doc), 200