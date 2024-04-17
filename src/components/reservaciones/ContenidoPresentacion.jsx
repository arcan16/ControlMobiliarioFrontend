import { useEffect, useState } from "react";

function ContenidoPresentacion({data}) {
    return ( 
        <article className="add-description-container">
            <table>
                <thead>
                    <tr>
                        <th>Descripcion</th>
                        <th>Contenido</th>
                        <th>Precio</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{data.descripcion}</td>
                        
                        <td>
                            {
                                data.presentacionMobiliarioDTOList.map(element => {
                                    return <div className="content-td" key={element.idMobiliario}>- {element.cantidad} {element.Mobiliario}</div>
                                })
                            }
                        </td>
                        <td>{data.precio}</td>
                    </tr>
                </tbody>
            </table>
        </article>
     );
}

export default ContenidoPresentacion;