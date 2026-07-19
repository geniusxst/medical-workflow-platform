import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import { ToastProvider } from '@/hooks/useToast'
import { ThemeProvider } from '@/hooks/useTheme'
import './styles/theme.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <ToastProvider>
          <App />
        </ToastProvider>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
)
