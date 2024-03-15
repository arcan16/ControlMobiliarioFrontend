function MobiliarioIndividual({data}) {
  return (
      <div className="individual-box">
        <p className="desc-card">Tipo: <b>{data.tipo}</b></p>
        <p className="desc-card">Descripcion: <b>{data.descripcion}</b></p>
        <p className="desc-card">Cantidad: <b>{data.cantidad}</b></p>
      </div>
  );
}

export default MobiliarioIndividual;
