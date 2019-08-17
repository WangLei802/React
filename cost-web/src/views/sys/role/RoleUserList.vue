<template>
  <div class='app-container'>
    <mt-searchform>
      <template slot="buttons">
        <el-button class="ordinary-btn"
                   icon='el-icon-back'
                   type='primary'
                   @click='back'>{{$l("btn_back")}}</el-button>
        <el-button class="ordinary-btn"
                   icon='el-icon-plus'
                   type='primary'
                   @click='dialogVisible = true'>{{$l("btn_roleToUser")}}</el-button>
      </template>
      <template slot="form">
        <el-row>
          <el-col :span="6">
            <el-form-item :label='this.$ls("lbl_userName")'>
              <el-input v-model="roleUserQueryModel.username"
                        :maxlength='20'></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item :label='this.$ls("lbl_nickName")'>
              <el-input v-model='roleUserQueryModel.nickName'
                        :maxlength='20'></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item :label='this.$ls("lbl_email")'>
              <el-input v-model='roleUserQueryModel.email'
                        :maxlength='50'></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="6"
                  class="search-btn">
            <el-form-item>
              <el-button type='primary'
                         @click='search'>{{$l("btn_search")}}</el-button>
              <el-button @click='reset'>{{$l("btn_reset")}}</el-button>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item :label='this.$ls("lbl_mobile")'>
              <el-input v-model='roleUserQueryModel.mobile'
                        :maxlength='11'></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item :label='this.$ls("lbl_org_name")'>
              <el-input v-model='roleUserQueryModel.orgName'
                        :maxlength='20'></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item :label='$ls("lbl_status")'>
              <fd-select v-model="roleUserQueryModel.status"
                         type="sys_user_status"
                         clearable> </fd-select>
            </el-form-item>
          </el-col>
        </el-row>
      </template>
    </mt-searchform>
    <RoleUserTable :queryObj_passed_in='roleUserQueryModel'
                   ref="roleUserTable"></RoleUserTable>

    <!--对话框-->
    <el-dialog class="dialog"
               :title='$l("lbl_user_select")'
               :visible.sync="dialogVisible"
               @open="openDialog"
               @close="search"
               width="88%">
      <mt-searchform>
        <template slot="buttons">
        </template>
        <template slot="form">
          <el-row>
            <fd-orgselector v-model="addUsersToRoleQueryModel.orgCode"
                            @orgCodeChange="orgCodeChange" />

            <el-col :span="6"
                    class="search-btn">
              <el-form-item>
                <el-button type='primary'
                           @click='searchDialog'>{{$l("btn_search")}}</el-button>
                <el-button @click='resetDialog'>{{$l("btn_reset")}}</el-button>
              </el-form-item>
            </el-col>

            <el-col :span="6">
              <el-form-item :label='this.$ls("lbl_org_name")'>
                <el-input v-model='addUsersToRoleQueryModel.orgName'
                          placeholder="组织名称"
                          :maxlength='11'></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="6">
              <el-form-item :label='this.$ls("lbl_userName")'>
                <el-input v-model="addUsersToRoleQueryModel.username"
                          placeholder="用户名"
                          :maxlength='20'></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="6">
              <el-form-item :label='this.$ls("lbl_nickName")'>
                <el-input v-model='addUsersToRoleQueryModel.nickName'
                          placeholder="姓名"
                          :maxlength='20'></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="6">
              <el-form-item :label='this.$ls("lbl_email")'>
                <el-input v-model='addUsersToRoleQueryModel.email'
                          placeholder="电子邮箱"
                          :maxlength='50'></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="6">
              <el-form-item :label='this.$ls("lbl_mobile")'>
                <el-input v-model='addUsersToRoleQueryModel.mobile'
                          placeholder="手机号"
                          :maxlength='11'></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="6">
              <el-form-item :label='$ls("lbl_status")'>
                <fd-select v-model="addUsersToRoleQueryModel.status"
                           type="sys_user_status"
                           placeholder="请选择"
                           clearable> </fd-select>
              </el-form-item>
            </el-col>

            <el-col :span="6">
            </el-col>

          </el-row>
        </template>
      </mt-searchform>
      <div class="dialog-table"
           ref="addUsersToRoleTable">
        <el-table :data="tableData"
                  stripe
                  border
                  style="width:100%;">
          <el-table-column type="index"
                           :label="this.$l('lbl_no')"
                           width="80"></el-table-column>
          <el-table-column prop="username"
                           :label=" this.$l('lbl_userName')"></el-table-column>
          <el-table-column prop="nickName"
                           :label=" this.$l('lbl_nickName')"></el-table-column>
          <el-table-column prop="email"
                           :label="this.$l('lbl_email')"
                           width="200"></el-table-column>
          <el-table-column prop="mobile"
                           :label="this.$l('lbl_mobile')"
                           width="200"></el-table-column>
          <el-table-column prop="phone"
                           :label="this.$l('lbl_phone')"
                           width="200"></el-table-column>
          <el-table-column prop="orgNames"
                           :label="this.$l('lbl_org_name')"
                           width="250"></el-table-column>
          <el-table-column :label="this.$l('lbl_status')">
            <template slot-scope="scope">
              <fd-label :code="scope.row.status"
                        type="sys_user_status"></fd-label>
            </template>
          </el-table-column>
          <el-table-column :label="this.$l('lbl_operation')"
                           width="150">
            <template slot-scope="scope">
              <el-button type="text"
                         icon="el-icon-plus"
                         @click="bindRoleUser(scope.$index, scope.row)"
                         :title="$l('btn_add')"></el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class='pagination_bar'>
          <mt-pagination @size-change='handleSizeChange'
                         @current-change='handleCurrentChange'
                         :current-page.sync='addUsersToRoleQueryModel.pageNum'
                         :page-sizes='[10, 20, 30, 40]'
                         :page-size='addUsersToRoleQueryModel.pageSize'
                         layout='sizes, prev, pager, next'
                         :total='addUsersToRoleQueryModel.count'>
          </mt-pagination>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getRoleUserUnbindList, bindRoleUser } from '@/api/sys/roleAPI'
