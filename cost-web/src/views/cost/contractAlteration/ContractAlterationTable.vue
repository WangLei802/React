<!-- contractAlterationTable -->
<template>
  <div ref="contractAlterationTable">
    <el-table
      :data="tableData"
      stripe
      border
      tooltip-effect="dark"
      size="small"
      :height="tHeight"
      style="width: 100%"
    >
      <!-- 序号 -->
      <el-table-column
        type="index"
        :index="this.$getTableIndex(this.queryObj)"
        :label="this.$l('lbl_no')"
        width="80"
      ></el-table-column>

      <!-- 合同编号 -->
      <el-table-column prop="contractCode" show-overflow-tooltip width="250" :label="'合同编号'">
        <template slot-scope="scope">{{ scope.row.contractCode}}</template>
      </el-table-column>
      <!-- 合同名称 -->
      <el-table-column prop="contractName" show-overflow-tooltip :label="'合同名称'" width="200">
        <template slot-scope="scope">{{ scope.row.contractName}}</template>
      </el-table-column>
      <!-- 合同金额(元) -->
      <el-table-column prop="contractAmt" :label="'合同金额(元)'">
        <template slot-scope="scope">{{scope.row.contractAmt | NumFormat}}</template>
      </el-table-column>
      <!-- 本次变更金额(元) -->
      <el-table-column prop="contractAmt" :label="'本次变更金额(元)'">
        <template slot-scope="scope">{{scope.row.alterationAmt | NumFormat}}</template>
      </el-table-column>
      <!-- 提交日期 -->
      <el-table-column
        prop="operatorDate"
        width="250"
        :label="'提交日期'"
        :formatter="this.$dateFormat("operatorDate","yyyy-MM-dd")"
      ></el-table-column>
      <!-- 所属项目 -->
      <el-table-column prop="projectName" show-overflow-tooltip :label="'所属项目'">
        <template slot-scope="scope">{{scope.row.projectName}}</template>
      </el-table-column>
      <!-- 审批状态 -->
      <el-table-column prop="status" :label="'审批状态'">
        <template slot-scope="scope">
          <fd-label :code="scope.row.approveStatus" type="cost_flow_status"></fd-label>
        </template>
      </el-table-column>
      <!-- 操作 -->
      <el-table-column :label="this.$l('lbl_operation')" width="150">
        <template slot-scope="scope">
          <!-- 查看 -->
          <el-button
            size="mini"
            type="text"
            icon="el-icon-view"
            :title="$l('btn_detail')"
            @click="viewRow(scope.$index, scope.row)"
          ></el-button>

          <!-- 编辑 -->
          <el-button
            size="mmini"
            type="text"
            v-if="(scope.row.approveStatus === '0' || scope.row.approveStatus === '3') && $checkPersmissionByCode('cost:contractAlterationMgmt:create')"
            icon="el-icon-edit"
            :title="$l('btn_edit')"
            @click="editRow(scope.$index, scope.row)"
          ></el-button>

          <!-- 删除 -->
          <el-button
            size="mini"
            type="text"
            v-if="(scope.row.approveStatus === '0' || scope.row.approveStatus === '3') && $checkPersmissionByCode('cost:contractAlterationMgmt:delete')"
            icon="el-icon-delete"
            :title="$l('btn_delete')"
            @click="deleteRow(scope.$index, scope.row)"
          ></el-button>
          <!--<el-button size="mini"-->
          <!--type="text"-->
          <!--@click="checkStatus(scope.$index, scope.row)">通过</el-button>-->
          <!--<el-button size="mini"-->
          <!--type="text"-->
          <!--@click="closeStatus(scope.$index, scope.row)">驳回</el-button>-->
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination_bar">
      <mt-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="queryObj.pageNum"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="queryObj.pageSize"
        layout="sizes, prev, pager, next"
        :total="queryObj.count"
      ></mt-pagination>
    </div>
  </div>
</template>

