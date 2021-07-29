import { createStore } from 'vuex'
import userModule from './modules/userModule.js'

export default createStore({
  modules: {
    userModule
  }
})