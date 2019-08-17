<template>
  <div class="app-container">
    <!-- <i class="fa fa-folder-open-o"></i>基本信息 -->
    <div style="text-align:right; margin:10px 0;">
      <el-button
        size="mini"
        v-if="!$store.state.user.isFromBpm"
        @click="handleBack"
      >{{$l('btn_back')}}</el-button>
      <el-button
        size="mini"
        type="primary"
        v-if="$checkPersmissionByCode('cost:confirmThrow:create')"
        :disabled="buttonDisable"
        v-show="isShowAdd"
        @click="saveConstruction"
      >{{$l('btn_save')}}</el-button>
      <el-button
        size="mini"
        type="primary"
        v-if="$checkPersmissionByCode('cost:confirmThrow:create')"
        @click="submitConstructionCost"
        v-show="isShowSubmit"
        :disabled="buttonDisableSub"
      >{{$l('lbl_cost_compilation_submit')}}</el-button>
    </div>
    <div class="form-unit">基本信息</div>
    <el-form
      label-width="150px"
      status-icon
      size="mini"
      :model="ConstructionModel"
      ref="ConstructionModel"
      :rules="rules"
      :disabled="formDisable"
    >
      <el-row>
        <el-col :span="8">
          <!-- 单据编号 -->
          <el-form-item :label="'单据编号：'">
            <el-input v-model="ConstructionModel.receiptsNo" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
        <ProjectAccountSelect
          v-model="accountObject"
          :show="show"
          :span="{project: 8,accObj: 8}"
          :labelWidth="{project: 150,accObj: 150}"
          :disabled="{project: false,accObj: false}"
          @change="projectAccountSelectChange"
        />
        <el-col :span="8">
          <!-- 跟投分配次数 -->
          <el-form-item :label="'跟投分配次数：'" prop="throwTimes">
            <fd-select
              v-model="ConstructionModel.throwTimes"
              style="width: 200px;"
              type="assign_times"
              :disabled="inputDisable"
            ></fd-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <!-- 经办人 -->
            <el-form-item :label="'经办人：'">
              <el-input v-model="ConstructionModel.operator" :disabled="true"></el-input>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="8">
          <!-- 提交日期： -->
          <el-form-item :label="'提交日期：'" prop="operateDate">
            <!--<el-input v-model='ConstructionModel.operateDate'-->
            <!--:disabled="true"></el-input>-->
            <el-date-picker v-model="ConstructionModel.operateDate" :disabled="true" type="date"></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <!-- 审批状态 -->
        <el-col :span="8">
          <!-- 审批状态： -->
          <el-form-item :label="'审批状态：'" prop="statusCh">
            <!-- <el-input v-model='ConstructionModel.statusCh'
            :disabled="true"></el-input>-->
            <fd-label
              :code="ConstructionModel.status"
              :class="{col:flag}"
              :url="bpmUrl"
              type="cost_flow_status"
              :disabled="true"
            ></fd-label>
            <!-- <div>{{ConstructionModel.statusCh}}</div> -->
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <!-- 审批日期： -->
          <el-form-item :label="'审批日期：'" prop="approveDate">
            <!--<el-input v-model='ConstructionModel.approveDate'-->
            <!--:disabled="true"></el-input>-->
            <el-date-picker v-model="ConstructionModel.approveDate" :disabled="true" type="date"></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>

      <el-table :data="throwDetailData" style="width: 100%" size="small">
        <!-- 序号:height="tHeight" -->
        <el-table-column type="index" label="序号" width="50"></el-table-column>
        <el-table-column prop="subjectName" label="成本项目" width="100"></el-table-column>

        <el-table-column label="预备会目标成本">
          <el-table-column prop="totalPrepare" label="总额（A）（万元）">
            <template>
              <template slot-scope="scope">{{scope.row.totalPrepare | NumFormat}}</template>
            </template>
          </el-table-column>
          <el-table-column prop="buildingAreaPrepare" label="建筑面积（㎡）" width="100">
            <template slot-scope="scope">{{scope.row.buildingAreaPrepare | NumFormat}}</template>
          </el-table-column>
          <el-table-column prop="singlePrepare" label="建安单方（元/㎡）" width="100">
            <template slot-scope="scope">{{scope.row.singlePrepare | NumFormat}}</template>
          </el-table-column>
          <el-table-column prop="salesAreaPrepare" label="可售面积（㎡）" width="100">
            <template slot-scope="scope">{{scope.row.salesAreaPrepare | NumFormat}}</template>
          </el-table-column>
          <el-table-column prop="salesSinglePrepare" label="可售单方（元/㎡）" width="100">
            <template slot-scope="scope">{{scope.row.salesSinglePrepare | NumFormat}}</template>
          </el-table-column>
        </el-table-column>

        <el-table-column label="跟投分配当月动态成本">
          <el-table-column prop="totalThrow" label="总额（B）（万元）" width="100">
            <template slot-scope="scope">{{scope.row.totalThrow | NumFormat}}</template>
          </el-table-column>
          <el-table-column prop="singleThrow" label="建安单方（元/㎡）" width="100">
            <template slot-scope="scope">{{scope.row.singleThrow | NumFormat}}</template>
          </el-table-column>
          <el-table-column prop="salesThrow" label="可售单方（元/㎡）" width="100">
            <template slot-scope="scope">{{scope.row.salesThrow | NumFormat}}</template>
          </el-table-column>
        </el-table-column>

        <el-table-column prop="spread" label="成本差额（万元）（A）-（B）">
          <template slot-scope="scope">{{scope.row.spread | NumFormat}}</template>
        </el-table-column>
      </el-table>

      <!--<el-row :gutter="12">-->
      <!--<el-col :span="10">-->
      <div class="grid-content bg-purple" style="margin-top:20px;width:100%;float:left;">
        <!-- 备注 -->
        <el-form-item :label="'备注：'">
          <el-input
            style="width: 100%"
            type="textarea"
            :autosize="{ minRows: 4, maxRows: 6}"
            placeholder="请输入内容"
            v-model="ConstructionModel.remark"
            :disabled="inputDisable"
          ></el-input>
        </el-form-item>
      </div>
      <!--</el-col>-->
      <!--</el-row>-->

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
  getReceiptsNoData,
  getThrowDetail,
  saveOrUpdateKeepCostConfirm,
  getKeepCostConfirmDetail
} from "@/api/cost/keepCostConfirm";
import { getMeProfile } from "@/api/sys/userAPI";
import ProjectAccountSelect from "@/components/cost/ProjectAccountSelect/";
import DesignAlterationAttachmentTable from "@/views/cost/designAlteration/DesignAlterationAttachmentTable";
import CostFileUpload from "@/components/cost/UploadFile/";
import { getAttachment } from "@/api/cost/attachment";
import { getApprove } from "@/api/cost/approve";
import {
  NumFormat // 千位符
} from "@/filters/cost/";
import FlowAdd from "@/components/cost/FlowAdd/";

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
    ProjectAccountSelect,
    DesignAlterationAttachmentTable,
    CostFileUpload,
    FlowAdd
  },
  filters: {
    NumFormat
  },
  data() {
    var validateAccountName = (rule, value, callback) => {
      value = this.accountObject.accObjId;
      if (value === "") {
        callback(new Error("请选择项目名称"));
      } else {
        callback();
      }
    };
    return {
      value: "",
      rules: {
        throwTimes: [
          { required: true, message: "请选择跟投次数", trigger: "change" }
        ],
        accObjId: [
          { required: true, validator: validateAccountName, trigger: "change" }
        ]
      },
      accountObject: {
        accObjId: ""
      },
      show: {
        project: false,
        accObj: true
      },
      tableData: [],
      isEdit: false,
      isShowSpan: false,
      isShowAdd: true,
      isShowSubmit: true,
      isShowBack: false,
      buttonDisable: false,
      buttonDisableSub: false,
      selectTable: [],
      isShowContract: false,
      inputDisable: false,
      formDisable: false,
      showDeleteButton: true,
      throwDetailData: [],
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
      ConstructionModel: {
        id: "",
        accountingObjectId: "",
        receiptsNo: "",
        receiptsName: "",
        throwTimes: "",
        operator: JSON.parse(JSON.parse(localStorage.getItem("USER_INFO")).val)
          .username,
        operateDate: "",
        remark: "",
        status: "0",
        createdBy: JSON.parse(JSON.parse(localStorage.getItem("USER_INFO")).val)
          .username,
        companyId: "",
        operatorDept: "",
        statusCh: "草稿",
        approveDate: "",
        costRelateFlowList: [] // 关联流程
      },
      flag:false,
      bpmUrl:''
    };
  },
  mounted: function() {
    this.init();
  },
  methods: {
    // 项目/成本分期选择事件
    projectAccountSelectChange(selectItem) {
      debugger;

      //"6729,6795,6658,6759,7e473459-92a4-482a-9150-14f95e53de6d"
      //根，集团，公司，事业部，项目
      this.ConstructionModel.companyId = null;
      if (selectItem.parentIds) {
        let pathArray = selectItem.parentIds.split(",");
        if (pathArray.length === 5) {
          this.ConstructionModel.companyId = pathArray[3]; //取事业部ID为公司id
        }
      }
    },
    init() {
      if (this.$route.query.isAdd) {
        localStorage.setItem("subId", "");
        this.buttonDisableSub = true;
        // 新增
        this.tableData = [];
        this.ConstructionModel.operator = this.$getUserInfo()["nickName"];
        this.ConstructionModel.operateDate = new Date();
      } else {
        this.buttonDisableSub = false;
        this.tableData = [];
        localStorage.setItem("subId", this.$route.query.id);
        this.ConstructionModel.id = this.$route.query.id;
        this.getThrow();

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
      }
      this.isEdit = this.$route.query.isEdit.toString() === "true";
      if (!this.isEdit) {
        this.isShowSpan = true;
        this.buttonDisable = true;
        this.isShowAdd = false;
        this.isShowSubmit = false;
        this.showDeleteButton = false;
        this.isShowBack = true;
        this.inputDisable = true;
        this.formDisable = true;
      }
    },
    handleBack() {
      this.$router.push({
        name: "KeepCostConfirmList"
      });
    },
    getThrow() {
      getKeepCostConfirmDetail(this.ConstructionModel)
        .then(response => {
          this.throwDetailData = response.data.listConfirmThrow;
          let totalData = {
            subjectName: "合计",
            totalPrepare: response.data.totalPrepareCount,
            buildingAreaPrepare: response.data.buildingAreaPrepareCount,
            singlePrepare: response.data.singlePrepareCount,
            salesAreaPrepare: response.data.salesAreaPrepareCount,
            salesSinglePrepare: response.data.salesSinglePreparezCount,
            totalThrow: response.data.totalThrowCount,
            singleThrow: response.data.singleThrowCount,
            salesThrow: response.data.salesThrowCount,
            spread: response.data.spreadCount
          };

          if (
            totalData.totalPrepare != null &&
            totalData.buildingAreaPrepare != null &&
            totalData.singlePrepare !== null &&
            totalData.salesAreaPrepare != null &&
            totalData.salesSinglePrepare !== null &&
            totalData.totalThrow !== null &&
            totalData.singleThrow != null &&
            totalData.salesThrow != null &&
            totalData.spread != null
          ) {
            // this.throwDetailData.push(totalData)
          }

          this.ConstructionModel.receiptsNo = response.data.receiptsNo;
          this.ConstructionModel.receiptsName = response.data.receiptsName;
          this.ConstructionModel.accountingObjectId =
            response.data.accountingObjectId;
          this.accountObject.accObjId = response.data.accountingObjectId;
          this.ConstructionModel.accountingObjectName =
            response.data.accountingObjectName;
          this.ConstructionModel.projectId = response.data.projectId;
          this.accountObject.projectId = response.data.projectId;
          this.ConstructionModel.throwTimes = response.data.throwTimes;
          this.ConstructionModel.operator = response.data.operator;
          this.ConstructionModel.createdDate = response.data.createdDate;
          this.ConstructionModel.operateDate = new Date(
            response.data.operateDate
          ).format();
          this.ConstructionModel.remark = response.data.remark;
          this.ConstructionModel.status = response.data.status;
          this.ConstructionModel.companyId = response.data.companyId;
          this.ConstructionModel.operatorDept = response.data.operatorDept;
          this.ConstructionModel.status = response.data.status
          this.bpmUrl = response.data.bpmUrl
          if(this.bpmUrl != ""){
            this.flag = true
          }
          // if (this.ConstructionModel.status == "0") {
          //   this.ConstructionModel.statusCh = "草稿";
          // } else if (this.ConstructionModel.status == "1") {
          //   this.ConstructionModel.statusCh = "审批中";
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
    },
    flow(data) {
      this.ConstructionModel.costRelateFlowList = data;
    },
    getReceiptsNo() {
      getReceiptsNoData(this.ConstructionModel)
        .then(response => {
          this.ConstructionModel.receiptsNo = response.data;
        })
        .catch(error => {
          console.log(error);
          this.$showError(error.message ? error.message : "msg_system_error");
        });
    },
    getThrowList() {
      getThrowDetail(this.ConstructionModel)
        .then(response => {
          debugger;
          this.throwDetailData = response.data.listConfirmThrow;
          let totalData = {
            index: "",
            subjectName: "合计",
            totalPrepare: response.data.totalPrepareCount,
            buildingAreaPrepare: response.data.buildingAreaPrepareCount,
            singlePrepare: response.data.singlePrepareCount,
            salesAreaPrepare: response.data.salesAreaPrepareCount,
            salesSinglePrepare: response.data.salesSinglePrepareCount,
            totalThrow: response.data.totalThrowCount,
            singleThrow: response.data.singleThrowCount,
            salesThrow: response.data.salesThrowCount,
            spread: response.data.spreadCount
          };
          // && totalData.totalThrow !== null &&
          // totalData.singleThrow != null && totalData.salesThrow != null && totalData.spread != null
          if (
            totalData.totalPrepare != null &&
            totalData.buildingAreaPrepare != null &&
            totalData.singlePrepare !== null &&
            totalData.salesAreaPrepare != null &&
            totalData.salesSinglePrepare !== null
          ) {
            this.throwDetailData.push(totalData);
          }
        })
        .catch(error => {
          console.log(error);
          this.$showError(error.message ? error.message : "msg_system_error");
        });
    },
    submitConstructionCost() {
      this.buttonDisableSub = true;
      this.$refs["ConstructionModel"].validate(valid => {
        if (valid) {
          this.ConstructionModel.accountingObjectId = this.accountObject.accObjId;
          this.ConstructionModel.projectId = this.accountObject.projectId;
          this.ConstructionModel.status = "1";
          this.ConstructionModel.attachments = this.attachmentData;
          this.ConstructionModel.operateDate = new Date();
          saveOrUpdateKeepCostConfirm(this.ConstructionModel)
            .then(response => {
              // alert(1111)
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
          this.ConstructionModel.status = "0";
          debugger;
          this.ConstructionModel.accountingObjectId = this.accountObject.accObjId;
          this.ConstructionModel.projectId = this.accountObject.projectId;

          this.ConstructionModel.attachments = this.attachmentData;
          this.ConstructionModel.operateDate = new Date(
            this.ConstructionModel.operateDate
          );
          saveOrUpdateKeepCostConfirm(this.ConstructionModel)
            .then(response => {
              this.$showSuccess(response.message);
              localStorage.setItem("subId", response.data);
              this.ConstructionModel.id = response.data;
              this.isShowAdd = true;
              this.isShowBack = true;
              this.buttonDisableSub = false;
            })
            .catch(error => {
              // console.log(error)
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
      this.ConstructionModel.attachments = data;
      this.attachmentData = data;
    }
  },
  watch: {
    accountObject: function(newValue, oldValue) {
      this.accountObject.accObjId = newValue.accObjId;
      this.ConstructionModel.accountingObjectId = newValue.accObjId;
      this.getReceiptsNo();
      this.getThrowList();
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
.col{
color: blue;
text-decoration:underline ;
cursor: pointer;
}
</style>
