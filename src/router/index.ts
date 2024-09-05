// router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/user/UserLogin.vue';
import ALogin from '../views/admin/AdminLogin.vue';
import Home from '../views/user/Home.vue';
import Register from '../views/user/UserRegister.vue';
import ARegister from '../views/admin/AdminRegister.vue';
import Person from '../views/user/UserHomepage.vue';
import ImageM from '../views/admin/imagemanagement.vue';
import TextM from '../views/admin/textmanagement.vue';
import UserM from '../views/admin/usermanagement.vue';
import { useAuthStore } from '../stores/auth'; // 引入 Pinia store
import { ref } from 'vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/Home',
      name: 'homepage',
      component: Home,
      meta: { requiresAuth: true }, // 标记此路由需要认证
    },
    {
      path: '/',
      name: 'login',
      component: Login,
    },
    {
      path: '/Register',
      name: 'register',
      component: Register,
    },
    {
      path: '/ALogin',
      name: 'adminLogin',
      component: ALogin,
    },
    {
      path: '/ARegister',
      name: 'adminRegister',
      component: ARegister,
    },
    {
      path: '/personal-center',
      name: 'personal-center',
      component: Person,
      meta: { requiresAuth: true }, // 标记此路由需要认证
    },
    {
      path: '/UserM',
      name: 'Admin-User',
      component: UserM,
      meta: { requiresAuth: true }, // 标记此路由需要认证
    },
    {
      path: '/TextM',
      name: 'Admin-Text',
      component: TextM,
      meta: { requiresAuth: true }, // 标记此路由需要认证
    },
    {
      path: '/ImageM',
      name: 'admin-Image',
      component: ImageM,
      meta: { requiresAuth: true }, // 标记此路由需要认证
    },
  ],
});

// 添加全局前置守卫
router.beforeEach((to, from, next) => {
  //const authStore = useAuthStore();
  const Userinfo = localStorage.getItem('userInfo');
  const data= ref<any>(null);
  if (Userinfo) {
    data.value = JSON.parse(Userinfo);
  }
  const token = data.value.data.user_name;
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (to.name !== 'login' && !token) {
      next('/');
    } else {
      next();
    }
  } else {
    next(); // 不需要认证的页面直接放行
  }
});


export default router;