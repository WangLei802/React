<!-- IneffectiveCostTable -->
<template>
  <div ref="alterationVisaContractTable">
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
      <el-table-column prop="pageIndex" :label="this.$l('lbl_no')" fixed width="80"></el-table-column>
      <!-- 合同类别 -->
      <el-table-column prop="code" fixed :label="'合同类别'" show-overflow-tooltip>
        <template slot-scope="scope">
          <fd-label
            :code="scope.row.contractType"
            v-if="scope.row.contractType !== '合计'"
            type="cost_contract_type"
          ></fd-label>
          {{scope.row.contractType === '合计'?'合计' : ''}}
        </template>
      </el-table-column>

      <!-- 合同 -->
      <el-table-column prop="contract" :label="'合同'" show-overflow-tooltip>
        <el-table-column prop="contractCode" width="250" :label="'合同编码'" show-overflow-tooltip>
          <template slot-scope="scope">
            <div style="text-align:left" :title="scope.row.contractCode">
              <i
                :class="!scope.row._expanded ? 'fa fa-plus-square-o' : 'fa fa-minus-square-o' "
                :title="!scope.row._expanded ? '展开' : '收起'"
                style="font-size:14px;font-weight:bold;cursor:pointer"
                v-show="scope.row._showExpanded"
                @click="handleExpandClick(scope.row)"
              ></i>
              &nbsp;&nbsp; {{scope.row.contractCode}}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="contractName" :label="'合同名称'" show-overflow-tooltip></el-table-column>
        <el-table-column prop="partyB" :label="'乙方单位'" show-overflow-tooltip></el-table-column>
        <el-table-column
          prop="contractAmountIncludeTax"
          fixed
          :label="'合同签约金额（元）'"
          show-overflow-tooltip
        ></el-table-column>
      </el-table-column>

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
      <el-table-column prop="projectName" show-overflow-tooltip :label="'当前状态'">
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
import { getDesignAlterationTableContractTotal, getDesignAlterationTableByContractCode, getDesignAlterationTableTotal } from '@/api/cost/designAlteration'
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
      console.log(new Date())
      this.tableData = []
      let rowData = {}
      rowData.estimatedAmt = this.totalEstimatedAmt
      rowData.constructionUnitReportAmt = this.totalReportAmt
      rowData.finalAmt = this.totalCostConfirmAmt
      rowData.ineffectAmt = this.totalIneffectiveAmt
      rowData.contractType = '合计'
      rowData._show = true
      this.tableData.push(rowData)
      // this.tableData = this.tableData.concat(response.data.content)
      response.data.content.map((item, index) => {
        item.estimatedAmt = item.totalEstimatedAmt
        item.constructionUnitReportAmt = item.totalReportAmt
        item.finalAmt = item.totalCostConfirmAmt
        item.ineffectAmt = item.totalIneffectiveAmt
        item._expanded = false
        item._show = true
        item.pageIndex = this.queryObj.pageSize * (this.queryObj.pageNum - 1) + index + 1
        item._showExpanded = true
        this.tableData.push(item)
        if (item.children) {
          item.children.map((item1, index) => {
            // item1._show = false
            // item1.contractCode = item.contractCode + '_' + (index + 1)
            // this.tableData.push(item1)
          })
        }
      })
      console.log(new Date())
    },
    getList () {
      // LoadingUtil.showLoading()
      // 转换参数

      let _queryObj = {
        companyId: this.projectModel.companyId,
        projectId: this.projectModel.projectId,
        contractName: this.queryObj.contractName,
        isInvalid: this.queryObj.isInvalid,
        pageNum: this.queryObj.pageNum,
        pageSize: this.queryObj.pageSize
      }

      getDesignAlterationTableTotal(_queryObj)
        .then(response1 => {
          LoadingUtil.showLoading()
          getDesignAlterationTableContractTotal(_queryObj)
            .then(response2 => {
              this.totalEstimatedAmt = response1.data.totalEstimatedAmt
              this.totalReportAmt = response1.data.totalReportAmt
              this.totalCostConfirmAmt = response1.data.totalCostConfirmAmt
              this.totalIneffectiveAmt = response1.data.totalIneffectiveAmt
              this.initTableData(response2)
              this.queryObj.count = response2.data.totalElements
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
    handleExpandClick (rowData) {
      let realIndex = this.getRealIndex(rowData.contractCode)
      if (!rowData._expanded) {
        this.queryObj.contractCode = rowData.contractCode
        getDesignAlterationTableByContractCode(this.queryObj)
          .then(response => {
            response.data.map((item, index) => {
              item.contractCode = item.contractCode + '_' + (index + 1)
              this.tableData.splice((realIndex + 1) + index, 0, item)
            })
            this.tableData[realIndex].childCount = response.data.length
            rowData._expanded = !rowData._expanded
          })
          .catch(error => {
            console.log(error)
            this.$showError(error.message ? error.message : 'msg_system_error')
          })
      } else {
        debugger
        this.tableData.splice(realIndex + 1, this.tableData[realIndex].childCount)
        rowData._expanded = !rowData._expanded
      }
    },
    getRealIndex (code) {
      debugger
      let realIndex
      for (let i = 0; i < this.tableData.length; i++) {
        if (code === this.tableData[i].contractCode) {
          realIndex = i
          break
        }
      }
      return realIndex
    },
    showRow: function (row) {
      // 行隐藏
      const show = row.row._show
      return show ? 'animation:treeTableShow 1s;-webkit-animation:treeTableShow 1s;' : 'display:none;'
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

