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


// This component runs once when the app starts.
// It checks with the backend if the user's cookies are still valid.
const InitAuth = ({ children }) => {
  const { handleGetCurrentUser } = useAuth();


  useEffect(() => {
    // ✅ Server sets cookies directly, just fetch current user
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
