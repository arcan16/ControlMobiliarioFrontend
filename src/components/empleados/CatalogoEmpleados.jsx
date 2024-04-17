import { useEffect, useState } from "react";
import { helpHttp } from "../../helpers/helpHttp";
import { helpHost } from "../../helpers/helpHost";
import Modal from "../Modal";
// import UpdateUser from "./UpdateUser";
// import AddUser from "./AddUser";

// eslint-disable-next-line react/prop-types
function CatalogoEmpleados() {
  const [employees, setemployees] = useState([]);
  const [lista, setLista] = useState([]);

  const [addMobil, setAddMobil] = useState(0);

  let api = helpHttp();
  let host = helpHost().getIp();
  let url = `http://${host}:8080/employees`;

  let options = {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  };

  // Obtiene la informacion del servidor
  async function getEmployees() {
    api.get(url, options).then((res) => {
      setemployees(res.content);
      setLista(res.content);
    });
  }

  // Realiza la carga de clientes inicial
  useEffect(() => {
    getEmployees();
  }, [addMobil]);

  function handleTextChange() {
    const $search = window.document.querySelector("#search-box");
    let regExp = new RegExp($search.value, "gi");

    setLista(
      employees.filter((el) => {
        if (regExp.test(el.id)) return el;
        if (regExp.test(el.nombre)) return el;
        if (regExp.test(el.apellido)) return el;
        if (regExp.test(el.direccion)) return el;
      })
    );
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
        {/* <input
          type="button"
          value="Agregar"
          className="btn"
          // onClick={handleMobilClick}
        /> */}
      </div>

      <table className="users-table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Nombre</th>
            <th style={{ width: "100px" }}>Apellido</th>
            <th>Direccion</th>
          </tr>
        </thead>
        <tbody>
          {employees.length > 0 ? (
            lista.map((el) => {
              return (
                <tr
                  key={el.id}
                  // onClick={() => handleClientSelected(el)}
                  style={el.active == 0 ? { color: "red" } : { color: "black" }}
                >
                  <td>{el.id}</td>
                  <td>{el.nombre}</td>
                  <td style={{ width: "100px" }}>{el.apellido}</td>
                  <td>{el.direccion}</td>
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
      {/* {modal2 ? (
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
      ) : null} */}
    </>
  );
}

export default CatalogoEmpleados;
