<template>
  <div class="recommend" v-if="list.length">
    <Title>推荐歌单</Title>
    <div class="listwrap">
      <PlayListCard :desc="item.copywriter" :id="item.id" :img="item.picUrl" :key="item.id" :name="item.name" v-for="item in list" />
    </div>
  </div>
</template>

<script>
import PlayListCard from '@/components/playlist-card'
import { getPresonalized } from '@/api'
export default {
  data () {
    return {
      list: []
    }
  },
  async created () {
    const { result } = await getPresonalized({ limit: 10 })
    this.list = result
  },
  components: { PlayListCard }

}
</script>

<style>
.listwrap {
  margin: 0 -4px;
  display: flex;
  flex-wrap: wrap;
}
</style>
