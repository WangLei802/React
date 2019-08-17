<template>
  <div class="app-container">
    <div style="text-align:right; margin:10px 0;">
      <el-button
        size="mini"
        v-if="!$store.state.user.isFromBpm"
        @click="handleBack"
      >{{$l("btn_back")}}</el-button>
      <el-button
        size="mini"
        v-if="$checkPersmissionByCode('cost:paymentEngineering:create')"
        type="primary"
        :disabled="buttonDisable"
        v-show="isShowAdd"
        @click="saveConstruction"
      >{{$l("btn_save")}}</el-button>
      <el-button
        size="mini"
        v-if="$checkPersmissionByCode('cost:paymentEngineering:create')"
        type="primary"
        @click="submitConstructionCost"
        v-show="isShowSubmit"
        :disabled="buttonDisableSub"
      >{{$l("lbl_cost_compilation_submit")}}</el-button>
    </div>
    <div class="form-unit">基本信息</div>
    <el-form
      label-width="150px"
      status-icon
      :model="ConstructionModel"
      ref="ConstructionModel"
      :rules="rules"
      :disabled="formDisable"
    >
      <el-row>
        <el-col :span="8">
          <!-- 单据编号 -->
          <el-form-item :label="'单据编号：'" prop="receiptsNo">
            <el-input v-model="ConstructionModel.receiptsNo" :disabled="true"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <!-- 单据名称 -->
          <el-form-item :label="'单据名称：'" prop="receiptsName">
            <el-input v-model="ConstructionModel.receiptsName" :disabled="inputDisable"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 项目名称 -->
      <el-row>
        <ProjectAccountSelect
          v-model="ConstructionModelTest"
          :span="{ project: 8}"
          :show="show"
          :clearable="{ project: false, accObj: false }"
          :labelWidth="{project: 150}"
        ></ProjectAccountSelect>
        <el-col :span="8">
          <!-- 结算方式 -->
          <el-form-item :label="'结算方式：'">
            <el-input v-model="ConstructionModel.payMode" :disabled="inputDisable"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <!-- 供应商名称 -->
          <el-form-item :label="'供应商名称：'">
            <el-input v-model="ConstructionModel.buildingDept" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
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
          <el-form-item :label="'开工日期：'">
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
          <el-form-item :label="'经办人：'" prop="operator">
            <el-input v-model="ConstructionModel.operator" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <!-- 提交日期 -->
          <el-form-item :label="'提交日期：'" prop="operateDate">
            <!--<el-input-->
            <!--v-model="ConstructionModel.operateDate" :disabled="true"></el-input>-->
            <el-date-picker v-model="ConstructionModel.operateDate" :disabled="true" type="date"></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <!-- 审批状态 -->
          <el-form-item :label="'审批状态：'" prop="statusCh">
            <!-- 王先森 合同验收及工 status-->
            <!-- <div>{{ConstructionModel.statusCh}}</div> -->
            <fd-label
              :code="ConstructionModel.status"
              :class="{col:flag}"
              :url= "bpmUrl"
              type="cost_flow_status"
              :disabled="true"
            ></fd-label>
            <!-- <el-input
            v-model="ConstructionModel.statusCh" :disabled="true"></el-input>-->
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <!-- 审批日期 -->
          <el-form-item :label="'审批日期：'" prop="approveDate">
            <!--<el-input-->
            <!--v-model="ConstructionModel.approveDate" :disabled="true"></el-input>-->
            <el-date-picker v-model="ConstructionModel.approveDate" :disabled="true" type="date"></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>

      <div class="form-unit">备注</div>
      <el-input
        type="textarea"
        :autosize="{ minRows: 4, maxRows: 6}"
        placeholder="备注"
        v-model="ConstructionModel.remark"
        :disabled="inputDisable"
      ></el-input>

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
      :attaData="attachmentData"
      :showDeleteButton="showDeleteButton"
      v-on:changeAttachments="changeAttachments"
      ref="DesignAlterationAttachmentTable"
    ></DesignAlterationAttachmentTable>
  </div>
