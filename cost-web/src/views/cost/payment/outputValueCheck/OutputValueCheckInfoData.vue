<template>
  <div class="app-container">
    <!-- 按钮 -->
    <div style="margin-top: 15px;text-align:right">
      <!-- 返回 -->
      <el-button
        size="mini"
        v-if="!$store.state.user.isFromBpm"
        class="ordinary-btn"
        @click="goback"
      >{{$l("btn_back")}}</el-button>
      <!-- 保存 -->
      <el-button size="mini" type="primary" @click="saveInfo" v-if="isShowEdit">{{ $l("btn_save") }}</el-button>
      <!-- 提交审核 -->
      <el-button
        size="mini"
        type="primary"
        @click="submit"
        v-if="isShowEdit"
        :disabled="buttonDis"
      >{{ $l("lbl_cost_compilation_submit") }}</el-button>
    </div>

    <div ref="contractSignListTable">
      <el-form
        ref="form"
        :disabled="allButtonDisable"
        :model="form"
        label-width="150px"
        :rules="rules"
        size="mini"
      >
        <div class="form-unit">合同基本信息</div>
        <el-row>
          <el-col :span="8">
            <el-form-item label="产值核定编号：">
              <el-input v-model="form.code" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="合同编号：" style="height:28px;" prop="contractCode">
              <el-input v-model="form.contractCode" v-if="isShowEdit">
                <span
                  slot="append"
                  v-if="isShowEdit"
                  @click="addRowToTableConstract"
                  class="el-icon-search"
                  :style="{'cursor':'pointer'}"
                ></span>
              </el-input>
              <el-input
                v-model="form.contractCode"
                prop="contractCode"
                v-if="!isShowEdit"
                :disabled="true"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="合同名称：" prop="contractCode">
              <el-input v-model="form.contractName" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="8">
            <el-form-item label="合同金额(元)：">
              <amount-input v-model="form.contractAmt" :disabled="true"></amount-input>
              <!-- <el-input v-model="form.contractAmt" :disabled="true" ></el-input>-->
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="供应商名称：">
              <el-input v-model="form.constructionUnit" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="项目名称：">
              <el-input v-model="form.projectName" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="累计付款金额(元)：">
              <amount-input v-model="form.totalApplyAmt" :disabled="true"></amount-input>
              <!-- <el-input v-model="form.totalApplyAmt"   ></el-input> -->
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="累计核定金额(元)：">
              <amount-input v-model="form.totalCheckAmt" :disabled="true"></amount-input>
              <!--<el-input v-model="form.totalCheckAmt"  :disabled="true"  ></el-input> -->
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="计划付款日期：">
              <el-date-picker
                v-if="isShowEdit"
                v-model="form.planedPaymentDate"
                type="date"
                placeholder="选择日期时间"
              ></el-date-picker>
              <el-date-picker
                v-if="!isShowEdit"
                :disabled="true"
                v-model="form.planedPaymentDate"
                type="date"
                placeholder="选择日期时间"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="上报金额(元)：">
              <amount-input v-model="form.reportAmt" v-if="isShowEdit"/>
              <el-input v-model="form.reportAmt" v-if="!isShowEdit" :disabled="true"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="核定金额(元)：" prop="checkAmt">
              <amount-input v-model="form.checkAmt" v-if="isShowEdit"/>
              <el-input v-model="form.checkAmt" v-if="!isShowEdit" :disabled="true"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="合同约定付款比例（%）：" title="合同约定付款比例（%）：" prop="contractualPaymentRatio">
              <el-input
                type="number"
                v-model="form.contractualPaymentRatio"
                v-if="isShowEdit"
                @change="handleRowChange"
              ></el-input>
              <el-input v-model="form.contractualPaymentRatio" v-if="!isShowEdit" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="经办人：">
              <el-input v-model="form.operatorName" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="提交日期：">
              <el-date-picker v-model="form.operatorDate" :disabled="true" type="date"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 王先森 -->
        <el-row v-show="isShowAudit">
          <el-col :span="8">
            <el-form-item label="审批状态：">
              <!-- <fd-label :code="form.approveStatus" type="cost_flow_status" :disabled="true"></fd-label> -->
              <fd-label
                :code="form.approveStatus"
                :class="{col:flag}"
                :url= "bpmUrl"
                type="cost_flow_status"
                :disabled="true"
              ></fd-label>
              <!-- <el-input v-model="form.approveStatus" type="cost_flow_status" :disabled="true"></el-input> -->
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="审批日期：">
              <el-date-picker v-model="form.operatorDate" :disabled="true" type="date"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <div class="inlineData modeul">
          <div class="form-unit">详细内容</div>
          <el-input type="textarea" v-model="form.detailContent"></el-input>
        </div>

        <div class="form-unit">附件列表</div>

        <el-form-item label="上传附件:" style="margin-left: -80px;">
          <CostFileUpload
            v-model="fileList"
            :limit="limit"
            :attachmentData="attachmentData"
            :outerId="outerId"
          ></CostFileUpload>
        </el-form-item>
      </el-form>
    </div>
    <ContractSelector
      :moduleCode="moduleCode"
      :showContract="isShowContract"
      :isPaiedByOutputValue="'1'"
      v-on:confirmContract="confirmContract"
      v-on:cancelDialog="cancelDialog"
      v-on:closeDialog="closeDialog"
    ></ContractSelector>

    <DesignAlterationAttachmentTable
      :queryObj_passed_in="queryModel"
      :attaData="attachmentData"
      v-on:changeAttachments="changeAttachments"
      :showDeleteButton="showDeleteButton"
      ref="DesignAlterationAttachmentTable"
    ></DesignAlterationAttachmentTable>
  </div>
