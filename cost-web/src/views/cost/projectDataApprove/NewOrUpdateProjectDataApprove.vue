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
        v-if="$checkPersmissionByCode('cost:paymentProject:create')"
        :disabled="buttonDisable"
        v-show="isShowAdd"
        @click="saveConstruction"
      >{{$l('btn_save')}}</el-button>
      <el-button
        size="mini"
        type="primary"
        v-if="$checkPersmissionByCode('cost:paymentProject:create')"
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
        <!-- <el-col :span="8"> -->
        <!-- </el-col> -->
      </el-row>
      <el-row>
        <!-- 项目名称 -->
        <ProjectAccountSelect
          v-model="ConstructionModelTest"
          :span="{ project: 8}"
          :show="show"
          :clearable="{ project: false, accObj: false }"
          :labelWidth="{project: 150}"
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
          <el-form-item :label="'合同名称：'">
            <el-input v-model="ConstructionModel.contractName" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <!-- 供应商名称 -->
          <el-form-item :label="'供应商名称：'">
            <el-input v-model="ConstructionModel.buildingDept" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <!-- 收款单位名称 -->
          <el-form-item :label="'收款单位名称：'">
            <el-input v-model="ConstructionModel.payDept" :disabled="inputDisable"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <!-- 结算方式 -->
          <el-form-item :label="'结算方式：'">
            <el-input v-model="ConstructionModel.payMode" :disabled="inputDisable"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item :label="'开工日期：'">
            <!-- <el-input style="width:140px" v-model='queryModel.contractName'></el-input> -->
            <el-date-picker
              style="width:100%"
              v-model="ConstructionModel.startDate"
              :picker-options="pickerOptions0"
              type="date"
              placeholder="选择日期"
              :disabled="inputDisable"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="'竣工日期：'">
            <!-- <el-input style="width:140px" v-model='queryModel.contractName'></el-input> -->
            <el-date-picker
              style="width:100%"
              v-model="ConstructionModel.endDate"
              :picker-options="pickerOptions1"
              type="date"
              placeholder="选择日期"
              :disabled="inputDisable"
            ></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="8">
          <!-- 合同价款(元) -->
          <el-form-item :label="'合同价款(元)：'">
            <el-input-number
              v-model="ConstructionModel.contractMoney"
              :disabled="false"
              :precision="2"
              :controls="false"
              style="width: 100%"
            ></el-input-number>
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <!-- 报审价格(小写)(元) -->
          <el-form-item :label="'报审价格(小写)(元)：'">
            <el-input-number
              v-model="ConstructionModel.reportMoneyLower"
              @change="inputFunc"
              :disabled="inputDisable"
              :precision="2"
              :controls="false"
              style="width: 100%"
            ></el-input-number>
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <!-- 报审价格(大写) -->
          <el-form-item :label="'报审价格(大写)：'">
            <el-input v-model="ConstructionModel.reportMoneyUpper" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="8">
          <el-form-item :label="'经办人：'" prop="operator">
            <el-input v-model="ConstructionModel.operator" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <!-- 提交日期 -->
          <el-form-item :label="'提交日期：'" prop="operateDate">
            <!--<el-input v-model="ConstructionModel.operateDate"-->
            <!--:disabled="true"></el-input>-->
            <el-date-picker v-model="ConstructionModel.operateDate" :disabled="true" type="date"></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <!-- 审批状态 -->
          <el-form-item :label="'审批状态：'" prop="statusCh">
            <!-- 王先森  项目结算资料审批 -->
            <!-- <div>{{ConstructionModel.statusCh}}</div> -->
            <fd-label
              :code="ConstructionModel.status"
              :class="{col:flag}"
              :url= "bpmUrl"
              type="cost_flow_status"
              :disabled="true"
            ></fd-label>
            <!-- <el-input v-model="ConstructionModel.statusCh"
            :disabled="true"></el-input>-->
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <!-- 审批日期 -->
          <el-form-item :label="'审批日期：'" prop="approveDate">
            <!--<el-input v-model="ConstructionModel.approveDate"-->
            <!--:disabled="true"></el-input>-->
            <el-date-picker v-model="ConstructionModel.approveDate" :disabled="true" type="date"></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>

      <div class="form-unit">结算审批资料清单：</div>
      <!-- 删除 @select="handleSelect" @select-all="handleSelectAll" -->
      <el-table
        :data="approveDataList"
        stripe
        @selection-change="handleSelectionChange"
        border
        tooltip-effect="dark"
        style="width: 100%"
        size="small"
      >
        <!-- 序号 v-model="constructionDetailModel"-->
        <el-table-column type="index" width="200" :label="'序号'"></el-table-column>

        <!-- 主要内容 -->
        <el-table-column prop="spec" :label="'主要内容'" width="200"></el-table-column>

        <!-- 完整性 -->
        <el-table-column :label="'完整性'" width="200">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.completeFlag" :disabled="inputDisable"></el-checkbox>
          </template>
        </el-table-column>

        <!-- 备注 -->
        <el-table-column prop="remark" :label="'备注'">
          <template slot-scope="scope">
            <span v-show="isShowSpan" style="width: 100%;">{{scope.row.remark}}</span>
            <el-input
              v-model.trim="scope.row.remark"
              style="width: 100%;"
              v-show="isEdit"
              size="mini"
              :disabled="inputDisable"
            ></el-input>
          </template>
        </el-table-column>
      </el-table>

      <el-row :gutter="12">
        <el-col :span="10">
          <div class="grid-content bg-purple" style="margin-top:20px;">
            <!-- 备注 -->
            <el-form-item :label="'备注：'">
              <el-input
                style="width:800px"
                type="textarea"
                :autosize="{ minRows: 4, maxRows: 6}"
                placeholder="请输入内容"
                v-model="ConstructionModel.remark"
                :disabled="inputDisable"
              ></el-input>
            </el-form-item>
          </div>
        </el-col>
      </el-row>

      <div class style="width:100%;float:left;margin-bottom:20px;">
        <div class="subTitle">
          <div class="breadcrumb-child">
            <i></i>关联流程
          </div>
        </div>
        <FlowAdd v-on:flow="flow" :showDeleteButton="showDeleteButton"></FlowAdd>
      </div>

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
        :projectId="ConstructionModelTest.projectId"
        :moduleCode="moduleCode"
        type="signed"
        v-on:cancelDialog="cancelDialog"
        v-on:closeDialog="closeDialog"
        v-on:confirmContract="confirmContract"
      ></ContractSelector>
    </el-form>
    <DesignAlterationAttachmentTable
      :queryObj_passed_in="queryModel"
      :showDeleteButton="showDeleteButton"
      :attaData="attachmentData"
      v-on:changeAttachments="changeAttachments"
      ref="DesignAlterationAttachmentTable"
    ></DesignAlterationAttachmentTable>
  </div>
