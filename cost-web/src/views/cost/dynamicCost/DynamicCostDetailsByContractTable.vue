<!-- DynamicCostTable -->
<template>
  <div ref="DynamicCostTable">
    <el-table :data="tableData"
              stripe
              border
              :row-style="showRow"
              tooltip-effect="dark"
              :height="tHeight"
              style="width: 100%"
              size="small">

      <el-table-column prop="name"
                       width="150"
                       :fixed="tableData.length>0"
                       show-overflow-tooltip
                       :label="'合约规划'">
        <template slot-scope="scope">
          <div :style="{'float':'left','text-align':'left','padding-left':scope.row.level*5+'px'}">
            <i :class="!scope.row._expanded ? 'fa fa-plus-square-o' : 'fa fa-minus-square-o' "
               class="subjectCodeExpand"
               v-if="!scope.row._isLeaf"
               @click="handleExpandClick(scope.row)"></i>
            {{ scope.row.name}}
          </div>
        </template>
      </el-table-column>

      <el-table-column prop="cpTotalAmount"
                       width="150"
                       :label="'合约规划总额(元)'">
        <template slot-scope="scope">
          {{ scope.row.dynaCostReportDetailContractPlan['cpTotalAmount'] |NumFormat}}
        </template>
      </el-table-column>

      <el-table-column prop="dynamicCost"
                       :label="'动态成本金额(元)(A=B+C+H)'"
                       width="190">
        <template slot-scope="scope">
          {{ scope.row.dynaCostReportDetailContractPlan['dynamicCost'] |NumFormat}}
        </template>
      </el-table-column>

      <el-table-column prop="amountPendingOccurence"
                       :label="'待发生金额(元)(B)'"
                       width="150">
        <template slot-scope="scope">
          {{ scope.row.dynaCostReportDetailContractPlan['amountPendingOccurence'] |NumFormat}}
        </template>
      </el-table-column>

      <el-table-column prop="cpAmountOccurence"
                       width="180"
                       :label="'已发生金额(元)(C=D+E+F+G)'">
        <template slot-scope="scope">
          {{ scope.row.dynaCostReportDetailContractPlan['cpAmountOccurence'] |NumFormat}}
        </template>
      </el-table-column>

      <el-table-column prop="contractTotalAmount"
                       width="150"
                       :label="'合同总额(元)(D)'">
        <template slot-scope="scope">{{scope.row.dynaCostReportDetailContractPlan['contractTotalAmount'] | NumFormat}}</template>
      </el-table-column>
      <el-table-column prop="changeVisaTotalAmount"
                       width="150"
                       :label="'变更签证总额(元)(E)'">
        <template slot-scope="scope">{{scope.row.dynaCostReportDetailContractPlan['changeVisaTotalAmount'] | NumFormat}}</template>
      </el-table-column>
      <el-table-column prop="nonContractTotalAmount"
                       width="150"
                       :label="'无合同费用总额(元)(F)'">
        <template slot-scope="scope">{{scope.row.dynaCostReportDetailContractPlan['nonContractTotalAmount'] | NumFormat}}</template>
      </el-table-column>
      <el-table-column prop="handInvalibleAmount"
                       width="180"
                       :label="'手工录入无效成本总额(元)(G)'">
        <template slot-scope="scope">{{scope.row.handInvalibleAmount | NumFormat}}</template>
      </el-table-column>
      <el-table-column prop="amountPendingApprove"
                       width="150"
                       :label="'在途金额(元)(H)'">
        <template slot-scope="scope">{{scope.row.dynaCostReportDetailContractPlan['amountPendingApprove'] | NumFormat}}</template>
      </el-table-column>
      <el-table-column prop="amountReleased"
                       width="150"
                       :label="'已释放金额(元)(I)'">
        <template slot-scope="scope">{{scope.row.dynaCostReportDetailContractPlan['amountReleased'] | NumFormat}}</template>
      </el-table-column>
      <el-table-column prop="dynamicCostLastMonth"
                       width="150"
                       :label="'上月动态总额(元)'">
        <template slot-scope="scope">{{scope.row.dynaCostReportDetailContractPlan['dynamicCostLastMonth'] | NumFormat}}</template>
      </el-table-column>
      <el-table-column prop="dynamicCostDiffWithLastMonth"
                       width="150"
                       :label="'与上月动态差额(元)'">
        <template slot-scope="scope">{{scope.row.dynaCostReportDetailContractPlan['dynamicCostDiffWithLastMonth'] | NumFormat}}</template>
      </el-table-column>
      <el-table-column prop="dynamicCostRateForDiffWithLastMonth"
                       width="150"
                       :label="'与上月动态差额率(%)'">
        <template slot-scope="scope">{{scope.row.dynaCostReportDetailContractPlan['dynamicCostRateForDiffWithLastMonth'] | NumFormat}}</template>
      </el-table-column>
      <el-table-column prop="dynamicCostPriceForSaleSingleUnitThisMonth"
                       width="150"
                       :label="'本月动态成本可售单方'">
        <template slot-scope="scope">{{scope.row.dynaCostReportDetailContractPlan['dynamicCostPriceForSaleSingleUnitThisMonth'] | NumFormat}}</template>
      </el-table-column>
      <el-table-column prop="dynamicCostPriceForConstructSingleUnitThisMonth"
                       width="150"
                       :label="'本月动态成本建面单方'">
        <template slot-scope="scope">{{scope.row.dynaCostReportDetailContractPlan['dynamicCostPriceForConstructSingleUnitThisMonth'] | NumFormat}}</template>
      </el-table-column>
      <el-table-column prop="dynamicCostPriceForSaleSingleUnitLastMonth"
                       width="150"
                       :label="'上月动态成本可售单方'">
        <template slot-scope="scope">{{scope.row.dynaCostReportDetailContractPlan['dynamicCostPriceForSaleSingleUnitLastMonth'] | NumFormat}}</template>
      </el-table-column>
      <el-table-column prop="dynamicCostDiffBetweenPriceForSaleSingleUnitThisMonthAndLastMonth"
                       width="180"
                       :label="'与上月动态可售单方差额'">
        <template slot-scope="scope">{{scope.row.dynaCostReportDetailContractPlan['dynamicCostDiffBetweenPriceForSaleSingleUnitThisMonthAndLastMonth'] | NumFormat}}</template>
      </el-table-column>
      <el-table-column prop="dynamicCostRateForDiffBetweenPriceForSaleSingleUnitThisMonthAndLastMonth"
                       width="190"
                       :label="'与上月动态可售单方差额率(%)'">
        <template slot-scope="scope">{{scope.row.dynaCostReportDetailContractPlan['dynamicCostRateForDiffBetweenPriceForSaleSingleUnitThisMonthAndLastMonth'] | NumFormat}}</template>
      </el-table-column>
      <el-table-column prop="targetCostPriceForSaleSingleUnitThisMonth"
                       width="150"
                       :label="'目标成本可售单方'">
        <template slot-scope="scope">{{scope.row.dynaCostReportDetailContractPlan['targetCostPriceForSaleSingleUnitThisMonth'] | NumFormat}}</template>
      </el-table-column>
      <el-table-column prop="targetCostPriceForConstructSingleUnitThisMonth"
                       width="150"
                       :label="'目标成本建面单方'">
        <template slot-scope="scope">{{scope.row.dynaCostReportDetailContractPlan['targetCostPriceForConstructSingleUnitThisMonth'] | NumFormat}}</template>
      </el-table-column>
      <el-table-column prop="diffWithTargetCost"
                       width="150"
                       :label="'与目标差额(元)'">
        <template slot-scope="scope">{{scope.row.dynaCostReportDetailContractPlan['diffWithTargetCost'] | NumFormat}}</template>
      </el-table-column>
      <el-table-column prop="rateWithTargetCost"
                       width="150"
                       :label="'与目标差额率(%)'">
        <template slot-scope="scope">{{scope.row.dynaCostReportDetailContractPlan['rateWithTargetCost'] | NumFormat}}</template>
      </el-table-column>
      <el-table-column prop="diffBetweenDynamicCostPriceForSaleSingleUnitAndTargetCostPriceForSaleSingleUnit"
                       width="150"
                       :label="'与目标可售单方差额'">
        <template slot-scope="scope">{{scope.row.dynaCostReportDetailContractPlan['diffBetweenDynamicCostPriceForSaleSingleUnitAndTargetCostPriceForSaleSingleUnit'] | NumFormat}}</template>
      </el-table-column>
      <el-table-column prop="rateForDiffBetweenDynamicCostPriceForSaleSingleUnitAndTargetCostPriceForSaleSingleUnit"
                       width="160"
                       :label="'与目标可售单方差额率(%)'">
        <template slot-scope="scope">{{scope.row.dynaCostReportDetailContractPlan['rateForDiffBetweenDynamicCostPriceForSaleSingleUnitAndTargetCostPriceForSaleSingleUnit'] | NumFormat}}</template>
      </el-table-column>
      <el-table-column prop="diffBetweenDynamicCostPriceForConstructSingleUnitAndTargetCostPriceForConstructSingleUnit"
                       width="150"
                       :label="'与目标建面单方差额'">
        <template slot-scope="scope">{{scope.row.dynaCostReportDetailContractPlan['diffBetweenDynamicCostPriceForConstructSingleUnitAndTargetCostPriceForConstructSingleUnit'] | NumFormat}}</template>
      </el-table-column>
      <el-table-column prop="rateForDiffBetweenDynamicCostPriceForConstructSingleUnitAndTargetCostPriceForConstructSingleUnit"
                       width="160"
                       :label="'与目标建面单方差额率(%)'">
        <template slot-scope="scope">{{scope.row.dynaCostReportDetailContractPlan['rateForDiffBetweenDynamicCostPriceForConstructSingleUnitAndTargetCostPriceForConstructSingleUnit'] | NumFormat}}</template>
      </el-table-column>

    </el-table>
  </div>
