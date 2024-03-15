import { useState } from "react";
import { BurguerButton } from "./BurguerButton";
import mylogo from "../assets/login/logo2.png";
import { NavLink } from "react-router-dom";
import { handleLogout } from "./Perfil";

export function NavBar() {
  const [clicked, setClicked] = useState(false);

  const handleClick = () => {
    if (window.screen.width < 768) {
      setClicked(!clicked);
    //   console.log(clicked);
    //   console.log(window.screen.width);
    }
  };
  return (
    <>
      <nav className="nav-container">
        <div className="logo-container">
          <img src={mylogo} className="logo-principal"></img>
          <h2 className="logo-titulo">Control de Mobiliario</h2>
        </div>
        <div className={`links ${clicked ? "active" : ""}`}>
          <NavLink
            onClick={handleClick}
            to="/"
            className={({ isActive }) => (isActive ? "active-link" : null)}
          >
            Dashboard
          </NavLink>
          <NavLink
            onClick={handleClick}
            to="/reservaciones"
            className={({ isActive }) => (isActive ? "active-link" : null)}
          >
            Reservaciones
          </NavLink>
          <NavLink
            onClick={handleClick}
            to="/catalogo"
            className={({ isActive }) => (isActive ? "active-link" : null)}
          >
            Catalogo
          </NavLink>
          <NavLink
            onClick={handleClick}
            to="/configuracion"
            className={({ isActive }) => (isActive ? "active-link" : null)}
          >
            Configuracion
          </NavLink>
          <NavLink
            onClick={handleLogout}
            to="/"
            className={({ isActive }) => (isActive ? "active-link" : null)}
          >
            Logout
          </NavLink>
        </div>
        <div className="burguer">
          <BurguerButton clicked={clicked} handleClick={handleClick} />
        </div>
        <div className={`bg-div initial ${clicked ? "active" : ""}`}></div>
      </nav>
    </>
  );
}
