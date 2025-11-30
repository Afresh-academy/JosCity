import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../main.css";
// Import logo as module for Vite build compatibility
import logoImage from "../image/primary-logo.png";

function App() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleGetStarted = () => {
    navigate("/welcome");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const scrollToAbout = () => {
    setIsMenuOpen(false);
    if (window.location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        const aboutSection = document.getElementById("about");
        if (aboutSection) {
          aboutSection.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    } else {
      const aboutSection = document.getElementById("about");
      if (aboutSection) {
        aboutSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  const scrollToContact = () => {
    setIsMenuOpen(false);
    if (window.location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        const contactSection = document.getElementById("contact");
        if (contactSection) {
          contactSection.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    } else {
      const contactSection = document.getElementById("contact");
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  const scrollToServices = () => {
    setIsMenuOpen(false);
    if (window.location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        const servicesSection = document.getElementById("services");
        if (servicesSection) {
          servicesSection.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }, 100);
    } else {
      const servicesSection = document.getElementById("services");
      if (servicesSection) {
        servicesSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  const scrollToHome = () => {
    setIsMenuOpen(false);
    // Navigate to home if not already there
    if (window.location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        const homeSection = document.getElementById("home");
        if (homeSection) {
          homeSection.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    } else {
      const homeSection = document.getElementById("home");
      if (homeSection) {
        homeSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  const scrollToGuidlines = () => {
    setIsMenuOpen(false);
    if (window.location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        const guidelinesSection = document.getElementById("guidelines");
        if (guidelinesSection) {
          guidelinesSection.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }, 100);
    } else {
      const guidelinesSection = document.getElementById("guidelines");
      if (guidelinesSection) {
        guidelinesSection.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar__logo">
          <img
            src={logoImage}
            alt="Logo"
            className="navbar__logo-image"
            loading="eager"
          />
        </div>
        <button
          className={`navbar__menu-toggle ${isMenuOpen ? "active" : ""}`}
          onClick={toggleMenu}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
          type="button"
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </button>
        <ul
          className={`navbar__nav-list ${isMenuOpen ? "active" : ""}`}
          aria-hidden={!isMenuOpen}
        >
          <li className="navbar__nav-item" onClick={scrollToHome}>
            Home
          </li>
          <li className="navbar__nav-item" onClick={scrollToAbout}>
            About
          </li>
          <li className="navbar__nav-item" onClick={scrollToGuidlines}>
            Guidelines
          </li>
          <li className="navbar__nav-item" onClick={scrollToServices}>
            Services
          </li>
          <li className="navbar__nav-item" onClick={scrollToContact}>
            Contact Us
          </li>
        </ul>
        {/* Get Started button - will be hidden by CSS when menu is active */}
        <button
          type="button"
          onClick={handleGetStarted}
          className="navbar__get-started-button"
        >
          Get Started
        </button>
      </nav>
    </>
  );
}

export default App;
