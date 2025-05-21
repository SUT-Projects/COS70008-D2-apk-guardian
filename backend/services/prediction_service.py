from flask import jsonify, request
import joblib
import tensorflow as tf
import pandas as pd
import numpy as np
from os import path


class PredictionService:
    def __init__(self, model_dir: str):
        # For CSV-based model — assuming these remain same as before
        self.csv_scaler = joblib.load(path.join(model_dir, 'scaler.pkl'))
        self.encoder = tf.keras.models.load_model(
            path.join(model_dir, 'encoder_model.keras'))
        self.log_model = joblib.load(
            path.join(model_dir, 'logistic_model.pkl'))

    def predict(self):
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

            X_scaled = self.csv_scaler.transform(X)
            X_encoded = self.encoder.predict(X_scaled)
            predictions = self.log_model.predict(X_encoded)

            return jsonify({'predictions': predictions.tolist()})

        except Exception as e:
            return jsonify({'error': str(e)}), 500

    def evaluate(self, test_data, test_labels):
        # Evaluate the model on test data
        evaluation = self.model.evaluate(test_data, test_labels)
        return evaluation
