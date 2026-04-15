import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './app/index.css'
import App from './app/App.jsx'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Approuter from './app/routes/Approuter.jsx'
import { Provider } from "react-redux";
import { store } from './app/store/app.store.js'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <Approuter />

      <ToastContainer
        position="top-right"
        autoClose={3000}
        theme="dark"
        newestOnTop />
    </Provider>
  </StrictMode>,
)
