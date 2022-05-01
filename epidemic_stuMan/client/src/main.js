import { createApp } from 'vue' // 从vue模块中导入createApp方法
import App from './App.vue' // 导入根组件
import router from './router'
import ElementPlus from 'element-plus' // element-plus和它的样式
import 'element-plus/dist/index.css'
import './assets/css/global.css' // 导入全局样式
import axios from 'axios'

// 配置请求的根目录
axios.defaults.baseURL = 'http://localhost:5000'
// 通过axios请求拦截
axios.interceptors.request.use(config => {
  // 为请求头对象添加token验证的Authorization字段
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})

// 根据根组件创建应用实例,加载ElementPlus和router模块,将应用挂载到<div id="app"></div>这个DOM元素上面
const app = createApp(App)
// 使axios在全局范围内可用
app.config.globalProperties.$http = axios
app.use(ElementPlus)
app.use(router)
app.mount('#app')
