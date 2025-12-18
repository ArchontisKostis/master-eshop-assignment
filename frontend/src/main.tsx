import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './api/setup' // Initialize axios configuration
import App from './App.tsx'
import { ThemeProvider } from './theme'
import { AuthProvider } from './contexts/AuthContext'
import { ToastProvider } from './contexts/ToastContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider mode="light">
      <ToastProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  </StrictMode>,
)
