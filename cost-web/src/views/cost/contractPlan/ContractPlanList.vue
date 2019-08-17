<template>
  <div class="main">
    <div class="user-manage-content">
      <ContracTree
        class="contract-tree-content"
        :sbleData="treeList"
        :searchVal="true"
        :showIcon="true"
        :cHeight="tHeight"
        @changeCheckedNode="changeCheckedNode"
      ></ContracTree>
      <div class="table-right">
        <div>
          <el-row>
            <el-col :span="24" class="selectNodeClass">
              <div style="float:left;" v-show="selectNode">
                <strong>当前选择：</strong>
                {{selectNode?selectNode.name:''}}
              </div>
              <div class="el-form-item">
                <el-button
                  type="primary"
                  size="mini"
                  @click="handleAddRow(pageStatus.typeName)"
                  v-if="$checkPersmissionByCode('cost:contractPlanMgmt:create')"
                  :disabled="!selectNode || selectNode.type==='2'"
                >{{$l('btn_add')}}{{pageStatus.typeName}}</el-button>

                <!--一级下可以挂规划-->
                <el-button
                  type="primary"
                  size="mini"
                  @click="handleAddRow('规划')"
                  v-if="selectNode && selectNode.level==='2' && $checkPersmissionByCode('cost:contractPlanMgmt:create')"
                  :disabled="!selectNode || selectNode.type==='2'"
                >{{$l('btn_add')}}规划</el-button>
              </div>
            </el-col>
            <!--<el-col :span="10"><span> </span></el-col>-->
            <!--<el-col :span="14">-->
            <!---->
            <!--</el-col>-->
          </el-row>
          <div ref="contractPlanListTable">
            <el-table
              :data="tableData"
              stripe
              border
              :height="tHeight"
              tooltip-effect="dark"
              style="width: 100%"
              size="small"
            >
              <!-- <el-table-column :label="$l('lbl_no')"
                                             width="100"
                                             type="index">
              </el-table-column>-->
              <el-table-column
                prop="name"
                :label="$l('lbl_cost_comm_name')"
                show-overflow-tooltip
                width="150"
              >
                <template slot-scope="scope">
                  <span v-show="!scope.row._editStatus" class="contentTitle">{{scope.row.name}}</span>
                  <el-input
                    v-model.trim="scope.row.name"
                    maxlength="30"
                    minlength="1"
                    placeholder
                    v-show="scope.row._editStatus"
                    size="mini"
                    @blur="handleRowChange(scope.$index,'name',scope.row.name,scope.row,$event)"
                    :style="{'border': !scope.row._isValid ? '1px solid red':'','border-radius':!scope.row._isValid ? '2px':'2px'}"
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column
                prop="reservedChangeRate"
                :label="$l('lbl_reserve_change_ratio')"
                width="100"
              >
                <template slot-scope="scope">
                  <!-- @modify@20181015 ，默认集成并且可以修改，因为业务上出现 总包合同和其他合同的预留变更比例不一致的需求-->
                  <!-- && scope.row.type==='1' -->
                  <span v-show="!scope.row._editStatus">{{scope.row.reservedChangeRate}}</span>
                  <span>
                    <el-input
                      v-model.trim="scope.row.reservedChangeRate"
                      maxlength="5"
                      placeholder
                      type="number"
                      onmousewheel="return false;"
                      size="mini"
                      v-show="scope.row._editStatus"
                      :style="{'width':'55px'}"
                      @blur="handleRowChange(scope.$index,'reservedChangeRate',scope.row.reservedChangeRate,scope.row,$event)"
                    ></el-input>
                  </span>
                  <span>%</span>
                </template>
              </el-table-column>
              <el-table-column prop="type" :label="$l('lbl_type')" width="100">
                <template slot-scope="scope">
                  <el-row>
                    <el-col :span="3">
                      <i :class="[scope.row.type ==='2'?'el-icon-tickets':'el-icon-menu']"></i>
                    </el-col>
                    <el-col :span="1">&nbsp;</el-col>
                    <el-col :span="12">
                      <fd-label :code="scope.row.type" type="cost_dictionary_contract_type"></fd-label>
                    </el-col>
                  </el-row>
                </template>
              </el-table-column>
              <el-table-column prop="status" :label="$l('lbl_status')" width="100">
                <template slot-scope="scope">
                  <span v-show="scope.row.type === '2'">
                    <fd-label
                      :code="scope.row.status"
                      v-show="!scope.row._editStatus"
                      type="cost_dictionary_status"
                    ></fd-label>

                    <fd-select
                      v-show="scope.row._editStatus"
                      v-model="scope.row.status"
                      type="cost_dictionary_status"
                      :clearable="false"
                    ></fd-select>
                  </span>
                  <span v-show="scope.row.type === '1' && !scope.row._editStatus">--</span>
                </template>
              </el-table-column>
              <!-- 是否虚拟 -->
              <el-table-column prop="isHidden" label="是否虚拟合约" width="120">
                <template slot-scope="scope">
                  <span v-show="scope.row.type === '2'">
                    <el-checkbox
                      v-model="scope.row.isHidden"
                      :true-label="'1'"
                      :disabled="!scope.row._editStatus"
                      :false-label="'0'"
                    ></el-checkbox>
                  </span>
                </template>
              </el-table-column>

              <el-table-column prop="remark" :label="$l('lbl_remark')">
                <template slot-scope="scope">
                  <span v-show="!scope.row._editStatus">{{scope.row.remark}}</span>
                  <el-input
                    v-model.trim="scope.row.remark"
                    placeholder
                    v-show="scope.row._editStatus == 1"
                    maxlength="50"
                    size="mini"
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column :label="$l('lbl_operation')" width="180">
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    type="text"
                    icon="el-icon-edit"
                    :title="$l('btn_edit')"
                    v-if="$checkPersmissionByCode('cost:contractPlanMgmt:update')"
                    @click="editRow(scope.$index, scope.row)"
                  ></el-button>
                  <!-- 保存 -->
                  <el-button
                    size="mini"
                    type="text"
                    icon="fa fa-floppy-o"
                    :title="$l('btn_save')"
                    @click="saveRow(scope.$index, scope.row)"
                    v-if="$checkPersmissionByCode('cost:contractPlanMgmt:update')"
                    :disabled="!scope.row._editStatus"
                  ></el-button>
                  <!-- 取消 -->
                  <el-button
                    size="mini"
                    type="text"
                    icon="fa fa-undo"
                    :title="$l('btn_cancel')"
                    @click="cancelEditRow(scope.$index, scope.row)"
                    v-if="$checkPersmissionByCode('cost:contractPlanMgmt:update')"
                    :disabled="!scope.row._editStatus"
                  ></el-button>

                  <!-- 删除，有下级不可删除 -->
                  <el-button
                    size="mini"
                    type="text"
                    icon="el-icon-delete"
                    :title="$l('btn_delete')"
                    @click="deleteRow(scope.$index, scope.row)"
                    v-if="!(scope.row.children && scope.row.children.length>0) && $checkPersmissionByCode('cost:contractPlanMgmt:delete')"
                    :disabled="scope.row._editStatus"
                  ></el-button>

                  <!-- 禁用,分类不可禁用 -->
                  <el-button
                    size="mini"
                    type="text"
                    icon="el-icon-circle-check-outline"
                    :title="$l('btn_enable')"
                    @click="changeStatusRow(scope.$index, scope.row)"
                    v-show="!scope.row._editStatus && scope.row.status == '0' && scope.row.type === '2' &&  $checkPersmissionByCode('cost:contractPlanMgmt:update')"
                  ></el-button>

                  <!-- 启用。分类不可启用  -->
                  <el-button
                    size="mini"
                    type="text"
                    icon="el-icon-remove-outline"
                    :title="$l('btn_disable')"
                    @click="changeStatusRow(scope.$index, scope.row)"
                    v-show="!scope.row._editStatus && scope.row.status == '1' && scope.row.type === '2' &&  $checkPersmissionByCode('cost:contractPlanMgmt:update')"
                  ></el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import { LoadingUtil } from "@/utils/common/LoadingUtil";
