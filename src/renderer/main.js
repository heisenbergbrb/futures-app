import Vue from 'vue'
import axios from 'axios'
import Toasted from 'vue-toasted';
import PortalVue from 'portal-vue'

import App from './App'
import router from './router'
import store from './store'
import Standards from './mixins/standard'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false
Vue.use(Toasted)
Vue.use(PortalVue)

Vue.mixin(Standards)

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
