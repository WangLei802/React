<!-- TargetCostCompilationList -->
<template>
  <div class='app-container'>

    <mt-searchform>

      <template slot="buttons">
        <el-button size="mini" icon="el-icon-plus" type="primary" @click="add" v-if="$checkPersmissionByCode('cost:contractAlterationMgmt:create')">{{$l("btn_add")}}</el-button>
      </template>

      <template slot="form">
        <el-row :inline="true">
          <el-col :inline="true" :span="24">

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
              </template>
              <template slot="after">
                <el-col :span="6">
                  <el-form-item :label="'合同类别：'" >

                    <fd-select v-model='queryModel.contractTypeCode'
                               type="cost_contract_type"></fd-select>
                  </el-form-item>

                </el-col>

                <el-col :span="6">
                  <el-form-item :label="'合同名称：'"  >
                    <el-input  v-model='queryModel.contractName' ></el-input>
                  </el-form-item>
                </el-col>

                <el-col :span="6">
                  <el-form-item :label="'审批状态：'">
                    <fd-select v-model='queryModel.status'
                               type="cost_flow_status"
                               ></fd-select>
                  </el-form-item>
                </el-col>


              </template>
            </ProjectSelector>
          </el-col>
        </el-row>

      </template>

    </mt-searchform>

    <ContractAlterationTable :queryObj_passed_in='queryModel' :projectModel="projectModel"
                          ref='ContractAlterationTable'></ContractAlterationTable>



  </div>
</template>

<script>
  import ProjectSelector from '@/components/cost/ProjectSelector/'
  import ContractSelector from '@/components/cost/ContractSelector/'
  import ContractAlterationTable from '@/views/cost/contractAlteration/ContractAlterationTable'

  export default {
    data() {
      return {
        activeName2: 'first',
        tabIndex: '0',
        isShowContract: false,
        projectModel: {
          companyId: '',
          projectId: ''
        },
        queryModel: {
          contractTypeCode: '',
          contractName: '',
          status: '',
          pageNum: 1,
          pageSize: 20
        }
      }
    },
    components: {
      ContractAlterationTable,
      ProjectSelector,
      ContractSelector
    },
    mounted() {
      this.search()
    },

    methods: {
      add() {
        this.$router.push({
          name: 'NewOrUpdateContractAlteration',
          query: { id: '', isEdit: true, isAdd: true }
        })
      },
      reset() {
        this.projectModel.projectId = ''
        this.projectModel.companyId = ''
        this.queryModel.contractTypeCode = ''
        this.queryModel.status = ''
        this.queryModel.contractName = ''
      },
      search(tab) {
        // this.initVM()
        this.$refs.ContractAlterationTable.getList()
      }
    }
  }

</script>
<style scoped>
</style>
