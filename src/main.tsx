import React from "react";
import ReactDOM from "react-dom/client";
import NavBar from "./pages/NavBar";
import Services from "./pages/Services";
import Events from "./pages/Events";
import Contact from "./pages/Contact";
import Footer from "./pages/Footer";
import "./main.scss";
import Hero from "./pages/Hero";
import Pricing from "./pages/Pricing";
import Testimonials from "./pages/Testimonials";

const rootElement = document.getElementById("root");
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <NavBar />
      <Hero />
      <Services />
      <Events />
      <Pricing />
      <Testimonials />
      <Contact />
      <Footer />
    </React.StrictMode>
  );
} else {
  console.error("Root element not found");
}
