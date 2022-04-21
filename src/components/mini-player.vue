// 底部播放栏组件
<template>
  <div class="mini-player" id="mini-player" v-show="isMiniPlayerShow">
    <!-- 歌曲内容 -->
    <div class="song">
      <template v-if="hasCurrentSong">
        <div @click="togglePlayerShow" class="img-wrap">
          <div class="mask"></div>
          <img v-lazy="$utils.genImgUrl(currentSong.img, 80)" class="blur" />
          <div class="player-control">
            <Icon :size="24" :type="playControlIcon" color="white" />
          </div>
        </div>
        <div class="content">
          <div class="top">
            <p class="name">{{ currentSong.name }}</p>
            <p class="split">-</p>
            <p class="artists">{{ currentSong.artistsText }}</p>
          </div>
          <div class="time">
            <span class="played-time">{{
              $utils.formatTime(currentTime)
            }}</span>
            <span class="split">/</span>
            <span class="total-time">{{
              $utils.formatTime(currentSong.duration / 1000)
            }}</span>
          </div>
        </div>
      </template>
    </div>
    <!-- 控制台 -->
    <div class="control">
      <!-- 上一首 -->
      <Icon :size="24" @click="prev" class="icon" type="prev" />
      <!-- 播放暂停 -->
      <el-popover :value="isPlayErrorPromptShow" placement="top" trigger="manual" width="160">
        <p>请点击开始播放。</p>
        <div @click="togglePlaying" class="play-icon" slot="reference">
          <Icon :size="24" :type="playIcon" />
        </div>
      </el-popover>
      <!-- 下一首 -->
      <Icon :size="24" @click="next" class="icon" type="next" />
    </div>
    <!-- 播放模式 -->
    <div class="mode">
      <Share :shareUrl="shareUrl" class="mode-item" v-show="hasCurrentSong" />
      <!-- 模式切换 -->
      <el-popover placement="top" trigger="hover" width="160">
        <p>{{ playModeText }}</p>
        <Icon :size="20" :type="modeIcon" @click="onChangePlayMode" class="mode-item" slot="reference" />
      </el-popover>
      <!-- 播放列表 -->
      <el-popover :value="isPlaylistPromptShow" placement="top" trigger="manual" width="160">
        <p>已更新歌单</p>
        <Icon :size="20" @click="togglePlaylistShow" class="mode-item" slot="reference" type="playlist" />
      </el-popover>
      <!-- 音量 -->
      <div class="volume-item">
        <Volume :volume="volume" @volumeChange="onVolumeChange" />
      </div>
      <!-- github -->
      <Icon :size="20" @click="goGitHub" class="mode-item" type="github" />
    </div>
    <!-- 播放进度条 -->
    <div class="progress-bar-wrap">
      <ProgressBar :disabled="!hasCurrentSong" :percent="playedPercent" @percentChange="onProgressChange" />
    </div>
    <!-- 音频 -->
    <audio :src="currentSong.url" @canplay="ready" @ended="end" @timeupdate="updateTime" ref="audio"></audio>
  </div>
</template>

<script type="text/ecmascript-6">
import { mapState, mapMutations, mapGetters, mapActions } from '@/store/helper/music'

import Storage from 'good-storage'
import Share from '@/components/share'
import { VOLUME_KEY, playModeMap, isDef } from '@/utils'
import { confirm } from '@/base/confirm'


// 默认音量大小
const DEFAULT_VOLUME = 0.75

