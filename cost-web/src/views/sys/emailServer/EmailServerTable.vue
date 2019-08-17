<template>
    <div ref="emailServerTable">
        <el-table :height="tHeight" :data="tableData" stripe border  style="width: 100%" >
            <el-table-column type="index" :label="this.$l('lbl_no')" width="80"></el-table-column>
            <el-table-column prop="serverAddress" :label="this.$l('lbl_server_address')" ></el-table-column>
            <el-table-column prop="protocolType" :label="this.$l('lbl_protocol_type')" >
              <template slot-scope="scope">
                <fd-label :code="scope.row.protocolType" type="sys_email_protocol_type"></fd-label>
              </template>
            </el-table-column>
            <el-table-column prop="sslCredential"  :label="this.$l('lbl_ssl_credential')">
              <template slot-scope="scope">
                <fd-label :code="scope.row.sslCredential" type="sys_ssl"></fd-label>
              </template>
            </el-table-column>
            <el-table-column prop="port" :label="this.$l('lbl_port')"></el-table-column>
            <el-table-column prop="emailLoginName" :label="this.$l('lbl_email_login_name')"></el-table-column>
            <el-table-column width="120" :label="this.$l('lbl_operation')">
                <template slot-scope="scope">
                  <el-button type="text"  icon="el-icon-edit" :title="$l('btn_edit')" @click="editEmailServer(scope.$index, scope.row)"></el-button>
                  <el-button type="text"  icon="el-icon-delete" :title="$l('btn_delete')" @click="deleteEmailServer(scope.$index, scope.row)"></el-button>
                  <el-button type="text"  :icon="scope.row.status == '1' ? 'el-icon-star-on' : 'el-icon-star-off'"
                             :title="scope.row.status == '1' ? $l('btn_default') : $l('btn_set_default')" @click="setDefault(scope.$index,scope.row)"></el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
<script>
import { searchEmailServerList, deleteEmailServer, updateEmailServerStatus } from '@/api/sys/emailServerAPI'
import { LoadingUtil } from '@/utils/common/LoadingUtil'
import { tableHeight } from '@/utils/common/index'
export default {
  data() {
    return {
      tableData: [],
      tableHeight: '0',
      fullHeight: document.documentElement.clientHeight
    }
  },
  computed: {
    tHeight: function() {
      let options = {
        fullHeight: this.$store.getters.fullHeight,
        opened: this.$store.getters.sidebar.opened,
        showForm: this.$store.getters.showForm,
        obj: this,
        formHeight: 56
      }
      return `${tableHeight(options)}px`
    }
  },
  methods: {
    getList() {
      //      let _this = this
      LoadingUtil.showLoading()
      searchEmailServerList()
        .then(response => {
          LoadingUtil.hideLoading()
          this.tableData = response.data
        })
        .catch(error => {
          console.log(error)
        })
    },
    settingTableHeight: function() {
      const topHeight = this.$refs['emailServerTable'].getBoundingClientRect().top
      this.tableHeight = this.fullHeight - topHeight - 80
      this.$refs['emailServerTable'].style.Height = this.tableHeight + 'px'
    },
    editEmailServer(index, row) {
      this.$router.push({
        name: 'NewOrUpdateEmailServer',
        query: { id: row.id }
      })
    },
    deleteEmailServer(index, row) {
      this.$confirm(this.$l('msg_delete_confirm'), this.$l('msg_delete_tips'), {
        confirmButtonText: this.$l('btn_confirm'),
        cancelButtonText: this.$l('btn_cancel'),
        type: 'warning'
      }).then(() => {
        const body = { id: row.id, version: row.version }
        LoadingUtil.showLoading()
        deleteEmailServer(body).then(response => {
          LoadingUtil.hideLoading()
          this.$showSuccess(response.message)
          this.getList()
        }).catch(error => {
          console.log(error)
        })
      }).catch(() => {})
    },
    setDefault(index, row) {
      const body = { id: row.id, version: row.version, status: row.status }
      LoadingUtil.showLoading()
      updateEmailServerStatus(body).then(response => {
        LoadingUtil.hideLoading()
        this.$showSuccess(response.message)
        this.getList()
      }).catch(error => {
        console.log(error)
      })
    }
  },
  mounted: function() {
    LoadingUtil.showLoading()
    this.getList()
    LoadingUtil.hideLoading()
    this.$nextTick(function() {
      this.settingTableHeight()
    })
    // window.onresize = () => {
    //   return (() => {
    //     window.fullHeight = document.documentElement.clientHeight
    //     this.fullHeight = window.fullHeight
    //   })()
    // }
  },
  watch: {
    fullHeight(val) {
      this.settingTableHeight()
    }
  }
}
</script>
<style scoped>
</style>
