import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import globals from './plugins/globals';
import router from './router';
import http_axios from "./plugins/http_axios";
import vuelidate from "./plugins/vuelidate";
import vue_moment from "./plugins/vue_moment";

Vue.config.productionTip = false

new Vue({
    vuetify,
    http_axios,
    vuelidate,
    vue_moment,
    router,
    render: function (h) {
        return h(App)
    },
    data: {
        globals
    }
}).$mount('#app')
