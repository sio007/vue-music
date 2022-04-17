<template>
  <!-- 分享 -->
  <Icon :data-clipboard-text="shareUrl" :size="20" @click="onSharePromptClick" class="mode-item" ref="shareIcon" slot="reference" type="share" />
</template>

<script type="text/ecmascript-6">
// 引入第三方模块 Clipboard粘贴板
import Clipboard from 'clipboard'
import { confirm } from '@/base/confirm'

export default {
  props: ['shareUrl'],
  mounted () {
    // 生成Clipboard实例对象
    this.initShareIcon()
  },
  methods: {
    // 生成Clipboard实例对象 粘贴板
    initShareIcon () {
      const clipboard = new Clipboard(this.$refs.shareIcon.$el)
      return clipboard
    },
    // 点击了分享按钮
    onSharePromptClick () {
      // 弹出消息窗
      confirm('分享链接已经复制到剪贴板，快去和小伙伴一起听歌吧！')
    }
  }
}
</script>
