from flask import Flask, request
from flask_cors import CORS
from datetime import datetime

app = Flask(__name__)
CORS(app)

@app.route("/", methods=['GET'])
def home_page():
    return {"message": "Hello world", "date": datetime.now()}


if __name__ == "__main__":
    app.run(debug=True, port=5000)