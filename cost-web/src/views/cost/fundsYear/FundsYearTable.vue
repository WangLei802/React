<!-- FundsYearTable -->
<template>
  <div ref="FundsYearTable">
    <el-table
      :data="tableData"
      stripe
      border
      size="small"
      :height="tHeight"
      tooltip-effect="dark"
      :row-style="showRow"
      style="width: 100%"
    >
      <!-- 序号 -->
      <el-table-column
        type="index"
        :index="this.$getTableIndex(this.queryObj_passed_in)"
        :label="this.$l('lbl_no')"
        width="50"
      ></el-table-column>

      <!-- 资金计划名称 -->
      <el-table-column prop="fundsPlanName" show-overflow-tooltip :label="'资金计划名称'">
        <template slot-scope="scope">
          <div style="text-align:left" :title="scope.row.fundsPlanName">
            <i
              :class="!scope.row._expanded ? 'fa fa-plus-square-o' : 'fa fa-minus-square-o' "
              :title="!scope.row._expanded ? '展开' : '收起'"
              style="font-size:14px;font-weight:bold;cursor:pointer"
              v-show="scope.row._showExpanded"
              @click="handleExpandClick(scope.row)"
            ></i>
            &nbsp;&nbsp; {{scope.row.fundsPlanName | cutString(24)}}
          </div>
        </template>
      </el-table-column>

      <!-- 成本分期 -->
      <el-table-column prop="accountingObjectName" show-overflow-tooltip :label="'成本分期'"></el-table-column>

      <!-- 计划付款总金额(元) -->
      <el-table-column prop="payMoneySum" :label="'计划付款总金额(元)'" show-overflow-tooltip width="180">
        <template slot-scope="scope">{{ scope.row.payMoneySum|NumFormat}}</template>
      </el-table-column>

      <!-- 资金计划年份 -->
      <el-table-column prop="fundsYear" show-overflow-tooltip :label="'资金计划年份'"></el-table-column>

      <!-- 经办人 -->
      <el-table-column prop="operator" show-overflow-tooltip :label="'经办人'"></el-table-column>

      <!-- 提交日期 -->
      <el-table-column
        prop="operateDate"
        show-overflow-tooltip
        width="100"
        :label="'提交日期'"
        :formatter="this.$dateFormat("operateDate","yyyy-MM-dd")"
      ></el-table-column>

      <!-- 审批状态 -->
      <el-table-column prop="status" :label="this.$l('lbl_status')">
        <template slot-scope="scope">
          <fd-label :code="scope.row.status" type="cost_flow_status"></fd-label>
        </template>
      </el-table-column>

      <!-- 操作 -->
      <el-table-column :label="this.$l('lbl_operation')" width="250">
        <template slot-scope="scope">
          <el-row>
            <el-col :span="12" style="text-align:left;width:50%">
              <!-- 查看 -->
              <el-button
                size="mini"
                type="text"
                icon="el-icon-view"
                :title="$l('btn_detail')"
                @click="viewRow(scope.$index, scope.row)"
              ></el-button>

              <!-- 编辑(草稿才可编辑) -->
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                :disabled="scope.row.status!=='0' && scope.row.status!=='3'"
                v-if="$checkPersmissionByCode('cost:fundsYear:create')"
                :title="$l('btn_edit')"
                @click="editRow(scope.$index, scope.row)"
              ></el-button>

              <!-- 删除 -->
              <el-button
                size="mini"
                type="text"
                icon="el-icon-delete"
                :title="$l('btn_delete')"
                :disabled="scope.row.status!=='0' && scope.row.status!=='3'"
                v-if="$checkPersmissionByCode('cost:fundsYear:delete')"
                @click="deleteRow(scope.$index, scope.row)"
              ></el-button>

              <!-- 升版 -->
              <el-button
                size="mini"
                type="text"
                icon="el-icon-arrow-up"
                :disabled="scope.row.status!=='2' || scope.row.children!=null"
                v-if="$checkPersmissionByCode('cost:fundsYear:create')"
                :title="'升版'"
                @click="updateRow(scope.$index, scope.row)"
              ></el-button>
            </el-col>
            <el-col :span="12" style="text-align:left;width:50%">
              <el-button
                size="mini"
                :title="'审批通过'"
                v-if="$checkPersmissionByCode('cost:fundsYear:approve')"
                type="text"
                @click="changRowFlow(scope.$index, scope.row,'2')"
              >通过</el-button>
              <el-button
                size="mini"
                :title="'审批驳回'"
                v-if="$checkPersmissionByCode('cost:fundsYear:approve')"
                type="text"
                @click="changRowFlow(scope.$index, scope.row,'3')"
              >驳回</el-button>
            </el-col>
          </el-row>
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
import {
  getList,
  deleteItem,
  approve
} from '@/api/cost/fundsYearAPI'
import {
  NumFormat,
  Version,
  cutString
} from '@/filters/cost/'
import { deepCopy } from '@/utils/cost/objectHelper'
import { tableHeight } from '@/utils/common/index'
export default {
  props: {
    queryObj_passed_in: {
      type: Object
    }
  },
  filters: {
    NumFormat,
    Version,
    cutString // 字符截取
  },
  data () {
    return {
      defaultExpand: false,
      tableData: [],
      queryObj: this.queryObj_passed_in,
      tableHeight: '0',
      fullHeight: document.documentElement.clientHeight
    }
  },
  methods: {
    initTableData (response) {
      this.tableData = []
      if (response && response.data.content) {
        response.data.content.map(item => {
          item.fundsPlanId = item.id
          item._expanded = false
          item._show = true
          if (item.children && item.children.length > 0) item._showExpanded = true
          this.tableData = this.tableData.concat(item)
          if (item.children && item.children.length > 0) {
            item.children[0].fundsPlanId = item.parentId
            item.children[0]._show = false
            item.children[0].fundsPlanName = ''
            this.tableData = this.tableData.concat(item.children)
          }
        })
      }
    },
    showRow: function (row) {
      // 行隐藏
      const show = row.row._show
      return show ? 'animation:treeTableShow 1s;-webkit-animation:treeTableShow 1s;' : 'display:none;'
    },
    handleExpandClick (rowData) {
      let parentExpanded
      this.tableData.map(item => {
        if (item.fundsPlanId === rowData.fundsPlanId && item.fundsPlanName !== '') {
          item._expanded = !item._expanded
          parentExpanded = item._expanded
        }
        if (item.fundsPlanId === rowData.fundsPlanId && item.fundsPlanName === '') {
          item._show = parentExpanded
          item._expanded = parentExpanded
        }
      })
    },
    getList () {
      LoadingUtil.showLoading()
      // 转换参数
      let _queryObj = {
        companyId: this.queryObj_passed_in.companyId,
        projectId: this.queryObj_passed_in.projectId,
        accountingObjectId: this.queryObj_passed_in.accObjId,
        status: this.queryObj_passed_in.status,
        fundsYear: this.queryObj_passed_in.fundsYear,
        pageNum: this.queryObj_passed_in.pageNum,
        pageSize: this.queryObj_passed_in.pageSize
      }

      getList(_queryObj)
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
        name: 'NewOrUpdateFundsYear',
        query: {
          id: rowData.id,
          accountingObjectId: rowData.accountingObjectId,
          paramModel: rowData,
          isEdit: false
        }
      })
    },
    // 编辑
    editRow (index, rowData) {
      this.$router.push({
        name: 'NewOrUpdateFundsYear',
        query: {
          id: rowData.id,
          accountingObjectId: rowData.accountingObjectId,
          paramModel: rowData,
          isEdit: true
        }
      })
    },
    // 删除
    deleteRow (index, rowData) {
      this.$confirm('确认删除该记录', {
        confirmButtonText: this.$l('btn_confirm'),
        cancelButtonText: this.$l('btn_cancel'),
        type: 'warning'
      }).then(() => {
        deleteItem(rowData)
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
    // 升版
    updateRow (index, rowData, flowStatus) {
      this.$router.push({
        name: 'NewOrUpdateFundsYear',
        query: {
          id: rowData.id,
          accountingObjectId: rowData.accountingObjectId,
          paramModel: rowData,
          isEdit: true,
          isUpVersion: true
        }
      })
    },
    handleSizeChange (val) {
      this.queryObj.pageSize = val
      this.getList()
    },
    handleCurrentChange (val) {
      this.queryObj.pageNum = val
      this.getList()
    },
    // 流程
    changRowFlow (index, rowData, flowStatus) {
      approve({ id: rowData.id, status: flowStatus })
        .then(response => {
          this.$showSuccess(response.message)
          this.getList()
        })
        .catch(error => {
          console.log(error)
          this.$showError(error.message ? error.message : 'msg_system_error')
        })
    },
    settingTableHeight: function () {
      const topHeight = this.$refs['FundsYearTable'].getBoundingClientRect().top
      this.tableHeight = this.fullHeight - topHeight - 80
      this.$refs['FundsYearTable'].style.Height = this.tableHeight + 'px'
    },
    // 提示信息
    openAnnotation: function (h, { column, $index }) {
      return (
        <el-tooltip effect='dark' placement='bottom'>
          <template slot='content'><div style='width:200px'>{column.labelClassName}</div></template>
          <span>{column.label} <i class='el-icon-warning'></i></span>
        </el-tooltip>
      )
    }
  },
  mounted: function () {
    this.$nextTick(function () {
      this.settingTableHeight()
    })
    // window.onresize = () => {
    //     return (() => {
    //         this.fullHeight = document.documentElement.clientHeight
    //     })()
    // }
  },
  computed: {
    tHeight: function () {
      let options = {
        fullHeight: this.$store.getters.fullHeight,
        opened: this.$store.getters.sidebar.opened,
        showForm: this.$store.getters.showForm,
        obj: this
      }
      return `${tableHeight(options)}px`
    }
  },
  watch: {
    fullHeight (val) {
      this.settingTableHeight()
    }
  }
}

</script>
<style lang='scss' scoped>
</style>
