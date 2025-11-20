import { useState } from "react";
import { useNavigate } from "react-router-dom";
import skyImage from "../image/sky.png";
import primaryLogo from "../image/primary-logo.png";
import RegistrationTabs from "../components/RegistrationTabs";
import PersonalFormFields from "../components/PersonalFormFields";
import BusinessFormFields from "../components/BusinessFormFields";
import SignInLink from "../components/SignInLink";
import "../main.css";

function BusinessForm() {
  const navigate = useNavigate();
  const [registrationType, setRegistrationType] = useState<
    "personal" | "business"
  >("business");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    phoneNumber: "",
    email: "",
    ninNumber: "",
    address: "",
    password: "",
  });
  const [businessFormData, setBusinessFormData] = useState({
    businessName: "",
    businessType: "",
    businessEmail: "",
    cacNumber: "",
    businessPhone: "",
    businessAddress: "",
    businessPassword: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBusinessInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setBusinessFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (registrationType === "personal") {
      console.log("Personal form submitted:", formData);
    } else {
      console.log("Business form submitted:", businessFormData);
    }
    // Navigate to success page after submission
    navigate("/success");
  };

  return (
    <div className="register-page">
      <div className="register-background">
        <img src={skyImage} alt="Sky background" className="sky-image" />
      </div>

      <div className="register-container">
        <div className="register-flip-container">
          <div
            className={`register-form-panel ${
              registrationType === "personal" ? "flipped" : ""
            }`}
          >
            <div className="register-card-face register-card-front">
              <div className="register-logo-container">
                <img
                  src={primaryLogo}
                  alt="JOSCITY Logo"
                  className="register-logo"
                />
              </div>

              <RegistrationTabs
                registrationType={registrationType}
                onTypeChange={setRegistrationType}
              />

              <form className="register-form" onSubmit={handleSubmit}>
                <BusinessFormFields
                  formData={businessFormData}
                  showPassword={showPassword}
                  onInputChange={handleBusinessInputChange}
                  onTogglePassword={() => setShowPassword(!showPassword)}
                />

                <button type="submit" className="register-submit-button">
                  SUBMIT
                </button>
              </form>

              <SignInLink />
            </div>

            <div className="register-card-face register-card-back">
              <div className="register-logo-container">
                <img
                  src={primaryLogo}
                  alt="JOSCITY Logo"
                  className="register-logo"
                />
              </div>

              <RegistrationTabs
                registrationType={registrationType}
                onTypeChange={setRegistrationType}
              />

              <form className="register-form" onSubmit={handleSubmit}>
                <PersonalFormFields
                  formData={formData}
                  showPassword={showPassword}
                  onInputChange={handleInputChange}
                  onTogglePassword={() => setShowPassword(!showPassword)}
                />

                <button type="submit" className="register-submit-button">
                  SUBMIT
                </button>
              </form>

              <SignInLink />
            </div>
          </div>
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
          </div>
        </div>
      </footer>
    </div>
  );
}

export default BusinessForm;
