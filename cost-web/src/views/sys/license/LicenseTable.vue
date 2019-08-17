
 <template>
  <div ref="licenseTable">
    <el-table :height="tHeight" :data="tableData" border stripe style="width: 100%" >
      <el-table-column type="index" :index="this.$getTableIndex(this.queryObj)" :label="this.$l('lbl_no')" width="60"></el-table-column>
      <el-table-column prop="productCode" :label="this.$l('lbl_license_product_code')" width="120"></el-table-column>
      <el-table-column prop="license" show-overflow-tooltip :label="this.$l('lbl_license_license')"></el-table-column>
      <el-table-column prop="updatedDate" :label="this.$l('lbl_update_date')"  :formatter='this.$dateFormat("updatedDate")' width="170"></el-table-column>
      <el-table-column :label="this.$l('lbl_operation')" width="150">
        <template slot-scope="scope">
          <el-button  type="text" icon="el-icon-view" :title="$l('btn_detail')" @click="editRow(scope.$index, scope.row)"></el-button>
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
import { getLicenseList } from '@/api/sys/licenseAPI'
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
        obj: this,
        formHeight: 56
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
    editRow(index, rowData) {
      this.$router.push({
        name: 'NewOrUpdateLicense',
        query: { id: rowData.id }
      })
    },
    settingTableHeight: function() {
      const topHeight = this.$refs['licenseTable'].getBoundingClientRect().top
      this.tableHeight = this.fullHeight - topHeight - 80
      this.$refs['licenseTable'].style.Height = this.tableHeight + 'px'
    },
    getList() {
      LoadingUtil.showLoading()
      getLicenseList(this.queryObj)
        .then(response => {
          LoadingUtil.hideLoading()
          response.data.content.map(item => {
            item.updateDate = new Date(item.updateDate).format()
            // item.license = (item.license).substring(0, 28) + '...'
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
