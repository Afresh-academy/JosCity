import { useState } from "react";
import { useNavigate } from "react-router-dom";
import skyImage from "../image/sky.png";
import primaryLogo from "../image/primary-logo.png";
import "../main.css";

function WelcomePage() {
  const navigate = useNavigate();
  const [registrationType, setRegistrationType] = useState<
    "personal" | "business"
  >("personal");

  const handlePersonalClick = () => {
    setRegistrationType("personal");
    navigate("/registernow");
  };

  const handleBusinessClick = () => {
    setRegistrationType("business");
    navigate("/business-form");
  };

  return (
    <div className="welcome-page">
      <div className="welcome-background">
        <img src={skyImage} alt="Sky background" className="sky-image" />
      </div>

      <div className="registration-panel">
        <div className="logo-container">
          <img src={primaryLogo} alt="JOSCITY Logo" className="logo-image" />
          <h2 className="register-heading">Register now</h2>
        </div>

        <div className="registration-buttons">
          <button
            className={`reg-button personal-button ${
              registrationType === "personal" ? "active" : ""
            }`}
            onClick={handlePersonalClick}
          >
            Personal
          </button>
          <button
            className={`reg-button business-button ${
              registrationType === "business" ? "active" : ""
            }`}
            onClick={handleBusinessClick}
          >
            Business
          </button>
        </div>
      </div>

      <footer className="register-footer">
        <div className="register-footer-content">
          <p className="register-footer-copyright">© 2025 JOS Smart City</p>
          <div className="register-footer-links">
            <a href="#about">About</a>
            <a href="#legal">Legal</a>
            <a href="#privacy">Privacy</a>
            <a href="#contact">Contact Us</a>
            <a href="#directory">Directory</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default WelcomePage;
