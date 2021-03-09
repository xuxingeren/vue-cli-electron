import { createStore } from 'vuex'
import modules from './modules'
import getters from './getters'

export default createStore({
  modules,
  getters
})
