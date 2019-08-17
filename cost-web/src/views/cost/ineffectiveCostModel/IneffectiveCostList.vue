<!-- TargetCostCompilationList -->
<template>
    <div class='app-container'>
      <mt-searchform>
        <template slot="buttons">
          <el-button icon='el-icon-plus' size="mini" 
                     v-if="$checkPersmissionByCode('cost:ineffectiveCostMgmt:saveOrUpdate')"
                      type='primary'
                      @click='add'>{{$l("btn_add")}}</el-button>
        </template>
        <template slot="form">
          <el-row>
            <ProjectSelector @updateMessage="updateMessage" v-model='queryModel.queryModelTest'
             :show="{group: true,company: true,dept: true, project: true,accObj:true}">
              <template slot="projectSelectorButtons">
                <el-col :span="6" class="search-btn">
                  <el-form-item>
                      <el-button type='primary' size="mini"
                                @click='search'>{{$l("btn_search")}}</el-button>
                      <el-button type='primary' size="mini"
                                @click='reset'>{{$l("btn_reset")}}</el-button>
                  </el-form-item>
                </el-col>
              </template>
            </ProjectSelector>

            <el-col :span="6">
              <el-form-item :label="'无效成本申请编号：'" title="无效成本申请编号：">
                <el-input v-model='queryModel.applyNo'></el-input>
              </el-form-item>
            </el-col>

            <!-- <el-col :span="6">
              <el-form-item :label="'合同名称：'">
                  <el-input v-model='queryModel.contractName'></el-input>
              </el-form-item>
            </el-col> -->

            <el-col :span="6">
              <el-form-item :label="'审批状态：'">
                  <fd-select v-model='queryModel.status'
                            type="cost_flow_status"
                            :clearable="true"></fd-select>
              </el-form-item>
            </el-col>
          </el-row>
        </template>
      </mt-searchform>
        <IneffectiveCostTable :queryObj_passed_in='queryModel'
                ref="IneffectiveCostTable"></IneffectiveCostTable>
    </div>
</template>

<script>
import ConstrctionTargetSelector from '@/components/cost/ConstrctionTargetSelector/'
import ProjectSelector from '@/components/cost/ProjectSelector/'
import IneffectiveCostTable from '@/views/cost/ineffectiveCostModel/IneffectiveCostTable'
import COSTENUM from '@/utils/cost/enum'
export default {
  data() {
    return {
      queryModel: {
        companyId: '',
        projectId: '',
        group: '', // 集团
        company: '', // 公司
        businessDept: '', // 事业部
        applyNo: '', // 编号
        contractNumber: '', // 合同编号
        contractName: '', // 合同名称
        estimateName: '', // 结算名称
        accountingObjectId: '',
        stageId: '',
        status: '',
        pageNum: 1,
        pageSize: 20,
        count: 0,
        queryModelTest: {
          projectId: '',
          projectName: ''
        },
        show: {
          // group: true,
          // company: true,
          // dept: true,
          // account: true
            group: true, //显示集团
            company: true,//显示公司
            dept: true,//显示部门
            project: false,//显示项目
            accObj:true//显示成本分期
        }
      }
    }
  },
  components: {
    ConstrctionTargetSelector,
    IneffectiveCostTable,
    ProjectSelector

  },
  mounted() {
    this.search()
  },

  methods: {
    updateMessage(item) {
      if (item.type === COSTENUM.projectTreeType.TREE_NODE_ACC_OBJ) {
        this.queryModel.accountingObjectId = item.accountingObjectId
        this.queryModel.companyId = item.companyId
      } else {
        this.queryModel.accountingObjectId = ''
        this.queryModel.companyId = item.id
      }
      // alert(this.queryModel.companyId)
    },
    add() {
      this.$router.push({
        name: 'NewOrUpdateIneffective',
        query: { id: '', isEdit: true, isOrEdit:true, isAdd: true }
      })
    },
    initVM() {
      this.queryModel.pageNum = 1
      this.queryModel.count = 0
      this.queryModel.pageSize = 20
    },
    reset() {
      this.queryModel.group = ''
      this.queryModel.company = ''
      this.queryModel.businessDept = ''
      this.queryModel.accountingObjectId = ''
      this.queryModel.applyNo = ''
      this.queryModel.status = ''
      this.queryModel.groupNumber = ''
      this.queryModel.companyId = ''
      this.queryModel.projectId = ''
      this.queryModel.contractNumber = ''
      this.queryModel.contractName = ''
      this.queryModel.queryModelTest = ''
      this.$refs.IneffectiveCostTable.getList()
    },

    search() {
      this.$refs.IneffectiveCostTable.getList()
    }
  }
}

</script>
<style scoped>
</style>
