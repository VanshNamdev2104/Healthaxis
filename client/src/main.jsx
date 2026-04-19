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
    // handleGetCurrentUser().catch(() => {
    //   // If error (e.g., 401 Unauthorized), the user is just not logged in.
    //   // The hook already handles setting error/loading state, so we just catch to avoid unhandled promise rejections.
    // });
  }, []); // Run only once on mount

  return children;
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
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
  </StrictMode>,
)
