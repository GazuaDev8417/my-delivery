import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { GlobalState } from './global/Context.tsx'
import { AuthProvider } from './global/AuthContext.tsx'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GlobalState>
      <AuthProvider>
        <App />
      </AuthProvider>
    </GlobalState>
  </StrictMode>,
)