<script>
import { LoadingUtil } from '@/utils/common/LoadingUtil'
import { getContractAlterationList, deleteContractAlteration, updateStatus } from '@/api/cost/contractAlteration'
import { NumFormat, Version } from '@/filters/cost/'
import { tableHeight } from '@/utils/common/index'
export default {
  props: {
    queryObj_passed_in: {
      type: Object
    },
    projectModel: {
      type: Object
    }
  },
  filters: {
    NumFormat,
    Version
  },
  data () {
    return {
      tableData: [],
      queryObj: this.queryObj_passed_in,
      tableHeight: '0',
      fullHeight: document.documentElement.clientHeight
    }
  },
  methods: {
    initTableData (response) {
      this.tableData = response.data.content
    },
    handleExpandClick (rowData) {
      let parentExpanded
      this.tableData.map(item => {
        if (item.accountObjectId === rowData.accountObjectId && item.accountingObjectName !== '') {
          item._expanded = !item._expanded
          parentExpanded = item._expanded
        }
        if (item.accountObjectId === rowData.accountObjectId && item.accountingObjectName === '') {
          item._show = parentExpanded
          item._expanded = parentExpanded
        }
      })
    },
    getList () {
      LoadingUtil.showLoading()
      // 转换参数
      let _queryObj = {
        companyId: this.projectModel.companyId,
        projectId: this.projectModel.projectId,
        contractTypeCode: this.queryObj.contractTypeCode,
        contractName: this.queryObj.contractName,
        status: this.queryObj.status,
        pageNum: this.queryObj.pageNum,
        pageSize: this.queryObj.pageSize
      }

      getContractAlterationList(_queryObj)
        .then(response => {
          LoadingUtil.hideLoading()
          this.initTableData(response)
          this.queryObj.count = response.data.totalElements
        })
        .catch(error => {
          console.log(error)
          this.$showError(error.message ? error.message : 'msg_system_error')
        })
    },
    // 查看
    viewRow (index, rowData) {
      this.$router.push({
        name: 'NewOrUpdateContractAlteration',
        query: { id: rowData.id, isEdit: false }
      })
    },
    // 编辑
    editRow (index, rowData) {
      this.$router.push({
        name: 'NewOrUpdateContractAlteration',
        query: { id: rowData.id, isEdit: true }
      })
    },
    deleteRow (index, rowData) {
      this.$confirm('确认删除该记录', {
        confirmButtonText: this.$l('btn_confirm'),
        cancelButtonText: this.$l('btn_cancel'),
        type: 'warning'
      }).then(() => {
        deleteContractAlteration(rowData)
          .then(response => {
            this.$showSuccess(response.message)
            if (response.status !== '404') this.$delete(this.tableData, index)
            this.getList()
          })
          .catch(error => {
            console.log(error)
            this.$showError(error.message ? error.message : 'msg_system_error')
          })
      })
        .catch(() => { })
    },
    checkStatus (index, rowData) {
      let param = {}
      param.id = rowData.id
      param.approveStatus = '2'
      updateStatus(param)
        .then(response => {
          if (response.status !== '404') {
            this.getList()
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    closeStatus (index, rowData) {
      let param = {}
      param.id = rowData.id
      param.approveStatus = '3'
      updateStatus(param)
        .then(response => {
          if (response.status !== '404') {
            this.getList()
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    handleSizeChange (val) {
      this.queryObj.pageSize = val
      this.getList()
    },
    handleCurrentChange (val) {
      this.queryObj.pageNum = val
      this.getList()
    }
  },
  computed: {
    tHeight: function () {
      let options = {
        fullHeight: this.$store.getters.fullHeight,
        opened: this.$store.getters.sidebar.opened,
        showForm: this.$store.getters.showForm,
        obj: this,
        otherHeight: 180
      }
      return `${tableHeight(options)}px`
    }
  }
}

</script>
<style lang='scss' scoped>
</style>
