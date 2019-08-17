<template>
  <div ref="applyPaymentContractTable">
    <el-table :data="tableData"
              stripe border
              :height="tHeight"
              size="small"
              style="width: 100%">
      <!-- 序号 -->
      <el-table-column type="index"
                       :index="this.$getTableIndex(this.queryObj)"
                       :label="this.$l('lbl_no')"
                       width="80"></el-table-column>

      <!-- 合同付款申请编号 -->
      <el-table-column label="合同付款申请编号" width="120" prop="code" show-overflow-tooltip></el-table-column>

      <!-- 付款类型 -->
      <el-table-column prop="status"
                       width="100"
                       label="付款类型">
        <template slot-scope="scope">
          <fd-label :code="scope.row.paymentReasonTypeCode"
                    type="cost_payment_type"></fd-label>
        </template>
      </el-table-column>

      <!-- 付款申请金额（元）-->
      <el-table-column label="本次申请金额(元)" width="120">
        <template slot-scope="scope">
          {{scope.row.applyAmt | NumFormat }}
        </template>
      </el-table-column>

      <!-- 合同名称 -->
      <el-table-column label="项目名称" prop="projectName" show-overflow-tooltip></el-table-column>

      <!-- 合同名称 -->
      <el-table-column label="合同名称" prop="contractName" show-overflow-tooltip></el-table-column>

      <!-- 合同编号 -->
      <el-table-column label="合同编号" prop="contractCode" show-overflow-tooltip></el-table-column>

      <!-- 合同金额 -->
      <el-table-column label="合同金额">
        <template slot-scope="scope">
          {{ scope.row.contractAmt | NumFormat }}
        </template>
      </el-table-column>

      <!-- 审批状态 -->
      <el-table-column prop="status"
                       width="100"
                       :label="'审批状态'">
        <template slot-scope="scope">
          <fd-label :code="scope.row.approveStatus"
                    type="cost_flow_status"></fd-label>
        </template>
      </el-table-column>

      <!-- 付款申请日期 -->
      <el-table-column prop="operatorDate"
                       width="100"
                       :label="'提交日期'"
                       :formatter='this.$dateFormat("operatorDate", "yyyy-MM-dd")'></el-table-column>

      <!-- 操作 -->
      <el-table-column :label="this.$l('lbl_operation')"
                       width="120">
        <template slot-scope="scope">
          <!-- 查看 -->
          <el-button size="mini"
                     type="text"
                     icon="el-icon-view"
                     :title="$l('btn_detail')"
                     @click="viewRow(scope.$index, scope.row)"></el-button>
          <el-button size="mini"
                     type="text"
                     icon="el-icon-menu"
                     v-if="(scope.row.isProcedureApproval === '1')"
                     title="财务共享编辑"
                     @click="newIcon(scope.$index, scope.row)"></el-button>

          <!-- 编辑 -->
          <el-button size="mini"
                     type="text"
                     v-if="(scope.row.approveStatus === '0' || scope.row.approveStatus === '3') && $checkPersmissionByCode('cost:applyPaymentContract:create')"
                     icon="el-icon-edit"
                     :title="$l('btn_edit')"
                     @click="editRow(scope.$index, scope.row)"></el-button>

          <!-- 删除 -->
          <el-button size="mini"
                     type="text"
                     v-if="(scope.row.approveStatus === '0' || scope.row.approveStatus === '3') && $checkPersmissionByCode('cost:applyPaymentContract:delete')"
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
  import { applyPaymentList, deleteApplyPaymentContract, updateApplyPaymentStatus } from '@/api/cost/applyPaymentContract'
  import { LoadingUtil } from '@/utils/common/LoadingUtil'
  import { tableHeight } from '@/utils/common/index'
  import { NumFormat } from '@/filters/cost/'
  export default {
    props: {
      queryObj_passed_in: {
        type: Object
      }
    },
    filters: {
      NumFormat
    },
    data() {
      return {
        tableData: [],
        queryObj: this.queryObj_passed_in,
        tableHeight: '0',
        fullHeight: document.documentElement.clientHeight
      }
    },
    mounted() {
      this.getList()
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
      getList() {
        LoadingUtil.showLoading()// 显示loading遮罩层
        applyPaymentList(this.queryObj).then(res => {
          LoadingUtil.hideLoading()// 隐藏loading遮罩层
          this.tableData = res.data.content
          this.queryObj.count = res.data.totalElements
        }).catch(error => {
          console.log(error)
          this.$showError(error.message ? error.message : 'msg_system_error')
        })
      },
      newIcon(index,row){
        this.$router.push({
          name: 'NewOrUpdateApplyPaymentContract',
          query: { id: row.id, isEdit: true, isShow:false }
        })
      },
      editRow(index, row) {
        this.$router.push({
          name: 'NewOrUpdateApplyPaymentContract',
          query: { id: row.id, isEdit: true,isShow:true }
        })
      },
      deleteRow(index, row) {
        this.$confirm('确认删除该记录', {
          confirmButtonText: this.$l('btn_confirm'),
          cancelButtonText: this.$l('btn_cancel'),
          type: 'warning'
        }).then(() => {
          deleteApplyPaymentContract({ id: row.id }).then((res) => {
            if (res.code === '2000') {
              this.$showSuccess(res.message)
              this.$delete(this.tableData, index)
              this.getList()
            }
          }).catch((err) => {
            console.log(err)
          })
        }).catch(() => {})
      },
      handleSizeChange(val) {
        this.queryObj.pageSize = val
        this.getList()
      },
      handleCurrentChange(val) {
        this.queryObj.pageNum = val
        this.getList()
      },
      viewRow(index, row) {
        this.$router.push({
          name: 'NewOrUpdateApplyPaymentContract',
          query: { id: row.id, isEdit: false,isShow:true }
        })
      },
      updateApplyPaymentStatus(id, status) {
        updateApplyPaymentStatus({
          id: id,
          approveStatus: status
        }).then(res => {
          if (res.code === '2000') {
            this.$showSuccess('更新状态成功')
            this.getList()
          }
        }).catch(err => {
          console.log(err)
        })
      }
      /*handleAudit(index, row) {
        this.updateApplyPaymentStatus(row.id, '2')// 已审批
      },
      handleReject(index, row) {
        this.updateApplyPaymentStatus(row.id, '3')// 驳回
      }*/
    }
  }
</script>

<style scoped>

</style>
