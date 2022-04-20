<template>
  <div class="search">
    <!-- 输入搜索框 -->
    <el-input @click.native="onClickInput" @input="onInput" @keypress.native.enter="onEnterPress" placeholder="搜索" prefix-icon="el-icon-search" ref="input" v-model.trim="searchKeyword"></el-input>
    <!-- 搜索下拉框 当搜索框由光标进入时出现  -->
    <Toggle :reserveDoms="[$refs.input && $refs.input.$el]" :show.sync="searchPanelShow">
      <div class="search-panel" v-show="searchPanelShow">
        <!-- 搜索建议 -->
        <div class="search-suggest" v-if="suggestShow">
          <div :key="index" class="suggest-item" v-for="(normalizedSuggest, index) in normalizedSuggests">
            <div class="title">
              <Icon :size="12" :type="normalizedSuggest.icon" />
              {{normalizedSuggest.title}}
            </div>
            <ul class="list">
              <li :key="item.id" @click="normalizedSuggest.onClick(item)" class="item" v-for="item in normalizedSuggest.data">
                <HighlightText :highlightText="searchKeyword" :text="normalizedSuggest.renderName ? normalizedSuggest.renderName(item) : item.name" />
              </li>
            </ul>
          </div>
        </div>
        <!-- 搜索热词 -->
        <div class="search-hots" v-else>
          <!-- 热门搜索 -->
          <div class="block">
            <p class="title">热门搜索</p>
            <div class="tags">
              <NButton :key="index" @click="onClickHot(hot)" class="button" v-for="(hot, index) in searchHots">{{hot.first}}</NButton>
            </div>
          </div>
          <!-- 搜索历史 -->
          <div class="block">
            <p class="title">
              <Icon :size="12" type="remove" @click="removeHistory" />
              搜索历史
            </p>
            <div class="tags" v-if="searchHistorys.length">
              <NButton :key="index" @click="onClickHot(history)" class="button" v-for="(history, index) in searchHistorys">{{history.first}}</NButton>
            </div>
            <div class="empty" v-else>暂无搜索历史</div>
          </div>
        </div>
      </div>
    </Toggle>
  </div>
</template>

<script type="text/ecmascript-6">
import storage from 'good-storage'
import { mapActions, mapMutations } from '@/store/helper/music'
import { getSearchHot, getSearchSuggest } from '@/api'
import { createSong, genArtistisText, debounce } from '@/utils'

