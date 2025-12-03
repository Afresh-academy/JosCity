import React, { useState, useEffect } from "react";
import "../main.css";
import "../scss/_events.scss";
import Christmas from "../image/Christmas.webp"; // Fallback image
import MultipleLaugh from "../image/multiple-laugh.png";
import smile from "../image/smile.png";
import LazyImage from "../components/LazyImage";
import { useScrollAnimation } from "../hooks/useScrollAnimation";

const Events: React.FC = () => {
  const [badgeText, setBadgeText] = useState<string>("Upcoming Events in Jos");
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);

  const images = [Christmas, MultipleLaugh, smile];

  const badgeAnimation = useScrollAnimation({
    threshold: 0.2,
    animationClass: "fade-in",
  });
  const imageAnimation = useScrollAnimation({
    threshold: 0.1,
    animationClass: "fade-in",
  });

  useEffect(() => {
    // Use default values (no API calls)
    setBadgeText("Upcoming Events in Jos");
  }, []);

  const handlePrevious = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <section className="events" id="events">
      <div className="events__container">
        <div className="events__heading">
          <div
            ref={badgeAnimation.ref as React.RefObject<HTMLDivElement>}
            className={`events__badge ${badgeAnimation.className}`}
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
            <span>{badgeText}</span>
          </div>
        </div>
        <div
          className={`events__image-wrapper ${imageAnimation.className}`}
          ref={imageAnimation.ref as React.RefObject<HTMLDivElement>}
        >
          <LazyImage
            src={images[currentImageIndex]}
            alt="Upcoming event in Jos"
            className="events__image"
          />
          {images.length > 1 && (
            <>
              <button
                className="events__nav-button events__nav-button--prev"
                onClick={handlePrevious}
                aria-label="Previous image"
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
                className="events__nav-button events__nav-button--next"
                onClick={handleNext}
                aria-label="Next image"
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
            </>
          )}
        </div>
      </div>
    </section>
  );
};
export default Events;
