import { useState } from "react";
import { useNavigate } from "react-router-dom";
import skyImage from "../image/sky.png";
import primaryLogo from "../image/primary-logo.png";
import {
  Mail,
  User,
  MapPin,
  Lock,
  Eye,
  EyeOff,
  ChevronDown,
} from "lucide-react";
import "../main.css";

function Register() {
  const navigate = useNavigate();
  const [registrationType, setRegistrationType] = useState<
    "personal" | "business"
  >("personal");
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
    console.log("Form submitted:", formData);
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
              registrationType === "business" ? "flipped" : ""
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

              <div className="register-tabs">
                <button
                  className={`register-tab register-tab-personal ${
                    registrationType === "personal" ? "active" : ""
                  }`}
                  onClick={() => setRegistrationType("personal")}
                >
                  Personal
                </button>
                <button
                  className={`register-tab register-tab-business ${
                    registrationType === "business" ? "active" : ""
                  }`}
                  onClick={() => setRegistrationType("business")}
                >
                  Business
                </button>
              </div>

              <form className="register-form" onSubmit={handleSubmit}>
                <div className="register-form-row">
                  <div className="register-form-group">
                    <label htmlFor="firstName">First Name</label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="First Name"
                    />
                  </div>
                  <div className="register-form-group">
                    <label htmlFor="lastName">Last Name</label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="Last Name"
                    />
                  </div>
                </div>

                <div className="register-form-row">
                  <div className="register-form-group">
                    <label htmlFor="gender">Gender</label>
                    <div className="register-select-wrapper">
                      <select
                        id="gender"
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                      >
                        <option value="">Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                      <ChevronDown className="register-select-icon" size={20} />
                    </div>
                  </div>
                  <div className="register-form-group">
                    <label htmlFor="phoneNumber">Phone Number</label>
                    <input
                      type="tel"
                      id="phoneNumber"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      placeholder="Phone Number"
                    />
                  </div>
                </div>

                <div className="register-form-group">
                  <label htmlFor="email">Email</label>
                  <div className="register-input-wrapper">
                    <Mail className="register-input-icon" size={20} />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Email"
                    />
                  </div>
                </div>

                <div className="register-form-group">
                  <label htmlFor="ninNumber">NIN Number</label>
                  <div className="register-input-wrapper">
                    <User className="register-input-icon" size={20} />
                    <input
                      type="text"
                      id="ninNumber"
                      name="ninNumber"
                      value={formData.ninNumber}
                      onChange={handleInputChange}
                      placeholder="NIN Number"
                    />
                  </div>
                </div>

                <div className="register-form-group">
                  <label htmlFor="address">Address</label>
                  <div className="register-input-wrapper">
                    <MapPin className="register-input-icon" size={20} />
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Address"
                    />
                  </div>
                </div>

                <div className="register-form-group">
                  <label htmlFor="password">Password</label>
                  <div className="register-input-wrapper">
                    <Lock className="register-input-icon" size={20} />
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={formData.password}
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

            <div className="register-card-face register-card-back">
              <div className="register-logo-container">
                <img
                  src={primaryLogo}
                  alt="JOSCITY Logo"
                  className="register-logo"
                />
              </div>

              <div className="register-tabs">
                <button
                  className={`register-tab register-tab-personal ${
                    registrationType === "personal" ? "active" : ""
                  }`}
                  onClick={() => setRegistrationType("personal")}
                >
                  Personal
                </button>
                <button
                  className={`register-tab register-tab-business ${
                    registrationType === "business" ? "active" : ""
                  }`}
                  onClick={() => setRegistrationType("business")}
                >
                  Business
                </button>
              </div>

              <form className="register-form" onSubmit={handleSubmit}>
                <div className="register-form-row">
                  <div className="register-form-group">
                    <label htmlFor="businessName">Business Name</label>
                    <input
                      type="text"
                      id="businessName"
                      name="businessName"
                      placeholder="Business Name"
                    />
                  </div>
                  <div className="register-form-group">
                    <label htmlFor="businessType">Business Type</label>
                    <div className="register-select-wrapper">
                      <select id="businessType" name="businessType">
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

export default Register;
