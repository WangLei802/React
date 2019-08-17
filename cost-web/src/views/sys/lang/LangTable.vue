<template>
    <div ref="langTable">
        <el-table :data="tableData" :height="tHeight" stripe border style="width: 100%" >
            <el-table-column type="index" :index="this.$getTableIndex(this.queryObj)" :label="this.$l('lbl_no')" width="80"></el-table-column>
            <el-table-column prop="appCode" :label="this.$l('lbl_application_name')"></el-table-column>
            <el-table-column prop="langCode" :label="this.$l('lbl_lang_code')"></el-table-column>
            <el-table-column prop="langText" :label="this.$l('lbl_text')"></el-table-column>
            <el-table-column prop="langType" :label="this.$l('lbl_lang_type')"></el-table-column>

          <el-table-column prop="updatedDate" width="200" :label="this.$l('lbl_update_date')"  :formatter='this.$dateFormat("updatedDate")'></el-table-column>

          <el-table-column prop="remarks" :label="this.$l('lbl_remark')"></el-table-column>
            <el-table-column width="120" :label="this.$l('lbl_operation')">
                <template slot-scope="scope">
                    <el-button type="text"  icon="el-icon-edit" :title="$l('btn_edit')" @click="handleEdit(scope.$index, scope.row)"></el-button>
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
import { searchLangList, deleteLang } from '@/api/sys/i18nAPI'
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
  data() {
    return {
      tableData: [],
      queryObj: this.queryObj_passed_in
    }
  },
  methods: {
    getList() {
      LoadingUtil.showLoading()
      searchLangList(this.queryObj)
        .then(response => {
          LoadingUtil.hideLoading()
          response.data.content.map(item => { item.updateDate = new Date(item.updateDate).format() })

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
    },
    handleEdit(index, row) {
      this.$router.push({
        name: 'NewOrUpdateLang',
        query: { id: row.id }
      })
    },
    handleDelete(index, row) {
      deleteLang(row.id)
        .then(response => {
          this.$delete(this.tableData, index)
        })
        .catch(error => {
          console.log(error)
        })
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
  mounted: function() {
    this.getList()
  }
}
</script>
