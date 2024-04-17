import { useEffect, useState } from "react";
import { helpHttp } from "../../helpers/helpHttp";
import { helpHost } from "../../helpers/helpHost";

// eslint-disable-next-line react/prop-types
function CatalogoTiposMobiliario() {
  const [tiposMobiliario, setTiposMobiliario] = useState([]);
  const [lista, setLista] = useState({});
  const [updateTipo, setUpdateTipo] = useState({});

  let api = helpHttp();
  let host = helpHost().getIp();
  let url = `http://${host}:8080/tipoMobiliario`;

  let options = {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
      "Content-Type": "application/json",
    },
  };

  // Obtiene la informacion del servidor
  async function getTiposMobiliario() {
    let options = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
        "Content-Type": "application/json",
      },
    };
    api.get(url, options).then((res) => {
      // console.log(res);
      setTiposMobiliario(res.content);
      setLista(res.content);
    });
  }

  // Realiza la carga de clientes inicial
  useEffect(() => {
    getTiposMobiliario();
    const $searchBtn = document.getElementById("agregarBtn");
    $searchBtn.disabled=true;
    // console.log(Object.keys(updateTipo).length)
  }, []);

  function handleTextChange() {
    const $searchBtn = document.getElementById("agregarBtn");
    const $search = window.document.querySelector("#search-box");
    if($search.value!="")$searchBtn.disabled=false;
    if(Object.keys(updateTipo).length>0){
      let newData = {...updateTipo, nombre:$search.value};
      setUpdateTipo(newData);
    }else{
      let regExp = new RegExp($search.value, "gi");
      setLista(
        tiposMobiliario.filter((el) => {
          if (regExp.test(el.id)) return el;
          if (regExp.test(el.nombre)) return el;
        })
      );
    }
  }

  function handleClickAgregar() {
    const $search = window.document.querySelector("#search-box");
    const $searchBtn = document.getElementById("agregarBtn");
    let url = `http://${host}:8080/tipoMobiliario`;
    let options2 = {
      ...options,
      body: {
        nombre: $search.value,
      },
    };
    if ($searchBtn.value == "Agregar") {
      alert("Agregando")
      // console.log(options2)
      api
        .post(url, options2)
        .then((res) => {
          // console.log(res);
          $search.value = "";
          handleTextChange();
          getTiposMobiliario();
          $searchBtn.disabled=true;
        })
        .catch((err) => console.log(err));
      } else {
        alert("Actualizando")
      options2 ={...options2,
        body:{
          id: updateTipo.id,
          nombre: updateTipo.nombre
      }}
      // console.log(options2)
      api.put(url,options2).then((res)=>{
        // console.log(res);
        $search.value = "";
        handleTextChange();
        setUpdateTipo({});
        getTiposMobiliario();
        $searchBtn.disabled=true;
      }).catch((err)=>console.error(err));
    }
  }

  function handleDelete(data, e) {
    e.stopPropagation();
    let url = `http://${host}:8080/tipoMobiliario/${data.id}`;
    api
      .del(url, options)
      .then((res) => {
        res.message && alert(res.message);
        getTiposMobiliario();
      })
      .catch((err) => console.log(err));
  }

  function handleUpdate(dataToUpdate) {
    const $search = document.getElementById("search-box");
    
    setUpdateTipo(dataToUpdate);

    $search.value = dataToUpdate.nombre;
  }
  return (
    <>
      <div className="client-search-container">
        <input
          type="text"
          name=""
          id="search-box"
          autoComplete="off"
          className="search-box"
          placeholder="Filtrar Mobiliario"
          autoFocus
          onChange={handleTextChange}
        />
        <input
          type="button"
          value={Object.keys(updateTipo).length > 0 ? "Actualizar" : "Agregar"}
          className="btn"
          id="agregarBtn"
          onClick={handleClickAgregar}
        />
      </div>
      <table className="clients-table" style={{textAlign:"center"}}>
        <thead>
          <tr>
            <th>Id</th>
            <th>Tipo</th>
            
          </tr>
        </thead>
        <tbody>
          {tiposMobiliario.length > 0 ? (
            lista.map((el) => {
              return (
                <tr
                  key={el.id}
                  style={el.active == 0 ? { color: "red" } : { color: "black" }}
                  onClick={() => handleUpdate(el)}
                >
                  <td>{el.id}</td>
                  <td>{el.nombre}</td>
                  <td className="td-btn-container">
                    <input
                      type="button"
                      value="Eliminar"
                      className="btn btn-delete"
                      onClick={(e) => handleDelete(el, e)}
                    />
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={4}>Sin Mobiliario que mostrar</td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  );
}

export default CatalogoTiposMobiliario;
