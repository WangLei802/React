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
        v-if="$checkPersmissionByCode('cost:budgetConveySure:create')"
        :disabled="buttonDisable"
        v-show="isShowAdd"
        @click="saveConstruction"
      >{{$l('btn_save')}}</el-button>
      <el-button
        size="mini"
        type="primary"
        v-if="$checkPersmissionByCode('cost:budgetConveySure:create')"
        @click="submitConstructionCost"
        v-show="isShowSubmit"
        :disabled="buttonDisableSub"
      >{{$l('lbl_cost_compilation_submit')}}</el-button>
    </div>
    <div class="form-unit">基本信息</div>
    <el-form
      label-width="150px"
      status-icon
      :model="ConstructionModel"
      ref="ConstructionModel"
      :rules="rules"
      size="mini"
      :disabled="formDisable"
    >
      <el-row :gutter="12">
        <el-col :span="8">
          <!-- 合同编号 -->
          <el-form-item :label="'合同编号:'" prop="contractNumber">
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
          <el-form-item :label="'合同名称：'">
            <el-input v-model="ConstructionModel.contractName" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <!-- 签约日期 -->
          <el-form-item :label="'签约日期：'">
            <!--<el-input v-model="ConstructionModel.contractDate"-->
            <!--:disabled="true"></el-input>-->
            <el-date-picker
              v-model="ConstructionModel.contractDate"
              style="width: 100%;"
              :disabled="true"
              type="date"
            ></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="12">
        <el-col :span="8">
          <!-- 项目名称 -->
          <el-form-item :label="'项目名称：'">
            <el-input v-model="ConstructionModel.projectName" :disabled="true"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <!-- 合同金额 -->
          <el-form-item :label="'合同金额(元)：'">
            <el-input-number
              v-model="ConstructionModel.contractValue"
              :disabled="true"
              :precision="2"
              :controls="false"
              style="width: 100%;"
            ></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <!-- 供应商名称 -->
          <el-form-item :label="'供应商名称：'">
            <el-input v-model="ConstructionModel.buildingSection" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="12">
        <el-col :span="8">
          <!-- 建面单方(元/㎡)： -->
          <el-form-item :label="'建面单方(元/㎡)：'" prop="buildingArea">
            <el-input-number
              v-model="ConstructionModel.buildingArea"
              :disabled="inputDisable"
              :precision="2"
              :controls="false"
              style="width: 100%"
            ></el-input-number>
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <!-- 可售单方(元/㎡) -->
          <el-form-item :label="'可售单方(元/㎡)：'" prop="salesAera">
            <el-input-number
              v-model="ConstructionModel.salesAera"
              :disabled="inputDisable"
              :precision="2"
              :controls="false"
              style="width: 100%"
            ></el-input-number>
          </el-form-item>
        </el-col>
      </el-row>

      <div class="form-unit">变更签证信息</div>

      <el-table
        :data="visaInfo"
        stripe
        border
        tooltip-effect="dark"
        style="width: 100%"
        size="small"
      >
        <!-- 序号 -->
        <el-table-column type="index" width="200" :label="'序号'"></el-table-column>

        <!-- 变更签证编号 -->
        <el-table-column prop="code" :label="'变更签证编号'" width="200">
          <template slot-scope="scope">
            <span style="width: 100%;">{{scope.row.code}}</span>
            <!-- <el-input v-model.trim="scope.row.spec" style="width: 100%;" v-show="isEdit"></el-input> -->
          </template>
        </el-table-column>

        <!-- 变更签证名称 -->
        <el-table-column prop="name" :label="'变更签证名称'">
          <template slot-scope="scope">
            <span style="width: 100%;">{{scope.row.name}}</span>
          </template>
        </el-table-column>

        <!-- 变更签证金额 -->
        <el-table-column prop="costConfirmAmt" :label="'变更签证金额(元)'" width="200">
          <template slot-scope="scope">
            <span style="width: 100%;">{{scope.row.costConfirmAmt | NumFormat }}</span>
          </template>
        </el-table-column>

        <!-- 是否包含 -->
        <el-table-column prop :label="'是否包含'">
          <template slot-scope="scope">
            <!-- <span style="width: 100%;" >
    <el-checkbox @change="test"></el-checkbox>
            </span>-->
            <span v-if="scope.row.flag == true" style="width: 100%;">
              <el-checkbox
                checked="true"
                :disabled="scope.row.ash"
                @change="checked=>test(scope.row,checked)"
              ></el-checkbox>
            </span>
            <span v-else-if="scope.row.flag == false" style="width: 100%;">
              <el-checkbox :disabled="scope.row.ash" @change="checked=>test(scope.row,checked)"></el-checkbox>
            </span>
            <span v-else-if="isEdit == false" style="width: 100%;">
              <el-checkbox
                :disabled="scope.row.ash"
                checked="true"
                @change="checked=>test(scope.row,checked)"
              ></el-checkbox>
            </span>
          </template>
        </el-table-column>
      </el-table>
    </el-form>

    <el-form
      label-width="150px"
      status-icon
      :model="ConstructionModel"
      ref="ConstructionModel"
      :rules="rules"
      size="mini"
      :disabled="formDisable"
    >
      <div class="form-unit">转固信息</div>
      <el-row :gutter="12">
        <el-col :span="8">
          <!-- 转固金额（元） -->
          <el-form-item :label="'转固金额（元）：'" prop="conveySureMoney">
            <el-input-number
              v-model="ConstructionModel.conveySureMoney"
              :disabled="inputDisable"
              :precision="2"
              :controls="false"
              style="width: 100%"
            ></el-input-number>
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <!-- 转固后建面单方(元/m) -->
          <el-form-item :label="'转固后建面单方(元/㎡)：'" prop="buildingAreaConvey">
            <el-input-number
              v-model="ConstructionModel.buildingAreaConvey"
              :disabled="inputDisable"
              :precision="2"
              :controls="false"
              style="width: 100%"
            ></el-input-number>
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <!-- 转固后可售单方(元/㎡) -->
          <el-form-item :label="'转固后可售单方(元/㎡)：'" prop="salesAreaConvey">
            <el-input-number
              v-model="ConstructionModel.salesAreaConvey"
              :disabled="inputDisable"
              :precision="2"
              :controls="false"
              style="width: 100%"
            ></el-input-number>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="12">
        <el-col :span="8">
          <!-- 预算类型 -->
          <el-form-item :label="'预算类型：'" prop="budgetType">
            <fd-select
              v-model="ConstructionModel.budgetType"
              style="width: 100%;"
              type="budget_type"
              :disabled="inputDisable"
            ></fd-select>
            <!-- <el-select  style="width:200px" v-model="ConstructionModel.budgetType" filterable
                    clearable placeholder="请选择">
                    <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
            </el-select>-->
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <!-- 行业参考值 -->
          <el-form-item :label="'行业参考值：'" prop="referenceValue">
            <el-input-number
              v-model="ConstructionModel.referenceValue"
              :disabled="inputDisable"
              :precision="2"
              :controls="false"
              style="width: 100%;"
            ></el-input-number>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="12">
        <el-col :span="8">
          <!-- 经办人 -->
          <el-form-item :label="'经办人：'" prop="operator">
            <el-input v-model="ConstructionModel.operator" :disabled="true"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <!-- 提交日期 -->
          <el-form-item :label="'提交日期：'" prop="operateDate">
            <!--<el-input v-model='ConstructionModel.operateDate'-->
            <!--:disabled="true"></el-input>-->
            <el-date-picker
              v-model="ConstructionModel.operateDate"
              style="width: 100%;"
              :disabled="true"
              type="date"
            ></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="12">
        <el-col :span="8">
          <!-- 审批状态 -->
          <el-form-item :label="'审批状态：'" prop="statusCh">
            <fd-label
              :code="status"
              :class="{col:flag}"
              :url= "bpmUrl"
              type="cost_flow_status"
              :disabled="true"
            ></fd-label>
            <!-- 王先森  合同转固 -->
            <!-- <el-input v-model='ConstructionModel.statusCh' style="width: 100%;"
            :disabled="true"></el-input>-->
            <!-- <div :class="{col:flag}" @click="jump">{{ConstructionModel.statusCh}}</div> -->
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <!-- 审批日期： -->
          <el-form-item :label="'审批日期：'" prop="approveDate">
            <!--<el-input v-model='ConstructionModel.approveDate'-->
            <!--:disabled="true"></el-input>-->
            <el-date-picker
              v-model="ConstructionModel.approveDate"
              style="width: 100%;"
              :disabled="true"
              type="date"
            ></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="12">
        <el-col>
          <el-form-item :label="'备注：'" prop="remark">
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
      <div class="form-unit">
        成本拆分
        <span>
          <el-button size="mini" type="primary" @click="checkoutDynamic()">执行自动拆分</el-button>
        </span>
      </div>
      <CostSplittingTable
        v-model="ConstructionModel.dynacostSplittingList"
        :splittingWay="ConstructionModel.splittingWay"
        @saveSplit="saveSplit"
      ></CostSplittingTable>

      <div class="subTitle">
        <div class="breadcrumb-child">
          <i></i>附件列表
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
          :attachmentData="attachmentData"
          :outerId="outerId"
        ></CostFileUpload>
      </span>

      <ContractSelector
        :showContract="isShowContract"
        v-on:cancelDialog="cancelDialog"
        v-on:closeDialog="closeDialog"
        v-on:confirmContract="confirmContract"
      ></ContractSelector>
    </el-form>
    <DesignAlterationAttachmentTable
      :queryObj_passed_in="queryModel"
      style="margin-bottom: 20px"
      :showDeleteButton="showDeleteButton"
      :attaData="attachmentData"
      v-on:changeAttachments="changeAttachments"
      ref="DesignAlterationAttachmentTable"
    ></DesignAlterationAttachmentTable>
  </div>
