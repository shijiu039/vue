import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/user/UserLogin.vue'
import Home from '../views/user/Home.vue'
import Register from '../views/user/UserRegister.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/Home',
      name: 'homepage',
      component:Home
    },
    {
      path: '/',
      name: 'login',
     component:Login
    },
    {
      path: '/Register',
      name: 'register',
     component:Register
    },
  ]
})

export default router