import { getValueByKey } from "@/utils/sys/ParameterUtil.js";
import ContracTree from "@/components/cost/ContractSelectTree/";
import { deepCopy, ifNull } from "@/utils/cost/objectHelper";
import {
  listAllContractPlanTree,
  createContractPlan,
  updateContractPlan,
  deleteContractPlan,
  updateStatus
} from "@/api/cost/contractPlanAPI";
import { tableHeight } from "@/utils/common/index";
export default {
  data() {
    return {
      tableHeight: "0",
      fullHeight: document.documentElement.clientHeight,
      model: {
        id: "2c9216cf648e1c7b01648e1c99f90000",
        createdBy: "string",
        createdDate: "2018-07-12T10:27:57.000+0000",
        updatedBy: "string",
        updatedDate: "2018-07-12T11:13:19.000+0000",
        version: 1,
        name: "4",
        remark: "string备注",
        type: "0",
        level: "2",
        ownerId: "0",
        parent: "1",
        sort: "0",
        status: "0",
        isDeleted: "0",
        isHidden: "0",
        children: []
      },
      pageStatus: {
        edit: false,
        typeName: ""
      },
      treeList: [],
      selectNode: null,
      selectEidtRow: null,
      tableData: [],
      paramterSetting: {
        cost_contract_root: {
          key: "cost.contract.root",
          value: null
        },
        cost_contractPlan_parent_level: {
          key: "cost.contractPlan.parent.level",
          value: null
        }
      }
    };
  },
  computed: {
    tHeight: function() {
      let options = {
        fullHeight: this.$store.getters.fullHeight,
        opened: this.$store.getters.sidebar.opened,
        showForm: this.$store.getters.showForm,
        obj: this,
        otherHeight: 160
      };
      return `${tableHeight(options)}px`;
    }
  },
  components: {
    ContracTree
  },
  mounted() {
    this.initParamter();
  },
  methods: {
    // 处理参数
    initParamter() {
      try {
        this.paramterSetting.cost_contract_root.value = getValueByKey(
          this.paramterSetting.cost_contract_root.key
        );
        this.paramterSetting.cost_contractPlan_parent_level.value = parseInt(
          getValueByKey(this.paramterSetting.cost_contractPlan_parent_level.key)
        );
        if (!this.paramterSetting.cost_contractPlan_parent_level.value) {
          this.$showError("msg_cost_paramter_mistake");
        } else {
          this.getList();
        }
      } catch (error) {
        console.error(error);
        this.$showError("msg_cost_paramter_mistake");
      }
    },
    // 处理数据
    initList(data) {
      debugger;
      data.map(item => {
        item._editStatus = false;
        if (!item.reservedChangeRate) item.reservedChangeRate = 0;
        item._isNew = false;
        item._isValid = true;
        item.isHidden = ifNull(item.isHidden, "0");
        if (item.children.length > 0) this.initList(item.children);
      });
    },
    getDefaultDataType(parentLevel) {
      return parentLevel <
        this.paramterSetting.cost_contractPlan_parent_level.value + 1
        ? "1"
        : "2";
    },
    // 获取默认数据层级
    getDefaultDataLevel(parentLevel) {
      return (parseInt(parentLevel) + 1).toString();
    },
    // 获取默认值
    getDefaultData() {
      return {
        // 'id': '2c9216cf648e1c7b01648e1c99f90000',
        // 'createdBy': 'string',
        // 'createdDate': '2018-07-12T10:27:57.000+0000',
        // 'updatedBy': 'string',
        // 'updatedDate': '2018-07-12T11:13:19.000+0000',
        // 'version': 1,
        name: "",
        reservedChangeRate: 0, // 预估变更比例
        remark: "",
        type: this.getDefaultDataType(this.selectNode.level),
        level: this.getDefaultDataLevel(this.selectNode.level),
        ownerId: "0",
        parent: this.selectNode.id,
        sort: "0",
        status: "1",
        isDeleted: "0",
        children: [],
        _editStatus: true,
        _isNew: true,
        _isValid: true
      };
    },
    // 获取列表
    getList() {
      listAllContractPlanTree({ type: "0", ownerId: "0" })
        .then(response => {
          LoadingUtil.hideLoading();
          let _data = response.data ? response.data : [];
          this.treeList = JSON.parse(JSON.stringify(_data));
          this.initList(this.treeList);
        })
        .catch(error => {
          console.log(error);
          this.$showError(error.message ? error.message : "msg_system_error");
        });
    },
    // 当前勾选
    changeCheckedNode(obj) {
      if (this.pageStatus.edit) {
        this.$showError("msg_subject_finish_edit");
        return;
      }
      LoadingUtil.showLoading();
      if (obj.type === "2") {
        // 规划点击return
        this.tableData = [];
        this.tableData.push(obj);
      } else {
        this.tableData = JSON.parse(JSON.stringify(obj.children));
      }
      this.selectNode = obj;

      let type = this.getDefaultDataType(this.selectNode.level);
      this.pageStatus.typeName = type === "1" ? "类别" : "规划";
      this.$nextTick(function() {
        setTimeout(() => {
          LoadingUtil.hideLoading();
        }, 1000);
      });
    },
    // 新增行
    handleAddRow(typeName) {
      if (this.pageStatus.edit) {
        this.$showError("msg_subject_finish_edit");
        return;
      }
      this.pageStatus.edit = true;
      let _row = JSON.parse(JSON.stringify(this.getDefaultData()));
      if (typeName === "规划") {
        _row.reservedChangeRate = this.selectNode.reservedChangeRate || 0;
        _row.type = "2";
      }
      this.tableData.push(_row);
    },
    // 行编辑
    handleRowChange(index, fieldType, fieldValue, rowData, event) {
      let _checkResult = true;
      if (fieldType === "reservedChangeRate") {
        if (fieldValue < 0 || fieldValue > 100) {
          this.$showNormalError("输入错误（0-100）");
          //if (event) event.currentTarget.focus()
          _checkResult = false;
          return;
        }
      }

      if (fieldValue.length === 0) {
        this.$showError("msg_standared_empty_data");
        //if (event) event.currentTarget.focus()
        _checkResult = false;
      } else {
        _checkResult = true;
      }
      const newItem = this.tableData[index];
      newItem._isValid = _checkResult;
      Vue.set(this.tableData, index, newItem);
    },
    // 编辑行
    editRow(index, rowData) {
      if (this.pageStatus.edit) {
        this.$showError("msg_subject_finish_edit");
        return;
      }
      this.pageStatus.edit = true;
      // rowData.id
      const newItem = this.tableData[index];
      this.selectEidtRow = JSON.parse(JSON.stringify(newItem));
      newItem._editStatus = !newItem._editStatus;
      Vue.set(this.tableData, index, newItem);
    },
    // 取消编辑
    cancelEditRow(index, rowData) {
      if (!rowData._isValid && !rowData._isNew) {
        return;
      }
      if (rowData._isNew) {
        rowData.name = "-";
        this.tableData.splice(index, 1);
      } else {
        const newItem = this.selectEidtRow
          ? this.selectEidtRow
          : this.tableData[index];
        newItem._editStatus = false;
        Vue.set(this.tableData, index, newItem);
        this.selectEidtRow = null;
      }
      this.pageStatus.edit = false;
    },
    // 改变状态
    changeStatusRow(index, rowData) {
      updateStatus({
        id: rowData.id,
        version: rowData.version
      })
        .then(response => {
          LoadingUtil.hideLoading();
          Vue.set(this.tableData, index, response.data);
          this.$showSuccess(response.message);
        })
        .catch(error => {
          console.log(error);
          this.$showError(error.message ? error.message : "msg_system_error");
        });
    },
    // 删除行
    deleteRow(index, rowData) {
      this.$confirm(
        this.$l("msg_standared_delete_code"),
        this.$l("msg_delete_tips"),
        {
          confirmButtonText: this.$l("btn_confirm"),
          cancelButtonText: this.$l("btn_cancel"),
          type: "warning"
        }
      )
        .then(() => {
          deleteContractPlan(rowData)
            .then(response => {
              LoadingUtil.hideLoading();
              this.$delete(this.tableData, index);
              this.getList();
              this.$showSuccess(response.message);
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
    // 保存行
    saveRow(index, rowData) {
      const _this = this;
      if (rowData.name.length === 0 || rowData.name.length > 30) {
        this.$showError("msg_standared_empty_data");
        return;
      }
      if (rowData.id) {
        updateContractPlan(rowData)
          .then(response => {
            LoadingUtil.hideLoading();
            Vue.set(this.tableData, index, response.data);
            _this.getList();
            this.$showSuccess(response.message);
            _this.pageStatus.edit = false;
          })
          .catch(error => {
            console.log(error);
            this.$showError(error.message ? error.message : "msg_system_error");
          });
      } else {
        createContractPlan(rowData)
          .then(response => {
            LoadingUtil.hideLoading();
            Vue.set(this.tableData, index, response.data);
            _this.getList();
            this.$showSuccess(response.message);
            _this.pageStatus.edit = false;
          })
          .catch(error => {
            console.log(error);
            this.$showError(error.message ? error.message : "msg_system_error");
          });
      }
    }
  }
};
</script>
<style scoped>
.selectNodeClass {
  color: #1f3d3d;
  height: 30px;
  line-height: 30px;
  font-size: 14px;
  margin-bottom: 10px;
}
.main {
  text-align: left;
  padding: 15px;
  width: 100%;
  position: relative;
}
.user-manage-content {
  padding-left: 17rem;
}
.contract-tree-content {
  position: absolute;
  top: 15px;
  left: 15px;
  bottom: 15px;
  width: 265px;
  overflow-x: hidden;
  overflow-y: auto;
  border: #e4e4e4 1px solid;
}
.table-right {
  margin-left: 1rem;
}
.el-form-item {
  float: right;
}
.contentTitle {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
