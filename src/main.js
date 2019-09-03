require("es6-promise").polyfill();
import 'babel-polyfill'
import '@/styles/element-variables.scss'
import 'nprogress/nprogress.css'
import 'font-awesome/css/font-awesome.min.css'
import '@/styles/index.scss';               //自定义样式全局引入
import '@/common/fonts/style.css';          //自定义fonts

import Vue from 'vue'
import Vuex from 'vuex'
import VueRouter from 'vue-router'
import ElementUI from 'element-ui'
import axios from 'axios'

import App from './App'
import Util from '@/common/js/util.js'            //自定义公共js,包含全局变量公共方法
import Filters from '@/common/js/filters.js'      //自定义公共js,包含全局过滤器
import Check from '@/common/js/check.js'          //自定义公共js,包含全局数据校验
import Parking from '@/components/index'         //自定义公共组件全局引入
import echarts from '@/common/js/echarts.js'
import routes from '@/routes'
import store from '@/vuex/store'
import { Message } from 'element-ui'
import Print from 'vue-print-nb'
import NProgress from 'nprogress'

            

Vue.config.productionTip = false
Object.keys(Filters).forEach(k => Vue.filter(k, Filters[k]));

Vue.use(ElementUI)
Vue.use(VueRouter)
Vue.use(Vuex)
Vue.use(Parking)
Vue.use(Print) 


Vue.prototype.Util = Util
Vue.prototype.Check = Check
Vue.prototype.$axios = axios

/* 路由配置 */
const router = new VueRouter({
  // mode: 'history',
  routes
})

router.beforeEach((to, from, next) => {
  NProgress.start();

  if (to.path === '/login' || to.path === '/' ) {
    next()
    //跳转到登录页清除session
    sessionStorage.removeItem('userInfo')
    sessionStorage.removeItem('userPermission')
    sessionStorage.removeItem('userPermissionMarkList')
    sessionStorage.removeItem('commonTime')
    sessionStorage.removeItem('parkInfo')
    
  }else{
    // 登录拦截
    if (sessionStorage.getItem('userInfo')) {
      //权限拦截,TODO
      next()
    }else{
      alert(`您当前账户登录已失效,请您重新登录!`)   
      next({path: '/login'})
    }
  }


})

router.afterEach(transition => {
  NProgress.done();
});

/* axios配置 */
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8'

//  request 请求拦截器
axios.interceptors.request.use(
  config => {

    let userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
    if(userInfo) {  // 判断是否存在token，如果存在的话，则每个http header都加上token
      config.headers.Authorization = `${userInfo.token}`;
    }

    return config
  },
  err => {
    return Promise.reject(err)
  }
)

// http response 响应拦截器
axios.interceptors.response.use(
  response => {
    if (response.data.code === 'NOT_LOGGED_IN') {
      alert(`您当前账户登录已失效,请您重新登录!`)      
      router.push('/login')      
      
    }
    if (response.data.code === 'PERMISSION_LIMIT') {
      if (confirm("您的权限不足,需要重新登录获取权限吗?")) {
        router.push('/login')
      }      
      
    }    
    return response;
  },
  error => {
    Message.error('网络断开或服务器错误!请检查网络链接状况并尝试刷新页面解决此问题');
  }
);

new Vue({
  // el: '#app',
  // template: '<App/>',
  router,
  store,
  echarts,
  //components: { App }
  render: h => h(App)
}).$mount('#app')


