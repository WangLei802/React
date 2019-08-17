<template>
  <div class="app-container" ref="all">
    <div style="text-align:right; margin:10px 0;">
      <el-button
        size="mini"
        v-if="!$store.state.user.isFromBpm"
        @click="handleBack"
      >{{$l("btn_back")}}</el-button>
      <el-button size="mini" type="primary" @click="backUpload" v-show="isShowBackUploadButton">回传</el-button>
      <el-button size="mini" type="primary" @click="invalidInstruction" v-show="isShowInval">作废</el-button>
      <el-button size="mini" type="primary" @click="distributeInstruction" v-show="isShowDistrui">下发</el-button>
      <el-button size="mini" type="primary" @click="printWeb()">打印</el-button>
      <!-- @click="printWeb($event)"  v-print="'#printTest'" -->
    </div>
    <div>
      <div style="margin-left: 180px">
        <el-steps :active="active" space="70%" style="margin-bottom: 20px">
          <el-step title="设计变更申请" :style="{'cursor':'pointer'}" @click.native="gotoDesign"></el-step>
          <el-step title="指令单下发"></el-step>
          <el-step
            title="完工确认"
            :style="{'cursor':'pointer'}"
            @click.native="gotoCompletionFlag && gotoCompletion()"
          ></el-step>
          <el-step
            title="造价确认"
            :style="{'cursor':'pointer'}"
            @click.native="gotoCostFlag && gotoCost()"
          ></el-step>
        </el-steps>
      </div>

      <div class="form-unit">签证指令单</div>

      <el-form
        label-width="150px"
        status-icon
        :model="designAlterationModel"
        ref="designAlterationModel"
        size="mini"
      >
        <el-row>
          <el-col :span="8">
            <!-- 指令单编号 -->
            <el-form-item :label="'指令单编号：'">
              <el-input v-model="designAlterationModel.code" :disabled="true"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <!-- 设计变更编号 -->
            <el-form-item :label="'设计变更编号：'">
              <el-input v-model="designAlterationModel.alterationVisaCode" :disabled="true"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <!-- 项目名称 -->
            <el-form-item :label="'项目名称：'">
              <el-input v-model="designAlterationModel.projectName" :disabled="true"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <!-- 合同编号 -->
            <el-form-item :label="'合同编号：'">
              <el-input v-model="designAlterationModel.contractCode" :disabled="true"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <!-- 合同名称 -->
            <el-form-item :label="'合同名称：'">
              <el-input v-model="designAlterationModel.contractName" :disabled="true"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <!-- 责任单位 -->
            <el-form-item :label="'责任单位：'">
              <fd-select
                v-model="designAlterationModel.accountabilityUnit"
                type="cost_subject_responsible_dept_code"
                :disabled="true"
              ></fd-select>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <!-- 供应商名称 -->
            <el-form-item :label="'供应商名称：'">
              <el-input v-model="designAlterationModel.constructionUnit" :disabled="true"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <!-- 回传日期 -->
            <el-form-item :label="'回传日期：'" v-show="isShowBackUpload">
              <el-date-picker
                v-model="designAlterationModel.backUploadDate"
                :disabled="true"
                type="date"
              ></el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <!-- 经办人 -->
            <el-form-item :label="'经办人：'">
              <el-input v-model="designAlterationModel.distributeOperator" :disabled="true"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <!-- 下发日期 -->
            <el-form-item :label="'下发日期：'">
              <el-date-picker
                v-model="designAlterationModel.distributeDate"
                :disabled="true"
                type="date"
              ></el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <!-- 是否涉及返工 -->
            <el-form-item :label="'是否涉及返工：'">
              <template>
                <el-radio v-model="designAlterationModel.isReprocess" label="1" :disabled="true">涉及</el-radio>
                <el-radio v-model="designAlterationModel.isReprocess" label="0" :disabled="true">不涉及</el-radio>
              </template>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <!-- 详细内容 -->
            <el-form-item :label="'详细内容：'">
              <el-input
                type="textarea"
                :disabled="true"
                autosize
                v-model="designAlterationModel.variationContent"
              ></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="24" v-if="isShowValidReason">
            <!-- 作废原因 -->
            <el-form-item :label="'作废原因：'">
              <el-input
                type="textarea"
                autosize
                :disabled="isInvalid"
                v-model="designAlterationModel.invalidReason"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <div v-show="isShowAttachments">
          <div class="form-unit">附件列表</div>
          <el-form-item label="上传附件:" style="margin-left: -80px;">
            <CostFileUpload
              style="margin-bottom: 20px;display: inline"
              v-model="fileList"
              :limit="limit"
              :attachmentData="designAlterationModel.attachments"
              :outerId="outerId"
            ></CostFileUpload>
            <span>(注：请上传指令单下发后的签字单据。)</span>
          </el-form-item>
        </div>
      </el-form>
      <DesignAlterationAttachmentTable
        :queryObj_passed_in="queryModel"
        v-show="isShowAttachments"
        :showDeleteButton="showDeleteButton"
        :attaData="designAlterationModel.attachments"
        v-on:changeAttachments="changeAttachments"
        ref="DesignAlterationAttachmentTable"
      ></DesignAlterationAttachmentTable>
    </div>
    <div v-show="wangFlag">
      <PrintOne :print="print" ref="menuItem" ></PrintOne>
    </div>
    <!-- <div>4444</div> -->
  </div>
