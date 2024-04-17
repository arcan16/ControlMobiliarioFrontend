import { useEffect, useState } from "react";
import { helpHost } from "../../helpers/helpHost";
import { helpHttp } from "../../helpers/helpHttp";

function AddPresentationCard({ closeModal, addMobil, getPresentation ,setAddMobil, lista, setLista }) {
  const [mobiliario, setMobiliario] = useState([]);
  const [listaMobiliario, setListaMobiliario] = useState([]);
  const [addData, setAddData] = useState([]);
  const [isEdith, setIsEdith] = useState(false);

  let api = helpHttp();
  let host = helpHost().getIp();
  let url = `http://${host}:8080/mobiliario`;

  let options = {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
      "Content-Type": "application/json",
    },
  };

  // Obtiene los todos los registros de mobiliario
  function getMobiliario() {
    url = `http://${host}:8080/mobiliario`;
    api
      .get(url, options)
      .then((res) => {
        setMobiliario(res.content);
        // console.log(mobiliario);
      })
      .catch((err) => alert("Error"));
  }

  useEffect(() => {
    getMobiliario();
  }, []);
  
  
  

  function handleChangeText(e) {
    if (e.target.value != "") {
      setAddData(mobiliario.find((el) => el.descripcion == e.target.value));
    }
  }

  function addToList(e) {
    const $form = document.querySelector(".data-section-modal-form");
    const $cantidad = document.getElementById("cantidad");

    if ($cantidad.value == "" || parseInt($cantidad.value) < 1) {
      $form.cantidad.select();
      return alert("Ingresa una cantidad valida");
    }

    if (e.target.value == "Agregar") {
      if (addData != undefined) {
        // console.log(addData);

        mobiliario.forEach((mob) => {
          if (mob.id == addData.id) {
            if (mob.cantidad < $form.cantidad.value) {
              alert("La cantidad excede las existencias");
              throw new Error("La cantidad excede las existencias");
            }
          }
        });

        let exists = listaMobiliario.find((el) => el.id == addData.id);

        // Agregar a registro preexistente
        if (exists != undefined) {
          let newData = listaMobiliario.map((el) => {
            return el.id == addData.id
              ? {
                  ...el,
                  cantidad:
                    parseInt(el.cantidad) + parseInt($form.cantidad.value),
                }
              : el;
          });
          // console.log(newData);

          setListaMobiliario(newData);
        } else {
          setListaMobiliario([
            ...listaMobiliario,
            {
              id: addData.id,
              descripcion: addData.descripcion,
              cantidad: $form.cantidad.value,
            },
          ]);
        }
      }
    } else {
      // Comienza logica de actualizacion de registro
      mobiliario.forEach((mob) => {
        if (mob.id == addData.id) {
          if (mob.cantidad < $form.cantidad.value) {
            alert("La cantidad excede las existencias");
            throw new Error("La cantidad excede las existencias");
          }
        }
      });

      let validMob = mobiliario.findIndex(
        (el) => el.descripcion == $form.mobiliario.value
      );

      if (addData == undefined || validMob < 0) {
        $form.mobiliario.select();
        return alert("Ingresa mobiliario valido");
      }

      let mobActual = listaMobiliario.find(el=>el.descripcion==$form.mobiliario.value);
      let newData = listaMobiliario.map((el) => {
        return el.descripcion == $form.mobiliario.value
          ? {
              cantidad: $form.cantidad.value,
              descripcion: mobActual.descripcion,
            }
          : el;
      });
      setListaMobiliario(newData);
      $form.mobiliario.disabled = false;
      setIsEdith(false);
    }
    $form.mobiliario.value = "";
    $form.cantidad.value = "";
    $form.mobiliario.focus();
  }

  //
  function handleEdith(mob) {
    // const $btnChange = document.querySelector(".btn-change");
    const $form = document.querySelector(".data-section-modal-form");
    $form.mobiliario.value = mob.descripcion;
    $form.cantidad.value = mob.cantidad;
    $form.mobiliario.disabled = true;
    setIsEdith(true);

  }
  // Elimina un registro de la lista de mobiliario
  function handleRemove(mob, e) {
    e.stopPropagation();
    let newData = listaMobiliario.filter((el) => el.id != mob.id);
    setListaMobiliario(newData);
    const $form = document.querySelector(".data-section-modal-form");
    $form.mobiliario.value="";
    $form.cantidad.value="";
  }

  // Controla el comportamiento del boton Limpiar
  function handleClean() {
    let confirmacion = confirm("Deseas limpiar?");
    if (confirmacion) {
      const $form = document.querySelector(".data-section-modal-form");
      const $btnChange = document.querySelector(".btn-change");
      $form.mobiliario.value = "";
      $form.cantidad.value = "";
      $form.mobiliario.focus();
      $btnChange.value = "Agregar";
      setIsEdith(false);
      $form.mobiliario.disabled = false;
    }
  }

  function handleCancel() {
    let confirmacion = confirm("Deseas limpiar?");
    if (confirmacion) {
      closeModal();
    }
  }

  function handleSavePresentation(){
    let url = `http://${host}:8080/presentation`
    const $form = document.querySelector(".data-section-modal-form");
    if($form.descripcion.value==""){
      $form.descripcion.focus();
      return alert("Debes colocar una descripcion para continuar")
    }
    if($form.precio=="" || parseFloat($form.precio)<=1){
      $form.precio.select();
      return alert("Ingresa un precio valido (positivo)");
    }

    options = {...options, body:{description:$form.descripcion.value,precio:$form.precio.value,presentationMobiliarioList:listaMobiliario.map(mob=>{
      return {
        idMobiliario: mob.id,
        cantidad: mob.cantidad,
      }
    })}}
    console.log(options)
    console.log(listaMobiliario)
    console.log(lista);
    console.log([...lista, ...listaMobiliario.map(mob=>{
      return {
        descripcion: $form.descripcion.value,
        cantidad: $form.cantidad.value,
        precio: $form.precio.value
      }
    })])
    setLista([...lista, {
        descripcion: $form.descripcion.value,
        cantidad: $form.cantidad.value,
        precio: $form.precio.value
  }]);
    api.post(url,options).then((res)=>{
      console.log(res);
      getPresentation();
    }).catch(er=>console.log(er));
    
    closeModal();
  }

  return (
    <section className="add-client-modal-content">
      <h2 style={{ textAlign: "center", marginTop: "2.5rem" }}>
        Agregar Presentacion de Mobiliario
      </h2>

      <div className="form-container">
        <form className="data-section-modal-form">
          <label htmlFor="descripcion">Descripcion</label>
          <input type="text" name="descripcion" id="descripcion" />

          <label htmlFor="precio">Precio</label>
          <input type="number" name="precio" id="precio" />

          <label htmlFor="precio">Mobiliario</label>
          <input
            type="text"
            multiple
            name="mobiliario"
            id="mobiliario"
            list="listMobiliario"
            required
            className="mobiliario-input"
            onChange={handleChangeText}
          />
          <label htmlFor="cantidad">Cantidad</label>
          <input type="number" name="cantidad" id="cantidad" />
          <div
            className="section-content-btn-container"
            style={{ gridColumn: "span 2" }}
          >
            <input
              type="button"
              value={isEdith ? "Actualizar" : "Agregar"}
              className="btn btn-blue btn-change"
              onClick={(e) => addToList(e)}
            />
            <input
              type="button"
              value="Limpiar"
              className="btn btn-orange"
              onClick={handleClean}
            />
          </div>
          {listaMobiliario.length > 0 ? (
            <table className="presentation-mobil-table">
              <colgroup>
                <col style={{ width: "50vw" }} />
                <col style={{ width: "50px" }} />
                <col style={{ width: "50px" }} />
              </colgroup>
              <thead>
                <tr>
                  <th>Descripcion</th>
                  <th>Cantidad</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {listaMobiliario.map((mob) => {
                  return (
                    <tr key={mob.id} onClick={() => handleEdith(mob)}>
                      <td>-{mob.descripcion}</td>
                      <td>{mob.cantidad}</td>
                      <td>
                        <input
                          type="button"
                          value="Quitar"
                          className="btn btn-delete"
                          onClick={(e) => handleRemove(mob, e)}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            ""
          )}
          <div
            className="section-content-btn-container"
            style={{ gridColumn: "span 2" }}
          >
            <input
              type="button"
              value="Guardar"
              className="btn btn-green"
              onClick={handleSavePresentation}
            />
            <input
              type="button"
              value="Cancelar"
              className="btn btn-red"
              onClick={handleCancel}
            />
          </div>
        </form>
      </div>

      {mobiliario.length > 0 ? (
        <datalist id="listMobiliario">
          {mobiliario.map((item) => {
            return <option key={item.id}>{item.descripcion}</option>;
          })}
          ;
        </datalist>
      ) : (
        ""
      )}
    </section>
  );
}

export default AddPresentationCard;
