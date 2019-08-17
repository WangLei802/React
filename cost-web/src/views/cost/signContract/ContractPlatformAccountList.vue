<template>
  <div class='app-container'>
    <mt-searchform>
      <template slot="buttons">
        <el-button size="mini" type="primary"
                   @click='handleExport'>导出</el-button>
      </template>
      <template slot="form">
        <el-row :inline="true">
          <el-col :inline="true"
                  label-width="120px"
                  :span="24">
            <ProjectSelector v-model='projectModel'
                             :show="{group: true,company: true,dept: true, project: true,accObj:false}">
              <template slot="projectSelectorButtons">
                <el-col :span="6"
                        class="search-btn">
                  <el-form-item>
                    <el-button size="mini" type="info" @click='search'>{{$l("btn_search")}}</el-button>
                    <el-button size="mini" type="info" @click='reset'>{{$l("btn_reset")}}</el-button>
                  </el-form-item>
                </el-col>
              </template>
            </ProjectSelector>
          </el-col>
        </el-row>
      </template>
    </mt-searchform>
    <ContractPlatformAccountTable :queryObj_passed_in="queryModel" ref="contractPlatformAccountTable"></ContractPlatformAccountTable>
  </div>
</template>

<script>
  import ProjectSelector from '@/components/cost/ProjectSelector/'
  import ContractPlatformAccountTable from '@/views/cost/signContract/ContractPlatformAccountTable'
  import COSTBUSINESS from '@/utils/cost/business'
  export default {
    data() {
      return {
        projectModel: {
          companyId: '',
          projectId: ''
        },
        queryModel: {
          contractStatus: '',
          pageNum: 1,
          pageSize: 20,
          count: 0,
          contractType: '',
          contractName: '',
          companyId: '',
          projectId: ''

        }
      }
    },
    components: {
      ProjectSelector,
      ContractPlatformAccountTable
    },
    methods: {
      search() {
        this.queryModel.companyId = this.projectModel.companyId
        this.queryModel.projectId = this.projectModel.projectId

        this.$refs.contractPlatformAccountTable.search()
      },
      reset() {
        for (var item in this.queryModel) {
          this.queryModel[item] = ''
        }
        this.projectModel.companyId = ''
        this.projectModel.projectId = ''
        this.queryModel.pageNum = 1
        this.queryModel.pageSize = 20
      },
      handleExport() {
        COSTBUSINESS.download(process.env.COST_API + '/contract/exportContractPlatformAccountTable?' +
          'companyId=' + this.projectModel.companyId +
          '&projectId=' + this.projectModel.projectId + '&userName=' + this.$getUserInfo()['username'])
      }
    }
  }
</script>

<style scoped>

</style>
