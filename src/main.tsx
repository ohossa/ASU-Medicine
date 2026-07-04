import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ClerkProvider } from '@clerk/clerk-react';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import './styles/index.css';
import App from './app/App.tsx';
import { LanguageProvider } from './app/context/LanguageContext';
import { ThemeProvider } from './app/context/ThemeContext';
import { ErrorBoundary } from './app/components/ErrorBoundary';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  console.warn("Missing Publishable Key. Clerk Auth is disabled or will error.");
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <ClerkProvider publishableKey={PUBLISHABLE_KEY || "pk_test_placeholder"}>
        <ThemeProvider>
          <LanguageProvider>
            <App />
            <Analytics />
            <SpeedInsights />
          </LanguageProvider>
        </ThemeProvider>
      </ClerkProvider>
    </ErrorBoundary>
  </StrictMode>,
);

// Register Service Worker for offline support in production
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
        // Proactively check for service worker updates on page load
        registration.update().catch(err => console.warn('Failed to check for sw update:', err));
      })
      .catch((err) => {
        console.error('ServiceWorker registration failed: ', err);
      });
  });
}


