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

  const handleFooterLinkClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, section: string) => {
      e.preventDefault();
      // Navigate to landing page with hash if needed, or handle footer links appropriately
      navigate("/", { replace: false });
      // Scroll to section if it exists on the landing page
      setTimeout(() => {
        const element = document.getElementById(section);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    },
    [navigate]
  );

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

      <footer className="register-footer" role="contentinfo">
        <div className="register-footer-content">
          <p className="register-footer-copyright">
            &copy; {new Date().getFullYear()} JOS Smart City. All rights
            reserved.
          </p>
          <nav className="register-footer-links" aria-label="Footer navigation">
            <a
              href="#about"
              onClick={(e) => handleFooterLinkClick(e, "about")}
              aria-label="Learn more about us"
            >
              About
            </a>
            <a
              href="#legal"
              onClick={(e) => handleFooterLinkClick(e, "legal")}
              aria-label="View legal information"
            >
              Legal
            </a>
            <a
              href="#privacy"
              onClick={(e) => handleFooterLinkClick(e, "privacy")}
              aria-label="View privacy policy"
            >
              Privacy
            </a>
            <a
              href="#contact"
              onClick={(e) => handleFooterLinkClick(e, "contact")}
              aria-label="Contact us"
            >
              Contact Us
            </a>
          </nav>
        </div>
      </footer>
    </div>
  );
}

export default WelcomePage;
