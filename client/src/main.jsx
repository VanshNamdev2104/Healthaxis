/* eslint-disable react-refresh/only-export-components */
import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import './app/index.css'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Approuter from './app/routes/Approuter.jsx'
import { Provider } from "react-redux";
import { store } from './app/store/app.store.js'
import { useAuth } from './features/auth/hooks/useAuth.js'
import { logout } from './features/auth/slice/auth.slice.js'
import { useDispatch } from 'react-redux'

// This component runs once when the app starts.
// It checks with the backend if the user's cookies are still valid.
const InitAuth = ({ children }) => {
  const { handleGetCurrentUser } = useAuth();
  const dispatch = useDispatch();

  useEffect(() => {
    // ✅ URL se token lo agar Google OAuth se aaya hai
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get("accessToken");
    const refreshToken = params.get("refreshToken");

    if (accessToken) {
      // URL clean karo
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    handleGetCurrentUser().catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return children;
}// Run only once on mount — handleGetCurrentUser is not memoized, so it must be excluded



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
