// mv详情页面
<template>
  <div class="mv" v-if="$utils.isDef(mvDetail.id)">
    <div class="mv-content">
      <div class="left">

        <p class="title">mv详情</p>

        <div class="player">
          <VideoPlayer :url="mvPlayInfo.url" :poster="mvDetail.cover" ref="video" />
        </div>

        <div class="author-wrap">
          <div class="avatar">
            <img v-lazy="$utils.genImgUrl(artist.picUrl,120)">
          </div>
          <p class="author">{{artist.name}}</p>
        </div>

        <p class="name">{{mvDetail.name}}</p>

        <div class="desc">
          <span class="data">
            发布：{{$utils.formatDate(mvDetail.publishTime,"yyyy-MM-dd")}}
          </span>
          <span class="count">
            播放：{{mvDetail.playCount}} 次
          </span>
        </div>

        <div class="comments">
          <Comments :id="id" type="mv" />
        </div>

      </div>
      <div class="right">
        <p class="title">相关推荐</p>
        <div class="simi-mvs">
          <Card :desc="`by ${simiMv.artistName}`" :key="simiMv.id" :name="simiMv.name" @click="$utils.goMv(simiMv.id)" class="simi-mv-card" v-for="simiMv in simiMvs">
            <template #img-wrap>
              <MvCard :duration="simiMv.duration" :img="simiMv.cover" :playCount="simiMv.playCount" />
            </template>
          </Card>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { getMvDetail, getMvUrl, getArtists, getSimiMv } from '@/api'
import Comments from '@/components/comments'
import MvCard from '@/components/mv-card'
// import { hideMenuMixin } from '@/utils'

export default {
  // 组件属性，获取链接地址中携带的id参数
  props: {
    id: {
      type: Number,
      required: true
    }
  },
  // 将mv详细信息中的mv名称渲染到页面title标题
  metaInfo () {
    return {
      title: this.mvDetail.name
    }
  },
  created () {
    // 加载数据
    this.init()
  },
  data () {
    return {
      // mv详细信息
      mvDetail: {},
      // mv视频地址详细信息
      mvPlayInfo: {},
      // mv对应的歌手信息
      artist: {},
      // 相似mv信息
      simiMvs: {}
    }
  },
  methods: {
    // 加载数据
    async init () {
      // 使用promise对象中all方法，依次发起三次不同接口的请求
      const [
        { data: mvDetail },
        { data: mvPlayInfo },
        { mvs: simiMvs }
      ] = await Promise.all([
        getMvDetail(this.id),
        getMvUrl(this.id),
        getSimiMv(this.id)
      ])
      // 使用 mv详细信息中的歌手id 做为参数，向 mv对应歌手的信息 接口发起请求，获取歌手信息
      const { artist } = await getArtists(mvDetail.artistId)

      // 将获取数据赋值
      this.mvDetail = mvDetail
      this.mvPlayInfo = mvPlayInfo
      this.artist = artist
      this.simiMvs = simiMvs

      // this.$nextTick作用：当数据更新了，在dom中渲染后，自动执行该函数
      // 获取数据后，将播放器中的音乐 暂停播放
      this.$nextTick(() => {
        const player = this.$refs.video.player
        player.on('play', () => {
          // 停止播放歌曲
        })
      })
    },
    // 点击相似mv时，携带id参数跳转链接
    goMV (id) {
      this.$router.push(`/mv/${id}`)
    }
  },
  watch: {
    // 监听id变化，调用init函数
    id: 'init'
  },
  components: { Comments, MvCard }
}

// 该函数暂时使用不到
// 视频数据设置
export function genResource (brs, mvPlayInfo) {
  // 定义视频数据变量
  const { url: mvPlayInfoUrl, r: mvPlayInfoBr } = mvPlayInfo
  // 视频设置选项
  const keyNameMap = {
    240: '标清',
    480: '高清',
    720: '超清',
    1080: '1080P'
  }
  // 将设置选项循环加入设置对象中
  return Object.keys(brs).map((key) => {
    // 优先使用mvPlayInfo里的数据
    const findPreferUrl = key === mvPlayInfoBr
    const name = keyNameMap[key]
    const url = findPreferUrl ? mvPlayInfoUrl : brs[key]
    return {
      url,
      name
    }
  })
}

</script>

<style lang="scss" scoped>
.mv {
  padding: $page-padding;

  .title {
    margin-bottom: 16px;
    font-size: $font-size-lg;
    font-weight: $font-weight-bold;
  }

  .mv-content {
    display: flex;
    max-width: 950px;
    margin: auto;

    .left {
      flex: 1;

      .player {
        margin-bottom: 16px;
        overflow: hidden;
        border-radius: 4px;
      }

      .author-wrap {
        display: flex;
        align-items: center;
        margin-bottom: 32px;

        .avatar {
          @include img-wrap(60px);
          margin-right: 8px;

          img {
            @include round(60px);
          }
        }

        .author {
          font-size: $font-size-lg;
        }
      }

      .name {
        margin-bottom: 16px;
        font-size: $font-size-title-lg;
        font-weight: $font-weight-bold;
      }

      .desc {
        display: flex;
        color: var(--font-color-grey-shallow);
        font-size: $font-size-sm;

        .date {
          display: inline-block;
          margin-right: 24px;
        }
      }

      .comments {
        margin-top: 48px;
      }
    }

    .right {
      width: 36%;
      padding-left: 32px;

      .simi-mvs {
        padding: -8px 0;

        .simi-mv-card {
          padding: 8px 0;
        }
      }
    }
  }
}
</style>
