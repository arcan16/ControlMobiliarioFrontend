import { useEffect, useState } from "react";
import { helpHttp } from "../../helpers/helpHttp";
import { helpHost } from "../../helpers/helpHost";
import ModalReservaciones from "../../components/ModalReservaciones";
import AddClientCard from "../clientes/AddClientCard";

function SelectClientCard({ setCliente, closeModal }) {
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

  async function getEntregas() {
    api.get(url, options).then((res) => {
      setClientes(res.content);
      setLista(res.content);
    });
  }

  useEffect(() => {
    getEntregas();
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
    setCliente(data);
    closeModal();
  }
  function handleClienteClick() {
    setIsOpen2(true);
    setModal2(true);
  }
  function closeModal2() {
    setModal2(false);
  }

  return (
    <>
      <h2>Buscar cliente</h2>
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
                <tr key={el.id} onClick={() => handleClientSelected(el)}>
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
        <ModalReservaciones closeModal={closeModal2} isOpen={isOpen2}>
          <AddClientCard closeModal={closeModal2} addCliente={addCliente} setAddCliente={setAddCliente}/>
        </ModalReservaciones>
      ) : null}
    </>
  );
}

export default SelectClientCard;
