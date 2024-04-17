import { NavLink } from "react-router-dom";
import returnImg from "../../assets/icons/return.svg";
import CatalogoClientes from "./CatalogoClientes";

function Clientes() {
  return (
    // <section className="mobiliario-container">
    <section className="section-container">
      <div className="nav-return-container">
        <NavLink to="/catalogo">
          <img src={returnImg} className="icon-img" alt="" />
        </NavLink>
        <h1>Catalogo de Clientes</h1>
      </div>
      <CatalogoClientes />
    </section>
  );
}

export default Clientes;
