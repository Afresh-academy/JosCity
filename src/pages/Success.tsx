import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logoImage from '../image/primary-logo.png';
import successLogo from '../image/success-logo.png';
import skyImage from '../image/sky.png';
import '../main.css';

const Success: React.FC = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger fade-in animation after component mounts
    setTimeout(() => {
      setIsVisible(true);
    }, 50);
  }, []);

  const handleSignIn = () => {
    navigate('/welcome');
  };

  return (
    <div className="success-page">
      <div className="success-background">
        <img src={skyImage} alt="Sky background" className="sky-image" />
      </div>

      <div className={`success-container ${isVisible ? 'fade-in' : ''}`}>
        <div className="success-card">
          <div className="success-top-section">
            <div className="success-logo-container">
              <img
                src={logoImage}
                alt="JOSCITY Logo"
                className="success-logo"
              />
            </div>

            <h1 className="success-heading">Success</h1>

            <div className="success-icon-container">
              <div className="success-checkmark">
                <img
                  src={successLogo}
                  alt="Success"
                  className="success-logo-icon"
                />
              </div>
            </div>
          </div>

          <div className="success-bottom-section">
            <div className="success-message">
              <p className="success-text">
                Your request has been successfully submitted. you will receive an email when your details has been verified
              </p>
            </div>

            <button
              type="button"
              className="success-signin-button"
              onClick={handleSignIn}
            >
              Sign In
            </button>
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
};

export default Success;

