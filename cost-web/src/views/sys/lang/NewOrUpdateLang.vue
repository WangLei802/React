<template>
  <div>
    <el-row>
      <el-form :model="langModel" status-icon :rules='rules' ref="langModel" label-width='150px' >

        <el-col :span="12">
          <el-form-item :label='this.$ls("lbl_application_name")'>
          <fd-applicationselect v-model="langModel.appCode"></fd-applicationselect>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item :label='this.$ls("lbl_lang_code")' prop="langCode">
          <el-input v-model='langModel.langCode' :placeholder='this.$l("lbl_lang_code")'></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item :label='this.$ls("lbl_text")' prop="langText">
          <el-input v-model='langModel.langText' :placeholder='this.$l("lbl_text")'></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item :label='this.$ls("lbl_lang_type")' prop="langType">
          <el-select v-model='langModel.langType' :placeholder='this.$l("lbl_lang_type")'>
          <el-option v-for='item in options_1' :key='item.dictValue' :label='item.dictLabel' :value='item.dictValue'>
          </el-option>
          </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item :label='this.$ls("lbl_remark")' prop="remarks" >
          <el-input type='textarea' v-model='langModel.remarks' :placeholder='this.$l("lbl_remark")'></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="24" class="detail-button-box">
          <el-button type='primary' @click='onSubmit("langModel")' v-bind:disabled="disInput" >{{this.$l('btn_save')}}</el-button>
          <el-button @click='cancel' >{{this.$l('btn_back')}}</el-button>
        </el-col>
      </el-form>
    </el-row>
  </div>
</template>
<script >
import { saveLang, updateLang, getLangDetail } from '@/api/sys/i18nAPI'
import { ptn } from '@/utils/common/validate'
import FdApplicationselect from '../../../components/platform/ApplicationSelect/fd-applicationselect'
export default {
  components: {
    FdApplicationselect
  },
  data() {
    var validateLangText = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$l('msg_lang_text')))
      } else if (value.length < 1 || value.length > 200) {
        callback(new Error(this.$l('msg_lang_text')))
      } else {
        callback()
      }
    }
    var checkRemarks = (rule, value, callback) => {
      if (value && value.length > 200) {
        callback(new Error(this.$l('msg_remark')))
      } else {
        callback()
      }
    }
    return {
      langModel: {
        id: '',
        index: '',
        langCode: '',
        langText: '',
        langType: 'cn',
        langTypeDesc: '',
        updateDate: '',
        remarks: '',
        version: '',
        appCode: ''
      },
      disInput: false,
      options_1: [
        { dictValue: '', dictLabel: '' },
        { dictValue: 'en', dictLabel: 'English' },
        { dictValue: 'cn', dictLabel: '中文' }
      ],
      rules: {
        langCode: [{ pattern: ptn.en_line(5, 100), message: this.$l('msg_lang_code'), required: true, trigger: 'blur' }],
        langText: [{ required: true, validator: validateLangText, trigger: 'blur' }],
        langType: [{ message: this.$l('msg_lang_type'), required: true, trigger: 'change' }],
        remarks: [{ validator: checkRemarks, trigger: 'blur' }]
      }
    }
  },
  mounted: function() {
    this.langModel.id = this.$route.query.id ? this.$route.query.id : ''
    if (this.langModel.id !== '') {
      getLangDetail(this.langModel.id).then(response => {
        this.langModel = response.data
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
          if (this.langModel.id === '') {
            saveLang(this.langModel)
              .then(response => {
                this.$router.push({
                  name: 'LangList'
                })
                this.$showSuccess(response.message)
              })
              .catch(error => {
                this.disInput = false
                console.log(error)
              })
          } else {
            updateLang(this.langModel)
              .then(response => {
                this.$router.push({
                  name: 'LangList'
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
        name: 'LangList'
      })
    }
  }
}
</script>
<style scoped>
@import '../../../styles/detail.scss';
</style>
