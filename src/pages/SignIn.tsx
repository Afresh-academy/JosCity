import { useState } from "react";
import { useNavigate } from "react-router-dom";
import skyImage from "../image/sky.png";
import primaryLogo from "../image/primary-logo.png";
import { Mail, Lock, Eye, EyeOff, ShieldCheck } from "lucide-react";
import "../main.css";

function SignIn() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    activationCode: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Sign in submitted:", formData);
  };

  return (
    <div className="signin-page">
      <div className="signin-background">
        <img src={skyImage} alt="Sky background" className="sky-image" />
      </div>

      <div className="signin-container">
        <div className="signin-form-panel">
          <div className="signin-logo-container">
            <img src={primaryLogo} alt="JOSCITY Logo" className="signin-logo" />
          </div>

          <h2 className="signin-title">Sign in to your account</h2>

          <form className="signin-form" onSubmit={handleSubmit}>
            <div className="signin-form-group">
              <label htmlFor="email">Email</label>
              <div className="signin-input-wrapper">
                <Mail className="signin-input-icon" size={20} />
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

            <div className="signin-form-group">
              <label htmlFor="password">Password</label>
              <div className="signin-input-wrapper">
                <Lock className="signin-input-icon" size={20} />
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
                  className="signin-password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="signin-input-icon" size={20} />
                  ) : (
                    <Eye className="signin-input-icon" size={20} />
                  )}
                </button>
              </div>
            </div>

            <div className="signin-form-group">
              <label htmlFor="activationCode">Activation Code</label>
              <div className="signin-input-wrapper">
                <ShieldCheck className="signin-input-icon" size={20} />
                <input
                  type="text"
                  id="activationCode"
                  name="activationCode"
                  value={formData.activationCode}
                  onChange={handleInputChange}
                  placeholder="Activation Code"
                />
              </div>
            </div>

            <button type="submit" className="signin-submit-button">
              SIGN IN
            </button>
          </form>

          <div className="signin-register-link">
            <p>
              Don't have an account?{" "}
              <button
                className="signin-register-link-button"
                onClick={() => navigate("/welcome")}
                type="button"
              >
                Register
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
