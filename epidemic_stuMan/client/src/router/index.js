import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/components/LoginPage'
import Home from '@/components/HomePage'
import Welcome from '@/components/WelcomePage'
import StuProfile from '@/components/profile/StuProfile'
import CounProfile from '@/components/profile/CounProfile'
import TemForm from '@/components/temForm/TemForm'
import TemFormCheck from '@/components/temForm/TemFormCheck'
import LeaveForm from '@/components/leaveForm/LeaveForm'
import PendingLeaveForm from '@/components/leaveForm/PendingLeaveForm'
import PassedLeaveForm from '@/components/leaveForm/PassedLeaveForm'
import FailedLeaveForm from '@/components/leaveForm/FailedLeaveForm'
import Account from '@/components/account/AccountMan'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/tf', component: TemForm },
      { path: '/tf_check', component: TemFormCheck },
      { path: '/lf', component: LeaveForm },
      { path: '/pending_lf', component: PendingLeaveForm },
      { path: '/failed_lf', component: FailedLeaveForm },
      { path: '/passed_lf', component: PassedLeaveForm },
      { path: '/stu_pi', component: StuProfile },
      { path: '/coun_pi', component: CounProfile },
      { path: '/accounts', component: Account }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

// 挂载全局前置导航守卫
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router
