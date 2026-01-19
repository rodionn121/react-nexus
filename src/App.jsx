import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Teste from './pages/cadastro/teste.jsx';
import LoginTw from './pages/loginTw/loginTw.jsx';
import Search from './pages/tabela/search.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginTw />} />
        <Route path="/home" element={<Search />} />
        <Route path="/cadastro" element={<Teste />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
