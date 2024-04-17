import OptionCard from "../components/cards/OptionCard";
import PerfilCard from "../components/configuracionCards/PerfilCard";

import { NavLink } from "react-router-dom";
import userImg from "../assets/icons/users.svg";
import { useEffect, useState } from "react";

function Configuracion() {
  const [rol, setRol] = useState(null);
  useEffect(() => {
    if (localStorage.getItem("rol") == "ADMIN") {
      setRol(localStorage.getItem("rol"));
    }
  }, []);

  return (
    <section className="configuration-container">
      <h2>Configuracion</h2>
      <div className="cards-container">
        <PerfilCard />
        {rol != null && (
          <>
            <NavLink to="/usuarios">
              <OptionCard>
                <img src={userImg} alt="" className="icon-img" />
                <h1>Usuarios</h1>
              </OptionCard>
            </NavLink>
            <NavLink to="/empleados">
              <OptionCard>
                <img src={userImg} alt="" className="icon-img" />
                <h1>Empleados</h1>
              </OptionCard>
            </NavLink>
          </>
        )}
      </div>
    </section>
  );
}

export default Configuracion;
