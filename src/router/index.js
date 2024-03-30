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
import TablaVentasView from '@/views/Venta/TablaVentasView.vue'
import ElementoVentaView from '@/views/Venta/ElementoVentaView.vue'
import ReporteVentasView from '@/views/Venta/ReporteVentasView.vue'
import TipoPagoView from '@/views/Pedido/TipoPagoView.vue'
import RestablecerContrasenaView from '@/views/RestablecerContrasena/RestablecerContrasenaView.vue'
import CodigoSeguridadView from '@/views/RestablecerContrasena/CodigoSeguridadView.vue'
import FormularioInsumoView from '@/views/Inventario/FormularioInsumoView.vue'
import ListadoInsumoView from '@/views/Inventario/ListadoInsumoView.vue'
import ListadoEntregasView from '@/views/Entregas/ListadoEntregasView.vue'
import CambiarContrasenaView from '@/views/RestablecerContrasena/CambiarContrasenaView.vue'

const routes = [
  {
    path: '/',
    name: 'login',
    component: LoginUsuarioView
  },
  {
    path: '/registro',
    name: 'Registro',
    component: RegistroUsuarioView
  },
  {
    path: '/login',
    name: 'login',
    component: LoginUsuarioView
  },
  {
    path: '/producto',
    name: 'producto',
    component: ProductoCatalogoView
  },
  {
    path: '/catalogo',
    name: 'catalogoProductos',
    component: CatalogoPastelesView
  },
  {
    path: '/pedido',
    name: 'pedido',
    component: DetallesPedidoView
  },
  {
    path: '/tarjeta',
    name: 'tarjeta',
    component: PagoTarjetaView
  },
  {
    path: '/formato',
    name: 'formato',
    component: PagoFormatoView
  },
  {
    path: '/pedidos',
    name: 'pedidosview',
    component: PedidosView
  },
  {
    path: '/direccion',
    name: 'direccion',
    component: FormularioDireccionView
  },
  {
    path: '/elementoPedido',
    name: 'elementoPedido',
    component: ElementoPedidoView
  },
  {
    path: '/tablaVentas',
    name: 'tablaVentas',
    component: TablaVentasView
  },
  {
    path: '/elementoVenta',
    name: 'elementoVenta',
    component: ElementoVentaView
  },
  {
    path: '/reportes',
    name: 'reportes',
    component: ReporteVentasView,
  },
  {

    path: '/registro-pedido',
    name: 'registroPedido',
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
    path: '/listado-entregas',
    name: 'ListadoEntregas',
    component: ListadoEntregasView
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
