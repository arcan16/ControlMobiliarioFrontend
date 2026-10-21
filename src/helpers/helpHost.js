export const helpHost = () =>{
    // Dirección base de la API. En producción (GitHub Pages) se define con la
    // variable VITE_API_URL al compilar, por ejemplo https://api.midominio.com
    const getApiUrl = () => {
        const apiUrl = import.meta.env.VITE_API_URL;
        if (apiUrl) return apiUrl.replace(/\/+$/, "");
        return `http://${getIp()}:8080`;
    }
    // Ip del backend para desarrollo local, cuando no se define VITE_API_URL
    const getIp = () => {
        // Ip del trabajo
        return "192.168.1.69"; 
        // Ip de la casa
        // return "192.168.0.3";
    }
    return {getApiUrl, getIp};
}
