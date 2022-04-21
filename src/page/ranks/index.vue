<template>
  <div class="ranks">
    <PlaylistCard :desc="`播放量：${$utils.formatNumber(item.playCount)}`" :id="item.id" :img="item.coverImgUrl" :key="item.id" :name="item.name" v-for="item in rankPlaylist" />
  </div>
</template>

<script>
import { getRankplaylist } from '@/api'
import PlaylistCard from '@/components/playlist-card'

export default {
  data () {
    return {
      rankPlaylist: []
    }
  },
  created () {
    this.getRankplaylists()
  },
  methods: {
    async getRankplaylists () {
      const { list } = await getRankplaylist()
      this.rankPlaylist = list
      console.log(this.rankPlaylist)
    }
  },
  components: { PlaylistCard }
}
</script>

<style>
.ranks {
  display: flex;
  flex-wrap: wrap;
}
</style>
