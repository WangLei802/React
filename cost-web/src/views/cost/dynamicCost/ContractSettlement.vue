<template>
    <div class='app-container'>
        <div style="text-align:right; margin:10px 0;border-bottom:1px solid #ccc;padding-bottom: 10px;">
            <span class="breadcrumb-child"
                  style="float: left;margin-top: 7px;"> 合同结算</span>
            <el-button size="mini"
                       @click='handleBack'>{{$l("btn_back")}}</el-button>
            <el-button size="mini"
                      :disabled="saveBtnDisabled"
                       type='primary'
                        v-if="$checkPersmissionByCode('cost:dynaCost:save')"
                       @click='saveContractAlteration'>{{$l('btn_save')}}</el-button>
            <el-button size="mini"
                       type='primary'
                       @click='submitIneffectiveCost' v-if="false">{{$l('lbl_cost_compilation_submit')}}</el-button>
        </div>
        <el-form label-width='150px'
                 status-icon
                 :model="form"
                 size="mini">
            <el-row :gutter="12">
                <el-col :span="8">
                    <!-- 项目名称 -->
                    <el-form-item :label="'项目名称:'"
                                  prop="projectName">
                        <el-input v-model="form.paymentContract.projectName"
                                  :disabled="true">

                        </el-input>
                    </el-form-item>

                </el-col>

                <el-col :span="8">
                    <!-- 合同编号 -->
                    <el-form-item :label="'合同编号:'">
                        <el-input v-model="form.paymentContract.contractNumber"
                                  :disabled="true"></el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="8">
                    <!-- 合同名称 -->
                    <el-form-item :label="'合同名称:'"
                                  prop="contractName">
                        <el-input v-model='form.paymentContract.contractName'
                                  :disabled="true"></el-input>
                    </el-form-item>
                </el-col>

            </el-row>
            <el-row :gutter="12">

                <el-col :span="8">

                    <el-form-item :label="'合同金额(元):'">
                        <el-input v-model="form.paymentContract.contractValue"
                                  :disabled="true"></el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="8">

                    <el-form-item :label="'结算金额(元):'"
                                  prop="contractSettleAmout">
                        <el-input v-model='form.paymentContract.conveySureMoney'
                                  :disabled="true"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">

                    <el-form-item :label="'拆分状态:'">
                       <el-input v-model="form.paymentContract.splitStatus"
                                  :disabled="true">
                            
                        </el-input>
                    </el-form-item>

                </el-col>

            </el-row>

            <div class="subTitle"
                 style="margin-top: 60px">
                <div class="breadcrumb-child"
                     style="border-bottom:1px solid #ccc;margin-bottom:10px;padding-bottom: 10px;">
                    <i></i>业态金额分配调整
                </div>
                <div>
                    <FormatAlocation v-model="form.splittingCp2Sb2Ct"
                                     :splittingWay="splittingWay"
                                     @saveSplit="saveSplit"></FormatAlocation>

                </div>
            </div>
        </el-form>
    </div>
</template>

<script>
import { getSplittingAdjust, saveSplittingAdjust } from '@/api/cost/DynamicCostAPI'
import { LoadingUtil } from '@/utils/common/LoadingUtil'
import FormatAlocation from '@/views/cost/dynamicCost/FormatAlocation'
export default {
  components: {
    FormatAlocation
  },
  data() {
    return {
      saveBtnDisabled: false,
      splittingWay: '',
      contractId: '',
      isEdit: false,
      form: {
        paymentContract: {
          projectName: '', // 项目名称
          contractName: '', // 合同名称
          contractNumber: '',
          conveySureMoney: '', // 转固金额
          splitStatus: '合同结算',
          contractValue: ''
        },
        splittingCp2Sb2Ct: []
      }
    }
  },
  mounted: function() {
    this.init()
  },
  methods: {
    init() {
      if (this.$route.query.moduleType) {
        this.isEdit = false
        LoadingUtil.showLoading()
        getSplittingAdjust({ 'moduleType': this.$route.query.moduleType, 'moduleDataPK': this.$route.query.moduleDataPk }).then(response => {
          LoadingUtil.hideLoading()
          this.form.paymentContract = response.data.paymentContract
          this.form.paymentContract.splitStatus = '合同结算'
          this.form.splittingCp2Sb2Ct = response.data.splittingCp2Sb2Ct
          this.splittingWay = response.data.splittingWay
          this.form.moduleDataPk = response.data.moduleDataPk
          this.form.moduleType = response.data.moduleType
        }).catch(error => {
          console.log(error)
          this.$showError(error.message ? error.message : 'msg_system_error')
        })
      } else {
        // 新增
        this.isEdit = true
      }
    },
    saveSplit(val) {
      this.splittingWay = val
    },
    // 提交审批
    submitIneffectiveCost() {
      let queryModel = {
        contractId: this.contractId
      }
      submitContractController(queryModel).then(response => {
        if (response.code !== '2000') {
          this.$showError(response.message)
        } else {
          this.$showSuccess(response.message)
          this.$router.push({
            name: 'DynamicCostList'
          })
        }
      }).catch(error => {
        console.log(error)
        this.$showError(error.message ? error.message : 'msg_system_error')
      })
    },
    // 保存
    saveContractAlteration() {
      LoadingUtil.showLoading()
      this.form.splittingWay = this.splittingWay
      saveSplittingAdjust(this.form)
        .then(response => {
          LoadingUtil.hideLoading()
          this.$showSuccess(response.message)
          this.form.id = response.data
          this.saveBtnDisabled = true
        })
        .catch(error => {
          console.log(error)
          this.$showError(error.message ? error.message : 'msg_system_error')
        })
    },

    handleBack() {
      this.$router.push({
        name: 'DynamicCostList'

      })
    },
    handleClick(tab, event) {
      console.log(tab, event)
    }
  }

}
</script>

<style>
</style>
