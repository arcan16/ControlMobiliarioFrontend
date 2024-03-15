import { NavLink } from "react-router-dom";
import { helpHost } from "../helpers/helpHost";
import { helpHttp } from "../helpers/helpHttp";
import EntregaIndividual from "./EntregaIndividual";

function ModalContent({
  data,
  closeModal,
  setReservacionesPeriodo,
  reservacionesPeriodo,
}) {
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
              <NavLink className="btn-navlink" to="/reservaciones/add" data={data}>Modificar</NavLink>
            </>
          ) : data.status == 1 ? (
            <>
              <button className="btn-modal btn-recepcion">Recepcion</button>
            </>
          ) : null}
        </div>
      </article>
    </div>
  );
}

export default ModalContent;
