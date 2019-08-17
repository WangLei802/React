<!-- StandaredSubjectList.vue -->
<template>
  <div ref="paymentContractPlatformAccountTable">
    <el-table :data="tableData"
              stripe border
              tooltip-effect="dark"
              style="width: 100%"
              size="small"
              :height="tHeight">
      <el-table-column :label="$l('lbl_no')"
                       width="50"
                       prop="pageIndex">
      </el-table-column>
      <el-table-column prop="PROJECT_NAME"
                       label="项目"
                       show-overflow-tooltip
                       width="100" >
        <template slot-scope="scope">
          <span v-if="scope.row.PROJECT_NAME ==='' || scope.row.PROJECT_NAME == null">合计</span>
          <span v-else>{{ scope.row.PROJECT_NAME}}</span>
        </template>

      </el-table-column>
      <el-table-column prop="CONTRACT_CODE"
                       show-overflow-tooltip
                       label="合同编号"
                       width="200">

      </el-table-column>
      <el-table-column prop="CONTRACT_NAME"
                       label="合同名称"
                       show-overflow-tooltip
                       width="200">

      </el-table-column>


      <el-table-column width="150"
                       prop="SUMESTIMATEPAYMENTAMT"
                       label="预计结算额(元)"
                       show-overflow-tooltip
      >
        <template slot-scope="scope">
          {{ scope.row.SUMESTIMATEPAYMENTAMT|NumFormat}}
        </template>
      </el-table-column>

      <el-table-column width="150"
                       prop="SUMCOMPLETEAMT"
                       label="累计完工金额(元)(A)"
                       show-overflow-tooltip
      >
        <template slot-scope="scope">
          {{ scope.row.SUMCOMPLETEAMT|NumFormat}}
        </template>
      </el-table-column>

      <el-table-column width="150"
                       prop="SUMPAYMENTAPPLYAMT"
                       label="已批金额(元)(B)"
                       show-overflow-tooltip
      >
        <template slot-scope="scope">
          {{ scope.row.SUMPAYMENTAPPLYAMT|NumFormat}}
        </template>
      </el-table-column>


      <el-table-column width="150"
                       prop="SUMPAIDAMT"
                       label="已付金额(元)(C)"
                       show-overflow-tooltip
      >
        <template slot-scope="scope">
          {{ scope.row.SUMPAIDAMT|NumFormat}}
        </template>
      </el-table-column>


      <el-table-column width="150"
                       prop="SUMUNPAIDAMT"
                       label="未付金额(元)(D=A-C)"
                       show-overflow-tooltip
      >
        <template slot-scope="scope">
          {{ scope.row.SUMUNPAIDAMT|NumFormat}}
        </template>
      </el-table-column>


      <el-table-column width="200"
                       prop="SUMAUDITUNPAIDAMT"
                       label="已批未付金额(元)(E=B-C)"
                       show-overflow-tooltip
      >
        <template slot-scope="scope">
          {{ scope.row.SUMAUDITUNPAIDAMT|NumFormat}}
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
import { paymentContractPlatformAccountTable, paymentContractPlatformAccountTableStatisticalData } from '@/api/cost/applyPaymentContract'
import ProjectSelector from '@/components/cost/ProjectSelector/'
import { NumFormat, Version } from '@/filters/cost/'
import { tableHeight } from '@/utils/common/index'
export default {

  props: {
    queryObj_passed_in: {
      type: Object
    }
  },
  filters: {
    NumFormat, Version
  },
  components: {
    ProjectSelector
  },
  data() {
    return {
      tableData: [],
      queryObj: this.queryObj_passed_in,
      tableHeight: '0',
      fullHeight: document.documentElement.clientHeight,
      statisticalData: {}
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
  mounted() {
    this.search()
  },
  watch: {
  },
  methods: {

    initTableData(response) {
      this.tableData = []
      this.tableData.push(this.statisticalData)
      response.data.content.map((item, index) => {
        item.pageIndex = this.queryObj.pageSize * (this.queryObj.pageNum - 1) + index + 1
        this.tableData.push(item)
      })
      this.queryObj.count = response.data.totalElements
    },
    handleSizeChange(val) {
      this.queryObj.pageSize = val
      this.search()
    },
    handleCurrentChange(val) {
      this.queryObj.pageNum = val
      this.search()
    },
    search() {
      LoadingUtil.showLoading()
      // 转换参数

      let _queryObj = {
        companyId: this.queryObj.companyId,
        projectId: this.queryObj.projectId,
        // contractType: this.queryModel.contractType,
        // contractName: this.queryModel.contractName,
        // contractStatus: this.queryModel.contractStatus,
        pageNum: this.queryObj.pageNum,
        pageSize: this.queryObj.pageSize
      }

      paymentContractPlatformAccountTableStatisticalData(_queryObj)
        .then(response1 => {

          if (response1.data == null && response1.data === '') {
            return
          }
          this.statisticalData = response1.data
          paymentContractPlatformAccountTable(_queryObj)
            .then(response2 => {
              this.initTableData(response2)
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
    }
  }
}
</script>
<style scoped>

</style>
