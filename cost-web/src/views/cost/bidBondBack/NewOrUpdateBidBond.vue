<template>
  <div class="app-container">
    <div style="text-align:right; margin:10px 0;">
      <el-button
        size="mini"
        v-if="!$store.state.user.isFromBpm"
        @click="handleBack"
      >{{$l('btn_back')}}</el-button>
      <el-button
        size="mini"
        type="primary"
        v-if="$checkPersmissionByCode('cost:paymentCashDeposit:createOrUpdate')"
        :disabled="buttonDisable"
        v-show="isShowAdd"
        @click="saveConstruction"
      >{{$l('btn_save')}}</el-button>
      <el-button
        size="mini"
        type="primary"
        v-if="$checkPersmissionByCode('cost:paymentCashDeposit:createOrUpdate')"
        @click="submitConstructionCost"
        v-show="isShowSubmit"
        :disabled="buttonDisableSub"
      >{{$l('lbl_cost_compilation_submit')}}</el-button>
      <el-button size="mini" type="primary" v-if="print" @click="printWeb()">打印</el-button>
      <el-button size="mini" type="primary" v-if="submitFlag" @click="newSubmit()">提交</el-button>
    </div>
    <div class="form-unit">基本信息</div>
    <el-form
      label-width="150px"
      class="contractinfo"
      status-icon
      :model="ConstructionModel"
      ref="ConstructionModel"
      :rules="rules"
      size="mini"
      :disabled="formDisable"
    >
      <el-row>
        <el-col :span="8">
          <!-- 单据编号 -->
          <el-form-item :label="'单据编号：'">
            <el-input v-model="ConstructionModel.receiptsNo" :disabled="true"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <!-- 单据名称 -->
          <el-form-item :label="'单据名称：'" prop="receiptsName">
            <el-input v-model="ConstructionModel.receiptsName" :disabled="inputDisable"></el-input>
          </el-form-item>
        </el-col>

        <ProjectAccountSelect
          v-model="project"
          :span="{ project: 8}"
          :show="show"
          :clearable="{ project: false, accObj: false }"
          :labelWidth="{project: 150}"
          @change="emptyData"
        ></ProjectAccountSelect>

        <!-- 合同编号 -->
        <el-col :span="8">
          <el-form-item :label="'合同编号：'" prop="contractNumber">
            <el-input v-model="ConstructionModel.contractNumber" :disabled="buttonDisable">
              <span
                @click="addRowToTableConstract"
                slot="append"
                v-show="isEdit"
                class="el-icon-search"
                :style="{'cursor':'pointer'}"
              ></span>
            </el-input>
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <!-- 合同名称 -->
          <el-form-item :label="'合同名称:'" prop="contractName">
            <el-input v-model="ConstructionModel.contractName" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="法人公司：" prop="legalCompanyName">
            <el-input v-model="ConstructionModel.legalCompanyName" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <!-- 收款单位名称 -->
          <el-form-item label="收款单位名称：">
            <el-input v-model="ConstructionModel.payDeptName" :disabled="true"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <!-- 经办人 -->
          <el-form-item :label="'经办人：'">
            <el-input v-model="ConstructionModel.operator" :disabled="true"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <!-- 提交日期 -->
          <el-form-item :label="'提交日期：'" prop="createdDate">
            <el-date-picker v-model="ConstructionModel.operateDate" :disabled="true" type="date"></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <!-- 审批状态 -->
          <el-form-item :label="'审批状态：'" prop="statusCh">
            <!-- <fd-label v-model='ConstructionModel.statusCh'
                      type ="cost_flow_statusCh"
            ></fd-label>-->
            <!-- <div>{{ConstructionModel.statusCh}}</div> -->
            <fd-label
              :code="ConstructionModel.status"
              :class="{col:flag}"
              :url="bpmUrl"
              type="cost_flow_status"
              :disabled="true"
            ></fd-label>
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <!-- 审批日期： -->
          <el-form-item :label="'审批日期：'" prop="operateDate">
            <el-date-picker v-model="ConstructionModel.approveDate" :disabled="true" type="date"></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>

      <div class="form-unit">收款单位账号</div>
      <el-row :gutter="12">
        <el-col :span="8">
          <!-- 开户行 -->
          <el-form-item :label="'开户行：'" prop="bankDeposit">
            <el-input
              v-model="ConstructionModel.bankDeposit"
              readonly
              :title="ConstructionModel.bankDeposit"
              @focus="openBankDialog"
            >
              <i
                class="el-icon-search el-input__icon"
                slot="suffix"
                style="cursor: pointer"
                @click="openBankDialog"
              ></i>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <!-- 账户 -->
          <el-form-item :label="'账户：'" prop="account">
            <el-autocomplete
              class="inline-input"
              v-model="ConstructionModel.account"
              :fetch-suggestions="queryBankNumber"
            ></el-autocomplete>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <!-- 履约保证金总额（元）  原disabled !ConstructionModel.cashDepositReturnLower-->
          <el-form-item :label="'履约保证金总额（元）：'" title="履约保证金总额（元）：">
            <el-input-number
              v-model="ConstructionModel.cashDepositTotal"
              disabled
              @change="inputFunc"
              :precision="2"
              :controls="false"
              style="width: 100%;"
            ></el-input-number>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="12">
        <el-col :span="8">
          <!-- 已退还保证金（元） :disabled="inputDisable"-->
          <el-form-item :label="'已退还保证金（元）：'" title="已退还保证金（元）：">
            <el-input-number
              v-model="ConstructionModel.cashDepositReturn"
              disabled
              :precision="2"
              :controls="false"
              style="width: 100%;"
            ></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <!-- 本次申请退还保证金(小写)(元) -->
          <el-form-item :label="'本次申请退还保证金(小写)(元)：'" title="本次申请退还保证金(小写)(元)：" prop="cashDepositReturnLower">
            <el-input-number
              v-model="ConstructionModel.cashDepositReturnLower"
              @change="inputFunc"
              :precision="2"
              :controls="false"
              style="width: 100%;"
            ></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <!-- 本次申请退还保证金(大写) -->
          <el-form-item :label="'本次申请退还保证金(大写)：'" title="本次申请退还保证金(大写)：">
            <el-input v-model="ConstructionModel.cashDepositReturnUpper" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <!-- 退还比例 -->
          <el-form-item :label="'退还比例%：'">
            <el-input-number
              v-model="ConstructionModel.returnRate"
              :precision="2"
              :controls="false"
              style="width: 100%;"
              :disabled="true"
            ></el-input-number>
            <!--{{ConstructionModel.returnRate| NumFormat}}-->
          </el-form-item>
        </el-col>
      </el-row>

      <div class="form-unit">需扣款明细</div>

      <el-row :gutter="12">
        <el-col :span="10">
          <!-- 本次履约事项扣款金额(元) -->
          <el-form-item :label="'本次履约事项扣款金额(元)：'" title="本次履约事项扣款金额(元)：">
            <el-input-number
              v-model="ConstructionModel.cutPayment"
              :disabled="inputDisable"
              :precision="2"
              :controls="false"
              style="width: 100%;"
            ></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <!-- 累计履约事项扣款金额(元) -->
          <el-form-item :label="'累计履约事项扣款金额(元)：'" title="累计履约事项扣款金额(元)：">
            <el-input-number
              v-model="ConstructionModel.cutPaymentAdd"
              :disabled="inputDisable"
              :precision="2"
              :controls="false"
              style="width: 100%;"
            ></el-input-number>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="12">
        <el-col :span="24">
          <!-- 备注 -->
          <el-form-item :label="'备注：'">
            <el-input
              type="textarea"
              :autosize="{ minRows: 4, maxRows: 6}"
              placeholder="请输入内容"
              v-model="ConstructionModel.remark"
              :disabled="inputDisable"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <p
        style="font-size:14px;color:red"
      >必要附件：履约保证金退还：工程形象进度明细及相关照片、合同中关于履约保证金的复印件、供应商名称开具公司收据、履约保证金退还的证明材料，供应商名称申请资料。</p>

      <div class style="width:100%;float:left;margin-bottom:20px;">
        <div class="subTitle">
          <div class="breadcrumb-child">
            <i></i>关联流程
          </div>
        </div>
        <FlowAdd v-on:flow="flow" :showDeleteButton="showDeleteButton"></FlowAdd>
      </div>

      <!-- <div class="subTitle">
        <div class="breadcrumb-child">
          <i></i>关联附件
        </div>
      </div>
      <span class="breadcrumb-child" style="float: left;margin-top: 10px">
        <i></i>上传附件:
      </span>
      <span style="float: left">
        <CostFileUpload
          style="margin-bottom: 20px"
          v-model="fileList"
          :limit="limit"
          :size="size"
          :attachmentData="attachmentData"
          :outerId="outerId"
        ></CostFileUpload>
      </span> -->

      <SupplierInformationDialog
        v-if="supplierInfor"
        :supplierInfor="supplierInfor"
        @closeSupplierInfor="closeSupplierInfor"
      ></SupplierInformationDialog>
      <ContractSelector
        :showContract="isShowContract"
        :projectId="projectId"
        type="signed"
        v-on:cancelDialog="cancelDialog"
        v-on:closeDialog="closeDialog"
        v-on:confirmContract="confirmContract"
      ></ContractSelector>
    </el-form>
    <div class="subTitle">
      <div class="breadcrumb-child">
        <i></i>关联附件
      </div>
    </div>
    <span class="breadcrumb-child" style="float: left;margin-top: 10px">
      <i></i>上传附件:
    </span>
    <span style="float: left">
      <CostFileUpload
        style="margin-bottom: 20px"
        v-model="fileList"
        :limit="limit"
        :size="size"
        :isShow = 'isShowFlag'
        :attachmentData="attachmentData"
        :outerId="outerId"
      ></CostFileUpload>
    </span>
    <DesignAlterationAttachmentTable
      :queryObj_passed_in="queryModel"
      :attaData="attachmentData"
      :showDeleteButton="showDeleteButton"
      v-on:changeAttachments="changeAttachments"
      ref="DesignAlterationAttachmentTable"
    ></DesignAlterationAttachmentTable>
    <BankSelector
      :showBank="showBank"
      v-on:cancelDialog="cancelBankDialog"
      v-on:closeDialog="closeBankDialog"
      v-on:confirmBank="confirmBank"
    ></BankSelector>
  </div>
