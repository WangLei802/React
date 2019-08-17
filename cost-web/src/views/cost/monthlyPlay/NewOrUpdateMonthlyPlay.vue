<template>
  <div class='app-container'>
    <div style="text-align:right; margin:10px 0;">
      <el-button size="mini" v-if="!$store.state.user.isFromBpm"
                 @click='handleBack'>{{$l('btn_back')}}
      </el-button>
      <el-button size="mini"
                 type='primary' v-if="$checkPersmissionByCode('cost:paymentMonthYearPlan:create')"
                 :disabled="buttonDisable"
                 v-show="isShowAdd"
                 @click='saveConstruction'>{{$l('btn_save')}}
      </el-button>
      <el-button size="mini"
                 type='primary' v-if="$checkPersmissionByCode('cost:paymentMonthYearPlan:create')"
                 @click='submitConstructionCost'
                 v-show="isShowSubmit"
                 :disabled="buttonDisableSub">
        {{$l('lbl_cost_compilation_submit')}}
      </el-button>
    </div>
    <div class="form-unit">基本信息</div>
    <el-form label-width='150px'
             status-icon
             :model="ConstructionModel"
             ref="ConstructionModel"
             :rules="rules"
             size="mini"
             :disabled="formDisable">
      <el-row>
        <el-col :span="8">
          <!-- 单据编号 -->
          <el-form-item :label="'单据编号：'"
                        prop="receiptsNo">
            <el-input v-model="ConstructionModel.receiptsNo"
                      :disabled="true"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <!-- 单据名称 -->
          <el-form-item :label="'单据名称：'"
                        prop="receiptsName">
            <el-input v-model="ConstructionModel.receiptsName"
                      :disabled="inputDisable"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <!-- 类型 -->
          <el-form-item :label="'类型：'"
                        prop="planType">
            <el-select v-model="ConstructionModel.planType"
                       filterable
                       clearable
                       placeholder="请选择"
                       :disabled="inputDisable">
              <el-option v-for="item in options"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <ProjectAccountSelect v-model="ConstructionModelTest"
                              :span="{ project: 8}"
                              :show="show"
                              :clearable="{ project: false, accObj: false }"
                              :labelWidth="{project: 150}"
                              :disabled="{ project:!ConstructionModel.planType }">
        </ProjectAccountSelect>
        <!-- 经办人 -->
        <el-col :span="8">
          <el-form-item :label="'经办人：'"
                        prop="operator">
            <el-input v-model="ConstructionModel.operator"
                      :disabled="true"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <!-- 提交日期 -->
          <el-form-item :label="'提交日期：'"
                        prop="operateDate">
            <!--<el-input v-model="ConstructionModel.operateDate"-->
                      <!--:disabled="true"></el-input>-->
            <el-date-picker v-model='ConstructionModel.operateDate'
                            :disabled="true"
                            type="date">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <!-- 审批状态 -->
          <el-form-item :label="'审批状态：'"
                        prop="statusCh">
            <!-- <el-input v-model="ConstructionModel.statusCh"
                      :disabled="true"></el-input> -->
          <!-- 王先森结算计划审批 change-->
          <fd-label
              :code="ConstructionModel.status"
              :class="{col:flag}"
              :url= "bpmUrl"
              type="cost_flow_status"
              :disabled="true"
            ></fd-label>
          <!-- <div>{{ConstructionModel.statusCh}}</div> -->
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <!-- 审批日期 -->
          <el-form-item :label="'审批日期：'"
                        prop="approveDate">
            <!--<el-input v-model="ConstructionModel.approveDate"-->
                      <!--:disabled="true"></el-input>-->
            <el-date-picker v-model='ConstructionModel.approveDate'
                            :disabled="true"
                            type="date">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>

      <div class="form-unit">计划内容</div>
      <el-input type="textarea"
                :autosize="{ minRows: 4, maxRows: 6}"
                placeholder="计划内容"
                v-model="ConstructionModel.planContent"
                :disabled="inputDisable">
      </el-input>

      <div class="form-unit">备注</div>

      <el-input type="textarea"
                :autosize="{ minRows: 4, maxRows: 6}"
                placeholder="备注"
                v-model="ConstructionModel.remark"
                :disabled="inputDisable">
      </el-input>

      <div class="" style="width:100%;float:left;margin-bottom:20px;">
        <div class="subTitle" >
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
      <span class="breadcrumb-child"
            style="float: left;margin-top: 10px">
                <i></i>上传附件:
            </span>
      <span style="float: left">
                <CostFileUpload style="margin-bottom: 20px"
                                v-model="fileList"
                                :limit="limit"
                                :attachmentData="attachmentData"
                                :outerId="outerId">
                </CostFileUpload>
            </span>
    </el-form>
    <DesignAlterationAttachmentTable :queryObj_passed_in='queryModel'
                                      :showDeleteButton = "showDeleteButton"
                                      :attaData='attachmentData'
                                      v-on:changeAttachments="changeAttachments"
                                      ref='DesignAlterationAttachmentTable'>
    </DesignAlterationAttachmentTable>
  </div>
