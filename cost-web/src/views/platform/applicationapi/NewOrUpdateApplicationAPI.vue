<template>
  <div>
    <el-row>
      <el-form :model="applicationapi" status-icon :rules='applicationapi1' ref="applicationapi" label-width='150px'>

        <el-col :span="12">
          <el-form-item :label='this.$ls("lbl_application_name")' prop="appCode">
            <fd-applicationselect v-model="applicationapi.appCode" @change="changeApplication" ></fd-applicationselect>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item :label='this.$ls("lbl_api_name")' prop="name">
          <el-input v-model='applicationapi.name'  :placeholder='this.$l("lbl_api_name")'></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item :label='this.$ls("lbl_api_code")' prop="code">
          <el-input v-model='applicationapi.code'   :placeholder='this.$l("lbl_api_code")'></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item :label='this.$ls("lbl_application_module_name")' prop="moduleId">
          <el-select v-model='applicationapi.moduleId'  :placeholder='this.$l("lbl_application_module_name")'  @change='generateCode()'>
          <el-option v-for='appModule in moduleList' :key='appModule.id' :label='appModule.name' :value='appModule.id'>
          </el-option>
          </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item :label='this.$ls("lbl_api_endpoint")' prop="endpoint">
          <el-input v-model='applicationapi.endpoint'  :placeholder='this.$l("lbl_api_endpoint")' @change='generateCode()'></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item :label='this.$ls("lbl_api_pubresflag")' prop="pubResFlag">
          <fd-radio  v-model='applicationapi.pubResFlag' :placeholder='this.$l("lbl_api_pubresflag")' type="sys_yes_no" ></fd-radio>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item :label='this.$ls("lbl_remark")' prop="remark">
          <el-input type='textarea' v-model='applicationapi.remark' :placeholder='this.$l("lbl_remark")'></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24" class="detail-button-box">
          <el-button type='primary' @click='onSubmit("applicationapi")' v-bind:disabled="disInput">{{this.$l('btn_save')}}</el-button>
          <el-button @click='cancel'>{{this.$l('btn_back')}}</el-button>
        </el-col>
      </el-form>
    </el-row>
  </div>
</template>
<script >
  import { saveApplicationAPI, updateApplicationAPI, getApplicationAPIDetail } from '@/api/platform/applicationapiAPI'
  import { getApplicationModuleList } from '@/api/platform/applicationModuleAPI'
  import { getApplicationList } from '@/api/platform/applicationAPI'
  import { LoadingUtil } from '@/utils/common/LoadingUtil'
  import { ptn } from '@/utils/common/validate'
  export default {
    data() {
      return {
        isFirst: true,
        applicationapi: {
          id: '',
          name: '',
          code: '',
          endpoint: '',
          appCode: '',
          pubResFlag: '0',
          appName: '',
          moduleId: '',
          moduleName: '',
          remark: '',
          version: ''
        },
        disInput: false,
        applicationapi1: {
          name: [{ message: this.$l('msg_application_api_name'), required: true, trigger: 'blur' }],
          code: [{ pattern: ptn.cn_en_num_colon(3, 50), message: this.$l('msg_application_api_code'), required: true, trigger: 'blur' }],
          endpoint: [{ pattern: ptn.all_match(1, 450), message: this.$l('msg_application_api_endpoint'), required: true, trigger: 'blur' }],
          appCode: [{ message: this.$l('msg_application_api_appname'), required: true, trigger: 'blur' }],
          moduleId: [{ message: this.$l('msg_application_module_select'), required: true, trigger: 'blur' }],
          remark: [{ pattern: ptn.all_match(0, 255), message: this.$l('msg_remark'), required: false, trigger: 'blur' }]
        },
        applicationList: [],
        moduleList: []
      }
    },
    watch: {

    },
    mounted: function() {
      this.applicationapi.id = this.$route.query.id ? this.$route.query.id : ''
      var that = this
      if (this.applicationapi.id !== '') {
        // 修改
        LoadingUtil.showLoading()
        getApplicationAPIDetail(this.applicationapi.id).then(response => {
          LoadingUtil.hideLoading()
          that.applicationapi = response.data
          that.getModuleByApp()
        }).catch(error => {
          console.log(error)
        })
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
              this.generateCode()
            }
          })
          .catch(error => {
            console.log(error)
          })
      },
      generateCode() {
        var moduleCode
        var moduleId = this.applicationapi.moduleId
        if (this.moduleList) {
          var selectModule = this.moduleList.find(item => item.id === moduleId)
          if (selectModule) {
            moduleCode = selectModule.code
          }
        }

        var apiCode = ''
        var appCode = this.applicationapi.appCode
        var apiAddr = this.applicationapi.endpoint
        if (appCode) {
          apiCode = appCode
          if (moduleCode !== '' && moduleCode !== undefined) {
            apiCode = apiCode + ':' + moduleCode
            if (apiAddr !== '' && apiAddr !== undefined) {
              var apiAddr0 = apiAddr.substring(apiAddr.lastIndexOf('/') + 1)
              // 验证url是否是/{}结尾
              if (apiAddr0 && apiAddr0.startsWith('{')) {
                var apiAddr1 = apiAddr.substring(0, apiAddr.lastIndexOf('/'))
                apiAddr = apiAddr1.substring(apiAddr1.lastIndexOf('/') + 1)
              } else {
                apiAddr = apiAddr0
              }

              apiCode = apiCode + ':' + apiAddr
            }
          }
        }

        console.log(apiCode)
        this.applicationapi.code = apiCode
      },
      onSubmit(formName) {
        var validateResult = true
        this.$refs[formName].validate((valid) => {
          if (!valid) {
            validateResult = false
          }
        })
        if (!validateResult) {
          return
        }
        LoadingUtil.showLoading()
        this.disInput = true
        if (this.applicationapi.id === '') {
          saveApplicationAPI(this.applicationapi)
            .then(response => {
              LoadingUtil.hideLoading()
              if (response.code === '2000') {
                this.$router.push({
                  name: 'ApplicationAPIList'
                })
                this.$showSuccess(response.message)
              } else {
                this.disInput = false
                this.$showError(response.message)
              }
            })
            .catch(error => {
              this.disInput = false
              console.log(error)
            })
        } else {
          updateApplicationAPI(this.applicationapi)
            .then(response => {
              LoadingUtil.hideLoading()
              if (response.code === '2000') {
                this.$router.push({
                  name: 'ApplicationAPIList'
                })
                this.$showSuccess(response.message)
              } else {
                this.disInput = false
                this.$showError(response.message)
              }
            })
            .catch(error => {
              this.disInput = false
              console.log(error)
            })
        }
      },
      cancel() {
        this.$router.push({
          name: 'ApplicationAPIList'
        })
      }
    }
  }
</script>
<style scoped>
  @import '../../../styles/detail.scss';
</style>
