<!-- DynamicCostTable -->
<template>
  <div ref="DynamicCostTable">
    <el-table :data="tableData"
              stripe
              border
              tooltip-effect="dark"
              :height="tHeight"
              style="width: 100%"
              size="small">
      <!-- 序号 -->
      <el-table-column type="index"
                       :index="this.$getTableIndex(this.queryObj)"
                       :label="this.$l('lbl_no')"
                       width="50"></el-table-column>

        <el-table-column prop="modelTypeDesc"
                       width="150"
                       :label="'单据类型'"  >

      </el-table-column>


      <el-table-column prop="recordNumber"
                       width="150"
                       :label="'单据编号'" >

      </el-table-column>

      <el-table-column prop="recordName"
                       :label="'单据名称'"
                       width="150">

      </el-table-column>

        <el-table-column prop="projectName"
                       :label="'所属项目'"
                       width="150">

      </el-table-column>
       <el-table-column prop="recordAmount"  width="150"
                       :label="'成本金额（元）'">
        <template slot-scope="scope">
                    {{ scope.row.recordAmount|NumFormat}}
        </template>
      </el-table-column>

      <el-table-column prop="recordStatus" width="150"
                       :label="'单据状态'" >

      </el-table-column>
     <!-- 拆分状态 0 已拆分  1 未拆分
           如果是已拆分的话  还要在判断一下  splittingWay 0 拆分自动
            1 拆分手动 -->
      <el-table-column prop="splittingStatus" width="150"
                       :label="'拆分状态'">
        <template slot-scope="scope">
          <span v-if="scope.row.splittingStatus === '0' && !scope.row.splittingWay ">已拆分</span>
          <span v-else-if="scope.row.splittingStatus === '0' && scope.row.splittingWay === '0'">已拆分-自动</span>
           <span v-else-if="scope.row.splittingStatus === '0' && scope.row.splittingWay === '1'">已拆分-手动</span>
           <span v-else-if="scope.row.splittingStatus === '1'">未拆分</span>

        </template>
      </el-table-column>
      <!-- 操作 -->
      <el-table-column :label="this.$l('lbl_operation')"
                       >
        <template slot-scope="scope">
          <!-- 查看
          <el-button size="mini"
                     type="text"
                     icon="el-icon-view"
                     :title="$l('btn_detail')"
                     @click="viewRow(scope.$index, scope.row)"></el-button>-->

          <!-- 编辑 -->
          <el-button size="mini"
                     type="text"
                     @click="editRow(scope.$index, scope.row)">拆分调整</el-button>


        </template>
      </el-table-column>
    </el-table>
    <div class='pagination_bar'>
      <mt-pagination @size-change='handleSizeChange'
                     @current-change='handleCurrentChange'
                     :current-page.sync='queryObj.pageNum'
                     :page-sizes='[10, 20, 30, 40]'
                     :page-size='queryObj.pageSize'
                     layout='sizes, prev, pager, next'
                     :total='queryObj.count'>
      </mt-pagination>
    </div>
  </div>
</template>

