import React from "react";
import { Link } from "react-router-dom";
import NavBar from "./NavBar";
import Footer from "./Footer";
import "../scss/_legal.scss";

const PrivacyPolicy: React.FC = () => {
  const currentDate = new Date().toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <>
      <NavBar />
      <div className="legal-page">
        <div className="legal-container">
          <div className="legal-header">
            <h1 className="legal-title">Privacy Policy</h1>
            <p className="legal-subtitle">Last Updated: {currentDate}</p>
          </div>

          <div className="legal-content">
            <section className="legal-section">
              <h2>1. Introduction</h2>
              <p>
                Welcome to JosCity Smart Services ("we," "our," or "us"). We are
                committed to protecting your privacy and ensuring you have a
                positive experience on our platform. This Privacy Policy
                explains how we collect, use, disclose, and safeguard your
                information when you use our services.
              </p>
            </section>

            <section className="legal-section">
              <h2>2. Information We Collect</h2>
              <h3>2.1 Personal Information</h3>
              <p>
                We may collect personal information that you provide directly to
                us, including:
              </p>
              <ul>
                <li>Name, email address, phone number, and postal address</li>
                <li>
                  Government identification numbers (for account verification)
                </li>
                <li>
                  Payment information (processed securely through third-party
                  providers)
                </li>
                <li>Account credentials and authentication information</li>
              </ul>

              <h3>2.2 Usage Information</h3>
              <p>
                We automatically collect certain information when you use our
                services:
              </p>
              <ul>
                <li>
                  Device information (IP address, browser type, operating
                  system)
                </li>
                <li>Usage patterns and preferences</li>
                <li>Log files and analytics data</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>
            </section>

            <section className="legal-section">
              <h2>3. How We Use Your Information</h2>
              <p>We use the information we collect to:</p>
              <ul>
                <li>Provide, maintain, and improve our services</li>
                <li>Process transactions and manage your account</li>
                <li>Send you administrative information and updates</li>
                <li>Respond to your inquiries and provide customer support</li>
                <li>
                  Detect, prevent, and address technical issues and security
                  threats
                </li>
                <li>Comply with legal obligations and enforce our terms</li>
                <li>
                  Conduct research and analytics to improve user experience
                </li>
              </ul>
            </section>

            <section className="legal-section">
              <h2>4. Information Sharing and Disclosure</h2>
              <p>
                We do not sell your personal information. We may share your
                information in the following circumstances:
              </p>
              <ul>
                <li>
                  <strong>Service Providers:</strong> With trusted third-party
                  service providers who assist in operating our platform
                </li>
                <li>
                  <strong>Legal Requirements:</strong> When required by law or
                  to protect our rights and safety
                </li>
                <li>
                  <strong>Business Transfers:</strong> In connection with a
                  merger, acquisition, or sale of assets
                </li>
                <li>
                  <strong>With Your Consent:</strong> When you explicitly
                  authorize us to share your information
                </li>
              </ul>
            </section>

            <section className="legal-section">
              <h2>5. Data Security</h2>
              <p>
                We implement appropriate technical and organizational measures
                to protect your personal information against unauthorized
                access, alteration, disclosure, or destruction. However, no
                method of transmission over the Internet is 100% secure, and we
                cannot guarantee absolute security.
              </p>
            </section>

            <section className="legal-section">
              <h2>6. Your Rights and Choices</h2>
              <p>You have the right to:</p>
              <ul>
                <li>Access and receive a copy of your personal information</li>
                <li>Correct inaccurate or incomplete information</li>
                <li>Request deletion of your personal information</li>
                <li>Object to or restrict certain processing activities</li>
                <li>Withdraw consent where processing is based on consent</li>
                <li>Opt-out of marketing communications</li>
              </ul>
            </section>

            <section className="legal-section">
              <h2>7. Cookies and Tracking Technologies</h2>
              <p>
                We use cookies and similar tracking technologies to enhance your
                experience, analyze usage patterns, and deliver personalized
                content. You can control cookie preferences through your browser
                settings. For more information, please see our{" "}
                <Link to="/cookie-policy">Cookie Policy</Link>.
              </p>
            </section>

            <section className="legal-section">
              <h2>8. Children's Privacy</h2>
              <p>
                Our services are not intended for individuals under the age of
                18. We do not knowingly collect personal information from
                children. If you believe we have collected information from a
                child, please contact us immediately.
              </p>
            </section>

            <section className="legal-section">
              <h2>9. Changes to This Privacy Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will
                notify you of any material changes by posting the new policy on
                this page and updating the "Last Updated" date. Your continued
                use of our services after such changes constitutes acceptance of
                the updated policy.
              </p>
            </section>

            <section className="legal-section">
              <h2>10. Contact Us</h2>
              <p>
                If you have questions or concerns about this Privacy Policy or
                our data practices, please contact us at:
              </p>
              <p>
                <strong>Email:</strong> support@joscity.com
                <br />
                <strong>Address:</strong> Anglo Jos Road, Jos City, Plateau
                State, Nigeria
              </p>
            </section>
          </div>

          <div className="legal-footer">
            <Link to="/" className="legal-back-link">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PrivacyPolicy;
