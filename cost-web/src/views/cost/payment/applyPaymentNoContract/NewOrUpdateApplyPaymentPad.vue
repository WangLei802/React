<template>
    <div class='app-container'>

        <div style="text-align:right; margin:10px 0;">
            <el-button size="mini"
                       v-if="!$store.state.user.isFromBpm"
                       class="ordinary-btn"
                       @click='handleBack'>{{$l("btn_back")}}</el-button>
            <el-button size="mini"
                       class="special-btn"
                       type='primary'
                       :disabled="buttonDisable"
                       v-if="isShowAdd"
                       @click='saveDetail'>{{$l('btn_save')}}</el-button>
            <el-button size="mini"
                       class="special-btn"
                       type='primary'
                       @click='submitModel'
                       v-if="isShowSubmit"
                       :disabled="buttonDis">{{$l('lbl_cost_compilation_submit')}}</el-button>
            <el-button size="mini" type="primary" v-if="print" @click="printWeb()">打印</el-button>
            <el-button size="mini" type="primary" v-if="submitFlag" @click="newSubmit()">提交</el-button>
        </div>
        <div class="form-unit">基本信息</div>

        <el-form label-width='150px'
                 status-icon
                 :model="applyPaymentPadModel"
                 size="mini"
                 :disabled="allButtonDisable"
                 ref="applyPaymentPadModel"
                 :rules="rules">
            <el-row>

                <!--<ProjectSelector v-model='project' :disabled="isShowProject" :show="show" :span="{'project':8}" :labelWidth="{'project':150}"></ProjectSelector>-->
                <ProjectAccountSelect v-model="project"
                                      :span="{ project: 8}"
                                      :show="show"
                                      :disabled = "buttonDisable"
                                      :clearable="{ project: false, accObj: false }"
                                      :labelWidth="{project: 150}">
                </ProjectAccountSelect>

                <el-col :span="8">
                    <el-form-item :label="'申请编号：'"
                                  prop="code">
                        <el-input v-model="applyPaymentPadModel.code"
                                  :disabled="true"></el-input>
                    </el-form-item>
                </el-col>
               
            </el-row>

            <el-row>
                <el-col :span="8">
                    <!-- 费用名称 -->
                    <el-form-item :label="'费用名称：'"
                                  prop="name">
                        <el-input v-model="applyPaymentPadModel.name"
                                  :disabled="buttonDisable"></el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="8">
                    <!-- 经办人 -->
                    <el-form-item :label="'经办人：'"
                                  prop="agent">
                        <el-input v-model='applyPaymentPadModel.operatorName'
                                  :disabled="true"></el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="8">
                    <!-- 提交日期 -->
                    <el-form-item :label="'提交日期：'"
                                  prop="agentDate">
                        <el-date-picker v-model='applyPaymentPadModel.operatorDate'
                                        :disabled="true"
                                        type="date"></el-date-picker>
                    </el-form-item>
                </el-col>

            </el-row>
            <el-row>
              <el-col :span="8">
                <!-- *实际收款单位： -->
                <el-form-item :label="'实际收款单位：'"
                              prop="payee">
                              <!-- 原始代码:disabled="buttonDisable" -->
                    <el-input style="width: 80% !important;"
                              v-model="applyPaymentPadModel.payee"
                              disabled>
                    </el-input>
                    <el-button style="padding: 5px 10px;"
                                icon="el-icon-zoom-in"
                                v-if="!allButtonDisable"
                                size="mini"
                                @click="checkSupplier('1')"></el-button>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="'银行账号：'"
                              prop="payeeAccountNo">
                    <el-input
                              v-model="applyPaymentPadModel.payeeAccountNo"
                              :disabled="buttonDisable">
                    </el-input>
                </el-form-item>
              </el-col>
              <!-- <el-col :span="8">
                <el-form-item :label="'已支付金额（元）：'"
                              prop="amountPaidTotal">
                    <amount-input v-model="applyPaymentPadModel.amountPaidTotal"
                              disabled></amount-input>
                </el-form-item>
              </el-col> -->
            </el-row>
            <div class="form-unit">详细信息</div>
            <div style="text-align:right; margin:10px 0;">
                <el-button size="mini"
                           class="special-btn"
                           type='primary'
                           @click="addRowToTable()"
                           :disabled="buttonDisable">{{$l('btn_add')}}</el-button>
                <el-button size="mini"
                           class="special-btn"
                           type='primary'
                           @click='deleteDetail'
                           :disabled="buttonDisable">{{$l('btn_delete')}}</el-button>
            </div>

            <el-table :data="applyPaymentPadModel.tableData"
                      stripe
                      :header-cell-class-name="rowClassName"
                      size="small"
                      @select="handleSelect"
                      @select-all="handleSelectAll"
                      border
                      tooltip-effect="dark"
                      style="width: 100%">

                <el-table-column type="selection"
                                 prop='id'
                                 width="55">
                </el-table-column>

                <!-- 合同编号 -->
                <el-table-column prop="contractCode"
                                 :label="'合同编号'"
                                 width="200">
                    <template slot-scope="scope">
                        <span v-if="isShowSpan"
                              style="width: 100%;">
                            {{scope.row.contractCode}}
                        </span>
                        <el-form-item v-if="isEdit"
                                      style="margin-top: 20px"
                                      label-width="0"
                                      :prop="'tableData.' + scope.$index + '.contractCode'"
                                      :rules='rules.contractCode'>
                            <el-input v-model="scope.row.contractCode"
                                      style="width: 100%;">
                               <span @click="addRowToTableConstract(scope.row)"
                                     v-if="isEdit"
                                     class="el-icon-search"
                                     slot="append"
                                     :style="{'cursor':'pointer'}"></span>

                            </el-input>


                        </el-form-item>

                    </template>
                </el-table-column>
                <!-- 合同名称 -->
                <el-table-column prop="contractName"
                                 :label="'合同名称'"
                                 width="200">
                    <template slot-scope="scope">
                        <span v-if="isShowSpan"
                              style="width: 100%;">
                            {{scope.row.contractName}}
                        </span>
                        <el-input v-model.trim="scope.row.contractName"
                                  style="width: 100%;"
                                  v-if="isEdit"
                                  :disabled="true"></el-input>
                    </template>
                </el-table-column>

                <!-- 扣款单位 -->
                <el-table-column prop="deductionUnit"
                                 :label="'扣款单位'"
                                 width="200">
                    <template slot-scope="scope">
                        <span v-if="isShowSpan"
                              style="width: 100%;">
                            {{scope.row.deductionUnit}}
                        </span>
                        <el-form-item v-if="isEdit"
                                      style="margin-top: 20px"
                                      label-width="0"
                                      :prop="'tableData.' + scope.$index + '.deductionUnit'"
                                      :rules='rules.deductionUnit'>
                            <el-input v-model="scope.row.deductionUnit"
                                      style="width: 100%;">
                               <span @click="checkSupplier(scope.row)"
                                     v-if="isEdit"
                                     class="el-icon-search"
                                     slot="append"
                                     :style="{'cursor':'pointer'}"></span>

                            </el-input>


                        </el-form-item>

                    </template>
                    <!-- <template slot="after" slot-scope="scope">

                    </template> -->
                </el-table-column>

                <!-- *扣款类型 -->
                <el-table-column prop="deductionType"
                                 :label="'扣款类型'"
                                 width="100">
                    <template slot-scope="scope">
                        <fd-label :code="scope.row.deductionType"
                                  v-if="isShowSpan"
                                  type="cost_withholding_type"></fd-label>
                        <el-form-item v-if="isEdit"
                                      style="margin-top: 20px"
                                      label-width="0"
                                      :prop="'tableData.' + scope.$index + '.deductionType'"
                                      :rules='rules.deductionType'>
                            <fd-select v-model='scope.row.deductionType'
                                       style="width: 100%;"
                                       type="cost_withholding_type"></fd-select>
                        </el-form-item>

                    </template>
                </el-table-column>

                <!-- 扣款事项 -->
                <el-table-column prop="deductionReason"
                                 :label="'扣款事项'">
                    <template slot-scope="scope">
                        <span v-if="isShowSpan"
                              style="width: 100%;">
                            {{scope.row.deductionReason}}
                        </span>
                        <el-input v-if="isEdit"
                                  v-model.trim="scope.row.deductionReason"
                                  style="width: 100%;"></el-input>
                    </template>
                </el-table-column>

                <!-- 扣款金额(元) -->
                <el-table-column prop="deductionAmt"
                                 :label="'扣款金额(元)'"
                                 width="120">
                    <template slot-scope="scope">
                        <span v-if="isShowSpan"
                              style="width: 100%;">
                            {{scope.row.deductionAmt}}
                        </span>
                        <el-form-item v-if="isEdit"
                                      style="margin-top: 20px"
                                      label-width="0"
                                      :prop="'tableData.' + scope.$index + '.deductionAmt'"
                                      :rules='rules.deductionAmt'>
                            <amount-input v-model.number="scope.row.deductionAmt"
                                          style="width: 100%;" />
                        </el-form-item>

                    </template>
                </el-table-column>
                 <!-- 已支付金额(元) -->
                <el-table-column prop="amountPaidTotal"
                                 :label="'已支付金额(元)'"
                                 width="120">
                    <template slot-scope="scope">
                        <el-form-item style="margin-top: 20px"
                                      label-width="0"
                              prop="amountPaidTotal">
                            <amount-input v-model.number="scope.row.amountPaidTotal"
                                      disabled style="width: 100%;"></amount-input>
                        </el-form-item>
                    </template>
                </el-table-column>
                <!-- 扣款日期 -->
                <el-table-column prop="deductionDate"
                                 :label="'扣款日期'"
                                 width="160">
                    <template slot-scope="scope">
                        <span v-if="isShowSpan"
                              style="width: 100%;">
                            {{scope.row.deductionDate | dateFormat('yyyy-MM-dd')}}
                        </span>
                        <el-date-picker v-model.trim="scope.row.deductionDate"
                                        style="width: 100%;"
                                        v-if="isEdit"
                                        type="date"></el-date-picker>
                    </template>
                </el-table-column>

                <el-table-column prop="remark"
                                 :label="'备注'">
                    <template slot-scope="scope">
                        <span v-if="isShowSpan"
                              style="width: 100%;">
                            {{scope.row.remark}}
                        </span>
                        <el-input v-model.trim="scope.row.remark"
                                  style="width: 100%;"
                                  v-if="isEdit"></el-input>
                    </template>
                </el-table-column>

            </el-table>

            <!-- <div class="form-unit">附件列表</div>
            <el-form-item label="上传附件:"
                          style="margin-left: -80px;">
                <CostFileUpload v-model="fileList"
                                :attachmentData="attachmentData"
                                :outerId="outerId"
                                >
                </CostFileUpload>
            </el-form-item> -->


          <SupplierInformationDialog v-if="supplierInfor"
                                     :supplierInfor='supplierInfor'
                                     @closeSupplierInfor="closeSupplierInfor"></SupplierInformationDialog>
          <SupplierInformationDialog v-if="supplierInfor1"
                                     :supplierInfor='supplierInfor1'
                                     @closeSupplierInfor1="closeSupplierInfor1"></SupplierInformationDialog>

            <ContractSelector :showContract="isShowContract"
                              :projectId="project.projectId"
                              v-on:cancelDialog="cancelDialog"
                              v-on:closeDialog="closeDialog"
                              v-on:confirmContract="confirmContract">

            </ContractSelector>
        </el-form>
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
                                :isShow = 'isShowFlag'
                                :attachmentData="attachmentData"
                                :outerId="outerId">
                </CostFileUpload>
            </span>
      <DesignAlterationAttachmentTable :queryObj_passed_in='queryModel'
                                       :attaData='attachmentData'
                                       :showDeleteButton="showDeleteButton"
                                       v-on:changeAttachments="changeAttachments"
                                       ref='DesignAlterationAttachmentTable'>
      </DesignAlterationAttachmentTable>
    </div>
