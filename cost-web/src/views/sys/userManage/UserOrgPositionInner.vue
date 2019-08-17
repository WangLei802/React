<template>
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
    </el-row >
    <el-row >
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
    <el-col :span="8" style='margin-top: 10px;'>
      <el-input placeholder="输入关键字进行过滤" v-model="filterText" style="width: 96%"> </el-input>
      <el-tree style="overflow:scroll; height:450px; overflow-x: hidden;margin-right:10px;" class="filter-tree" check-strictly node-key="id"
               :data="treeData" highlight-current :props="defaultProps"
               @node-click="getNodeData"
               :filter-node-method="filterNode"
               ref="orgTree" default-expand-all :expand-on-click-node="false">
      </el-tree>
    </el-col>
    <el-col :span="16" >
      <el-tree style="overflow:scroll; height:450px; overflow-x: hidden;margin-right:10px;" class="filter-tree" check-strictly node-key="code"
               :data="posData" highlight-current :props="defaultPosProps"
               show-checkbox
               :default-checked-keys="allSelected"
               @check-change="getPositionNodeData"
               ref="posTree" default-expand-all :expand-on-click-node="false">
      </el-tree>
    </el-col>
    <el-form-item  class="detail-button-box" style="margin-bottom: -10px;padding-left: 38%">
      <el-button type='primary' @click='saveUserPositions()' v-bind:disabled="disInput">{{$l('btn_save')}}</el-button>
      <el-button @click='cancel'>{{$l('btn_cancel')}}</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
  import { setUserPositions, getCheckedCodes } from '@/api/sys/positionAPI'
  import { getUserDetail } from '@/api/sys/userManageAPI'
  import { LoadingUtil } from '@/utils/common/LoadingUtil'
  import { getTopOrgList, orgPositionList } from '@/api/sys/orgAPI'
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
        showCheckbox: true,
        filterText: '',
        treeData: [],
        disInput: false,
        tableData: [],
        positionCodes: [],
        tableHeight: '0',
        fullHeight: document.documentElement.clientHeight,
        currentOrg: {},
        defaultProps: {
          children: 'children',
          label: 'orgName'
        },
        defaultPosProps: {
          children: 'children',
          label: 'name'
        },
        rightData: [],
        columns: [
          {
            text: this.$l('lbl_position_name'),
            dataIndex: 'name'
          },
          {
            text: this.$l('lbl_position_code'),
            dataIndex: 'code'
          }
        ],
        posData: [],
        allSelected: []
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
          this.initLeftMenuTree()
        }).catch(error => {
          console.log(error)
        })
      }
    },
    created: function() {
    },
    methods: {
      handleChange(val) {
        let me = this
        me.positionCodes = []
        console.log(val.length)
        if (val !== null) {
          val.map(item => {
            me.positionCodes.push(item.code)
          })
        }
      },
      initLeftMenuTree() {
        var userinfo = {
          username: this.userModel.username
        }
        getTopOrgList().then(response => {
          this.treeData = response.data
          getCheckedCodes(userinfo).then(response => {
            this.allSelected = response.data
          })
        })
      },
      filterNode(value, data) {
        if (!value) return true
        return (data.orgName.indexOf(value) !== -1) || (data.orgName.indexOf(value) !== -1)
      },
      getNodeData(data) {
        this.orgPositionList({ orgCode: data.orgCode, userName: localStorage.getItem('userName') })
      },
      getPositionNodeData(data) {
        let flag = false
        this.allSelected.map(item => {
          if (item === data.code) {
            this.allSelected.pop(item)
            flag = true
          }
        })
        if (!flag) {
          this.allSelected.push(data.code)
        }
      },
      // 根据组织code获取相应的岗位列表
      orgPositionList(param) {
        orgPositionList(param).then(response => {
          this.posData = response.data
        })
      },
      saveUserPositions(tableData) {
        if (tableData !== null) {
          var userPositions = {
            userName: this.userModel.username,
            positionCodes: this.allSelected
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
      cancel() {
        this.$router.push({
          name: 'UserManageList'
        })
      }
    },
    watch: {
      filterText(val) {
        this.$refs.orgTree.filter(val)
      },
      multipleSelection: function() {
        this.apiSelected = []
        for (const i in this.multipleSelection) {
          this.apiSelected.push(this.multipleSelection[i])
        }
      }
    }
  }
</script>
<style scoped>
  @import '../../../styles/detail.scss';
  @import '../../../styles/list.scss';

</style>
