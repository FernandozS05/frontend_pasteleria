const ruta = "/empleado";

const apiEmpleado = {
  //Clientes
  login: ruta + "/login",
  perfil: ruta + "/perfil",
  registro: ruta + "/registro",
  listar: ruta + "/consultar",
  actualizar: ruta + "/actualizar/",
  restablecer: ruta + "/restablecer",
  eliminar: ruta + "/eliminar/",
  //Catalogo
  registrarProductoCatalogo: ruta + "/catalogo/agregar",
  consultarCatalogoCatalogo: ruta + "/catalogo/consultar",
  detallesProductoCatalogo: ruta + "/catalogo/detalles/",
  actualizarProductoCatalogo: ruta + "/catalogo/actualizar/",
   eliminarProductoCatalogo: ruta + "/catalogo/eliminar/",
   //Inventario-Insumos
   consultarInsumosInventario: ruta + "/inventario/consultar-insumos",
   agregarInsumoInventario: ruta + "/inventario/agregar-insumo",
   detallesInsumoInventario: ruta + "/inventario/insumos/",
   actualizarInsumoInventario: ruta + "/inventario/actualizar-insumo/",
   eliminarInsumoInventario: ruta + "/inventario/eliminar-insumo/",
   //Inventario-Productos
   consultarProductosInventario: ruta + "/inventario/consultar-productos",
   agregarProductoInventario: ruta + "/inventario/agregar-producto",
   eliminarProductoInventario: ruta + "/inventario/eliminar-producto/",
  //Pedidos
  registrarPedido: ruta + "/pedidos/registrar",
  listarPedidos: ruta + "/pedidos/",
  asignarEntrega: ruta + "/pedidos/",
  consultarCancelacion: ruta + "/pedidos/consultar-cancelacion/",
  cancelarPedido: ruta + "/pedidos/cancelar-pedido/",
  //Pagos
  generarPago: ruta + "/pedidos/pagos/generar-formato",
  registrarPago: ruta + "/pagos/registrar-pago/",
  consultarPago: ruta + "/pagos/consultar/",
  //Agenda
  consultarFechas: ruta + "/agenda/consultar-fechas",
  //Entregas
  registrarEntrega: ruta + "/entregas/registrar",
  detallesEntrega: ruta + "/entregas/detalles/",
  //Ventas
  consultarVentas: ruta + "/ventas/consultar",
};

export default apiEmpleado;
