<template>
  <div class="header">
    <div class="left">
      <!-- icon按钮组 -->
      <div class="buttons">
        <div class="mac-button red">
          <Icon :size="9" type="home" />

        </div>
        <div class="mac-button yellow">
          <Icon :size="9" type="minus" />
        </div>
        <div class="mac-button green">
          <Icon :size="9" type="fullscreen" />
        </div>
      </div>
      <!-- 缩起播放器(只在播放器页面显示，layout页面隐藏) -->
      <div class="shrink-player">
        <Icon :backdrop="true" type="down" />
      </div>
      <!-- 路由记录器 -->
      <div class="history">
        <RoutesHistory />
      </div>
    </div>
    <div class="right">
      <!-- 搜索框 -->
      <div class="search-wrap">
        <Search />
      </div>
      <!-- 换肤按钮 -->
      <Theme />

    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import RoutesHistory from '@/components/routes-history'
import Search from '@/components/search'
import Theme from '@/components/theme'

export default {
  components: { RoutesHistory, Search, Theme }
}
</script>

<style lang="scss" scoped>
@import "~@/style/element-overwrite.scss";

.header {
  display: flex;
  justify-content: space-between;
  height: $header-height;
  background-color: var(--header-bgcolor);
  padding-right: 36px;

  @include el-input-theme(
    var(--header-input-color),
    var(--header-input-bgcolor),
    var(--header-input-placeholder-color)
  );

  /deep/.iconfont {
    color: var(--header-font-color);
  }

  .left {
    padding: 14px 14px 0 8px;
    display: flex;

    .font-weight {
      white-space: nowrap;
    }

    .buttons {
      display: flex;

      &:hover {
        .mac-button > i {
          opacity: 1;
        }
      }

      .mac-button {
        @include round(12px);
        @include flex-center;
        margin-right: 8px;
        cursor: pointer;

        &.red {
          background: #ed655a;
        }

        &.green {
          background: #72be47;
        }

        &.yellow {
          background: #e0c04c;
        }

        i {
          opacity: 0;
          transition: opacity 0.3s;
          color: $black;
          font-weight: $font-weight-bold;
          transform-origin: center center;
        }
      }
    }

    .shrink-player {
      position: relative;
      top: -6px;
      margin-left: 16px;
    }

    .history {
      margin-left: 65px;
    }

    .actions {
      margin-left: 70px;
    }
  }

  .right {
    display: flex;
    align-items: center;

    .search-wrap {
      margin-right: 16px;
    }
  }
}
</style>
