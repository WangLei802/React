<!-- IneffectiveCostTable -->
<template>
  <div ref="ineffectiveCostTable">
    <el-table :data="tableData"
              size="small"
              stripe
              border
              tooltip-effect="dark"
              style="width: 100%"
              :row-style="showRow"
              :height="tHeight">
      <!-- 序号 -->
      <el-table-column type="index"
                       :index="this.$getTableIndex(this.queryObj)"
                       :label="this.$l('lbl_no')"></el-table-column>

      <!-- 资金计划名称 -->
      <el-table-column prop="fundsPlanName"
                       :label="'资金计划名称'" show-overflow-tooltip>
        <template slot-scope="scope">
          <div style="text-align:left"
               :title="scope.row.fundsPlanName">
            <i :class="!scope.row._expanded ? 'fa fa-plus-square-o' : 'fa fa-minus-square-o' "
               :title="!scope.row._expanded ? '展开' : '收起'"
               style="font-size:14px;font-weight:bold;cursor:pointer"
               v-show="scope.row._showExpanded"
               @click="handleExpandClick(scope.row)"></i>&nbsp;&nbsp; {{scope.row.fundsPlanName }}
          </div>
        </template>
      </el-table-column>

       <!-- 成本分期 -->
      <el-table-column prop="accountingObjectName"
                       :label="'成本分期'" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.accountingObjectName}}
        </template>
      </el-table-column>
      <!-- 计划付款总金额（元） -->
      <el-table-column prop="payMoneySum"
                       :label="'计划付款总金额（元）'" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.payMoneySum | NumFormat}}
        </template>
      </el-table-column>
      <!-- 经办人 -->
      <el-table-column prop="operator"
                       :label="'经办人'" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.operator}}
        </template>
      </el-table-column>

      <!-- 提交日期 -->
      <el-table-column prop="operateDate"
                       :label="'提交日期'"
                       :formatter='this.$dateFormat("operateDate","yyyy-MM-dd")' width="150"></el-table-column>
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
                       width="280">
        <template slot-scope="scope">
          <el-row>
            <el-col :span="12"
                    style="text-align:left;width:40%">
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
          </el-col>
          <el-col :span="12"
                  style="text-align:left;width:30%">
            <!-- 审批 -->
            <el-button size="small"
                       :title="'审批通过'"
                       style="font-size:14px;"
                       type="text"
                       @click="changRowFlow(scope.$index, scope.row,'2')">通过</el-button>
            <el-button size="small"
                       :title="'审批驳回'"
                       style="font-size:14px;"
                       type="text"
                       @click="changRowFlow(scope.$index, scope.row,'3')">驳回</el-button>
          </el-col>
          <el-col :span="12"
                  style="text-align:left;width:30%">
                <el-button size="small"
                       :title="'升版成功'"
                       style="font-size:14px;"
                       type="text"
                       v-if="scope.row.status === '2'"
                       @click="updateRow(scope.$index, scope.row)">升版</el-button>
          </el-col>
          </el-row>
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
  import { getFundPlanList, deleteFundPlan, setFlowStatus } from '@/api/cost/fundPlanApi'
  import { NumFormat, Version, cutString } from '@/filters/cost/'
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
      Version,
      cutString
    },
    data() {
      return {
        tableData: [],
        queryObj: this.queryObj_passed_in
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
    methods: {
      initTableData(response) {
        this.tableData = []
        if (response && response.data.content) {
          response.data.content.map(item => {
            item.fundsPlanId = item.id
            item._expanded = false
            item._show = true
            if (item.children && item.children.length > 0) item._showExpanded = true
            this.tableData = this.tableData.concat(item)
            if (item.children && item.children.length > 0) {
              item.children[0].fundsPlanId = item.parentId
              item.children[0]._show = false
              item.children[0].fundsPlanName = ''
              this.tableData = this.tableData.concat(item.children)
            }
          })
        }
      },
      showRow: function (row) {
        // 行隐藏
        const show = row.row._show
        return show ? 'animation:treeTableShow 1s;-webkit-animation:treeTableShow 1s;' : 'display:none;'
      },
      handleExpandClick (rowData) {
        let parentExpanded
        this.tableData.map(item => {
          if (item.fundsPlanId === rowData.fundsPlanId && item.fundsPlanName !== '') {
            item._expanded = !item._expanded
            parentExpanded = item._expanded
          }
          if (item.fundsPlanId === rowData.fundsPlanId && item.fundsPlanName === '') {
            item._show = parentExpanded
            item._expanded = parentExpanded
          }
        })
      },
      getList () {
        LoadingUtil.showLoading()
        // 转换参数
        console.log(this.queryObj_passed_in)
        let _queryObj = {
          companyId: this.queryObj_passed_in.ConstructionModelTest.companyId,
          projectId: this.queryObj_passed_in.ConstructionModelTest.projectId,
          accountingObjectId: this.queryObj_passed_in.ConstructionModelTest.accObjId,
          status: this.queryObj_passed_in.status,
          fundsPlanName: this.queryObj_passed_in.fundsPlanName,
          fundsYear: this.queryObj_passed_in.fundsYear,
          pageNum: this.queryObj_passed_in.pageNum,
          pageSize: this.queryObj_passed_in.pageSize
        }
        getFundPlanList(_queryObj)
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
          name: 'NewOrUpdateFundPlan',
          query: {
            operateState: '0',
            id: rowData.id, companyId: rowData.companyId, companyName: rowData.companyName, contractId: rowData.contractId, contractNumber: rowData.contractNumber, contractName: rowData.contractName, projectId: rowData.projectId,
            projectName: rowData.projectName, materialName: rowData.materialName, quantities: rowData.quantities, engineeringPrices: rowData.engineeringPrices,
            operator: rowData.operator, createdDate: rowData.createdDate, updatedDate: rowData.updatedDate, accountingObjectId: rowData.accountingObjectId,
            periodVersion: rowData.periodVersion, payStart: rowData.payStart, payEnd: rowData.payEnd, materialsList: rowData.materialsList, status: rowData.status, isEdit: false }
        })
      },
      // 编辑
      editRow(index, rowData) {
        this.$router.push({
          name: 'NewOrUpdateFundPlan',
          query: {
            operateState: '1',
            id: rowData.id, companyId: rowData.companyId, companyName: rowData.companyName, contractId: rowData.contractId, contractNumber: rowData.contractNumber, contractName: rowData.contractName, projectId: rowData.projectId,
            projectName: rowData.projectName, materialName: rowData.materialName, quantities: rowData.quantities, engineeringPrices: rowData.engineeringPrices,
            operator: rowData.operator, createdDate: rowData.createdDate, updatedDate: rowData.updatedDate, accountingObjectId: rowData.accountingObjectId,
            periodVersion: rowData.periodVersion, payStart: rowData.payStart, payEnd: rowData.payEnd, materialsList: rowData.materialsList, status: rowData.status, isEdit: true }
        })
      },
      // 升版
      updateRow(index, rowData) {
        this.$router.push({
          name: 'NewOrUpdateFundPlan',
          query: {
            operateState: '3',
            id: rowData.id, companyId: rowData.companyId, companyName: rowData.companyName, contractId: rowData.contractId, contractNumber: rowData.contractNumber, contractName: rowData.contractName, projectId: rowData.projectId,
            projectName: rowData.projectName, materialName: rowData.materialName, quantities: rowData.quantities, engineeringPrices: rowData.engineeringPrices,
            operator: rowData.operator, createdDate: rowData.createdDate, updatedDate: rowData.updatedDate, accountingObjectId: rowData.accountingObjectId,
            periodVersion: rowData.periodVersion, payStart: rowData.payStart, payEnd: rowData.payEnd, materialsList: rowData.materialsList, isEdit: true, isUpdate: true }
        })
      },
      deleteRow(index, rowData) {
        this.$confirm('确认删除该记录', {
          confirmButtonText: this.$l('btn_confirm'),
          cancelButtonText: this.$l('btn_cancel'),
          type: 'warning'
        }).then(() => {
          let query = {
            'id': rowData.id
          }
          deleteFundPlan(rowData)
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
      changRowFlow(index, rowData, flowStatus) {
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
      handleSizeChange(val) {
        this.queryObj.pageSize = val
        this.getList()
      },
      handleCurrentChange(val) {
        this.queryObj.pageNum = val
        this.getList()
      }
    },
    mounted: function() {
    }
  }

</script>
<style lang='scss' scoped>
</style>
