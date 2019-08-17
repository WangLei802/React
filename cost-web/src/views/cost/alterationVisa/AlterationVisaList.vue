<!-- TargetCostCompilationList -->
<template>
  <div class='app-container'>

    <mt-searchform>

      <template slot="buttons">
        <el-button size="mini" type="primary"
                   @click='handleExport'>导出</el-button>
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
                <!--<el-col :span="6">-->
                  <!--<el-form-item :label="'合同编号:'" >-->
                    <!--<el-input  v-model='queryModel.contractCode'></el-input>-->
                  <!--</el-form-item>-->
                <!--</el-col>-->

                <!--<el-col :span="6">-->
                  <!--<el-form-item :label="'设计变更编号:'" >-->
                    <!--<el-input  v-model='queryModel.code' ></el-input>-->
                  <!--</el-form-item>-->
                <!--</el-col>-->

                <el-col :span="6">
                  <el-form-item :label="'合同名称：'">
                    <el-input  v-model='queryModel.contractName' ></el-input>
                  </el-form-item>
                </el-col>

                <el-col :span="6">
                  <el-form-item :label="'是否包含作废：'" >
                    <fd-select v-model='queryModel.isInvalid'
                               type="cost_is_include_invalid"
                               :clearable="true" ></fd-select>
                  </el-form-item>

                </el-col>


              </template>
            </ProjectSelector>
          </el-col>
        </el-row>

      </template>

    </mt-searchform>




        <AlterationVisaTable :queryObj_passed_in='queryModel' :projectModel="projectModel"
                               ref='AlterationVisaTable'></AlterationVisaTable>



  </div>
</template>

<script>
  import AccountingTargetSelector from '@/components/cost/AccountingTargetSelector/'
  import ProjectSelector from '@/components/cost/ProjectSelector/'
  import AlterationVisaTable from '@/views/cost/alterationVisa/AlterationVisaTable'
  import COSTBUSINESS from '@/utils/cost/business'
  export default {
    data() {
      return {
        activeName2: 'first',
        tabIndex: '0',
        showInstruct: false,
        projectModel: {
          companyId: '',
          projectId: ''
        },
        queryModel: {
          contractName: '',
          isInvalid: '',
          pageNum: 1,
          pageSize: 20
        }
      }
    },
    components: {
      AccountingTargetSelector,
      ProjectSelector,
      AlterationVisaTable
    },
    mounted() {
      this.search()
    },

    methods: {
      initVM() {
        this.queryModel.pageNum = 1
        this.queryModel.count = 0
        this.queryModel.pageSize = 20
      },
      reset() {
        this.projectModel.companyId = ''
        this.projectModel.projectId = ''
        this.queryModel.contractName = ''
        this.queryModel.isInvalid = ''
      },
      search(tab) {
        // this.initVM()
        this.$refs.AlterationVisaTable.getList()
      },
      handleExport() {
        COSTBUSINESS.download(process.env.COST_API + '/designAlteration/exportDesignAlterationData?' +
          'companyId=' + this.projectModel.companyId +
          '&contractName=' + this.queryModel.contractName +
          '&isInvalid=' + this.queryModel.isInvalid +
          '&projectId=' + this.projectModel.projectId + '&userName=' + this.$getUserInfo()['username'])
      }
    }
  }

</script>

