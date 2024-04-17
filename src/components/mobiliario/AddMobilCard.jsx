import { useEffect, useState } from "react";
import { helpHost } from "../../helpers/helpHost";
import { helpHttp } from "../../helpers/helpHttp";

function AddMobilCard({ closeModal, addMobil, setAddMobil }) {
  const [mobiliario, setMobiliario] = useState([]);
  const [lista, setLista] = useState([]);

  let api = helpHttp();
  let host = helpHost().getIp();
  let url = `http://${host}:8080/mobiliario`;

  let options = {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
      "Content-Type": "application/json",
    },
  };

  function limpiarCampos() {
    const $tipo = window.document.getElementById("tipo");
    const $detalle = window.document.getElementById("detalle");
    const $cantidad = window.document.getElementById("cantidad");

    $tipo.value = "0";
    $detalle.value = "";
    $cantidad.value = "";
  }

  async function createMobiliario() {
    const $tipo = window.document.getElementById("tipo");
    const $detalle = window.document.getElementById("detalle");
    const $cantidad = window.document.getElementById("cantidad");

    // Valida contenido  de los inputs
    if ($tipo.value == "0") {
      alert("Debes seleccionar el tipo de mobiliario para continuar");
      return $tipo.focus();
    }
    if ($detalle.value == ""){
      alert("Debes agregar una descripcion al mobiliario para continuar");
      return $detalle.focus();
    }
    if ($cantidad.value == "" || $cantidad.value=="0"){
      alert("La cantidad no puede ir vacio o ser 0")
      return $cantidad.focus();
    }
    
    // Crea objeto que sera enviado en la solicitud POST
    options = {
      ...options,
      body: {
        tipo: $tipo.value,
        descripcion: $detalle.value.trim(),
        cantidad: $cantidad.value.trim(),
      },
    };

    console.log(options);
    api.post(url, options).then((res) => {
      console.log(res);
      if (res.err) {
        limpiarCampos();
        return alert("Error: " + res.err);
      }
      alert("Registro creado correctamente!");
      setAddMobil(addMobil + 1);
      closeModal();
    });
  }

  // Obtiene los tipos de mobiliario registrados
  const [tipos, setTipo] = useState([]);
  function getTipos() {
    url = `http://${host}:8080/tipoMobiliario`;
    api
      .get(url, options)
      .then((res) => {
        setTipo(res.content);
      })
      .catch((err) => alert("Error"));
  }

  useEffect(() => {
    getTipos();
  }, []);

  return (
    <article className="add-client-modal-content">
      <h2>Agregar Mobiliario</h2>
      <div>
        <label htmlFor="tipo">Tipo</label>
        {/* <input type="text" id="nombre" name="nombre" autoFocus /> */}
        <select
          name="tipo"
          id="tipo"
          className="tipo-input"
        ><option value="0" >----Elegir tipo----</option>
          {tipos.map((tipo) => (
            
            <option key={tipo.id} value={tipo.id}>
              {tipo.nombre}
            </option>
          ))}
        </select>
        <label htmlFor="detalle">detalle</label>
        {/* <input type="text" id="descripcion" name="descripcion" /> */}
        <textarea
          name="detalle"
          id="detalle"
          cols="30"
          rows="5"
        ></textarea>
        <label htmlFor="cantidad">Cantidad</label>
        <input type="number" id="cantidad" name="cantidad" />
        <div className="ad-client-btns-container">
          <input
            type="button"
            value="Crear"
            className="btn"
            onClick={createMobiliario}
          />
          <input
            type="button"
            value="Cancelar"
            className="btn"
            onClick={closeModal}
          />
        </div>
      </div>
    </article>
  );
}

export default AddMobilCard;
