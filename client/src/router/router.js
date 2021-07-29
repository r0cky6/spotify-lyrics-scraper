import { createRouter, createWebHistory } from 'vue-router'
const login = () => import('../views/login-page.vue')
const home = () => import('../views/home-page.vue')
const redirect = () => import('../views/redirect-page.vue')

const routes = [
  {path: '/', name: 'home', component: home},
  {path: '/login', name: 'login', component: login},
  {path: '/signup', name: 'signup', component: login},
  {path: '/redirect', name: 'redirect', component: redirect},
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
