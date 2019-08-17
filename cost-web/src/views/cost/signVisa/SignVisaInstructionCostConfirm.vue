<template>
    <div class='app-container'>

        <div style="text-align:right; margin:10px 0;">
            <el-button size="mini"
                       v-if="!$store.state.user.isFromBpm"
                       @click='handleBack'>{{$l("btn_back")}}</el-button>
            <el-button size="mini"
                       type='primary'
                       :disabled="buttonDisable"
                       v-show="isShowAdd"
                       @click='saveCostConfirm'>{{$l('btn_save')}}</el-button>
            <el-button size="mini"
                       type='primary'
                       @click='submitModel'
                       v-show="isShowSubmit"
                       :disabled="buttonDisable">{{$l('lbl_cost_compilation_submit')}}</el-button>
        </div>
        <div>
            <el-steps :active="4"
                      :align-center="true"
                      space="70%"
                      style="margin-bottom: 20px">
                <el-step title="现场签证申请"
                         :style="{'cursor':'pointer'}"
                         @click.native="gotoDesign"></el-step>
                <el-step title="指令单下发"
                         :style="{'cursor':'pointer'}"
                         @click.native="gotoInstruct"></el-step>
                <el-step title="完工确认"
                         :style="{'cursor':'pointer'}"
                         @click.native="gotoCompletion"></el-step>
                <el-step title="造价确认"></el-step>
            </el-steps>
        </div>

        <div class="form-unit">指令单信息</div>

        <el-form label-width='150px'
                 status-icon
                 :disabled="allButtonDisable"
                 :model="designAlterationModel"
                 ref="designAlterationModel"
                 :rules="rules"
                 size="mini">
            <el-row>

                <el-col :span="8">
                    <!-- 指令单编号 -->
                    <el-form-item :label="'指令单编号：'">
                        <el-input v-model="designAlterationModel.code"
                                  :disabled="true"></el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="8">
                    <!-- 现场签证编号 -->
                    <el-form-item :label="'现场签证编号：'"
                                  prop="accountObjectId">
                        <el-input v-model="designAlterationModel.alterationVisaCode"
                                  :disabled="true"></el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="8">
                    <!-- 项目名称 -->
                    <div class="grid-content bg-purple">
                        <el-form-item :label="'项目名称：'">
                            <el-input v-model="designAlterationModel.projectName"
                                      :disabled="true"></el-input>
                        </el-form-item>
                    </div>
                </el-col>

            </el-row>

            <el-row>

                <el-col :span="8">
                    <!-- 合同名称 -->
                    <div class="grid-content bg-purple">
                        <el-form-item :label="'合同名称：'">
                            <el-input v-model="designAlterationModel.contractName"
                                      :disabled="true"></el-input>
                        </el-form-item>
                    </div>
                </el-col>

                <el-col :span="8">
                    <!-- 供应商名称 -->
                    <el-form-item :label="'供应商名称：'">
                        <fd-select v-model='designAlterationModel.constructionUnit'
                                   type="cost_dal_construct"
                                   :disabled="true"></fd-select>
                    </el-form-item>
                </el-col>

            </el-row>

            <el-row>
                <el-col :span="24">
                    <!-- 详细内容 -->
                    <el-form-item :label="'详细内容：'">
                        <el-input type="textarea"
                                  autosize
                                  :disabled="true"
                                  v-model="designAlterationModel.variationContent">
                        </el-input>
                    </el-form-item>
                </el-col>

            </el-row>

            <div class="form-unit">完工信息</div>

            <el-row>
                <el-col :span="8">
                    <!-- 施工开始日期 -->
                    <el-form-item :label="'施工开始日期：'">
                        <el-date-picker v-model='designAlterationModel.constructStartDate'
                                        :disabled="true"
                                        type="date">
                        </el-date-picker>
                    </el-form-item>
                </el-col>

                <el-col :span="8">
                    <!-- 施工结束日期 -->
                    <el-form-item :label="'施工结束日期：'">
                        <el-date-picker v-model='designAlterationModel.constructEndDate'
                                        :disabled="true"
                                        type="date">
                        </el-date-picker>
                    </el-form-item>
                </el-col>

            </el-row>

            <el-row>
                <el-col :span="24">
                    <!-- 具体施工情况 -->
                    <el-form-item :label="'具体施工情况：'">
                        <el-input type="textarea"
                                  autosize
                                  v-model="designAlterationModel.constructContent"
                                  :disabled="true">
                        </el-input>
                    </el-form-item>
                </el-col>

            </el-row>

            <template>
                <el-tabs v-model="activeName2"
                         type="card"
                         @tab-click="handleClick">
                    <el-tab-pane label="造价确认"
                                 name="first">

                            <el-row>
                                <el-col :span="8">
                                    <!-- 预估金额(元) -->
                                    <el-form-item :label="'预估金额(元)：'">
                                        <amount-input v-model='designAlterationModel.estimatedAmt'
                                                  :disabled="true"></amount-input>
                                    </el-form-item>
                                </el-col>

                                <el-col :span="8">
                                    <!-- 供应商上报金额(元) -->
                                    <el-form-item :label="'供应商上报金额(元)：'"
                                                  prop="constructionUnitReportAmt">
                                        <amount-input v-model='designAlterationModel.constructionUnitReportAmt'
                                                  :disabled="needDisable"></amount-input>
                                    </el-form-item>
                                </el-col>

                                <el-col :span="8">
                                    <!-- 造价确认金额(元) -->
                                    <el-form-item :label="'造价确认金额(元)：'"
                                                  prop="costConfirmAmt">
                                        <amount-input :disabled="needDisable" v-model='designAlterationModel.costConfirmAmt'></amount-input>
                                    </el-form-item>
                                </el-col>

                            </el-row>

                      <el-row>
                        <el-col :span="8">
                          <!-- 无效成本类别 -->
                          <el-form-item :label="'无效成本类别：'">
                            <DictionarySelect type="cost_ineffective_type"
                                              v-model="designAlterationModel.ineffectiveType"
                                              :disabled="designAlterationModel.isRetryCostConfirm === '1' || designAlterationModel.isHasIneffective === '0'"
                                              style="width: 100%;"/>
                          </el-form-item>
                        </el-col>

                        <el-col :span="8">
                          <!-- 无效成本责任部门 -->
                          <el-form-item :label="'无效成本责任部门：'">
                            <fd-select v-model='designAlterationModel.ineffectiveResponsibleDept'
                                       style="width: 100%;"
                                       :disabled="designAlterationModel.isRetryCostConfirm === '1' || designAlterationModel.isHasIneffective === '0'"
                                       type="cost_subject_responsible_dept_code"></fd-select>
                          </el-form-item>
                        </el-col>

                        <el-col :span="8">
                          <!-- 无效成本内容 -->
                          <el-form-item :label="'无效成本内容：'">


                            <DictionarySelect type="cost_ineffective_type"
                                              :subType="designAlterationModel.ineffectiveType"
                                              v-model="designAlterationModel.ineffectiveContent"
                                              style="width: 100%;"
                                              :disabled="designAlterationModel.isRetryCostConfirm === '1' || designAlterationModel.isHasIneffective === '0'" />
                          </el-form-item>
                        </el-col>

                      </el-row>

                      <el-row>
                        <el-col :span="24">
                          <!-- 经办人 -->
                          <el-form-item :label="'无效成本描述：'">
                            <el-input type="textarea"
                                      :disabled="designAlterationModel.isRetryCostConfirm === '1' || designAlterationModel.isHasIneffective === '0'"
                                      :autosize="{ minRows: 4, maxRows: 4}"
                                      v-model="designAlterationModel.ineffectiveDesc">
                            </el-input>
                          </el-form-item>
                        </el-col>

                      </el-row>


                            <el-row>
                                <el-col :span="8">
                                    <!-- 预估无效成本(元) -->
                                    <el-form-item :label="'预估无效成本(元)：'">
                                        <amount-input v-model='designAlterationModel.estimatedIneffectiveAmt'
                                                  :disabled="true"></amount-input>
                                    </el-form-item>
                                </el-col>

                                <el-col :span="8">
                                    <!-- 无效成本确认金额(元) -->
                                    <el-form-item :label="'无效成本确认金额(元)：'" prop="ineffectiveConfirmAmt">
                                        <amount-input  v-model='designAlterationModel.ineffectiveConfirmAmt' :disabled="designAlterationModel.isHasIneffective === '0' || designAlterationModel.isRetryCostConfirm === '1'"></amount-input>
                                    </el-form-item>
                                </el-col>

                                <el-col :span="8">
                                    <!-- 成就共享扣款倍数 -->
                                    <el-form-item :label="'成就共享扣款倍数：'">

                                        <fd-select v-model='designAlterationModel.achieveShareRatio'
                                                   :disabled="designAlterationModel.isHasIneffective === '0' || designAlterationModel.isRetryCostConfirm === '1'"
                                                   type="cost_achieveshareratio_code"></fd-select>
                                    </el-form-item>
                                </el-col>

                            </el-row>

                      <el-row v-if="isShowRetryCost">
                        <el-col :span="8">
                          <!-- 造价二次确认金额(元) -->
                          <el-form-item :label="'造价二次确认金额(元)：'"  prop="costRetryConfirmAmt">
                            <amount-input v-model='designAlterationModel.costRetryConfirmAmt'></amount-input>
                          </el-form-item>
                        </el-col>
                        <el-col :span="8">
                          <!-- 无效成本二次确认金额(元) -->
                          <el-form-item :label="'无效成本二次确认金额(元)：'"   title="无效成本二次确认金额(元)" >
                            <amount-input v-model='designAlterationModel.ineffectiveRetryConfirmAmt' :disabled="designAlterationModel.isHasIneffective === '0'"></amount-input>
                          </el-form-item>
                        </el-col>
                        <el-col :span="8">
                          <!-- 成就共享二次确认 -->
                          <el-form-item :label="'成就共享二次确认扣款倍数：'" title="成就共享二次确认扣款倍数" >

                            <fd-select v-model='designAlterationModel.achieveShareRatioRetry'
                                       :disabled="designAlterationModel.isHasIneffective === '0'"
                                       style="width: 100%;"
                                       type="cost_achieveshareratio_code"></fd-select>
                          </el-form-item>
                        </el-col>
                      </el-row>

                            <el-row>
                                <el-col :span="24">
                                    <!-- 经办人 -->
                                    <el-form-item :label="'造价确认内容：'">
                                        <el-input type="textarea"
                                                  :disabled="needDisable"
                                                  :autosize="{ minRows: 4, maxRows: 4}"
                                                  v-model="designAlterationModel.costContent">
                                        </el-input>
                                    </el-form-item>
                                </el-col>

                            </el-row>

                            <el-row>
                                <el-col :span="8">
                                    <!-- 经办人 -->
                                    <el-form-item :label="'经办人：'">
                                        <el-input v-model='designAlterationModel.distributeOperator'
                                                  :disabled="true"></el-input>
                                    </el-form-item>
                                </el-col>

                                <el-col :span="8">
                                    <!-- 提交日期 -->
                                    <el-form-item :label="'提交日期：'">
                                        <el-date-picker v-model='designAlterationModel.distributeDate'
                                                        :disabled="true"
                                                        type="date">
                                        </el-date-picker>
                                    </el-form-item>
                                </el-col>

                            </el-row>

                            <el-row v-if="isShowAudit">

                                <el-col :span="8">
                                    <!-- 审批状态 -->
                                    <el-form-item :label="'审批状态：'">
                                        <fd-label :code="designAlterationModel.approveStatus"
                                                  type="cost_designAlteration_status"
                                                  :class="{col:flag}"
                                                  :url= "bpmUrl"
                                                  :disabled="true"></fd-label>
                                    </el-form-item>
                                </el-col>

                                <el-col :span="8">
                                    <!-- 审批日期 -->
                                    <el-form-item :label="'审批日期：'">
                                        <el-date-picker v-model='designAlterationModel.costApproveDate'
                                                        :disabled="true"
                                                        type="date">
                                        </el-date-picker>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                    </el-tab-pane>
                    <el-tab-pane label="成本拆分"
                                 name="second">
                          <span style="float: right;text-align: right;margin-bottom: 10px;"> <el-button size="mini" type="primary" @click="checkoutDynamic()" >执行自动拆分</el-button></span>
                          <el-tabs v-model="activeName"
                             type="card"
                             @tab-click="handleClick">
                        <el-tab-pane :key="item.contractModel.contractName"
                                     v-for="(item,index) in designAlterationModel.designAlterationContractList"
                                     :label="item.contractModel.contractName"
                                     :name="item.contractModel.contractName">

                            <ChangeFormatAlocation v-model="item.contractModel.splittingModels_cp2sb2ct"
                                                   :splittingWay="item.contractModel.splittingWay"
                                                   @saveSplit="saveSplit"></ChangeFormatAlocation>

                        </el-tab-pane>
                          </el-tabs>
                    </el-tab-pane>
                </el-tabs>
            </template>

            <div class="form-unit">附件列表</div>
            <span class="breadcrumb-child"
                  style="float: left;margin-top: 10px">
                <i></i>上传附件：
            </span>
            <span style="float: left">
                <CostFileUpload style="margin-bottom: 20px"
                                v-model="fileList"
                                :limit="limit"
                                :attachmentData="designAlterationModel.attachments"
                                :outerId="outerId">
                </CostFileUpload>
            </span>



        </el-form>

      <DesignAlterationAttachmentTable :queryObj_passed_in='queryModel'
                                       :attaData='designAlterationModel.attachments'
                                       :showDeleteButton="showDeleteButton"
                                       v-on:changeAttachments="changeAttachments"
                                       ref='DesignAlterationAttachmentTable'>
      </DesignAlterationAttachmentTable>
    </div>
