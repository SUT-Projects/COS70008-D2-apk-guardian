from flask import Flask, request
from flask_cors import CORS
from datetime import datetime
from flask_jwt_extended import JWTManager
from controllers import prediction_route_bp, auth_router_bp, user_router_bp

app: Flask = Flask(__name__)
app.config['JWT_SECRET_KEY'] = 'your_jwt_secret_key'  # Change this to a random secret key
app.config['JWT_TOKEN_LOCATION'] = ['headers', 'cookies']

CORS(app, supports_credentials=True)
JWTManager(app)

app.register_blueprint(prediction_route_bp)
app.register_blueprint(auth_router_bp)
app.register_blueprint(user_router_bp)

@app.route("/", methods=['GET'])
def home_page():
    return {"message": "Hello world", "date": datetime.now()}


if __name__ == "__main__":
    app.run(debug=True, port=5000)