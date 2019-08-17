<template>
  <div class='app-container'>
    <!-- <el-row>
      <el-tabs v-model="activeName"
               @tab-click="handleClick">
        <el-tab-pane label="组织用户"
                     name="first"></el-tab-pane>
        <el-tab-pane label="岗位用户" name="second"></el-tab-pane>
      </el-tabs>
    </el-row> -->
    <el-row>
      <!-- <el-col :span="spans[currentType][0]"
                    style='margin-top: 10px;border: 1px solid #ececec;
    padding: 10px;'
                    v-if="currentType==0">
                <el-input placeholder="输入关键字进行过滤（组织）"
                          v-model="filterText"
                          style="width: 96%"> </el-input>
                <el-tree style="overflow:scroll; height:380px; overflow-x: hidden;margin-right:10px;"
                         class="filter-tree"
                         check-strictly
                         node-key="id"
                         :data="treeData"
                         highlight-current
                         :props="defaultProps"
                         @node-click="getNodeData"
                         :filter-node-method="filterNode"
                         ref="menuTree"
                         :default-expand-all="false"
                         :default-expanded-keys="defaultExpandedKeys"
                         :empty-text="'加载中...'"
                         :expand-on-click-node="false">
                </el-tree>
            </el-col> -->

      <!-- <el-col :span="spans[currentType][0]"
              v-if="currentType==1"
              style="margin-top: 60px;width:19%;border: 1px solid #ececec;">
        <position-table :queryObj_passed_in='positionQueryModel'
                        @initUser="initUser"></position-table>
      </el-col> -->

      <!-- <el-col :span="spans[currentType][1]"
              style='margin-top: 10px;float: right;width:77%'
              :style="{marginLeft:currentType==1?'4%':''}"> -->
      <el-col>
        <mt-searchform>
          <template slot="buttons">
            <!-- <el-button icon='el-icon-plus'
                                   type='primary'
                                   @click='add'>{{$l("btn_add")}}</el-button> -->
          </template>

          <template slot="form">
            <el-row>
              <fd-orgselector v-model="userQueryModel.orgCode"
                              @orgCodeChange="orgCodeChange" />

              <el-col :span="6"
                      class="search-btn">
                <el-form-item>
                  <el-button type="primary"
                             @click='search'>{{$l("btn_search")}}</el-button>
                  <el-button @click='reset'>{{$l("btn_reset")}}</el-button>
                </el-form-item>
              </el-col>

              <el-col :span="6">
                <el-form-item :label='this.$ls("lbl_org_name")'>
                  <el-input v-model='userQueryModel.orgName'
                            placeholder="组织名称"
                            :maxlength='11'></el-input>
                </el-form-item>
              </el-col>

              <el-col :span="6">
                <el-form-item :label='this.$ls("lbl_userName")'>
                  <el-input v-model="userQueryModel.username"
                            placeholder="用户名"
                            :maxlength='20'></el-input>
                </el-form-item>
              </el-col>

              <el-col :span="6">
                <el-form-item :label='this.$ls("lbl_name")'>
                  <el-input v-model='userQueryModel.nickName'
                            placeholder="姓名"
                            :maxlength='20'></el-input>
                </el-form-item>
              </el-col>

              <el-col :span="6">
                <el-form-item :label='this.$ls("lbl_email")'>
                  <el-input v-model='userQueryModel.email'
                            placeholder="电子邮箱"
                            :maxlength='50'></el-input>
                </el-form-item>
              </el-col>

              <el-col :span="6">
                <el-form-item :label='this.$ls("lbl_mobile")'>
                  <el-input v-model='userQueryModel.mobile'
                            placeholder="手机号"
                            :maxlength='11'></el-input>
                </el-form-item>
              </el-col>

              <el-col :span="6">
                <el-form-item :label='$ls("lbl_status")'>
                  <fd-select v-model="userQueryModel.status"
                             type="sys_user_status"
                             placeholder="请选择"
                             clearable> </fd-select>
                </el-form-item>
              </el-col>
            </el-row>
          </template>
        </mt-searchform>
        <UserTable :queryObj_passed_in='userQueryModel'
                   :posOrgType="currentType"
                   ref='UserManageTable'></UserTable>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import UserManageTable from '@/views/sys/userManage/UserManageTable'
import UserTable from '@/views/sys/userManage/UserTable'
import PositionTable from '@/views/sys/userManage/PositionTable'
import {  getTopOrgList, listPositions, setPositions,
  orgPositionList, getOrgName} from '@/api/sys/orgAPI'
