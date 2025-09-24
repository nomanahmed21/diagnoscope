import React, { useState } from "react";
import { ReactTyped } from "react-typed";
import "./Diagnose.css";
import DiabetesForm from "./DiabetesForm";


const Diagnose = () => {
  const [selectedModel, setSelectedModel] = useState(null)

  const diseases = [
    { name: "Diabetes Prediction", desc: "Predict diabetes risk based on symptoms." },
    { name: "Heart Disease Prediction", desc: "Assess heart health with patient data." },
    { name: "Kidney Disease Prediction", desc: "Detect potential kidney issues early." },
    { name: "Liver Disease Prediction", desc: "Analyze liver health indicators." },
  ];

  const renderForm = () => {
    switch (selectedModel) {
      case 0:
        console.log("diabetes")
        return <DiabetesForm />
      case 1:
        console.log("heart")
        return
      case 2:
        console.log("kidney")
        return
      case 3:
        console.log("liver")
        return
      // default:
      //   console.log("default")
    }
  }
  return (
    <div className="diagnose-container">
      {/* Branding header */}
      <header className="diagnose-header">
        <h1 className="diagnoscope-title">Diagnoscope</h1>
        {selectedModel === null? (
          <h2><ReactTyped
          strings={[
            "Welcome User!",
            "What do you want to predict today?",
            "Select a model to start diagnosis...",
          ]}
          typeSpeed={50}
          backSpeed={30}
          loop
          className="typed-text"
          style={{fontSize: "1.6rem", fontWeight: "bold"}}
        />
        </h2>) : (
          <ReactTyped
          strings={[`You are using ${diseases[selectedModel].name} `]}
          typeSpeed={50}
          backSpeed={30}
          showCursor={false}
          className="typed.text"
          style={{fontSize: "2rem", fontWeight: "bold"}}
          />
        )}
      </header>

      {/* Model cards */}
      {selectedModel === null ? (
        <div className="model-grid">
          {diseases.map((d, i) => (
            <div key={i} className="model-card">
              <h2>{d.name}</h2>
              <p>{d.desc}</p>
              <button onClick={() => setSelectedModel(i)} className="predict-btn">Use Model</button>
            </div>
          ))}
        </div>
      ) : (
        <main className="form_section">
          
          <button onClick={()=> setSelectedModel(null)} className="back-btn">⟵</button>
          {renderForm()}
        </main>
      )}
    </div>
  );
};

export default Diagnose;
