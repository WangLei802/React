<!-- TargetCostCompilationList -->
<template>
  <div class="app-container">
    <mt-searchform>
      <template slot="buttons">
        <el-button
          type="primary"
          v-if="$checkPersmissionByCode('cost:dynaCost:handSnapshot')"
          @click="manualSnapshot"
        >手动快照</el-button>
        <el-button type="primary" @click="searchSnapshot">快照查询</el-button>
        <!-- 导出 -->
        <el-button
          type="primary"
          size="mini"
          v-if="$checkPersmissionByCode('cost:dynaCost:exportSubjectDynacostData')"
          @click="handleExport"
          style="padding: 8px 15px;"
        >{{$l('lbl_standared_subject_export')}}</el-button>
      </template>
      <template slot="form">
        <el-row>
          <ProjectSelector
            v-model="p_queryModel"
            :showTobe="false"
            :show="{group: true,company: true,dept: true, project: true,accObj:true}"
          >
            <template slot="projectSelectorButtons">
              <el-col :span="6" class="search-btn">
                <el-form-item>
                  <el-button
                    type="primary"
                    size="mini"
                    style="padding: 8px 15px;"
                    @click="search"
                  >{{$l("btn_search")}}</el-button>

                  <el-button
                    size="mini"
                    style="padding: 8px 15px;"
                    @click="reset"
                  >{{$l("btn_reset")}}</el-button>
                </el-form-item>
              </el-col>
            </template>
          </ProjectSelector>
        </el-row>
      </template>
    </mt-searchform>
    <div ref="contractPlanListTable">
      <el-tabs type="border-card" v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="合约规划维度" name="合约规划维度">
          <div>
            <el-table
              :data="tableData"
              stripe
              border
              :height="tHeight"
              tooltip-effect="dark"
              style="width: 100%"
              size="small"
            >
              <el-table-column prop="cpName" label="合约规划" show-overflow-tooltip width="150">
                <template slot-scope="scope">
                  <div
                    style="text-align:left;overflow: hidden;text-overflow: ellipsis;"
                  >{{ scope.row.cpName}}</div>
                </template>
              </el-table-column>

              <el-table-column width="150" prop="cpTotalAmount" label="合约规划总额(元)(A)">
                <template slot-scope="scope">{{ scope.row.cpTotalAmount|NumFormat}}</template>
              </el-table-column>
              <el-table-column
                width="120"
                prop="cpAmountOccurence"
                label="已发生金额(元)(B=C+D+E)"
                :disabled="true"
              >
                <template slot-scope="scope">{{ scope.row.cpAmountOccurence|NumFormat}}</template>
              </el-table-column>
              <el-table-column
                prop="contractTotalAmount"
                label="合同总额(元)(C)"
                width="150"
                :disabled="true"
              >
                <template slot-scope="scope">{{ scope.row.contractTotalAmount|NumFormat}}</template>
              </el-table-column>
              <el-table-column
                prop="changeVisaTotalAmount"
                label="变更签证总额(元)(D)"
                width="150"
                :disabled="true"
              >
                <template slot-scope="scope">{{ scope.row.changeVisaTotalAmount|NumFormat}}</template>
              </el-table-column>
              <el-table-column
                prop="nonContractTotalAmount"
                label="无合同费用总额(元)(E)"
                width="150"
                :disabled="true"
              >
                <template slot-scope="scope">{{ scope.row.nonContractTotalAmount|NumFormat}}</template>
              </el-table-column>
              <el-table-column
                prop="amountPendingApprove"
                label="在途金额(元)(F)"
                width="150"
                :disabled="true"
              >
                <template slot-scope="scope">{{ scope.row.amountPendingApprove|NumFormat}}</template>
              </el-table-column>
              <el-table-column
                prop="amountReleased"
                label="已释放金额(元)(G)"
                width="150"
                :disabled="true"
              >
                <template slot-scope="scope">{{ scope.row.amountReleased|NumFormat}}</template>
              </el-table-column>
              <el-table-column
                prop="amountPendingOccurence"
                label="待发生金额(元)(H=A-B-F-G)"
                width="150"
                :disabled="true"
              >
                <template slot-scope="scope">{{ scope.row.amountPendingOccurence|NumFormat}}</template>
              </el-table-column>
              <el-table-column
                prop="dynamicCost"
                label="动态成本金额(元)(I=B+F+H)"
                width="150"
                :disabled="true"
              >
                <template slot-scope="scope">{{ scope.row.dynamicCost|NumFormat}}</template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
        <el-tab-pane label="科目维度" name="科目维度">
          <div>
            <el-table
              :data="SubjectTableData"
              stripe
              border
              :row-style="showRow"
              :height="tHeight"
              tooltip-effect="dark"
              style="width: 100%"
              size="small"
            >
              <el-table-column prop="subjectCode" label="科目编码" width="150">
                <template slot-scope="scope">
                  <div
                    :style="{'width':'100%','text-align':'left','padding-left':(scope.row.level-1)*5+'px'}"
                  >
                    <i
                      :class="!scope.row._expanded &&!scope.row.isLeaf ? 'fa fa-plus-square-o' : 'fa fa-minus-square-o' "
                      style="font-size:14px;cursor:pointer;vertical-align: sub;"
                      v-show="!scope.row.isLeaf"
                      @click="handleExpandClick(scope.row.parentIds)"
                    ></i>
                    &nbsp;
                    <span
                      :title="scope.row.subjectCode"
                    >{{ scope.row.subjectCode | cutString(16) }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="sbName" label="科目名称" show-overflow-tooltip width="150">
                <template slot-scope="scope">
                  <div
                    style="text-align:left;text-align:left;overflow: hidden;text-overflow: ellipsis;"
                  >{{ scope.row.sbName}}</div>
                </template>
              </el-table-column>
              <el-table-column width="150" prop="targetCostTotalAmount" label="目标成本总额(元)(A)">
                <template slot-scope="scope">{{ scope.row.targetCostTotalAmount|NumFormat}}</template>
              </el-table-column>
              <el-table-column
                width="120"
                prop="targetCostAmountOccurence"
                label="已发生金额(元)(B=C+D+E)"
                :disabled="true"
              >
                <template slot-scope="scope">{{ scope.row.targetCostAmountOccurence|NumFormat}}</template>
              </el-table-column>
              <el-table-column
                prop="contractTotalAmount"
                label="合同总额(元)(C)"
                width="150"
                :disabled="true"
              >
                <template slot-scope="scope">{{ scope.row.contractTotalAmount|NumFormat}}</template>
              </el-table-column>
              <el-table-column
                prop="changeVisaTotalAmount"
                label="变更签证总额(元)(D)"
                width="150"
                :disabled="true"
              >
                <template slot-scope="scope">{{ scope.row.changeVisaTotalAmount|NumFormat}}</template>
              </el-table-column>
              <el-table-column
                prop="nonContractTotalAmount"
                label="无合同费用总额(元)(E)"
                width="150"
                :disabled="true"
              >
                <template slot-scope="scope">{{ scope.row.nonContractTotalAmount|NumFormat}}</template>
              </el-table-column>
              <el-table-column
                prop="amountPendingApprove"
                label="在途金额(元)(F)"
                width="150"
                :disabled="true"
              >
                <template slot-scope="scope">{{ scope.row.amountPendingApprove|NumFormat}}</template>
              </el-table-column>
              <el-table-column
                prop="amountReleased"
                label="已释放金额(元)(G)"
                width="150"
                :disabled="true"
              >
                <template slot-scope="scope">{{ scope.row.amountReleased|NumFormat}}</template>
              </el-table-column>
              <el-table-column
                prop="amountPendingOccurence"
                label="待发生金额(元)(H=A-B-F-G)"
                width="150"
                :disabled="true"
              >
                <template slot-scope="scope">{{ scope.row.amountPendingOccurence|NumFormat}}</template>
              </el-table-column>
              <el-table-column
                prop="dynamicCost"
                label="动态成本金额(元)(I=B+F+H)"
                width="150"
                :disabled="true"
              >
                <template slot-scope="scope">{{ scope.row.dynamicCost|NumFormat}}</template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <SearchSnapshotDialog
      v-if="snapshotList"
      :snapshotList="snapshotList"
      :accObjId="p_queryModel.accObjId"
      :activeName="this.activeName"
      @closeSnapshotList="closeSnapshotList"
    ></SearchSnapshotDialog>
  </div>
</template>

<script>
import { arrayToTree, treeToArrayHelper, treeToArray } from '@/utils/cost/treeHelper/'
import SearchSnapshotDialog from '@/views/cost/dynamicCost/SearchSnapshotDialog/'
import { NumFormat, Version, cutString } from '@/filters/cost/'
import { LoadingUtil } from '@/utils/common/LoadingUtil'
import { getDynacost, getSbDynacost, getTotalhistory } from '@/api/cost/DynamicCostAPI'
import { tableHeight } from '@/utils/common/index'
import ConstrctionTargetSelector from '@/components/cost/ConstrctionTargetSelector/'
import ProjectSelector from '@/components/cost/ProjectSelector/'
import DynamicCostTable from '@/views/cost/dynamicCost/DynamicCostTable'
import COSTENUM from '@/utils/cost/enum'
import COSTBUSINESS from '@/utils/cost/business'
export default {
  filters: {
    NumFormat, Version, cutString
  },
  data () {
    return {
      snapshotTime: '',
      snapshotList: false,
      activeName: '合约规划维度',
      tableHeight: '0',
      fullHeight: document.documentElement.clientHeight,
      id: '',
      p_queryModel: {
        companyId: '', // 可能是groupId ||  companyId || deptId
        projectId: '', // 项目id
        accObjId: '' // 成本分期id
      },
      queryModel: {
        companyId: '',
        projectId: '',
        splitStatus: '', // 拆分状态
        group: '', // 集团
        company: '', // 公司
        businessDept: '', // 事业部
        contractName: '', // 合同名称
        billType: '', // 单据类型
        accountingObjectId: '',
        stageId: '',
        pageNum: 1,
        pageSize: 20,
        count: 0
      },
      tableData: [],
      SubjectTableData: []

    }
  },
  components: {
    SearchSnapshotDialog,
    ConstrctionTargetSelector,
    DynamicCostTable,
    ProjectSelector

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
    // this.getList()
  },
  watch: {
    'p_queryModel': {
      handler (newValue, oldValue) {
        if (newValue.accObjId) {
          this.id = newValue.accObjId
        } else if (newValue.projectId) {
          this.id = newValue.projectId
        } else if (newValue.companyId) {
          this.id = newValue.companyId
        }
      }
    }
  },
  computed: {
    tHeight: function () {
      let options = {
        fullHeight: this.$store.getters.fullHeight,
        opened: this.$store.getters.sidebar.opened,
        showForm: this.$store.getters.showForm,
        obj: this,
        otherHeight: 200
      }
      return `${tableHeight(options)}px`
    }
  },
  methods: {
    showRow: function (row) { // 行隐藏
      const show = row.row._show
      return show ? 'animation:treeTableShow 1s;-webkit-animation:treeTableShow 1s;' : 'display:none;'
    },
    // 展开收起行
    handleExpandClick (parentIds) {
      let parentExpanded
      this.SubjectTableData.map(item => {
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
    searchSnapshot () {
      this.snapshotList = true
    },
    closeSnapshotList (val) {
      if (val && this.activeName === '合约规划维度') {
        this.snapshotTime = new Date(val.historyTime).format()
        let time = this.snapshotTime.split(' ')
        this.snapshotTime = time[0]
        this.tableData = val.dynaCostCpList
        let total_obj = { cpTotalAmount: 0, contractTotalAmount: 0, nonContractTotalAmount: 0, amountPendingApprove: 0, amountReleased: 0, amountPendingOccurence: 0, dynamicCost: 0, changeVisaTotalAmount: 0, cpAmountOccurence: 0 }
        this.tableData.forEach((item, index) => {
          total_obj.cpTotalAmount += eval(item.cpTotalAmount)
          total_obj.contractTotalAmount += eval(item.contractTotalAmount)
          total_obj.nonContractTotalAmount += eval(item.nonContractTotalAmount)
          total_obj.amountPendingApprove += eval(item.amountPendingApprove)
          total_obj.amountReleased += eval(item.amountReleased)
          total_obj.amountPendingOccurence += eval(item.amountPendingOccurence)
          total_obj.dynamicCost += eval(item.dynamicCost)
          total_obj.changeVisaTotalAmount += eval(item.changeVisaTotalAmount)
          total_obj.cpAmountOccurence += eval(item.cpAmountOccurence)

          total_obj.cpName = '合计'
        })
        this.tableData.unshift(total_obj)
      } else if (val && this.activeName === '科目维度') {
        this.snapshotTime = new Date(val.historyTime).format()
        let time = this.snapshotTime.split(' ')
        this.snapshotTime = time[0]

        // this.SubjectTableData = val.dynaCostCpList
        this.SubjectTableData = []
        if (val.dynaCostSBModelList) {
          let SubjectTableData = val.dynaCostSBModelList
          SubjectTableData.map(item => {
            item._expanded = true
            item._show = true
            item.level = 2
            item.isLeaf = true
            item.parentId = item.parentId || ''
            item.parentIds = (item.parentIds ? (item.parentIds + ',') : '') + item.id + ','
          })
          this.SubjectTableData = SubjectTableData
        }

        let total_obj = { dynamicCost: 0, targetCostTotalAmount: 0, targetCostAmountOccurence: 0, contractTotalAmount: 0, changeVisaTotalAmount: 0, nonContractTotalAmount: 0, amountReleased: 0, amountPendingApprove: 0, amountPendingOccurence: 0, cpAmountOccurence: 0 }
        this.SubjectTableData.forEach((item, index) => {
          total_obj.targetCostTotalAmount += eval(item.targetCostTotalAmount)
          total_obj.targetCostAmountOccurence += eval(item.targetCostAmountOccurence)
          total_obj.contractTotalAmount += eval(item.contractTotalAmount)
          total_obj.changeVisaTotalAmount += eval(item.changeVisaTotalAmount)
          total_obj.nonContractTotalAmount += eval(item.nonContractTotalAmount)
          total_obj.amountReleased += eval(item.amountReleased)
          total_obj.amountPendingApprove += eval(item.amountPendingApprove)
          total_obj.amountPendingOccurence += eval(item.amountPendingOccurence)
          total_obj.cpAmountOccurence += eval(item.cpAmountOccurence)
          total_obj.dynamicCost += eval(item.dynamicCost)
          total_obj.subjectCode = '合计'
          total_obj._expanded = true
          total_obj._show = true
          total_obj.level = 1
          total_obj.isLeaf = ''
          total_obj.parentId = ''
          total_obj.parentIds = ''
        })
        this.SubjectTableData.unshift(total_obj)
      }
      this.snapshotList = false
    },
    manualSnapshot () {
      if (this.activeName === '合约规划维度' && this.p_queryModel.accObjId) {
        LoadingUtil.showLoading()
        getTotalhistory({ 'accounting_obj_id': this.p_queryModel.accObjId }).then(response => {
          LoadingUtil.hideLoading()
          this.$showSuccess(response.data)
        })
      } else if (this.activeName === '科目维度' && this.p_queryModel.accObjId) {
        LoadingUtil.showLoading()
        getTotalhistory({ 'accounting_obj_id': this.p_queryModel.accObjId }).then(response => {
          LoadingUtil.hideLoading()
          this.$showSuccess(response.data)
        })
      } else if (!this.p_queryModel.accObjId) {
        return this.$showError('请输入成本分期')
      }
    },
    handleExport () {
      if (!this.p_queryModel.accObjId) {
        return this.$showError('请输入成本分期')
      }

      if (this.activeName === '合约规划维度') {
        COSTBUSINESS.download(process.env.COST_API + '/dynacost/exportTccpDynacostData?accounting_obj_id=' + this.p_queryModel.accObjId + '&snapshotTime=' + this.snapshotTime)
      } else if (this.activeName === '科目维度') {
        COSTBUSINESS.download(process.env.COST_API + '/dynacost/exportSubjectDynacostData?accounting_obj_id=' + this.p_queryModel.accObjId + '&snapshotTime=' + this.snapshotTime)
      }
    },
    handleClick (tab, event) {
      if (!this.p_queryModel.accObjId) {
        return this.$showError('请输入成本分期')
      }
      if (tab.label === '合约规划维度' && this.p_queryModel.accObjId) {
        this.getList()
      } else if (tab.label === '科目维度' && this.p_queryModel.accObjId) {
        this.getSubjectTableData()
      }
    },
    initTableData (response) {
      this.tableData = response.data ? response.data : []
      let total_obj = { cpTotalAmount: 0, contractTotalAmount: 0, nonContractTotalAmount: 0, amountPendingApprove: 0, amountReleased: 0, amountPendingOccurence: 0, dynamicCost: 0, changeVisaTotalAmount: 0, cpAmountOccurence: 0 }
      this.tableData.forEach((item, index) => {
        total_obj.cpTotalAmount += eval(item.cpTotalAmount)
        total_obj.contractTotalAmount += eval(item.contractTotalAmount)
        total_obj.nonContractTotalAmount += eval(item.nonContractTotalAmount)
        total_obj.amountPendingApprove += eval(item.amountPendingApprove)
        total_obj.amountReleased += eval(item.amountReleased)
        total_obj.amountPendingOccurence += eval(item.amountPendingOccurence)
        total_obj.dynamicCost += eval(item.dynamicCost)
        total_obj.changeVisaTotalAmount += eval(item.changeVisaTotalAmount)
        total_obj.cpAmountOccurence += eval(item.cpAmountOccurence)

        total_obj.cpName = '合计'
      })
      this.tableData.unshift(total_obj)
      //   this.tableData.forEach((item, index) => {
      //     item.allTotal = eval(item.cpTotalAmount + item.cpAmountOccurence + item.contractTotalAmount + item.changeVisaTotalAmount +
      //     item.nonContractTotalAmount + item.amountPendingApprove + item.amountReleased + item.amountPendingOccurence + item.dynamicCost)
      //     debugger
      //   })
    },
    settingTableHeight: function () {
      const topHeight = this.$refs['contractPlanListTable'].getBoundingClientRect().top
      this.tableHeight = this.fullHeight - topHeight - 80
      this.$refs['contractPlanListTable'].style.Height = this.tableHeight + 'px'
    },
    getSubjectTableData () {
      LoadingUtil.showLoading()
      getSbDynacost({ 'accounting_obj_id': this.p_queryModel.accObjId }).then(response => {
        LoadingUtil.hideLoading()
        this.SubjectTableData = []
        if (response.data) {
          let SubjectTableData = response.data
          SubjectTableData.map(item => {
            item._expanded = true
            item._show = true
            item.level = 2
            item.isLeaf = true
            item.parentId = item.parentId || ''
            item.parentIds = (item.parentIds ? (item.parentIds + ',') : '') + item.id + ','
          })
          this.SubjectTableData = SubjectTableData
        }

        let total_obj = { dynamicCost: 0, targetCostTotalAmount: 0, targetCostAmountOccurence: 0, contractTotalAmount: 0, changeVisaTotalAmount: 0, nonContractTotalAmount: 0, amountReleased: 0, amountPendingApprove: 0, amountPendingOccurence: 0, cpAmountOccurence: 0 }
        this.SubjectTableData.forEach((item, index) => {
          total_obj.targetCostTotalAmount += eval(item.targetCostTotalAmount)
          total_obj.targetCostAmountOccurence += eval(item.targetCostAmountOccurence)
          total_obj.contractTotalAmount += eval(item.contractTotalAmount)
          total_obj.changeVisaTotalAmount += eval(item.changeVisaTotalAmount)
          total_obj.nonContractTotalAmount += eval(item.nonContractTotalAmount)
          total_obj.amountReleased += eval(item.amountReleased)
          total_obj.amountPendingApprove += eval(item.amountPendingApprove)
          total_obj.amountPendingOccurence += eval(item.amountPendingOccurence)
          total_obj.cpAmountOccurence += eval(item.cpAmountOccurence)
          total_obj.dynamicCost += eval(item.dynamicCost)
          total_obj.subjectCode = '合计'
          total_obj._expanded = true
          total_obj._show = true
          total_obj.level = 1
          total_obj.isLeaf = ''
          total_obj.parentId = ''
          total_obj.parentIds = ''
        })
        this.SubjectTableData.unshift(total_obj)
        // this.queryObj.count = response.data.totalElements
      }).catch(error => {
        console.log(error)
        this.$showError(error.message ? error.message : 'msg_system_error')
      })
    },
    getList () {
      LoadingUtil.showLoading()

      getDynacost({ 'accounting_obj_id': this.p_queryModel.accObjId }).then(response => {
        LoadingUtil.hideLoading()
        this.initTableData(response)
        // this.queryObj.count = response.data.totalElements
      }).catch(error => {
        console.log(error)
        this.$showError(error.message ? error.message : 'msg_system_error')
      })
    },
    reset () {
      this.p_queryModel.accObjId = ''
      this.p_queryModel.companyId = ''
      this.p_queryModel.projectId = ''
    },
    search () {
      if (!this.p_queryModel.accObjId) {
        return this.$showError('请输入成本分期')
      } else {
        if (this.activeName === '合约规划维度') {
          this.getList()
        } else {
          this.getSubjectTableData()
        }
      }
    }
  }
}

</script>
<style scoped>
</style>
