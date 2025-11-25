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
import BusinessForm from "./pages/BusinessForm";
import WelcomePage from "./pages/welcomepage";
import Success from "./pages/Success";
import ComingSoon from "./pages/ComingSoon";
import NewsFeed from "./pages/NewsFeed";
import Admin from "./pages/Admin";
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
          <Route path="/business-form" element={<BusinessForm />} />
          <Route path="/success" element={<Success />} />
          <Route path="/newsfeed" element={<NewsFeed />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </BrowserRouter>
    </React.StrictMode>
  );
} else {
  console.error("Root element not found");
}
