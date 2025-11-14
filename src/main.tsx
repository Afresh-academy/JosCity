import React from 'react'
import ReactDOM from 'react-dom/client'
import NavBar from './pages/NavBar'
import Hero from './pages/Hero'
import Services from './pages/Services'
import './main.scss'  // or use main.css if you prefer

const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <NavBar />
      <Hero />
      <Services />
    </React.StrictMode>
  );
} else {
  console.error("Root element not found");
}
