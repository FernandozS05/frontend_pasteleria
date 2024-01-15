 const dominio = "http://localhost:3000/api/cliente";

 const apiCliente = {
    login: dominio + "/login",
    logout: dominio + "/logout",
    consultarProductos: dominio + "/productos/",
    registrarPedido: dominio + "/pedidos/registrar",
    listarPedidos: dominio + "/pedidos/",
    registro: dominio + "/registro",
 }

 export default apiCliente;
