import { useEffect } from "react";

function ItemLIsta({data,total, setTotal,lista, handleClickEdit}) {
    // useEffect(() => {
    //     let subTotal=0.0;
    //     lista.forEach(element => {
    //         subTotal+=(parseFloat(element.cantidad)*parseFloat(element.precio));
    //     });
    //     setTotal(subTotal)      
    // }, [])
    

    return ( 
    <tr key={data.id} onClick={()=>handleClickEdit(data)}>
        <td>{data.id}</td>
        <td>{data.descripcion}</td>
        <td className="td-center-tx">{data.cantidad}</td>
        <td className="td-center-tx">${data.cantidad*data.precio}</td>
    </tr> 
    );
}

export default ItemLIsta;