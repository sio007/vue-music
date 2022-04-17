// 该组件是滚动组件，用于页面中滚动歌词，借助于第三方模块better-scroll
<template>
  <div class="scroller" ref="scroller">
    <slot></slot>
  </div>
</template>

<script type="text/ecmascript-6">
// 引入第三方模块better-scroll
import BScroll from '@better-scroll/core'
import ScrollBar from '@better-scroll/scroll-bar'
import MouseWheel from '@better-scroll/mouse-wheel'
// 在组件中使用滚动条和鼠标拖动
BScroll.use(ScrollBar)
BScroll.use(MouseWheel)

// 滚动组件的配置
const defaultOptions = {
  // 鼠标拖动
  mouseWheel: true,
  // 滚动轴
  scrollY: true,
  // 滚动条
  scrollbar: true,
  probeType: 3
}
export default {
  // 组件名称
  name: 'Scroller',
  // 组件属性
  props: {
    data: {
      default: () => []
    },
    options: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {}
  },
  methods: {
    // 获取scroller对象
    getScroller () {
      return this.scroller
    },
    // 获取scroller对象的刷新方法
    reflect () {
      this.scroller.refresh()
    }
  },
  watch: {
    data: {
      // 如果data数据出现更新就立马执行以下函数
      handler () {
        this.$nextTick(() => {
          // 如果之前不存在scroller组件对象，则创建一个新的scroller组件实例对象
          if (!this.scroller) {
            this.scroller = new BScroll(
              this.$refs.scroller,
              Object.assign({}, defaultOptions, this.options)
            )
            this.$emit('init', this.scroller)
          } else {
            // 如果存在scroller组件对象，将这个scroller组件对象刷新
            this.scroller && this.scroller.refresh()
          }
        })
      },
      immediate: true
    }
  }
}
</script>

<style lang="scss">
.scroller {
  position: relative;
  overflow: hidden;
  height: 100%;

  .bscroll-indicator {
    border: none !important;
    background: var(--scrollbar-color) !important;
  }
}
</style>
