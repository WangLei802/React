<template>
    <div class='app-container'>
        <div style="text-align:right; margin:10px 0;border-bottom:1px solid #ccc;padding-bottom: 10px;">
            <span class="breadcrumb-child"
                  style="float: left;margin-top: 7px;"> 合同变更</span>
            <el-button size="mini"
                       @click='handleBack'>{{$l("btn_back")}}</el-button>
            <el-button size="mini"
                       type='primary'
                        v-if="$checkPersmissionByCode('cost:dynaCost:save')"
                        :disabled="saveBtnDisabled"
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
                    <!-- 合同编号 -->
                    <el-form-item :label="'合同编号:'">
                        <el-input v-model="form.contractCode"
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
                    <!-- 变更编号 -->
                    <el-form-item :label="'变更编号:'"
                                  prop="contractChangeNumber">
                        <el-input v-model="form.contractChangeNumber"
                                  :disabled="true">

                        </el-input>
                    </el-form-item>

                </el-col>

                <el-col :span="8">
                    <!-- 乙方 -->
                    <el-form-item :label="'乙方:'">
                        <el-input v-model="form.partB"
                                  :disabled="true"></el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="8">
                    <!-- 合同变更类型 -->
                    <el-form-item :label="'合同变更类型:'"
                                  prop="contractChangeType">
                         <fd-select v-model='form.contractChangeType'
                                   :disabled="true"
                                   type="cost_contract_alteration_type"></fd-select>
                      
                    </el-form-item>
                </el-col>

            </el-row>
            <el-row :gutter="12">
                <el-col :span="8">
                    <!-- 合同金额 -->
                    <el-form-item :label="'合同金额(元):'"
                                  prop="constructAmout">
                        <el-input v-model="form.constructAmout"
                                  :disabled="true">

                        </el-input>
                    </el-form-item>

                </el-col>

                <el-col :span="8">
                    <!-- 变更金额 -->
                    <el-form-item :label="'变更金额(元):'">
                        <el-input v-model="form.constructChageAmout"
                                  :disabled="true"></el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="8">
                    <!-- 拆分状态 -->
                    <el-form-item :label="'拆分状态:'"
                                  prop="splitStatus">
                         <span v-if="form.splittingStatus === '0' && form.splittingWay === '0'">已拆分-自动</span>
           <span v-else-if="form.splittingStatus === '0' && form.splittingWay === '1'">已拆分-手动</span>
           <span v-else-if="form.splittingStatus === '1'">未拆分</span>
                      
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
import { LoadingUtil } from '@/utils/common/LoadingUtil'
import { getSplittingAdjust, saveSplittingAdjust } from '@/api/cost/DynamicCostAPI'
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
        splittingWay: '',
        splittingStatus: '', // 拆分状态
        constructChageAmout: '', // 变更金额
        constructAmout: '', // 合同金额
        contractChangeType: '', // 合同变更类型
        partB: '', // 乙方
        contractChangeNumber: '', // 变更编号
        contractName: '', // 合同名称
        projectName: '', // 项目金额
        moduleDataPk: this.$route.query.moduleDataPk,
        moduleType: this.$route.query.moduleType,
        contractCode: '', // 合同编号
        contarctList: [],
        splittingCp2Sb2Ct: [],
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
          this.form.splittingStatus = response.data.splittingStatus
          this.form.splittingWay = response.data.splittingWay
          this.form.constructChageAmout = response.data.contractAlterationModel.alterationAmt
          this.form.constructAmout = response.data.contractModel.contractAmountIncludeTax
          this.form.contractChangeType = response.data.contractAlterationModel.contractTypeCode
          this.form.partB = response.data.contractModel.partyB
          this.form.contractChangeNumber = response.data.contractAlterationModel.code
          this.form.contractName = response.data.contractAlterationModel.contractName
          this.form.projectName = response.data.contractAlterationModel.projectName
          this.form.contractCode = response.data.contractAlterationModel.contractCode
          this.form.tableDataList = response.data.tableDataList // 合约规划
          this.form.adjustmentAmountList = response.data.adjustmentAmountList // 跨期金额分配
          this.form.splittingCp2Sb2Ct = response.data.splittingCp2Sb2Ct
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
      this.form.splittingWay = val
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
      this.form.splittingWay = this.form.splittingWay
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
