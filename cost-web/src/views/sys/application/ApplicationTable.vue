
<template>
  <div ref="applicationTable">
    <el-table :data="tableData" stripe :height="tableHeight" border style="width: 100%">
      <el-table-column type="index"  :label="this.$l('lbl_no')" width="80"></el-table-column>
      <el-table-column prop="code" :label="this.$l('lbl_application_code')" ></el-table-column>
      <el-table-column prop="name" :label="this.$l('lbl_application_name')" ></el-table-column>

      <el-table-column  :label="this.$l('lbl_application_type')">
        <template slot-scope="scope">
          <fd-label :code="scope.row.type" type="pf_application_type"></fd-label>
        </template>
      </el-table-column>

      <el-table-column prop="routePath" :label="this.$l('lbl_application_route_path')" ></el-table-column>
      <el-table-column prop="stakeholder" :label="this.$l('lbl_application_stakeholder')" ></el-table-column>


       <el-table-column prop="updatedDate" :label="this.$l('lbl_update_date')"  :formatter='this.$dateFormat("updatedDate")'></el-table-column>
      <el-table-column :label="this.$l('lbl_operation')" width="200">
        <template slot-scope="scope">
          <el-button type="text" icon="el-icon-edit" :title="$l('btn_edit')" @click="editRow(scope.$index, scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
  import { getApplicationList } from '@/api/sys/applicationAPI'
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
    data() {
      return {
        tableHeight: '0',
        tableData: [],
        queryObj: this.queryObj_passed_in,
        fullHeight: document.documentElement.clientHeight
      }
    },
    methods: {
      editRow(index, rowData) {
        this.$router.push({
          name: 'NewOrUpdateApplication',
          query: { id: rowData.id }
        })
      },
      settingTableHeight: function() {
        const topHeight = this.$refs['applicationTable'].getBoundingClientRect().top
        this.tableHeight = this.fullHeight - topHeight - 80
        this.$refs['applicationTable'].style.Height = this.tableHeight + 'px'
      },
      getList() {
        LoadingUtil.showLoading()
        getApplicationList(this.queryObj)
          .then(response => {
            LoadingUtil.hideLoading()
            response.data.map(item => { item.updatedDate = new Date(item.updatedDate).format() })
            this.tableData = response.data
          })
          .catch(error => {
            console.log(error)
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
