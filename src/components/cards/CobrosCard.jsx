import { NavLink } from "react-router-dom";

function CobrosCard() {
  return (
    <NavLink to="/cobros" className="data-card cardx2 mid-height cobros">
      <h3 style={{color:"black"}}>Cobros</h3>
    </NavLink>
  );
}

export default CobrosCard;
