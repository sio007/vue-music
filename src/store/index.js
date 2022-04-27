import Vue from 'vue'
import Vuex from 'vuex'

import musicModule from './modules/music'
import globalModule from './modules/global'
import userModule from './modules/user'
import createLogger from 'vuex/dist/logger'

Vue.use(Vuex)
const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: {
    music: musicModule,
    global: globalModule,
    user: userModule
  },
  plugins: debug ? [createLogger()] : []

})
