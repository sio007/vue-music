<template>
  <div class="new-songs" v-if="list.length">
    <Title>最新音乐</Title>
    <div class="list-wrap">
      <!-- 将两个歌曲对象，循环渲染到模板中 -->
      <div :key="listIndex" class="list" v-for="(list, listIndex) in thunkedList">
        <SongCard :key="item.id" :order="getSongOrder(listIndex, index)" @click.native="onClickSong(listIndex, index)" class="song-card" v-bind="nomalizeSong(item)" v-for="(item,index) in list" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapMutations } from '@/store/helper/music'
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
          duration,
          fee
        }
      } = song
      return createSong({
        id,
        name,
        img: blurPicUrl,
        artists,
        duration,
        mvId: mvid,
        fee
      })
    },
    // 点击歌曲后
    onClickSong (listIndex, index) {
      // 这里因为getSongOrder是从1开始显示, 所以当做数组下标需要减一
      const nomalizedSongIndex = this.getSongOrder(listIndex, index) - 1
      const nomalizedSong = this.normalizedSongs[nomalizedSongIndex]
      // 整合歌曲信息，并开始播放
      this.startSong(nomalizedSong)
      // 将全部歌曲对象加入到播放列表中
      this.setPlaylist(this.normalizedSongs)
    },
    ...mapMutations(['setPlaylist']),
    ...mapActions(['startSong'])
  },
  computed: {
    // 将获取的歌曲对象，分别切成两个对象
    thunkedList () {
      return [
        this.list.slice(0, this.chunkLimit),
        this.list.slice(this.chunkLimit, this.list.length)
      ]
    },
    // 将获取的歌曲对象整合为一个对象
    normalizedSongs () {
      return this.list.map(song => this.nomalizeSong(song))
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
