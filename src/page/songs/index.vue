// 最新音乐页面
<template>
  <div class="songs">
    <div class="tabs">
      <Tabs :tabs="tabs" @tabChange="getSongs" align="right" type="small" v-model="activeTabIndex" />
    </div>
    <SongTable :songs="songs" header-row-class-name="header-row" />
  </div>
</template>

<script type="text/ecmascript-6">
import { getTopSongs } from '@/api'
import { createSong } from '@/utils'
import SongTable from '@/components/song-table'

export default {
  async created () {
    // tab栏数据
    this.tabs = [
      { title: '全部', type: 0 },
      { title: '华语', type: 7 },
      { title: '欧美', type: 96 },
      { title: '日本', type: 8 },
      { title: '韩国', type: 16 }
    ]
    this.getSongs()
  },
  data () {
    return {
      // 被选中的tab栏选项的索引
      activeTabIndex: 0,
      // 所有歌曲的数据变量
      songs: []
    }
  },
  methods: {
    // 发送请求 获取对应tab选项的所有歌曲
    async getSongs () {
      const { data } = await getTopSongs(this.tabs[this.activeTabIndex].type)
      // 将获取的所有歌曲经过循环处理 赋值到存储歌曲的变量中
      this.songs = data.map(song => {
        const {
          id,
          name,
          artists,
          duration,
          mvid,
          album: { picUrl, name: albumName }
        } = song
        return createSong({
          id,
          name,
          artists,
          duration,
          albumName,
          img: picUrl,
          mvId: mvid
        })
      })
      console.log(this.songs)
    }
  },
  components: {
    SongTable
  }
}
</script>


<style lang="scss">
.songs {
  padding: 12px;

  .header-row {
    display: none;
  }
}
</style>
