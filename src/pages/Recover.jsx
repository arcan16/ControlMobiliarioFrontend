import { useState } from "react"
import { helpHost } from "../helpers/helpHost";
import { helpHttp } from "../helpers/helpHttp";


function Recover({closeModal}) {
  const [dataToRecover, setDataToRecover] = useState("");
  let api = helpHttp();
  let host = helpHost().getIp();
  
  // Obtiene la informacion del servidor
  async function sendRecovery() {
    let urlRecover = `http://${host}:8080/recover/${dataToRecover}`;
    let options = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    api.get(urlRecover, options).then(() => {
      setTimeout(() => {
        closeModal();
      }, 10000);
    }).catch(err=>closeModal());
  }

  // Realiza la solicitud de cambio de contraseña al servidor
  function recuperarCuenta() {
    if(dataToRecover!=null || dataToRecover!=""){
      console.log(dataToRecover)
      const $modalContent = document.querySelector(".modal-section");
      
      $modalContent.removeChild($modalContent.children[3]);
      $modalContent.removeChild($modalContent.children[2]);
      $modalContent.removeChild($modalContent.children[1]);
  
      let recoveryAdvise = document.createElement("p");
      recoveryAdvise.classList.add("text-advise");
      recoveryAdvise.textContent="En caso de que los datos proporcionados sean validos, sera enviado un enlace para la recuperacion de correo al email registrado. Revisar en su bandeja de entrada y en caso de no encontrarse revisar en su carpeta de spam. Este proceso no deberia tomar mas de 5 minutos";
      $modalContent.appendChild(recoveryAdvise);
      sendRecovery();
    }
  }

  // Actualiza el estado con la informacion que se utilizara para realizar la peticion de recuperacion de contraseña
  function updateDataToRecover(e) {
    setDataToRecover(e.target.value);
  }
  return (
    <>
      <section className="modal-section">
        <h2 style={{margin:"2rem 0 0 0"}}>Recuperar Cuenta</h2>
        <p style={{ fontSize:"1rem"}}>
          Ingresa el <b>correo electronico</b> o <b>usuario</b> para recuperar
          tu cuenta
        </p>
        <input
          type="text"
          name="recuperacion"
          id="recuperacion"
          value={dataToRecover}
          onChange={updateDataToRecover}
          autoFocus
        />
        <input
          type="button"
          value="Recuperar cuenta"
          onClick={recuperarCuenta}
        />
      </section>
    </>
  );
}

export default Recover;
