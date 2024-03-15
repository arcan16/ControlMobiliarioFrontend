import { useEffect, useState } from "react";
import { helpHttp } from "../../helpers/helpHttp";
import { helpHost } from "../../helpers/helpHost";

function ReservacionesAgendadasVigentes() {
  const [reservacionesVigentes, setReservacionesVigentes] = useState(0);
  let api = helpHttp();
  let host = helpHost().getIp();
  let url = `http://${host}:8080/reservacion/vigentes`;
  // let url = "http://192.168.1.69:8080/reservacion/vigentes";
  // let url = "http://localhost:8080/reservacion/statusOne";
  let options = {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  };

  function getReservaciones(api) {
    api.get(url, options).then((data) => {
      // console.log(data.content.length);
      setReservacionesVigentes(data.content.length);
    });
  }

  useEffect(() => {
    getReservaciones(api);
  }, []);
  return (
    <div className="data-card">
      <h2>{reservacionesVigentes}</h2>
      <h3>Reservaciones Vigentes</h3>
    </div>
  );
}

export default ReservacionesAgendadasVigentes;
