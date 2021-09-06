<template>
  <Modal :zIndex="1250">
    <div class="w-full">
      <section class="heading-container flex items-center px-5" style="height: 68px">
        <button
          v-if="onSettings"
          @click="closeSettings"
          class="mr-5"
        >
          <svg style="width:24px;height:24px" viewBox="0 0 24 24">
            <path fill="currentColor" d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z" />
          </svg>
        </button>
        <header class="text-2xl font-medium">API Settings</header>
      </section>
      <section class="px-5 py-5">
        <div class="flex flex-col mb-3">
          <div>
            <h1 class="text-lg">API Key</h1>
            <p class="text-sm text-gray-400">{{ desc.apiKey }}</p>
          </div>
          <div>
            <input
              v-model="apiKey"
              type="text" 
              placeholder="XXXX"
              class="dark-input mt-4"
            >
            <p class="text-sm text-red-500 mt-1">{{ error.apiKey }}</p>
          </div>
        </div>
        <div class="flex flex-col mb-3">
          <div>
            <h1 class="text-lg">Secret Key</h1>
            <p class="text-sm text-gray-400">{{ desc.apiSecret }}</p>
          </div>
          <div>
            <input
              v-model="apiSecret"
              type="text" 
              placeholder="YYYY"
              class="dark-input mt-4"
            >
            <p class="text-sm text-red-500 mt-1">{{ error.apiSecret }}</p>
          </div>
        </div>
        <button 
          class="btn-blue mt-3"
          @click="handleSave"
        >
          Save
        </button>
      </section>
    </div>
  </Modal>
</template>

<script>
import Modal from '../Modal/Modal.vue'
import config from '../../assets/config.json'

export default {
  components: {
    Modal
  },
  props: {
    onSettings: {
      type: Boolean,
      default: false
    }
  },
  mounted () {
    const { key, secret } = this.$store.getters['getApi']
    this.apiKey = key
    this.apiSecret = secret
  },
  data: () => ({
    apiKey: '',
    apiSecret: '',
    desc: {
      apiKey: config.settings.desc.apiKey,
      apiSecret: config.settings.desc.apiSecret,
    },
    error: {
      apiKey: '',
      apiSecret: '',
    },
  }),
  computed: {

  },
  methods: { 
    handleSave () {
      if (!this.validateInputs()) {
        return
      }
      this.$store.dispatch('setApi', {
        apiKey: this.apiKey.trim(),
        apiSecret: this.apiSecret.trim()
      })
      if (this.onSettings === false) {
        this.$toasted.show('API Settings saved.', {
          position: 'top-center',
          duration: 100,
          singleton: true
        })
        this.$emit('saveAPI')

        return
      }
      // TODO
      // Reconnect to binance
      this.$emit('saveAPI')
    },
    validateInputs () {
      this.error.apiKey = (this.apiKey.trim() === '') ? config.error.EMPTY_VALUE : ''
      this.error.apiSecret = (this.apiSecret.trim() === '') ? config.error.EMPTY_VALUE : ''
      if (this.error.apiKey.trim() !== ''
        || this.error.apiSecret.trim() !== ''
      ) {
        return false
      }

      return true
    },
    closeSettings () {
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>

</style>