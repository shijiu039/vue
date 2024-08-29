import { createApp } from 'vue'
import App from './App.vue'
import axios from "axios"
import router from './router';
import ElementPlus from "element-plus"
import 'element-plus/dist/index.css'
 
// app是vue是vue的实例对象
// 在一个vue项目中，有且只有一个vue实例对象
const app = createApp(App) ;
// 将axios挂在到全局
app.config.globalProperties.$axios = axios
app.use(ElementPlus)
app.use(router)
//App是根组件
app.use(router).mount('#app');