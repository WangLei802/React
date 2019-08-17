<template>
    <div class='app-container'>
        <div style="text-align:right; margin:10px 0;border-bottom:1px solid #ccc;padding-bottom: 10px;">
            <span class="breadcrumb-child"
                  style="float: left;margin-top: 7px;" v-if="moduleType === '3_1_1'"> 现场签证二次造价确认</span>
            <span class="breadcrumb-child"
                  style="float: left;margin-top: 7px;" v-if="moduleType === '3_1_0'"> 现场签证一次造价确认</span>
            <el-button size="mini"
                       @click='handleBack'>{{$l("btn_back")}}</el-button>
            <el-button size="mini"
                       type='primary'
                        :disabled="saveBtnDisabled"
                         v-if="$checkPersmissionByCode('cost:dynaCost:save')"
                       @click='saveContractAlteration'>{{$l("btn_save")}}</el-button>
            <el-button size="mini"
                       icon='el-icon-back'
                       type='primary'
                       @click='submitIneffectiveCost' v-if="false">{{$l('lbl_cost_compilation_submit')}}</el-button>
        </div>
        <el-form label-width='150px'
                 status-icon
                 :model="form"
                 size="mini">
            <el-row :gutter="12">
                <el-col :span="8">
                    <!-- 指令单编号 -->
                    <el-form-item :label="'指令单编号:'"
                                  prop="code">
                        <el-input v-model="form.code"
                                  :disabled="true">

                        </el-input>
                    </el-form-item>

                </el-col>

                <el-col :span="8">
                    <!-- 设计变更编号 -->
                    <el-form-item :label="'设计变更编号:'">
                        <el-input v-model="form.alterationVisaCode"
                                  :disabled="true"></el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="8">
                    <!-- 合同名称 -->
                    <el-form-item :label="'合同名称:'"
                                  prop="contractName">
                        <el-input v-model='form.contractName'
                                  :disabled="true"></el-input>
                    </el-form-item>
                </el-col>

            </el-row>
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
                    <!-- 现场签证金额 -->
                    <el-form-item :label="'现场签证金额(元):'"
                                  prop="costConfirmAmt">
                        <el-input v-model='form.costConfirmAmt'
                                  :disabled="true"></el-input>
                    </el-form-item>
                </el-col>

            </el-row>

            <div class="subTitle"
                 style="margin-top: 60px">
               <FormatAlocation v-model="splittingModels_cp2sb2ct"
                                 :splittingWay="splittingWay"
                                 @saveSplit="saveSplit"></FormatAlocation>
              <!-- <el-tabs v-model="activeName"
                             type="card"
                             @tab-click="handleClick">
                        <el-tab-pane :key="item.splittingWay"
                                     v-for="(item,index) in form.contractModels_splitting_cp2sb2ct"
                                     :label="item.splittingWay"
                                     :name="item.splittingWay">
                           
                            <ChangeFormatAlocation v-model="item.splittingModels_cp2sb2ct"
                                                   :splittingWay="item.splittingWay"
                                                   @saveSplit="saveSplit"></ChangeFormatAlocation> 
                           
                        </el-tab-pane> 

                    </el-tabs> -->
            </div>
        </el-form>
    </div>
</template>

<script>
import ChangeFormatAlocation from '@/views/cost/dynamicCost/ChangeFormatAlocation'
import { getSplittingAdjust, saveSplittingAdjust } from '@/api/cost/DynamicCostAPI'
import { LoadingUtil } from '@/utils/common/LoadingUtil'
import FormatAlocation from '@/views/cost/dynamicCost/FormatAlocation'
export default {
  components: {
    FormatAlocation,
    ChangeFormatAlocation
  },
  data() {
    return {
      splittingModels_cp2sb2ct: [],
      moduleType: '',
      activeName: '',
      saveBtnDisabled: false,
      splittingWay: '',
      contractId: '',
      isEdit: false,
      form: {
        code: '', // 指令单编号
        alterationVisaCode: '', // 设计变更编号
        contractName: '', // 合同名称
        projectName: '', // 项目名称
        costConfirmAmt: '', // 设计变更金额
        contractModels_splitting_cp2sb2ct: []
      }
    }
  },
  mounted: function() {
    this.moduleType = this.$route.query.moduleType
    this.init()
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event)
    },
    saveSplit(val) {
      this.form.contractModels_splitting_cp2sb2ct.forEach((item, index) => {
        this.form.contractModels_splitting_cp2sb2ct[index].splittingWay = val
      })
      this.splittingWay = val
    },
    init() {
      if (this.$route.query.moduleType) {
        this.isEdit = false
        LoadingUtil.showLoading()
        getSplittingAdjust({ 'moduleType': this.$route.query.moduleType, 'moduleDataPK': this.$route.query.moduleDataPk }).then(response => {
          LoadingUtil.hideLoading()
          this.form.code = response.data.designAlterationInstructionModel.code
          this.form.alterationVisaCode = response.data.designAlterationInstructionModel.alterationVisaCode
          this.form.contractName = response.data.designAlterationInstructionModel.contractName
          this.form.projectName = response.data.designAlterationInstructionModel.projectName
          this.form.costConfirmAmt = response.data.designAlterationInstructionModel.costConfirmAmt
          this.form.contractModels_splitting_cp2sb2ct = response.data.contractModels_splitting_cp2sb2ct
          if (this.form.contractModels_splitting_cp2sb2ct.length > 0) {
            // this.form.splittingWay = this.form.contractModels_splitting_cp2sb2ct[0].splittingWay
            this.splittingWay = this.form.contractModels_splitting_cp2sb2ct[0].splittingWay
          }
          this.splittingModels_cp2sb2ct = this.form.contractModels_splitting_cp2sb2ct[0].splittingModels_cp2sb2ct

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
    // 返回
    handleBack() {
      this.$router.push({
        name: 'DynamicCostList'
      })
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
      // this.form.splittingWay = this.splittingWay
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
    }

  },
  watch: {

  }
}
</script>

<style>
</style>
