import { NavLink } from "react-router-dom";
import { helpHost } from "../helpers/helpHost";
import { helpHttp } from "../helpers/helpHttp";
import EntregaIndividual from "./cards/EntregaIndividual";
import { useDispatch } from "react-redux";
import { setData } from "../actions/dataActions";
// import ModalReservaciones from "./ModalReservaciones";
import CobroReservacion from "./reservaciones/CobroReservacion";
import { useState } from "react";
import Modal from "./Modal";

function ModalContent({
  data,
  closeModal,
  setReservacionesPeriodo,
  reservacionesPeriodo,
}) {
  const [modalCobro, setModalCobro] = useState(false);
  const [isOpenCobro, setIsOpenCobro] = useState(false);

  let api = helpHttp();
  let host = helpHost().getIp();
  let url = `http://${host}:8080/reservacion`;

  let options = {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
      "Content-Type": "application/json",
    },
  };

  function handleClickDeliver(movement) {
    options = {
      ...options,
      body: {
        idReservacion: data.idReservacion,
        status: movement,
      },
    };

    api.put(url, options).then((res) => {
      if (res.err) return alert("error: " + res.err);
      setReservacionesPeriodo(
        reservacionesPeriodo.map((el) => {
          return el.idReservacion == data.idReservacion
            ? { ...el, status: movement }
            : el;
        })
      );
      closeModal();
    });
  }

  const dispatch = useDispatch();

  /* Comienza comportamiento modal para cobro */

  function handleClickCobro() {
    setIsOpenCobro(true);
    setModalCobro(true);
  }

  function closeModalCobro() {
    setModalCobro(false);
  }

  

  /* Finaliza comportamiento modal para cobro */

  return (
    <div className="modal-content">
      <h2>Reservacion {data.idReservacion}</h2>
      <EntregaIndividual key={data.idReservacion} data={data} />
      <article className="btns-container">
        <div className="btn-modal-container">
          {data.status == 0 ? (
            <>
              <button className="btn" onClick={() => handleClickDeliver(3)}>
                Cancelar
              </button>
              <button className="btn" onClick={() => handleClickDeliver(1)}>
                Entregar
              </button>
              {/* <button className="btn">Modificar</button> */}
              <NavLink
                className="btn-navlink"
                to="/reservaciones/add"
                onClick={() => dispatch(setData(data))}
              >
                Modificar
              </NavLink>
            </>
          ) : data.status == 1 ? (
            <>
              <button
                className="btn-modal btn-recepcion"
                onClick={handleClickCobro}
              >
                Recepcion
              </button>
            </>
          ) : null}
        </div>
      </article>
      {modalCobro ?(<Modal closeModal={closeModalCobro} isOpen={isOpenCobro}>
        <CobroReservacion closeModal={closeModalCobro} closeModalRaiz={closeModal} data={data}/>
      </Modal>):null}
    </div>
  );
}

export default ModalContent;
