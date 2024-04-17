import { useEffect, useState } from "react";
import { helpHost } from "../../helpers/helpHost";
import { helpHttp } from "../../helpers/helpHttp";
import { NavLink } from "react-router-dom";

function CatalogoCobros() {
  const [lista, setLista] = useState([]);
  const [cobros, setCobros] = useState({});
  const [dateFilter, setDateFilter] = useState("");
  const [total, setTotal] = useState(0);

  let api = helpHttp();
  let host = helpHost().getIp();
  // let url = `http://${host}:8080/cobros`;
  let options = {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
      "Content-Type": "application/json",
    },
  };

  // Realiza la peticion de cobros hechos al servidor
  function getCobros() {
    let url = `http://${host}:8080/cobros`;
    api
      .get(url, options)
      .then((res) => {
        console.log(res)
        setCobros(res.content);
        setLista(res.content);
      })
      .catch((err) => console.log(err));
  }

  useEffect(() => {
    getCobros();
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
      year: "2-digit",
    });
    return fecha;
  }

  function handleTextChange() {
    const $search = window.document.querySelector("#search-box");
    let regExp = new RegExp($search.value, "gi");

    setLista(
      cobros.filter((el) => {
        if (regExp.test(el.id)) return el;
        if (regExp.test(el.idReserva)) return el;
        if (regExp.test(el.id)) return el;
      })
    );
  }

  function filterDate(e) {
    setDateFilter(e.target.value);
  }

  function handleFilterDate() {
    const $datePicker = document.getElementById("date-picker");
    if ($datePicker.value != "") {
      let urlFilter = `http://${host}:8080/cobros/fecha`;
      let options2 = {
        ...options,
        body: {
          fecha: `${dateFilter}T00:00:00`,
        },
      };
      api
        .post(urlFilter, options2)
        .then((res) => {
          if (res.length > 0) {
            setLista(res);
          } else {
            alert("No tenemos cobros registrados en esta fecha");
            setLista(cobros);
          }
        })
        .catch((err) => console.log(err));
    } else {
      setLista(cobros);
    }
  }

  // Totaliza los montos de los cobros realizados
  useEffect(() => {
    let suma = 0;
    lista.forEach((cobro) => {
      if(cobro.valido){
        suma += cobro.total;
      }
    });
    setTotal(suma);
  }, [lista]);

  // Elimina el cobro seleccionado
  function deleteCobro(cobro) {
    let respuesta = confirm("Estas seguro de eliminar el cobro?");
    let urlDel = `http://${host}:8080/cobros/cancel/${cobro.id}`;
    let options = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
        "Content-Type": "application/json",
      },
    };
    if (respuesta) {
      console.log(cobro);
      api
        .del2(urlDel, options)
        .then((res) => {
          console.log("Registro cancelados");
          getCobros();
        })
        .catch((err) => console.log(err));
    }
  }
  return (
    <>
      <div className="client-search-container">
        <input
          type="text"
          name=""
          id="search-box"
          autoComplete="off"
          className="search-box"
          placeholder="Ingresa ID de Reservacion"
          autoFocus
          onChange={handleTextChange}
        />
      </div>
      <div className="filter-container">
        <input
          type="date"
          name=""
          id="date-picker"
          className="date-input"
          value={dateFilter}
          onChange={filterDate}
        />
        <input
          type="button"
          value="Buscar"
          className="btn"
          onClick={handleFilterDate}
        />
      </div>
      <table className="data-table">
        <thead>
          <tr>
            <th>Cobro</th>
            <th>Reserva</th>
            <th>Fecha</th>
            <th>Total</th>
            <th>Eliminar</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(cobros).length > 0 ? (
            lista.map((cobro) => {
              return (
                <tr key={cobro.id} className={cobro.valido?"green-text":"red-text"}>
                  <td>{cobro.id}</td>
                  <td>{cobro.idReserva}</td>
                  <td>{parseaFecha(cobro.fecha)}</td>
                  <td>${cobro.total}</td>
                  <td>
                    {cobro.valido && (<input
                      type="button"
                      value={cobro.valido?"❌":""}
                      className="btn btn-delete"
                      onClick={() => deleteCobro(cobro)}
                    />)}
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={4}>Vacio</td>
            </tr>
          )}
          <tr>
            <td
              colSpan={3}
              style={{ fontWeight: "bolder", textAlign: "right" }}
            >
              Total
            </td>
            <td>${total}</td>
          </tr>
        </tbody>
      </table>
    </>
  );
}

export default CatalogoCobros;
