from flask import Flask, request
from flask_cors import CORS
from datetime import datetime
from controllers import prediction_route_bp, auth_router_bp, user_router_bp

app: Flask = Flask(__name__)
CORS(app)

app.register_blueprint(prediction_route_bp)
app.register_blueprint(auth_router_bp)
app.register_blueprint(user_router_bp)

@app.route("/", methods=['GET'])
def home_page():
    return {"message": "Hello world", "date": datetime.now()}


if __name__ == "__main__":
    app.run(debug=True, port=5000)