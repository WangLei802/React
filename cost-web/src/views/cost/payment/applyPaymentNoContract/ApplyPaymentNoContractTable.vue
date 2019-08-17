<!-- applyPaymentNoContractTable -->
<template>
  <div ref="applyPaymentNoContractTable">
    <el-table
      :data="tableData"
      stripe
      border
      tooltip-effect="dark"
      size="small"
      :height="tHeight"
      style="width: 100%">
      <!-- 序号 -->
      <el-table-column
        type="index"
        :index="this.$getTableIndex(this.queryObj)"
        :label="this.$l('lbl_no')"
        width="80"
      ></el-table-column>
      <!-- 费用申请编号 -->
      <el-table-column prop="contractCode" show-overflow-tooltip :label="'费用申请编号'">
        <template slot-scope="scope">{{ scope.row.code}}</template>
      </el-table-column>
      <!-- 费用名称 -->
      <el-table-column prop="contractName" show-overflow-tooltip
                       :label="'费用名称'"
                       width="200">
<template slot-scope="scope">{{ scope.row.name}}</template>
      </el-table-column>
      <!-- 申请金额(元) -->
      <el-table-column prop="contractAmt"
                       :label="'申请金额(元)'">
<template slot-scope="scope">{{scope.row.applyAmt | NumFormat}}</template>
      </el-table-column>
      <el-table-column prop="contractAmt"
                       :label="'是否代垫代扣'">
<template slot-scope="scope">{{scope.row.applyPaymentType === '3' ? '是': '否'}}</template>
      </el-table-column>
      <!-- 费用申请日期 -->
      <el-table-column prop="operatorDate"
                       width="250"
                       :label="'费用申请日期'"
                       :formatter='this.$dateFormat("operatorDate","yyyy-MM-dd")'></el-table-column>
          <!-- 审批状态 -->
      <el-table-column prop="status"
                       :label="'审批状态'">
<template slot-scope="scope">
  <fd-label :code="scope.row.approveStatus" type="cost_flow_status"></fd-label>
</template>
      </el-table-column>
      <!-- 操作 -->
      <el-table-column :label="this.$l('lbl_operation')"
                       width="150">
<template slot-scope="scope">
  <!-- 查看 -->
  <el-button
    size="mini"
    type="text"
    icon="el-icon-view"
    :title="$l('btn_detail')"
    @click="viewRow(scope.$index, scope.row)"
  ></el-button>
  <el-button
    size="mini"
    type="text"
    icon="el-icon-menu"
    v-if="(scope.row.isProcedureApproval === '1')"
    title="财务共享编辑"
    @click="newIcon(scope.$index, scope.row)"
  ></el-button>
  <!-- 编辑 -->
  <el-button
    size="mini"
    type="text"
    v-if="(scope.row.approveStatus === '0' || scope.row.approveStatus === '3') && $checkPersmissionByCode('cost:applyPaymentNoContract:create')"
    icon="el-icon-edit"
    :title="$l('btn_edit')"
    @click="editRow(scope.$index, scope.row)"
  ></el-button>
  <!-- 删除 -->
  <el-button
    size="mini"
    type="text"
    v-if="(scope.row.approveStatus === '0' || scope.row.approveStatus === '3') && $checkPersmissionByCode('cost:applyPaymentNoContract:delete')"
    icon="el-icon-delete"
    :title="$l('btn_delete')"
    @click="deleteRow(scope.$index, scope.row)"
  ></el-button>
  <!--<el-button size="mini"-->
  <!--type="text"-->
  <!--@click="approveRecord(scope.$index, scope.row)">通过</el-button>-->
  <!--<el-button size="mini"-->
  <!--type="text"-->
  <!--@click="rejectRecord(scope.$index, scope.row)">驳回</el-button>-->
  </template>
      </el-table-column>
    </el-table>
    <div class='pagination_bar'>
      <mt-pagination @size-change='handleSizeChange'
                     @current-change='handleCurrentChange'
                     :current-page.sync='queryObj.pageNum'
                     :page-sizes='[10, 20, 30, 40]'
                     :page-size='queryObj.pageSize'
                     layout='sizes, prev, pager, next'
                     :total='queryObj.count'>
      </mt-pagination>
    </div>
  </div>
</template>

