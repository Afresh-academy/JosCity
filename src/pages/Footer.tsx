import React from 'react';
import logoImage from '../image/primary-logo.png';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__content">
          <div className="footer__column footer__column--brand">
            <div className="footer__logo">
              <img
                src={logoImage}
                alt="JosCity Logo"
                className="footer__logo-image"
              />
            </div>
            <p className="footer__tagline">
              Your gateway to smart<br />
              city services and digital<br />
              governance.
            </p>
          </div>

          <div className="footer__column">
            <h3 className="footer__heading">Quick Links</h3>
            <ul className="footer__links">
              <li>
                <a href="#" className="footer__link">Services</a>
              </li>
              <li>
                <a href="#" className="footer__link">About Us</a>
              </li>
              <li>
                <a href="#" className="footer__link">Contact</a>
              </li>
              <li>
                <a href="#" className="footer__link">FAQs</a>
              </li>
            </ul>
          </div>

          <div className="footer__column">
            <h3 className="footer__heading">Services</h3>
            <ul className="footer__links">
              <li>
                <a href="#" className="footer__link">Bill Payments</a>
              </li>
              <li>
                <a href="#" className="footer__link">Permits</a>
              </li>
              <li>
                <a href="#" className="footer__link">Licenses</a>
              </li>
              <li>
                <a href="#" className="footer__link">Complaints</a>
              </li>
            </ul>
          </div>

          <div className="footer__column">
            <h3 className="footer__heading">Legal</h3>
            <ul className="footer__links">
              <li>
                <a href="#" className="footer__link">Privacy Policy</a>
              </li>
              <li>
                <a href="#" className="footer__link">Terms of Service</a>
              </li>
              <li>
                <a href="#" className="footer__link">Cookie Policy</a>
              </li>
              <li>
                <a href="#" className="footer__link">Accessibility</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="footer__divider"></div>

      <div className="footer__container">
        <div className="footer__copyright">
          <p>© 2025 JosCity Smart Services. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

