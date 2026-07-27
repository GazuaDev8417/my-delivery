// src/App.tsx
import type { FC } from "react"
import { BrowserRouter } from "react-router-dom"
import { GlobalStyle } from "./styles/GlobalStyle"
import Router from "./routes/Router"

const App: FC = () => {
  return (
    <BrowserRouter>
        <GlobalStyle />
        <Router />
    </BrowserRouter>
  )
}

export default App