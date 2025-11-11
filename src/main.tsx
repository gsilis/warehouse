import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BoxProvider } from './contexts/box-context.tsx'
import { WorldSettingsProvider } from './contexts/world-settings-context.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <WorldSettingsProvider>
      <BoxProvider>
        <App />
      </BoxProvider>
    </WorldSettingsProvider>
  </StrictMode>,
)
