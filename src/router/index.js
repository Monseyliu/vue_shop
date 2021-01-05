import Vue from 'vue'
import VueRouter from 'vue-router'

// import Login from '' 路由懒加载模式
const Login = () => import(/*webpackChunkName: "login_home_welcome"*/'../components/Login.vue')
// import Home from '../components/Home.vue'
const Home = () => import(/*webpackChunkName: "login_home_welcome"*/'../components/Home.vue')
// import Welcome from '../components/Welcome.vue'
const Welcome = () => import(/*webpackChunkName: "login_home_welcome"*/'../components/Welcome.vue')

// import Users from '../components/user/Users.vue'
const Users = () => import(/*webpackChunkName: "users_rights_roles"*/'../components/user/Users.vue')
// import Roles from '../components/rights/Roles.vue'
const Roles = () => import(/*webpackChunkName: "users_rights_roles"*/'../components/rights/Roles.vue')
// import Rights from '../components/rights/Rights.vue'
const Rights = () => import(/*webpackChunkName: "users_rights_roles"*/'../components/rights/Rights.vue')

// import Cate from '../components/goods/Cate.vue'
const Cate = () => import(/*webpackChunkName: "cate_params"*/'../components/goods/Cate.vue')
// import Params from '../components/goods/Params.vue'
const Params = () => import(/*webpackChunkName: "cate_params"*/'../components/goods/Params.vue')

// import Goods from '../components/goods/Goods.vue'
const Goods = () => import(/*webpackChunkName: "goods_add"*/'../components/goods/Goods.vue')
// import Add from '../components/goods/Add.vue'
const Add = () => import(/*webpackChunkName: "goods_add"*/'../components/goods/Add.vue')

// import Order from '../components/order/Order.vue'
const Order = () => import(/*webpackChunkName: "order_report"*/'../components/order/Order.vue')
// import Report from '../components/report/Report.vue'
const Report = () => import(/*webpackChunkName: "order_report"*/'../components/report/Report.vue')

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home', component: Home, redirect: '/welcome',
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/users', component: Users },
      { path: '/roles', component: Roles },
      { path: '/rights', component: Rights },
      { path: '/categories', component: Cate },
      { path: '/params', component: Params },
      { path: '/goods', component: Goods },
      { path: '/goods/add', component: Add },
      { path: '/orders', component: Order},
      { path: '/reports', component: Report}
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
