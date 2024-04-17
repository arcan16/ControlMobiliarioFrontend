function ReservacionIndividual({ data, handleClick }) {
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
      month:"short",
      day: "2-digit",
    });
    return fecha;
  }
  return (
    <tr className="row-reservacion" onClick={() => handleClick(data)}>
      <td>{data?.idReservacion}</td>
      <td className="td-cliente">{data?.cliente}</td>
      <td>{parseaFecha(data.fechaEntrega)}</td>
      <td>{parseaFecha(data.fechaRecepcion)}</td>
      {/* <td>{data?.fechaRecepcion.slice(0, 10)}</td> */}
      <td className="td-status">
        {data.status == 0
          ? "No entregado"
          : data.status == 1
          ? "Entregado"
          : data.status == 2
          ? "Recibido"
          : data.status == 3
          ? "Cancelado"
          : "Error"}
      </td>
    </tr>
  );
}

export default ReservacionIndividual;