</template>
<script>
import {
  saveOrUpdateProjectNotice,
  getContractList,
  getContractDetail,
  getVisaList,
  getProjectNumber,
  detailPaymentEngineering
} from "@/api/cost/projectNoticeAPI";
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
        project: true,
        accObj: false
      },
      radio: 3,
      value: "",
      rules: {
        contractNumber: [
          { message: "请填写合同名称", required: true, trigger: "change" }
        ],
        receiptsName: [
          { message: "请填写单据名称", required: true, trigger: "blur" }
        ],
        projectId: [
          { message: "请输入项目名称", required: true, trigger: "change" }
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
      moduleCode: COSTENUM.module.CONTRACT_AND_SETTLEMENT,
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
        payMode: "",
        buildingDept: "",
        contractId: "",
        contractNumber: "",
        contractName: "",
        startDate: "",
        endDate: "",
        remark: "",
        status: "0",
        operator: "",
        operateDate: "",
        statusCh: "草稿",
        approveDate: "",
        costRelateFlowList: [] // 关联流程
      },
      status: "",
      flag:false,
      bpmUrl:'',
      contractInfo: {},
      contractDetail: {},
      visaInfo: [],
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
        localStorage.setItem("subId", this.$route.query.id);
        this.ConstructionModel.id = this.$route.query.id;

        detailPaymentEngineering({ id: this.$route.query.id })
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
            this.ConstructionModel.startDate = response.data.startDate;
            this.ConstructionModel.endDate = response.data.endDate;
            this.ConstructionModel.remark = response.data.remark;
            this.ConstructionModel.status = response.data.status;
            this.ConstructionModel.payMode = response.data.payMode;
            this.ConstructionModel.operateDate = new Date(
              response.data.operateDate
            ).format();
            this.ConstructionModel.operator = response.data.operator;
            this.bpmUrl = response.data.bpmUrl
            if(this.bpmUrl != ""){
              this.flag = true
            }
            if (this.ConstructionModel.status == "0") {
              this.ConstructionModel.statusCh = "草稿";
            } else if (this.ConstructionModel.status == "1") {
              this.ConstructionModel.statusCh = "审批中";
            } else if (this.ConstructionModel.status == "2") {
              this.ConstructionModel.statusCh = "已审批";
            } else if (this.ConstructionModel.status == "3") {
              this.ConstructionModel.statusCh = "已驳回";
            }
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
      this.ConstructionModel.id = this.$route.query.id;
      // this.ConstructionModel.projectId = this.$route.query.projectId
      // this.constructionDetailModel.qualityPriceId = this.$route.query.id
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
      if (this.ConstructionModel.contractCode == "") {
      } else {
        getProjectNumber(this.ConstructionModel)
          .then(response => {
            this.ConstructionModel.receiptsNo = response.data;
          })
          .catch(error => {
            console.log(error);
          });
        this.isShowContract = false;
        this.getVisaList();
      }
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
    flow(data) {
      this.ConstructionModel.costRelateFlowList = data;
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
          // console.log()
          // this.ConstructionModel.contractId = this.contractInfo.id
          this.ConstructionModel.contractNumber = this.contractInfo.contractCode;
          this.ConstructionModel.contractName = this.contractInfo.contractName;
          this.ConstructionModel.contractCode = this.contractInfo.contractCode;
          this.ConstructionModel.contractDate = this.contractInfo.contractDate;
          this.ConstructionModel.projectName = this.contractInfo.projectName;
          this.ConstructionModel.contractValue = this.contractInfo.sharedAmountByCostSystem;
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
        name: "ProjectNoticeList"
      });
    },
    submitConstructionCost() {
      this.buttonDisableSub = true;
      this.$refs["ConstructionModel"].validate(valid => {
        if (valid) {
          this.ConstructionModel.projectId = this.ConstructionModelTest.projectId;
          this.ConstructionModel.projectName = this.ConstructionModelTest.projectName;
          this.ConstructionModel.operateDate = new Date().format();
          this.ConstructionModel.attachments = this.attachmentData;
          this.ConstructionModel.status = "1";
          saveOrUpdateProjectNotice(this.ConstructionModel)
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
          this.ConstructionModel.contractId = this.contractInfo.id;
          this.ConstructionModel.projectId = this.ConstructionModelTest.projectId;
          this.ConstructionModel.projectName = this.ConstructionModelTest.projectName;
          this.ConstructionModel.attachments = this.attachmentData;
          this.ConstructionModel.status = "0";
          saveOrUpdateProjectNotice(this.ConstructionModel)
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
text-decoration:underline ;
cursor: pointer;
}
</style>
