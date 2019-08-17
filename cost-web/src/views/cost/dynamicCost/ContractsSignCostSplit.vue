<template>
    <div class='app-container'>

        <div style="text-align:right; margin:10px 0;border-bottom:1px solid #ccc;padding-bottom: 10px;">
            <span class="breadcrumb-child"
                  style="float: left;margin-top: 7px;"> 设计变更拆分</span>
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
                 :model="form"
                 size="mini">
            <el-row>

                <el-col :span="8">
                    <el-form-item :label="'项目名称:'">
                        <el-input v-model="form.projectName"
                                  :disabled="true">

                        </el-input>

                    </el-form-item>
                </el-col>

                <el-col :span="8">
                    <el-form-item :label="'合同编号:'">
                        <el-input v-model="form.contractCode"
                                  :disabled="true"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item :label="'合同名称:'">
                        <el-input v-model='form.contractName'
                                  :disabled="true"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>

                <el-col :span="8">

                    <el-form-item :label="'合同金额(元):'">
                        <el-input v-model='form.contractAmountIncludeTax'
                                  :disabled="true"></el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="8">
                    <!--0 是已拆分  1是未拆分 -->
                    <el-form-item :label="'拆分状态:'">
                        <fd-select v-model='form.splitStatus'
                                   :disabled="true"
                                   type="cost_contract_alteration_type"></fd-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <div class="subTitle"
                 style="margin-top: 20px">
                <div class="breadcrumb-child">
                    <i></i>
                </div>
            </div>
            <div>
                <el-table :data="form.dynaCostCPModelList"
                          stripe
                          border
                          tooltip-effect="dark"
                          style="width: 100%"
                          size="small">
                    <el-table-column :label="$l('lbl_no')"
                                     width="60"
                                     type="index">
                    </el-table-column>

                    <el-table-column prop="accountingObjName"
                                     label="成本分期"
                                     width="100">

                    </el-table-column>

                    <el-table-column width="120"
                                     prop="cpName"
                                     label="合约规划名称">

                    </el-table-column>
                    <el-table-column width="150"
                                     prop="cpTotalAmount"
                                     label="合约规划总金额（A）"
                                     :disabled="true">
                         <template slot-scope="scope">
                              {{ scope.row.cpTotalAmount|NumFormat}}
                          </template>
                    </el-table-column>
                    <el-table-column prop="cpAmountOccurence"
                                     label="已发生金额（B）"
                                     width="150"
                                     :disabled="true">
                         <template slot-scope="scope">
                              {{ scope.row.cpAmountOccurence|NumFormat}}
                          </template>
                    </el-table-column>
                    <el-table-column prop="amountPendingApprove"
                                     label="在途金额（C）"
                                     width="150"
                                     :disabled="true">
                         <template slot-scope="scope">
                            {{ scope.row.amountPendingApprove|NumFormat}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="amountReleased"
                                     label="已释放金额（D）"
                                     width="150"
                                     :disabled="true">
                           <template slot-scope="scope">
                              {{ scope.row.amountReleased|NumFormat}}
                          </template>
                    </el-table-column>
                    <el-table-column prop="amountPendingOccurence"
                                     label="待发生金额（E=A-B-C-D）"
                                     width="200"
                                     :disabled="true">
                      <template slot-scope="scope">
                            {{ scope.row.amountPendingOccurence|NumFormat}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="contractTotalAmount"
                                     label="合同金额（F）"
                                     </el-table-column>
                                     <el-table-column
                                     prop="reservedChangeAmount"
                                     label="预留变更金额（G）"
                                     width="150"
                                     :disabled="true">
                                <template slot-scope="scope">
                                    {{ scope.row.contractTotalAmount|NumFormat}}
                                </template>
                    </el-table-column>
                    <el-table-column prop="remainedPendingOccurenceAmount"
                                     label="剩余待发生金额（H=E-F-G）"
                                     width="200"
                                     :disabled="true">
                    <template slot-scope="scope">
                                        {{ scope.row.remainedPendingOccurenceAmount|NumFormat}}
                                    </template>
                    </el-table-column>

                </el-table>
            </div>
            <div class="subTitle"
                 style="margin-top: 60px">
                <div class="breadcrumb-child"
                     style="border-bottom:1px solid #ccc;margin-bottom:10px;padding-bottom: 10px;">
                    <i></i>拆分至科目
                </div>
                <div>
                    <el-table :data="form.splittingCp2Sb"
                              stripe
                              border
                              tooltip-effect="dark"
                              style="width: 100%"
                              size="small">
                        <el-table-column :label="$l('lbl_no')"
                                         width="80"
                                         type="index">
                        </el-table-column>

                        <el-table-column prop="accountingObjName"
                                         label="成本分期">

                        </el-table-column>

                        <el-table-column width="200"
                                         prop="cpName"
                                         label="合约规划">

                        </el-table-column>
                        <el-table-column width="200"
                                         prop="sbName"
                                         label="科目"
                                         :disabled="true">

                        </el-table-column>
                        <el-table-column prop="sharingRuleName"
                                         label="分摊规则"
                                         width="200"
                                         :disabled="true">

                        </el-table-column>
                        <el-table-column prop="amount"
                                         label="拆分合同金额(元)"
                                         width="150"
                                         :disabled="true">
                            <template slot-scope="scope">
                                        {{ scope.row.amount|NumFormat}}
                                    </template>
                        </el-table-column>

                    </el-table>

                </div>
            </div>
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
<script >
import { LoadingUtil } from '@/utils/common/LoadingUtil'
import { ptn } from '@/utils/common/validate'
import { getSplittingAdjust, saveSplittingAdjust } from '@/api/cost/DynamicCostAPI'
import { getMeProfile } from '@/api/sys/userAPI'
import { NumFormat, Version, cutString } from '@/filters/cost/'
import FormatAlocation from '@/views/cost/dynamicCost/FormatAlocation'

export default {
  components: {
    FormatAlocation
  },
  filters: {
    NumFormat,
    Version,
    cutString
  },
  data() {
    return {
      saveBtnDisabled: false,
      splittingWay: '',
      contractId: '',
      size: 4,
      isEdit: false,
      form: {
        moduleType: '',
        contractName: '', // 合同名称
        projectName: '', // 项目名称
        contractCode: '', // 合同编号
        splitStatus: '', // 拆分状态
        moduleDataPk: '',
        contractAmountIncludeTax: '', // 合同金额
        dynaCostCPModelList: [], // 合约规划
        splittingCp2Sb: [], // 拆分科目
        splittingCp2Sb2Ct: [] // 业态金额分配调整
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
          this.form = response.data.contractModel
          this.form.dynaCostCPModelList = response.data.dynaCostCPModelList
          this.form.splittingCp2Sb = response.data.splittingCp2Sb
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
    // 返回
    handleBack() {
      this.$router.push({
        name: 'DynamicCostList'
      })
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
    }

  },
  watch: {

  }
}
</script>


