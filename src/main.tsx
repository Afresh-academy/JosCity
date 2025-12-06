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
import Guidelines from "./pages/Guidlines";
import Register from "./pages/Register";
import SignIn from "./pages/SignIn";
import WelcomePage from "./pages/welcomepage";
import Success from "./pages/Success";
import ComingSoon from "./pages/ComingSoon";
import NewsFeed from "./pages/NewsFeed";
import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import CookiePolicy from "./pages/CookiePolicy";
import Accessibility from "./pages/Accessibility";
import People from "./components/People";
import Forums from "./pages/Forums";

import Request from "./components/Request";
import SentRequest from "./components/SentRequest";
// Landing page component (without WelcomePage or Register)
export function LandingPage() {
  return (
    <>
      <NavBar />
      <Hero />
      <Services />
      <Events />
      <Pricing />
      <Guidelines />
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
          <Route path="/signin" element={<SignIn />} />
          <Route path="/coming-soon" element={<ComingSoon />} />
          <Route path="/success" element={<Success />} />
          <Route path="/newsfeed" element={<NewsFeed />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/cookie-policy" element={<CookiePolicy />} />
          <Route path="/accessibility" element={<Accessibility />} />
          <Route path="/people" element={<People />} />
          <Route path="/forums" element={<Forums />} />
          <Route path="/request" element={<Request />} />
          <Route path="/sent-requests" element={<SentRequest />} />
        </Routes>
      </BrowserRouter>
    </React.StrictMode>
  );
} else {
  console.error("Root element not found");
}
