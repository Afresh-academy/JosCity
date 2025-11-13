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

  return (
    <>
      <nav className="navbar">
        <div className="navbar__logo">
          <img src={logoImage} alt="Logo" className="navbar__logo-image" />
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
          <li className="navbar__nav-item" onClick={() => setIsMenuOpen(false)}>
            Home
          </li>
          <li className="navbar__nav-item" onClick={() => setIsMenuOpen(false)}>
            About
          </li>
          <li className="navbar__nav-item" onClick={() => setIsMenuOpen(false)}>
            Testimonials
          </li>
          <li className="navbar__nav-item" onClick={() => setIsMenuOpen(false)}>
            Services
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
