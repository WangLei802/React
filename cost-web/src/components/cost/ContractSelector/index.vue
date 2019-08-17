<template>
    <div style="height:auto;overflow:hidden">
        <el-dialog title="选择合同"
                   :visible.sync="isShowContract"
                   width="80%"
                   @close="closeDialog">

            <mt-searchform style="margin-top: -30px;">

                <template slot="buttons">
                    <el-button size="mini"
                               type="cancel"
                               @click='cancel'>{{this.$l('btn_back')}}</el-button>

                    <el-button size="mini"
                               type="primary"
                               @click='confirmContract'>确认选择</el-button>
                </template>

                <template slot="form">
                    <el-row>

                        <ProjectAccountSelect v-model="project"
                                              :span="{ accObj: 6}"
                                              :show="show"
                                              :disabled="{'accObj': accObjDisabled}"
                                              :clearable="{ project: false, accObj: false }">
                        </ProjectAccountSelect>

                        <el-col :span="6">
                            <el-form-item label='合同名称：'>
                                <el-input v-model='queryModel.contractName'></el-input>
                            </el-form-item>

                        </el-col>

                        <el-col :span="6">
                            <el-form-item label='合同编号：'>
                                <el-input v-model='queryModel.contractCode'></el-input>
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

                    <el-row>
                        <el-col :span="6">
                            <el-form-item label='合同类型：'>
                                <fd-select v-model='queryModel.contractType'
                                           type="cost_contract_type"
                                           :clearable="true"></fd-select>
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

                <!-- <el-table-column type="selection" align="center" width="55"></el-table-column> -->
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

                <el-table-column property="contractType"
                                 label="合同类型"
                                 width="100"
                                 show-overflow-tooltip>
                    <template slot-scope="scope">
                        <fd-label :code="scope.row.contractType"
                                  type="cost_contract_type"></fd-label>
                    </template>
                </el-table-column>
                <el-table-column property="contractCode"
                                 label="合同编号"
                                 width="200"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column property="contractName"
                                 label="合同名称"
                                 width="150"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column property="contractStatusName"
                                 label="合同状态"
                                 width="100"></el-table-column>
                <el-table-column property="businessContractAmount"
                                 label="合同金额"></el-table-column>
              <el-table-column property="dateOfContract"
                               label="合同签订日期"
                               width="100"
                               show-overflow-tooltip>
                <template slot-scope="scope">
                  {{ scope.row.dateOfContract | dateFormat('yyyy-MM-dd')}}
                </template>
              </el-table-column>
                <el-table-column property="accountingObjectName"
                                 label="成本分期"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column property="partyA"
                                 label="签约甲方"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column property="partyBName"
                                 label="签约乙方"
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
import { getContractList } from '@/api/cost/designAlteration'
import { tableHeight } from '@/utils/common/index'
import { LoadingUtil } from '@/utils/common/LoadingUtil'
import ProjectAccountSelect from '@/components/cost/ProjectAccountSelect/'
import {
  dateFormat
} from '@/filters/cost/'
export default {
  name: 'ContractSelector',
  props: {
    showContract: {
      required: true,
      type: Boolean
    },
    projectId: {
      required: false,
      type: String
    },
    isPaiedByOutputValue: {
      required: false,
      type: String
    },
    excludeContract: {
      required: false,
      type: Array
    },
    type: {
      required: false,
      type: String,
      default: 'signedNotPayment'
    },
    accountingObjectId: {
      required: false,
      type: String
    },
    moduleCode: {
      required: false,
      type: String
    }

  },
  components: {
    ProjectAccountSelect
  },
  data() {
    return {
      radio: '',
      show: {
        project: false,
        accObj: true
      },
      project: {
        accObj: '',
        projectId: ''
      },
      isShowContract: false,
      selectTable: [],
      contractModel: {},
      tableHeight: '0',
      fullHeight: document.documentElement.clientHeight,
      queryModel: {
        contractType: '',
        projectId: '',
        contractCode: '',
        contractName: '',
        pageNum: 1,
        pageSize: 20,
        isPrimary: 1,
        excludeContractCodes: [],
        moduleCode: '',
        isPaiedByOutputValue: this.isPaiedByOutputValue,
        count: 0,
        accountingObjectId: ''
      },
      loading: false,
      accObjDisabled: false
    }
  },
  methods: {
    getList() {
      this.loading = true
      this.queryModel.moduleCode = this.moduleCode
      getContractList(this.queryModel)
        .then(response => {
          this.loading = false
          this.selectTable = response.data.content ? response.data.content : []
          this.queryModel.count = response.data.totalElements
        })
        .catch(error => {
          console.log(error)
        })
    },
    confirmContract() {
      this.isShowContract = false
      if (this.radio === '') {
        this.contractModel = {}
      }
      this.$emit('confirmContract', this.contractModel)
    },
    closeDialog() {
      this.$emit('closeDialog', false)
    },
    cancel() {
      this.isShowContract = false
      // 向父组件传值
      this.$emit('cancelDialog', false)
    },
    search() {
      this.getList()
    },
    reset() {
      this.queryModel.contractCode = ''
      this.queryModel.contractName = ''
      this.queryModel.contractType = ''
      this.project.accObjId = ''
      this.queryModel.isPaiedByOutputValue = ''
    },
    getCurrentRow(contractDetail) {
      this.contractModel = contractDetail
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
    'showContract': function(newValue, oldValue) {
      this.radio = ''
      this.isShowContract = newValue
      if (newValue) {
        this.getList()
      }
    },
    'projectId': function(newValue, oldValue) {
      this.queryModel.projectId = newValue
      this.project.projectId = newValue
    },
    'project.accObjId': function(newValue, oldValue) {
      if (!this.accObjDisabled) {
        this.queryModel.accountingObjectId = newValue
      }
    },
    'excludeContract': function(newValue, oldValue) {
      this.queryModel.excludeContractCodes = newValue
    },
    'moduleCode': function(newValue, oldValue) {
      this.queryModel.moduleCode = newValue
    },
    'type': function(newValue, oldValue) {
      this.$set(this.queryModel, newValue, '1')
    },
    // 父组件带过来的 不能修改成本分期
    'accountingObjectId': function(newValue, oldValue) {
      if (newValue != null && newValue !== '') {
        this.project.accObjId = newValue
        this.accObjDisabled = true
      }
      this.queryModel.accountingObjectId = newValue
    }
  },
  mounted: function() {
    this.$set(this.queryModel, this.type, '1')
  },
  computed: {
    tHeight: function() {
      return '300px'
      // let options = {
      //     fullHeight: this.$store.getters.fullHeight,
      //     opened: this.$store.getters.sidebar.opened,
      //     showForm: this.$store.getters.showForm,
      //     obj: this
      // }
      // return `${tableHeight(options)}px`
    }
  },
  filters: {
    dateFormat
  }
}
</script>
