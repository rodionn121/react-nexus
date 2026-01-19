import './header.css';
import Nexus from '../../assets/nexus.png';
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="header">
      <img src={Nexus} alt="Nexus Logo" />

      <nav>
        <Link to="/home" className="menu-item-link">Home</Link>
        <Link to="/cadastro" className="menu-item-link">Cadastrar</Link>
      </nav>
    </header>
  );
}
