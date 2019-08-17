<template>
  <div>
    <tree-grid :columns="columns" :tree-structure="true" :data-source="tableData" >
      <el-table-column  :label="this.$l('lbl_org_type')" width="100">
        <template slot-scope="scope">
          <fd-label :code="scope.row.orgType + ''" type="sys_org_type"></fd-label>
        </template>
      </el-table-column>
      <el-table-column  :label="this.$l('lbl_status')" width="100">
        <template slot-scope="scope">
          <fd-label :code="scope.row.status + ''" type="sys_status"></fd-label>
        </template>
      </el-table-column>

      <el-table-column :label="this.$l('lbl_operation')" width="130">
        <template slot-scope="scope">
          <el-button  type="text" icon="el-icon-plus" :title="$l('btn_add')" @click="handleCreate(scope.$index, scope.row)"></el-button>
          <el-button  type="text" icon="el-icon-edit" :title="$l('btn_edit')" @click="handleUpdate(scope.$index, scope.row)"></el-button>
          <el-button v-if="scope.row.status == '1'"  type="text" icon="el-icon-remove-outline" :title="$l('btn_disable')" @click="handleDisableOrg(scope.$index, scope.row)"></el-button>
          <el-button v-else  type="text" icon="el-icon-circle-check" :title="$l('btn_enable')" @click="handleEnableOrg(scope.$index, scope.row)"></el-button>
        </template>
      </el-table-column>
    </tree-grid>
  </div>
</template>
<script>
import { getTopOrgList, enableOrgList, disableOrgList } from '@/api/sys/orgAPI'
import TreeGrid from '@/components/sys/treeTable'
import { LoadingUtil } from '@/utils/common/LoadingUtil'
export default {
  props: {
    queryObj_passed_in: {
      type: Object
    },
    externalData: {
      type: Array,
      default: function() {
        return []
      }
    }
  },
  components: {
    TreeGrid
  },
  data() {
    return {
      columns: [
        {
          text: this.$l('lbl_org_code'),
          dataIndex: 'orgCode'
        },
        {
          text: this.$l('lbl_org_name'),
          dataIndex: 'orgName'
        },
        {
          text: this.$l('lbl_org_incharge'),
          dataIndex: 'orgInCharge'
        },
        {
          text: this.$l('lbl_org_sort'),
          dataIndex: 'sort'
        }
      ],
      orgModel: {
        id: ''
      },
      tableData: []
    }
  },
  methods: {
    getList() {
      LoadingUtil.showLoading()
      getTopOrgList()
        .then(response => {
          LoadingUtil.hideLoading()
          this.tableData = response.data
        })
        .catch(error => {
          console.log(error)
        })
    },
    handleCreate(index, row) {
      this.$router.push({
        name: 'NewOrUpdateOrgData',
        query: { id: row.id, handleType: 'createSon' }
      })
    },
    handleUpdate(index, row) {
      this.$router.push({
        name: 'NewOrUpdateOrgData',
        query: { id: row.id, handleType: 'edit' }
      })
    },
    handleEnableOrg(index, row) {
      this.$confirm(this.$l('msg_enable_confirm'), {
        confirmButtonText: this.$l('btn_confirm'),
        cancelButtonText: this.$l('btn_cancel'),
        type: 'warning'
      }).then(() => {
        this.orgModel.id = row.id
        enableOrgList(this.orgModel)
          .then(response => {
            this.$showSuccess(response.message)
            this.getList()
          })
          .catch(error => {
            console.log(error)
          })
      }).catch(() => {})
    },
    handleDisableOrg(index, row) {
      this.$confirm(this.$l('msg_disable_confirm') , {
        confirmButtonText: this.$l('btn_confirm'),
        cancelButtonText: this.$l('btn_cancel'),
        type: 'warning'
      }).then(() => {
        this.orgModel.id = row.id
        disableOrgList(this.orgModel)
          .then(response => {
            this.$showSuccess(response.message)
            this.getList()
          })
          .catch(error => {
            console.log(error)
          })
      }).catch(() => {})
    }
  },
  mounted() {
    this.getList()
  }
}
</script>

<style>
  .app-container #crTable tr td:first-child .cell{text-align:left}
</style>
