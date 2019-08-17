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
        type="primary"
        :disabled="buttonDisable"
        v-show="isShowAdd"
        @click="saveContractAlteration"
      >{{$l('btn_save')}}</el-button>
      <el-button
        size="mini"
        type="primary"
        @click="submitModel"
        v-show="isShowSubmit"
        :disabled="buttonDis"
      >{{$l('lbl_cost_compilation_submit')}}</el-button>
    </div>
    <div class="form-unit">合同变更信息</div>

    <el-form
      label-width="150px"
      :disabled="allButtonDisable"
      :model="contractAlterationModel"
      ref="contractAlterationModel"
      :rules="rules"
      size="mini"
    >
      <el-row>
        <!--<ProjectSelector v-model='project' :show="show" :span="{'project':8}" :labelWidth="{'project':150}"></ProjectSelector>-->
        <ProjectAccountSelect
          v-model="project"
          :span="{ project: 8}"
          :show="show"
          :clearable="{ project: false, accObj: false }"
          :labelWidth="{project: 150}"
        ></ProjectAccountSelect>

        <el-col :span="8">
          <!-- 合同编号 -->
          <el-form-item :label="'合同编号：'" prop="contractCode">
            <el-input v-model="contractAlterationModel.contractCode" :disabled="buttonDisable">
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
            <el-input v-model="contractAlterationModel.contractName" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="8">
          <!-- 变更编号 -->
          <el-form-item :label="'变更编号：'" prop="code">
            <el-input v-model="contractAlterationModel.code" :disabled="true"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <!-- 供应商名称 -->
          <el-form-item :label="'供应商名称：'">
            <el-input v-model="contractAlterationModel.constructionUnit" :disabled="true"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <!-- 合同变更类型 -->
          <el-form-item :label="'合同变更类型：'" prop="reasonTypeCode">
            <fd-select
              v-model="contractAlterationModel.reasonTypeCode"
              :disabled="buttonDisable"
              type="cost_contract_alteration_type"
            ></fd-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="8">
          <!-- 合同金额(元) -->
          <el-form-item :label="'合同金额(元)：'">
            <el-input v-model="contractAlterationModel.contractAmt" :disabled="true"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <!-- 变更金额 -->
          <el-form-item :label="'变更金额(元)：'" prop="alterationAmt">
            <amount-input
              v-model.number="contractAlterationModel.alterationAmt"
              :disabled="buttonDisable"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" style="margin-bottom: 20px">
          <!-- 变更内容 -->
          <el-form-item :label="'变更内容：'">
            <el-input
              type="textarea"
              :disabled="buttonDisable"
              v-model="contractAlterationModel.alterationContent"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="8">
          <!-- 经办人 -->
          <el-form-item :label="'经办人：'">
            <el-input v-model="contractAlterationModel.operatorName" :disabled="true"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <!-- 提交日期 -->
          <el-form-item :label="'提交日期：'">
            <el-date-picker
              v-model="contractAlterationModel.operatorDate"
              :disabled="true"
              type="date"
            ></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row v-if="isShowAudit">
        <el-col :span="8">
          <!-- 审批状态 -->
          <el-form-item :label="'审批状态：'">
            <fd-label
              :code="contractAlterationModel.approveStatus"
              :class="{col:flag}"
              :url= "bpmUrl"
              type="cost_flow_status"
              :disabled="true"
            ></fd-label>
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <!-- 审批日期 -->
          <el-form-item :label="'审批日期：'">
            <el-date-picker
              v-model="contractAlterationModel.approveDate"
              :disabled="true"
              type="date"
            ></el-date-picker>
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
        v-model="contractAlterationModel.dynacostSplittingList"
        :splittingWay="contractAlterationModel.splittingWay"
        @saveSplit="saveSplit"
      ></CostSplittingTable>

      <div class="form-unit">附件列表</div>
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
        :projectId="projectId"
        v-on:cancelDialog="cancelDialog"
        v-on:closeDialog="closeDialog"
        v-on:confirmContract="confirmContract"
      ></ContractSelector>
    </el-form>
    <DesignAlterationAttachmentTable
      :queryObj_passed_in="queryModel"
      :attaData="attachmentData"
      v-on:changeAttachments="changeAttachments"
      :showDeleteButton="showDeleteButton"
      ref="DesignAlterationAttachmentTable"
    ></DesignAlterationAttachmentTable>
  </div>
