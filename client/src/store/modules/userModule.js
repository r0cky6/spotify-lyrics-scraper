import axios from 'axios'
const state = {
  currentUser : {}
}
const getters = {
  getCurrentUser( state ){ return state.currentUser }
}
const actions = {
  setCurrentUser({ commit }){ commit('setCurrentUser') },
  clearCurrentUser({ commit }){ commit('clearCurrentUser') }
}
const mutations = {
  async setCurrentUser( state ){
    state.currentUser = await axios.get('/api/u/').then(res => res.data)
  },
  clearCurrentUser( state ){
    state.currentUser = undefined
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}