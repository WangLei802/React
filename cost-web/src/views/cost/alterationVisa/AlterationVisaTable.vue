<!-- IneffectiveCostTable -->
<template>
  <div ref="alterationVisaTable">
    <el-table
      :data="tableData"
      size="small"
      :height="tHeight"
      stripe
      border
      tooltip-effect="dark"
      style="width: 100%"
    >
      <!-- 序号 -->
      <el-table-column prop="pageIndex" :label="this.$l('lbl_no')" width="80"></el-table-column>

      <!-- 变更签证类型 -->
      <el-table-column prop="code" :label="'变更签证类型'" show-overflow-tooltip>
        <template
          slot-scope="scope"
        >{{ scope.row.type === '1'? '设计变更' : (scope.row.type === '2' ? '现场签证' : scope.row.type)}}</template>
      </el-table-column>
      <!-- 发起原因 -->
      <el-table-column prop="name" :label="'发起原因'" show-overflow-tooltip>
        <template slot-scope="scope">
          <fd-label :code="scope.row.reason" type="cost_reasonType_code"></fd-label>
        </template>
      </el-table-column>
      <!-- 变更申请单编码 -->
      <el-table-column prop="estimatedAmt" width="200" :label="'变更申请单编码'">
        <template slot-scope="scope">{{scope.row.alterationCode }}</template>
      </el-table-column>
      <!-- 变更指令单编码 -->
      <el-table-column prop="projectName" show-overflow-tooltip width="200" :label="'变更指令单编码'">
        <template slot-scope="scope">{{scope.row.instructionCode}}</template>
      </el-table-column>

      <!-- 指令单单据名称 -->
      <el-table-column prop="projectName" show-overflow-tooltip :label="'指令单单据名称'">
        <template slot-scope="scope">{{scope.row.alterationVisaName}}</template>
      </el-table-column>

      <!-- 变更内容 -->
      <el-table-column prop="projectName" show-overflow-tooltip :label="'变更内容'">
        <template slot-scope="scope">{{scope.row.alterationContent}}</template>
      </el-table-column>

      <!-- 预估金额(元) -->
      <el-table-column prop="projectName" show-overflow-tooltip :label="'预估金额(元)'">
        <template slot-scope="scope">{{scope.row.estimatedAmt | NumFormat}}</template>
      </el-table-column>

      <!-- 施工单位报审金额(元) -->
      <el-table-column prop="projectName" show-overflow-tooltip :label="'施工单位报审金额(元)'">
        <template slot-scope="scope">{{scope.row.constructionUnitReportAmt | NumFormat}}</template>
      </el-table-column>

      <!-- 最终审定金额(元) -->
      <el-table-column prop="projectName" show-overflow-tooltip :label="'最终审定金额(元)'">
        <template slot-scope="scope">{{scope.row.finalAmt | NumFormat}}</template>
      </el-table-column>

      <!-- 是否有无效成本 -->
      <el-table-column prop="projectName" show-overflow-tooltip :label="'是否有无效成本'">
        <template slot-scope="scope">
          <fd-label :code="scope.row.isHasIneffective" type="cost_ineffective_exist"></fd-label>
        </template>
      </el-table-column>

      <!-- 无效成本金额(元) -->
      <el-table-column prop="projectName" show-overflow-tooltip :label="'无效成本金额(元)'">
        <template slot-scope="scope">{{scope.row.ineffectAmt | NumFormat}}</template>
      </el-table-column>

      <!-- 当前状态 -->
      <el-table-column prop="projectName" show-overflow-tooltip width="150" :label="'当前状态'">
        <template slot-scope="scope">{{scope.row.approveStatus}}</template>
      </el-table-column>

      <!-- 接收日期 -->
      <el-table-column prop="projectName" show-overflow-tooltip :label="'接收日期'">
        <template slot-scope="scope">{{scope.row.createdDate}}</template>
      </el-table-column>

      <!-- 处理日期 -->
      <el-table-column prop="projectName" show-overflow-tooltip :label="'处理日期'">
        <template slot-scope="scope">{{scope.row.updatedDate}}</template>
      </el-table-column>

      <!-- 经办人 -->
      <el-table-column prop="projectName" show-overflow-tooltip :label="'经办人'">
        <template slot-scope="scope">{{scope.row.updatedBy}}</template>
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
import { getDesignAlterationTable, getDesignAlterationTableTotal } from '@/api/cost/designAlteration'
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
      fullHeight: document.documentElement.clientHeight,
      totalEstimatedAmt: '',
      totalReportAmt: '',
      totalCostConfirmAmt: '',
      totalIneffectiveAmt: ''
    }
  },
  methods: {
    initTableData (response) {
      debugger
      this.tableData = []
      let rowData = {}
      rowData.estimatedAmt = this.totalEstimatedAmt
      rowData.constructionUnitReportAmt = this.totalReportAmt
      rowData.finalAmt = this.totalCostConfirmAmt
      rowData.ineffectAmt = this.totalIneffectiveAmt
      rowData.type = '合计'
      this.tableData.push(rowData)
      // this.tableData = this.tableData.concat(response.data.content)
      response.data.content.map((item, index) => {
        item.pageIndex = this.queryObj.pageSize * (this.queryObj.pageNum - 1) + index + 1
        this.tableData.push(item)
      })
    },
    getList () {
      LoadingUtil.showLoading()
      // 转换参数

      let _queryObj = {
        companyId: this.projectModel.companyId,
        projectId: this.projectModel.projectId,
        contractName: this.queryObj.contractName,
        isInvalid: this.queryObj.isInvalid,
        pageNum: this.queryObj.pageNum,
        pageSize: this.queryObj.pageSize
      }

      getDesignAlterationTable(_queryObj)
        .then(response1 => {
          LoadingUtil.showLoading()
          getDesignAlterationTableTotal(_queryObj)
            .then(response2 => {
              this.totalEstimatedAmt = response2.data.totalEstimatedAmt
              this.totalReportAmt = response2.data.totalReportAmt
              this.totalCostConfirmAmt = response2.data.totalCostConfirmAmt
              this.totalIneffectiveAmt = response2.data.totalIneffectiveAmt
              this.initTableData(response1)
              this.queryObj.count = response1.data.totalElements
              LoadingUtil.hideLoading()
            })
            .catch(error => {
              console.log(error)
              this.$showError(error.message ? error.message : 'msg_system_error')
            })
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
    }
  },
  computed: {
    tHeight: function () {
      let options = {
        fullHeight: this.$store.getters.fullHeight,
        opened: this.$store.getters.sidebar.opened,
        showForm: this.$store.getters.showForm,
        obj: this,
        otherHeight: 180
      }
      return `${tableHeight(options)}px`
    }
  }
}

</script>

