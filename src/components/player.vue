<template>
  <transition name="slide">
    <div v-if="hasCurrentSong" :class="getPlayerShowCls()" class="player">
      <div class="content">
        <div class="song">
          <div class="left">
            <img class="play-bar-support" src="@/assets/image/play-bar-support.png" />
            <img :class="{playing}" class="play-bar" src="@/assets/image/play-bar.png" />
            <div class="img-outer-border" ref="disc">
              <div :class="{paused: !playing}" class="img-outer" ref="discRotate">
                <div class="img-wrap">
                  <img v-lazy="$utils.genImgUrl(currentSong.img,400)">
                </div>
              </div>
            </div>
          </div>
          <div class="right">
            <div class="name-wrap">
              <p class="name">{{currentSong.name}}</p>
              <span @click="onGoMv" class="mv-tag" v-if="currentSong.mvId">MV</span>
            </div>
            <div class="desc">
              <div class="desc-item">
                <span class="label">歌手：</span>
                <div class="value">{{currentSong.artistsText}}</div>
              </div>
            </div>
            <empty v-if="nolyric">还没有歌词哦~</empty>
            <Scroller :data="lyric" :options="{disableTouch:true}" @init="onInitScroller" class="lyric-wrap" ref="scroller" v-else>
              <div>
                <div :class="getActiveCls(index)" :key="index" class="lyric-item" ref="lyric" v-for="(l,index) in lyricWithTranslation">
                  <p :key="contentIndex" class="lyric-text" v-for="(content, contentIndex) in l.contents">{{content}}</p>
                </div>
              </div>
            </Scroller>
          </div>
        </div>
        <div class="bottom">
          <div class="left">
            <Comments :id="currentSong.id" ref="comments" v-if="currentSong.id" />
          </div>
          <div class="right" v-if="simiPlaylists.concat(simiSongs).length">
            <Loading :loading="simiLoading" v-if="simiLoading" />
            <div v-else>
              <div class="simi-playlists" v-if="simiPlaylists.length">
                <p class="title">包含这首歌的歌单</p>
                <div :key="simiPlaylist.id" class="simi-item" v-for="simiPlaylist in simiPlaylists">
                  <Card :img="simiPlaylist.coverImgUrl" :name="simiPlaylist.name" @click="onClickPlaylist(simiPlaylist.id)">
                    <template v-slot:desc>
                      <div class="desc">
                        <Icon :size="12" color="shallow" type="play" />
                        <p class="count">{{$utils.formatNumber(simiPlaylist.playCount)}}</p>
                      </div>
                    </template>
                  </Card>
                </div>
              </div>
              <div class="simi-songs" v-if="simiSongs.length">
                <p class="title">相似歌曲</p>
                <div :key="simiSong.id" class="simi-item" v-for="simiSong in simiSongs">
                  <Card :desc="simiSong.artistsText" :img="simiSong.img" :name="simiSong.name" @click="onClickSong(simiSong)">
                    <template v-slot:img-mask>
                      <PlayIcon class="play-icon" />
                    </template>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { getSimiSongs, getLyric, getSimiPlaylists } from '@/api'
import lyricParser from '@/utils/lrcparse'
import { debounce, isDef, createSong, goMvWithCheck } from '@/utils'
import Comments from '@/components/comments'
import { mapState, mapMutations, mapActions, mapGetters } from '@/store/helper/music'

