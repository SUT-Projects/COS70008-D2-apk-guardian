from flask import Blueprint, request, jsonify
from datetime import datetime
import pandas as pd
import numpy as np
import joblib
import tensorflow as tf
from os import path

prediction_route_bp = Blueprint("prediction", __name__)
model_dir = path.join(path.dirname(__file__).replace("/controllers", ""), 'model')


# For CSV-based model — assuming these remain same as before
csv_scaler = joblib.load(path.join(model_dir, 'scaler.pkl'))
encoder = tf.keras.models.load_model(path.join(model_dir, 'encoder_model.keras'))
log_model = joblib.load(path.join(model_dir, 'logistic_model.pkl'))

@prediction_route_bp.route("/", methods=["GET"])
def home_page():
    return {"message": "Hello Prediction", "date": datetime.now()}

@prediction_route_bp.route("/upload", methods=["POST"])
def upload_csv():
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file part'}), 400

        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No selected file'}), 400

        df = pd.read_csv(file)
        df = df.select_dtypes(include=[np.number])
        if df.empty:
            return jsonify({'error': 'No numeric data found in the CSV file.'}), 400

        X = df.fillna(0).values

        X_scaled = csv_scaler.transform(X)
        X_encoded = encoder.predict(X_scaled)
        predictions = log_model.predict(X_encoded)

        return jsonify({'predictions': predictions.tolist()})

    except Exception as e:
        return jsonify({'error': str(e)}), 500