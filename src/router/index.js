import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from "../components/Layout";
import Home from "../views/Home";
import Classrooms from "../views/Classrooms";
import Login from "../views/Login";
import Register from "../views/Register";
import Appointments from "../views/Appointments";
import Users from "../views/Users";

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        component: Layout,
        children: [
            {
                path: '/',
                name: 'home',
                component: Home,
            },
            {
                path: '/classrooms',
                name: 'classrooms',
                component: Classrooms,
            },
            {
                path: '/appointments',
                name: 'appointments',
                component: Appointments,
            },
            {
                path: '/users',
                name: 'users',
                component: Users,
            }
        ]
    },
    {
        path: '/login',
        name: 'login',
        component: Login
    },
    {
        path: '/register',
        name: 'register',
        component: Register
    }
]

const router = new VueRouter({
    mode: 'hash',
    base: process.env.BASE_URL,
    routes
})

export default router
