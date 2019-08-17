<template>
  <div>
    <el-row>
      <el-form :model="emailQueryModel" status-icon  ref="emailTable" label-width='150px' >

        <el-col :span="12">
          <el-form-item :label="this.$ls('lbl_email_send_server')">
          <el-input v-model='emailQueryModel.sendServer' :placeholder="this.$l('lbl_email_send_server')"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item :label="this.$ls('lbl_email_send_address')">
          <el-input v-model='emailQueryModel.sendAddress' :placeholder="this.$l('lbl_email_send_address')"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item :label="this.$ls('lbl_email_receive_address')">
          <el-input v-model='emailQueryModel.receiveAddress' :placeholder="this.$l('lbl_email_receive_address')"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item :label="this.$ls('lbl_email_send_user')" >
          <el-input v-model='emailQueryModel.sendUser' :placeholder="this.$l('lbl_email_send_user')"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item :label="this.$ls('lbl_email_send_time')">
          <el-input v-model="emailQueryModel.sendTime" :placeholder="$l('lbl_email_send_time')"> </el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item :label="this.$ls('lbl_email_subject')">
          <el-input v-model="emailQueryModel.subject" :placeholder="$l('lbl_email_subject')"> </el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item :label="this.$ls('lbl_email_file')">
          <el-input v-model="emailQueryModel.file" :placeholder="$l('lbl_email_file')"> </el-input>
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item :label='this.$ls("lbl_email_content")' >
          <el-input type='textarea' v-model='emailQueryModel.content' :placeholder='this.$l("lbl_email_content")'></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="24" class="detail-button-box">
          <el-button @click='back'>{{this.$l('btn_back')}}</el-button>
        </el-col>
      </el-form>
    </el-row>
  </div>
</template>
<script>
  import { getEmailDetail } from '@/api/sys/emailAPI'

  export default {
    data() {
      return {
        emailQueryModel: {
          id: '',
          sendServer: '',
          sendAddress: '',
          receiveAddress: '',
          sendUser: '',
          sendTime: '',
          subject: '',
          file: '',
          content: ''
        }
      }
    },
    mounted: function() {
      this.emailQueryModel.id = this.$route.query.id ? this.$route.query.id : ''
      if (this.emailQueryModel.id !== '') {
        getEmailDetail(this.emailQueryModel.id).then(response => {
          this.emailQueryModel = response.data
        }).catch(error => {
          console.log(error)
        })
      }
    },
    methods: {
      back() {
        this.$router.push({
          name: 'EmailList'
        })
      }
    }
  }
</script>
<style scoped>
  @import '../../../styles/detail.scss';
</style>
