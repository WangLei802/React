<!-- 目标成本汇总表 -->
<template>
  <div class='app-container'>
    <mt-searchform>
      <!-- 按钮 -->
      <template slot="buttons">
        <el-button size="mini"
                   type='primary'
                   v-if="$checkPersmissionByCode('cost:targetCostMgmt:saveOrUpdate')"
                   @click='handleExport'>导出</el-button>
      </template>

      <!-- 表单 -->
      <template slot="form">
        <el-row :inline="true">
          <el-col :inline="true"
                  label-width="120px"
                  :span="24">
            <ProjectSelector v-model='p_queryModel'
                             :showTobe=false
                             :show="{group: true,company: true,dept: true, project: false,accObj:true}">
              <template slot="projectSelectorButtons">
                <el-col :span="6"
                        class="search-btn">
                  <el-form-item>
                    <el-button size="mini"
                               type="primary"
                               @click='search'>{{$l("btn_search")}}</el-button>
                    <el-button size="mini"
                               @click='reset'>{{$l("btn_reset")}}</el-button>
                  </el-form-item>
                </el-col>
              </template>
              <template slot="after">
                <el-col :span="6">
                  <el-form-item :label="'年份：'">
                    <fd-select v-model='queryModel.year'
                               placeholder="请选择"
                               type="cost_report_year"
                               :clearable="false"></fd-select>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item :label="'月份：'">
                    <fd-select v-model='queryModel.month'
                               placeholder="请选择"
                               type="cost_report_month"
                               :clearable="false"></fd-select>
                  </el-form-item>
                </el-col>
                <!-- <el-col :span="6">
                                    <el-form-item :label="'成本范围：'">
                                        <fd-select v-model='queryModel.range'
                                                   placeholder="请选择"
                                                   type="cost_report_range"
                                                   :clearable="false"></fd-select>
                                    </el-form-item>
                                </el-col> -->
              </template>
            </ProjectSelector>
          </el-col>
        </el-row>
      </template>
    </mt-searchform>

    <!-- 表格 -->
    <el-table :data="tableData"
              :row-style="showRow"
              align="left"
              size="small"
              border
              :height="tHeight"
              tooltip-effect="dark"
              style="width: 100%">
      <template slot="empty">
        <div style='width:100%;text-align:left'>暂无数据</div>
      </template>
      <!-- 项目 -->
      <el-table-column prop="text"
                       label="项目"
                       min-width="150"
                       show-overflow-tooltip
                       :fixed="tableData.length!==0">
        <template slot-scope="scope">
          <div :style="{'float':'left','text-align':'left','padding-left':scope.row.level*5+'px'}">
            <i :class="!scope.row._expanded ? 'fa fa-plus-square-o' : 'fa fa-minus-square-o' "
               class="subjectCodeExpand"
               v-if="!scope.row._isLeaf"
               @click="handleExpandClick(scope.row.id)"></i>
            {{ scope.row.text}}
          </div>
        </template>
      </el-table-column>

      <!-- 集团命名 -->
      <el-table-column prop="groupName"
                       label="集团命名"
                       show-overflow-tooltip
                       width="100"></el-table-column>

      <!-- 最新平均售价(含车位) -->
      <el-table-column prop="latestAvgSellingPrice"
                       label="最新平均售价(含车位)"
                       show-overflow-tooltip
                       width="100">
        <template slot-scope="scope">
          {{scope.row.latestAvgSellingPrice | NumFormat}}
        </template>
      </el-table-column>

      <!-- 动态列 -->
      <el-table-column v-for="(item,index) in pageStatus.attributes"
                       :label="item.lable"
                       :key="index">

        <el-table-column width="120"
                         prop="targetCostIncludeTax"
                         label="目标成本(万元)">
          <template slot-scope="scope">
            {{scope.row['stageTargetCostModel'+item.id].targetCostIncludeTax | NumFormat }}
          </template>
        </el-table-column>

        <el-table-column width="110"
                         prop="constructSmCostIncludeTax"
                         label="建面单方(元/㎡)">
          <template slot-scope="scope">
            {{scope.row['stageTargetCostModel'+item.id].constructSmCostIncludeTax | NumFormat}}
          </template>
        </el-table-column>

        <el-table-column width="110"
                         prop="saleSmCostIncludeTax"
                         label="可售单方(元/㎡)">
          <template slot-scope="scope">
            {{scope.row['stageTargetCostModel'+item.id].saleSmCostIncludeTax | NumFormat}}
          </template>
        </el-table-column>

        <el-table-column width="110"
                         prop="saleRatio"
                         label="可售比(%)">
          <template slot-scope="scope">
            {{scope.row['stageTargetCostModel'+item.id].saleRatio | NumFormat}}
          </template>
        </el-table-column>

      </el-table-column>

      <!-- 动态成本(万元) -->
      <el-table-column width="100"
                       prop="dynamicCost"
                       label="动态成本(万元)">
        <template slot-scope="scope">
          {{scope.row.dynamicCost | NumFormat}}
        </template>
      </el-table-column>

      <!-- 预备会召开时间 -->
      <el-table-column width="100"
                       prop="prepareMeetingTime"
                       label="预备会召开时间">
        <template slot-scope="scope">
          {{scope.row.prepareMeetingTime | dateFormat('yyyy-MM-dd HH:mm:ss')}}
        </template>
      </el-table-column>

      <!-- 预备会-投后版偏差额(万元) -->
      <el-table-column width="100"
                       prop="preMeetingAfterInvestDiff"
                       label="预备会-投后版偏差额(万元)">
        <template slot-scope="scope">
          {{scope.row.preMeetingAfterInvestDiff | NumFormat}}
        </template>
      </el-table-column>

      <!-- 预备会-投后版偏差率(%) -->
      <el-table-column width="100"
                       prop="preMeetingAfterInvestDiffRatio"
                       label="预备会-投后版偏差率(%)">
        <template slot-scope="scope">
          {{scope.row.preMeetingAfterInvestDiffRatio===0?'-':scope.row.preMeetingAfterInvestDiffRatio}}
        </template>
      </el-table-column>

      <!-- 结算版-预结算偏差额(万元) -->
      <el-table-column width="100"
                       prop="settlementPreSettlementDiff"
                       label="结算版-预结算偏差额(万元)">
        <template slot-scope="scope">
          {{scope.row.settlementPreSettlementDiff | NumFormat}}
        </template>
      </el-table-column>

      <!-- 结算版-预结算偏差率(%) -->
      <el-table-column width="100"
                       prop="settlementPreSettlementDiffRatio"
                       label="结算版-预结算偏差率(%)">
        <template slot-scope="scope">
          {{scope.row.settlementPreSettlementDiffRatio===0?'-':scope.row.settlementPreSettlementDiffRatio}}
        </template>
      </el-table-column>

      <!-- 备注(成本预警) -->
      <el-table-column width="100"
                       prop="remaker"
                       label="备注(成本预警)">
        <template slot-scope="scope">
          <i class="fa fa-circle"
             :style="{'color':scope.row.remaker>1?(scope.row.remaker>1.02?'red':'orange'):'lightgreen'}"></i>
        </template>
      </el-table-column>

      <!-- 建筑面积 -->
      <el-table-column width="100"
                       prop="totalBuildingArea"
                       label="建筑面积">
        <template slot-scope="scope">
          {{scope.row.totalBuildingArea | NumFormat}}
        </template>
      </el-table-column>

      <!-- 可售面积 -->
      <el-table-column width="100"
                       prop="totalSellArea"
                       label="可售面积">
        <template slot-scope="scope">
          {{scope.row.totalSellArea | NumFormat}}
        </template>
      </el-table-column>

      <!-- 全地库面积 -->
      <el-table-column width="100"
                       prop="allBasementArea"
                       label="全地库面积">
        <template slot-scope="scope">
          {{scope.row.allBasementArea | NumFormat}}
        </template>
      </el-table-column>

      <!-- 地下停车位 -->
      <el-table-column width="100"
                       prop="undergroundParking"
                       label="地下停车位">
        <template slot-scope="scope">
          {{scope.row.undergroundParking | NumFormat}}
        </template>
      </el-table-column>

      <!-- 单车位平均面积 -->
      <el-table-column width="100"
                       prop="parkingAvgArea"
                       label="单车位平均面积">
        <template slot-scope="scope">
          {{scope.row.parkingAvgArea | NumFormat}}
        </template>
      </el-table-column>

      <!-- 主要业态 -->
      <el-table-column width="100"
                       prop="majorBusinessType"
                       label="主要业态">
        <template slot-scope="scope">
          {{scope.row.majorBusinessType}}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import ProjectSelector from '@/components/cost/ProjectSelector/'
