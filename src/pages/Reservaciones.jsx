import { useEffect } from "react";
import { useState } from "react";
import { helpHttp } from "../helpers/helpHttp";
import { helpHost } from "../helpers/helpHost";
import ReservacionIndividual from "../components/reservaciones/ReservacionIndividual";
import ModalContent from "../components/ModalContent";
import { NavLink } from "react-router-dom";
import { useDispatch } from "react-redux";
import { resetData } from "../actions/dataActions";
import Modal from "../components/Modal";

export default function Reservaciones() {
  const [reservacionesPeriodo, setReservacionesPeriodo] = useState(0);
  const [modal, setModal] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [dataModal, setDataModal] = useState(null);
  
  const [fechaMostrada, setFechaMostrada] = useState(null);

  const [dataFilter, setDataFilter] = useState([]);

  let api = helpHttp();
  let host = helpHost().getIp();
  let url = `http://${host}:8080/reservacion/periodo`;

  function handleOpen() {
    getReservaciones();
    closeFilterContainer();
  }

  // Inicializa el valor de los datapickers
  function setDatePeriod() {
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
  }
  useEffect(() => {
    setDatePeriod();
  }, []);

  /* Comienza fetch */

  function getReservaciones() {
    const $date1 = window.document.getElementById("date1");
    const $date2 = window.document.getElementById("date2");

    /* Validamos que la fecha sea correcta */

    if (
      Date.parse(new Date($date2.value).toISOString()) -
        Date.parse(new Date($date1.value).toISOString()) <
      0
    )
      return alert("Error en las fechas, favor de verificar");

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
    let actualDate = (new Date().toLocaleDateString('es',{month:"long",year:'numeric'}));
    setFechaMostrada(actualDate)
  }, []);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(resetData());
  }, [dispatch]);

  /* Termina fetch */

  function handleClick(data) {
    setDataModal(data);
    setIsOpen(true);
    setModal(true);
  }
  function closeModal() {
    setModal(false);
  }

  /* Comienza comportamiento del filtro  */

  function handleFilterChange(e) {
    if (e.target.type == "text") handelSearchInputChange(e);
    if (e.target.type == "radio") handleRadioChange(e);
    
  }

  function closeFilterContainer(){
    const $details = window.document.querySelector(".filter-details");
    if ($details.hasAttribute("open")) {
      $details.removeAttribute("open");
    } else {
      $details.setAttribute("open");
    }
  }

  function handelSearchInputChange(e) {
    // console.log(reservacionesPeriodo)

    let regExp = new RegExp(e.target.value, "gi");

    setDataFilter(
      reservacionesPeriodo.filter((el) => {
        if (regExp.test(el.idReservacion)) return el;
        if (regExp.test(el.cliente)) return el;
      })
    );
  }



  function handleRadioChange(e) {
    if (e.target.value == "all") {
      closeFilterContainer();
      return setDataFilter(reservacionesPeriodo);
    }
    
    let newData =[];
    reservacionesPeriodo.forEach(el=>{
      console.log(el.status)
      if(el.status==e.target.value)newData.push(el)
    })
  console.log("Longitud "+newData.length)
    if(newData.length==0){
      setDataFilter([]);
    }else{
      setDataFilter(newData);
    }
    closeFilterContainer();
  }
  

  return (
    <section className="reservaciones-container">
      <h2>Reservaciones</h2>

      <div className="search-container">
        <input
          type="text"
          className="filter-search-input"
          placeholder="Buscar"
          onChange={handleFilterChange}
          autoFocus
        />
        <input type="button" value="Buscar" className="filter-search-btn" />
      </div>

      <details className="filter-details">
        <summary className="summary-box">Filtros</summary>
        <article className="filters-container">
          <div className="filter-top">
            <label>
              <input
                type="radio"
                name="reservas"
                value="all"
                defaultChecked
                onClick={handleFilterChange}
              />
              Todas
            </label>
            <label>
              <input
                type="radio"
                name="reservas"
                value="0"
                onClick={handleFilterChange}
              />
              Sin entregar
            </label>
            <label>
              <input
                type="radio"
                name="reservas"
                value="1"
                onClick={handleFilterChange}
              />
              Entregado
            </label>
            <label>
              <input
                type="radio"
                name="reservas"
                value="2"
                onClick={handleFilterChange}
              />
              Recepcion
            </label>
            <label>
              <input
                type="radio"
                name="reservas"
                value="3"
                onClick={handleFilterChange}
              />
              Canceladas
            </label>
          </div>
          <div className="filter-middle">
            <label className="filter-periodo">
              <h3 style={{ margin: "0" }}>Periodo</h3>
              <div className="rango-fechas-box">
                <p>De:</p>
                <input type="date" name="" id="date1" />
                <p>a:</p>
                <input type="date" name="" id="date2" />
              </div>
            </label>
          </div>
          <input
            className="btn"
            type="button"
            value="Aplicar"
            onClick={handleOpen}
          />
        </article>
      </details>
      <div>
        <p style={{margin:"0"}}>Mes: {fechaMostrada}</p>
      </div>
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
            {reservacionesPeriodo !== 0 ? (
              dataFilter.length > 0 ? (
                !dataFilter[0].err ? (
                  dataFilter.map((el) => (
                    <ReservacionIndividual
                      key={el.idReservacion}
                      data={el}
                      handleClick={() => handleClick(el)}
                    />
                  ))
                ) : (
                  <tr>
                    <th colSpan={5}>Sin resultados</th>
                  </tr>
                )
              ) : (
                reservacionesPeriodo.map((el) => (
                  <ReservacionIndividual
                    key={el.idReservacion}
                    data={el}
                    handleClick={() => handleClick(el)}
                  />
                ))
              )
            ) : (
              <tr>
                <td colSpan={4}>No hay reservaciones registradas</td>
              </tr>
            )}
          </tbody>
        </table>
        {modal ? (
          <Modal closeModal={closeModal} isOpen={isOpen}>
            {dataModal != null ? (
              <ModalContent
                data={dataModal}
                closeModal={closeModal}
                reservacionesPeriodo={reservacionesPeriodo}
                setReservacionesPeriodo={setReservacionesPeriodo}
              />
            ) : null}
          </Modal>
        ) : null}

      </section>
      <NavLink className="btn-add" to="/reservaciones/add">
        +
      </NavLink>
      {/* <button className="btn-add" onClick={handleClickBtnAdd}>+</button> */}
    </section>
  );
}
