import { NavLink } from "react-router-dom";
import returnImg from "../../assets/icons/return.svg";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { helpHost } from "../../helpers/helpHost";
import { helpHttp } from "../../helpers/helpHttp";
import Cookies from "js-cookie";

function EditarPerfil() {
  let newEmployeInitial = {
    nombre: "",
    apellido: "",
    direccion: "",
    telefono: "",
  };
  const state = useSelector((state) => state.actualUser);
  const [changeUser, setChangeUser] = useState(null); // Controla los cambios de informacion de usuario
  const [employee, setEmployee] = useState(null); // Controla la informacion traida del servidor
  const [newEmployee, setNewEmployee] = useState({
    nombre: "",
    apellido: "",
    direccion: "",
    telefono: "",
  }); // Controla la informacion nueva generada
  //   console.log(state);
  const [isEmployeeChecked, setIsEmployeeChecked] = useState(false);

  //Load value of inputs
  let host = helpHost().getIp();
  let api = helpHttp();
  let url = "";
  let options = {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
      "Content-Type": "application/json",
    },
  };
  async function getDataEmploye() {
    url = `http://${host}:8080/employees/myData/${state.username}`;
    try {
      const dataEmployee = await api.get(url, options);
      if(!dataEmployee.hasOwnProperty("err")){
        setEmployee(dataEmployee);
        setIsEmployeeChecked(true);
      }
      // console.log(dataEmployee);
    } catch (error) {
      alert("Error: " + error);
    }
  }

  useEffect(() => {
    if(state.length==0)return location.href="/configuracion"
    setChangeUser(state);
    getDataEmploye();
  }, []);
  

  // Comportamiento de la edicion de datos del usuario
  function handleChangeUserData(e) {
    setChangeUser({ ...changeUser, [e.target.name]: e.target.value });
  }

  // Comportamiento del checkbox Editar Password
  function handleCheckBoxPassword(e) {
    const $passwordBox = document.getElementById("password");
    const $confirmPasswordBox = document.getElementById("confirmPassword");

    if (e.target.checked) {
      $passwordBox.disabled = false;
      $confirmPasswordBox.disabled = false;
      $passwordBox.focus();
    } else {
      $passwordBox.disabled = true;
      $confirmPasswordBox.disabled = true;
      $passwordBox.value = "";
      $confirmPasswordBox.value = "";
      let newUser = state;
      delete newUser.password;
      setChangeUser(newUser);
    }
  }

  // Comportamiento del checkbox check-empleado
  function handleEmployeeCheckbox() {
    setIsEmployeeChecked(!isEmployeeChecked);
  }
  useEffect(() => {
    const $inputsEmploye = document.querySelectorAll(".employee-data");
    if (isEmployeeChecked) {
      $inputsEmploye.forEach((el) => (el.style.display = "inline-block"));
      // $inputsEmploye[1].focus();
    } else {
      $inputsEmploye.forEach((el) => (el.style.display = "none"));
      setNewEmployee(newEmployeInitial);
    }
  }, [isEmployeeChecked]);

  // Comportamiento de edicion de los datos del empleado
  function handleChangeEmployeeData(e) {
    setEmployee({ ...employee, [e.target.name]: e.target.value });
  }

  // Comportamiento de la creacion de datos del empleado
  function handleCreateEmployeeData(e) {
    setNewEmployee({ ...newEmployee, [e.target.name]: e.target.value });
  }

  // Comportamiento del boton Guardar
  function handleSave(e) {
    // e.preventDefault();
    const $form = document.querySelector(".data-section-form");

    try {
      validacionUsuario($form, e);
      validacionEmpleado($form, e);
      sendData($form);
    } catch (error) {
      alert(error);
    }
  }
  async function sendData($form) {
    let urlUsuario = `http://${host}:8080/users`;
    let urlEmployee = `http://${host}:8080/employees`;
    
    try {
      if (employee) {
        // console.log("Actualizando datos de empleado");
        options = { ...options, body: { id: employee.id } };
        options.body.nombre = employee.nombre;
        options.body.apellido = employee.apellido;
        options.body.direccion = employee.direccion;
        options.body.telefono = employee.telefono;
        const empleadoEditado = await api.put(urlEmployee, options);
        // console.log(options);
      } else {
        // console.log("Creando datos de empleado");
        options = { ...options, body: { nombre: newEmployee.nombre } };
        options.body.apellido = newEmployee.apellido;
        options.body.direccion = newEmployee.direccion;
        options.body.telefono = newEmployee.telefono;
        const empleadoNuevo = await api.post(urlEmployee, options);
        // console.log(options);
        // console.log(empleadoNuevo);
      }
    } catch (error) {
      alert("Catch empleado");
      console.log(error);
      // alert(error);
    }
    // console.log("Actualizando datos de usuario");
    delete options.body;
    let optionsU = { ...options, body: { id: changeUser.idUsuario } };
    if (state.username != $form.username.value)
      optionsU.body.username = changeUser.username;
    optionsU.body.email = changeUser.email;
    if ($form.edithPass.checked) {
      optionsU.body.password = $form.password.value;
    }
    try {
      // console.log(optionsU);
      const usuarioEditado = await api.put(urlUsuario, optionsU);
      // console.log(usuarioEditado);
    } catch (error) {
      alert("Catch usuario");
      // console.log(error);
      alert(error);
    }

    
    if (state.username != $form.username.value) closeSession();
  }
  function closeSession() {
    alert("Cerrando sesion");
    localStorage.removeItem("username");
    localStorage.removeItem("token");
    Cookies.remove("credentials");
    location.href = "/";
  }
  function validacionUsuario($form, e) {
    // console.log(changeUser);

    // Validacion se usuario
    if ($form.username.value == "") {
      e.preventDefault();
      $form.username.focus();
      throw new Error("El Username no puede estar vacio");
    }
    // Validacion de password
    if ($form.edithPass.checked) {
      if ($form.password.value == "" || $form.confirmPassword.value == "") {
        e.preventDefault();
        $form.password.select();
        throw new Error("El password no puede estar vacio");
      } else if ($form.password.value != $form.confirmPassword.value) {
        e.preventDefault();
        $form.password.select();
        throw new Error("Las contraseñas no coinciden, favor de verificar");
      }
    }

    // Validacion de email
    if ($form.email.value == "")
      throw new Error("El email no puede estar vacio");
    if (!$form.email.value == "") {
      if (
        !/^(([^<>()\[\]\\.,:\s@"]+(\.[^<>()\[\]\\.,:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/gi.test(
          $form.email.value
        )
      ) {
        $form.email.focus();
        throw new Error("Email no valido");
      }
    }
  }

  function validacionEmpleado($form) {
    if (!isEmployeeChecked) return;
    if ($form.nombre.value == "") {
      $form.nombre.focus();
      throw Error("El nombre no puede estar vacio");
    }
    if ($form.apellido.value == "") {
      $form.apellido.focus();
      throw Error("El apellido no puede estar vacio");
    }
    if ($form.direccion.value == "") {
      $form.direccion.focus();
      throw Error("La direccion no puede estar vacia");
    }
    if ($form.telefono.value == "") {
      $form.telefono.focus();
      throw Error("El telefono no fue colocado, favor de verificar");
    }
    if ($form.telefono.value.length != 10) {
      $form.telefono.focus();
      throw Error(
        "El telefono debe tener 10 digitos en lugar de: " +
          $form.telefono.value.length
      );
    }
  }

  // Comportamiento de boton Cancelar
  function handleCancel(e) {
    let answer = confirm("Seguro de cancelar?");
    if (!answer) e.preventDefault();
  }
  return (
    <section className="main-section-container">
      <div className="nav-return-container">
        <NavLink to="/configuracion">
          <img src={returnImg} className="icon-img" alt="" />
        </NavLink>
        <h1>Edicion de perfil</h1>
      </div>
      <div className="data-section-container">
        <div className="data-section-content">
          <div className="data-section-box">
            <form className="data-section-form">
              <label htmlFor="id">Id:</label>
              <input
                type="text"
                name="id"
                id="id"
                disabled
                readOnly
                value={changeUser ? changeUser.idUsuario : ""}
              />

              <label htmlFor="username">Username:</label>
              <input
                type="text"
                name="username"
                id="username"
                value={changeUser ? changeUser.username : ""}
                onChange={handleChangeUserData}
                autoFocus
              />

              <input
                type="checkbox"
                name="edithPass"
                id="edithPass"
                onChange={handleCheckBoxPassword}
              />
              <label htmlFor="edithPass">Editar Password</label>

              <label htmlFor="password">Password:</label>
              <input
                type="password"
                name="password"
                id="password"
                disabled
                onChange={handleChangeUserData}
              />

              <label htmlFor="confirmPassword">Confirm:</label>
              <input
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                disabled
                readOnly
              />

              <label htmlFor="email">Email:</label>
              <input
                type="text"
                name="email"
                id="email"
                value={changeUser ? changeUser.email : ""}
                onChange={handleChangeUserData}
              />

              <label htmlFor="rol">Rol:</label>
              <input
                type="text"
                name="rol"
                className="rol-select"
                id="rol"
                value={changeUser ? changeUser.rol.rol : ""}
                disabled
                readOnly
              />

              {!employee ? (
                <>
                  <input
                    type="checkbox"
                    name="check-empleado"
                    id="check-empleado"
                    onChange={handleEmployeeCheckbox}
                  />
                  <label htmlFor="check-empleado" value="link">
                    Agregar datos de empleado
                  </label>
                </>
              ) : (
                <>
                  <input
                    type="checkbox"
                    name="check-empleado"
                    id="check-empleado"
                    disabled
                    checked
                    readOnly
                  />
                  <label htmlFor="check-empleado" value="link">
                    Editar datos de empleado
                  </label>
                </>
              )}

              <label
                htmlFor="nombre"
                className="employee-data"
                style={
                  employee ? { display: "inline-block" } : { display: "none" }
                }
              >
                Nombre:
              </label>
              <input
                type="text"
                className="employee-data"
                name="nombre"
                id="nombre"
                onChange={
                  employee ? handleChangeEmployeeData : handleCreateEmployeeData
                }
                style={
                  employee ? { display: "inline-block" } : { display: "none" }
                }
                value={employee ? employee.nombre : newEmployee.nombre}
              />

              <label
                htmlFor="apellido"
                className="employee-data"
                style={
                  employee ? { display: "inline-block" } : { display: "none" }
                }
              >
                Apellido:
              </label>
              <input
                type="text"
                name="apellido"
                className="employee-data"
                id="apellido"
                onChange={
                  employee ? handleChangeEmployeeData : handleCreateEmployeeData
                }
                style={
                  employee ? { display: "inline-block" } : { display: "none" }
                }
                value={employee ? employee.apellido : newEmployee.apellido}
              />

              <label
                htmlFor="direccion"
                className="employee-data"
                style={
                  employee ? { display: "inline-block" } : { display: "none" }
                }
              >
                Direccion:
              </label>
              <input
                type="text"
                name="direccion"
                className="employee-data"
                id="direccion"
                onChange={
                  employee ? handleChangeEmployeeData : handleCreateEmployeeData
                }
                style={
                  employee ? { display: "inline-block" } : { display: "none" }
                }
                value={employee ? employee.direccion : newEmployee.direccion}
              />

              <label
                htmlFor="telefono"
                className="employee-data"
                style={
                  employee ? { display: "inline-block" } : { display: "none" }
                }
              >
                Telefono:
              </label>
              <input
                type="number"
                name="telefono"
                id="telefono"
                className="employee-data"
                style={
                  employee ? { display: "inline-block" } : { display: "none" }
                }
                value={employee ? employee.telefono : newEmployee.telefono}
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
                  employee
                    ? handleChangeEmployeeData(e)
                    : handleCreateEmployeeData(e);
                }}
              />
            </form>
          </div>
          <div className="section-content-btn-container">
            <NavLink
              to="/configuracion"
              className="navlink"
              onClick={handleSave}
            >
              <input type="button" value="Guardar" className="btn btn-green" />
            </NavLink>

            <NavLink
              to="/configuracion"
              className="navlink"
              onClick={handleCancel}
            >
              <input type="button" value="Cancelar" className="btn btn-red" />
            </NavLink>
          </div>
        </div>
      </div>
    </section>
  );
}

export default EditarPerfil;
