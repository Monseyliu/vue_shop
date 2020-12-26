import Vue from 'vue'
import VueRouter from 'vue-router'
import LoginNew from '../components/LoginNew.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/user/Users'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: LoginNew },
  {
    path: '/home', component: Home,redirect: '/welcome',
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/users', component: Users}
    ]
  }
]

const router = new VueRouter({
  routes
})

// 在路由暴露出去之前挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to将要访问的路径，from 表示从哪个路径跳转二楼，next 是一个函数表示放行，next()或 next('/login)
  if (to.path === '/login') return next();
  // 获取token判断
  const tokenStr = window.sessionStorage.getItem('token');
  if (!tokenStr) return next('/login');
  next();
})

export default router
