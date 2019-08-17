<template>
  <div class='app-container'>

    <div class="subTitle">
      <div class="breadcrumb-child">
        <i class="fa fa-folder-open-o"></i>{{this.$l('lbl_user_center')}}</div>
    </div>
    <div class="logoEdit">
        <f-image-upload height='178px' width='178px' v-model='vm.avatar'@deleteAvatar="deleteAvatar" ></f-image-upload>
    </div>
    <div class="infoEdit">
      <el-form label-width='150px'  :model="vm" status-icon :rules="rules"  ref="userProfile">
        <el-form-item :label='$ls("lbl_userName")' prop="username">
          <span>{{vm.username}}</span>
        </el-form-item>
        <el-form-item :label='$ls("lbl_nickName")' prop="nickName">
          <el-input v-model='vm.nickName' placeholder='' :maxlength="20"></el-input>
        </el-form-item>

        <el-form-item :label='$ls("lbl_email")' prop="email">
          <el-input v-model='vm.email' placeholder='' :maxlength="50"></el-input>
        </el-form-item>

        <el-form-item :label='$ls("lbl_mobile")' prop="mobile">
          <el-input v-model='vm.mobile' placeholder='' :maxlength="20"></el-input>
        </el-form-item>

        <el-form-item :label='$ls("lbl_phone")' prop="phone">
          <el-input v-model='vm.phone' placeholder='' :maxlength="20"></el-input>
        </el-form-item>

        <el-form-item :label='$ls("lbl_gender")' prop="sex">
          <fd-radio v-model='vm.sex' :placeholder='this.$l("lbl_gender")' type="sys_user_sex"></fd-radio>
        </el-form-item>

        <el-form-item :label='$ls("lbl_sing")' prop="sign">
          <el-input v-model='vm.sign' placeholder='' :maxlength="50"></el-input>
        </el-form-item>
        <el-form-item>

          <f-button type='primary' label="btn_save" @click='save("userProfile")' />
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script >
import { ptn } from '@/utils/common/validate'
import { LoadingUtil } from '@/utils/common/LoadingUtil'
import { getMeProfile, newOrUpdateUserProfile } from '@/api/sys/userAPI'
export default {
  data() {
    return {
      vm: {
        id: '',
        username: '',
        nickName: '',
        email: '',
        mobile: '',
        phone: '',
        sex: '',
        sexLabel: '',
        avatar: '',
        sign: ''
      },
      rules: {
        nickName: [{ pattern: ptn.cn_en_num(1, 20), message: this.$l('msg_nickname'), required: true, trigger: 'blur' }],
        email: [{ type: 'email', message: this.$l('msg_email'), required: true, trigger: 'blur' }],
        mobile: [{ pattern: ptn.phone(1, 20), message: this.$l('msg_mobile'), required: true, trigger: 'blur' }],
        phone: [{ pattern: ptn.phone(1, 20), message: this.$l('msg_phone'), required: true, trigger: 'blur' }],
        sex: [{ required: true, message: this.$l('msg_sex'), trigger: 'blur' }]
      },
      fileList: [],
      isAvatarDelete: false
    }
  },

  methods: {
    deleteAvatar(isAvatarDelete) {
      this.isAvatarDelete = isAvatarDelete
    },
    save(userProfile) {
      this.isAvatarDelete ? this.vm.avatar = '' : null
      this.$refs[userProfile].validate((valid) => {
        if (valid) {
          newOrUpdateUserProfile(this.vm)
            .then(response => {
              this.$showSuccess(response.message)
              window.updatePortrait && window.updatePortrait(this.vm.avatar)
            })
            .catch(error => {
              console.log(error)
            })
        }
      })
    }
  },
  mounted: function() {
    LoadingUtil.showLoading()
    getMeProfile()
      .then(response => {
        LoadingUtil.hideLoading()
        this.vm = response.data
      })
      .catch(error => {
        console.log(error)
      })
  }
}
</script>
<style scoped>
/* @import '../../../styles/detail.scss'; */
</style>
