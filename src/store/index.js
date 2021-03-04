import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    profile: {
    
    },
    token: null
  },
  mutations: {
    setProfile: (state,payload)=> {
      state.token = payload.token
      state.profile = payload.profile
    }
  },
  actions: {
  },
  modules: {
  }
})
