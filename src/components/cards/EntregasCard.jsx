import { useEffect, useState } from "react";
import { helpHttp } from "../../helpers/helpHttp";
import EntregaIndividual from "./EntregaIndividual";
import { helpHost } from "../../helpers/helpHost";

function EntregasCard() {
  const [entregas, setEntregas] = useState([]);
  let api = helpHttp();
  let host = helpHost().getIp();
  let url = `http://${host}:8080/reservacion/entregas`;
  // let url = "http://192.168.1.69:8080/reservacion/entregas";
  // let url = "http://localhost:8080/mobiliario";
  let options = {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  };

  async function getEntregas() {
    // let dat = await  api.get(url, options).then(res=>res);
    // setMobiliario(dat.content);
    api.get(url, options).then((res) => setEntregas(res.content));
  }

  useEffect(() => {
    getEntregas();
  }, []);

  function handleEntregasProgramadas(){
    // alert("Entregas programadas para hoy")
    location.href="/reservaciones";
  }

  return (
    <div className="data-card cardx2" onClick={handleEntregasProgramadas}>
      <h3>Entregas programadas para hoy</h3>
      {entregas.length > 0
        ? entregas.map((el) => (
            <EntregaIndividual key={el.idReservacion} data={el} />
          ))
        : "Sin entregas programadas para hoy"}
    </div>
  );
}

export default EntregasCard;
