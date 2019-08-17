<template>
  <div>
    <el-row>
      <el-form :model="application" status-icon :rules='application1' ref="application1" label-width='150px'>

        <el-col :span="12">
          <el-form-item :label='this.$ls("lbl_application_name")' prop="name">
          <el-input    v-model='application.name' :placeholder='this.$l("lbl_application_name")'></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item :label='this.$ls("lbl_application_type")' prop="type">
          <fd-select v-model="application.type"  type="pf_application_type" @change="applicationTypeChange"> </fd-select>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item :label='this.$ls("lbl_application_stakeholder")' prop="stakeholder">
          <el-input v-model='application.stakeholder'  :placeholder='this.$l("lbl_application_stakeholder")'></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item :label='this.$ls("lbl_application_stakeholder_phone")' prop="stakeholderPhone">
          <el-input v-model='application.stakeholderPhone'  :placeholder='this.$l("lbl_application_stakeholder_phone")'></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item :label='this.$ls("lbl_application_code")' prop="code">
          <el-input v-model='application.code'  :placeholder='this.$l("lbl_application_code")'></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item :label='this.$ls("lbl_application_route_path")' prop="routePath">
          <el-input v-model='application.routePath'  :placeholder='this.$l("lbl_application_route_path")' :disabled="application.type ==='1'"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item :label='this.$ls("lbl_application_stakeholder_email")' prop="stakeholderEmail">
          <el-input v-model='application.stakeholderEmail'  :placeholder='this.$l("lbl_application_stakeholder_email")'></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item :label='this.$ls("lbl_remark")' prop="remark">
          <el-input type='textarea' v-model='application.remark' :placeholder='this.$l("lbl_remark")'></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="24" class="detail-button-box">
          <el-button type='primary' @click='onSubmit("application1")' v-bind:disabled="disInput">{{this.$l('btn_save')}}</el-button>
          <el-button @click='cancel'>{{this.$l('btn_back')}}</el-button>
        </el-col>
      </el-form>
    </el-row>
  </div>
</template>
<script >
  import { saveApplication, updateApplication, getApplicationDetail } from '@/api/platform/applicationAPI'
  import { LoadingUtil } from '@/utils/common/LoadingUtil'
  import { ptn } from '@/utils/common/validate'
  export default {
    data() {
      return {
        application: {
          id: '',
          name: '',
          code: '',
          type: '0',
          routePath: '',
          stakeholder: '',
          stakeholderEmail: '',
          stakeholderPhone: '',
          remark: '',
          version: ''
        },
        disInput: false,
        application1: {
          name: [{ pattern: ptn.cn_en_num(3, 50), message: this.$l('msg_application_name'), required: true, trigger: 'blur' }],
          code: [{ pattern: ptn.en_num(3, 50), message: this.$l('msg_application_code'), required: true, trigger: 'blur' }],
          routePath: [{ pattern: ptn.en_num_backslash(1, 20), message: this.$l('msg_application_route_path'), required: true, trigger: 'blur' }],
          type: [{ message: this.$l('msg_application_type'), required: true, trigger: 'blur' }],
          stakeholder: [{ pattern: ptn.en_cn_semicolon(1, 100), message: this.$l('msg_application_stakeholder'), required: true, trigger: 'blur' }],
          stakeholderEmail: [{ pattern: ptn.email(0, 50), message: this.$l('msg_application_stakeholder_email'), required: true, trigger: 'blur' }],
          stakeholderPhone: [{ pattern: ptn.phone(), message: this.$l('msg_application_stakeholder_phone'), required: true, trigger: 'blur' }],
          remark: [{ pattern: ptn.all_match(0, 255), message: this.$l('msg_remark'), required: false, trigger: 'blur' }]
        }
      }
    },
    watch: {
      'application.type': function(newVal, oldVal) {
        if (newVal == '1') this.application.routePath = 'ext'
        if (newVal == '0') this.application.routePath = ''
      }
    },
    mounted: function() {
      this.application.id = this.$route.query.id ? this.$route.query.id : ''
      var that = this
      if (this.application.id !== '') {
        LoadingUtil.showLoading()
        getApplicationDetail(this.application.id).then(response => {
          LoadingUtil.hideLoading()
          that.application = response.data
        }).catch(error => {
          console.log(error)
        })
      }
    },
    methods: {

      applicationTypeChange(typeVal) {
        console.log(typeVal)
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
        if (this.application.id === '') {
          saveApplication(this.application)
            .then(response => {
              LoadingUtil.hideLoading()
              if (response.code === '2000') {
                this.$router.push({
                  name: 'ApplicationList'
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
          updateApplication(this.application)
            .then(response => {
              LoadingUtil.hideLoading()
              if (response.code === '2000') {
                this.$router.push({
                  name: 'ApplicationList'
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
          name: 'ApplicationList'
        })
      }
    }
  }
</script>
<style scoped>
  @import '../../../styles/detail.scss';

</style>
