
 <template>
    <div class="audit" ref="langTable">
        <el-table :height="tHeight" :data="tableData" stripe border style="width: 100%">
            <el-table-column type="index" :index="this.$getTableIndex(this.queryObj)" :label="this.$l('lbl_no')" width="80"></el-table-column>
            <el-table-column prop="remote" :label="this.$l('lbl_logAccessIp')"></el-table-column>
            <el-table-column prop="principal" :label="this.$l('lbl_user')" width="180"></el-table-column>
            <el-table-column prop="url" label="URL"></el-table-column>
            <el-table-column prop="type" :label="this.$l('lbl_log_type')"></el-table-column>
            <el-table-column prop="requestTs" :label="this.$l('lbl_requestts')" :formatter='this.$dateFormat("requestTs")'></el-table-column>
            <el-table-column :label="this.$l('lbl_operation')" width="150">
                <template slot-scope="scope">
                    <el-button type="text" icon="el-icon-edit" :title="$l('btn_edit')" @click="editRow(scope.row,scope.$index)"></el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination_bar">
            <mt-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="queryObj.pageNum" :page-sizes="[10, 20, 30, 40]" :page-size="queryObj.pageSize" layout="sizes, prev, pager, next" :total='queryObj.count'>
            </mt-pagination>
        </div>
    </div>
</template>
 <script>
import { searchAuditLogList } from '@/api/sys/auditLogAPI'
import { LoadingUtil } from '@/utils/common/LoadingUtil'
import { tableHeight } from '@/utils/common/index'
import Vue from 'vue'
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
      return tableHeight(options)
    }
  },
  methods: {
    editRow(rowData, index) {
      const params = {
        type: 'edit',
        index: index,
        rowData: rowData,
        id: rowData.id
      }
      this.$router.push({ name: 'logdetails', query: { id: params.id }})
    },

    settingTableHeight() {
      const fullHeight = document.documentElement.clientHeight
      const topHeight = this.$refs['langTable'].getBoundingClientRect().top
      this.tableHeight = fullHeight - topHeight - 80
      this.$refs['langTable'].style.Height = this.tableHeight + 'px'
    },
    getList() {
      LoadingUtil.showLoading()
      searchAuditLogList(this.queryObj)
        .then(response => {
          LoadingUtil.hideLoading()
          response.data.content.map(item => { item.timestamp = new Date(item.timestamp).format() })
          this.tableData = response.data.content
          this.queryObj.count = response.data.totalElements
        })
        .catch(error => {
          console.log(error)
          this.$showError('msg_system_error')
        })
    },
    handleSizeChange(val) {
      this.queryObj.pageSize = val
      this.queryObj.pageNum = 1
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
Vue.component('table-operation-audit-log', {
  render: function(createElement) {
    return createElement('span', {}, [
      createElement(
        'i',
        {
          class: 'el-icon-edit',
          style: { cursor: 'pointer', margin: '10px' },
          on: { click: this.editRow }
        },
        this.$l('btn_edit')
      )
    ])
  },
  mounted: function() {},
  props: {
    rowData: {
      type: Object
    },
    field: {
      type: String
    },
    index: {
      type: Number
    }
  },
  methods: {
    editRow() {
      const params = {
        type: 'edit',
        index: this.index,
        rowData: this.rowData,
        id: this.rowData.id
      }
      this.$router.push({ name: 'logdetails', query: { id: params.id }})
    }
  }
})
</script>
