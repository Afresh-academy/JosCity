import React, { useState, useEffect, useRef } from "react";
import "../main.css";
import "../scss/_testimonials.scss";
import AfricanWoman from "../image/african-woman.jpg";

interface Testimonial {
  id: number;
  quote: string;
  name: string;
  rating: number;
}

const Testimonials: React.FC = () => {
  const [visibleElements, setVisibleElements] = useState<Set<string>>(
    new Set()
  );
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const badgeRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const testimonials: Testimonial[] = [
    {
      id: 1,
      quote:
        "Using The Jos Smart City App Has Completely Changed The Way I Experience The City! I Can Easily Find Local Businesses, Pay Bills, And Even Earn Rewards While Doing It. It's Convenient, Reliable, And Makes Living In Jos Feel More Connected Than Ever.",
      name: "Anita Dachung",
      rating: 5,
    },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const elementId = entry.target.getAttribute("data-animate-id");
            if (elementId) {
              setVisibleElements((prev) => new Set(prev).add(elementId));
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    const badgeElement = badgeRef.current;
    const headingElement = headingRef.current;
    const cardElement = cardRef.current;

    if (badgeElement) {
      observer.observe(badgeElement);
    }
    if (headingElement) {
      observer.observe(headingElement);
    }
    if (cardElement) {
      observer.observe(cardElement);
    }

    return () => {
      if (badgeElement) {
        observer.unobserve(badgeElement);
      }
      if (headingElement) {
        observer.unobserve(headingElement);
      }
      if (cardElement) {
        observer.unobserve(cardElement);
      }
    };
  }, []);

  const goToPrevious = () => {
    setCurrentTestimonial(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  const goToNext = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const current = testimonials[currentTestimonial];

  return (
    <section className="testimonials" id="testimonials">
      <div className="testimonials__container">
        <div className="testimonials__heading">
          <div
            ref={badgeRef}
            data-animate-id="testimonials-badge"
            className={`testimonials__badge ${
              visibleElements.has("testimonials-badge") ? "fade-in" : ""
            }`}
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
            <span>Testimonials</span>
          </div>
          <h2
            ref={headingRef}
            data-animate-id="testimonials-heading"
            className={`testimonials__title ${
              visibleElements.has("testimonials-heading") ? "fade-in" : ""
            }`}
          >
            What Our Customers Says About Us
          </h2>
        </div>

        <div
          ref={cardRef}
          data-animate-id="testimonials-card"
          className={`testimonials__card ${
            visibleElements.has("testimonials-card") ? "fade-in" : ""
          }`}
        >
          <div className="testimonials__content">
            <p className="testimonials__quote">{current.quote}</p>
            <div className="testimonials__rating">
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
            <h3 className="testimonials__name">{current.name}</h3>
          </div>
          <img
            src={AfricanWoman}
            alt={current.name}
            className="testimonials__image"
          />
        </div>

        <div className="testimonials__navigation">
          <button
            className="testimonials__nav-button testimonials__nav-button--prev"
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
            className="testimonials__nav-button testimonials__nav-button--next"
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

export default Testimonials;

