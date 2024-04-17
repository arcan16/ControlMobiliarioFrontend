import { NavLink } from "react-router-dom";
import OptionCard from "../components/cards/OptionCard";

import clientsImg from "../assets/icons/clients.svg";
import presentationImg from "../assets/icons/presentation.svg";
import mobImg from "../assets/icons/mobiliario.svg";
import types from "../assets/icons/types.svg";

function Catalogo() {
  return (
    <section className="configuration-container">
      <h2>Catalogo</h2>
      <div className="cards-container">
        <NavLink to="/clientes">
          <OptionCard>
            <img src={clientsImg} alt="" className="icon-img" />
            <h1>Clientes</h1>
          </OptionCard>
        </NavLink>
        <NavLink to="/tiposmobiliario">
          <OptionCard>
            <img src={types} alt="" className="icon-img" />
            <h1>Tipos Mobiliario</h1>
          </OptionCard>
        </NavLink>
        <NavLink to="/mobiliario">
          <OptionCard>
            <img src={mobImg} alt="" className="icon-img" />
            <h1>Mobiliario</h1>
          </OptionCard>
        </NavLink>
        <NavLink to="/presentaciones">
          <OptionCard>
            <img src={presentationImg} alt="" className="icon-img" />
            <h1>Presentaciones</h1>
          </OptionCard>
        </NavLink>
      </div>
    </section>
  );
}

export default Catalogo;
