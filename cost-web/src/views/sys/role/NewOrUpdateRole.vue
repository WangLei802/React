<template>
  <div>
    <el-row>
      <el-form :model="role" status-icon :rules='rules' ref="role" label-width='150px' >

        <el-col :span="12">
          <el-form-item :label='this.$ls("lbl_role_code")' prop="roleCode">
          <el-input v-model='role.roleCode' :placeholder='this.$l("lbl_role_code")' v-bind:disabled="disabledInput"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item :label='this.$ls("lbl_role_name")' prop="roleName">
          <el-input v-model='role.roleName' :placeholder='this.$l("lbl_role_name")'></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item :label='this.$ls("lbl_is_sys")' prop="isSys">
          <fd-radio  v-model='role.isSys' :placeholder='this.$ls("lbl_is_sys")' type="sys_yes_no" ></fd-radio>
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item :label='this.$ls("lbl_remark")' prop="remark">
          <el-input type='textarea' v-model='role.remark' :placeholder='this.$l("lbl_remark")'></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="24" class="detail-button-box">
          <el-button type='primary' @click='onSubmit("role")' v-bind:disabled="disInput">{{this.$l('btn_save')}}</el-button>
          <el-button @click='cancel'>{{this.$l('btn_back')}}</el-button>
        </el-col>
      </el-form>
    </el-row>
  </div>
</template>
<script >
  import { saveRole, updateRole, getRoleDetail } from '@/api/sys/roleAPI'
  import { LoadingUtil } from '@/utils/common/LoadingUtil'
  import { ptn } from '@/utils/common/validate'
  export default {
    data() {
      return {
        role: {
          id: '',
          roleCode: '',
          roleName: '',
          isSys: '1',
          status: '',
          remark: '',
          version: ''
        },
        disInput: false,
        rules: {
          roleCode: [{ pattern: ptn.en_num_line(1, 20), message: this.$l('msg_role_code'), required: true, trigger: 'blur' }],
          roleName: [{ pattern: ptn.all_match(1, 20), message: this.$l('msg_role_name'), required: true, trigger: 'blur' }],
          isSys: [{ required: true, trigger: 'blur' }]
        },
        disabledInput: false
      }
    },
    mounted: function() {
      this.role.id = this.$route.query.id ? this.$route.query.id : ''
      var that = this
      if (this.role.id !== '') {
        this.disabledInput = true
        LoadingUtil.showLoading()
        getRoleDetail(this.role.id).then(response => {
          LoadingUtil.hideLoading()
          that.role = response.data
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
        if (this.role.id === '') {
          saveRole(this.role)
            .then(response => {
              LoadingUtil.hideLoading()
              if (response.code === '2000') {
                this.$router.push({
                  name: 'RoleList'
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
          updateRole(this.role)
            .then(response => {
              LoadingUtil.hideLoading()
              if (response.code === '2000') {
                this.$router.push({
                  name: 'RoleList'
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
          name: 'RoleList'
        })
      }
    }
  }
</script>
<style scoped>
  @import '../../../styles/detail.scss';
</style>