export default {
  data () {
    return {
      // 播放错误的提示框显示状态
      isPlayErrorPromptShow: false,
      // 控制audio标签中canplay 事件 的变量（canplay 事件 提示该音频已准备好开始播放）
      songReady: false,
      // 从storage中获取音量大小
      volume: Storage.get(VOLUME_KEY, DEFAULT_VOLUME)
    }
  },
  mounted () {
    // 将音量大小变量赋值到音频音量
    this.audio.volume = this.volume
  },

  methods: {
    // 切换当前播放歌曲状态（暂停或播放）
    togglePlaying () {
      // 如果当前没有播放歌曲则直接跳出
      if (!this.currentSong.id) {
        return
      }
      // 如果有播放歌曲则切换播放状态
      this.setPlayingState(!this.playing)
    },
    // audio标签已经准备好开始播放
    ready () {
      this.songReady = true
    },
    // 播放功能
    async play () {
      // 如果audio标签准备好播放
      if (this.songReady) {
        try {
          // 则调用音频标签的play() 播放方法
          await this.audio.play()
          // 如果播放错误的提示框还显示，则将它关闭
          if (this.isPlayErrorPromptShow) {
            this.isPlayErrorPromptShow = false
          }
        } catch (error) {
          // 提示用户手动播放
          this.isPlayErrorPromptShow = true
          // 并将当前播放歌曲的播放状态改为暂停
          this.setPlayingState(false)
        }
      }
    },
    // 暂停功能
    pause () {
      // 使用audio标签中的pause() 暂停方法
      this.audio.pause()
    },
    // 更新播放歌曲定位的时长
    updateTime (e) {
      // 获取当前播放定位时长
      const time = e.target.currentTime
      // 将获取的定位时长设置为播放歌曲的定位时长
      this.setCurrentTime(time)
    },
    // 上一首
    prev () {
      // 如果audio标签准备好播放
      if (this.songReady) {
        // 整合歌曲信息，并开始播放上一首
        this.startSong(this.prevSong)
      }
    },
    // 下一首
    next () {
      // 如果audio标签准备好播放
      if (this.songReady) {
        // 整合歌曲信息，并开始播放下一首
        this.startSong(this.nextSong)
      }
    },
    // 歌曲播放结束
    end () {
      // 播放下一首
      this.next()
    },
    // 进度条的变化
    onProgressChange (percent) {
      // 将当前进度条的定位设置为音频时长定位
      this.audio.currentTime = this.currentSong.durationSecond * percent
      // 设置当前播放歌曲的为播放状态
      this.setPlayingState(true)
    },
    // 音量的变化
    onVolumeChange (percent) {
      // 设置当前音频的音量
      this.audio.volume = percent
      // 将音量的数组存储到storage的VOLUME_KEY中
      Storage.set(VOLUME_KEY, percent)
    },
    // 改变播放模式
    onChangePlayMode () {
      // 获取播放模式的数据（为对象）
      const modeKeys = Object.keys(playModeMap)
      // 找到当前播放模式在对象中索引
      const currentModeIndex = modeKeys.findIndex(
        key => playModeMap[key].code === this.playMode
      )
      // 找到当前播放模式中下一个模式的索引
      const nextIndex = (currentModeIndex + 1) % modeKeys.length
      // 根据索引找到在对象中对应的数据
      const nextModeKey = modeKeys[nextIndex]
      // 获取下一个模式的数据
      const nextMode = playModeMap[nextModeKey]
      // 将下一个模式设置为播放模式
      this.setPlayMode(nextMode.code)
    },
    // 切换播放列表的显示状态
    togglePlaylistShow () {
      this.setPlaylistShow(!this.isPlaylistShow)
    },
    // 切换歌曲详情页显示状态
    togglePlayerShow () {
      this.setPlayerShow(!this.isPlayerShow)
    },
    // 跳转到github
    goGitHub () {
      window.open('https://github.com/sio007/vue-music')
    },

    ...mapMutations([
      'setCurrentTime',
      'setPlayingState',
      'setPlayMode',
      'setPlaylistShow',
      'setPlayerShow'
    ]),
    ...mapActions(['startSong'])
  },
  watch: {
    // 监听当前播放歌曲
    currentSong (newSong, oldSong) {
      // 如果当前播放歌曲为会员曲目，将跳过播放下一首
      if (newSong.fee == 1) {
        confirm('该歌曲为会员歌曲，请播放其他歌曲')
        this.pause()
        this.next()
      }
      // 清空了歌曲（如果不存在没有新的id）
      if (!newSong.id) {
        // 将音频暂停
        this.audio.pause()
        // 将音频的时长定位为0
        this.audio.currentTime = 0
        return
      }
      // 单曲循环（如果新id和旧id相同）
      if (oldSong && newSong.id === oldSong.id) {
        // 将播放歌曲的定位时长设置为0
        this.setCurrentTime(0)
        // 将音频的时长定位为0
        this.audio.currentTime = 0
        // 将音频播放
        this.play()
        return
      }
      // 将audio标签设置为 未准备好播放
      this.songReady = false
      // 如果存在定时器，将该定时器清除
      if (this.timer) {
        clearTimeout(this.timer)
      }
      // 设置一个定时器，1秒后调用播放功能
      this.timer = setTimeout(() => {
        this.play()
      }, 1000)
    },
    // 监听播放状态
    playing (newPlaying) {
      // 根据播放状态调用对应的功能
      this.$nextTick(() => {
        newPlaying ? this.play() : this.pause()
      })
    }
  },
  computed: {
    // 当前拥有播放歌曲
    hasCurrentSong () {
      return isDef(this.currentSong.id)
    },
    // 播放暂停按钮的样式的切换
    playIcon () {
      return this.playing ? 'pause' : 'play'
    },
    // 当前播放模式
    currentMode () {
      return playModeMap[this.playMode]
    },
    // 播放模式按钮的样式的切换
    modeIcon () {
      return this.currentMode.icon
    },
    // 播放模式名字（循环，随机，顺序）
    playModeText () {
      return this.currentMode.name
    },
    // 获取页面中的audio实例对象
    audio () {
      return this.$refs.audio
    },
    // 播放进度百分比
    playedPercent () {
      const { durationSecond } = this.currentSong
      return Math.min(this.currentTime / durationSecond, 1) || 0
    },
    // 歌曲封面中按钮的样式的切换（放大，缩小）
    playControlIcon () {
      return this.isPlayerShow ? 'shrink' : 'open'
    },
    // 分享当前播放音乐的链接
    shareUrl () {
      return `${window.location.origin}?shareMusicId=${this.currentSong.id}`
    },
    ...mapState([
      'currentSong', 'currentTime', 'playing', 'playMode', 'isPlaylistShow', 'isPlaylistPromptShow', 'isPlayerShow', 'isMiniPlayerShow'
    ]),
    ...mapGetters([
      'prevSong', 'nextSong'
    ])
  },
  components: { Share }

}
</script>

