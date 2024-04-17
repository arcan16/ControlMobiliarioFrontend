// eslint-disable-next-line react-refresh/only-export-components
// export function handleLogout(setIsAuth) {
//   localStorage.removeItem("username");
//   localStorage.removeItem("token");
//   setIsAuth(false);
// }

import { useState } from "react";
import { useEffect } from "react";
import { helpHost } from "../../helpers/helpHost";
import { helpHttp } from "../../helpers/helpHttp";
import Cookies from "js-cookie";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setActualUser } from "../../actions/actualUserActions";

// eslint-disable-next-line react/prop-types
function PerfilCard({ setIsAuth }) {
  
  const [dataUser, setDataUser] = useState(null);
  const state = useSelector((state)=>state.actualUser);
  const dispatch = useDispatch();
  // console.log(state)
  let host = helpHost().getIp();
  let api = helpHttp();

  async function getDataUser() {
    let url = `http://${host}:8080/users/actual`;
    let options = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
        "Content-Type": "applicationi/json",
      },
    };

    try {
      const dataUser = await api.get(url, options);
      setDataUser(dataUser);
      dispatch(setActualUser(dataUser));
      // console.log(dataUser);
    } catch (err) {
      console.log(err);
      alert(err.statusText);
    }
  }
  useEffect(() => {
    if(state.length==0)getDataUser();
    setDataUser(state);
    // console.log(state)
  }, []);

  function closeSession() {
    alert("Cerrando sesion");
    localStorage.removeItem("username");
    localStorage.removeItem("token");
    Cookies.remove("credentials");
    location.href = "/";
  }

  return (
    <article className="perfil-card">
      <div className="user-info">
        <p style={{textAlign:"center"}}><b>Perfil de usuario</b></p>
        <p className="perfil-username">
          <b>Username:</b> {state && state.username}
        </p>
        <p className="perfil-rol">
          <b>Rol:</b> {state.rol && state.rol.rol}
        </p>
        <p className="perfil-email">
          <b>Email:</b> {state && state.email}
        </p>
        <NavLink to="/perfil2">
          <input type="button" value="Modificar" className="btn" />
        </NavLink>
        <button className="perfil-logout btn" onClick={closeSession}>
          Cerrar Sesion
        </button>
      </div>
    </article>
  );
}

export default PerfilCard;
