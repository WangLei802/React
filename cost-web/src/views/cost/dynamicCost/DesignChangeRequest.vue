<template>
    <div class='app-container'>
        <div style="text-align:right; margin:10px 0;border-bottom:1px solid #ccc;padding-bottom: 10px;">
            <span class="breadcrumb-child"
                  style="float: left;margin-top: 7px;"> 设计变更</span>
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
                    <!-- 项目名称  designAlteration -->
                    <el-form-item :label="'项目名称:'"
                                  prop="projectName">
                        <el-input v-model="form.designAlteration.projectName"
                                  :disabled="true">

                        </el-input>
                    </el-form-item>

                </el-col>

                <el-col :span="8">
                    <!-- 现场签证编号 -->
                    <el-form-item :label="'现场签证编号:'">
                        <el-input v-model="form.designAlteration.code"
                                  :disabled="true"></el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="8">
                    <!-- 拆分状态 -->
                    <el-form-item :label="'拆分状态:'">
                        <el-input v-model='form.designAlteration.splitStatus'
                                  :disabled="true"></el-input>
                    </el-form-item>
                </el-col>

            </el-row>
            <div class="subTitle"
                 style="margin-top: 60px">
                <div class="breadcrumb-child"
                     style="border-bottom:1px solid #ccc;margin-bottom:10px;padding-bottom: 10px;">
                    <i></i>关联合同详细内容
                </div>
                <div>
                    <el-table :data="form.designAlterationContractList"
                              stripe
                              border
                              tooltip-effect="dark"
                              style="width: 100%"
                              size="small">
                        <el-table-column :label="$l('lbl_no')"
                                         width="60"
                                         type="index">
                        </el-table-column>

                        <el-table-column prop="contractCode"
                                         label="合同编号"
                                         width="150">

                        </el-table-column>

                        <el-table-column width="150"
                                         prop="contractName"
                                         label="合同名称">

                        </el-table-column>
                        <el-table-column width="100"
                                         prop="supplier"
                                         label="供方"
                                         :disabled="true">

                        </el-table-column>
                        <el-table-column prop="alterationEstimatedAmt"
                                         label="设计变更预估金额(元)"
                                         width="150"
                                         :disabled="true">
                            <template slot-scope="scope">
                                        {{ scope.row.alterationEstimatedAmt|NumFormat}}
                            </template>
                        </el-table-column>
                        <el-table-column prop="alterationContent"
                                         label="设计变更详细内容"
                                         width="150"
                                         :disabled="true">

                        </el-table-column>

                        <el-table-column prop="isReprocess"
                                         label="是否涉及返工"
                                         width="150">
                            <template slot-scope="scope">
                                <span v-if="scope.row.isReprocess === '1'">涉及</span>
                                <span v-if="scope.row.isReprocess === '0'">不涉及</span>
                            </template>
                        </el-table-column>

                        <!--  <el-table-column prop="isReprocess" width="150"
                                     label="是否涉及返工">
                      <template slot-scope="scope">
                      <span v-if="scope.row.isReprocess === '1'">涉及</span>
                        <span v-if="scope.row.isReprocess === '0'">不涉及</span>
                      </template>
                    </el-table-column>-->
                        <el-table-column prop="isHasIneffective"
                                         width="150"
                                         label="是否有无效成本"
                                         :disabled="true">

                        </el-table-column>
                        <el-table-column prop="ineffectiveContent"
                                         width="150"
                                         label="无效成本类别"
                                         :disabled="true">

                        </el-table-column>
                        <el-table-column prop="ineffectiveAmt"
                                         width="150"
                                         label="无效成本金额(元)"
                                         :disabled="true">
                             <template slot-scope="scope">
                                        {{ scope.row.ineffectiveAmt|NumFormat}}
                            </template>
                        </el-table-column>
                        <el-table-column prop="ineffectiveResponsibleDept"
                                         width="150"
                                         label="无效成本责任部门"
                                         :disabled="true">

                        </el-table-column>
                        <el-table-column prop="ineffectiveContent"
                                         width="150"
                                         label="无效成本内容"
                                         :disabled="true">

                        </el-table-column>
                        <el-table-column prop="ineffectiveDesc"
                                         label="无效成本描述"
                                         :disabled="true">

                        </el-table-column>

                    </el-table>
                </div>
            </div>
            <div class="subTitle"
                 style="margin-top: 60px">
                <div class="breadcrumb-child"
                     style="border-bottom:1px solid #ccc;margin-bottom:10px;padding-bottom: 10px;">
                    <i></i>成本拆分
                </div>
                <div>
                    <el-tabs v-model="activeName"
                             type="card"
                             @tab-click="handleClick">
                        <el-tab-pane :key="item.contractCode"
                                     v-for="(item,index) in form.contractModels_splitting_cp2sb2ct"
                                     :label="item.contractCode"
                                     :name="item.contractCode">

                            <ChangeFormatAlocation v-model="item.splittingModels_cp2sb2ct"
                                                   :splittingWay="item.splittingWay"
                                                   @saveSplit="saveSplit"></ChangeFormatAlocation>
                            <!-- contractModels_splitting_cp2sb2ct[i].splittingModels_cp2sb2ct -->
                        </el-tab-pane>

                    </el-tabs>

                </div>
            </div>
        </el-form>
    </div>
</template>

<script>
import { NumFormat, Version } from '@/filters/cost/'
import { getSplittingAdjust, saveSplittingAdjust } from '@/api/cost/DynamicCostAPI'
import { LoadingUtil } from '@/utils/common/LoadingUtil'
import ChangeFormatAlocation from '@/views/cost/dynamicCost/ChangeFormatAlocation'
export default {
  filters: {
    NumFormat, Version
  },
  components: {
    ChangeFormatAlocation
  },
  data() {
    return {
      saveBtnDisabled: false,
      activeName: '',
      splittingWay: '',
      contractId: '',
      isEdit: false,
      form: {
        designAlteration: {
          projectName: '',
          code: '',
          splitStatus: '设计变更' // 拆分状态
        },
        designAlterationContractList: [],
        contractModels_splitting_cp2sb2ct: [],
        contarctList: []

      }
    }
  },
  mounted: function() {
    this.init()
  },
  methods: {
    saveSplit(val) {
      this.splittingWay = val

      this.form.contractModels_splitting_cp2sb2ct.forEach((item, index) => {
        this.form.contractModels_splitting_cp2sb2ct[index].splittingWay = val[0].splittingWay
      })
    },
    init() {
      if (this.$route.query.moduleType) {
        this.isEdit = false
        LoadingUtil.showLoading()
        getSplittingAdjust({ 'moduleType': this.$route.query.moduleType, 'moduleDataPK': this.$route.query.moduleDataPk }).then(response => {
          LoadingUtil.hideLoading()
          this.form.designAlteration.projectName = response.data.designAlteration.projectName
          this.form.designAlteration.code = response.data.designAlteration.code
          this.form.designAlterationContractList = response.data.designAlterationContractList
          this.form.contractModels_splitting_cp2sb2ct = response.data.contractModels_splitting_cp2sb2ct
          this.form.moduleType = response.data.moduleType
          this.form.moduleDataPk = response.data.moduleDataPk

          if (this.form.contractModels_splitting_cp2sb2ct.length > 0) {
            this.activeName = this.form.contractModels_splitting_cp2sb2ct[0].contractCode
          }

          // 成本拆分
        }).catch(error => {
          console.log(error)
          this.$showError(error.message ? error.message : 'msg_system_error')
        })
      } else {
        // 新增
        this.isEdit = true
      }
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

