import { useEffect, useState } from "react";
import { helpHttp } from "../../helpers/helpHttp";
import { helpHost } from "../../helpers/helpHost";
import Modal from "../Modal"
import ReservacionesAgendadasCatalogo from "./ReservacionesAgendadasCatalogo";

function ReservacionesAgendadasVigentes() {
  const [reservacionesVigentes, setReservacionesVigentes] = useState(0);

  const [modal, setModal] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  /* Apertura del modal */
  function handleClick() {
    setIsOpen(true);
    setModal(true);
  }
  /* Cierre del modal */
  function closeModal() {
    setModal(false);
  }

  let api = helpHttp();
  let host = helpHost().getIp();
  let url = `http://${host}:8080/reservacion/vigentes`;

  let options = {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  };

  function getReservaciones(api) {
    api.get(url, options).then((data) => {
      setReservacionesVigentes(data.content.length);
    });
  }

  useEffect(() => {
    getReservaciones(api);
  }, []);

  function handleClickReservacionesVigentes() {
    handleClick();
  }
  return (
    <>
    <div className="data-card section-container" onClick={handleClickReservacionesVigentes}>
      <h2>{reservacionesVigentes}</h2>
      <h3>Reservaciones Vigentes</h3>
    </div>
    {modal ? (
        <Modal closeModal={closeModal} isOpen={isOpen}>
          <ReservacionesAgendadasCatalogo/>
        </Modal>
      ) : null}
    </>
  );
}

export default ReservacionesAgendadasVigentes;
