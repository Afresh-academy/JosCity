import React from 'react'
import ReactDOM from 'react-dom/client'
import NavBar from './pages/NavBar'
import Services from './pages/Services'
import './main.css'
import Hero from './pages/Hero'

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
