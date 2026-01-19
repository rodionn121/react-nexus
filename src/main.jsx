import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Home from './pages/home/home.jsx'
import Registro from './pages/cadastro/registro.jsx'
import LoginTw from './pages/loginTw/loginTw.jsx'
import Teste from './pages/cadastro/teste.jsx'
import App from './App.jsx'
import Search from './pages/tabela/search.jsx'





createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
