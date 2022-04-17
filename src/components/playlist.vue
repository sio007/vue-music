<template>
  <Toggle :reserveDoms="reserveDoms" :show="isPlaylistShow" @update:show="setPlaylistShow(false)">
    <div class="playlist" ref="playlist" v-show="isPlaylistShow">
      <Tabs :tabs="tabs" align="center" v-model="activeTab" />
      <div class="header">
        <p class="total">总共{{dataSource.length}}首</p>
        <div class="remove" @click="clear" v-if="dataSource.length">
          <Icon type="remove" />
          <span class="text">清空</span>
        </div>
      </div>
      <template>
        <div class="song-table-wrap" v-if="dataSource.length">
          <SongTable :hideColumns="['index','img','albumName']" :songs="dataSource" />
        </div>
        <div class="empty" v-else>你还没添加任何歌曲</div>
      </template>
    </div>
  </Toggle>
</template>

<script type="text/ecmascript-6">
import { mapState, mapMutations, mapActions } from '@/store/helper/music'
import SongTable from './song-table'
export default {
  mounted () {
    // 获取mini播放器dom做为保留dom对象 变量
    this.reserveDoms = [document.getElementById('mini-player')]
  },
  data () {
    // tab栏的数据
    this.tabs = ['播放列表', '历史记录']
    // 播放列表在tab栏中的索引
    this.LIST_TAB = 0
    // 历史记录在tab栏中的索引
    this.HISTORY_TAB = 1
    return {
      // 将播放列表设为当前点击的tab栏
      activeTab: this.LIST_TAB,
      // 要保留一个dom对象，用于判断toggle中点击对象，是否存在于这一个保留dom对象下
      reserveDoms: null
    }
  },
  methods: {
    // 清空按钮
    clear () {
      // 如果当前tab栏点击的是播放列表，则清空播放列表
      if (this.isPlaylist) {
        this.clearPlaylist()
      } else {
        // 反则清空历史记录
        this.clearHistory()
      }
    },
    ...mapMutations(['setPlaylistShow', 'setPlaylist']),
    ...mapActions(['clearCurrentSong', 'clearPlaylist', 'clearHistory'])
  },
  computed: {
    // 组件中数据源（播放列表或历史记录）
    dataSource () {
      // 根据tab栏的索引进行判断，获取数据源
      return this.isPlaylist ? this.playlist : this.playHistory
    },
    // 将当前点击的tab栏项设为播放列表索引
    isPlaylist () {
      return this.activeTab === this.LIST_TAB
    },
    ...mapState(['isPlaylistShow', 'playlist', 'playHistory'])
  },
  components: { SongTable }
}
</script>

<style lang="scss" scoped>
@import "~@/style/element-overwrite.scss";

.playlist {
  position: fixed;
  top: 0;
  right: 0;
  width: 400px;
  bottom: $mini-player-height;
  display: flex;
  flex-direction: column;
  background: var(--playlist-bgcolor);
  z-index: $playlist-z-index;
  @include box-shadow;
  @include el-table-theme(var(--playlist-bgcolor));

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 40px;
    margin: 0 20px;
    border-bottom: 1px solid var(--border);

    .total {
      font-size: $font-size-sm;
    }

    .remove {
      @include flex-center;
      cursor: pointer;
      font-size: $font-size-sm;

      .text {
        display: inline-block;
        margin-left: 4px;
      }
    }
  }

  .song-table-wrap {
    flex: 1;
    overflow-y: auto;
  }

  .empty {
    @include flex-center();
    flex: 1;
  }
}
</style>
