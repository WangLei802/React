
<template>
  <div ref="applicationAPITable">
    <el-table :data="tableData" :height="tHeight" stripe border style="width: 100%">
      <el-table-column type="index" :index="this.$getTableIndex(this.queryObj)"  :label="this.$l('lbl_no')" width="80"></el-table-column>
      <el-table-column prop="appName" :label="this.$l('lbl_application_name')" width="150" ></el-table-column>
      <el-table-column prop="moduleName" :label="this.$l('lbl_application_module_name')" width="200"  ></el-table-column>
      <!--名称-->
      <el-table-column prop="name" :label="this.$l('lbl_api_name')" width="150" ></el-table-column>
      <el-table-column prop="endpoint" :label="this.$l('lbl_api_endpoint')" ></el-table-column>
      <el-table-column width="150">
        <template slot-scope="scope">
          <el-button type="danger" :title="$l('btn_edit')" @click="handleDelete(scope.$index, scope.row)">{{$l("btn_delete")}}</el-button>
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
  import { existApiList, deleteApi } from '@/api/platform/apiGroupAPI'
  import { LoadingUtil } from '@/utils/common/LoadingUtil'
  import { tableHeight } from '@/utils/common/index'
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
      handleDelete(index, rowData) {
        LoadingUtil.showLoading()
        deleteApi({ 'apiId': rowData.id, 'groupId': this.queryObj_passed_in.groupId, 'version': rowData.version })
          .then(response => {
            this.$showSuccess(response.message)
            this.getList()
          })
          .catch(error => {
            console.log(error)
          })
      },
      editRow(index, rowData) {
        this.$router.push({
          name: 'NewOrUpdateApplicationAPI',
          query: { id: rowData.id }
        })
      },
      settingTableHeight: function() {
        let topHeight = this.$refs['applicationAPITable'].getBoundingClientRect().top
        this.tableHeight = this.fullHeight - topHeight - 80
        this.$refs['applicationAPITable'].style.Height = this.tableHeight + 'px'
      },
      getList() {
        LoadingUtil.showLoading()
        existApiList(this.queryObj)
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
