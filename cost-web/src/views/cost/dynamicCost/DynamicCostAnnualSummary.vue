<!-- DynamicCostTable -->
<template>
  <div ref="DynamicCostTable">
    <el-table :row-style="showRow"
              :data="tableData"
              :height="tHeight"
              size="small"
              style="width: 100%"
              stripe
              border
              tooltip-effect="dark">
      <el-table-column prop="text"
                       :label="'项目'"
                       multiple
                       width="300">
        <template slot-scope="scope">
          <div :style="{'width':'100%','text-align':'left','padding-left':scope.row.level*5+'px'}">
            <i :class="!scope.row._expanded&&!scope.row.isLeaf ? 'fa fa-plus-square-o' : 'fa fa-minus-square-o' "
               style="font-size:14px;color:#1f3d3d;cursor:pointer;vertical-align: sub;"
               v-show="!scope.row.isLeaf && scope.row.children && scope.row.children.length>0"
               @click="handleExpandClick(scope.row)"></i>
            <!-- {{ scope.row.text | cutString(16)}} -->
            <span :title="scope.row.text"> {{ scope.row.text | cutString(16)}}</span>

          </div>
        </template>
      </el-table-column>
      <el-table-column prop="stage1TargetCostVersionModel.targetCost"
                       :label="'投前目标成本(万元)'"
                       width="120">
      </el-table-column>
      <el-table-column prop="stage2TargetCostVersionModel.targetCost"
                       :label="'投后目标成本(万元)'"
                       width="120">

      </el-table-column>
      <el-table-column prop="stage3TargetCostVersionModel.targetCost"
                       :label="'预备会目标成本(万元)'"
                       width="120">

      </el-table-column>
      <!-- 动态列 -->
      <el-table-column v-for="(col ,index) in cols"
                       :prop="col.pops"
                       :label="col.label"
                       :key="index">

      </el-table-column>

    </el-table>

    <!-- <div class='pagination_bar'>
      <mt-pagination @size-change='handleSizeChange'
                     @current-change='handleCurrentChange'
                     :current-page.sync='queryObj.pageNum'
                     :page-sizes='[10, 20, 30, 40]'
                     :page-size='queryObj.pageSize'
                     layout='sizes, prev, pager, next'
                     :total='queryObj.count'>
      </mt-pagination>
    </div> -->
  </div>
</template>

