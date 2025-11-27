import { useState } from "react";
import { useNavigate } from "react-router-dom";
import skyImage from "../image/sky.png";
import primaryLogo from "../image/primary-logo.png";
import RegistrationTabs from "../components/RegistrationTabs";
import PersonalFormFields from "../components/PersonalFormFields";
import BusinessFormFields from "../components/BusinessFormFields";
import SignInLink from "../components/SignInLink";
import { API_BASE_URL } from "../api/config";
import {
  validatePersonalForm,
  validateBusinessForm,
  type ValidationError,
} from "../utils/validationSchemas";
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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>(
    []
  );

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear validation error for this field when user starts typing
    setValidationErrors((prev) => prev.filter((err) => err.field !== name));
    setError(null);
  };

  const handleBusinessInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setBusinessFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear validation error for this field when user starts typing
    setValidationErrors((prev) => prev.filter((err) => err.field !== name));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setValidationErrors([]);

    if (registrationType === "personal") {
      // Validate personal form
      const errors = validatePersonalForm(formData);
      if (errors.length > 0) {
        setValidationErrors(errors);
        setError("Please fix the errors in the form before submitting.");
        return;
      }

      // Personal form submission
      setIsLoading(true);
      try {
        // Map frontend fields to backend expected fields
        const requestData = {
          first_name: formData.firstName.trim(),
          last_name: formData.lastName.trim(),
          gender: formData.gender,
          phone_number: formData.phoneNumber.trim(),
          email: formData.email.trim(),
          nin_number: formData.ninNumber.trim(),
          address: formData.address.trim(),
          password: formData.password,
        };

        const response = await fetch(`${API_BASE_URL}/auth/personal/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        });

        // Check if response is JSON before parsing
        const contentType = response.headers.get("content-type");
        let data;

        if (contentType && contentType.includes("application/json")) {
          data = await response.json();
        } else {
          // If not JSON, read as text to see what we got
          const text = await response.text();
          console.error("Non-JSON response received:", text.substring(0, 200));
          throw new Error(
            response.status === 404
              ? "API endpoint not found. Please check if the backend server is running."
              : `Server error (${response.status}). Please try again later.`
          );
        }

        if (!response.ok) {
          throw new Error(
            data.message ||
              data.error ||
              "Registration failed. Please try again."
          );
        }

        // Only navigate to success page after successful backend confirmation
        navigate("/success", {
          state: {
            submitted: true,
            accountType: "personal",
            email: formData.email,
          },
        });
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "An error occurred. Please try again."
        );
        setIsLoading(false);
      }
      return;
    }

    // Validate business form
    const errors = validateBusinessForm(businessFormData);
    if (errors.length > 0) {
      setValidationErrors(errors);
      setError("Please fix the errors in the form before submitting.");
      return;
    }

    // Business form submission
    setIsLoading(true);
    try {
      // Map frontend fields to backend expected fields
      const requestData = {
        business_name: businessFormData.businessName.trim(),
        business_location: businessFormData.businessAddress.trim(),
        phone_number: businessFormData.businessPhone.trim(),
        email: businessFormData.businessEmail.trim(),
        CAC_number: businessFormData.cacNumber.trim(), // Required for business accounts
        address: businessFormData.businessAddress.trim(),
        password: businessFormData.businessPassword,
        business_type: businessFormData.businessType,
      };

      const response = await fetch(`${API_BASE_URL}/auth/business/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      // Check if response is JSON before parsing
      const contentType = response.headers.get("content-type");
      let data;

      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        // If not JSON, read as text to see what we got
        const text = await response.text();
        console.error("Non-JSON response received:", text.substring(0, 200));
        throw new Error(
          response.status === 404
            ? "API endpoint not found. Please check if the backend server is running."
            : `Server error (${response.status}). Please try again later.`
        );
      }

      if (!response.ok) {
        throw new Error(
          data.message || data.error || "Registration failed. Please try again."
        );
      }

      // Only navigate to success page after successful backend confirmation
      navigate("/success", {
        state: {
          submitted: true,
          accountType: "business",
          email: businessFormData.businessEmail,
        },
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred. Please try again."
      );
      setIsLoading(false);
    }
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

                {validationErrors.length > 0 && (
                  <div
                    className="register-error-message"
                    style={{
                      color: "#ff4444",
                      fontSize: "14px",
                      marginTop: "10px",
                      textAlign: "center",
                      padding: "10px",
                      backgroundColor: "rgba(255, 68, 68, 0.1)",
                      borderRadius: "8px",
                      border: "1px solid rgba(255, 68, 68, 0.3)",
                    }}
                  >
                    {validationErrors.map((err, idx) => (
                      <div key={idx}>{err.message}</div>
                    ))}
                  </div>
                )}

                {error && (
                  <div
                    className="register-error-message"
                    style={{
                      color: "#ff4444",
                      fontSize: "14px",
                      marginTop: "10px",
                      textAlign: "center",
                      padding: "10px",
                      backgroundColor: "rgba(255, 68, 68, 0.1)",
                      borderRadius: "8px",
                      border: "1px solid rgba(255, 68, 68, 0.3)",
                    }}
                  >
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  className="register-submit-button"
                  disabled={isLoading}
                  style={{
                    opacity: isLoading ? 0.6 : 1,
                    cursor: isLoading ? "not-allowed" : "pointer",
                  }}
                >
                  {isLoading ? "SUBMITTING..." : "SUBMIT"}
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

                {validationErrors.length > 0 && (
                  <div
                    className="register-error-message"
                    style={{
                      color: "#ff4444",
                      fontSize: "14px",
                      marginTop: "10px",
                      textAlign: "center",
                      padding: "10px",
                      backgroundColor: "rgba(255, 68, 68, 0.1)",
                      borderRadius: "8px",
                      border: "1px solid rgba(255, 68, 68, 0.3)",
                    }}
                  >
                    {validationErrors.map((err, idx) => (
                      <div key={idx}>{err.message}</div>
                    ))}
                  </div>
                )}

                {error && (
                  <div
                    className="register-error-message"
                    style={{
                      color: "#ff4444",
                      fontSize: "14px",
                      marginTop: "10px",
                      textAlign: "center",
                      padding: "10px",
                      backgroundColor: "rgba(255, 68, 68, 0.1)",
                      borderRadius: "8px",
                      border: "1px solid rgba(255, 68, 68, 0.3)",
                    }}
                  >
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  className="register-submit-button"
                  disabled={isLoading}
                  style={{
                    opacity: isLoading ? 0.6 : 1,
                    cursor: isLoading ? "not-allowed" : "pointer",
                  }}
                >
                  {isLoading ? "SUBMITTING..." : "SUBMIT"}
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
