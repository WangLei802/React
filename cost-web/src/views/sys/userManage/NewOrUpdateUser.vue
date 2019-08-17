<template>
  <div>
    <el-row>
      <el-form :model="userModel" status-icon :rules='rules' ref="userModel" label-width='150px'>

        <el-col :span="12">
          <el-form-item :label='this.$ls("lbl_userName")' prop="username">
          <el-input v-bind:disabled="disabledInput" class="username" v-model='userModel.username' :placeholder='this.$l("lbl_userName")'></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item :label='this.$ls("lbl_nickName")' prop="nickName">
          <el-input v-model='userModel.nickName' :placeholder='this.$l("lbl_nickName")'></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item :label='this.$ls("lbl_email")' prop="email">
          <el-input v-model='userModel.email' :placeholder='this.$l("lbl_email")'></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item :label='this.$ls("lbl_mobile")' prop="mobile" :maxlength='20'>
          <el-input v-model='userModel.mobile' :placeholder='this.$l("lbl_mobile")'></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" style="margin-bottom:-2px;">
          <el-form-item :label='this.$ls("lbl_phone")' prop="phone" :maxlength='20'>
          <el-input v-model='userModel.phone' :placeholder='this.$l("lbl_phone")'></el-input>
          </el-form-item>
        </el-col><el-col :span="12">
        <el-form-item :label='this.$ls("lbl_gender")' prop="sex">
        <fd-radio v-model='userModel.sex' :placeholder='this.$l("lbl_gender")' type="sys_user_sex"></fd-radio>
        </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label='this.$ls("lbl_org_name")' prop="orgNames">
          <el-input disabled="disabled" v-model='orgNames' ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label='this.$ls("lbl_position_name")' prop="orgNames">
          <el-input disabled="disabled" v-model='positionNames' ></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item :label='this.$ls("lbl_remark")'>
          <el-input type='textarea' v-model='userModel.sign' :placeholder='this.$l("lbl_remark")'></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="24" class="detail-button-box">
          <el-button type='primary' @click='onSubmit("userModel")' v-bind:disabled="disInput">{{this.$l('btn_save')}}</el-button>
          <el-button @click='cancel'>{{this.$l('btn_back')}}</el-button>
        </el-col>
      </el-form>
    </el-row>
  </div>
</template>
<script >
import { newOrUpdateUser, getUserDetail, getUserPositions, getUserOrgs } from '@/api/sys/userManageAPI'
import { setfirstSetOrg } from '@/api/sys/orgAPI'
import { LoadingUtil } from '@/utils/common/LoadingUtil'
import { ptn } from '@/utils/common/validate'
import { setUserPositions } from '@/api/sys/positionAPI'
export default {
  data() {
    var vaildataEmail = (rule, value, callback) => {
      var reg = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/
      if (this.userModel.email) {
        if (!reg.test(this.userModel.email)) {
          callback(new Error(this.$l('msg_email')))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }

    return {
      userModel: {
        id: '',
        username: '',
        nickName: '',
        email: '',
        mobile: '',
        phone: '',
        sex: '1',
        sign: '',
        version: ''
      },
      disInput: false,
      disabledInput: false,
      orgNames: '',
      positionNames: '',
      userName: '',
      rules: {
        username: [{ pattern: ptn.en_num(5, 20), message: this.$l('msg_username'), required: true, trigger: 'blur' }],
        nickName: [{ pattern: ptn.cn_en_num(1, 20), message: this.$l('msg_nickname'), required: true, trigger: 'blur' }],
        email: [{ type: 'email', message: this.$l('msg_email'), trigger: 'blur' }],
        mobile: [{ pattern: ptn.phone(), message: this.$l('msg_mobile'), trigger: 'blur' }],
        phone: [{ pattern: ptn.phone(), message: this.$l('msg_phone'), trigger: 'blur' }],
        sex: [{ required: true, trigger: 'blur' }]
      }
    }
  },
  mounted: function() {
    this.userModel.id = this.$route.query.id ? this.$route.query.id : ''
    var that = this
    if (this.userModel.id !== '') {
      this.disabledInput = true
      LoadingUtil.showLoading()
      getUserDetail(this.userModel.id).then(response => {
        LoadingUtil.hideLoading()
        that.userModel = response.data
        let params = { username: that.userModel.username }
        getUserOrgs(params).then(response => {
          LoadingUtil.hideLoading()
          that.orgNames = response.data
        }).catch(error => {
          console.log(error)
        })
        getUserPositions(params).then(response => {
          LoadingUtil.hideLoading()
          that.positionNames = response.data
        }).catch(error => {
          console.log(error)
        })
      }).catch(error => {
        console.log(error)
      })
    } else {
      if (this.$route.query.orgMenu !== undefined) {
        this.orgNames = this.$route.query.orgMenu.orgName
      }
    }
  },
  methods: {
    onSubmit(formName) {
      var validateResult = true
      this.$refs[formName].validate(valid => {
        if (!valid) {
          validateResult = false
        }
      })
      if (!validateResult) {
        return
      }
      LoadingUtil.showLoading()
      this.disInput = true
      newOrUpdateUser(this.userModel)
        .then(response => {
          LoadingUtil.hideLoading()
          if (response.code === '2000') {
            if (this.userModel.id === '') {
              if (this.$route.query.orgMenu !== undefined) {
                let orgs = []
                orgs[0] = this.$route.query.orgMenu.orgCode
                var userOrgs = {
                  userName: this.userModel.username,
                  orgCodes: orgs
                }
                LoadingUtil.showLoading()
                setfirstSetOrg(userOrgs).then(response => {
                }).catch(error => {
                  this.disInput = false
                  console.log(error)
                })
              }
              if (this.$route.query.positionMenu !== undefined) {
                let positionCodes = []
                positionCodes[0] = this.$route.query.positionMenu.code
                var userPositions = {
                  userName: this.userModel.username,
                  positionCodes: positionCodes
                }
                setUserPositions(userPositions).then(response => {
                }).catch(error => {
                  this.disInput = false
                  console.log(error)
                })
              }
            }
            this.$showSuccess(response.message)
            this.$router.push({
              name: 'UserManageList'
            })
          } else {
            this.disInput = false
            this.$showError(response.message)
          }
        })
        .catch(error => {
          this.disInput = false
          console.log('失败' + JSON.stringify(error))
          console.log(error)
        })
    },
    cancel() {
      this.$router.push({
        name: 'UserManageList'
      })
    }
  }
}
</script>
<style scoped>
@import "../../../styles/detail.scss";
</style>
