import Vue from 'vue'
import { Input, Button, Popover } from 'element-ui'

export default {
  install (Vue) {
    const requireComponent = require.context(
      '@/base',
      true,
      /[a-z0-9]+\.(jsx?|vue)$/i
    )
    // 批量注册base组件
    requireComponent.keys().forEach(fileName => {
      const componentConfig = requireComponent(fileName)
      const componentName = componentConfig.default.name
      if (componentName) {
        Vue.component(componentName, componentConfig.default || componentConfig)
      }
    })

    Vue.use(Input)
    Vue.use(Button)
    Vue.use(Popover)
  }
}
