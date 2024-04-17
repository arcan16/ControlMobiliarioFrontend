import { NavLink } from "react-router-dom";
import returnImg from "../../assets/icons/return.svg";
import CatalogoMobiliario from "./CatalogoMobiliario";

function Mobiliario() {
  
  return (
    <section className="section-container">
      <div className="nav-return-container">
        <NavLink to="/catalogo">
          <img src={returnImg} className="icon-img" alt="" />
        </NavLink>
        <h1>Mobiliario</h1>
      </div>
      <CatalogoMobiliario/>
    </section>
  );
}

export default Mobiliario;
