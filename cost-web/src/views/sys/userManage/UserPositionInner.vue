<template>
  <el-form :inline="true" class="demo-form-inline" label-width="80px">
    <el-row>
      <el-col :span="6"><div class="grid-content bg-purple">
        <el-form-item :label='this.$ls("lbl_userName")'>
          <span>{{userModel.username}}</span>
        </el-form-item>
      </div></el-col>
      <el-col :span="6"><div class="grid-content bg-purple">
        <el-form-item :label='this.$ls("lbl_nickName")'>
          <span>{{userModel.nickName}}</span>
        </el-form-item>
      </div></el-col>
   </el-row>
   <el-row>
      <el-col :span="6"><div class="grid-content bg-purple">
        <el-form-item :label='this.$ls("lbl_email")'>
          <span>{{userModel.email}}</span>
        </el-form-item>
      </div></el-col>
      <el-col :span="6"><div class="grid-content bg-purple">
        <el-form-item :label='this.$ls("lbl_mobile")'>
          <span>{{userModel.mobile}}</span>
        </el-form-item>
      </div></el-col>
    </el-row>
    <div ref="langTable">
      <el-table ref="multipleTable" :data="tableData" stripe border style="width: 100%"
                @selection-change="handleChange">
        
        <el-table-column type="selection" width="100"></el-table-column>
        <el-table-column type="index" :label="this.$l('lbl_no')" width="120"></el-table-column>
        <el-table-column prop="name" :label="this.$l('lbl_position_name')" width="600"></el-table-column>
        <el-table-column prop="code" :label="this.$l('lbl_position_code')" ></el-table-column>
      </el-table>
    </div>
    <el-form-item  class="detail-button-box" style="margin-bottom: -10px;padding-left: 38%">
      <el-button type='primary' @click='saveUserPositions(tableData)' v-bind:disabled="disInput">{{$l('btn_save')}}</el-button>
      <el-button @click='cancel'>{{$l('btn_cancel')}}</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
  import { listPositionByUser, setUserPositions } from '@/api/sys/positionAPI'
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
        positionCodes: [],
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
          this.positionCodes = []
          selection.map(item => {
            this.positionCodes.push(item.code)
          })
        }
      },
      saveUserPositions(tableData) {
        if (tableData !== null) {
          var userPositions = {
            userName: this.userModel.username,
            positionCodes: this.positionCodes
          }
          LoadingUtil.showLoading()
          this.disInput = true
          setUserPositions(userPositions).then(response => {
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

        listPositionByUser(userinfo)
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
  @import '../../../styles/detail.scss';
  @import '../../../styles/list.scss';

</style>
