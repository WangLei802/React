<!-- WidgetTable -->
<template>
  <div ref="widgetTable">
    <el-table :height="tHeight" :data="tableData" stripe border  style="width: 100%">
      <el-table-column type="index" :index="this.$getTableIndex(this.queryObj)" :label="this.$l('lbl_no')" width="80"></el-table-column>
      <el-table-column prop="name" :label="this.$l('lbl_widget_name')"></el-table-column>
      <el-table-column prop="des" :label="this.$l('lbl_widget_description')"></el-table-column>
      <el-table-column :label="this.$l('lbl_widget_module_type')">
        <template slot-scope="scope">
          <fd-label :code="scope.row.moduleType" type="sys_widget_module_type"></fd-label>
        </template>
      </el-table-column>
      <el-table-column :label="this.$l('lbl_widget_widget_type')">
        <template slot-scope="scope">
          <fd-label :code="scope.row.widgetType" type="sys_widget_type"></fd-label>
        </template>
      </el-table-column>
      <el-table-column :label='this.$ls("lbl_widget_data")' prop="data" >
          <template slot-scope="scope">
          <fd-label :code="scope.row.dataType" type="sys_widget_data_type"></fd-label>
        </template>
      </el-table-column>
      <el-table-column :label="this.$l('lbl_status')">
        <template slot-scope="scope">
          <fd-label :code="scope.row.status" type="sys_widget_status"></fd-label>
        </template>
      </el-table-column>
      <el-table-column :label="this.$l('lbl_operation')" width="150">
        <template slot-scope="scope">
          <el-button type="text" icon="el-icon-edit" :title="$l('btn_edit')" @click="editRow(scope.$index, scope.row)"></el-button>
          <el-button  type="text" :icon="scope.row.status == '0' ? 'el-icon-remove-outline' : 'el-icon-circle-check'" :title="scope.row.status == '1' ? $l('btn_enable') : $l('btn_disable')" @click="updateRow(scope.$index, scope.row)"></el-button>
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
  searchWidgetList,
  deleteWidget,
  updateStatus
} from '@/api/sys/widgetManageAPI'
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
      searchWidgetList(this.queryObj)
        .then(response => {
          LoadingUtil.hideLoading()
          response.data.content.map(item => {
            item.updateDate = new Date(item.updateDate).format()
            item.statusName = item.status === '0' ? '停用' : '启用'
          })

          this.tableData = response.data.content
          this.queryObj.count = response.data.totalElements
        })
        .catch(error => {
          console.log(error)
        })
    },
    updateRow(index, rowData) {
      // this.$confirm(this.$l("msg_update_status_confirm"), this.$l("msg_update_status_tips"), {
      //   confirmButtonText: this.$l("btn_confirm"),
      //   cancelButtonText: this.$l("btn_cancel"),
      //   type: "warning"
      // })
      // .then(() => {
      updateStatus(rowData.id)
        .then(response => {
          this.$showSuccess(response.message)
          this.getList()
        })
        .catch(error => {
          console.log(error)
          this.$showError('msg_system_error')
        })
      // this.$delete(this.tableData, index);
        // })
      //  .catch(() => {});
    },
    editRow(index, rowData) {
      this.$router.push({
        name: 'NewOrUpdateWidget',
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
      const topHeight = this.$refs['widgetTable'].getBoundingClientRect().top
      this.tableHeight = this.fullHeight - topHeight - 80
      this.$refs['widgetTable'].style.Height = this.tableHeight + 'px'
    },
    handleEdit(index, row) {
      this.$router.push({
        name: 'NewOrUpdateWidget',
        query: { id: row.id }
      })
    },
    handleDelete(index, row) {
      deleteWidget(row.id)
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
