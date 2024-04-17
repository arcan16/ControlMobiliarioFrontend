import { useEffect, useState } from "react";
import { helpHttp } from "../../helpers/helpHttp";
import { helpHost } from "../../helpers/helpHost";
import Modal from "../Modal";
import UpdateUser from "./UpdateUser";
import AddUser from "./AddUser";

// eslint-disable-next-line react/prop-types
function CatalogoUsuarios() {
  const [users, setUsers] = useState([]);
  const [lista, setLista] = useState([]);

  const [addMobil, setAddMobil] = useState(0);

  let api = helpHttp();
  let host = helpHost().getIp();
  let url = `http://${host}:8080/users`;

  let options = {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  };

  // Obtiene la informacion del servidor
  async function getUsers() {
    api.get(url, options).then((res) => {
      setUsers(res.content);
      setLista(res.content);
    });
  }

  // Realiza la carga de clientes inicial
  useEffect(() => {
    getUsers();
  }, [addMobil]);

  function handleTextChange() {
    const $search = window.document.querySelector("#search-box");
    let regExp = new RegExp($search.value, "gi");

    setLista(
      users.filter((el) => {
        if (regExp.test(el.id)) return el;
        if (regExp.test(el.username)) return el;
        if (regExp.test(el.email)) return el;
        if (regExp.test(el.rol)) return el;
      })
    );
  }

  // Comienza comportamiento para modal de edicion

  const [modal, setModal] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [mobilToEdith, setMobilToEdith] = useState(null);

  function handleClientSelected(data) {
    setIsOpen(true);
    setModal(true);
    setMobilToEdith(data);
  }

  /* Apertura del modal */
  function handleClick() {
    setIsOpen(true);
    setModal(true);
  }
  /* Cierre del modal */
  function closeModal() {
    setModal(false);
  }

  // Finaliza comportamiento para modal de edicion

  /* Comienza comportamiento para modal AddUsers */
  const [modal2, setModal2] = useState(true);
  const [isOpen2, setIsOpen2] = useState(false);

  function handleMobilClick() {
    setIsOpen2(true);
    setModal2(true);
  }
  function closeModal2() {
    setModal2(false);
  }
  /* Finaliza comportamiento para modal AddUsers */

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

      <table className="users-table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Usuario</th>
            <th style={{ width: "100px" }}>Email</th>
            <th>Rol</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            lista.map((el) => {
              return (
                <tr
                  key={el.id}
                  onClick={() => handleClientSelected(el)}
                  style={el.active == 0 ? { color: "red" } : { color: "black" }}
                >
                  <td>{el.id}</td>
                  <td>{el.username}</td>
                  <td style={{ width: "100px" }}>{el.email}</td>
                  <td>{el.rol}</td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={4}>Sin Usuarios que mostrar</td>
            </tr>
          )}
        </tbody>
      </table>
      {modal2 ? (
        <Modal closeModal={closeModal2} isOpen={isOpen2}>
          <AddUser
            getUsers={getUsers}
            closeModal={closeModal2}
            addMobil={addMobil}
            setAddMobil={setAddMobil}
          />
        </Modal>
      ) : null}
      {modal ? (
        <Modal closeModal={closeModal} isOpen={isOpen}>
          <UpdateUser
            closeModal={closeModal}
            data={mobilToEdith}
            getUsers={getUsers}
          />
        </Modal>
      ) : null}
    </>
  );
}

export default CatalogoUsuarios;
