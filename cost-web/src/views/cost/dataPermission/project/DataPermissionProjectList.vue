<template>
    <div class='app-container'>
        <!--<div class="subTitle">
      <div class="breadcrumb-child">
        <i class="fa fa-folder-open-o"></i>项目权限管理
      </div>
    </div>-->
        <el-row style="height:100%">
            <el-col :span="8"
                    style='margin-top:20px;width: 20%;height:100%; '>
                <el-input size="mini" style="width:90%"
                          placeholder="输入关键字进行过滤"
                          v-model="filterText"></el-input>
                <el-tree  style="overflow:scroll; height:90%; overflow-x: hidden;margin-right: 20px;"
                         class="filter-tree"
                         node-key="id"

                         highlight-current
                         :props="defaultProps"
                         :data="treeData"
                         :filter-node-method="filterNode"
                         :expand-on-click-node="false"
                         ref="orgTree"
                         default-expand-all
                         @node-click="getNodeData"
                         v-loading="loading">
                </el-tree>

            </el-col>
            <el-col :span="16" style="width:80%">
                <!-- 查询条件 -->
                <mt-searchform>
                    <template slot="buttons">
                    </template>
                    <template slot="form">
                        <el-row :inline="true">
                            <el-col :span="8">
                                <el-form-item label='帐号'>
                                    <el-input v-model="queryModel.username"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label='姓名'>
                                    <el-input v-model="queryModel.nickName"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8"
                                    class="search-btn">
                                <el-form-item>
                                    <el-button size="mini"
                                               type="info"
                                               @click='search'>{{$l("btn_search")}}</el-button>
                                    <el-button size="mini"
                                               type="info"
                                               @click='reset'>{{$l("btn_reset")}}</el-button>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </template>
                </mt-searchform>

                <el-row type="flex"
                        justify="end">
                    <el-col :span="2">
                        <el-button size="mini"
                                   type='text'
                                   :disabled="!queryModel.projectCode"
                                   icon="fa fa-floppy-o"
                                   @click='save'
                                   title="保存"></el-button>
                        <el-button size="mini"
                                   type='text'
                                   :disabled="!queryModel.projectCode"
                                   icon="el-icon-setting"
                                   @click='handleEdit'
                                   title="分配用户"></el-button>
                    </el-col>
                </el-row>

                <el-row>
                    <el-table :data="tablePageData"
                              stripe
                              border
                              size="small"
                              :height="tHeight"
                              style="width: 100%"
                              v-loading="tableLoading">
                        <!-- 序号 -->
                        <el-table-column fixed
                                         :label="$l('lbl_no')"
                                         width="80"
                                         type="index"
                                         :index="this.$getTableIndex(this.queryModel)"></el-table-column>
                        <el-table-column prop="username"
                                         label="帐号"></el-table-column>
                        <el-table-column prop="nickName"
                                         label="姓名"></el-table-column>
                        <el-table-column prop="email"
                                         label="邮箱"
                                         show-overflow-tooltip></el-table-column>
                        <el-table-column prop="organization"
                                         label="归属组织"></el-table-column>
                        <el-table-column label="启用">
                            <template slot-scope="scope">
                                <el-checkbox v-model="scope.row.costUser"
                                             :label="scope.row.username">&nbsp;</el-checkbox>
                            </template>
                        </el-table-column>
                    </el-table>

                    <!-- 分页 -->
                    <div class='pagination_bar'
                         v-if="usersByProjectCode.length">
                        <mt-pagination @size-change='handleSizeChange'
                                       @current-change='handleCurrentChange'
                                       :current-page.sync='queryModel.pageNum'
                                       :page-sizes='[10, 20, 30, 40]'
                                       :page-size='queryModel.pageSize'
                                       layout='sizes, prev, pager, next'
                                       :total='queryModel.count'>
                        </mt-pagination>
                    </div>
                </el-row>
            </el-col>
        </el-row>

        <el-dialog v-loading="loading"
                   title="分配数据权限"
                   :visible.sync="showDialog"
                   :show-close="true"
                   width="70%"
                   top="8vh"
                   @close="handleCloseDialog">
            <mt-searchform>
                <template slot="form">
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label='组织'>
                                <!-- TODO 组织树形结构 -->
                                <el-input v-model="dialogQueryModel.projectCode"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label='帐号'>
                                <el-input v-model="dialogQueryModel.username"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label='姓名'>
                                <el-input v-model="dialogQueryModel.nickName"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6"
                                class="search-btn">
                            <el-form-item>
                                <el-button size="mini"
                                           type="info"
                                           @click='dialogSearch'>{{$l("btn_search")}}</el-button>
                                <el-button size="mini"
                                           type="info"
                                           @click='dialogReset'>{{$l("btn_reset")}}</el-button>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </template>
            </mt-searchform>
            <el-table :data="dialogTableData"
                      stripe
                      border
                      v-loading="dialogTableLoading"
                      height="230"
                      size="small"
                      ref="usersByPermissionTable"
                      @selection-change="handleSelectionChange">
                <el-table-column label="操作"
                                 type="selection"
                                 checked="true"></el-table-column>
                <!-- 序号 -->
                <el-table-column fixed
                                 :label="$l('lbl_no')"
                                 width="80"
                                 type="index"
                                 :index="this.$getTableIndex(this.dialogQueryModel)"></el-table-column>
                <el-table-column prop="username"
                                 label="帐号"
                                 width="200"></el-table-column>
                <el-table-column prop="nickName"
                                 label="姓名"
                                 width="100"></el-table-column>
                <el-table-column prop="email"
                                 label="邮箱"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column prop="organization"
                                 label="归属组织"></el-table-column>
            </el-table>
            <!-- 分页 -->
            <div class='pagination_bar'
                 v-if="usersByUserPermission.length">
                <mt-pagination @size-change='handleDialogSizeChange'
                               @current-change='handleDialogCurrentChange'
                               :current-page.sync='dialogQueryModel.pageNum'
                               :page-sizes='[1, 20, 30, 40]'
                               :page-size='dialogQueryModel.pageSize'
                               layout='sizes, prev, pager, next'
                               :total='usersByUserPermission.length'>
                </mt-pagination>
            </div>
            <div style="text-align: center;margin-top: 10px;">
                <el-button size="mini"
                           type='primary'
                           @click='handleConfirm'>{{this.$l('btn_confirm')}}</el-button>
                <el-button size="mini"
                           @click='cancel'>{{this.$l('btn_cancel')}}</el-button>
            </div>
        </el-dialog>

    </div>
