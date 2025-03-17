import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// import App from './App.jsx'
import LofiPlayer from './components/LofiPlayer.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <App /> */
    <LofiPlayer />}
  </StrictMode>,
)
