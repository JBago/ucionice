import Vue from "vue";
import axios from "axios";
import {showNotification} from "./globals";

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

HTTP.interceptors.response.use(
    function (response) {
        return response;
    }, function (error) {
        let response = error.response;
        if (response) {
            if (response.status === 422) {
                showNotification(response.data[Object.keys(response.data)[0]])
            } else if (response.status === 500) {
                showNotification("Greška prilikom zahtjeva na server")
            } else if (response.status === 400 && response.data.message) {
                showNotification(response.data.message)
            }
        }
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
