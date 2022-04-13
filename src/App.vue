<template>
  <div id="app">
    <Layout msg="Welcome to Your Vue.js App" />
  </div>
</template>

<script>
import Layout from '@/layout'

export default {
  metaInfo () {
    return {
      title: '欢迎来到sshPlayer'
    }
  },
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
