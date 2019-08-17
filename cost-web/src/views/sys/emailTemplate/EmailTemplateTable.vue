 <template>
  <div ref="emailTemplateTable">
    <el-table :height="tHeight" :data="tableData" border stripe style="width: 100%" >
      <el-table-column type="index" :label="this.$l('lbl_no')" width="60"></el-table-column>
      <el-table-column prop="templateCode" :label="this.$l('lbl_template_code')"></el-table-column>
      <el-table-column prop="templateType" :label="this.$l('lbl_template_type')"></el-table-column>
      <el-table-column prop="templateName" :label="this.$l('lbl_template_name')"></el-table-column>
      <el-table-column prop="templateDesc" :label="this.$l('lbl_template_desc')"></el-table-column>
      <el-table-column prop="templateContent" :label="this.$l('lbl_template_content')"></el-table-column>
      <el-table-column :label="this.$l('lbl_operation')" width="150">
        <template slot-scope="scope">
          <el-button  type="text" icon="el-icon-edit" :title="$l('btn_edit')" @click="editRow(scope.$index, scope.row)"></el-button>
          <!-- <el-button  type="text" icon="el-icon-view" :title="$l('btn_detail')" @click="editRow(scope.$index, scope.row)"></el-button> -->
          <!-- <el-button  type="text" icon="el-icon-delete" :title="$l('btn_delete')" @click="deleteRow(scope.$index, scope.row)"></el-button> -->
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
import { searchEmailTemplateList, deleteEmaileTemplate } from '@/api/sys/emailTemplateAPI'
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
      tableHeight: '0',
      tableData: [],
      queryObj: this.queryObj_passed_in,
      fullHeight: document.documentElement.clientHeight
    }
  },
  methods: {
    deleteRow(index, rowData) {
      this.$confirm(this.$l('msg_delete_confirm'), this.$l('msg_delete_tips'), {
        confirmButtonText: this.$l('btn_confirm'),
        cancelButtonText: this.$l('btn_cancel'),
        type: 'warning'
      }).then(() => {
        deleteEmailTemplate(rowData.id)
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
    editRow(index, rowData) {
      this.$router.push({
        name: 'NewOrUpdateEmailTemplate',
        query: { id: rowData.id }
      })
    },

    settingTableHeight: function() {
      const topHeight = this.$refs['emailTemplateTable'].getBoundingClientRect().top
      this.tableHeight = this.fullHeight - topHeight - 80
      this.$refs['emailTemplateTable'].style.Height = this.tableHeight + 'px'
    },
    getList() {
      LoadingUtil.showLoading()
      searchEmailTemplateList(this.queryObj)
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
