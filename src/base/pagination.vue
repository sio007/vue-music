<template>
  <div class="pagination" v-if="total > pageSize">
    <el-pagination :page-size="pageSize" layout="prev, pager, next" :total="total" v-bind="$attrs" v-on="$listeners">
    </el-pagination>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  props: ['pageSize', 'total'],
  name: 'Pagination'
}
</script>

<style>
.pagination {
  text-align: right;
}
</style>
