<template>
    <div class='app-container'>

      <div style="text-align:right; margin:10px 0;">
        <el-button size="mini"
                   @click='handleBack'>{{$l("btn_back")}}</el-button>
      </div>
        <div class="form-unit">基本信息</div>


        <el-form label-width='150px'
                 status-icon
                 size="mini"
                 :disabled="allButtonDisable"
                 :model="actualApplyPaymentModel"
                 ref="actualApplyPaymentModel"
                 :rules="rules">
            <el-row>

                <el-col :span="8">
                    <el-form-item :label="'合同编号：'"
                                  v-show="isContractPayment"
                                  prop="contractCode">
                        <el-input v-model="actualApplyPaymentModel.contractCode"
                                  :disabled="true"></el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="8">
                    <el-form-item :label="'合同名称：'"
                                  v-show="isContractPayment"
                                  prop="contractName">
                        <el-input v-model="actualApplyPaymentModel.contractName"
                                  :disabled="true"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item :label="'合约规划名称：'"
                                  v-show="isNoContractPayment"
                                  prop="contractPlanName">
                        <el-input v-model="actualApplyPaymentModel.contractPlanName"
                                  :disabled="true"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item :label="'项目名称：'"
                                  prop="projectName">
                        <el-input v-model="actualApplyPaymentModel.projectName"
                                  :disabled="true"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item :label="'法人公司：'">
                        <el-input v-model="actualApplyPaymentModel.fCompanyName"
                                  :disabled="true"></el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="8">
                    <!-- 合同金额 -->
                    <el-form-item :label="'合同金额(元)：'"  v-show="isContractPayment">
                        <el-input v-model='actualApplyPaymentModel.contractAmt'
                                  :disabled="true"></el-input>
                    </el-form-item>

                     <el-form-item :label="'合约规划金额(元)：'"  v-show="isNoContractPayment">
                        <el-input v-model='actualApplyPaymentModel.contractPlanAmt'
                                  :disabled="true"></el-input>
                    </el-form-item>
                </el-col>

            </el-row>

            <div class="form-unit">付款信息</div>

            <el-row>
                <el-col :span="8">
                    <!-- 付款申请编号 -->
                    <el-form-item :label="'付款申请编号：'">
                        <el-input v-model="actualApplyPaymentModel.code"
                                  :disabled="true"></el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="8">
                    <!-- 付款申请名称 -->
                    <el-form-item :label="'付款申请名称：'">
                        <el-input v-model='actualApplyPaymentModel.name'
                                  :disabled="true"></el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="8">
                    <!-- 付款申请日期 -->
                    <el-form-item :label="'付款申请日期：'">
                        <el-date-picker v-model='actualApplyPaymentModel.operatorDate'
                                        :disabled="true"
                                        type="date"></el-date-picker>
                    </el-form-item>
                </el-col>

            </el-row>
            <el-row>
                <el-col :span="8">
                    <!-- 收款单位 -->
                    <el-form-item :label="'收款单位：'">
                        <el-input v-model="actualApplyPaymentModel.payee"
                                  :disabled="true"></el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="8">
                    <!-- 收款银行 -->
                    <el-form-item :label="'收款银行：'">
                        <el-input v-model='actualApplyPaymentModel.payeeBankName'
                                  :disabled="true"></el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="8">
                    <!-- 收款账号 -->
                    <el-form-item :label="'收款账号：'">
                        <el-input v-model='actualApplyPaymentModel.payeeAccountNo'
                                  :disabled="true"></el-input>
                    </el-form-item>
                </el-col>

            </el-row>
            <el-row>
                <el-col :span="8">
                    <!-- 本次申请金额(元) -->
                    <el-form-item :label="'本次申请金额(元)：'">
                        <el-input v-model="actualApplyPaymentModel.applyAmt"
                                  :disabled="true"></el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="8">
                    <!-- 本次已批金额(元) -->
                    <el-form-item :label="'本次申请已批金额(元)：'">
                        <el-input v-model='actualApplyPaymentModel.applyAmt'
                                  :disabled="true"></el-input>
                    </el-form-item>
                </el-col>

            </el-row>
            <el-row>
                <el-col :span="8">
                    <!-- 本次已付金额(元) -->
                    <el-form-item :label="'本次申请已付金额(元)：'">
                        <el-input v-model="actualApplyPaymentModel.totalActualPaymentAmt"
                                  :disabled="true"></el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="8">
                    <!-- 本次未付金额(元) -->
                    <el-form-item :label="'本次申请未付金额(元)：'">
                        <el-input v-model='actualApplyPaymentModel.amountUnPaid'
                                  :disabled="true"></el-input>
                    </el-form-item>
                </el-col>

            </el-row>

            <el-table :data="tableData"
                      stripe
                      border
                      size="small"
                      tooltip-effect="dark"
                      style="width: 100%">

                <!-- 序号 -->
                <el-table-column type="index"
                                 :label="this.$l('lbl_no')"></el-table-column>

                <!-- 实际付款日期 -->
                <el-table-column prop="contractCode"
                                 :label="'付款结算单编号'">
                    <template slot-scope="scope">
                        {{ scope.row.paymentNo}}
                    </template>
                </el-table-column>

                <!-- 实际付款日期 -->
                <el-table-column prop="contractCode"
                                 :label="'实际付款日期'">
                    <template slot-scope="scope">
                        {{ scope.row.paymentDate | dateFormat('yyyy-MM-dd')}}
                    </template>
                </el-table-column>

                <!-- 实付金额 -->
                <el-table-column prop="contractCode"
                                 :label="'实付金额(元)'">
                    <template slot-scope="scope">
                        {{ scope.row.paymentAmt  | NumFormat}}
                    </template>
                </el-table-column>

            </el-table>

        </el-form>
    </div>