</template>
<script >
import { LoadingUtil } from "@/utils/common/LoadingUtil";
import { ptn } from "@/utils/common/validate";
import {
  getContractAlterationDetail,
  getCode,
  createContractAlterationDetail,
  submit,
  dynacostSplittingList
} from "@/api/cost/contractAlteration";
import { getMeProfile } from "@/api/sys/userAPI";
import DesignAlterationAttachmentTable from "@/views/cost/designAlteration/DesignAlterationAttachmentTable";
import CostSplittingTable from "@/views/cost/contractAlteration/CostSplittingTable";
import CostFileUpload from "@/components/cost/UploadFile/";
import ProjectSelector from "@/components/cost/ProjectSelector/";
import ProjectAccountSelect from "@/components/cost/ProjectAccountSelect/";
import ContractSelector from "@/components/cost/ContractSelector/";
import AmountInput from "@/components/cost/AmountInput/";
export default {
  components: {
    CostFileUpload,
    DesignAlterationAttachmentTable,
    CostSplittingTable,
    ProjectSelector,
    ContractSelector,
    ProjectAccountSelect,
    AmountInput
  },
  data() {
    var validateProjectName = (rule, value, callback) => {
      value = this.project.projectId;
      if (value === "") {
        callback(new Error("请选择项目名称"));
      } else {
        callback();
      }
    };
    return {
      buttonDis: true,
      splittingWay: "",
      activeName: "",
      show: {
        project: true
      },
      fileList: "",
      limit: 4,
      size: 100,
      outerId: "",
      rules: {
        contractCode: [
          { required: true, message: "请选择合同编号", trigger: "change" }
        ],
        reasonTypeCode: [
          { required: true, message: "请选择变更类型", trigger: "change" }
        ],
        alterationAmt: [
          { required: true, message: "请输入变更金额", trigger: "blur" },
          { type: "number", message: "变更金额必须为数字值" }
        ],
        projectId: [
          { validator: validateProjectName, trigger: "change", required: true }
        ]
      },
      attachmentData: [],
      projectId: "",
      isShowContract: false,
      isShowAudit: false,
      isEdit: true,
      isShowSpan: false,
      allButtonDisable: false,
      isShowAdd: true,
      isShowSubmit: true,
      showDeleteButton: true,
      buttonDisable: false,
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
      contractAlterationModel: {
        id: "",
        projectId: "",
        code: "",
        contractId: "",
        contractCode: "",
        contractName: "",
        contractTypeCode: "",
        reasonTypeCode: "",
        constructionUnit: "",
        operatorName: "",
        operatorDate: "",
        alterationContent: "",
        isBudgetConveySure: "",
        approveStatus: "0",
        contractAmt: "",
        alterationAmt: "",
        attachments: [],
        contractTableData: [],
        dynacostSplittingList: [],
        // contractModels_splitting_cp2sb2ct: [],
        splittingWay: "0",
        moduleDataPK: "",
        flag:false,
        bpmUrl:''
      }
    };
  },
  mounted: function() {
    this.init();
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    },
    saveSplit(val) {
      this.contractAlterationModel.splittingWay = val;
    },
    checkoutDynamic() {
      this.contractAlterationModel.splittingWay = "0";

      if (!this.contractAlterationModel.code) {
        return this.$showError("请输入合同编号");
      } else if (!this.contractAlterationModel.alterationAmt) {
        return this.$showError("请输入变更金额");
      }
      this.contractAlterationModel.dynacostSplittingList = [];
      this.getSplittingList();
    },
    getSplittingList() {
      LoadingUtil.showLoading();
      if (this.$route.query.id) {
        this.contractAlterationModel.moduleDataPK = this.$route.query.id;
      }

      dynacostSplittingList({
        moduleType: "4_1",
        contractAlteration: this.contractAlterationModel,
        moduleDataPK: this.contractAlterationModel.moduleDataPK
      }).then(response => {
        LoadingUtil.hideLoading();
        // this.designAlterationModel.dynacostSplittingList = response.data ? response.data : []
        this.contractAlterationModel.dynacostSplittingList = response.data
          ? response.data
          : [];

        if (this.contractAlterationModel.dynacostSplittingList.length > 0) {
          this.contractAlterationModel.splittingWay = this.contractAlterationModel.dynacostSplittingList[0].splittingWay;
        }
      });
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
    confirmContract(data) {
      this.contractAlterationModel.contractCode = data.contractCode;
      this.contractAlterationModel.contractName = data.contractName;
      this.contractAlterationModel.constructionUnit = data.partyBName;
      this.contractAlterationModel.contractAmt = data.businessContractAmount;
      this.contractAlterationModel.isBudgetConveySure = data.isBudgetConveySure;
      this.contractAlterationModel.contractTypeCode = data.contractType;
      this.project.projectId = data.projectId;
      getCode(this.contractAlterationModel)
        .then(response => {
          this.contractAlterationModel.code = response.data;
          this.outerId = this.contractAlterationModel.code;
        })
        .catch(error => {
          console.log(error);
        });
    },
    init() {
      if (this.$route.query.isAdd) {
        debugger;
        // 新增
        this.isEdit = this.$route.query.isEdit.toString() === "true";
        this.contractAlterationModel.operatorName = this.$getUserInfo()[
          "nickName"
        ];
        this.contractAlterationModel.operatorDate = new Date();
      } else {
        this.buttonDis = false;
        getContractAlterationDetail({ id: this.$route.query.id })
          .then(response => {
            this.attachmentData = response.data.attachments;
            this.contractAlterationModel.dynacostSplittingList =
              response.data.dynacostSplittingList;
            this.contractAlterationModel.splittingWay =
              response.data.splittingWay;
            this.contractAlterationModel.id = response.data.id;
            this.outerId = response.data.code;
            this.project.projectId = response.data.projectId;
            this.contractAlterationModel.code = response.data.code;
            this.contractAlterationModel.projectId = response.data.projectId;
            this.contractAlterationModel.contractCode =
              response.data.contractCode;
            this.contractAlterationModel.contractName =
              response.data.contractName;
            this.contractAlterationModel.reasonTypeCode =
              response.data.reasonTypeCode;
            this.contractAlterationModel.contractAmt =
              response.data.contractAmt;
            this.contractAlterationModel.constructionUnit =
              response.data.constructionUnit;
            this.contractAlterationModel.operatorName =
              response.data.operatorName;
            this.contractAlterationModel.operatorDate =
              response.data.operatorDate;
            this.contractAlterationModel.alterationContent =
              response.data.alterationContent;
            this.contractAlterationModel.alterationAmt =
              response.data.alterationAmt;
            this.contractAlterationModel.isBudgetConveySure =
              response.data.isBudgetConveySure;
            this.contractAlterationModel.approveStatus =
              response.data.approveStatus;
            this.contractAlterationModel.approveDate =
              response.data.approveDate;
            this.bpmUrl = response.data.bpmOriginUrl
            if(this.bpmUrl != ''){
              this.flag = true
            }
          })
          .catch(error => {
            console.log(error);
            this.$showError(error.message ? error.message : "msg_system_error");
          });

        this.isEdit = this.$route.query.isEdit.toString() === "true";
        if (!this.isEdit) {
          this.isShowSpan = true;
          this.buttonDisable = true;
          this.isShowAdd = false;
          this.isShowSubmit = false;
          this.showDeleteButton = false;
          this.allButtonDisable = true;
          this.isShowAudit = true;
        }
      }
    },
    onSubmit(formName) {
      var validateResult = true;
      this.$refs[formName].validate(valid => {
        if (!valid) {
          validateResult = false;
        }
      });
      if (!validateResult) {
        return;
      }
      LoadingUtil.showLoading();
    },
    handleBack() {
      this.$router.push({
        name: "ContractAlterationList"
      });
    },
    saveContractAlteration() {
      this.$refs["contractAlterationModel"].validate(valid => {
        console.log(valid);
        if (valid) {
          this.contractAlterationModel.attachments = this.attachmentData;
          this.contractAlterationModel.projectId = this.project.projectId;
          LoadingUtil.showLoading();
          this.contractAlterationModel.approveStatus = "0";
          createContractAlterationDetail(this.contractAlterationModel)
            .then(response => {
              LoadingUtil.hideLoading();
              this.$showSuccess(response.message);
              this.contractAlterationModel.id = response.data;
              this.buttonDis = false;
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
    submitModel() {
      this.buttonDis = true;
      this.$refs["contractAlterationModel"].validate(valid => {
        if (valid) {
          this.contractAlterationModel.attachments = this.attachmentData;
          this.contractAlterationModel.projectId = this.project.projectId;
          LoadingUtil.showLoading();
          this.contractAlterationModel.approveStatus = "0";
          createContractAlterationDetail(this.contractAlterationModel)
            .then(response => {
              this.contractAlterationModel.id = response.data;
              submit(this.contractAlterationModel)
                .then(response => {
                  LoadingUtil.hideLoading();
                  if (response.code === "2000") {
                    this.$router.push({
                      name: "ContractAlterationList"
                    });
                    this.$showSuccess(response.message);
                  } else {
                    this.buttonDis = false;
                    this.$showError(response.message);
                  }
                })
                .catch(error => {
                  console.log(error);
                  this.buttonDis = false;
                  this.$showError(
                    error.message ? error.message : "msg_system_error"
                  );
                });
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
    changeAttachments(data) {
      this.contractAlterationModel.attachments = data;
    }
  },
  watch: {
    project: function(newValue, oldValue) {
      this.projectId = this.project.projectId;
      this.contractAlterationModel.contractCode = "";
      this.contractAlterationModel.contractName = "";
      this.contractAlterationModel.code = "";
      this.contractAlterationModel.constructionUnit = "";
      this.contractAlterationModel.contractAmt = "";
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



