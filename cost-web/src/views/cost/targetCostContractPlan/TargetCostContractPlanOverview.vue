<!-- StandaredSubjectList.vue -->
<template>
  <div class="app-container">
    <!-- <div class="subTitle">
            <div class="breadcrumb-child">
                <i class="fa fa-folder-open-o"></i>合约规划查询总览
            </div>
    </div>-->
    <mt-searchform>
      <template slot="buttons"></template>
      <template slot="form">
        <el-row :inline="true">
          <el-col :inline="true" label-width="120px" :span="24">
            <ProjectSelector
              v-model="queryModel"
              :show="{group: true,company: true,dept: true, project: true,accObj:false}"
            >
              <template slot="projectSelectorButtons">
                <el-col :span="6" class="search-btn">
                  <el-form-item>
                    <el-button size="mini" type="primary" @click="search">{{$l("btn_search")}}</el-button>
                    <el-button size="mini" @click="reset">{{$l("btn_reset")}}</el-button>
                  </el-form-item>
                </el-col>
              </template>
            </ProjectSelector>
          </el-col>
        </el-row>
      </template>
    </mt-searchform>

    <div ref="calTable">
      <template>
        <el-table
          :data="tableData"
          border
          stripe
          size="small"
          style="width: 100%"
          :height="tHeight"
          :row-style="showRow"
        >
          <el-table-column prop="name" label="组织" width="300" fixed>
            <template slot-scope="scope">
              <div
                :style="{'width':'100%','text-align':'left','padding-left':(scope.row.level-1)*5+'px'}"
              >
                <i
                  :class="!scope.row._expanded&&!scope.row.isLeaf ? 'fa fa-plus-square-o' : 'fa fa-minus-square-o' "
                  style="font-size:14px;cursor:pointer;vertical-align: sub;"
                  v-show="!scope.row.isLeaf"
                  @click="handleExpandClick(scope.row.parentIds)"
                ></i>
                &nbsp;
                <a
                  style="color:blue"
                  v-if="scope.row.isLink"
                  @click="handleViewDetail(scope.$index,scope.row)"
                  :title="scope.row.name"
                >{{ scope.row.name |cutString(16) }}</a>
                <span
                  v-if="!scope.row.isLink"
                  :title="scope.row.name"
                >{{ scope.row.name |cutString(16) }}</span>
              </div>
            </template>
          </el-table-column>

          <el-table-column label="投后">
            <el-table-column prop="contractPlanAmount1" label="合约规划金额(元)" width="200">
              <template slot-scope="scope">{{scope.row.contractPlanAmount1 | NumFormat}}</template>
            </el-table-column>
            <el-table-column prop="saleSmCostAmount1" label="可售单方(元/㎡)" width="200">
              <template slot-scope="scope">{{scope.row.saleSmCostAmount1 | NumFormat}}</template>
            </el-table-column>
            <el-table-column prop="constructSmCostAmount1" label="建面单方(元/㎡)" width="200">
              <template slot-scope="scope">{{scope.row.constructSmCostAmount1 | NumFormat}}</template>
            </el-table-column>
          </el-table-column>

          <el-table-column label="预备会">
            <el-table-column prop="saleSmCostAmount2" label="合约规划金额(元)" width="200">
              <template slot-scope="scope">{{scope.row.contractPlanAmount2 | NumFormat}}</template>
            </el-table-column>
            <el-table-column prop="constructSmCostAmount2" label="可售单方(元/㎡)" width="200">
              <template slot-scope="scope">{{scope.row.saleSmCostAmount2 | NumFormat}}</template>
            </el-table-column>
            <el-table-column prop="contractPlanAmount2" label="建面单方(元/㎡)" width="200">
              <template slot-scope="scope">{{scope.row.constructSmCostAmount2 | NumFormat}}</template>
            </el-table-column>

            <el-table-column prop="contractPlanDifference2" label="合约规划差额(预备会-投后)(元)" width="250">
              <template slot-scope="scope">{{scope.row.contractPlanDifference2 | NumFormat}}</template>
            </el-table-column>
          </el-table-column>
        </el-table>
      </template>
    </div>
  </div>
