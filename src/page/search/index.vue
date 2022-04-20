// 搜索详情页面
<template>
  <div class="search-detail">
    <div class="header" ref="header">
      <span class="keywords">{{keywords}}</span>
      <span class="found">找到{{count}}结果</span>
    </div>
    <div class="tabs-wrap">
      <Tabs :tabs="tabs" itemClass="search-tab-item" />
    </div>
    <Empty class="empty" v-if="showEmpty">暂无结果</Empty>
    <router-view></router-view>
  </div>

</template>

<script tyep="text/ecmascript-6">
import { mapState as mapGlobalState } from '@/store/helper/global'
// tab栏数据
const tabs = [
  {
    title: '歌曲',
    key: 'songs',
    to: 'songs'
  },
  {
    title: '歌单',
    key: 'playlists',
    to: 'playlists'
  },
  {
    title: 'MV',
    key: 'mvs',
    to: 'mvs'
  }
]
export default {
  // 获取路由链接中传递的keywords对应的参数
  props: ['keywords'],
  // provide方法是祖先组件向子孙组件传递的参数
  provide () {
    return {
      // 将变量searchRoot 赋值为 该组件this对象
      searchRoot: this
    }
  },
  created () {
    // 将函数外部的tab栏数据获取
    this.tabs = tabs
  },
  data () {
    return {
      // 搜索结果的数量
      count: 0
    }
  },
  methods: {
    // 该方法是为了子组件准备的方法
    // 将子组件获取的 搜索结果数量 传递到父组件中赋值
    onUpdateCount (count) {
      this.count = count
    }
  },
  computed: {
    // 控制无搜索结果内容的变量
    showEmpty () {
      return !this.axiosLoading && this.count === 0
    },
    ...mapGlobalState(['axiosLoading'])
  }
}
</script>

<style lang="scss" scoped>
.search-detail {
  .header {
    padding: 20px 32px;

    .keywords {
      display: inline-block;
      margin-right: 4px;
      font-size: $font-size-title-lg;
      font-weight: $font-weight-bold;
    }

    .found {
      font-size: $font-size-sm;
      color: var(--font-color-grey-shallow);
      letter-spacing: 2px;
    }
  }

  .tabs-wrap {
    padding: 0 28px;
    border-bottom: 1px solid var(--border);

    /deep/.search-tab-item {
      font-size: $font-size;
    }
  }
}
</style>
