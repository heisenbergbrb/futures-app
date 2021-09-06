import storage from 'electron-json-storage'

const state = {
  binanceClient: 'gago',
  loading: true,
  api: {
    key: '',
    secret: ''
  }, 
  settings: {
    leverage: '20',
    size: 10
  },
}
const getters = {
  isApiSet (state) {
    const { key, secret } = state.api

    return 'tangina'
  },
  binanceClient (state) {
    return state.binanceClient
  }
}
const mutations = { 
  SET_API (state, payload) {
    state.api.key = payload.apiKey
    state.api.secret = payload.apiSecret
    storage.set('api', {
      apiKey: payload.apiKey,
      apiSecret: payload.apiSecret
    })
  },
}
const actions = {
  setApi ({ commit }, payload) {
    commit('SET_API', payload)
  }
}


export default {
  state,
  mutations,
  actions,
  getters
}