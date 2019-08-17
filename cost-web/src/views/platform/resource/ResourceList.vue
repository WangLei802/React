<template>
  <div class='app-container' :height="pageHeight + 'px'">
    <div style="text-align:right;margin: 10px 10px 0 0">
      <div class="button-area" style="padding: 0;margin-bottom: 8px;">
        <el-button class="ordinary-btn" icon='el-icon-plus' type='primary' @click='add'>{{$l("btn_add")}}</el-button>
        <el-button type='primary' v-show='false' @click='save'>{{$l("btn_save")}}</el-button>
      </div>
    </div>

    <el-row :gutter="10">
      <el-col :span="4">
        <el-input placeholder="输入关键字进行过滤" v-model="filterText"> </el-input>
        <div class="filter-tree" v-bind:style="{height: pageHeight-47 + 'px'}">
          <el-tree check-strictly node-key="id"
                   :data="treeData" highlight-current :props="defaultProps"
                   :filter-node-method="filterNode" ref="menuTree"
                   @node-click="getNodeData" default-expand-all>
          </el-tree>
        </div>
      </el-col>

      <el-col :span="20">
        <ResourceTable :queryObj_passed_in='resourceModel' ref='resourceTable'></ResourceTable>
      </el-col>
    </el-row>

    <!-- Table -->
    <el-dialog title="关联API检索" :visible.sync="relateApiTable" :show-close="true" width="65%">

      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="关联api" name="api"></el-tab-pane>
        <el-tab-pane label="关联api组" name="apigroup"></el-tab-pane>
      </el-tabs>


      <mt-searchform>
        <template slot="buttons">
        </template>

        <template slot="form">
          <el-row>
            <el-col :span="6">
              <el-form-item :label='this.$ls("lbl_application_name")' prop="appCode">
                <fd-applicationselect v-model="queryApiObj.appCode" @change="changeApplication" ></fd-applicationselect>
              </el-form-item>
            </el-col>

            <!--模块名-->
            <el-col :span="6">
              <el-form-item :label='this.$ls("lbl_application_module_name")' prop="moduleId">
                <el-select v-model='queryApiObj.appModuleCode'  :placeholder='this.$l("lbl_application_module_name")' clearable >
                  <el-option v-for='appModule in moduleList' :key='appModule.code' :label='appModule.name' :value='appModule.code'>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="6" v-if="type==0">
              <el-form-item label='API名称'>
                <el-input v-model='queryApiName'></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="6" v-if="type==1">
              <el-form-item label='API组名称'>
                <el-input v-model='queryApiName'></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="6" class="search-btn">
              <el-form-item>
                <el-button type='primary' @click='queryApiByType'>{{$l("btn_search")}}</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </template>

      </mt-searchform>

      <el-table :data="apiTable" row-key="id" @selection-change="handleSelectionChange">
        <el-table-column type="selection" align="center" width="55"></el-table-column>
        <el-table-column property="appName" label="应用" width="100"></el-table-column>
        <el-table-column property="moduleName" label="模块" width="100"></el-table-column>
        <el-table-column v-if="type==0" property="name" label="API名称" width="200"></el-table-column>
        <el-table-column v-if="type==1" property="name" label="API组名称" width="200"></el-table-column>
        <el-table-column property="code" label="API编码"></el-table-column>
        <el-table-column property="endpoint" label="API地址"></el-table-column>
      </el-table>
      <div class='pagination_bar'>
        <mt-pagination @size-change='handleSizeChange' @current-change='handleCurrentChange' :current-page.sync='queryApiObj.pageNum' :page-sizes='[10, 20, 30, 40]' :page-size='queryApiObj.pageSize' layout='sizes, prev, pager, next' :total='queryApiObj.count'>
        </mt-pagination>
      </div>

      <el-button type="primary" @click='saveApiSelected'>确认</el-button>
      <el-button type="cancel" @click='cancel'>{{this.$l('btn_back')}}</el-button>
    </el-dialog>
  </div>
