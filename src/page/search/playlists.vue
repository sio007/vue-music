<template>
  <div class="search-playlists">
    <WithPagination :getData="getSearch" :getDataParams="searchParams" :limit="50" :scrollTarget="searchRoot.$refs && searchRoot.$refs.header" :total="playlistCount" @getDataSuccess="onGetPlaylists">
      <div class="list-wrap">
        <PlaylistCard :desc="`播放量：${$utils.formatNumber(item.playCount)}`" :id="item.id" :img="item.coverImgUrl" :key="item.id" :name="item.name" v-for="item in playlists" />
      </div>
    </WithPagination>
  </div>
</template>

<script>
import { getSearch } from '@/api'
import PlaylistCard from '@/components/playlist-card'
import WithPagination from '@/components/with-pagination'

// 发起搜索歌单请求中携带type的值
const SEARCH_TYPE_PLAYLIST = 1000

export default {
  // 获取祖先组件传递过来的参数
  inject: ['searchRoot'],
  created () {
    // 将 搜索接口 变为该组件下的函数
    this.getSearch = getSearch
  },
  data () {
    return {
      // 获取搜索歌单的数据
      playlists: [],
      // 获取搜索歌单的数量
      playlistCount: 0
    }
  },
  methods: {
    // 当得到搜索歌单数据时触发
    onGetPlaylists ({ result: { playlists, playlistCount } }) {
      // 获取 搜索歌单数据(result)下的 playlists\playlistCount
      this.playlists = playlists
      this.playlistCount = playlistCount
      // 将这个数量传递到父组件中 this.onUpdateCount 函数下更新搜索数量
      this.searchRoot.onUpdateCount(playlistCount)
    }
  },
  computed: {
    // 获取祖先组件中keywords变量（搜索关键词）
    // 将keyword变量 和type设置为歌单 变为发起搜索歌单请求 中携带的参数对应值
    searchParams () {
      return { keywords: this.searchRoot.keywords, type: SEARCH_TYPE_PLAYLIST }
    }
  },
  components: { WithPagination, PlaylistCard }
}
</script>

<style lang="scss" scoped>
.search-playlists {
  max-width: 1000px;
  padding: $page-padding;
  margin: auto;

  .list-wrap {
    display: flex;
    flex-wrap: wrap;
  }
}
</style>