</template>
<script >
import ChangeFormatAlocation from '@/views/cost/signVisa/ChangeFormatAlocation'
import { LoadingUtil } from '@/utils/common/LoadingUtil'
import { costConfirmDesignAlterationInstruction, getDesignAlterationInstructionDetail, getDesignAlterationDetail, submitCost, submitCostRetry, dynacostSplittingList } from '@/api/cost/signVisa'
import DesignAlterationAttachmentTable from '@/views/cost/designAlteration/DesignAlterationAttachmentTable'
import CostFileUpload from '@/components/cost/UploadFile/'
import CostSplittingTable from '@/views/cost/signVisa/CostSplittingTable'
import { getMeProfile } from '@/api/sys/userAPI'
import AmountInput from '@/components/cost/AmountInput/'
import DictionarySelect from '@/components/cost/DictionarySelect/'
export default {
  props: {
  },
  components: {
    ChangeFormatAlocation,
    CostFileUpload,
    DesignAlterationAttachmentTable,
    CostSplittingTable,
    AmountInput,
    DictionarySelect
  },
  data() {
    let ineffectiveConfirmAmtValidator = (rule, value, callback) => {
      if ((value === '' || value === null) && this.designAlterationModel.isHasIneffective === '1') {
        callback(new Error('请输入无效成本确认金额'))
      } else {
        callback()
      }
    }
    return {
      activeName: '',
      splittingWay: '',
      moduleType: '',
      options: [{
        value: '1',
        label: '100%'
      }, {
        value: '2',
        label: '0'
      }, {
        value: '3',
        label: '200%'
      }, {
        value: '4',
        label: '300%'
      }],
      value: '',
      outerId: '',
      fileList: '',
      limit: 4,
      size: 100,
      radio: '1',
      rules: {
        costConfirmEstimatedAmt: [
          { required: true, message: '请输入预估金额', trigger: 'blur' }
        ],
        constructionUnitReportAmt: [
          { required: true, message: '请输入供应商上报金额', trigger: 'blur' }
        ],
        costConfirmAmt: [
          { required: true, message: '请输入造价确认金额', trigger: 'blur' }
        ],
        costRetryConfirmAmt: [
          { required: true, message: '请输入造价二次确认金额', trigger: 'blur' }
        ],
        ineffectiveConfirmAmt: [
          { validator: ineffectiveConfirmAmtValidator, required: true, trigger: 'blur' }
        ],
        ineffectiveRetryConfirmAmt: [
          { required: true, message: '请输入无效成本二次确认金额', trigger: 'blur' }
        ],
        achieveShareRatio: [
          { required: true, message: '请选择成就共享扣款倍数', trigger: 'change' }
        ],
        achieveShareRatioRetry: [
          { required: true, message: '请选择成就共享二次确认扣款倍数', trigger: 'change' }
        ]
      },
      activeName2: 'first',
      tableData: [],
      instructDetail: {},
      attachmentData: [],
      isEdit: false,
      needDisable: false,
      isShowSpan: false,
      isShowAdd: true,
      isShowSubmit: true,
      isShowBack: false,
      buttonDisable: false,
      isShowAudit: false,
      isShowRetryCost: false,
      allButtonDisable: false,
      achieveShareRatioDisable: false,
      achieveShareRatioRetryDisable: false,
      showDeleteButton: true,
      queryModel: {
        companyId: '',
        projectId: '',
        contractCode: '',
        code: '',
        name: '',
        instructionCode: '',
        pageNum: 1,
        pageSize: 20
      },
      designAlterationModel: {
        id: '',
        code: '',
        alterationVisaCode: '',
        isRetryCostConfirm: '0',
        alterationVisaId: '',
        contractCode: '',
        contractName: '',
        projectId: '',
        projectName: '',
        accountabilityUnit: '',
        distributeOperator: '',
        distributeDate: '',
        costApproveDate: '',
        approveStatus: '',
        variationContent: '',
        constructionUnit: '',
        constructContent: '',
        constructStartDate: '',
        constructEndDate: '',
        costConfirmEstimatedAmt: '',
        estimatedAmt: '',
        constructionUnitReportAmt: '',
        costConfirmAmt: '',
        costRetryConfirmAmt: '',
        estimatedIneffectiveAmt: '',
        ineffectiveConfirmAmt: '',
        ineffectiveRetryConfirmAmt: '',
        ineffectiveType: '',
        ineffectiveResponsibleDept: '',
        ineffectiveContent: '',
        isHasIneffective: '',
        ineffectiveDesc: '',
        achieveShareRatio: '',
        achieveShareRatioRetry: '',
        costContent: '',
        processNode: '4',
        attachments: [],
        designAlterationContractList: [],
        splittingWay: '',
        moduleDataPK: '',
        moduleType: ''
      },
      designAlterationContract: {
        contractId: ''
      },
      dalData: {},
      bpmUrl:'',
      flag:false
    }
  },
  mounted: function() {
    this.init()
  },
  methods: {
    saveSplit(val) {
      this.designAlterationModel.splittingWay = val[0].splittingWay
      this.designAlterationModel.moduleType = this.moduleType
      this.designAlterationModel.designAlterationContractList.forEach((item, index) => {
        item.contractModel.splittingWay = val[0].splittingWay
      })
    },
    checkoutDynamic() {
      if (this.$route.query.contractId) {
        this.designAlterationModel.moduleDataPK = this.$route.query.id
        this.designAlterationContract.contractId = this.$route.query.contractId
      }

      if (!this.designAlterationModel.costConfirmAmt) {
        return this.$showError('请输入造价确认金额')
      } else {
        this.designAlterationContract.alterationEstimatedAmt = this.designAlterationModel.costConfirmAmt
      }

      this.getSplittingList()
    },
    getSplittingList() {
      let designAlterationContractList = []
      designAlterationContractList.push(this.designAlterationContract)
      LoadingUtil.showLoading()
      dynacostSplittingList({ moduleType: this.moduleType, designAlterationContractList: designAlterationContractList, moduleDataPK: this.designAlterationModel.moduleDataPK }).then(response => {
        LoadingUtil.hideLoading()
        this.designAlterationModel.designAlterationContractList = response.data ? response.data : []
        if (this.designAlterationModel.designAlterationContractList.length > 0) {
          this.activeName = this.designAlterationModel.designAlterationContractList[0].contractModel.contractName
        }

        if (this.designAlterationModel.designAlterationContractList.length > 0) {
          this.designAlterationModel.splittingWay = this.designAlterationModel.designAlterationContractList[0].splittingWay
          if (!this.designAlterationModel.designAlterationContractList[0].splittingWay) {
            this.designAlterationModel.splittingWay = this.designAlterationModel.designAlterationContractList[0].contractModel.splittingWay
          }
        }
      })
    },
    init() {
      debugger
      getDesignAlterationInstructionDetail({ id: this.$route.query.id, processNode: '4' })
        .then(response => {
          debugger
          this.designAlterationModel.attachments = response.data.attachments
          this.designAlterationModel.id = response.data.id
          this.designAlterationModel.code = response.data.code
          this.designAlterationModel.alterationVisaCode = response.data.alterationVisaCode
          this.designAlterationModel.projectId = response.data.projectId
          this.designAlterationModel.projectName = response.data.projectName
          this.designAlterationModel.accountabilityUnit = response.data.accountabilityUnit
          this.designAlterationModel.distributeOperator = response.data.distributeOperator
          this.designAlterationModel.contractCode = response.data.contractCode
          this.designAlterationModel.contractName = response.data.contractName
          this.designAlterationModel.distributeDate = response.data.distributeDate
          this.designAlterationModel.variationContent = response.data.variationContent
          this.designAlterationModel.constructionUnit = response.data.constructionUnit
          this.designAlterationModel.constructStartDate = response.data.constructStartDate
          this.designAlterationModel.constructEndDate = response.data.constructEndDate
          this.designAlterationModel.costConfirmEstimatedAmt = response.data.costConfirmEstimatedAmt
          this.designAlterationModel.estimatedAmt = response.data.estimatedAmt
          this.designAlterationModel.constructionUnitReportAmt = response.data.constructionUnitReportAmt
          this.designAlterationModel.costConfirmAmt = response.data.costConfirmAmt
          this.designAlterationModel.costRetryConfirmAmt = response.data.costRetryConfirmAmt
          this.designAlterationModel.estimatedIneffectiveAmt = response.data.estimatedIneffectiveAmt
          this.designAlterationModel.ineffectiveConfirmAmt = response.data.ineffectiveConfirmAmt
          this.designAlterationModel.ineffectiveRetryConfirmAmt = response.data.ineffectiveRetryConfirmAmt
          this.designAlterationModel.ineffectiveType = response.data.ineffectiveType
          this.designAlterationModel.ineffectiveResponsibleDept = response.data.ineffectiveResponsibleDept
          this.designAlterationModel.ineffectiveContent = response.data.ineffectiveContent
          this.designAlterationModel.isHasIneffective = response.data.isHasIneffective
          this.designAlterationModel.ineffectiveDesc = response.data.ineffectiveDesc
          this.designAlterationModel.alterationVisaId = response.data.alterationVisaId
          this.designAlterationModel.approveStatus = response.data.approveStatus
          this.bpmUrl = response.data.bpmOriginUrl
          // console.log(this.bpmUrl)
          if(this.bpmUrl != ''){
            this.flag = true
          }
          let contractModels_splitting_cp2sb2ct = response.data.contractModels_splitting_cp2sb2ct
          this.designAlterationModel.designAlterationContractList = []
          debugger
          if (contractModels_splitting_cp2sb2ct && contractModels_splitting_cp2sb2ct.length > 0) {
            contractModels_splitting_cp2sb2ct.forEach((item, index) => {
              let cp2sb2ct = {}
              cp2sb2ct.contractModel = item

              this.designAlterationModel.designAlterationContractList.push(cp2sb2ct)
            })
          }

          if (this.designAlterationModel.designAlterationContractList.length > 0) {
            this.activeName = this.designAlterationModel.designAlterationContractList[0].contractModel.contractName
          }

          if (this.designAlterationModel.designAlterationContractList.length > 0) {
            this.designAlterationModel.splittingWay = this.designAlterationModel.designAlterationContractList[0].splittingWay
          }

          this.designAlterationModel.completionConfirmOperator = response.data.completionConfirmOperator
          this.designAlterationModel.costContent = response.data.costContent
          this.designAlterationModel.isRetryCostConfirm = response.data.isRetryCostConfirm
          if (this.$route.query.isRetry) {
            this.designAlterationModel.isRetryCostConfirm = '1'
          }
          if (this.designAlterationModel.isRetryCostConfirm === '1') {
            this.needDisable = true
            this.moduleType = '3_1_1'
            this.isShowRetryCost = true
            this.achieveShareRatioDisable = true
            this.designAlterationModel.costApproveDate = response.data.costApproveRetryDate
          } else {
            this.designAlterationModel.costApproveDate = response.data.costApproveDate
            this.moduleType = '3_1_0'
          }
          if (response.data.achieveShareRatio !== null) {
            this.designAlterationModel.achieveShareRatio = response.data.achieveShareRatio.toString()
          }
          if (response.data.achieveShareRatioRetry !== null) {
            this.designAlterationModel.achieveShareRatioRetry = response.data.achieveShareRatioRetry.toString()
          }
          this.designAlterationModel.constructContent = response.data.constructContent
          this.outerId = response.data.id + '_4'
          if (this.$route.query.isView) {
            this.isShowAdd = false
            this.isShowSubmit = false
            this.isShowAudit = true
            this.allButtonDisable = true
            this.showDeleteButton = false
          } else {
            this.designAlterationModel.distributeOperator = this.$getUserInfo()['nickName']
            this.designAlterationModel.distributeDate = new Date()
          }
          getDesignAlterationDetail({ id: this.designAlterationModel.alterationVisaId })
            .then(response => {
              this.dalData = response.data
            })
            .catch(error => {
              console.log(error)
            })
        })
    },
    handleClick() {
    },
    changeAttachments(data) {
      debugger
      this.designAlterationModel.attachments = data
    },
    gotoDesign() {
      debugger
      let redirectPath = {}
      redirectPath.query = { id: this.designAlterationModel.alterationVisaId, isEdit: false }
      redirectPath.name = 'NewOrUpdateSignVisa'
      this.$router.push(redirectPath)
    },
    gotoInstruct() {
      let redirectPath = {}
      redirectPath.query = { id: this.designAlterationModel.id, isView: true }
      redirectPath.name = 'SignVisaInstructionDistribute'
      this.$router.push(redirectPath)
    },
    gotoCompletion() {
      debugger
      let redirectPath = {}
      redirectPath.query = { id: this.designAlterationModel.id, isView: true }
      redirectPath.name = 'SignVisaInstructionCompletionConfirm'
      this.$router.push(redirectPath)
    },
    onSubmit(formName) {
      var validateResult = true
      this.$refs[formName].validate((valid) => {
        if (!valid) {
          validateResult = false
        }
      })
      if (!validateResult) {
        return
      }
      LoadingUtil.showLoading()
    },
    handleBack() {
      this.$router.push({
        name: 'SignVisaList',
        query: { isShowInstruct: true }
      })
    },
    submitModel() {
      this.$refs['designAlterationModel'].validate((valid) => {
        if (valid) {
          // if (this.designAlterationModel.attachments.length === 0) {
          //   this.$showError('msg_cost_dalattachment_error')
          //   return
          // }
          LoadingUtil.showLoading()
          costConfirmDesignAlterationInstruction(this.designAlterationModel)
            .then(response => {
              // this.$showSuccess(response.message)
              if (this.designAlterationModel.isRetryCostConfirm === '0') {
                submitCost(this.designAlterationModel)
                  .then(response => {
                    LoadingUtil.hideLoading()
                    if (response.code === '2000') {
                      this.$router.push({
                        name: 'SignVisaList',
                        query: { isShowInstruct: true }
                      })
                      this.$showSuccess(response.message)
                    } else {
                      this.$showError(response.message)
                    }
                  })
                  .catch(error => {
                    console.log(error)
                    this.$showError(error.message ? error.message : 'msg_system_error')
                  })
              } else {
                submitCostRetry(this.designAlterationModel)
                  .then(response => {
                    LoadingUtil.hideLoading()
                    if (response.code === '2000') {
                      this.$router.push({
                        name: 'SignVisaList',
                        query: { isShowInstruct: true }
                      })
                      this.$showSuccess(response.message)
                    } else {
                      this.$showError(response.message)
                    }
                  })
                  .catch(error => {
                    console.log(error)
                    this.$showError(error.message ? error.message : 'msg_system_error')
                  })
              }
            })
            .catch(error => {
              console.log(error)
              this.$showError(error.message ? error.message : 'msg_system_error')
            })
        }
      })
    },
    saveCostConfirm() {
      this.$refs['designAlterationModel'].validate((valid) => {
        if (valid) {
          // if (this.designAlterationModel.attachments.length === 0) {
          //   this.$showError('msg_cost_dalattachment_error')
          //   return
          // }
          LoadingUtil.showLoading()
          this.designAlterationModel.contractModels_splitting_cp2sb2ct = []
          this.designAlterationModel.designAlterationContractList.forEach((item, index) => {
            this.designAlterationModel.contractModels_splitting_cp2sb2ct.push(item.contractModel)
          })

          costConfirmDesignAlterationInstruction(this.designAlterationModel)
            .then(response => {
              LoadingUtil.hideLoading()
              this.$showSuccess(response.message)
            })
            .catch(error => {
              console.log(error)
              this.$showError(error.message ? error.message : 'msg_system_error')
            })
        }
      })
    }

  },
  watch: {
    'designAlterationModel.ineffectiveConfirmAmt': function(newValue, oldValue) {
      debugger
      if (newValue < 0) {
        this.designAlterationModel.ineffectiveConfirmAmt = 0
      }
      if (newValue === '0.00') {
        this.achieveShareRatioDisable = true
        this.designAlterationModel.achieveShareRatio = '1'
      } else {
        if (this.designAlterationModel.isRetryCostConfirm === '0') {
          this.achieveShareRatioDisable = false
        }
      }
    },
    'designAlterationModel.ineffectiveRetryConfirmAmt': function(newValue, oldValue) {
      debugger
      if (newValue === '0.00') {
        this.achieveShareRatioRetryDisable = true
        this.designAlterationModel.achieveShareRatioRetry = '1'
      } else {
        this.achieveShareRatioRetryDisable = false
      }
    }
  }
}
</script>
<style scoped>
  .col{
    color: blue;
    text-decoration: underline;
    cursor: pointer;
  }
</style>



