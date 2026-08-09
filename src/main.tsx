import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom' // <-- 1. Import BrowserRouter
import './index.css'
import App from './app/App.tsx'
import { APIProvider } from '@vis.gl/react-google-maps'
import { env } from './config/env.ts'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter> {/* <-- 2. Bọc ở đây */}
      <APIProvider apiKey={env.googleMapsApiKey}>
        <App />
      </APIProvider>
    </BrowserRouter>
  </StrictMode>,
)