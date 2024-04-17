function EntregaIndividual({ data }) {

  function getDaysDelay(fechaR){
    const fecha = fechaR.split("-");
    const opciones = {  day: '2-digit' , month: '2-digit', year: 'numeric'};
    
    let fecha1= new Date().toLocaleDateString('en',opciones);
    let fecha2 = new Date(fecha[2]+"-"+fecha[1]+"-"+fecha[0]).toLocaleDateString('es',opciones);
    
    let retraso = (new Date(fecha1)- new Date(fecha2))/(1000*60*60*24)
    
  if(retraso > 1){
    retraso = retraso + " dias";
  }else{
    retraso = retraso + " dia";
  }
    return retraso;
  }
  return (
    <div className="individual-box">
      <p className="desc-card">
        Cliente: <b>{data.cliente}</b>
      </p>
      <p className="desc-card">
        Direccion de entrega: <b>{data.direccionEntrega}</b>
      </p>
      <p className="desc-card">
        Entrega: <b>{data.fechaEntrega.slice(0,10)}</b>
      </p>
      <p className="desc-card">
        Recepcion: <b>{data.fechaRecepcion.slice(0,10)}</b>
      </p>
      <p className="desc-card">
        Status:{" "}
        <b>
          {new Date(data.fechaRecepcion) < new Date()
            ? "Retrasado "+getDaysDelay(data.fechaRecepcion.slice(0,10))
            : "A Tiempo"}
        </b>
      </p>
    </div>
  );
}

export default EntregaIndividual;
