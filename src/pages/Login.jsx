import options from "../assets/login/options.svg";
import logo from "../assets/login/logo2.png";
import { helpHttp } from "../helpers/helpHttp";
import { helpHost } from "../helpers/helpHost";

// eslint-disable-next-line react/prop-types
export default function Login({setIsAuth, setToken, setUserName}) {
  function  handleSubmit() {
    let api = helpHttp();
    
    let host = helpHost().getIp();
    let url = `http://${host}:8080/login`;
    // let url = "http://localhost:8080/login";

    let userName = document.querySelector("#username");
    let password = document.querySelector("#password");
    
    let options = {
      body: {
        username:userName.value,
        password:password.value
      }
    }
    if(userName.value=="" || password.value==""){
      alert("Los campos son requeridos");
      userName.focus(); 
    }else{
      api.post(url,options).then(res=>{
        // console.log(res.token);
        if(res.token){
          setToken(res.token);
          setUserName(userName.value);
          setIsAuth(true);
          localStorage.setItem("username",res.Username);
          localStorage.setItem("token",res.token);
        }else{
          userName.value="";
          password.value="";
          userName.focus();
          alert("Datos incorrectos")
        }
      });
    }
  }

  return (
    <div className="box-login">
      <h1>Control de mobiliario</h1>
        <div className="login-container">
            <img src={logo} alt="Logo del negocio" className="logo-negocio"></img>
            <h2 className="titulo-login">Iniciar Sesion</h2>
            <p>Continuar al Control de Mobiliario</p>
            <input type="text" name="username" id="username" onKeyUp={(e=>{if(e.keyCode==13) document.querySelector("#password").focus()})} placeholder="Usuario" className="credentials" autoFocus required/>
            <input type="password" name="password" id="password" placeholder="Contraseña" className="credentials" required onKeyUp={(e=>{if(e.keyCode==13) handleSubmit()})}/>
            <input type="button" value="Iniciar Sesión" className="btn-login" onClick={handleSubmit}/>
            
        </div>
        {/* <input type="button" className="btn-login" value="Opciones de inicio de sesión" /> */}
        <button className="btn-options">
          <img src={options} alt="" />
          <label>Olvide mi contraseña</label>
        </button>
    </div>
  )
}
