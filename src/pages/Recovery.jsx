import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { helpHost } from "../helpers/helpHost";
import { helpHttp } from "../helpers/helpHttp";

function Recovery() {
  const locacion = useLocation();
  const [usuario, setUsuario] = useState(null);
  const [auth, setAuth] = useState(null);
  const [newPasswordInput, setNewPasswordInput] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(locacion.search);
    const auth = params.get("param");
    const user = params.get("param2");
    if (user != null) setUsuario(user);
    if (auth != null) setAuth(auth);
  }, []);

  function handleConfirmPassword() {
    const $newPass = document.getElementById("newPassword");
    const $confPass = document.getElementById("confirmPassword");
    if ($newPass.value != $confPass.value) {
      alert("Las contraseñas no coinciden, favor de verificar");
      $newPass.select();
    }
  }

  function validaData() {
    const $newPass = document.getElementById("newPassword");
    const $confPass = document.getElementById("confirmPassword");
    console.log($newPass.value);
    if ($newPass.value.trim() == "" || $confPass.value.trim()=="")
      return alert("Debes ingresar caracteres en la contraseña");
    sendData();
  }

  function sendData() {
    let api = helpHttp();
    let host = helpHost().getIp();
    let urlRecover = `http://${host}:8080/recover/recovery`;
    let options = {
      headers: {
        "Content-Type": "application/json",
      },
      body:{
        username: usuario,
        newPassword: newPasswordInput,
        authorization: auth
      }
    };
    console.log(options)
    api
      .post2(urlRecover, options)
      .then((res) => {
        console.log(res);
        location.href="/login";
      })
      .catch((err) => console.log(err));
  }

  // Actualiza el estado en el que se almacena el passsword
  function updateNewPassword(e){
    setNewPasswordInput(e.target.value);
  }
  return (
    <>
      <div className="box-login">
        <div className="login-container recovery">
          <h1>Recuperacion de password</h1>
          <h3>Usuario: {usuario}</h3>
          <input
            type="password"
            name="newPassword"
            id="newPassword"
            className="recovery-data"
            placeholder="Contraseña nueva"
            value={newPasswordInput}
            onChange={updateNewPassword}
          />
          <input
            type="password"
            name="confirmPassword"
            id="confirmPassword"
            className="recovery-data"
            placeholder="Confirma contraseña"
            onBlur={handleConfirmPassword}
          />

          <div className="btn-container">
            <input
              type="button"
              value="Guardar"
              className="btn btn-green"
              onClick={validaData}
            />
            <input type="button" value="Cancelar" className="btn btn-red" />
          </div>
        </div>
      </div>
    </>
  );
}

export default Recovery;
