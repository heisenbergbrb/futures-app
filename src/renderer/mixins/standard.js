export default {
  methods: {
    timeout(ms) {
      return new Promise((resolve) => {
        window.setTimeout(resolve, ms)
      })
    },
    showToastError (msg) {
      this.$toasted.show(msg, {
          position: 'top-center',
          duration: 5000,
          singleton: true,
          action: [
            {
              text: 'OK',
              class: 'error-btn',
              onClick : (_, toastObject) => {
                toastObject.goAway(0) 
              }
            }
          ]
      })
    }
  }
}