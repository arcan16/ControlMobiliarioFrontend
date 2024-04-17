import { NavLink } from "react-router-dom";
import { helpHost } from "../../helpers/helpHost";
import { helpHttp } from "../../helpers/helpHttp";

import { useEffect, useState } from "react";

function AddUser({ closeModal, getUsers }) {
  let host = helpHost().getIp();
  let api = helpHttp();
  let url = `http://${host}:8080/users/createUser`;
  let options = {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
      "Content-Type": "application/json",
    },
  };

  const [newUserData, SetnewUserData] = useState({ rol: "USER" }); // Contiene la informacion de los campos del formulario

  // Controla las peticiones al servidor para actualizar el registro de usuario-empleado o usuario
  function saveData() {
    const $form = document.querySelector(".data-section-form");

    if ($form["check-empleado"].checked) {
      // Registro de datos de usuario y empleado
      validateCompleteForm($form); // Validamos formulario user-employee
      validateCompleteDisponibility($form); //validar disponibilidad de usuario y empleado
      createUserEmployee($form); // Creamos al usuario con sus datos de empleado
    } else {
      // Registro de datos de usuario
      validateFormUser($form); // Validamos formulario user
      validateUserDisponible($form); // Validamos disponibilidad de usuario
      createUser($form); // Creamos el usuario
    }
  }

  // Valida que el username del usuario este disponible
  function validateUserDisponible($form) {
    let url = `http://${host}:8080/users/available/${$form.username.value}`;
    api
      .get2(url, options)
      .then((res) => console.log(res.message))
      .catch((err) => console.log(err.message));
  }

  // Crea unicamente al usuario
  function createUser($form) {
    let url2 = `http://${host}:8080/users/createUser`;
    let optionsUser = {
      ...options,
      body: {
        username: newUserData.username,
        password: newUserData.password,
        email: newUserData.email,
        rol: newUserData.rol,
      },
    };

    api
      .post2(url2, optionsUser)
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

  // Crea el registro de usuario y el de empleado
  function createUserEmployee(){
    let url2 = `http://${host}:8080/users/createUserEmployee`;
    let optionsUserE = {
      ...options,
      body: {
        //Datos del usuario
        username: newUserData.username,
        password: newUserData.password,
        email: newUserData.email,
        rol: newUserData.rol,
        //Datos del empleadao
        nombre:  newUserData.nombre,
        apellido: newUserData.apellido,
        direccion: newUserData.direccion,
        telefono: newUserData.telefono
      },
    };
    console.log(optionsUserE);
    api
      .post2(url2, optionsUserE)
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

  // Valida disponibilidad de username y empleado para realizar el registro
  function validateCompleteDisponibility($form) {
    let url = `http://${host}:8080/users/availableue/${$form.username.value}/${$form.nombre.value}/${$form.apellido.value}`;
    console.log($form.apellido.value);
    api
      .get2(url, options)
      .then((res) => console.log(res))
      .catch((err) => console.log(err.message));
  }

  // Valida la informacion del usuario del formulario 
  function validateFormUser($form) {
    if ($form.username.value === "") {
      alert("El usuario no puede estar vacio");
      $form.username.focus();
      throw new Error("El usuario no puede ir vacio");
    }
    if ($form.password.value === "") {
      alert("El password no puede estar vacio");
      $form.password.focus();
      throw new Error("El password no puede ir vacio");
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

  // Controla el renderizado de elementos user-dada
  function handleCheckEmpleado(e) {
    console.log(e.target.checked);
    const $dataEmpleado = document.querySelectorAll(".user-data");
    $dataEmpleado.forEach((el) => el.classList.toggle("hidden"));

    // Elimina los datos de empleado al des seleccionar "Enlazar datos de empleado"
    let newData = newUserData;
    delete newData.nombre;
    delete newData.apellido;
    delete newData.direccion;
    delete newData.telefono;
    SetnewUserData(newData);
  }

  // Controla la validacion de las contraseñas
  function handleValidatePasswords() {
    const $form = document.querySelector(".data-section-form");
    if ($form.password.value != $form.confirmPassword.value) {
      alert("Las contraseñas no coinciden, favor de verificar");
      $form.password.select();
    }
  }

  // Controla el estado con la informacion del formulario
  function handleInputChanges(e) {
    SetnewUserData({ ...newUserData, [e.target.name]: e.target.value });
  }

  return (
    <section className="main-section-container">
      <h2>Agregar Usuario</h2>
      <form className="data-section-form">
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          name="username"
          id="username"
          autoFocus
          value={newUserData.username || ""}
          onChange={handleInputChanges}
        />

        <label htmlFor="password">Password:</label>
        <input
          type="password"
          name="password"
          id="password"
          value={newUserData.password || ""}
          onChange={handleInputChanges}
        />

        <label htmlFor="confirmPassword">Confirm:</label>
        <input
          type="password"
          name="confirmPassword"
          id="confirmPassword"
          onBlur={handleValidatePasswords}
        />

        <label htmlFor="email">Email:</label>
        <input
          type="text"
          name="email"
          id="email"
          value={newUserData.email || ""}
          onChange={handleInputChanges}
        />

        <label htmlFor="rol">Rol:</label>
        <select
          name="rol"
          id="rol"
          value={newUserData.rol || "0"}
          onChange={handleInputChanges}
        >
          <option value="USER">USER</option>
          <option value="ADMIN">ADMIN</option>
          <option value="TEST">TEST</option>
        </select>

        <>
          <input
            type="checkbox"
            name="check-empleado"
            id="check-empleado"
            onChange={handleCheckEmpleado}
            readOnly
          />
          <label htmlFor="check-empleado" value="link">
            Enlazar datos de empleado
          </label>
        </>

        <label htmlFor="nombre" className="user-data hidden">
          Nombre:
        </label>
        <input
          type="text"
          className="user-data hidden"
          name="nombre"
          id="nombre"
          value={newUserData.nombre || ""}
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
          value={newUserData.apellido || ""}
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
          value={newUserData.direccion || ""}
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
          value={newUserData.telefono || ""}
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
          onClick={saveData}
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

export default AddUser;
