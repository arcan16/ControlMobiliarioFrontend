import { NavLink } from "react-router-dom";
import { helpHost } from "../../helpers/helpHost";
import { helpHttp } from "../../helpers/helpHttp";

import Modal from "../Modal";
import CreateEdithDelete from "./CreateEdithDeleteMobiliario";
import { useEffect, useState } from "react";

function EdithMobiliario({
  data,
  setMobilToEdith,
  closeModal,
  mobiliarios,
  setMobiliarios,
  setLista,
}) {

  let host = helpHost().getIp();
  let api = helpHttp();
  let url = "";
  let options = {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
      "Content-Type": "application/json",
    },
  };

  const [tipos, setTipo] = useState([])
  function getTipos() {
    url = `http://${host}:8080/tipoMobiliario`;
    api.get(url, options).then((res) => {
      setTipo(res.content);
    }).catch(err=>alert("Error"));
  }

  useEffect(() => {
    getTipos();
  }, []);

  // Elimina el cliente junto con sus registros enlazados siempre y cuando no renga reservaciones activas
  function delMobiliairo() {
    url = `http://${host}:8080/mobiliario/${data.id}`;
    api
      .del(url, options)
      .then((res) => {
        console.log(res);
        if(res.message)alert(res.message);
        // res.prestamo == "vigente" ? alert(res.message) : alert("Ok");
      })
      .catch((err) => alert(err));
    let newData = mobiliarios.filter((el) => el.id != data.id);
    setMobiliarios(newData);
    setLista(newData);
    closeModal();
  }

  // Actualiza  el estado del cliente a editar en la lista de clientes
  function handleInputChange(e) {
    let newData = { ...data, [e.target.name]: e.target.value };
    setMobilToEdith(newData);
  }

  // Comportamiento de boton Cancelar
  function handleCancel() {
    let answer = confirm("Seguro de cancelar?");
    if (answer) closeModal();
  }

  // Guarda la informacion  actualizada del cliente
  function handleSave(e) {
    validateMobiliario(e);
    // alert("Validacion correcta")
    url = `http://${host}:8080/mobiliario`;
    let tipo = tipos.find(tipo=>tipo.nombre==data.tipo);

    options = { ...options, body: { id: data.id } };
    options.body.tipo = `${tipo.id}`;
    options.body.descripcion = data.descripcion;
    options.body.cantidad = data.cantidad;
    
    console.log(options)
    api
      .put(url, options)
      .then((res) => alert("Cambios guardados correctamente"))
      .catch((err) => alert(err));

    const newData = mobiliarios.map((el) => {
      return el.id === data.id ? data : el;
    });
    setMobiliarios(newData);
    setLista(newData);
    closeModal();
  }

  // Valida la informacion previo a ser almacenada
  function validateMobiliario(e) {
    const $form = document.querySelector(".data-section-form");
    if ($form.tipo.value == "0") {
      e.preventDefault();
      alert("Debes seleccionar un tipo de Mobiliario para continuar");
      $form.tipo.focus();
      throw new Error("Debes seleccionar el tipo de Mobiliario para continuar");
    }
    if ($form.detalle.value == "") {
      e.preventDefault();
      alert("Debes colocar una descripcion para continuar");
      $form.detalle.focus();
      throw new Error("La descripcion no puede ir vacia");
    }
    if ($form.cantidad.value=="" || $form.cantidad.value=="0") {
      e.preventDefault();
      alert("Ingrese una cantidad valida");
      $form.cantidad.focus();
      throw new Error(
        "Debes ingresar una cantidad valida"
      );
    }
  }

  return (
    <div className="editar-cliente-container">
      <div className="modal-top-data">
        <h1>Edicion del Mobiliario</h1>
        <div className="delete-container">
          <input
            type="button"
            className="btn btn-red"
            value="Eliminar"
            onClick={delMobiliairo}
          />
        </div>
        <form action="" className="data-section-form">
          <div
            style={{
              gridColumn: "span 2",
              fontWeight: "bolder",
              textAlign: "center",
            }}
          >
            Datos del Registro
          </div>
          <label htmlFor="tipo">Tipo</label>
          <select name="tipo" id="tipo" className="tipo-input" value={data.tipo} onChange={handleInputChange}>
            {tipos.map((tipo)=>(
              <option key={tipo.id} value={tipo.nombre}>{tipo.nombre}</option>
            ))}
          </select>

          <label htmlFor="detalle">Detalle</label>
          <textarea
            name="descripcion"
            id="detalle"
            cols="30"
            rows="3"
            onChange={handleInputChange}
            value={data.descripcion}
          ></textarea>

          <label htmlFor="cantidad">Cantidad</label>
          <input
            type="cantidad"
            name="cantidad"
            id="cantidad"
            value={data.cantidad}
            onKeyDown={(e) => {
              if (e.key == "-" || e.key == "+" || e.key == ".") {
                alert("Solo se admiten digitos numericos");
                e.preventDefault();
              }
            }}
            onChange={(e) => {
              if (e.target.value.length > 10) {
                e.target.value = e.target.value.slice(0, 10);
                return alert("Solo se admiten 10 digitos");
              }
              handleInputChange(e);
            }}
          />
        </form>
      </div>
      <div className="section-content-btn-container">
        <NavLink
          to="/mobiliario"
          onClick={handleSave}
          className="btn-navlink btn-green"
        >
          Guardar
          {/* <input type="button" value="Guardar" className="btn btn-green" /> */}
        </NavLink>

        <input
          type="button"
          value="Cancelar"
          className="btn btn-red"
          onClick={handleCancel}
        />
      </div>
    </div>
  );
}

export default EdithMobiliario;
