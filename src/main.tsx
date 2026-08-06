import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './app/App.tsx'
import { APIProvider } from '@vis.gl/react-google-maps'
import { env } from './config/env.ts'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <APIProvider apiKey={env.googleMapsApiKey}>
      <App />
    </APIProvider>
  </StrictMode>,
)
