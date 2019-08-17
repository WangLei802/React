<!-- StandaredSubjectList.vue -->
<template>
    <div class="app-container">
        <mt-searchform>
            <template slot="buttons">
                <el-button size="mini"
                           icon='el-icon-plus'
                           type='primary'
                           v-if="$checkPersmissionByCode('cost:outputValueCheck:create')"
                           @click="handleAddRow">{{$l("btn_add")}}</el-button>
            </template>
            <template slot="form">
                <el-row>
                    <el-form :inline="true"
                             class="demo-form-inline"
                             label-width="120px"
                             size="mini">
                        <el-col :span="24">
                            <el-form-item :label="''">
                                <ProjectSelector v-model='projectModel'>
                                    <template slot="projectSelectorButtons">
                                        <el-col :span="6"
                                                class="search-btn">
                                          <el-form-item>
                                            <el-button size="mini" type="info"
                                                      @click='search'>{{$l("btn_search")}}</el-button>
                                            <el-button size="mini" @click='reset'>{{$l("btn_reset")}}</el-button>
                                          </el-form-item>
                                        </el-col>
                                        <el-col :span="6">
                                            <el-form-item :label="'产值核定编号：'">
                                                <el-input v-model="queryModel.code"
                                                          placeholder="请输入内容"></el-input>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="6">
                                            <el-form-item :label="'合同编号：'">
                                                <el-input v-model="queryModel.contractCode"
                                                          placeholder="请输入内容"></el-input>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="6">
                                            <el-form-item :label="'审批状态：'">
                                                <fd-select v-model='queryModel.approveStatus'
                                                            placeholder="请选择"
                                                           type="cost_flow_status"
                                                           :clearable="true"></fd-select>
                                            </el-form-item>
                                        </el-col>
                                    </template>
                                </ProjectSelector>
                            </el-form-item>
                        </el-col>

                    </el-form>
                </el-row>
            </template>
        </mt-searchform>

        <div ref="contractSignListTable">
            <el-table :data="tableData"
                      stripe
                      border
                      tooltip-effect="dark"
                      style="width: 100%"
                      size="small"
                      :height="tHeight">
                <el-table-column :label="$l('lbl_no')"
                                 width="50"
                                 type="index">
                </el-table-column>
                <el-table-column prop="code"
                               show-overflow-tooltip
                                 label="产值核定编号"
                                 width="170">

                </el-table-column>
                <el-table-column prop="contractCode"
                                 show-overflow-tooltip
                                 label="合同编号"
                                 width="180">

                </el-table-column>
                <el-table-column prop="contractName"
                                 label="合同名称"
                                 width="180">
                </el-table-column>
                <el-table-column width="100"
                                 label="核定金额(元)">
                  <template slot-scope="scope">
                    {{scope.row.checkAmt | NumFormat}}
                  </template>
                </el-table-column>
                <el-table-column prop="operatorDate"
                                 width="90"
                                 :label="'提交日期'"
                                 :formatter='this.$dateFormat("operatorDate", "yyyy-MM-dd")'></el-table-column>

                <el-table-column prop="projectName"
                                 label="所属项目">

                </el-table-column>
                <el-table-column width="80"
                                 prop="approveStatus"
                                 label="状态">
                    <template slot-scope="scope">
                      <fd-label :code="scope.row.approveStatus"
                                type="cost_flow_status"></fd-label>
                    </template>
                </el-table-column>
                <el-table-column width="150"
                                 :label="$l('lbl_operation')"
                                 >
                    <template slot-scope="scope">
                        <!-- 编辑 -->
                        <el-button size="mini"
                                   v-if="(scope.row.approveStatus === '0' || scope.row.approveStatus === '3') && $checkPersmissionByCode('cost:outputValueCheck:update')"
                                   type="text"
                                   icon="el-icon-edit"
                                   :title="$l('btn_edit')"
                                   @click="editRow(scope.$index, scope.row)"></el-button>
                        <!-- 删除 -->
                        <el-button size="mini"
                                   v-if="(scope.row.approveStatus === '0' || scope.row.approveStatus === '3') && $checkPersmissionByCode('cost:outputValueCheck:delete')"
                                   type="text"
                                   icon="el-icon-delete"
                                   :title="$l('btn_delete')"
                                   @click="deleteRow(scope.$index, scope.row)"></el-button>
                        <!-- 查看 -->
                        <el-button size="mini"
                                   type="text"
                                   icon="el-icon-view"
                                   :title="$l('btn_detail')"
                                   @click="queryRow(scope.$index, scope.row)"></el-button>

                    </template>
                </el-table-column>
            </el-table>
            <div class='pagination_bar'>
                <mt-pagination @size-change='handleSizeChange'
                               @current-change='handleCurrentChange'
                               :current-page.sync='queryModel.pageNum'
                               :page-sizes='[10, 20, 30, 40]'
                               :page-size='queryModel.pageSize'
                               layout='sizes, prev, pager, next'
                               :total='queryModel.count'>
                </mt-pagination>
            </div>
        </div>


    </div>
