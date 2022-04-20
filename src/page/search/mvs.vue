<template>
  <div class="search-mvs">
    <With-pagination :getData="getSearch" :getDataParams="searchParams" :limit="40" :scrollTarget="searchRoot.$refs && searchRoot.$refs.header" :total="mvCount" @getDataSuccess="onGetMvs">
      <ul class="list-wrap">
        <li :key="mv.id" class="list-item" v-for="mv in mvs">
          <MvCard :author="mv.artistName" :duration="mv.duration" :id="mv.id" :img="mv.cover" :name="mv.name" :playCount="mv.playCount"></MvCard>
        </li>
      </ul>
    </With-pagination>
  </div>
</template>

<script>
import { getSearch } from '@/api'
import MvCard from '@/components/mv-card'
import WithPagination from '@/components/with-pagination'

// 发起搜索mv请求中携带type的值
const SEARCH_TYPE_MV = 1004
export default {
  // 获取祖先组件传递过来的参数
  inject: ['searchRoot'],
  created () {
    // 将 搜索接口 变为该组件下的函数
    this.getSearch = getSearch
  },
  data () {
    return {
      // 获取搜索mv的数据
      mvs: [],
      // 获取搜索mv的数量
      mvCount: 0
    }
  },
  methods: {
    // 当得到搜索mv数据时触发
    onGetMvs ({ result: { mvs, mvCount } }) {
      // 获取 搜索mv数据(result)下的 mvs\mvCount
      this.mvs = mvs
      this.mvCount = mvCount
      // 将这个数量传递到父组件中 this.onUpdateCount 函数下更新搜索数量
      this.searchRoot.onUpdateCount(mvCount)
    }
  },
  computed: {
    // 获取祖先组件中keywords变量（搜索关键词）
    // 将keyword变量 和type设置为mv 变为发起搜索mv请求 中携带的参数对应值
    searchParams () {
      return { keywords: this.searchRoot.keywords, type: SEARCH_TYPE_MV }
    }
  },
  components: {
    WithPagination,
    MvCard
  }

}
</script>

<style lang="scss" scoped>
.search-mvs {
  max-width: 1000px;
  padding: $page-padding;
  margin: auto;

  @include list(25%);
}
</style>
