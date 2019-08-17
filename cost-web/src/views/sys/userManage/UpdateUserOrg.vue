<template>
  <div class='app-container'>
    <!--<div class="subTitle">-->
      <!--<div class="breadcrumb-child">-->
        <!--<i class="fa fa-folder-open-o"></i>用户分配组织架构</div>-->
    <!--</div>-->
    <el-form :inline="true" class="demo-form-inline" label-width="80px">
      <el-row >
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
        <el-tree style="overflow:scroll; height:370px; overflow-x: hidden;" class="filter-tree" check-strictly node-key="orgCode"
                 :data="tableData" highlight-current :props="defaultProps"
                 show-checkbox
                 :default-checked-keys="checkedValues"
                 @check-change="getNodeData"
                 ref="orgTreee"
                 default-expand-all :expand-on-click-node="false">
        </el-tree>
        <!--<tree-grid  :columns="columns" :tree-structure="true" :showCheckbox="showCheckbox" :data-source="tableData"  @sendValue="handleChange">-->
        <!--</tree-grid>-->
      </div>
      <el-form-item class="detail-button-box" style="margin-bottom: -10px;padding-left: 38%">
        <el-button type='primary' @click='saveOrgs(tableData)' v-bind:disabled="disInput">{{$l('btn_save')}}</el-button>
        <el-button @click='cancel'>{{$l('btn_cancel')}}</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>
<script>
  import { setOrgs, getUserOrgList, getCheckedValues } from '@/api/sys/orgAPI'
  import { getUserDetail } from '@/api/sys/userManageAPI'
  import { LoadingUtil } from '@/utils/common/LoadingUtil'
  import TreeGrid from '@/components/sys/treeTable'
  export default {
    components: {
      TreeGrid
    },
    data() {
      return {
        userModel: {
          id: '',
          username: '',
          nickName: '',
          version: ''
        },
        disInput: false,
        checkedValues: [],
        showCheckbox: true,
        columns: [
          {
            text: this.$l('lbl_org_name'),
            dataIndex: 'orgName'
          },
          {
            text: this.$l('lbl_org_code'),
            dataIndex: 'orgCode'
          },
          {
            text: this.$l('lbl_org_incharge'),
            dataIndex: 'orgInCharge'
          }
        ],
        tableData: [],
        orgCodes: [],
        tableHeight: '0',
        fullHeight: document.documentElement.clientHeight,
        defaultProps: {
          children: 'children',
          label: 'orgName'
        }

      }
    },
    mounted: function() {
      this.userModel.id = this.$route.query.id ? this.$route.query.id : ''
      var that = this
      if (this.userModel.id !== '') {
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
      getNodeData() {
        let me = this
        me.checkedValues = this.$refs.orgTreee.getCheckedNodes()
        me.orgCodes = []
        if (me.checkedValues !== null) {
          me.checkedValues.map(item => {
            me.orgCodes.push(item.orgCode)
          })
        }
      },
      saveOrgs(tableData) {
        if (tableData !== null) {
          var userOrgs = {
            userName: this.userModel.username,
            orgCodes: this.orgCodes
          }
          LoadingUtil.showLoading()
          this.disInput = true
          setOrgs(userOrgs).then(response => {
            LoadingUtil.hideLoading()
            if (response.code === '2000') {
              this.$showSuccess(response.message)
              this.$router.push({
                name: 'UserManageList'
              })
            } else {
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
        getUserOrgList(userinfo)
          .then(response => {
            LoadingUtil.hideLoading()
            _this.tableData = response.data
            if (_this.tableData) {
              _this.$nextTick(function() {
                getCheckedValues(userinfo).then(response => {
                  console.log(response.data)
                  _this.checkedValues = response.data
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
<style>
  .app-container #crTable table.el-table__body tr td:nth-child(2) .cell{text-align:left}
  .app-container #crTable table.el-table__header tr th:first-child .cell{display:none}
</style>
