import Vue from 'vue'
import Home from './views/Home.vue'
import router from './router'
import './registerServiceWorker'

Vue.config.productionTip = false

new Vue({
  router,
  render: function (h) { return h(Home) }
}).$mount('#app')
