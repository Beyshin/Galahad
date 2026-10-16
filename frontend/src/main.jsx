import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {CsrfProvider} from "./contexts/CsrfContext.jsx";

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <CsrfProvider>
        <App />
      </CsrfProvider>
  </StrictMode>,
)
