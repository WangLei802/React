<template>
    <div class='app-container'>

        <div style="text-align:right; margin:10px 0;">
            <el-button size="mini"
                       @click='handleBack'>{{$l("btn_back")}}</el-button>
            <el-button size="mini"
                       type='primary'
                       v-show="isShowAdd"
                       @click='saveCompletionConfirm'>{{$l('btn_save')}}</el-button>
            <el-button size="mini"
                       type='primary'
                       @click='submitModel'
                       v-show="isShowSubmit"
                       :disabled="buttonDisable">{{$l('lbl_cost_compilation_submit')}}</el-button>
        </div>
        <div>
            <el-steps :active="active"
                      :align-center="true"
                      space="70%"
                      style="margin-bottom: 20px">
                <el-step title="现场签证申请"
                         :style="{'cursor':'pointer'}"
                         @click.native="gotoDesign"></el-step>
                <el-step title="指令单下发"
                         :style="{'cursor':'pointer'}"
                         @click.native="gotoInstruct"></el-step>
                <el-step title="完工确认"></el-step>
                <el-step title="造价确认"
                         :style="{'cursor':'pointer'}"
                         @click.native="gotoCostFlag && gotoCost()"></el-step>
            </el-steps>
        </div>

        <div class="form-unit">指令单信息</div>

        <el-form label-width='150px'
                 :disabled="allButtonDisable"
                 status-icon
                 :model="designAlterationModel"
                 ref="designAlterationModel"
                 :rules="rules"
                 size="mini">
            <el-row>

                <el-col :span="8">
                    <!-- 指令单编号 -->
                    <el-form-item :label="'指令单编号：'">
                        <el-input style="width:200px"
                                  v-model="designAlterationModel.code"
                                  :disabled="true"></el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="8">
                    <!-- 现场签证编号 -->
                    <el-form-item :label="'现场签证编号：'"
                                  prop="accountObjectId">
                        <el-input style="width:200px"
                                  v-model="designAlterationModel.alterationVisaCode"
                                  :disabled="true"></el-input>
                    </el-form-item>
                </el-col>

            </el-row>

            <el-row>

                <el-col :span="8">
                    <!-- 项目名称 -->
                    <el-form-item :label="'项目名称：'">
                        <el-input style="width:200px"
                                  v-model="designAlterationModel.projectName"
                                  :disabled="true"></el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="8">
                    <!-- 合同名称 -->
                    <el-form-item :label="'合同名称：'"
                                  prop="accountObjectId">
                        <el-input style="width:200px"
                                  v-model="designAlterationModel.contractName"
                                  :disabled="true"></el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="8">
                    <!-- 供应商名称 -->
                    <el-form-item :label="'供应商名称：'"
                                  prop="agent">
                        <fd-select v-model='designAlterationModel.constructionUnit'
                                   style="width: 100%;"
                                   type="cost_dal_construct"
                                   :disabled="true"></fd-select>
                    </el-form-item>
                </el-col>

            </el-row>

            <el-row>
                <el-col :span="24">
                    <!-- 详细内容 -->
                    <el-form-item :label="'详细内容：'"
                                  prop="groupNumber">
                        <el-input type="textarea"
                                  autosize
                                  v-model="designAlterationModel.variationContent"
                                  :disabled="true">
                        </el-input>
                    </el-form-item>
                </el-col>

            </el-row>

            <div class="form-unit">完工信息</div>

            <el-row>
                <el-col :span="8">
                    <!-- 施工开始日期 -->
                    <el-form-item :label="'施工开始日期：'"
                                  prop="constructStartDate">
                        <el-date-picker v-model='designAlterationModel.constructStartDate'
                                        :picker-options="pickerOptions0"
                                        placeholder="请选择时间"
                                        type="date">
                        </el-date-picker>
                    </el-form-item>
                </el-col>

                <el-col :span="8">
                    <!-- 施工结束日期 -->
                    <el-form-item :label="'施工结束日期：'"
                                  prop="constructEndDate">
                        <el-date-picker v-model='designAlterationModel.constructEndDate'
                                        :picker-options="pickerOptions1"
                                        placeholder="请选择时间"
                                        type="date">
                        </el-date-picker>
                    </el-form-item>
                </el-col>

            </el-row>

            <el-row>
                <el-col :span="8">
                    <!-- 经办人 -->
                    <el-form-item :label="'经办人：'"
                                  prop="groupNumber">
                        <el-input style="width:200px"
                                  v-model='designAlterationModel.distributeOperator'
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
                                  :disabled="true"></fd-label>
                    </el-form-item>
                </el-col>

                <el-col :span="8">
                    <!-- 审批日期 -->
                    <el-form-item :label="'审批日期：'">
                        <el-date-picker v-model='designAlterationModel.completionApproveDate'
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
                                  v-model="designAlterationModel.constructContent">
                        </el-input>
                    </el-form-item>
                </el-col>

            </el-row>

            <div class="form-unit">附件列表</div>
            <span class="breadcrumb-child"
                  style="float: left;margin-top: 10px">
                <i></i>上传附件:
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
import { LoadingUtil } from '@/utils/common/LoadingUtil'
import { ptn } from '@/utils/common/validate'
import { confirmDesignAlterationInstruction, getDesignAlterationInstructionDetail, getDesignAlterationDetail, updateInstructionStatus } from '@/api/cost/signVisa'
import DesignAlterationAttachmentTable from '@/views/cost/designAlteration/DesignAlterationAttachmentTable'
import CostFileUpload from '@/components/cost/UploadFile/'
import { getMeProfile } from '@/api/sys/userAPI'
export default {
  props: {
  },
  components: {
    CostFileUpload,
    DesignAlterationAttachmentTable
  },
  data() {
    return {
      fileList: '',
      limit: 4,
      size: 100,
      radio: '1',
      rules: {
        constructStartDate: [
          { required: true, message: '请选择施工开始日期', trigger: 'blur' }
        ],
        constructEndDate: [
          { required: true, message: '请选择施工结束日期', trigger: 'blur' }
        ]
      },
      active: 2,
      outerId: '',
      tableData: [],
      attachmentData: [],
      isEdit: false,
      isShowSpan: false,
      isShowAdd: true,
      gotoCostFlag: true,
      isShowSubmit: true,
      buttonDisable: false,
      showDeleteButton: true,
      allButtonDisable: false,
      isShowAudit: false,
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
        alterationVisaId: '',
        contractCode: '',
        contractName: '',
        projectId: '',
        projectName: '',
        accountabilityUnit: '',
        distributeOperator: '',
        distributeDate: '',
        completionApproveDate: '',
        approveStatus: '',
        variationContent: '',
        constructionUnit: '',
        constructContent: '',
        constructStartDate: '',
        constructEndDate: '',
        costConfirmDate: '',
        costConfirmOperator: '',
        processNode: '3',
        attachments: []
      },
      dalData: {},
      pickerOptions0: {
        disabledDate: (time) => {
          debugger
          if (this.designAlterationModel.constructEndDate !== '' && this.designAlterationModel.constructEndDate !== null) {
            return time.getTime() > this.designAlterationModel.constructEndDate
          } else {
            // return time.getTime() < Date.now() - 8.64e7
          }
        }
      },
      pickerOptions1: {
        disabledDate: (time) => {
          debugger
          return time.getTime() < this.designAlterationModel.constructStartDate
        }
      }
    }
  },
  mounted: function() {
    this.init()
  },
  methods: {
    init() {
      getDesignAlterationInstructionDetail({ id: this.$route.query.id, processNode: '3' })
        .then(response => {
          this.designAlterationModel.id = response.data.id
          this.designAlterationModel.code = response.data.code
          this.designAlterationModel.alterationVisaCode = response.data.alterationVisaCode
          this.designAlterationModel.projectId = response.data.projectId
          this.designAlterationModel.projectName = response.data.projectName
          this.designAlterationModel.accountabilityUnit = response.data.accountabilityUnit
          this.designAlterationModel.contractCode = response.data.contractCode
          this.designAlterationModel.contractName = response.data.contractName
          this.designAlterationModel.variationContent = response.data.variationContent
          this.designAlterationModel.constructionUnit = response.data.constructionUnit
          this.designAlterationModel.constructStartDate = response.data.constructStartDate
          this.designAlterationModel.constructEndDate = response.data.constructEndDate
          this.designAlterationModel.constructContent = response.data.constructContent
          this.designAlterationModel.alterationVisaId = response.data.alterationVisaId
          this.designAlterationModel.approveStatus = response.data.approveStatus
          this.designAlterationModel.completionApproveDate = response.data.completionApproveDate
          this.designAlterationModel.costConfirmDate = response.data.costConfirmDate
          this.designAlterationModel.costConfirmOperator = response.data.costConfirmOperator
          if (response.data.processNode === '4') {
            this.active = 4
          }
          if (response.data.processNode === '3') {
            this.active = 3
          }
          if (response.data.processNode === '3' || response.data.processNode === '2') {
            this.gotoCostFlag = false
          }
          this.outerId = response.data.id + '_3'
          this.designAlterationModel.attachments = response.data.attachments
          if (this.$route.query.isView) {
            this.isShowAdd = false
            this.isShowSubmit = false
            this.allButtonDisable = true
            this.isShowAudit = true
            this.showDeleteButton = false
            this.designAlterationModel.distributeOperator = response.data.distributeOperator
            this.designAlterationModel.distributeDate = response.data.distributeDate
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
    gotoCost() {
      let redirectPath = {}
      redirectPath.query = { id: this.designAlterationModel.id, isView: true }
      redirectPath.name = 'SignVisaInstructionCostConfirm'
      this.$router.push(redirectPath)
    },
    handleClick() {
    },
    changeAttachments(data) {
      debugger
      this.designAlterationModel.attachments = data
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
          confirmDesignAlterationInstruction(this.designAlterationModel)
            .then(response => {
              let param = {}
              param.id = this.designAlterationModel.id
              param.approveStatus = '7'
              updateInstructionStatus(param)
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
            })
            .catch(error => {
              console.log(error)
              this.$showError(error.message ? error.message : 'msg_system_error')
            })
        }
      })
    },
    saveCompletionConfirm() {
      debugger
      this.$refs['designAlterationModel'].validate((valid) => {
        if (valid) {
          // if (this.designAlterationModel.attachments.length === 0) {
          //   this.$showError('msg_cost_dalattachment_error')
          //   return
          // }
          confirmDesignAlterationInstruction(this.designAlterationModel)
            .then(response => {
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
    'designAlterationModel.constructEndDate': function(newValue, oldValue) {
      this.showStart = false
      setTimeout(() => {
        this.showStart = true
      })
    }
  }
}
</script>




