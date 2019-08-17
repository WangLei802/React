<!-- DashboardTable -->
<template>
  <div ref="dashboardTable">
    <el-table :data="tableData" stripe border :height="tableHeight" style="width: 100%">
      <el-table-column type="index" :index="this.$getTableIndex(this.queryObj)" :label="this.$l('lbl_no')" width="80"></el-table-column>
      <el-table-column prop="title" :label="this.$l('lbl_dashboard_title')"></el-table-column>
      <el-table-column prop="des" :label="this.$l('lbl_dashboard_description')"></el-table-column>
      <el-table-column :label="this.$l('lbl_dashboard_type')">
        <template slot-scope="scope">
          <fd-label :code="scope.row.type" type="sys_dashboard_type"></fd-label>
        </template>
      </el-table-column>
      <el-table-column  :label="this.$l('lbl_dashboard_layout_type')">
        <template slot-scope="scope">
          <fd-label :code="scope.row.layoutType" type="sys_dashboard_layout_type"></fd-label>
        </template>
      </el-table-column>
      <el-table-column prop="updatedDate" :label="this.$l('lbl_update_date')" width="200" :formatter='this.$dateFormat("updatedDate")'></el-table-column>
      <el-table-column :label="this.$l('lbl_operation')" width="150">
        <template slot-scope="scope">
          <!-- <el-button type="text" icon="el-icon-circle-check-outline" :title="$l('btn_edit')" @click="setDefault(scope.$index, scope.row)"></el-button> -->
          <el-button type="text" icon="el-icon-menu" :title="$l('btn_edit')" @click="editWidget(scope.$index, scope.row)"></el-button>
          <el-button type="text" icon="el-icon-edit" :title="$l('btn_edit')" @click="editRow(scope.$index, scope.row)"></el-button>
          <el-button type="text" icon="el-icon-delete" :title="$l('btn_delete')" @click="deleteRow(scope.$index, scope.row)"></el-button>
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
  searchDashboardList,
  deleteDashboard,
  setDefaultDashboard
} from '@/api/sys/dashboardManageAPI'
import { LoadingUtil } from '@/utils/common/LoadingUtil'
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
      tableData: [],
      tableHeight: '0',
      fullHeight: document.documentElement.clientHeight
    }
  },
  computed: {
    queryObj: function() {
      return JSON.parse(JSON.stringify(this.queryObj_passed_in))
    }
  },
  methods: {
    checkDataExist() {
      const systemDashboard = this.tableData.filter(item => { return item.type === '1' })
      this.$parent.addUsable = {
        userDataExist: (systemDashboard.length > 0),
        systemDataExist: (systemDashboard.length > 0)
      }
    },
    getList() {
      LoadingUtil.showLoading()
      if (typeof this.queryObj.isDefault === 'boolean') {
        this.queryObj.isDefault = this.queryObj.isDefault ? '1' : '0'
      }

      searchDashboardList(this.queryObj)
        .then(response => {
          LoadingUtil.hideLoading()
          response.data.content.map(item => {
            item.updateDate = new Date(item.updateDate).format()
          })
          this.tableData = response.data.content
          this.checkDataExist()
          this.queryObj.count = response.data.totalElements
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
          deleteDashboard(rowData.id)
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
        name: 'NewOrUpdateDashboard',
        query: { id: rowData.id }
      })
    },
    setDefault(index, rowData) {
      setDefaultDashboard(rowData.id)
        .then(response => {
          this.$showSuccess(response.message)
        })
        .catch(error => {
          console.log(error)
        })
    },
    editWidget(index, rowData) {
      this.$router.push({
        name: 'NewOrUpdateDashboardWidget',
        query: { id: rowData.id, role: rowData.type }
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
      const topHeight = this.$refs['dashboardTable'].getBoundingClientRect().top
      this.tableHeight = this.fullHeight - topHeight - 80
      this.$refs['dashboardTable'].style.Height = this.tableHeight + 'px'
    },
    handleEdit(index, row) {
      this.$router.push({
        name: 'NewOrUpdateDashboard',
        query: { id: row.id, role: '0' }
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
