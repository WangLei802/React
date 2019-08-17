<!-- actualPaymentTable -->
<template>
  <div ref="actualPaymentTable">
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

      <!-- 付款申请编号 -->
      <el-table-column prop="contractCode" show-overflow-tooltip width="250" :label="'付款申请编号'">
        <template slot-scope="scope">{{ scope.row.code}}</template>
      </el-table-column>

      <!-- 付款申请名称 -->
      <el-table-column prop="name" show-overflow-tooltip width="250" :label="'付款申请名称'">
        <template slot-scope="scope">{{ scope.row.name}}</template>
      </el-table-column>

      <!-- 付款申请日期 -->
      <el-table-column
        prop="operatorDate"
        width="200"
        :label="'付款申请日期'"
        :formatter="this.$dateFormat("operatorDate","yyyy-MM-dd")"
      ></el-table-column>

      <!-- 付款申请金额(元)(元) -->
      <el-table-column prop="applyAmt" :label="'付款申请金额(元)'">
        <template slot-scope="scope">{{scope.row.applyAmt | NumFormat}}</template>
      </el-table-column>

      <el-table-column prop="totalActualPaymentAmt" :label="'实付金额(元)'">
        <template slot-scope="scope">{{scope.row.totalActualPaymentAmt | NumFormat}}</template>
      </el-table-column>

      <!-- 合同编号 -->
      <el-table-column prop="contractCode" show-overflow-tooltip :label="'合同编号'" width="200">
        <template slot-scope="scope">{{ scope.row.contractCode}}</template>
      </el-table-column>

      <!-- 合同名称 -->
      <el-table-column prop="contractName" show-overflow-tooltip :label="'合同名称'" width="200">
        <template slot-scope="scope">{{ scope.row.contractName}}</template>
      </el-table-column>

      <!-- 合同金额(元) -->
      <el-table-column prop="contractAmt" :label="'合同金额(元)'">
        <template slot-scope="scope">{{scope.row.contractAmt | NumFormat}}</template>
      </el-table-column>

      <!-- 操作 -->
      <el-table-column :label="this.$l('lbl_operation')" width="150">
        <template slot-scope="scope">
          <!-- 查看 -->
          <el-button
            size="mini"
            type="text"
            icon="el-icon-view"
            :title="$l('btn_detail')"
            @click="viewRow(scope.$index, scope.row)"
          ></el-button>
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
import { getActualPaymentList } from '@/api/cost/payment'
import { NumFormat, Version } from '@/filters/cost/'
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
      debugger
      LoadingUtil.showLoading()
      // 转换参数
      let _queryObj = {
        code: this.queryObj.code,
        operatorDate: this.queryObj.operatorDate,
        contractName: this.queryObj.contractName,
        pageNum: this.queryObj.pageNum,
        pageSize: this.queryObj.pageSize,
        companyId: this.queryObj.companyId,
        projectId: this.queryObj.projectId
      }

      getActualPaymentList(_queryObj)
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
    viewRow (index, rowData) {
      this.$router.push({
        name: 'NewOrUpdateActualApplyPayment',
        query: { id: rowData.id }
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
<style lang='scss' scoped>
</style>
