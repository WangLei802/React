<template>
  <div class='app-container'>
    <mt-searchform>
      <template slot="buttons">
        <el-button icon='el-icon-plus' type='primary' @click='add'>{{$l("btn_add")}}</el-button>
      </template>

      <template slot="form">
        <el-row>
        <el-col :span="6">
          <el-form-item :label='this.$ls("lbl_application_name")'>
          <el-input v-model='queryModel.appName'  :maxlength="50" ></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item :label='this.$ls("lbl_application_code")'>
          <el-input v-model='queryModel.appCode' :maxlength="50" ></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item :label='this.$ls("lbl_application_module_name")'>
          <el-input v-model='queryModel.moduleName' :maxlength="50" ></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="6" class="search-btn">
          <el-form-item>
          <el-button type='info' @click='getApplicationAPIList'>{{$l("btn_search")}}</el-button>
          <el-button  @click='reset'>{{$l("btn_reset")}}</el-button>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item :label='this.$ls("lbl_api_endpoint")'>
          <el-input v-model='queryModel.endpoint' :maxlength="50" ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item :label='this.$ls("lbl_api_pubresflag")'>
          <fd-select v-model="queryModel.pubResFlag" type="pf_application_api_pubResFlag" clearable > </fd-select>
          </el-form-item>
        </el-col>
        </el-row>
      </template>
    </mt-searchform>
    <ApplicationAPITable :queryObj_passed_in='queryModel' ref='applicationAPITable'></ApplicationAPITable>
  </div>
</template>
<script>
  import ApplicationAPITable from '@/views/platform/applicationapi/ApplicationAPITable'
  export default {
    components: {
      ApplicationAPITable
    },
    data() {
      return {
        queryModel: {
          appName: '',
          appCode: '',
          moduleName: '',
          endpoint: '',
          pubResFlag: '',
          count: 0,
          pageSize: 10,
          pageNum: 1
        },
        externalData: []
      }
    },
    methods: {
      reset() {
        this.queryModel.appName = ''
        this.queryModel.appCode = ''
        this.queryModel.moduleName = ''
        this.queryModel.endpoint = ''
        this.queryModel.pubResFlag = ''
      },
      initVM() {
        this.queryModel.pageNum = 1
        this.queryModel.count = 0
        this.queryModel.sortBy = ''
        this.queryModel.order = -1
      },
      add() {
        this.$router.push({
          name: 'NewOrUpdateApplicationAPI'
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
