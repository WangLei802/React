<template>
    <div class='app-container'>
      <div class="formit">基本信息</div>
        <el-form label-width='150px'>

            <el-form-item :label='$l("lbl_userName")'>
                {{vm.username}}
            </el-form-item>
            <el-form-item :label='$l("lbl_nickName")'>
                {{vm.nickName}}
            </el-form-item>

            <el-form-item :label='$l("lbl_email")'>
                {{vm.email}}
            </el-form-item>

            <el-form-item :label='$l("lbl_mobile")'>
                {{vm.mobile}}
            </el-form-item>

            <el-form-item :label='$l("lbl_phone")'>
                {{vm.phone}}
            </el-form-item>

            <el-form-item :label='$l("lbl_gender")'>
              <fd-label type="sys_user_sex" :code ='vm.sex' ></fd-label>
            </el-form-item>

            <el-form-item :label='$l("lbl_sing")'>
                {{vm.sign}}
            </el-form-item>

            <div class="btn_group">
            <el-button type='primary' @click='edit'>{{$l('btn_edit')}}</el-button>
            <el-button type='primary' @click='changePassword'>{{$l('lbl_changePwd')}}</el-button>
            </div>
       </el-form>
    </div>

</template>


<script >
import { getMeProfile } from '@/api/sys/userAPI'
export default {
  props: {
    vm_edit: {
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
    return {
      vm: {
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
  },

  methods: {
    edit() {
      this.$router.push({
        name: 'NewOrUpdateUserProfile',
        params: { vm_passed_in: this.vm }
      })
    },
    changePassword() {
      this.$router.push({
        name: 'UpdateUserPassword',
        params: { vm_passed_in: this.vm }
      })
    }
  },
  mounted: function() {
    getMeProfile()
      .then(response => {
        this.vm = response.data
      })
      .catch(error => {
        console.log(error)
      })
  }
}
</script>
<style scoped>
.el-form {
  width: 90%;
  margin: 30px auto
}
.el-input {
  width: 30%;
}
.el-select {
  width: 30%;
}
i {
  color: red;
  float: left;
}
.el-form-item{
  margin-bottom: 0;
  border-bottom: 1px solid #e8e8e8;
}
.el-form-item__label {
  background: #e3e7ec;
  padding: 0;
}
.el-form-item__content {
  float: left;
}
.el-textarea {
  width: 30%;
}
.btn_group{
  margin-left: 50px;
}
</style>
