<template>
  <div class="contractPlan">
    <el-dialog
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      title="选择合约规划"
      :visible.sync="dialogContractPlan"
      width="85%"
      top="3%"
      :show-close="false"
      :before-close="handleClose"
    >
      <div style="margin-top:-30px">
        <mt-searchform>
          <template slot="buttons">
            <el-button size="mini" @click="cancel" v-show="isShow">返 回</el-button>
            <el-button size="mini" type="primary" @click="submit" v-show="isShow">确 定</el-button>
          </template>
          <template slot="form">
            <ProjectSelector
              v-if="!accountingObje"
              style="float:left;width:100%"
              v-model="p_queryModel"
              :disabled="{accObj:false}"
              :show="{group: false,company: false,dept: false, project: false,accObj:true}"
            ></ProjectSelector>
            <ProjectSelector
              v-else
              style="float:left;width:100%"
              v-model="p_queryModel"
              :disabled="{accObj:true}"
              :show="{group: false,company: false,dept: false, project: false,accObj:true}"
            ></ProjectSelector>
            <el-col :span="6">
              <el-form-item label="一级分类：">
                <el-select v-model="form.oneLevel" clearable placeholder="请选择">
                  <el-option
                    v-for="(item,index)  in oneLevelList"
                    :key="index"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="二级分类：">
                <el-select v-model="form.twoLevel" clearable placeholder="请选择">
                  <el-option
                    v-for="(item,index) in twoLevelList"
                    :key="index"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="合约规划名称：">
                <el-input v-model="form.contractPlan" :maxlength="20" :clearable="true"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6" style="width:20%" class="search-btn">
              <el-form-item class="search">
                <el-button size="mini" type="primary" @click="onSearch">查询</el-button>
              </el-form-item>
            </el-col>
          </template>
        </mt-searchform>

        <!--<el-form ref="form"-->
        <!--:model="form"-->
        <!--label-width="80px"-->
        <!--size="mini">-->

        <!-- <el-select  v-if="accountingObje" v-model="accountingObje" :disabled="true"  
                                   placeholder="请选择">
                            <el-option v-for="item in accountObjectList"
                                       :key="item.accountingObjectId"
                                       :label="item.accountingObjectName"
                                       :value="item.accountingObjectId">
                            </el-option>
        </el-select>-->

        <!--</el-form>-->
        <div ref="targetCostCompilationTable">
          <el-table
            :data="tableDataList"
            stripe
            border
            :height="tHeight"
            tooltip-effect="dark"
            style="width: 100%"
            size="small"
          >
            <el-table-column label="选择" width="50">
              <template slot-scope="scope">
                <el-radio
                  v-model="checkedForm"
                  v-if="scope.row.locked"
                  :label="scope.row"
                  :disabled="true"
                >&nbsp;</el-radio>

                <el-radio
                  v-model="checkedForm"
                  v-else
                  :label="scope.row"
                  @change="controlSingle(scope.row)"
                >&nbsp;</el-radio>
                <!-- <el-checkbox v-model="checkedForm"
                                             v-if="scope.row.locked"
                                             :label="scope.row"
                                             :disabled="true">&nbsp;</el-checkbox>

                                <el-checkbox v-model="checkedForm"
                                             v-else
                                             :label="scope.row"
                @change="controlSingle(scope.row)">&nbsp;</el-checkbox>-->
              </template>
            </el-table-column>

            <el-table-column prop="accountingObjName" width="250" label="成本分期"></el-table-column>

            <el-table-column prop="cpName" width="150" label="合约规划名称"></el-table-column>
            <el-table-column prop="cpTotalAmount" width="160" label="合约规划总金额（A）"></el-table-column>
            <el-table-column prop="cpAmountOccurence" width="130" label="已发生金额（B）"></el-table-column>
            <el-table-column prop="amountPendingApprove" width="110" label="在途金额（C）"></el-table-column>
            <el-table-column prop="amountReleased" width="150" label="已释放金额（D）"></el-table-column>
            <el-table-column prop="amountPendingOccurence" label="待发生金额（E=A-B-C-D）"></el-table-column>
          </el-table>
        </div>
      </div>
      <span slot="footer" class="dialog-footer"></span>
    </el-dialog>
  </div>
