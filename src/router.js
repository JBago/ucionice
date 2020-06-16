import VueRouter from 'vue-router'

// components
import Browse from './components/Browse'
import Home from './components/Home'
import Login from './components/Login'
import Register from './components/Register'
import CreateProp from './components/Create'
import ModifyProp from './components/Modify'
import View from './components/View'


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
  {
    path: '/modify/:id',
    name: 'modify',
    component: ModifyProp,
    meta: {
      auth: true
    }
  },
  {
    path: '/create',
    name: 'create',
    component: CreateProp,
    meta: {
      auth: true
    }
  },
  {
    path: '/view/:id',
    name: 'view',
    component: View,
    meta: {
      auth: undefined
    }
  },
]

const router = new VueRouter({
  history: true,
  mode: 'history',
  routes,
})

export default router
