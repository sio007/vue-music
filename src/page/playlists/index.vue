// 推荐歌单页面
<template>
  <div class="playlists" ref="playlists">
    <div class="top-play-list-card" v-if="topPlaylist.id">
      <TopPlaylistCard :desc="topPlaylist.description" :id="topPlaylist.id" :img="topPlaylist.coverImgUrl" :name="topPlaylist.name" />
    </div>
    <div class="tabs">
      <Tabs :tabs="tabs" @tabChange="onTabChange" align="right" type="small" v-model="activeTabIndex" />
    </div>
    <div class="playlist-cards">
      <PlaylistCard :desc="`播放量：${$utils.formatNumber(item.playCount)}`" :id="item.id" :img="item.coverImgUrl" :key="item.id" :name="item.name" v-for="item in playlists" />
    </div>
    <Pagination :current-page.sync="currentPage" :page-size="PAGE_SIZE" :total="total" @current-change="onPageChange" class="pagination"></Pagination>
  </div>
</template>

<script>
import { getPlaylists, getTopPlaylists } from '@/api'
import PlaylistCard from '@/components/playlist-card'
import TopPlaylistCard from '@/components/top-playlist-card'
// getPageOffset用于切换分页时的偏移量
// scrollInto是将页面动画滑动到顶端
import { getPageOffset, scrollInto } from '@/utils'

// 一页显示的歌单数量
const PAGE_SIZE = 50
export default {
  async created () {
    // 一页显示的歌单数量
    this.PAGE_SIZE = PAGE_SIZE
    // tab栏中的标签 数据
    this.tabs = [
      '全部',
      '欧美',
      '华语',
      '流行',
      '说唱',
      '摇滚',
      '民谣',
      '电子',
      '轻音乐',
      '影视原声',
      'ACG',
      '怀旧',
      '治愈',
      '旅行'
    ]
    this.initData()
  },
  data () {
    return {
      // tab栏中被选中的标签的索引
      activeTabIndex: 0,
      // 歌单数据
      playlists: [],
      // 当前选中的页码
      currentPage: 1,
      // 歌单总数量
      total: 0,
      // 精品歌单数据
      topPlaylist: {}
    }
  },
  methods: {
    // 加载获取歌单和精品歌单的数据
    async initData () {
      this.getPlaylists()
      this.getTopPlaylists()
    },
    // 获取歌单数据
    async getPlaylists () {
      const { playlists, total } = await getPlaylists({
        // limit 一页歌单的数量限制
        limit: PAGE_SIZE,
        // offset 当前被选中的页码对应的歌单们
        offset: getPageOffset(this.currentPage, PAGE_SIZE),
        // cat 当前tab栏中被选中的标签
        cat: this.tabs[this.activeTabIndex]
      })
      this.playlists = playlists
      this.total = total
    },
    // 获取精品歌单数据
    async getTopPlaylists () {
      const { playlists } = await getTopPlaylists({
        // limit 歌单数量限制
        limit: 1,
        // cat 当前tab栏中被选中的标签
        cat: this.tabs[this.activeTabIndex]
      })
      this.topPlaylist = playlists[0] || {}
    },
    // 当前页码发生变化
    async onPageChange (page) {
      this.currentPage = page
      // 重新获取歌单数据
      this.getPlaylists()
      // 将滚轮滚回最顶端，并重新渲染歌单数据
      scrollInto(this.$refs.playlists)
    },
    // 当前tab栏的标签发生变化
    onTabChange () {
      // 选中页码重置为第一页
      this.currentPage = 1
      // 重新获取所有的数据
      this.initData()
    }
  },
  components: { PlaylistCard, TopPlaylistCard }
}
</script>

<style lang="scss" scoped>
.playlists {
  padding: 12px;

  .top-play-list-card {
    margin-bottom: 16px;
  }

  .playlist-cards {
    display: flex;
    flex-wrap: wrap;
  }

  .pagination {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 36px;
  }
}
</style>
