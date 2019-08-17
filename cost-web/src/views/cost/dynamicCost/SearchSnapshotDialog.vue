<template>
  <div>
    <el-dialog :close-on-click-modal="false"
               :close-on-press-escape="false"
               title="历史版本"
               :visible.sync="snapshotList"
               width="60%"
               :show-close="false"
               :before-close="handleClose">
      <div>
         <el-form size="mini" label-width="80px">
            <el-row>
                <el-col :span="10">
                   <el-form-item label="调整年份：">
                         <el-date-picker
                            v-model="searchYear"
                            type="year"
                            format="yyyy 年"
                            value-format="yyyy"
                            placeholder="选择年">
                            </el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="10">
                    <el-form-item label="调整月份：">
                        <el-date-picker
                            v-model="searchMonth"
                            type="month"
                            format="MM 月"
                             value-format="MM"
                            placeholder="选择月">
                            </el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item class="search"
                            <el-button size="mini"
                                type="primary"
                                @click="onSearch">查询</el-button>
                    </el-form-item>

                </el-col>
            </el-row>
          </el-form>
          <div ref="snapshotListTable">
             <el-table :data="tableDataList"
                             stripe
                              border                              
                              height="200"  
                              tooltip-effect="dark"
                              style="width: 100%"
                              size="small">
                <el-table-column label="选择"
                                         width="50">
                            <template slot-scope="scope">

                               <el-radio  v-model="checkedForm"                                         
                                          :label="scope.row"
                                          >&nbsp;</el-radio>

                               
                            </template>
                        </el-table-column>       
                 <el-table-column
                    type="index"
                    label="名称"
                     width="50">
                </el-table-column>
               
                <el-table-column
                    prop="historyTime"
                    label="快照时间"
                    :formatter='this.$dateFormat("historyTime","yyyy-MM-dd")'
                    width="180">
                </el-table-column>
                <el-table-column
                    prop="tagetCost"
                    label="目标成本金额(元)">
                </el-table-column>
                 <el-table-column
                    prop="dynaTargetCost"
                    label="动态成本金额(元)">
                </el-table-column>
             </el-table>
            </div>
      </div>
      <span slot="footer"
            class="dialog-footer">
                <el-button size="mini" @click="cancel">取 消</el-button>
                <el-button size="mini" type="primary"
                            @click="submit('contractSigningCpNew')">确 定</el-button>
            </span>
    </el-dialog>
  </div>
</template>
<script>
import { getlistHistory, getSbHistory } from '@/api/cost/DynamicCostAPI'
import { tableHeight } from '@/utils/common/index'
import { LoadingUtil } from '@/utils/common/LoadingUtil'
import AmountInput from '@/components/cost/AmountInput/'
export default {
  components: {

    AmountInput

  },
  props: {
    snapshotList: {
      type: Boolean

    },
    activeName: {
      type: String
    },
    accObjId: {
      type: String
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
      searchYear: '',
      searchMonth: '',
      checkedForm: {},
      tableDataList: []

    }
  },
  mounted() {

  },
  watch: {
    fullHeight(val) {
      this.settingTableHeight()
    }
  },
  methods: {
    settingTableHeight: function() {
      const topHeight = this.$refs['snapshotListTable'].getBoundingClientRect().top
      this.tableHeight = this.fullHeight - topHeight - 80
      this.$refs['snapshotListTable'].style.Height = this.tableHeight + 'px'
    },
    onSearch() {
      // LoadingUtil.showLoading()
      if (this.searchYear || this.searchMonth) {
        let year = this.searchYear
        let month = this.searchMonth
        LoadingUtil.showLoading()
        if (this.activeName === '合约规划维度') {
          getlistHistory({ 'yearString': year, 'monthString': month, 'accounting_obj_id': this.accObjId }).then(response => {
            LoadingUtil.hideLoading()
            this.tableDataList = response.data ? response.data : []
          })
        } else if (this.activeName === '科目维度') {
          getSbHistory({ 'yearString': year, 'monthString': month, 'accounting_obj_id': this.accObjId }).then(response => {
            LoadingUtil.hideLoading()
            this.tableDataList = response.data ? response.data : []
          })
        }
      } else {
        return this.$showError('请输入年份或者月份')
      }
    },
    submit() {
      this.$emit('closeSnapshotList', this.checkedForm)
    },

    cancel() {
      this.$emit('closeSnapshotList')
    },
    handleClose(done) {

    }
  }
}
</script>
<style scoped>
  .el-dialog__headerbtn {
    display: none;
  }
</style>
