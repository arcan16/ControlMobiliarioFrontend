import { useEffect, useState } from "react";
import { helpHttp } from "../../helpers/helpHttp";
import { helpHost } from "../../helpers/helpHost";
import Modal from "../Modal";
import EdithMobiliario from "./EdithPresentation";
import AddPresentationCard from "./AddPresentationCard";
import EdithPresentation from "./EdithPresentation";

// eslint-disable-next-line react/prop-types
function CatalogoPresentacion() {
  const [presentaciones, setPresentaciones] = useState([]);
  const [lista, setLista] = useState([]);

  const [modal2, setModal2] = useState(true);
  const [isOpen2, setIsOpen2] = useState(false);
  // const [dataModal2, setDataModal2] = useState(null);

  const [addMobil, setAddMobil] = useState(0);

  let api = helpHttp();
  let host = helpHost().getIp();
  let url = `http://${host}:8080/presentation`;

  let options = {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  };

  // Obtiene la informacion del servidor
  async function getPresentation() {
    api.get(url, options).then((res) => {
      setPresentaciones(res.content);
      setLista(res.content);
    });
  }

  // Realiza la carga de clientes inicial
  useEffect(() => {
    console.log("Solicitando datos")
    getPresentation();
  }, []);

  function handleTextChange() {
    const $search = window.document.querySelector("#search-box");
    let regExp = new RegExp($search.value, "gi");

    setLista(
      presentaciones.filter((el) => {
        if (regExp.test(el.id)) return el;
        if (regExp.test(el.tipo)) return el;
        if (regExp.test(el.descripcion)) return el;
        if (regExp.test(el.cantidad)) return el;
      })
    );
  }

  function handleClientSelected(data) {
    setIsOpen(true);
    setModal(true);
    setMobilToEdith(data);
  }
  function handleMobilClick() {
    setIsOpen2(true);
    setModal2(true);
  }
  function closeModal2() {
    setModal2(false);
  }

  // Comienza comportamiento para modal de edicion

  const [modal, setModal] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [mobilToEdith, setMobilToEdith] = useState(null);

  /* Apertura del modal */
  function handleClick() {
    setIsOpen(true);
    setModal(true);
  }
  /* Cierre del modal */
  function closeModal() {
    setModal(false);
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
          value="Agregar"
          className="btn"
          onClick={handleMobilClick}
        />
      </div>
      <table className="clients-table">
        <thead>
          <tr>
            {/* <th>Id</th> */}
            <th>Descripcion</th>
            <th>Precio</th>
          </tr>
        </thead>
        <tbody>
          {presentaciones.length > 0 ? (
            lista.map((el) => {
              return (
                <tr
                  key={el.id}
                  onClick={() => handleClientSelected(el)}
                  style={el.active == 0 ? { color: "red" } : { color: "black" }}
                >
                  {/* <td>{el.id}</td> */}
                  <td>{el.descripcion}</td>
                  <td>${el.precio}</td>
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
      {modal2 ? (
        <Modal closeModal={closeModal2} isOpen={isOpen2}>
          <AddPresentationCard
            lista={lista}
            setLista={setLista}
            closeModal={closeModal2}
            addMobil={addMobil}
            getPresentation={getPresentation}
            setAddMobil={setAddMobil}
          />
        </Modal>
      ) : null}
      {modal ? (
        <Modal closeModal={closeModal} isOpen={isOpen}>
          <EdithPresentation
            closeModal={closeModal}
            // data={mobilToEdith}
            lista={lista}
            mobilToEdith = {mobilToEdith}
            setMobilToEdith={setMobilToEdith}
            setLista={setLista}
            presentaciones={presentaciones}
            setPresentaciones={setPresentaciones}
            getPresentation={getPresentation}
          />
        </Modal>
      ) : null}
    </>
  );
}

export default CatalogoPresentacion;
