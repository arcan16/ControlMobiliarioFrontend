import { useEffect } from "react";
import { useState } from "react";
import { helpHttp } from "../helpers/helpHttp";
import { helpHost } from "../helpers/helpHost";
import ReservacionIndividual from "../components/ReservacionIndividual";
import ModalReservaciones from "../components/ModalReservaciones";
import ModalContent from "../components/ModalContent";
import { NavLink } from "react-router-dom";

export default function Reservaciones() {
  const [reservacionesPeriodo, setReservacionesPeriodo] = useState(0);
  const [modal, setModal] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [dataModal, setDataModal] = useState(null);
  let api = helpHttp();
  let host = helpHost().getIp();
  let url = `http://${host}:8080/reservacion/periodo`;
  // let url = "http://192.168.1.69:8080/reservacion/periodo";
  // let url = "http://localhost:8080/reservacion/statusOne";

  function handleOpen() {
    const $details = window.document.querySelector(".filter-details");
    if ($details.hasAttribute("open")) {
      $details.removeAttribute("open");
    } else {
      $details.setAttribute("open");
    }
  }

  function handleSelectChange(e) {
    const $selectCheckbox = window.document.querySelector(".status-checkbox");

    if (e.target.value != "") {
      $selectCheckbox.checked = true;
    } else {
      $selectCheckbox.checked = false;
    }
  }

  // Inicializa el valor de los datapickers
  useEffect(() => {
    const $date1 = window.document.getElementById("date1");
    const $date2 = window.document.getElementById("date2");
    let fechaBase = new Date();

    let anioActual = fechaBase.getFullYear();

    let mesActual = (fechaBase.getMonth() + 1).toString().padStart(2, "0");
    let diasDelMes = new Date(
      fechaBase.getFullYear(),
      fechaBase.getMonth() + 1,
      0
    ).getDate();

    $date1.value = anioActual + "-" + mesActual + "-" + "01";
    $date2.value = anioActual + "-" + mesActual + "-" + diasDelMes;
  }, []);

  /* Comienza fetch */

  function getReservaciones() {
    const $date1 = window.document.getElementById("date1");
    const $date2 = window.document.getElementById("date2");
    let options = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
        "Content-Type": "application/json",
      },
      body: {
        fecha1: $date1.value,
        fecha2: $date2.value,
      },
    };
    api.post(url, options).then((data) => {
      setReservacionesPeriodo(data.content);
    });
  }

  useEffect(() => {
    getReservaciones();
  }, []);
  /* Termina fetch */

  // function handleChange() {
  //   const $fec = window.document.querySelector("#date1");
  //   const options = {
  //     timeZone: "UTC",
  //     day: "2-digit",
  //     month: "2-digit",
  //     year: "numeric",
  //   };
  //   console.log(new Date($fec.value).toLocaleDateString("es-ES", options));
  // }

  function handleClick(data) {
    setDataModal(data);
    setIsOpen(true);
    setModal(true);
  }
  function closeModal() {
    setModal(false);
  }

  // function handleClickBtnAdd(){
  //   location.href= "/reservas/add";
  //   // alert("Agregando")
  // }

  return (
    <section className="reservaciones-container">
      <h2>Reservaciones</h2>

      <div className="search-container">
        <input
          type="text"
          className="filter-search-input"
          placeholder="Buscar"
          autoFocus
        />
        <input type="button" value="Buscar" className="filter-search-btn" />
      </div>

      <details className="filter-details">
        <summary className="summary-box">Filtros</summary>
        <article className="filters-container">
          <div className="filter-top">
            <label>
              <input type="radio" name="reservas" value="all" defaultChecked />
              Todas
            </label>
            <label>
              <input type="radio" name="reservas" value="entregas" />
              Entregas
            </label>
            <label>
              <input type="radio" name="reservas" value="recepcion" />
              Recepcion
            </label>
            <label>
              <input type="radio" name="reservas" value="recepcion" />
              Retraso
            </label>
            <label>
              <input type="radio" name="reservas" value="recepcion" />
              Canceladas
            </label>
          </div>
          <div className="filter-middle">
            <label className="filter-periodo">
              <div>
                <input type="radio" name="reservas" value="recepcion" />
                Periodo
              </div>
              <div className="rango-fechas-box">
                <p>De:</p>
                <input type="date" name="" id="date1"/>
                {/* onChange={handleChange} */}
                <p>a:</p>
                <input type="date" name="" id="date2" />
              </div>
            </label>
          </div>
          <div className="filter-bottom">
            <label>
              <input
                type="checkbox"
                name="reservas"
                value="recepcion"
                className="status-checkbox"
                disabled
              />
              Status
            </label>
            <select
              name=""
              id=""
              className="status-select"
              onChange={handleSelectChange}
            >
              <option value="">-- Elige una Opcion --</option>
              <option value="0">No Entregado</option>
              <option value="1">Entregado</option>
              <option value="2">Recibido</option>
              <option value="3">Cancelado</option>
            </select>
          </div>
          <input
            className="btn"
            type="button"
            value="Aplicar"
            onClick={handleOpen}
          />
        </article>
      </details>
      <section className="read-reservacion-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Cliente</th>
              <th>Entrega</th>
              <th>Recepcion</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {reservacionesPeriodo != 0
              ? reservacionesPeriodo.map((el) => (
                  <ReservacionIndividual
                    key={el.idReservacion}
                    data={el}
                    handleClick={() => handleClick(el)}
                  />
                ))
              : <tr><td colSpan={4}>No hay reservaciones registradas</td></tr>}
          </tbody>
        </table>
        {modal ? (
          <ModalReservaciones closeModal={closeModal} isOpen={isOpen}>
            {dataModal != null ? <ModalContent data={dataModal} closeModal={closeModal} reservacionesPeriodo={reservacionesPeriodo} setReservacionesPeriodo={setReservacionesPeriodo} /> : null}
          </ModalReservaciones>
        ) : null}
      </section>
      <NavLink className="btn-add" to="/reservaciones/add">
        +
      </NavLink>
      {/* <button className="btn-add" onClick={handleClickBtnAdd}>+</button> */}
    </section>
  );
}
