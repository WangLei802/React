<!-- StandaredSubjectList.vue -->
<template>
  <div class="app-container">
    <mt-searchform>
      <template slot="buttons"></template>
      <template slot="form">
        <el-row :inline="true">
          <el-col :inline="true" label-width="120px" :span="24">
            <ProjectSelector v-model="queryModel">
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
          size="small"
          stripe
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
                >{{ scope.row.name | cutString(16) }}</a>
                <span
                  v-if="!scope.row.isLink"
                  :title="scope.row.name"
                >{{ scope.row.name | cutString(16) }}</span>
              </div>
            </template>
          </el-table-column>

          <el-table-column label="投前">
            <el-table-column prop="saleSmCostIncludeTax1" label="目标成本(元)" width="120">
              <template slot-scope="scope">{{scope.row.targetCost1 | NumFormat}}</template>
            </el-table-column>
            <el-table-column prop="constructSmCostIncludeTax1" label="可售单方(元/㎡)" width="130">
              <template slot-scope="scope">{{scope.row.saleSmCostIncludeTax1 | NumFormat}}</template>
            </el-table-column>
            <el-table-column prop="targetCost1" label="建面单方(元/㎡)" width="130">
              <template slot-scope="scope">{{scope.row.constructSmCostIncludeTax1 | NumFormat}}</template>
            </el-table-column>
          </el-table-column>

          <el-table-column label="投后">
            <el-table-column prop="saleSmCostIncludeTax2" label="目标成本(元)" width="120">
              <template slot-scope="scope">{{scope.row.targetCost2 | NumFormat}}</template>
            </el-table-column>
            <el-table-column prop="constructSmCostIncludeTax2" label="可售单方(元/㎡)" width="130">
              <template slot-scope="scope">{{scope.row.saleSmCostIncludeTax2 | NumFormat}}</template>
            </el-table-column>
            <el-table-column prop="targetCost2" label="建面单方(元/㎡)" width="130">
              <template slot-scope="scope">{{scope.row.constructSmCostIncludeTax2 | NumFormat}}</template>
            </el-table-column>

            <el-table-column prop="targetCostDifference2" label="目标成本差额(元)" width="150">
              <template slot-scope="scope">{{scope.row.targetCostDifference2 | NumFormat}}</template>
            </el-table-column>
          </el-table-column>

          <el-table-column label="预备会">
            <el-table-column prop="saleSmCostIncludeTax3" label="目标成本(元)" width="120">
              <template slot-scope="scope">{{scope.row.targetCost3 | NumFormat}}</template>
            </el-table-column>
            <el-table-column prop="constructSmCostIncludeTax3" label="可售单方(元/㎡)" width="130">
              <template slot-scope="scope">{{scope.row.saleSmCostIncludeTax3 | NumFormat}}</template>
            </el-table-column>
            <el-table-column prop="targetCost3" label="建面单方(元/㎡)" width="130">
              <template slot-scope="scope">{{scope.row.constructSmCostIncludeTax3 | NumFormat}}</template>
            </el-table-column>

            <el-table-column prop="targetCostDifference3" label="目标成本差额(元)" width="150">
              <template slot-scope="scope">{{scope.row.targetCostDifference3 | NumFormat}}</template>
            </el-table-column>
          </el-table-column>

          <el-table-column label="预结算">
            <el-table-column prop="saleSmCostIncludeTax4" label="目标成本(元)" width="120">
              <template slot-scope="scope">{{scope.row.targetCost4 | NumFormat}}</template>
            </el-table-column>
            <el-table-column prop="constructSmCostIncludeTax4" label="可售单方(元/㎡)" width="130">
              <template slot-scope="scope">{{scope.row.saleSmCostIncludeTax4 | NumFormat}}</template>
            </el-table-column>
            <el-table-column prop="targetCost4" label="建面单方(元/㎡)" width="130">
              <template slot-scope="scope">{{scope.row.constructSmCostIncludeTax4 | NumFormat}}</template>
            </el-table-column>

            <el-table-column prop="targetCostDifference4" label="目标成本差额(元)" width="150">
              <template slot-scope="scope">{{scope.row.targetCostDifference4 | NumFormat}}</template>
            </el-table-column>
          </el-table-column>

          <el-table-column label="结算">
            <el-table-column prop="saleSmCostIncludeTax5" label="目标成本(元)" width="120">
              <template slot-scope="scope">{{scope.row.targetCost5 | NumFormat}}</template>
            </el-table-column>
            <el-table-column prop="constructSmCostIncludeTax5" label="可售单方(元/㎡)" width="130">
              <template slot-scope="scope">{{scope.row.saleSmCostIncludeTax5 | NumFormat}}</template>
            </el-table-column>
            <el-table-column prop="targetCost5" label="建面单方(元/㎡)" width="130">
              <template slot-scope="scope">{{scope.row.constructSmCostIncludeTax5 | NumFormat}}</template>
            </el-table-column>

            <el-table-column prop="targetCostDifference5" label="目标成本差额(元)" width="150">
              <template slot-scope="scope">{{scope.row.targetCostDifference5 | NumFormat}}</template>
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
} from '@/api/cost/selectTargetCostAPI'
import ProjectSelector from '@/components/cost/ProjectSelector/'
import { tableHeight } from '@/utils/common/index'
import {
  NumFormat, // 千位符（NumFormatNormal 0不显示-）
  FLevel,
  dateFormat,
  Version,
  cutString
} from '@/filters/cost/'
import { arrayToTree, treeToArrayHelper, treeToArray } from '@/utils/cost/treeHelper/'
import { calc } from '@/utils/common/calc'
import { deepCopy, ifNull } from '@/utils/cost/objectHelper'
import sys_config from '@/config/config.js'
export default {
  data () {
    return {
      queryModel: {
        companyId: '',
        projectId: ''
      },
      pageStatus: {
        expandedLevel: 0//sys_config.expandedLevel,//默认展开二级
      },
      tableData: [],
      pageModel: {
        'id': '1',
        'leaf': true,
        'level': 5,
        'parentId': '6653',
        'stage1TargetCostVersionModel': {
          'accountingObjectId': '1',
          'constructSmCostIncludeTax': 1100.0000,
          'createdDate': '2018-07-29T05:53:51.000+0000',
          'id': '2c938abd64e497e20164e499a01a001e',
          'saleSmCostIncludeTax': 1100.0000,
          'stageId': '2',
          'stageVersion': '2.0',
          'status': '2',
          'targetCost': 110000.0000,
          'targetCostDifference': 0,
          'targetCostFixAmount': 0.0000,
          'updatedDate': '2018-07-29T05:56:17.000+0000',
          'version': 2
        },
        'stage2TargetCostVersionModel': {
          'constructSmCostIncludeTax': 0,
          'saleSmCostIncludeTax': 0,
          'targetCost': 110000.0000,
          'targetCostDifference': 0.0000
        },
        'stage3TargetCostVersionModel': {
          'constructSmCostIncludeTax': 0,
          'saleSmCostIncludeTax': 0,
          'targetCost': 110000.0000,
          'targetCostDifference': 0.0000
        },
        'stage4TargetCostVersionModel': {
          'constructSmCostIncludeTax': 0,
          'saleSmCostIncludeTax': 0,
          'targetCost': 110000.0000,
          'targetCostDifference': 0.0000
        },
        'text': '成本分期-中梁首府壹号(請勿修改)',
        'type': 'acc_obj'
      }
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
    // window.onresize = () => {
    //   return (() => {
    //     this.fullHeight = document.documentElement.clientHeight
    //   })()
    // }
    let _this = this
    // setTimeout(function () {
    //     _this.queryModel.projectId = 'dd'//'998b7664-6159-45ef-af45-b0a05b68f87f'
    //     window.print()
    // }, 2000)
  },

  methods: {
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
      _tableData.map(item => {
        let _item = {
          id: item.id,
          isLeaf: !((item.children && item.children.length > 0)),
          type: item.type,
          isLink: item.type === COSTENUM.projectTreeType.TREE_NODE_ACC_OBJ,
          level: (item.parentIds + ',').split(',').length - 1,
          parentId: item.parentId || '',
          // projectId: item.accountingObjectModel.projectId,

          parentIds: (item.parentIds ? (item.parentIds + ',') : '') + item.id + ',',
          name: item.text,
          // 投前
          saleSmCostIncludeTax1: item.stage1TargetCostVersionModel ? (item.stage1TargetCostVersionModel.saleSmCostIncludeTax || 0) : 0,
          constructSmCostIncludeTax1: item.stage1TargetCostVersionModel ? (item.stage1TargetCostVersionModel.constructSmCostIncludeTax || 0) : 0,
          targetCost1: item.stage1TargetCostVersionModel ? (item.stage1TargetCostVersionModel.targetCost || 0) : 0,

          // 投后
          saleSmCostIncludeTax2: item.stage2TargetCostVersionModel ? (item.stage2TargetCostVersionModel.saleSmCostIncludeTax || 0) : 0,
          constructSmCostIncludeTax2: item.stage2TargetCostVersionModel ? (item.stage2TargetCostVersionModel.constructSmCostIncludeTax || 0) : 0,
          targetCost2: item.stage2TargetCostVersionModel ? (item.stage2TargetCostVersionModel.targetCost || 0) : 0,
          targetCostDifference2: item.stage2TargetCostVersionModel ? (item.stage2TargetCostVersionModel.targetCostDifference || 0) : 0,

          // 预备会
          saleSmCostIncludeTax3: item.stage3TargetCostVersionModel ? (item.stage3TargetCostVersionModel.saleSmCostIncludeTax || 0) : 0,
          constructSmCostIncludeTax3: item.stage3TargetCostVersionModel ? (item.stage3TargetCostVersionModel.constructSmCostIncludeTax || 0) : 0,
          targetCost3: item.stage3TargetCostVersionModel ? (item.stage3TargetCostVersionModel.targetCost || 0) : 0,
          targetCostDifference3: item.stage3TargetCostVersionModel ? (item.stage3TargetCostVersionModel.targetCostDifference || 0) : 0,

          // 预结算
          saleSmCostIncludeTax4: item.stage4TargetCostVersionModel ? (item.stage4TargetCostVersionModel.saleSmCostIncludeTax || 0) : 0,
          constructSmCostIncludeTax4: item.stage4TargetCostVersionModel ? (item.stage4TargetCostVersionModel.constructSmCostIncludeTax || 0) : 0,
          targetCost4: item.stage4TargetCostVersionModel ? (item.stage4TargetCostVersionModel.targetCost || 0) : 0,
          targetCostDifference4: item.stage4TargetCostVersionModel ? (item.stage4TargetCostVersionModel.targetCostDifference || 0) : 0,

          // 结算
          saleSmCostIncludeTax5: item.stage5TargetCostVersionModel ? (item.stage5TargetCostVersionModel.saleSmCostIncludeTax || 0) : 0,
          constructSmCostIncludeTax5: item.stage5TargetCostVersionModel ? (item.stage5TargetCostVersionModel.constructSmCostIncludeTax || 0) : 0,
          targetCost5: item.stage5TargetCostVersionModel ? (item.stage5TargetCostVersionModel.targetCost || 0) : 0,
          targetCostDifference5: item.stage5TargetCostVersionModel ? (item.stage5TargetCostVersionModel.targetCostDifference || 0) : 0,
          _expanded: true,
          _show: true
        }


        //处理默认展开级别
        if (!this.queryModel.companyId && !this.queryModel.projectId) {
          let _trueLevel = item.parentIds ? item.parentIds.split(',').length : 0
          _item._expanded = calc.Mul(ifNull(_trueLevel, 0), 1) < this.pageStatus.expandedLevel + 1
          _item._show = calc.Mul(ifNull(_trueLevel, 0), 1) < this.pageStatus.expandedLevel + 2
        }


        if (item.stage5TargetCostVersionModel && typeof (item.stage5TargetCostVersionModel.stageVersion) !== 'undefined' && item.stage5TargetCostVersionModel.stageId) {
          _item.stageVersion = item.stage5TargetCostVersionModel.stageVersion
          _item.stageId = item.stage5TargetCostVersionModel.stageId
        } else if (item.stage4TargetCostVersionModel && typeof (item.stage4TargetCostVersionModel.stageVersion) !== 'undefined' && item.stage4TargetCostVersionModel.stageId) {
          _item.stageVersion = item.stage4TargetCostVersionModel.stageVersion
          _item.stageId = item.stage4TargetCostVersionModel.stageId
        } else if (item.stage3TargetCostVersionModel && typeof (item.stage3TargetCostVersionModel.stageVersion) !== 'undefined' && item.stage3TargetCostVersionModel.stageId) {
          _item.stageVersion = item.stage3TargetCostVersionModel.stageVersion
          _item.stageId = item.stage3TargetCostVersionModel.stageId
        } else if (item.stage2TargetCostVersionModel && typeof (item.stage2TargetCostVersionModel.stageVersion) !== 'undefined' && item.stage2TargetCostVersionModel.stageId) {
          _item.stageVersion = item.stage2TargetCostVersionModel.stageVersion
          _item.stageId = item.stage2TargetCostVersionModel.stageId
        } else if (item.stage1TargetCostVersionModel && typeof (item.stage1TargetCostVersionModel.stageVersion) !== 'undefined' && item.stage1TargetCostVersionModel.stageId) {
          _item.stageVersion = item.stage1TargetCostVersionModel.stageVersion
          _item.stageId = item.stage1TargetCostVersionModel.stageId
        }
        this.tableData.push(_item)
      })
    },

    // 查看明细
    handleViewDetail (index, rowData) {
      this.$router.push({
        name: 'TargetCostQueryList',
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
  }
}
</script>
<style lang='scss' scoped>
@import "../../../styles/list.scss";
</style>