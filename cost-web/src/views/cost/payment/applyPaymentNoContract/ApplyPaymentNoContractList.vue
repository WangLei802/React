<!-- TargetCostCompilationList -->
<template>
  <div class='app-container'>

    <mt-searchform>

      <template slot="buttons">
        <el-button size="mini"
                   icon='el-icon-plus'
                   type='primary'
                   v-if="$checkPersmissionByCode('cost:applyPaymentNoContract:create')"
                   @click='addApply'>新增无合同费用申请</el-button>
        <el-button size="mini"
                   icon='el-icon-plus'
                   type='primary'
                   v-if="$checkPersmissionByCode('cost:applyPaymentPad:create')"
                   @click='addPad'>新增代垫代扣申请</el-button>
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
                  <el-form-item :label="'费用申请编号：'">
                    <el-input  v-model='queryModel.code' ></el-input>
                  </el-form-item>

                </el-col>

                <el-col :span="6">
                  <el-form-item :label="'费用申请日期：'" >
                    <el-date-picker v-model='queryModel.operatorDate' type="date" style="width: 142px">
                    </el-date-picker>
                  </el-form-item>
                </el-col>

                <el-col :span="6">
                  <el-form-item :label="'是否代垫代扣：'" >
                    <fd-select v-model='queryModel.isPad'
                               type="cost_is_pad"
                               :clearable="true" ></fd-select>
                  </el-form-item>

                </el-col>

                <el-col :span="6">
                  <el-form-item :label="'审批状态：'">
                    <fd-select v-model='queryModel.approveStatus'
                               type="cost_flow_status"
                               :clearable="true" ></fd-select>
                  </el-form-item>

                </el-col>


              </template>
            </ProjectSelector>
          </el-col>
        </el-row>

      </template>

    </mt-searchform>

    <ApplyPaymentNoContractTable :queryObj_passed_in='queryModel'
                          ref='ApplyPaymentNoContractTable'></ApplyPaymentNoContractTable>



  </div>
</template>

<script>
  import ProjectSelector from '@/components/cost/ProjectSelector/'
  import ContractSelector from '@/components/cost/ContractSelector/'
  import ApplyPaymentNoContractTable from '@/views/cost/payment/applyPaymentNoContract/ApplyPaymentNoContractTable'

  export default {
    data() {
      return {
        projectModel: {
          companyId: '',
          projectId: ''
        },
        queryModel: {
          projectId: '',
          companyId: '',
          code: '',
          operatorDate: '',
          isPad: '',
          approveStatus: '',
          pageNum: 1,
          pageSize: 20
        }
      }
    },
    components: {
      ApplyPaymentNoContractTable,
      ProjectSelector,
      ContractSelector
    },
    mounted() {
      this.search()
    },

    methods: {
      addPad() {
        this.$router.push({
          name: 'NewOrUpdateApplyPaymentPad',
          query: { id: '', isEdit: true, isAdd: true,isShow:true }
        })
      },
      addApply() {
        this.$router.push({
          name: 'NewOrUpdateApplyPaymentNoContract',
          query: { id: '', isEdit: true, isAdd: true, isOrEdit: true,isShow:true }
        })
      },
      reset() {
        this.projectModel.projectId = ''
        this.projectModel.companyId = ''
        this.queryModel.projectId = ''
        this.queryModel.companyId = ''
        this.queryModel.code = ''
        this.queryModel.approveStatus = ''
        this.queryModel.isPad = ''
        this.queryModel.operatorDate = ''
      },
      search(tab) {
        // this.initVM()
        this.queryModel.projectId = this.projectModel.projectId
        this.queryModel.companyId = this.projectModel.companyId
        this.$refs.ApplyPaymentNoContractTable.getList()
      }
    }
  }

</script>
