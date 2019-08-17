<template>
  <div :style="{'width':'width','overflow':'hidden'}">
    <el-table :data="tableData" style="width: 100%" height="250">
      <el-table-column :prop="item.prop" :label="item.label" :width="item.width" :key="item.prop" v-for="item in tableHeader">
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  name: 'fd-table',
  props: ['data', 'width', 'heigth'],
  data() {
    return {
    }
  },
  computed: {
    tableHeader: function() {
      return this.data && this.data.header || []
    },
    tableData: function() {
      return this.data && this.data.data || []
    }
  },
  mounted: function() {}
}
</script>
