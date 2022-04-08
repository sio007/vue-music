<template>
  <div class="new-songs" v-if="list.length">
    <Title>最新音乐</Title>
    <div class="list-wrap">
      <!-- 将两个歌曲对象，循环渲染到模板中 -->
      <div :key="listIndex" class="list" v-for="(list, listIndex) in thunkedList">
        <SongCard :key="item.id" :order="getSongOrder(listIndex, index)" class="song-card" v-bind="nomalizeSong(item)" v-for="(item,index) in list" />
      </div>
    </div>
  </div>
</template>

<script>
import { getNewSongs } from '@/api'
import SongCard from '@/components/song-card'
import { createSong } from '@/utils'

// 获取歌曲的数量限制为10
const songsLimit = 10
export default {
  data () {
    return {
      // 因为需要将歌曲的布局分为2列，平均每一列的数量
      chunkLimit: Math.ceil(songsLimit / 2),
      list: []
    }
  },
  async created () {
    // 向 获取最新音乐接口 发送请求
    const { result } = await getNewSongs()
    // 将接口返回的数据保存到变量中
    this.list = result
  },
  methods: {
    // 在接口返回的数据中 获取歌曲的排名
    // 由于将数据分为两个对象，所有 排名 要经过处理再进行渲染
    getSongOrder (listIndex, index) {
      return listIndex * this.chunkLimit + index + 1
    },
    // 将接口返回的数据对象中的 每一首歌曲 都重新在代码中 创建一个新的对象 方便调用渲染
    nomalizeSong (song) {
      const {
        id,
        name,
        song: {
          mvid,
          artists,
          album: { blurPicUrl },
          duration
        }
      } = song
      return createSong({
        id,
        name,
        img: blurPicUrl,
        artists,
        duration,
        mvId: mvid
      })
    }
  },
  computed: {
    // 将获取的歌曲对象，分别切成两个对象
    thunkedList () {
      return [
        this.list.slice(0, this.chunkLimit),
        this.list.slice(this.chunkLimit, this.list.length)
      ]
    }
  },
  components: { SongCard }
}
</script>

<style lang="scss" scoped>
.new-songs {
  margin-bottom: 36px;
  .list-wrap {
    display: flex;

    .list {
      flex: 1;
      overflow: hidden;
    }
  }
}
</style>
