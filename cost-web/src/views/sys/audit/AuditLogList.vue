<template>
  <div class='app-container'>
    <mt-searchform>
      <template slot="buttons">
      </template>

      <template slot="form">
        <el-row>
          <el-col :span="6">
            <el-form-item :label='this.$ls("lbl_user")'>
              <el-input clearable v-model="vm.principal" :maxlength='20' style="width:168px;"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item :label="this.$ls('dh_lbl_url_address')">
              <el-input clearable v-model="vm.url" :maxlength='50' style="width:168px;"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item :label='this.$ls("lbl_log_type")'>
              <el-select v-model="vm.type" :placeholder='this.$l("lbl_type")' clearable>
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.label">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="6" class="search-btn">
            <el-form-item>
              <el-button type="info" @click='searchVue'>{{$l("btn_search")}}</el-button>
              <el-button @click='reset'>{{$l("btn_reset")}}</el-button>
            </el-form-item>
          </el-col>

          <mt-date  ref="date" :startPlaceholder='this.$l("lbl_start_date")' v-model="requestTs" @timeChoose="timeChoose"
                    :endPlaceholder='this.$l("lbl_start_date")' ></mt-date>
        </el-row>
      </template>
    </mt-searchform>
    <AuditLogTable :queryObj_passed_in='vm' ref='auditLogTable'></AuditLogTable>
  </div>
</template>
<script>
  import AuditLogTable from '@/views/sys/audit/AuditLogTable'
  export default {
    components: {
      AuditLogTable
    },
    data() {
      return {
        options: [{
          value: '选项1',
          label: 'INFO'
        }, {
          value: '选项2',
          label: 'WARN'
        }, {
          value: '选项3',
          label: 'ERROR'
        }],
        vm: {
          body: '',
          type: '',
          id: '',
          url: '',
          principal: '',
          index: '',
          remote: '',
          from: '',
          to: '',
          count: 0,
          pageNum: 1,
          pageSize: 20,
          sortBy: 'requestTs',
          order: -1
        },
        requestTs: []
      }
    },
    methods: {
      timeChoose(val, index) {
        this.requestTs[index] = val
      },
      reset() {
        this.vm.principal = ''
        this.vm.url = ''
        this.vm.type = ''
        this.$refs.date.startTime = ''
        this.$refs.date.endTime = ''
      },
      searchVue() {
        this.initVM()
        if (this.requestTs == null || this.requestTs.length === 0) {
          this.vm.from = ''
          this.vm.to = ''
        } else {
          this.vm.from = this.requestTs[0] && this.requestTs[0].format('yyyy-MM-dd hh:mm:ss')
          this.vm.to = this.requestTs[1] && this.requestTs[1].format('yyyy-MM-dd hh:mm:ss')
        }
        this.$refs.auditLogTable.getList()
      },
      initVM() {
        this.vm.count = 0
        this.vm.pageNum = 1
        this.vm.pageSize = 40
        this.vm.sortBy = 'requestTs'
        this.vm.order = -1
      }
    }
  }
</script>
<style scoped>
  @import '../../../styles/list.scss';
</style>
