import Vue from 'vue'
import Vuex from 'vuex'

import globalMoudel from './modules/global'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    global: globalMoudel
  }
})
