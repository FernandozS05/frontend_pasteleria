const ruta = "/cliente";

const apiCliente = {
  //Clientes
  login: ruta + "/login",
  perfil: ruta + "/perfil",
  registro: ruta + "/registro",
  actualizar: ruta + "/actualizar",
  obtenerCodigo: ruta + "/obtener-codigo",
  validarCodigo: ruta + "/validar-codigo",
  cambiarContrasenia: ruta + "/cambiar-contrasenia",
  //Catalogo
  consultarCatalogo: ruta + "/catalogo/consultar",
  //Pedidos
  registrarPedido: ruta + "/pedidos/registrar",
  detallesPedido: ruta + "/pedidos/detalles/",
  listarPedidos: ruta + "/pedidos/consultar",
  asignarEntrega: ruta + "/pedidos/asignar-entrega/",
  consultarCancelacion: ruta + "/pedidos/consultar-cancelacion/",
  consultarModificacion: ruta + "/pedidos/consultar-modificacion/",
  cancelarPedido: ruta + "/pedidos/cancelar-pedido/",
  entregarPedido: ruta + "/pedidos/marcar-entregado/",
  //Pagos
  generarPago: ruta + "/pagos/generar-formato",
  registrarPago: ruta + "/pagos/registrar-pago/",
  consultarPago: ruta + "/pagos/consultar/",
  generarFactura: ruta + "/pagos/generar-factura",
  //Agenda
  consultarFechas: ruta + "/agenda/consultar-fechas",
  //Entregas
  registrarEntrega: ruta + "/entregas/registrar",
  detallesEntrega: ruta + "/entregas/detalles/"
};

export default apiCliente;
