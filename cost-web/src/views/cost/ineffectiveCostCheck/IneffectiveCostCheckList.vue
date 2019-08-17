<!-- TargetCostCompilationList -->
<template>
    <div class='app-container'>

        <mt-searchform>
          <template slot="buttons">
            <el-button size="mini" type="primary"
             @click='handleExport'>导出</el-button>
          </template>
          <template slot="form">

            <ProjectSelector @updateMessage="updateMessage" v-model='queryModel.queryModelTest'>
              <template slot="projectSelectorButtons">
                <el-col :span="6" class="search-btn">
                  <el-form-item>
                    <el-button type='primary' size="mini"
                              @click='search'>{{$l("btn_search")}}</el-button>
                    <el-button type='primary' size="mini"
                              @click='reset'>{{$l("btn_reset")}}</el-button>
                </el-form-item>
                </el-col>
              </template>
            </ProjectSelector>

            <el-col :span="6">
              <el-form-item :label="'编号：'">
                <el-input v-model='queryModel.code'></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="6">
              <el-form-item :label="'责任部门：'">
                  <!--<el-input v-model='queryModel.ownerDept'></el-input>-->
                <fd-select v-model='queryModel.ownerDept'
                           type="cost_subject_responsible_dept_code" :disabled="buttonDisable"></fd-select>
              </el-form-item>
            </el-col>

            <el-col :span="6">
              <el-form-item :label="'日期：'">
                <el-date-picker v-model="queryModel.startTime"
                    type="date"
                    placeholder="选择日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
       </template>
      </mt-searchform>
        <IneffectiveCostTable :queryObj_passed_in='queryModel'
                          ref="IneffectiveCostTable"></IneffectiveCostTable>
    </div>
</template>

<script>
import ConstrctionTargetSelector from "@/components/cost/ConstrctionTargetSelector/";
import ProjectSelector from "@/components/cost/ProjectSelector/";
import IneffectiveCostTable from "@/views/cost/ineffectiveCostCheck/IneffectiveCostCheckTable";
import COSTENUM from "@/utils/cost/enum";
import COSTBUSINESS from "@/utils/cost/business";
export default {
  data() {
    return {
      queryModel: {
        companyId: "",
        projectId: "",
        accountObjectId: "",
        ownerDept: "",
        code: "",
        startTime: "",
        endTime: "",
        pageNum: 1,
        pageSize: 20,
        queryModelTest: {
          projectId: "",
          projectName: ""
        },
        show: {
          group: true,
          company: true,
          dept: true,
          account: true
        }
      },
      buttonDisable: false
    };
  },
  components: {
    ConstrctionTargetSelector,
    IneffectiveCostTable,
    ProjectSelector
  },
  mounted() {
    this.search();
  },

  methods: {
    // 导出 process.env.COST_API +
    handleExport() {
      console.log(JSON.stringify(this.queryModel));
      COSTBUSINESS.download(
        process.env.COST_API +
          "/ineffectiveCost/exportInvalidCostAccountData?" +
          "code=" +
          this.queryModel.code +
          "&ownerDept=" +
          this.queryModel.ownerDept +
          "&startTime=" +
          this.queryModel.startTime +
          "&companyId=" +
          this.queryModel.companyId +
          "&projectId=" +
          this.queryModel.queryModelTest.projectId +
          "&userName=" +
          this.$getUserInfo()["username"]
      );
    },
    updateMessage(item) {
      if (item.type === COSTENUM.projectTreeType.TREE_NODE_ACC_OBJ) {
        this.queryModel.accountingObjectId = item.accountingObjectId;
        this.queryModel.companyId = item.companyId;
      } else {
        this.queryModel.accountingObjectId = "";
        this.queryModel.companyId = item.id;
      }
      // alert(this.queryModel.companyId)
    },
    add() {
      this.$router.push({
        name: "NewOrUpdateIneffective",
        query: { id: "", isEdit: true, isAdd: true }
      });
    },
    initVM() {
      this.queryModel.pageNum = 1;
      this.queryModel.count = 0;
      this.queryModel.pageSize = 20;
    },
    reset() {
      this.queryModel.companyId = "";
      this.queryModel.projectId = "";
      this.queryModel.projectName = "";
      this.queryModel.businessDept = "";
      this.queryModel.accountObjectId = "";
      this.queryModel.ownerDept = "";
      this.queryModel.code = "";
      this.queryModel.startTime = "";
      this.queryModel.endTime = "";
      this.queryModel.queryModelTest = "";
      this.$refs.IneffectiveCostTable.getList();
    },
    search() {
      this.$refs.IneffectiveCostTable.getList();
    }
  }
};
</script>
<style scoped>
</style>
