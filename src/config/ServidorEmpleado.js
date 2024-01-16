const dominio = "http://localhost:3000/api/usuario";

const apiUsuario = {
   login: dominio + "/login",
   logout: dominio + "/logout",
   consultarProductos: dominio + "/catalogo/",
   consultarVentas: dominio + "/ventas/",
}

export default apiUsuario;