<template>
  <div class="mvs" ref="page">
    <div class="tabs-wrap">
      <span class="tabs-type">地区：</span>
      <Tabs :tabs="areaTabs" class="tabs" type="split" v-model="activeAreaTabIndex" />
    </div>
    <div class="tabs-wrap">
      <span class="tabs-type">类型：</span>
      <Tabs :tabs="typeTabs" class="tabs" type="split" v-model="activeTypeTabIndex" />
    </div>
    <div class="tabs-wrap">
      <span class="tabs-type">排序：</span>
      <Tabs :tabs="sortTabs" class="tabs" type="split" v-model="activeSortTabIndex" />
    </div>
    <WithPagination :getData="getAllMvs" :getDataParams="getDataParams" :limit="40" :scollTarget="this.$refs && this.$refs.page" :total="mvCount" @getDataSuccess="onGetMvs">
      <ul class="list-wrap">
        <li :key="mv.id" class="list-item" v-for="mv in mvs">
          <MvCard :author="mv.artistName" :duration="mv.duratoin" :id="mv.id" :img="mv.cover" :name="mv.name" :playCount="mv.playCount" />
        </li>
      </ul>
    </WithPagination>
  </div>
</template>

<script>
import { getAllMvs } from '@/api'
import MvCard from '@/components/mv-card'
import WithPagination from '@/components/with-pagination'

// 三个tab栏的数据
const areaTabs = ['全部', '内地', '港台', '欧美', '日本', '韩国']
const typeTabs = ['全部', '官方版', '原声', '现场版', '网易出品']
const sortTabs = ['上升最快', '最热', '最新']

export default {
  created () {
    // 将三个tab栏数据导入
    this.areaTabs = areaTabs
    this.typeTabs = typeTabs
    this.sortTabs = sortTabs
    // 导入获取mv请求
    this.getAllMvs = getAllMvs
  },
  data () {
    return {
      // 所有mv
      mvs: [],
      // mv播放次数
      mvCount: 0,
      // 三个tab栏的选中项的索引index
      activeAreaTabIndex: 0,
      activeTypeTabIndex: 0,
      activeSortTabIndex: 0
    }
  },
  methods: {
    // 获得所有mv数据
    onGetMvs ({ data, count }) {
      this.mvs = data
      // 如果mv有播放次数，则保存到变量中
      if (count) {
        this.mvCount = count
      }
    }
  },
  computed: {
    // 获得三个tab栏选中选项的索引index
    getDataParams () {
      return {
        area: areaTabs[this.activeAreaTabIndex],
        order: sortTabs[this.activeSortTabIndex],
        type: typeTabs[this.activeTypeTabIndex]
      }
    }
  },
  components: { MvCard, WithPagination }
}
</script>

<style lang="scss" soped>
.mvs {
  padding: $page-padding;
  margin: auto;

  .tabs-wrap {
    margin-bottom: 16px;
    display: flex;
    align-items: center;

    .tab-type {
      font-size: $font-size-sm;
    }
  }

  @include list(25%);
}
</style>
