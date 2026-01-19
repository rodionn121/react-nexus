import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Teste from './pages/cadastro/teste.jsx';
import LoginTw from './pages/loginTw/loginTw.jsx';
import Search from './pages/tabela/search.jsx';
import { PrivateRoute } from './context/Provider.jsx';



function App() {
  return (
      <Routes>
        <Route path="/" element={<LoginTw/>} />
        <Route path="/home" element={<PrivateRoute><Search /></PrivateRoute>} />
        <Route path="/cadastro" element={<PrivateRoute><Teste/></PrivateRoute>} />
      </Routes>
  );
}

export default App;
