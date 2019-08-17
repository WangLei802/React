<!-- IneffectiveCostTable -->
<template>
  <div ref="ineffectiveCostTable">
    <el-table
      :data="tableData"
      stripe
      border
      tooltip-effect="dark"
      :height="tHeight"
      style="width: 100%"
      size="small"
    >
      <!-- 序号 -->
      <el-table-column
        type="index"
        :index="this.$getTableIndex(this.queryObj)"
        :label="this.$l('lbl_no')"
      ></el-table-column>
      <!-- 合同编号 -->
      <el-table-column prop="contractNumber" :label="'合同编号'" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.contractNumber}}</template>
      </el-table-column>
      <!-- 合同名称 -->
      <el-table-column prop="contractName" :label="'合同名称'" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.contractName}}</template>
      </el-table-column>
      <!-- 项目名称 -->
      <el-table-column prop="projectName" :label="'项目名称'" show-overflow-tooltip>
        <template slot-scope="scope">{{scope.row.projectName}}</template>
      </el-table-column>
      <!-- 转固金额 -->
      <el-table-column prop="conveySureMoney" :label="'转固金额(元)'">
        <template slot-scope="scope">{{scope.row.conveySureMoney | NumFormat}}</template>
      </el-table-column>
      <!-- 提交日期 -->
      <el-table-column
        prop="operateDate"
        width="150"
        :label="'提交日期'"
        :formatter="this.$dateFormat("operateDate","yyyy-MM-dd")"
      ></el-table-column>
      <!-- 审批状态 -->
      <el-table-column prop="status" :label="'审批状态'">
        <template slot-scope="scope">
          <fd-label :code="scope.row.status" type="cost_flow_status"></fd-label>
        </template>
      </el-table-column>
      <!-- 操作 -->
      <el-table-column :label="this.$l('lbl_operation')">
        <template slot-scope="scope">
          <el-row>
            <!-- 查看 -->
            <el-button
              size="mini"
              type="text"
              icon="el-icon-view"
              :title="$l('btn_detail')"
              @click="viewRow(scope.$index, scope.row)"
            ></el-button>

            <!-- 编辑 -->
            <el-button
              size="mini"
              type="text"
              v-if="(scope.row.status === '0' || scope.row.status === '3') && $checkPersmissionByCode('cost:budgetConveySure:create')"
              icon="el-icon-edit"
              :title="$l('btn_edit')"
              @click="editRow(scope.$index, scope.row)"
            ></el-button>

            <!-- 删除 -->
            <el-button
              size="mini"
              type="text"
              v-if="(scope.row.status === '0' || scope.row.status === '3') && $checkPersmissionByCode('cost:budgetConveySure:delete')"
              icon="el-icon-delete"
              :title="$l('btn_delete')"
              @click="deleteRow(scope.$index, scope.row)"
            ></el-button>
          </el-row>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination_bar">
      <mt-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="queryObj.pageNum"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="queryObj.pageSize"
        layout="sizes, prev, pager, next"
        :total="queryObj.count"
      ></mt-pagination>
    </div>
  </div>
</template>

<script>
import { LoadingUtil } from '@/utils/common/LoadingUtil'
import { getConsolidationList, deleteConsolidation, setFlowStatus } from '@/api/cost/consolidationAPI'
import { NumFormat, Version } from '@/filters/cost/'
import { deepCopy } from '@/utils/cost/objectHelper'
import { tableHeight } from '@/utils/common/index'
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
  data () {
    return {
      tableData: [],
      queryObj: this.queryObj_passed_in,
      tableHeight: '0',
      fullHeight: document.documentElement.clientHeight
    }
  },
  computed: {
    tHeight: function () {
      let options = {
        fullHeight: this.$store.getters.fullHeight,
        opened: this.$store.getters.sidebar.opened,
        showForm: this.$store.getters.showForm,
        obj: this
      }
      return `${tableHeight(options)}px`
    }
  },
  methods: {
    initTableData (response) {
      this.tableData = response.data.content
    },
    handleExpandClick (rowData) {
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
    getList () {
      // localStorage.setItem("subId","")
      LoadingUtil.showLoading()
      // 转换参数
      let _queryObj = {
        companyId: this.queryObj.ConstructionModelTest.companyId,
        projectId: this.queryObj.ConstructionModelTest.projectId,
        contractNumber: this.queryObj.contractNumber,
        contractName: this.queryObj.contractName,
        status: this.queryObj.status,
        pageNum: this.queryObj.pageNum,
        pageSize: this.queryObj.pageSize
      }

      getConsolidationList(_queryObj)
        .then(response => {
          //   debugger
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
    viewRow (index, rowData) {
      this.$router.push({
        name: 'NewOrUpdateConsolidation',
        query: { id: rowData.id, isEdit: false, isCat: true }
      })
    },
    // 编辑
    editRow (index, rowData) {
      this.$router.push({
        name: 'NewOrUpdateConsolidation',
        query: { id: rowData.id, isEdit: true }
      })
    },
    deleteRow (index, rowData) {
      this.$confirm('确认删除该记录', {
        confirmButtonText: this.$l('btn_confirm'),
        cancelButtonText: this.$l('btn_cancel'),
        type: 'warning'
      }).then(() => {
        let query = {
          'id': rowData.id
        }
        deleteConsolidation(rowData)
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
    // 流程处理
    changRowFlow (index, rowData, flowStatus) {
      setFlowStatus({ id: rowData.id, status: flowStatus })
        .then(response => {
          this.$showSuccess(response.message)
          this.getList()
        })
        .catch(error => {
          console.log(error)
          this.$showError(error.message ? error.message : 'msg_system_error')
        })
    },
    handleSizeChange (val) {
      this.queryObj.pageSize = val
      this.getList()
    },
    handleCurrentChange (val) {
      this.queryObj.pageNum = val
      this.getList()
    },
    settingTableHeight: function () {
      const topHeight = this.$refs['ineffectiveCostTable'].getBoundingClientRect().top
      this.tableHeight = this.fullHeight - topHeight - 80
      this.$refs['ineffectiveCostTable'].style.Height = this.tableHeight + 'px'
    }
  },
  mounted: function () {
    this.$nextTick(function () {
      this.settingTableHeight()
    })
    //   window.onresize = () => {
    //     return (() => {
    //       this.fullHeight = document.documentElement.clientHeight
    //     })()
    //   }
  },
  watch: {
    fullHeight (val) {
      this.settingTableHeight()
    }
  }
}

</script>
<style lang='scss' scoped>
</style>
