import './header.css';
import Nexus from '../../assets/nexus.png';
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from '../../context/AuthContext';


export function Header() {
  const { token, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  if (!token) return null; // 🔥 AQUI ESTÁ A CHAVE

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <header className="header items-center">
      <img src={Nexus} alt="Nexus Logo" />

      <nav>
        <Link to="/home" className="menu-item-link">Home</Link>
        <Link to="/cadastro" className="menu-item-link">Cadastrar</Link>

        <button
          onClick={handleLogout}
          className="bg-red-600 text-xs font-black uppercase px-5 py-2 mx-4 rounded-lg cursor-pointer hover:bg-red-700"
        >
          Sair
        </button>
      </nav>
    </header>
  );
}
