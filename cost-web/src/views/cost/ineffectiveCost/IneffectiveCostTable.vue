<!-- IneffectiveCostTable -->
<template>
  <div ref="ineffectiveCostTable">
    <el-table :data="tableData"
              stripe
              border
              tooltip-effect="dark"
              :height="tableHeight"
              style="width: 100%">
      <!-- 序号 -->
      <el-table-column type="index"
                       :index="this.$getTableIndex(this.queryObj)"
                       :label="this.$l('lbl_no')"
                       width="80"></el-table-column>

      <!-- 无效成本组编号 -->
      <el-table-column prop="groupNumber"
                       :label="'无效成本组编号'">
        <template slot-scope="scope">
          {{ scope.row.groupNumber}}
        </template>
      </el-table-column>
       <!--无效成本金额-->
      <el-table-column prop="ineffectiveCostAmount"
                       :label="'无效成本金额'"
                       width="200">
        <template slot-scope="scope">
          {{ scope.row.ineffectiveCostAmount|NumFormat}}
        </template>
      </el-table-column>
      <!-- 所属项目 -->
      <el-table-column prop="projectId"
                       :label="'所属项目'">
        <template slot-scope="scope">
          {{scope.row.projectId}}
        </template>
      </el-table-column>
      <!-- 编制日期 -->
      <el-table-column prop="agentDate"
                       width="250"
                       :label="'编制日期'"
                       :formatter='this.$dateFormat("updatedDate","yyyy-MM-dd")'></el-table-column>
      <!-- 审批状态 -->
      <el-table-column prop="status"
                       :label="'审批状态'">
        <template slot-scope="scope">
          <fd-label :code="scope.row.status"
                    type="cost_flow_status"></fd-label>
        </template>
      </el-table-column>
      <!-- 操作 -->
      <el-table-column :label="this.$l('lbl_operation')"
                       width="150">
        <template slot-scope="scope">
          <!-- 查看 -->
          <el-button size="mini"
                     type="text"
                     icon="el-icon-view"
                     :title="$l('btn_detail')"
                     @click="viewRow(scope.$index, scope.row)"></el-button>

          <!-- 编辑 -->
          <el-button size="mini"
                     type="text"
                     v-if="scope.row.status === '0' || scope.row.status === '3'"
                     icon="el-icon-edit"
                     :title="$l('btn_edit')"
                     @click="editRow(scope.$index, scope.row)"></el-button>

          <!-- 删除 -->
          <el-button size="mini"
                     type="text"
                     v-if="scope.row.status === '0' || scope.row.status === '3'"
                     icon="el-icon-delete"
                     :title="$l('btn_delete')"
                     @click="deleteRow(scope.$index, scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class='pagination_bar'>
      <mt-pagination @size-change='handleSizeChange'
                     @current-change='handleCurrentChange'
                     :current-page.sync='queryObj.pageNum'
                     :page-sizes='[10, 20, 30, 40]'
                     :page-size='queryObj.pageSize'
                     layout='sizes, prev, pager, next'
                     :total='queryObj.count'>
      </mt-pagination>
    </div>
  </div>
</template>

<script>
  import { LoadingUtil } from '@/utils/common/LoadingUtil'
  import { getIneffectiveCostList, deleteIneffectiveCost } from '@/api/cost/ineffectiveCost'
  import { NumFormat, Version } from '@/filters/cost/'
  import { deepCopy } from '@/utils/cost/objectHelper'
  export default {
    props: {
      queryObj_passed_in: {
        type: Object
      }
    },
    filters: {
      NumFormat,
      Version
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
      initTableData(response) {
        this.tableData = response.data.content
      },
      handleExpandClick(rowData) {
        let parentExpanded
        this.tableData.map(item => {
          if (item.accountObjectId === rowData.accountObjectId && item.accountingObjectName !== '') {
            item._expanded = !item._expanded
            parentExpanded = item._expanded
          }
          if (item.accountObjectId === rowData.accountObjectId && item.accountingObjectName === '') {
            item._show = parentExpanded
            item._expanded = parentExpanded
          }
        })
      },
      getList() {
        LoadingUtil.showLoading()
        // 转换参数
        let _queryObj = {
          groupNumber: this.queryObj.groupNumber,
          accountObjectId: this.queryObj.accountObjectId,
          status: this.queryObj.status,
          pageNum: this.queryObj.pageNum,
          pageSize: this.queryObj.pageSize
        }

        getIneffectiveCostList(_queryObj)
          .then(response => {
            LoadingUtil.hideLoading()
            this.initTableData(response)
            this.queryObj.count = response.data.totalElements
          })
          .catch(error => {
            console.log(error)
            this.$showError(error.message ? error.message : 'msg_system_error')
          })
      },
      // 查看
      viewRow(index, rowData) {
        this.$router.push({
          name: 'NewOrUpdateIneffectiveCost',
          query: { id: rowData.id, accountObjectId: rowData.accountObjectId, projectId: rowData.projectId, groupNumber: rowData.groupNumber, agent: rowData.agent,
            agentDate: rowData.agentDate, details: rowData.details, isEdit: false }
        })
      },
      // 编辑
      editRow(index, rowData) {
        this.$router.push({
          name: 'NewOrUpdateIneffectiveCost',
          query: { id: rowData.id, accountObjectId: rowData.accountObjectId, projectId: rowData.projectId, groupNumber: rowData.groupNumber, agent: rowData.agent,
            agentDate: rowData.agentDate, details: rowData.details, isEdit: true }
        })
      },
      deleteRow(index, rowData) {
        this.$confirm('确认删除该记录', {
          confirmButtonText: this.$l('btn_confirm'),
          cancelButtonText: this.$l('btn_cancel'),
          type: 'warning'
        }).then(() => {
          deleteIneffectiveCost(rowData)
            .then(response => {
              this.$showSuccess(response.message)
              if (response.status !== '404') this.$delete(this.tableData, index)
              this.getList()
            })
            .catch(error => {
              console.log(error)
              this.$showError(error.message ? error.message : 'msg_system_error')
            })
        })
          .catch(() => { })
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
        const topHeight = this.$refs['ineffectiveCostTable'].getBoundingClientRect().top
        this.tableHeight = this.fullHeight - topHeight - 80
        this.$refs['ineffectiveCostTable'].style.Height = this.tableHeight + 'px'
      }
    },
    mounted: function() {
      this.$nextTick(function() {
        this.settingTableHeight()
      })
    //   window.onresize = () => {
    //     return (() => {
    //       this.fullHeight = document.documentElement.clientHeight
    //     })()
    //   }
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