import COSTENUM from '@/utils/cost/enum'
import {
  NumFormat, // 千位符
  FLevel,
  dateFormat,
  Version,
  cutString,
  rateFormat
} from '@/filters/cost/'
import {
  getTCSummaryReport
} from '@/api/cost/targetCostCompilationAPI'
import { LoadingUtil } from '@/utils/common/LoadingUtil'
import { deepCopy, ifNull } from '@/utils/cost/objectHelper'
import { arrayToTree, treeToArrayHelper, treeToArray } from '@/utils/cost/treeHelper/'
import sys_config from '@/config/config.js'
import { calc } from '@/utils/common/calc'
import COSTBUSINESS from '@/utils/cost/business'
export default {
  data () {
    return {
      calcTableHeight: {
        otherHeight: 140,
        sideCloseHeight: 50
      },
      p_queryModel: {
        companyId: '',
        accObjId: '',
        projectId: ''
      },
      queryModel: {
        year: new Date().getFullYear().toString(),
        month: (new Date().getMonth()).toString(),
        range: '5'
      },
      pageStatus: {
        expandedLevel: sys_config.expandedLevel,//默认展开二级
        attributes: [{
          id: 1, lable: '(投后版)目标成本'
        }, {
          id: 2, lable: '(预备会版)目标成本'
        }, {
          id: 3, lable: '(预结算版)目标成本'
        }, {
          id: 4, lable: '(结算版)目标成本'
        }]
      },
      tableData: []
    }
  },
  components: {
    ProjectSelector
  },
  filters: {
    NumFormat, // 千位符
    FLevel,
    dateFormat,
    Version,
    cutString,
    rateFormat
  },
  computed: {
    tHeight: {
      get: function () {
        let _tableHeight = document.body.clientHeight - this.calcTableHeight.otherHeight
        if (!this.$store.getters.sidebar.opened) _tableHeight += this.calcTableHeight.sideCloseHeight
        return _tableHeight - (this.$store.getters.showForm ? 100 : 0) + 'px'
      },
      set: function () {
      }
    }
  },
  mounted () {
    //this.search()
  },

  methods: {
    initTabledata (response) {
      this.tableData = []
      let _tableData = treeToArray(response.data)
      _tableData.map((item, index) => {
        item._isLeaf = item.leaf
        item.level = item.level * 1
        item._expanded = true
        item._show = true

        if (!this.p_queryModel.companyId && !this.p_queryModel.accObjId) {
          item._expanded = item.level < this.pageStatus.expandedLevel + 1
          item._show = item.level < this.pageStatus.expandedLevel + 2
        }
        // 偏差率
        item['settlementPreSettlementDiffRatio'] = calc.Mul(ifNull(item['settlementPreSettlementDiffRatio'], 0), 100)
        item['preMeetingAfterInvestDiffRatio'] = calc.Mul(ifNull(item['preMeetingAfterInvestDiffRatio'], 0), 100)

        // 万元
        item['stageTargetCostModel1']['targetCostIncludeTax'] = calc.Div(ifNull(item['stageTargetCostModel1']['targetCostIncludeTax'], 0), 10000)
        item['stageTargetCostModel2']['targetCostIncludeTax'] = calc.Div(ifNull(item['stageTargetCostModel2']['targetCostIncludeTax'], 0), 10000)
        item['stageTargetCostModel3']['targetCostIncludeTax'] = calc.Div(ifNull(item['stageTargetCostModel3']['targetCostIncludeTax'], 0), 10000)
        item['stageTargetCostModel4']['targetCostIncludeTax'] = calc.Div(ifNull(item['stageTargetCostModel4']['targetCostIncludeTax'], 0), 10000)

        item['stageTargetCostModel1']['saleRatio'] = calc.Mul(ifNull(item['stageTargetCostModel1']['saleRatio'], 0), 100)
        item['stageTargetCostModel2']['saleRatio'] = calc.Mul(ifNull(item['stageTargetCostModel2']['saleRatio'], 0), 100)
        item['stageTargetCostModel3']['saleRatio'] = calc.Mul(ifNull(item['stageTargetCostModel3']['saleRatio'], 0), 100)
        item['stageTargetCostModel4']['saleRatio'] = calc.Mul(ifNull(item['stageTargetCostModel4']['saleRatio'], 0), 100)

        item['dynamicCost'] = calc.Div(ifNull(item['dynamicCost'], 0), 10000)
        item['preMeetingAfterInvestDiff'] = calc.Div(ifNull(item['preMeetingAfterInvestDiff'], 0), 10000)
        item['settlementPreSettlementDiff'] = calc.Div(ifNull(item['settlementPreSettlementDiff'], 0), 10000)
      })

      this.tableData = _tableData
    },
    handleExpandClick (parentIds) {
      let parentExpanded
      this.tableData.map(item => {
        if (item.id === parentIds) {
          item._expanded = !item._expanded
          parentExpanded = item._expanded
        }
        if (item.parentIds && item.parentIds.indexOf(parentIds) > -1 && item.id !== parentIds) {
          item._show = parentExpanded
          item._expanded = parentExpanded
        }
      })
    },
    handleExport () {
      COSTBUSINESS.download(process.env.COST_API + '/targetCost/defineStageVersion/reportExport?companyId=' + this.p_queryModel.companyId + '&accountingObjectId=' + this.p_queryModel.accObjId + '&year=' + this.queryModel.year + '&month=' + this.queryModel.month + '&reportType=' + this.queryModel.range)
    },
    reset () {
      this.p_queryModel.companyId = ''
      this.p_queryModel.accObjId = ''
      this.queryModel.status = ''
      this.queryModel.stageId = ''
      this.p_queryModel.stageId = ''
      this.queryModel.year = new Date().getFullYear().toString()
      this.queryModel.month = (new Date().getMonth()).toString()
      this.queryModel.range = null
    },
    search () {
      LoadingUtil.showLoading()
      let _param = {
        companyId: this.p_queryModel.companyId,
        accountingObjectId: this.p_queryModel.accObjId,
        year: this.queryModel.year,
        month: this.queryModel.month,
        reportType: this.queryModel.range
      }
      getTCSummaryReport(_param).then(response => {
        LoadingUtil.hideLoading()
        this.initTabledata(response)
      })
        .catch(error => {
          LoadingUtil.hideLoading()
          console.log(error)
          this.$showError(error.message ? error.message : 'msg_system_error')
        })

    },
    showRow (row) {
      // 行隐藏
      const show = row.row._show
      return show ? 'animation:treeTableShow 1s;-webkit-animation:treeTableShow 1s;' : 'display:none;'
    }
  }
}

</script>
<style scoped>
.el-select {
  width: 200px;
}
.subjectCodeExpand {
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  margin-right: 0px;
}
</style>
