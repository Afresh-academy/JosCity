import React from "react";
import { Link } from "react-router-dom";
import NavBar from "./NavBar";
import Footer from "./Footer";
import "../scss/_legal.scss";

const Accessibility: React.FC = () => {
  return (
    <>
      <NavBar />
      <div className="legal-page">
        <div className="legal-container">
          <div className="legal-header">
            <h1 className="legal-title">Accessibility Statement</h1>
            <p className="legal-subtitle">Last Updated: January 2025</p>
          </div>

          <div className="legal-content">
            <section className="legal-section">
              <h2>1. Our Commitment</h2>
              <p>
                JosCity Smart Services is committed to ensuring digital accessibility for people with disabilities. We are continually improving the user experience for everyone and applying the relevant accessibility standards to achieve these goals.
              </p>
            </section>

            <section className="legal-section">
              <h2>2. Accessibility Standards</h2>
              <p>
                We aim to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standards. These guidelines explain how to make web content more accessible for people with disabilities and user-friendly for everyone.
              </p>
              <p>
                The guidelines have three levels of conformance (A, AA, and AAA). We are working toward Level AA compliance, which includes:
              </p>
              <ul>
                <li>Text alternatives for non-text content</li>
                <li>Keyboard navigation support</li>
                <li>Sufficient color contrast</li>
                <li>Resizable text up to 200% without loss of functionality</li>
                <li>Clear headings and labels</li>
                <li>Error identification and suggestions</li>
              </ul>
            </section>

            <section className="legal-section">
              <h2>3. Accessibility Features</h2>
              <p>Our Platform includes the following accessibility features:</p>

              <h3>3.1 Keyboard Navigation</h3>
              <p>
                All interactive elements can be accessed using a keyboard. You can navigate through the Platform using:
              </p>
              <ul>
                <li><strong>Tab:</strong> Move forward through interactive elements</li>
                <li><strong>Shift + Tab:</strong> Move backward through interactive elements</li>
                <li><strong>Enter/Space:</strong> Activate buttons and links</li>
                <li><strong>Arrow Keys:</strong> Navigate within menus and lists</li>
                <li><strong>Escape:</strong> Close modals and menus</li>
              </ul>

              <h3>3.2 Screen Reader Support</h3>
              <p>
                Our Platform is designed to work with screen readers and assistive technologies. We use semantic HTML, ARIA labels, and proper heading structures to ensure content is accessible.
              </p>

              <h3>3.3 Text Alternatives</h3>
              <p>
                We provide alternative text for images and other non-text content to ensure information is accessible to users who cannot see visual content.
              </p>

              <h3>3.4 Color and Contrast</h3>
              <p>
                We maintain sufficient color contrast ratios to ensure text is readable for users with visual impairments. Color is not used as the sole means of conveying information.
              </p>

              <h3>3.5 Text Resizing</h3>
              <p>
                Users can resize text up to 200% using browser zoom controls without losing functionality or content.
              </p>

              <h3>3.6 Forms and Inputs</h3>
              <p>
                All form fields are properly labeled, and error messages are clearly identified and associated with the relevant fields.
              </p>
            </section>

            <section className="legal-section">
              <h2>4. Known Limitations</h2>
              <p>
                Despite our best efforts to ensure accessibility, there may be some limitations. We are actively working to address these issues:
              </p>
              <ul>
                <li>Some third-party content may not be fully accessible</li>
                <li>Older documents may not meet current accessibility standards</li>
                <li>Some interactive features may require additional keyboard navigation improvements</li>
              </ul>
              <p>
                We welcome your feedback on accessibility issues. Please contact us if you encounter any barriers.
              </p>
            </section>

            <section className="legal-section">
              <h2>5. Assistive Technologies</h2>
              <p>
                Our Platform is compatible with the following assistive technologies:
              </p>
              <ul>
                <li>Screen readers (NVDA, JAWS, VoiceOver, TalkBack)</li>
                <li>Screen magnification software</li>
                <li>Voice recognition software</li>
                <li>Keyboard-only navigation</li>
                <li>Switch devices</li>
              </ul>
            </section>

            <section className="legal-section">
              <h2>6. Browser Compatibility</h2>
              <p>
                For the best accessibility experience, we recommend using the latest versions of:
              </p>
              <ul>
                <li>Google Chrome</li>
                <li>Mozilla Firefox</li>
                <li>Microsoft Edge</li>
                <li>Apple Safari</li>
              </ul>
            </section>

            <section className="legal-section">
              <h2>7. Feedback and Reporting Issues</h2>
              <p>
                We welcome your feedback on the accessibility of JosCity Smart Services. If you encounter accessibility barriers or have suggestions for improvement, please contact us:
              </p>
              <p>
                <strong>Email:</strong> support@joscity.com<br />
                <strong>Phone:</strong> +234 7067621916<br />
                <strong>Address:</strong> Anglo Jos Road, Jos City, Plateau State, Nigeria
              </p>
              <p>
                When contacting us, please include:
              </p>
              <ul>
                <li>A description of the accessibility issue</li>
                <li>The web address or page where you encountered the issue</li>
                <li>Your contact information</li>
                <li>The assistive technology you were using (if applicable)</li>
              </ul>
            </section>

            <section className="legal-section">
              <h2>8. Ongoing Improvements</h2>
              <p>
                We are committed to continuously improving the accessibility of our Platform. Our team regularly:
              </p>
              <ul>
                <li>Conducts accessibility audits</li>
                <li>Tests with assistive technologies</li>
                <li>Reviews user feedback</li>
                <li>Updates content and features to meet accessibility standards</li>
                <li>Provides training to our development team on accessibility best practices</li>
              </ul>
            </section>

            <section className="legal-section">
              <h2>9. Third-Party Content</h2>
              <p>
                Some content on our Platform may be provided by third parties. While we strive to ensure all content is accessible, we cannot guarantee the accessibility of third-party content. If you encounter accessibility issues with third-party content, please contact us, and we will work with the content provider to address the issue.
              </p>
            </section>

            <section className="legal-section">
              <h2>10. Updates to This Statement</h2>
              <p>
                We may update this Accessibility Statement periodically to reflect changes in our practices, technology, or legal requirements. We will notify users of significant changes by posting the updated statement on this page.
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

export default Accessibility;

