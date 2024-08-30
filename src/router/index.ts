import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/user/UserLogin.vue'
import ALogin from '../views/admin/AdminLogin.vue'
import Home from '../views/user/Home.vue'
import Register from '../views/user/UserRegister.vue'
import ARegister from '../views/admin/AdminRegister.vue'
import Person from '../views/user/UserHomepage.vue'
import ImageM from '../views/admin/imagemanagement.vue'
import TextM from '../views/admin/textmanagement.vue'
import UserM from '../views/admin/usermanagement.vue'
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
    {
      path: '/UserM',
      name: 'Admin-User',
     component:UserM
    },
    {
      path: '/TextM',
      name: 'Admin-Text',
     component:TextM
    },
    {
      path: '/ImageM',
      name: 'admin-Image',
     component:ImageM
    },
  ]
})

export default router