</template>
<script>
import { ptn } from "@/utils/common/validate";
import {
  saveOrUpdateProjectDataApprove,
  getContractList,
  getContractDetail,
  getVisaList,
  getProjectNumber,
  detailProjectDataApprove
} from "@/api/cost/projectDataApproveAPI";
import { getMeProfile } from "@/api/sys/userAPI";
import ContractSelector from "@/components/cost/ContractSelector/";
import DesignAlterationAttachmentTable from "@/views/cost/designAlteration/DesignAlterationAttachmentTable";
import CostFileUpload from "@/components/cost/UploadFile/";
import { getAttachment } from "@/api/cost/attachment";
import { getApprove } from "@/api/cost/approve";
import ProjectAccountSelect from "@/components/cost/ProjectAccountSelect/";
import FlowAdd from "@/components/cost/FlowAdd/";
import COSTENUM from "@/utils/cost/enum";
export default {
  props: {
    vm_passed_in: {
      default: function() {
        return {
          id: "",
          projectId: "",
          projectName: "",
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
    ProjectAccountSelect,
    ContractSelector,
    DesignAlterationAttachmentTable,
    CostFileUpload,
    FlowAdd
  },
  data() {
    return {
      show: {
        group: false,
        company: false,
        dept: false,
        project: true,
        accObj: false
      },
      approveDataList: [
        { keyId: "1", spec: "工程结算通知书", completeFlag: false, remark: "" },
        { keyId: "2", spec: "工程结算申请单", completeFlag: false, remark: "" },
        {
          keyId: "3",
          spec: "甲方确认的竣工验收单、供货签收单、移交书等",
          completeFlag: false,
          remark: ""
        },
        {
          keyId: "4",
          spec: "扣款罚单、水电费扣款、客户索赔等应扣（罚）款清单",
          completeFlag: false,
          remark: ""
        },
        {
          keyId: "5",
          spec: "变更、签证、认质认价资料",
          completeFlag: false,
          remark: ""
        },
        { keyId: "6", spec: "完整的竣工图", completeFlag: false, remark: "" },
        {
          keyId: "7",
          spec: "供应商名称上报结算资料",
          completeFlag: false,
          remark: ""
        }
      ],
      radio: 3,
      value: "",
      rules: {
        receiptsName: [
          { message: "请填写单据名称", required: true, trigger: "blur" }
        ],
        contractNumber: [
          { message: "请选择合同", required: true, trigger: "change" }
        ],
        projectId: [
          { message: "请选择项目", required: true, trigger: "change" }
        ]
      },
      tableData: [],
      isEdit: false,
      isShowSpan: false,
      isShowAdd: true,
      isShowSubmit: true,
      isShowBack: false,
      buttonDisable: false,
      buttonDisableSub: false,
      showDeleteButton: true,
      inputDisable: false,
      formDisable: false,
      selectTable: [],
      fileList: "",
      limit: 4,
      size: 4,
      moduleCode: COSTENUM.module.PROJECT_SETTLEMENT,
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
        projectName: "",
        contractName: "",
        contractType: "",
        contractStatus: "5",
        // contractStatus: '',
        pageNo: 1,
        pageSize: 10,
        count: 0
      },
      queryModuleName: "",
      ConstructionModelTest: {
        projectId: "",
        projectName: ""
      },
      ConstructionModel: {
        id: "",
        receiptsNo: "",
        receiptsName: "",
        projectId: "",
        projectName: "",
        contractId: "",
        contractNumber: "",
        contractName: "",
        buildingDept: "",
        payDept: "",
        payMode: "",
        startDate: "",
        endDate: "",
        contractMoney: "",
        reportMoneyLower: "",
        reportMoneyUpper: "",
        remark: "",
        status: "0",
        createdBy: "",
        statusCh: "草稿",
        operator: "",
        operateDate: "",
        costRelateFlowList: [] // 关联流程
      },
      contractInfo: {},
      contractDetail: {},
      visaInfo: [],
      flag:false,
      bpmUrl:'',
      pickerOptions0: {
        disabledDate: time => {
          if (
            this.ConstructionModel.startDate !== "" &&
            this.ConstructionModel.endDate !== null
          ) {
            return time.getTime() > this.ConstructionModel.endDate;
          } else {
            // return time.getTime() < Date.now() - 8.64e7
          }
        }
      },
      pickerOptions1: {
        disabledDate: time => {
          return time.getTime() < this.ConstructionModel.startDate;
        }
      }
    };
  },
  mounted: function() {
    this.init();
  },
  methods: {
    init() {
      if (this.$route.query.isAdd) {
        localStorage.setItem("subId", "");
        this.buttonDisableSub = true;
        // 新增
        // this.ConstructionModel.projectId = ''
        this.tableData = [];
        this.ConstructionModel.operator = this.$getUserInfo()["nickName"];
        this.ConstructionModel.operateDate = new Date().format();
      } else {
        this.buttonDisableSub = false;
        this.tableData = [];
        this.ConstructionModel.id = this.$route.query.id;

        detailProjectDataApprove({ id: this.$route.query.id })
          .then(response => {
            debugger;
            this.ConstructionModel.companyId = response.data.companyId;
            this.ConstructionModel.companyName = response.data.companyName;
            this.ConstructionModel.receiptsNo = response.data.receiptsNo;
            this.ConstructionModel.receiptsName = response.data.receiptsName;
            this.ConstructionModelTest.projectId = response.data.projectId;
            this.ConstructionModelTest.projectName = response.data.projectName;
            this.ConstructionModel.contractId = response.data.contractId;
            this.ConstructionModel.contractNumber =
              response.data.contractNumber;
            this.ConstructionModel.contractName = response.data.contractName;
            this.ConstructionModel.buildingDept = response.data.buildingDept;
            this.ConstructionModel.payDept = response.data.payDept;
            this.ConstructionModel.payMode = response.data.payMode;
            this.ConstructionModel.startDate = response.data.startDate;
            this.ConstructionModel.endDate = response.data.endDate;
            this.ConstructionModel.remark = response.data.remark;
            this.ConstructionModel.status = response.data.status;
            this.ConstructionModel.contractMoney = response.data.contractMoney;
            this.ConstructionModel.reportMoneyLower =
              response.data.reportMoneyLower;
            this.ConstructionModel.reportMoneyUpper =
              response.data.reportMoneyUpper;
            this.ConstructionModel.operator = response.data.operator;
            this.ConstructionModel.operateDate = new Date(
              response.data.operateDate
            ).format();
            this.approveDataList = response.data.materialsList;
            this.bpmUrl = response.data.bpmUrl
            if(this.bpmUrl != ""){
              this.flag = true
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
    inputFunc() {
      this.Arabia_to_Chinese(this.ConstructionModel.reportMoneyLower);
    },
    Arabia_to_Chinese(Num) {
      for (var i = Num.length - 1; i >= 0; i--) {
        Num = Num.replace(",", ""); // 替换tomoney()中的“,”
        Num = Num.replace(" ", ""); // 替换tomoney()中的空格
      }
      // Num = Num.replace('￥', '')// 替换掉可能出现的￥字符
      // 字符处理完毕后开始转换，采用前后两部分分别转换
      var part = String(Num).split(".");
      var newchar = "";
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
      this.ConstructionModel.reportMoneyUpper = newchar;
      return newchar;
    },
    confirmContract(data) {
      this.ConstructionModel.companyId = data.companyId;
      this.ConstructionModel.companyName = data.companyName;
      this.ConstructionModel.contractNumber = data.contractCode;
      this.ConstructionModel.contractCode = data.contractCode;
      this.ConstructionModel.contractName = data.contractName;
      this.ConstructionModel.totalPrice = data.sharedAmountByCostSystem;
      this.ConstructionModel.buildingDept = data.partyBName;
      this.ConstructionModel.projectId = data.projectId;
      this.ConstructionModelTest.projectId = data.projectId;
      this.ConstructionModelTest.projectName = data.projectName;
      // this.ConstructionModel.contractMoney = data.businessContractAmount
      getProjectNumber(this.ConstructionModel)
        .then(response => {
          this.ConstructionModel.receiptsNo = response.data;
        })
        .catch(error => {
          console.log(error);
        });
      this.isShowContract = false;
      this.getVisaList();
    },
    flow(data) {
      this.ConstructionModel.costRelateFlowList = data;
    },
    getCurrentRow(contractDetail) {
      this.contractInfo = contractDetail;
    },
    cancelDialog(data) {
      this.isShowContract = data;
    },
    closeDialog(data) {
      this.isShowContract = data;
    },
    addRowToTableConstract() {
      this.isShowContract = true;
    },
    handleSelectionChange(val) {
      // debugger
      this.selectContract = val;
    },
    getVisaList() {
      let contractId = "";
      // if (this.ConstructionModel.contractId == '' || this.ConstructionModel.contractId == undefined) {
      //   contractId = this.ConstructionModel.contractId
      // } else {
      //   contractId = this.ConstructionModel.contractId
      // }
      let param = {
        contractId: this.ConstructionModel.contractId,
        contractCode: this.ConstructionModel.contractCode
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
          this.ConstructionModel.contractNumber = this.contractInfo.contractCode;
          this.ConstructionModel.contractName = this.contractInfo.contractName;
          this.ConstructionModel.contractCode = this.contractInfo.contractCode;
          this.ConstructionModel.buildingDept = this.contractInfo.partyB;
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
      this.contractQueryModel.projectId = this.ConstructionModel.projectId;
      // console.log(this.contractQueryModel)
      getContractList(this.contractQueryModel)
        .then(response => {
          this.selectTable = response.data.content;
        })
        .catch(error => {
          console.log(error);
        });
    },
    handleBack() {
      this.$router.push({
        name: "ProjectDataApproveList"
      });
    },
    submitConstructionCost() {
      this.buttonDisableSub = true;
      this.$refs["ConstructionModel"].validate(valid => {
        if (valid) {
          this.ConstructionModel.projectId = this.ConstructionModelTest.projectId;
          this.ConstructionModel.projectName = this.ConstructionModelTest.projectName;
          this.ConstructionModel.attachments = this.attachmentData;
          this.ConstructionModel.status = "1";
          this.ConstructionModel.materialsList = this.approveDataList;
          this.ConstructionModel.operateDate = new Date().format();
          saveOrUpdateProjectDataApprove(this.ConstructionModel)
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
    saveConstruction() {
      this.$refs["ConstructionModel"].validate(valid => {
        if (valid) {
          this.ConstructionModel.projectId = this.ConstructionModelTest.projectId;
          this.ConstructionModel.projectName = this.ConstructionModelTest.projectName;
          this.ConstructionModel.contractId = this.contractInfo.id;
          this.ConstructionModel.attachments = this.attachmentData;
          this.ConstructionModel.status = "0";
          this.ConstructionModel.materialsList = this.approveDataList;
          this.ConstructionModel.operateDate = new Date(
            this.ConstructionModel.operateDate
          ).format();
          saveOrUpdateProjectDataApprove(this.ConstructionModel)
            .then(response => {
              this.$showSuccess(response.message);
              this.ConstructionModel.id = response.data;
              this.isShowAdd = true;
              this.isShowBack = true;
              this.buttonDisableSub = false;
            })
            .catch(error => {
              console.log(error);
              this.$showError(
                error.message ? error.message : "msg_system_error"
              );
            });
        }
      });
    },
    inputAccountObject() {
      this.ConstructionModel.groupNumber =
        this.ConstructionModel.accountObjectId + "_IC";
    },
    changeAttachments(data) {
      this.DiameterModel.attachments = data;
      this.attachmentData = data;
    }
  },
  watch: {
    "ConstructionModelTest.projectId": function(newValue, oldValue) {
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
.col{
  color: blue;
  text-decoration: underline;
  cursor: pointer;
}
</style>
