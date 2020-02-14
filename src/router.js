import VueRouter from 'vue-router'

// components
import Browse from './components/Browse'
import Home from './components/Home'
import Login from './components/Login'
import Register from './components/Register'



// Routes
const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
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
]

const router = new VueRouter({
  history: true,
  mode: 'history',
  routes,
})

export default router
