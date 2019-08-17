<template>
  <div>

    <el-form :model="dictionaryTypeModel" status-icon :rules='rules' ref="dictionaryTypeModel" label-width='150px' >
      <el-row>
        <el-col :span="12">
          <el-form-item :label='this.$ls("lbl_application_name")'>
            <fd-applicationselect v-model="dictionaryTypeModel.appCode"></fd-applicationselect>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item :label='this.$ls("lbl_dict_name")' prop="dictName">
            <el-input v-model='dictionaryTypeModel.dictName' :placeholder='this.$l("lbl_dict_name")'></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item :label='this.$ls("lbl_dict_type")' prop="dictType">
            <el-input v-model='dictionaryTypeModel.dictType' :placeholder='this.$l("lbl_dict_type")' :disabled="disCode"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item :label='this.$ls("lbl_is_sys")' prop="isSys">
            <fd-radio  v-model='dictionaryTypeModel.isSys' :placeholder='this.$l("lbl_is_sys")' type="sys_yes_no" ></fd-radio>
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item :label='this.$ls("lbl_remark")' prop="remarks">
            <el-input type='textarea' v-model='dictionaryTypeModel.remarks' :placeholder='this.$l("lbl_remark")'></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="24" class="detail-button-box">
          <el-button type='primary' @click='onSubmit("dictionaryTypeModel")' v-bind:disabled="disInput">{{this.$l('btn_save')}}</el-button>
          <el-button @click='cancel'>{{this.$l('btn_back')}}</el-button>
        </el-col>
      </el-row>
    </el-form>

  </div>
</template>
<script >
import { createDictionaryType, updateDictionaryType, getDictionaryTypeDetail
} from '@/api/sys/dictionaryAPI'
import { ptn } from '@/utils/common/validate'
import FdApplicationselect from '../../../components/platform/ApplicationSelect/fd-applicationselect'

export default {
  components: {
    FdApplicationselect
  },
  data() {
    return {
      dictionaryTypeModel: {
        id: '',
        dictName: '',
        dictType: '',
        status: '',
        isSys: '1',
        updateTime: '',
        remarks: '',
        appCode: ''
      },
      disInput: false,
      disCode: false,
      rules: {
        dictName: [{ pattern: ptn.cn_en_num(1, 20), message: this.$l('msg_dict_name'), required: true, trigger: 'blur' }],
        dictType: [{ pattern: ptn.en_line(5, 50), message: this.$l('msg_dict_type'), required: true, trigger: 'blur' }],
        isSys: [{ required: true, message: this.$l('msg_is_sys'), trigger: 'blur' }],
        remarks: [{ pattern: ptn.all_match(0, 200), message: this.$l('msg_remark'), trigger: 'blur' }]
      }
    }
  },
  mounted: function() {
    this.dictionaryTypeModel.id = this.$route.query.id ? this.$route.query.id : ''
    var that = this
    if (this.dictionaryTypeModel.id !== '') {
      this.disCode = true
      getDictionaryTypeDetail(this.dictionaryTypeModel.id).then(response => {
        that.dictionaryTypeModel = response.data
      }).catch(error => {
        console.log(error)
      })
    }
  },
  methods: {
    onSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.dictionaryTypeModel.id = this.$route.query.id ? this.$route.query.id : ''
          this.disInput = true
          if (this.dictionaryTypeModel.id === '') {
            createDictionaryType(this.dictionaryTypeModel)
              .then(response => {
                this.$showSuccess(response.message)
                this.$router.push({
                  name: 'Dictionary'
                })
              })
              .catch(error => {
                this.disInput = false
                console.log(error)
              })
          } else {
            updateDictionaryType(this.dictionaryTypeModel)
              .then(response => {
                this.$showSuccess(response.message)
                this.$router.push({
                  name: 'Dictionary'
                })
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
        name: 'Dictionary'
      })
    }
  }
}
</script>
<style scoped>
@import '../../../styles/detail.scss';
</style>
