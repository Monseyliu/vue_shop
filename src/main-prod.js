import Vue from 'vue'
import App from './App.vue'
import router from './router'
// import './plugins/element.js'
import './assets/css/global.css'
import axios from 'axios'
import TreeTable from 'vue-table-with-tree-grid'
// 导入富文本编辑器和对应的样式
import VueQuillEditor from 'vue-quill-editor'

// 导入 nprogress 进度条包和样式
import NProgress from 'nprogress'


// 在挂载之前设置拦截器，每次请求都携带token--在request 拦截器中开启进度条
axios.interceptors.request.use(config => {
  // 展示进度条
  NProgress.start();
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
// 挂载到VUE原型上
Vue.prototype.$http = axios
// 配置请求的根路径
axios.defaults.baseURL = 'http://timemeetyou.com:8889/api/private/v1/'

// 在response拦截器中隐藏进度条
axios.interceptors.response.use(config => {
  // 隐藏进度条
  NProgress.done();
  return config
})

// 注册TreeTable
Vue.component('tree-table', TreeTable)

// 注册 富文本编辑器
Vue.use(VueQuillEditor)

// 注册全局时间过滤函数
Vue.filter('dateFormat', function (originVal) {
  const dt = new Date(originVal)

  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')

  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})


Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
