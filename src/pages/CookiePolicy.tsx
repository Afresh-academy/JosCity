import React from "react";
import { Link } from "react-router-dom";
import NavBar from "./NavBar";
import Footer from "./Footer";
import "../scss/_legal.scss";

const CookiePolicy: React.FC = () => {
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
            <h1 className="legal-title">Cookie Policy</h1>
            <p className="legal-subtitle">Last Updated: {currentDate}</p>
          </div>

          <div className="legal-content">
            <section className="legal-section">
              <h2>1. What Are Cookies?</h2>
              <p>
                Cookies are small text files that are placed on your device when
                you visit a website. They are widely used to make websites work
                more efficiently and provide information to website owners.
              </p>
            </section>

            <section className="legal-section">
              <h2>2. How We Use Cookies</h2>
              <p>
                JosCity Smart Services uses cookies and similar tracking
                technologies to enhance your experience on our platform. We use
                cookies for the following purposes:
              </p>

              <h3>2.1 Essential Cookies</h3>
              <p>
                These cookies are necessary for the Platform to function
                properly. They enable core functionality such as security,
                network management, and accessibility.
              </p>
              <ul>
                <li>
                  <strong>Session Management:</strong> To maintain your login
                  session
                </li>
                <li>
                  <strong>Security:</strong> To protect against fraud and
                  unauthorized access
                </li>
                <li>
                  <strong>Load Balancing:</strong> To distribute traffic across
                  servers
                </li>
              </ul>

              <h3>2.2 Functional Cookies</h3>
              <p>
                These cookies allow the Platform to remember choices you make
                and provide enhanced, personalized features.
              </p>
              <ul>
                <li>
                  <strong>Preferences:</strong> To remember your language and
                  region settings
                </li>
                <li>
                  <strong>User Interface:</strong> To remember your display
                  preferences
                </li>
                <li>
                  <strong>Form Data:</strong> To remember information you've
                  entered in forms
                </li>
              </ul>

              <h3>2.3 Analytics Cookies</h3>
              <p>
                These cookies help us understand how visitors interact with our
                Platform by collecting and reporting information anonymously.
              </p>
              <ul>
                <li>
                  <strong>Usage Statistics:</strong> To track page views and
                  user interactions
                </li>
                <li>
                  <strong>Performance Monitoring:</strong> To identify and fix
                  technical issues
                </li>
                <li>
                  <strong>User Behavior:</strong> To improve user experience and
                  functionality
                </li>
              </ul>

              <h3>2.4 Marketing Cookies</h3>
              <p>
                These cookies are used to deliver relevant advertisements and
                track campaign effectiveness.
              </p>
              <ul>
                <li>
                  <strong>Ad Targeting:</strong> To show you relevant content
                </li>
                <li>
                  <strong>Campaign Tracking:</strong> To measure the
                  effectiveness of our communications
                </li>
              </ul>
            </section>

            <section className="legal-section">
              <h2>3. Types of Cookies We Use</h2>
              <table className="legal-table">
                <thead>
                  <tr>
                    <th>Cookie Name</th>
                    <th>Purpose</th>
                    <th>Duration</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>session_id</td>
                    <td>Maintains user session</td>
                    <td>Session</td>
                  </tr>
                  <tr>
                    <td>auth_token</td>
                    <td>Authentication and security</td>
                    <td>30 days</td>
                  </tr>
                  <tr>
                    <td>user_preferences</td>
                    <td>Stores user preferences</td>
                    <td>1 year</td>
                  </tr>
                  <tr>
                    <td>analytics_id</td>
                    <td>Analytics and performance tracking</td>
                    <td>2 years</td>
                  </tr>
                </tbody>
              </table>
            </section>

            <section className="legal-section">
              <h2>4. Third-Party Cookies</h2>
              <p>
                Some cookies are placed by third-party services that appear on
                our pages. We use the following third-party services:
              </p>
              <ul>
                <li>
                  <strong>Google Analytics:</strong> For website analytics and
                  performance monitoring
                </li>
                <li>
                  <strong>Payment Processors:</strong> For secure payment
                  processing
                </li>
                <li>
                  <strong>Content Delivery Networks:</strong> For faster content
                  delivery
                </li>
              </ul>
              <p>
                These third parties may use cookies to collect information about
                your online activities across different websites. We do not
                control these cookies.
              </p>
            </section>

            <section className="legal-section">
              <h2>5. Managing Cookies</h2>
              <h3>5.1 Browser Settings</h3>
              <p>
                Most web browsers allow you to control cookies through their
                settings. You can:
              </p>
              <ul>
                <li>Block all cookies</li>
                <li>Block third-party cookies</li>
                <li>Delete existing cookies</li>
                <li>
                  Set your browser to notify you when cookies are being set
                </li>
              </ul>
              <p>
                Please note that blocking or deleting cookies may impact your
                ability to use certain features of our Platform.
              </p>

              <h3>5.2 Platform Cookie Settings</h3>
              <p>
                You can manage your cookie preferences through our Platform
                settings. Access your account settings to customize which types
                of cookies you accept.
              </p>
            </section>

            <section className="legal-section">
              <h2>6. Do Not Track Signals</h2>
              <p>
                Some browsers include a "Do Not Track" (DNT) feature that
                signals websites you visit that you do not want to have your
                online activity tracked. Currently, there is no standard for how
                DNT signals should be interpreted. We do not respond to DNT
                signals at this time.
              </p>
            </section>

            <section className="legal-section">
              <h2>7. Updates to This Policy</h2>
              <p>
                We may update this Cookie Policy from time to time to reflect
                changes in our practices or for other operational, legal, or
                regulatory reasons. We will notify you of any material changes
                by posting the updated policy on this page.
              </p>
            </section>

            <section className="legal-section">
              <h2>8. More Information</h2>
              <p>
                For more information about cookies and how to manage them, you
                can visit:
              </p>
              <ul>
                <li>
                  <a
                    href="https://www.allaboutcookies.org"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    www.allaboutcookies.org
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.youronlinechoices.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    www.youronlinechoices.com
                  </a>
                </li>
              </ul>
            </section>

            <section className="legal-section">
              <h2>9. Contact Us</h2>
              <p>
                If you have questions about our use of cookies, please contact
                us at:
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

export default CookiePolicy;
