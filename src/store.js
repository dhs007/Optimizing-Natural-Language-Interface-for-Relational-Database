import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
export default new Vuex.Store({
  state: {
    baseUrl: 'http://localhost:3000/api/v1',
    token: '',
    snackbar: {
      state: false,
      color: '',
      content: ''
    }
    // tokenValidity: false
  },
  getters: {
    getBaseUrl: (state) => state.baseUrl,
    getToken: (state) => state.token,
    getSnack: (state) => state.snackbar
  },
  mutations: {
    setTokenForUser (state, user) {
      state.token = user.token
      window.localStorage.setItem('token', user.token)
      // state.tokenValidity = true
    },
    removeTokenForUser (state) {
      state.token = ''
      window.localStorage.removeItem('token')
      // state.tokenValidity = false
    },
    createSnackbar (state, payload) {
      state.snackbar.state = true
      state.snackbar.color = payload.color
      state.snackbar.content = payload.content
    },
    networkError (state) {
      state.snackbar.state = true
      state.snackbar.color = 'red'
      state.snackbar.content = 'Network error'
    }
  }
})