<!-- IneffectiveCostTable -->
<template>
  <div ref="ineffectiveCostTable">
    <el-table
      :data="tableData"
      stripe
      border
      tooltip-effect="dark"
      :height="tHeight"
      style="width: 100%"
      size="small"
    >
      <!-- 序号 -->
      <el-table-column prop="pageIndex" :label="this.$l('lbl_no')" width="70"></el-table-column>

      <!-- 对应签证编号或其他编号 -->
      <el-table-column prop="code" width="100" :label="'对应签证编号或其他编号'" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.code}}</template>
      </el-table-column>

      <!-- 单据名称 -->
      <el-table-column prop="name" width="100" :label="'单据名称'" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.name}}</template>
      </el-table-column>

      <!-- 所属项目 -->
      <el-table-column prop="projectName" width="100" :label="'所属项目'" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.projectName}}</template>
      </el-table-column>

      <!-- 责任部门 -->
      <el-table-column prop="ownerDept" width="75" :label="'责任部门'" show-overflow-tooltip>
        <template slot-scope="scope">
          <fd-label :code="scope.row.ownerDept" type="cost_subject_responsible_dept_code"></fd-label>
        </template>
      </el-table-column>
      <!-- 无效成本类别 -->
      <el-table-column prop="type" :label="'无效成本类别'" show-overflow-tooltip>
        <template slot-scope="scope">
          <!--<fd-label :code='scope.row.type'-->
          <!--type="cost_subject_responsible_dept_code"></fd-label>-->
          <fd-label :code="scope.row.type" type="cost_ineffective_type"></fd-label>
          <!--{{scope.row.type}}-->
        </template>
      </el-table-column>
      <!-- 无效成本内容-->
      <el-table-column prop="content" width="80" :label="'无效成本内容'" show-overflow-tooltip>
        <template slot-scope="scope">
          <!--{{scope.row.content}}-->
          <fd-label :code="scope.row.content" type="cost_ineffective_type"></fd-label>
        </template>
      </el-table-column>
      <!-- 无效成本描述-->
      <el-table-column prop="description" width="100" :label="'无效成本描述'" show-overflow-tooltip>
        <template slot-scope="scope">{{scope.row.description}}</template>
      </el-table-column>
      <!-- 预估金额(元)-->
      <el-table-column prop="estimatedAmt" :label="'预估金额(元)'" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.estimatedAmt| NumFormat }}</template>
      </el-table-column>
      <!-- 结算金额(元)-->
      <el-table-column prop="settlementAmt" :label="'结算金额(元)'" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.settlementAmt| NumFormat }}</template>
      </el-table-column>
      <!-- 无效成本额(元)-->
      <el-table-column prop="money" :label="'无效成本额(元)'" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.money| NumFormat }}</template>
      </el-table-column>
      <!-- 成就共享扣款倍数-->
      <el-table-column prop="multiple" width="80" :label="'成就共享扣款倍数'" show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-if="scope.row.multiple != '' && scope.row.multipleType == '0' ">
            <fd-label :code="scope.row.multiple" type="cost_achieveshareratio_code"></fd-label>
          </span>
          <span v-else-if="scope.row.multiple != '' && scope.row.multipleType == '1' ">
            <fd-label :code="scope.row.multiple" type="cost_achieveshareratio_code_new"></fd-label>
          </span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <!-- 成就共享扣款额(元)-->
      <el-table-column
        prop="achievementSharingDeduction"
        :label="'成就共享扣款额(元)'"
        show-overflow-tooltip
      >
        <template slot-scope="scope">{{ scope.row.achievementSharingDeduction| NumFormat }}</template>
      </el-table-column>
      <!-- 无效成本发生日期 -->
      <el-table-column prop="createdDate" width="100" :label="'无效成本发生日期'">
        <template slot-scope="scope">{{ scope.row.createdDate }}</template>
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
import { getIneffectiveList, exportInvalidCostAccountDat } from '@/api/cost/ineffectiveCostCheck'
import { NumFormat, Version } from '@/filters/cost/'
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
    Version
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
  data () {
    return {
      tableData: [],
      queryObj: this.queryObj_passed_in,
      tableHeight: '0',
      fullHeight: document.documentElement.clientHeight,
      totalEstimatedAmt: '',
      totalSettlementAmt: '',
      totalMoney: '',
      totalMultiplemoney: ''
    }
  },
  methods: {
    initTableData (response) {
      debugger
      this.tableData = []
      let rowData = {}
      rowData.estimatedAmt = this.totalEstimatedAmt
      rowData.settlementAmt = this.totalSettlementAmt
      rowData.money = this.totalMoney
      rowData.achievementSharingDeduction = this.totalMultiplemoney
      rowData.code = '合计'
      this.tableData.push(rowData)
      // this.tableData = this.tableData.concat(response.data.content)
      response.data.legerList.content.map((item, index) => {
        item.pageIndex = this.queryObj.pageSize * (this.queryObj.pageNum - 1) + index + 1
        this.tableData.push(item)
      })

    },

    getList () {
      LoadingUtil.showLoading()
      // 转换参数
      // alert(JSON.stringify(this.queryObj));
      let _queryObj = {
        projectId: this.queryObj_passed_in.queryModelTest.projectId,
        projectName: this.queryObj_passed_in.queryModelTest.projectName,
        companyId: this.queryObj_passed_in.queryModelTest.companyId,
        ownerDept: this.queryObj_passed_in.ownerDept,
        code: this.queryObj_passed_in.code,
        startTime: this.queryObj_passed_in.startTime,
        endTime: this.queryObj_passed_in.endTime,
        status: this.queryObj.status,
        pageNum: this.queryObj.pageNum,
        pageSize: this.queryObj.pageSize
      }
      getIneffectiveList(_queryObj)
        .then(response => {
          this.totalEstimatedAmt = response.data.totalEstimatedAmt
          this.totalSettlementAmt = response.data.totalSettlementAmt
          this.totalMoney = response.data.totalMoney
          this.totalMultiplemoney = response.data.totalMultiplemoney
          this.initTableData(response)
          this.queryObj.count = response.data.legerList.totalElements
          //   debugger
          LoadingUtil.hideLoading()
        })
        .catch(error => {
          console.log(error)
          this.$showError(error.message ? error.message : 'msg_system_error')
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
    settingTableHeight: function () {
      const topHeight = this.$refs['ineffectiveCostTable'].getBoundingClientRect().top
      this.tableHeight = this.fullHeight - topHeight - 80
      this.$refs['ineffectiveCostTable'].style.Height = this.tableHeight + 'px'
    }
  },
  mounted: function () {
    this.$nextTick(function () {
      this.settingTableHeight()
    })
    //   window.onresize = () => {
    //     return (() => {
    //       this.fullHeight = document.documentElement.clientHeight
    //     })()
    //   }
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
