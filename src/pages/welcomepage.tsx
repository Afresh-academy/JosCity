import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import skyImage from "../image/sky.png";
import primaryLogo from "../image/primary-logo.png";
import "../main.css";
import LazyImage from "../components/LazyImage";
import ScrollAnimate from "../components/ScrollAnimate";

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
        <LazyImage
          src={skyImage}
          alt=""
          className="sky-image"
        />
      </div>

      <section
        className="registration-panel"
        aria-labelledby="registration-heading"
      >
        <ScrollAnimate animationType="fade-up" delay={0.1}>
          <div className="logo-container">
            <LazyImage
              src={primaryLogo}
              alt="JOSCITY Logo"
              className="logo-image"
              width={80}
              height={80}
            />
            <h1 id="registration-heading" className="register-heading">
              Register now
            </h1>
          </div>
        </ScrollAnimate>

        <ScrollAnimate animationType="fade-up" delay={0.2}>
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
        </ScrollAnimate>
      </section>
    </div>
  );
}

export default WelcomePage;
