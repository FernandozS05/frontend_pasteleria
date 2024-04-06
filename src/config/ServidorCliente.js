const ruta = "/cliente";

const apiCliente = {
  //Clientes
  login: ruta + "/login",
  perfil: ruta + "/perfil",
  registro: ruta + "/registro",
  actualizar: ruta + "/actualizar",
  obtenerCodigo: ruta + "/obtener-codigo",
  validarCodigo: ruta + "/validar-codigo",
  //Catalogo
  consultarCatalogo: ruta + "/catalogo/consultar",
  //Pedidos
  registrarPedido: ruta + "/pedidos/registrar",
  detallesPedido: ruta + "/pedidos/detalles/",
  listarPedidos: ruta + "/pedidos/consultar",
  asignarEntrega: ruta + "/pedidos/asignar-entrega/",
  consultarCancelacion: ruta + "/pedidos/consultar-cancelacion/",
  cancelarPedido: ruta + "/pedidos/cancelar-pedido/",
  //Pagos
  generarPago: ruta + "/pagos/generar-formato",
  registrarPago: ruta + "/pagos/registrar-pago/",
  consultarPago: ruta + "/pagos/consultar/",
  //Agenda
  consultarFechas: ruta + "/agenda/consultar-fechas",
  //Entregas
  registrarEntrega: ruta + "/entregas/registrar",
  detallesEntrega: ruta + "/entregas/detalles/"
};

export default apiCliente;
