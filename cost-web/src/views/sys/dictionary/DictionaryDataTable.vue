
 <template>
  <div ref="dictDataTable">
    <tree-grid :columns="columns" :tree-structure="true" :data-source="tableData" >
      <el-table-column  :label="this.$l('lbl_is_sys')" width="100">
        <template slot-scope="scope">
          <fd-label :code="scope.row.isSys" type="sys_yes_no"></fd-label>
        </template>
      </el-table-column>
      <el-table-column  :label="this.$l('lbl_status')" width="100">
        <template slot-scope="scope">
          <fd-label :code="scope.row.status" type="sys_dictionary_status"></fd-label>
        </template>
      </el-table-column>
      <el-table-column :label="this.$l('lbl_operation')" width="130">
        <template slot-scope="scope">
          <el-button type="text" icon="el-icon-plus" :title="$l('btn_add')" @click="addDictionaryData(scope.$index, scope.row)"></el-button>
          <el-button type="text" icon="el-icon-edit" :title="$l('btn_edit')" @click="editRow(scope.$index, scope.row)"></el-button>
          <el-button v-if="scope.row.status == '1'" type="text" icon="el-icon-remove-outline" :title="$l('btn_disable')" @click="changeStatus(scope.$index, scope.row)"></el-button>
          <el-button v-else type="text" icon="el-icon-circle-check" :title="$l('btn_enable')" @click="changeStatus(scope.$index, scope.row)"></el-button>
        </template>
      </el-table-column>
    </tree-grid>
    <div class='pagination_bar'>
      <mt-pagination @size-change='handleSizeChange' @current-change='handleCurrentChange' :current-page.sync='queryObj.pageNum' :page-sizes='[10, 20, 30, 40]' :page-size='queryObj.pageSize' layout='sizes, prev, pager, next' :total='queryObj.count'>
      </mt-pagination>
    </div>
  </div>
</template>
 <script>
import { getDictionaryDataList, updateDictionaryDataStatus } from '@/api/sys/dictionaryAPI'
import { LoadingUtil } from '@/utils/common/LoadingUtil'
import TreeGrid from '@/components/sys/treeTable'
export default {
  props: {
    queryObj_passed_in: {
      type: Object
    }
  },
  components: {
    TreeGrid
  },
  data() {
    return {
      tableHeight: '0',
      tableData: [],
      queryObj: this.queryObj_passed_in,
      fullHeight: document.documentElement.clientHeight,
      columns: [
        {
          text: this.$l('lbl_label_cn'),
          dataIndex: 'dictLabelCn'
        },
        {
          text: this.$l('lbl_label_en'),
          dataIndex: 'dictLabelEn'
        },
        {
          text: this.$l('lbl_value'),
          dataIndex: 'dictValue'
        }
      ]
    }
  },
  methods: {
    editRow(index, rowData) {
      this.$router.push({
        name: 'NewOrUpdateDictionaryData',
        query: { dictType: rowData.dictType, id: rowData.id , parentName: rowData.dictLabelCn }
      })
    },
    changeStatus(index, rowData) {
      let confirm = this.$l('msg_disable_confirm')
      if (rowData.status === '0') {
        confirm = this.$l('msg_enable_confirm')
      }
      this.$confirm(confirm, this.$l('msg_status_tips'), {
        confirmButtonText: this.$l('btn_confirm'),
        cancelButtonText: this.$l('btn_cancel'),
        type: 'warning'
      }).then(() => {
        if (rowData.status === '1') {
          rowData.status = '0'
        } else {
          rowData.status = '1'
        }
        const requestData = {
          id: rowData.id,
          status: rowData.status,
          version: rowData.version
        }
        updateDictionaryDataStatus(requestData)
          .then(response => {
            this.getList()
            this.$showSuccess(response.message)
          })
          .catch(error => {
            console.log(error)
          })
      })
    },
    settingTableHeight: function() {
      const topHeight = this.$refs['dictDataTable'].getBoundingClientRect().top
      this.tableHeight = this.fullHeight - topHeight - 80
      this.$refs['dictDataTable'].style.Height = this.tableHeight + 'px'
    },
    getList() {
      LoadingUtil.showLoading()
      getDictionaryDataList(this.queryObj)
        .then(response => {
          LoadingUtil.hideLoading()
          // response.data.map(item => { item.updateDate = new Date(item.updateDate).format() })
          this.tableData = response.data
          // this.queryObj.count = response.data.totalElements
        })
        .catch(error => {
          console.log(error)
        })
    },
    addDictionaryData(index, row) {
      this.$router.push({
        name: 'NewOrUpdateDictionaryData',
        query: { dictType: row.dictType, parentId: row.id, parentName: row.dictLabelCn }
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
