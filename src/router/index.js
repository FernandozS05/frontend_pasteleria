import { createRouter, createWebHistory } from 'vue-router'
import RegistroUsuarioView from '../views/Registro/RegistroUsuarioView.vue'
import LoginUsuarioView from '@/views/Login/LoginUsuarioView.vue'
import ProductoCatalogoView from '@/views/Producto/ProductoCatalogoView.vue'
import CatalogoPastelesView from '@/views/Catalogo/CatalogoPastelesView.vue'
import DetallesPedidoView from '@/views/Pedido/DetallesPedidoView.vue'
import PagoTarjetaView from '@/views/Pedido/PagoTarjetaView.vue'
import PagoFormatoView from '@/views/Pedido/PagoFormatoView.vue'
import FormularioDireccionView from '@/views/Pedido/FormularioDireccionView.vue'
import ElementoPedidoView from '@/views/Pedido/ElementoPedidoView.vue'
import PedidosView from '@/views/Pedido/PedidosView.vue'
import ElementoVentaView from '@/views/Venta/ElementoVentaView.vue'
import ReporteVentasView from '@/views/Venta/ReporteVentasView.vue'
import TipoPagoView from '@/views/Pedido/TipoPagoView.vue'
import RestablecerContrasenaView from '@/views/RestablecerContrasena/RestablecerContrasenaView.vue'
import CodigoSeguridadView from '@/views/RestablecerContrasena/CodigoSeguridadView.vue'
import FormularioInsumoView from '@/views/Inventario/FormularioInsumoView.vue'
import ListadoInsumoView from '@/views/Inventario/ListadoInsumoView.vue'
import ListadoEntregasView from '@/views/Entregas/ListadoEntregasView.vue'
import CambiarContrasenaView from '@/views/RestablecerContrasena/CambiarContrasenaView.vue'
import CambiarContrasenaEmpleadoView from '@/views/RestablecerContrasena/CambiarContrasenaEmpleadoView.vue'
import ListadoEmpleadosView from '@/views/Registro/ListadoEmpleadosView.vue'
import FormularioEmpleadoView from '@/views/Registro/FormularioEmpleadoView.vue'
import ModificarInsumoView from '@/views/Inventario/ModificarInsumoView.vue'
import ListadoProductosInventarioView from '@/views/Inventario/ListadoProductosInventarioView.vue'
import FormularioProductoView from '@/views/Producto/FormularioProductoView.vue'
import ListadoProductosCatalogoView from '@/views/Catalogo/ListadoProductosCatalogoView.vue'
import ModificarEntregaView from '../views/Pedido/ModificarEntregaView.vue'
const routes = [
  {
    path: '/',
    name: 'Base',
    component: LoginUsuarioView
  },
  {
    path: '/registro',
    name: 'Registro',
    component: RegistroUsuarioView
  },
  {
    path: '/login',
    name: 'LoginUsuario',
    component: LoginUsuarioView
  },
  {
    path: '/producto',
    name: 'Producto',
    component: ProductoCatalogoView
  },
  {
    path: '/catalogo',
    name: 'CatalogoProductos',
    component: CatalogoPastelesView
  },
  {
    path: '/pedido',
    name: 'Pedido',
    component: DetallesPedidoView
  },
  {
    path: '/tarjeta',
    name: 'Tarjeta',
    component: PagoTarjetaView
  },
  {
    path: '/formato',
    name: 'Formato',
    component: PagoFormatoView
  },
  {
    path: '/pedidos',
    name: 'Pedidos',
    component: PedidosView
  },
  {
    path: '/direccion',
    name: 'Direccion',
    component: FormularioDireccionView
  },
  {
    path: '/elementoPedido',
    name: 'ElementoPedido',
    component: ElementoPedidoView
  },
  {
    path: '/elementoVenta',
    name: 'ElementoVenta',
    component: ElementoVentaView
  },
  {
    path: '/reportes',
    name: 'Reportes',
    component: ReporteVentasView,
  },
  {

    path: '/registro-pedido',
    name: 'RegistroPedido',
    component: DetallesPedidoView
  },
  {
    path: '/tipo-pago',
    name: 'TipoPago',
    component: TipoPagoView
  },
  {
    path: '/restablecer-contrasena',
    name: 'RestablecerContrasena',
    component: RestablecerContrasenaView
  },
  {
    path: '/codigo-seguridad',
    name: 'CodigoSeguridad',
    component: CodigoSeguridadView
  },
  {
    path: '/cambiar-contrasena',
    name: 'CambiarContrasena',
    component: CambiarContrasenaView
  },
  {
    path: '/cambiar-contrasena-empleado',
    name: 'CambiarContrasenaEmpleado',
    component: CambiarContrasenaEmpleadoView
  },
  {
    path: '/formulario-insumo',
    name: 'FormularioInsumo',
    component: FormularioInsumoView
  },
  {
    path: '/listado-insumo',
    name: 'ListadoInsumo',
    component: ListadoInsumoView
  },
  {
    path: '/modificar-insumo',
    name: 'ModificarInsumo',
    component: ModificarInsumoView
  },
  {
    path: '/listado-entregas',
    name: 'ListadoEntregas',
    component: ListadoEntregasView
  },
  {
    path: '/modificar-entrega',
    name: 'ModificarEntrega',
    component: ModificarEntregaView
  },
  {
    path: '/listado-empleados',
    name: 'ListadoEmpleados',
    component: ListadoEmpleadosView
  },
  {
    path: '/formulario-empleado',
    name: 'FormularioEmpleado',
    component: FormularioEmpleadoView
  },
  {
    path: '/productos-inventario',
    name: 'ProductosInventario',
    component: ListadoProductosInventarioView
  },
  {
    path: '/productos-catalogo',
    name: 'ProductosCatalogo',
    component: ListadoProductosCatalogoView
  },
  {
    path: '/formulario-producto',
    name: 'FormularioProducto',
    component: FormularioProductoView
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
