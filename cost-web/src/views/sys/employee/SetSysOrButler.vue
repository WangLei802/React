<template>
  <div>
    <div class='app-container'>
      <el-form :inline="true" class="demo-form-inline">
        <el-row :gutter="20">
          <el-col :span="8"><div class="grid-content bg-purple">
            <el-form-item :label='this.$ls("lbl_userName")'>
              <span>{{userModel.employeeName}}</span>
            </el-form-item>
          </div></el-col>
          <el-col :span="8"><div class="grid-content bg-purple">
            <el-form-item :label='this.$ls("lbl_nickName")'>
              <span>{{userModel.nickName}}</span>
            </el-form-item>
          </div></el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8"><div class="grid-content bg-purple">
            <el-form-item :label='this.$ls("lbl_email")'>
              <span>{{userModel.email}}</span>
            </el-form-item>
          </div></el-col>
          <el-col :span="8"><div class="grid-content bg-purple">
            <el-form-item :label='this.$ls("lbl_mobile")'>
              <span>{{userModel.mobile}}</span>
            </el-form-item>
          </div></el-col>
        </el-row>
          <template>
            <el-checkbox-group v-model="checkList">
              <el-checkbox label="1" border size="medium">{{$l('lbl_sysadmin')}}</el-checkbox>
              <el-checkbox label="2" border size="medium">{{$l('lbl_butler')}}</el-checkbox>
            </el-checkbox-group>
          </template>
        <el-radio-group v-model="radio1">
          <el-radio :label="1">{{$l('btn_yes')}}</el-radio>
          <el-radio :label="0">{{$l('btn_no')}}</el-radio>
        </el-radio-group>
        <el-form-item class="detail-button-box" style="margin-bottom: -10px;padding-left: 38%">
          <el-button type='primary' @click='save' v-bind:disabled="disInput">{{$l('btn_save')}}</el-button>
          <el-button @click='cancel'>{{$l('btn_cancel')}}</el-button>
        </el-form-item>
      </el-form>

    </div>
  </div>
</template>
<script>
  import { LoadingUtil } from '@/utils/common/LoadingUtil'
  import TreeGrid from '@/components/sys/treeTable'
  import { setUserType, getUserType, getById ,getIsLogin} from '@/api/sys/employeeAPI'
  export default {
    components: {
      TreeGrid
    },
    data() {
      return {
        userModel: {
          id: '',
          employeeName: '',
          nickName: '',
          version: ''
        },
        checkList: [],
        disInput: false,
        tableHeight: '0',
        fullHeight: document.documentElement.clientHeight,
        defaultProps: {
          children: 'children',
          label: 'orgName'
        },
        radio1: ''
      }
    },
    mounted: function() {
      let param = { id: this.$route.query.id }
      LoadingUtil.showLoading()
      getById(param).then(response => {
        LoadingUtil.hideLoading()
        this.userModel = response.data
        this.$nextTick(function() {
          this.settingTableHeight()
        })
      }).catch(error => {
        console.log(error)
      })
      getUserType(param).then(response => {
        LoadingUtil.hideLoading()
        response.data.forEach(li => {
          this.checkList.push(li)
        })
      }).catch(error => {
        console.log(error)
      })
      getIsLogin(param).then(response => {
        LoadingUtil.hideLoading()
        this.radio1 = +(response.data)
      }).catch(error => {
        console.log(error)
      })
    },
    methods: {
      save(index, row) {
        if(this.radio1 === ''){
          this.radio1 = '0'
        }
        const body = { employeeId: this.$route.query.id, types: this.checkList, isLogin: this.radio1}
        LoadingUtil.showLoading()
        setUserType(body).then(response => {
          LoadingUtil.hideLoading()
          this.$showSuccess(response.message)
          this.getList()
        }).catch(error => {
          console.log(error)
        })
        this.$router.push({
          name: 'EmployeeList'
        })
      },
      settingTableHeight: function() {
        const topHeight = this.$refs['langTable'].getBoundingClientRect().top
        this.tableHeight = this.fullHeight - topHeight - 80
        this.$refs['langTable'].style.Height = this.tableHeight + 'px'
      },
      cancel() {
        this.$router.push({
          name: 'EmployeeList'
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
  @import '../../../styles/detail.scss';
  @import '../../../styles/list.scss';
</style>
<style>
  .app-container #crTable table.el-table__body tr td:nth-child(2) .cell{text-align:left}
  .app-container #crTable table.el-table__header tr th:first-child .cell{display:none}
</style>
