<template>
  <div class="app-container">
    <mt-searchform>
      <template slot="buttons">
      </template>

      <template slot="form">
        <el-row>
          <el-col :span="6">
            <el-form-item :label='this.$ls("lbl_email_send_server")'>
              <el-input class="search_item" clearable v-model='emailQueryModel.sendServer' :maxlength='50'></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item :label='this.$ls("lbl_email_send_user")'>
              <el-input  class="search_item" clearable v-model='emailQueryModel.sendUser' :maxlength='50'></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item :label='this.$ls("lbl_email_receive_address")'>
              <el-input class="search_item" clearable v-model='emailQueryModel.receiveAddress' :maxlength='50'></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="6" class="search-btn">
            <el-form-item>
              <el-button type='info' @click='search'>{{$l("btn_search")}}</el-button>
              <el-button  @click='reset'>{{$l("btn_reset")}}</el-button>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label='$ls("lbl_email_subject")'>
              <el-input class="search_item" clearable v-model='emailQueryModel.subject' :maxlength='50'></el-input>
            </el-form-item>
          </el-col>
          <mt-date  ref="date" :startPlaceholder='this.$l("lbl_start_date")' v-model="sendTime" @timeChoose="timeChoose"
                    :endPlaceholder='this.$l("lbl_start_date")' ></mt-date>
          <el-col :span="6">
            <el-form-item :label='$ls("lbl_email_type")'>
              <fd-select v-model="emailQueryModel.emailType" type="sys_email_type" :placeholder="$l('lbl_email_type')" clearable> </fd-select>
            </el-form-item>
          </el-col>
        </el-row>
      </template>
    </mt-searchform>
    <EmailTable :queryObj_passed_in='emailQueryModel' ref='emailTable'></EmailTable>
  </div>
</template>

<script>
  import EmailTable from '@/views/sys/email/EmailTable'
  export default {
    components: {
      EmailTable
    },
    data() {
      return {
        emailQueryModel: {
          sendServer: '',
          sendUser: '',
          receiveAddress: '',
          subject: '',
          emailType: '',
          from: '',
          to: '',
          pageNum: 1,
          pageSize: 20,
          count: 0
        },
        sendTime: []
      }
    },
    methods: {
      timeChoose(val, index) {
        this.sendTime[index] = val
      },
      reset() {
        this.emailQueryModel.sendServer = ''
        this.emailQueryModel.sendUser = ''
        this.emailQueryModel.receiveAddress = ''
        this.emailQueryModel.subject = ''
        this.emailQueryModel.sendTime = ''
        this.emailQueryModel.emailType = ''
        this.$refs.date.startTime = ''
        this.$refs.date.endTime = ''
      },
      initVM() {
        this.emailQueryModel.pageNum = 1
        this.emailQueryModel.count = 0
        this.emailQueryModel.pageSize = 20
      },
      search() {
        this.initVM()
        if (this.sendTime == null || this.sendTime.length === 0) {
          this.emailQueryModel.from = ''
          this.emailQueryModel.to = ''
        } else {
          this.emailQueryModel.from = this.sendTime[0] && this.sendTime[0].format('yyyy-MM-dd hh:mm:ss')
          this.emailQueryModel.to = this.sendTime[1] && this.sendTime[1].format('yyyy-MM-dd hh:mm:ss')
        }
        this.$refs.emailTable.getList()
      }
    }
  }
</script>
<style scoped>
  @import '../../../styles/list.scss';
  .app-container .search_item{
    width:168px;
  }
</style>

