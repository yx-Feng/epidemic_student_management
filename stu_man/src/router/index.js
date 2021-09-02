import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Notice from '../components/Notice.vue'
import TemForm from '../components/TemForm.vue'
import LeaveForm from '../components/LeaveForm.vue'
import StuProfile from '../components/StuProfile.vue'
import CounProfile from '../components/CounProfile.vue'
import Account from '../components/Account.vue'

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    {
      path: '/home',
      component: Home,
      redirect: '/welcome',
      children: [
        { path: '/welcome', component: Welcome },
        { path: '/notice', component: Notice },
        { path: '/temForm', component: TemForm },
        { path: '/leaveForm', component: LeaveForm },
        { path: '/stuProfile', component: StuProfile },
        { path: '/counProfile', component: CounProfile },
        { path: '/accounts', component: Account }
      ]
    }
  ]
})

// 挂载导航守卫
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router
