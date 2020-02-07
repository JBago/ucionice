import VueRouter from 'vue-router'

// components
import Browse from './components/Browse'
import Home from './components/Home'


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
  
]

const router = new VueRouter({
  history: true,
  mode: 'history',
  routes,
})

export default router
