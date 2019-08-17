<template>
    <div ref="gatewayExternalTable">
        <el-table :height="tHeight" :data="tableData" stripe border style="width: 100%">
          <el-table-column type="index" :label="this.$l('lbl_no')" width="80"></el-table-column>
          <el-table-column prop="routePath" :label="this.$l('lbl_gateway_internal_route_path')"></el-table-column>

          <el-table-column prop="url" :label="this.$l('lbl_gateway_internal_target_service')"></el-table-column>

          <el-table-column label="认证方式">
            <template slot-scope="scope">
              <fd-label :code="scope.row.authType" type="pf_gateway_external_auth_type"></fd-label>
            </template>
          </el-table-column>

          <el-table-column  :label="this.$l('lbl_status')" width="120">
            <template slot-scope="scope">
              <fd-label :code="scope.row.status" type="pf_gateway_internal_status"></fd-label>
            </template>
          </el-table-column>

          <el-table-column prop="updatedDate" width="200" :label="this.$l('lbl_update_date')"  :formatter='this.$dateFormat("updatedDate")'></el-table-column>

          <el-table-column width="120" :label="this.$l('lbl_operation')">
              <template slot-scope="scope">
                <el-button type="text" icon="el-icon-edit" :title="$l('btn_edit')" @click="handleEdit(scope.$index, scope.row)"></el-button>
                <el-button type="text" icon="el-icon-delete" :title="$l('btn_delete')" @click="handleDelete(scope.$index, scope.row)"></el-button>
                <el-button type="text" :icon="scope.row.status == '1' ? 'el-icon-remove-outline' : 'el-icon-circle-check'" :title="scope.row.status == '0' ? $l('btn_enable') : $l('btn_disable')" @click="updateStatus(scope.$index, scope.row)"></el-button>
              </template>
          </el-table-column>
        </el-table>
    </div>
</template>
<script>
import { listAll, remove, update } from '@/api/platform/gatewayExternalAPI'
import { LoadingUtil } from '@/utils/common/LoadingUtil'
import { tableHeight } from '@/utils/common/index'
export default {
  props: {
    queryObj_passed_in: {
      type: Object
    }
  },
  computed: {
    tHeight: function() {
      let options = {
        fullHeight: this.$store.getters.fullHeight,
        opened: this.$store.getters.sidebar.opened,
        showForm: this.$store.getters.showForm,
        obj: this,
        formHeight: 56,
        hasPage: false
      }
      return `${tableHeight(options)}px`
    }
  },
  data() {
    return {
      tableData: [],
      queryObj: this.queryObj_passed_in,
      tableHeight: '100',
      fullHeight: document.documentElement.clientHeight
    }
  },
  methods: {
    getList() {
      LoadingUtil.showLoading()
      listAll(this.queryObj)
        .then(response => {
          LoadingUtil.hideLoading()
          this.tableData = response.data
        })
        .catch(error => {
          console.log(error)
        })
    },
    settingTableHeight: function() {
      const topHeight = this.$refs['gatewayExternalTable'].getBoundingClientRect().top
      this.tableHeight = this.fullHeight - topHeight - 80
      this.$refs['gatewayExternalTable'].style.Height = this.tableHeight + 'px'
    },
    handleEdit(index, row) {
      this.$router.push({
        name: 'NewOrUpdateGatewayExternal',
        query: { id: row.id }
      })
    },
    handleDelete(index, row) {
      this.$confirm(this.$l('msg_delete_confirm'), this.$l('msg_delete_tips'), {
        confirmButtonText: this.$l('btn_confirm'),
        cancelButtonText: this.$l('btn_cancel'),
        type: 'warning'
      }).then(() => {
        remove({ 'id': row.id })
          .then(response => {
            this.$delete(this.tableData, index)
            this.$showSuccess(response.message)
          })
          .catch(error => {
            console.log(error)
          })
        this.$delete(this.tableData, index)
      }).catch(() => {})
    },
    updateStatus(index, rowData) {
      if (rowData.status === '0') {
        rowData.status = '1'
      } else {
        rowData.status = '0'
      }
      update(rowData)
        .then(response => {
          this.$showSuccess(response.message)
          this.getList()
        })
        .catch(error => {
          console.log(error)
          this.$showError('msg_system_error')
        })
    }
  },
  mounted: function() {
    this.getList()
    this.$nextTick(function() {
      this.settingTableHeight()
    })
    // window.onresize = () => {
    //   return (() => {
    //     this.fullHeight = document.documentElement.clientHeight
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