</template>
<script>
  import { getTopMenuList } from '@/api/sys/menuAPI'
  import { getAppList, listGroupApiByMenuId, listApiByMenuId, createResource } from '@/api/platform/resourceAPI'
  import { LoadingUtil } from '@/utils/common/LoadingUtil'
  import ResourceTable from '@/views/platform/resource/ResourceTable'
  import { getApplicationModuleList } from '@/api/platform/applicationModuleAPI'

  export default {
    components: {
      ResourceTable
    },
    data() {
      return {
        moduleList: [],
        type: '0',
        activeName: 'api',
        cascaderOptions: [],
        cascaderOptionsDefaultProps: {
          children: 'children',
          label: 'label'
        },
        relateApiTable: false,
        apiSelected: [],
        filterText: '',
        currentMenu: {},
        queryAppName: '',
        queryModuleName: '',
        queryApiName: '',
        apiTable: [],
        treeData: [],
        defaultProps: {
          children: 'children',
          label: 'menuNameZh'
        },
        queryApiObj: {
          appModuleCode: '',
          appCode: '',
          pageNum: 1,
          pageSize: 10,
          count: 0,
          menuId: 0
        },
        resourceModel: {
          menuId: '',
          pageNum: 0,
          pageSize: 100,
          count: 0
        },
        multipleSelection: [],
        externalData: [],
        pageHeight: '0',
        fullHeight: document.documentElement.clientHeight
      }
    },
    created: function() {
      this.initLeftMenuTree()
    },
    watch: {
      filterText(val) {
        this.$refs.menuTree.filter(val)
      },
      multipleSelection: function() {
        this.apiSelected = []
        for (const i in this.multipleSelection) {
          this.apiSelected.push(this.multipleSelection[i])
        }
      },
      fullHeight(val) {
        this.settingTableHeight()
      }
    },
    mounted: function() {
      this.$nextTick(function() {
        this.settingTableHeight()
      })
      // window.onresize = () => {
      //   return (() => {
      //     this.fullHeight = document.documentElement.clientHeight
      //   })()
      // }
    },
    methods: {
      changeApplication(app) {
        if (app.code === this.queryApiObj.appCode) {
          // 没有发生变化
          return
        }
        this.queryApiObj.appCode = app.code
        this.queryApiObj.moduleId = ''
        // 根据应用名称，查询此应用下的模块
        this.getModuleByApp()
      },
      getModuleByApp() {
        if (!this.queryApiObj.appCode) {
          return
        }
        getApplicationModuleList(this.queryApiObj.appCode)
          .then(response => {
            this.moduleList = response.data
          })
          .catch(error => {
            console.log(error)
          })
      },
      handleClick: function(evt) {
        this.type = evt.index
        this.queryApiByType()
      },
      queryApiByType: function() {
        // 初始化api组
        if (this.type === '1') {
          this.searchApiGroupData()
        } else { // 初始化api
          this.searchApiData()
        }
      },
      searchApiData: function() {
        LoadingUtil.showLoading()
        debugger
        this.queryApiObj.appName = this.queryAppName
        this.queryApiObj.moduleName = this.queryModuleName
        this.queryApiObj.name = this.queryApiName
        this.queryApiObj.menuId = this.currentMenu.id
        this.queryApiObj.moduleCode = this.queryApiObj.appModuleCode

        listApiByMenuId(this.queryApiObj)
          .then(response => {
            LoadingUtil.hideLoading()
            this.apiTable = response.data.content
            this.queryApiObj.count = response.data.totalElements
          })
          .catch(error => {
            console.log(error)
          })
      },
      searchApiGroupData: function() {
        this.queryApiObj.appName = this.queryAppName
        this.queryApiObj.moduleName = this.queryModuleName
        this.queryApiObj.name = this.queryApiName
        this.queryApiObj.menuId = this.currentMenu.id
        listGroupApiByMenuId(this.queryApiObj)
          .then(response => {
            LoadingUtil.hideLoading()
            this.apiTable = response.data.content
            this.queryApiObj.count = response.data.totalElements
          })
          .catch(error => {
            console.log(error)
          })
      },
      settingTableHeight: function() {
        this.pageHeight = this.fullHeight - 162
      },
      reset() {
        this.resourceModel.menuId = ''
      },
      initVM() {
        this.resourceModel.pageNum = 1
        this.resourceModel.count = 0
        this.resourceModel.sortBy = ''
        this.resourceModel.order = -1
      },

      add() {
        if (!this.currentMenu || !this.currentMenu.id) {
          this.$showError('lbl_menu_first')
          return
        }
        if (!this.currentMenu.children || !this.currentMenu.children.length === 0) {
          // TODO 是否限制仅能菜单树叶子节点方可配置资源?
        }
        this.apiSelected = []
        this.relateApiTable = true

        // 加载api或api组数据
        this.queryApiByType()

        // 加载api查询表单数据
        getAppList(this.queryApiObj).then(response => {
          // LoadingUtil.hideLoading()
          var ret = response.data
          var cascaderOptionsData = []
          if (ret) {
            ret.forEach((item, index) => {
              var optsData = {}
              optsData['label'] = item.name
              optsData['value'] = item.name
              // optsData['children'] = []
              cascaderOptionsData.push(optsData)
            })
          }
          this.cascaderOptions = cascaderOptionsData
        })
          .catch(error => {
            console.log(error)
          })
      },
      handleChange(val) {
        this.queryAppName = val[0]
      },
      save() { // 批量保存
        var saveData = []
        var rightResList = this.$refs.resourceTable.tableData
        for (var i in rightResList) {
          var saveRow = {}
          saveRow.menuId = this.currentMenu.id
          saveRow.name = rightResList[i].apiName
          saveRow.apiId = rightResList[i].apiId
          saveData.push(saveRow)
        }
      },
      cancel() {
        this.relateApiTable = false
      },
      filterNode(value, data) {
        if (!value) return true
        return (data.menuNameZh.indexOf(value) !== -1) || (data.menuNameEn.indexOf(value) !== -1)
      },
      getTreeNodeKey(node) {
        return node.id
      },
      initLeftMenuTree() {
        LoadingUtil.showLoading()
        getTopMenuList().then(response => {
          LoadingUtil.hideLoading()
          this.treeData = response.data
        })
      },
      saveApiSelected() {
        if (this.apiSelected.length === 0) {
          this.relateApiTable = false
          return
        }
        let resourcesList = []
        resourcesList.type = this.type
        var savedMap = new Map()
        this.$refs.resourceTable.tableData.forEach((item, index) => {
          savedMap.set(item.apiId, true)
        })

        for (const i in this.apiSelected) {
          if (savedMap.has(this.apiSelected[i].id)) {
            continue
          }

          var appName = this.apiSelected[i].appName || ''
          var moduleName = this.apiSelected[i].moduleName || ''
          var apiName = this.apiSelected[i].name
          var apiCode = this.apiSelected[i].code
          var apiEndpoint = this.apiSelected[i].endpoint
          var apiId = this.apiSelected[i].id
          resourcesList.push({ 'type': this.type, 'name': apiName, 'apiId': apiId, 'menuId': this.resourceModel.menuId })
          // 批量保存==>真实的保存
          var insertResourceRow = {
            editFlag: false,
            appName: appName,
            moduleName: moduleName,
            apiId: apiId,
            menuId: this.resourceModel.menuId,
            name: apiName,
            apiCode: apiCode,
            apiEndpoint: apiEndpoint
          }
          // this.$refs.resourceTable.tableData.push(insertResourceRow)
        }

        createResource(resourcesList).then((response) => {
          if (response.code === '2000') {
            this.$refs.resourceTable.getList()
            this.$showSuccess(response.message || '保存成功')
          } else {
            this.$showError(response.message || '保存失败')
          }
        })
        this.relateApiTable = false
      },
      handleSizeChange(val) {
        this.queryApiObj.pageSize = val
        this.queryApiByType()
      },
      handleCurrentChange(val) {
        this.queryApiObj.pageNum = val
        this.queryApiByType()
      },
      handleSelectionChange(val) {
        this.multipleSelection = val
      },
      getNodeData(data) {
        this.currentMenu = data
        this.resourceModel.menuId = data.id
        this.$refs.resourceTable.getList()
        // this.currentId = data.id
        // this.showElement = true
      }
    }
  }
</script>
<style scoped lang="scss">
  /* @import '../../../styles/list.scss'; */
  .filter-tree {
    height: 100%;
    overflow: auto;
    border: 1px solid #eaeaea;
    .el-tree-node__label{
      font-size: 12px;
    }
  }
</style>
