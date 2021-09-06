<template>
  <div>
    <Modal :zIndex="1000">
      <div class="heading-container flex justify-between items-center px-5" style="height: 68px">
        <header class="text-2xl font-medium">Settings</header>
        <button @click="closeSettings">
          <svg style="width:24px;height:24px" viewBox="0 0 24 24">
            <path fill="currentColor" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
          </svg>
        </button>
      </div>
      <section
        ref="settings"
        class="px-5 py-5 overflow-y-auto" 
        style="max-height: 500px"
      >
        <div class="border-b api-section mb-4 pb-4">
          <button 
            @click="toggleCloseApiSettings"
            class="btn-gray"
          >
            Change API settings
          </button>
        </div>
        <!-- Stop value -->
        <div class="flex flex-col mb-8">
          <div>
            <h1 class="text-lg">Leverage (✕)</h1>
          </div>
          <div>
            <input 
              v-model="leverage"
              type="text" 
              placeholder="Leverage value"
              class="dark-input mt-1"
            >
            <p class="text-sm text-red-500 mt-1">{{ error.leverageDesc }}</p>
          </div>
        </div>
        <!-- Stop limit value -->
        <div class="flex flex-col mb-8">
          <div>
            <h1 class="text-lg">Size (%)</h1>
          </div>
          <div>
            <input 
              v-model="size"
              type="text" 
              placeholder="Size value"
              class="dark-input mt-1"
            >
            <p class="text-sm text-red-500 mt-1">{{ error.size }}</p>
          </div>
        </div>
        <button 
          class="btn-blue"
          @click="handleSave"
        >
          Save
        </button>
      </section>
    </Modal>
    <ApiSettings
      v-if="showApiSettings"
      :onSettings="true" 
      @close="toggleCloseApiSettings"
      @saveAPI="handleSaveApi"
    />
  </div> 
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Modal from '../Modal/Modal.vue'
// import Switch from '../Switch/Switch.vue'
import ApiSettings from '../ApiSettings/ApiSettings.vue' 
// import config from '../../assets/config.json'

export default {
  components: {
    Modal,
    ApiSettings
  },
  mounted () {
    this.leverage = this.settings.leverage
    this.size = this.settings.size
  },
  data: () => ({
    desc: {
      leverageDesc: 'leverageDesc',
      sizeDesc: 'leverageDesc',
    },
    error: {
      leverage: '',
      size: ''
    },
    leverage: 0,
    size: 0,
    showApiSettings: false
  }),
  computed: {
    ...mapGetters({
      settings: 'getSettings'
    })
  },
  methods: {
    ...mapActions({
      toogleLoading: 'toogleLoading',
      connectToBinanceStore: 'connectToBinance',
      setSettings: 'setSettings'
    }),
    toggleCloseApiSettings () {
      this.showApiSettings = !this.showApiSettings
    },
    closeSettings () {
      this.$emit('toggleShowSettings')
    },
    handleSaveApi () {
      this.toogleLoading()
      this.connectToBinance()
    },
    connectToBinance () {
      // this.showConnecting = true
      this.connectToBinanceStore()
    },
    handleSave () {
      if (!this.validate()) {
        return
      }
      this.setSettings({
        leverage: +this.leverage,
        size: +this.size
      })
      this.$toasted.show('Settings saved.', {
        position: 'top-center',
        duration: 5000,
        singleton: true,
        action: [
          {
            text: 'OK',
            class: 'scs-btn',
            onClick : (_, toastObject) => {
              toastObject.goAway(0) 
            }
          }
        ]
      })
      this.$emit('toggleShowSettings')
    },
    validate () {
      if (this.leverage.length === 0) {
        this.showToastError('Leverage field is required')

        return false
      }
      if (this.size.length === 0) {
        this.showToastError('Size field is required')

        return false
      }
      if (+this.leverage > 100 || this.size.length > 3) {
        this.showToastError('Maximum leverage is 100✕')

        return false
      } 
      if (+this.size > 100 || this.size.length > 3) {
        this.showToastError('Maximum size is 100%')

        return false
      }
      
      return true
    },
  }
}
</script>

<style lang="scss" scoped>
@import './Settings.scss';
</style>