<template>
  <div style="height: 458px" class="w-full">
    <TitleBar />
    <div class="h-8" />
    <main class="h-full">
      <transition name="fade">
        <Loading 
          v-if="loading && !showSetAPI"
          :showConnecting="showConnecting"
        />
      </transition>
      <transition name="fade">
        <ApiSettings 
          v-if="showSetAPI"
          @saveAPI="handleSaveApi"
        />
      </transition>
      <MainScreen v-if="!loading" />
    </main>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import storage from 'electron-json-storage'

import TitleBar from '../TitleBar/TitleBar.vue'
import Loading from '../Loading/Loading.vue'
import ApiSettings from '../ApiSettings/ApiSettings.vue'
import MainScreen from '../MainScreen/MainScreen.vue'

export default {
  name: 'Layout',
  components: {
    TitleBar,
    Loading,
    ApiSettings,
    MainScreen
  },
  data: () => ({
    showSetAPI: false,
    showConnecting: false
  }),
  computed: {
    ...mapGetters({
      loading: 'loading',
      settings: 'getSettings',
      // isApiSet: 'isApiSet'
    }),
  },
  created () {
    // this.clearApiStorage()
  },
  async mounted () {
    await this.timeout(1000)
    this.init()
  },
  methods: {
    ...mapActions({
      setApi: 'setApi',
      setSettings: 'setSettings',
      clearApiStorage: 'clearApiStorage',
      toogleLoading: 'toogleLoading',
      connectToBinanceStore: 'connectToBinance'
    }),
    handleSaveApi () {
      this.connectToBinance()
      this.showSetAPI = false
    },
    async init () {
      const { apiKey, apiSecret } = await this.getAPIFromStorage()
      await this.getSettingsFromStorage()
      if (!apiKey && !apiSecret) {
        this.showSetAPI = true

        return
      }
      this.connectToBinance()
    },
    getSettingsFromStorage () {
      const vm = this
      return new Promise((resolve, _) => {
        storage.get('settings', function(error, data) {
          if (error) {
            storage.set('settings', {
              leverage: 20,
              size: 10
            })
          }
          if (Object.keys(data).length > 0) {
            vm.setSettings(data)
            resolve(data)

            return
          }
          const emptyData = {
            leverage: 20,
            size: 10
          }
          vm.setSettings(emptyData)
          resolve(emptyData)
        });
      })
    },
    getAPIFromStorage () {
      const vm = this
      return new Promise((resolve, _) => {
        storage.get('api', function(error, data) {
          if (error) {
            console.error('STORAGE GET ERROR')
            storage.set('api', {
              apiKey: '',
              apiSecret: ''
            })
          }
          if (Object.keys(data).length > 0) {
            vm.setApi(data)
            resolve(data)

            return
          }
          const emptyData = {
            apiKey: '',
            apiSecret: ''
          }
          vm.setApi(emptyData)
          resolve(emptyData)
        });
      })
    },
    connectToBinance () {
      this.showConnecting = true
      this.connectToBinanceStore()
    },
  }
}
</script>

<style>
  
</style>
