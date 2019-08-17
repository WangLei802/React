<template>
  <div class='app-container'>
    <el-col :span="24" style='margin-top:15px;'>
      <div class="button-area" style="padding: 0;margin-bottom: 8px;">
        <el-button icon='el-icon-plus' type='primary' @click='add'>{{$l("btn_add")}}</el-button>
      </div>
    </el-col>
    <ApplicationAPITable :queryObj_passed_in='queryModel' ref='applicationAPITable'></ApplicationAPITable>
    <!--非关联api-->
    <el-dialog  class="dialog" title="关联API检索" :visible.sync="relateApiTable" :show-close="true" width="65%">
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
                <el-select v-model='queryApiObj.moduleCode'  :placeholder='this.$l("lbl_application_module_name")' clearable>
                  <el-option v-for='appModule in moduleList' :key='appModule.code' :label='appModule.name' :value='appModule.code'>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>


            <!--api组名-->
            <el-col :span="6">
              <el-form-item :label='this.$ls("lbl_api_name")'>
                <el-input v-model='queryApiObj.name' :maxlength="50" ></el-input>
              </el-form-item>
            </el-col>


                <el-col :span="6" class="search-btn">
                  <el-form-item>
                    <el-button type='primary' @click='searchApiData'>{{$l("btn_search")}}</el-button>
                    <el-button @click='reset'>{{$l("btn_reset")}}</el-button>
                  </el-form-item>
                </el-col>
              </el-row>
            </template>
      </mt-searchform>
      <el-table :data="apiTable" row-key="id" @selection-change="handleSelectionChange">
        <el-table-column type="selection" align="center" width="55"></el-table-column>
        <el-table-column property="appName" label="应用" width="100"></el-table-column>
        <el-table-column property="moduleName" label="模块" width="100"></el-table-column>
        <el-table-column property="name" label="API名称" width="200"></el-table-column>
        <el-table-column property="code" label="API编码"></el-table-column>
        <el-table-column property="endpoint" label="API地址"></el-table-column>
      </el-table>
      <div class='pagination_bar'>
        <mt-pagination @size-change='handleSizeChange' @current-change='handleCurrentChange'
                       :current-page.sync='queryApiObj.pageNum' :page-sizes='[10, 20, 30, 40]'
                       :page-size='queryApiObj.pageSize' layout='sizes, prev, pager, next' :total='queryApiObj.count'>
        </mt-pagination>
      </div>
      <el-button type="primary" @click='saveApiSelected'>确认</el-button>
      <el-button type="cancel" @click='cancel'>{{this.$l('btn_back')}}</el-button>
    </el-dialog>
  </div>
</template>

<script>
  import ApplicationAPITable from '@/views/platform/applicationapigroup/ApplicationAPITable'
  import { getAppList } from '@/api/platform/resourceAPI'
  import { notExistApiList, addApi } from '@/api/platform/apiGroupAPI'
  import { LoadingUtil } from '@/utils/common/LoadingUtil'
  import { getApplicationModuleList } from '@/api/platform/applicationModuleAPI'

  export default {
    components: {
      ApplicationAPITable
    },
    data() {
      return {
        multipleSelection: [],
        queryApiObj: {
          pageNum: 1,
          pageSize: 10,
          count: 0,
          groupId: this.$route.query.groupId,
          moduleCode: '',
          name: '',
          appCode: '',
          appModuleCode: ''
        },
        queryModuleName: '',
        queryAppName: '',
        cascaderOptions: [],
        cascaderOptionsDefaultProps: {
          children: 'children',
          label: 'label'
        },
        apiTable: [],
        moduleList: [],
        queryModel: {
          appCode: '',
          appModuleCode: '',
          name: '',
          count: 0,
          pageSize: 10,
          pageNum: 1,
          groupId: this.$route.query.groupId
        },
        applicationapi: {
          id: '',
          name: '',
          code: '',
          appCode: '',
          appModuleCode: '',
          count: 0,
          pageSize: 10,
          pageNum: 1
        },
        externalData: [],
        relateApiTable: false
      }
    },
    methods: {
      changeApplication(app) {
        if (app.code === this.applicationapi.appCode) {
          // 没有发生变化
          return
        }
        this.applicationapi.appCode = app.code
        this.applicationapi.moduleId = ''
        // 根据应用名称，查询此应用下的模块
        this.getModuleByApp()
      },
      getModuleByApp() {
        if (!this.applicationapi.appCode) {
          return
        }
        getApplicationModuleList(this.applicationapi.appCode)
          .then(response => {
            this.moduleList = response.data
            if (this.applicationapi.moduleId === '' && this.moduleList.length > 0) {
              // 只有在切换应用的时候才会进来，初始化不会进来
              this.applicationapi.moduleId = this.moduleList[0].id
            }
          })
          .catch(error => {
            console.log(error)
          })
      },
      handleSizeChange(val) {
        this.queryApiObj.pageSize = val
        this.searchApiData()
      },
      handleCurrentChange(val) {
        this.queryApiObj.pageNum = val
        this.searchApiData()
      },
      saveApiSelected() {
        if (this.apiSelected.length === 0) {
          this.relateApiTable = false
          return
        }
        var apiIdList = []
        var savedMap = new Map()
        this.$refs.applicationAPITable.tableData.forEach((item, index) => {
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
          apiIdList.push(this.apiSelected[i].id)
          var insertResourceRow = {
            editFlag: true,
            appName: appName,
            moduleName: moduleName,
            id: apiId,
            // menuId: this.resourceModel.menuId,
            name: apiName,
            apiCode: apiCode,
            endpoint: apiEndpoint
          }
          debugger
          this.$refs.applicationAPITable.tableData.push(insertResourceRow)
        }
        // 保存数据
        addApi({ apiGroupId: this.$route.query.groupId, apiIdList: apiIdList }).then((response) => {
          if (response.code === '2000') {
            this.$showSuccess(response.message || '保存成功')
          } else {
            this.$showError(response.message || '保存失败')
          }
        })
        this.relateApiTable = false
      },
      reset() {
        this.queryApiObj.appCode = ''
        this.queryApiObj.moduleCode = ''
        this.queryApiObj.name = ''
      },
      initVM() {
        this.queryModel.pageNum = 1
        this.queryModel.count = 0
        this.queryModel.sortBy = ''
        this.queryModel.order = -1
      },
      handleSelectionChange(val) {
        this.multipleSelection = val
      },
      add() {
        this.apiSelected = []
        this.relateApiTable = true
        // 加载api数据
        this.searchApiData()
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
      searchApiData() {
        LoadingUtil.showLoading()
        this.queryApiObj.appName = this.queryAppName
        this.queryApiObj.moduleName = this.queryModuleName
        // 获取非关联的api
        notExistApiList(this.queryApiObj)
          .then(response => {
            LoadingUtil.hideLoading()
            this.apiTable = response.data.content
            this.queryApiObj.count = response.data.totalElements
          })
          .catch(error => {
            console.log(error)
          })
      },
      cancel() {
        this.relateApiTable = false
      },
      getApplicationAPIList() {
        this.$refs.applicationAPITable.getList()
      }
    },
    watch: {
      multipleSelection: function() {
        this.apiSelected = []
        for (const i in this.multipleSelection) {
          this.apiSelected.push(this.multipleSelection[i])
        }
      }
    },
    mounted: function() {
    }
  }
</script>
<style scoped>
  @import '../../../styles/list.scss';
</style>
