<!-- TargetCostCompilationList -->
<template>
  <div class='app-container'>

    <mt-searchform>
      <template slot="buttons">
        <el-button icon='el-icon-plus' size="mini"
                   type='primary' v-if="$checkPersmissionByCode('cost:paymentMonthYearPlan:create')"
                   @click='add'>{{$l('btn_add')}}
        </el-button>
      </template>

      <template slot="form">
        <el-row>
          <el-col :span="6">
            <el-form-item :label="'单据编号：'">
              <el-input v-model='queryModel.receiptsNo'></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item :label="'单据名称：'">
              <el-input v-model='queryModel.receiptsName'></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item :label="'经办人：'">
              <el-input v-model='queryModel.operator'></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="6" class="search-btn">
            <el-form-item>
              <el-button size="mini" type='primary'
                         @click='search'>{{$l('btn_search')}}
              </el-button>
              <el-button size="mini" type='primary'
                         @click='reset'>{{$l('btn_reset')}}
              </el-button>
            </el-form-item>
          </el-col>

          <ProjectSelector v-model='queryModel.queryModelTest' :show="show" :span="{'project':6}"></ProjectSelector>

          <el-col :span="6">
            <el-form-item :label="'提交日期：'">
              <el-date-picker v-model="queryModel.operateDate"
                              type="date"
                              placeholder="选择日期" style="width:143px">
              </el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item :label="'类型：'">
              <el-select v-model="queryModel.planType" filterable
                         clearable placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="'审批状态：'">
              <fd-select v-model='queryModel.status'
                         type="cost_flow_status"
                         :clearable="true"></fd-select>
            </el-form-item>
          </el-col>
        </el-row>
      </template>
    </mt-searchform>

    <MonthlyPlayTable :queryObj_passed_in='queryModel'
                      ref="MonthlyPlayTable"></MonthlyPlayTable>
  </div>
</template>

<script>
  import ConstrctionTargetSelector from '@/components/cost/ConstrctionTargetSelector/'
  import ProjectSelector from '@/components/cost/AccountSelectorTwo/'
  import MonthlyPlayTable from '@/views/cost/monthlyPlay/MonthlyPlayTable'
  import COSTENUM from '@/utils/cost/enum'

  export default {
    data() {
      return {
        show: {
          group: false,
          company: false,
          dept: false,
          project: true,
          accObj: false
        },
        options: [{
          value: '0',
          label: '月度结算计划审批'
        }, {
          value: '1',
          label: '年度结算计划审批'
        }],
        queryModel: {
          planType: '',
          receiptsNo: '',
          receiptsName: '',
          operator: '',
          operateDate: '',
          projectId: '',
          status: '',
          pageNum: 1,
          pageSize: 20,
          count: 0,
          queryModelTest: {
            projectId: '',
            projectName: ''
          }
        }
      }
    },
    components: {
      ConstrctionTargetSelector,
      MonthlyPlayTable,
      ProjectSelector

    },
    mounted() {
      this.search()
    },

    methods: {
      updateMessage(item) {
        if (item.type === COSTENUM.projectTreeType.TREE_NODE_ACC_OBJ) {
          this.queryModel.accountingObjectId = item.accountingObjectId
          this.queryModel.companyId = item.companyId
        } else {
          this.queryModel.accountingObjectId = ''
          this.queryModel.companyId = item.id
        }
      },
      add() {
        this.$router.push({
          name: 'NewOrUpdateMonthlyPlay',
          query: { id: '', isEdit: true, isAdd: true }
        })
      },
      initVM() {
        this.queryModel.pageNum = 1
        this.queryModel.count = 0
        this.queryModel.pageSize = 20
      },
      reset() {
        this.queryModel.planType = ''
        this.queryModel.receiptsNo = ''
        this.queryModel.receiptsName = ''
        this.queryModel.operator = ''
        this.queryModel.operateDate = ''
        this.queryModel.projectId = ''
        this.queryModel.status = ''
        this.queryModel.planType = ''
        this.queryModel.queryModelTest.projectId = ''
        this.queryModel.queryModelTest.projectName = ''
        this.$refs.MonthlyPlayTable.getList()
      },

      search() {
        this.$refs.MonthlyPlayTable.getList()
      }
    }
  }

</script>
<style scoped>
</style>