import { LoadingUtil } from '@/utils/common/LoadingUtil'
import RoleUserTable from '@/views/sys/role/RoleUserTable'
import FdOrgselector from '@/components/sys/OrgSelector'
export default {
  components: {
    RoleUserTable,
    FdOrgselector
  },
  props: {
  },
  data () {
    return {
      roleUserQueryModel: {
        roleCode: '',
        username: '',
        nickName: '',
        email: '',
        mobile: '',
        orgName: '',
        status: '',
        count: 0,
        pageNum: 1,
        pageSize: 20,
        sortBy: '',
        order: -1,
        roleName: ''
      },
      dialogVisible: false,
      tableData: [],
      addUsersToRoleQueryModel: {
        roleCode: '',
        username: '',
        nickName: '',
        email: '',
        mobile: '',
        orgName: '',
        status: '',
        count: 0,
        pageNum: 1,
        pageSize: 20,
        sortBy: '',
        order: -1,
        roleName: '',
        orgCode: null
      }
    }
  },
  methods: {
    orgCodeChange (orgItem) {
      this.addUsersToRoleQueryModel.orgCode = orgItem.orgCode
    },
    reset () {
      this.roleUserQueryModel.username = ''
      this.roleUserQueryModel.nickName = ''
      this.roleUserQueryModel.email = ''
      this.roleUserQueryModel.mobile = ''
      this.roleUserQueryModel.orgName = ''
      this.roleUserQueryModel.status = ''
    },
    resetDialog () {
      this.addUsersToRoleQueryModel.username = ''
      this.addUsersToRoleQueryModel.nickName = ''
      this.addUsersToRoleQueryModel.email = ''
      this.addUsersToRoleQueryModel.mobile = ''
      this.addUsersToRoleQueryModel.orgName = ''
      this.addUsersToRoleQueryModel.status = ''
      this.addUsersToRoleQueryModel.orgCode = null
    },
    initVM () {
      this.roleUserQueryModel.pageNum = 1
    },
    initVMDialog () {
      this.addUsersToRoleQueryModel.pageNum = 1
    },
    search () {
      this.initVM()
      this.$refs.roleUserTable.getList()
    },
    searchDialog () {
      this.initVMDialog()
      this.getList()
    },

    back () {
      this.$router.push({
        name: 'RoleList'
      })
    },
    openDialog () {
      this.resetDialog()
      this.getList()
    },
    getList () {
      LoadingUtil.showLoading()
      getRoleUserUnbindList(this.addUsersToRoleQueryModel)
        .then(response => {
          LoadingUtil.hideLoading()
          response.data.content.forEach(function (value, index, array) {
            value.orgNames = value.orgNames.join(",")
          })
          this.tableData = response.data.content
          this.addUsersToRoleQueryModel.count = response.data.totalElements
        })
        .catch(error => {
          console.log(error)
        })
    },
    bindRoleUser (index, row) {
      if (row.status != '0') {
        this.$showError('msg_userrole_add_normal_user')
        return
      }
      const body = { roleCode: this.$route.query.roleCode, username: row.username }
      LoadingUtil.showLoading()
      bindRoleUser(body).then(response => {
        LoadingUtil.hideLoading()
        this.$showSuccess(response.message)
        this.getList()
      }).catch(error => {
        console.log(error)
      })
    },
    handleSizeChange (val) {
      this.addUsersToRoleQueryModel.pageSize = val
      this.getList()
    },
    handleCurrentChange (val) {
      this.addUsersToRoleQueryModel.pageNum = val
      this.getList()
    }

  },
  mounted: function () {
    this.roleUserQueryModel.roleCode = this.$route.query.roleCode
    this.roleUserQueryModel.roleName = this.$route.query.roleName
    this.addUsersToRoleQueryModel.roleCode = this.$route.query.roleCode
  }
}
</script>
<style>
.dialog .el-dialog__body {
  padding: 0 20px;
}
</style>
<style scoped>
</style>
