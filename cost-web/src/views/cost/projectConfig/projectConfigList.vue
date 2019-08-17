<template>
  <div class='app-container'>
      <div class="top_container">
          <el-button type="info" icon="el-icon-search" class="top_btn" @click="searc">{{search}}</el-button>
      </div>
      <div class="form" v-show="searchflag">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-row :gutter="5">
              <el-col :span="6">
                  <el-form-item label="项目名称：" label-width="120px">
                    <el-input v-model="formInline.name" placeholder="请输入项目名称"></el-input>
                  </el-form-item>
              </el-col>
              <el-col :span="18" >
                <div class="flex">
                    <el-form-item>
                      <el-button type="primary" @click="onSubmit">查询</el-button>
                      <el-button type="primary" @click="reset">重置</el-button>
                    </el-form-item>
                </div>
              </el-col>
          </el-row>
        </el-form>
      </div>
      <div ref="ineffectiveCostTable">
        <el-table :data="queryObj.content" stripe border size="small" style="width: 100%" :height="680">
            <!-- 项目编号 -->
            <el-table-column prop="projectCode" :label="'项目编号'" show-overflow-tooltip>
                <template slot-scope="scope">
              {{ scope.row.projectCode}}
    </template>
        </el-table-column>
        <!-- 项目名称 -->
        <el-table-column prop="projectName"
                        :label="'项目名称'" show-overflow-tooltip>
    <template slot-scope="scope">
        {{scope.row.projectName}}
    </template>
        </el-table-column>
        <!-- 材料设备名称 -->
        <el-table-column :label="'是否补录'" show-overflow-tooltip>
    <template slot-scope="scope">
        <el-select @change="change(scope.row)" size="mini" v-model="scope.row.value">
            <el-option v-for="item in option" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
    </template>
        </el-table-column>
        <!-- 是否考核动态成本 -->
        <el-table-column :label="'是否考核动态成本'" show-overflow-tooltip>
    <template slot-scope="scope">
        <el-select @change="change1(scope.row)" size="mini	" v-model="scope.row.value1">
            <el-option v-for="item in option1" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
    </template>
      </el-table-column>
       <el-table-column :label="'是否切换财务共享'" show-overflow-tooltip>
    <template slot-scope="scope">
        <el-select @change="change2(scope.row)" size="mini	" v-model="scope.row.value2">
            <el-option v-for="item in option2" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
    </template>
      </el-table-column>
        </el-table>
            <div class='pagination_bar'>
                <mt-pagination @size-change='handleSizeChange'
                     @current-change='handleCurrentChange'
                     :current-page.sync='currentPage'
                     :page-sizes='[10, 20, 30, 40]'
                     :page-size='pagesize'
                     layout='sizes, prev, pager, next'
                     :total='queryObj.totalElements'>
                </mt-pagination>
            </div>
    </div>
  </div>