</template>
<script>
import uuidv1 from "uuid/v1";
import { LoadingUtil } from "@/utils/common/LoadingUtil";
import { ptn } from "@/utils/common/validate";
// import { saveOrUpdateIneffectiveCost } from '@/api/cost/ineffectiveCost'
import {
  saveOrUpdateConsolidation,
  getContractList,
  getContractDetail,
  getVisaList,
  dynacostSplittingList,
  getDynacostSplit,
  detailBudgetconveysure
} from "@/api/cost/consolidationAPI";
import CostSplittingTable from "@/views/cost/rotaryConsolidation/CostSplittingTable";
import { getMeProfile } from "@/api/sys/userAPI";
import ContractSelector from "@/components/cost/ContractSelector/";
import DesignAlterationAttachmentTable from "@/views/cost/designAlteration/DesignAlterationAttachmentTable";
import CostFileUpload from "@/components/cost/UploadFile/";
import { getAttachment } from "@/api/cost/attachment";
import { getApprove } from "@/api/cost/approve";
import { NumFormat, Version } from "@/filters/cost/";
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
  filters: {
    NumFormat,
    Version
  },
  components: {
    CostSplittingTable,
    ContractSelector,
    DesignAlterationAttachmentTable,
    CostFileUpload
  },
  data() {
    return {
      checkList: ["", ""],
      radio: 3,
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
        amount: [
          {
            pattern: ptn.number(1, 2),
            message: "请输入数字",
            required: true,
            trigger: "blur"
          }
        ],
        orgName: [
          {
            pattern: ptn.all_match(1, 50),
            message: this.$l("msg_org_text"),
            required: true,
            trigger: "blur"
          }
        ],
        orgType: [
          { required: true, message: this.$l("msg_org_type"), trigger: "blur" }
        ],
        buildingArea: [
          { required: true, message: "建面单方(元/㎡)", trigger: "blur" }
        ],
        salesAera: [
          { required: true, message: "请输入可售单方", trigger: "blur" }
        ],
        conveySureMoney: [
          { required: true, message: "请输入转固金额", trigger: "blur" }
        ],
        buildingAreaConvey: [
          {
            required: true,
            message: "请输入转固后建面单方金额",
            trigger: "blur"
          }
        ],
        salesAreaConvey: [
          { required: true, message: "请输入转固后可售单方", trigger: "blur" }
        ],
        budgetType: [
          { required: true, message: "请选择预算类型", trigger: "blur" }
        ],
        referenceValue: [
          { required: true, message: "请输入行业参考值", trigger: "blur" }
        ],
        contractNumber: [
          { required: true, message: "请选择合同", trigger: "blur" }
        ]
      },
      tableData: [],
      isEdit: false,
      isCat: false,
      isShowSpan: false,
      isShowAdd: true,
      isShowSubmit: true,
      isShowBack: false,
      buttonDisable: false,
      buttonDisableSub: false,
      showDeleteButton: true,
      formDisable: false,
      inputDisable: false,
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
      attachmentData: [],
      isShowContract: false,
      contractQueryModel: {
        projectId: "",
        contractName: "",
        contractType: "",
        contractStatus: "5",
        pageNo: 1,
        pageSize: 10,
        count: 0
      },
      queryModuleName: "",
      ConstructionModel: {
        id: "",
        contractId: "",
        contractNumber: "",
        contractName: "",
        projectId: "",
        contractValue: "",
        dateOfContract: "",
        buildingSection: "",
        buildingArea: "",
        engineeringPrices: "",
        salesAera: "",
        operator: JSON.parse(JSON.parse(localStorage.getItem("USER_INFO")).val)
          .username,
        operateDate: "",
        conveySureMoney: "",
        buildingAreaConvey: "",
        salesAreaConvey: "",
        budgetType: "",
        referenceValue: "",
        remark: "",
        status: "",
        conveyAlterationModelList: [],
        statusCh: "",
        dynacostSplittingList: [],
        splittingWay: "0",
        moduleDataPK: ""
      },
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
      conveyAlterationModelAyy: [],
      status: "",
      flag: false,
      bpmUrl: ""
    };
  },
  mounted: function() {
    this.init();
  },
  methods: {
    checkoutDynamic() {
      this.ConstructionModel.splittingWay = "0";
      if (!this.ConstructionModel.contractNumber) {
        return this.$showError("请输入合同编号");
      } else if (!this.ConstructionModel.conveySureMoney) {
        return this.$showError("请输入转固金额");
      }
      this.ConstructionModel.dynacostSplittingList = [];
      this.getSplittingList();
    },
    getSplittingList() {
      LoadingUtil.showLoading();
      if (this.$route.query.id) {
        this.ConstructionModel.moduleDataPK = this.$route.query.id;
      }

      dynacostSplittingList({
        moduleType: "5_1",
        budgetConveySureModel: this.ConstructionModel,
        moduleDataPK: this.ConstructionModel.moduleDataPK
      }).then(response => {
        LoadingUtil.hideLoading();
        // this.designAlterationModel.dynacostSplittingList = response.data ? response.data : []
        this.ConstructionModel.dynacostSplittingList = response.data
          ? response.data
          : [];

        if (this.ConstructionModel.dynacostSplittingList.length > 0) {
          this.ConstructionModel.splittingWay = this.ConstructionModel.dynacostSplittingList[0].splittingWay;
        }
      });
    },
    saveSplit(val) {
      this.ConstructionModel.splittingWay = val;
    },
    test(q, e) {
      q.flag = e;
    },
    init() {
      if (this.$route.query.isAdd) {
        localStorage.setItem("subId", "");
        this.buttonDisableSub = true;

        // 新增
        this.tableData = [];
        this.ConstructionModel.operator = this.$getUserInfo()["nickName"];
        this.ConstructionModel.operateDate = new Date().format();
      } else {
        this.tableData = [];

        // detailBudgetconveysure
        detailBudgetconveysure({ id: this.$route.query.id })
          .then(response => {
            // debugger;
            console.log(response);
            this.attachmentData = response.data.attachments;
            this.ConstructionModel.attachments = this.attachmentData;

            this.ConstructionModel.companyId = response.data.companyId;
            this.ConstructionModel.companyName = response.data.companyName;
            this.ConstructionModel.contractId = response.data.contractId;
            this.ConstructionModel.contractName = response.data.contractName;
            this.ConstructionModel.projectId = response.data.projectId;
            this.ConstructionModel.projectName = response.data.projectName;
            this.ConstructionModel.contractValue = response.data.contractValue;
            this.ConstructionModel.contractDate = response.data.contractDate;
            this.ConstructionModel.buildingSection =
              response.data.buildingSection;
            this.ConstructionModel.buildingArea = response.data.buildingArea;
            this.ConstructionModel.salesAera = response.data.salesAera;
            this.ConstructionModel.conveySureMoney =
              response.data.conveySureMoney;
            this.ConstructionModel.buildingAreaConvey =
              response.data.buildingAreaConvey;
            this.ConstructionModel.salesAreaConvey =
              response.data.salesAreaConvey;
            this.ConstructionModel.budgetType = response.data.budgetType;
            this.ConstructionModel.referenceValue =
              response.data.referenceValue;
            this.ConstructionModel.remark = response.data.remark;

            this.ConstructionModel.operator = response.data.operator;
            this.ConstructionModel.operateDate = new Date(
              response.data.operateDate
            ).format();

            this.ConstructionModel.id = response.data.id;
            this.constructionDetailModel.qualityPriceId = response.data.id;
            this.constructionDetailModel.responsibleDeptCode =
              response.data.responsibleDeptCode;
            this.status = response.data.status;
            this.bpmUrl = response.data.bpmUrl;
            // if (this.status == "0") {
            //   this.ConstructionModel.statusCh = "草稿";
            // } else if (this.status == "1") {
            //   this.ConstructionModel.statusCh = "审批中";
            // } else if (this.status == "2") {
            //   this.ConstructionModel.statusCh = "已审批";
            // } else if (this.status == "3") {
            //   this.ConstructionModel.statusCh = "已驳回";
            // }
            if (this.bpmUrl != "") {
              this.flag = true;
            }
            this.getContractDetail();
            this.getDynacostSplittingList();
          })
          .catch(error => {
            console.log(error);
            this.$showError(error.message ? error.message : "msg_system_error");
          });

        getAttachment({ outerId: this.$route.query.id })
          .then(response => {
            debugger;
            this.attachmentData = response.data.attachments;
            this.ConstructionModel.attachments = this.attachmentData;
          })
          .catch(error => {
            console.log(error);
            this.$showError(error.message ? error.message : "msg_system_error");
          });
        getApprove({ bizTablePkValue: this.$route.query.id })
          .then(response => {
            debugger;
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
      }

      this.isEdit = this.$route.query.isEdit.toString() === "true";

      if (this.$route.query.isCat) {
        this.isCat = true;
      }

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
    },
    getDynacostSplittingList() {
      getDynacostSplit({ id: this.$route.query.id })
        .then(response => {
          this.ConstructionModel.dynacostSplittingList = response.data;
          if (
            this.ConstructionModel.dynacostSplittingList &&
            this.ConstructionModel.dynacostSplittingList.length > 0
          ) {
            this.ConstructionModel.splittingWay = this.ConstructionModel.dynacostSplittingList[0].splittingWay;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    confirmContract(data) {
      this.ConstructionModel.companyId = data.companyId;
      this.ConstructionModel.companyName = data.companyName;
      this.ConstructionModel.contractNumber = data.contractCode;
      this.ConstructionModel.contractCode = data.contractCode;
      this.ConstructionModel.contractName = data.contractName;
      this.ConstructionModel.contractDate = data.dateOfContract;
      this.ConstructionModel.projectId = data.projectId;
      this.ConstructionModel.projectName = data.projectName;
      this.ConstructionModel.contractValue = data.businessContractAmount;

      this.ConstructionModel.buildingSection = data.partyBName;
      this.ConstructionModel.contractId = data.id;

      this.isShowContract = false;
      this.rules.contractNumber = [
        { required: true, message: "请选择合同", trigger: "change" }
      ];
      this.getVisaList();
    },
    getCurrentRow(contractDetail) {
      this.contractInfo = contractDetail;
    },
    cancelDialog(data) {
      debugger;
      this.isShowContract = data;
    },
    closeDialog(data) {
      debugger;
      this.isShowContract = data;
    },
    addRowToTableConstract() {
      debugger;
      this.isShowContract = true;
    },

    addRowToTable(row) {
      this.tableData.push(this.getDefaultRow(row));
    },
    handleSelectionChange(val) {
      // debugger
      this.selectContract = val;
    },
    getVisaList() {
      let contractId = "";
      if (
        this.ConstructionModel.contractId == "" ||
        this.ConstructionModel.contractId == undefined
      ) {
        contractId = this.ConstructionModel.contractId;
      } else {
        contractId = this.ConstructionModel.contractId;
      }
      let param = {
        id: this.$route.query.id,
        contractId: contractId,
        contractCode: this.ConstructionModel.contractCode,
        flag: this.isCat
      };
      getVisaList(param)
        .then(response => {
          this.visaInfo = response.data;
          console.log(this.visaInfo);
        })
        .catch(error => {
          console.log(error);
        });
    },
    getContractDetail() {
      let param = {
        contractId: this.ConstructionModel.contractId
      };
      getContractDetail(param)
        .then(response => {
          this.contractDetail = response.data;
          this.contractInfo = response.data;
          this.ConstructionModel.contractId = this.contractInfo.id;
          this.ConstructionModel.contractNumber = this.contractInfo.contractCode;
          this.ConstructionModel.contractName = this.contractInfo.contractName;
          this.ConstructionModel.contractCode = this.contractInfo.contractCode;
          this.ConstructionModel.projectName = this.contractInfo.projectName;
          this.ConstructionModel.contractValue = this.contractInfo.businessContractAmount;
          if (!this.$route.query.isAdd != "true") {
            this.getVisaList();
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    addRowToTableConstract() {
      // debugger
      this.isShowContract = true;
      // this.contractQueryModel.projectId = this.$route.query.projectId
      // console.log(this.contractQueryModel)
      getContractList(this.contractQueryModel)
        .then(response => {
          console.log(response.data.content);
          this.selectTable = response.data.content;
        })
        .catch(error => {
          console.log(error);
        });
    },
    deleteDetail() {
      let newTableData = this.tableData.filter(function(item) {
        return item.checked !== true;
      });
      this.tableData = newTableData;
    },

    getDefaultRow(row) {
      return {
        id: "",
        materialName: "",
        spec: "",
        price: "",
        factory: "",
        remark: ""
      };
    },

    handleBack() {
      this.$router.push({
        name: "ConsolidationList"
      });
    },
    submitConstructionCost() {
      this.buttonDisableSub = true;
      let re = /^[0-9]+.?[0-9]*/;
      let isPass = true;
      if (this.ConstructionModel.contractNumber == "") {
        this.$showError("请选择合同");
        isPass = false;
      }
      if (!re.test(this.ConstructionModel.buildingArea)) {
        this.$showError("请输入正确建面单方金额");
        isPass = false;
        // break
        // return false
      }
      if (!re.test(this.ConstructionModel.salesAera)) {
        this.$showError("请输入正确可售单方金额");
        isPass = false;
      }

      if (!isPass) {
        return;
      }

      this.ConstructionModel.conveyAlterationModelList = [];
      this.conveyAlterationModelAyy = [];
      this.ConstructionModel.conveyAlterationModelList = this.visaInfo;

      this.ConstructionModel.conveyAlterationModelList.map(item => {
        console.log(JSON.stringify(item));
        if (item.flag) {
          this.conveyAlterationModelAyy.push(item);
        }
      });
      this.ConstructionModel.conveyAlterationModelList = this.conveyAlterationModelAyy;
      if (this.$route.query.id != "") {
        this.ConstructionModel.id = this.$route.query.id;
      } else {
        this.ConstructionModel.id = localStorage.getItem("subId");
      }

      this.ConstructionModel.attachments = this.attachmentData;
      this.ConstructionModel.operateDate = new Date(
        this.ConstructionModel.operateDate
      ).format();
      this.ConstructionModel.status = "1";
      // this.ConstructionModel.materialsList = this.tableData
      // this.ConstructionModel.operateDate = new Date(this.ConstructionModel.operateDate)
      saveOrUpdateConsolidation(this.ConstructionModel)
        .then(response => {
          this.$showSuccess(response.message);
          this.handleBack();
          // this.isShowAdd = false
          // this.isShowBack = true
        })
        .catch(error => {
          this.buttonDisableSub = false;
          console.log(error);
          error.clear();
          this.$showError(error.message ? error.message : "msg_system_error");
        });
    },
    saveConstruction() {
      let isPass = true;
      let re = /^[1-9]\d{0,13}(\.\d{1,4})?$/;
      if (this.ConstructionModel.contractNumber == "") {
        this.$showError("请选择合同");
        isPass = false;
      }
      if (!re.test(this.ConstructionModel.buildingArea)) {
        this.$showError("请输入正确建面单方金额");
        isPass = false;
      }
      if (!re.test(this.ConstructionModel.salesAera)) {
        this.$showError("请输入正确可售单方金额");
        isPass = false;
      }

      if (!isPass) {
        return;
      }

      this.ConstructionModel.conveyAlterationModelList = [];
      this.conveyAlterationModelAyy = [];
      this.ConstructionModel.conveyAlterationModelList = this.visaInfo;
      // console.log(JSON.stringify(this.visaInfo))
      this.ConstructionModel.conveyAlterationModelList.map(item => {
        // console.log(JSON.stringify(item))
        if (item.flag) {
          this.conveyAlterationModelAyy.push(item);
        }
      });
      this.ConstructionModel.conveyAlterationModelList = this.conveyAlterationModelAyy;
      this.ConstructionModel.status = "0";
      this.ConstructionModel.attachments = this.attachmentData;
      saveOrUpdateConsolidation(this.ConstructionModel)
        .then(response => {
          this.$showSuccess(response.message);
          localStorage.setItem("subId", response.data);
          this.isShowAdd = true;
          this.isShowBack = true;
          this.buttonDisableSub = false;
        })
        .catch(error => {
          console.log(error);
          this.$showError(error.message ? error.message : "msg_system_error");
        });
    },
    inputAccountObject() {
      this.ConstructionModel.groupNumber =
        this.ConstructionModel.accountObjectId + "_IC";
    },
    changeAttachments(data) {
      debugger;
      this.ConstructionModel.attachments = data;
      this.attachmentData = data;
    }
  }
};
</script>

<style scoped>
@import "../../../styles/detail.scss";
</style>

<style>
.custom-00a597 .el-cascader-menu__item--extensible:after {
  content: "\E604";
}
.col {
  color: blue;
  text-decoration: underline;
  cursor: pointer;
}
</style>
