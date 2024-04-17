import { NavLink } from "react-router-dom";
import returnImg from "../../assets/icons/return.svg";
import CatalogoPresentacion from "./CatalogoPresentacion";

function Presentaciones() {
  return (
    // <section className="mobiliario-container">
    <section className="section-container">
      <div className="nav-return-container">
        <NavLink to="/catalogo">
          <img src={returnImg} className="icon-img" alt="" />
        </NavLink>
        <h1>Presentaciones</h1>
      </div>
      <CatalogoPresentacion/>
    </section>
  );
}

export default Presentaciones;
