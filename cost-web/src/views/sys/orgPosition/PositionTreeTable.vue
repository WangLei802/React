
<template>
   <tree-grid :columns="columns" :tree-structure="true" :data-source="tableData" >
      <el-table-column  :label="this.$l('lbl_status')" width="100">
        <template slot-scope="scope">
          <fd-label :code="scope.row.status + ''" type="sys_status"></fd-label>
        </template>
      </el-table-column>
      <el-table-column :label="this.$l('lbl_operation')" width="130">
        <template slot-scope="scope">
          <el-button  type="text" icon="el-icon-plus" :title="$l('btn_add')" @click="handleCreate(scope.$index, scope.row)"></el-button>
          <el-button  type="text" icon="el-icon-edit" :title="$l('btn_edit')" @click="editRow(scope.$index, scope.row)"></el-button>
          <el-button v-if="scope.row.status == '1'"  type="text" icon="el-icon-remove-outline" :title="$l('btn_disable')" @click="disableOrActivate(scope.$index, scope.row)"></el-button>
          <el-button v-else  type="text" icon="el-icon-circle-check" :title="$l('btn_enable')" @click="disableOrActivate(scope.$index, scope.row)"></el-button>
          <el-button v-else  type="text" icon="el-icon-delete" :title="$l('btn_delete')" @click="disableOrActivate(scope.$index, scope.row)"></el-button>
          <el-button type="text"  icon="el-icon-delete" :title="$l('btn_delete')" @click="deleteIndex(scope.$index, scope.row)"></el-button>
        </template>
      </el-table-column>
    </tree-grid>
</template>
<script>
  import { getOrgPositionList, positionLifecycle, deletePosition } from '@/api/sys/positionAPI'
  import { LoadingUtil } from '@/utils/common/LoadingUtil'
  import TreeGrid from '@/components/sys/treeTable'
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
            text: this.$l('lbl_position_name'),
            dataIndex: 'name'
          },
          {
            text: this.$l('lbl_position_code'),
            dataIndex: 'code'
          }
        ],
        tableHeight: '0',
        tableData: [],
        queryObj: this.queryObj_passed_in,
        fullHeight: document.documentElement.clientHeight,
        orgName: ''
      }
    },
    methods: {
      editRow(index, row) {
        this.$router.push({
          name: 'NewOrUpdatePosition',
          query: { id: row.id, positionCode: row.code, handleType: 'edit', orgName: this.orgName }
        })
      },
      handleCreate(index, row) {
        this.$router.push({
          name: 'NewOrUpdatePosition',
          query: { id: row.id, positionCode: row.code, handleType: 'createSon', orgName: this.orgName }
        })
      },
      // settingTableHeight: function() {
      //   const topHeight = this.$refs['positionTable'].getBoundingClientRect().top
      //   this.tableHeight = this.fullHeight - topHeight - 80
      //   this.$refs['positionTable'].style.Height = this.tableHeight + 'px'
      // },
      getList(val) {
        if (val === undefined) {
          val = ''
        }
        this.orgName = val.orgName
        LoadingUtil.showLoading()
        var params = { orgCode: val.orgCode }
        getOrgPositionList(params)
          .then(response => {
            LoadingUtil.hideLoading()
            // response.data.content.map(item => { item.updateDate = new Date(item.updateDate).format() })

            this.tableData = response.data
          })
          .catch(error => {
            console.log(error)
          })
      },
      deleteIndex(index, row) {
        this.$confirm(this.$l('msg_delete_confirm'), this.$l('msg_delete_tips'), {
          confirmButtonText: this.$l('btn_confirm'),
          cancelButtonText: this.$l('btn_cancel'),
          type: 'warning'
        }).then(() => {
          LoadingUtil.showLoading()
          deletePosition(row.id).then(response => {
            LoadingUtil.hideLoading()
            this.$showSuccess(response.message)
            this.getList()
          }).catch(error => {
            console.log(error)
          })
        }).catch(() => {})
      },
      handleSizeChange(val) {
        this.queryObj.pageSize = val
        this.getList()
      },
      handleCurrentChange(val) {
        this.queryObj.pageNum = val
        this.getList()
      },
      disableOrActivate(index, row) {
        const params = {
          id: row.id,
          status: row.status
        }
        positionLifecycle(params)
          .then(response => {
            if (response.code === '2000') {
              this.$showSuccess(response.message)
              this.getList()
            } else {
              this.$showError(response.message)
            }
          })
          .catch(error => {
            console.log(error)
          })
      }
    },
    mounted: function() {
      this.getList()
      // this.$nextTick(function() {
      //   this.settingTableHeight()
      // })
      window.onresize = () => {
        return (() => {
          this.fullHeight = document.documentElement.clientHeight
        })()
      }
    },
    watch: {
      // fullHeight(val) {
      //   this.settingTableHeight()
      // }
    }
  }
</script>
<style>
  .app-container #crTable tr td:first-child .cell{text-align:left}
</style>