<style lang="scss" scoped>
.mini-player {
  position: relative;
  position: fixed;
  z-index: $mini-player-z-index;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  height: $mini-player-height;
  padding: 8px 16px;
  padding-right: 24px;
  background: var(--body-bgcolor);

  .song {
    display: flex;
    flex: 4;
    overflow: hidden;

    .img-wrap {
      position: relative;
      margin-right: 8px;
      border-radius: 6px;
      overflow: hidden;
      cursor: pointer;
      @include img-wrap(40px);

      img {
        &.blur {
          filter: blur(2px);
        }
      }

      .player-control {
        @include abs-center;
      }

      .mask {
        @include abs-stretch;
        background: rgba(0, 0, 0, 0.2);
      }
    }

    .content {
      flex: 1;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      justify-content: space-around;

      .top {
        display: flex;
        align-items: flex-end;
        white-space: nowrap;

        .name {
          color: var(--font-color-white);
          @include text-ellipsis;
        }

        .split {
          font-size: $font-size-xs;
          margin: 0 4px;
        }

        .artists {
          font-size: $font-size-xs;
          @include text-ellipsis;
        }
      }

      .time {
        font-size: $font-size-xs;
        color: var(--font-color-grey);

        .split {
          margin: 0 4px;
        }
      }
    }
  }

  .control {
    position: absolute;
    height: 100%;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 20px;
    @include flex-center();

    .play-icon {
      @include flex-center();
      position: relative;
      width: 45px;
      height: 45px;
      margin: 0 16px;
      cursor: pointer;

      i {
        color: $theme-color;
      }
      .icon-play {
        transform: translateX(1px);
      }
    }

    .icon {
      color: $theme-color;
    }
  }

  .mode {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    flex: 6;

    .mode-item {
      display: block;
      margin-right: 16px;
      width: 22px;
    }

    .volume-item {
      margin-right: 22px;
    }
  }

  .progress-bar-wrap {
    position: absolute;
    left: 0;
    right: 0;
    top: -14px;
  }
}

.icon {
  color: var(--font-color);
  cursor: pointer;
}
</style>
