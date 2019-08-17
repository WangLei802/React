<!-- TargetCostCompilationList -->
<template>
  <div class='app-container'>

    <mt-searchform>

      <template slot="buttons">

      </template>

      <template slot="form">
        <el-row :inline="true">
          <el-col :inline="true" :span="24">

            <ProjectSelector v-model='projectModel'>
              <template slot="projectSelectorButtons">
                <el-col :span="6"
                        class="search-btn">
                  <el-form-item>
                    <el-button  size="mini" type="primary"
                               @click='search'>{{$l("btn_search")}}</el-button>
                    <el-button size="mini" @click='reset'>{{$l("btn_reset")}}</el-button>
                  </el-form-item>
                </el-col>
              </template>
              <template slot="after">
                <el-col :span="6">
                  <el-form-item :label="'付款申请编号：'" >
                    <el-input  v-model='queryModel.code' ></el-input>
                  </el-form-item>

                </el-col>

                <el-col :span="6">
                  <el-form-item :label="'合同名称：'" >
                    <el-input  v-model='queryModel.contractName' ></el-input>
                  </el-form-item>
                </el-col>

                <el-col :span="6">
                  <el-form-item :label="'付款申请日期：'" title="付款申请日期:">
                    <el-date-picker v-model='queryModel.operatorDate' type="date" style="width: 136px">
                    </el-date-picker>
                  </el-form-item>

                </el-col>


              </template>
            </ProjectSelector>
          </el-col>
        </el-row>

      </template>

    </mt-searchform>

    <ActualPaymentTable :queryObj_passed_in='queryModel'
                          ref='ActualPaymentTable'></ActualPaymentTable>

  </div>
</template>

<script>
  import ProjectSelector from '@/components/cost/ProjectSelector/'
  import ActualPaymentTable from '@/views/cost/payment/actualPayment/ActualPaymentTable'

  export default {
    data() {
      return {
        projectModel: {
          companyId: '',
          projectId: ''
        },
        queryModel: {
          code: '',
          contractName: '',
          operatorDate: '',
          companyId: '',
          pageNum: 1,
          pageSize: 20
        }
      }
    },
    components: {
      ActualPaymentTable,
      ProjectSelector
    },
    mounted() {
      this.search()
    },

    methods: {
      reset() {
        this.projectModel.projectId = ''
        this.projectModel.companyId = ''
        this.queryModel.code = ''
        this.queryModel.operatorDate = ''
        this.queryModel.contractName = ''
        this.queryModel.companyId = ''
      },
      search(tab) {
        // this.initVM()
        debugger
        this.queryModel.projectId = this.projectModel.projectId
        this.queryModel.companyId = this.projectModel.companyId
        this.$refs.ActualPaymentTable.getList()
      }
    }
  }

</script>

