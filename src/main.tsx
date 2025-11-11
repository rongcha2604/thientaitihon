import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '../App';
import { AuthProvider } from './contexts/AuthContext';
import './index.css';

// Register Service Worker for PWA with Auto Update
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js', { updateViaCache: 'none' }) // Không cache service worker file
      .then((registration) => {
        console.log('[Service Worker] Registered:', registration);
        
        // Check for updates mỗi khi page load
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // Có version mới, thông báo user hoặc tự động reload
                console.log('[Service Worker] New version available, reloading...');
                // Tự động reload sau 1 giây
                setTimeout(() => {
                  window.location.reload();
                }, 1000);
              }
            });
          }
        });
        
        // Check for updates mỗi giờ
        setInterval(() => {
          registration.update();
        }, 60 * 60 * 1000); // 1 giờ
      })
      .catch((error) => {
        console.log('[Service Worker] Registration failed:', error);
      });
    
    // Listen for controller change (khi service worker mới activate)
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      console.log('[Service Worker] Controller changed, reloading...');
      window.location.reload();
    });
  });
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);