</template>
<script>
import SupplierInformationDialog from "@/views/cost/signContract/SupplierInformationDialog/";
import ProjectAccountSelect from "@/components/cost/ProjectAccountSelect/";
import { ptn } from "@/utils/common/validate";
import { LoadingUtil } from '@/utils/common/LoadingUtil'
import {
  saveOrUpdateBidBond,
  getPaymentCashDepositCode,
  getmystartforfkList,
  detailBidBond,
  getAccountInfo,
  zfinancialSubmit
} from "@/api/cost/bidBondAPI";

import { getMeProfile } from "@/api/sys/userAPI";
import DesignAlterationAttachmentTable from "@/views/cost/designAlteration/DesignAlterationAttachmentTable";
import CostFileUpload from "@/components/cost/UploadFile/";
import { getAttachment } from "@/api/cost/attachment";
import { getApprove, getApplyPaymentCode } from "@/api/cost/approve";
import { billPrinting } from "@/api/cost/applyPaymentContract";
import ContractSelector from "@/components/cost/ContractSelector/";
import FlowAdd from "@/components/cost/FlowAdd/";
import {
  getSupplierBankInfo,
  getBankInfo
} from "@/api/cost/applyPaymentContract";
import { calc } from "@/utils/common/calc";
import BankSelector from "@/components/cost/BankSelector/";
export default {
  props: {
    vm_passed_in: {
      default: function() {
        return {
          id: "",
          projectId: "",
          accountObjectId: "",
          groupNumber: "",
          agent: "",
          operateDate: ""
        };
      }
    },
    handleType: ""
  },
  components: {
    SupplierInformationDialog,
    ProjectAccountSelect,
    DesignAlterationAttachmentTable,
    CostFileUpload,
    ContractSelector,
    FlowAdd,
    BankSelector
  },
  data() {
    return {
      isShow: false,
      isShowFlag:false,
      flowParam: {
        procinstid: "",
        topic: "",
        agentname: "",
        startTime: "",
        endTime: "",
        pageNum: 1,
        pageSize: 10,
        count: 0
      },
      flowData: [],
      flowModel: {},
      flowList: "",
      isShowVersionsDialog: false,
      show: {
        project: true
      },
      radio: "",
      options: [
        {
          value: "0",
          label: "总包合同/精装修转固"
        },
        {
          value: "1",
          label: "分包合同转固"
        }
      ],
      value: "",
      rules: {
        receiptsName: [
          { required: true, message: "请输入单据名称", trigger: "blur" }
        ],
        projectId: [
          { required: true, message: "请选择项目", trigger: "change" }
        ],
        cashDepositReturnLower:[
          {
            pattern: /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/,
            message: '本次申请退还保证金不能小于0'
          }
        ],
        legalCompanyName: [
          { required: true, message: "请选择法人公司", trigger: "change" }
        ],
        contractName: [
          { required: true, message: "请填写合同名称", trigger: "change" }
        ],
        contractNumber: [
          { required: true, message: "请填写合同编号", trigger: "change" }
        ],
        bankDeposit: [
          { required: true, message: "请输入开户行", trigger: "blur" }
        ],
        account: [
          { required: true, message: "请输入账户", trigger: "change" },
          {
            pattern: ptn.number(1),
            message: "请输入正确的账户",
            trigger: "change"
          }
        ]
      },
      print: false,
      fCompanylist: "",
      projectId: "",
      tableData: [],
      isEdit: false,
      isEditTo: true,
      isShowSpan: false,
      isShowAdd: true,
      isShowSubmit: true,
      isShowBack: false,
      buttonDisable: false,
      buttonDisableSub: false,
      formDisable: false,
      inputDisable: false,
      showDeleteButton: true,
      selectTable: [],
      fileList: "",
      limit: 4,
      size: 4,
      outerId: "",
      queryModel: {
        companyId: "",
        projectId: "",
        contractCode: "",
        code: "",
        name: "",
        instructionCode: "",
        pageNum: 1,
        pageSize: 20
      },
      project: {
        accObjId: "",
        projectId: ""
      },
      attachmentData: [],
      isShowContract: false,

      queryModuleName: "",
      corporateCompanyList: [],
      ConstructionModel: {
        costRelateFlowList: [], //关联流程
        id: "",
        corporateCompanyId: "",
        receiptsNo: "",
        receiptsName: "",
        projectId: "",
        projectName: "",
        contractId: "",
        contractName: "",
        legalCompanyId: "",
        legalCompanyName: "",
        companyId: "",
        companyName: "",
        payDeptId: "",
        payDeptName: "",
        bankDeposit: "",
        account: "",
        cashDepositTotal: "",
        cashDepositReturn: "",
        cashDepositReturnLower: "",
        cashDepositReturnUpper: "",
        returnRate: "",
        cutPayment: "",
        cutPaymentAdd: "",
        remark: "",
        status: "0",
        statusCh: "草稿",
        createdBy: "",
        approveDate: "",
        operator: "",
        operateDate: "",
        contractNumber: "",
        payeeCode: "",
        supplierBankNumber: {}, // 银行帐号
        buildingSelection: "",
        payeeBankName: "", // 收款银行
        payeeAccountNo: "" // 收款账号
      },
      flag: false,
      bpmUrl: "",
      constructionDetailModel: {
        id: "",
        materialName: "",
        spec: "",
        price: "",
        factory: "",
        remark: "",
        qualityPriceId: ""
      },
      contractInfo: {},
      contractDetail: {},
      visaInfo: [],
      supplierBankInfo: [],
      supplierBankNumberList: [],
      layer: "",
      supplierInfor: false,
      bankInfoLoading: false,
      bankInfoList: [],
      bankNumberList: [],
      showBank: false,
      submitFlag:true
    };
  },
  mounted: function() {
    this.init();
    let that = this;
    setInterval(function() {
      if (localStorage.getItem("receiptsNo")) {
        that.ConstructionModel.receiptsNo = localStorage.getItem("receiptsNo");
      }
    }, 1500);
  },
  methods: {
    newSubmit(){
      // alert('555')
      LoadingUtil.showLoading();
      zfinancialSubmit(this.ConstructionModel)
      .then(response => {
        LoadingUtil.hideLoading();
        this.$router.push({
          name: "BidBondList"
        });
      })
      .catch(error => {
        console.log(error);
        this.$showError(
          error.message ? error.message : "msg_system_error"
        );
      });
    },
    printWeb() {
      let param = {
        billid: this.ConstructionModel.id
      };
      billPrinting(param)
        .then(res => {
          if (res.data) {
            window.open(res.data);
          } else {
            this.$showError(res.message);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    emptyData() {
      this.ConstructionModel.receiptsNo = "";
      this.ConstructionModel.contractNumber = "";
      this.ConstructionModel.contractName = "";
      this.ConstructionModel.legalCompanyName = "";
      this.ConstructionModel.payDeptName = "";

      this.ConstructionModel.bankDeposit = "";
      this.ConstructionModel.account = "";
      this.supplierBankInfo = "";
      this.supplierBankNumberList = "";
    },
    // 选择合同
    cancelDialog(data) {
      // debugger
      this.isShowContract = data;
    },
    closeDialog(data) {
      // debugger
      this.isShowContract = data;
    },
    // 筛选供应商数据
    checkSupplier(val) {
      // debugger
      this.supplierInfor = true;
      if (val === "1") {
        this.layer = "1";
      } else if (val === "2") {
        this.layer = "2";
      }
    },
    addRowToTableConstract() {
      // 选择合同
      // debugger
      this.isShowContract = true;
    },
    // 确认选择合同
    confirmContract(data) {
      // debugger
      this.ConstructionModel.contractNumber = data.contractCode;
      this.ConstructionModel.contractCode = data.contractCode;
      this.ConstructionModel.contractName = data.contractName;
      // this.ConstructionModel.constructionUnit = data.partyBName
      this.ConstructionModel.payDeptId = data.partyB;
      this.ConstructionModel.payDeptName = data.partyBName;
      this.ConstructionModel.buildingSelection = data.partyBName;
      this.ConstructionModel.payeeCode = data.partyB;
      this.ConstructionModel.contractAmt = data.contractAmountIncludeTax;
      this.ConstructionModel.isBudgetConveySure = data.isBudgetConveySure;
      this.ConstructionModel.contractTypeCode = data.contractType;
      this.ConstructionModel.legalCompanyId = data.corporateCompanyId;
      this.ConstructionModel.legalCompanyName = data.corporateCompanyName;
      this.project.projectId = data.projectId;
      this.ConstructionModel.cashDepositTotal = data.colPerformanceBondAmount;
      this.getPaymentCashDepositCode();
      this.getSupplierBankInfo();
      this.remoteQueryBankInfo(this.ConstructionModel.bankDeposit);
      // 选择后清空收款银行以及收款帐号信息
      this.ConstructionModel.bankDeposit = "";
      this.ConstructionModel.account = "";
      // this.remoteQueryBankInfo(this.ConstructionModel.payeeBankName)
    },
    openBankDialog() {
      this.showBank = true;
    },
    cancelBankDialog() {
      this.showBank = false;
    },
    closeBankDialog() {
      this.showBank = false;
    },
    confirmBank(data) {
      this.ConstructionModel.bankDeposit = data.name;
      this.ConstructionModel.supplierBankNumber.bankName = data.name;
      this.ConstructionModel.supplierBankNumber.bankdocId = data.bankDocId;
      this.rules.bankDeposit = [
        { required: true, message: "请输入开户行", trigger: "change" }
      ];
      this.getAccountInfoByBankDocId(data.bankDocId);
    },
    // 根据银行档案ID获取银行账号信息
    getAccountInfoByBankDocId(bankDocId) {
      getAccountInfo({ bankdocId: bankDocId }).then(res => {
        this.bankNumberList = res.data.map(obj => {
          return {
            ...obj,
            value: obj.accountNumber
          };
        });
      });
    },
    // 获取收款信息
    getSupplierBankInfo() {
      getBankInfo({ bankName: this.ConstructionModel.bankDeposit })
        .then(res => {
          if (res.code === "2000") {
            this.bankInfoList = res.data;
            this.handleSelectBank(this.ConstructionModel.bankDeposit);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    queryBankNumber(queryString, cb) {
      let numberList = this.bankNumberList;
      let results = queryString
        ? numberList.filter(item => item.value.indexOf(queryString) === 0)
        : numberList;
      cb(results);
    },
    remoteQueryBankInfo(queryString) {
      if (queryString !== "") {
        this.bankInfoLoading = true;
        getBankInfo({ bankName: queryString }).then(res => {
          if ((res.code = "2000")) {
            this.bankInfoList = res.data;
            this.bankInfoLoading = false;
          }
        });
      } else {
        this.bankInfoList = [];
      }
    },
    handleSelectBank(v) {
      let chooseBank = this.bankInfoList.filter(item => item.name === v)[0];
      // 添加value属性，值为银行帐号（该组件只识别value属性）
      if (chooseBank) {
        this.applyPaymentNoContractModel.supplierBankNumber.bankdocId =
          chooseBank.bankDocId;
        getAccountInfo({ bankdocId: chooseBank.bankDocId }).then(res => {
          this.bankNumberList = res.data.map(obj => {
            return {
              ...obj,
              value: obj.accountNumber
            };
          });
        });
      }
    },

    changeLocationValue(val) {
      // debugger
      let obj = {};
      obj = this.queryObj.fCompanylist.find(item => {
        if (item.name === val) {
          localStorage.setItem("legalCompanyId", item.id);
          localStorage.setItem("legalCompanyName", item.name);
          this.queryObj.legalCompanyId = item.id;
          this.queryObj.legalCompanyName = item.name;
        }
      });
    },
    flow(data) {
      debugger;
      this.ConstructionModel.costRelateFlowList = data;
    },

    closeSupplierInfor(row) {
      // debugger
      if (row && this.layer === "1") {
        this.ConstructionModel.payDeptId = row.providerCode;
        this.ConstructionModel.payDeptName = row.providerName;
      } else if (row && this.layer === "2") {
        this.ConstructionModel.payDeptId = row.providerCode;
        this.ConstructionModel.payDeptName = row.providerName;
      }
      this.supplierInfor = false;
    },
    init() {
      if (this.$route.query.isAdd) {
        localStorage.setItem("receiptsNo", "");
        this.buttonDisableSub = true;
        // 新增
        this.tableData = [];
        this.ConstructionModel.operator = this.$getUserInfo()["nickName"];
        this.ConstructionModel.operateDate = new Date().format();
      } else {
        // debugger
        this.buttonDisableSub = false;
        this.tableData = [];
        this.ConstructionModel.id = this.$route.query.id;
        this.constructionDetailModel.qualityPriceId = this.$route.query.id;

        detailBidBond({ id: this.$route.query.id })
          .then(response => {
            this.ConstructionModel.receiptsNo = response.data.receiptsNo;
            this.ConstructionModel.receiptsName = response.data.receiptsName;
            this.ConstructionModel.projectId = response.data.projectId;
            this.project.projectId = response.data.projectId;
            this.ConstructionModel.payDeptId = response.data.payDeptId;
            this.ConstructionModel.payDeptName = response.data.payDeptName;
            this.ConstructionModel.bankDeposit = response.data.bankDeposit;
            this.ConstructionModel.account = response.data.account;
            this.ConstructionModel.cashDepositTotal =
              response.data.cashDepositTotal;
            this.ConstructionModel.cashDepositReturn =
              response.data.cashDepositReturn;
            this.ConstructionModel.cashDepositReturnLower =
              response.data.cashDepositReturnLower;
            this.ConstructionModel.cashDepositReturnUpper =
              response.data.cashDepositReturnUpper;
            this.ConstructionModel.returnRate = response.data.returnRate;
            this.ConstructionModel.cutPayment = response.data.cutPayment;
            this.ConstructionModel.cutPaymentAdd = response.data.cutPaymentAdd;
            this.ConstructionModel.remark = response.data.remark;
            this.ConstructionModel.status = response.data.status;
            this.ConstructionModel.operator = response.data.operator;
            this.ConstructionModel.legalCompanyName =
              response.data.legalCompanyName;
            this.ConstructionModel.contractNumber =
              response.data.contractNumber;
            this.ConstructionModel.operateDate = new Date(
              response.data.operateDate
            ).format();
            this.ConstructionModel.contractName = response.data.contractName;
            this.constructionDetailModel.responsibleDeptCode =
              response.data.responsibleDeptCode;
            this.bpmUrl = response.data.bpmUrl;
            if (this.bpmUrl != "") {
              this.flag = true;
            }
            if (this.ConstructionModel.status == "2" || this.ConstructionModel.status == "1") {
              this.print = true;
            }
            // if (this.ConstructionModel.status == "0") {
            //   this.ConstructionModel.statusCh = "草稿";
            // } else if (this.ConstructionModel.status == "1") {
            //   this.ConstructionModel.statusCh = "审核中";
            // } else if (this.ConstructionModel.status == "2") {
            //   this.ConstructionModel.statusCh = "已审批";
            // } else if (this.ConstructionModel.status == "3") {
            //   this.ConstructionModel.statusCh = "已驳回";
            // }
          })
          .catch(error => {
            console.log(error);
            this.$showError(error.message ? error.message : "msg_system_error");
          });

        this.ConstructionModel.companyId = this.contractInfo.companyId;
        this.ConstructionModel.companyName = this.contractInfo.companyName;

        getAttachment({ outerId: this.$route.query.id })
          .then(response => {
            this.attachmentData = response.data.attachments;
            this.ConstructionModel.attachments = this.attachmentData;
          })
          .catch(error => {
            console.log(error);
            this.$showError(error.message ? error.message : "msg_system_error");
          });
        getApprove({ bizTablePkValue: this.$route.query.id })
          .then(response => {
            if (
              response.data != undefined &&
              response.data.approveDate != undefined
            ) {
              this.ConstructionModel.approveDate = new Date(
                response.data.approveDate
              ).format();
            }
          })
          .catch(error => {
            console.log(error);
            this.$showError(error.message ? error.message : "msg_system_error");
          });

        this.ConstructionModel.payeeCode = this.ConstructionModel.payDeptId;
        this.getSupplierBankInfo();
      }

      this.isEdit = this.$route.query.isEdit.toString() === "true";
      this.isShow = this.$route.query.isShow.toString() === "true";

      if (!this.isEdit) {
        this.isShowSpan = true;
        this.buttonDisable = true;
        this.isShowAdd = false;
        this.isShowSubmit = false;
        this.isShowBack = true;
        this.inputDisable = true;
        this.formDisable = true;
        this.showDeleteButton = false;
      }
      if(this.isShow && this.isEdit){
        this.isShowFlag = false
        this.submitFlag = false
      }else if(!this.isShow){
        this.isShowFlag = true
        this.submitFlag = true
      }else{
        this.submitFlag = false
      }
    },
    inputFunc() {
      this.Arabia_to_Chinese();
      if (
        this.ConstructionModel.cashDepositReturnLower != "0" &&
        this.ConstructionModel.cashDepositTotal != "0"
      ) {
        // this.ConstructionModel.returnRate = (this.ConstructionModel.cashDepositReturnLower / this.ConstructionModel.cashDepositTotal).toFixed(2)* 100 + "%"
        this.ConstructionModel.returnRate =
          (this.ConstructionModel.cashDepositReturnLower /
            this.ConstructionModel.cashDepositTotal) *
          100;
        if (isNaN(this.ConstructionModel.returnRate)) {
          this.ConstructionModel.returnRate = 0;
        }
      }
    },
    Arabia_to_Chinese(Num) {
      var Num = this.ConstructionModel.cashDepositReturnLower;
      for (var i = Num.length - 1; i >= 0; i--) {
        Num = Num.replace(",", ""); // 替换tomoney()中的“,”
        Num = Num.replace(" ", ""); // 替换tomoney()中的空格
      }
      // Num = Num.replace('￥', '')// 替换掉可能出现的￥字符
      // 字符处理完毕后开始转换，采用前后两部分分别转换
      var part = String(Num).split("."),
        newchar = "";
      // 小数点前进行转化
      for (i = part[0].length - 1; i >= 0; i--) {
        if (part[0].length > 10) {
          alert("位数过大，无法计算");
          return "";
        } // 若数量超过拾亿单位，提示
        var tmpnewchar = "";
        var perchar = part[0].charAt(i);
        switch (perchar) {
          case "0":
            tmpnewchar = "零" + tmpnewchar;
            break;
          case "1":
            tmpnewchar = "壹" + tmpnewchar;
            break;
          case "2":
            tmpnewchar = "贰" + tmpnewchar;
            break;
          case "3":
            tmpnewchar = "叁" + tmpnewchar;
            break;
          case "4":
            tmpnewchar = "肆" + tmpnewchar;
            break;
          case "5":
            tmpnewchar = "伍" + tmpnewchar;
            break;
          case "6":
            tmpnewchar = "陆" + tmpnewchar;
            break;
          case "7":
            tmpnewchar = "柒" + tmpnewchar;
            break;
          case "8":
            tmpnewchar = "捌" + tmpnewchar;
            break;
          case "9":
            tmpnewchar = "玖" + tmpnewchar;
            break;
        }
        switch (part[0].length - i - 1) {
          case 0:
            tmpnewchar = tmpnewchar + "圆";
            break;
          case 1:
            if (perchar != 0) tmpnewchar = tmpnewchar + "拾";
            break;
          case 2:
            if (perchar != 0) tmpnewchar = tmpnewchar + "佰";
            break;
          case 3:
            if (perchar != 0) tmpnewchar = tmpnewchar + "仟";
            break;
          case 4:
            tmpnewchar = tmpnewchar + "万";
            break;
          case 5:
            if (perchar != 0) tmpnewchar = tmpnewchar + "拾";
            break;
          case 6:
            if (perchar != 0) tmpnewchar = tmpnewchar + "佰";
            break;
          case 7:
            if (perchar != 0) tmpnewchar = tmpnewchar + "仟";
            break;
          case 8:
            tmpnewchar = tmpnewchar + "亿";
            break;
          case 9:
            tmpnewchar = tmpnewchar + "拾";
            break;
        }
        newchar = tmpnewchar + newchar;
      }
      // 小数点之后进行转化
      if (part[1] != undefined) {
        if (part[1].length > 2) {
          alert("小数点之后只能保留两位,系统将自动截断");
          part[1] = part[1].substr(0, 2);
        }
        for (i = 0; i < part[1].length; i++) {
          tmpnewchar = "";
          perchar = part[1].charAt(i);
          switch (perchar) {
            case "0":
              tmpnewchar = "零" + tmpnewchar;
              break;
            case "1":
              tmpnewchar = "壹" + tmpnewchar;
              break;
            case "2":
              tmpnewchar = "贰" + tmpnewchar;
              break;
            case "3":
              tmpnewchar = "叁" + tmpnewchar;
              break;
            case "4":
              tmpnewchar = "肆" + tmpnewchar;
              break;
            case "5":
              tmpnewchar = "伍" + tmpnewchar;
              break;
            case "6":
              tmpnewchar = "陆" + tmpnewchar;
              break;
            case "7":
              tmpnewchar = "柒" + tmpnewchar;
              break;
            case "8":
              tmpnewchar = "捌" + tmpnewchar;
              break;
            case "9":
              tmpnewchar = "玖" + tmpnewchar;
              break;
          }
          if (i == 0) tmpnewchar = tmpnewchar + "角";
          if (i == 1) tmpnewchar = tmpnewchar + "分";
          newchar = newchar + tmpnewchar;
        }
      }
      // 替换所有无用汉字
      while (newchar.search("零零") != -1) {
        newchar = newchar.replace("零零", "零");
      }
      newchar = newchar.replace("零亿", "亿");
      newchar = newchar.replace("亿万", "亿");
      newchar = newchar.replace("零万", "万");
      newchar = newchar.replace("零圆", "圆");
      newchar = newchar.replace("零角", "");
      newchar = newchar.replace("零分", "");
      if (
        newchar.charAt(newchar.length - 1) == "圆" ||
        newchar.charAt(newchar.length - 1) == "角"
      ) {
        newchar = newchar + "整";
      }
      // alert(newchar)
      this.ConstructionModel.cashDepositReturnUpper = newchar;
      return newchar;
    },

    getPaymentCashDepositCode() {
      debugger;
      let param = {
        contractCode: this.ConstructionModel.contractCode
      };
      getPaymentCashDepositCode(param)
        .then(response => {
          this.ConstructionModel.receiptsNo = response.data;
        })
        .catch(error => {
          console.log(error);
          this.$showError(error.message ? error.message : "msg_system_error");
        });
    },
    handleBack() {
      // debugger
      this.$router.push({
        name: "BidBondList"
      });
    },
    submitConstructionCost() {
      // debugger
      // this.ConstructionModel.returnRate = (this.ConstructionModel.returnRate.split("%")[0]) / 100
      // if(this.ConstructionModel.bankDeposit == ""){
      //   this.$showError("请选择开户行")
      //   return
      // }
      this.buttonDisableSub = true;
      this.sum();
      this.ConstructionModel.returnRate = this.ConstructionModel.returnRate;
      debugger;
      this.$refs["ConstructionModel"].validate(valid => {
        if (valid) {
          this.ConstructionModel.operateDate = new Date().format();
          this.ConstructionModel.status = "1";
          saveOrUpdateBidBond(this.ConstructionModel)
            .then(response => {
              this.$showSuccess(response.message);
              this.handleBack();
            })
            .catch(error => {
              this.buttonDisableSub = false;
              console.log(error);
              this.$showError(
                error.message ? error.message : "msg_system_error"
              );
            });
        }
      });
    },
    sum() {
      let sum = Number(
        calc.Add(
          this.ConstructionModel.cashDepositReturn,
          this.ConstructionModel.cashDepositReturnLower
        )
      );
      let Total = Number(this.ConstructionModel.cashDepositTotal);
      if (sum > Total) {
        this.$showError(
          "已退还保证金+本次申请退回保证金应小于等于履约保证金总额"
        );
        retutn;
      }
    },
    saveConstruction() {
      // debugger
      // if(this.ConstructionModel.bankDeposit == ""){
      //   this.$showError("请填写开户行")
      //   return
      // }
      this.sum();
      this.ConstructionModel.returnRate = this.ConstructionModel.returnRate;
      if (this.ConstructionModel.supplierBankNumber) {
        this.ConstructionModel.supplierBankNumber.accountNumber = this.ConstructionModel.account;
      }
      this.$refs["ConstructionModel"].validate(valid => {
        if (valid) {
          this.ConstructionModel.attachments = this.attachmentData;
          this.ConstructionModel.status = "0";
          saveOrUpdateBidBond(this.ConstructionModel)
            .then(response => {
              this.$showSuccess(response.message);
              this.ConstructionModel.id = response.data;
              this.isShowAdd = true;
              this.isShowBack = true;
              this.buttonDisableSub = false;
            })
            .catch(error => {
              this.$showError(
                error.message ? error.message : "msg_system_error"
              );
            });
        }
      });
    },
    inputAccountObject() {
      // debugger
      this.ConstructionModel.groupNumber =
        this.ConstructionModel.accountObjectId + "_IC";
    },
    getPaymentCashDepositCode() {
      // debugger
      let param = {
        contractCode: this.ConstructionModel.contractCode
      };
      getPaymentCashDepositCode(param)
        .then(response => {
          localStorage.setItem("receiptsNo", response.data);
        })
        .catch(error => {
          console.log(error);
          this.$showError(error.message ? error.message : "msg_system_error");
        });
    },
    changeAttachments(data) {
      // debugger
      this.ConstructionModel.attachments = data;
      this.attachmentData = data;
    }
  },
  watch: {
    "project.projectId": function(newValue, oldValue) {
      this.projectId = newValue;
      this.ConstructionModel.projectId = newValue;
    }
  }
};
</script>

<style>
.custom-00a597 .el-cascader-menu__item--extensible:after {
  content: "\E604";
}

.contractinfo.el-input.supplier {
  width: 50% !important;
}
.col {
  color: blue;
  text-decoration: underline;
  cursor: pointer;
}
</style>
