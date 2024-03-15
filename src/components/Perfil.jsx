// eslint-disable-next-line react-refresh/only-export-components
export function handleLogout(setIsAuth){
    localStorage.removeItem("username");
    localStorage.removeItem("token");
    setIsAuth(false);
}
// eslint-disable-next-line react/prop-types
function Perfil({setIsAuth}) {
    
    return ( 
        <article className="perfil-box">
            <div>
                <img src="" alt="" className="perfil-avatar"/>
            </div>
            <div>
                <p className="perfil-username">Username</p>
                <p className="perfil-email">Email</p>
                <p className="perfil-config">Configurar</p>
                <button className="perfil-logout" onClick={()=>handleLogout(setIsAuth)}>Cerrar Sesion</button>
            </div>
        </article>
     );
}

export default Perfil;