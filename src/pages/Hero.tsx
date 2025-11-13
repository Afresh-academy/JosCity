import { useState, useEffect, useRef } from "react";
import { Lightbulb } from "lucide-react";
import "../main.css";

const heroSlides = [
  {
    id: 1,
    image: "/src/image/hero-image.png",
    title: "Welcome to Jos Smart City",
    subtitle: "The-Digital Economy",
    description:
      "Access all municipal services, pay bills, and engage with your city - all in one place.",
  },
  {
    id: 2,
    image: "/src/image/plateau-legs.png",
    title: "Anticipate",
    subtitle:
      "Jos City Carnival!",
    description:
      "Purchase tickets, manage bookings, and connect with your event - all in one convenient location",
  },
  {
    id: 3,
    image: "/src/image/terminus.png",
    title: "Exciting Event Ahead at",
    subtitle: "Jos Central Market!",
    description:
      "Join us for an ourdoor event where you can explore all municipal services, settle your bills, and connect with your communityall in one exciting location!",
  },
];

function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [visibleElements, setVisibleElements] = useState<Set<string>>(
    new Set()
  );
  const badgeRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, []);

  // Reset fade-in on slide change for smooth transitions
  useEffect(() => {
    // Briefly remove fade-in class, then re-add for smooth animation
    const timer = setTimeout(() => {
      setVisibleElements(
        new Set([
          "hero-badge",
          "hero-title",
          "hero-subtitle",
          "hero-description",
          "hero-buttons",
        ])
      );
    }, 50);

    return () => clearTimeout(timer);
  }, [currentSlide]);

  useEffect(() => {
    // Trigger fade-in immediately for hero section (at top of page)
    const timer = setTimeout(() => {
      setVisibleElements(
        new Set([
          "hero-badge",
          "hero-title",
          "hero-subtitle",
          "hero-description",
          "hero-buttons",
        ])
      );
    }, 100);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleElements((prev) => new Set(prev).add(entry.target.id));
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = [
      badgeRef.current,
      titleRef.current,
      subtitleRef.current,
      descriptionRef.current,
      buttonsRef.current,
    ];

    elements.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => {
      clearTimeout(timer);
      elements.forEach((el) => {
        if (el) observer.unobserve(el);
      });
    };
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const handleGetStarted = () => {
    window.location.href = "https://joscity.com";
  };

  return (
    <div className="hero">
      {heroSlides.map((slide, index) => (
        <div
          key={slide.id}
          className={`hero__slide ${index === currentSlide ? "active" : ""}`}
          style={{ backgroundImage: `url(${slide.image})` }}
        >
          <div className="hero__overlay"></div>
        </div>
      ))}

      <div className="hero__content">
        <div
          ref={badgeRef}
          id="hero-badge"
          className={`hero__badge ${
            visibleElements.has("hero-badge") ? "fade-in" : ""
          }`}
        >
          <Lightbulb size={20} />
          <span>Powered by Smart Technology</span>
        </div>

        <h1
          ref={titleRef}
          id="hero-title"
          className={`hero__title ${
            visibleElements.has("hero-title") ? "fade-in" : ""
          }`}
        >
          <span className="hero__title-text">
            {heroSlides[currentSlide].title}
          </span>
        </h1>
        <h2
          ref={subtitleRef}
          id="hero-subtitle"
          className={`hero__subtitle ${
            visibleElements.has("hero-subtitle") ? "fade-in" : ""
          }`}
        >
          {heroSlides[currentSlide].subtitle}
        </h2>
        <p
          ref={descriptionRef}
          id="hero-description"
          className={`hero__description ${
            visibleElements.has("hero-description") ? "fade-in" : ""
          }`}
        >
          {heroSlides[currentSlide].description}
        </p>

        <div
          ref={buttonsRef}
          id="hero-buttons"
          className={`hero__buttons ${
            visibleElements.has("hero-buttons") ? "fade-in" : ""
          }`}
        >
          <button
            className="hero__button hero__button--primary"
            onClick={handleGetStarted}
          >
            Get Started <span>&gt;</span>
          </button>
          <button className="hero__button hero__button--secondary">
            Learn More
          </button>
        </div>
      </div>

      <div className="hero__pagination">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            className={`hero__pagination-dot ${
              index === currentSlide ? "active" : ""
            }`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export default Hero;
