<template>
  <!-- operate button -->
  <div ref="StandaredSubjectTable">
    <div ref="multipleTable">
      <el-table
        :data="tableData"
        size="small"
        :row-style="showRow"
        align="left"
        stripe
        border
        tooltip-effect="dark"
        style="width: 100%"
        :height="tHeight"
      >
        <!-- 项目名称 -->
        <el-table-column prop="text" label="项目名称" width="400" fixed>
          <template slot-scope="scope">
            <div
              :style="{'width':'100%','text-align':'left','padding-left':scope.row.level*5+'px'}"
            >
              <i
                :class="!scope.row._expanded&&!scope.row.isLeaf ? 'fa fa-plus-square-o' : 'fa fa-minus-square-o' "
                style="font-size:14px;color:#1f3d3d;cursor:pointer;vertical-align: sub;"
                v-show="!scope.row.isLeaf && scope.row.children && scope.row.children.length>0"
                @click="handleExpandClick(scope.row)"
              ></i>
              <a
                style="color:blue"
                v-if="scope.row.isLeaf"
                @click="handleViewDetail(scope.$index,scope.row)"
                :title="scope.row.text"
              >{{ scope.row.text |cutString(16)}}</a>
              <span
                v-if="!scope.row.isLeaf"
                :title="scope.row.text"
              >{{ scope.row.text |cutString(16) }}</span>
            </div>
          </template>
        </el-table-column>
        <!-- 当前最新版本 -->
        <el-table-column prop="stageId" label="当前最新阶段" align="left">
          <template slot-scope="scope">
            {{stageIdObject[scope.row.stageId]}}
            <!-- <fd-label :code="scope.row.stageId"
            type="cost_stage_id"></fd-label>-->
          </template>
        </el-table-column>

        <!-- 总用地面积 -->
        <el-table-column prop="totalUseArea" label="总用地面积(㎡)">
          <template slot-scope="scope">{{scope.row.totalUseArea | NumFormat}}</template>
        </el-table-column>

        <!-- 总建筑面积 -->
        <el-table-column prop="totalBuildingArea" label="总建筑面积(㎡)">
          <template slot-scope="scope">{{scope.row.totalBuildingArea | NumFormat}}</template>
        </el-table-column>

        <!-- 总可售面积 -->
        <el-table-column prop="totalSellArea" label="总可售面积(㎡)">
          <template slot-scope="scope">{{scope.row.totalSellArea | NumFormat}}</template>
        </el-table-column>

        <!-- 总计容面积 -->
        <el-table-column prop="totalCapacityArea" label="总计容面积(㎡)" show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.totalCapacityArea | NumFormat}}</template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import COSTENUM from '@/utils/cost/enum'
import {
  searchList
} from '@/api/cost/projectListAPI'
import { LoadingUtil } from '@/utils/common/LoadingUtil'
import {
  NumFormat, // 千位符
  FLevel,
  dateFormat,
  Version,
  cutString // 字符截取
} from '@/filters/cost/'
import { arrayToTree, treeToArrayHelper, treeToArray } from '@/utils/cost/treeHelper/'
import { setLocalItem, getLocalItem, Constants } from '@/utils/common/cache'
import { tableHeight } from '@/utils/common/index'
import sys_config from '@/config/config.js'
import { deepCopy, ifNull } from '@/utils/cost/objectHelper'
import { calc } from '@/utils/common/calc'
export default {
  props: {
    queryObj_passed_in: {
      type: Object
    }
  },
  filters: {
    NumFormat,
    FLevel,
    dateFormat,
    Version,
    cutString
  },
  components: {

  },
  data () {
    return {
      columns: [
        {
          text: '项目名称',
          dataIndex: 'text',
          width: 280
        }
      ],
      tableData: [],
      stageIdObject: {
        '1': '投前',
        '2': '投后',
        '3': '预备会',
        '4': '预结算',
        '5': '结算',
      },
      pageStatus: {
        expandedLevel: 0//sys_config.expandedLevel,//默认展开二级
      }
    }
  },
  computed: {
    tHeight: function () {
      let options = {
        fullHeight: this.$store.getters.fullHeight,
        opened: this.$store.getters.sidebar.opened,
        showForm: this.$store.getters.showForm,
        obj: this,
        otherHeight: 140
      }
      return `${tableHeight(options)}px`
    }
  },
  methods: {
    handleViewDetail (index, rowData) {
      this.$router.push({
        name: 'AccountingObjectList',
        query: { accountingObjectId: rowData.id, accountingObjectName: rowData.text, stageId: rowData.stageId ? rowData.stageId : '1' }
      })
    },
    getLevel (parentIds) {
      if (parentIds) {
        return parentIds.split(',').length + 1
      } else {
        return 0
      }
    },
    initTableData: function (response) {
      this.tableData = []
      let _tableData = treeToArray(response.data)
      // 初始化表格
      _tableData.map(item => {
        item._expanded = true
        item._show = true

        //处理默认展开级别
        if (!this.queryObj_passed_in.companyId && !this.queryObj_passed_in.projectId) {
          let _trueLevel = item.parentIds ? item.parentIds.split(',').length : 0
          item._expanded = calc.Mul(ifNull(_trueLevel, 0), 1) < this.pageStatus.expandedLevel + 1
          item._show = calc.Mul(ifNull(_trueLevel, 0), 1) < this.pageStatus.expandedLevel + 2
        }

        item.isLeaf = item.leaf //! ((item.children && item.children.length > 0))
        // item.level = (item.parentIds + ',').split(',').length - 1
        item.parentId = item.parentId || ''
        item.parentIds = (item.parentIds ? (item.parentIds + ',') : '') + item.id + ','
      })
      this.tableData = _tableData
    },

    showRow: function (row) {
      // 行隐藏
      const show = row.row._show
      return show ? 'animation:treeTableShow 1s;-webkit-animation:treeTableShow 1s;' : 'display:none;'
    },
    getList () {
      // 转换参数
      let _queryObj = {
        companyId: this.queryObj_passed_in.companyId,
        projectId: this.queryObj_passed_in.projectId
      }
      LoadingUtil.showLoading()
      searchList(_queryObj)
        .then(response => {
          LoadingUtil.hideLoading()
          this.initTableData(response)
        })
        .catch(error => {
          console.log(error)
          this.$showError(error.message ? error.message : 'msg_system_error')
        })
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
    }

  },
  mounted () {
    // try {
    //     let allDictData = getLocalItem(Constants.DICTIONARY)
    //     allDictData = allDictData ? JSON.parse(allDictData) : []
    //     let dictData = allDictData.filter(item => {
    //         return item.dictType === 'cost_stage_id'
    //     })
    //     dictData.map(item => {
    //         this.stageIdObject[item.dictValue] = this.$checkLocaleIsCn() ? item.dictLabelCn : item.dictLabelEn
    //     })
    // } catch (error) {

    // }
  },
  watch: {
    'queryObj_passed_in.projectId': function (newValue, oldValue) {
      this.getList()
    }
  }
}
</script>
<style lang='scss' scoped>
</style>