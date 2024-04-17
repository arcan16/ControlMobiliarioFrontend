import { NavLink } from "react-router-dom";
import returnImg from "../../assets/icons/return.svg";
import CatalogoUsuarios from "./CatalogoClientes";

function Usuarios() {
  return (
    <section className="section-container">
      <div className="nav-return-container">
        <NavLink to="/configuracion">
          <img src={returnImg} className="icon-img" alt="" />
        </NavLink>
        <h1>Usuarios</h1>
      </div>
      <CatalogoUsuarios/>
    </section>
  );
}

export default Usuarios;
