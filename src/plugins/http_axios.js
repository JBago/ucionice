import Vue from "vue";
import axios from "axios";

export const HTTP = axios.create({
    baseURL: (process.env.NODE_ENV === 'production' ? 'https://ivanmarincic.com/ucionice/api' : 'http://localhost:5005/ucionice/api')
})

HTTP.interceptors.request.use(
    function (config) {
        config.headers["Authorization"] = localStorage.getItem("jwt")
        config.headers["Group"] = localStorage.getItem("group")
        return config;
    }, function (error) {
        return Promise.reject(error);
    }
)

Vue.use({
    install: function () {
        Object.defineProperty(Vue.prototype, '$http', {
            get() {
                return HTTP
            }
        })
    }
});

export default HTTP
