import { useEffect, useState } from "react";
import { helpHttp } from "../../helpers/helpHttp";
import { helpHost } from "../../helpers/helpHost";
// import ModalReservaciones from "../../components/ModalReservaciones";
import AddClientCard from "./AddClientCard";
import Modal from "../Modal";
import EdithClient from "./EdithClient";
// import AddClientCard from "./AddClientCard";

// eslint-disable-next-line react/prop-types
function CatalogoClientes({ setCliente, closeModal }) {
  const [clientes, setClientes] = useState([]);
  const [lista, setLista] = useState([]);

  const [modal2, setModal2] = useState(true);
  const [isOpen2, setIsOpen2] = useState(false);
  // const [dataModal2, setDataModal2] = useState(null);

  const [addCliente, setAddCliente] = useState(0)

  let api = helpHttp();
  let host = helpHost().getIp();
  let url = `http://${host}:8080/clients`;

  let options = {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  };

  // Obtiene la informacion del servidor
  async function getClients() {
    api.get(url, options).then((res) => {
      setClientes(res.content);
      setLista(res.content);
    });
  }

  // Realiza la carga de clientes inicial
  useEffect(() => {
    getClients();
  }, [addCliente]);

  function handleTextChange() {
    const $search = window.document.querySelector("#search-box");
    let regExp = new RegExp($search.value, "gi");

    setLista(
      clientes.filter((el) => {
        if (regExp.test(el.id)) return el;
        if (regExp.test(el.nombre)) return el;
        if (regExp.test(el.direccion)) return el;
      })
    );
  }

  function handleClientSelected(data) {
    setIsOpen(true);
    setModal(true);
    setClientToEdith(data);
  }

  function handleClienteClick() {
    setIsOpen2(true);
    setModal2(true);
  }
  
  function closeModal2() {
    setModal2(false);
  }

  // Comienza comportamiento para modal de edicion

  const [modal, setModal] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [clientToEdith, setClientToEdith] = useState(null);

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
          placeholder="Buscar cliente"
          autoFocus
          onChange={handleTextChange}
        />
        <input
          type="button"
          value="Agregar"
          className="btn"
          onClick={handleClienteClick}
        />
      </div>
      <table className="clients-table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Nombre</th>
            <th>Direccion</th>
            <th>Telefono</th>
          </tr>
        </thead>
        <tbody>
          {clientes.length > 0 ? (
            lista.map((el) => {
              return (
                <tr key={el.id} onClick={() => handleClientSelected(el)} style={el.active==0?{color:"red"}:{color:"black"}}>
                  <td>{el.id}</td>
                  <td>{el.nombre}</td>
                  <td>{el.direccion}</td>
                  <td>{el.telefono}</td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={4}>Sin Clientes que mostrar</td>
            </tr>
          )}
        </tbody>
      </table>
      {modal2 ? (
        <Modal closeModal={closeModal2} isOpen={isOpen2}>
          <AddClientCard closeModal={closeModal2} addCliente={addCliente} setAddCliente={setAddCliente}/>
        </Modal>
      ) : null}
      {modal ?(<Modal closeModal={closeModal} isOpen={isOpen}>
        <EdithClient closeModal={closeModal} data={clientToEdith} setClientToEdith={setClientToEdith} setLista={setLista} clientes={clientes} setClientes={setClientes}/>
    </Modal>):null}
    </>
  );
}

export default CatalogoClientes;
