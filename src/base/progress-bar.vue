// 进度条组件
<template>
  <div @click="progressClick" class="progress-bar" ref="progressBar">
    <div class="bar-inner">
      <div class="progress" ref="progress">
        <!-- 进度条中的圆圈拖动按钮 -->
        <div class="progress-btn-wrapper" ref="progressBtn">
          <div :class="{show:alwaysShowBtn}" class="progress-btn"></div>
        </div>
      </div>
    </div>
  </div>
</template>


<script type="text/ecmascript-6">
import { prefixStyle, toCurrentRem } from '@/utils'

// 获取动画变量
const transform = prefixStyle('transform')
export default {
  // 组件名称
  name: 'ProgressBar',
  // 组件属性
  props: {
    // 进度条百分比
    percent: {
      type: Number,
      default: 0
    },
    // 控制圆圈按钮的显示
    alwaysShowBtn: {
      type: Boolean,
      default: false
    },
    // 是否禁用
    disabled: {
      type: Boolean,
      default: false
    }
  },
  created () {
    // 创建一个touch空对象
    this.touch = {}
  },
  mounted () {
    // 如果进度条百分比大于0
    if (this.percent > 0) {
      // 将该百分比数值作为参数，调用 进度条偏移量改变函数
      this.setProgressOffset(this.percent)
    }
  },
  methods: {
    // 进度条点击事件
    progressClick (e) {
      // 如果没有禁用
      if (!this.disabled) {
        const rect = this.$refs.progressBar.getBoundingClientRect()
        const offsetWidth = Math.max(
          0,
          Math.min(e.pageX - rect.left, this.$refs.progressBar.clientWidth)
        )
        this._offset(offsetWidth)
        // 这里当我们点击 progressBtn 的时候，e.offsetX获取不对
        this._offset(e.offsex)
        this._triggerPercent()
      }
    },
    // 进度条偏移量改变函数
    setProgressOffset (percent) {
      if (percent >= 0 && !this.touch.initiated) {
        const barWidth = this.$refs.progressBar.clientWidth
        const offsetWidth = percent * barWidth
        this._offset(offsetWidth)
      }
    },
    // 当前百分比
    _triggerPercent () {
      // 得到当前百分比，并将它做为参数传递到 父组件中percentChange属性对应的事件中
      this.$emit('percentChange', this._getPercent())
    },
    // 偏移量函数
    _offset (offsetWidth) {
      const offsetRem = toCurrentRem(offsetWidth)
      this.$refs.progress.style.width = `${offsetRem}`
      this.$refs.progressBtn.style[transform] = `translate3d(${offsetRem},0,0)`
    },
    // 获取百分比
    _getPercent () {
      const barWidth = this.$refs.progressBar.clientWidth
      return this.$refs.progress.clientWidth / barWidth
    }
  },
  watch: {
    // 监听百分比
    percent (newPercent) {
      this.setProgressOffset(newPercent)
    }
  }
}
</script>

<style lang="scss" scoped>
.progress-bar {
  height: 30px;
  cursor: pointer;

  .bar-inner {
    position: relative;
    top: 14px;
    height: 2px;
    background: var(--progress-bgcolor);

    .progress {
      position: absolute;
      height: 100%;
      background: $theme-color;
    }

    .progress-btn-wrapper {
      position: absolute;
      left: -15px;
      top: -13px;
      width: 30px;
      height: 30px;

      .progress-btn {
        display: none;
        position: relative;
        top: 8px;
        left: 9px;
        box-sizing: border-box;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: $theme-color;

        &:show {
          display: block;
        }
      }
    }
  }
  &:hover {
    .progress-btn {
      display: block !important;
    }
  }
}
</style>
