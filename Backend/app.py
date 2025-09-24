from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
import bcrypt
import joblib
from tensorflow import keras
import pandas as pd
import uuid
from datetime import datetime
from dotenv import load_dotenv
import os

load_dotenv()

mongo_uri = os.getenv("MONGO_URI")

client = MongoClient(mongo_uri) 
db = client.get_default_database()

reports = db["reports"]

diabetes_model = keras.models.load_model("./Model/diabetes_model.keras")
diabetes_pipeline = joblib.load("./Model/diabetes_pipeline.pkl")

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})


@app.route("/Predict", methods = ['POST'])
def Predict():
    try:
        data = request.json
        testname= data.pop("testname", None)
        userId = data.pop("userId", None)
        print(userId)
        # Convert booleans to "Yes"/"No"
        for key, value in data.items():
            if isinstance(value, bool):
                data[key] = "Yes" if value else "No"
                
        data2 = pd.DataFrame([data])
        print("Data recieved in Api:", data2)
        transform_diabetes_data = diabetes_pipeline.transform(data2)
        prediction= diabetes_model.predict(transform_diabetes_data)
        prediction = float(prediction[0][0]) # Prediction is nparray [[prediction]]
        result = "Positive" if prediction>= 0.5 else "Negative"
        print(prediction*100)
        chance = round(prediction*100,2)
        reportId = str(uuid.uuid4())
        data.pop("Age", None)
        data.pop("Gender", None)

        report = {
            "userId": userId,
            "testname": testname,
            "symptoms": data, 
            "reportId": reportId,
            "prediction": prediction,
            "chance": chance,
            "result": result,
            "timestamp": datetime.now().isoformat()
        }

        reports.insert_one(report)
        report.pop("_id", None)
        print(report)
        print("Data recieved in Api:", data2)
        return jsonify(report)

    except Exception as e:
        return jsonify({"error": str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True, port=3000)
