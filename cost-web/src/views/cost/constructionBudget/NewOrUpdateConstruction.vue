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
        v-if="$checkPersmissionByCode('cost:budgetQualityPrice:createOrUpdate')"
        :disabled="buttonDisable"
        v-show="isShowAdd"
        @click="saveConstruction"
      >{{$l('btn_save')}}</el-button>
      <el-button
        size="mini"
        type="primary"
        v-if="$checkPersmissionByCode('cost:budgetQualityPrice:createOrUpdate')"
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
          <!-- 项目名称 -->
          <el-form-item :label="'项目名称：'">
            <el-input v-model="ConstructionModel.projectName" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="12">
        <el-col :span="8">
          <!-- 材料设备名称 -->
          <el-form-item :label="'材料设备名称：'" prop="materialName">
            <el-input v-model="ConstructionModel.materialName" :disabled="inputDisable"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <!-- 工程量 -->
          <el-form-item :label="'工程量：'" prop="quantities">
            <el-input v-model="ConstructionModel.quantities" :disabled="inputDisable"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <!-- 涉及工程总价 -->
          <el-form-item :label="'涉及工程总价(元)：'" prop="engineeringPrices">
            <el-input-number
              v-model="ConstructionModel.engineeringPrices"
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
          <!-- 提交日期： -->
          <el-form-item :label="'提交日期：'" prop="operateDate">
            <!--<el-input v-model='ConstructionModel.operateDate'-->
            <!--:disabled="true"></el-input>-->
            <el-date-picker v-model="ConstructionModel.operateDate" :disabled="true" type="date"></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="12">
        <el-col :span="8">
          <!-- 审批状态 -->
          <el-form-item :label="'审批状态：'" prop="statusCh">
            <!-- <fd-label v-model='ConstructionModel.statusCh'
            :disabled="true"></fd-label >-->
            <fd-label
              :code="ConstructionModel.status"
              :class="{col:flag}"
              :url= "bpmUrl"
              type="cost_flow_status"
              :disabled="true"
            ></fd-label>
            <!-- <fd-label :code="ConstructionModel.status" :class="{col:flag}"  type="cost_flow_status" :disabled='true'></fd-label> -->
            <!-- <div :class="{col:flag}" @click="jump">{{ConstructionModel.statusCh}}</div> -->
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

      <div class="form-unit">材料设备资料清单</div>

      <el-button
        size="mini"
        class="special-btn"
        type="primary"
        style="float: right;"
        @click="deleteDetail()"
        :disabled="buttonDisable"
      >{{$l('btn_delete')}}</el-button>

      <el-button
        size="mini"
        class="special-btn"
        type="primary"
        @click="addRowToTable(row)"
        :disabled="buttonDisable"
        style="float: right;margin-right: 20px;margin-bottom: 5px"
      >{{$l('btn_add')}}</el-button>

      <el-table
        :data="tableData"
        stripe
        @select="handleSelect"
        @select-all="handleSelectAll"
        @selection-change="handleSelectionChange"
        border
        tooltip-effect="dark"
        style="width: 100%"
        size="small"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <!-- 序号 -->
        <el-table-column type="index" prop="index" :label="this.$l('lbl_no')" width="80">
          <!-- <template slot-scope="scope">
    <el-input v-model="index"
          style="width: 100%;"
          v-show="isEdit"
          size="mini"></el-input>
          </template>-->
        </el-table-column>
        <!-- 材料设备名称 -->
        <el-table-column prop="materialName" :label="'材料设备名称'" width="200">
          <template slot-scope="scope">
            <span v-show="isShowSpan" style="width: 100%;">{{scope.row.materialName}}</span>
            <el-input
              v-model.trim="scope.row.materialName"
              style="width: 100%;"
              v-show="isEdit"
              size="mini"
            ></el-input>
          </template>
        </el-table-column>

        <!-- 规格型号 -->
        <el-table-column prop="spec" :label="'规格型号'" width="200">
          <template slot-scope="scope">
            <span v-show="isShowSpan" style="width: 100%;">{{scope.row.spec}}</span>
            <el-input
              size="mini"
              v-model.trim="scope.row.spec"
              style="width: 100%;"
              v-show="isEdit"
            ></el-input>
          </template>
        </el-table-column>

        <!-- 审核价格 -->
        <el-table-column prop="price" :label="'审核价格(元)'" width="200">
          <template slot-scope="scope">
            <span v-show="isShowSpan" style="width: 100%;">{{scope.row.price}}</span>
            <el-input
              size="mini"
              v-model.trim="scope.row.price"
              style="width: 100%;"
              v-show="isEdit"
              type="number"
            ></el-input>
          </template>
        </el-table-column>

        <!-- 品牌商家 -->
        <el-table-column prop="factory" :label="'品牌厂家'">
          <template slot-scope="scope">
            <span v-show="isShowSpan" style="width: 100%;">{{scope.row.factory}}</span>
            <el-input
              size="mini"
              v-model.trim="scope.row.factory"
              style="width: 100%;"
              v-show="isEdit"
            ></el-input>
          </template>
        </el-table-column>

        <!-- 备注 -->
        <el-table-column prop="remark" :label="'备注'">
          <template slot-scope="scope">
            <span v-show="isShowSpan" style="width: 100%;">{{scope.row.remark}}</span>
            <el-input
              size="mini"
              v-model.trim="scope.row.remark"
              style="width: 100%;"
              v-show="isEdit"
            ></el-input>
          </template>
        </el-table-column>
      </el-table>

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
import DesignAlterationAttachmentTable from "@/views/cost/designAlteration/DesignAlterationAttachmentTable";
import CostFileUpload from "@/components/cost/UploadFile/";
import { getAttachment } from "@/api/cost/attachment";
import {
  saveOrUpdateConstructionCost,
  detailConstructionCost
} from "@/api/cost/constructionCost";
import { getMeProfile } from "@/api/sys/userAPI";
import ContractSelector from "@/components/cost/ContractSelector/";
import { getApprove } from "@/api/cost/approve";

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
    ContractSelector,
    DesignAlterationAttachmentTable,
    CostFileUpload
  },
  data() {
    return {
      flag: false,
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
        materialName: [
          { required: true, message: "请输入材料设备名称", trigger: "blur" }
        ],
        quantities: [
          { required: true, message: "请输入工程量", trigger: "blur" }
        ],
        engineeringPrices: [
          { required: true, message: "请输入涉及工程总价", trigger: "blur" }
        ],
        contractNumber: [
          { required: true, message: "请选择合同", trigger: "change" }
        ]
      },
      tableData: [],
      isEdit: false,
      isShowSpan: false,
      isShowAdd: true,
      isShowSubmit: true,
      isShowBack: false,
      inputDisable: false,
      buttonDisable: false,
      buttonDisableSub: false,
      showDeleteButton: true,
      formDisable: false,
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
      serialNumber: "",
      isShowContract: false,
      contractQueryModel: {
        projectId: "",
        contractName: "",
        contractType: "",
        contractStatus: "5",
        // contractStatus: '',
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
        contractDate: "",
        buildingSelection: "",
        buildingArea: "",
        operator: "",
        operateDate: "",
        salesAera: "",
        conveySureMoney: "",
        engineeringPrices: "",
        materialName: "",
        quantities: "",
        buildingAreaConvey: "",
        salesAreaConvey: "",
        budgetType: "",
        referenceValue: "",
        remark: "",
        status: "0",
        statusCh: "草稿",
        userId: JSON.parse(JSON.parse(localStorage.getItem("USER_INFO")).val)
          .id,
        approveDate: ""
      },
      tableNum: 0,
      contractInfo: {},
      contractDetail: {},
      visaInfo: [],
      status: "",
      bpmUrl: ""
    };
  },
  mounted: function() {
    // alert('1111')
    this.init();
  },
  methods: {
    init() {
      if (this.$route.query.isAdd) {
        localStorage.setItem("subId", "");
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

        detailConstructionCost({ id: this.$route.query.id })
          .then(response => {
            this.ConstructionModel.companyId = response.data.companyId;
            this.ConstructionModel.companyName = response.data.companyName;
            this.ConstructionModel.contractNumber =
              response.data.contractNumber;
            this.ConstructionModel.contractName = response.data.contractName;
            this.ConstructionModel.projectId = response.data.projectId;
            this.ConstructionModel.projectName = response.data.projectName;
            this.ConstructionModel.materialName = response.data.materialName;
            this.ConstructionModel.quantities = response.data.quantities;
            this.ConstructionModel.engineeringPrices =
              response.data.engineeringPrices;
            this.tableData = response.data.materialsList;
            this.tableData.forEach(table => {
              table.index = uuidv1();
              table.checked = false;
            });
            this.ConstructionModel.operator = response.data.operator;
            this.ConstructionModel.contractId = response.data.contractId;
            this.ConstructionModel.operateDate = new Date(
              response.data.operateDate
            ).format();
            this.ConstructionModel.status = response.data.status;
            this.bpmUrl = response.data.bpmUrl;
            // if (this.ConstructionModel.status === "0") {
            //   this.ConstructionModel.statusCh = "草稿";
            // } else if (this.ConstructionModel.status === "1") {
            //   this.ConstructionModel.statusCh = "审批中";
            // } else if (this.ConstructionModel.status === "2") {
            //   this.ConstructionModel.statusCh = "已审批";
            // } else if (this.ConstructionModel.status === "3") {
            //   this.ConstructionModel.statusCh = "已驳回";
            // }
            if (this.bpmUrl != "") {
              this.flag = true;
              // window.open(this.bpmUrl, "_blank");
            }
          })
          .catch(error => {
            console.log(error);
            this.$showError(error.message ? error.message : "msg_system_error");
          });

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
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    handleSelect(selection, row) {
      for (let i = 0; i < selection.length; i++) {
        if (selection[i].index === row.index) {
          this.tableData.forEach(item => {
            if (item.index === row.index) {
              item.checked = true;
            }
          });
        }
      }
    },

    handleSelectAll(selection, row) {
      // 全选/取消全选
      let allChecked = true;
      if (selection.length === 0) {
        allChecked = false;
      }
      this.tableData.forEach(item => {
        item.checked = allChecked;
      });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
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
      this.ConstructionModel.companyId = data.companyId;
      this.ConstructionModel.companyName = data.companyName;
      this.ConstructionModel.contractNumber = data.contractCode;
      this.ConstructionModel.contractCode = data.contractCode;
      this.ConstructionModel.contractName = data.contractName;
      this.ConstructionModel.contractDate = data.contractDate;
      this.ConstructionModel.projectId = data.projectId;
      this.ConstructionModel.projectName = data.projectName;
      this.ConstructionModel.contractValue = data.sharedAmountByCostSystem;
      this.ConstructionModel.buildingSelection = data.partyB;
      this.ConstructionModel.contractId = data.id;
      this.rules.contractNumber = [
        { required: true, message: "请选择合同", trigger: "change" }
      ];
      this.isShowContract = false;
      // this.getVisaList();
    },
    getCurrentRow(contractDetail) {
      this.contractInfo = contractDetail;
    },

    addRowToTable(row) {
      // alert(JSON.stringify(this.getDefaultRow(row)))
      this.tableNum = Number(this.tableNum) + 1;
      this.tableData.push(this.getDefaultRow(row));
    },
    deleteDetail() {
      let newTableData = this.tableData.filter(function(item) {
        if (item.checked) {
          return false;
        } else {
          return true;
        }
      });
      this.tableData = newTableData;
      this.tableNum = this.tableData.length;
    },
    getROwIndex(row) {
      const _index = this.tableData.lastIndexOf(row);
      return _index;
    },
    getDefaultRow(row) {
      // let tNum = this.tableNum +1
      return {
        id: "",
        serialNumber: this.tableNum,
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
        index: uuidv1(),
        checked: false
      };
    },
    handleBack() {
      this.$router.push({
        name: "ConstructionList"
      });
    },
    submitConstructionCost() {
      this.buttonDisableSub = true;
      this.$refs["ConstructionModel"].validate(valid => {
        if (valid) {
          this.ConstructionModel.id = localStorage.getItem("subId");
          this.ConstructionModel.status = "1";
          this.ConstructionModel.materialsList = this.tableData;
          this.ConstructionModel.operateDate = new Date().format();
          this.ConstructionModel.attachments = this.attachmentData;
          saveOrUpdateConstructionCost(this.ConstructionModel)
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
          this.ConstructionModel.status = "0";
          this.ConstructionModel.materialsList = this.tableData;
          this.ConstructionModel.attachments = this.attachmentData;
          // this.ConstructionModel.operateDate = new Date(this.ConstructionModel.operateDate).format()
          saveOrUpdateConstructionCost(this.ConstructionModel)
            .then(response => {
              this.$showSuccess(response.message);
              localStorage.setItem("subId", response.data);
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
      this.ConstructionModel.attachments = data;
      this.attachmentData = data;
    }
  }
};
</script>

<style scoped>
/* @import '../../../styles/detail.scss'; */
.col {
  color: blue;
  text-decoration: underline;
  cursor: pointer;
}
</style>

<style>
.custom-00a597 .el-cascader-menu__item--extensible:after {
  content: "\E604";
}
</style>
