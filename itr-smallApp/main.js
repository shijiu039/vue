import App from './App'

// #ifndef VUE3
import Vue from 'vue'
import './uni.promisify.adaptor'
import store from './store'
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
  ...App,
  store
})
app.$mount()
// main.js
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
import * as Pinia from  'pinia'
export function createApp() {
  const app = createSSRApp(App)
  app.use(Pinia.createPinia());
  return {
    app,
	Pinia,
  }
}

// #endif