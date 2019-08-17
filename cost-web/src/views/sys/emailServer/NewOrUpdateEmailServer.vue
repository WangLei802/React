<template>
  <div>
    <el-row>
      <el-form :model="emailServerModel" status-icon :rules='rules' ref="emailServerModel" label-width='150px' >

        <el-col :span="12">
          <el-form-item :label='$ls("lbl_protocol_type")' prop="protocolType">
            <fd-select v-model="emailServerModel.protocolType" :placeholder='this.$l("lbl_protocol_type")' type="sys_email_protocol_type" clearable> </fd-select>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item :label='this.$ls("lbl_server_address")' prop="serverAddress">
            <el-input v-model='emailServerModel.serverAddress' :placeholder='this.$l("lbl_server_address")'></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item :label='this.$ls("lbl_ssl_credentail")' prop="sslCredential">
            <fd-radio v-model='emailServerModel.sslCredential' :placeholder='this.$l("lbl_ssl_credentail")' type="sys_ssl"></fd-radio>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item :label='this.$ls("lbl_port")' prop="port">
            <el-input v-model='emailServerModel.port' :placeholder='this.$l("lbl_port")'></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item :label='this.$ls("lbl_email_login_name")' prop="emailLoginName">
            <el-input v-model='emailServerModel.emailLoginName' :placeholder='this.$l("lbl_email_login_name")'></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label='this.$ls("lbl_email_login_password")' prop="password" :maxlength='20' v-if="!emailServerModel.id">
            <el-input type='password' v-model='emailServerModel.password' :placeholder='this.$l("lbl_email_login_password")'></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label='this.$ls("lbl_email_show_password_modify")' prop="showPassword" v-if="emailServerModel.id" >
            <fd-radio v-model='emailServerModel.showPassword' :placeholder='this.$l("lbl_email_show_password_modify")' type="sys_show_password_modify"></fd-radio>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item class='pwd-input' :label='$l("lbl_newPwd")' prop="newPassword"  v-show="emailServerModel.showPassword==='0'?false:true">
            <el-input type='password' v-model='emailServerModel.newPassword' auto-complete="off" :placeholder='this.$l("lbl_newPwd")'></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
        </el-col>
        <el-col :span="24" class="detail-button-box">
          <el-button type='primary' @click='onSubmit("emailServerModel")' v-bind:disabled="disInput" >{{this.$l('btn_save')}}</el-button>
          <el-button @click='cancel' >{{this.$l('btn_back')}}</el-button>
        </el-col>
      </el-form>
    </el-row>
  </div>
</template>
  <script >
    import { createEmailServer, queryEmailServerDetail, updateEmailServer } from '@/api/sys/emailServerAPI'
    import { LoadingUtil } from '@/utils/common/LoadingUtil'
    import { ptn } from '@/utils/common/validate'
    export default {
      data() {
        var validatePass2 = (rule, value, callback) => {
          if (this.emailServerModel.id) {
            if (value === '') {
              callback(new Error(this.$l('msg_con_password')))
            } else if (value !== this.emailServerModel.newPassword) {
              callback(new Error(this.$l('msg_pwd_mismatch')))
            } else {
              this.emailServerModel.password = this.emailServerModel.newPassword
              callback()
            }
          } else {
            if (value === '') {
              callback(new Error(this.$l('msg_con_password')))
            } else if (value !== this.emailServerModel.password) {
              callback(new Error(this.$l('msg_pwd_mismatch')))
            } else {
              callback()
            }
          }
        }
        return {
          emailServerModel: {
            id: '',
            protocolType: '0',
            serverAddress: '',
            sslCredential: '0',
            showPassword: '0',
            port: '',
            emailLoginName: '',
            password: '',
            version: '',
            newPassword: '',
            conPassword: ''
          },
          disInput: false,
          rules: {
            protocolType: [{ message: this.$l('msg_protocol_type'), required: true, trigger: 'blur' }],
            serverAddress: [{ pattern: ptn.email(1, 100), message: this.$l('msg_server_adress'), required: true, trigger: 'blur' }],
            sslCredential: [{ message: this.$l('msg_ssl'), required: true, trigger: 'blur' }],
            showPassword: [{ message: this.$l('msg_show_password'), required: true, trigger: 'blur' }],
            port: [{ pattern: ptn.number(1, 5), message: this.$l('msg_port'), required: true, trigger: 'blur' }],
            emailLoginName: [{ pattern: ptn.en_common_character(1, 100), message: this.$l('msg_email_login_name'), required: true, trigger: 'blur' }],
            password: [{ pattern: ptn.pure_en_num(1, 30), message: this.$l('msg_password'), required: true, trigger: 'blur' }],
            newPassword: [{ pattern: ptn.all_match(5, 20), message: this.$l('msg_new_password'), required: true, trigger: 'blur' }],
            conPassword: [{ required: true, validator: validatePass2, trigger: 'blur' }]
          }
        }
      },
      /* watch:{
        emailServerModel:{
          handler(val, oldVal){
              //TODO 协议类型不同默认端口也不同
            if(val.sslCredential == "0"){
              this.emailServerModel.port = "25"
            }else{
              //994也有
              this.emailServerModel.port = "465"
            }
          },
          deep: true,
          immediate: false
        }
      },*/
      watch: {
        'emailServerModel.showPassword': function(n, o) {

        }
      },
      mounted: function() {
        this.emailServerModel.id = this.$route.query.id ? this.$route.query.id : ''
        var that = this
        if (this.emailServerModel.id !== '') {
          that.rules.password = null
          LoadingUtil.showLoading()
          queryEmailServerDetail(this.emailServerModel.id).then(response => {
            LoadingUtil.hideLoading()
            that.emailServerModel.id = response.data.id
            that.emailServerModel.protocolType = response.data.protocolType
            that.emailServerModel.serverAddress = response.data.serverAddress
            that.emailServerModel.sslCredential = response.data.sslCredential
            that.emailServerModel.password = response.data.password
            that.emailServerModel.port = response.data.port
            that.emailServerModel.version = response.data.version
            that.emailServerModel.emailLoginName = response.data.emailLoginName
            that.emailServerModel.showPassword = '0'
            that.emailServerModel.newPassword = ''
            that.emailServerModel.conPassword = ''
          }).catch(error => {
            console.log(error)
          })
        } else {
          that.rules.newPassword = null
        }
      },
      methods: {
        onSubmit(formName) {
          console.log('+===' + JSON.stringify(this.emailServerModel))
          var validateResult = true
          this.$refs[formName].validate(valid => {
            console.log(valid)
            if (!valid) {
              validateResult = false
            }
          })
          if (!validateResult) {
            return
          }
          LoadingUtil.showLoading()
          this.disInput = true
          if (this.emailServerModel.id !== '') {
            // 修改数据
            updateEmailServer(this.emailServerModel)
              .then(response => {
                LoadingUtil.hideLoading()
                this.$showSuccess(response.message)
                this.$router.push({
                  name: 'EmailServerList'
                })
              })
              .catch(error => {
                this.disInput = false
                console.log(error)
              })
          } else {
            // 新增数据
            createEmailServer(this.emailServerModel)
              .then(response => {
                LoadingUtil.hideLoading()
                this.$showSuccess(response.message)
                this.$router.push({
                  name: 'EmailServerList'
                })
              })
              .catch(error => {
                this.disInput = false
                console.log(error)
              })
          }
        },
        cancel() {
          this.$router.push({
            name: 'EmailServerList'
          })
        }
      }

    }
  </script>
  <style scoped>
    @import "../../../styles/detail.scss";
  </style>
