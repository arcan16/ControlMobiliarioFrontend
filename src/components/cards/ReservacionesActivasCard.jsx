/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect, useState } from "react";
import { helpHttp } from "../../helpers/helpHttp";
import { helpHost } from "../../helpers/helpHost";

function reservacionesActivasCard() {
  const [reservacionesActivas, setReservacionesActivas] = useState(0);
  let api = helpHttp();
  let host = helpHost().getIp();
  let url = `http://${host}:8080/reservacion/statusOne`;
  // let url = "http://192.168.1.69:8080/reservacion/statusOne";
  // let url = "http://localhost:8080/reservacion/statusOne";
  let options = {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  };

  function getReservaciones(api) {
    api.get(url, options).then((data) => {
      setReservacionesActivas(data.content.length);
    });
  }
  
  useEffect(() => {
    getReservaciones(api);
  },[]);

  function handleClick(){
    location.href="/reservaciones";
    // alert("Prestamos activos")
  }
  return (
    <div className="data-card" onClick={handleClick}>
      <h2>{reservacionesActivas}</h2>
      <h3>Prestamos Activos</h3>
    </div>
  );
}

export default reservacionesActivasCard;
