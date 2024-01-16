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
import TipoPagoView from '@/views/Pedido/TipoPagoView.vue'

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
