import Vue from 'vue'
import App from './App.vue'
import router from './router'
import '@/style/index.scss'
import store from './store'
import global from './utils/global'

Vue.config.productionTip = false
Vue.use(global)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