<script>
import { NumFormat, Version, cutString } from '@/filters/cost/'
import { LoadingUtil } from '@/utils/common/LoadingUtil'
import { getAnnual } from '@/api/cost/DynamicCostAPI'
import { arrayToTree, treeToArrayHelper, treeToArray } from '@/utils/cost/treeHelper/'
import { deepCopy, ifNull } from '@/utils/cost/objectHelper'
import { tableHeight } from '@/utils/common/index'
import { calc } from '@/utils/common/calc'
export default {
  filters: {
    NumFormat, Version, cutString
  },
  props: {
    queryObj_passed_in: {
      type: Object
    }
  },

  data () {
    return {
      calcTableHeight: {
        otherHeight: 170,
        sideCloseHeight: 50
      },
      tableData: [],
      cols: [],
      queryObj: this.queryObj_passed_in,
      tableHeight: '0',
      fullHeight: document.documentElement.clientHeight
    }
  },
  computed: {
    tHeight: {
      get: function () {
        let _tableHeight = document.body.clientHeight - this.calcTableHeight.otherHeight
        if (!this.$store.getters.sidebar.opened) _tableHeight += this.calcTableHeight.sideCloseHeight
        return _tableHeight + 40 - (this.$store.getters.showForm ? 140 : 0) + 'px'
      },
      set: function () {
      }
    }
  },
  methods: {
    // 初始化查看编辑数据

    initTableData (response) {
      this.cols = []
      this.queryObj_passed_in.years.forEach((item, index) => {
        for (let i = this.queryObj_passed_in.month_start; i <= this.queryObj_passed_in.month_end; i++) {
          let obj = {
            'label': this.queryObj_passed_in.years[index] + '年' + i + '月动态成本（万元）', 'pops':
              'targetCostMap.' + this.queryObj_passed_in.years[index] + '_' + i
          }
          this.cols.push(obj)
        }
      })

      this.tableData = []
      let _tableData = treeToArray(response.data)
      _tableData.map(item => {
        //处理万元
        if (item.stage1TargetCostVersionModel && item.stage1TargetCostVersionModel['targetCost']) item.stage1TargetCostVersionModel['targetCost'] = calc.Div(ifNull(item.stage1TargetCostVersionModel['targetCost'], 0), 10000)
        if (item.stage2TargetCostVersionModel && item.stage2TargetCostVersionModel['targetCost']) item.stage2TargetCostVersionModel['targetCost'] = calc.Div(ifNull(item.stage2TargetCostVersionModel['targetCost'], 0), 10000)
        if (item.stage3TargetCostVersionModel && item.stage3TargetCostVersionModel['targetCost']) item.stage3TargetCostVersionModel['targetCost'] = calc.Div(ifNull(item.stage3TargetCostVersionModel['targetCost'], 0), 10000)

        if (item.targetCostMap) {
          this.queryObj_passed_in.years.forEach((yearItem, index) => {
            for (let i = this.queryObj_passed_in.month_start; i <= this.queryObj_passed_in.month_end; i++) {
              if (item.targetCostMap[yearItem + '_' + i]) {
                item.targetCostMap[yearItem + '_' + i] = calc.Div(ifNull(item.targetCostMap[yearItem + '_' + i], 0), 10000)
              }
            }
          })
        }

        item._expanded = true
        item._show = true
        item.isLeaf = item.leaf
        item.parentId = item.parentId || ''
        item.parentIds = (item.parentIds ? (item.parentIds + ',') : '') + item.id + ','
      })
      this.tableData = _tableData
    },
    handleExpandClick (rowData) {
      let parentIds = rowData.parentIds
      let parentExpanded

      this.tableData.map(item => {
        if (item.parentIds === parentIds) {
          item._expanded = !item._expanded
          parentExpanded = item._expanded
        }
        if (item.parentIds.indexOf(parentIds) > -1 && item.parentIds !== parentIds) {
          item._show = parentExpanded
          item._expanded = parentExpanded
        }
      })
    },
    showRow: function (row) {
      // 行隐藏
      const show = row.row._show
      return show ? 'animation:treeTableShow 1s;-webkit-animation:treeTableShow 1s;' : 'display:none;'
    },
    getList () {
      if (!this.queryObj.month_end) {
        this.queryObj.month_end = '12'
      }
      if (!this.queryObj.month_start) {
        this.queryObj.month_start = '1'
      }
      LoadingUtil.showLoading()
      // 转换参数

      console.log(this.queryObj_passed_in)

      let temp_string

      if (this.queryObj_passed_in.years && this.queryObj_passed_in.years.length > 0) {
        let temp = this.queryObj_passed_in.years
        temp_string = temp.join(',')
      }
      let _queryObj = {
        companyId: this.queryObj_passed_in.companyId,
        aoId: this.queryObj_passed_in.accObjId,
        //   years: this.queryObj_passed_in.years,
        years: temp_string,
        month_end: this.queryObj.month_end,
        month_start: this.queryObj.month_start, // 合同名称

        type: this.queryObj.type
      }

      getAnnual(_queryObj)
        .then(response => {
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

    handleSizeChange (val) {
      this.queryObj.pageSize = val
      this.getList()
    },
    handleCurrentChange (val) {
      this.queryObj.pageNum = val
      this.getList()
    },
    settingTableHeight: function () {
      const topHeight = this.$refs['DynamicCostTable'].getBoundingClientRect().top
      this.tableHeight = this.fullHeight - topHeight - 80
      this.$refs['DynamicCostTable'].style.Height = this.tableHeight + 'px'
    }
  },
  mounted: function () {
    this.$nextTick(function () {
      this.settingTableHeight()
    })
    // window.onresize = () => {
    //   return (() => {
    //     this.fullHeight = document.documentElement.clientHeight
    //   })()
    // }
    this.queryObj_passed_in.years.forEach((item, index) => {
      for (let i = this.queryObj_passed_in.month_start; i <= this.queryObj_passed_in.month_end; i++) {
        let obj = {
          'label': this.queryObj_passed_in.years[index] + '年' + i + '月动态成本（万元）', 'pops':
            'targetCostMap.' + this.queryObj_passed_in.years[index] + '_' + i
        }
        this.cols.push(obj)
      }
    })
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
