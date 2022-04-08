import Vue from 'vue'
import { Input, Button, Popover, Carousel, CarouselItem, Loading, Dialog } from 'element-ui'

import VueLazyload from 'vue-lazyload'
import * as utils from './index'
import { EMPTY_IMG } from './dom'


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

    // 将utils文件中所有的导出(export)的函数都挂载到$utils中 方便使用
    Vue.prototype.$utils = utils

    Vue.use(Input)
    Vue.use(Button)
    Vue.use(Popover)
    Vue.use(Carousel)
    Vue.use(CarouselItem)
    Vue.use(Loading)
    Vue.use(Dialog)


    Vue.use(VueLazyload, {
      Loading: EMPTY_IMG,
      error: EMPTY_IMG
    })
  }
}
