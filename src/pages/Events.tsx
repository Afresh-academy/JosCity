import React, { useState, useEffect, useRef } from "react";
import "../main.css";
import "../scss/_events.scss";
import Christmas from "../image/Christmas.jpg";

const Events: React.FC = () => {
  const [visibleElements, setVisibleElements] = useState<Set<string>>(
    new Set()
  );
  const badgeRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

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
    const imageElement = imageRef.current;

    if (badgeElement) {
      observer.observe(badgeElement);
    }
    if (imageElement) {
      observer.observe(imageElement);
    }

    return () => {
      if (badgeElement) {
        observer.unobserve(badgeElement);
      }
      if (imageElement) {
        observer.unobserve(imageElement);
      }
    };
  }, []);

  return (
    <section className="events" id="events">
      <div className="events__container">
        <div className="events__heading">
          <div
            ref={badgeRef}
            data-animate-id="events-badge"
            className={`events__badge ${
              visibleElements.has("events-badge") ? "fade-in" : ""
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
                d="M8 2V6M16 2V6M3 10H21M5 4H19C20.1046 4 21 4.89543 21 6V20C21 21.1046 20.1046 22 19 22H5C3.89543 22 3 21.1046 3 20V6C3 4.89543 3.89543 4 5 4Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>Upcoming Events in Jos</span>
          </div>
        </div>
        <div
          ref={imageRef}
          data-animate-id="events-image"
          className={`events__image-wrapper ${
            visibleElements.has("events-image") ? "fade-in" : ""
          }`}
        >
          <img
            src={Christmas}
            alt="Christmas event in Jos"
            className="events__image"
          />
        </div>
      </div>
    </section>
  );
};
export default Events;
