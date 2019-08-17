<!-- StandaredSubjectList.vue -->
<template>
    <div class="app-container">
        <div class="add">
          <el-button size="mini"
                     @click="goback">{{$l("btn_back")}}</el-button>
        </div>
        <div>
          <div class="form-unit"><span>定标结果合同信息</span>

          </div>
          <el-form
            ref="form"
            :model="form"
            class="demo-form-inline"
            label-width="150px">
            <el-row>
              <el-col :span="8">
                <el-form-item :label="'项目编号：'">
                  <el-input v-model="form.projectCode"
                            placeholder="请输入内容"
                            :disabled="true"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="'项目名称：'">
                  <el-input v-model="form.projectName"
                            placeholder="请输入内容"
                            :disabled="true"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="'分期编号：'">
                  <el-input v-model="form.accountingObjectCode"
                            placeholder="请输入内容"
                            :disabled="true"></el-input>
                </el-form-item>
              </el-col>
            </el-row>


            <el-row>
            <el-col :span="8">
              <el-form-item :label="'分期名称：'">
                <el-input v-model="form.accountingObjectName"
                          placeholder="请输入内容"
                          :disabled="true"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item :label="'合约规划名称：'">
                <el-input v-model="form.contractPlanName"
                          placeholder="请输入内容"
                          :disabled="true"></el-input>
              </el-form-item>
            </el-col>

              <el-col :span="8">
                <el-form-item :label="'中标金额(元)：'">
                  <el-input v-model="form.bidMoney"
                            placeholder="请输入内容"
                            :disabled="true"></el-input>
                </el-form-item>
              </el-col>
          </el-row>


          <el-row>

            <el-col :span="8">
              <el-form-item :label="'招标唯一识别编码：'">
                <el-input v-model="form.bidId"
                          placeholder="请输入内容"
                          :disabled="true"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="'招标类型：'">
                <el-input v-model="form.bidType"
                          placeholder="请输入内容"
                          :disabled="true"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="'定标唯一标识编码：'">
                <el-input v-model="form.sureBidId"
                          placeholder="请输入内容"
                          :disabled="true"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

            <el-row>


            <el-col :span="8">
              <el-form-item :label="'中标标段：'">
                <el-input v-model="form.successBidSection"
                          placeholder="请输入内容"
                          :disabled="true"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="'中标供应商编码：'">
                <el-input v-model="form.supplierCode"
                          placeholder="请输入内容"
                          :disabled="true"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="'中标供应商名称：'">
                <el-input v-model="form.supplierName"
                          placeholder="请输入内容"
                          :disabled="true"></el-input>
              </el-form-item>
            </el-col>
            </el-row>

            <el-row>

              <el-col :span="8">
                <el-form-item :label="'签约供应商编码：'">
                  <el-input v-model="form.signSupplierCode"
                            placeholder="请输入内容"
                            :disabled="true"></el-input>
                </el-form-item>
              </el-col>

              <el-col :span="8">
                <el-form-item :label="'签约供应商名称：'">
                  <el-input v-model="form.signSupplierName"
                            placeholder="请输入内容"
                            :disabled="true"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="'招标标题：'">
                  <el-input v-model="form.bidTitle"
                            placeholder=""
                            :disabled="true"></el-input>
                </el-form-item>
              </el-col>
            </el-row>



          </el-form>
        </div>
    </div>
</template>

<script>
import { LoadingUtil } from '@/utils/common/LoadingUtil'
import { getCostBidding } from '@/api/cost/signContractAPI'

import COSTENUM from '@/utils/cost/enum'
export default {
  data() {
    return {
      form: {
        projectName: '',
        projectCode: '',
        bidMoney: '',
        bidId: '',
        bidType: '',
        bidTitle:'',
        sureBidId: '',
        successBidSection: '',
        supplierCode: '',
        supplierName: '',
        signSupplierCode: '',
        signSupplierName: '',
        accountingObjectName: '',
        contractPlanName: '',
        contractPlanCode: '',
        accountingObjectCode: ''

      },
      routerSource: ''
    }
  },

  mounted() {
    this.routerSource = this.$route.query.routerSource
    this.getContractData()
  },

  methods: {
    goback() {
      if (this.routerSource && this.routerSource === 'detail') {
        this.$router.go(-1)
      } else {
        this.$router.push({
          name: 'ContractSignPrimaryList'
        })
      }
    },
    getContractData() {
      let queryObj = {
        id: this.$route.query.contractId
      }
      getCostBidding(queryObj)
        .then(response => {
          LoadingUtil.hideLoading()
          if (response.code === '2000') {
            this.form.projectName = response.data.projectName
            this.form.projectCode = response.data.projectCode
            this.form.bidMoney = response.data.bidMoney
            this.form.bidId = response.data.bidId
            this.form.bidType = response.data.bidType
            this.form.bidTitle = response.data.bidTitle
            this.form.sureBidId = response.data.sureBidId
            this.form.successBidSection = response.data.successBidSection
            this.form.supplierCode = response.data.supplierCode
            this.form.supplierName = response.data.supplierName
            this.form.signSupplierCode = response.data.signSupplierCode
            this.form.signSupplierName = response.data.signSupplierName
            this.form.accountingObjectName = response.data.accountingObjectName
            this.form.contractPlanName = response.data.contractPlanName
            this.form.contractPlanCode = response.data.contractPlanCode
            this.form.accountingObjectCode = response.data.accountingObjectCode
          }
        })
        .catch(error => {
          console.log(error)
          this.$showError(error.message ? error.message : 'msg_system_error')
        })
    }

  }
}

</script>
<style scoped>
.add {
  margin-top:10px;
  margin-bottom: 5px;
  text-align: right;
}
</style>
