import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import RegistroUsuarioView from '../views/Registro/RegistroUsuarioView.vue'
import LoginUsuarioView from '@/views/Login/LoginUsuarioView.vue'
import ProductoCatalogoView from '@/views/Producto/ProductoCatalogoView.vue'
import CatalogoPastelesView from '@/views/Catalogo/CatalogoPastelesView.vue'

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