</template>
<script >
import { LoadingUtil } from "@/utils/common/LoadingUtil";
import { updateAlterationStatus } from "@/api/cost/designAlteration";
import { getMeProfile } from "@/api/sys/userAPI";
import CostFileUpload from "@/components/cost/UploadFile/";
// import Print from "@/components/cost/print/";
import PrintOne from "@/components/cost/PrintOne/";
import DesignAlterationAttachmentTable from "@/views/cost/designAlteration/DesignAlterationAttachmentTable";
import {
  getDesignAlterationInstructionDetail,
  getDesignAlterationDetail
} from "@/api/cost/designAlteration";
export default {
  components: {
    CostFileUpload,
    PrintOne,
    DesignAlterationAttachmentTable
  },
  data() {
    return {
      wangFlag:false,
      isShowInval: true,
      gotoCompletionFlag: true,
      gotoCostFlag: true,
      isShowDistrui: true,
      isShowBackUpload: false,
      isShowBackUploadButton: false,
      isShowAttachments: false,
      isInvalid: true,
      isShowValidReason: true,
      isShowBack: true,
      showDeleteButton: true,
      fileList: "",
      limit: 4,
      size: 4,
      outerId: "",
      active: 2,
      designAlterationModel: {
        id: "",
        code: "",
        alterationVisaCode: "",
        alterationVisaId: "",
        contractCode: "",
        contractName: "",
        projectId: "",
        projectName: "",
        accountabilityUnit: "",
        distributeOperator: "",
        distributeDate: "",
        isReprocess: "",
        variationContent: "",
        invalidReason: "",
        constructionUnit: "",
        backUploadDate: "",
        approveStatus: "3",
        attachments: []
      },
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
      dalData: {},
      print:{
        // 合同名称
        contractName:'',
        // 施工单位
        constructionUnit:'',
        // 原因
        alterationContent:'',
        // 内容
        variationContent:'',
        // 审批单编号
        code:''
      }
    };
  },
  mounted: function() {
    this.init();
  },
  methods: {
    init() {
      debugger;
      getDesignAlterationInstructionDetail({
        id: this.$route.query.id,
        processNode: "2"
      }).then(response => {
        console.log('369852147')
        console.log(response)
        // debugger;
        this.print.contractName = response.data.contractName;
        this.print.constructionUnit = response.data.constructionUnit;
        this.print.alterationContent = response.data.alterationContent;
        this.print.variationContent = response.data.variationContent;
        this.print.code = response.data.code;
        this.designAlterationModel.id = response.data.id;
        this.designAlterationModel.code = response.data.code;
        this.designAlterationModel.alterationVisaCode =
          response.data.alterationVisaCode;
        this.designAlterationModel.projectId = response.data.projectId;
        this.designAlterationModel.projectName = response.data.projectName;
        this.designAlterationModel.accountabilityUnit =
          response.data.accountabilityUnit;
        this.designAlterationModel.contractCode = response.data.contractCode;
        this.designAlterationModel.contractName = response.data.contractName;
        this.designAlterationModel.isReprocess = response.data.isReprocess;
        this.designAlterationModel.variationContent =
          response.data.variationContent;
        this.designAlterationModel.invalidReason = response.data.invalidReason;
        this.designAlterationModel.constructionUnit =
          response.data.constructionUnit;
        this.designAlterationModel.alterationVisaId =
          response.data.alterationVisaId;
        this.outerId = response.data.id + "_2";

        if (response.data.approveStatus === "1") {
          this.isInvalid = false;
        }
        if (response.data.processNode === "2") {
          this.gotoCompletionFlag = false;
          this.gotoCostFlag = false;
        }
        if (response.data.processNode === "3") {
          this.gotoCostFlag = false;
        }
        if (this.$route.query.isView) {
          debugger;
          // 查看 禁用下发 回传 作废按钮
          this.isShowBackUploadButton = false;
          this.isShowInval = false;
          this.isShowDistrui = false;
          this.designAlterationModel.distributeDate =
            response.data.distributeDate;
          this.designAlterationModel.distributeOperator =
            response.data.distributeOperator;
          // 查看 已回传状态
          if (response.data.approveStatus === "3") {
            // 已回传 显示附件列表
            this.isShowAttachments = true;
            this.isShowBackUpload = true;
            this.designAlterationModel.backUploadDate =
              response.data.backUploadDate;
            this.showDeleteButton = false;
            this.designAlterationModel.attachments = response.data.attachments;
          }
        } else {
          this.setOperatorAndDate();
          if (response.data.approveStatus === "2") {
            this.isShowBackUpload = true;
            this.isShowInval = false;
            this.isShowDistrui = false;
            this.isShowAttachments = true;
            this.isShowBackUploadButton = true;
            this.designAlterationModel.backUploadDate = new Date();
            this.isShowValidReason = false;
          }
        }
        this.setActiveStep(response);
        this.getDalDetail();
      });
    },
    getDalDetail() {
      getDesignAlterationDetail({
        id: this.designAlterationModel.alterationVisaId
      })
        .then(response => {
          console.log('147852369')
          console.log(response)
          // debugger;
          this.dalData = response.data;
        })
        .catch(error => {
          console.log(error);
        });
    },
    setActiveStep(response) {
      if (response.data.processNode === "4") {
        this.active = 4;
      }
      if (response.data.processNode === "3") {
        this.active = 3;
      }
    },
    setOperatorAndDate() {
      this.designAlterationModel.distributeOperator = this.$getUserInfo()[
        "nickName"
      ];
      this.designAlterationModel.distributeDate = new Date();
    },
    gotoDesign() {
      debugger;
      let redirectPath = {};
      redirectPath.query = {
        id: this.designAlterationModel.alterationVisaId,
        isEdit: false
      };
      redirectPath.name = "NewOrUpdateDesignAlteration";
      this.$router.push(redirectPath);
    },
    gotoCompletion() {
      debugger;
      let redirectPath = {};
      redirectPath.query = { id: this.designAlterationModel.id, isView: true };
      redirectPath.name = "InstructionCompletionConfirm";
      this.$router.push(redirectPath);
    },
    gotoCost() {
      let redirectPath = {};
      redirectPath.query = { id: this.designAlterationModel.id, isView: true };
      redirectPath.name = "InstructionCostConfirm";
      this.$router.push(redirectPath);
    },
    backUpload() {
      // if (this.designAlterationModel.attachments.length === 0) {
      //   this.$showError('msg_cost_dalattachment_error')
      //   return
      // }
      this.$confirm("确认回传", {
        confirmButtonText: this.$l("btn_confirm"),
        cancelButtonText: this.$l("btn_cancel"),
        type: "warning"
      })
        .then(() => {
          this.designAlterationModel.backUploadDate = new Date();
          this.designAlterationModel.distributeDate = new Date();
          updateAlterationStatus(this.designAlterationModel)
            .then(response => {
              if (response.code === "2000") {
                this.$router.push({
                  name: "DesignAlterationList",
                  query: { isShowInstruct: true }
                });
                this.$showSuccess(response.message);
              } else {
                this.$showError(response.message);
              }
            })
            .catch(error => {
              console.log(error);
              this.$showError(
                error.message ? error.message : "msg_system_error"
              );
            });
        })
        .catch(() => {});
    },
    changeAttachments(data) {
      debugger;
      this.designAlterationModel.attachments = data;
    },
    handleBack() {
      this.$router.push({
        name: "DesignAlterationList",
        query: { isShowInstruct: true }
      });
    },
    invalidInstruction() {
      this.$confirm("确认作废并提交审核", {
        confirmButtonText: this.$l("btn_confirm"),
        cancelButtonText: this.$l("btn_cancel"),
        type: "warning"
      })
        .then(() => {
          LoadingUtil.showLoading();
          this.designAlterationModel.approveStatus = "4";
          updateAlterationStatus(this.designAlterationModel)
            .then(response => {
              LoadingUtil.hideLoading();
              if (response.code === "2000") {
                this.$router.push({
                  name: "DesignAlterationList",
                  query: { isShowInstruct: true }
                });
                this.$showSuccess(response.message);
                this.isShowInval = false;
                this.isShowDistrui = false;
              } else {
                this.$showError(response.message);
              }
            })
            .catch(error => {
              console.log(error);
              this.$showError(
                error.message ? error.message : "msg_system_error"
              );
            });
        })
        .catch(() => {});
    },
    printWeb() {
      // this.wangFlag = true
      this.$print(this.$refs.menuItem)
    },
    distributeInstruction() {
      this.$confirm("确认下发", {
        confirmButtonText: this.$l("btn_confirm"),
        cancelButtonText: this.$l("btn_cancel"),
        type: "warning"
      })
        .then(() => {
          this.designAlterationModel.approveStatus = "2";
          updateAlterationStatus(this.designAlterationModel)
            .then(response => {
              if (response.code === "2000") {
                this.$router.push({
                  name: "DesignAlterationList",
                  query: { isShowInstruct: true }
                });
                this.$showSuccess(response.message);
              } else {
                this.$showError(response.message);
              }
            })
            .catch(error => {
              console.log(error);
              this.$showError(
                error.message ? error.message : "msg_system_error"
              );
            });
        })
        .catch(() => {});
    }
  }
};
</script>
<style scoped>
@media print {
  .noprint{
    display: none;
  }
}
</style>





