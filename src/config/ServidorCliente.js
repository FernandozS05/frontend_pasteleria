 const dominio = "http://localhost:3000/api/cliente";

 const apiCliente = {
    login: dominio + "/login",
    logout: dominio + "/logout",
    consultarProductos: dominio + "/productos/",
    registrarPedido: dominio + "/pedidos/registrar",
    listarPedidos: dominio + "/pedidos/",
    registro: dominio + "/registro",
    consultarPago: dominio + "/pagos/",
    consultarEntrega: dominio + "/entregas/",
    consultarAgenda: dominio + "/agenda/consultar",
    registrarEntrega: dominio + "/entregas/registrar-entrega",
    asignarEntrega: dominio + "/pedidos/",
    generarPago: dominio + "/pedidos/pagos/generar-formato",
    consultarCancelacion: dominio + "/pedidos/consultar-cancelacion/",
    cancelarPedido: dominio + "/pedidos/cancelar-pedido/",
 }

 export default apiCliente;
