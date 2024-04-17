import { NavLink } from "react-router-dom";
import returnImg from "../../assets/icons/return.svg";
import CatalogoCobros from "./CatalogoCobros";
function CobrosCatalogo() {
  return (
    <section className="section-container">
      <div className="nav-return-container">
        <NavLink to="/">
          <img src={returnImg} className="icon-img" alt="" />
        </NavLink>
        <h2>Cobros</h2>

        <NavLink
          to="/addcobro"
          className="btn"
          style={{
            textAlign: "center",
            marginRight: "0",
            marginLeft:"auto",
            height: "fit-content"            
          }}
        >
          ➕ Agregar
        </NavLink>
      </div>
      <CatalogoCobros />
    </section>
  );
}

export default CobrosCatalogo;
