<template>
  <portal to="app">
    <div 
      class="modal"
      :style="{zIndex: zIndex}"
    >
      <div class="overlay">
        <slot />
      </div>
    </div>
  </portal>
</template>

<script>
export default {
  props: ['zIndex']
}
</script>

<style lang="scss" scoped>
@import './Modal.scss';
</style>