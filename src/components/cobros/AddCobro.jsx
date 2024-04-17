import { NavLink } from "react-router-dom";
import returnImg from "../../assets/icons/return.svg";
import { useEffect, useState } from "react";
import { helpHttp } from "../../helpers/helpHttp";
import { helpHost } from "../../helpers/helpHost";

function AddCobro() {
  const [search, setSearch] = useState("");
  const [reservacion, setReservacion] = useState({});
  const [importe, setImporte] = useState("");
  const [diferencia, setDiferencia] = useState(0);

  // Actualiza el estado del valor de la busqueda
  function handleUpdateSearch(e) {
    setSearch(e.target.value);
  }

  // Controla la peticion de la busqueda
  function handleSearch() {
    if (reservacion != "") getReservacion();
  }

  /* Inicia declaracion de variables utilizadas para las peticiones al servidor */
  let api = helpHttp();
  let host = helpHost().getIp();
  let url = `http://${host}:8080/cobros/total/${search}`;
  
  let options = {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
      "Content-Type": "application/json",
    },
  };
  /* Finaliza declaracion utilizadas para las peticiones al servidor */

  // Realiza la peticion de datos de la reservacion al servidor
  function getReservacion() {
    api
      .get2(url, options)
      .then((res) => {
        console.log(res);
        if(res.status=="3"){
          setReservacion({});
          return alert("La reservacion fue cancelada!")
        }
        if(res.status=="0"){
          setReservacion({});
          return alert("La reservacion no ha sido entregada")
        }
        if(res.status=="2"){
          setReservacion({});
          return alert("La reservacion ya ha sido cobrada")
        }
        setReservacion(res);
      })
      .catch((err) => {
        alert(err.err);
        console.log(err);
      });
  }
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
      year: "2-digit",
    });
    return fecha;
  }

  // Actualiza el estado del importe
  function handleChangeImporte(e) {
    setImporte(e.target.value);
  }

  // Muestra o esconde el input de diferencia y actualiza su contenido de acuerdo al importe recibido
  useEffect(() => {
    const $diferencia = document.getElementById("diferencia");
    if (importe == "" && $diferencia != null)
      $diferencia.classList.add("hidden");
    if (parseFloat(importe) > 0.0001 || importe != "") {
      $diferencia.classList.remove("hidden");
      let total = parseFloat(importe) - parseFloat(reservacion.total);
      if (total < 0) {
        setDiferencia(
          `Faltan: ${Math.abs(importe - reservacion.total).toFixed(2)} pesos`
        );
      } else if (total > 0){
        setDiferencia(
          `Escede en: ${Math.abs(importe - reservacion.total).toFixed(2)} pesos`
        );
      }else if (total > 0.00001 || total < 0.00001) {
        setDiferencia(
          `Importe exacto`
        );
      }
    }
  }, [importe]);

  // Restringe el ingreso de caracteres al input de importe
  function handleKeyDown(e) {
    if (e.key == "-" || e.key == "+" || e.key == "e" || e.key == "E")
      e.preventDefault();
  }



  // Controla la peticion al servidor para crear el cobro
  function handleCobro() {
    const $montoRecibido = document.getElementById("cobro");

    if ($montoRecibido.value == "")
      return alert("El pago no ha sido registrado, favor de verificar!");

    if (reservacion.total - parseFloat($montoRecibido.value) > 0.001)
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
        idReservacion: reservacion.idReservacion,
        total: reservacion.total,
      },
    };
    api
      .post(url, options)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => alert(err));

    location.href = "/cobros";
  }


  return (
    <section className="section-container">
      <div className="nav-return-container">
        <NavLink to="/cobros">
          <img src={returnImg} className="icon-img" alt="" />
        </NavLink>
        <h1>Recepcion Mobiliario</h1>
      </div>
      <div className="main-content">
        <div className="search-container">
          <input
            type="number"
            className="filter-search-input"
            placeholder="Numero de reservacion"
            onChange={handleUpdateSearch}
            value={search}
            autoFocus
          />
          <input
            type="button"
            value="Buscar"
            className="filter-search-btn"
            onClick={handleSearch}
          />
        </div>
        {Object.keys(reservacion).length > 0 ? (
          <>
            <table className="data-table" key="reservation-table">
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Entrega</th>
                  <th>Recepcion</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{reservacion.cliente}</td>
                  <td>{parseaFecha(reservacion.fechaEntrega)}</td>
                  <td>{parseaFecha(reservacion.fechaRecepcion)}</td>
                  <td>${reservacion.total}</td>
                </tr>
                <tr>
                  <th>Id</th>
                  <th colSpan={2}>Descripcion</th>
                  <th>Cantidad</th>
                </tr>
                {reservacion.reservPrestamoList.map((mob) => {
                  return (
                    <tr key={mob.idPresentacion}>
                      <td>{mob.idPresentacion}</td>
                      <td colSpan={2}>{mob.presentacion}</td>
                      <td>{mob.cantidad}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="cobro-bottom-container">
              <input
                type="number"
                name=""
                id="cobro"
                placeholder="Importe"
                value={importe}
                onKeyDown={handleKeyDown}
                onChange={handleChangeImporte}
                style={{ textAlign: "center" }}
              />
              <input
                type="text"
                name=""
                id="diferencia"
                className="hidden"
                value={diferencia}
                readOnly
              />
              <input type="button" value="Cobrar" className="btn" style={{marginBottom:"3rem"}} onClick={handleCobro}/>
            </div>
          </>
        ) : null}
      </div>
    </section>
  );
}

export default AddCobro;
