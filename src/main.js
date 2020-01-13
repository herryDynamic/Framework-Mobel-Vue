import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from '../src/utils/dynamicAxios'
import 'lib-flexible' // 引入 flexible用于适配不同屏幕移动端显示
import changeFontSize from './setHtmlFontSize'
// import 'amfe-flexible'
// import './hotcss.js'
import Retrieval from './utils/valculator/retrieval'
// import Add from './utils/valculator/add'
// import Subtraction from './utils/valculator/subtraction'
import Vant from 'vant'// 引入vant组件库
import echarts from 'echarts'// 引入echarts用于图表展示
import 'vant/lib/index.css'
Vue.use(Vant)
Vue.config.productionTip = false
Vue.prototype.$axios = axios // 全局挂载axios
Vue.prototype.$echarts = echarts// 全局挂载echarts
// eslint-disable-next-line new-cap
Vue.prototype.$changeFontSize = new changeFontSize() // 全局挂载修改字体大小的js
Vue.prototype.Retrieval = Retrieval // 选择加减乘除
// Vue.prototype.Add = Add
// Vue.prototype.Subtraction = Subtraction // 减法

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
