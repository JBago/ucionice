import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'
import './css/style.css'
import "@mdi/font/css/materialdesignicons.css"
import router from './router'
import axios from "axios";

Vue.config.productionTip = false;

export const AXIOS = axios.create({
    baseURL: "http://localhost:5005/ucionice/"
});
AXIOS.interceptors.request.use(function (config) {
    let token = localStorage.getItem("jwt");
    if (token) {
        config.headers["Authorization"] = token;
    }
    let group = localStorage.getItem("group");
    if (group) {
        config.headers["Group"] = group;
    }
    return config;
});

Vue.router = router;
Vue.use(VueRouter);
Vue.use({
    install(Vue) {
        Vue.prototype.$axios = AXIOS
        Vue.mixin({
            created: function () {
                this.$currentUser = JSON.parse(localStorage.getItem("user"))
            }
        })
    }
});
new Vue({
    render: function (h) {
        return h(App)
    },
    router
}).$mount('#app');