</template>

<script>
import DesignAlterationAttachmentTable from "@/views/cost/designAlteration/DesignAlterationAttachmentTable";
import ContractSelector from "@/components/cost/ContractSelector/";
import { mapGetters } from "vuex";
import CostFileUpload from "@/components/cost/UploadFile/";
import { getMeProfile } from "@/api/sys/userAPI";
import {
  approveOutputValue,
  updateOutputValue,
  createOutputValue,
  getOutputValue,
  getNewFormOutputValue
} from "@/api/cost/outputValueCheckAPI";
import COSTENUM from "@/utils/cost/enum";
import AmountInput from "@/components/cost/AmountInput/";
export default {
  data() {
    return {
      bpmUrl:'',
      flag:false,
      buttonDis: true,
      isShowAudit: false,
      isShowContract: false,
      isShowEdit: false,
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
      limit: 4,
      size: 4,
      moduleCode: COSTENUM.module.OUTPUT_VALUE_CHECK,
      attachmentData: [],
      attachments: [],
      fileList: "",
      outerId: "",
      isOrEdit: false,
      contractId: "",
      projectmode: "",
      show: {
        group: false,
        company: false,
        dept: false,
        project: true,
        accObj: true
      },
      isShow: {
        group: false,
        company: false,
        dept: false,
        project: true,
        accObj: true
      },
      accountProjec: {},
      project: { companyId: null, projectId: null, accObjId: null },
      stayHappenAmount: false,
      primaryIsAdd: false,
      primaryContract: false,
      projectInfo: [],
      corporateCompanyList: [],
      dialogContractPlan: false,
      dialogVisible: false,
      form: {
        code: "",
        contractCode: "",
        contractName: "",
        contractAmt: "",
        projectId: "",
        operatorDate: "",
        approveDate: "",
        projectName: "",
        // 王先森
        approveStatus: "0",
        planedPaymentDate: "",
        totalApplyAmt: "",
        totalCheckAmt: "",
        reportAmt: "",
        checkAmt: "",
        detailContent: "",
        contractualPaymentRatio: "",
        operatorName: ""
      },
      
      rules: {
        contractCode: [
          { required: true, message: "请选择合同", trigger: "change" }
        ],
        checkAmt: [
          { required: true, message: "请输入核定金额", trigger: "blur" }
        ],
        contractualPaymentRatio: [
          { required: true, message: "请输入合同约定付款比例", trigger: "blur" }
        ]
      },
      isEdit: false,
      allButtonDisable: false,
      showDeleteButton: true,
      tableDataList: [],

      paymentDetails: []
    };
  },
  components: {
    DesignAlterationAttachmentTable,
    CostFileUpload,
    AmountInput,
    ContractSelector
  },
  mounted() {
    if (this.$route.query.id) {
      getOutputValue({ id: this.$route.query.id })
        .then(response => {
          this.initCommonInfoData(response);
        })
        .catch(error => {
          console.log(error);
          this.$showError(error.message ? error.message : "msg_system_error");
        });
    }
    if (this.$route.query.ischeck == 1) {
      this.buttonDis = false;
    }
    if (this.$route.query.ischeck.toString() === "0") {
      this.isShowEdit = false;
      this.allButtonDisable = true;
      this.showDeleteButton = false;
      this.isShowAudit = true;
    } else if (this.$route.query.ischeck.toString() === "1") {
      this.isEdit = true;
      this.isShowEdit = true;
      this.allButtonDisable = false;
      this.isShowAudit = true;
    } else {
      this.isEdit = false;
      this.isShowEdit = true;
      this.allButtonDisable = false;
    }
  },
  watch: {},
  methods: {
    handleRowChange() {
      if (
        Number(this.form.contractualPaymentRatio) < 0 ||
        Number(this.form.contractualPaymentRatio) > 100
      ) {
        this.$showNormalError("合同约定付款比例应约束为0-100的整数,请重新输入");
      }
    },
    changeAttachments(data) {
      this.designAlterationModel.attachments = data;
    },
    goback() {
      this.$router.push({
        name: "OutputValueCheckList"
      });
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
    confirmContract(data) {
      getNewFormOutputValue({ contractCode: data.contractCode })
        .then(response => {
          if (response.data) {
            this.form.contractCode = response.data.contractCode;
            this.form.code = response.data.code;
            this.form.projectId = response.data.projectId;
            this.form.contractName = response.data.contractName;
            this.form.contractAmt = response.data.contractAmt;
            this.form.constructionUnit = response.data.constructionUnit;

            this.form.projectName = response.data.projectName;
            this.form.totalApplyAmt = response.data.totalApplyAmt;
            this.form.totalCheckAmt = response.data.totalCheckAmt;
            // this.form.operatorName = response.data.operatorName
            this.form.operatorDate = response.data.operatorDate;
            // 王先森 产值核定 ++ 审批日期
            this.form.approveDate = response.data.approveDate;
            // 王先森 产值核定 ++ 审批状态
            this.form.approveStatus = response.data.approveStatus;

            this.outerId = response.data.code;
          }
        })
        .catch(error => {
          console.log(error);
          this.$showError(error.message ? error.message : "msg_system_error");
        });

      this.form.operatorName = this.$getUserInfo()["nickName"];
      // this.form.operatorDate = new Date()
    },
    // 初始化基本信息
    initCommonInfoData(response) {
      let _this = this;
      if (!response.data) {
        this.$showNormalError("没有可用数据");
        return;
      }
      if (response.data.planedPaymentDate) {
        this.form.planedPaymentDate = new Date(
          response.data.planedPaymentDate
        ).format();
      }

      this.form.contractCode = response.data.contractCode;
      this.form.code = response.data.code;
      this.form.projectId = response.data.projectId;
      this.form.contractName = response.data.contractName;
      this.form.contractAmt = response.data.contractAmt;
      this.form.constructionUnit = response.data.constructionUnit;
      this.form.projectName = response.data.projectName;
      this.form.totalApplyAmt = response.data.totalApplyAmt;
      this.form.operatorName = response.data.operatorName;
      this.form.totalCheckAmt = response.data.totalCheckAmt;
      this.form.operatorDate = new Date(response.data.operatorDate).format();
      // 王先森 产值核定 ++ 审批日期 转换
      this.form.approveDate = new Date(response.data.approveDate).format();
      this.form.reportAmt = response.data.reportAmt;
      // 王先森 产值核定 ++ 审批状态
      this.form.approveStatus = response.data.approveStatus;
      this.form.checkAmt = response.data.checkAmt;
      this.form.contractualPaymentRatio = response.data.contractualPaymentRatio;
      this.form.detailContent = response.data.detailContent;
      this.attachmentData = response.data.attachmentList;
      this.bpmUrl = response.data.bpmOriginUrl
      if(this.bpmUrl != ''){
        this.flag = true
      }
    },
    
    saveInfo() {
      let queryModel = {
        planedPaymentDate: this.form.planedPaymentDate,
        contractCode: this.form.contractCode,
        code: this.form.code,
        projectId: this.form.projectId,
        contractName: this.form.contractName,
        contractAmt: this.form.contractAmt,
        constructionUnit: this.form.constructionUnit,
        projectName: this.form.projectName,
        totalApplyAmt: this.form.totalApplyAmt,
        operatorName: this.form.operatorName,
        totalCheckAmt: this.form.totalCheckAmt,
        reportAmt: this.form.reportAmt,
        checkAmt: this.form.checkAmt,
        contractualPaymentRatio: this.form.contractualPaymentRatio,
        detailContent: this.form.detailContent,
        attachmentList: this.attachmentData
      };
      debugger;
      if (this.$route.query.id) {
        queryModel.id = this.$route.query.id;
      }

      if (this.isEdit) {
        updateOutputValue(queryModel)
          .then(response => {
            if (response.code !== "2000") {
              this.$showError(response.message);
              this.buttonDis = true;
            } else {
              // this.isShowEdit = false
              this.buttonDis = false;
              this.$showSuccess(response.message);
              /* this.$router.push({
              name: 'OutputValueCheckList'

            }) */
            }
          })
          .catch(error => {
            console.log(error);
            this.buttonDis = true;
            this.$showError(error.message ? error.message : "msg_system_error");
          });
      } else {
        createOutputValue(queryModel)
          .then(response => {
            if (response.code !== "2000") {
              this.buttonDis = true;
              this.$showError(response.message);
            } else {
              // this.isShowEdit = false
              this.buttonDis = false;
              this.$showSuccess(response.message);
              /* this.$router.push({
              name: 'OutputValueCheckList'
            }) */
            }
          })
          .catch(error => {
            console.log(error);
            this.buttonDis = true;
            this.$showError(error.message ? error.message : "msg_system_error");
          });
      }
    },
    submit() {
      this.buttonDis = true;
      if (this.$route.query.id || this.form.code) {
        // this.isShowEdit = false;
        this.form.attachmentList = this.attachmentData
        approveOutputValue(this.form)
          .then(response => {
            if (response.code !== "2000") {
              this.$showError(response.message);
              // this.isShowEdit = true;
              this.buttonDis = false;
            } else {
              this.$showSuccess(response.message);
              this.$router.push({
                name: "OutputValueCheckList"
              });
            }
          })
          .catch(error => {
            console.log(error);
            this.buttonDis = false;
            this.$showError(error.message ? error.message : "msg_system_error");
          });
      }
    }
  }
};
</script>
<style scoped>
  .col{
    color: blue;
    text-decoration: underline;
    cursor: pointer;
  }
</style>

