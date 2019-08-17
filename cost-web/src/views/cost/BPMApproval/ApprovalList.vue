
<template>
  <div ref="ApprovalList">
    <el-table :data="tableData"
              stripe
              border
              tooltip-effect="dark"
              :height="tHeight"
              style="width: 100%"
              size="small">
      <el-table-column prop="projectName"
                       width="150"
                       :label="'项目名称'"  >
        <template slot-scope="scope">
          {{ scope.row.projectName}}
        </template>
      </el-table-column>
     <el-table-column prop="approveRemark"
                       width="150"
                       :label="'业务类型'"  >
        <template slot-scope="scope">
          {{ scope.row.approveRemark}}
        </template>
      </el-table-column>


      <el-table-column prop="bizTableName"
                       width="150"
                       :label="'业务表名'" >
        <template slot-scope="scope">
          {{ scope.row.bizTableName}}
        </template>
      </el-table-column>

      <el-table-column prop="bizTablePkValue"
                       :label="'业务表主键字段值'"
                       width="150">
        <template slot-scope="scope">
          {{ scope.row.bizTablePkValue}}
        </template>
      </el-table-column>

        <el-table-column prop="procinstid"
                       :label="'BPM流水号'"
                       width="150">
        <template slot-scope="scope">
          {{ scope.row.procinstid}}
        </template>
      </el-table-column>
      <el-table-column prop="updatedDate"
                       :label="'提交时间'"
                       width="150">
        <template slot-scope="scope">
          {{ new Date(scope.row.updatedDate).format('yyyy-MM-dd hh:mm:ss') }}
        </template>
      </el-table-column>
      <!-- 操作 -->
      <el-table-column :label="this.$l('lbl_operation')"
                       >
        <template slot-scope="scope">

          <!-- 通过 -->

          <el-button size="mini" v-if="!scope.row.isSuccess"
                     type="text"
                     @click="approveRecord(scope.$index, scope.row)">通过</el-button>
          <el-button size="mini" v-if="scope.row.isSuccess"
                     type="text"
                     @click="approveRecord(scope.$index, scope.row)" :disabled="true">已审批通过</el-button>
          <!-- 驳回 -->
          <el-button size="mini" v-if="!scope.row.isReject"
                     type="text"
                     @click="rejectRecord(scope.$index, scope.row)" >驳回</el-button>
           <el-button size="mini"  v-if="scope.row.isReject"
                     type="text"
                     @click="rejectRecord(scope.$index, scope.row)" :disabled="true">已驳回</el-button>


        </template>
      </el-table-column>
    </el-table>
    <div class='pagination_bar'>
      <mt-pagination @size-change='handleSizeChange'
                     @current-change='handleCurrentChange'
                     :current-page.sync='pageNum'
                     :page-sizes='[10, 20, 30, 40]'
                     :page-size='pageSize'
                     layout='sizes, prev, pager, next'
                     :total='count'>
      </mt-pagination>
    </div>
  </div>
</template>

<script>
  import { LoadingUtil } from '@/utils/common/LoadingUtil'
  import { getAllList, callBpm } from '@/api/cost/bpm'
  import { NumFormat, Version, dateFormat } from '@/filters/cost/'
  import { deepCopy } from '@/utils/cost/objectHelper'
  import { tableHeight } from '@/utils/common/index'
  export default {
    filters: {
      NumFormat,
      Version,
      dateFormat
    },
    data() {
      return {
        buttonNameReject: '驳回',
        buttonNameAppove: '通过',
        isSuccess: false,
        isReject: false,
        pageNum: 1,
        pageSize: 20,
        count: 0,
        tableData: [],
        tableHeight: '0',
        fullHeight: document.documentElement.clientHeight
      }
    },
    computed: {
      tHeight: function() {
        let options = {
          fullHeight: this.$store.getters.fullHeight,
          opened: this.$store.getters.sidebar.opened,
          showForm: this.$store.getters.showForm,
          obj: this,
          otherHeight:140
        }
        return `${tableHeight(options)}px`
      }
    },
    methods: {
      initTableData(response) {
        console.log(response)
        this.tableData = response.data.content
      },
      getList() {
        LoadingUtil.showLoading()

        let _queryObj = {
          pageNum: this.pageNum,
          pageSize: this.pageSize
        }

        getAllList(_queryObj)
          .then(response => {
            LoadingUtil.hideLoading()
            this.initTableData(response)
            this.count = response.data.totalElements
          })
          .catch(error => {
            console.log(error)
            this.$showError(error.message ? error.message : 'msg_system_error')
          })
      },
      // 查看
      viewRow(index, rowData) {
        this.$router.push({
          name: 'ContractsSignCostSplit',
          query: { id: rowData.id }
        })
      },
      // 通过
      approveRecord(index, rowData) {
        let parameter = {}
        parameter.boid = rowData.bizTablePkValue
        parameter.state = 1
        parameter.procInstID = rowData.procinstid
        parameter.message = '审批通过'
        callBpm(JSON.stringify(parameter)).then(response => {
          debugger
          if (response.data === '调用成功') {
            this.tableData.forEach((item, indexs) => {
              if (indexs === index) {
                this.tableData[indexs].isSuccess = true
                this.$set(this.tableData, indexs, item)
              }
            })
          }
          this.$showSuccess(response.message || parameter.message)
        })
          .catch(error => {
            console.log(error)
            this.$showError(error.message ? error.message : 'msg_system_error')
          })
      },
      // 驳回
      rejectRecord(index, rowData) {
        let parameter = {}
        parameter.boid = rowData.bizTablePkValue
        parameter.state = 0
        parameter.procInstID = rowData.procinstid
        parameter.message = '审批驳回'
        callBpm(JSON.stringify(parameter)).then(response => {
          if (response.data === '调用成功') {
            this.tableData.forEach((item, indexs) => {
              if (indexs === index) {
                this.tableData[indexs].isSuccess = true
                this.tableData[indexs].isReject = true
                this.$set(this.tableData, indexs, item)
              }
            })

            // this.buttonNameReject = '已驳回'
            // rowData.buttonNameAppove = '已驳回'
          }
          this.$showSuccess(response.message || parameter.message)
        })
          .catch(error => {
            console.log(error)
            this.$showError(error.message ? error.message : 'msg_system_error')
          })
      },
      handleSizeChange(val) {
        this.pageSize = val
        this.getList()
      },
      handleCurrentChange(val) {
        this.pageNum = val
        this.getList()
      },
      settingTableHeight: function() {
        const topHeight = this.$refs['ApprovalList'].getBoundingClientRect().top
        this.tableHeight = this.fullHeight - topHeight - 80
        this.$refs['ApprovalList'].style.Height = this.tableHeight + 'px'
      }
    },
    mounted: function() {
      this.getList()
      this.$nextTick(function() {
        this.settingTableHeight()
      })
    //   window.onresize = () => {
    //     return (() => {
    //       this.fullHeight = document.documentElement.clientHeight
    //     })()
    //   }
    },
    watch: {
      fullHeight(val) {
        this.settingTableHeight()
      }
    }
  }

</script>
<style lang='scss' scoped>
</style>
