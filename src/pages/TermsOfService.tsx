import React from "react";
import { Link } from "react-router-dom";
import NavBar from "./NavBar";
import Footer from "./Footer";
import "../scss/_legal.scss";

const TermsOfService: React.FC = () => {
  return (
    <>
      <NavBar />
      <div className="legal-page">
        <div className="legal-container">
          <div className="legal-header">
            <h1 className="legal-title">Terms of Service</h1>
            <p className="legal-subtitle">Last Updated: January 2025</p>
          </div>

          <div className="legal-content">
            <section className="legal-section">
              <h2>1. Acceptance of Terms</h2>
              <p>
                By accessing and using JosCity Smart Services ("the Platform"), you accept and agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use our services.
              </p>
            </section>

            <section className="legal-section">
              <h2>2. Description of Services</h2>
              <p>
                JosCity Smart Services provides a digital platform for accessing municipal services, including but not limited to:
              </p>
              <ul>
                <li>Bill payments and utility services</li>
                <li>Permit and license applications</li>
                <li>Complaint submission and tracking</li>
                <li>Event registration and management</li>
                <li>Citizen engagement and communication</li>
              </ul>
            </section>

            <section className="legal-section">
              <h2>3. User Accounts</h2>
              <h3>3.1 Account Registration</h3>
              <p>To access certain features, you must create an account. You agree to:</p>
              <ul>
                <li>Provide accurate, current, and complete information</li>
                <li>Maintain and update your information as necessary</li>
                <li>Maintain the security of your account credentials</li>
                <li>Accept responsibility for all activities under your account</li>
              </ul>

              <h3>3.2 Account Security</h3>
              <p>
                You are responsible for maintaining the confidentiality of your account password and for all activities that occur under your account. Notify us immediately of any unauthorized use.
              </p>
            </section>

            <section className="legal-section">
              <h2>4. Acceptable Use</h2>
              <p>You agree not to:</p>
              <ul>
                <li>Use the Platform for any illegal or unauthorized purpose</li>
                <li>Violate any laws or regulations in your use of the Platform</li>
                <li>Interfere with or disrupt the Platform or servers</li>
                <li>Transmit any viruses, malware, or harmful code</li>
                <li>Attempt to gain unauthorized access to any part of the Platform</li>
                <li>Impersonate any person or entity</li>
                <li>Collect or harvest information about other users</li>
                <li>Use automated systems to access the Platform without permission</li>
              </ul>
            </section>

            <section className="legal-section">
              <h2>5. Payments and Transactions</h2>
              <p>
                When making payments through the Platform, you agree to:
              </p>
              <ul>
                <li>Provide valid payment information</li>
                <li>Authorize charges for services you request</li>
                <li>Understand that all transactions are final unless otherwise stated</li>
                <li>Comply with refund and cancellation policies</li>
              </ul>
              <p>
                We reserve the right to refuse or cancel any transaction at our discretion.
              </p>
            </section>

            <section className="legal-section">
              <h2>6. Intellectual Property</h2>
              <p>
                All content, features, and functionality of the Platform, including but not limited to text, graphics, logos, icons, images, and software, are the property of JosCity Smart Services or its licensors and are protected by copyright, trademark, and other intellectual property laws.
              </p>
            </section>

            <section className="legal-section">
              <h2>7. User Content</h2>
              <p>
                You retain ownership of any content you submit to the Platform. By submitting content, you grant us a non-exclusive, worldwide, royalty-free license to use, reproduce, modify, and display such content for the purpose of providing our services.
              </p>
            </section>

            <section className="legal-section">
              <h2>8. Privacy</h2>
              <p>
                Your use of the Platform is also governed by our <Link to="/privacy-policy">Privacy Policy</Link>, which explains how we collect, use, and protect your information.
              </p>
            </section>

            <section className="legal-section">
              <h2>9. Disclaimers</h2>
              <p>
                THE PLATFORM IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. WE DO NOT WARRANT THAT THE PLATFORM WILL BE UNINTERRUPTED, ERROR-FREE.
              </p>
            </section>

            <section className="legal-section">
              <h2>10. Limitation of Liability</h2>
              <p>
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, JOSCITY SMART SERVICES SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING OUT OF OR RELATED TO YOUR USE OF THE PLATFORM.
              </p>
            </section>

            <section className="legal-section">
              <h2>11. Indemnification</h2>
              <p>
                You agree to indemnify and hold harmless JosCity Smart Services, its officers, employees, and agents from any claims, damages, losses, liabilities, and expenses arising out of your use of the Platform or violation of these Terms.
              </p>
            </section>

            <section className="legal-section">
              <h2>12. Termination</h2>
              <p>
                We reserve the right to suspend or terminate your account and access to the Platform at any time, with or without cause or notice, for any reason, including violation of these Terms.
              </p>
            </section>

            <section className="legal-section">
              <h2>13. Governing Law</h2>
              <p>
                These Terms shall be governed by and construed in accordance with the laws of the Federal Republic of Nigeria, without regard to its conflict of law provisions.
              </p>
            </section>

            <section className="legal-section">
              <h2>14. Changes to Terms</h2>
              <p>
                We reserve the right to modify these Terms at any time. We will notify users of material changes by posting the updated Terms on this page. Your continued use of the Platform after such changes constitutes acceptance of the updated Terms.
              </p>
            </section>

            <section className="legal-section">
              <h2>15. Contact Information</h2>
              <p>
                If you have questions about these Terms, please contact us at:
              </p>
              <p>
                <strong>Email:</strong> support@joscity.com<br />
                <strong>Address:</strong> Anglo Jos Road, Jos City, Plateau State, Nigeria
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

export default TermsOfService;