</template>
<script>
import ProjectConfigTabel from "@/views/cost/projectConfig/projectConfigTabel";
import {
  projectConfigList,
  typechange,
  updateIsAssDynaCost,
  updateIsFinancialSharing
} from "@/api/cost/projectConfigTabel";
import { LoadingUtil } from "@/utils/common/LoadingUtil";
import { tableHeight } from "@/utils/common/index";
export default {
  data() {
    return {
      search: "查询",
      searchflag: false,
      formInline: {
        name: ""
      },
      list: {},
      pagesize: 20,
      currentPage: 1,
      num: "",
      name: "",
      projectname: this.proname,
      total: null,
      queryObj: {},
      option: [
        {
          value: "是",
          label: "是"
        },
        {
          value: "否",
          label: "否"
        }
      ],
      option1: [
        {
          value: "是",
          label: "是"
        },
        {
          value: "否",
          label: "否"
        }
      ],
      option2: [
        {
          value: "是",
          label: "是"
        },
        {
          value: "否",
          label: "否"
        }
      ]
    };
  },
  components: {
    ProjectConfigTabel
  },
  computed: {
    tHeight: function() {
      let options = {
        fullHeight: this.$store.getters.fullHeight - 500,
        opened: this.$store.getters.sidebar.opened,
        showForm: this.$store.getters.showForm,
        obj: this
      };
      return `${tableHeight(options)}px`;
    }
  },
  mounted() {
    // alert('445646546')
    this.getlist();
  },
  methods: {
    reset() {
      this.formInline.name = "";
      this.getlist();
    },
    onSubmit() {
      this.getlist();
    },
    // 查询显示隐藏事件
    searc() {
      this.searchflag = !this.searchflag;
      if (this.searchflag == false) {
        this.search = "查询";
      } else {
        this.search = "隐藏";
      }
    },
    change(row) {
      // console.log(row.value)
      if (row.value == "是") {
        this.num = "0";
      } else {
        this.num = "1";
      }
      this.typechange(this.num, row.projectId);
    },
    change1(row) {
      // console.log(row.value1)
      if (row.value1 == "是") {
        this.num = "1";
      } else {
        this.num = "0";
      }
      // console.log(this.num);
      this.updateIsAssDynaCost(this.num, row.projectId);
    },
    change2(row) {
      // console.log(row.value1)
      if (row.value2 == "是") {
        this.num = "1";
      } else {
        this.num = "0";
      }
      // console.log(this.num);
      this.updateIsFinancialSharing(this.num, row.projectId);
    },
    handleSizeChange(val) {
      this.currentPage = val;
      // console.log(this.currentPage);
      this.getlist();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      // console.log(this.currentPage);
      this.getlist();
    },
    typechange(num, id) {
      let param = {
        isSuppStatus: num,
        projectId: id
      };
      LoadingUtil.showLoading();
      typechange(param)
        .then(res => {
          // console.log(res);
          this.getlist();
          LoadingUtil.hideLoading();
          this.$showSuccess(res.message);
        })
        .catch(error => {
          // console.log(error);
          this.$showError(error.message ? error.message : "msg_system_error");
        });
    },
    updateIsFinancialSharing(num,id){
      let param = {
        isFinancialSharing: num,
        projectId: id
      };
      LoadingUtil.showLoading();
      updateIsFinancialSharing(param).then(res=>{
        this.getlist();
        LoadingUtil.hideLoading();
        this.$showSuccess(res.message);
      }).catch(error=>{
        this.$showError(error.message ? error.message : "msg_system_error");
      })
    },
    updateIsAssDynaCost(num, id) {
      let param = {
        isAssDynaCost: num,
        projectId: id
      };
      LoadingUtil.showLoading();
      updateIsAssDynaCost(param)
        .then(res => {
          // console.log(res);
          this.getlist();
          LoadingUtil.hideLoading();
          this.$showSuccess(res.message);
        })
        .catch(error => {
          // console.log(error);
          this.$showError(error.message ? error.message : "msg_system_error");
        });
    },
    getlist() {
      let param = {
        projectName: this.formInline.name,
        pageNum: this.currentPage,
        pageSize: this.pagesize
      };
      projectConfigList(param).then(res => {
        let data = res.data;
        data.content.forEach(item => {
          // console.log(item);
          if (item.isSuppStatus == "0") {
            item.value = "是";
          } else {
            item.value = "否";
          }
          if (item.isAssDynaCost == "1") {
            item.value1 = "是";
          } else {
            item.value1 = "否";
          }
          if (item.isFinancialSharing == "1") {
            item.value2 = "是";
          } else {
            item.value2 = "否";
          }
        });
        // console.log(data);
        this.queryObj = data;
      });
    }
  }
};
</script>
<style scoped>
.top_container {
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
  overflow: hidden;
}
.top_btn {
  float: right;
}
.form {
  width: 100%;
  background: #f5f7fa;
  padding: 18px 0 0 0;
  box-sizing: border-box;
  margin-bottom: 10px;
  /* display: flex; */
}
.flex {
  float: right;
}
</style>
