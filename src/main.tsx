import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/dusk/dusk.tokens.css'
import './styles/dusk/dusk.base.css'
import './styles/dusk/dusk.components.css'
import './styles/dusk/dusk.compose.css'
import './styles/dusk/dusk.motion.css'
import './styles/clear-board.tokens.css'    // the bridge
import './styles/clear-board.parts.css'     // the cb- parts
import './index.css'                        // the app sheet: the base rules, and the old rules that still match
import './styles/surfaces/shell.css'        // B1
import './styles/surfaces/home.css'         // B1
import './styles/surfaces/settings.css'     // B1
import './styles/surfaces/reference.css'    // B2
import './styles/surfaces/drill.css'        // B2
import './styles/surfaces/radio.css'        // B3
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
