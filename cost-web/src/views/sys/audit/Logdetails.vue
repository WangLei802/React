<template>
  <div>
    <el-row>
      <el-form :model="form" status-icon  ref="form" label-width='150px'>

        <el-col :span="12">
          <el-form-item label="URL">
          <el-input v-model="form.url" readonly></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item :label='this.$l("lbl_user")'>
          <el-input v-model="form.principal" readonly></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item :label='this.$l("lbl_log_type")'>
          <el-input v-model="form.type" readonly></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="IP">
          <el-input v-model="form.remote" readonly></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item :label='this.$l("lbl_requestts")'>
          <el-input v-model="form.requestTs" readonly></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label='this.$l("lbl_timestamp")'>
          <el-input v-model="form.createdDate " readonly></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item :label='this.$l("lbl_message")' class="textarea">
            <el-input type="textarea" v-model="form.body" readonly></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24" class="detail-button-box">
          <el-button @click='clone'>{{this.$l('btn_back')}}</el-button>
        </el-col>
      </el-form>
    </el-row>
  </div>
</template>
 <script>

import { parseTime } from '@/utils/common/index'
import { AuditLoginfo } from '@/api/sys/auditLogAPI'
export default {
  data() {
    return {
      form: {
        principal: '',
        type: '',
        remote: '',
        url: '',
        body: '',
        request_ts: '',
        createdDate: ''
      }
    }
  },
  methods: {
    clone() {
      this.$router.push({ name: 'audit' })
    },
    getListinfo() {
      AuditLoginfo(this.$route.query.id)
        .then(response => {
          if (response.data.requestTs) {
            response.data.requestTs = parseTime(
              response.data.requestTs,
              '{yyyy}-{mm}-{dd} {hh}:{ii}'
            )
          }
          if (response.data.createdDate) {
            response.data.createdDate = parseTime(
              response.data.createdDate,
              '{yyyy}-{mm}-{dd} {hh}:{ii}'
            )
          }
          this.form = response.data
        })
        .catch(error => {
          console.log(error)
        })
    }
  },
  mounted: function() {
    this.getListinfo()
  }
}
</script>
<style scoped>
  @import '../../../styles/detail.scss';
</style>