</template>

<script>
import { NumFormat, Version, rateFormat } from '@/filters/cost/'
import { LoadingUtil } from '@/utils/common/LoadingUtil'
import { getReportDetailContractPlan } from '@/api/cost/DynamicCostAPI'

import { deepCopy, ifNull } from '@/utils/cost/objectHelper'
import { tableHeight } from '@/utils/common/index'
import { arrayToTree, treeToArrayHelper, treeToArray } from '@/utils/cost/treeHelper/'
import sys_config from '@/config/config.js'
import { calc } from '@/utils/common/calc'
export default {
  filters: {
    NumFormat, Version
  },
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
      calcTableHeight: {
        otherHeight: 170,
        sideCloseHeight: 50
      },
      tableData: [],
      queryObj: this.queryObj_passed_in,
      tableHeight: '0',
      fullHeight: document.documentElement.clientHeight,
      pageStatus: {
        expandedLevel: sys_config.expandedLevel//默认展开二级
      }
    }
  },
  computed: {
    tHeight: {
      get: function () {
        let _tableHeight = document.body.clientHeight - this.calcTableHeight.otherHeight
        if (!this.$store.getters.sidebar.opened) _tableHeight += this.calcTableHeight.sideCloseHeight
        return _tableHeight + 40 - (this.$store.getters.showForm ? 100 : 0) + 'px'
      },
      set: function () {
      }
    }
  },
  mounted () {
    this.$nextTick(function () {
      this.settingTableHeight()
    })
    // window.onresize = () => {
    //   return (() => {
    //     this.fullHeight = document.documentElement.clientHeight
    //   })()
    // }
  },
  methods: {
    //获取父id路径
    getParents (tableData, item) {
      let parents = []
      parents.push(item.parent)
      var find = function (tableData, item) {
        let parentObj = tableData.find(findItem => { return findItem.id === item.parent })
        if (parentObj && parentObj.parent) {
          parents.push(parentObj.parent)
          find(tableData, parentObj)
        }
      }
      find(tableData, item)
      find = null
      return parents.join(',')
    },
    initTableData (response) {
      this.tableData = []
      let _tableData = treeToArray(response.data)

      let totalArray = {
        cpTotalAmount: 0,//合约规划总额(元) 
        dynamicCost: 0,//动态成本金额(元)(A=B+C+H)
        amountPendingOccurence: 0,//待发生金额(元)(B)
        cpAmountOccurence: 0,//已发生金额(元)(C=D+E+F+G)
        contractTotalAmount: 0,//合同总额(元)(D)
        changeVisaTotalAmount: 0,//变更签证总额(元)(E)
        nonContractTotalAmount: 0,//无合同费用总额(元)(F)
        handInvalibleAmount: 0,//手工录入无效成本总额(元)(G)
        amountPendingApprove: 0,//在途金额(元)(H)
        contractTotalAmount: 0,//已释放金额(元)(I)
        dynamicCostLastMonth: 0,//上月动态总额(元)
        dynamicCostDiffWithLastMonth: 0,//与上月动态差额(元)
        dynamicCostPriceForSaleSingleUnitThisMonth: 0,//本月动态成本可售单方
        dynamicCostPriceForConstructSingleUnitThisMonth: 0,//本月动态成本建面单方
        dynamicCostPriceForSaleSingleUnitLastMonth: 0,//上月动态成本可售单方
        dynamicCostDiffBetweenPriceForSaleSingleUnitThisMonthAndLastMonth: 0,//与上月动态可售单方差额
        targetCostPriceForSaleSingleUnitThisMonth: 0,//目标成本可售单方
        targetCostPriceForConstructSingleUnitThisMonth: 0,//目标成本建面单方
        diffWithTargetCost: 0,//与目标差额(元)
        diffBetweenDynamicCostPriceForSaleSingleUnitAndTargetCostPriceForSaleSingleUnit: 0,//与目标可售单方差额
        diffBetweenDynamicCostPriceForConstructSingleUnitAndTargetCostPriceForConstructSingleUnit: 0,//与目标建面单方差额
      }
      let rateArray = {
        dynamicCostRateForDiffWithLastMonth: 0,//与上月动态差额率(元)
        dynamicCostRateForDiffBetweenPriceForSaleSingleUnitThisMonthAndLastMonth: 0,//与上月动态可售单方差额率
        rateWithTargetCost: 0,//与目标差额率
        rateForDiffBetweenDynamicCostPriceForSaleSingleUnitAndTargetCostPriceForSaleSingleUnit: 0,//与目标可售单方差额率
        rateForDiffBetweenDynamicCostPriceForConstructSingleUnitAndTargetCostPriceForConstructSingleUnit: 0//与目标建面单方差额率
      }
      let calcTotal = {}
      _tableData.map((item, index) => {
        if (index === 0 && item.name === '合约规划库') {
          item.name = '合计'
          calcTotal = item
        }
        if (!item.dynaCostReportDetailContractPlan) item.dynaCostReportDetailContractPlan = {}
        item._isLeaf = (item.children || []).length === 0
        item.level = item.level * 1

        item._expanded = item.level < this.pageStatus.expandedLevel + 1
        item._show = item.level < this.pageStatus.expandedLevel + 2

        item.handInvalibleAmount = 0

        //合计
        if (item.type === '2') {
          //合计汇总
          for (let key in totalArray) {
            if (key) calcTotal.dynaCostReportDetailContractPlan[key] = calc.Add(ifNull(calcTotal.dynaCostReportDetailContractPlan[key], 0), ifNull(item.dynaCostReportDetailContractPlan[key], 0))
          }

          //比例x100
          for (let rateKey in rateArray) {
            if (rateKey) item.dynaCostReportDetailContractPlan[rateKey] = calc.Mul(ifNull(item.dynaCostReportDetailContractPlan[rateKey], 0), 100)
          }
        }
      })

      //数据清洗
      let _filterData = []
      _filterData = _tableData.filter(item => {
        return item.ignore !== 'Y'
      })

      //配置父路径
      _filterData.map(item => {
        item.parents = this.getParents(_filterData, item)
      })


      _filterData = _filterData.filter(item => {
        //是否有合约子
        let _childs = _filterData.filter(childItem => {
          return childItem.parents.indexOf(item.id) > -1 && childItem.type === '2'
        })
        return (item.type === '1' && (item.children && item.children.length > 0) && _childs.length > 0) || item.type === '2'
      })

      this.tableData = _filterData
    },
    handleExpandClick (rowData) {
      this.tableData.map(item => {
        if (item.parent.indexOf(rowData.id) > -1) item._show = !rowData._expanded
      })
      rowData._expanded = !rowData._expanded
    },
    // 行显示/颜色
    showRow ({ row, column, rowIndex, columnIndex }) {
      // 行隐藏
      let _background = ''
      let _cursor = ''
      const show = row._show
      if (row.type === '1') {
        _background = ';font-weight:bold'
        _cursor = ''
      } else {
        _background = ''
        _cursor = ''

      }
      return (show ? 'animation:treeTableShow 1s;-webkit-animation:treeTableShow 1s;' : 'display:none;') + _background + _cursor
    },
    getList () {
      LoadingUtil.showLoading()
      // 转换参数
      let _queryObj = {
        //companyId: this.queryObj.companyId,
        accountingObjectId: this.queryObj.accObjId,
        type: this.queryObj.costRange
      }

      getReportDetailContractPlan(_queryObj)
        .then(response => {
          //   debugger
          LoadingUtil.hideLoading()
          this.initTableData(response)
          this.queryObj.count = response.data.totalElements
        })
        .catch(error => {
          LoadingUtil.hideLoading()
          console.log(error)
          this.$showError(error.message ? error.message : 'msg_system_error')
        })
    },
    settingTableHeight: function () {
      const topHeight = this.$refs['DynamicCostTable'].getBoundingClientRect().top
      this.tableHeight = this.fullHeight - topHeight - 80
      this.$refs['DynamicCostTable'].style.Height = this.tableHeight + 'px'
    },
  },
  watch: {
    fullHeight (val) {
      this.settingTableHeight()
    }
  }
}

</script>
<style lang="css" scoped>
.subjectCodeExpand {
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  margin-right: 0px;
}
</style>

