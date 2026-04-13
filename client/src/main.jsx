import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Approuter from './routes/Approuter.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Approuter />
    <ToastContainer
      position="top-right"
      autoClose={3000}
      theme="dark"
      newestOnTop />
  </StrictMode>,
)
