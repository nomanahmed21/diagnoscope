import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux"
import {v4 as uuidv4} from 'uuid'
import './DiabetesForm.css';

const DiabetesForm = () => {
  const userData = useSelector((state) => state.user.user);
  const [report, setReport] = useState(null)

  useEffect(() => {
    console.log("User Data:", userData);
  }, [userData]);

  const symptomsList = [
    { name: "Polyuria", desc: "Frequent urination, especially at night." },
    { name: "Polydipsia", desc: "Excessive thirst and drinking a lot of water." },
    { name: "Sudden weight loss", desc: "Unexplained drop in body weight without trying." },
    { name: "Weakness", desc: "Feeling tired or lacking physical strength." },
    { name: "Polyphagia", desc: "Unusually increased hunger or appetite." },
    { name: "Genital thrush", desc: "Fungal infection around the genital area." },
    { name: "Visual blurring", desc: "Blurry or unclear vision." },
    { name: "Itching", desc: "Persistent itchiness on the skin." },
    { name: "Irritability", desc: "Easily getting annoyed or frustrated." },
    { name: "Delayed healing", desc: "Wounds or cuts taking longer than usual to heal." },
    { name: "Partial paresis", desc: "Weakness in certain muscles or partial paralysis." },
    { name: "Muscle stiffness", desc: "Tight or rigid muscles causing difficulty in movement." },
    { name: "Alopecia", desc: "Hair loss in patches or overall thinning." },
    { name: "Obesity", desc: "Excess body fat or being overweight." },
  ];

  const [formData, setFormData] = useState({
    age: userData?.age || "",
    gender: userData?.gender || "",
    ...symptomsList.reduce((acc, symptom) => {
      acc[symptom.name] = false;
      return acc;
    }, {}),
  });

  const handleChange = (symptomName) => {
    setFormData((prev) => ({
      ...prev,
      [symptomName]: !prev[symptomName],
    }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  const orderedData = {
    Age: formData.age,
    Gender: formData.gender,
    userId: userData.userId,
    testname: "Diabetes"
  };

  symptomsList.forEach(symptom => {
    orderedData[symptom.name] = formData[symptom.name];
  });

  console.log("Ordered Form Data:", orderedData);

  //sending the data for prediction to the flask api
  try {
    const response = await fetch("http://localhost:3000/Predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderedData) // send as JSON
    });

    const data = await response.json();
    console.log("Prediction from Flask:", data);

    if (data) {
      alert(`result: ${data.result}\nchance: ${data.chance}%`)
      console.log(data);
    } else {
      alert("Error: " + data.error);
    }
  } catch (error) {
    console.error("Error calling Flask API:", error);
  }

};


return (
  <div className="DiabetesForm">
    <h1>Diabetes Symptoms Form</h1>
    <form onSubmit={handleSubmit}>
      {symptomsList.map((symptom, idx) => (
        <div key={idx}>
          <label>
            <input
              type="checkbox"
              checked={formData[symptom.name]}
              onChange={() => handleChange(symptom.name)}
            />
            {symptom.name}
          </label>
          <p>{symptom.desc}</p>
        </div>
      ))}
      <button type="submit">Submit</button>
    </form>
  </div>
);
};


export default DiabetesForm;
