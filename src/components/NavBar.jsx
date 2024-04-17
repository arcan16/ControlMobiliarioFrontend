import { useEffect, useState } from "react";
import { BurguerButton } from "./BurguerButton";
import mylogo from "../assets/login/logo2.png";
import { NavLink } from "react-router-dom";
// import { handleLogout } from "./Perfil";
import Cookies from "js-cookie";
import { useLocation } from "react-router-dom";
import { helpHttp } from "../helpers/helpHttp";
import { helpHost } from "../helpers/helpHost";

export function NavBar() {
  const [clicked, setClicked] = useState(false);

  const handleClick = () => {
    if (window.screen.width < 768) {
      setClicked(!clicked);
      //   console.log(clicked);
      //   console.log(window.screen.width);
    }
  };

  function closeSession() {
    let respuesta = confirm("Deseas Cerrar la sesion?");
    if (respuesta) {
      localStorage.removeItem("username");
      localStorage.removeItem("token");
      localStorage.removeItem("rol");
      Cookies.remove("credentials");
      handleClick();
      location.reload();
    }
  }
  const location = useLocation();

  useEffect(() => {
    // console.log("Se ha cambiad de locacion");
    if (!Cookies.get("credentials")) {
      localStorage.removeItem("username");
      localStorage.removeItem("token");
      location.href = "/login";
    }
  }, [location]);

  return (
    <>
      <nav className="nav-container">
        <NavLink to="/" className="logo-container" style={{ color: "black" }}>
          <img src={mylogo} className="logo-principal"></img>
          <h2 className="logo-titulo">Control de Mobiliario</h2>
        </NavLink>
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
            to="/cobros"
            className={({ isActive }) => (isActive ? "active-link" : null)}
          >
            Cobros
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
            onClick={closeSession}
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
