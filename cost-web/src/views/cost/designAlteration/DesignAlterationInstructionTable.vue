<!-- IneffectiveCostTable -->
<template>
  <div ref="designAlterationInstructionTable">
    <el-table
      :data="tableData"
      stripe
      border
      tooltip-effect="dark"
      size="small"
      :height="tHeight"
      style="width: 100%"
    >
      <!-- 序号 -->
      <el-table-column
        type="index"
        :index="this.$getTableIndex(this.queryObj)"
        :label="this.$l('lbl_no')"
        width="80"
      ></el-table-column>

      <!-- 变更指令单 -->
      <el-table-column prop="code" show-overflow-tooltip width="250" :label="'变更指令单'">
        <template slot-scope="scope">{{ scope.row.code}}</template>
      </el-table-column>
      <!-- 设计变更名称 -->
      <el-table-column
        prop="alterationVisaName"
        :label="'设计变更名称'"
        show-overflow-tooltip
        width="200"
      >
        <template slot-scope="scope">{{ scope.row.alterationVisaName }}</template>
      </el-table-column>
      <!-- 预估金额 -->
      <el-table-column prop="estimatedAmt" :label="'预估金额(元)'">
        <template slot-scope="scope">{{scope.row.estimatedAmt | NumFormat}}</template>
      </el-table-column>

      <!-- 所属设计变更号 -->
      <el-table-column prop="alterationVisaCode" show-overflow-tooltip :label="'所属设计变更号'">
        <template slot-scope="scope">{{scope.row.alterationVisaCode}}</template>
      </el-table-column>
      <!-- 所属项目 -->
      <el-table-column prop="projectName" show-overflow-tooltip :label="'所属项目'">
        <template slot-scope="scope">{{scope.row.projectName}}</template>
      </el-table-column>

      <!-- 状态 -->
      <el-table-column prop="approveStatus" :label="'状态'">
        <template slot-scope="scope">
          <fd-label :code="scope.row.approveStatus" type="cost_designAlteration_status"></fd-label>
        </template>
      </el-table-column>

      <!-- 当前流程节点 -->
      <el-table-column prop="processNode" :label="'当前流程节点'">
        <template slot-scope="scope">
          <fd-label :code="scope.row.processNode" type="cost_designAlteration_step"></fd-label>
        </template>
      </el-table-column>
      <!-- 操作 -->
      <el-table-column :label="this.$l('lbl_operation')" width="150">
        <template slot-scope="scope">
          <!-- 造价重新确认 -->
          <el-button
            size="mini"
            type="text"
            v-if="scope.row.approveStatus === '7' && scope.row.processNode === '4' && scope.row.isRetryCostConfirm === '0' && $checkPersmissionByCode('cost:designAlterationMgmt:costConfirm')"
            @click="costReConfirmRow(scope.$index, scope.row)"
          >重新确认</el-button>

          <!-- 造价确认 -->
          <el-button
            size="mini"
            type="text"
            v-if="scope.row.approveStatus === '7' && scope.row.processNode === '3' && $checkPersmissionByCode('cost:designAlterationMgmt:costConfirm')"
            @click="costConfirmRow(scope.$index, scope.row)"
          >造价确认</el-button>
          <!-- 回传 -->
          <el-button
            size="mini"
            type="text"
            v-if="scope.row.approveStatus === '2' && scope.row.processNode === '2' && $checkPersmissionByCode('cost:designAlterationMgmt:update')"
            @click="backUploadRow(scope.$index, scope.row)"
          >回传</el-button>

          <!-- 完工确认 -->
          <el-button
            size="mini"
            type="text"
            v-if="scope.row.approveStatus === '3' && scope.row.processNode === '2' && $checkPersmissionByCode('cost:designAlterationMgmt:completionConfirm')"
            @click="completionConfirmRow(scope.$index, scope.row)"
          >完工确认</el-button>
          <!-- 下发 -->
          <el-button
            size="mini"
            type="text"
            v-if="scope.row.approveStatus === '1' && scope.row.processNode === '2' && $checkPersmissionByCode('cost:designAlterationMgmt:update')"
            @click="distributeRow(scope.$index, scope.row)"
          >下发</el-button>

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
            v-if="(scope.row.approveStatus === '5' || scope.row.approveStatus === '8') && $checkPersmissionByCode('cost:designAlterationMgmt:completionConfirm')"
            icon="el-icon-edit"
            :title="$l('btn_edit')"
            @click="editRow(scope.$index, scope.row)"
          ></el-button>
          <!-- 编辑 -->
          <!--<el-button size="mini"-->
          <!--type="text"-->
          <!--@click="approveRecord(scope.$index, scope.row)">通过</el-button>-->
          <!--<el-button size="mini"-->
          <!--type="text"-->
          <!--@click="rejectRecord(scope.$index, scope.row)">驳回</el-button>-->
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
import { getDesignAlterationInstructionList, updateInstructionStatus } from '@/api/cost/designAlteration'
import { NumFormat, Version } from '@/filters/cost/'
import { tableHeight } from '@/utils/common/index'
export default {
  props: {
    queryObj_passed_in: {
      type: Object
    },
    projectModel: {
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
      LoadingUtil.showLoading()
      // 转换参数
      let _queryObj = {
        companyId: this.projectModel.companyId,
        projectId: this.projectModel.projectId,
        contractCode: this.queryObj.contractCode,
        designAlterationCode: this.queryObj.code,
        designAlterationName: this.queryObj.name,
        code: this.queryObj.instructionCode,
        pageNum: this.queryObj.pageNum,
        pageSize: this.queryObj.pageSize,
        alterationType: this.queryObj.alterationType
      }
      getDesignAlterationInstructionList(_queryObj)
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
    // 下发
    distributeRow (index, rowData) {
      this.$router.push({
        name: 'InstructionDistribute',
        query: { id: rowData.id, contractId: rowData.contractId }
      })
    },
    // 回传
    backUploadRow (index, rowData) {
      this.$router.push({
        name: 'InstructionDistribute',
        query: { id: rowData.id, contractId: rowData.contractId }
      })
    },
    // 完工确认
    completionConfirmRow (index, rowData) {
      this.$router.push({
        name: 'InstructionCompletionConfirm',
        query: { id: rowData.id, contractId: rowData.contractId }
      })
    },
    // 造价重新确认
    costReConfirmRow (index, rowData) {
      this.$router.push({
        name: 'InstructionCostConfirm',
        query: { id: rowData.id, isView: false, isRetry: true, contractId: rowData.contractId }
      })
    },
    // 造价确认
    costConfirmRow (index, rowData) {
      this.$router.push({
        name: 'InstructionCostConfirm',
        query: { id: rowData.id, contractId: rowData.contractId }
      })
    },
    // 查看
    viewRow (index, rowData) {
      let redirectPath = {}
      redirectPath.query = { id: rowData.id, isView: true }
      if (rowData.processNode === '2') {
        redirectPath.name = 'InstructionDistribute'
      }
      if (rowData.processNode === '3') {
        redirectPath.name = 'InstructionCompletionConfirm'
      }
      if (rowData.processNode === '4') {
        redirectPath.name = 'InstructionCostConfirm'
      }
      this.$router.push(redirectPath)
    },
    // 编辑
    editRow (index, rowData) {
      let redirectPath = {}
      redirectPath.query = { id: rowData.id, isView: false, contractId: rowData.contractId }
      if (rowData.processNode === '3') {
        redirectPath.name = 'InstructionCompletionConfirm'
      }
      if (rowData.processNode === '4') {
        redirectPath.name = 'InstructionCostConfirm'
      }
      this.$router.push(redirectPath)
    },
    approveRecord (index, rowData) {
      let param = {}
      param.id = rowData.id
      param.approveStatus = '7'
      updateInstructionStatus(param)
        .then(response => {
          if (response.status !== '404') {
            this.getList()
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    rejectRecord (index, rowData) {
      let param = {}
      param.id = rowData.id
      param.approveStatus = '8'
      updateInstructionStatus(param)
        .then(response => {
          if (response.status !== '404') {
            this.getList()
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    handleSizeChange (val) {
      this.queryObj.pageSize = val
      this.getList()
    },
    handleCurrentChange (val) {
      this.queryObj.pageNum = val
      this.getList()
    }
  },
  computed: {
    tHeight: function () {
      let options = {
        fullHeight: this.$store.getters.fullHeight,
        opened: this.$store.getters.sidebar.opened,
        showForm: this.$store.getters.showForm,
        obj: this,
        otherHeight: 210
      }
      return `${tableHeight(options)}px`
    }
  }
}

</script>
<style lang='scss' scoped>
</style>
