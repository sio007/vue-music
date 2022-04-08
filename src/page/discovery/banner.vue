<template>
  <el-carousel :interval="4000" type="card" class="banner-carousel">
    <el-carousel-item v-for="banner in banners" :key="banner.scm">
      <img :src="$utils.genImgUrl(banner.imageUrl, 1000,400)" class="banner-img">
    </el-carousel-item>
  </el-carousel>
</template>

<script>
// 引入获取轮播图数据的请求函数
import { getBanner } from '@/api'
export default {
  data () {
    return {
      // 定义存储轮播图数据的变量
      banners: []
    }
  },
  async created () {
    // 调用请求函数 并将返回的数据保存到变量
    const { banners } = await getBanner()
    this.banners = banners
  }
}
</script>

<style lang="scss" scoped>
.banner-carousel {
  /deep/.el-carousel__container {
    height: 200px;
  }

  .banner-img {
    width: 100%;
    height: 100%;
    border-radius: 4px;
  }
}
</style>
