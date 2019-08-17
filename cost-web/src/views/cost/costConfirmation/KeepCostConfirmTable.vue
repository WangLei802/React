<!-- IneffectiveCostTable -->
<template>
  <div ref="ineffectiveCostTable">
    <el-table :data="tableData"
              stripe
              border
              tooltip-effect="dark"
              :height="tHeight"
              style="width: 100%"
              size="small">
      <!-- 序号 -->
      <el-table-column type="index"
                       :index="this.$getTableIndex(this.queryObj)"
                       :label="this.$l('lbl_no')"></el-table-column>

      <!-- 单据编号 -->
      <el-table-column prop="receiptsNo"
                       :label="'单据编号'" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.receiptsNo}}
        </template>
      </el-table-column>
       <!-- 成本分期 -->
      <el-table-column prop="accountingObjectName"
                       :label="'成本分期'" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.accountingObjectName}}
        </template>
      </el-table-column>
       <!-- 跟投分配次数 -->
      <el-table-column prop="throwTimes"
                       :label="'跟投分配次数'">
        <template slot-scope="scope" >
          <span v-if="scope.row.throwTimes == 0">第一次</span>
          <span v-else-if="scope.row.throwTimes == 1">第二次</span>
          <span v-else-if="scope.row.throwTimes == 2">第三次</span>
          <span v-else-if="scope.row.throwTimes == 3">第四次</span>
        </template>
      </el-table-column>
      <!-- 发起人 -->
      <el-table-column prop="operator"
                       :label="'经办人'">
        <template slot-scope="scope">
          {{scope.row.operator}}
        </template>
      </el-table-column>
      <!-- 发起部门 -->
      <el-table-column prop="operatorDept"
                       :label="'发起部门'" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.operatorDept}}
        </template>
      </el-table-column>

      <!-- 提交日期 -->
      <el-table-column prop="createdDate"
                       width="150"
                       :label="'提交日期'"
                       :formatter='this.$dateFormat("createdDate","yyyy-MM-dd")'></el-table-column>
      <!-- 审批状态 -->
      <el-table-column prop="status"
                       :label="'审批状态'">
        <template slot-scope="scope">
          <fd-label :code="scope.row.status"
                    type="cost_flow_status"></fd-label>
        </template>
      </el-table-column>
      <!-- 操作 -->
      <el-table-column :label="this.$l('lbl_operation')">
        <template slot-scope="scope">
          <el-row>
          <!-- 查看 -->
          <el-button size="mini"
                     type="text"
                     icon="el-icon-view"
                     :title="$l('btn_detail')"
                     @click="viewRow(scope.$index, scope.row)"></el-button>

          <!-- 编辑 -->
          <el-button size="mini"
                     type="text"
                     v-if="(scope.row.status === '0' || scope.row.status === '3') && $checkPersmissionByCode('cost:confirmThrow:create')"
                     icon="el-icon-edit"
                     :title="$l('btn_edit')"
                     @click="editRow(scope.$index, scope.row)"></el-button>

          <!-- 删除 -->
          <el-button size="mini"
                     type="text"
                     v-if="(scope.row.status === '0' || scope.row.status === '3') && $checkPersmissionByCode('cost:confirmThrow:delete')"
                     icon="el-icon-delete"
                     :title="$l('btn_delete')"
                     @click="deleteRow(scope.$index, scope.row)"></el-button>
          <!--<el-col :span="12"-->
                  <!--style="text-align:left;width:50%">-->
            <!--&lt;!&ndash; 审批 &ndash;&gt;-->
            <!--<el-button size="small"-->
                       <!--:title="'审批通过'"-->
                       <!--style="font-size:14px;"-->
                       <!--type="text"-->
                       <!--@click="changRowFlow(scope.$index, scope.row,'2')">通过</el-button>-->
            <!--<el-button size="small"-->
                       <!--:title="'审批驳回'"-->
                       <!--style="font-size:14px;"-->
                       <!--type="text"-->
                       <!--@click="changRowFlow(scope.$index, scope.row,'3')">驳回</el-button>-->
          <!--</el-col>-->
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
  import { getKeepCostConfirmList, deleteKeepCostConfirm, setFlowStatus } from '@/api/cost/keepCostConfirm'
  import { NumFormat, Version } from '@/filters/cost/'
  import { deepCopy } from '@/utils/cost/objectHelper'
  import { tableHeight } from '@/utils/common/index'
  export default {
    props: {
      queryObj_passed_in: {
        type: Object
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
        // alert(JSON.stringify(this.queryObj));
        let _queryObj = {
          receiptsNo: this.queryObj_passed_in.receiptsNo,
          receiptsName: this.queryObj_passed_in.receiptsName,
          operator: this.queryObj_passed_in.operator,
          operateDate: this.queryObj_passed_in.operateDate,
          status: this.queryObj_passed_in.status,
          pageNum: this.queryObj_passed_in.pageNum,
          pageSize: this.queryObj_passed_in.pageSize
        }

        getKeepCostConfirmList(_queryObj)
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
      viewRow(index, rowData) {
        let returnRateAt = rowData.cashDepositReturnLower / rowData.cashDepositTotal
        this.$router.push({
          name: 'NewOrUpdateCostConfirm',
          query: { id: rowData.id, isEdit: false }
        })
      },
      // 编辑
      editRow(index, rowData) {
        let returnRateAt = rowData.cashDepositReturnLower / rowData.cashDepositTotal
        this.$router.push({
          name: 'NewOrUpdateCostConfirm',
          query: { id: rowData.id, isEdit: true }
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
          deleteKeepCostConfirm(rowData)
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