</template>
<script >
import uuidv1 from 'uuid/v1'
import { LoadingUtil } from '@/utils/common/LoadingUtil'
import { ptn } from '@/utils/common/validate'
import { getActualPaymentDetail } from '@/api/cost/payment'
import { NumFormat, dateFormat } from '@/filters/cost/'
export default {
  props: {
  },
  filters: {
    dateFormat,
    NumFormat
  },
  components: {
  },
  data() {
    return {
      rules: {
        amount: [{ pattern: ptn.number(1, 2), message: '请输入数字', required: true, trigger: 'blur' }],
        orgName: [{ pattern: ptn.all_match(1, 50), message: this.$l('msg_org_text'), required: true, trigger: 'blur' }],
        orgType: [{ required: true, message: this.$l('msg_org_type'), trigger: 'blur' }]
      },
      show: {
        project: true,
        accObj: true
      },
      tableData: [],
      isEdit: false,
      isContractPayment: false,
      isNoContractPayment: false,
      allButtonDisable: true,
      actualApplyPaymentModel: {
        id: '',
        projectId: '',
        projectName: '',
        accountingObjectName: '',
        contractAmt: '',
        contractPlanAmt: '',
        contractPlanName: '',
        fCompanyName: '',
        applyAmt: '',
        amountPaid: '',
        amountUnPaid: '',
        amountApprove: '',
        code: '',
        contractCode: '',
        name: '',
        operatorName: '',
        operatorDate: '',
        details: '',
        payeeBankName: '',
        payeeAccountNo: '',
        payee: ''
      }
    }
  },
  mounted: function() {
    this.init()
  },
  methods: {
    init() {
      var applyPaymentId = this.$route.query['id']
      getActualPaymentDetail({ id: applyPaymentId })
        .then(response => {
          LoadingUtil.hideLoading()
          this.tableData = response.data.actualPaymentList
          this.actualApplyPaymentModel.contractCode = response.data.contractCode
          this.actualApplyPaymentModel.operatorDate = response.data.operatorDate
          this.actualApplyPaymentModel.projectId = response.data['projectId']
          this.actualApplyPaymentModel.projectName = response.data['projectName']
          this.actualApplyPaymentModel.code = response.data.code
          this.actualApplyPaymentModel.name = response.data.name
          this.actualApplyPaymentModel.applyAmt = response.data.applyAmt
          this.actualApplyPaymentModel.payee = response.data.payee
          this.actualApplyPaymentModel.payeeAccountNo = response.data.payeeAccountNo
          this.actualApplyPaymentModel.payeeBankName = response.data.payeeBankName
          this.actualApplyPaymentModel.accountingObjectName = response.data.accountingObjectName
          this.actualApplyPaymentModel.fCompanyName = response.data.fCompanyName
          this.actualApplyPaymentModel.contractAmt = response.data['contractAmt']
          this.actualApplyPaymentModel.contractName = response.data['contractName']
          this.actualApplyPaymentModel.contractPlanName = response.data['contractPlanName']
          this.actualApplyPaymentModel.contractPlanAmt = response.data['contractPlanAmt']
          this.actualApplyPaymentModel.totalActualPaymentAmt = response.data.totalActualPaymentAmt
          this.actualApplyPaymentModel.amountUnPaid = response.data.applyAmt - response.data.totalActualPaymentAmt
          if (response.data.contractCode) {
            this.isContractPayment = true
          } else {
            this.isNoContractPayment = true
          }
        })
        .catch(error => {
          console.log(error)
          this.$showError(error.message ? error.message : 'msg_system_error')
        })
    },
    handleBack() {
      this.$router.push({
        name: 'ActualPaymentList'
      })
    }
  }
}
</script>


