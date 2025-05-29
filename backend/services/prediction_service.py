from flask import jsonify, request
import joblib
import tensorflow as tf
import pandas as pd
import numpy as np
from os import path, SEEK_END, SEEK_SET
import traceback
from bson.timestamp import Timestamp
from bson.objectid import ObjectId
from bson.errors import InvalidId
from datetime import datetime
from factory import get_database_instance
from google.cloud.storage import Client as StorageClient
from config import STORAGE_BUCKET_NAME



class PredictionService:
    def __init__(self, model_dir: str):
        # For CSV-based model — assuming these remain same as before
        self.db_instance = get_database_instance()
        self.collection_name = "predictions"
        
        self.storage_client = StorageClient()
        self.bucket = self.storage_client.bucket(STORAGE_BUCKET_NAME)

        self.csv_scaler = joblib.load(path.join(model_dir, 'scaler.pkl'))
        self.encoder = tf.keras.models.load_model(
            path.join(model_dir, 'encoder_model.keras'))
        self.log_model = joblib.load(
            path.join(model_dir, 'logistic_model.pkl'))

    def predict(self):
        try:
            # --- timestamp when request was received ---
            request_time = datetime.now()

            print("Received request for prediction", request.files)
            if 'file' not in request.files:
                return jsonify({'error': 'No file part'}), 400

            file = request.files['file']
            if file.filename == '':
                return jsonify({'error': 'No selected file'}), 400

            # --- file metadata (size, name, type) ---
            file.stream.seek(0, SEEK_END)
            file_size = file.stream.tell()
            file.stream.seek(0)
            file_info = {
                'filename': file.filename,
                'content_type': file.content_type,
                'size_bytes': file_size
            }

            # --- load raw CSV and compute row/column stats ---
            raw_df = pd.read_csv(file)
            original_shape = raw_df.shape  # (rows, cols)
            missing_count = int(raw_df.isna().sum().sum())

            # --- select only numeric columns and record stats ---
            df = raw_df.select_dtypes(include=[np.number])
            numeric_shape = df.shape
            if df.empty:
                return jsonify({'error': 'No numeric data found in the CSV file.'}), 400

            # --- prepare data for prediction ---
            X = df.fillna(0).values
            X_scaled = self.csv_scaler.transform(X)
            X_encoded = self.encoder.predict(X_scaled)
            predictions = self.log_model.predict(X_encoded)
            probabilities = self.log_model.predict_proba(X_encoded)
            class_labels = self.log_model.classes_.tolist()

            results = []
            for pred, prob_row in zip(predictions, probabilities):
                prob_dict = dict(zip(class_labels, prob_row))
                results.append({
                    'prediction': pred,
                    'probabilities': prob_dict
                })

            # --- request metadata ---
            request_info = {
                'remote_addr': request.remote_addr,
                'method': request.method,
                'endpoint': request.path,
                'user_agent': request.headers.get('User-Agent')
            }

            # --- timestamp when processing finished & compute duration ---
            finish_time = datetime.now()
            duration_seconds = (finish_time - request_time).total_seconds()

            # --- assemble full log document ---
            prediction_log = {
                'results': results,
                'class_labels': class_labels,
                'request_time': Timestamp(request_time, 1).as_datetime(),
                'finish_time': Timestamp(finish_time, 1).as_datetime(),
                'duration_seconds': duration_seconds,
                'file_info': file_info,
                'request_info': request_info,
                'dataset_info': {
                    'original_rows': original_shape[0],
                    'original_columns': original_shape[1],
                    'numeric_rows': numeric_shape[0],
                    'numeric_columns': numeric_shape[1],
                    'missing_values': missing_count
                },
                'creation_date': Timestamp(datetime.now(), 1).as_datetime(),
            }

            # --- persist to database ---
            inserted_document = self.db_instance.create_one(self.collection_name, prediction_log)
            if isinstance(inserted_document, str):
                return jsonify({'error': inserted_document}), 500

            return jsonify({
                'history_id': str(inserted_document["_id"]),
                'error': False,
                'message': 'Prediction successful',
            }), 200

        except Exception as e:
            return jsonify({
                'error': True,
                'message': str(e),
                'traceback': traceback.format_exc(),
                'status': 500    
            }), 500

    def evaluate(self, test_data, test_labels):
        # Evaluate the model on test data
        evaluation = self.model.evaluate(test_data, test_labels)
        return evaluation
    
    def get_prediction_by_id(self, prediction_id: str):
        # 1) Validate ObjectId format
        try:
            oid = ObjectId(prediction_id)
        except InvalidId:
            # let the caller know it was malformed
            return None, "invalid_format"

        # 2) Query
        doc = self.db_instance \
                  .get_collection(self.collection_name) \
                  .find_one({ "_id": oid })

        if doc is None:
            return None, "not_found"

        # 3) Convert to JSON
        doc["_id"] = str(doc["_id"])
        return doc, None

    def get_all_predictions(self):
        # 1) Query
        docs = self.db_instance \
                  .get_collection(self.collection_name) \
                  .find({})

        # 2) Convert to JSON
        fetched_docs = []
        for doc in docs:
            doc["_id"] = str(doc["_id"])

            # yield doc
            fetched_docs.append(doc)
        # 3) Return as a list 
        return list(fetched_docs)