<script>
  import { NumFormat, Version } from '@/filters/cost/'
  import { LoadingUtil } from '@/utils/common/LoadingUtil'
  import { getSplittingList } from '@/api/cost/DynamicCostAPI'

  import { deepCopy } from '@/utils/cost/objectHelper'
  import { tableHeight } from '@/utils/common/index'
  export default {
    filters: {
      NumFormat, Version
    },
    props: {
      queryObj_passed_in: {
        type: Object
      }
    },
    filters: {
      NumFormat,
      Version
    },
    data() {
      return {
        tableData: [],
        queryObj: this.queryObj_passed_in,
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
          obj: this
        }
        return `${tableHeight(options)}px`
      }
    },
    methods: {
      initTableData(response) {
        this.tableData = response.data ? response.data : []
      },
      getList() {
        if (!this.queryObj.ConstructionModelTest.projectId) {
          return this.$showError('请输入项目名称')
        }
        if (!this.queryObj.billType) {
          return this.$showError('请输入单据类型')
        }
        LoadingUtil.showLoading()
        // 转换参数

        console.log(this.queryObj)
        let _queryObj = {
          companyId: this.queryObj.ConstructionModelTest.companyId,
          projectId: this.queryObj.ConstructionModelTest.projectId,
          // /  contractName: this.queryObj.contractName, // 合同名称
          recordCategory: this.queryObj.billType, // 单据类型
          splittingStatus: this.queryObj.splitStatus // 拆分状态
          // pageNum: this.queryObj.pageNum,
          // pageSize: this.queryObj.pageSize
        }

        getSplittingList(_queryObj)
          .then(response => {
            //   debugger
            LoadingUtil.hideLoading()
            this.initTableData(response)
            this.queryObj.count = response.data.totalElements
          })
          .catch(error => {
            LoadingUtil.hideLoading()
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
      // 编辑
      editRow(index, rowData) {
        if (rowData.modelTypeDesc === '合同签订') {
          if (rowData) {
            this.$router.push({
              name: 'ContractsSignCostSplit',
              query: { moduleType: rowData.moduleType, moduleDataPk: rowData.moduleDataPk }
            })
          }
        } else if (rowData.modelTypeDesc === '设计变更申请') {
          if (rowData) {
            this.$router.push({
              name: 'DesignChangeRequest',
              query: { moduleType: rowData.moduleType, moduleDataPk: rowData.moduleDataPk }
            })
          }
        } else if (rowData.modelTypeDesc === '现场签证申请') {
          if (rowData) {
            this.$router.push({
              name: 'LocaleVisaApplication',
              query: { moduleType: rowData.moduleType, moduleDataPk: rowData.moduleDataPk }
            })
          }
        } else if (rowData.modelTypeDesc === '合同转固') {
          if (rowData) {
            this.$router.push({
              name: 'ContractTransfer',
              query: { moduleType: rowData.moduleType, moduleDataPk: rowData.moduleDataPk }
            })
          }
        } else if (rowData.modelTypeDesc === '合同变更') {
          if (rowData) {
            this.$router.push({
              name: 'ContractChange',
              query: { moduleType: rowData.moduleType, moduleDataPk: rowData.moduleDataPk }
            })
          }
        } else if (rowData.modelTypeDesc === '合同结算') {
          if (rowData) {
            this.$router.push({
              name: 'ContractSettlement',
              query: { moduleType: rowData.moduleType, moduleDataPk: rowData.moduleDataPk }
            })
          }
        } else if (rowData.modelTypeDesc === '设计变更一次造价确认' || rowData.modelTypeDesc === '设计变更二次造价确认') {
          if (rowData) {
            this.$router.push({
              name: 'DesignChangeConfirmation',
              query: { moduleType: rowData.moduleType, moduleDataPk: rowData.moduleDataPk }
            })
          }
        } else if (rowData.modelTypeDesc === '现场签证一次造价确认' || rowData.modelTypeDesc === '现场签证二次造价确认') {
          if (rowData) {
            this.$router.push({
              name: 'SiteVisaConfirmation',
              query: { moduleType: rowData.moduleType, moduleDataPk: rowData.moduleDataPk }
            })
          }
        } else if (rowData.modelTypeDesc === '无合同付款申请') {
          if (rowData) {
            this.$router.push({
              name: 'WithoutContractApply',
              query: { moduleType: rowData.moduleType, moduleDataPk: rowData.moduleDataPk }
            })
          }
        }
      },
      handleSizeChange(val) {
        this.queryObj.pageSize = val
        this.getList()
      },
      handleCurrentChange(val) {
        this.queryObj.pageNum = val
        this.getList()
      },
      settingTableHeight: function() {
        const topHeight = this.$refs['DynamicCostTable'].getBoundingClientRect().top
        this.tableHeight = this.fullHeight - topHeight - 80
        this.$refs['DynamicCostTable'].style.Height = this.tableHeight + 'px'
      }
    },
    mounted: function() {
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
