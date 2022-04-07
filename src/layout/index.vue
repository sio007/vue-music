<template>
  <div class="layout">
    <LayoutHeader />
    <div class="layout-body">
      <div class="layout-menu">
        <LayoutMenu />
      </div>
      <div class="content" id="page-content">
        <router-view :class="routerViewCls" />
      </div>
    </div>
  </div>
</template>

<script>
import LayoutHeader from './header'
import LayoutMenu from './menu'
export default {
  data () {
    return {}
  },
  components: {
    LayoutHeader,
    LayoutMenu
  }
}
</script>

<style lang="scss" scoped>
.layout {
  height: 100%;

  .layout-body {
    display: flex;
    height: calc(100% - #{$header-height});

    .layout-menu {
      // 这个100%已经减去了头部height
      height: calc(100% - #{$mini-player-height});
    }

    .content {
      flex: 1;
      overflow-y: auto;
      min-width: $layout-content-min-width;
      margin-bottom: $mini-player-height;

      .router-view-center {
        max-width: $center-content-max-width;
        margin: auto;
      }
    }
  }
}
</style>
