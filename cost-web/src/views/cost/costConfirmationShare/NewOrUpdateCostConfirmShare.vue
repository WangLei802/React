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
        v-if="$checkPersmissionByCode('cost:confirmShare:create')"
        :disabled="buttonDisable"
        v-show="isShowAdd"
        @click="saveConstruction"
      >{{$l('btn_save')}}</el-button>
      <el-button
        size="mini"
        type="primary"
        v-if="$checkPersmissionByCode('cost:confirmShare:create')"
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
      <el-row :gutter="12">
        <el-col :span="8">
          <!-- 单据编号 -->
          <el-form-item :label="'单据编号：'">
            <el-input v-model="ConstructionModel.receiptsNo" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
        <ProjectSelector
          v-model="accountObject"
          :show="show"
          :span="{'accObj':8}"
          :labelWidth="{'accObj':150}"
          @change="projectAccountSelectChange"
        ></ProjectSelector>
        <el-col :span="8">
          <!-- 成就共享分配次数 -->
          <el-form-item :label="'成就共享分配次数：'" prop="throwTimes">
            <fd-select
              v-model="ConstructionModel.throwTimes"
              @change="changeTip"
              type="assign_times"
              :disabled="inputDisable"
            ></fd-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="12">
        <el-col :span="8">
          <!-- 经办人 -->
          <el-form-item :label="'经办人：'">
            <el-input v-model="ConstructionModel.operator" :disabled="true"></el-input>
          </el-form-item>
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
      <el-row :gutter="12">
        <!-- 审批状态 -->
        <el-col :span="8">
          <!-- 审批状态： -->
          <el-form-item :label="'审批状态：'" prop="status">
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

      <p style="font-size:12px;" class="pl-10">
        成就共享申请节点：
        <span>{{tipInfo}}</span>
      </p>

      <el-table stripe border :data="listDetail" size="small">
        <!-- 序号 -->
        <el-table-column type="index" label="序号" width="150"></el-table-column>
        <el-table-column prop="subjectName" label="成本项目" width="200"></el-table-column>
        <el-table-column prop="targetMoney" label="投后版目标成本（万元）（A）" width="150">
          <template slot-scope="scope">{{scope.row.targetMoney | NumFormat}}</template>
        </el-table-column>
        <el-table-column prop="prepareMoney" label="预备会版目标成本（万元）（B）" width="150">
          <template slot-scope="scope">{{scope.row.prepareMoney | NumFormat}}</template>
        </el-table-column>
        <el-table-column prop="budgetMoney" label="预结版目标成本（万元）（C）" width="150">
          <template slot-scope="scope">{{scope.row.budgetMoney | NumFormat}}</template>
        </el-table-column>
        <el-table-column prop="shareMoney" label="成就共享申请当月动态成本金额（万元）（D）">
          <template slot-scope="scope">{{scope.row.shareMoney | NumFormat}}</template>
        </el-table-column>
        <el-table-column prop="spreadMoney" label="成本差额（万元）（D）-（B）">
          <template slot-scope="scope">{{scope.row.spreadMoney | NumFormat}}</template>
        </el-table-column>
      </el-table>

      <div class="subTitle">
        <div class="breadcrumb-child">
          <i class="fa fa-folder-open-o"></i>成就共享（成本类）应扣款金额（万元）
        </div>
      </div>

      <el-table stripe border :data="shareTotalData" size="small">
        <el-table-column
          type
          label
          stripe
          border
          tooltip-effect="dark"
          style="width: 100%"
          width="150"
          prop="dynamic"
        ></el-table-column>
        <el-table-column prop="dynamicMoney" label="动态成本扣款金额" width="150"></el-table-column>
        <el-table-column prop="invalidateMoney" label="无效成本扣款金额" width="200">
          <template slot-scope="scope">
            <el-input
              size="mini"
              style="width:150px"
              v-model="scope.row.invalidateMoney"
              v-on:input="inputFunc"
              :disabled="inputDisable"
              type="number"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="otherMoney" label="其他成本类扣罚款" width="200">
          <template slot-scope="scope">
            <el-input
              size="mini"
              style="width:150px"
              v-model="scope.row.otherMoney"
              v-on:input="inputFunc"
              :disabled="inputDisable"
              type="number"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="totalMoney" label="合计">
          <template slot-scope="scope">
            <el-input
              style="width:150px"
              size="mini"
              v-model="scope.row.totalMoney"
              :disabled="true"
            ></el-input>
          </template>
        </el-table-column>
      </el-table>

      <!--<el-row :gutter="12"-->
      <!--class="pl-10">-->
      <!--<el-col :span="10">-->
      <div class="grid-content bg-purple" style="margin-top:20px;">
        <!-- 备注 -->
        <el-form-item :label="'备注：'">
          <el-input
            style="width:100%"
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
import { ptn } from "@/utils/common/validate";
import {
  getReceiptsNo,
  getShareDetail,
  getCostConfirmDetailShare,
  saveOrUpdateCostConfirmShare
} from "@/api/cost/costConfirmShare";
import { getMeProfile } from "@/api/sys/userAPI";
import ProjectSelector from "@/components/cost/AccountSelectorTwo/";
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
    ProjectSelector,
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
      shareTotalData: [
        {
          dynamicMoney: "0",
          otherMoney: "",
          dynamic: "区域公司上报",
          invalidateMoney: "",
          totalMoney: ""
        }
      ],
      tipInfo: "",
      tipList: [
        { tipInfo: "首次开盘成功，并达到启动会预设主要指标条件；" },
        { tipInfo: "项目自有资金回笼，并预留三个月经营性支出余额；" },
        { tipInfo: "整盘销售回款及可售面积均达90%；" },
        { tipInfo: "交房后半年，回款100%，完成结算;" }
      ],
      show: {
        project: false,
        accObj: true
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
        throwTimes: [
          {
            required: true,
            message: "请选择成就共享分配次数",
            trigger: "change"
          }
        ],
        accountObjectName: [
          { required: true, validator: validateAccountName, trigger: "change" }
        ]
      },
      accountObject: {
        accObjId: ""
      },
      tableData: [],
      isEdit: false,
      isShowSpan: false,
      isShowAdd: true,
      isShowSubmit: true,
      isShowBack: false,
      buttonDisable: false,
      inputDisable: false,
      buttonDisableSub: false,
      formDisable: false,
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
      attachmentData: [],
      isShowContract: false,
      listDetail: [],
      ConstructionModel: {
        id: "",
        accountingObjectId: "",
        projectId: "",
        companyId: "",
        receiptsNo: "",
        receiptsName: "",
        throwTimes: "",
        operator: "",
        operateDate: "",
        remark: "",
        status: "0",
        createdBy: JSON.parse(JSON.parse(localStorage.getItem("USER_INFO")).val)
          .username,
        dynamicMoney: "",
        invalidateMoney: "",
        otherMoney: "",
        totalMoney: "",
        listDetail: [],
        statusCh: "草稿",
        approveDate: ""
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

      if (selectItem.parentId && selectItem.parentId.length == 4) {
        this.ConstructionModel.projectId = selectItem.id;
        localStorage.setItem("projectId", selectItem.id);
      } else {
        this.ConstructionModel.projectId = selectItem.parentId;
        localStorage.setItem("projectId", selectItem.parentId);
      }

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

    inputFunc() {
      this.shareTotalData[0].totalMoney =
        Number(this.shareTotalData[0].dynamicMoney) +
        Number(this.shareTotalData[0].invalidateMoney) +
        Number(this.shareTotalData[0].otherMoney);
    },
    changeTip(q) {
      this.ConstructionModel.throwTimes = q;
      if (this.ConstructionModel.throwTimes == "0") {
        this.tipInfo = "首次开盘成功，并达到启动会预设主要指标条件；";
      } else if (this.ConstructionModel.throwTimes == "1") {
        this.tipInfo = "项目自有资金回笼，并预留三个月经营性支出余额；";
      } else if (this.ConstructionModel.throwTimes == "2") {
        this.tipInfo = "整盘销售回款及可售面积均达90%；";
      } else if (this.ConstructionModel.throwTimes == "3") {
        this.tipInfo = "交房后半年，回款100%，完成结算;";
      }
    },
    init() {
      if (this.$route.query.isAdd) {
        this.buttonDisableSub = true;
        // 新增
        this.tableData = [];
        this.ConstructionModel.operator = this.$getUserInfo()["nickName"];
        this.ConstructionModel.operateDate = new Date().format();
      } else {
        this.buttonDisableSub = false;
        this.tableData = [];
        localStorage.setItem("subId", this.$route.query.id);
        this.ConstructionModel.id = this.$route.query.id;

        if (this.ConstructionModel.throwTimes == "0") {
          this.tipInfo = "首次开盘成功，并达到启动会预设主要指标条件；";
        } else if (this.ConstructionModel.throwTimes == "1") {
          this.tipInfo = "项目自有资金回笼，并预留三个月经营性支出余额；";
        } else if (this.ConstructionModel.throwTimes == "2") {
          this.tipInfo = "整盘销售回款及可售面积均达90%；";
        } else if (this.ConstructionModel.throwTimes == "3") {
          this.tipInfo = "交房后半年，回款100%，完成结算;";
        }
        this.getToShare();
        this.inputFunc();
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
      // this.ConstructionModel.id = this.$route.query.id
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
    flow(data) {
      this.ConstructionModel.costRelateFlowList = data;
    },
    handleBack() {
      this.$router.push({
        name: "CostConfirmListShare"
      });
    },
    getReceipts() {
      getReceiptsNo(this.ConstructionModel)
        .then(response => {
          this.ConstructionModel.receiptsNo = response.data;
        })
        .catch(error => {
          console.log(error);
          this.$showError(error.message ? error.message : "msg_system_error");
        });
    },
    getToShare() {
      getCostConfirmDetailShare(this.ConstructionModel)
        .then(response => {
          this.listDetail = response.data.listDetail;
          let totalData = {
            subjectName: "合计",
            targetMoney: response.data.targetMoneyCount,
            prepareMoney: response.data.prepareMoneyCount,
            budgetMoney: response.data.budgetMoneyCount,
            shareMoney: response.data.shareMoneyCount,
            spreadMoney: response.data.spreadMoneyCount
          };
          if (
            response.data.spreadMoneyCount == null ||
            response.data.spreadMoneyCount < 0
          ) {
            this.shareTotalData.dynamicMoney = 0;
          } else {
            this.shareTotalData.dynamicMoney = response.data.spreadMoneyCount;
          }
          if (
            totalData.targetMoney != null ||
            totalData.prepareMoney != null ||
            totalData.budgetMoney != null ||
            totalData.shareMoney != null ||
            totalData.spreadMoney != null
          ) {
            this.listDetail.push(totalData);
          } else {
            // this.throwDetailData.push(totalData);
          }

          this.ConstructionModel.receiptsNo = response.data.receiptsNo;
          this.ConstructionModel.receiptsName = response.data.receiptsName;
          this.accountObject.accObjId = response.data.accountingObjectId;
          this.ConstructionModel.accountingObjectId =
            response.data.accountingObjectId;
          this.ConstructionModel.accountingObjectName =
            response.data.accountingObjectName;
          this.ConstructionModel.projectId = response.data.projectId;
          this.ConstructionModel.operator = response.data.operator;
          this.ConstructionModel.createdDate = new Date(
            response.data.createdDate
          ).format();
          this.ConstructionModel.operateDate = new Date(
            response.data.operateDate
          ).format();
          this.ConstructionModel.remark = response.data.remark;
          this.ConstructionModel.status = response.data.status;
          this.ConstructionModel.throwTimes = response.data.throwTimes;
          this.ConstructionModel.otherMoney = response.data.otherMoney;
          this.ConstructionModel.status = response.data.status
          this.bpmUrl =response.data.bpmUrl
          if(this.bpmUrl != ""){
            this.flag = true
          }
          this.shareTotalData[0].otherMoney = response.data.otherMoney;
          this.shareTotalData[0].invalidateMoney =
            response.data.invalidateMoney;
          this.ConstructionModel.invalidateMoney =
            response.data.invalidateMoney;

          this.shareTotalData[0].totalMoney = response.data.totalMoney;

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
    },
    getShare() {
      getShareDetail(this.ConstructionModel)
        .then(response => {
          this.listDetail = response.data.listDetail;
          let totalData = {
            subjectName: "合计",
            targetMoney: response.data.targetMoneyCount,
            prepareMoney: response.data.prepareMoneyCount,
            budgetMoney: response.data.budgetMoneyCount,
            shareMoney: response.data.shareMoneyCount,
            spreadMoney: response.data.spreadMoneyCount
          };
          if (
            response.data.spreadMoneyCount == null ||
            response.data.spreadMoneyCount < 0
          ) {
            this.shareTotalData.dynamicMoney = 0;
          } else {
            this.shareTotalData.dynamicMoney = response.data.spreadMoneyCount;
          }
          if (
            totalData.targetMoney != null ||
            totalData.prepareMoney != null ||
            totalData.budgetMoney != null ||
            totalData.shareMoney != null ||
            totalData.spreadMoney != null
          ) {
            this.listDetail.push(totalData);
          } else {
            // this.throwDetailData.push(totalData);
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
          this.ConstructionModel.dynamicMoney = this.shareTotalData[0].dynamicMoney;
          this.ConstructionModel.invalidateMoney = this.shareTotalData[0].invalidateMoney;
          this.ConstructionModel.otherMoney = this.shareTotalData[0].otherMoney;
          this.ConstructionModel.totalMoney = this.shareTotalData[0].totalMoney;
          this.ConstructionModel.listDetail = this.listDetail;
          this.ConstructionModel.attachments = this.attachmentData;
          this.ConstructionModel.status = "1";
          this.ConstructionModel.operateDate = new Date().format();
          saveOrUpdateCostConfirmShare(this.ConstructionModel)
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
          this.ConstructionModel.dynamicMoney = this.shareTotalData[0].dynamicMoney;
          this.ConstructionModel.invalidateMoney = this.shareTotalData[0].invalidateMoney;
          this.ConstructionModel.otherMoney = this.shareTotalData[0].otherMoney;
          this.ConstructionModel.totalMoney = this.shareTotalData[0].totalMoney;
          this.ConstructionModel.listDetail = this.listDetail;
          this.ConstructionModel.attachments = this.attachmentData;
          this.ConstructionModel.operateDate = new Date(
            this.ConstructionModel.operateDate
          ).format();
          this.ConstructionModel.status = "0";
          saveOrUpdateCostConfirmShare(this.ConstructionModel)
            .then(response => {
              this.$showSuccess(response.message);
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
      this.ConstructionModel.accountingObjectId = this.accountObject.accObjId;
      this.getReceipts();
      this.getShare();
    }
  }
};
</script>

<style scoped>
/*@import '../../../styles/detail.scss';*/
</style>

<style>
.custom-00a597 .el-cascader-menu__item--extensible:after {
  content: "\E604";
}

.pl-10 {
  padding-left: 10px;
}
.col{
color: blue;
text-decoration:underline ;
cursor: pointer;
}
</style>
