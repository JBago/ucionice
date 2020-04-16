import VueRouter from 'vue-router'
import {AXIOS} from './main'
// components
import Browse from './components/Browse'
import Home from './views/Home'
import Login from './views/Login'
import Register from './views/Register'
import Classrooms from "./views/Classrooms";


// Routes
const routes = [
    {
        path: '/home',
        alias: '/',
        name: 'home',
        component: Home,
        meta: {
            auth: undefined
        }
    },
    {
        path: '/classrooms',
        name: 'classrooms',
        component: Classrooms,
        meta: {
            auth: undefined
        }
    },
    {
        path: '/browse',
        name: 'browse',
        component: Browse,
        meta: {
            auth: undefined
        }
    },
    {
        path: '/login',
        name: 'login',
        component: Login,
        meta: {
            auth: false
        }
    },
    {
        path: '/register',
        name: 'register',
        component: Register,
        meta: {
            auth: false
        }
    },
];

const router = new VueRouter({
    history: true,
    mode: 'history',
    routes,
});

router.beforeEach((to, from, next) => {
    if (to.name !== "login" && to.name !== "register") {
        AXIOS
            .post("auth/validate")
            .then((res) => {
                if (res.status !== 200) {
                    next({name: "login"})
                } else {
                    next()
                }
            })
            .catch(() => next({name: "login"}));
    } else {
        next()
    }
});

export default router