</template>
<script>
import { getProjectTree, listUserByProjectCode, saveUsersToProject, getUsersByPermission } from '@/api/cost/dataPermissionAPI'
import { LoadingUtil } from '@/utils/common/LoadingUtil'
import { tableHeight } from '@/utils/common/index'

export default {
  components: {
  },
  data() {
    return {
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'text'
      },
      queryModel: {
        username: '',
        projectCode: '',
        nickName: '',
        type: '',
        pageNum: 1,
        pageSize: 20,
        count: 0
      },
      dialogQueryModel: {
        username: '',
        projectCode: '',
        nickName: '',
        type: '',
        pageNum: 1,
        pageSize: 20,
        count: 0
      },
      saveModel: {
        projectCode: '',
        users: []
      },
      filterText: '',
      usersByProjectCode: [], // 组织下的用户
      usersByUserPermission: [], // 当前用户权限下的用户
      showDialog: false,
      loading: true,
      dialogLoading: false,
      tableLoading: false,
      dialogTableLoading: false,
      selectionUsers: [],
      tempSelectionUsers: []
    }
  },
  created: function() {
    this.initLeftTree()
  },
  methods: {
    initLeftTree() {
      getProjectTree().then(response => {
        this.loading = false
        this.treeData = response.data
      })
    },
    filterNode(value, data) {
      if (!value) return true
      let res = (data.text.indexOf(value) !== -1) || (data.text.indexOf(value) !== -1)
      return res
    },
    getNodeData(data) {
      this.queryModel.projectCode = data.attr.code
      this.queryModel.type = data.type
      this.selectionUsers = []
      this.getList()
    },
    getList() {
      this.tableLoading = true
      listUserByProjectCode(this.queryModel).then(response => {
        if (response.code === '2000') {
          this.tableLoading = false
          this.usersByProjectCode = response.data
          this.queryModel.count = response.data.length
        }
      }).catch(err => {
        console.log(err)
      })
    },
    handleEdit(index, row) {
      this.showDialog = true
      this.getUsersByPermission()
    },
    getUsersByPermission() {
      // 获取当前用户的组织
      this.dialogTableLoading = true
      getUsersByPermission(this.dialogQueryModel).then(res => {
        this.dialogTableLoading = false
        this.usersByUserPermission = res.data
        this.$nextTick(function() {
          if (this.selectionUsers) {
            this.selectionUsers.forEach(user1 => {
              this.usersByUserPermission.forEach(user2 => {
                if (user1.username === user2.username) {
                  this.$refs.usersByPermissionTable.toggleRowSelection(user2)
                }
              })
            })
          }
        })
      })
    },
    cancel() {
      this.showDialog = false
    },
    handleCloseDialog() {
    },
    save() {
      LoadingUtil.showLoading()
      this.saveModel.projectCode = this.queryModel.projectCode
      this.saveModel.users = this.usersByProjectCode.concat(this.selectionUsers)
      saveUsersToProject(this.saveModel).then(res => {
        LoadingUtil.hideLoading()
        if (res.code === '2000') {
          this.$showSuccess(res.message)
        } else {
          this.$showError(res.message)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    reset() {
      this.queryModel.username = ''
      this.queryModel.nickName = ''
      this.queryModel.pageNum = 1
      this.queryModel.pageSize = 20
    },
    search() {
      this.getList()
    },
    handleSizeChange(val) {
      this.queryModel.pageSize = val
      // this.getList()
    },
    handleCurrentChange(val) {
      this.queryModel.pageNum = val
      // this.getList()
    },
    handleConfirm() {
      this.tempSelectionUsers.forEach(item => {
        this.$set(item, 'costUser', true)
      })
      this.selectionUsers = this.tempSelectionUsers
      this.showDialog = false
    },
    handleSelectionChange(val) {
      this.tempSelectionUsers = val
    },
    handleDialogSizeChange(val) {
      this.dialogQueryModel.pageSize = val
    },
    handleDialogCurrentChange(val) {
      this.dialogQueryModel.pageNum = val
    },
    dialogSearch() {
      this.getUsersByPermission()
    },
    dialogReset() {
      this.dialogQueryModel.username = ''
      this.dialogQueryModel.nickName = ''
      this.dialogQueryModel.projectCode = ''
      this.dialogQueryModel.pageNum = 1
      this.dialogQueryModel.pageSize = 20
    }
  },
  computed: {
    count() {
      return (this.queryModel.count = this.selectionUsers.concat(this.usersByProjectCode).length)
    },
    tablePageData() {
      let start = (this.queryModel.pageNum - 1) * this.queryModel.pageSize
      let end = this.queryModel.pageNum * this.queryModel.pageSize
      return this.selectionUsers.concat(this.usersByProjectCode).slice(start, end)
    },
    dialogTableData() {
      let start = (this.dialogQueryModel.pageNum - 1) * this.dialogQueryModel.pageSize
      let end = this.dialogQueryModel.pageNum * this.dialogQueryModel.pageSize
      return this.usersByUserPermission.slice(start, end)
    },
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
  watch: {
    filterText(val) {
      this.$refs.orgTree.filter(val)
    }
  }
}
</script>
<style scoped>
</style>