</template>

<script>
import { LoadingUtil } from '@/utils/common/LoadingUtil'
import COSTENUM from '@/utils/cost/enum'
import {
  getFullViewByAccountingObject
} from '@/api/cost/targetCostContractPlanAPI'
import ProjectSelector from '@/components/cost/ProjectSelector/'
import {
  NumFormat, // 千位符(NumFormatNormal ,保留0)
  FLevel,
  dateFormat,
  Version,
  cutString
} from '@/filters/cost/'
import { arrayToTree, treeToArrayHelper, treeToArray } from '@/utils/cost/treeHelper/'
import { tableHeight } from '@/utils/common/index'
import { calc } from '@/utils/common/calc'
import { deepCopy, ifNull } from '@/utils/cost/objectHelper'
import sys_config from '@/config/config.js'
export default {
  data () {
    return {
      tableHeight: '0',
      fullHeight: document.documentElement.clientHeight,
      queryModel: {
        companyId: '',
        projectId: ''
      },
      pageStatus: {
        expandedLevel: 0//sys_config.expandedLevel,//默认展开二级
      },
      tableData: [],
      pageModel: {},
      _tableData: []
    }
  },
  filters: {
    NumFormat,
    FLevel,
    dateFormat,
    Version,
    cutString
  },
  components: {
    ProjectSelector
  },

  computed: {
    tHeight: function () {
      let options = {
        fullHeight: this.$store.getters.fullHeight,
        opened: this.$store.getters.sidebar.opened,
        showForm: this.$store.getters.showForm,
        obj: this,
        otherHeight: 140
      }
      return `${tableHeight(options)}px`
    }
  },

  mounted () {
    this.getList()
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
    settingTableHeight: function () {
      const topHeight = this.$refs['calTable'].getBoundingClientRect().top
      this.tableHeight = this.fullHeight - topHeight - 80
      this.$refs['calTable'].style.Height = this.tableHeight + 'px'
    },
    // 展开收起行
    handleExpandClick (parentIds) {
      let parentExpanded
      this.tableData.map(item => {
        if (item.parentIds === parentIds) {
          item._expanded = !item._expanded
          parentExpanded = item._expanded
        }
        if (item.parentIds.indexOf(parentIds) > -1 && item.parentIds !== parentIds) {
          item._show = parentExpanded
          item._expanded = parentExpanded
        }
      })
    },
    // 展开收起行
    showRow: function (row) {
      // 行隐藏
      const show = row.row._show
      return show ? 'animation:treeTableShow 1s;-webkit-animation:treeTableShow 1s;' : 'display:none;'
    },
    // 初始化列表数据
    initTableData: function (response) {
      this.tableData = []
      let _tableData = treeToArray(response.data)
      this._tableData = _tableData
      _tableData.map(item => {
        let _item = {
          id: item.id,
          isLeaf: !((item.children && item.children.length > 0)),
          type: item.type,
          isLink: item.type === COSTENUM.projectTreeType.TREE_NODE_ACC_OBJ,
          level: (item.parentIds + ',').split(',').length - 1,
          parentId: item.parentId || '',
          // projectId: item.accountingObjectModel.projectId,
          // projectVersion: item.stage1TargetCostVersionModel ? item.stage1TargetCostVersionModel.projectVersion : '',
          // stageId: item.stage1TargetCostVersionModel ? item.stage1TargetCostVersionModel.stageId : '',
          parentIds: (item.parentIds ? (item.parentIds + ',') : '') + item.id + ',',
          name: item.text,
          // 投前
          // 可售单方(㎡)
          saleSmCostAmount1: item.stage1TargetCostContractPlanVersionModel ? (item.stage1TargetCostContractPlanVersionModel.saleSmCostAmount || 0) : 0,
          // 建面单方
          constructSmCostAmount1: item.stage1TargetCostContractPlanVersionModel ? (item.stage1TargetCostContractPlanVersionModel.constructSmCostAmount || 0) : 0,
          // 合约规划金额(元)
          contractPlanAmount1: item.stage1TargetCostContractPlanVersionModel ? (item.stage1TargetCostContractPlanVersionModel.contractPlanAmountIncludeTax || 0) : 0,

          // 投后
          // 可售单方(㎡)
          saleSmCostAmount2: item.stage2TargetCostContractPlanVersionModel ? (item.stage2TargetCostContractPlanVersionModel.saleSmCostAmount || 0) : 0,
          // 建面单方
          constructSmCostAmount2: item.stage2TargetCostContractPlanVersionModel ? (item.stage2TargetCostContractPlanVersionModel.constructSmCostAmount || 0) : 0,
          // 合约规划金额(元)
          contractPlanAmount2: item.stage2TargetCostContractPlanVersionModel ? (item.stage2TargetCostContractPlanVersionModel.contractPlanAmountIncludeTax || 0) : 0,
          // 合约规划差额(预备会-投后)(元)
          contractPlanDifference2: item.stage2TargetCostContractPlanVersionModel ? (item.stage2TargetCostContractPlanVersionModel.contractPlanDifference || 0) : 0,

          _expanded: true,
          _show: true
        }
        //处理默认展开级别
        if (!this.queryModel.companyId && !this.queryModel.projectId) {
          let _trueLevel = item.parentIds ? item.parentIds.split(',').length : 0
          _item._expanded = calc.Mul(ifNull(_trueLevel, 0), 1) < this.pageStatus.expandedLevel + 1
          _item._show = calc.Mul(ifNull(_trueLevel, 0), 1) < this.pageStatus.expandedLevel + 2
        }

        if (item.stage2TargetCostContractPlanVersionModel && typeof (item.stage2TargetCostContractPlanVersionModel.stageVersion) !== 'undefined' && item.stage2TargetCostContractPlanVersionModel.stageId) {
          _item.stageVersion = item.stage2TargetCostContractPlanVersionModel.stageVersion
          _item.stageId = item.stage2TargetCostContractPlanVersionModel.stageId
        } else if (item.stage1TargetCostContractPlanVersionModel && typeof (item.stage1TargetCostContractPlanVersionModel.stageVersion) !== 'undefined') {
          _item.stageVersion = item.stage1TargetCostContractPlanVersionModel.stageVersion
          _item.stageId = item.stage1TargetCostContractPlanVersionModel.stageId
        }
        this.tableData.push(_item)
      })
    },

    // 查看明细
    handleViewDetail (index, rowData) {
      this.$router.push({
        name: 'TargetCostContractPlanQuery',
        query: { accountingObjectId: rowData.id, accountingObjectName: rowData.name, stageId: rowData.stageId, stageVersion: rowData.stageVersion }
      })
    },
    // 获取列表数据
    getList () {
      // 获取数据
      LoadingUtil.showLoading()
      let _params = this.queryModel

      getFullViewByAccountingObject(_params)
        .then(response => {
          LoadingUtil.hideLoading()
          this.initTableData(response)
        })
        .catch(error => {
          LoadingUtil.hideLoading()
          console.log(error)
          this.$showError(error.message ? error.message : 'msg_system_error')
        })
    },
    // 搜索
    search () {
      this.getList()
    },
    // 重置表单
    reset () {
      this.queryModel.companyId = ''
      this.queryModel.projectId = ''
    }
  },
  watch: {
    fullHeight (val) {
      this.settingTableHeight()
    }
  }
}
</script>
<style lang='scss' scoped>
@import "../../../styles/list.scss";
</style>