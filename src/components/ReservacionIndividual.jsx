function ReservacionIndividual({ data, handleClick }) {
  
  return (
    <tr className="row-reservacion" onClick={()=>handleClick(data)}>
      <td>{data?.idReservacion}</td>
      <td className="td-cliente">{data?.cliente}</td>
      <td>{data?.fechaEntrega.slice(0, 10)}</td>
      <td>{data?.fechaRecepcion.slice(0, 10)}</td>
      <td className="td-status">{data?.status}</td>
    </tr>
  );
}

export default ReservacionIndividual;
