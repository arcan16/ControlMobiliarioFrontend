import { useEffect, useState } from "react";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import { NavBar } from "./components/NavBar";
import Reservaciones from "./pages/Reservaciones";
import Catalogo from "./pages/Catalogo";
import Configuracion from "./pages/Configuracion";
import AddReservaciones from "./pages/reservaciones/AddReservaciones";

function App(){
  const [isAuth, setIsAuth] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [token, setToken] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [userName, setUserName] = useState(null);

  useEffect(() => {
    if(localStorage.getItem("token") && localStorage.getItem("username")){
      setIsAuth(true);
      setUserName(localStorage.getItem("username"));
      setToken(localStorage.getItem("token"));
    }
    const handleUnload=()=>{
      localStorage.removeItem('username');
      localStorage.removeItem('token');
    }
    window.addEventListener('unload',handleUnload);
    return () => {
      window.removeEventListener('unload',handleUnload);
    }
  }, [])

  return (
    <>
      <BrowserRouter>
        {!isAuth ? (
          <Login
            setIsAuth={setIsAuth}
            setToken={setToken}
            setUserName={setUserName}
          />
        ) : (
          <>
            <NavBar isAuth={isAuth}/>
            <Routes>
              <Route path="" element={<Dashboard setIsAuth={setIsAuth}/>} />
              <Route path="/reservaciones" element={<Reservaciones/>} />
              <Route path="/reservaciones/add" element={<AddReservaciones/>} />
              <Route path="/catalogo" element={<Catalogo/>} />
              <Route path="/configuracion" element={<Configuracion/>} />
              <Route path="/login" element={Login} />
            </Routes>
          </>
        )}
      </BrowserRouter>
    </>
  );
}

export default App;
