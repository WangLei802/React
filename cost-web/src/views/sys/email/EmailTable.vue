<template>
    <div ref="screenHeight">

        <el-table :height="tHeight" :data="tableData" stripe border>
            <el-table-column type="index" :index="this.$getTableIndex(this.emailQueryModel)" :label="this.$l('lbl_no')" width="60"></el-table-column>
            <el-table-column prop="sendServer" :label="this.$l('lbl_email_send_server')"></el-table-column>
            <el-table-column prop="sendUser" :label="this.$l('lbl_email_send_user')"></el-table-column>
            <el-table-column prop="subject" :label="this.$l('lbl_email_subject')"></el-table-column>
            <el-table-column prop="sendTime" :label="this.$l('lbl_email_send_time')"></el-table-column>
            <el-table-column prop="emailType"  :label="this.$l('lbl_email_type')">
              <template slot-scope="scope">
                <fd-label :code="scope.row.emailType" type="sys_email_type"></fd-label>
              </template>
            </el-table-column>
            <el-table-column :label="this.$l('lbl_operation')" width="120">
                <template slot-scope="scope">
                    <el-button  type="text" icon="el-icon-edit" :title="$l('btn_edit')" @click="editRow(scope.$index,scope.row)"></el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class='pagination_bar'>
            <mt-pagination @size-change='handleSizeChange' @current-change='handleCurrentChange' :current-page.sync='emailQueryModel.pageNum' :page-sizes='[10, 20, 30, 40]' :page-size='emailQueryModel.pageSize' layout='sizes, prev, pager, next' :total='emailQueryModel.count'>
            </mt-pagination>
        </div>
    </div>
</template>
<script>
import { getEmailList } from '@/api/sys/emailAPI'
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
      fullHeight: document.documentElement.clientHeight,
      tableData: [],
      emailQueryModel: this.queryObj_passed_in
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
  methods: {
    getList() {
      if (this.emailQueryModel.sendTime !== '') {
        this.emailQueryModel.sendTime = new Date(this.emailQueryModel.sendTime).format()
      }
      LoadingUtil.showLoading()
      getEmailList(this.emailQueryModel)
        .then(response => {
          LoadingUtil.hideLoading()
          this.tableData = response.data.content
          this.emailQueryModel.count = response.data.totalElements
        })
        .catch(error => {
          console.log(error)
          this.$showError('msg_system_error')
        })
    },
    editRow(index, rowData) {
      this.$router.push({
        name: 'EmailDetails',
        query: { id: rowData.id }
      })
    },
    settingTableHeight: function() {
      const topHeight = this.$refs['screenHeight'].getBoundingClientRect().top
      this.tableHeight = this.fullHeight - topHeight - 80
      this.$refs['screenHeight'].style.Height = this.tableHeight + 'px'
    },
    handleSizeChange(val) {
      this.emailQueryModel.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.emailQueryModel.pageNum = val
      this.getList()
    }
  },
  watch: {
    fullHeight(val) {
      this.settingTableHeight()
    }
  }
}
</script>
