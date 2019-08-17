<template>
  <div class="app-container">


    <div ref="contractSignListTable">
      <div class="inlineData modeul">
        <el-row>
          <el-col>
            <div class="title"
                 style="margin-bottom:20px">设计变更</div>
          </el-col>
        </el-row>
        <el-table :data="designList"
                  stripe
                  border
                  tooltip-effect="dark"
                  style="width: 100%"
                  size="small"
        >
          <el-table-column :label="$l('lbl_no')"
                           width="50"
                           type="index">
          </el-table-column>
          <el-table-column prop="code"
                           label="设计变更编号"
                           width="200">

          </el-table-column>
          <el-table-column prop="name"
                           label="设计变更名称"
                           width="150">

          </el-table-column>
          <el-table-column prop="estimatedAmt"
                           label="预估金额(元)"
                           width="150">

          </el-table-column>

          <el-table-column prop="costConfirmAmt"
                           label="确认金额(元)"
                           width="150">

          </el-table-column>
          <el-table-column
            width="150"
            prop="reasonTypeCode"
            label="设计变更原因">
            <template slot-scope="scope">
              <fd-label :code="scope.row.reasonTypeCode"
                        type="cost_reasonType_code"></fd-label>
            </template>

          </el-table-column>
          <el-table-column
                           prop="createdDate"
                           :formatter='this.$dateFormat("createdDate","yyyy-MM-dd")'
                           label="审批日期">

          </el-table-column>


        </el-table>
      </div>
      <div class="inlineData modeul">
        <el-row>
          <el-col>
            <div class="title"
                 style="margin-bottom:20px">现场签证</div>
          </el-col>
        </el-row>
        <el-table :data="visaList"
                  stripe
                  border
                  tooltip-effect="dark"
                  style="width: 100%"
                  size="small"
        >
          <el-table-column :label="$l('lbl_no')"
                           width="50"
                           type="index">
          </el-table-column>
          <el-table-column prop="code"
                           label="现场签证编号"
                           width="200">

          </el-table-column>
          <el-table-column prop="name"
                           label="现场签证名称"
                           width="150">

          </el-table-column>
          <el-table-column prop="estimatedAmt"
                           label="预估金额(元)"
                           width="150">

          </el-table-column>
          <el-table-column prop="costConfirmAmt"
                           label="确认金额(元)"
                           width="150">

          </el-table-column>

          <el-table-column
            width="150"
            prop="reasonTypeCode"
            label="现场签证原因">
            <template slot-scope="scope">
              <fd-label :code="scope.row.reasonTypeCode"
                        type="cost_reasonType_code"></fd-label>
            </template>

          </el-table-column>
          <el-table-column
                           prop="createdDate"
                           :formatter='this.$dateFormat("createdDate","yyyy-MM-dd")'
                           label="审批日期">

          </el-table-column>


        </el-table>
      </div>
      <div class="inlineData modeul">
        <el-row>
          <el-col>
            <div class="title"
                 style="margin-bottom:20px">合同变更</div>
          </el-col>
        </el-row>
        <el-table :data="contractAlterations"
                  stripe
                  border
                  tooltip-effect="dark"
                  style="width: 100%"
                  size="small"
        >
          <el-table-column :label="$l('lbl_no')"
                           width="50"
                           type="index">
          </el-table-column>
          <el-table-column prop="code"
                           label="变更编号"
                           width="200">

          </el-table-column>
          <el-table-column prop="reasonTypeCode"
                           label="合同变更类型"
                           width="150">
            <template slot-scope="scope">
              <fd-label :code="scope.row.reasonTypeCode"
                        type="cost_contract_alteration_type"></fd-label>
            </template>

          </el-table-column>
          <el-table-column prop="alterationAmt"
                           label="变更金额(元)"
                           width="150">

          </el-table-column>
          <el-table-column
            prop="alterationContent"
            label="变更内容">

          </el-table-column>
          <el-table-column
                           :formatter='this.$dateFormat("updatedDate","yyyy-MM-dd")'
                           prop="updatedDate"
                           label="审批日期">

          </el-table-column>


        </el-table>
      </div>
    </div>


  </div>
</template>

<script>
  import { getContractAlterationVisaInfo } from '@/api/cost/signContractAPI'

  export default {
    props: {
      'contractCode': {
        type: String
      }
    },
    data() {
      return {
        designList: [],
        contractAlterations: [],
        visaList: []

      }
    },
    components: {

    },
    mounted() {
      this.getContract()
    },
    watch: {
      // 'contractCode': {
      //   handler(newValue, oldValue) {
      //     debugger
      //     this.getContract()
      //   },
      //   deep: true
      // }
    },
    methods: {
      getContract() {
        if (this.contractCode) {
          getContractAlterationVisaInfo({ 'contractCode': this.contractCode }).then(response => {
            if (response.code !== '2000') {
              this.$showError(response.message)
            } else {
              this.designList = response.data.designList ? response.data.designList : []
              this.contractAlterations = response.data.contractAlterations ? response.data.contractAlterations : []
              this.visaList = response.data.visaList ? response.data.visaList : []
            }
          }).catch(error => {
            console.log(error)
            this.$showError(error.message ? error.message : 'msg_system_error')
          })
        }
      }

    }
  }

</script>
<style scoped>
  .el-select {
    width: 200px;
  }
  .modeul .el-input{
    width: 200px;
  }
  .add {
    margin-bottom: 10px;
    text-align:right;
  }
  .el-form-item {
    width: 33%;
    display: inline-block;
    float: left;
  }
  .contractInfo .el-form-item__label {
    text-align: left;
    padding-left: 10px;
  }
  .contractInfo .el-input {
    width: 80% !important;
  }
  .inlineData {
    margin-top: 20px;
    float: left;
    width: 100%;
  }
  .inlineData .title {
    margin-bottom: 20px;
    border-bottom: 1px solid #ccc;
    padding-bottom: 5px;
  }
  .newAdd .el-button{
    float:right;
    margin-bottom:10px;
  }
</style>
