import Vue from 'vue'
import App from './App'
import uView from "uview-ui";
import { myRequest } from './utils/request.js'// 配置公共方法
Vue.use(uView);
// 挂载到全局，让所有页面都能接收
// 挂载到Vue的原型上
Vue.prototype.$myRequest = myRequest
Vue.config.productionTip = false

App.mpType = 'app'


const app = new Vue({
    ...App
})
app.$mount()
