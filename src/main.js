import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'
import 'bulma'
import "@mdi/font/css/materialdesignicons.css"
import router from './router'
Vue.config.productionTip = false

Vue.router = router
Vue.use(VueRouter)
new Vue({
  render: function (h) { return h(App) },
  router
}).$mount('#app')