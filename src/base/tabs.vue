<template>
  <ul :class="{[align]: true}" class="tab-wrap">
    <!-- tabs栏组件：有两种渲染方式 -->
    <!-- 1.tab栏选项点击后需要跳转链接（可称为路由模式） -->
    <!-- 2.tab栏选项点击后不需要跳转链接 -->

    <!-- 使用 isRouteMode判断tab选项是否需要跳转链接 -->
    <template v-if="isRouteMode">
      <router-link :active-class="`${ROUTE_ACTIVE_CLS} ${activeItemClass}`" :key="index" :style="getItemStyle(tab, index)" :to="tab.to" class="tab-item" ref="routerLinks" tag="li" v-for="(tab,index) in normalizedTabs">
        <span class="title">{{title}}</span>
      </router-link>
    </template>
    <template v-else>
      <li :class="getItemCls(tab,index)" :key="index" :style="getItemStyle(tab,index)" @click="onChangeTab(tab,index)" class="tab-item" v-for="(tab,index) in normalizedTabs">
        <span class="title">{{tab.title}}</span>
      </li>
    </template>

  </ul>
</template>

<script type="text/ecmascript-6">
import { isDef } from '@/utils'

// tab栏中被选中的选项
const ACTIVE_PROP = 'active'
// tab切换的函数 的 事件名
const ACTIVE_CHANGE = 'tabChange'
const ROUTE_ACTIVE_CLS = 'active'


export default {
  name: 'Tabs',
  props: {
    [ACTIVE_PROP]: {
      type: Number,
      default: 0
    },
    tabs: {
      type: Array,
      default: () => []
    },
    align: {
      type: String,
      default: 'left'
    },
    itemStyle: {
      type: Object,
      default: () => ({})
    },
    activeItemStyle: {
      type: Object,
      default: () => ({})
    },
    itemClass: {
      type: String
    },
    activeItemClass: {
      type: String
    },
    // 不传的话对应大号字体 高亮加粗
    // small对应小号字体 高亮红色
    // split对应小号字体 分割线分隔 高亮背景色变灰文字变红
    type: {
      type: String
    }
  },
  // model属性的用法：
  // 允许一个自定义组件在使用 v-model 时定制 prop 和 event。默认情况下，一个组件上的 v-model 会把 value 用作 prop 且把 input 用作 event，但是一些情况可能想使用 value prop 来达到不同的目的。使用 model 选项可以回避这些情况产生的冲突，自定义prop 和 even 的作用
  // 可参考:https://www.jianshu.com/p/f974f0685d93
  model: {
    // 将组件 绑定 被选中的选项 和tab切换事件
    prop: ACTIVE_PROP,
    event: ACTIVE_CHANGE
  },
  created () {
    this.ROUTE_ACTIVE_CLS = ROUTE_ACTIVE_CLS
  },
  methods: {
    // tab栏中选项切换时
    onChangeTab (tab, index) {
      // 如果tab栏选项带有跳转链接（路由模式），则跳转
      if (this.isRouteMode) {
        this.$router.push(tab.to)
      } else {
        // 如果tab栏选项不带有跳转链接，则触发tab切换事件(使用$emit是因为，该事件是存在于父组件中的)
        this.$emit(ACTIVE_CHANGE, index)
      }
    },
    // 被选中的选项
    isActive (tab, index) {
      // 如果tab栏选项带有跳转链接（路由模式），则为它设置跳转的方法
      if (this.isRouteMode) {
        const {
          resolved: { path: resolvedPath }
        } = this.$router.resolve(tab.to)
        return resolvedPath === this.$route.path
      } else {
        // 如果tab栏选项不带有跳转链接，则给它赋值被选中的索引变量
        return index === this[ACTIVE_PROP]
      }
    },
    // tab栏 class类 的添加
    getItemCls (tab, index) {
      const base = []
      if (this.itemClass) {
        base.push(this.itemClass)
      }
      if (this.type) {
        base.push(this.type)
      }
      // 给被选中的选项添加类名
      if (this.isActive(tab, index)) {
        if (this.activeItemClass) {
          base.push(this.activeItemClass)
        }
        base.push('active')
      }
      return base.join(' ')
    },
    getItemStyle (tab, index) {
      return Object.assign(
        {},
        this.itemStyle,
        this.isActive(tab, index)
          ? Object.assign({}, this.activeItemStyle)
          : null
      )
    }

  },
  computed: {
    // 判断tab选项是否需要跳转链接
    isRouteMode () {
      return this.tabs.length && isDef(this.tabs[0].to)
    },
    // 将tab栏绑定的数据，通过判断tabs[0]数据是否为字符串？ 是则 映射到一个新的带有title属性的数组中，不是则 返回原来的数组
    normalizedTabs () {
      return typeof this.tabs[0] === 'string'
        ? this.tabs.map(tab => ({ title: tab }))
        : this.tabs
    }
  }

}
</script>

<style lang="scss" scoped>
.tab-wrap {
  display: flex;

  &.center {
    justify-content: center;
  }

  &.right {
    justify-content: flex-end;
  }

  .tab-item {
    padding: 12px 0;
    margin: 0 12px;
    color: var(--tab-item-color);
    font-size: $font-size-medium;
    white-space: nowrap;
    cursor: pointer;

    &.active {
      color: var(--tab-item-active-color);

      &:hover {
        color: var(--tab-item-active-color);
      }
    }

    // 对应prop中的type字段
    &.small {
      font-size: $font-size-sm;

      &.active {
        color: $theme-color;
      }
    }

    &.theme {
      font-size: $font-size;

      &.active {
        color: $theme-color;
        border-bottom: 2px solid $theme-color;
        font-weight: $font-weight-bold;
      }
    }

    &.split {
      font-size: $font-size-sm;
      padding: 4px 12px;
      margin: 0 16px;
      border-radius: 999em;

      &.active {
        color: $theme-color;
        background: var(--shallow-theme-bgcolor);
      }

      &:not(:last-child) {
        &::after {
          position: relative;
          left: 28px;
          width: 1px;
          height: 100%;
          background: var(--border);
          display: inline-block;
          vertical-align: middle;
          content: " ";
        }

        .title {
          vertical-align: middle;
        }
      }
    }

    &:hover {
      color: var(--tab-item-hover-color);
    }
  }
}
</style>
