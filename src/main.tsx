import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { GlobalState } from './global/Context.tsx'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GlobalState>
      <App />
    </GlobalState>
  </StrictMode>,
)
