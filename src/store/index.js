import Vue from 'vue'
import Vuex from 'vuex'
import { getUser, saveUser } from '@/utils/auth'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    user: getUser() || {}
  },
  mutations: {
    changeUser (state, user) {
      Object.assign(state.user, user)
      saveUser(state.user)
    }
  }
})

export default store
