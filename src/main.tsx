import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Register Service Worker (only in production)
// Note: Service Worker chỉ hoạt động tốt trong production build
if ('serviceWorker' in navigator) {
  // Check production mode
  const isDev = typeof window !== 'undefined' && window.location.hostname === 'localhost';
  
  if (!isDev) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registered:', registration);
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
        });
    });
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

