
<script type="text/ecmascript-6">
import { toRem } from '@/utils'
export default {
  // 组件名
  name: 'Icon',
  // 组件拥有的属性
  props: {
    size: {
      type: Number,
      default: 16
    },
    type: {
      type: String,
      required: true
    },
    color: {
      type: String,
      default: ''
    },
    backdrop: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    // 根据属性进行css渲染
    getIconCls () {
      let cls = `icon-${this.type}`
      if (this.color) {
        cls += ` icon-color-${this.color}`
      }
      return cls
    },
    // 点击传递参数事件
    onClick (e) {
      this.$emit('click', e)
    },
    // 根据属性进行css样式大小设置渲染
    getIconStyle () {
      const chromeMinSize = 12
      // 支持小于12px
      const retStyle = { fontSize: toRem(this.size) }
      if (this.size < chromeMinSize) {
        const ratio = this.size / chromeMinSize
        retStyle.transform = `scale(${ratio})`
      }
      return retStyle
    },
    // 渲染组件函数
    getIcon () {
      const Icon = (
        <i
          onClick={this.onClick}
          class={`iconfont icon-component ${this.getIconCls()}`}
          style={this.getIconStyle()}
        />
      )
      if (this.backdrop) {
        const backDropSizeRatio = 1.56
        const backDropSize = toRem(backDropSizeRatio * this.size)
        return (
          <span
            style={{ width: backDropSize, height: backDropSize }}
            class="backdrop"
          >
            {Icon}
          </span>
        )
      }
      return Icon
    }
  },
  // 渲染组件 生命函数
  render () {
    // 调用渲染组件函数
    return this.getIcon()
  }
}
</script>

<style lang="scss" scoped>
.backdrop {
  display: inline-block;
  @include flex-center;
  border-radius: 50%;

  &:hover {
    background: var(--round-hover-bgcolor);
  }
}

.icon-component {
  cursor: pointer;
}

.icon-color {
  // 通过prop传入这几个字段
  // 可以使用默认的几个颜色
  &-theme {
    color: $theme-color;
  }
  &-white {
    color: $white;
  }
  &-shallow {
    color: var(--font-color-shallow-grey);
  }
}
</style>
