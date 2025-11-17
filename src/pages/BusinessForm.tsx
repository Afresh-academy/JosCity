import { useState } from "react";
import { useNavigate } from "react-router-dom";
import skyImage from "../image/sky.png";
import primaryLogo from "../image/primary-logo.png";
import { Mail, MapPin, Lock, Eye, EyeOff, ChevronDown } from "lucide-react";
import "../main.css";

function BusinessForm() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    businessName: "",
    businessType: "",
    businessEmail: "",
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Business form submitted:", formData);
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
          <div className="register-form-panel">
            <div className="register-card-face register-card-front">
              <div className="register-logo-container">
                <img
                  src={primaryLogo}
                  alt="JOSCITY Logo"
                  className="register-logo"
                />
              </div>

              <h2
                style={{
                  textAlign: "center",
                  color: "white",
                  marginBottom: "2rem",
                  fontSize: "1.5rem",
                }}
              >
                Business Registration
              </h2>

              <form className="register-form" onSubmit={handleSubmit}>
                <div className="register-form-row">
                  <div className="register-form-group">
                    <label htmlFor="businessName">Business Name</label>
                    <input
                      type="text"
                      id="businessName"
                      name="businessName"
                      value={formData.businessName}
                      onChange={handleInputChange}
                      placeholder="Business Name"
                    />
                  </div>
                  <div className="register-form-group">
                    <label htmlFor="businessType">Business Type</label>
                    <div className="register-select-wrapper">
                      <select
                        id="businessType"
                        name="businessType"
                        value={formData.businessType}
                        onChange={handleInputChange}
                      >
                        <option value="">Select Type</option>
                        <option value="retail">Retail</option>
                        <option value="service">Service</option>
                        <option value="manufacturing">Manufacturing</option>
                        <option value="other">Other</option>
                      </select>
                      <ChevronDown className="register-select-icon" size={20} />
                    </div>
                  </div>
                </div>

                <div className="register-form-group">
                  <label htmlFor="businessEmail">Business Email</label>
                  <div className="register-input-wrapper">
                    <Mail className="register-input-icon" size={20} />
                    <input
                      type="email"
                      id="businessEmail"
                      name="businessEmail"
                      value={formData.businessEmail}
                      onChange={handleInputChange}
                      placeholder="Business Email"
                    />
                  </div>
                </div>

                <div className="register-form-group">
                  <label htmlFor="businessPhone">Business Phone</label>
                  <input
                    type="tel"
                    id="businessPhone"
                    name="businessPhone"
                    value={formData.businessPhone}
                    onChange={handleInputChange}
                    placeholder="Business Phone"
                  />
                </div>

                <div className="register-form-group">
                  <label htmlFor="businessAddress">Business Address</label>
                  <div className="register-input-wrapper">
                    <MapPin className="register-input-icon" size={20} />
                    <input
                      type="text"
                      id="businessAddress"
                      name="businessAddress"
                      value={formData.businessAddress}
                      onChange={handleInputChange}
                      placeholder="Business Address"
                    />
                  </div>
                </div>

                <div className="register-form-group">
                  <label htmlFor="businessPassword">Password</label>
                  <div className="register-input-wrapper">
                    <Lock className="register-input-icon" size={20} />
                    <input
                      type={showPassword ? "text" : "password"}
                      id="businessPassword"
                      name="businessPassword"
                      value={formData.businessPassword}
                      onChange={handleInputChange}
                      placeholder="Password"
                    />
                    <button
                      type="button"
                      className="register-password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="register-input-icon" size={20} />
                      ) : (
                        <Eye className="register-input-icon" size={20} />
                      )}
                    </button>
                  </div>
                </div>

                <button type="submit" className="register-submit-button">
                  SUBMIT
                </button>
              </form>
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
            <a href="#directory">Directory</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default BusinessForm;
