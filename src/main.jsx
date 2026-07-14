import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import axios from 'axios' // <--- زدت هاد السطر باش نعيطو لـ axios
import './index.css'
import App from './App.jsx'

// <--- زدت هاد السطر باش ياخد الرابط ديال الباكاند من DigitalOcean
axios.defaults.baseURL = 'https://orca-app-ziqwp.ondigitalocean.app/api';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)