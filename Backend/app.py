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
from utils.api import create_embeddings, inference
from utils.search import SearchEngine

load_dotenv()

mongo_uri = os.getenv("MONGO_URI")

client = MongoClient(mongo_uri) 
db = client.get_default_database()

reports = db["reports"]

diabetes_model = keras.models.load_model("./Model/diabetes_model.keras")
diabetes_pipeline = joblib.load("./Model/diabetes_pipeline.pkl")

df = joblib.load("data_embeddings.joblib")
search_engine = SearchEngine(df)

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
    
@app.route("/api/ask", methods=["POST"])
def ask():
    try:
        data = request.get_json()
        user_input = data.get("question")

        if not user_input:
            return jsonify({"error": "No question provided"}), 400

        # Compute embedding for question
        question_embedding = create_embeddings(user_input)[0]

        # Find best matching disease chunks
        new_df = search_engine.find_top_matches(question_embedding)

        # Build prompt
        prompt = f'''You are a Doctor assistant that guides the user of DiagnoScope Organization.
Data provided is from WHO factsheets. Here are relevant disease chunks:

{new_df[["disease", "heading", "text"]].to_json(orient="records")}
------------------------------
User asked: "{user_input}"

Answer in a helpful, human way using only the provided data.
If question is unrelated to known diseases, politely say so.'''

        # Get AI response
        response = inference(prompt)

        return jsonify({"answer": response})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=3000)
