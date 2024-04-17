import { useEffect, useState } from "react";
import { helpHost } from "../../helpers/helpHost";
import { helpHttp } from "../../helpers/helpHttp";

function EdithPresentation({
  closeModal,
  getPresentation,
  mobilToEdith,
  setMobilToEdith,
}) {
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
      })
      .catch((err) => alert("Error"));
  }

  useEffect(() => {
    getMobiliario();
    setAddData(mobilToEdith);
    console.log(mobilToEdith)
    setListaMobiliario(mobilToEdith.presentacionMobiliarioDTOList);
  }, []);

  function handleChangeText(e) {
    setMobilToEdith({ ...mobilToEdith, [e.target.name]: e.target.value });
    console.log(mobilToEdith)
  }

  function addToList(e) {
    const $form = document.querySelector(".data-section-modal-form.f2");
    const $cantidad = document.getElementById("cantidad");

    if ($form.cantidad.value == "" || parseInt($form.cantidad.value) < 1) {
      $form.cantidad.select();
      return alert("Ingresa una cantidad valida");
    }

    if (e.target.value == "Agregar") {
      if (addData != undefined) {
        mobiliario.forEach((mob) => {
          if (mob.id == addData.id) {
            if (mob.cantidad < $form.cantidad.value) {
              alert("La cantidad excede las existencias");
              throw new Error("La cantidad excede las existencias");
            }
          }
        });

        let exists = listaMobiliario.find((el) => {
          if (el.Mobiliario == $form.mobiliario.value) {
            return el;
          }
        });

        // Agregar a registro preexistente
        if (exists != undefined) {
          let newData = listaMobiliario.map((el) => {
            return el.Mobiliario == $form.mobiliario.value
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
          let dataMobil= mobiliario.find(el=>{
              if(el.descripcion==$form.mobiliario.value){
                return el;
              }
          });
          setListaMobiliario([
            ...listaMobiliario,
            {
              idMobiliario: dataMobil.id,
              Mobiliario: $form.mobiliario.value,
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
      let actualMob = mobiliario.find(
        (el) => el.descripcion == $form.mobiliario.value
      );
      if (addData == undefined || validMob < 0) {
        $form.mobiliario.select();
        return alert("Ingresa mobiliario valido");
      }

      let mobActual = listaMobiliario.find(
        (el) => el.Mobiliario == $form.mobiliario.value
      );
      console.log(mobActual)
      let newData = listaMobiliario.map((el) => {
        return el.Mobiliario == $form.mobiliario.value
          ? {
              idMobiliario:actualMob.id,
              cantidad: $form.cantidad.value,
              Mobiliario: mobActual.Mobiliario,
            }
          : el;
      });
      console.log(newData)
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
    const $form = document.querySelector(".data-section-modal-form.f2");
    $form.mobiliario.value = mob.Mobiliario;
    $form.cantidad.value = mob.cantidad;
    $form.mobiliario.disabled = true;
    setIsEdith(true);
  }
  // Elimina un registro de la lista de mobiliario
  function handleRemove(mob, e) {
    e.stopPropagation();

    if (mob.id) alert("id");
    let newData = listaMobiliario.filter(
      (el) => el.idMobiliario != mob.idMobiliario
    );
    setListaMobiliario(newData);
    const $form = document.querySelector(".data-section-modal-form.f2");
    $form.mobiliario.value = "";
    $form.cantidad.value = "";
  }

  // Controla el comportamiento del boton Limpiar
  function handleClean() {
    let confirmacion = confirm("Deseas limpiar?");
    if (confirmacion) {
      const $form = document.querySelector(".data-section-modal-form.f2");
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

  function handleUpdatePresentation(e) {
    let url = `http://${host}:8080/presentation/all`;
    const $form = document.querySelector(".data-section-modal-form.f2");
    console.log($form);

    if ($form.descripcion.value == "") {
      $form.descripcion.focus();
      return alert("Debes colocar una descripcion para continuar");
    }
    if ($form.precio == "" || parseFloat($form.precio) <= 1) {
      $form.precio.select();
      return alert("Ingresa un precio valido (positivo)");
    }

    options = {
      ...options,
      body: {
        id:mobilToEdith.id,
        descripcion: $form.descripcion.value,
        precio: $form.precio.value,
        updatePresentationMobiliarioDTOList: listaMobiliario.map((mob) => {
          return {
            idMobiliario: mob.idMobiliario,
            cantidad: mob.cantidad,
          };
        }),
      },
    };
    console.log(options);
  
    api.put(url,options).then((res)=>{
      if(!res.id)throw Error("Fallo en la transaccion");
      getPresentation();
    }).catch(er=>console.log(er));
    closeModal();
  }
  
  function handleDelete(e){
    console.log(mobilToEdith)
    let url = `http://${host}:8080/presentation/${mobilToEdith.id}`;

    api.del(url,options).then(res=>{
      console.log(res.message);
      getPresentation();
    }).catch(err=>console.log(err))
    closeModal();
  }
  return (
    <section className="add-client-modal-content">
      <h2 style={{ textAlign: "center", marginTop: "2.5rem" }}>
        Actualizar Presentacion de Mobiliario
      </h2>
      
      <div className="form-container">
      <div className="delete-container">
          <input
            type="button"
            className="btn btn-red"
            value="Eliminar"
            onClick={handleDelete}
          />
        </div>
        <form className="data-section-modal-form f2">
          
          <label htmlFor="descripcion">Descripcione</label>
          <input
            type="text"
            name="descripcion"
            id="descripcion"
            value={mobilToEdith.descripcion}
            onChange={handleChangeText}
          />

          <label htmlFor="precio">Precio</label>
          <input
            type="number"
            name="precio"
            id="precio"
            value={mobilToEdith.precio}
            onChange={handleChangeText}
          />

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
                    <tr key={mob.idMobiliario} onClick={() => handleEdith(mob)}>
                      <td>-{mob.Mobiliario}</td>
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
              onClick={(e)=>handleUpdatePresentation(e)}
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

export default EdithPresentation;
