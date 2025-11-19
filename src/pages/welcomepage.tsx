import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import skyImage from "../image/sky.png";
import primaryLogo from "../image/primary-logo.png";
import "../main.css";

function WelcomePage() {
  const navigate = useNavigate();

  const handlePersonalClick = useCallback(() => {
    try {
      navigate("/registernow", { replace: false });
    } catch (error) {
      console.error("Navigation error:", error);
    }
  }, [navigate]);

  const handleBusinessClick = useCallback(() => {
    try {
      navigate("/business-form", { replace: false });
    } catch (error) {
      console.error("Navigation error:", error);
    }
  }, [navigate]);

  return (
    <div className="welcome-page" role="main">
      <div className="welcome-background" aria-hidden="true">
        <img
          src={skyImage}
          alt=""
          className="sky-image"
          loading="lazy"
          decoding="async"
        />
      </div>

      <section
        className="registration-panel"
        aria-labelledby="registration-heading"
      >
        <div className="logo-container">
          <img
            src={primaryLogo}
            alt="JOSCITY Logo"
            className="logo-image"
            loading="eager"
            width="80"
            height="80"
          />
          <h1 id="registration-heading" className="register-heading">
            Register now
          </h1>
        </div>

        <nav
          className="registration-buttons"
          aria-label="Registration type selection"
        >
          <button
            type="button"
            className="reg-button personal-button"
            onClick={handlePersonalClick}
            aria-label="Register as a personal user"
            aria-pressed="false"
          >
            Personal
          </button>
          <button
            type="button"
            className="reg-button business-button"
            onClick={handleBusinessClick}
            aria-label="Register as a business"
            aria-pressed="false"
          >
            Business
          </button>
        </nav>
      </section>
    </div>
  );
}

export default WelcomePage;