</template>

<script>
import { LoadingUtil } from '@/utils/common/LoadingUtil'
import { searchList, deleteOutputValue, updateOutputValue, getOutputValue } from '@/api/cost/outputValueCheckAPI'
import ProjectAccountingTargetTreeSelector from '@/components/cost/ProjectAccountingTargetTreeSelector/'
import CalibrationFeeInfor from '@/views/cost/signContract/CalibrationFeeInfor/'
import CalibrationResultsList from '@/views/cost/signContract/CalibrationList/'
import ProjectSelector from '@/components/cost/ProjectSelector/'
import TargetCostCompilationTable from '@/views/cost/targetCostCompilation/TargetCostCompilationTable'
import COSTENUM from '@/utils/cost/enum'
import { NumFormat, dateFormat } from '@/filters/cost/'
import { tableHeight } from '@/utils/common/index'
export default {
  filters: {
    dateFormat,
    NumFormat
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
  data() {
    return {
      projectModel: {
        companyId: '',
        projectId: ''
      },
      queryModel: {
        group: '',
        company: '',
        businessDept: '',
        accountingObjectId: '',
        stageId: '',
        approveStatus: '',
        pageNum: 1,
        pageSize: 20,
        count: 0,
        code: '',
        contractCode: '',
        contractName: '',
        companyId: '',
        projectId: ''

      },
      tableData: []
    }
  },
  components: {
    ProjectAccountingTargetTreeSelector,
    CalibrationResultsList,
    CalibrationFeeInfor,
    ProjectSelector,
    TargetCostCompilationTable
  },
  mounted() {
    this.search()
  },
  watch: {
    'active': {
      handler(newValue, oldValue) {
        if (this.active === '1') {
          this.search()
        }
      },
      deep: true
    }
  },
  methods: {
    handleSizeChange(val) {
      this.query.pageSize = val

      this.search()
    },
    handleCurrentChange(val) {
      this.queryModel.pageNum = val
      this.search()
    },
    editRow(index, rowData) {
      this.$router.push({
        name: 'OutputValueCheckInfoData',
        query: { id: rowData.id, ischeck: 1 }
      })
    },
    queryRow(index, rowData) {
      this.$router.push({
        name: 'OutputValueCheckInfoData',
        query: { id: rowData.id, ischeck: 0 }
      })
    },
    getContractData() {

    },
    handleAddRow() {
      this.$router.push({
        name: 'OutputValueCheckInfoData',
        query: { ischeck: 2 }
      })
    },
    initVM() {
      this.queryModel.pageNum = 1
      this.queryModel.count = 0
      this.queryModel.pageSize = 20
    },

    reset() {
      this.projectModel.companyId = ''
      this.projectModel.projectId = ''
      this.queryModel.approveStatus = ''
      this.queryModel.code = ''
      this.queryModel.contractCode = ''
    },
    deleteRow(index, rowData) {
      this.$confirm('确认删除该记录?', {
        confirmButtonText: this.$l('btn_confirm'),
        cancelButtonText: this.$l('btn_cancel'),
        type: 'warning'
      }).then(() => {
        deleteOutputValue({ 'id': rowData.id })
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
    search() {
      LoadingUtil.showLoading()
      // 转换参数

      let _queryObj = {
        companyId: this.projectModel.companyId,
        projectId: this.projectModel.projectId,
        contractCode: this.queryModel.contractCode,
        code: this.queryModel.code,
        approveStatus: this.queryModel.approveStatus,
        pageNum: this.queryModel.pageNum,
        pageSize: this.queryModel.pageSize

      }

      searchList(_queryObj)
        .then(response => {
          console.log(response)
          LoadingUtil.hideLoading()
          this.tableData = response.data.content ? response.data.content : []

          this.queryModel.count = response.data.totalElements
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
@import '../../../../styles/list.scss';
.el-select {
  width: 200px;
}
.add {
  margin-bottom: 10px;
}
.el-form-item__content .el-input{
  width:100%;
}
</style>
