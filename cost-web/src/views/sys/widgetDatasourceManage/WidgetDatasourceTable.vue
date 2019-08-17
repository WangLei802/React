<!-- WidgetDatasourceTable -->
<template>
  <div ref="widgetDatasourceTable">
    <el-table :height="tHeight" :data="tableData" stripe border  style="width: 100%">
      <el-table-column type="index" :index="this.$getTableIndex(this.queryObj)" :label="this.$l('lbl_no')" width="80"></el-table-column>
      <el-table-column prop="name" :label="this.$l('lbl_dashboard_title')"></el-table-column>
      <el-table-column prop="des" :label="this.$l('lbl_widget_description')"></el-table-column>
      <el-table-column prop="moduleType" :label="this.$l('lbl_widget_module_type')"></el-table-column>
      <el-table-column prop="dataType"  :label="this.$l('lbl_widget_data_type')" >
        <template slot-scope="scope">
          <fd-label :code="scope.row.dataType" type="sys_widget_data_type"></fd-label>
        </template>
      </el-table-column>
      <el-table-column prop="createdBy" :label="this.$l('lbl_creator')"></el-table-column>
      <el-table-column prop="createdDate" width="170" :label="this.$l('lbl_create_date')" :formatter='this.$dateFormat("updatedDate")'></el-table-column>
      <el-table-column prop="updatedBy" :label="this.$l('lbl_updator')"></el-table-column>
      <el-table-column prop="updatedDate" width="170" :label="this.$l('lbl_update_date')" :formatter='this.$dateFormat("updatedDate")'></el-table-column>
      <el-table-column :label="this.$l('lbl_operation')" width="150">
        <template slot-scope="scope">
          <el-button  type="text" icon="el-icon-edit" :title="$l('btn_edit')" @click="editRow(scope.$index, scope.row)"></el-button>
          <el-button  type="text" icon="el-icon-delete" :title="$l('btn_delete')" @click="deleteRow(scope.$index, scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class='pagination_bar'>
      <mt-pagination @size-change='handleSizeChange' @current-change='handleCurrentChange' :current-page.sync='queryObj.pageNum' :page-sizes='[10, 20, 30, 40]' :page-size='queryObj.pageSize' layout='sizes, prev, pager, next' :total='queryObj.count'>
      </mt-pagination>
    </div>
  </div>
</template>

<script>
import {
  searchWidgetDatasourceList,
  deleteWidgetDatasource
} from '@/api/sys/widgetDatasourceManageAPI'
import { LoadingUtil } from '@/utils/common/LoadingUtil'
import { tableHeight } from '@/utils/common/index'
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
  computed: {
    tHeight: function() {
      let options = {
        fullHeight: this.$store.getters.fullHeight,
        opened: this.$store.getters.sidebar.opened,
        showForm: this.$store.getters.showForm,
        obj: this
      }
      return `${tableHeight(options)}px`
    }
  },
  data() {
    return {
      tableData: [],
      queryObj: this.queryObj_passed_in,
      tableHeight: '0',
      fullHeight: document.documentElement.clientHeight
    }
  },
  methods: {
    getList() {
      LoadingUtil.showLoading()
      searchWidgetDatasourceList(this.queryObj)
        .then(response => {
          LoadingUtil.hideLoading()
          response.data.content.map(item => {
            item.updateDate = new Date(item.updateDate).format()
          })

          this.tableData = response.data.content
          this.queryObj.count = response.data.totalElements
          console.log(response.data.content)
        })
        .catch(error => {
          console.log(error)
        })
    },
    deleteRow(index, rowData) {
      this.$confirm(this.$l('msg_delete_confirm'), this.$l('msg_delete_tips'), {
        confirmButtonText: this.$l('btn_confirm'),
        cancelButtonText: this.$l('btn_cancel'),
        type: 'warning'
      })
        .then(() => {
          deleteWidgetDatasource(rowData.id)
            .then(response => {
              this.$showSuccess(response.message)
            })
            .catch(error => {
              console.log(error)
              this.$showError('msg_system_error')
            })
          this.$delete(this.tableData, index)
        })
        .catch(() => {})
    },
    editRow(index, rowData) {
      this.$router.push({
        name: 'NewOrUpdateWidgetDatasource',
        query: { id: rowData.id }
      })
    },
    handleSizeChange(val) {
      this.queryObj.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.queryObj.pageNum = val
      this.getList()
    },
    settingTableHeight: function() {
      const topHeight = this.$refs['widgetDatasourceTable'].getBoundingClientRect().top
      this.tableHeight = this.fullHeight - topHeight - 80
      this.$refs['widgetDatasourceTable'].style.Height = this.tableHeight + 'px'
    },
    handleEdit(index, row) {
      this.$router.push({
        name: 'NewOrUpdateWidgetDatasource',
        query: { id: row.id }
      })
    },
    handleDelete(index, row) {
      deleteWidgetDatasource(row.id)
        .then(response => {
          this.$delete(this.tableData, index)
        })
        .catch(error => {
          console.log(error)
        })
    }
  },
  mounted: function() {
    this.getList()
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
<style lang='scss' scoped>
</style>
