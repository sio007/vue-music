<template>
  <div id="app">
    <Layout msg="Welcome to Your Vue.js App" />
  </div>
</template>

<script>
import Layout from '@/layout'

export default {
  name: 'app',
  components: {
    Layout
  }
}
</script>

<style lang="scss">
#app {
  height: 100%;
  background-color: var(--body-bgcolor);
  font-size: $font-size;
}
</style>
