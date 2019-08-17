<!-- TargetCostCompilationList -->
<template>
    <div class='app-container'>

      <mt-searchform>
        <template slot="buttons">
          <el-button size="mini" class="ordinary-btn" icon='el-icon-plus' type='primary' @click='add'>{{$l("btn_add")}}</el-button>
        </template>
        <template slot="form">
          <el-row>
              <ProjectSelector @updateMessage="updateMessage" v-model='queryModel.ConstructionModelTest' :show="{group: true,company: true,dept: true, project: true,accObj:true}">
                <template slot="projectSelectorButtons">
                  <el-col :span="6" class="search-btn">
                    <el-form-item>
                      <el-button size="mini" type="info"  @click='search'>{{$l("btn_search")}}</el-button>
                      <el-button size="mini" @click='reset'>{{$l("btn_reset")}}</el-button>
                    </el-form-item>                
                  </el-col>
                </template>
              </ProjectSelector>

            <el-col :span="6">
              <el-form-item :label="'资金计划名称：'">
                <el-input v-model='queryModel.fundsPlanName'></el-input>
              </el-form-item>
            </el-col>
            
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
      <FundPlanTable :queryObj_passed_in='queryModel' ref="FundPlanTable"></FundPlanTable>
    </div>
</template>

<script>
import ConstrctionTargetSelector from '@/components/cost/ConstrctionTargetSelector/'
import ProjectSelector from '@/components/cost/ProjectSelector/'
import FundPlanTable from '@/views/cost/fundPlan/FundPlanTable'
import COSTENUM from '@/utils/cost/enum'
export default {
  data() {
    return {
      queryModel: {
        companyId: '',
        projectId: '',
        group: '',
        contractNumber: '',
        contractName: '',
        company: '',
        businessDept: '',
        accountingObjectId: '',
        stageId: '',
        status: '',
        pageNum: 1,
        pageSize: 20,
        count: 0,
        ConstructionModelTest: {},
        fundsPlanName:''  //资金计划名称
      }
    }
  },
  components: {
    ConstrctionTargetSelector,
    FundPlanTable,
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
        name: 'NewOrUpdateFundPlan',
        query: { id: '', isEdit: true, isAdd: true }
      })
    },
    initVM() {
      this.queryModel.pageNum = 1
      this.queryModel.count = 0
      this.queryModel.pageSize = 20
    },
    reset() {
      this.queryModel.ConstructionModelTest = ''
      this.queryModel.group = ''
      this.queryModel.company = ''
      this.queryModel.businessDept = ''
      this.queryModel.accountingObjectId = ''
      this.queryModel.status = ''
      this.queryModel.groupNumber = ''
      this.queryModel.companyId = ''
      this.queryModel.projectId = ''
      this.queryModel.contractNumber = ''
      this.queryModel.contractName = ''
      this.queryModel.fundsPlanName = ''
      // alert(this.queryModel.contractName)
      this.$refs.FundPlanTable.getList()
    },
    search() {
      this.$refs.FundPlanTable.getList()
    }
  }
}

</script>
<style scoped>
</style>
