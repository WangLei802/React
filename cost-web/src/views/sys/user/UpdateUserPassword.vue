<template>
  <div class='main'>
      <div class="subTitle">
         <div class="breadcrumb-child"><i class="fa fa-folder-open-o"></i>{{this.$l('lbl_change_password')}}</div>
      </div>
      <el-form :model="vm" status-icon ref="vm" label-width="150px" :rules="rules">
        <el-form-item class='pwd-input' :label='$l("lbl_origPwd")' prop="oldPassword" >
        <f-input type='password' v-model='vm.oldPassword' auto-complete="off" placeholder=''></f-input>
      </el-form-item>
      <el-form-item class='pwd-input' :label='$l("lbl_newPwd")' prop="newPassword">
        <el-input type='password' v-model='vm.newPassword' auto-complete="off" placeholder=''></el-input>
      </el-form-item>
      <el-form-item class='pwd-input' :label='$l("lbl_conPwd")' prop="conPassword">
        <el-input type='password' v-model='vm.conPassword' auto-complete="off" placeholder=''></el-input>
      </el-form-item>

      <el-form-item>
        <f-button type='primary' label="btn_save" @click='save("vm")'></f-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script >

import { updatePassword } from '@/api/sys/userAPI'
import { LoadingUtil } from '@/utils/common/LoadingUtil'
import { ptn } from '@/utils/common/validate'

export default {
  props: {
    vm_passed_in: {
      type: Object,
      default: function() {
        return {
          id: '',
          username: '',
          nickName: '', // 用户昵称
          email: '', // 电子邮箱
          mobile: '', // 手机号码
          phone: '', // 办公电话
          sex: '', // 用户性别
          sexLabel: '',
          avatar: '', // 头像路径
          sign: '' // 个性签名
        }
      }
    }
  },
  data() {
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$l('msg_con_password')))
      } else if (value !== this.vm.newPassword) {
        callback(new Error(this.$l('msg_pwd_mismatch')))
      } else {
        callback()
      }
    }
    return {
      vm: {
        oldPassword: '',
        newPassword: '',
        conPassword: ''
      },
      rules: {
        oldPassword: [{ pattern: ptn.all_match(5, 20), message: this.$l('msg_old_password'), required: true, trigger: 'blur' }],
        newPassword: [{ pattern: ptn.all_match(5, 20), message: this.$l('msg_new_password'), required: true, trigger: 'blur' }],
        conPassword: [{ required: true, validator: validatePass2, trigger: 'blur' }]
      }
    }
  },

  methods: {
    save(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          LoadingUtil.showLoading()
          updatePassword(this.vm)
            .then(response => {
              LoadingUtil.hideLoading()
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
        name: 'UserProfile'
      })
    }
  },
  mounted: function() {}
}
</script>
<style scoped>
@import '../../../styles/detail.scss';
</style>
