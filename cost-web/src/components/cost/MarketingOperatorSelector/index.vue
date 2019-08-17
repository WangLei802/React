<template>
    <div style="height:auto;overflow:hidden">
        <el-dialog title="选择营销经办人"
                   :visible.sync="isShowMarketing"
                   width="80%"
                   @close="closeDialog">

            <mt-searchform style="margin-top: -30px;">

                <template slot="buttons">
                    <el-button size="mini"
                               type="cancel"
                               @click='cancel'>{{this.$l('btn_back')}}</el-button>

                    <el-button size="mini"
                               type="primary"
                               @click='confirmMarketing' :disabled="confirmDisabled">确认选择</el-button>
                </template>

                <template slot="form">
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label='员工编码：'>
                                <el-input v-model='queryModel.personCode'></el-input>
                            </el-form-item>

                        </el-col>

                        <el-col :span="6">
                            <el-form-item label='姓名：'>
                                <el-input v-model='queryModel.personName'></el-input>
                            </el-form-item>
                        </el-col>

                        <el-col :span="6">

                          <el-form-item label='事业部：'>
                            <el-select v-model="queryModel.orgCode"
                                       filterable
                                       :clearable="true"
                                       placeholder="请选择"
                            >
                              <el-option v-for="(item,index)  in organizations"
                                         :key="index"
                                         :label="item.orgName"
                                         :value="item.orgCode">
                              </el-option>
                            </el-select>
                          </el-form-item>
                      </el-col>


                        <el-col :span="6"
                                class="search-btn">
                            <el-form-item>
                                <el-button size="mini"
                                           type="info"
                                           @click='search'>{{$l("btn_search")}}</el-button>
                                <el-button size="mini"
                                           @click='reset'>{{$l("btn_reset")}}</el-button>
                            </el-form-item>
                        </el-col>

                    </el-row>
                </template>
            </mt-searchform>

            <el-table :data="selectTable"
                      row-key="id"
                      size="small"
                      stripe
                      border
                      tooltip-effect="dark"
                      v-loading="loading"
                      :height="tHeight">


                <el-table-column label="选择"
                                 width="60">
                    <template slot-scope="scope">
                        <!-- class="textRadio" -->
                        <el-radio @change.native="getCurrentRow(scope.row)"
                                  :label="scope.$index"
                                  v-model="radio"
                                  class="textRadio">&nbsp;</el-radio>
                    </template>
                </el-table-column>


                <el-table-column property="personCode"
                                 label="员工编码"
                                 width="300"
                                 show-overflow-tooltip>

                </el-table-column>
                <el-table-column property="personName"
                                 label="姓名"
                                 width="300"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column property="orgName"
                                 label="事业部"
                                 show-overflow-tooltip></el-table-column>
            </el-table>

            <div class='pagination_bar'>
                <el-pagination @size-change='handleSizeChange'
                               @current-change='handleCurrentChange'
                               :current-page.sync='queryModel.pageNum'
                               :page-sizes='[10, 20, 30, 40]'
                               :page-size='queryModel.pageSize'
                               layout='sizes, prev, pager, next'
                               :total='queryModel.count'>
                </el-pagination>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import { findPageListByCurrentUserRegionalCompany, findAllDeptByCurrentUserRegionalCompany, findCurrentUserOrgList } from '@/api/cost/signContractAPI'
import { tableHeight } from '@/utils/common/index'
import { LoadingUtil } from '@/utils/common/LoadingUtil'
import {
  dateFormat
} from '@/filters/cost/'
export default {
  name: 'MarketingOperatorSelector',
  props: {
    showMarketing: {
      required: true,
      type: Boolean
    }

  },
  data() {
    return {
      radio: '',
      isShowMarketing: false,
      selectTable: [],
      MarketingModel: {},
      tableHeight: '0',
      fullHeight: document.documentElement.clientHeight,
      queryModel: {
        personCode: '',
        personName: '',
        orgCode: '',
        pageNum: 1,
        pageSize: 20,
        count: 0
      },
      loading: false,
      organizations: [],
      confirmDisabled: true
    }
  },
  methods: {
    getList() {
      this.loading = true
      findPageListByCurrentUserRegionalCompany(this.queryModel)
        .then(response => {
          this.loading = false
          this.selectTable = response.data.content ? response.data.content : []
          this.queryModel.count = response.data.totalElements
        })
        .catch(error => {
          console.log(error)
        })
    },

    getOrganizations() {
      findAllDeptByCurrentUserRegionalCompany()
        .then(response => {
          this.organizations = response.data ? response.data : []
        })
        .catch(error => {
          console.log(error)
        })
    },
    confirmMarketing() {
      debugger
      this.isShowMarketing = false
      if (this.radio === '') {
        this.MarketingModel = {}
      }
      this.$emit('confirmMarketing', this.MarketingModel)
    },
    closeDialog() {
      this.$emit('closeMarketingDialog', false)
    },
    cancel() {
      this.isShowMarketing = false
      // 向父组件传值
      this.$emit('cancelMarketingDialog', false)
    },
    search() {
      this.getList()
    },
    reset() {
      this.queryModel.personCode = ''
      this.queryModel.personName = ''
      this.queryModel.orgCode = ''
    },
    getCurrentRow(row) {
      this.MarketingModel = row
    },
    handleSizeChange(val) {
      this.queryModel.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.queryModel.pageNum = val
      this.getList()
    }

  },
  watch: {
    'showMarketing': function(newValue, oldValue) {
      this.radio = ''
      this.isShowMarketing = newValue
      if (newValue) {
        this.getList()
        this.getOrganizations()
      }
    },
    'radio': function(newValue, oldValue) {
      if (newValue !== '') {
        this.confirmDisabled = false
      } else {
        this.confirmDisabled = true
      }
    }
  },
  mounted: function() {

  },
  computed: {
    tHeight: function() {
      return '300px'
    }
  },
  filters: {
    dateFormat
  }
}
</script>
