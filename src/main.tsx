import React from 'react'
import ReactDOM from 'react-dom/client'
import NavBar from './pages/NavBar'
import './main.css'
import Hero from './pages/Hero'

const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <NavBar />
      <Hero />
    </React.StrictMode>
  );
} else {
  console.error("Root element not found");
}