// 定义存储在storage中的历史记录变量的对应的键值
const SEARCH_HISTORY_KEY = '__search_history__'
export default {
  async created () {
    // 获取热搜列表返回的数据
    const {
      result: { hots }
    } = await getSearchHot()
    // 将获取的数据赋值到变量
    this.searchHots = hots
  },
  data () {
    return {
      // 控制搜索下拉框的显示
      searchPanelShow: false,
      // 输入框搜索关键词
      searchKeyword: '',
      // 热搜数据
      searchHots: [],
      // 获取热搜历史数据
      searchHistorys: storage.get(SEARCH_HISTORY_KEY, []),
      // 搜索建议数据
      suggest: {},
      // 绑定 Toggle组件中属性 的变量
      reserveDoms: []
    }
  },
  methods: {
    // 点击了输入框 将搜索下拉框显示
    onClickInput () {
      this.searchPanelShow = true
    },
    // 搜索框中光标离开 将搜索下拉框隐藏
    onBlur () {
      this.searchPanelShow = false
    },
    // 在 搜索框 绑定值改变时触发
    // debounce是第三方模块的函数，debounce让某个函数在一定 事件间隔条件 避免快速多次执行函数（操作DOM，加载资源等等）给内存带来大量的消耗从而一定程度上降低性能问题。
    // debounce：当调用动作n毫秒后，才会执行该动作，若在这n毫秒内又调用此动作则将重新计算执行时间
    // 输入框文字停止打字后才进行校验
    onInput: debounce(function(value) {
      // 如果输入框内容为空，则直接跳出函数
      if (!value.trim()) {
        return
      }
      // 输入框不为空，则将输入框内容做为参数，向获取搜索建议接口发送请求，获取数据
      getSearchSuggest(value).then(({ result }) => {
        this.suggest = result
      })
    }, 500),
    // 删除历史记录
    removeHistory () {
      // 将storage中保存历史记录的键值删除
      storage.remove(SEARCH_HISTORY_KEY)
      // 重新添加storage中保存历史记录的键值，并置为一个空的数组
      this.searchHistorys = storage.get(SEARCH_HISTORY_KEY, [])
    },
    // 点击了搜索热词
    onClickHot (hot) {
      // 将搜索热词的变量保存
      const { first } = hot
      // 将搜索热词的变量作为参数，调用搜索函数
      this.goSearch(first)
    },
    // 搜索输入框内按下回车键时触发
    onEnterPress () {
      // 如果输入框存在值
      if (this.searchKeyword) {
        // 将输入框的值作为参数，调用搜索函数
        this.goSearch(this.searchKeyword)
      }
    },
    // 搜索函数
    goSearch (keywords) {
      // 将搜索的关键词变量，保存到storage
      this.searchHistorys.push({ first: keywords })
      storage.set(SEARCH_HISTORY_KEY, this.searchHistorys)
      // 将关键词作为参数，跳转链接
      this.$router.push(`/search/${keywords}`)
      // 关闭搜索下拉框
      this.searchPanelShow = false
    },
    // 点击搜索建议中显示的歌曲
    async onClickSong (item) {
      // 将搜索建议中获取的歌曲数据进行处理
      const {
        id,
        name,
        artists,
        duration,
        mvid,
        album: { id: albumId, name: albumName },
        fee
      } = item
      const song = createSong({
        id,
        name,
        artists,
        duration,
        albumId,
        albumName,
        mvId: mvid,
        fee
      })
      // 播放点击的歌曲
      this.startSong(song)
      // 将被点击的歌曲加入到播放列表
      this.addToPlaylist(song)
    },
    // 点击了搜索建议中显示的歌单
    onClickPlaylist (item) {
      // 将搜索建议中获取的歌单数据 中的id保存
      const { id } = item
      // 将id作为参数，携带跳转链接
      this.$router.push(`/playlist/${id}`)
      // 关闭搜索下拉框
      this.searchPanelShow = false
    },
    // 点击了搜索建议中显示的mv
    onClickMv (mv) {
      // 将搜索建议中获取的mv数据 中的id保存
      const { id } = mv
      // 将id作为参数，携带跳转链接
      this.$router.push(`/mv/${id}`)
    },
    ...mapMutations(['setPlaylist']),
    ...mapActions(['startSong', 'addToPlaylist'])
  },
  computed: {
    // 搜索建议框的显示
    suggestShow () {
      return (
        // 如果输入搜索框的值有长度 且
        // 搜索建议数据中能找到songs和playlists的值 且
        // 搜索建议数据的key值有长度
        // 则显示搜索建议框
        this.searchKeyword.length &&
        ['songs', 'playlists'].find(key => {
          return this.suggest[key] && this.suggest[key].length
        })
      )
    },
    // 搜索建议框的数据 和 渲染
    normalizedSuggests () {
      return [
        {
          title: '单曲',
          icon: 'music',
          data: this.suggest.songs,
          renderName (song) {
            return `${song.name} - ${genArtistisText(song.artists)}`
          },
          onClick: this.onClickSong.bind(this)
        },
        {
          title: '歌单',
          icon: 'playlist',
          data: this.suggest.playlists,
          onClick: this.onClickPlaylist.bind(this)
        },
        {
          title: 'mv',
          icon: 'mv',
          data: this.suggest.mvs,
          renderName (mv) {
            return `${mv.name} - ${genArtistisText(mv.artists)}`
          },
          onClick: this.onClickMv.bind(this)
        }
      ].filter(item => item.data && item.data.length)
    }
  }
}
</script>

<style lang="scss" scoped>
.search {
  position: relative;
  width: 150px;

  .search-panel {
    position: fixed;
    top: $header-height;
    bottom: $mini-player-height;
    right: 0;
    width: 350px;
    background: var(--search-bgcolor);
    z-index: $search-panel-z-index;
    font-size: $font-size-sm;
    overflow-y: auto;
    @include box-shadow;

    .block {
      padding: 16px 24px;

      .title {
        color: var(--font-color-grey);
        margin-bottom: 16px;
      }
      .tags {
        display: flex;
        flex-wrap: wrap;

        .button {
          margin-bottom: 12px;
          margin-right: 6px;
          font-size: $font-size-sm;
        }
      }

      .empty {
        @include flex-center();
        color: var(--font-color-grey);
        font-size: $font-size;
        height: 100px;
      }
    }

    .suggest-item {
      margin-bottom: 16px;

      .title {
        margin: 16px 8px 8px;
        color: var(--font-color-grey-shallow);
      }

      .list {
        .item {
          padding: 12px 24px;
          cursor: pointer;
          @include text-ellipsis();

          &:hover {
            background: var(--light-bgcolor);
          }
        }
      }
    }
  }
}
</style>