<script>
import { LoadingUtil } from "@/utils/common/LoadingUtil";
import {
  getApplyPaymentNoContractList,
  deleteApplyPaymentNoContract,
  deleteApplyPaymentPad,
  updateStatus
} from "@/api/cost/payment";
import { NumFormat, Version } from "@/filters/cost/";
import { tableHeight } from "@/utils/common/index";
export default {
  props: {
    queryObj_passed_in: {
      type: Object
    }
  },
  filters: {
    NumFormat,
    Version
  },
  data() {
    return {
      tableData: [],
      queryObj: this.queryObj_passed_in,
      tableHeight: "0",
      fullHeight: document.documentElement.clientHeight
    };
  },
  methods: {
    initTableData(response) {
      this.tableData = response.data.content;
    },
    handleExpandClick(rowData) {
      let parentExpanded;
      this.tableData.map(item => {
        if (
          item.accountObjectId === rowData.accountObjectId &&
          item.accountingObjectName !== ""
        ) {
          item._expanded = !item._expanded;
          parentExpanded = item._expanded;
        }
        if (
          item.accountObjectId === rowData.accountObjectId &&
          item.accountingObjectName === ""
        ) {
          item._show = parentExpanded;
          item._expanded = parentExpanded;
        }
      });
    },
    getList() {
      debugger;
      LoadingUtil.showLoading();
      // 转换参数
      let _queryObj = {
        projectId: this.queryObj.projectId,
        companyId: this.queryObj.companyId,
        code: this.queryObj.code,
        operatorDate: this.queryObj.operatorDate,
        isPad: this.queryObj.isPad,
        approveStatus: this.queryObj.approveStatus,
        pageNum: this.queryObj.pageNum,
        pageSize: this.queryObj.pageSize
      };
      getApplyPaymentNoContractList(_queryObj)
        .then(response => {
          LoadingUtil.hideLoading();
          this.initTableData(response);
          this.queryObj.count = response.data.totalElements;
        })
        .catch(error => {
          console.log(error);
          this.$showError(error.message ? error.message : "msg_system_error");
        });
    },
    newIcon(index, rowData) {
      if (rowData.applyPaymentType === "3") {
        this.$router.push({
          name: "NewOrUpdateApplyPaymentPad",
          query: {
            id: rowData.id,
            isEdit: false,
            isShow: false
          }
        });
      }
      if (rowData.applyPaymentType === "2") {
        this.$router.push({
          name: "NewOrUpdateApplyPaymentNoContract",
          query: {
            id: rowData.id,
            isEdit: false,
            isShow: false
          }
        });
      }
    },
    // 查看
    viewRow(index, rowData) {
      // debugger
      if (rowData.applyPaymentType === "3") {
        this.$router.push({
          name: "NewOrUpdateApplyPaymentPad",
          query: {
            id: rowData.id,
            isEdit: false,
            isShow: true
          }
        });
      }
      if (rowData.applyPaymentType === "2") {
        this.$router.push({
          name: "NewOrUpdateApplyPaymentNoContract",
          query: {
            id: rowData.id,
            isEdit: false,
            isShow: true
          }
        });
      }
    },
    approveRecord(index, rowData) {
      let param = {};
      param.id = rowData.id;
      param.approveStatus = "2";
      updateStatus(param)
        .then(response => {
          if (response.status !== "404") {
            this.getList();
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    rejectRecord(index, rowData) {
      let param = {};
      param.id = rowData.id;
      param.approveStatus = "3";
      updateStatus(param)
        .then(response => {
          if (response.status !== "404") {
            this.getList();
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    // 编辑
    editRow(index, rowData) {
      if (rowData.applyPaymentType === "2") {
        this.$router.push({
          name: "NewOrUpdateApplyPaymentNoContract",
          query: {
            id: rowData.id,
            isEdit: true,
            isOrEdit: true,
            isShow: true
          }
        });
      }
      if (rowData.applyPaymentType === "3") {
        this.$router.push({
          name: "NewOrUpdateApplyPaymentPad",
          query: {
            id: rowData.id,
            isEdit: true,
            isShow: true
          }
        });
      }
    },
    deleteRow(index, rowData) {
      this.$confirm("确认删除该记录", {
        confirmButtonText: this.$l("btn_confirm"),
        cancelButtonText: this.$l("btn_cancel"),
        type: "warning"
      })
        .then(() => {
          debugger;
          if (rowData.applyPaymentType === "2") {
            deleteApplyPaymentNoContract(rowData)
              .then(response => {
                this.$showSuccess(response.message);
                if (response.status !== "404")
                  this.$delete(this.tableData, index);
                this.getList();
              })
              .catch(error => {
                console.log(error);
                this.$showError(
                  error.message ? error.message : "msg_system_error"
                );
              });
          }
          if (rowData.applyPaymentType === "3") {
            deleteApplyPaymentPad(rowData)
              .then(response => {
                this.$showSuccess(response.message);
                if (response.status !== "404")
                  this.$delete(this.tableData, index);
                this.getList();
              })
              .catch(error => {
                console.log(error);
                this.$showError(
                  error.message ? error.message : "msg_system_error"
                );
              });
          }
        })
        .catch(() => {});
    },
    handleSizeChange(val) {
      this.queryObj.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.queryObj.pageNum = val;
      this.getList();
    }
  },
  computed: {
    tHeight: function() {
      let options = {
        fullHeight: this.$store.getters.fullHeight,
        opened: this.$store.getters.sidebar.opened,
        showForm: this.$store.getters.showForm,
        obj: this
      };
      return `${tableHeight(options)}px`;
    }
  }
};
</script>

