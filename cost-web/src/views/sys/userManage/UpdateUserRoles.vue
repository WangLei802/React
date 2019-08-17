<template>
  <div class='app-container'>
    <div class="subTitle">
      <div class="breadcrumb-child">
        <i class="fa fa-folder-open-o"></i>{{this.$l('lbl_allot_role')}}</div>
    </div>
    <el-form :inline="true" class="demo-form-inline">
      <el-row :gutter="20">
        <el-col :span="8"><div class="grid-content bg-purple">
            <el-form-item :label='this.$ls("lbl_userName")'>
                <span>{{userModel.username}}</span>
            </el-form-item>
        </div></el-col>
        <el-col :span="16"><div class="grid-content bg-purple"></div></el-col>
     </el-row>
      <el-row :gutter="20">
        <el-col :span="8"><div class="grid-content bg-purple">
            <el-form-item :label='this.$ls("lbl_nickName")'>
                <span>{{userModel.nickName}}</span>
            </el-form-item>
        </div></el-col>
        <el-col :span="16"><div class="grid-content bg-purple"></div></el-col>
     </el-row>

      <div ref="langTable">
    <el-table ref="multipleTable" :data="tableData" stripe border
    :height="tableHeight" style="width: 70%"

    @selection-change="handleChange"
    >
        <el-table-column type="index" :label="this.$l('lbl_no')" width="80"></el-table-column>
        <el-table-column
            type="selection"
            width="55" >
        </el-table-column>
        <el-table-column prop="roleCode" :label="this.$l('lbl_role_code')" ></el-table-column>
        <el-table-column prop="roleName" :label="this.$l('lbl_role_name')" ></el-table-column>
    </el-table>
    </div>

     <el-form-item>
        <el-button type='primary' @click='saveRoles(tableData)' v-bind:disabled="disInput">{{$l('btn_save')}}</el-button>
        <el-button @click='cancel'>{{$l('btn_cancel')}}</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>
<script>
  import { getUserRoleList, setRoles } from '@/api/sys/roleAPI'
  import { getUserDetail } from '@/api/sys/userManageAPI'
  import { LoadingUtil } from '@/utils/common/LoadingUtil'
  export default {
    data() {
      return {
        userModel: {
          id: '',
          username: '',
          nickName: '',
          version: ''
        },
        disInput: false,
        tableData: [],
        roleCodes: [],
        tableHeight: '0',
        fullHeight: document.documentElement.clientHeight
      }
    },
    mounted: function() {
      this.userModel.id = this.$route.query.id ? this.$route.query.id : ''
      var that = this
      if (this.userModel.id !== '') {
        this.disabledInput = true
        LoadingUtil.showLoading()
        getUserDetail(this.userModel.id).then(response => {
          LoadingUtil.hideLoading()
          that.userModel = response.data
          this.getList()
          this.$nextTick(function() {
            this.settingTableHeight()
          })
        }).catch(error => {
          console.log(error)
        })
      }
      // window.onresize = () => {
      //   return (() => {
      //     window.fullHeight = document.documentElement.clientHeight
      //     this.fullHeight = window.fullHeight
      //   })()
      // }
    },
    methods: {
      handleChange(selection) {
        if (selection !== null) {
          this.roleCodes = []
          selection.map(item => {
            this.roleCodes.push(item.roleCode)
          })
        }
      },
      saveRoles(tableData) {
        console.log(tableData)
        if (tableData !== null) {
          // tableData.map(item =>{
          //     console.log(item);
          //     if(item.isCurr === '1'){
          //         this.roleCodes.push(item.roleCode)
          //     }
          // });
          console.log(this.roleCodes)

          var userRoles = {
            userName: this.userModel.username,
            roleCodes: this.roleCodes
          }
          console.log(userRoles)
          LoadingUtil.showLoading()
          this.disInput = true
          setRoles(userRoles).then(response => {
            LoadingUtil.hideLoading()
            if (response.code === '2000') {
              this.$showSuccess(response.message)
              this.$router.push({
                name: 'UserManageList'
              })
            } else {
              this.disInput = false
              this.$showError(response.message)
            }
          }).catch(error => {
            this.disInput = false
            console.log(error)
          })
        }
      },
      getList() {
        const _this = this
        LoadingUtil.showLoading()

        var userinfo = {
          username: this.userModel.username
        }

        getUserRoleList(userinfo)
          .then(response => {
            LoadingUtil.hideLoading()
            _this.tableData = response.data
            if (_this.tableData) {
              _this.$nextTick(function() {
                _this.tableData.forEach(row => {
                  if (row.isCurr === '1') {
                    this.$refs.multipleTable.toggleRowSelection(row)
                  }
                })
              })
            } else {
              this.$refs.multipleTable.clearSelection()
            }
          })
          .catch(error => {
            console.log(error)
          })
      },
      settingTableHeight: function() {
        const topHeight = this.$refs['langTable'].getBoundingClientRect().top
        this.tableHeight = this.fullHeight - topHeight - 80
        this.$refs['langTable'].style.Height = this.tableHeight + 'px'
      },
      cancel() {
        this.$router.push({
          name: 'UserManageList'
        })
      }
    },
    watch: {
      fullHeight(val) {
        this.settingTableHeight()
      }
    }
  }
</script>
<style scoped>
  @import '../../../styles/list.scss';
</style>
