<template>
   <div class="h-full flex justify-center items-center">
      <div class="wrapper">
         <div class="kinetic" />
         <span v-if="showConnecting" class="text-sm mt-8">Connecting to Binance...</span>
      </div>
   </div>
</template>

<script>
export default {
   props: {
      showConnecting: {
         type: Boolean,
         default: false
      }
   }
}
</script>

<style lang="scss" scoped>
@import './Loading.scss';
</style>