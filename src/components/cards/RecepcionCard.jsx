import { useEffect, useState } from "react";
import { helpHttp } from "../../helpers/helpHttp";
import EntregaIndividual from "../EntregaIndividual";
import { helpHost } from "../../helpers/helpHost";

function RecepcionCard() {
  const [recepcion, setRecepcion] = useState([]);
  let api = helpHttp();
  let host = helpHost().getIp();
  let url = `http://${host}:8080/reservacion/recepcion`;
  // let url = "http://192.168.1.69:8080/reservacion/recepcion";
  // let url = "http://localhost:8080/mobiliario";
  let options = {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  };

  async function getEntregas() {
    // let dat = await  api.get(url, options).then(res=>res);
    // setMobiliario(dat.content);
    api.get(url, options).then((res) => setRecepcion(res.content));
  }

  useEffect(() => {
    getEntregas();
  }, []);

  return (
    <div className="data-card cardx2">
      <h3>Recepciones programadas para hoy</h3>
      {recepcion.length > 0
        ? recepcion.map((el) => (
            <EntregaIndividual key={el.idReservacion} data={el} />
          ))
        : "Sin recepciones programadas para hoy"}
    </div>
  );
}

export default RecepcionCard;
