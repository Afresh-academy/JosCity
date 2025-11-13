import React from 'react'
import ReactDOM from 'react-dom/client'
import Hero from './pages/Hero'
import './main.css'

const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <Hero />
    </React.StrictMode>
  );
} else {
  console.error("Root element not found");
}
