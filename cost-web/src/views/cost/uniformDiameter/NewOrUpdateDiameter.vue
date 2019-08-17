<template>
  <div class='app-container'>
    <div style="text-align:right; margin:10px 0;">
      <el-button size="mini"  v-if="!$store.state.user.isFromBpm"
                 @click='handleBack'>{{$l('btn_back')}}
      </el-button>
      <el-button size="mini"
                 type='primary'  v-if="$checkPersmissionByCode('cost:budgetCaliber:create')"
                 :disabled="buttonDisable"
                 v-show="isShowAdd"
                 @click='saveConstruction'>{{$l('btn_save')}}
      </el-button>
      <el-button size="mini"
                 type='primary'  v-if="$checkPersmissionByCode('cost:budgetCaliber:create')"
                 @click='submitConstructionCost'
                 v-show="isShowSubmit"
                 :disabled="buttonDisableSub">
        {{$l('lbl_cost_compilation_submit')}}
      </el-button>

    </div>
    <div class="form-unit">基本信息</div>
    <el-form label-width='150px'
             status-icon
             :model="DiameterModel"
             ref="DiameterModel"
             :rules="rules"
             size="mini"
             :disabled="formDisable">
      <el-row :gutter="12">
        <el-col :span="8">
          <el-form-item :label="'合同编号：'"
                        prop="contractNumber">
            <el-input v-model="DiameterModel.contractNumber"
                      :disabled="buttonDisable">
                            <span @click="addRowToTableConstract"
                                  slot="append"
                                  v-show="isEdit"
                                  class="el-icon-search"
                                  :style="{'cursor':'pointer'}"></span>
            </el-input>
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <!-- 合同名称 -->
          <el-form-item :label="'合同名称：'">
            <el-input v-model="DiameterModel.contractName"
                      :disabled="true"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <!-- 项目名称 -->
          <el-form-item :label="'项目名称：'">
            <el-input v-model="DiameterModel.projectName"
                      :disabled="true"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="12">
        <el-col :span="8">
          <!-- 供应商名称 -->
          <el-form-item :label="'供应商名称：'">
            <el-input v-model="DiameterModel.buildingSection"
                      :disabled="true"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <!-- 合同金额 -->
          <el-form-item :label="'合同金额(元)：'">
            <el-input-number v-model="DiameterModel.contractValue"
                      :disabled="true" :precision="2"  :controls="false" style="width: 100%;"></el-input-number>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="12">
        <el-col :span="8">
          <!-- 单方造价(合同) -->
          <el-form-item :label="'单方造价(合同)(元/㎡)：'"
                        prop="fabricationCost"
                        title="单方造价(合同)(元/㎡)：">
            <el-input-number v-model="DiameterModel.fabricationCost"
                      :disabled="inputDisable" :precision="2"  :controls="false" style="width: 100%"></el-input-number>
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <!-- 预算统一口径类型 -->
          <el-form-item :label="'预算统一口径类型：'"
                        prop="caliberType">
            <el-input v-model="DiameterModel.caliberType"
                      :disabled="inputDisable"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <!-- 行业参考值 -->
          <el-form-item :label="'行业参考值：'"
                        prop="referenceValue">
            <el-input-number v-model="DiameterModel.referenceValue"
                      :disabled="inputDisable" :precision="2"  :controls="false" style="width: 100%"></el-input-number>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="12">
        <el-col :span="8">
          <!-- 经办人 -->
          <el-form-item :label="'经办人：'"
                        prop="operator">
            <el-input v-model='DiameterModel.operator'
                      :disabled="true"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <!-- 提交日期 -->
          <el-form-item :label="'提交日期：'"
                        prop="operateDate">
            <!--<el-input v-model='DiameterModel.operateDate'-->
                      <!--:disabled="true"></el-input>-->
            <el-date-picker v-model='DiameterModel.operateDate'
                            :disabled="true"
                            type="date">
            </el-date-picker>
          </el-form-item>
        </el-col>

      </el-row>

      <el-row :gutter="12">
        <el-col :span="8">
          <!-- 审批状态 -->
          <el-form-item :label="'审批状态：'"
                        prop="statusCh">
            <!-- <fd-label v-model='DiameterModel.statusCh'
                      :disabled="true" DiameterModel.status></fd-label > -->
              <!-- <div :class="{clo:flag}" @click="jump">{{DiameterModel.statusCh}}</div> -->
              <fd-label
              :code="status"
              :class="{col:flag}"
              :url= "bpmUrl"
              type="cost_flow_status"
              :disabled="true"
            ></fd-label>
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <!-- 审批日期： -->
          <el-form-item :label="'审批日期：'"
                        prop="approveDate">
            <!--<el-input v-model='DiameterModel.approveDate'-->
                      <!--:disabled="true"></el-input>-->
            <el-date-picker v-model='DiameterModel.approveDate'
                            :disabled="true"
                            type="date">
            </el-date-picker>
          </el-form-item>
        </el-col>

      </el-row>

      <div class="form-unit">预算口径范围</div>
      <el-input type="textarea"
                :autosize="{ minRows: 4, maxRows: 6}"
                placeholder="请输入内容"
                v-model="DiameterModel.caliberRange">
      </el-input>

      <div class="form-unit">预算口径内容</div>
      <el-input type="textarea"
                :autosize="{ minRows: 4, maxRows: 6}"
                placeholder="请输入内容"
                v-model="DiameterModel.caliberContent">
      </el-input>

      <div class="subTitle">
        <div class="breadcrumb-child">
          <i></i>附件列表
        </div>
      </div>
      <span class="breadcrumb-child"
            style="float: left;margin-top: 10px">
                <i></i>上传附件:
            </span>
      <span style="float: left">
          <CostFileUpload style="margin-bottom: 20px"
                          v-model="fileList"
                          :limit="limit"
                          :attachmentData="attachmentData"
                          :outerId="outerId">
          </CostFileUpload>
      </span>

      <ContractSelector :showContract="isShowContract"
                        v-on:cancelDialog="cancelDialog"
                        v-on:closeDialog="closeDialog"
                        v-on:confirmContract="confirmContract">
      </ContractSelector>
    </el-form>

    <DesignAlterationAttachmentTable :queryObj_passed_in='queryModel'  style="margin-bottom: 20px"
                                      :showDeleteButton="showDeleteButton"
                                      :attaData='attachmentData'
                                      v-on:changeAttachments="changeAttachments"
                                      ref='DesignAlterationAttachmentTable'>
    </DesignAlterationAttachmentTable>
  </div>
