<template>
  <div>
    <el-row>
      <el-form :model="parameterModel" status-icon :rules='rules' ref="parameterModel" label-width='150px' >
        <el-col :span="12">
          <el-form-item :label='this.$ls("lbl_application_name")'>
          <fd-applicationselect v-model="parameterModel.appCode"></fd-applicationselect>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item :label='this.$ls("lbl_parameter_name")' prop="name">
          <el-input v-model='parameterModel.name' :placeholder='this.$l("lbl_parameter_name")'></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item :label='this.$ls("lbl_parameter_key")' prop="parameterKey">
          <el-input v-model='parameterModel.parameterKey' :placeholder='this.$l("lbl_parameter_key")'></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item :label='this.$ls("lbl_parameter_value")' prop="parameterValue">
          <el-input v-model='parameterModel.parameterValue' :placeholder='this.$l("lbl_parameter_value")'></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item :label='this.$ls("lbl_is_sys")' prop="isSystem">
          <fd-radio v-model="parameterModel.isSystem" type="sys_yes_no"></fd-radio>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item :label='this.$ls("lbl_remark")' prop="remarks">
          <el-input type='textarea' v-model='parameterModel.remarks' :placeholder='this.$l("lbl_remark")'></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24" class="detail-button-box">
          <el-button type='primary' @click='onSubmit("parameterModel")' v-bind:disabled="disInput" >{{this.$l('btn_save')}}</el-button>
          <el-button @click='cancel' >{{this.$l('btn_back')}}</el-button>
        </el-col>
      </el-form>
    </el-row>
  </div>
</template>
<script >
import { saveParameter, updateParameter, getDetail } from '@/api/sys/paramAPI'
import { Constants, setLocalItem } from '@/utils/common/cache'
import { ptn } from '@/utils/common/validate'
import FdApplicationselect from '../../../components/platform/ApplicationSelect/fd-applicationselect'
import { LoadingUtil } from '../../../utils/common/LoadingUtil';

export default {
  components: {
    FdApplicationselect
  },
  data() {
    return {
      parameterModel: {
        id: '',
        name: '',
        parameterKey: '',
        parameterValue: '',
        isSystem: '1',
        remarks: '',
        appCode: ''
      },
      disInput: false,
      rules: {
        name: [{ pattern: ptn.cn_en_num(1, 20), message: this.$l('msg_param_name'), trigger: 'blur', required: true }],
        parameterKey: [{ pattern: ptn.en_num_point(1, 50), message: this.$l('msg_param_key'), trigger: 'blur', required: true }],
        parameterValue: [{ pattern: ptn.en_num(1, 20), message: this.$l('msg_param_value'), trigger: 'blur', required: true }],
        isSystem: [{ required: true, trigger: 'blur' }],
        remarks: [{ pattern: ptn.all_match(0, 200), message: this.$l('msg_remark'), trigger: 'blur' }]
      }
    }
  },
  mounted: function() {
    this.parameterModel.id = this.$route.query.id ? this.$route.query.id : ''
    if (this.parameterModel.id !== '') {
      getDetail(this.parameterModel.id).then(response => {
        this.parameterModel = response.data
      }).catch(error => {
        console.log(error)
      })
    }
  },
  methods: {
    onSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.parameterModel.id = this.$route.query.id ? this.$route.query.id : ''
          this.disInput = true
          if (this.parameterModel.id === '') {
            saveParameter(this.parameterModel)
              .then(response => {
                this.$router.push({
                  name: 'ParameterList'
                })
                this.$showSuccess(response.message)
              })
              .catch(error => {
                this.disInput = false
                console.log(error)
              })
          } else {
            updateParameter(this.parameterModel)
              .then(response => {
                if (this.parameterModel.parameterKey === 'lang.switch') {
                  setLocalItem(Constants.LANGSWITCH, this.parameterModel.parameterValue)
                }
                if (this.parameterModel.parameterKey === 'theme.switch') {
                  setLocalItem(Constants.THEMESWITCH, this.parameterModel.parameterValue)
                }
                this.$router.push({
                  name: 'ParameterList'
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
        name: 'ParameterList'
      })
    }
  }
}
</script>
<style scoped>
@import '../../../styles/detail.scss';
</style>
