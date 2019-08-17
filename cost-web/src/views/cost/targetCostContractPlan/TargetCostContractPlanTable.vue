<!-- TargetCostCompilationTable -->
<template>
  <div ref="targetCostCompilationTable">
    <el-table
      :data="tableData"
      stripe
      border
      size="small"
      tooltip-effect="dark"
      :row-style="showRow"
      :height="tHeight"
      style="width: 100%"
    >
      <!-- 序号 -->
      <el-table-column prop="pageIndex" :label="this.$l('lbl_no')" width="50"></el-table-column>

      <!-- 成本分期 -->
      <el-table-column
        prop="accountingObjectName"
        :label="'成本分期'"
        show-overflow-tooltip
        width="300"
      >
        <template slot-scope="scope">
          <div style="text-align:left" :title="scope.row.accountingObjectName">
            <i
              :class="!scope.row._expanded ? 'fa fa-plus-square-o' : 'fa fa-minus-square-o' "
              :title="!scope.row._expanded ? '展开' : '收起'"
              style="font-size:14px;font-weight:bold;cursor:pointer"
              v-show="scope.row._showExpanded"
              @click="handleExpandClick(scope.row)"
            ></i>
            &nbsp;&nbsp; {{scope.row.accountingObjectName |cutString(24)}}
          </div>
        </template>
      </el-table-column>
      <!-- 类型 -->
      <!-- <el-table-column prop="stageVersion"
                             :label="'类型'"
                             width="160">
                <template slot-scope="scope">
                    {{scope.row.stageVersion === '0'?'规划编制':'规划调整'}}
                </template>
      </el-table-column>-->
      <!-- 阶段 -->
      <el-table-column prop="projectStageName" :label="'阶段'">
        <template slot-scope="scope">{{selectData.cost_stage_id[scope.row.stageId]}}</template>
      </el-table-column>
      <!-- 目标成本总额(含税) -->
      <el-table-column prop="contractPlanAmountIncludeTax" :label="'合约成本总额(含税)(元)'" width="180">
        <template slot-scope="scope">{{ scope.row.contractPlanAmountIncludeTax|NumFormat}}</template>
      </el-table-column>
      <!-- 版本 -->
      <el-table-column prop="version" :label="'版本'">
        <template slot-scope="scope">{{scope.row.stageVersion |Version}}</template>
      </el-table-column>
      <!-- 编制日期 -->
      <el-table-column
        prop="updatedDate"
        width="100"
        :label="'编制日期'"
        :formatter="this.$dateFormat("updatedDate","yyyy-MM-dd")"
      ></el-table-column>
      <!-- 状态 -->
      <el-table-column prop="status" width="150" :label="'审批状态'">
        <template slot-scope="scope">
          <!-- 非正常草稿 -->
          <span v-if="scope.row.status === '4'">草稿</span>
          <span v-if="scope.row.status !== '4'">{{selectData.cost_flow_status[scope.row.status]}}</span>
        </template>
      </el-table-column>
      <!-- 操作 -->
      <el-table-column :label="this.$l('lbl_operation')">
        <template slot-scope="scope">
          <el-row>
            <!-- <el-col :span="12"
            style="text-align:left">-->
            <!-- 查看 -->
            <el-button
              size="mini"
              type="text"
              icon="el-icon-view"
              :title="$l('btn_detail')"
              @click="viewRow(scope.$index, scope.row)"
            ></el-button>
            <!-- 调整 -->
            <el-button
              size="mini"
              v-if="scope.row.status === '2' && !scope.row._showExpanded && $checkPersmissionByCode('saveOrUpdateContractPlan')"
              :disabled="scope.row.stageId === '1'"
              type="text"
              icon="fa fa-adjust"
              :title="'调整'"
              @click="adjustRow(scope.$index, scope.row)"
            ></el-button>

            <!-- 编辑 -->
            <el-button
              size="mini"
              v-if="(scope.row.status === '0' || scope.row.status === '3')  && $checkPersmissionByCode('saveOrUpdateContractPlan') "
              type="text"
              icon="el-icon-edit"
              :title="$l('btn_edit')"
              @click="editRow(scope.$index, scope.row)"
            ></el-button>

            <!-- 删除 scope.row.status === '4'为非正常草稿 -->
            <el-button
              size="mini"
              v-if="(scope.row.status === '0' || scope.row.status === '3')  && scope.row.autoCreate!=='1'  && $checkPersmissionByCode('deleteTargetCostContractPlan')"
              :disabled="scope.row.status === '4'"
              type="text"
              icon="el-icon-delete"
              :title="$l('btn_delete')"
              @click="deleteRow(scope.$index, scope.row)"
            ></el-button>
            <!-- </el-col> -->
            <!-- <el-col :span="12"
                                style="text-align:left">
                            <el-button size="mini"
                                       :title="'审批通过'"
                                       type="text"
                                       @click="changRowFlow(scope.$index, scope.row,'2')">通过</el-button>
                            <el-button size="mini"
                                       :title="'审批驳回'"
                                       type="text"
                                       @click="changRowFlow(scope.$index, scope.row,'3')">驳回</el-button>
            </el-col>-->
          </el-row>
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
import {
  getVersionlistAll, //获取带分页列表
  deleteTargetCostContractPlan, //删除编制
  setFlowStatus,
  checkAdjustStageVersion//检查是否可以调整accounting_object_id,stage_id
} from '@/api/cost/targetCostContractPlanAPI'
import { NumFormat, Version, cutString } from '@/filters/cost/'
import { deepCopy } from '@/utils/cost/objectHelper'
import { tableHeight } from '@/utils/common/index'
import { getLocalItem, setLocalItem, removeLocalItem } from '@/utils/common/cache'
export default {
  props: {
    queryObj_passed_in: {
      type: Object
    }
  },
  filters: {
    NumFormat,
    Version,
    cutString
  },
  data () {
    return {
      selectData: {
        cost_flow_status: [],
        cost_stage_id: []
      },
      tableData: [],
      queryObj: this.queryObj_passed_in,
      tableHeight: '0',
      fullHeight: document.documentElement.clientHeight
    }
  },
  computed: {
    tHeight: function () {
      let options = {
        fullHeight: this.$store.getters.fullHeight,
        opened: this.$store.getters.sidebar.opened,
        showForm: this.$store.getters.showForm,
        obj: this
      }
      return `${tableHeight(options)}px`
    }
  },
  methods: {
    initTableDataNew (response) {
      this.tableData = []
      if (response && response.data.content) {
        response.data.content.map((item, index) => {
          item._expanded = false
          item._show = true
          item.accountingObjectText = item.accountingObjectName
          item.pageIndex = this.queryObj.pageSize * (this.queryObj.pageNum - 1) + index + 1
          if (item.children) item._showExpanded = true
          this.tableData.push(item)
          if (item.children) {
            item.children.accountingObjectText = item.accountingObjectName
            item.children.accountingObjectName = ''
            item.children._show = false
            this.tableData.push(item.children)
          }
        })
      }
    },
    initTableData (response) {
      let defaultExpand = false //默认展开
      let accountingObjectList = []
      let preAccountId = ''

      // 获取所有成本分期
      response.data.content.map(item => {
        item.accountingObjectText = item.accountingObjectName
        if (item.accountingObjectId !== preAccountId) {
          // 存入成本分期
          accountingObjectList.push({
            id: item.accountingObjectId,
            text: item.accountingObjectText,
          })
        }
        preAccountId = item.accountingObjectId
      })


      // 清洗数据
      console.info(accountingObjectList)
      let filterData = []
      let validStats = ['0', '4', '1', '2', '3'] //需要显示的状态：草稿(0,4)、审批中1、已审核2
      accountingObjectList.map(item => {
        let _accountData = response.data.content.filter(item1 => { return item1.accountingObjectId === item.id })
        //console.log(_accountData)
        if (_accountData) {
          if (_accountData.length === 1) {
            // 一条数据直接插入
            if (validStats.indexOf(_accountData[0].status) > -1) filterData.push(_accountData[0])
          } else {
            // 查找 已审核status===2的数据
            // 多条则取“最新阶段stageId的最新版本stageVersion”，并取》=最新阶段的最新版本数据“非审核status!==2”数据
            // 没有已审核则取最新“最新阶段stageId的最新版本stageVersion” 的“草稿status===0”“审批中status===1”

            // 找到已经审核
            let _status2AccountData = _accountData.filter(item2 => { return item2.status === '2' })
            if (_status2AccountData && _status2AccountData.length > 0) {
              //插入已审核
              filterData.push(_status2AccountData[_status2AccountData.length - 1])
            }

            //找到已驳回
            let _status3AccountData = _accountData.filter(item5 => { return item5.status === '3' })
            if (_status3AccountData && _status3AccountData.length > 0) {
              //插入已驳回
              filterData.push(_status3AccountData[_status3AccountData.length - 1])
            }

            // 找到审批中
            let _status1AccountData = _accountData.filter(item4 => { return item4.status === '1' })
            if (_status1AccountData && _status1AccountData.length > 0) {
              //插入审批中
              filterData.push(_status1AccountData[_status1AccountData.length - 1])
            } else {
              // 找到草稿
              let _status04AccountData = _accountData.filter(item3 => { return item3.status === '0' || item3.status === '4' })
              if (_status04AccountData && _status04AccountData.length > 0) {
                //插入草稿
                filterData.push(_status04AccountData[_status04AccountData.length - 1])
              }
            }
          }
        }
      })


      // 子级别名称为空
      preAccountId = ''
      filterData.map(item => {
        item.accountingObjectText = item.accountingObjectName
        if (item.accountingObjectId === preAccountId) {
          item.accountingObjectName = ''
        }
        preAccountId = item.accountingObjectId
        item._showExpanded = true
        //默认收起
        if (!defaultExpand) {
          item._expanded = item.accountingObjectName === ''
          item._show = item.accountingObjectName !== ''
        } else {
          item._expanded = true
          item._show = true
        }
      })


      // 显示隐藏
      filterData.map(item => {
        let _saveAccountingObject = filterData.find(acctCountItem => { return acctCountItem.accountingObjectId === item.accountingObjectId && acctCountItem.accountingObjectName === '' })
        item.timeSpan = new Date(item.updatedDate).getTime()
        item._showExpanded = _saveAccountingObject && item.accountingObjectName !== '' ? true : false
      })

      // 成本分期按第一条的时间排序
      let filterDataOrder = filterData.filter(item => item.accountingObjectName !== '')
      filterDataOrder.sort((item1, item2) => {
        return item2.timeSpan - item1.timeSpan
      })
      let tempData = deepCopy(filterDataOrder)
      let _count = 1
      for (let i = 0; i < tempData.length; i++) {
        let childItem = filterData.find(acctCountItem => { return acctCountItem.accountingObjectId === tempData[i].accountingObjectId && acctCountItem.accountingObjectName === '' })
        if (childItem) {
          filterDataOrder.splice(i + _count, 0, childItem)
          _count++
        }
      }
      tempData = null
      filterData = null
      accountingObjectList = null

      // 返回数据
      this.tableData = filterDataOrder
    },
    showRow: function (row) {
      // 行隐藏
      const show = row.row._show
      return show ? 'animation:treeTableShow 1s;-webkit-animation:treeTableShow 1s;' : 'display:none;'
    },
    handleExpandClick (rowData) {
      let parentExpanded
      this.tableData.map(item => {
        if (item.accountingObjectId === rowData.accountingObjectId && item.accountingObjectName !== '') {
          item._expanded = !item._expanded
          parentExpanded = item._expanded
        }
        if (item.accountingObjectId === rowData.accountingObjectId && item.accountingObjectName === '') {
          item._show = parentExpanded
          item._expanded = parentExpanded
        }
      })
    },
    getList () {
      LoadingUtil.showLoading()
      // 转换参数
      let _queryObj = {
        companyId: this.queryObj.accObjId?null:this.queryObj.companyId,
        accountingObjectId: this.queryObj.accObjId,
        stageId: this.queryObj.stageId,
        status: this.queryObj.status,
        pageNum: this.queryObj.pageNum,
        pageSize: this.queryObj.pageSize

      }

      getVersionlistAll(_queryObj)
        .then(response => {
          LoadingUtil.hideLoading()
          this.initTableDataNew(response)
          this.queryObj.count = response.data.totalElements
        })
        .catch(error => {
          console.log(error)
          this.$showError(error.message ? error.message : 'msg_system_error')
        })
    },
    //调整
    adjustRow (index, rowData) {
      checkAdjustStageVersion(
        {
          'accountingObjectId': rowData.accountingObjectId,
          'stageId': rowData.stageId
        }
      )
        .then(response => {
          if (!response.message && response.code === '2000') {
            this.$router.push({
              name: 'NewOrUpdateTargetCostContractPlanAdjustment',
              query: {
                isAdjust: true,//是否调整
                accountingObjectId: rowData.accountingObjectId,
                accountingObjectName: rowData.accountingObjectName ? rowData.accountingObjectName : rowData.accountingObjectText,
                contractPlanAmountIncludeTax: rowData.contractPlanAmountIncludeTax,
                updatedBy: rowData.updatedBy,
                createdBy: rowData.createdBy,
                status: rowData.status,
                contractPlanAmountExcludeTax: rowData.contractPlanAmountExcludeTax,
                updatedDate: rowData.updatedDate,
                createdDate: rowData.createdDate,
                auditApprovalDate: rowData.auditApprovalDate,
                stageVersion: rowData.stageVersion,
                stageId: rowData.stageId,
                isEdit: true,
                isNewAdjust: true //新增调整
              }
            })
          } else {
            this.$showError(response.message)
          }
        })
        .catch(error => {
          console.log(error)
          this.$showError(error.message ? error.message : 'msg_system_error')
        })
    },
    // 查看
    viewRow (index, rowData) {
      this.$router.push({
        name: rowData.stageVersion === '0' ? 'NewOrUpdateTargetCostContractPlan' : 'NewOrUpdateTargetCostContractPlanAdjustment',
        query: {
          accountingObjectId: rowData.accountingObjectId,
          accountingObjectName: rowData.accountingObjectName ? rowData.accountingObjectName : rowData.accountingObjectText,
          contractPlanAmountIncludeTax: rowData.contractPlanAmountIncludeTax,
          updatedBy: rowData.updatedBy,
          createdBy: rowData.createdBy,
          status: rowData.status,
          contractPlanAmountExcludeTax: rowData.contractPlanAmountExcludeTax,
          updatedDate: rowData.updatedDate,
          createdDate: rowData.createdDate,
          auditApprovalDate: rowData.auditApprovalDate,
          stageVersion: rowData.stageVersion,
          stageId: rowData.stageId,
          isEdit: false
        }
      })
    },
    // 编辑
    editRow (index, rowData) {
      this.$router.push({
        name: rowData.stageVersion === '0' ? 'NewOrUpdateTargetCostContractPlan' : 'NewOrUpdateTargetCostContractPlanAdjustment',
        query: {
          accountingObjectId: rowData.accountingObjectId,
          accountingObjectName: rowData.accountingObjectName ? rowData.accountingObjectName : rowData.accountingObjectText,
          contractPlanAmountIncludeTax: rowData.contractPlanAmountIncludeTax,
          updatedBy: rowData.updatedBy,
          createdBy: rowData.createdBy,
          status: rowData.status,
          contractPlanAmountExcludeTax: rowData.contractPlanAmountExcludeTax,
          updatedDate: rowData.updatedDate,
          createdDate: rowData.createdDate,
          auditApprovalDate: rowData.auditApprovalDate,
          stageVersion: rowData.stageVersion,
          stageId: rowData.stageId,
          isEdit: true
        }
      })
    },
    deleteRow (index, rowData) {
      this.$confirm('确认删除该记录', {
        confirmButtonText: this.$l('btn_confirm'),
        cancelButtonText: this.$l('btn_cancel'),
        type: 'warning'
      }).then(() => {
        deleteTargetCostContractPlan(rowData)
          .then(response => {
            this.$showSuccess(response.message)
            //if (response.status !== '404') this.$delete(this.tableData, index)
            this.getList()
          })
          .catch(error => {
            console.log(error)
            this.$showError(error.message ? error.message : 'msg_system_error')
          })
      })
        .catch(() => { })
    },
    // 流程处理
    changRowFlow (index, rowData, flowStatus) {
      setFlowStatus({ id: rowData.id, status: flowStatus })
        .then(response => {
          this.$showSuccess(response.message)
          this.getList()
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
    },
    settingTableHeight: function () {
      const topHeight = this.$refs['targetCostCompilationTable'].getBoundingClientRect().top
      this.tableHeight = this.fullHeight - topHeight - 80
      this.$refs['targetCostCompilationTable'].style.Height = this.tableHeight + 'px'
    }
  },
  mounted: function () {
    this.$nextTick(function () {
      this.settingTableHeight()
    })
    // window.onresize = () => {
    //   return (() => {
    //     this.fullHeight = document.documentElement.clientHeight
    //   })()
    // }

    // 字典
    let allDICTIONARY = getLocalItem("DICTIONARY")
    allDICTIONARY = JSON.parse(allDICTIONARY)

    allDICTIONARY['cost_stage_id'].map(item => {
      this.selectData.cost_stage_id[item.dictValue] = item.dictLabelCn
    })
    allDICTIONARY['cost_flow_status'].map(item => {
      this.selectData.cost_flow_status[item.dictValue] = item.dictLabelCn
    })
  },
  watch: {
    fullHeight (val) {
      this.settingTableHeight()
    }
  }
}

</script>
<style lang='scss' scoped>
</style>
