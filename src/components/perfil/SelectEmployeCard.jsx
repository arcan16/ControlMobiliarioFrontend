import { useEffect, useState } from "react";
import { helpHttp } from "../../helpers/helpHttp";
import { helpHost } from "../../helpers/helpHost";
import ModalReservaciones from "../ModalReservaciones";
import AddClientCard from "../clientes/AddClientCard";
import AddEmployeeCard from "./AddEmployeeCard";

function SelectEmployeCard({ setCliente, closeModal }) {
  const [employees, setEmployees] = useState([]);
  const [lista, setLista] = useState([]);

  const [modal2, setModal2] = useState(true);
  const [isOpen2, setIsOpen2] = useState(false);
  // const [dataModal2, setDataModal2] = useState(null);

  const [addEmployee, setaddEmployee] = useState(0)

  let api = helpHttp();
  let host = helpHost().getIp();
  let url = `http://${host}:8080/employees`;

  let options = {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  };

  async function getEntregas() {
    api.get(url, options).then((res) => {
      setEmployees(res.content);
      setLista(res.content);
    });
  }

  useEffect(() => {
    getEntregas();
  }, [addEmployee]);

  function handleTextChange() {
    const $search = window.document.querySelector("#search-box");
    let regExp = new RegExp($search.value, "gi");

    setLista(
      employees.filter((el) => {
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
  function handleEmployeeClick() {
    setIsOpen2(true);
    setModal2(true);
  }
  function closeModal2() {
    setModal2(false);
  }

  return (
    <>
      <h2>Buscar Empleado</h2>
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
          onClick={handleEmployeeClick}
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
          {employees.length > 0 ? (
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
              <td colSpan={4}>Sin Empleados que mostrar</td>
            </tr>
          )}
        </tbody>
      </table>
      {modal2 ? (
        <ModalReservaciones closeModal={closeModal2} isOpen={isOpen2}>
          <AddEmployeeCard closeModal={closeModal2} addEmployee={addEmployee} setaddEmployee={setaddEmployee}/>
        </ModalReservaciones>
      ) : null}
    </>
  );
}

export default SelectEmployeCard;