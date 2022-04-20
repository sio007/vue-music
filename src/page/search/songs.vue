<template>
  <div class="search-songs">
    <WithPagination :getData="getSearch" :getDataParams="searchParams" :limit="30" :scrollTarget="searchRoot.$refs && searchRoot.$refs.header" :total="songCount" @getDataSuccess="onGetSearch">
      <div class="table">
        <SongTable :highlightText="keywords" :renderNameDesc="renderNameDesc" :songs="songs" :stripe="true" />
      </div>
    </WithPagination>
  </div>
</template>

<script type="text/ecmascript-6">
import { getSearch } from '@/api'
import SongTable from '@/components/song-table'
import WithPagination from '@/components/with-pagination'
import { createSong } from '@/utils'

export default {
  // 获取祖先组件传递过来的参数
  inject: ['searchRoot'],
  created () {
    // 将 搜索接口 变为该组件下的函数
    this.getSearch = getSearch
  },
  data () {
    return {
      // 获取搜索歌曲的数据
      songs: [],
      // 获取搜索歌曲的数量
      songCount: 0,
      // 当前显示的分页页码
      currentPage: 1
    }
  },
  methods: {
    // 当得到搜索歌曲数据时触发
    onGetSearch (result) {
      // 获取 搜索歌曲数据(result)下的 song\songCount
      const {
        result: { songs, songCount }
      } = result
      // 将搜索数据中所有的歌曲 进行数据处理
      this.songs = songs.map(song => {
        const { id, mvid, name, alias, artists, duration, album, fee } = song
        return createSong({
          id,
          name,
          alias,
          artists,
          duration,
          mvId: mvid,
          albumName: album.name,
          albumId: album.id,
          fee
        })
      })
      // 获取 搜索数据下所有的歌曲的数量
      this.songCount = songCount
      // 将这个数量传递到父组件中 this.onUpdateCount 函数下更新搜索数量
      this.searchRoot.onUpdateCount(songCount)
    },
    // 在该组件下额外渲染一个高亮组件
    renderNameDesc (scope) {
      // 获取组件下的所有插槽
      const { alias } = scope.row
      return alias.map(desc => (
        <HighlightText
          class="name-desc"
          text={desc}
          highlightText={this.keywords}
        />
      ))
    }
  },
  computed: {
    // 获取祖先组件中keywords变量（搜索关键词）
    keywords () {
      return this.searchRoot.keywords
    },
    // 将keyword变量 变为发起搜索请求 中携带的keyword参数对应值
    searchParams () {
      return { keywords: this.keywords }
    }
  },
  components: { SongTable, WithPagination }
}
</script>

<style lang="scss" scoped>
.search-song {
  .table {
    .name-desc {
      display: block;
      margin-top: 8px;
      color: var(--font-color-grey-shallow);
      @include text-ellipsis;
    }
  }

  .pagination {
    margin-top: 16px;
    text-align: right;
  }
}
</style>
