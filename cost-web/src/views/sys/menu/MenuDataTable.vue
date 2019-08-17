<template>
  <div>
    <tree-grid :columns="columns" :tree-structure="true" :data-source="tableData" >

      <el-table-column  :label="this.$l('lbl_status')" width="100">
        <template slot-scope="scope">
          <fd-label :code="scope.row.status + ''" type="sys_menu_status"></fd-label>
        </template>
      </el-table-column>

      <el-table-column :label="this.$l('lbl_operation')" width="130">
        <template slot-scope="scope">
          <el-button  type="text" icon="el-icon-plus" :title="$l('btn_add')" @click="handleCreate(scope.$index, scope.row)"></el-button>
          <el-button  type="text" icon="el-icon-edit" :title="$l('btn_edit')" @click="handleUpdate(scope.$index, scope.row)"></el-button>
          <el-button v-if="scope.row.status == '0'"  type="text" icon="el-icon-remove-outline" :title="$l('btn_disable')" @click="handleDisableMenu(scope.$index, scope.row)"></el-button>
          <el-button v-else  type="text" icon="el-icon-circle-check" :title="$l('btn_enable')" @click="handleEnableMenu(scope.$index, scope.row)"></el-button>
        </template>
      </el-table-column>
    </tree-grid>
  </div>
</template>
<script>
import { getTopMenuList, enableMenuList, disableMenuList } from '@/api/sys/menuAPI'
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
          text: this.$l('lbl_menu_name_cn'),
          dataIndex: 'menuNameZh'
        },
        {
          text: this.$l('lbl_menu_router_name'),
          dataIndex: 'clientRouter.name'
        },
        {
          text: 'url',
          dataIndex: 'clientRouter.path'
        },
        {
          text: this.$l('lbl_application_code'),
          dataIndex: 'appCode',
          width: 100
        },
        {
          text: this.$l('lbl_remark'),
          dataIndex: 'remarks',
          width: 100
        }
      ],
      tableData: []
    }
  },
  methods: {
    getList() {
      LoadingUtil.showLoading()
      getTopMenuList()
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
        name: 'NewOrUpdateMenuData',
        query: { id: row.id, handleType: 'createSon' }
      })
    },
    handleUpdate(index, row) {
      this.$router.push({
        name: 'NewOrUpdateMenuData',
        query: { id: row.id, handleType: 'edit' }
      })
    },
    handleEnableMenu(index, row) {
      this.$confirm('确实要启用该菜单及所有子菜单吗？', '启用警告', {
        confirmButtonText: this.$l('btn_confirm'),
        cancelButtonText: this.$l('btn_cancel'),
        type: 'warning'
      }).then(() => {
        enableMenuList(row.id)
          .then(response => {
            this.$showSuccess(response.message)
            this.getList()
          })
          .catch(error => {
            console.log(error)
          })
      }).catch(() => {})
    },
    handleDisableMenu(index, row) {
      this.$confirm('确实要禁用该菜单及所有子菜单吗？', '禁用警告', {
        confirmButtonText: this.$l('btn_confirm'),
        cancelButtonText: this.$l('btn_cancel'),
        type: 'warning'
      }).then(() => {
        disableMenuList(row.id)
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
