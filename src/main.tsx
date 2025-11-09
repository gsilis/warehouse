import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BoxProvider } from './contexts/box-context.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BoxProvider>
      <App />
    </BoxProvider>
  </StrictMode>,
)
