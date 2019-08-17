<template>
  <div ref="dictTyeTable">
    <el-table :height="tHeight"
              :data="tableData" stripe border
              style="width: 100%;">
      <el-table-column type="index" :index="this.$getTableIndex(this.queryObj)" :label="this.$l('lbl_no')"
                       width="60"></el-table-column>
      <el-table-column prop="appCode" :label="this.$l('lbl_application_name')"></el-table-column>
      <el-table-column prop="dictName" :label="this.$l('lbl_dict_name')"></el-table-column>
      <el-table-column prop="dictType" :label="this.$l('lbl_dict_type')"></el-table-column>

      <el-table-column :label="this.$l('lbl_is_sys')" width="100">
        <template slot-scope="scope">
          <fd-label :code="scope.row.isSys" type="sys_yes_no"></fd-label>
        </template>
      </el-table-column>

      <el-table-column prop="updatedDate" :label="this.$l('lbl_update_date')"
                       :formatter='this.$dateFormat("updatedDate")'></el-table-column>
      <el-table-column :label="this.$l('lbl_operation')" width="150">
        <template slot-scope="scope">
          <el-button type="text" icon="el-icon-edit" :title="$l('btn_edit')"
                     @click="editRow(scope.$index, scope.row)"></el-button>
          <el-button type="text" icon="el-icon-tickets" :title="$l('btn_dictData')"
                     @click="editData(scope.$index, scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class='pagination_bar'>
      <mt-pagination @size-change='handleSizeChange' @current-change='handleCurrentChange'
                     :current-page.sync='queryObj.pageNum' :page-sizes="[10, 20, 30, 40]" :page-size='queryObj.pageSize'
                     layout="total, sizes, prev, pager, next, jumper" :total='queryObj.count' :page-count="7">
      </mt-pagination>
    </div>
  </div>
</template>
<script>
  import { getDictionaryTypeList } from '@/api/sys/dictionaryAPI'
  import { LoadingUtil } from '@/utils/common/LoadingUtil'
  import { tableHeight } from '@/utils/common/index'
  export default {
    props: {
      queryObj_passed_in: {
        type: Object
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

    methods: {
      editRow(index, rowData) {
        this.$router.push({
          name: 'NewOrUpdateDictionaryType',
          query: { id: rowData.id }
        })
      },
      editData(index, rowData) {
        this.$router.push({
          name: 'DictionaryDataList',
          query: { dictType: rowData.dictType }
        })
      },
      settingTableHeight: function() {
        // const topHeight = this.$refs['dictTyeTable'].getBoundingClientRect().top
        // this.tableHeight = this.fullHeight - topHeight - 80
        // this.$refs['dictTyeTable'].style.Height = this.tableHeight + 'px'
      },
      getList() {
        LoadingUtil.showLoading()
        getDictionaryTypeList(this.queryObj)
          .then(response => {
            LoadingUtil.hideLoading()
            response.data.content.map(item => {
              item.updateDate = new Date(item.updateDate).format()
            })
            this.tableData = response.data.content
            this.queryObj.count = response.data.totalElements
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
    }
  }
</script>