</template>
<script>
import { tableHeight } from "@/utils/common/index";
import { LoadingUtil } from "@/utils/common/LoadingUtil";
import {
  getFirstCategory,
  getSecondCategory
} from "@/api/cost/SelectContractPlanAPI";
import { getTargetCostContractPlan } from "@/api/cost/signContractAPI";
import ProjectSelector from "@/components/cost/ProjectSelector/";
export default {
  props: {
    value: {
      type: String
    },
    dialogContractPlan: {
      type: Boolean
    },
    activeName: {
      type: String,
      default: "2"
    },
    accountingObje: {
      type: String
    }
  },
  components: {
    ProjectSelector
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
  },
  data() {
    return {
      tableHeight: "0",
      fullHeight: document.documentElement.clientHeight,
      isShow: false,
      p_queryModel: {
        companyId: "",
        accObjId: this.accountingObje,
        projectId: "",
        accList: ""
      },
      accountObjectList: [],
      oneLevelList: [],
      twoLevelList: [],
      checkedForm: [],
      contractPlanList: [],
      form: {
        contractPlan: "",
        twoLevel: "",
        oneLevel: "",
        accountObject: ""
      },
      tableDataList: []
    };
  },
  mounted() {
    this.getFirstCategoryList();
    this.getUserInfo();
    // alert(localStorage.getItem("dataList")))
    this.checkedForm = [];
  },
  watch: {
    fullHeight(val) {
      this.settingTableHeight();
    },
    accountingObje: {
      handler(newValue, oldValue) {
        this.p_queryModel.accObjId = newValue;
      },
      deep: true
    },
    "form.oneLevel": {
      handler(newValue, oldValue) {
        this.form.oneLevel = newValue;
        this.form.twoLevel = "";
        this.getSecondCategoryList();
      },
      deep: true
    }
  },
  methods: {
    settingTableHeight: function() {
      const topHeight = this.$refs[
        "targetCostCompilationTable"
      ].getBoundingClientRect().top;
      this.tableHeight = this.fullHeight - topHeight - 80;
      this.$refs["targetCostCompilationTable"].style.Height =
        this.tableHeight + "px";
    },
    controlSingle(val) {
      if (this.activeName !== "2" && this.checkedForm.length > 1) {
        this.checkedForm = [];
        this.checkedForm.push(val);
      }
      // this.checkedForm.push(val)
    },
    getFirstCategoryList() {
      getFirstCategory().then(response => {
        this.oneLevelList = response.data ? response.data : [];
      });
    },
    getSecondCategoryList() {
      getSecondCategory({ id: this.form.oneLevel }).then(response => {
        this.twoLevelList = response.data ? response.data : [];
      });
    },
    onSearch() {
      LoadingUtil.showLoading();

      getTargetCostContractPlan({
        accountingObjectId: this.p_queryModel.accObjId,
        level1Id: this.form.oneLevel,
        level2Id: this.form.twoLevel,
        cpName: this.form.contractPlan
      })
        .then(response => {
          LoadingUtil.hideLoading();
          let accountObject = response.data ? response.data : [];
          let newArr = [];
          let getList = JSON.parse(localStorage.getItem("dataList"));
          for (var i = 0; i < accountObject.length; i++) {
            for (var j = 0; j < getList.length; j++) {
              if (accountObject[i].cpName == getList[j].cpName) {
                accountObject.splice(i, 1);
              }
            }
          }
          this.tableDataList = accountObject;
        })
        .catch(error => {
          LoadingUtil.hideLoading();
          console.log(error);
        });
    },
    // 新增参数val
    submit(val) {
      // 原有的
      // submit() {
      debugger;
      // alert(JSON.stringify(this.checkedForm))
      this.$emit("closeDialogContractPlan", this.checkedForm);
    },
    getUserInfo() {
      LoadingUtil.showLoading();
      getTargetCostContractPlan({
        accountingObjectId: this.p_queryModel.accObjId
      })
        .then(response => {
          LoadingUtil.hideLoading();
          this.isShow = true;
          let accountObject = response.data ? response.data : [];
          //  this.contractPlanList = accountObject
          debugger;
          let newArr = [];
          let getList = JSON.parse(localStorage.getItem("dataList"));
          for (var i = 0; i < accountObject.length; i++) {
            for (var j = 0; j < getList.length; j++) {
              if (accountObject[i].cpName == getList[j].cpName) {
                accountObject.splice(i, 1);
              }
            }
          }
          this.tableDataList = accountObject;
        })
        .catch(error => {
          LoadingUtil.hideLoading();
          this.isShow = true;
          console.log(error);
        });
    },
    cancel() {
      this.$emit("closeDialogContractPlan");
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
    }
  }
};
</script>
<style scoped>
.el-dialog__headerbtn {
  display: none;
}

.el-form-item {
  /*width: 22%;*/
  /*float: left;*/
}
.el-form-item.search {
  /*width: 6%;*/
}
.el-form-item.search .el-form-item__content {
  margin-left: 20px;
}
</style>
<!--剩余待发生金额(元)（H=E-F-G）  大于0 的时候 剩余待发生处理 状态是生成新合约  
点击生成新合约 弹出框   新合约规划名称 = 旧名称-1  点击释放  隐藏新合约规划名称和新合约规划金额(元) 
amountPendingOccurence 待发生
amountReleased 释放 
cpAmountOccurence
核算对象 accountingObjName
合约规划编码 没有
和与规划名称 cpName
合约规划金额 cpTotalAmount
已发生金额 cpAmountOccurence
途金额  amountPendingApprove
已释放金额 amountReleased
amountPendingOccurence  待发生金额
reservedChangeRate 预留变更比例
reservedChangeAmount 预留变更金额










-->
