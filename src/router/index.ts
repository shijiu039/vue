import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/user/UserLogin.vue'
import ALogin from '../views/admin/AdminLogin.vue'
import Home from '../views/user/Home.vue'
import Register from '../views/user/UserRegister.vue'
import ARegister from '../views/admin/AdminRegister.vue'
import Person from '../views/user/UserHomepage.vue'
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
    {
      path: '/ALogin',
      name: 'adminLogin',
     component:ALogin
    },
    {
      path: '/ARegister',
      name: 'adminRegister',
     component:ARegister
    },
    {
      path: '/personal-center',
      name: 'personal-center',
     component:Person
    },
  ]
})

export default router
