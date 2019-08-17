<template>
  <div>
    <el-row>
      <el-form :model="templateModel" status-icon :rules='rules' ref="templateModel" label-width='150px' >

        <el-col :span="12">
          <el-form-item :label='this.$ls("lbl_template_code")' prop="templateCode">
            <el-input v-model='templateModel.templateCode' :placeholder='this.$l("lbl_template_code")' :disabled="disableCode"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item :label='this.$ls("lbl_template_type")' prop="templateType">
            <el-input v-model='templateModel.templateType' :placeholder='this.$l("lbl_template_type")'></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item :label='this.$ls("lbl_template_name")' prop="templateName">
            <el-input v-model='templateModel.templateName' :placeholder='this.$l("lbl_template_name")'></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item :label='this.$ls("lbl_template_desc")' prop="templateDesc">
            <el-input type='textarea' :autosize="{ minRows: 5, maxRows: 10}" v-model="templateModel.templateDesc" :placeholder='this.$l("lbl_template_desc")'></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item :label='this.$ls("lbl_template_content")' prop="templateContent">
            <el-input type='textarea' :autosize="{ minRows: 5, maxRows: 10}" v-model="templateModel.templateContent" :placeholder='this.$l("lbl_template_content")'></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="24" class="detail-button-box">
          <el-button type='primary' @click='onSubmit("templateModel")' v-bind:disabled="disInput" >{{this.$l('btn_save')}}</el-button>
          <el-button @click='cancel' >{{this.$l('btn_back')}}</el-button>
        </el-col>
      </el-form>
    </el-row>
  </div>
</template>
<script >
  import { createEmaileTemplate, updateEmaileTemplate, queryEmailTemplateDetail } from '@/api/sys/emailTemplateAPI'
  import { Constants, setLocalItem } from '@/utils/common/cache'
  import { ptn } from '@/utils/common/validate'

  export default {
    data() {
      return {
        templateModel: {
          templateCode: '',
          templateType: '',
          templateName: '',
          templateDesc: '',
          templateContent: ''
        },
        disInput: false,
        rules: {
          templateCode: [{ pattern: ptn.en_num(1, 20), message: this.$l('msg_template_code'), trigger: 'blur', required: true }],
          templateType: [{ pattern: ptn.cn_en_num_line(1, 20), message: this.$l('msg_template_type'), trigger: 'blur', required: true }],
          templateName: [{ pattern: ptn.cn_en_num_line(1, 50), message: this.$l('msg_template_name'), trigger: 'blur', required: true }],
          templateDesc: [{ pattern: ptn.all_match(1, 200), message: this.$l('msg_template_desc'), trigger: 'blur', required: true }],
          templateContent: [{ pattern: ptn.all_match(1, 200), message: this.$l('msg_template_content'), trigger: 'blur', required: true }]
        }
      }
    },
    mounted: function() {
      this.templateModel.id = this.$route.query.id ? this.$route.query.id : ''
      if (this.templateModel.id !== '') {
        this.disableCode = true
        queryEmailTemplateDetail(this.templateModel.id).then(response => {
          this.templateModel = response.data
        }).catch(error => {
          console.log(error)
        })
      }
    },
    methods: {
      onSubmit(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.templateModel.id = this.$route.query.id ? this.$route.query.id : ''
            this.disInput = true
            if (this.templateModel.id === '') {
              createEmaileTemplate(this.templateModel)
                .then(response => {
                  this.$router.push({
                    name: 'EmailTemplateList'
                  })
                  this.$showSuccess(response.message)
                })
                .catch(error => {
                  this.disInput = false
                  console.log(error)
                })
            } else {
              updateEmaileTemplate(this.templateModel)
                .then(response => {
                  if (this.templateModel.parameterKey === 'lang.switch') {
                    setLocalItem(Constants.LANGSWITCH, this.templateModel.parameterValue)
                  }
                  if (this.templateModel.parameterKey === 'theme.switch') {
                    setLocalItem(Constants.THEMESWITCH, this.templateModel.parameterValue)
                  }
                  this.$router.push({
                    name: 'EmailTemplateList'
                  })
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
          name: 'EmailTemplateList'
        })
      }
    }
  }
</script>
<style scoped>
  @import '../../../styles/detail.scss';
</style>
