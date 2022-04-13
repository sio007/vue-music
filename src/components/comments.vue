// 该组件适用于歌曲、歌单、mv评论
<template>

  <div class="comment">
    <!-- 加载框 -->
    <template v-if="loading">
      <Loading :loading="loading" />
    </template>
    <!-- 评论 -->
    <template v-else>
      <!-- 热门评论 -->
      <div class="block" v-if="shouldHotCommentShow">
        <p class="title">精彩评论</p>
        <Comment :border="!$utils.isLast(index, hotComments)" :comment="comment" :key="comment.id" v-for="(comment, index) in hotComments" />
      </div>
      <!-- 全部评论 -->
      <div class="block" v-if="shouldCommentShow">
        <p class="title" ref="commentTitle">
          最新评论
          <span class="count">{{total}}</span>
        </p>
        <Comment :border="!$utils.isLast(index,comments)" :comment="comment" :key="comment.id" v-for="(comment,index) in comments" />
      </div>
      <!-- 页数 -->
      <Pagination :current-page.sync="currentPage" :page-size="PAGE_SIZE" :total="total" @current-change="onPageChange" class="pagination" />
    </template>
    <!-- 用于没有评论的时候显示 -->
    <empty v-if="!loading && !shouldHotCommentShow && !shouldCommentShow">
      还没有评论哦
    </empty>
  </div>
</template>

<script type="text/ecmascript-6">
import {
  getSongComment,
  getPlaylistComment,
  getHotComment,
  getMvComment
} from '@/api'
import { getPageOffset, scrollInto } from '@/utils'
import Comment from './comment'



// 用于分辨 获取 歌曲、播放列表、mv 评论 的变量
const SONG_TYPE = 'song'
const PLAYLIST_TYPE = 'playlist'
const MV_TYPE = 'mv'

// 每一页评论的数量
const PAGE_SIZE = 20
export default {
  props: {
    id: {
      type: Number,
      required: true
    },
    type: {
      // SONG_TYPE, PLAYLIST_TYPE, MV_TYPE 之一
      type: String,
      default: SONG_TYPE
    }
  },
  created () {
    this.PAGE_SIZE = PAGE_SIZE
  },
  data () {
    return {
      // 默认加载框为关闭状态
      loading: false,
      // 热门评论变量
      hotComments: [],
      // 评论变量
      comments: [],
      // 评论 条数的总数量
      total: 0,
      // 评论页面选中的页数
      currentPage: 1
    }
  },
  methods: {
    // 获取评论数据
    async getComment () {
      // 开启加载框
      this.loading = true
      // 将 歌单、歌曲、mv 的请求评论接口 集合为为数组，方便请求接口时调用
      const commentRequsetMap = {
        [PLAYLIST_TYPE]: getPlaylistComment,
        [SONG_TYPE]: getSongComment,
        [MV_TYPE]: getMvComment
      }
      // 选中 要获取的类型评论
      const commentRequest = commentRequsetMap[this.type]
      const { hotComments = [], comments = [], total } = await commentRequest({
        id: this.id,
        // id （歌曲或歌单或mv的id）
        pageSize: PAGE_SIZE,
        // pageSize 一页评论的数量
        offset: getPageOffset(this.currentPage, PAGE_SIZE)
        // offset 页数的偏移量
      }).finally(() => {
        // 将关闭加载款
        this.loading = false
      })

      // 歌单的热评需要单独请求接口获取
      if (this.type === PLAYLIST_TYPE && this.currentPage === 1) {
        const { hotComments: exactHotComments = [] } = await getHotComment({
          id: this.id,
          type: 2 // 歌单type
        })
        this.hotComments = exactHotComments
      } else {
        // 如果不是歌单热评就将上面获取评论直接赋值
        this.hotComments = hotComments
      }

      // 将获取的 评论、评论条数 赋值
      this.comments = comments
      this.total = total
      // 执行父组件中的 update 事件并且携带参数
      this.$emit('update', { comments, hotComments, total })
    },
    // 切换分页事件
    async onPageChange () {
      // 重新获取评论数据
      await this.getComment()
      // 点击事件后，适用方法将页面回滚到 评论区
      this.$nextTick(() => {
        scrollInto(this.$refs.commentTitle)
      })
    }
  },
  watch: {
    // 监听 id
    id: {
      // 如果id变量出现变化，将页数重置回第1页，并重新获取评论数据
      handler (newId) {
        if (newId) {
          this.currentPage = 1
          this.getComment()
        }
      },
      immediate: true
    }
  },
  computed: {
    // 判断是否渲染热门评论
    shouldHotCommentShow () {
      // 如果热门评论数据存在，且当前选中页数在第1页，则渲染
      return this.hotComments.length > 0 && this.currentPage === 1
    },
    // 判断是否渲染评论
    shouldCommentShow () {
      // 如果热门评论数据存在，则渲染
      return this.comments.length > 0
    }
  },
  components: { Comment }
}
</script>

<style lang="scss" scoped>
.block {
  margin-bottom: 48px;

  .title {
    font-size: $font-size-lg;
    font-weight: $font-weight-bold;
    margin-bottom: 4px;

    .count {
      font-size: $font-size;
    }
  }
}
.pagination {
  text-align: right;
}
</style>