</template>
<script>
import uuidv1 from "uuid/v1";
import DesignAlterationAttachmentTable from "@/views/cost/designAlteration/DesignAlterationAttachmentTable";
import CostFileUpload from "@/components/cost/UploadFile/";
import {
  saveOrUpdateMonthlyPlay,
  getCode,
  detailMonthlyPlay
} from "@/api/cost/monthlyPlayAPI";
import { getAttachment } from "@/api/cost/attachment";
import { getMeProfile } from "@/api/sys/userAPI";
import ProjectAccountSelect from "@/components/cost/ProjectAccountSelect/";
import { getApprove } from "@/api/cost/approve";
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
          createdDate: ""
        };
      }
    },
    handleType: ""
  },
  components: {
    ProjectAccountSelect,
    CostFileUpload,
    DesignAlterationAttachmentTable,
    FlowAdd
  },
  data() {
    return {
      show: {
        project: true,
        accObj: false
      },
      radio: "",
      options: [
        {
          value: "0",
          label: "月度结算计划"
        },
        {
          value: "1",
          label: "年度结算计划"
        }
      ],
      value: "",
      rules: {
        receiptsName: [
          { message: "请填写单据编号", required: true, trigger: "change" }
        ],
        projectId: [
          { message: "请输入项目名称", required: true, trigger: "change" }
        ],
        planType: [{ message: "请选择类型", required: true, trigger: "change" }]
      },
      tableData: [],
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
      ConstructionModelTest: {
        projectId: "",
        projectName: "",
        projectCode: ""
      },
      ConstructionModel: {
        id: "",
        receiptsNo: "",
        receiptsName: "",
        projectId: "",
        projectName: "",
        projectCode: "",
        planType: "",
        planContent: "",
        remark: "",
        status: "0",
        operator: "",
        operateDate: "",
        statusCh: "草稿",
        approveDate: "",
        costRelateFlowList: [] // 关联流程
      },
      flag:false,
      bpmUrl:'',
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
      visaInfo: []
    };
  },
  mounted: function() {
    this.init();
  },
  methods: {
    init() {
      if (this.$route.query.isAdd) {
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

        detailMonthlyPlay({ id: this.$route.query.id })
          .then(response => {
            debugger;
            console.log('1111')
            console.log(response)
            this.ConstructionModel.receiptsNo = response.data.receiptsNo;
            this.ConstructionModel.receiptsName = response.data.receiptsName;
            this.ConstructionModel.planType = response.data.planType;
            this.ConstructionModel.projectId = response.data.projectId;
            this.ConstructionModel.projectName = response.data.projectName;
            this.ConstructionModel.projectCode = response.data.projectCode;
            this.ConstructionModelTest.projectCode = response.data.projectCode;
            this.ConstructionModelTest.projectName = response.data.projectName;
            this.ConstructionModelTest.projectId = response.data.projectId;
            this.ConstructionModel.planContent = response.data.planContent;
            this.ConstructionModel.remark = response.data.remark;
            this.ConstructionModel.status = response.data.status;
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

      // this.ConstructionModel.projectId = this.$route.query.projectId
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
    flow(data) {
      this.ConstructionModel.costRelateFlowList = data;
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },

    addRowToTable(row) {
      this.tableData.push(this.getDefaultRow(row));
    },
    deleteDetail() {
      // console.log(this.tableData)
      let newTableData = this.tableData.filter(function(item) {
        return item.checked !== true;
      });
      this.tableData = newTableData;
    },
    getROwIndex(row) {
      const _index = this.tableData.lastIndexOf(row);
      return _index;
    },
    getDefaultRow(row) {
      return {
        id: "",
        materialName: "",
        spec: "",
        price: "",
        factory: "",
        remark: "",
        number: "",
        type: "",
        amount: "",
        responsibleDeptCode: "",
        content: "",
        message: "",
        shareCount: "",
        index: uuidv1()
      };
    },

    handleBack() {
      this.$router.push({
        name: "MonthlyPlayList"
      });
    },
    submitConstructionCost() {
      this.buttonDisableSub = true;
      this.$refs["ConstructionModel"].validate(valid => {
        if (valid) {
          this.ConstructionModel.projectCode = this.ConstructionModelTest.projectCode;
          this.ConstructionModel.projectId = this.ConstructionModelTest.projectId;
          this.ConstructionModel.projectName = this.ConstructionModelTest.projectName;
          this.ConstructionModel.attachments = this.attachmentData;
          this.ConstructionModel.status = "1";
          this.ConstructionModel.operateDate = new Date().format();
          // this.ConstructionModel.status = this.ConstructionModelTest.status;
          saveOrUpdateMonthlyPlay(this.ConstructionModel)
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
      // this.$router.push({
      //   name: 'OrgManager'
      // })
    },
    saveConstruction() {
      this.$refs["ConstructionModel"].validate(valid => {
        if (valid) {
          this.ConstructionModel.contractId = this.contractInfo.id;
          this.ConstructionModel.projectId = this.ConstructionModelTest.projectId;
          this.ConstructionModel.projectName = this.ConstructionModelTest.projectName;
          this.ConstructionModel.projectCode = this.ConstructionModelTest.projectCode;
          this.ConstructionModel.attachments = this.attachmentData;
          this.ConstructionModel.status = "0";
          saveOrUpdateMonthlyPlay(this.ConstructionModel)
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
    generateCode() {
      this.ConstructionModel.projectId = this.ConstructionModelTest.projectId;
      getCode(this.ConstructionModel)
        .then(response => {
          this.ConstructionModel.receiptsNo = response.data;
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
      this.ConstructionModel.attachments = data;
      this.attachmentData = data;
    }
  },
  watch: {
    ConstructionModelTest: function(newValue, oldValue) {
      this.generateCode();
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
