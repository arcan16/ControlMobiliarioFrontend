import { helpHost } from "../../helpers/helpHost";
import { helpHttp } from "../../helpers/helpHttp";

import { useEffect, useState } from "react";

function UpdateUser({ closeModal, data, getUsers }) {
  const [dataUser, setDataUser] = useState({});
  const [isEmployee, setIsEmployee] = useState(false);
  const [initialData, setInitialData] = useState({});
  const [isLinkData, setIsLinkData] = useState(false);

  let host = helpHost().getIp();
  let api = helpHttp();
  let url = "";
  let options = {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
      "Content-Type": "application/json",
    },
  };

  // Realiza la peticion de los datos del empelado ligados al usuario seleccionado hacia el servidor
  // y actualiza el estado "dataUser()"
  function getEmployeeData() {
    url = `http://${host}:8080/employees/myData/${data.username}`;
    api
      .get2(url, options)
      .then((res) => {
        let newData = { ...res, ...data };
        delete newData.password;
        setDataUser(newData);
        setInitialData(newData);
        setIsEmployee(true);
      })
      .catch((err) => {
        // console.log(err.statusText);
        let newData = { ...data };
        delete newData.password;
        setDataUser(newData);
      });
  }

  // Solicita los datos del empleado al servidor e inicialiiza el estado  "dataUser" con esos valores
  // mas los datos del elemento que fue seleccionado para edicion
  // Si no encuentra datos del empleado solo asigna los valores recibidos a traves de la propr data
  // del registro seleccionado para edicion
  // En caso de existir datos del empleado tambien actualiza el estado "isEmployee" a "true"
  useEffect(() => {
    getEmployeeData();
  }, []);

  // Controla el renderizado de elementos "password"
  function handleCheckPassword() {
    const $dataEmpleado = document.querySelectorAll(".password");
    $dataEmpleado.forEach((el) => el.classList.toggle("hidden"));
  }

  // Controla el renderizado de elementos "user-dada"
  function handleLoadEmpleado() {
    if (isEmployee) {
      const $dataEmpleado = document.querySelectorAll(".user-data");
      $dataEmpleado.forEach((el) => el.classList.toggle("hidden"));
    }
  }
  // Renderiza los elementos relacionados con los datos del empleado en caso de ser existir
  useEffect(() => {
    handleLoadEmpleado();
  }, [isEmployee]);

  // Controla la validacion de las contraseñas
  function handleValidatePasswords() {
    const $form = document.querySelector(".data-section-form.update");
    if ($form.password.value != $form.confirmPassword.value) {
      alert("Las contraseñas no coinciden, favor de verificar");
      $form.password.select();
    }
  }

  // Controla el renderizado de elementos "user-dada"
  function handleCheckEmpleado() {
    console.log("renderizado");

    const $dataEmpleado = document.querySelectorAll(".user-data");
    $dataEmpleado.forEach((el) => el.classList.toggle("hidden"));

    // Elimina los datos de empleado al des seleccionar "Enlazar datos de empleado"
    let newData = dataUser;
    delete dataUser.nombre;
    delete dataUser.apellido;
    delete dataUser.direccion;
    delete dataUser.telefono;
    setDataUser(newData);
  }

  // Controla el estado con la informacion del formulario
  function handleInputChanges(e) {
    setDataUser({ ...dataUser, [e.target.name]: e.target.value });
  }

  // Controla el comportamiento de actualizacion de datos
  // Controla las peticiones al servidor para actualizar el registro de usuario-empleado o usuario
  function updateData() {
    const $form = document.querySelector(".data-section-form.update");
    if (isEmployee || isLinkData) {
      alert("user link employee");
      validateCompleteForm($form); // Validamos formulario user-employee
      updateUserEmployee($form); // Creamos al usuario con sus datos de empleado
    } else {
      validateFormUser($form); // Validamos formulario user
      updateUser($form); // Creamos el usuario
    }
  }

  // Actualiza unicamente al usuario
  function updateUser($form) {
    let url2 = `http://${host}:8080/users/update`;
    let optionsUser = {
      ...options,
      body: {
        id: dataUser.id,
        username: dataUser.username,
        email: dataUser.email,
        rol: dataUser.rol,
      },
    };
    console.log(optionsUser)
    if ($form["check-password"].checked)
      optionsUser.body.password = dataUser.password;

    // console.log(optionsUser);
    api
      .put2(url2, optionsUser)
      .then((res) => {
        // console.log(res);
        getUsers();
        closeModal();
      })
      .catch((err) => {
        alert(err.statusText || err[0].campo + ": " + err[0].error);
        throw new Error(err);
      });
  }

  // Actualiza el registro del usuario y el de empleado
  function updateUserEmployee($form) {
    let url2 = `http://${host}:8080/users/updateComplete`;
    let optionsUserE = {
      ...options,
      body: {
        //Datos del usuario
        id: dataUser.id,
        username: dataUser.username,
        email: dataUser.email,
        rol: dataUser.rol,
        //Datos del empleadao
        nombre: dataUser.nombre,
        apellido: dataUser.apellido,
        direccion: dataUser.direccion,
        telefono: dataUser.telefono,
      },
    };
    if ($form["check-password"].checked)
      optionsUserE.body.password = dataUser.password;

    console.log(optionsUserE);

    api
      .put2(url2, optionsUserE)
      .then((res) => {
        console.log(res);
        getUsers();
        closeModal();
      })
      .catch((err) => {
        alert(err.statusText || err[0].campo + ": " + err[0].error);
        throw new Error(err);
      });
  }

  // Valida la informacion del usuario del formulario
  function validateFormUser($form) {
    if ($form.username.value === "") {
      alert("El usuario no puede estar vacio");
      $form.username.focus();
      throw new Error("El usuario no puede ir vacio");
    }
    if ($form["check-password"].checked) {
      if ($form.password.value === "") {
        alert("El password no puede estar vacio");
        $form.password.focus();
        throw new Error("El password no puede ir vacio");
      }
    }
    if ($form.email.value === "") {
      alert("El email no puede estar vacio");
      $form.email.focus();
      throw new Error("El email no puede ir vacio");
    }
    if (!$form.email.value == "") {
      if (
        !/^(([^<>()\[\]\\.,:\s@"]+(\.[^<>()\[\]\\.,:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/gi.test(
          $form.email.value
        )
      ) {
        $form.email.focus();
        alert("Email no valido");
        throw new Error("Email no valido");
      }
    }
  }

  // Valida la informacion de usuario y empleado del formulario
  function validateCompleteForm($form) {
    validateFormUser($form);

    if ($form.nombre.value == "") {
      $form.nombre.focus();
      alert("El Nombre no puede ir vacio");
      throw new Error("El Nombre no puede ir vacio");
    }
    if ($form.apellido.value == "") {
      $form.apellido.focus();
      alert("El Apellido no Apellido no puede ir vacio");
      throw new Error("El Apellido no Apellido no puede ir vacio");
    }
    if ($form.direccion.value == "") {
      $form.direccion.focus();
      alert("La direccion no puede ir vacia");
      throw new Error("La direccion no puede ir vacia");
    }
    if ($form.telefono.value == "") {
      $form.telefono.focus();
      alert("El telefono no puede ir vacio");
      throw new Error("El telefono no puede ir vacio");
    }
    if ($form.telefono.value.length != 10) {
      $form.telefono.focus();
      alert("El telefono debe contener 10 digitos");
      throw new Error("El telefono debe contener 10 digitos");
    }
  }

  // Comportamiento de boton Cancelar
  function handleCancel() {
    let answer = confirm("Seguro de cancelar?");
    if (answer) closeModal();
  }

  function handleLinkData() {
    setIsLinkData(!isLinkData);
  }

  function deleteUSer(){
    console.log(data.id)
    let url = `http://${host}:8080/users/delteUserEmployee/${data.id}`;
    api.del2(url, options).then((res)=>{
      alert(res.message);
      getUsers();
      closeModal();
    }).catch((err)=>console.log(err));
  }
  return (
    <section className="main-section-container">
      <h2>Actualizar Usuario</h2>
      <div className="delete-container">
        <input
          type="button"
          className="btn btn-red"
          value="Eliminar"
          onClick={deleteUSer}
        />
      </div>
      <form className="data-section-form update">
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          name="username"
          id="username"
          autoFocus
          value={dataUser.username || ""}
          onChange={handleInputChanges}
        />
        <>
          <input
            type="checkbox"
            name="check-password"
            id="check-password"
            onChange={handleCheckPassword}
            readOnly
          />
          <label htmlFor="check-password" value="link">
            Actualizar contraseña
          </label>
        </>
        <label htmlFor="password" className="hidden password">
          Password:
        </label>
        <input
          type="password"
          name="password"
          id="password"
          className="hidden password"
          value={dataUser.password || ""}
          onChange={handleInputChanges}
        />

        <label htmlFor="confirmPassword" className="hidden password">
          Confirm:
        </label>
        <input
          type="password"
          name="confirmPassword"
          id="confirmPassword"
          className="hidden password"
          onBlur={handleValidatePasswords}
        />

        <label htmlFor="email">Email:</label>
        <input
          type="text"
          name="email"
          id="email"
          value={dataUser.email || ""}
          onChange={handleInputChanges}
        />

        <label htmlFor="rol">Rol:</label>
        <select
          name="rol"
          id="rol"
          value={dataUser.rol}
          onChange={handleInputChanges}
        >
          <option value="USER">USER</option>
          <option value="ADMIN">ADMIN</option>
          <option value="TEST">TEST</option>
        </select>

        {!isEmployee ? (
          <>
            <input
              type="checkbox"
              name="check-empleado-update"
              id="check-empleado-update"
              onChange={handleCheckEmpleado}
              onClick={handleLinkData}
              readOnly
            />
            <label htmlFor="check-empleado-update">
              Enlazar datos de empleado
            </label>
          </>
        ) : (
          <></>
        )}

        <label htmlFor="nombre" className="user-data hidden">
          Nombre:
        </label>
        <input
          type="text"
          className="user-data hidden"
          name="nombre"
          id="nombre"
          value={dataUser.nombre || ""}
          onChange={handleInputChanges}
        />

        <label htmlFor="apellido" className="user-data hidden">
          Apellido:
        </label>
        <input
          type="text"
          name="apellido"
          className="user-data hidden"
          id="apellido"
          value={dataUser.apellido || ""}
          onChange={handleInputChanges}
        />

        <label htmlFor="direccion" className="user-data hidden">
          Direccion:
        </label>
        <input
          type="text"
          name="direccion"
          className="user-data hidden"
          id="direccion"
          value={dataUser.direccion || ""}
          onChange={handleInputChanges}
        />

        <label htmlFor="telefono" className="user-data hidden">
          Telefono:
        </label>
        <input
          type="number"
          name="telefono"
          id="telefono"
          className="user-data hidden"
          value={dataUser.telefono || ""}
          onKeyDown={(e) => {
            if (e.key == "-" || e.key == "+" || e.key == ".") {
              alert("Solo se admiten digitos numericos");
              e.preventDefault();
            }
          }}
          onChange={(e) => {
            if (e.target.value.length > 10) {
              e.target.value = e.target.value.slice(0, 10);
              return alert("Solo se admiten 10 digitos");
            }
            handleInputChanges(e);
          }}
        />
      </form>

      <div className="section-content-btn-container">
        <input
          type="button"
          value="Guardar"
          className="btn btn-green"
          onClick={updateData}
        />

        <input
          type="button"
          value="Cancelar"
          className="btn btn-red"
          onClick={handleCancel}
        />
      </div>
    </section>
  );
}

export default UpdateUser;
