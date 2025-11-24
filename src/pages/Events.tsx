import React from "react";
import "../main.css";
import "../scss/_events.scss";
import Christmas from "../image/Christmas.jpg";
import LazyImage from "../components/LazyImage";
import { useScrollAnimation } from "../hooks/useScrollAnimation";

const Events: React.FC = () => {
  const badgeAnimation = useScrollAnimation({ 
    threshold: 0.2, 
    animationClass: 'fade-in' 
  });
  const imageAnimation = useScrollAnimation({ 
    threshold: 0.1, 
    animationClass: 'fade-in' 
  });

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
            <span>Upcoming Events in Jos</span>
          </div>
        </div>
        <LazyImage
          src={Christmas}
          alt="Christmas event in Jos"
          className={`events__image ${imageAnimation.className}`}
          ref={imageAnimation.ref as React.RefObject<HTMLDivElement>}
        />
      </div>
    </section>
  );
};
export default Events;
