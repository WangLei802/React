<!-- StandaredSubjectList.vue -->
<template>
  <div ref="contractPlatformAccountTable">
    <el-table :data="tableData"
              stripe border
              tooltip-effect="dark"
              style="width: 100%"
              size="small"
              :height="tHeight">
      <el-table-column
                      prop="pageIndex"
                      :label="$l('lbl_no')"
                       width="50"
                        fixed>
      </el-table-column>
      <el-table-column prop="CONTRACTTYPE"
                       label="合同类型"
                       show-overflow-tooltip
                       width="100" fixed>
        <template slot-scope="scope">
          <fd-label :code="scope.row.CONTRACTTYPE"
                    type="cost_contract_type" v-if="scope.row.NOCONTRACT === '0'"></fd-label>
          <span v-if="scope.row.NOCONTRACT === '1'">{{scope.row.CONTRACTTYPE}}</span>
          <span v-if="scope.row.NOCONTRACT  === '' || scope.row.NOCONTRACT  == null ">合计</span>
        </template>

      </el-table-column>


      <el-table-column prop="CONTRACTCODE"
                       show-overflow-tooltip
                       label="合同编号"
                       width="200" fixed>

      </el-table-column>
      <el-table-column fixed
                       prop="CONTRACTNAME"
                       label="合同名称"
                       show-overflow-tooltip
                       width="200"
                       fixed

      >
      </el-table-column>

      <el-table-column label="合同及无合同费用" >




        <el-table-column prop="PARTYBNAME"
                         label="乙方单位"
                         show-overflow-tooltip
                         width="150">

        </el-table-column>


        <el-table-column width="150"
                         prop="DATEOFCONTRACT"
                         :formatter='this.$dateFormat("DATEOFCONTRACT","yyyy-MM-dd")'
                         label="签约日期">
        </el-table-column>

        <el-table-column prop="BIDDINGWAY"
                         label="招标方式"
                         width="100">
          <template slot-scope="scope">
            <fd-label :code="scope.row.BIDDINGWAY"
                      type="bidding_way"></fd-label>
          </template>
        </el-table-column>


        <el-table-column prop="COSTNATURE"
                         label="造价性质"
                         width="100">
          <template slot-scope="scope">
            <fd-label :code="scope.row.COSTNATURE"
                      type="cost_nature"></fd-label>
          </template>
        </el-table-column>

        <el-table-column width="150"
                         prop="CONTRACTAMOUNTINCLUDETAX"
                         label="合同签约金额(元)(A)"
                         show-overflow-tooltip
        >
          <template slot-scope="scope">
            {{ scope.row.CONTRACTAMOUNTINCLUDETAX|NumFormat}}
          </template>
        </el-table-column>

        <el-table-column width="150"
                         prop="SUMESTIMATEDAMT"
                         label="变更签证申请(元)(B)"
                         show-overflow-tooltip
        >
          <template slot-scope="scope">
            {{ scope.row.SUMESTIMATEDAMT|NumFormat}}
          </template>
        </el-table-column>

        <el-table-column width="150"
                         prop="SUMCOSTCONFIRMAMT"
                         label="变更签证确认(元)©"
                         show-overflow-tooltip
        >
          <template slot-scope="scope">
            {{ scope.row.SUMCOSTCONFIRMAMT|NumFormat}}
          </template>
        </el-table-column>


        <el-table-column width="150"
                         prop="SUMCONTRACTALTERATIONAMT"
                         label="合同变更金额(元)(D)"
                         show-overflow-tooltip
        >
          <template slot-scope="scope">
            {{ scope.row.SUMCONTRACTALTERATIONAMT|NumFormat}}
          </template>
        </el-table-column>


        <el-table-column width="150"
                         prop="RESERVEDCHANGEAMOUNT"
                         label="预留变更金额(元)"
                         show-overflow-tooltip
        >
          <template slot-scope="scope">
            {{ scope.row.RESERVEDCHANGEAMOUNT|NumFormat}}
          </template>
        </el-table-column>

      </el-table-column>


      <el-table-column width="150"
                       prop="OCCURREDAMOUNT"
                       label="已发生金额(元)(F)"
                       show-overflow-tooltip
      >
        <template slot-scope="scope">
          {{ scope.row.OCCURREDAMOUNT|NumFormat}}
        </template>
      </el-table-column>

      <el-table-column width="180"
                       prop="ESTIMATEPAYMENTAMOUNT"
                       label="预计结算/结算金额(元)(G)"
                       show-overflow-tooltip
      >
        <template slot-scope="scope">
          {{ scope.row.ESTIMATEPAYMENTAMOUNT|NumFormat}}
        </template>
      </el-table-column>


      <el-table-column width="180"
                       prop="ACTUALOCCURREDAMOUNT"
                       label="合同实际发生金额(元)(H)"
                       show-overflow-tooltip
      >
        <template slot-scope="scope">
          {{ scope.row.ACTUALOCCURREDAMOUNT|NumFormat}}
        </template>
      </el-table-column>
      <el-table-column label="累计已批工程款金额">
        <el-table-column width="180"
                         prop="SUMPAYMENTAPPLYAMT"
                         label="累计已批金额(元)(I)"
                         show-overflow-tooltip
        >
          <template slot-scope="scope">
            {{ scope.row.SUMPAYMENTAPPLYAMT|NumFormat}}
          </template>
        </el-table-column>



        <el-table-column width="180"
                         prop="SUMPAYMENTAPPLYAMTRATE"
                         label="累计已批比率%(J=I/A)"
                         show-overflow-tooltip
        >
          <template slot-scope="scope">
            {{ scope.row.SUMPAYMENTAPPLYAMTRATE|NumFormat}}
          </template>
        </el-table-column>
      </el-table-column>

      <el-table-column label="累计已付工程款金额">
        <el-table-column width="180"
                         prop="SUMACTUALPAYMENTAMT"
                         label="累计付款金额(元)(K)"
                         show-overflow-tooltip
        >
          <template slot-scope="scope">
            {{ scope.row.SUMACTUALPAYMENTAMT|NumFormat}}
          </template>
        </el-table-column>
        <el-table-column width="180"
                         prop="SUMACTUALPAYMENTAMTRATE"
                         label="累计付款比率%(L=K/A)"
                         show-overflow-tooltip
        >
          <template slot-scope="scope">
            {{ scope.row.SUMACTUALPAYMENTAMTRATE|NumFormat}}
          </template>
        </el-table-column>
      </el-table-column>


      <el-table-column prop="CONTRACTSTATUS"
                       label="目前状态"
                       width="100">
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
import { contractPlatformAccountTable, contractPlatformAccountTableStatisticalData } from '@/api/cost/signContractAPI'
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
      contractPlatformAccountTableStatisticalData(_queryObj)
        .then(response1 => {

          if (response1.data == null && response1.data === '') {
            return
          }
          this.statisticalData = response1.data
          contractPlatformAccountTable(_queryObj)
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

      // contractPlatformAccountTable(_queryObj)
      //   .then(response => {
      //     LoadingUtil.hideLoading()
      //     this.tableData = response.data.content ? response.data.content : []
      //     this.queryObj.count = response.data.totalElements
      //   })
      //   .catch(error => {
      //     console.log(error)
      //     this.$showError(error.message ? error.message : 'msg_system_error')
      //   })

      // contractPlatformAccountTableStatisticalData(_queryObj)
      //   .then(response1 => {
      //     LoadingUtil.hideLoading()
      //     if (response1.data.length === 0) {
      //       return
      //     }
      //     this.statisticalData = response1.data
      //   })
      //   .catch(error => {
      //     console.log(error)
      //     this.$showError(error.message ? error.message : 'msg_system_error')
      //   })
    }
  }
}
</script>
<style scoped>

</style>
