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

  const handleSignInClick = () => {
    navigate("/signin");
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

        <div className="signin-link-container">
          <p className="signin-link-text">
            Already have an account?{" "}
            <button className="signin-link-button" onClick={handleSignInClick}>
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default WelcomePage;
