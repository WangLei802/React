<template>
    <div class='app-container'>
        <div style="text-align:right; margin:10px 0;">
            <el-button size="mini"
                       @click='handleBack'>{{$l("btn_back")}}</el-button>
            <el-button size="mini"
                       type='primary'
                        :disabled="saveBtnDisabled"
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
                        <el-input v-model="form.projectName"
                                  :disabled="true">

                        </el-input>
                    </el-form-item>

                </el-col>

                <el-col :span="8">
                    <!-- 申请编号 -->
                    <el-form-item :label="'申请编号:'">
                        <el-input v-model="form.applyCode"
                                  :disabled="true"></el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="8">
                    <!-- 申请金额(元) -->
                    <el-form-item :label="'申请金额(元):'"
                                  prop="applyAmout">
                        <el-input v-model='form.applyAmout'
                                  :disabled="true"></el-input>
                    </el-form-item>
                </el-col>

            </el-row>
            <el-row :gutter="12">
                <el-col :span="8">
                    <!-- 合约规划 -->
                    <el-form-item :label="'合约规划:'"
                                  prop="contractPlay">
                        <el-input v-model="form.contractNumber"
                                  :disabled="true">

                        </el-input>
                    </el-form-item>

                </el-col>

                <el-col :span="8">
                    <!-- 拆分状态 -->
                    <el-form-item :label="'拆分状态:'">
                     
                        <span v-if="form.splitStatus === '0' && form.splittingWay === '0'">已拆分-自动</span>
                        <span v-else-if="form.splitStatus === '0' && form.splittingWay === '1'">已拆分-手动</span>
                        <span v-else-if="form.splitStatus === '1'">未拆分</span>
                      
                    
                      
                    </el-form-item>
                </el-col>

            </el-row>

            <div class="subTitle"
                 style="margin-top: 60px">

                <div>
                    <FormatAlocation v-model="form.splittingCp2Sb2Ct"
                                     :splittingWay="form.splittingWay"
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
      size: 4,
      isEdit: false,
      form: {
        splitStatus: '', // 拆分状态
        contractNumber: '', // 合约规划
        applyAmout: '', // 申请金额
        applyCode: '', // 申请编号
        projectName: '', // 项目名称
        splittingCp2Sb2Ct: [],
        contarctList: [],
        moduleDataPk: this.$route.query.moduleDataPk,
        moduleType: '7_1',
        splittingWay: '',
        activeName: '选项1',
        costSplitList: [{
          name: '选项1',
          title: '合同编号xxx'
        }, {
          name: '选项2',
          title: '合同编号yyy'
        }]
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
          if (response.code === '2000') {
            this.form.splitStatus = response.data.splittingStatus
            this.form.contractNumber = response.data.applyPaymentNoContractModel.contractPlanName
            this.form.applyAmout = response.data.applyPaymentNoContractModel.applyAmt
            this.form.applyCode = response.data.applyPaymentNoContractModel.applyPaymentCode
            this.form.projectName = response.data.applyPaymentNoContractModel.projectName
            this.form.splittingCp2Sb2Ct = response.data.splittingCp2Sb2Ct
            this.form.splittingWay = response.data.splittingWay
          }
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
