
<template>
  <div ref="resourceTableDiv">
    <el-table row-key="id" ref="resourceTable" :data="tableData"
              @select="handleSelect"
              @select-all="handleSelectAll"
              @selection-change="handleSelectionChange"
              stripe :height="tableHeight" border style="width: 100%">
      <el-table-column type="selection" prop='id' width="55">
      </el-table-column>
      <el-table-column type="index" :index="this.$getTableIndex(this.queryObj)" :label="this.$l('lbl_no')" width="80"></el-table-column>
      <el-table-column prop="name" :label="this.$l('lbl_resource_name')" ></el-table-column>
      <el-table-column prop="apiCode" :label="this.$l('lbl_resource_code')" ></el-table-column>
      <el-table-column prop="apiEndpoint" :label="this.$l('lbl_api_endpoint')" ></el-table-column>
    </el-table>
  </div>
</template>
<script>
  export default {
    props: {
      queryObj_passed_in: {
        type: Object
      },
      externalData: {
        type: Array,
        default: function() {
          return []
        }
      }
    },
    data() {
      return {
        tableHeight: '0',
        tableData: [],
        queryObj: this.queryObj_passed_in,
        fullHeight: document.documentElement.clientHeight
      }
    },
    methods: {
      settingTableHeight: function() {
        const topHeight = this.$refs['resourceTableDiv'].getBoundingClientRect().top
        this.tableHeight = this.fullHeight - topHeight - 80
        this.$refs['resourceTableDiv'].style.Height = this.tableHeight + 'px'
      },
      getList() {
        if (this.queryObj.menuId) {
          this.tableData = this.queryObj.optMenuList.get(this.queryObj.menuId) || []
          this.$nextTick(function() {
            this.defaultChecked()
          })
        }
      },
      handleSelect(selection, row) {
        let flag = true
        for (let i = 0; i < selection.length; i++) {
          if (selection[i].id === row.id) {
            this.queryObj.optMenuList.get(this.queryObj.menuId).forEach((item, index) => {
              if (item.id === row.id) {
                item.checked = true
              }
            })
            flag = false
            break
          }
        }
        if (flag) {
          this.queryObj.optMenuList.get(this.queryObj.menuId).forEach((item, index) => {
            if (item.id === row.id) {
              item.checked = false
            }
          })
        }
      },
      handleSelectAll(selection) {
        // 全选/取消全选
        let allChecked = true
        if (selection.length === 0) {
          allChecked = false
        }
        this.queryObj.optMenuList.get(this.queryObj.menuId).forEach((item, index) => {
          item.checked = allChecked
        })
      },
      handleSelectionChange(val) {
        // this.multipleSelection = val
      },
      defaultChecked() {
        this.tableData.forEach((item, index) => {
          this.$refs.resourceTable.toggleRowSelection(item, item.checked)
        })
      }
    },
    mounted: function() {
      this.$nextTick(function() {
        this.settingTableHeight()
      })
      // window.onresize = () => {
      //   return (() => {
      //     this.fullHeight = document.documentElement.clientHeight
      //   })()
      // }
    },
    watch: {
      fullHeight(val) {
        this.settingTableHeight()
      }
    }
  }
</script>