import { getValueByKey } from '@/utils/sys/ParameterUtil.js'
import FdOrgselector from '@/components/sys/OrgSelector'
export default {
  components: {
    PositionTable,
    UserManageTable,
    UserTable,
    FdOrgselector
  },
  data () {
    return {
      defaultExpandedKeys: [],//默认展开节点id（当前展开到集团）
      userModel: {},
      positionQueryModel: {
        code: '',
        name: '',
        status: '',
        pageNum: 1,
        pageSize: 20,
        count: 0
      },
      activeName: 'first',
      test: '请输入{test}===={}===',
      posData: [],
      currentType: 0,
      type: getValueByKey('user.link.model') || 1, // 1:岗位在组织下 2：岗位组织无关系
      spans: {        0: [5, 19, 6, 6, 6, 6],
        1: [6, 16, 12, 12]      },
      userQueryModel: {
        username: '',
        nickName: '',
        email: '',
        mobile: '',
        orgName: '',
        status: '',
        pageNum: 1,
        orgCode: '',
        pageSize: 20,
        positionCode: ''
      },
      filterText: '',
      externalData: [],
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'orgName'
      },
      defaultPosProps: {
        children: 'children',
        label: 'name'
      },
      formInline: {
        user: '',
        region: ''
      },
      currentMenu: {}
    }
  },
  mounted () {
  },
  created: function () {
    this.initPosition()
  },
  watch: {
    filterText (val) {
      this.$refs.menuTree.filter(val)
    },
    multipleSelection: function () {
      this.apiSelected = []
      for (const i in this.multipleSelection) {
        this.apiSelected.push(this.multipleSelection[i])
      }
    }
  },
  methods: {
    orgCodeChange (orgItem) {
      this.userQueryModel.orgCode = orgItem.orgCode
    },
    initUser (row, evt, col) {
      // getUsersByPositionCode({ positionCode: row.code })
      // this.userModel = { positionCode: row.code, username: localStorage.getItem('userName') }
      this.userQueryModel.positionCode = row.code
      this.$refs.UserManageTable.getList()
      //
      // alert('position user')
    },
    handleClick (tab, evt) {
      let tabIndex = +tab.index
      this.currentType = tabIndex
      if (tabIndex === 0) {
        // console.log('init position')
        this.initLeftMenuTree()
      } else {
        console.log('init left menu tree')
        this.initPosition({ 'username': localStorage.getItem('userName') })
      }
    },
    initVM () {
      this.userQueryModel.pageNum = 1
    },
    reset () {
      this.userQueryModel.username = ''
      this.userQueryModel.nickName = ''
      this.userQueryModel.email = ''
      this.userQueryModel.mobile = ''
      this.userQueryModel.orgName = ''
      this.userQueryModel.status = ''
      this.userQueryModel.orgCode = ''
    },
    // 获取所有相关的岗位，选中的值为iscurr1
    initPosition (param) {
      // positionListAll(param).then(response => {
      //   this.treeData = response.data
      // })
    },
    // 根据岗位code获取用户
    getUsersByPositionCode (param) {
      // getUsersByPositionCode(param).then(response => {
      //   this.userlist = response.data
      // })
      this.userQueryModel.orgCode = param.orgCode
      this.$refs.UserManageTable.getList()
    },
    // 获取用户已经选择的岗位编码列
    getPositionSelectedCodes () {
      getPositionSelectedCodes().then(response => {
        this.userlist = response.data
      })
    },
    // 根据组织code获取相应的岗位列表
    orgPositionList (param) {
      orgPositionList(param).then(response => {
        this.posData = response.data
      })
    },
    // 获取岗位的组织机构，包括岗位的子岗位
    getOrgName () {
      getOrgName().then(response => {
        this.userlist = response.data
      })
    },
    search () {
      this.initVM()
      this.$refs.UserManageTable.getList()
    },
    add () {
      if (!this.currentMenu || !this.currentMenu.id) {
        this.$showError('lbl_org_first')
        return
      }
      this.$router.push({
        name: 'NewOrUpdateUser',
        query: { orgMenu: this.currentMenu }
      })
    },
    filterNode (value, data) {
      if (!value) return true
      return (data.orgName.indexOf(value) !== -1) || (data.orgName.indexOf(value) !== -1)
    },
    getNodeData (data) {
      // 获取组织下的人员
      this.currentMenu = data
      this.userQueryModel.orgCode = data.orgCode
      this.$refs.UserManageTable.getList()
      // 获取组织下的岗位
    },
    getUserData (data) {
      this.getUsersByPositionCode({ positionCode: data.code })
    }
  }
}
</script>
<style scoped>
</style>

