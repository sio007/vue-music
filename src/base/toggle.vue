<template>
  <div>
    <slot></slot>
  </div>
</template>

<script type="text/ecmascript-6">
import { hasParent } from '@/utils'

export default {
  name: 'Toggle',
  // 组件属性
  props: {
    // 控制组件显示的变量
    show: {
      type: Boolean,
      default: false
    },
    // 组件对象
    reserveDoms: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    // 点击事件
    clickEvent (e) {
      // 获取点击对象
      const triggerElement = e.target
      // 触发点击事件的dom是否是playlist的子节点
      // 获取该组件下以playlist为类名子组件
      const firstChildElm = this.$slots.default[0].elm
      const defaultReserveDoms = Array.from(
        document.querySelectorAll('.el-loading-mask, .el-loading-spinner')
      )
      // 将两个组件合并
      const reserves = defaultReserveDoms.concat(firstChildElm)
      // 判断触发点击事件的dom是否是playlist的子节点
      if (!hasParent(
        triggerElement,
        reserves.concat(this.reserveDoms)
      )) {
        // 如果是则将调用父组件中update:show属性对应的事件，并且传参
        this.$emit('update:show', false)
      }
    },
    // 为组件绑定点击事件
    bindClick () {
      document.addEventListener('mousedown', this.clickEvent)
    },
    // 为组件移除点击事件
    removeClick () {
      document.removeEventListener('mousedown', this.clickEvent)
    }
  },
  watch: {
    // 监听show
    show (newShow) {
      setTimeout(() => {
        // 如果show改变，则为组件绑定点击事件
        if (newShow) {
          this.bindClick()
        } else {
          // 如果show没有改变，则为组件移除点击事件
          this.removeClick()
        }
      }, 0)
    }
  },
  // 组件销毁则将移除点击事件
  beforeDestroy () {
    this.removeClick()
  }
}
</script>

<style scoped>
</style>
