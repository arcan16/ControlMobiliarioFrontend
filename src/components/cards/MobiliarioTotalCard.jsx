import { useEffect, useState } from "react";
import { helpHttp } from "../../helpers/helpHttp";
import MobiliarioIndividual from "../MobiliarioIndividual";
import { helpHost } from "../../helpers/helpHost";

function MobiliarioTotalCard() {
  const [mobiliario, setMobiliario] = useState([]);
  let api = helpHttp();
  let host = helpHost().getIp();
  let url = `http://${host}:8080/mobiliario`;
  // let url = "http://192.168.1.69:8080/mobiliario";
  // let url = "http://localhost:8080/mobiliario";
  let options = {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  };

  async function getReservaciones() {
    // let dat = await  api.get(url, options).then(res=>res);
    // setMobiliario(dat.content);
    api.get(url, options).then((res) => setMobiliario(res.content));
  }

  useEffect(() => {
    getReservaciones();
  }, []);

  return (
    <div className="data-card cardx2">
      <h3>Inventario</h3>
      {mobiliario.length > 0
        ? mobiliario.map((el) => <MobiliarioIndividual key={el.id} data={el} />)
        : "Cargando"}
    </div>
  );
}

export default MobiliarioTotalCard;
