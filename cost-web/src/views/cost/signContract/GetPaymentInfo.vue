<template>
    <div class="app-container">     

    
       <div ref="contractSignListTable">
                <div class="inlineData modeul">
                   <el-row>
                        <el-col>
                            <div class="title"
                                 style="margin-bottom:20px">付款申请明细</div>
                        </el-col>
                    </el-row>
                   <el-table :data="applyPayments"
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
                                         label="付款申请编号"
                                         width="250">

                        </el-table-column>
                        <el-table-column prop="operatorDate"
                                         label="付款申请日期"
                                          :formatter='this.$dateFormat("operatorDate","yyyy-MM-dd")'
                                         width="250">

                        </el-table-column>
                        <el-table-column prop="applyPaymentType"
                                         label="付款类型"
                                         width="250">

                        </el-table-column>

                        <el-table-column 
                                         prop="applyAmt"
                                         label="付款申请金额(元)">

                        </el-table-column>
                        <el-table-column
                                         prop="totalActualPaymentAmt"
                                         label="已付款金额(元)">

                        </el-table-column>

                    </el-table>
                </div>

                <div class="inlineData modeul">
                   <el-row>
                        <el-col>
                            <div class="title"
                                 style="margin-bottom:20px">实付信息明细</div>
                        </el-col>
                    </el-row>
                    <el-table :data="actualPayments"
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
                      <el-table-column prop="applyPaymentCode"
                                       label="付款申请编号"
                                       width="250">

                      </el-table-column>
                      <el-table-column prop="paymentNo"
                                       label="付款结算单编号"
                                       width="250">

                      </el-table-column>
                      <el-table-column prop="paymentDate"
                                       :formatter='this.$dateFormat("paymentDate","yyyy-MM-dd")'
                                       label="实际付款日期"
                                       width="250">

                      </el-table-column>

                      <el-table-column
                                       prop="paymentAmt"
                                       label="实付金额(元）">

                      </el-table-column>

              </el-table>
            </div>
       </div>


    </div>
</template>

<script>
import { getPaymentInfo } from '@/api/cost/signContractAPI'

export default {
  props: {
    'contractCode': {
      type: String
    }
  },
  data() {
    return {
      actualPayments: [],
      applyPayments: []

    }
  },
  components: {

  },
  mounted() {
    this.getContract()
  },
  methods: {
    getContract() {
      if (this.contractCode) {
        getPaymentInfo({ 'contractCode': this.contractCode }).then(response => {
          if (response.code !== '2000') {
            this.$showError(response.message)
          } else {
            if (response.data != null) {
              this.actualPayments = response.data.actualPayments ? response.data.actualPayments : []
              this.applyPayments = response.data.applyPayments ? response.data.applyPayments : []
            }
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
