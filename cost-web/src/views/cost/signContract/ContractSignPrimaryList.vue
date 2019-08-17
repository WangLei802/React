<!-- StandaredSubjectList.vue -->
<template>
  <div class="app-container">
    <mt-searchform>
      <template slot="buttons">
        <el-button
          size="mini"
          icon="el-icon-plus"
          type="primary"
          v-if="$checkPersmissionByCode('cost:contract:saveOrUpdate')"
          @click="handleAddRow"
        >{{$l("btn_add")}}</el-button>
      </template>

      <template slot="form">
        <el-row :inline="true">
          <el-col :span="24">
            <ProjectSelector v-model="queryModel">
              <template slot="projectSelectorButtons">
                <el-col :span="6" class="search-btn">
                  <el-form-item>
                    <el-button size="mini" type="primary" @click="search">{{$l("btn_search")}}</el-button>
                    <el-button @click="reset">{{$l("btn_reset")}}</el-button>
                  </el-form-item>
                </el-col>
              </template>
              <!--合同其他查询组件-->
              <template slot="after">
                <el-col :span="6" v-if="active === '0'">
                  <el-form-item :label="'合同类型：'">
                    <fd-select
                      v-model="queryModel.contractType"
                      placeholder="请选择"
                      type="cost_contract_type"
                    ></fd-select>
                  </el-form-item>
                </el-col>

                <el-col :span="6" v-if="active === '0'">
                  <el-form-item :label="'合同名称：'">
                    <el-input v-model="queryModel.contractName" placeholder="合同名称"></el-input>
                  </el-form-item>
                </el-col>

                <el-col :span="6" v-if="active === '0'">
                  <el-form-item :label="'审批状态：'">
                    <fd-select
                      v-model="queryModel.contractStatus"
                      placeholder="请选择"
                      type="cost_contract_status"
                    ></fd-select>
                  </el-form-item>
                </el-col>
              </template>
            </ProjectSelector>
          </el-col>
        </el-row>

        <!--<el-form-item>-->
        <!--<f-button class="special-btn"-->
        <!--type='primary'-->
        <!--@click='search'-->
        <!--label="btn_search"></f-button>-->
        <!--</el-form-item>-->
      </template>
    </mt-searchform>

    <el-tabs type="border-card" v-model="active" @tab-click="handleClick">
      <el-tab-pane name="0">
        <span slot="label">
          <i class="el-icon-date"></i> 合同列表
        </span>
        <div ref="contractSignListTable">
          <el-table
            :data="tableData"
            stripe
            border
            tooltip-effect="dark"
            style="width: 100%"
            size="small"
            :height="tHeight"
          >
            <el-table-column :label="$l('lbl_no')" width="50" type="index"></el-table-column>
            <el-table-column prop="contractType" label="合同类型" show-overflow-tooltip width="100">
              <template slot-scope="scope">
                <fd-label :code="scope.row.contractType" type="cost_contract_type"></fd-label>
              </template>
            </el-table-column>
            <el-table-column prop="contractCode" show-overflow-tooltip label="合同编号" width="120"></el-table-column>
            <el-table-column prop="contractName" label="合同名称" show-overflow-tooltip width="120"></el-table-column>
            <el-table-column width="100" prop="isPrimary" label="合同性质">
              <template slot-scope="scope">
                <span v-if="scope.row.isPrimary  ==='1' ">主合同</span>
                <span v-else-if="scope.row.isPrimary  ==='0' ">补充合同</span>
              </template>
            </el-table-column>
            <el-table-column width="150" prop="contractAmountIncludeTax" label="合同金额(含税)(元)">
              <template slot-scope="scope">{{ scope.row.contractAmountIncludeTax|NumFormat}}</template>
            </el-table-column>
            <el-table-column
              width="100"
              prop="dateOfContract"
              :formatter="this.$dateFormat("dateOfContract","yyyy-MM-dd")"
              label="签约日期"
            ></el-table-column>
            <el-table-column prop="projectName" show-overflow-tooltip label="所属项目"></el-table-column>
            <el-table-column width="60" prop="contractStatus" label="状态">
              <template slot-scope="scope">
                <span v-if="scope.row.contractStatus  ==='1' ">审批中</span>
                <span v-else-if="scope.row.contractStatus  ==='0'  ">草稿</span>
                
                <span v-else-if="scope.row.contractStatus  ==='2' ">已审批</span>
                <span v-else-if="scope.row.contractStatus  ==='3' ">签订-草稿</span>
                <span v-else-if="scope.row.contractStatus  ==='4' ">签订-审批中</span>
                <span v-else-if="scope.row.contractStatus  ==='5' ">已签订</span>
                <span v-else-if="scope.row.contractStatus  ==='6'  ">审批驳回</span>
                
                <span v-else-if="scope.row.contractStatus  ==='7'  ">签订审批驳回</span>
              </template>
            </el-table-column>
            <el-table-column width="150" :label="$l('lbl_operation')" fixed="right">
              <template slot-scope="scope">
                <el-button
                  size="small"
                  v-if="(scope.row.contractStatus === '0' || scope.row.contractStatus === '6') && $checkPersmissionByCode('cost:contract:saveOrUpdate')"
                  type="text"
                  icon="el-icon-edit"
                  :title="$l('btn_edit')"
                  @click="editRow(scope.$index, scope.row)"
                ></el-button>
                <el-button size="mini"
                     type="text"
                     icon="el-icon-menu"
                     v-if="(scope.row.isProcedureApproval === '1' && scope.row.contractStatus  ==='5')"
                     title="财务共享编辑"
                     @click="newIcon(scope.$index, scope.row)"></el-button>
                <!-- 删除 -->
                <el-button
                  size="small"
                  v-if="(scope.row.contractStatus === '0' || scope.row.contractStatus === '6') && $checkPersmissionByCode('cost:contract:delete')"
                  type="text"
                  icon="el-icon-delete"
                  :title="$l('btn_delete')"
                  @click="deleteRow(scope.$index, scope.row)"
                ></el-button>
                <!-- 签订 -->
                <el-button
                  size="small"
                  v-if="(scope.row.contractStatus === '2' || scope.row.contractStatus === '3') && $checkPersmissionByCode('cost:contract:saveSignInfo') "
                  type="text"
                  @click="signRow(scope.$index, scope.row)"
                >签订</el-button>

                <!-- 查看 -->
                <el-button
                  size="small"
                  type="text"
                  icon="el-icon-view"
                  :title="$l('btn_detail')"
                  @click="checkRow(scope.$index, scope.row)"
                ></el-button>

                <!--为了方便测试  跳过BPM审核流程，后期对接完bPM删除两个按钮-->
                <!--<el-button size="small"-->
                <!--v-if="scope.row.contractStatus === '1' "-->
                <!--type="text"-->
                <!--@click="bpmAuditPass(scope.$index, scope.row)">审核通过</el-button>-->
                <el-button
                  size="small"
                  v-if="scope.row.needAdditionalRecordingCp === '1' && $checkPersmissionByCode('cost:contract:saveAdditionalRecordingCp')"
                  type="text"
                  @click="additionalRecordingCp(scope.$index, scope.row)"
                >补录</el-button>

                <!--  <el-button size="small"
                                         v-if="scope.row.contractStatus === '4' "
                                         type="text"
                @click="signAuditPass(scope.$index, scope.row)">签订审核通过</el-button>-->
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
      </el-tab-pane>
      <el-tab-pane label="定标结果清单" name="1">
        <CalibrationResultsList ref="contractSignList" @input="input" v-model="queryObj" :initData="initData"></CalibrationResultsList>
      </el-tab-pane>
      <el-tab-pane label="费控合同信息" name="2">
        <CalibrationFeeInfor :initData="initData" v-model="query"></CalibrationFeeInfor>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { NumFormat, Version } from '@/filters/cost/'
