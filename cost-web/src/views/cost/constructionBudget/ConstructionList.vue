<!-- TargetCostCompilationList -->
<template>
    <div class='app-container'>

      <mt-searchform>
        <template slot="buttons">
          <el-button v-if="$checkPersmissionByCode('cost:budgetQualityPrice:createOrUpdate')"
           size="mini" class="ordinary-btn" icon='el-icon-plus' type='primary' @click='add'>
           {{$l("btn_add")}}</el-button>
        </template>
        <template slot="form">
          <el-row>
              <ProjectSelector @updateMessage="updateMessage" v-model='queryModel.ConstructionModelTest'>
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
              <el-form-item :label="'合同编号：'">
                <el-input v-model='queryModel.contractNumber'></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="6">
              <el-form-item :label="'合同名称：'">
                  <el-input v-model='queryModel.contractName'></el-input>
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
      <ConstructionTable :queryObj_passed_in='queryModel' ref="ConstructionTable"></ConstructionTable>
    </div>
</template>

<script>
import ConstrctionTargetSelector from '@/components/cost/ConstrctionTargetSelector/'
import ProjectSelector from '@/components/cost/ProjectSelector/'
import ConstructionTable from '@/views/cost/constructionBudget/ConstructionTable'
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
        show: {
          group: true,
          company: true,
          dept: true,
          account: true
        }
      }
    }
  },
  components: {
    ConstrctionTargetSelector,
    ConstructionTable,
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
        name: 'NewOrUpdateConstruction',
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
      // alert(this.queryModel.contractName)
      this.$refs.ConstructionTable.getList()
    },
    search() {
      this.$refs.ConstructionTable.getList()
    }
  }
}

</script>
<style scoped>
</style>
