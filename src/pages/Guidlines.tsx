import React, { useState } from "react";
import "../main.css";
import "../scss/_guidelines.scss";
import primaryLogo from "../image/primary-logo.png";
import { useScrollAnimation } from "../hooks/useScrollAnimation";
import LazyImage from "../components/LazyImage";

interface Guidelines {
  id: number;
  quote: string;
  name: string;
  rating: number;
}

const Guidelines: React.FC = () => {
  const [currentGuidelines, setCurrentGuidelines] = useState(0);

  // Scroll animations
  const badgeAnimation = useScrollAnimation({
    threshold: 0.2,
    animationClass: "fade-in",
  });
  const headingAnimation = useScrollAnimation({
    threshold: 0.2,
    animationClass: "fade-in",
  });
  const cardAnimation = useScrollAnimation({
    threshold: 0.1,
    animationClass: "fade-in",
  });
  const imageAnimation = useScrollAnimation({
    threshold: 0.1,
    animationClass: "scroll-in",
  });

  const guidelines: Guidelines[] = [
    {
      id: 1,
      quote:
        "Welcome to the Jos Smart City PWA! We're here to help you navigate and enjoy your city with ease. In this phase of the app, kindly click on green 'Get Started' button to redirect you to an account type panel, select your type of account, carefukky fill in your details, an email would be sent to you if submitted successfully, with a login button, your email address and an OTP, kindly change your password after logging in.",
      name: "AfrESH Support",
      rating: 5,
    },
  ];

  const goToPrevious = () => {
    setCurrentGuidelines(
      (prev) => (prev - 1 + guidelines.length) % guidelines.length
    );
  };

  const goToNext = () => {
    setCurrentGuidelines((prev) => (prev + 1) % guidelines.length);
  };

  const current = guidelines[currentGuidelines];

  return (
    <section className="guidelines" id="guidelines">
      <div className="guidelines__container">
        <div className="guidelines__heading">
          <div
            ref={badgeAnimation.ref as React.RefObject<HTMLDivElement>}
            className={`guidelines__badge ${badgeAnimation.className}`}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>Guidelines</span>
          </div>
          <h2
            ref={headingAnimation.ref as React.RefObject<HTMLHeadingElement>}
            className={`guidelines__title ${headingAnimation.className}`}
          >
            PWA Guidelines
          </h2>
        </div>

        <div
          ref={cardAnimation.ref as React.RefObject<HTMLDivElement>}
          className={`guidelines__card ${cardAnimation.className}`}
        >
          <div className="guidelines__content">
            <p className="guidelines__quote">{current.quote}</p>
            <div className="guidelines__rating">
              {[...Array(current.rating)].map((_, index) => (
                <svg
                  key={index}
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                </svg>
              ))}
            </div>
            <h3 className="guidelines__name">{current.name}</h3>
          </div>
          <LazyImage
            src={primaryLogo}
            alt={current.name}
            className={`guidelines__image ${imageAnimation.className}`}
            ref={imageAnimation.ref as React.RefObject<HTMLDivElement>}
          />
        </div>

        <div className="guidelines__navigation">
          <button
            className="guidelines__nav-button guidelines__nav-button--prev"
            onClick={goToPrevious}
            aria-label="Previous testimonial"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15 18L9 12L15 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            className="guidelines__nav-button guidelines__nav-button--next"
            onClick={goToNext}
            aria-label="Next testimonial"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 18L15 12L9 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Guidelines;
