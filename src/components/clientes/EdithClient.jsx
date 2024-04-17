import { NavLink } from "react-router-dom";
import Clientes from "./Clientes";
import { helpHost } from "../../helpers/helpHost";
import { helpHttp } from "../../helpers/helpHttp";

function EdithClient({
  data,
  setClientToEdith,
  closeModal,
  clientes,
  setClientes,
  setLista,
}) {
  // console.log(data);

  let host = helpHost().getIp();
  let api = helpHttp();
  let url = "";
  let options = {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
      "Content-Type": "application/json",
    },
  };

  // Activa o desactiva el cliente seleccionado
  function changeActiveClient() {
    url = `http://${host}:8080/clients/active/${data.id}`;
    try {
      api.del(url, options);
      const newData = clientes.map((cli) => {
        return data.id == cli.id
          ? { ...cli, active: cli.active == 1 ? 0 : 1 }
          : cli;
      });
      setClientes(newData);
      setLista(newData);
      closeModal();
    } catch (error) {
      alert("Error: " + error);
    }
  }

  // Elimina el cliente junto con sus registros enlazados siempre y cuando no renga reservaciones activas
  function delClient() {
    url = `http://${host}:8080/clients/all/${data.id}`;
    api
      .del(url, options)
      .then((res) => {
        console.log(res);
        res.prestamo == "vigente" ? alert(res.message) : alert("Ok");
      })
      .catch((err) => alert(err));
    let newData = clientes.filter((el)=>el.id!=data.id);
    setClientes(newData);
    setLista(newData);
    closeModal();
  }

  // Actualiza  el estado del cliente a editar en la lista de clientes
  function handleInputChange(e) {
    let newData = { ...data, [e.target.name]: e.target.value };
    setClientToEdith(newData);
  }

  // Comportamiento de boton Cancelar
  function handleCancel() {
    let answer = confirm("Seguro de cancelar?");
    if (answer) closeModal();
  }

  // Guarda la informacion  actualizada del cliente
  function handleSave(e){
    validateClient(e);

    url = `http://${host}:8080/clients`;
    options={...options,body:{id:data.id}}
    options.body.nombre = data.nombre;
    options.body.direccion = data.direccion;
    options.body.telefono = data.telefono;

    api.put(url,options).then((res)=>alert("Cambios guardados correctamente")).catch(err=>alert(err));

    const newData = clientes.map((el)=>{
      return  el.id === data.id ? data:el;
    })
    setClientes(newData);
    setLista(newData);
    closeModal();
  }

  // Valida la informacion previo a ser almacenada
  function validateClient(e){
    const $form = document.querySelector(".data-section-form");
    if($form.nombre.value==""){
      e.preventDefault();
      alert("El nombre no puede ir vacio");
      $form.nombre.focus();
      throw new Error("El nombre no puede ir vacio");
    }
    if($form.direccion.value==""){
      e.preventDefault();
      alert("La direccion no puede ir vacia");
      $form.direccion.focus();
      throw new Error("La direccion no puede ir vacia");
    }
    if($form.telefono.value.length<10){
      e.preventDefault();
      alert("El Telefono debe contener 10 digitos en lugar de "+$form.telefono.value.length);
      $form.telefono.select();
      throw new Error("El Telefono debe contener 10 digitos en lugar de "+$form.telefono.value.length);
    }
  }

  return (
    <div className="editar-cliente-container">
      <div className="modal-top-data">
        <h1>Edicion del cliente</h1>
        <div className="delete-container">
          <input
            type="button"
            className="btn btn-red"
            value="Eliminar"
            onClick={delClient}
          />
          <input
            type="button"
            value={data.active == 1 ? "Desactivar" : "Activar"}
            className={data.active == 1 ? "btn btn-orange" : "btn btn-blue"}
            onClick={changeActiveClient}
          />
        </div>
        <form action="" className="data-section-form">
          <div style={{gridColumn:"span 2", fontWeight:"bolder",textAlign:"center"}}>Datos del cliente</div>
          <label htmlFor="nombre">Nombre</label>
          <input
            type="text"
            name="nombre"
            id="nombre"
            value={data.nombre}
            onChange={handleInputChange}
          />

          <label htmlFor="direccion">Direccion</label>
          <input
            type="text"
            name="direccion"
            id="direccion"
            value={data.direccion}
            onChange={handleInputChange}
          />

          <label htmlFor="telefono">Telefono</label>
          <input
            type="number"
            name="telefono"
            id="telefono"
            value={data.telefono}
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
        <NavLink  to="/clientes" onClick={handleSave} className="btn-navlink btn-green">
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

export default EdithClient;
