import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { APIProvider } from '@vis.gl/react-google-maps'
import { env } from './config/env.ts'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { RouterProvider } from 'react-router-dom'
import { router } from './app/router.tsx'

const queryClient = new QueryClient();


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <APIProvider apiKey={env.googleMapsApiKey}>
        <RouterProvider router={router} />
      </APIProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>,
)
