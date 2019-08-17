<template>
  <div class='app-container'>
    <mt-searchform>
      <template slot="buttons">
        <el-button size="mini"
                   icon='el-icon-plus'
                   v-if="$checkPersmissionByCode('cost:applyPaymentContract:create')"
                   type='primary'
                   @click='add'>{{$l("btn_add")}}</el-button>
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
              <template slot="after">
                <el-col :span="6">
                  <el-form-item label="合同编号：" >
                    <el-input v-model='queryModel.contractCode' ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="审批状态：">
                    <fd-select v-model='queryModel.approveStatus'
                               type="cost_flow_status"
                               :clearable="true"></fd-select>
                  </el-form-item>
                </el-col>
              </template>
            </ProjectSelector>
          </el-col>
          <el-col :span="12">
            <el-form-item label="付款申请日期：" v-model="queryModel">
              <el-date-picker class= "range-date"
                              type="datetimerange"
                              v-model="requestTime"
                              :range-separator='this.$l("lbl_to")'
                              :start-placeholder='this.$l("lbl_start_date")'
                              :end-placeholder='this.$l("lbl_end_date")'>
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
      </template>
    </mt-searchform>
    <ApplyPaymentContractTable :queryObj_passed_in="queryModel" ref="applyPaymentContractTable"></ApplyPaymentContractTable>
  </div>
</template>

<script>
  import ProjectSelector from '@/components/cost/ProjectSelector/'
  import ApplyPaymentContractTable from '@/views/cost/payment/applyPaymentContract/ApplyPaymentContractTable'
  export default {
    data() {
      return {
        projectModel: {
          companyId: '',
          projectId: ''
        },
        queryModel: {
          companyId: '',
          projectId: '',
          code: '',
          contractCode: '',
          approveStatus: '',
          from: '',
          to: '',
          pageNumber: 1,
          pageSize: 20,
          count: 0
        },
        requestTime: []
      }
    },
    components: {
      ProjectSelector,
      ApplyPaymentContractTable
    },
    methods: {
      search() {
        this.queryModel.companyId = this.projectModel.companyId
        this.queryModel.projectId = this.projectModel.projectId
        if (this.requestTime.length) {
          this.queryModel.from = this.requestTime[0].format('yyyy-MM-dd hh:mm:ss')
          this.queryModel.to = this.requestTime[1].format('yyyy-MM-dd hh:mm:ss')
        }
        this.$refs.applyPaymentContractTable.getList()
      },
      reset() {
        for (var item in this.queryModel) {
          this.queryModel[item] = ''
        }
        this.projectModel.companyId = ''
        this.projectModel.projectId = ''
        this.requestTime = []
        this.queryModel.pageNum = 1
        this.queryModel.pageSize = 20
      },
      add() {
        this.$router.push({
          name: 'NewOrUpdateApplyPaymentContract',
          query: { isEdit: true,isShow:true }
        })
      }
    }
  }
</script>

<style scoped>

</style>
