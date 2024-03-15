import { useEffect, useState } from "react";
import { helpHttp } from "../../helpers/helpHttp";
import { helpHost } from "../../helpers/helpHost";
import ContenidoPresentacion from "./ContenidoPresentacion";
import ItemLIsta from "./ItemLista";
import ModalReservaciones from "../../components/ModalReservaciones";
import ModalContent from "../../components/ModalContent";
import SelectClientCard from "./SelectClientCard";
import { NavLink } from "react-router-dom";

export default function AddReservaciones({data}) {
  const [mobiliario, setMobiliario] = useState([]);
  const [contenido, setContenido] = useState([]);
  const [lista, setLista] = useState([]);
  const [total, setTotal] = useState(0.0);
  const [isEdith, setIsEdith] = useState(false);

  const [modal, setModal] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  // const [dataModal, setDataModal] = useState(null);

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
    console.log(data)
    if (data != null){
      console.log(data);
    }else{
      getReservaciones();
    }
  }, []);

  function handleChangeText(e) {
    const $cantidad = window.document.getElementById("cantidad");
    const $addBtn = window.document.querySelector(".btn.agregar");
    $cantidad.disabled = false;
    $addBtn.disabled = false;
    let newData = mobiliario.filter((el) => el.descripcion === e.target.value);
    setContenido(newData);
  }

  function handleAdd() {
    if (contenido.length == 0 && !isEdith) return;
    const $mobiliario = window.document.getElementById("mobiliario");
    const $cantidad = window.document.getElementById("cantidad");
    const $addBtn = window.document.querySelector(".btn.agregar");
    let newData = contenido;

    let indexItem = lista.findIndex(
      (item) => item.descripcion == $mobiliario.value
    );

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
      return alert(
        "No puedes almacenar una recervacion sin seleccionar mobiliario"
      ), e.preventDefault();

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

    if (cliente == null) return alert("Necesitas seleccionar un cliente"), e.preventDefault();
    if($DireccionEntrega.value=="")return alert("Necesitas definir la direccion de entrega"), e.preventDefault();

    if (dateDelivery < new Date())
      return (
        alert("La fecha de entrega no puede ser menor a la fecha actual"),
        $DateDelivery.focus(),e.preventDefault()
      );
    if (dateReception < new Date())
      return (
        alert("La fecha de recepcion no puede ser menor a la fecha actual"),
        $DateReception.focus(),e.preventDefault()
      );
    if (dateDelivery > dateReception)
      return (
        alert("La fecha de entrega no puede ser despues de la recepcion"),
        $DateDelivery.focus(),e.preventDefault()
      );

    alert("Ahora si, a crear el registro");

    let api = helpHttp();
    let url = `http://${host}:8080/reservacion`;

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
        reservPrestamoList:lista.map((el)=>{
          return {idPresentacion: el.id,cantidad: el.cantidad}
        })
      }
    };
    console.log(options2)
    api.post(url, options2).then((res) => {
      if(res.err){
        return alert("Error: "+res.err),
        e.preventDefault()
      }
    });
    
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
        <ModalReservaciones closeModal={closeModal} isOpen={isOpen}>
          <SelectClientCard setCliente={setCliente} closeModal={closeModal} />
        </ModalReservaciones>
      ) : null}
      <div className="btns-container-add-reservacion">
        {/* <input
          type="button"
          value="Guardar"
          className="btn"
          onClick={handleClickSave}
        /> */}
        <NavLink className="btn-navlink" to="/reservaciones" onClick={()=>handleClickSave()}>
          Guardar
        </NavLink>
        <NavLink className="btn-add" to="/reservaciones">
          x
        </NavLink>
      </div>
    </section>
  );
}
