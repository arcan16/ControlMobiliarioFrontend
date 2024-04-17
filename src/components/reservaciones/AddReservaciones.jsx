import { useEffect, useState } from "react";
import { helpHttp } from "../../helpers/helpHttp";
import { helpHost } from "../../helpers/helpHost";
import ContenidoPresentacion from "./ContenidoPresentacion";
import ItemLIsta from "./ItemLista";
// import ModalReservaciones from "../ModalReservaciones";
// import SelectClientCard from "../clientes/SelectClientCard";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import SelectClientCard from "../clientes/SelectClientCard";
import Modal from "../Modal";

export default function AddReservaciones() {
  const [mobiliario, setMobiliario] = useState([]); // Presentaciones de mobiliario
  const [contenido, setContenido] = useState([]); // Descripcion del mobiliario
  const [lista, setLista] = useState([]); // Lista de elementos en la reservacion
  const [total, setTotal] = useState(0.0); // Total de los items
  const [isEdith, setIsEdith] = useState(false); // Editando elemento de la reservacion
  
  /* Comportamiento de apertura/cierre de la ventana modal */
  const [modal, setModal] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  /* Datos del cliente en curso */
  const [cliente, setCliente] = useState(null);

  let api = helpHttp();
  let host = helpHost().getIp();
  let url = `http://${host}:8080/presentation`;

  let options = {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  };

  async function getReservaciones() {
    api.get(url, options).then((res) => setMobiliario(res.content));
  }

  useEffect(() => {
    if (mobiliario.length === 0) getReservaciones();

    // console.log("Mobiliario: " + mobiliario.length);
    if (lista.length === 0) {
      if (mobiliario.length > 0 && Object.keys(state).length > 0) {
        const newList = [];
        state.reservPrestamoList.forEach((el) => {
          mobiliario.forEach((mob) => {
            if (mob.id == el.idPresentacion)
              newList.push({ ...mob, cantidad: el.cantidad });
          });
        });
        setLista(newList);
      }
    }
  }, [mobiliario]);
  

  /* Estado con informacion del registro en caso de estar editando la reservacion */
  const state = useSelector((state) => state.data);

  useEffect(() => {
    if (Object.keys(state).length > 0) {
      let url = `http://${host}:8080/clients/name`;
      let options = {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
        body: {
          cliente: state.cliente,
        },
      };
      // console.log(state)
      api.post(url, options).then((res) => {
        // Llenando campo de cliente y domicilio
        setCliente(res);
      });

      /* Llenando campo de fecha para edicion */
      const $fecha1 = document.getElementById("date-delivery");
      const $fecha2 = document.getElementById("date-reception");
      $fecha1.value = state.fechaEntrega.slice(0, 10);
      $fecha2.value = state.fechaRecepcion.slice(0, 10);
    }
  }, [state]);

  /* Llenando lista de mobiliario para edicion */
  // useEffect(() => {
  //   if(mobiliario.length>0 && Object.keys(state).length>0){
  //     console.log(mobiliario);
  //     console.log(state);

  //     console.log(state.reservPrestamoList)

  //     // setLista([state.reservPrestamoList.forEach(el => {
  //     //   mobiliario.forEach(mob=>{
  //     //     if(mob.id== el.idPresentacion) return mob;
  //     //   })
  //     // })])

  //     state.reservPrestamoList.forEach(el => {
  //        mobiliario.forEach(mob=>{
  //         if(mob.id== el.idPresentacion) setLista([...lista,mob])
  //       })
  //     });
  //     // console.log(lista2)
  //   }
  // }, [mobiliario])

  /* Despliega la informacion del item descrito en el input (en caso de existir) */
  function handleChangeText(e) {
    const $cantidad = window.document.getElementById("cantidad");
    const $addBtn = window.document.querySelector(".btn.agregar");
    $cantidad.disabled = false;
    $addBtn.disabled = false;
    let newData = mobiliario.filter((el) => el.descripcion === e.target.value);
    setContenido(newData);
  }

  /* Agrega item a la lista de elementos */
  function handleAdd() {
    if (contenido.length == 0 && !isEdith) return;
    const $mobiliario = window.document.getElementById("mobiliario");
    const $cantidad = window.document.getElementById("cantidad");
    const $addBtn = window.document.querySelector(".btn.agregar");
    let newData = contenido;

    let indexItem = lista.findIndex(
      (item) => item.descripcion == $mobiliario.value
    );

    /* Controla el comportamiento del boton para agregar o editar elementos de la lista */
    if (isEdith) {
      // console.log("Editando");
      setLista(
        lista.map((el) => {
          return el.descripcion == $mobiliario.value
            ? { ...el, cantidad: parseInt($cantidad.value) }
            : el;
        })
      );
      setIsEdith(false);
      $addBtn.textContent = "Agregar";
    } else {
      // console.log("No editado");
      if (indexItem >= 0) {
        setLista(
          lista.map((el, index) => {
            return indexItem == index
              ? { ...el, cantidad: el.cantidad + parseInt($cantidad.value) }
              : el;
          })
        );
      } else {
        // console.log(newData[0]);
        setLista([...lista, { ...newData[0], cantidad: $cantidad.value }]);
      }
    }

    // console.log(lista);

    setContenido([]);
    $mobiliario.value = "";
    $cantidad.disabled = true;
    $cantidad.value = 1;
    const scrollHeight = document.documentElement.scrollHeight;
    document.documentElement.scrollTop = scrollHeight;
    // $addBtn.disabled = true;
  }

  /* Controla el comportamiento al clickar sobre el elemento de la lista para su edicion*/
  function handleClickEdit(data) {
    const $mobiliarioInput = window.document.getElementById("mobiliario");
    const $cantidadInput = window.document.getElementById("cantidad");
    const $addBtn = window.document.querySelector(".btn.agregar");

    setIsEdith(true);
    $mobiliarioInput.value = data.descripcion;
    $cantidadInput.value = data.cantidad;
    $cantidadInput.disabled = false;
    $addBtn.textContent = "Guardar";
    $addBtn.disabled = false;
  }

  /* Controla la eliminacion del registro en de la lista */
  function handleDelete() {
    const $mobiliarioInput = window.document.getElementById("mobiliario");
    const $cantidadInput = window.document.getElementById("cantidad");
    const $addBtn = window.document.querySelector(".btn.agregar");

    // let minusTotal = dataToEdit.cantidad * dataToEdit.precio;
    // setTotal(total-minusTotal);
    setLista(
      lista.filter((item) => item.descripcion !== $mobiliarioInput.value)
    );
    setIsEdith(false);
    $mobiliarioInput.value = "";
    $cantidadInput.value = 1;
    $cantidadInput.disabled = true;
    $addBtn.textContent = "Agregar";
  }

  /* Limpia el item seleccionado de las cajas de seleccion */
  function handleCancelBtn() {
    const $mobiliarioInput = window.document.getElementById("mobiliario");
    const $cantidadInput = window.document.getElementById("cantidad");
    const $addBtn = window.document.querySelector(".btn.agregar");

    $mobiliarioInput.value = "";
    $cantidadInput.value = 1;
    $cantidadInput.disabled = true;
    $addBtn.disabled = true;
    setContenido([]);
    setIsEdith(false);
  }

  function handleClienteClick() {
    setIsOpen(true);
    setModal(true);
  }

  function closeModal() {
    setModal(false);
  }

  const handleInputChange = (event) => {
    setCliente({ ...cliente, direccion: event.target.value });
  };

  useEffect(() => {
    setTotal(
      lista.reduce(
        (total, elemento) => total + elemento.cantidad * elemento.precio,
        0
      )
    );
  }, [lista]);

  function handleClickSave(e) {
    if (lista.length === 0)
      return (
        alert("No puedes almacenar una recervacion sin seleccionar mobiliario"),
        e.preventDefault()
      );

    // Al definir timeZone:'UTC' evitamos que nos modifique la fecha utilizada
    const options = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      timeZone: "UTC",
    };

    const $DateDelivery = document.getElementById("date-delivery");
    const $DateReception = document.getElementById("date-reception");
    const $DireccionEntrega = document.getElementById("domicilio");

    // El formato debe ser en para realizar operaciones con las fechas, de otra forma dara error Invalid Date
    let dateDelivery = new Date($DateDelivery.value).toLocaleDateString(
      "en",
      options
    );
    let dateReception = new Date($DateReception.value).toLocaleDateString(
      "en",
      options
    );

    dateDelivery = new Date(dateDelivery);
    dateReception = new Date(dateReception);

    // Comienzan validaciones

    if (cliente == null)
      return alert("Necesitas seleccionar un cliente"), e.preventDefault();
    if ($DireccionEntrega.value == "")
      return (
        alert("Necesitas definir la direccion de entrega"), e.preventDefault()
      );

    if (dateDelivery < new Date())
      return (
        alert("La fecha de entrega no puede ser menor a la fecha actual"),
        $DateDelivery.focus(),
        e.preventDefault()
      );
    if (dateReception < new Date())
      return (
        alert("La fecha de recepcion no puede ser menor a la fecha actual"),
        $DateReception.focus(),
        e.preventDefault()
      );
    if (dateDelivery > dateReception)
      return (
        alert("La fecha de entrega no puede ser despues de la recepcion"),
        $DateDelivery.focus(),
        e.preventDefault()
      );

    let api = helpHttp();
    let url  = `http://${host}:8080/reservacion`;

    let options2 = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
        "Content-Type": "application/json",
      },
      body: {
        idCliente: cliente.id,
        direccionEntrega: $DireccionEntrega.value,
        fechaEntrega: dateDelivery,
        fechaRecepcion: dateReception,
        reservPrestamoList: lista.map((el) => {
          return { idPresentacion: el.id, cantidad: el.cantidad };
        }),
      },
    };
    console.log(options2);
    if (Object.keys(state).length > 0) {
      options2.body.idReservacion=state.idReservacion;
      // console.log(options2)
      // console.log(url)
      // console.log(options2)
      api.put(url, options2).then((res) => {
        if (res.err) {
          return alert("Error: " + res.err), e.preventDefault();
        }
      });
    } else {
      e.preventDefault();
      console.log(options2)
      api.post(url, options2).then((res) => {
        if (res.err) {
          return alert("Error: " + res.err), e.preventDefault();
        }
      });
    }
    e.preventDefault();
    location.href="/reservaciones";
  }

  return (
    <section className="add-section">
      <h2 className="add-mobiliario-title">Nueva Reservacion</h2>
      <div className="client-search-box">
        <button className="btn search-client" onClick={handleClienteClick}>
          Clientes
        </button>
        <input
          type="text"
          name=""
          id=""
          required
          className="cliente-input"
          value={cliente != null ? cliente.nombre : ""}
          readOnly
        />
        <p>Domicilio</p>
        <input
          type="text"
          name=""
          id="domicilio"
          required
          className="cliente-input"
          placeholder="Domicilio de entrega"
          value={cliente != null ? cliente.direccion : ""}
          onChange={handleInputChange}
        />
      </div>
      <div className="reservacion-details-box">
        <div className="add-periodo-box">
          <p>Entrega</p>
          <p>Recepcion</p>
          <input type="date" name="" id="date-delivery" />
          <input type="date" name="" id="date-reception" />
        </div>
        <div className="mobiliario-box-container">
          <p>Mobiliario</p>
          <p>Cantidad</p>
          <input
            type="text"
            multiple
            name="mobiliario"
            id="mobiliario"
            list="presentaciones"
            required
            size="10"
            className="mobiliario-input"
            onChange={handleChangeText}
          />
          <input type="number" id="cantidad" disabled defaultValue={1} />
        </div>
      </div>
      <div className="btn-container">
        <button className="btn agregar" onClick={handleAdd}>
          Agregar
        </button>
        <button className="btn cancelar" onClick={handleCancelBtn}>
          Limpiar
        </button>
        {isEdith ? (
          <button className="btn eliminar" onClick={handleDelete}>
            Eliminar
          </button>
        ) : null}
      </div>
      {mobiliario.length > 0 ? (
        <datalist id="presentaciones" className="data-list">
          {mobiliario.map((el) => {
            return (
              <option key={el.id} value={el.descripcion}>
                {el.descripcion}
              </option>
            );
          })}
        </datalist>
      ) : (
        ""
      )}
      {contenido.length > 0 ? (
        <ContenidoPresentacion data={contenido[0]} />
      ) : (
        ""
      )}

      {lista.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Id</th>
              <th>Descripcion</th>
              <th>Cantidad</th>
              <th>Costo</th>
            </tr>
          </thead>
          <tbody>
            {lista.map((element) => {
              return (
                <ItemLIsta
                  handleClickEdit={() => handleClickEdit(element)}
                  key={element.id}
                  data={element}
                  total={total}
                  setTotal={setTotal}
                  lista={lista}
                />
              );
            })}
            <tr>
              <th></th>
              <th></th>
              <th>Total</th>
              <th>${total}</th>
            </tr>
          </tbody>
        </table>
      ) : (
        ""
      )}
      {modal ? (
        <Modal closeModal={closeModal} isOpen={isOpen}>
          <h2>Buscar cliente</h2>
          <SelectClientCard setCliente={setCliente} closeModal={closeModal} />
        </Modal>
      ) : null}
      <div className="btns-container-add-reservacion">
        {/* <input
          type="button"
          value="Guardar"
          className="btn"
          onClick={handleClickSave}
        /> */}
        <NavLink
          className="btn-navlink"
          to="/reservaciones"
          onClick={(e) => handleClickSave(e)}
          // onClick={() => testUpdate()}
        >
          Guardar
        </NavLink>
        <NavLink className="btn-add" to="/reservaciones">
          x
        </NavLink>
      </div>
    </section>
  );
}
