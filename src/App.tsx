import { useState } from "react";
import "./main.css";

function App() {
  const [selectedService, setSelectedService] = useState("");

  const handleServiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedService(e.target.value);
  };

  const handleGetStarted = () => {
    window.location.href = "https://joscity.com";
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar__logo">
          <img
            src="/src/image/primary-logo.png"
            alt="Logo"
            className="navbar__logo-image"
          />
        </div>
        <ul className="navbar__nav-list">
          <li className="navbar__nav-item">Home</li>
          <li className="navbar__nav-item">About</li>
          <li className="navbar__nav-item">Testimonials</li>
        </ul>
        <select
          name="services"
          id="services"
          className="navbar__nav-select"
          value={selectedService}
          onChange={handleServiceChange}
        >
          <option value="" disabled>
            Select Services
          </option>
          <option value="service1">Service 1</option>
          <option value="service2">Service 2</option>
          <option value="service3">Service 3</option>
          <option value="service4">Service 4</option>
        </select>
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
