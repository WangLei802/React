<!-- IneffectiveCostTable -->
<template>
    <div ref="ineffectiveCostTable">
        <el-table :data="queryObj.content" stripe border size="small" style="width: 100%" :height="680">
            <!-- 项目编号 -->
            <el-table-column prop="projectId" :label="'项目编号'" show-overflow-tooltip>
                <template slot-scope="scope">
              {{ scope.row.projectId}}
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
</template>

<script>
import { LoadingUtil } from "@/utils/common/LoadingUtil";
import { tableHeight } from "@/utils/common/index";
import { projectConfigList, typechange } from "@/api/cost/projectConfigTabel";
export default {
  props: {
    proname: {
      type: String
    }
  },
  filters: {},
  data() {
    return {
      num: "",
      name: "",
      projectname: this.proname,
      pagesize: 20,
      currentPage: 1,
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
      ]
    };
  },
  watch: {
    projectname(newName, oldName) {
      //   if (newName != oldName) {
      console.log(this.projectname);
      console.log(newName + oldName);
      //   }
    }
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
  methods: {
    change(row) {
      if (row.value == "是") {
        this.num = "0";
      } else {
        this.num = "1";
      }
      this.typechange(this.num, row.projectId);
    },
    change1(row) {
      if (row.value1 == "是") {
        this.num = "1";
      } else {
        this.num = "0";
      }
      console.log(this.num);
      this.typechange(this.num, row.projectId);
    },
    handleSizeChange(val) {
      this.currentPage = val;
      console.log(this.currentPage);
      this.getlist();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      console.log(this.currentPage);
      this.getlist();
    },
    typechange(num, id) {
      let param = {
        isAssDynaCost: num,
        projectId: id
      };
      typechange(param)
        .then(res => {
          console.log(res);
          this.getlist();
          this.$showSuccess(res.message);
        })
        .catch(error => {
          console.log(error);
          this.$showError(error.message ? error.message : "msg_system_error");
        });
    },
    getlist() {
      let param = {
        projectName: this.name,
        pageNum: this.currentPage,
        pageSize: this.pagesize
      };
      projectConfigList(param).then(res => {
        let data = res.data;
        data.content.forEach(item => {
          // console.log(item);
          if (item.isSuppStatus == 0) {
            item.value = "是";
          } else {
            item.value = "否";
          }
          if (item.isAssDynaCost == 1) {
            item.value1 = "是";
          } else {
            item.value1 = "否";
          }
        });
        console.log(data);
        this.queryObj = data;
      });
    }
  },
  mounted: function() {
    this.getlist();
    console.log(this.$store.getters.fullHeight - 100);
  }
};
</script>
<style lang='scss' scoped>
</style>
