import { useEffect, useState } from "react";
import { helpHttp } from "../../helpers/helpHttp";
import { helpHost } from "../../helpers/helpHost";
import Modal from "../Modal";

function ReservacionesAgendadasCatalogo() {
  let api = helpHttp();
  const [resVig, setResVig] = useState({});
  const [actualData, setActualData] = useState({});

  let host = helpHost().getIp();
  let url = `http://${host}:8080/reservacion/vigentes`;

  let options = {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  };
  // Obtiene la informacion del servidor
  async function getReservacionesVigentes() {
    api.get(url, options).then((res) => {
      console.log(res);
      setResVig(res.content);
    });
  }

  // Realiza la carga de clientes inicial
  useEffect(() => {
    getReservacionesVigentes();
  }, []);

  // Formatea la fecha que sera mostrada en la tabla
  function parseaFecha(date) {
    let fixedDate = date.slice(0, 10).split("-");
    fixedDate[1] - 1 < 0
      ? (fixedDate[1] = 11)
      : (fixedDate[1] = fixedDate[1] - 1);
    let fecha = new Date(
      fixedDate[0],
      fixedDate[1],
      fixedDate[2]
    ).toLocaleDateString("es", {
      timeZone: "UTC",
      month: "short",
      day: "2-digit",
    });
    return fecha;
  }

  // Formatea el status para ser mostrado en la tabla
  function formatStatus(status) {
    if (status == "0") {
      return "Pendiente";
    }
    if (status == "1") {
      return "Entregado";
    }
  }

  function handleClickDetails(res) {
    openModalDetails();
    setActualData(res);
    console.log(res);
  }

  /* Comportamiento del modal que muestra los detalles de la reservacion */
  const [modalDetails, setModalDetails] = useState(false);
  const [isOpenDetails, setIsOpenDetails] = useState(false);

  /* Apertura del modal */
  function openModalDetails() {
    setIsOpenDetails(true);
    setModalDetails(true);
  }
  /* Cierre del modal */
  function closeModalDetails() {
    setModalDetails(false);
  }
  return (
    <>
      <section>
        <h2>Entregas Vigentes</h2>
        <table className="data-table entregas-vigentes">
          <thead>
            <tr>
              <th>Id</th>
              <th>Cliente</th>
              <th>Entrega</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(resVig).length > 0
              ? resVig.map((res) => {
                  return (
                    <tr
                      key={res.idReservacion}
                      onClick={() => handleClickDetails(res)}
                    >
                      <td>{res.idReservacion}</td>
                      <td>{res.cliente}</td>
                      <td>{parseaFecha(res.fechaEntrega)}</td>
                      <td>{formatStatus(res.status)}</td>
                    </tr>
                  );
                })
              : null}
          </tbody>
        </table>
      </section>
      {modalDetails ? (
        <Modal closeModal={closeModalDetails} isOpen={isOpenDetails}>
          <h2 style={{margin:"0"}}>Detalles</h2>
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Cliente</th>
                <th>Entrega</th>
                <th>Recepcion</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{actualData.idReservacion}</td>
                <td>{actualData.cliente}</td>
                <td>{parseaFecha(actualData.fechaEntrega)}</td>
                <td>{parseaFecha(actualData.fechaRecepcion)}</td>
              </tr>
              <tr>
                <td colSpan={4} style={{ textAlign: "center" }}>
                  <b>Mobiliario</b>
                </td>
              </tr>
              {Object.keys(actualData).length > 0 ? (
                <tr style={{fontWeight:"bold"}}>
                  <td>ID</td>
                  <td colSpan={2}>DESCRIPCION</td>
                  <td>CANTIDAD</td>
                </tr>
              ) : null}
              {Object.keys(actualData).length > 0
                ? actualData.reservPrestamoList.map((res) => {
                    return (
                      <tr
                        key={res.idPresentacion}
                      >
                        <td>{res.idPresentacion}</td>
                        <td colSpan={2}>{res.presentacion}</td>
                        <td>{res.cantidad}</td>
                      </tr>
                    );
                  })
                : null}
            </tbody>
          </table>
        </Modal>
      ) : null}
    </>
  );
}

export default ReservacionesAgendadasCatalogo;
