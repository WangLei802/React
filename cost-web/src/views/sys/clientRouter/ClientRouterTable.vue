
<template>
  <div ref="clientRouterTable">
    <tree-grid :columns="columns" :tree-structure="true" :data-source="tableData">
      <el-table-column :label="this.$l('lbl_operation')" width="150px">
        <template slot-scope="scope">
          <el-button type="text" icon="el-icon-plus" v-if="scope.row._level!=1" :title="$l('btn_add')" @click="addRow(scope.$index, scope.row)"></el-button>
          <el-button type="text" icon="el-icon-edit" :title="$l('btn_edit')" @click="editRow(scope.$index, scope.row)"></el-button>
          <el-button type="text" icon="el-icon-delete" :title="$l('btn_edit')" @click="deleteRow(scope.$index, scope.row)"></el-button>
        </template>
      </el-table-column>
    </tree-grid>

  </div>
</template>
<script>
  import TreeGrid from '@/components/sys/treeTable'
  import { getAllClientRouters, deleteClientRouter } from '@/api/platform/clientRouterAPI'
  import { LoadingUtil } from '@/utils/common/LoadingUtil'
  export default {
    components: {
      TreeGrid
    },
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
    data() {
      return {
        tableHeight: '0',
        tableData: [],
        queryObj: this.queryObj_passed_in,
        fullHeight: document.documentElement.clientHeight,
        columns: [
          {
            text: this.$l('lbl_client_router_name'),
            dataIndex: 'name',
            width: 280
          },
          {
            text: this.$l('lbl_application_code'),
            dataIndex: 'appCode',
            width: 160
          },
          {
            text: this.$l('lbl_client_router_path'),
            dataIndex: 'path'
          },
          {
            text: this.$l('lbl_remark'),
            dataIndex: 'remark'
          }

        ]

      }
    },
    methods: {
      editRow(index, rowData) {
        this.$router.push({
          name: 'NewOrUpdateClientRouter',
          query: { id: rowData.id }
        })
      },
      addRow(index, rowData) {
        this.$router.push({
          name: 'NewOrUpdateClientRouter',
          query: { parentId: rowData.id }
        })
      },

      deleteRow(index, row) {
        this.$confirm(this.$l('msg_delete_confirm'), this.$l('msg_delete_tips'), {
          confirmButtonText: this.$l('btn_confirm'),
          cancelButtonText: this.$l('btn_cancel'),
          type: 'warning'
        }).then(() => {
          LoadingUtil.showLoading()
          deleteClientRouter(row.id).then(response => {
            LoadingUtil.hideLoading()
            this.$showSuccess(response.message)
            this.getList()
          }).catch(error => {
            console.log(error)
          })
        }).catch(() => {})
      },
      settingTableHeight: function() {
        const topHeight = this.$refs['clientRouterTable'].getBoundingClientRect().top
        this.tableHeight = this.fullHeight - topHeight - 80
        this.$refs['clientRouterTable'].style.Height = this.tableHeight + 'px'
      },
      getList() {
        LoadingUtil.showLoading()
        getAllClientRouters()
          .then(response => {
            LoadingUtil.hideLoading()
            response.data.map(item => { item.updateDate = new Date(item.updateDate).format() })
            this.tableData = response.data
          })
          .catch(error => {
            console.log(error)
          })
      },
      handleSizeChange(val) {
        this.queryObj.pageSize = val
        this.getList()
      },
      handleCurrentChange(val) {
        this.queryObj.pageNum = val
        this.getList()
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
<style>
  .app-container #crTable tr td:first-child .cell{text-align:left}
</style>
