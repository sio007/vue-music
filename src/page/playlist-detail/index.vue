// 歌单详情页面
<template>
  <div class="playlist-detail" v-if="playlist.id">
    <!-- 歌单基本的详细内容 -->
    <DetailHeader ref="header" :playlist="playlist" :songs="songs" />
    <div class="tabs-wrap">
      <!-- 切换显示 歌曲列表 和 评论模块 的 tab栏选项 -->
      <Tabs :tabs="tabs" type="theme" v-model="activeTab" />
      <!-- 搜索歌单音乐 -->
      <el-input :class="getInputCls()" @blur="onInputBlur" @focus="onInputFocus" class="input" placeholder="搜索歌单音乐" prefix-icon="el-icon-search" v-model="searchValue" v-show="activeTab === SONG_IDX"></el-input>
    </div>
    <!-- 用于搜索不到音乐时显示的模块 -->
    <div class="empty" v-if="searchValue && !filteredSongs.length">
      未能找到和
      <span class="keyword">{{searchValue}}</span>
      相关的任何音乐
    </div>
    <!-- 歌曲列表 -->
    <!-- 这时song属性绑定的是搜索歌曲的计算属性
        是因为默认搜索框为空时，显示歌单的全部歌曲，
        所以在逻辑上是没有问题的
     -->
    <SongTable :highlightText="searchValue" :songs="filteredSongs" class="table" v-show="activeTab === SONG_IDX" />
    <!-- 评论列表 -->
    <div class="comments" v-show="activeTab === COMMENT_IDX">
      <Comments :id="id" @update="onCommentsUpdate" type="playlist" />
    </div>
  </div>
</template>

<script>
import DetailHeader from './header'
import SongTable from '@/components/song-table'
import Comments from '@/components/comments'
import { createSong, scrollInto } from '@/utils'
import { getListDetail, getSongDetail } from '@/api'

// 歌曲列表中显示的限制
const MAX = 500
// tab栏选项中的歌曲列表
const SONG_IDX = 0
// tab栏选项中的评论模块
const COMMENT_IDX = 1
export default {
  created () {
    // 将tab栏中选项索引变量导入
    this.SONG_IDX = SONG_IDX
    this.COMMENT_IDX = COMMENT_IDX
  },
  data () {
    return {
      // tab栏中显示选项的名称
      tabs: ['歌曲列表', '评论'],
      // 当前默认选中的tab栏选项
      activeTab: SONG_IDX,
      // 歌单详细内容
      playlist: {},
      // 歌单中的所有歌曲
      songs: [],
      // 搜索框的默认变量
      searchValue: '',
      // 搜索框光标 默认离开
      inputFocus: false
    }
  },
  methods: {
    // 加载数据
    async init () {
      // 根据歌单id获取歌单详细内容 数据
      const { playlist } = await getListDetail({ id: this.id })
      this.playlist = playlist
      // 将歌单详细内容中包含的歌曲进行处理
      this.genSonglist(this.playlist)
    },
    // 处理歌单详细内容中的全部歌曲
    async genSonglist (playlist) {
      // 获取全部歌曲的id
      const trackIds = playlist.trackIds.map(({ id }) => id)
      // 通过获取的id，获取每条歌曲详细信息（最多显示500条）
      const songDetails = await getSongDetail(trackIds.slice(0, MAX))
      // 将每一条歌曲的详细数据重新创建到一个数组中
      const songs = songDetails.songs.map(({ id, name, al, ar, mv, dt }) =>
        createSong({
          id,
          name,
          artists: ar,
          duration: dt,
          mvId: mv,
          albumName: al.name,
          img: al.picUrl
        })
      )
      // 将重新创建的数组赋值
      this.songs = songs
    },
    // 获取评论数量事件，从评论子组件中传递参数
    onCommentsUpdate ({ total }) {
      this.tabs.splice(COMMENT_IDX, 1, `评论(${total})`)
    },
    // 搜索框光标进入事件
    onInputFocus () {
      this.inputFocus = true
    },
    // 搜索框光标离开事件
    onInputBlur () {
      this.inputFocus = false
    },
    // 当搜索框光标进入时添加高亮类名
    getInputCls () {
      return !this.inputFocus ? 'inactive' : ''
    },
    // 页面回滚事件
    scrollToHeader () {
      // 获取到header头部
      const { header } = this.$refs
      if (header) {
        scrollInto(header.$el)
      }
    }
  },
  computed: {
    // 将链接中的歌单id 获取
    id () {
      return Number(this.$route.params.id)
    },
    // 根据搜索框中的内容 筛选 歌曲列表的数据
    // 如一开始搜索框为空，则是直接 筛选全部歌曲显示，所以一开始渲染歌曲列表时，可以使用该计算属性
    filteredSongs () {
      return this.songs.filter(({ name, artistsText, albumName }) =>
        `${name}${artistsText}${albumName}`
          .toLowerCase()
          .includes(this.searchValue.toLowerCase())
      )
    }
  },
  watch: {
    // 一获取到id时，将搜索框置空，并重新获取数据
    id: {
      handler () {
        this.searchValue = ''
        this.init()
      },
      // 在选项参数中指定 immediate: true 将立即以表达式的当前值触发回调
      immediate: true
    }
  },
  components: { DetailHeader, SongTable, Comments }
}
</script>

<style lang="scss" scoped>
.playlist-detail {
  width: 100%;

  .tabs-wrap {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0 24px;
    border-bottom: 1px solid var(--border);

    .input {
      width: 150px;

      &:not(:hover) {
        &.inactive {
          /deep/.el-input__inner {
            background: transparent !important;
          }
        }
      }
    }
  }

  .empty {
    @include flex-center;
    height: 200px;

    .keyword {
      color: $blue;
    }
  }

  .comments {
    padding: 16px 32px;
  }
}
</style>
