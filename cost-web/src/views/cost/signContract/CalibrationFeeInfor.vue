<template>
  <div ref="CalibrationFeeInfor">
    <el-table :data="tableDataFee"
              stripe
              border
              tooltip-effect="dark"
              style="width: 100%"
              size="small"
              :height="tHeight">
      <el-table-column fixed
                       :label="$l('lbl_no')"
                       width="100"
                       type="index">
      </el-table-column>

      <el-table-column fixed
                       prop="contractCode"
                       label="合同编号"
                       width="150">

      </el-table-column>
      <el-table-column fixed
                       prop="contractName"
                       label="合同名称"
                       width="150">

      </el-table-column>

      <el-table-column fixed
                       prop="contractAmountIncludeTax"
                       label="签约金额">

      </el-table-column>

      <!--<el-table-column fixed-->
      <!--prop="dateOfContract"-->
      <!--label="签约日期">-->
      <!---->
      <!--</el-table-column>-->
      <el-table-column fixed
                       prop="projectName"
                       label="所属项目">

      </el-table-column>
      <el-table-column fixed
                       prop="status"
                       label="状态">
        <template slot-scope="scope">
                                <span v-if="scope.row.status  ==='0' ">
                                    未生成合同
                                </span>
          <span v-else-if="scope.row.status  ==='1' ">
                                    已生成合同
                                </span>

        </template>
      </el-table-column>
      <el-table-column :label="$l('lbl_operation')"
                       fixed="right"
                       width="180">
        <template slot-scope="scope">
          <el-button size="mini"
                     type="text"
                     icon="el-icon-view"
                     :title="$l('btn_detail')"
                     @click="checkRow(scope.$index, scope.row)"></el-button>


          <!-- 生成合同 -->
          <el-button size="mini"  v-if="scope.row.status  ==='0' && $checkPersmissionByCode('cost:contract:saveOrUpdate') "
                     type="text"
                     @click="buildContract(scope.$index, scope.row)"
          >生成合同</el-button>

        </template>
      </el-table-column>
    </el-table>
    <div class='pagination_bar'>
      <mt-pagination @size-change='handleSizeChange'
                     @current-change='handleCurrentChange'
                     :current-page.sync='query.pageNum'
                     :page-sizes='[10, 20, 30, 40]'
                     :page-size='query.pageSize'
                     layout='sizes, prev, pager, next'
                     :total='query.count'>
      </mt-pagination>
    </div>
  </div>
</template>
<script>
  import COSTENUM from '@/utils/cost/enum'
  import { tableHeight } from '@/utils/common/index'
  export default {
    props: {
      'initData': {
        type: Object
      },
      'value': {
        type: Object
      }
    },
    data() {
      return {
        tableDataFee: [],
        query: {
          pageNum: 1,
          pageSize: 20,
          count: 0
        }
      }
    },

    mounted() {
      this.getListData()
    },
    watch: {
      'initData': {
        handler(newValue, oldValue) {
          this.getListData()
        },
        deep: true
      }

    },
    computed: {
      tHeight: function() {
        let options = {
          fullHeight: this.$store.getters.fullHeight,
          opened: this.$store.getters.sidebar.opened,
          showForm: this.$store.getters.showForm,
          obj: this,
          otherHeight: 290
        }
        return `${tableHeight(options)}px`
      }
    },
    methods: {
      handleSizeChange(val) {
        this.query.pageSize = val
        this.$emit('input', this.query)
        this.getListData()
      },
      handleCurrentChange(val) {
        this.query.pageNum = val
        this.$emit('input', this.query)
        this.getListData()
      },
      checkRow(index, rowData) {
        this.$router.push({
          name: 'CostControlDetail',
          query: { contractId: rowData.id }
        })
      },
      buildContract(index, rowData) {
        this.$router.push({
          name: 'NewContractInformation',
          query: {
            costControlId: rowData.id,
            isOrEdit: true,
            contractStatus: '0',
            contractSource: '2',
            signOrEdit: false
          }
        })
      },
      getListData() {
        if (this.initData) {
          this.tableDataFee = this.initData.content ? this.initData.content : []
          this.query.count = 3
          // this.query.count = this.initData.totalElements
          console.log(11)
          console.log(this.query.count)
          //
        }
      }

    }
  }
</script>
<style scoped>
  @import '../../../styles/list.scss';
  .el-select {
    width: 200px;
  }
</style>
