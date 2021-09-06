<template>
  <div class="title-container w-full h-8 flex items-center justify-between px-2">
    <span class="font-bold"></span>
    <div>
      <button @click="minimizeApp" class="mr-2">
        <svg style="width:20px;height:20px" viewBox="0 0 20 20">
          <path fill="currentColor" d="M19,13H5V11H19V13Z" />
        </svg>
      </button>
      <button @click="closeApp">
        <svg style="width:20px;height:20px" viewBox="0 0 20 20">
          <path fill="currentColor" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script>
import { remote } from 'electron'
import config from '../../assets/config.json'

export default {
  data: () => ({
    window: remote.getCurrentWindow(),
    title: config.title
  }),
  methods: {
    closeApp () {
      this.window.close()
    },
    minimizeApp () {
      this.window.minimize()
    }
  }
}
</script>

<style lang="scss" scoped>
@import './TitleBar.scss';
</style>