<template>
  <div class='app-container'>
    <mt-searchform>
      <template slot="buttons">
        <el-button icon='el-icon-plus' type='primary' @click='add'>{{$l("btn_add")}}</el-button>
      </template>
<!--应用名-->
      <template slot="form">
          <el-row>

            <el-col :span="6">
              <el-form-item :label='this.$ls("lbl_application_name")' prop="appCode">
                <fd-applicationselect v-model="applicationapi.appCode" @change="changeApplication" ></fd-applicationselect>
              </el-form-item>
            </el-col>

<!--模块名-->
            <el-col :span="6">
              <el-form-item :label='this.$ls("lbl_application_module_name")' prop="moduleId">
                <el-select v-model='applicationapi.appModuleCode'  :placeholder='this.$l("lbl_application_module_name")' clearable>
                  <el-option v-for='appModule in moduleList' :key='appModule.code' :label='appModule.name' :value='appModule.code'>
                </el-option>
                </el-select>
              </el-form-item>
            </el-col>


          <!--api组名-->
          <el-col :span="6">
            <el-form-item :label='this.$ls("lbl_api_group")'>
              <el-input v-model='applicationapi.name' :maxlength="50" ></el-input>
            </el-form-item>
          </el-col>

            <!--查询-->
            <el-col :span="6" class="search-btn">
              <el-form-item>
                <el-button type='info' @click='getApplicationAPIList'>{{$l("btn_search")}}</el-button>
                <el-button  @click='reset'>{{$l("btn_reset")}}</el-button>
              </el-form-item>
            </el-col>
        </el-row>
      </template>
    </mt-searchform>
    <ApplicationAPIGroupTable :queryObj_passed_in='applicationapi' ref='applicationAPITable'></ApplicationAPIGroupTable>
  </div>
</template>
<script>
  import ApplicationAPIGroupTable from '@/views/platform/applicationapigroup/ApplicationAPIGroupTable'
  import { getApplicationModuleList } from '@/api/platform/applicationModuleAPI'
  export default {
    components: {
      ApplicationAPIGroupTable
    },
    data() {
      return {
        moduleList: [],
        applicationapi: {
          id: '',
          name: '',
          appCode: '',
          appModuleCode: '',
          count: 0,
          pageSize: 10,
          pageNum: 1
        }
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
      reset() {
        this.applicationapi.appCode = ''
        this.applicationapi.appModuleCode = ''
        this.applicationapi.name = ''
      },
      initVM() {
        this.applicationapi.pageNum = 1
        this.applicationapi.count = 0
        this.applicationapi.sortBy = ''
        this.applicationapi.order = -1
      },
      add() {
        this.$router.push({
          name: 'NewOrUpdateApplicationAPIGroup'
        })
      },
      getApplicationAPIList() {
        this.$refs.applicationAPITable.getList()
      }
    }
  }
</script>
<style scoped>
  @import '../../../styles/list.scss';
</style>