const WHEEL_TYPE = 'wheel'
const SCROLL_TYPE = 'scroll'
// 恢复自动滚动的定时器时间
const AUTO_SCROLL_RECOVER_TIME = 1000
export default {
  created () {
    this.lyricScrolling = {
      [WHEEL_TYPE]: false,
      [SCROLL_TYPE]: false
    }
    this.lyricTimer = {
      [WHEEL_TYPE]: null,
      [SCROLL_TYPE]: null
    }
  },
  data () {
    return {
      // 歌词
      lyric: [],
      // 翻译后的歌词
      tlyric: [],
      // 相似列表加载时的开关
      simiLoading: false,
      // 相似歌单
      simiPlaylists: [],
      // 相似歌曲
      simiSongs: [],
      // 判断没有歌词的变量
      nolyric: false,
      geci: []
    }
  },
  methods: {
    // 加载页面中包含的数据
    async updateSong () {
      this.updateLyric()
      this.updateSimi()
    },
    // 加载歌词数据
    async updateLyric () {
      // 向获取歌词的接口发送请求
      const result = await getLyric(this.currentSong.id)
      // 判断返回的数据中有没有歌词
      this.nolyric = !isDef(result.lrc) || !result.lrc.lyric
      // 如果有歌词
      if (!this.nolyric) {
        // 通过lyricParser函数处理，获取原歌词和翻译后的歌词
        const { lyric, tlyric } = lyricParser(result)
        this.lyric = lyric
        this.tlyric = tlyric
      }
      this.geci = result
      console.log(this.geci)
      console.log(this.lyric)
      console.log(this.tlyric)
    },
    // 加载相似列表数据
    async updateSimi () {
      // 打开相似列表加载时的开关
      this.simiLoading = true
      // 向获取相似歌单和相似歌曲的接口发送请求
      const [simiPlaylists, simiSongs] = await Promise.all([
        getSimiPlaylists(this.currentSong.id), getSimiSongs(this.currentSong.id)
      ]).finally(() => {
        // 获取成功后将关闭开关
        this.simiLoading = false
      })
      // 将获取歌单的数据赋值
      this.simiPlaylists = simiPlaylists.playlists
      // 将获取的相似歌曲经过处理，赋值到变量中
      this.simiSongs = simiSongs.songs.map(song => {
        const {
          id,
          name,
          artists,
          mvid,
          album: { picUrl },
          duration
        } = song
        return createSong({
          id,
          name,
          artists,
          duration,
          img: picUrl,
          mvId: mvid
        })
      })
      console.log(this.simiPlaylists)
      console.log(this.simiSongs)
    },
    // 得到当前播放器的显示变量
    getPlayerShowCls () {
      return this.isPlayerShow ? 'show' : 'hide'
    },
    // 当前高亮定位歌词段的样式的添加
    getActiveCls (index) {
      return this.activeLyricIndex === index ? 'active' : ''
    },
    // 根据当前播放状态，为左侧黑胶唱机添加动画样式
    getDiscRotateCls () {
      return this.playing ? 'rotate' : 'pause'
    },
    // 定义滚动Scroller组件相关设置项
    onInitScroller (scoller) {
      // 定义手动滚动开始函数
      const onScrollStart = type => {
        // 清除自动滚动定时器
        this.clearTimer(type)
        this.lyricScrolling[type] = true
      }
      // 定义手动滚动结束函数
      const onScrollEnd = type => {
        // 滚动结束后两秒 歌词开始自动滚动
        this.clearTimer(type)
        this.lyricTimer[type] = setTimeout(() => {
          this.lyricScrolling[type] = false
        }, AUTO_SCROLL_RECOVER_TIME)
      }
      // 为scroll组件鼠标滚轮手动 滚动开始事件绑定函数
      scoller.on('scrollStart', onScrollStart.bind(null, SCROLL_TYPE))
      // 为scroll组件鼠标手动移动 滚动开始事件绑定函数
      scoller.on('mousewheelStart', onScrollStart.bind(null, WHEEL_TYPE))

      // 为scroll组件鼠标滚轮手动 滚动结束事件绑定函数
      scoller.on('scrollEnd', onScrollEnd.bind(null, SCROLL_TYPE))
      // 为scroll组件鼠标手动移动 滚动结束事件绑定函数
      scoller.on('mousewheelEnd', onScrollEnd.bind(null, WHEEL_TYPE))
    },
    // 自动滚动到定位歌词段
    scrollToActiveLyric () {
      if (this.activeLyricIndex !== -1) {
        const { scroller, lyric } = this.$refs
        if (lyric && lyric[this.activeLyricIndex]) {
          scroller
            .getScroller()
            .scrollToElement(lyric[this.activeLyricIndex], 200, 0, true)
        }
      }
    },
    // 清除自动滚动的定时器
    clearTimer (type) {
      this.lyricTimer[type] && clearTimeout(this.lyricTimer[type])
    },
    // 点击相似歌单 触发事件
    onClickPlaylist (id) {
      // 点击的相似歌单和当前打开的个单页是同一个 直接关闭player
      if (id === Number(this.$route.params.id)) {
        this.setPlayerShow(false)
      } else {
        // 直接跳转到歌单链接
        this.$router.push(`/playlist/${id}`)
      }
    },
    // 点击相似歌曲
    onClickSong (song) {
      // 开始播放歌曲
      this.startSong(song)
      // 将歌曲添加到播放列表
      this.addToPlaylist(song)
    },
    // 点击mv按钮
    onGoMv () {
      // 将player播放器隐藏
      this.setPlayerShow(false)
      // 携带mvid调用 跳转mv详情页面的 函数
      goMvWithCheck(this.currentSong.mvId)
    },
    // 刷新scroller组件函数
    resizeScroller: debounce(function() {
      // 获取scroller组件dom对象中的refresh刷新事件
      this.$refs.scroller.getScroller().refresh()
    }, 500),
    // 为window对象下的刷新事件，添加刷新scroller组件函数
    addResizeListener () {
      window.addEventListener('resize', this.resizeScroller)
    },
    // 为window对象下的刷新事件，移除刷新scroller组件函数
    removeResizeListener () {
      window.removeEventListener('resize', this.resizeScroller)
    },
    ...mapMutations(['setPlayerShow']),
    ...mapActions(['startSong', 'addToPlaylist'])
  },
  computed: {
    // 处理当前歌曲播放歌词的索引
    activeLyricIndex () {
      return this.lyricWithTranslation
        ? this.lyricWithTranslation.findIndex((l, index) => {
          const nextLyric = this.lyricWithTranslation[index + 1]
          return (
            this.currentTime >= l.time &&
            (nextLyric ? this.currentTime < nextLyric.time : true)
          )
        })
        : -1
    },
    // 将处理获得的歌词和翻译歌词数据 结合到一个数组中
    lyricWithTranslation () {
      let ret = []
      // 空内容的去除
      const lyricFiltered = this.lyric.filter(({ content }) => Boolean(content))
      // content统一转换数组形式
      if (lyricFiltered.length) {
        lyricFiltered.forEach(l => {
          const { time, content } = l
          const lyricItem = { time, content, contents: [content] }
          const sameTimeTLyric = this.tlyric.find(
            ({ time: tLyricTime }) => tLyricTime === time
          )
          if (sameTimeTLyric) {
            const { content: tLyricContent } = sameTimeTLyric
            if (content) {
              lyricItem.contents.push(tLyricContent)
            }
          }
          ret.push(lyricItem)
        })
      } else {
        ret = lyricFiltered.map(({ time, content }) => ({
          time,
          content,
          contents: [content]
        }))
      }
      return ret
    },
    ...mapState(['currentSong', 'currentTime', 'playing', 'isPlayerShow']),
    ...mapGetters(['hasCurrentSong'])
  },
  watch: {
    // 监听控制player显示隐藏状态的变量
    isPlayerShow (show) {
      // 如果是显示状态
      if (show) {
        // 歌词短期内不会变化 所以只拉取相似信息
        this.updateSimi()
        this.addResizeListener()
        this.$nextTick(() => {
          this.scrollToActiveLyric()
        })
      } else {
        // 如果是隐藏状态，则将移除刷新scroller组件函数
        this.removeResizeListener()
      }
    },
    // 监听当前播放歌曲
    currentSong (newSong, oldSong) {
      // 如果播放的不是新的id，则说明还是旧id
      if (!newSong.id) {
        // 将player隐藏
        this.setPlayerShow(false)
        return
      }
      if (newSong.id === oldSong.id) {
        return
      }
      // 如果当前播放歌曲更新了id，则说明是另一首歌曲
      // 如果歌曲详情显示状态切歌 需要拉取歌曲相关信息
      if (this.isPlayerShow) {
        this.updateSong()
      } else {
        // 否则只是更新歌词
        this.updateLyric()
      }
    },
    // 监听当前播放音乐对应的歌词段的索引
    activeLyricIndex (newIndex, oldIndex) {
      // 如果新索引不等于旧索引
      if (
        newIndex !== oldIndex &&
        !this.lyricScrolling[WHEEL_TYPE] &&
        !this.lyricScrolling[SCROLL_TYPE]
      ) {
        // 则将自动滚动到对应歌词
        this.scrollToActiveLyric()
      }
    },
    // 监听route
    $route () {
      // 如果发生了链接跳转，则将player隐藏
      this.setPlayerShow(false)
    }
  },
  components: { Comments }
}
</script>

