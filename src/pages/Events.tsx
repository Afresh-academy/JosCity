import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import "../main.css";
import "../scss/_events.scss";
import multipleLaugh from "../image/multiple-laugh.png";
import smile from "../image/smile.png";
import christmas from "../image/Christmas.webp";

const Events: React.FC = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [visibleElements, setVisibleElements] = useState<Set<string>>(
    new Set()
  );
  const badgeRef = useRef<HTMLDivElement>(null);
  const imageWrapperRef = useRef<HTMLDivElement>(null);

  // Event images
  const eventImages = [
    {
      id: 1,
      url: multipleLaugh,
      alt: "Community Gathering",
    },
    {
      id: 2,
      url: smile,
      alt: "Happy Community",
    },
    {
      id: 3,
      url: christmas,
      alt: "Christmas Celebration",
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

    const elements = [badgeRef.current, imageWrapperRef.current];

    elements.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => {
      elements.forEach((el) => {
        if (el) observer.unobserve(el);
      });
    };
  }, []);

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? eventImages.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === eventImages.length - 1 ? 0 : prev + 1
    );
  };

  // Auto-advance images every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) =>
        prev === eventImages.length - 1 ? 0 : prev + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [eventImages.length]);

  return (
    <section id="events" className="events">
      <div className="events__container">
        <div className="events__heading">
          <div
            ref={badgeRef}
            data-animate-id="events-badge"
            className={`events__badge ${
              visibleElements.has("events-badge") ? "fade-in" : ""
            }`}
          >
            <Calendar size={16} />
            <span>City Events</span>
          </div>
        </div>

        <div
          ref={imageWrapperRef}
          data-animate-id="events-image"
          className={`events__image-wrapper ${
            visibleElements.has("events-image") ? "fade-in" : ""
          }`}
        >
          {eventImages.length > 0 && (
            <>
              <img
                src={eventImages[currentImageIndex].url}
                alt={eventImages[currentImageIndex].alt}
                className="events__image"
              />
              {eventImages.length > 1 && (
                <>
                  <button
                    className="events__nav-button events__nav-button--prev"
                    onClick={handlePrevImage}
                    aria-label="Previous event"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    className="events__nav-button events__nav-button--next"
                    onClick={handleNextImage}
                    aria-label="Next event"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default Events;
