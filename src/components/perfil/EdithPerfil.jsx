import { NavLink } from "react-router-dom";
import returnImg from "../../assets/icons/return.svg";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { helpHost } from "../../helpers/helpHost";
import { helpHttp } from "../../helpers/helpHttp";
import { setActualUser, updateActualUser } from "../../actions/actualUserActions";
import Cookies from "js-cookie";

function EdithPerfil() {
  const state = useSelector((state) => state.actualUser);
  const dispatch = useDispatch();

  const [newData, setNewData] = useState({});
  const [empleado, setEmpleado] = useState(false);

  useEffect(() => {
    setNewData(state);
  }, []);
  // console.log("Estado")
  // console.log(state)
  // Solicitud de los datos del empleado enlazado al usuario
  let host = helpHost().getIp();
  let api = helpHttp();
  let options = {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
      "Content-Type": "application/json",
    },
  };
  async function getDataUser() {
    let url = `http://${host}:8080/employees/myData/${state.username}`;
    let options = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
        "Content-Type": "application/json",
      },
    };

    try {
      console.log(url)
      const dataEmployee = await api.get(url, options); //.then((res) => {
      console.log(dataEmployee)
      //if (res.err) throw res;
      // console.log(res)
      // setEmpleado({id:1})
      //});
      // console.log(dataEmployee);
      // setEmpleado(dataEmployee);
      setEmpleado(dataEmployee);
      setEmployeeToEdith();
    } catch (err) {
      console.log(err);
    }
  }

  function setEmployeeToEdith() {
    const $dataEmpleadoBox = document.querySelector(".data-empleado-box");
    const $checkEmpleado = document.getElementById("check-empleado");

    $checkEmpleado.checked = true;
    $dataEmpleadoBox.classList.add("visible");
    const scrollHeight = document.documentElement.scrollHeight;
    document.documentElement.scrollTop = scrollHeight;
    $dataEmpleadoBox.nombre.focus();
    // console.log("datos");
  }
  useEffect(() => {
    getDataUser();
  }, []);
  // Finaliza solicitud de datos de empleado enlazados al usuario

  // Actualizacion del estado con la informacion  nueva que se va a guardar
  function handleChangeText(e) {
    // console.log(e.target.name)
    if (e.target.name == "rol") {
      setNewData({ ...newData, rol: { [e.target.name]: e.target.value } });
    } else {
      setNewData({ ...newData, [e.target.name]: e.target.value });
    }

    const $checkEmpleado = document.getElementById("check-empleado").checked;

    if ($checkEmpleado) {
      setEmpleado({ ...empleado, [e.target.name]: e.target.value });
    }
  }

  // Comportamiento del checkbox Editar Password
  function checkBoxHandler(e) {
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
    }
  }

  // Comportamiento del checkBox Editar/Enlazar empleado
  function checkBoxEmployeeHandler(e) {
    const $dataEmpleadoBox = document.querySelector(".data-empleado-box");
    if (e.target.checked) {
      $dataEmpleadoBox.classList.add("visible");
      const scrollHeight = document.documentElement.scrollHeight;
      document.documentElement.scrollTop = scrollHeight;
      $dataEmpleadoBox.nombre.focus();
    } else {
      $dataEmpleadoBox.classList.remove("visible");
      // $btnSelectEmployee.disabled = true;
    }
  }

  // Comportamiento del boton Guardar
  function handleSave(e) {
    const $edithPass = document.getElementById("edithPass");
    const $edithEmpl = document.getElementById("check-empleado");
    const $form = document.querySelector(".data-section-form");
    const newEmploye = {};

    // Antes de seguir debo realizar las validaciones de informacion para crear el objeto que sera almacenado

    // Aqui van las validaciones de informacion
    if ($form.username.value == "") {
      e.preventDefault();
      $form.username.focus();
      return alert("El Username no puede estar vacio");
    }
    if ($form.email.value == "") return alert("El email no puede estar vacio");
    if (!$form.email.value == "") {
      if (
        !/^(([^<>()\[\]\\.,:\s@"]+(\.[^<>()\[\]\\.,:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/gi.test(
          $form.email.value
        )
      ) {
        $form.email.focus();
        return alert("Email no valido");
      }
    }
    if ($form.rol.value == "") return alert("El email no puede estar vacio");

    newEmploye.id = newData.idUsuario;
    newEmploye.username = $form.username.value;
    if (
      ($edithPass.checked && $form.password.value == "") ||
      ($edithPass.checked && $form.confirmPassword.value == "")
    ) {
      e.preventDefault();
      $form.password.focus();
      return alert("El password/confirm Password no pueden estar vacios");
    }
    if ($form.password.value != $form.confirmPassword.value) {
      $form.password.select();
      e.preventDefault();
      return alert(
        "El password y su confirmacion son diferentes, favor de verificar!"
      );
    }
    $edithPass.checked
      ? (newEmploye.password = $form.password.value)
      : delete newEmploye.password;
    newEmploye.email = $form.email.value;
    newEmploye.rol = $form.rol.value;

    if ($edithEmpl.checked) {
      const $formEmpleado = document.querySelector(".data-empleado-box");

      // Validacion datos de empleado
      try {
        if ($formEmpleado.nombre.value == "") {
          $formEmpleado.nombre.focus();
          throw Error("El nombre no puede estar vacio");
        }
        if ($formEmpleado.apellido.value == "") {
          $formEmpleado.apellido.focus();
          throw Error("El apellido no puede estar vacio");
        }
        if ($formEmpleado.direccion.value == "")
          throw Error("La direccion no puede estar vacia");
        if ($formEmpleado.telefono.value == "")
          throw Error("El telefono no fue colocado, favor de verificar");
      } catch (error) {
        e.preventDefault();
        alert(error);
      }

      newEmploye.employe = {
        nombre: $formEmpleado.nombre.value,
        apellido: $formEmpleado.apellido.value,
        direccion: $formEmpleado.direccion.value,
        telefono: $formEmpleado.telefono.value,
      };
    }

    // e.preventDefault();
    handleSendData(newEmploye, $edithPass, e);
    // alert("Tamos guardando los datos");
  }

  async function handleSendData(data, $edithPass, e) {
    let urlUser = `http://${host}:8080/users`;
    let urlEmployee = `http://${host}:8080/employees`;
    const $checkEmpleado = document.getElementById("check-empleado");

    let dataUser = {};

    // Peticiones a user
    if (state.username != newData.username || state.email != newData.email) {
      dataUser.id = newData.idUsuario;
      dataUser.username = newData.username;
      dataUser.email = newData.email;
      if ($edithPass.checked) dataUser.password = newData.password;

      try {
        options = { ...options, body: { ...dataUser } };
        const updateUser = await api.put(urlUser, options);
        // console.log(updateUser);
      } catch (error) {
        console.log(error);
      }

      // console.log(updateUser);
    }

    // Peticiones a empleados
    if ($checkEmpleado) {
      if (empleado) {
        console.log("Modificando datos del empleado");
        let options2 = {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
            "Content-Type": "application/json",
          },
        };
        options2 = {
          ...options2,
          body: {
            id: empleado.id,
            nombre: data.employe.nombre,
            apellido: data.employe.apellido,
            direccion: data.employe.direccion,
            telefono: data.employe.telefono,
          },
        };
        try {
          const createdEmmployee = await api.put(urlEmployee, options2);
          console.log(createdEmmployee);
          console.log(options2);
        } catch (error) {
          alert(error);
        }
      } else {
        console.log("Agregando registros nuevos");
        let options2 = {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
            "Content-Type": "application/json",
          },
        };
        options2 = {
          ...options2,
          body: {
            nombre: data.employe.nombre,
            apellido: data.employe.apellido,
            direccion: data.employe.direccion,
            telefono: data.employe.telefono,
            idUsuario: data.id,
          },
        };
        try {
          const createdEmmployee = await api.post(urlEmployee, options2);
          console.log(createdEmmployee);
          console.log(options2);
        } catch (error) {
          // console.log("Aqui esta el error")
          alert(error);
        }
      }
    }
    //Actualizar el state
    // e.preventDefault();
    dispatch(setActualUser(newData));
    
  }
  function closeSession() {
    alert("Cerrando sesion");
    localStorage.removeItem("username");
    localStorage.removeItem("token");
    Cookies.remove("credentials");
    location.href = "/";
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
                value={newData.idUsuario || ""}
                onChange={handleChangeText}
                disabled
                readOnly
              />

              <label htmlFor="username">Username:</label>
              <input
                type="text"
                name="username"
                id="username"
                value={newData.username || ""}
                onChange={handleChangeText}
              />

              <input
                type="checkbox"
                name="edithPass"
                id="edithPass"
                onChange={checkBoxHandler}
              />
              <label htmlFor="edithPass">Editar Password</label>

              <label htmlFor="password">Password:</label>
              <input
                type="password"
                name="password"
                id="password"
                disabled
                onChange={handleChangeText}
              />

              <label htmlFor="confirmPassword">Confirm:</label>
              <input
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                disabled
              />

              <label htmlFor="email">Email:</label>
              <input
                type="text"
                name="email"
                id="email"
                value={newData.email ? newData.email : ""}
                onChange={handleChangeText}
              />

              <label htmlFor="rol">Rol:</label>
              <select
                className="rol-select"
                name="rol"
                value={newData.rol ? newData.rol.rol : ""}
                onChange={handleChangeText}
                disabled
              >
                <option key="1" value="ADMIN">
                  ADMIN
                </option>
                <option key="2" value="USER">
                  USER
                </option>
                <option key="3" value="TEST">
                  TEST
                </option>
              </select>

              {!empleado ? (
                <div className="data-empleado">
                  <input
                    type="checkbox"
                    name="check-empleado"
                    id="check-empleado"
                    onChange={checkBoxEmployeeHandler}
                  />
                  <label htmlFor="check-empleado" value="link">
                    Agregar datos de empleado
                  </label>

                  <form className="data-empleado-box">
                    <label htmlFor="nombre">Nombre:</label>
                    <input
                      type="text"
                      name="nombre"
                      id="nombre"
                      onChange={handleChangeText}
                    />

                    <label htmlFor="apellido">Apellido:</label>
                    <input
                      type="text"
                      name="apellido"
                      id="apellido"
                      onChange={handleChangeText}
                    />

                    <label htmlFor="direccion">Direccion:</label>
                    <input
                      type="text"
                      name="direccion"
                      id="direccion"
                      onChange={handleChangeText}
                    />

                    <label htmlFor="telefono">Telefono:</label>
                    <input
                      type="number"
                      name="telefono"
                      id="telefono"
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
                        handleChangeText(e);
                      }}
                    />
                  </form>
                </div>
              ) : (
                <div className="data-empleado">
                  <input
                    type="checkbox"
                    name="check-empleado"
                    id="check-empleado"
                    onChange={checkBoxEmployeeHandler}
                    disabled
                    readOnly
                  />
                  <label htmlFor="check-empleado" value="link">
                    Editar datos de empleado
                  </label>

                  <form className="data-empleado-box">
                    <label htmlFor="nombre">Nombre:</label>
                    <input
                      type="text"
                      name="nombre"
                      id="nombre"
                      value={empleado.nombre}
                      onChange={handleChangeText}
                    />

                    <label htmlFor="apellido">Apellido:</label>
                    <input
                      type="text"
                      name="apellido"
                      id="apellido"
                      value={empleado.apellido}
                      onChange={handleChangeText}
                    />

                    <label htmlFor="direccion">Direccion:</label>
                    <input
                      type="text"
                      name="direccion"
                      id="direccion"
                      value={empleado.direccion}
                      onChange={handleChangeText}
                    />

                    <label htmlFor="telefono">Telefono:</label>
                    <input
                      type="number"
                      name="telefono"
                      id="telefono"
                      value={empleado.telefono}
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
                        handleChangeText(e);
                      }}
                    />
                  </form>
                </div>
              )}
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

export default EdithPerfil;