</template>
<script>
  import CostFileUpload from '@/components/cost/UploadFile/'
  import {
    getDesignAlterationDetail,
    saveOrUpdateDiameter,
    getContractList,
    getContractDetail,
    getVisaList
  } from '@/api/cost/uniformDiameter'
  import { getMeProfile } from '@/api/sys/userAPI'
  import ContractSelector from '@/components/cost/ContractSelector/'
  import DesignAlterationAttachmentTable from '@/views/cost/designAlteration/DesignAlterationAttachmentTable'
  import { getApprove } from '@/api/cost/approve'

  export default {
    props: {
      vm_passed_in: {
        default: function() {
          return {
            id: '',
            projectId: '',
            accountObjectId: '',
            groupNumber: '',
            agent: '',
            operateDate: ''
          }
        }
      },
      handleType: ''
    },
    components: {
      ContractSelector,
      CostFileUpload,
      DesignAlterationAttachmentTable
    },
    data() {
      return {
        radio: '',
        options: [{
          value: '0',
          label: '总包合同/精装修转固'
        }, {
          value: '1',
          label: '分包合同转固'
        }],
        value: '',
        rules: {
          contractNumber: [
            { required: true, message: '请选择合同编号', trigger: 'blur' }
          ],
          fabricationCost: [
            { required: true, message: '单方造价（合同）(元)', trigger: 'blur' }
          ],
          caliberType: [
            { required: true, message: '预算统一口径类型', trigger: 'blur' }
          ],
          referenceValue: [
            { required: true, message: '行业参考值', trigger: 'blur' }
          ]
        },
        tableData: [],
        attachmentData: [],
        isEdit: false,
        isShowSpan: false,
        isShowAdd: true,
        isShowSubmit: true,
        isShowBack: false,
        buttonDisable: false,
        buttonDisableSub: false,
        showDeleteButton: true,
        inputDisable: false,
        selectTable: [],
        isShowContract: false,
        formDisable: false,
        fileList: '',
        limit: 4,
        size: 4,
        outerId: '',
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
        contractQueryModel: {
          projectId: '',
          contractName: '',
          contractType: '',
          contractStatus: '5',
          // contractStatus: '',
          pageNo: 1,
          pageSize: 10,
          count: 0
        },
        queryModuleName: '',
        DiameterModel: {
          id: '',
          contractNumber: '',
          contractName: '',
          contractId: '',
          projectId: '',
          projectName: '',
          buildingSection: '',
          contractValue: '',
          fabricationCost: '',
          caliberType: '',
          referenceValue: '',
          operator: '',
          operateDate: '',
          caliberRange: '',
          caliberContent: '',
          status: '0',
          createdBy: JSON.parse(JSON.parse(localStorage.getItem('USER_INFO')).val).username,
          partyB: '',
          contractAmountExcludeTax: '',
          userId: JSON.parse(JSON.parse(localStorage.getItem('USER_INFO')).val).id,
          attachments: [],
          statusCh: '',
          approveDate: ''
        },
        constructionDetailModel: {
          id: '',
          materialName: '',
          spec: '',
          price: '',
          factory: '',
          remark: '',
          qualityPriceId: ''
        },
        contractInfo: {},
        contractDetail: {},
        visaInfo: [],
        status:'',
        flag:false,
        bpmUrl:''
      }
    },
    mounted: function() {
      this.init()
    },
    methods: {
      init() {
        if (this.$route.query.isAdd) {
          localStorage.setItem('subId', '')
          if (localStorage.getItem('subId') == '' || localStorage.getItem('subId') == undefined) {
            this.buttonDisableSub = true
          } else {
            this.buttonDisableSub = false
          }

          // 新增
          this.tableData = []
          this.DiameterModel.operator = this.$getUserInfo()['nickName']
          this.DiameterModel.operateDate = new Date().format()
        } else {
          this.buttonDisableSub = false
          debugger
          localStorage.setItem('subId', this.$route.query.id)
          this.DiameterModel.id = this.$route.query.id

          getDesignAlterationDetail(this.DiameterModel)
            .then(response => {
              this.attachmentData = response.data.attachments
              this.DiameterModel.attachments = this.attachmentData

              this.DiameterModel.companyId = response.data.companyId
              this.DiameterModel.companyName = response.data.companyName
              this.DiameterModel.contractNumber = response.data.contractNumber
              this.DiameterModel.projectId = response.data.projectId
              this.DiameterModel.projectName = response.data.projectName
              this.DiameterModel.buildingSection = response.data.buildingSection
              this.DiameterModel.contractAmountExcludeTax = response.data.referenceValue
              this.DiameterModel.contractName = response.data.contractName
              this.DiameterModel.contractId = response.data.contractId
              // alert( this.DiameterModel.contractId )
              this.DiameterModel.contractValue = response.data.contractValue
              this.DiameterModel.fabricationCost = response.data.fabricationCost
              this.DiameterModel.caliberType = response.data.caliberType
              this.DiameterModel.referenceValue = response.data.referenceValue
              this.DiameterModel.caliberRange = response.data.caliberRange
              this.DiameterModel.caliberContent = response.data.caliberContent
              this.DiameterModel.operateDate = new Date(response.data.operateDate).format()
              this.DiameterModel.operator = response.data.operator
              this.status = response.data.status
              this.bpmUrl = response.data.bpmUrl
              // if (this.$route.query.isAdd == undefined) {
                this.getContractDetail()
              // }
              // if (this.status == '0') {
              //   this.DiameterModel.statusCh = '草稿'
              // } else if (this.status == '1') {
              //   this.DiameterModel.statusCh = '审批中'
              // } else if (this.status == '2') {
              //   this.DiameterModel.statusCh = '已审批'
              // } else if (this.status == '3') {
              //   this.DiameterModel.statusCh = '已驳回'
              // }
              if(this.bpmUrl != ""){
                this.flag = true
              }
            })
            .catch(error => {
              console.log(error)
              this.$showError(error.message ? error.message : 'msg_system_error')
            })

          
          getApprove({ bizTablePkValue: this.$route.query.id })
            .then(response => {
              debugger
              if (response.data != undefined && response.data.approveDate != undefined) {
                this.DiameterModel.approveDate = new Date(response.data.approveDate).format()
              }
            })
            .catch(error => {
              console.log(error)
              this.$showError(error.message ? error.message : 'msg_system_error')
            })
        }

        this.isEdit = this.$route.query.isEdit.toString() === 'true'
        if (!this.isEdit) {
          this.isShowSpan = true
          this.buttonDisable = true
          this.isShowAdd = false
          this.isShowSubmit = false
          this.isShowBack = true
          this.inputDisable = true
          this.formDisable = true
          this.showDeleteButton = false
        }
        
      },
      confirmContract(data) {
        debugger
        this.DiameterModel.companyId = data.companyId
        this.DiameterModel.companyName = data.companyName
        this.DiameterModel.contractNumber = data.contractCode
        this.DiameterModel.contractName = data.contractName
        this.DiameterModel.contractDate = data.contractDate
        this.DiameterModel.projectId = data.projectId
        this.DiameterModel.projectName = data.projectName
        this.DiameterModel.contractValue = data.businessContractAmount
        this.DiameterModel.buildingSection = data.partyBName
        this.DiameterModel.contractId = data.id
        this.DiameterModel.contractAmountExcludeTax = data.contractAmountExcludeTax

        this.isShowContract = false
        // this.getVisaList()
      },
      getCurrentRow(contractDetail) {
        this.contractInfo = contractDetail
      },
      cancelDialog(data) {
        debugger
        this.isShowContract = data
      },
      closeDialog(data) {
        debugger
        this.isShowContract = data
      },

      getVisaList() {
        let contractId = ''
        if (this.DiameterModel.contractId == '' || this.DiameterModel.contractId == undefined) {
          contractId = this.DiameterModel.contractId
        } else {
          contractId = this.DiameterModel.contractId
        }
        let param = {
          contractId: contractId,
          contractCode: this.DiameterModel.contractCode
        }
        getVisaList(param)
          .then(response => {
            this.visaInfo = response.data
            console.log(this.visaInfo)
          })
          .catch(error => {
            console.log(error)
          })
      },
      getContractDetail() {
        let param = {
          contractId: this.DiameterModel.contractId
        }
        getContractDetail(param)
          .then(response => {
            this.contractDetail = response.data
            this.contractInfo = response.data
            this.DiameterModel.contractNumber = this.contractInfo.contractCode
            this.DiameterModel.contractName = this.contractInfo.contractName
            this.DiameterModel.contractDate = this.contractInfo.contractDate
            if (this.contractInfo.isSharedByMarketing == '1') {
              this.DiameterModel.contractValue = this.contractInfo.sharedAmountByCostSystem
            } else {
              this.DiameterModel.contractValue = this.contractInfo.contractAmountIncludeTax
            }
            this.DiameterModel.contractAmountExcludeTax = this.contractInfo.contractAmountExcludeTax
            this.DiameterModel.buildingSelection = this.contractInfo.partyB
            //  if(!this.$route.query.isAdd != "true"){
            //     this.getVisaList()
            //   }
          })
          .catch(error => {
            console.log(error)
          })
      },
      addRowToTableConstract() {
        this.isShowContract = true
        this.contractQueryModel.projectId = this.$route.query.projectId
        getContractList(this.contractQueryModel)
          .then(response => {
            this.selectTable = response.data.content
          })
          .catch(error => {
            console.log(error)
          })
      },

      getROwIndex(row) {
        const _index = this.tableData.lastIndexOf(row)
        return _index
      },
      getDefaultRow(row) {
        return {
          id: '',
          materialName: '',
          spec: '',
          price: '',
          factory: '',
          remark: ''
        }
      },

      handleSelectionChange(val) {
        // debugger
        this.selectContract = val
      },
      handleBack() {
        this.$router.push({
          name: 'DiameterList'
        })
      },
      submitConstructionCost() {
        this.buttonDisableSub = true
        this.$refs['DiameterModel'].validate((valid) => {
          if (valid) {
            this.DiameterModel.id = localStorage.getItem('subId')
            this.DiameterModel.status = '1'
            this.DiameterModel.operateDate = new Date().format()
            this.DiameterModel.attachments = this.attachmentData
            saveOrUpdateDiameter(this.DiameterModel)
              .then(response => {
                this.$showSuccess(response.message)
                this.handleBack()
              })
              .catch(error => {
                this.buttonDisableSub = false
                console.log(error)
                this.$showError(error.message ? error.message : 'msg_system_error')
              })
          }
        })
      },
      saveConstruction() {
        this.$refs['DiameterModel'].validate((valid) => {
          if (valid) {
            this.DiameterModel.status = '0'
            // alert(new Date(this.DiameterModel.operateDate))
            // this.DiameterModel.operateDate = new Date(this.DiameterModel.operateDate)
            this.DiameterModel.attachments = this.attachmentData
            saveOrUpdateDiameter(this.DiameterModel)
              .then(response => {
                this.$showSuccess(response.message)
                localStorage.setItem('subId', response.data)
                this.isShowAdd = true
                this.isShowBack = true
                this.buttonDisableSub = false
              })
              .catch(error => {
                console.log(error)
                this.$showError(error.message ? error.message : 'msg_system_error')
              })
          }
        })
      },
      inputAccountObject() {
        this.DiameterModel.groupNumber = this.DiameterModel.accountObjectId + '_IC'
      },
      changeAttachments(data) {
        this.DiameterModel.attachments = data
        this.attachmentData = data
      }
    }
  }
</script>

<style>
  .custom-00a597 .el-cascader-menu__item--extensible:after {
    content: '\E604';
  }
  .col{
    color: blue;
    text-decoration: underline;
    cursor: pointer;
  }
</style>
