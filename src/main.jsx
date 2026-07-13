import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import axios from 'axios' // <--- زدت هاد السطر باش نعيطو لـ axios
import './index.css'
import App from './App.jsx'

// <--- زدت هاد السطر باش ياخد الرابط ديال الباكاند من DigitalOcean
axios.defaults.baseURL = import.meta.env.VITE_API_URL; 

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)