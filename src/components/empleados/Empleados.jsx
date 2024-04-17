import { NavLink } from "react-router-dom";
import returnImg from "../../assets/icons/return.svg";
import CatalogoEmpleados from "./CatalogoEmpleados";

function Empleados() {
  return (
    <section className="mobiliario-container">
      <div className="nav-return-container">
        <NavLink to="/configuracion">
          <img src={returnImg} className="icon-img" alt="" />
        </NavLink>
        <h1>Empleados</h1>
      </div>
      <CatalogoEmpleados/>
    </section>
  );
}

export default Empleados;
