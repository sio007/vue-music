// 该组件是视频组件，借用了第三方模块 xgplayer
<template>
  <div class="video-player" ref="player"></div>
</template>

<script>
// 导入第三方模块 xgplayer
import Player from 'xgplayer'
import { toRem } from '@/utils'

export default {
  name: 'VideoPlayer',
  // 组件属性
  props: ['url', 'poster'],
  mounted () {
    this.initPlayer()
    this.transferRem()
  },
  methods: {
    // 设置 xgplayer模块
    initPlayer () {
      if (!this.url) return
      this.player = new Player({
        el: this.$refs.player,
        url: this.url,
        poster: this.poster,
        videoInit: true,
        lang: 'zh-cn',
        width: '100%',
        playbackRate: [0.5, 0.75, 1, 1.5, 2],
        defaultPlaybackRate: 1
      })
    },
    // 根据rem设置 xgplayer模块的高度
    transferRem () {
      this.player.on('ready', () => {
        const videoWrapper = this.$refs.player
        const height = videoWrapper.style.height
        const remHeight = toRem(Number(height.replace('px', '')))
        videoWrapper.style.height = remHeight
      })
    }
  },
  watch: {
    // 监听url
    // 组件有url属性，将url地址赋值到xgplayer实例对象中的src属性，视频即有了播放源
    url (url, oldUrl) {
      // 如果存在url属性，且该url不是旧的url
      if (url && url !== oldUrl) {
        // 如果不存在 xgplayer实例对象
        if (!this.player) {
          // 则加载一个xgplayer实例对象
          this.initPlayer()
        } else {
          // 如果存在xgplayer实例对象，则将url赋值到到实例对象的src属性中，并重新加载视频
          this.player.src = url
          // reload()重新加载视频
          this.player.reload()
        }
      }
    }
  }
}
</script>

<style>
.xgplayer-error {
  display: none;
}
</style>
