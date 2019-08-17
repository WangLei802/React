<!-- DashboardList -->
<template>
    <div class="app-container">
            <div class="button-area">
                <el-button class="ordinary-btn" icon='el-icon-plus' type='primary' @click='add' v-if="!addUsable.userDataExist || !addUsable.systemDataExist">{{$l("btn_add")}}</el-button>
            </div>

        <el-form :inline="true" class="demo-form-inline">
            <el-form-item :label='this.$ls("lbl_dashboard_title")'>
                <el-input v-model="dashboardQueryModel.title"></el-input>
            </el-form-item>
            <el-form-item :label='this.$ls("lbl_dashboard_type")'>
                <fd-select v-model='dashboardQueryModel.type' type="sys_dashboard_type" :clearable="true"></fd-select>
            </el-form-item>
            <el-form-item :label='this.$ls("lbl_status")'>
                <fd-select v-model='dashboardQueryModel.status' type="sys_widget_status" :clearable="true"></fd-select>
            </el-form-item>
            <el-form-item :label='this.$ls("lbl_dashboard_is_default")' v-show="false">
                <el-checkbox v-model="dashboardQueryModel.isDefault"></el-checkbox>
            </el-form-item>
            <el-form-item>
                <f-button class="special-btn" type='primary' @click='search' label="btn_search"></f-button>
            </el-form-item>
            <el-form-item>
                <f-button class="special-btn" type='primary' @click='reset' label="btn_reset"></f-button>
            </el-form-item>
        </el-form>
        <DashboardTable :queryObj_passed_in='dashboardQueryModel' ref='dashboardTable'></DashboardTable>
    </div>
</template>

<script>
import DashboardTable from '@/views/sys/dashboardManage/DashboardTable'
export default {
  data() {
    return {
      addUsable: {
        userDataExist: false,
        systemDataExist: false
      },
      dashboardQueryModel: {
        title: '',
        type: '',
        status: '',
        isDefault: false,
        pageNum: 1,
        pageSize: 20,
        sortBy: 'id',
        order: -1
      }
    }
  },

  components: {
    DashboardTable
  },
  methods: {
    initlangQueryModel() {
      this.dashboardQueryModel.pageNum = 1
      this.dashboardQueryModel.count = 0
      this.dashboardQueryModel.sortBy = ''
      this.dashboardQueryModel.order = -1
    },
    reset() {
      this.dashboardQueryModel.title = ''
      this.dashboardQueryModel.type = ''
      this.dashboardQueryModel.status = ''
      this.dashboardQueryModel.isDefault = false
    },

    search() {
      this.initlangQueryModel()
      this.$refs.dashboardTable.getList()
    },
    add() {
      this.$router.push({
        name: 'NewOrUpdateDashboard',
        query: this.addUsable
      })
    }
  }
}
</script>
<style lang='scss' scoped>
</style>
