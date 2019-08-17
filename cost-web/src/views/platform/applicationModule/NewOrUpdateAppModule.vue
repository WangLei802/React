<template>
  <div>
    <el-row>
      <el-form :model="appModuleQueryModel" status-icon :rules='rules' ref="appModuleQueryModel" label-width='150px'>

        <el-col :span="12">
          <el-form-item :label='this.$ls("lbl_application_name")' prop="appCode">
          <template>
          <el-select v-model="appModuleQueryModel.appCode" filterable clearable placeholder="请选择">
          <el-option
          v-for="item in options"
          :key="item.code"
          :label="item.name+'('+item.code+')'"
          :value="item.code">
          </el-option>
          </el-select>
          </template>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item :label='this.$ls("lbl_application_module_name")' prop="name">
          <el-input v-model='appModuleQueryModel.name' :placeholder='this.$l("lbl_application_module_name")'></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item :label='this.$ls("lbl_application_module_code")' prop="code">
          <el-input v-model='appModuleQueryModel.code' :placeholder='this.$l("lbl_application_module_code")'></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label='this.$ls("lbl_app_type")' prop="targetServiceType">
            <fd-radio v-model='appModuleQueryModel.appType'
                      type="pf_app_type"></fd-radio>
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item :label='this.$ls("lbl_description")' prop="remark">
          <el-input type='textarea'  v-model="appModuleQueryModel.remark" :placeholder='this.$l("lbl_description")'></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="24" class="detail-button-box">
          <el-button type='primary' @click='onSubmit("appModuleQueryModel")' v-bind:disabled="disInput">{{this.$l('btn_save')}}</el-button>
          <el-button @click='cancel'>{{this.$l('btn_back')}}</el-button>
        </el-col>
      </el-form>
    </el-row>
  </div>
</template>
<script >
import {
  searchApplicationList,
  createApplicationModule,
  getApplicationModuleDetail,
  updateApplicationModule
} from '@/api/platform/applicationModuleAPI'
import { ptn } from '@/utils/common/validate'
import FdApplicationSelect from '@/components/platform/ApplicationSelect/fd-applicationselect'
export default {
  components: {
    FdApplicationSelect
  },
  data() {
    return {
      options: [],
      appModuleQueryModel: {
        id: '',
        name: '',
        code: '',
        appName: '',
        appCode: '',
        appType: '1',
        remark: '',
        version: ''
      },
      disInput: false,
      rules: {
        name: [{ pattern: ptn.cn_en_num(1, 50), message: this.$l('msg_application_module_name'), trigger: 'blur', required: true }],
        code: [{ pattern: ptn.cn_en_num_line(1, 50), message: this.$l('msg_application_module_code'), trigger: 'blur', required: true }],
        appCode: [{ pattern: ptn.cn_en_num_line(1, 50), message: this.$l('msg_application_type'), trigger: 'blur', required: true }],
        remark: [{ pattern: ptn.all_match(1, 200), message: this.$l('msg_application_module_desc'), trigger: 'blur', required: false }]
      }
    }
  },
  mounted: function() {
    searchApplicationList()
      .then(response => {
        this.options = response.data
      })
      .catch(error => {
        console.log(error)
      })

    this.appModuleQueryModel.id = this.$route.query.id ? this.$route.query.id : ''
    if (this.appModuleQueryModel.id !== '') {
      getApplicationModuleDetail(this.appModuleQueryModel.id).then(response => {
        this.appModuleQueryModel = response.data
      }).catch(error => {
        console.log(error)
      })
    }
  },
  methods: {
    onSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.disInput = true
          if (this.appModuleQueryModel.id === '') {
            createApplicationModule(this.appModuleQueryModel)
              .then(response => {
                this.$router.push({
                  name: 'AppModuleList'
                })
                this.disInput = false
                this.$showSuccess(response.message)
              })
              .catch(error => {
                this.disInput = false
                console.log(error)
              })
          } else {
            updateApplicationModule(this.appModuleQueryModel)
              .then(response => {
                this.$router.push({
                  name: 'AppModuleList'
                })
                this.disInput = false
                this.$showSuccess(response.message)
              })
              .catch(error => {
                this.disInput = false
                console.log(error)
              })
          }
        }
      })
    },
    cancel() {
      this.$router.push({
        name: 'AppModuleList'
      })
    }
  }
}
</script>
<style scoped>
@import '../../../styles/detail.scss';
</style>
