import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import '@fontsource/cormorant-garamond/latin-300.css'
import '@fontsource/cormorant-garamond/latin-300-italic.css'
import './styles/index.css'
import './styles/themes.css'
import './styles/cinematic.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode><App /></React.StrictMode>,
)
