<template>
  <div class="with-pagination">
    <slot></slot>
    <div class="pagination-wrap">
      <Pagination :current-page.sync="currentPage" :page-size="limit" :total="total" @current-change="onPageChange" class="pagination" />
    </div>
  </div>
</template>

<script type="txt/ecmascript-6">
// getPageOffset用于切换分页时的偏移量
// scrollInto是将页面动画滑动到顶端
import { getPageOffset, scrollInto } from '@/utils'

export default {
  // 组件属性
  props: {
    getData: {
      type: Function,
      required: true
    },
    getDataParams: {
      type: Object,
      default: () => ({})
    },
    limit: {
      type: Number,
      default: 10
    },
    scrollTarget: {
      type: HTMLElement
    },
    total: {
      type: Number,
      default: 0
    }
  },
  created () {
    // 切换分页事件
    this.onPageChange()
  },
  data () {
    return {
      // 当前选中的分页
      currentPage: 1
    }
  },
  methods: {
    // 切换分页事件
    async onPageChange () {
      try {
        // getData是组件属性，由使用组件时传递过来的获取所有mv数据的函数
        const result = await this.getData({
          // limit数量限制
          limit: this.limit,
          // 切换分页时的偏移量
          offset: getPageOffset(this.currentPage, this.limit),
          // 三个tab栏选中项对应的索引index
          ...this.getDataParams
        })
        // 向父组件传值,在父组件中的 getDataSuccess属性 对应的函数 中 使用result
        this.$emit('getDataSuccess', result)
        // 如果传入了滚动的目标对象 切换分页后自动滚入到对象
        if (this.scrollTarget) {
          scrollInto(this.scrollTarget)
        }
      } catch (error) {
        // 如果 try中 函数出错，catch中 向父组件传值,在父组件中的 getDataError属性 对应的函数 中 error
        this.$emit('getDataError', error)
      }
    }
  },
  watch: {
    // 监听获取三个tab栏所选项对应的索引
    getDataParams: {
      // deep：需要监听的数据的深度，一般用来监听对象中某个属性的变化，数组字符串一般不需要
      deep: true,
      // handle：watch中需要具体执行的方法
      handler () {
        // 一旦tab栏索引数值出现变化，则将选中的分页跳回第一页
        // 并且将重新获取获取数据，相当于切换分页事件
        this.currentPage = 1
        this.onPageChange()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.pagination-wrap {
  margin-top: 16px;
}
</style>
