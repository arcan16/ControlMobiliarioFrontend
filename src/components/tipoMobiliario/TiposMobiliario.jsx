import { NavLink } from "react-router-dom";
import returnImg from "../../assets/icons/return.svg";
import CatalogoTiposMobiliario from "./CatalogoTiposMobiliario";


function TiposMobiliario() {
  return (
    // <section className="mobiliario-container">
    <section className="section-container">
      <div className="nav-return-container">
        <NavLink to="/catalogo">
          <img src={returnImg} className="icon-img" alt="" />
        </NavLink>
        <h1>Tipos de Mobiliario</h1>
      </div>
      <CatalogoTiposMobiliario/>
    </section>
  );
}

export default TiposMobiliario;
