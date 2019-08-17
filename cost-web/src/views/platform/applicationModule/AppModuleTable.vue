 <template>
  <div ref="appModuleTable">
    <el-table :data="tableData" :height="tHeight" border stripe style="width: 100%">
      <el-table-column type="index" :index="this.$getTableIndex(this.queryObj)"  :label="this.$l('lbl_no')" width="60"></el-table-column>
      <el-table-column prop="name" :label="this.$l('lbl_application_module_name')"></el-table-column>
      <el-table-column prop="code" :label="this.$l('lbl_application_module_code')"></el-table-column>
      <el-table-column prop="appName" :label="this.$l('lbl_application_name')"></el-table-column>
      <el-table-column  :label="this.$l('lbl_app_type')" >
        <template slot-scope="scope">
          <fd-label :code="scope.row.appType" type="pf_app_type"></fd-label>
        </template>
      </el-table-column>

      <!-- <el-table-column prop="templateDesc" :label="this.$l('lbl_template_desc')"></el-table-column> -->
      <el-table-column prop="updatedDate" :label="this.$l('lbl_update_date')"></el-table-column>
      <el-table-column :label="this.$l('lbl_operation')" width="150">
        <template slot-scope="scope">
          <el-button type="text" icon="el-icon-edit" :title="$l('btn_edit')" @click="editRow(scope.$index, scope.row)"></el-button>
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
import { searchApplicationModuleList } from '@/api/platform/applicationModuleAPI'
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
        name: 'NewOrUpdateAppModule',
        query: { id: rowData.id }
      })
    },

    settingTableHeight: function() {
      const topHeight = this.$refs['appModuleTable'].getBoundingClientRect().top
      this.tableHeight = this.fullHeight - topHeight - 80
      this.$refs['appModuleTable'].style.Height = this.tableHeight + 'px'
    },
    getList() {
      LoadingUtil.showLoading()
      searchApplicationModuleList(this.queryObj)
        .then(response => {
          LoadingUtil.hideLoading()
          response.data.content.map(item => {
            item.updatedDate = new Date(item.updatedDate).format()
          })
          this.tableData = response.data.content
          this.queryObj.count = response.data.totalElements
          this.queryObj.pageSize = response.data.size
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
