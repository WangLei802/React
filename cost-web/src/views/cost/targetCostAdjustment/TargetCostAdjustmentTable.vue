<!-- TargetCostCompilationTable -->
<template>
    <div ref="TargetCostAdjustmentTable">
        <el-table :data="tableData"
                  stripe
                  border
                  :height="tableHeight"
                  style="width: 100%">
            <!-- 序号 -->
            <el-table-column type="index"
                             :index="this.$getTableIndex(this.queryObj)"
                             :label="this.$l('lbl_no')"
                             width="60"></el-table-column>
            <!-- 成本分期 -->
            <el-table-column prop="accountingObjectName"
                             :label="'成本分期'"
                             width="200"></el-table-column>
            <!-- 阶段 -->
            <el-table-column prop="stageId"
                             :label="'阶段'">
                <template slot-scope="scope">
                    <fd-label :code="scope.row.stageId"
                              type="cost_stage_id"></fd-label>
                </template>
            </el-table-column>

            <!-- 调整金额(含税) -->
            <el-table-column :label="'调整金额(含税)'"
                             prop="targetCostFixAmount"
                             width="150">
                <template slot-scope="scope">
                    {{ scope.row.targetCostFixAmount|NumFormat}}
                </template>
            </el-table-column>
            <el-table-column :label="'调整后总额(含税)'"
                             prop="targetCost"
                             width="150">
                <template slot-scope="scope">
                    {{ scope.row.targetCost|NumFormat}}
                </template>
            </el-table-column>
            <!-- 版本 -->
            <el-table-column prop="stageVersion"
                             :label="'版本'">
                <template slot-scope="scope">
                    {{scope.row.stageVersion |Version}}
                </template>
            </el-table-column>

            <!-- 调整日期 -->
            <el-table-column prop="updatedDate"
                             width="200"
                             :label="'调整日期'"
                             :formatter='this.$dateFormat("updatedDate","yyyy-MM-dd")'></el-table-column>
            <!-- 状态 -->
            <el-table-column :label="this.$l('lbl_status')">
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
                    <template slot-scope="scope">
                        <el-button size="mini"
                                   type="text"
                                   icon="el-icon-view"
                                   :title="$l('btn_detail')"
                                   @click="viewRow(scope.$index, scope.row)"></el-button>
                    </template>

                    <!-- 编辑 -->
                    <el-button size="mini"
                               type="text"
                               icon="el-icon-edit"
                               :title="$l('btn_edit')"
                               @click="editRow(scope.$index, scope.row)"></el-button>

                    <!-- 删除 -->
                    <el-button size="mini"
                               type="text"
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
import { NumFormat, Version } from '@/filters/cost/'
import { LoadingUtil } from '@/utils/common/LoadingUtil'
import { deleteTargetCostAdjustment, getTargetCostFixVersionList } from '@/api/cost/targetCostAdjustmentAPI'
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
    initTableData(data) {
      this.tableData = data
      console.log(this.tableData)
    },
    getList() {
      LoadingUtil.showLoading()
      let _queryObj = {
        companyId: this.queryObj.companyId,
        accountingObjectId: this.queryObj.accountingObjectId,
        status: this.queryObj.status,
        stageId: this.queryObj.stageId,
        pageNum: this.queryObj.pageNum,
        pageSize: this.queryObj.pageSize
      }

      getTargetCostFixVersionList(_queryObj).then(response => {
        LoadingUtil.hideLoading()
        this.initTableData(response.data.content)
        this.queryObj.count = response.data.totalElements
      })
        .catch(error => {
          console.log(error)
          this.$showError(error.message ? error.message : 'msg_system_error')
        })
    },
    editRow(index, rowData) {
      this.$router.push({
        name: 'NewOrUpdateTargetCostAdjustment',
        query: { accountingObjectId: rowData.accountingObjectId, stageId: rowData.stageId, stageVersion: rowData.stageVersion }
      })
    },
    deleteRow(index, rowData) {
      this.$confirm('确认删除该记录', {
        confirmButtonText: this.$l('btn_confirm'),
        cancelButtonText: this.$l('btn_cancel'),
        type: 'warning'
      }).then(() => {
        deleteTargetCostAdjustment(rowData)
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
      const topHeight = this.$refs['TargetCostAdjustmentTable'].getBoundingClientRect().top
      this.tableHeight = this.fullHeight - topHeight - 80
      this.$refs['TargetCostAdjustmentTable'].style.Height = this.tableHeight + 'px'
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
<style lang='scss' scoped>
</style>
