import { useEffect, useState } from "react";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import { NavBar } from "./components/NavBar";
import Reservaciones from "./pages/Reservaciones";
import Catalogo from "./pages/Catalogo";
import Configuracion from "./pages/Configuracion";
import AddReservaciones from "./components/reservaciones/AddReservaciones";
import Cookies from "js-cookie";
import Usuarios from "./components/usuarios/Usuarios";
import Empleados from "./components/empleados/Empleados";
import EditarPerfil from "./components/perfil/EditarPerfil";
import { Error404 } from "./pages/Error404";
import Clientes from "./components/clientes/Clientes";
import Mobiliario from "./components/mobiliario/Mobiliario";
import Presentaciones from "./components/presentaciones/Presentaciones";
import TiposMobiliario from "./components/tipoMobiliario/TiposMobiliario";
import CobrosCatalogo from "./components/cobros/Cobros";
import AddCobro from "./components/cobros/AddCobro";
import Recovery from "./pages/Recovery";
import Recover from "./pages/Recover";

function App() {
  // const [isAuth, setIsAuth] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [token, setToken] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [userName, setUserName] = useState(null);
  const [isRecovery, setIsRecovery] = useState(false);

  function checkIsRecovery() {
    let regExp = new RegExp("recovery", "gi");
    if (regExp.test(window.location.pathname)) {
      console.log("Sip, recuperando");
      console.log(window.location.pathname);
      setIsRecovery(true);
    } else {
      setIsRecovery(false);
    }
  }
  useEffect(() => {
    checkIsRecovery();
    if (localStorage.getItem("token") && localStorage.getItem("username")) {
      setUserName(localStorage.getItem("username"));
      setToken(localStorage.getItem("token"));
    }
    const handleUnload = () => {
      if (!Cookies.get("credentials")) {
        localStorage.removeItem("username");
        localStorage.removeItem("token");
        localStorage.removeItem("rol");
      }
    };
    window.addEventListener("unload", handleUnload);
    return () => {
      window.removeEventListener("unload", handleUnload);
    };
  }, []);

  return (
    <BrowserRouter>
      {isRecovery ? (
        <Recovery />
      ) : !Cookies.get("credentials") ? (
        <Login setToken={setToken} setUserName={setUserName} />
      ) : (
        <>
          <NavBar />
          <Routes>
            <Route path="" element={<Dashboard />} />
            <Route path="/cobros" element={<CobrosCatalogo />} />
            <Route path="/addcobro" element={<AddCobro />} />
            <Route path="/reservaciones" element={<Reservaciones />} />
            <Route path="/reservaciones/add" element={<AddReservaciones />} />
            <Route path="/catalogo" element={<Catalogo />} />
            <Route path="/clientes" element={<Clientes />} />
            <Route path="/tiposmobiliario" element={<TiposMobiliario />} />
            <Route path="/mobiliario" element={<Mobiliario />} />
            <Route path="/presentaciones" element={<Presentaciones />} />
            <Route path="/configuracion" element={<Configuracion />} />
            <Route path="/usuarios" element={<Usuarios />} />
            <Route path="/empleados" element={<Empleados />} />
            {/* <Route path="/perfil" element={<EdithPerfil />} /> El codigo fue refactorizado*/}
            <Route path="/perfil2" element={<EditarPerfil />} />
            <Route path="/login" element={Login} />
            <Route path="/recovery" element={<Recovery />} />
            <Route path="*" element={<Error404 />} />
          </Routes>
        </>
      )}
    </BrowserRouter>
  );
}

export default App;