import { LoadingUtil } from '@/utils/common/LoadingUtil'
import { getContractList, deleteContractController, getContractDetail, bpmAudit } from '@/api/cost/signContractAPI'
import ProjectAccountingTargetTreeSelector from '@/components/cost/ProjectAccountingTargetTreeSelector/'
import CalibrationFeeInfor from '@/views/cost/signContract/CalibrationFeeInfor/'
import CalibrationResultsList from '@/views/cost/signContract/CalibrationList/'
import ProjectSelector from '@/components/cost/ProjectSelector/'
import TargetCostCompilationTable from '@/views/cost/targetCostCompilation/TargetCostCompilationTable'
import COSTENUM from '@/utils/cost/enum'
import { tableHeight } from '@/utils/common/index'
export default {
  filters: {
    NumFormat, Version
  },
  data () {
    return {
      initData: {},
      active: 0,
      queryModel: {
        contractStatus: '',
        pageNum: 1,
        pageSize: 20,
        count: 0,
        contractType: '',
        contractName: '',
        companyId: '',
        projectId: ''

      },
      queryObj: {
        pageNum: 1,
        pageSize: 20,
        count: 0
      },
      query: {
        pageNum: 1,
        pageSize: 20,
        count: 0
      },
      tableData: []
    }
  },
  computed: {
    tHeight: function () {
      let options = {
        fullHeight: this.$store.getters.fullHeight,
        opened: this.$store.getters.sidebar.opened,
        showForm: this.$store.getters.showForm,
        obj: this,
        otherHeight: 240
      }
      return `${tableHeight(options)}px`
    }
  },
  components: {
    ProjectAccountingTargetTreeSelector,
    CalibrationResultsList,
    CalibrationFeeInfor,
    ProjectSelector,
    TargetCostCompilationTable
  },
  mounted () {
    this.search()
  },
  watch: {
    'active': {
      handler (newValue, oldValue) {
        this.active = newValue
      },
      deep: true
    }

  },
  methods: {
    input(data){
      this.queryObj = data
      this.search()
    },
    handleSizeChange (val) {
      this.queryObj.pageSize = val
      this.search()
    },
    handleCurrentChange (val) {
      this.queryObj.pageNum = val
      this.search()
    },
    handleClick (tab, event) {
      this.active = tab.name
      if (this.active === '1') {
        this.queryObj.pageNum = 1
        this.queryObj.pageSize = 20
        this.queryObj.count = 0
      } else if (this.active === '2') {
        this.query.pageNum = 1
        this.query.pageSize = 20
        this.query.count = 0
      }

      this.search()
    },
    editRow (index, rowData) {
      if (rowData.id) {
        // getContractDetail({ 'contractId': rowData.id }).then(response => {
        //   this.$router.push({
        //     name: 'NewContractInformation',
        //     query: {
        //       contractId: rowData.id,
        //       isOrEdit: true,
        //       contractStatus: rowData.contractStatus,
        //       contractSource: rowData.contractSource,
        //       signOrEdit: false
        //     }
        //   })
        // }).catch(error => {
        //   console.log(error)
        //   this.$showError(error.message ? error.message : 'msg_system_error')
        // })
        this.$router.push({
          name: 'NewContractInformation',
          query: {
            contractId: rowData.id,
            isOrEdit: true,
            contractStatus: rowData.contractStatus,
            contractSource: rowData.contractSource,
            signOrEdit: false,
            costBiddingId: rowData.costBiddingId,
            activeName: '0',
            costControlId: rowData.costControlContractId,
            isFlag:true,
          }
        })
      }
    },
    newIcon(index,rowData){
        this.$router.push({
        name: 'NewContractInformation',
        query: {
          contractId: rowData.id,
          isOrEdit: false, // 详情页面是否可以编辑
          contractStatus: rowData.contractStatus,
          signOrEdit: false, // signOrEdit
          contractSource: rowData.contractSource,
          activeName: '2',
          isFlag:false
          // contractId: rowData.id,
          // isOrEdit: false,
          // contractStatus: rowData.contractStatus,
          // contractSource: rowData.contractSource,
          // signOrEdit: false,
          // costBiddingId: rowData.costBiddingId,
          // activeName: '0',
          // costControlId: rowData.costControlContractId
        }
      })
    },
    checkRow (index, rowData) {
      this.$router.push({
        name: 'NewContractInformation',
        query: {
          contractId: rowData.id,
          isOrEdit: false,
          contractStatus: rowData.contractStatus,
          contractSource: rowData.contractSource,
          signOrEdit: false,
          costBiddingId: rowData.costBiddingId,
          activeName: '0',
          costControlId: rowData.costControlContractId,
          isFlag:true
        }
      })
    },
    bpmAuditPass (index, rowData) {
      bpmAudit({ 'id': rowData.id, 'contractStatus': '2' }).then(response => {
        LoadingUtil.hideLoading()
        this.$showSuccess(response.message)
        this.search()
      }).catch(error => {
        console.log(error)
        this.$showError(error.message ? error.message : 'msg_system_error')
      }).catch(() => { })
    },

    additionalRecordingCp (index, rowData) {
      this.$router.push({
        name: 'NewContractInformation',
        query: {
          contractId: rowData.id,
          isOrEdit: false,
          contractStatus: rowData.contractStatus,
          contractSource: rowData.contractSource,
          signOrEdit: false,
          costBiddingId: rowData.costBiddingId,
          activeName: '0',
          costControlId: rowData.costControlContractId,
          additionalRecording: true,
          isFlag:true
        }
      })
    },

    signAuditPass (index, rowData) {
      bpmAudit({ 'id': rowData.id, 'contractStatus': '5' }).then(response => {
        LoadingUtil.hideLoading()
        this.$showSuccess(response.message)
        this.search()
      }).catch(error => {
        console.log(error)
        this.$showError(error.message ? error.message : 'msg_system_error')
      }).catch(() => { })
    },

    getContractData () {

    },
    handleAddRow () {
      this.$router.push({
        name: 'NewContractInformation',
        query: {
          isOrEdit: true,
          contractSource: '0',
          contractStatus: '0',
          isFlag:true
        }
      })
    },

    updateMessage (item) {
      if (item.type === COSTENUM.projectTreeType.TREE_NODE_ACC_OBJ) {
        this.queryModel.accountingObjectId = item.accountingObjectId
        this.queryModel.companyId = item.companyId
      } else {
        this.queryModel.accountingObjectId = ''
        this.queryModel.companyId = item.id
      }
    },
    add () {
      this.$router.push({
        name: 'NewOrUpdateTargetCostCompilation',
        query: {
          type: 0,
          isEdit: true
        }
      })
    },
    initVM () {
      this.queryModel.pageNum = 1
      this.queryModel.count = 0
      this.queryModel.pageSize = 20
    },

    reset () {
      this.queryModel.companyId = ''
      this.queryModel.projectId = ''
      this.queryModel.contractType = ''
      this.queryModel.contractName = ''
      this.queryModel.contractStatus = ''
    },
    deleteRow (index, rowData) {
      this.$confirm(this.$l('msg_delete_confirm'), this.$l('msg_delete_tips'), {
        confirmButtonText: this.$l('btn_confirm'),
        cancelButtonText: this.$l('btn_cancel'),
        type: 'warning'
      }).then(() => {
        deleteContractController({ 'contractId': rowData.id })
          .then(response => {
            LoadingUtil.hideLoading()
            this.$showSuccess(response.message)
            this.search()
          })
          .catch(error => {
            console.log(error)
            this.$showError(error.message ? error.message : 'msg_system_error')
          })
      })
        .catch(() => { })
    },
    signRow (index, rowData) {
      this.$router.push({
        name: 'NewContractInformation',
        query: {
          contractId: rowData.id,
          isOrEdit: false, // 详情页面是否可以编辑
          contractStatus: rowData.contractStatus,
          signOrEdit: true, // signOrEdit
          contractSource: rowData.contractSource,
          activeName: '2',
          isFlag:true
        }
      })
    },
    search () {
      LoadingUtil.showLoading()
      // 转换参数

      let _queryObj = {
        companyId: this.queryModel.companyId,
        projectId: this.queryModel.projectId,
        contractType: this.queryModel.contractType,
        contractName: this.queryModel.contractName,
        contractStatus: this.queryModel.contractStatus,
        pageNum: this.queryObj.pageNum,
        pageSize: this.queryObj.pageSize,
        contractSource: this.active
      }

      getContractList(_queryObj)
        .then(response => {
          LoadingUtil.hideLoading()

          if (this.active === '0') {
            this.tableData = response.data.content ? response.data.content : []
            this.tableData.map(item => {
              if (item.dateOfContract) {
                item.dateOfContract = new Date(item.dateOfContract).format()
              }
            })
            this.queryObj.count = response.data.totalElements
          } else {
            this.initData = response.data
          }
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
.add {
  margin-bottom: 10px;
}
</style>