</template>
<script >
import uuidv1 from 'uuid/v1'
import CostFileUpload from '@/components/cost/UploadFile/'
import { LoadingUtil } from '@/utils/common/LoadingUtil'
import { ptn } from '@/utils/common/validate'
import { createApplyPaymentPad, getApplyPaymentPad, getApplyPaymentPadCode, submitApplyPaymentPad ,PadZfinancialSubmit} from '@/api/cost/payment'
import { billPrinting } from "@/api/cost/applyPaymentContract";
import { getMeProfile } from '@/api/sys/userAPI'
import ProjectSelector from '@/components/cost/ProjectSelector/'
import ContractSelector from '@/components/cost/ContractSelector/'
import { dateFormat } from '@/filters/cost/'
import DesignAlterationAttachmentTable from '@/views/cost/designAlteration/DesignAlterationAttachmentTable'
import ProjectAccountSelect from '@/components/cost/ProjectAccountSelect/'
import AmountInput from '@/components/cost/AmountInput/'
import SupplierInformationDialog from '@/views/cost/signContract/SupplierInformationDialog/'
export default {
  props: {
    
  },
  filters: {
    dateFormat
  },
  components: {
    ProjectSelector,
    AmountInput,
    ProjectAccountSelect,
    ContractSelector,
    DesignAlterationAttachmentTable,
    CostFileUpload,
    SupplierInformationDialog
  },
  data() {
    var validateProjectName = (rule, value, callback) => {
      value = this.project.projectId
      if (value === '') {
        callback(new Error('请选择项目名称'))
      } else {
        callback()
      }
    }
    return {
      buttonDis:true,
      rules: {
        payeeAccountNo: [
          { required: true, message: "请输入收款帐号", trigger: "change" },
          {
            pattern: ptn.number(1),
            message: "请输入正确的收款帐号",
            trigger: "change"
          }
        ],
        payee: [
          { required: true, message: "请输入收款单位", trigger: "change" }
        ],
        contractCode:[
          { required: true, message: '请输入编号', trigger: 'change' }
        ],
        deductionUnit: [
          { required: true, message: '请输入单位', trigger: 'change' }
        ],
        deductionType: [
          { required: true, message: '请选择', trigger: 'change' }
        ],
        deductionAmt: [
          { required: true, message: '请输入金额', trigger: 'blur' },
          { type: 'number', message: '请输入数字' }
        ],
        name: [
          { required: true, message: '请输入费用名称', trigger: 'blur' }
        ],
        projectId: [{ validator: validateProjectName, trigger: 'change', required: true }]
      },
      print:false,
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
      show: {
        project: true
      },
      limit: 4,
      attachmentData: [],
      fileList: '',
      isEdit: false,
      isShow: false,
      isShowFlag:false,
      submitFlag:true,
      allButtonDisable: false,
      outerId: '',
      isShowProject: { 'project': false },
      project: {
        accObj: '',
        projectId: ''
      },
      isShowSpan: false,
      isShowAdd: true,
      isShowSubmit: true,
      showDeleteButton: true,
      buttonDisable: false,
      isShowContract: false,
      supplierInfor: false,
      supplierInfor1: false,
      currentIndex: '',
      currentIndexSup: '',
      allButtonDisable: false,
      applyPaymentPadModel: {
        payeeCode: "",        //收款单位编码
        payeeAccountNo:'',   //银行账号
        payee:'',       //实际收款单位
        // amountPaidTotal:'',  //已支付金额
        id: '',
        projectId: '',
        code: '',
        name: '',
        operatorName: '',
        operatorDate: '',
        details: [],
        status: '0',
        attachments: [],
        approveStatus:'0',
        tableData: [],
      }
    }
  },
  mounted: function() {
    // alert('代垫代扣')
    this.init()
  },
  methods: {
    
    printWeb(){
      let param = {
        billid:this.applyPaymentPadModel.id
      }
      billPrinting(param).then(res=>{
        if(res.data){
          window.open(res.data)
        }else{
          this.$showError(res.message);
        }
      })
        .catch(err => {
          console.log(err);
        });
    },
    // checkSupplier(val) {
    //   this.supplierInfor = true;
    // },
    // 给列添加class类名，类名为cost-table-header-required，已定义全局样式
    rowClassName({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 3 || columnIndex === 4 || columnIndex === 6) { // 列下标
        return 'cost-table-header-required'
      }
    },
    init() {
      if (this.$route.query.isAdd) {
        // 新增
        this.applyPaymentPadModel.tableData = []
        this.applyPaymentPadModel.operatorName = this.$getUserInfo()['nickName']
        this.applyPaymentPadModel.operatorDate = new Date()
      } else {
        this.buttonDis = false
        debugger
        this.applyPaymentPadModel.id = this.$route.query.id
        getApplyPaymentPad(this.applyPaymentPadModel)
          .then(response => {
            this.applyPaymentPadModel.payeeAccountNo = response.data.payeeAccountNo
            // this.applyPaymentPadModel.amountPaidTotal = response.data.amountPaidTotal
            this.applyPaymentPadModel.payee = response.data.payee;
            this.applyPaymentPadModel.payeeCode =
              response.data.payeeCode;
            this.applyPaymentPadModel.tableData = response.data.details
            this.applyPaymentPadModel.projectId = response.data.projectId
            this.attachmentData = response.data.attachments
            this.applyPaymentPadModel.tableData = response.data.details
            // this.applyPaymentPadModel.id = response.data.id
            this.applyPaymentPadModel.operatorName = response.data.operatorName
            this.applyPaymentPadModel.operatorDate = response.data.operatorDate
            this.project.projectId = response.data.projectId
            this.applyPaymentPadModel.code = response.data.code
            this.applyPaymentPadModel.name = response.data.name
            this.applyPaymentPadModel.approveStatus = response.data.approveStatus
            if(this.applyPaymentPadModel.approveStatus == '2' || this.applyPaymentPadModel.approveStatus == '1'){
              this.print = true
            }
          })
          .catch(error => {
            console.log(error)
          })
      }
      this.isEdit = this.$route.query.isEdit.toString() === 'true'
      this.isShow = this.$route.query.isShow.toString() === 'true'
      if (!this.isEdit) {
        this.isShowSpan = true
        this.buttonDisable = true
        this.isShowAdd = false
        this.isShowSubmit = false
        this.showDeleteButton = false
        this.isShowProject.project = true
        this.allButtonDisable = true
        this.isShowFlag = true
        
      }
      if(!this.isShow){
        this.isShowFlag = false
        this.submitFlag = true
      }else{
        this.submitFlag = false
      }
            
    },
    changeAttachments(data) {
      this.applyPaymentPadModel.attachments = data
      this.attachmentData = data
    },
    cancelDialog(data) {
      debugger
      this.isShowContract = data
    },
    closeDialog(data) {
      debugger
      this.isShowContract = data
    },
    addRowToTableConstract(data) {
      debugger
      // this.excludeContract = []
      // this.applyPaymentPadModel.tableData.map(data => {
      //   if (data.contractCode) {
      //     this.excludeContract.push(data.contractCode)
      //   }
      // })
      this.isShowContract = true
      this.currentIndex = data.index
    },
    confirmContract(data) {
      debugger
      this.applyPaymentPadModel.tableData.map(detail => {
        if (detail.index === this.currentIndex) {
          detail.contractCode = data.contractCode
          detail.contractName = data.contractName
        }
      })
      // this.applyPaymentPadModel.contractCode = data.contractCode
      // this.applyPaymentPadModel.contractName = data.contractName
    },
    addRowToTable() {
      this.applyPaymentPadModel.tableData.push(this.getDefaultRow())
    },
    deleteDetail() {
      let newTableData = this.applyPaymentPadModel.tableData.filter(function(item) {
        return item.checked !== true
      })
      this.applyPaymentPadModel.tableData = newTableData
    },
    getDefaultRow(row) {
      return {
        id: '',
        contractCode: '',
        contractName: '',
        deductionUnit: '',
        deductionType: '',
        deductionReason: '',
        amountPaidTotal: '',
        deductionAmt: '',
        deductionDate: '',
        operatorName: '',
        operatorDate: '',
        remark: '',
        approveStatus: '0',
        index: uuidv1()
      }
    },
    handleSelect(selection, row) {
      for (let i = 0; i < selection.length; i++) {
        if (selection[i].index === row.index) {
          this.applyPaymentPadModel.tableData.forEach((item) => {
            if (item.index === row.index) {
              item.checked = true
            }
          })
        }
      }
    },

    handleSelectAll(selection, row) {
      // 全选/取消全选
      let allChecked = true
      if (selection.length === 0) {
        allChecked = false
      }
      this.applyPaymentPadModel.tableData.forEach((item) => {
        item.checked = allChecked
      })
    },
    handleBack() {
      this.$router.push({
        name: 'ApplyPaymentNoContractList'
      })
    },
    newSubmit(){
      LoadingUtil.showLoading();
      this.applyPaymentPadModel.attachments = this.attachmentData
      PadZfinancialSubmit(this.applyPaymentPadModel)
      .then(response => {
        LoadingUtil.hideLoading();
        this.$router.push({
          name: "ApplyPaymentNoContractList"
        });
      })
      .catch(error => {
        console.log(error);
        this.$showError(
          error.message ? error.message : "msg_system_error"
        );
      });
    },
    submitModel() {
      debugger
      this.buttonDis = true;
      this.$refs['applyPaymentPadModel'].validate((valid) => {
        if (valid) {
          if (this.applyPaymentPadModel.tableData.length === 0) {
            this.$showError('没有明细数据')
            return
          }
          // this.buttonDisable = true
          this.applyPaymentPadModel.details = this.applyPaymentPadModel.tableData
          this.applyPaymentPadModel.attachments = this.attachmentData
          this.applyPaymentPadModel.projectId = this.project.projectId
          LoadingUtil.showLoading()
          this.applyPaymentPadModel.status = '0'
          createApplyPaymentPad(this.applyPaymentPadModel)
            .then(response => {
              LoadingUtil.hideLoading()
              this.applyPaymentPadModel.id = response.data
              this.submitDetail(this.applyPaymentPadModel)
            })
            .catch(error => {
              console.log(error)
              this.buttonDis = false
              this.$showError(error.message ? error.message : 'msg_system_error')
            })
        }
      })
    },
    submitDetail(model) {
      LoadingUtil.showLoading()
      submitApplyPaymentPad(model)
        .then(response => {
          LoadingUtil.hideLoading()
          if (response.code === '2000') {
            this.$router.push({
              name: 'ApplyPaymentNoContractList'
            })
            this.$showSuccess(response.message)
          } else {
            this.buttonDis = false
            this.$showError(response.message)
          }
        })
        .catch(error => {
          console.log(error)
          this.buttonDis = false
          this.$showError(error.message ? error.message : 'msg_system_error')
        })
    },
    saveDetail() {
      this.$refs['applyPaymentPadModel'].validate((valid) => {
        if (valid) {
          if (this.applyPaymentPadModel.tableData.length === 0) {
            this.$showError('没有明细数据')
            return
          }
          this.applyPaymentPadModel.details = this.applyPaymentPadModel.tableData
          this.applyPaymentPadModel.attachments = this.attachmentData
          this.applyPaymentPadModel.projectId = this.project.projectId
          this.applyPaymentPadModel.projectId = this.project.projectId
          LoadingUtil.showLoading()
          this.applyPaymentPadModel.status = '0'
          this.applyPaymentPadModel.approveStatus = this.applyPaymentPadModel.status
          createApplyPaymentPad(this.applyPaymentPadModel)
            .then(response => {
              LoadingUtil.hideLoading()
              this.$showSuccess(response.message)
              this.applyPaymentPadModel.id = response.data
              this.buttonDis = false
            })
            .catch(error => {
              console.log(error)
              this.buttonDis = true
              this.$showError(error.message ? error.message : 'msg_system_error')
            })
        }
      })
    },
    checkSupplier(val) {
      this.currentIndexSup = val.index
      if(val == "1"){
        this.supplierInfor = true
      }else{
        this.supplierInfor1 = true
      }
    },
    closeSupplierInfor1(row) {
      console.log('closeSupplierInfor1')
      console.log(row)
      debugger
      if (row) {
        this.applyPaymentPadModel.tableData.map(detail => {
          if (detail.index === this.currentIndexSup) {
            detail.deductionUnit = row.providerName
          }
        })
      }
      this.supplierInfor1 = false
    },
    closeSupplierInfor(row) {
      console.log('closeSupplierInfor')
      console.log(row)
      if(row){
        this.applyPaymentPadModel.payee = row.providerName;
        this.applyPaymentPadModel.payeeCode = row.providerCode;
      }
      this.supplierInfor = false
    },
    generateCode() {
      let obj = {}
      obj.projectId = this.project.projectId
      getApplyPaymentPadCode(obj).then(response => {
        this.applyPaymentPadModel.code = response.data
        this.outerId = this.applyPaymentPadModel.code
      })
        .catch(error => {
          console.log(error)
          this.$showError(error.message ? error.message : 'msg_system_error')
        })
    }
  },
  watch: {
    'project': function(newValue, oldValue) {
      this.generateCode()
    }
  }
}
</script>


