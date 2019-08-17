
<template>
  <div ref="roleTable">
    <el-table :height="tHeight" :data="tableData" stripe border style="width: 100%">
      <el-table-column type="index" :index="this.$getTableIndex(this.queryObj)" :label="this.$l('lbl_no')" width="80"></el-table-column>
      <el-table-column prop="roleCode" :label="this.$l('lbl_role_code')" ></el-table-column>
      <el-table-column prop="roleName" :label="this.$l('lbl_role_name')" ></el-table-column>
      <el-table-column  :label="this.$l('lbl_is_sys')">
        <template slot-scope="scope">
          <fd-label :code="scope.row.isSys" type="sys_yes_no"></fd-label>
        </template>
      </el-table-column>

      <el-table-column  :label="this.$l('lbl_status')">
        <template slot-scope="scope">
          <fd-label :code="scope.row.status" type="sys_role_status"></fd-label>
        </template>
      </el-table-column>
      <el-table-column prop="updatedDate" :label="this.$l('lbl_update_date')" width="200" :formatter='this.$dateFormat("updatedDate")'></el-table-column>

      <el-table-column :label="this.$l('lbl_operation')" width="200">
        <template slot-scope="scope">
          <el-button type="text" icon="el-icon-edit" :title="$l('btn_edit')" @click="editRow(scope.$index, scope.row)"></el-button>
          <el-popover placement="left"  width="auto" trigger="hover" popper-class="role-popover" style="margin-left:10px;">
            <el-row style="margin:-6px;">
             <!-- <el-button class="ordinary-btn"  icon="el-icon-circle-check-outline">{{$l('btn_function_menu')}}</el-button>
              <el-button class="ordinary-btn"  icon="el-icon-setting" style="margin-left:2px;">{{$l('btn_data_permission')}}</el-button>-->
              <el-button class="ordinary-btn"  icon="el-icon-time" @click="updateRoleUsers(scope.$index, scope.row)">{{$l('btn_assign_users')}}</el-button>
              <el-button class="ordinary-btn"  icon="el-icon-setting" style="margin-left:2px;" :title="$l('btn_edit')" @click="roleResAuth(scope.$index, scope.row)">{{$l('btn_assign_permission')}}</el-button>
              <el-button class="ordinary-btn" v-show='scope.row.isSys === "0"' size="small" icon="el-icon-delete"  :title="$l('btn_delete')" @click="deleteRow(scope.$index, scope.row)">{{$l('btn_delete')}}</el-button>
            </el-row>
            <el-button slot="reference"  type="text" icon="el-icon-menu"></el-button>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>
    <div class='pagination_bar'>
      <mt-pagination @size-change='handleSizeChange' @current-change='handleCurrentChange' :current-page.sync='queryObj.pageNum' :page-sizes='[10, 20, 30, 40]' :page-size='queryObj.pageSize' layout='sizes, prev, pager, next' :total='queryObj.count'>
      </mt-pagination>
    </div>
  </div>
</template>
<script>
  import { getRoleList, roleLifecycle, deleteRole } from '@/api/sys/roleAPI'
  import { LoadingUtil } from '@/utils/common/LoadingUtil'
  import { tableHeight } from '@/utils/common/index'
  export default {
    props: {
      queryObj_passed_in: {
        type: Object
      },
      externalData: {
        type: Array,
        default: function() {
          return []
        }
      }
    },
    computed: {
      tHeight: function() {
        let options = {
          fullHeight: this.$store.getters.fullHeight,
          opened: this.$store.getters.sidebar.opened,
          showForm: this.$store.getters.showForm,
          obj: this
        }
        return `${tableHeight(options)}px`
      }
    },
    data() {
      return {
        tableHeight: '0',
        tableData: [],
        queryObj: this.queryObj_passed_in,
        fullHeight: document.documentElement.clientHeight
      }
    },
    methods: {
      editRow(index, rowData) {
        this.$router.push({
          name: 'NewOrUpdateRole',
          query: { id: rowData.id }
        })
      },
      updateRoleUsers(index, rowData) {
        if (rowData.status == '0') {
          this.$router.push({
            name: 'RoleUserList',
            query: { roleCode: rowData.roleCode, roleName: rowData.roleName }
          })
        } else {
          this.$showError('msg_userrole_add_normal_role')
        }
      },
      roleResAuth(index, rowData) {
        this.$router.push({
          name: 'RoleResAuthList',
          query: { roleId: rowData.id, roleCode: rowData.roleCode, roleName: rowData.roleName }
        })
      },
      settingTableHeight: function() {
        const topHeight = this.$refs['roleTable'].getBoundingClientRect().top
        this.tableHeight = this.fullHeight - topHeight - 80
        this.$refs['roleTable'].style.Height = this.tableHeight + 'px'
      },
      getList() {
        LoadingUtil.showLoading()
        getRoleList(this.queryObj)
          .then(response => {
            LoadingUtil.hideLoading()
            response.data.content.map(item => { item.updateDate = new Date(item.updateDate).format() })
            this.tableData = response.data.content
            this.queryObj.count = response.data.totalElements
          })
          .catch(error => {
            console.log(error)
          })
      },
      handleSizeChange(val) {
        this.queryObj.pageSize = val
        this.getList()
      },
      handleCurrentChange(val) {
        this.queryObj.pageNum = val
        this.getList()
      },
      deleteRow(index, row, status) {
        this.$confirm(this.$l('msg_delete_confirm'), this.$l('msg_delete_tips'), {
          confirmButtonText: this.$l('btn_confirm'),
          cancelButtonText: this.$l('btn_cancel'),
          type: 'warning'
        }).then(() => {
          const params = {
            id: row.id
          }
          deleteRole(params)
            .then(response => {
              if (response.code === '2000') {
                this.$showSuccess(response.message)
                this.getList()
              } else {
                this.$showError(response.message)
              }
            })
            .catch(error => {
              console.log(error)
            })
        }).catch(() => {})
      },
      disableOrActivate(index, row, status) {
        const params = {
          username: row.id,
          status: status
        }
        roleLifecycle(params)
          .then(response => {
            if (response.code === '2000') {
              this.$showSuccess(response.message)
              this.getList()
            } else {
              this.$showError(response.message)
            }
          })
          .catch(error => {
            console.log(error)
          })
      }
    },
    mounted: function() {
      this.getList()
      this.$nextTick(function() {
        this.settingTableHeight()
      })
      // window.onresize = () => {
      //   return (() => {
      //     this.fullHeight = document.documentElement.clientHeight
      //   })()
      // }
    },
    watch: {
      fullHeight(val) {
        this.settingTableHeight()
      }
    }
  }
</script>
