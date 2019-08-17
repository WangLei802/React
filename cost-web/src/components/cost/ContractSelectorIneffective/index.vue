<template>
  <div>
    <el-dialog
      title="提示"
      :visible.sync="isShowContract"
      width="80%"
      @close="closeDialog"
    >

      <mt-searchform style="margin-top: -30px;">

        <template slot="buttons">
          <el-button size="mini" type="cancel" @click='cancel'>{{this.$l('btn_back')}}</el-button>
          <el-button size="mini" type="primary" @click='confirmContract'>确认</el-button>
        </template>

        <template slot="form">
          <el-row>

            <el-col :span="6">
              <el-form-item label='合同类型:'>
                <fd-select v-model='queryModel.contractType'
                           type="cost_contract_type"
                           :clearable="true"></fd-select>
              </el-form-item>

            </el-col>

            <el-col :span="6">
              <el-form-item label='合同编号:'>
                <el-input v-model='queryModel.contractCode'></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="6">
              <el-form-item label='合同名称:'>
                <el-input v-model='queryModel.contractName'></el-input>
              </el-form-item>

            </el-col>

            <el-col :span="6"
                    class="search-btn">
              <el-form-item>
                <el-button size="mini" type="info"
                           @click='search'>{{$l("btn_search")}}
                </el-button>
                <el-button size="mini" @click='reset'>{{$l("btn_reset")}}</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </template>
      </mt-searchform>


      <el-table :data="selectTable" row-key="id" size="small" :height="tHeight">

        <!-- <el-table-column type="selection" align="center" width="55"></el-table-column> -->
        <el-table-column label="选择" width="60">
          <template slot-scope="scope">
            <!-- class="textRadio" -->
            <el-radio @change.native="getCurrentRow(scope.row)" :label="scope.$index" v-model="radio" class="textRadio">
              &nbsp;
            </el-radio>
          </template>
        </el-table-column>
        <el-table-column property="dateOfContract" label="合同签订日期" width="100" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.dateOfContract | dateFormat('yyyy-MM-dd')}}
          </template>
        </el-table-column>
        <el-table-column property="contractType" label="合同类型" width="100" show-overflow-tooltip>
          <template slot-scope="scope">
            <fd-label :code="scope.row.contractType"
                      type="cost_contract_type"></fd-label>
          </template>
        </el-table-column>
        <el-table-column property="contractCode" label="合同编号" width="300" show-overflow-tooltip></el-table-column>
        <el-table-column property="contractName" label="合同名称" width="300" show-overflow-tooltip></el-table-column>
        <!--<el-table-column property="contractStatus" label="合同状态" width="200">-->
        <!--<template slot-scope="scope">-->
        <!--<fd-label :code="scope.row.contractStatus"-->
        <!--type="cost_contract_status"></fd-label>-->
        <!--</template>-->
        <!--</el-table-column>-->
        <!-- contractAmountIncludeTax -->
        <el-table-column property="contractAmountIncludeTax" label="合同金额"></el-table-column>
        <el-table-column property="partyA" label="签约甲方" show-overflow-tooltip></el-table-column>
        <el-table-column property="partyBName" label="签约乙方" show-overflow-tooltip></el-table-column>
        <!--<el-table-column property="partyCName" label="签约丙方" show-overflow-tooltip></el-table-column>-->
      </el-table>

      <div class='pagination_bar'>
        <el-pagination
          @size-change='handleSizeChange'
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
  // import { getContractList } from '@/api/cost/designAlteration'
  import {
    saveOrUpdateIneffectiveCost, getQueryContractList, getContractDetail, getVisaList,
    getIneffectiveAlteration, getContractListByAlterationStatus
  } from '@/api/cost/ineffectiveCostModel'
  import {tableHeight} from '@/utils/common/index'
  import {LoadingUtil} from '@/utils/common/LoadingUtil'
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
      excludeContract: {
        required: false,
        type: Array
      }
    },
    data() {
      return {
        radio: '',
        isShowContract: false,
        selectTable: [],
        contractModel: {},
        tableHeight: '0',
        fullHeight: document.documentElement.clientHeight,
        queryModel: {
          visaId: '',
          contractType: '',
          projectId: '',
          contractCode: '',
          contractStatus: '5',
          contractName: '',
          pageNum: 1,
          pageSize: 20,
          isPrimary: 1,
          excludeContractCodes: [],
          count: 0
        }
      }
    },
    methods: {
      getList() {
        this.queryModel.visaId = localStorage.getItem("visaId");
        getContractListByAlterationStatus(this.queryModel)
          .then(response => {
            // alert(JSON.stringify(response.data))
            this.selectTable = response.data ? response.data : []
            this.queryModel.count = response.data.totalElements
          })
          .catch(error => {
            console.log(error)
          })
      },
      confirmContract() {
        debugger
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
        debugger
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
      },
      getCurrentRow(contractDetail) {
        this.contractModel = contractDetail
      },
      handleSizeChange(val) {
        debugger
        this.queryModel.pageSize = val
        this.getList()
      },
      handleCurrentChange(val) {
        debugger
        this.queryModel.pageNum = val
        this.getList()
      }
    },
    watch: {
      'showContract': function (newValue, oldValue) {
        debugger
        this.radio = ''
        this.isShowContract = newValue
        this.getList()
      },
      'projectId': function (newValue, oldValue) {
        this.queryModel.projectId = newValue
      },
      'excludeContract': function (newValue, oldValue) {
        this.queryModel.excludeContractCodes = newValue
      }
    },
    mounted: function () {
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
    filters: {
      dateFormat
    }
  }
</script>
