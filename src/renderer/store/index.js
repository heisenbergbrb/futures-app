import Vue from 'vue'
import Vuex from 'vuex'
import { createPersistedState, createSharedMutations } from 'vuex-electron'
import storage from 'electron-json-storage'
import Binance from 'binance-api-node'
import {default as NodeBinance } from 'node-binance-api';
import { remote } from 'electron'
import modules from './modules'
Vue.use(Vuex)  

let store = new Vuex.Store({ 
  state: { 
    binanceClient: null,
    nodeBinance: null, 
    loading: true,
    api: {
      key: '',
      secret: ''
    }, 
    settings: {
      leverage: null,
      size: null
    },
  },
  getters: { 
    isApiSet (state) {
      const { key, secret } = state.api
   
      return (key !== '' && secret !== '')
    },
    binanceClient (state) {
      return state.binanceClient 
    },
    nodeBinance (state) { 
      return state.nodeBinance 
    }, 
    loading (state) {
      return state.loading
    },
    getApi (state) {
      return state.api
    },
    getSettings (state) {
      return state.settings
    }
  }, 
  mutations: {  
    SET_API (state, payload) {
      state.api.key = payload.apiKey
      state.api.secret = payload.apiSecret
      storage.set('api', { 
        apiKey: payload.apiKey,
        apiSecret: payload.apiSecret
      })
    },
    TOGGLE_LOADING (state) {
      state.loading = !state.loading
    },
    SET_CLIENT (state, payload) {
      state.binanceClient = payload
    },
    SET_NODE_BINANCE (state, payload) {
      state.nodeBinance = payload
    },
    SET_SETTINGS (state, payload) {
      state.settings = payload
      storage.set('settings', payload)
    }
  },
  actions: {
    setApi ({ commit }, payload) {
      commit('SET_API', payload)
    },
    clearApiStorage () { 
      storage.remove('api')
    },
    setSettings ({ commit }, payload) {
      commit('SET_SETTINGS', payload)
    },
    toogleLoading ({ commit }) { 
      commit('TOGGLE_LOADING')
    },
    toogleLoadingOrder ({ commit }) { 
      commit('TOGGLE_LOADING')
      setTimeout(() => {
        commit('TOGGLE_LOADING')
      }, 1000);
    },
    async connectToBinance ({ commit, getters }) {
      const { key, secret } = getters.getApi
      const client = new Binance({
        apiKey: key,
        apiSecret: secret
      })
      const nodeBinance = new NodeBinance().options({
        APIKEY: key,
        APISECRET: secret
      });
      if (await client.futuresPing() === false || !await nodeBinance.futuresTime()) {
        alert('Can\'t connect to binance futures. Please try again later')
        const window = remote.getCurrentWindow() 
        window.close()

        return
      }
      commit('SET_CLIENT', client)
      commit('SET_NODE_BINANCE', nodeBinance)
      setTimeout(() => {
        commit('TOGGLE_LOADING')
      }, 500);
    },
  }
})

const vuexShits= {
  modules,
  plugins: [
    createPersistedState(),
    createSharedMutations()
  ],
  strict: process.env.NODE_ENV !== 'production'
}

store = { ...store, ...vuexShits }

export default store