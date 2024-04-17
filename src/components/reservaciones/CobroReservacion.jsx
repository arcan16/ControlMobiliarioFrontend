import { useEffect, useState } from "react";
import { helpHost } from "../../helpers/helpHost";
import { helpHttp } from "../../helpers/helpHttp";

function CobroReservacion({ closeModal, closeModalRaiz, data }) {
  const [dataReservacion, setDataReservacion] = useState([]);
  const [presentaciones, setPresentaciones] = useState([]);
  const [dataTable, setDataTable] = useState([]);

  let api = helpHttp();
  let host = helpHost().getIp();
  let url = `http://${host}:8080/cobros/total/${data.idReservacion}`;

  function returnToReservaciones() {
    const $montoRecibido = document.getElementById("pago-box");

    if ($montoRecibido.value == "")
      return alert("El pago no ha sido registrado, favor de verificar!");

    if (dataReservacion.total - parseFloat($montoRecibido.value) > 0.001)
      return (
        $montoRecibido.select(),
        alert("El importe recibido es menor a la venta, favor de verificar")
      );

    url = `http://${host}:8080/cobros`;
    let options = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
        "Content-Type": "application/json",
      },
      body: {
        idReservacion: dataReservacion.idReservacion,
        total: dataReservacion.total,
      },
    };
    api
      .post(url, options)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => alert(err));

    location.href = "/reservaciones";
  }

  async function getData() {
    let options = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
        "Content-Type": "application/json",
      },
    };
    try {
      // Datos de la reservacion
      const dataReservacion = await api.get(url, options);

      // Datos de las presentaciones
      url = `http://${host}:8080/presentation`;
      const dataPresentaciones = await api.get(url, options);

      setDataReservacion(dataReservacion);
      setPresentaciones(dataPresentaciones.content);

      // console.log(dataReservacion);
      // console.log(dataPresentaciones.content);

      const newData = [];

      dataReservacion.reservPrestamoList.forEach((res) => {
        dataPresentaciones.content.forEach((pres) => {
          if (res.idPresentacion == pres.id)
            newData.push({
              id: res.idPresentacion,
              presentacion: pres.descripcion,
              cantidad: res.cantidad,
              precio: pres.precio,
              subtotal: pres.precio * res.cantidad,
            });
        });
      });

      // console.log(dataReservacion);
      // console.log(dataPresentaciones.content);
      // console.log(newData);
      setDataTable(newData);
    } catch (error) {
      console.log("Error al obtener datos " + error);
    }
    // console.log(dataCobro);
    // console.log(presentaciones);
  }

  useEffect(() => {
    getData();
  }, []);

  /* Comienza comportamiento para caja de pago #pago-box */

  function handlePagoChange(e) {
    const $resultado = document.getElementById("resultado-pago");
    let total = parseFloat(dataReservacion.total) - parseFloat(e.target.value);

    if (total < 0) {
      $resultado.textContent = `Excede en: $${-total}`;
    } else if (total > 0) {
      $resultado.textContent = `Faltante: $${total}`;
    } else if (total > 0.00001 || total < 0.00001) {
      $resultado.textContent = `Importe exacto`;
    }

    if (e.target.value == "") $resultado.textContent = "";
  }

  /* Finaliza comportamiento para caja de pago #pago-box */
  return (
    <div className="box-modal-container">
      <div className="cobro-reservacion-container">
        <form action="" id="cobro-form">
          <h3>Reservacion {data.idReservacion}</h3>
          <h4>Cliente {data.cliente}</h4>
          <table className="table-details">
            <thead>
              <tr>
                <th>Entrega</th>
                <th>Recepcion</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{data.fechaEntrega.slice(0, 10)}</td>
                <td>{data.fechaRecepcion.slice(0, 10)}</td>
                <td>{data.status}</td>
              </tr>
            </tbody>
          </table>
          <table className="table-mobiliario">
            <thead>
              <tr>
                <th>ID</th>
                <th>Presentacion</th>
                <th>Cantidad</th>
                <th>Precio</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {dataTable.length > 0
                ? dataTable.map((el) => (
                    <tr key={el.id}>
                      <td>{el.id}</td>
                      <td>{el.presentacion}</td>
                      <td>{el.cantidad}</td>
                      <td>${el.precio}</td>
                      <td>${el.subtotal}</td>
                    </tr>
                  ))
                : ""}
              <tr>
                <td
                  colSpan={4}
                  style={{ textAlign: "right", fontWeight: "bolder" }}
                >
                  Total
                </td>
                <td>${dataReservacion.total}</td>
              </tr>
            </tbody>
          </table>
        </form>
        <div className="cobro-bottom-container">
          <div className="modal-content">
            <label htmlFor="pago-box">Pago</label>
            <input type="number" id="pago-box" onChange={handlePagoChange} autoFocus/>
          </div>
          <label id="resultado-pago"></label>
          <input
            type="button"
            value="Cobrar"
            className="btn"
            onClick={returnToReservaciones}
          />
        </div>
      </div>
    </div>
  );
}

export default CobroReservacion;
/*

{presentaciones.length > 0 ? 
              // <tr><td>test</td></tr>
              (
              presentaciones.map((pres) => {
              
                // if (Object.keys(dataCobro).length > 0) alert("test")
                  // return dataCobro.reservPrestamoList.map((res) => {
                  //   return res.idPresentacion == pres.id ? (
                  //     <tr key={pres.id}>
                  //       <td>{pres.id}</td>
                  //       <td>{pres.descripcion}</td>
                  //       <td>{res.cantidad}</td>
                  //       <td>{pres.precio}</td>
                  //       <td>{res.cantidad * pres.precio}</td>
                  //     </tr>
                  //   ) : (
                  //     <tr><td></td></tr>
                  //   );
                  // });
              })
            )
             : (
              <tr>
                <td>Cargando</td>
              </tr>
            )}
            <tr>
              <td colSpan={4} style={{ textAlign: "right" }}>
                <b>Total:</b>
              </td>
              <td style={{ textAlign: "left" }}> {dataCobro.total}</td>
            </tr>
*/
