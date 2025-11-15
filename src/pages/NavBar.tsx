import { useState } from "react";
import "../main.css";
// Import logo as module for Vite build compatibility
import logoImage from "../image/primary-logo.png";

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleGetStarted = () => {
    window.location.href = "https://joscity.com";
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const scrollToAbout = () => {
    setIsMenuOpen(false);
    const aboutSection = document.getElementById("about");
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const scrollToContact = () => {
    setIsMenuOpen(false);
    const contactSection = document.getElementById("contact");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const scrollToServices = () => {
    setIsMenuOpen(false);
    const servicesSection = document.getElementById("services");
    if (servicesSection) {
      servicesSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const scrollToHome = () => {
    setIsMenuOpen(false);
    const homeSection = document.getElementById("home");
    if (homeSection) {
      homeSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const scrollToTestimonials = () => {
    setIsMenuOpen(false);
    const testimonialsSection = document.getElementById("testimonials");
    if (testimonialsSection) {
      testimonialsSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
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
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
        <ul className={`navbar__nav-list ${isMenuOpen ? "active" : ""}`}>
          <li className="navbar__nav-item" onClick={scrollToHome}>
            Home
          </li>
          <li className="navbar__nav-item" onClick={scrollToAbout}>
            About
          </li>
          <li className="navbar__nav-item" onClick={scrollToTestimonials}>
            Testimonials
          </li>
          <li className="navbar__nav-item" onClick={scrollToServices}>
            Services
          </li>
          <li className="navbar__nav-item" onClick={scrollToContact}>
            Contact Us
          </li>
        </ul>
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