<style lang="scss" scoped>
// 左侧黑胶唱片机的动画效果
@keyframes rotate {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(1turn);
  }
}

$img-left-padding: 36px;
$img-outer-border-d: 320px;
$img-outer-d: 300px;

.player {
  position: fixed;
  top: $header-height;
  bottom: $mini-player-height;
  left: 0;
  right: 0;
  padding: 0 36px;
  background: var(--player-bgcolor);
  z-index: $song-detail-z-index;
  overflow: hidden;
  overflow-y: auto;
  transition: transform 0.5s;

  &.hide {
    transform: translateY(105%);
  }

  &.show {
    transform: 870px;
    margin: auto;
  }

  .content {
    max-width: 870px;
    margin: auto;

    .song {
      display: flex;

      .left {
        position: relative;
        padding: 80px 70px 0 $img-left-padding;
        display: flex;
        justify-content: center;

        $support-d: 30px;
        $support-d-half: $support-d / 2;

        .play-bar-support {
          position: absolute;
          left: $img-left-padding + $img-outer-border-d / 2 - $support-d / 2;
          top: -$support-d-half;
          width: $support-d;
          height: $support-d;
          z-index: 2;
        }

        .play-bar {
          $w: 100px;
          $h: 146px;
          position: absolute;
          top: 0;
          left: $img-left-padding + $img-outer-border-d / 2 - 6px;
          width: $w;
          height: $h;
          z-index: 1;
          transform-origin: 0 0;
          transform: rotate(-30deg);
          transition: all 0.3s;

          &.playing {
            transform: rotate(5deg);
          }
        }

        .img-outer-border {
          @include round($img-outer-border-d);
          @include flex-center;
          background: var(--song-shallow-grey-bg);

          .img-outer {
            @include round($img-outer-d);
            @include flex-center;
            background: $black;
            background: linear-gradient(-45deg, #333540, #070708, #333540);
            animation: rotate 20s linear infinite;

            &.paused {
              animation-play-state: paused;
            }

            .img-wrap {
              @include img-wrap(200px);

              img {
                border-radius: 50%;
              }
            }
          }
        }
      }

      .right {
        flex: 1;
        padding-top: 45px;

        .name-wrap {
          display: flex;
          align-items: center;
          margin-bottom: 16px;

          .name {
            font-size: $font-size-title-lg;
            color: var(--font-color-white);
          }

          .mv-tag {
            display: inline-block;
            margin-left: 8px;
            padding: 2px;
            border: 1px solid currentColor;
            border-radius: 2px;
            color: $theme-color;
            cursor: pointer;
          }
        }

        .artists {
          margin-bottom: 16px;
        }

        .desc {
          display: flex;
          font-size: $font-size-sm;
          margin-bottom: 30px;

          .desc-item {
            display: flex;
            margin-right: 32px;

            .label {
              display: inline-block;
              margin-right: 4px;
            }

            .value {
              color: $blue;
            }
          }
        }

        .lyric-wrap {
          width: 380px;
          height: 350px;
          // mask-image设置元素上遮罩层的图像。(相当于在图像上盖一个盖子，多用于做渐变效果)
          mask-image: linear-gradient(
            180deg,
            hsla(0, 0%, 100%, 0) 0,
            hsla(0, 0%, 100%, 0.6) 15%,
            #fff 25% #fff 75%,
            hsla(0, 0%, 100%, 0.6) 85%,
            hsla(0, 0%, 100%, 0)
          );

          .lyric-item {
            margin-bottom: 16px;
            font-size: $font-size-sm;

            &.active {
              font-size: $font-size;
              color: var(--font-color-white);
              font-weight: $font-weight-bold;
            }

            .lyric-text {
              margin-bottom: 8px;
            }
          }
        }
      }
    }

    .bottom {
      display: flex;
      margin-top: 48px;
      margin-bottom: 36px;

      .left {
        flex: 1;
      }

      .right {
        padding-left: 36px;
        width: 28%;
        overflow: hidden;

        .simi-playlists {
          margin-bottom: 36px;
        }

        .simi-songs {
          .play-icon {
            @include abs-center;
          }
        }

        .simi-item {
          margin-bottom: 6px;
        }

        .title {
          font-size: $font-size-lg;
          font-weight: $font-weight-bold;
          margin-bottom: 12px;
        }

        .desc {
          display: flex;
          align-items: center;

          .count {
            margin-left: 4px;
          }
        }
      }
    }
  }
}
</style>
