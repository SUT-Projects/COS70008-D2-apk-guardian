from flask import Flask, request
from flask_cors import CORS
from datetime import datetime
from controllers.prediction import prediction_route_bp

app: Flask = Flask(__name__)
CORS(app)

app.register_blueprint(prediction_route_bp, url_prefix="/prediction")

@app.route("/", methods=['GET'])
def home_page():
    return {"message": "Hello world", "date": datetime.now()}


if __name__ == "__main__":
    app.run(debug=True, port=5000)