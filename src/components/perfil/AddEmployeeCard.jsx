import { useState } from "react";
import { helpHost } from "../../helpers/helpHost";
import { helpHttp } from "../../helpers/helpHttp";

function AddEmployeeCard({ closeModal, addEmployee, setaddEmployee }) {
  const [employees, setEmployes] = useState([]);
  const [lista, setLista] = useState([]);

  let api = helpHttp();
  let host = helpHost().getIp();
  let url = `http://${host}:8080/clients`;

  let options = {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
      "Content-Type": "application/json",
    },
  };

  function limpiarCampos() {
    const $nombre = window.document.getElementById("nombre");
    const $direccion = window.document.getElementById("direccion");
    const $telefono = window.document.getElementById("telefono");

    $nombre.value = "";
    $direccion.value = "";
    $telefono.value = "";
    $nombre.focus();
  }

  async function createClient() {
    const $nombre = window.document.getElementById("nombre");
    const $direccion = window.document.getElementById("direccion");
    const $telefono = window.document.getElementById("telefono");

    if ($nombre.value == "") return $nombre.focus();
    if ($direccion.value == "") return $direccion.focus();
    if ($telefono.value == "") return $telefono.focus();

    options = {
      ...options,
      body: {
        nombre: $nombre.value.trim(),
        direccion: $direccion.value.trim(),
        telefono: $telefono.value.trim(),
      },
    };

    api.post(url, options).then((res) => {
        console.log(res)
      if (res.err) {
        limpiarCampos();
        return alert("Error: "+res.err);
      }
      alert("Empleado creado  correctamente!");
      setaddEmployee(addEmployee+1)
      closeModal();
    });
  }

  return (
    <article className="add-client-modal-content">
      <h2>Agregar Empleado</h2>
      <div>
        <label htmlFor="nombre">Nombre</label>
        <input type="text" id="nombre" name="nombre" autoFocus />
        <label htmlFor="direccion">Direccion</label>
        <input type="text" id="direccion" name="direccion" />
        <label htmlFor="telefono">Telefono</label>
        <input type="text" id="telefono" name="telefono" />
        <div className="ad-client-btns-container">
          <input
            type="button"
            value="Crear"
            className="btn"
            onClick={createClient}
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

export default AddEmployeeCard;