<template>
  <div ref="applicationAPITable">
    <el-table :data="tableData" :height="tHeight" stripe border style="width: 100%">
      <el-table-column type="index" :index="this.$getTableIndex(this.queryObj)"  :label="this.$l('lbl_no')" width="80"></el-table-column>
      <el-table-column prop="appName" :label="this.$l('lbl_application_name')" width="150" ></el-table-column>
      <el-table-column prop="moduleName" :label="this.$l('lbl_application_module_name')" width="200"  ></el-table-column>
      <el-table-column prop="name" :label="this.$l('lbl_api_group')" ></el-table-column>

      <el-table-column :label="this.$l('lbl_operation')" width="200">
        <template slot-scope="scope">
          <el-button type="text" icon="el-icon-edit" :title="$l('btn_edit')" @click="editRow(scope.$index, scope.row)"></el-button>
          <el-button type="text" icon="el-icon-delete" :title="$l('btn_edit')" @click="deleteRow(scope.$index, scope.row)"></el-button>
          <el-button slot="reference" type="text" icon="el-icon-menu" @click="allocationRow(scope.$index, scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
     <div class='pagination_bar'>
      <mt-pagination @size-change='handleSizeChange' @current-change='handleCurrentChange' :current-page.sync='queryObj.pageNum' :page-sizes='[10, 20, 30, 40]' :page-size='queryObj.pageSize' layout='sizes, prev, pager, next' :total='queryObj.count'>
      </mt-pagination>
    </div>
  </div>
</template>
<script>
  import { LoadingUtil } from '@/utils/common/LoadingUtil'
  import { tableHeight } from '@/utils/common/index'
  import { getApplicationAPIGroupList, deleteApiGroup } from '@/api/platform/apiGroupAPI'
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
    computed: {
      tHeight: function() {
        let options = {
          fullHeight: this.$store.getters.fullHeight,
          opened: this.$store.getters.sidebar.opened,
          showForm: this.$store.getters.showForm,
          obj: this
        }
        return `${tableHeight(options)}px`
      }
    },
    data() {
      return {
        tableHeight: '100',
        tableData: [],
        queryObj: this.queryObj_passed_in,
        fullHeight: document.documentElement.clientHeight
      }
    },
    methods: {
      editRow(index, rowData) {
        this.$router.push({
          name: 'NewOrUpdateApplicationAPIGroup',
          query: { id: rowData.id, version: rowData.version }
        })
      },
      allocationRow(index, rowData) {
        this.$router.push({
          name: 'ApplicationAPIAllocation',
          query: { groupId: rowData.id }
        })
      },
      deleteRow(index, rowData) {
        this.$confirm(this.$l('msg_delete_confirm'), this.$l('msg_delete_tips'), {
          confirmButtonText: this.$l('btn_confirm'),
          cancelButtonText: this.$l('btn_cancel'),
          type: 'warning'
        }).then(() => {
          deleteApiGroup({ 'id': rowData.id, 'version': rowData.version })
            .then(response => {
              this.$showSuccess(response.message)
            })
            .catch(error => {
              console.log(error)
              this.$showError('msg_system_error')
            })
          this.$delete(this.tableData, index)
        })
          .catch(() => {})
      },
      settingTableHeight: function() {
        let topHeight = this.$refs['applicationAPITable'].getBoundingClientRect().top
        this.tableHeight = this.fullHeight - topHeight - 80
        this.$refs['applicationAPITable'].style.Height = this.tableHeight + 'px'
      },
      getList() {
        LoadingUtil.showLoading()

        getApplicationAPIGroupList(this.queryObj)
          .then(response => {
            LoadingUtil.hideLoading()
            this.tableData = response.data.content
            this.queryObj.count = response.data.totalElements
            this.queryObj.pageSize = response.data.pageSize
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
    },
    watch: {
      fullHeight(val) {
        this.settingTableHeight()
      }
    }
  }
</script>
