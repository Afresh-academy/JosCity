import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Lightbulb, Shield, Zap, User, Info } from "lucide-react";
import "../main.css";
// Import images as modules for Vite build compatibility
import heroImage1 from "../image/hero-image.png";
import heroImage2 from "../image/plateau-legs.png";
import heroImage3 from "../image/terminus.png";
import aboutImage from "../image/3dwOMAN.png";

const heroSlides = [
  {
    id: 1,
    image: heroImage1,
    title: "Welcome to ",
    subtitle: "Jos Smart City, The-Digital Economy",
    description:
      "Access all municipal services, pay bills, and engage with your city - all in one place.",
  },
  {
    id: 2,
    image: heroImage2,
    title: "Anticipate",
    subtitle: "Jos City Carnival!",
    description:
      "Purchase tickets, manage bookings, and connect with your event - all in one convenient location",
  },
  {
    id: 3,
    image: heroImage3,
    title: "Exciting Event Ahead at",
    subtitle: "Jos Central Market!",
    description:
      "Join us for an ourdoor event where you can explore all municipal services, settle your bills, and connect with your communityall in one exciting location!",
  },
];

function Hero() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set([0])); // Preload first image
  const [visibleElements, setVisibleElements] = useState<Set<string>>(
    new Set()
  );
  const badgeRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);

  // Lazy load images - preload current and next slide
  useEffect(() => {
    // Preload current slide image
    const currentImage = new Image();
    currentImage.src = heroSlides[currentSlide].image;

    // Preload next slide image for smooth transition
    const nextIndex = (currentSlide + 1) % heroSlides.length;
    const nextImage = new Image();
    nextImage.src = heroSlides[nextIndex].image;

    // Mark images as loaded when they finish loading
    currentImage.onload = () => {
      setLoadedImages((prev) => new Set(prev).add(currentSlide));
    };

    nextImage.onload = () => {
      setLoadedImages((prev) => new Set(prev).add(nextIndex));
    };
  }, [currentSlide]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, []);

  // Reset fade-in on slide change with different directions
  useEffect(() => {
    // Remove fade-in classes first to trigger animation
    setVisibleElements(new Set());

    // Re-add fade-in classes with delay for staggered effect
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
    navigate("/welcome");
  };

  return (
    <>
      <div id="home" className="hero">
        {heroSlides.map((slide, index) => (
          <div
            key={slide.id}
            className={`hero__slide ${index === currentSlide ? "active" : ""}`}
            style={{
              backgroundImage: loadedImages.has(index)
                ? `url(${slide.image})`
                : "none",
            }}
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
            <span>Powered by Cbrilliance AI tech LTD</span>
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
      <AboutSection />
    </>
  );
}

function AboutSection() {
  const [visibleStats, setVisibleStats] = useState<Set<number>>(new Set());
  const [visibleAbout, setVisibleAbout] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const statsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Animate stats one by one
            [0, 1, 2, 3].forEach((index) => {
              setTimeout(() => {
                setVisibleStats((prev) => new Set(prev).add(index));
              }, index * 150);
            });
          }
        });
      },
      { threshold: 0.2 }
    );

    const aboutObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleAbout(true);
          }
        });
      },
      { threshold: 0.1 }
    );

    const statsElement = statsRef.current;
    const aboutElement = aboutRef.current;

    if (statsElement) {
      statsObserver.observe(statsElement);
    }
    if (aboutElement) {
      aboutObserver.observe(aboutElement);
    }

    return () => {
      if (statsElement) statsObserver.unobserve(statsElement);
      if (aboutElement) aboutObserver.unobserve(aboutElement);
    };
  }, []);

  const stats = [
    { number: "500K+", label: "Registered Citizens" },
    { number: "12+", label: "Digital Services" },
    { number: "24/7", label: "Support Available" },
    { number: "98%", label: "Satisfaction Rate" },
  ];

  const features = [
    {
      icon: Shield,
      title: "Secure & Reliable",
      description: "Bank-level security for all transactions and data",
    },
    {
      icon: Zap,
      title: "Fast & Efficient",
      description: "Quick processing and instant confirmations",
    },
    {
      icon: User,
      title: "User-Friendly",
      description: "Designed with citizens in mind",
    },
  ];

  return (
    <section id="about" className="about-section">
      <div className="about-section__stats" ref={statsRef}>
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`about-section__stat ${
              visibleStats.has(index) ? "fade-in-up" : ""
            }`}
            style={{ transitionDelay: `${index * 0.15}s` }}
          >
            <div className="about-section__stat-number">{stat.number}</div>
            <div className="about-section__stat-label">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="about-section__content" ref={aboutRef}>
        <div className="about-section__text">
          <div
            className={`about-section__tag ${
              visibleAbout ? "fade-in-left" : ""
            }`}
          >
            <Info size={16} />
            <span>About Jos Smart City</span>
          </div>
          <h2
            className={`about-section__heading ${
              visibleAbout ? "fade-in-left" : ""
            }`}
            style={{ transitionDelay: "0.1s" }}
          >
            Building a Smarter, Connected City.
          </h2>
          <div
            className={`about-section__description ${
              visibleAbout ? "fade-in-left" : ""
            }`}
            style={{ transitionDelay: "0.2s" }}
          >
            <p>
              Jos Smart City is a membership-driven digital ecosystem that
              connects residents, businesses, and visitors. Residents enjoy
              discounted services, while vendors benefit from verified customers
              and secure payments.
            </p>
            <p>
              With cutting-edge technology and a user-friendly design, our
              platform makes it easy to pay bills, access services, shop
              locally, and engage with your community.
            </p>
            <p>
              Key features include JosCity Wallet & Points System, Digital
              Membership ID, Vendor Dashboard, and Referral & Rewards Program.
            </p>
            <p>
              We're redefining how urban life works — bringing together your
              city's marketplace, membership, and wallet — all in one place.
            </p>
          </div>
          <div
            className={`about-section__features ${
              visibleAbout ? "fade-in-left" : ""
            }`}
            style={{ transitionDelay: "0.3s" }}
          >
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="about-section__feature">
                  <div className="about-section__feature-icon">
                    <IconComponent size={24} />
                  </div>
                  <div className="about-section__feature-content">
                    <h3 className="about-section__feature-title">
                      {feature.title}
                    </h3>
                    <p className="about-section__feature-description">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div
          className={`about-section__image-wrapper ${
            visibleAbout ? "fade-in-right" : ""
          }`}
          style={{ transitionDelay: "0.4s" }}
        >
          <div className="about-section__image-circle">
            <img
              src={aboutImage}
              alt="3D illustration of a woman with smartphone"
              className="about-section__image"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
