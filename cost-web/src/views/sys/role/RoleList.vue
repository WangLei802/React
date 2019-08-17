<template>
  <div class='app-container'>
    <mt-searchform>
      <template slot="buttons">
        <el-button  icon='el-icon-plus' type='primary' @click='add'>{{$l("btn_add")}}</el-button>
      </template>

      <template slot="form">
        <el-row>
        <el-col :span="6">
          <el-form-item :label='this.$ls("lbl_role_code")'>
          <el-input v-model='roleQueryModel.roleCode' :maxlength="20" ></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item :label='this.$ls("lbl_role_name")'>
          <el-input v-model='roleQueryModel.roleName' :maxlength="20"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item :label='this.$ls("lbl_is_sys")'>
          <fd-select v-model="roleQueryModel.isSys" type="sys_yes_no" clearable> </fd-select>
          </el-form-item>
        </el-col>

        <el-col :span="6" class="search-btn">
          <el-form-item>
          <el-button type='info' @click='getRoleList'>{{$l("btn_search")}}</el-button>
          <el-button  @click='reset'>{{$l("btn_reset")}}</el-button>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item :label='this.$ls("lbl_status")'>
          <fd-select v-model="roleQueryModel.status" type="sys_role_status" clearable> </fd-select>
          </el-form-item>
        </el-col>
        </el-row>
      </template>
    </mt-searchform>
    <RoleTable :queryObj_passed_in='roleQueryModel' ref='roleTable'></RoleTable>
  </div>
</template>
<script>
  import RoleTable from '@/views/sys/role/RoleTable'
  export default {
    components: {
      RoleTable
    },
    data() {
      return {
        roleQueryModel: {
          roleCode: '',
          roleName: '',
          isSys: '',
          status: '',
          pageNum: 1,
          pageSize: 20,
          count: 0
        },
        externalData: []
      }
    },
    methods: {
      reset() {
        this.roleQueryModel.roleCode = ''
        this.roleQueryModel.roleName = ''
        this.roleQueryModel.isSys = ''
        this.roleQueryModel.status = ''
      },
      initVM() {
        this.roleQueryModel.pageNum = 1
        this.roleQueryModel.count = 0
        this.roleQueryModel.sortBy = ''
        this.roleQueryModel.order = -1
      },
      add() {
        this.$router.push({
          name: 'NewOrUpdateRole'
        })
      },
      getRoleList() {
        this.initVM()
        this.$refs.roleTable.getList()
      }
    }
  }
</script>
<style scoped>
  @import '../../../styles/list.scss';
</style>
