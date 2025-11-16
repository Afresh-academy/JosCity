import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from "./pages/NavBar";
import Services from "./pages/Services";
import Events from "./pages/Events";
import Contact from "./pages/Contact";
import Footer from "./pages/Footer";
import "./main.scss";
import Hero from "./pages/Hero";
import Pricing from "./pages/Pricing";
import Testimonials from "./pages/Testimonials";
import Register from "./pages/Register";
import BusinessForm from "./pages/BusinessForm";
import WelcomePage from "./pages/welcomepage";

// Landing page component (without WelcomePage or Register)
export function LandingPage() {
  return (
    <>
      <NavBar />
      <Hero />
      <Services />
      <Events />
      <Pricing />
      <Testimonials />
      <Contact />
      <Footer />
    </>
  );
}

const rootElement = document.getElementById("root");
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/welcome" element={<WelcomePage />} />
          <Route path="/registernow" element={<Register />} />
          <Route path="/business-form" element={<BusinessForm />} />
        </Routes>
      </BrowserRouter>
    </React.StrictMode>
  );
} else {
  console.error("Root element not found");
}
