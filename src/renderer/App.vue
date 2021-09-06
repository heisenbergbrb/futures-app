<template>
  <div id="app">
    <router-view></router-view>
    <portal-target name="app" />
  </div>
</template>

<script>
export default {
  name: 'pyutyurs-app',
}
</script>

<style lang="scss" src="./assets/css/main.scss">
