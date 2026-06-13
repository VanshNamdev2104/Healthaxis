/* eslint-disable react-refresh/only-export-components */
import { StrictMode, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './app/index.css'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Approuter from './app/routes/Approuter.jsx'
import { Provider } from "react-redux";
import { store } from './app/store/app.store.js'
import { useAuth } from './features/auth/hooks/useAuth.js'


import HealthAxisLoader from './components/HealthAxisLoader.jsx'

// This component runs once when the app starts.
// It checks with the backend if the user's cookies are still valid.
const InitAuth = ({ children }) => {
  const { handleGetCurrentUser, handleLogout, isAuthenticated } = useAuth();
  const [showLoader, setShowLoader] = useState(true);

  // Sync settings (theme and accent color) on mount
  useEffect(() => {
    const saved = localStorage.getItem("healthaxis_settings");
    if (saved) {
      try {
        const settings = JSON.parse(saved);
        if (settings.theme === "dark") {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
        if (settings.accentColor) {
          document.documentElement.setAttribute("data-accent-color", settings.accentColor);
        }
      } catch (e) {
        console.error("Failed to parse settings", e);
      }
    }
  }, []);

  useEffect(() => {
    // ✅ Server sets cookies directly, just fetch current user
    handleGetCurrentUser().catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Global inactivity logout listener
  useEffect(() => {
    if (!isAuthenticated) return;

    const saved = localStorage.getItem("healthaxis_settings");
    if (!saved) return;

    let settings;
    try {
      settings = JSON.parse(saved);
    } catch {
      return;
    }

    const timerVal = settings.logoutTimer;
    if (!timerVal || timerVal === "never") return;

    // Convert timer value to milliseconds
    let timeoutMs = 30 * 60 * 1000; // default 30 mins
    if (timerVal === "15m") timeoutMs = 15 * 60 * 1000;
    else if (timerVal === "30m") timeoutMs = 30 * 60 * 1000;
    else if (timerVal === "1h") timeoutMs = 60 * 60 * 1000;

    let timeoutId;

    const performInactivityLogout = () => {
      handleLogout();
      toast.warn("Session expired due to inactivity. Please log in again.");
    };

    const resetTimer = () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(performInactivityLogout, timeoutMs);
    };

    const events = ["mousedown", "mousemove", "keypress", "scroll", "touchstart"];
    events.forEach(event => document.addEventListener(event, resetTimer));

    resetTimer();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      events.forEach(event => document.removeEventListener(event, resetTimer));
    };
  }, [isAuthenticated, handleLogout]);

  if (showLoader) {
    return <HealthAxisLoader onComplete={() => setShowLoader(false)} duration={4800} />;
  }

  return children;
};



createRoot(document.getElementById('root')).render(
 
    <Provider store={store}>
      <InitAuth>
        <Approuter />
      </InitAuth>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        theme="dark"
        newestOnTop />
    </Provider>
 
)
