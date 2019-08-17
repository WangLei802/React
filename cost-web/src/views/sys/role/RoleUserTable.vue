
 <template>
  <div ref="roleUserTable">
    <el-table :height="tHeight" :data="tableData" stripe border style="width: 100%">
      <el-table-column type="index" :index="this.$getTableIndex(this.queryObj)" :label="this.$l('lbl_no')" width="80"></el-table-column>
      <el-table-column prop="username" :label=" this.$l('lbl_userName')" width="100" ></el-table-column>
      <el-table-column prop="nickName" :label=" this.$l('lbl_nickName')"></el-table-column>
      <el-table-column prop="email" :label="this.$l('lbl_email')" width="200"></el-table-column>
      <el-table-column prop="mobile" :label="this.$l('lbl_mobile')" width="150"></el-table-column>
      <el-table-column prop="phone" :label="this.$l('lbl_phone')" width="150"></el-table-column>
      <el-table-column prop="orgNames" :label="this.$l('lbl_org_name')" width="200"></el-table-column>
      <el-table-column :label="this.$l('lbl_status')" width="100" >
        <template slot-scope="scope" >
          <fd-label :code="scope.row.status" type="sys_user_status"></fd-label>
        </template>
      </el-table-column>
      <el-table-column :label="this.$l('lbl_operation')" width="150">
        <template slot-scope="scope">
          <el-button type="text" icon="el-icon-delete" :title="$l('btn_delete')" @click="unbindRoleUser(scope.$index, scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class='pagination_bar'>
      <mt-pagination @size-change='handleSizeChange' @current-change='handleCurrentChange'
                     :current-page.sync='queryObj.pageNum' :page-sizes='[10, 20, 30, 40]'
                     :page-size='queryObj.pageSize' layout='sizes, prev, pager, next' :total='queryObj.count'>
      </mt-pagination>
    </div>
  </div>
</template>
 <script>
import { getRoleUserList, unbindRoleUser } from '@/api/sys/roleAPI'
import { LoadingUtil } from '@/utils/common/LoadingUtil'
import { tableHeight } from '@/utils/common/index'
export default {
  props: {
    queryObj_passed_in: {
      type: Object
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
    unbindRoleUser(index, row) {
      this.$confirm(this.$l('msg_delete_confirm'), this.$l('msg_delete_tips'), {
        confirmButtonText: this.$l('btn_confirm'),
        cancelButtonText: this.$l('btn_cancel'),
        type: 'warning'
      }).then(() => {
        const body = { roleCode: this.$route.query.roleCode, username: row.username }
        LoadingUtil.showLoading()
        unbindRoleUser(body).then(response => {
          LoadingUtil.hideLoading()
          this.$showSuccess(response.message)
          this.getList()
        }).catch(error => {
          console.log(error)
        })
      }).catch(() => {})
    },
    settingTableHeight: function() {
      const topHeight = this.$refs['roleUserTable'].getBoundingClientRect().top
      this.tableHeight = this.fullHeight - topHeight - 80
      this.$refs['roleUserTable'].style.Height = this.tableHeight + 'px'
    },
    getList() {
      LoadingUtil.showLoading()
      getRoleUserList(this.queryObj)
        .then(response => {
          LoadingUtil.hideLoading()
          response.data.content.forEach(function(value, index, array) {
            value.orgNames = value.orgNames.join(',')
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
