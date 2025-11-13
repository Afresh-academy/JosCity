import React from 'react'
import ReactDOM from 'react-dom/client'
import NavBar from './pages/NavBar'
import './main.css'

const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <NavBar />
    </React.StrictMode>
  );
} else {
  console.error("Root element not found");
}
