<template>
  <el-form :model="position" status-icon :rules='rules' ref="position" label-width='150px' >

    <el-col :span="12">
      <el-form-item :label='this.$ls("lbl_position_code")' prop="code">
        <el-input v-bind:disabled="disabledInput" v-model='position.code' :placeholder='this.$l("lbl_position_code")' ></el-input>
      </el-form-item>
    </el-col>

    <el-col :span="12">
      <el-form-item :label='this.$ls("lbl_position_name")' prop="name">
        <el-input v-model='position.name' :placeholder='this.$l("lbl_position_name")'></el-input>
      </el-form-item>
    </el-col>

    <el-col :span="24">
      <el-form-item :label='this.$ls("lbl_application_name")'>
        <fd-applicationselect :multiple="multiple" style="width: 100%" v-model="position.applicationCodes"></fd-applicationselect>
      </el-form-item>
    </el-col>

    <el-col :span="24">
      <el-form-item :label='this.$ls("lbl_remark")' prop="remark">
        <el-input type='textarea' v-model='position.remark' :placeholder='this.$l("lbl_remark")'></el-input>
      </el-form-item>
    </el-col>

    <el-col :span="24" class="detail-button-box">
      <el-button type='primary' @click='onSubmit("position")' v-bind:disabled="disInput">{{this.$l('btn_save')}}</el-button>
      <el-button @click='cancel'>{{this.$l('btn_back')}}</el-button>
    </el-col>
  </el-form>
</template>
<script >
  import { savePosition, updatePosition, getPositionDetail } from '@/api/sys/positionAPI'
  import { LoadingUtil } from '@/utils/common/LoadingUtil'
  import { ptn } from '@/utils/common/validate'
  export default {
    data() {
      return {
        position: {
          id: '',
          code: '',
          name: '',
          status: '',
          remark: '',
          version: '',
          applicationCodes: [],
          orgName: '',
          parentId: '',
          parentName: '',
          orgCode: ''
        },
        disabledInput: false,
        rules: {
          code: [{ pattern: ptn.cn_en_num(1, 20), message: this.$l('msg_position_code'), required: true, trigger: 'blur' }],
          name: [{ pattern: ptn.cn_en_num(1, 20), message: this.$l('msg_position_name'), required: true, trigger: 'blur' }]
        },
        multiple: true,
        disInput: false,
        orgName: ''
      }
    },
    mounted: function() {
      this.position.id = this.$route.query.id ? this.$route.query.id : ''
      let _this = this
      if (this.position.id !== '') {
        LoadingUtil.showLoading()
        this.disabledInput = true
        getPositionDetail(this.position.id).then(response => {
          LoadingUtil.hideLoading()
          _this.position = response.data
        }).catch(error => {
          console.log(error)
        })
      }
    },
    methods: {
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
        if (this.position.id === '') {
          savePosition(this.position)
            .then(response => {
              LoadingUtil.hideLoading()
              if (response.code === '2000') {
                this.$router.push({
                  name: 'PositionList'
                })
                this.$showSuccess(response.message)
              } else {
                this.$showError(response.message)
              }
            })
            .catch(error => {
              this.disInput = false
              console.log(error)
            })
        } else {
          updatePosition(this.position)
            .then(response => {
              LoadingUtil.hideLoading()
              if (response.code === '2000') {
                this.$router.push({
                  name: 'PositionList'
                })
                this.$showSuccess(response.message)
              } else {
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
          name: 'PositionList'
        })
      }
    }
  }
</script>
<style scoped>
  @import '../../../styles/detail.scss';
</style>
