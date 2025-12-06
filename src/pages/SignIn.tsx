import { useState } from "react";
import { useNavigate } from "react-router-dom";
import skyImage from "../image/sky.png";
import primaryLogo from "../image/primary-logo.png";
import { Mail, Lock, Eye, EyeOff, ShieldCheck } from "lucide-react";
import API_BASE_URL from "../api/config";
import "../main.css";

function SignIn() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
    // Clear error when user starts typing
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Basic validation
    if (!formData.email || !formData.password) {
      setError("Please enter your email and password.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          activationCode: formData.activationCode,
        }),
      });

      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        throw new Error("Invalid response from server. Please try again.");
      }

      if (!response.ok) {
        throw new Error(
          data.message || "Sign in failed. Please check your credentials."
        );
      }

      // Success - store token if provided and navigate
      if (data.token) {
        localStorage.setItem("token", data.token);
      }
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      // Navigate to home or dashboard
      navigate("/");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred during sign in. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
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

            {error && (
              <div
                className="signin-error-message"
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
              className="signin-submit-button"
              disabled={isLoading}
              style={{
                opacity: isLoading ? 0.6 : 1,
                cursor: isLoading ? "not-allowed" : "pointer",
              }}
            >
              {isLoading ? "SIGNING IN..." : "SIGN IN"}
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
