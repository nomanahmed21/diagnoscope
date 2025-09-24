import React from 'react'
import './Home.css'
import { useNavigate } from 'react-router-dom'
import diabetesIcon from '../images/diabetes.png'


const Home = () => {
  const navigate = useNavigate()
  return (
    <div>
      
    <header>
      <h1><span className="topic-heading">DiagnoScope</span><span>Reveal the Real Picture</span></h1>
        <div className='slogan-header'>Precise Prediction, Report Generation, Heath Suggession. Get Diagnose By AI</div>   
    </header>

    <div className="get-start-div"><button className='get-start-btn' onClick={() => navigate('/login')}>Get Started ⟶</button></div>
    <div className="section">
      <h2 className="heading">Detect Multiple Diseases</h2>
      <p className="subheading">AI-powered diagnosis for faster, smarter health insights.</p>

      <div className="card-container">
        
        <div className="card">
          <div className="icon">
            <img src={diabetesIcon} alt="Diabetes" />
          </div>
          <div className="card-text"> 
          <h3 className="card-title">Diabetes</h3>
          <p className="card-desc">Monitor blood sugar levels and diagnose early signs of diabetes.</p>
          </div>
        </div>

        <div className="card">
          <div className="icon">
            <img src="/images/heart-icon.svg" alt="Heart Disease" />
          </div>
          <div className="card-text">
          <h3 className="card-title">Heart Disease</h3>
          <p className="card-desc">Track cholesterol, blood pressure, and cardiovascular risks.</p> </div>
        </div>
        <div className="card">
          <div className="icon">
            <img src={diabetesIcon} alt="Diabetes" />
          </div>
          <div className="card-text"> 
          <h3 className="card-title">Diabetes</h3>
          <p className="card-desc">Monitor blood sugar levels and diagnose early signs of diabetes.</p>
          </div>
        </div>

        <div className="card">
          <div className="icon">
            <img src="/images/heart-icon.svg" alt="Heart Disease" />
          </div>
          <div className="card-text">
          <h3 className="card-title">Heart Disease</h3>
          <p className="card-desc">Track cholesterol, blood pressure, and cardiovascular risks.</p> </div>
        </div>
        <div className="card">
          <div className="icon">
            <img src={diabetesIcon} alt="Diabetes" />
          </div>
          <div className="card-text"> 
          <h3 className="card-title">Diabetes</h3>
          <p className="card-desc">Monitor blood sugar levels and diagnose early signs of diabetes.</p>
          </div>
        </div>

        <div className="card">
          <div className="icon">
            <img src="/images/heart-icon.svg" alt="Heart Disease" />
          </div>
          <div className="card-text">
          <h3 className="card-title">Heart Disease</h3>
          <p className="card-desc">Track cholesterol, blood pressure, and cardiovascular risks.</p> </div>
        </div>
        <div className="card">
          <div className="icon">
            <img src={diabetesIcon} alt="Diabetes" />
          </div>
          <div className="card-text"> 
          <h3 className="card-title">Diabetes</h3>
          <p className="card-desc">Monitor blood sugar levels and diagnose early signs of diabetes.</p>
          </div>
        </div>

        <div className="card">
          <div className="icon">
            <img src="/images/heart-icon.svg" alt="Heart Disease" />
          </div>
          <div className="card-text">
          <h3 className="card-title">Heart Disease</h3>
          <p className="card-desc">Track cholesterol, blood pressure, and cardiovascular risks.</p> </div>
        </div>

        {/* Add more cards here */}
      </div>
    </div>
    </div>
  )
}

export default Home;
