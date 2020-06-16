import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'
// import './css/style.css'
import VueFluent from 'vue-fluent'
import 'vue-fluent/dist/vue-fluent.min.css'
import "@mdi/font/css/materialdesignicons.css"
import router from './router'
Vue.config.productionTip = false

Vue.router = router
Vue.use(VueRouter)
Vue.use(VueFluent)
new Vue({
  render: function (h) { return h(App) },
  router
}).$mount('#app')