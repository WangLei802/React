<template>
  <div class='app-container'>
    <mt-searchform>
      <template slot="buttons">
      </template>

      <template slot="form">
        <el-row>
        <el-col :span="6">
          <el-form-item :label='this.$ls("lbl_userName")'>
          <el-input v-model='employee.employeeName' :maxlength="20" ></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item :label='this.$ls("lbl_employee_type")'>
            <fd-select v-model="employee.type" type="sys_employee_type" clearable> </fd-select>
          </el-form-item>
        </el-col>

          <el-col :span="6">
            <el-form-item :label='this.$ls("lbl_status")'>
              <fd-select v-model="employee.status" type="sys_menu_status" clearable> </fd-select>
            </el-form-item>
          </el-col>

        <el-col :span="6" class="search-btn">
          <el-form-item>
          <el-button type='info' @click='getList'>{{$l("btn_search")}}</el-button>
          <el-button  @click='reset'>{{$l("btn_reset")}}</el-button>
          </el-form-item>
        </el-col>

        </el-row>
      </template>
    </mt-searchform>
    <EmployeeTable :queryObj_passed_in='employee' ref='employeeTable'></EmployeeTable>

  </div>
</template>
<script>
  import EmployeeTable from '@/views/sys/employee/EmployeeTable'
  export default {
    components: {
      EmployeeTable
    },
    data() {
      return {
        employee: {
          employeeName: '',
          employeeType: '',
          isLogin: '',
          status: '',
          pageSize: 10
        },
        externalData: []
      }
    },
    methods: {
      reset() {
        this.employee.employeeName = ''
        this.employee.type = ''
        this.employee.status = ''
      },
      initVM() {
        this.employee.pageNum = 1
        this.employee.count = 0
        this.employee.sortBy = ''
        this.employee.order = -1
      },
      getList() {
        this.initVM()
        this.$refs.employeeTable.getList()
      }
    }
  }
</script>
<style scoped>
  @import '../../../styles/list.scss';
</style>
