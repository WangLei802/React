<template>
  <div>
    <el-row>
      <el-form :model="vm" status-icon :rules='rules' ref="langTypeTable" label-width='150px' >

        <el-col :span="12">
          <el-form-item :label='this.$l("lbl_description")' prop="id">
          <el-select v-model='vm.id' :placeholder='this.$l("lbl_description")' @change="change()">
          <el-option v-for='item in options_1' :key='item.id' :label='item.langTypeDesc' :value='item.id'>
          </el-option>
          </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item :label='this.$l("lbl_lang_type")' prop="langTypeCode">
          <el-input v-model='vm.langTypeCode' :placeholder='this.$l("lbl_lang_type")'></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item :label='this.$l("lbl_locale")' prop="langTypeLocaleDesc">
          <el-input v-model='vm.langTypeLocaleDesc' :placeholder='this.$l("lbl_locale")'></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item :label='this.$ls("lbl_status")' prop="status">
          <fd-radio v-model="vm.status" type="sys_lang_tye_status"></fd-radio>
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item :label='this.$l("lbl_remark")' prop="remark">
          <el-input type='textarea' v-model='vm.remark' :placeholder='this.$l("lbl_remark")'></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24" class="detail-button-box">
          <el-button type='primary' @click='onSubmit("langTypeTable")' v-bind:disabled="disInput" >{{this.$l('btn_save')}}</el-button>
          <el-button @click='cancel' >{{this.$l('btn_back')}}</el-button>
        </el-col>
      </el-form>
    </el-row>
  </div>
</template>
<script >
import { newOrUpdateLangType, getUnUsedLangTypeList } from '@/api/sys/i18nAPI'
import { ptn } from '@/utils/common/validate'
export default {
  props: {
    vm_passed_in: {
      type: Object,
      default: function() {
        return {
          id: '',
          index: '',
          langTypeCode: '',
          langTypeDesc: '',
          langTypeLocaleDesc: '',
          status: '1',
          remark: '',
          version: ''
        }
      }
    }
  },
  data() {
    var valideId = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$l('msg_lang_type_id')))
      } else {
        callback()
      }
    }

    var checkRemark = (rule, value, callback) => {
      if (value.length > 200) {
        callback(new Error(this.$l('msg_remark')))
      } else {
        callback()
      }
    }
    return {
      vm: this.vm_passed_in,
      langTypeList: [],
      options_1: [],
      options_2: [
        { status: '1', statusDesc: 'Active' },
        { status: '0', statusDesc: 'InActive' }
      ],
      rules: {
        id: [{ required: true, validator: valideId, trigger: 'change' }],
        langTypeCode: [{ pattern: ptn.en(1, 20), message: this.$l('msg_lang_type_code'), required: true, trigger: 'blur' }],
        langTypeLocaleDesc: [{ pattern: ptn.en(1, 200), message: this.$l('msg_lang_type_desc'), required: true, trigger: 'blur' }],
        status: [{ required: true, validator: '', trigger: 'blur' }],
        remark: [{ validator: checkRemark, trigger: 'blur' }]
      }
    }
  },
  methods: {
    getCurrentLangType() {
      if (this.langTypeList != null && this.langTypeList.length > 0) {
        for (var langType in this.langTypeList) {
          if (this.langTypeList[langType].id === this.vm.id) {
            return this.langTypeList[langType]
          }
        }
      }
    },
    change() {
      this.vm.langTypeCode = this.getCurrentLangType().langTypeCode
      this.vm.langTypeLocaleDesc = this.getCurrentLangType().langTypeLocaleDesc
    },
    onSubmit(formName) {
      let params = { id: this.vm.id, status: this.vm.status, remark: this.vm.remark }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          newOrUpdateLangType(params)
            .then(response => {
              this.$router.push({
                name: 'LangTypeList'
              })
              this.$showSuccess(response.message)
            })
            .catch(error => {
              console.log(error)
            })
        }
      })
    },
    cancel() {
      this.$router.push({
        name: 'LangTypeList'
      })
    }
  },
  mounted: function() {
    getUnUsedLangTypeList()
      .then(response => {
        this.langTypeList = response.data
        this.options_1 = response.data
      })
      .catch(error => {
        console.log(error)
      })
  }
}
</script>
<style scoped>
@import '../../../styles/detail.scss';
</style>
