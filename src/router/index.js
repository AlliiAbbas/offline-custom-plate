import { createRouter, createWebHistory } from 'vue-router'
const routes = [
  {
    path: '/',
    name: 'Home',
    meta: {
      layout: 'Default'
    },
    component: () => import('../views/Home.vue')
  },
  {
    path: '/login',
    name: 'Login',
    meta: {
      layout: 'Login'
    },
    component: () => import('../views/auth/LoginPage.vue')
  },
  {
    path: '/customs-plate-insurance-offline',
    name: 'CustomsPlateInsuranceOffline',
    meta: {
      layout: 'Default'
    },
    component: () => import('../views/CustomsplateinsuranceOffline/CustomsPlateInsuranceOffline.vue')
  },
  {
    path: '/offline-plate',
    name: 'OfflinePlate',
    meta: {
      layout: 'Default'
    },
    component: () => import('../views/OfflinePlate/OfflinePlate.vue')
  },
  {
    path: '/table',
    name: 'TablePage',
    meta: {
      layout: 'Default'
    },
    component: () => import('../views/table/TablePage.vue')
  }
]


const router = createRouter({
  history: createWebHistory(),
  routes
})
router.beforeEach((to, from, next) => {
  const token = sessionStorage.getItem('token');
  if (token && to.path === '/login') {
    next('/');
  }
  else if (!token && to.path !== '/login') {
    next('/login');
  }
  else {
    next();
  }
});




export default router 