import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import RegistroUsuarioView from '../views/Registro/RegistroUsuarioView.vue'
import LoginUsuarioView from '@/views/Login/LoginUsuarioView.vue'
import ProductoCatalogoView from '@/views/Producto/ProductoCatalogoView.vue'
import CatalogoPastelesView from '@/views/Catalogo/CatalogoPastelesView.vue'
import DetallesPedidoView from '@/views/Pedido/DetallesPedidoView.vue'
import PagoTarjetaView from '@/views/Pedido/PagoTarjetaView.vue'
import PagoFormatoView from '@/views/Pedido/PagoFormatoView.vue'
import TablaPedidosView from '@/views/Pedido/TablaPedidosView.vue'
import FormularioDireccionView from '@/views/Pedido/FormularioDireccionView.vue'
import ElementoPedidoView from '@/views/Pedido/ElementoPedidoView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
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
    name: 'catalogo',
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
    path: '/tablaPedidos',
    name: 'tablaPedidos',
    component: TablaPedidosView
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
