<!-- TargetCostCompilationList -->
<template>
  <div class="app-container">
    <mt-searchform>
      <template slot="buttons">
        <!-- 导出 -->
        <!-- <el-button type='primary'
                   size="mini"
                   @click='handleExport'
        style="padding: 8px 15px;">{{$l('lbl_standared_subject_export')}}</el-button>-->
      </template>
      <template slot="form">
        <el-row>
          <ProjectSelector
            v-model="p_queryModel"
            :showTobe="false"
            :show="{group: true,company: true,dept: true, project: false,accObj:true}"
          >
            <template slot="projectSelectorButtons">
              <el-col :span="6" class="search-btn">
                <el-form-item>
                  <el-button size="mini" type="primary" @click="search">{{$l("btn_search")}}</el-button>
                  <el-button size="mini" @click="reset">{{$l("btn_reset")}}</el-button>
                </el-form-item>
              </el-col>
            </template>
            <template slot="after">
              <!-- <el-col :span="6">
                                    <el-form-item :label="'年份：'">
                                       <el-select
                                          v-model="queryModel.years"
                                          multiple
                                          filterable
                                          allow-create
                                          default-first-option
                                          placeholder="请选择年份">
                                          <el-option
                                            v-for="item in yearsList"
                                            :key="item"
                                            :label="item"
                                            :value="item">
                                          </el-option>
                                        </el-select>
                                     
                                    </el-form-item>
              </el-col>-->
              <el-col :span="6">
                <el-form-item :label="'开始月份：'">
                  <fd-select
                    v-model="queryModel.month_start"
                    placeholder="请选择"
                    type="cost_report_month"
                    :clearable="true"
                  >></fd-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item :label="'结束月份：'">
                  <fd-select
                    v-model="queryModel.month_end"
                    placeholder="请选择"
                    type="cost_report_month"
                    :clearable="true"
                  >></fd-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item :label="'成本范围：'">
                  <fd-select
                    v-model="queryModel.type"
                    placeholder="请选择"
                    type="cost_report_range"
                    :clearable="true"
                  >></fd-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item :label="'年份：'">
                  <fd-select
                    v-model="queryModel.years"
                    placeholder="请选择"
                    type="cost_report_year"
                    multiple
                    :clearable="true"
                  >></fd-select>
                </el-form-item>
              </el-col>
            </template>
          </ProjectSelector>
        </el-row>
      </template>
    </mt-searchform>
    <DynamicCostAnnualSummary :queryObj_passed_in="queryModel" ref="DynamicCostAnnualSummary"></DynamicCostAnnualSummary>
  </div>
</template>

<script>
import ConstrctionTargetSelector from '@/components/cost/ConstrctionTargetSelector/'
import ProjectSelector from '@/components/cost/ProjectSelector/'
import DynamicCostAnnualSummary from '@/views/cost/dynamicCost/DynamicCostAnnualSummary'
import COSTENUM from '@/utils/cost/enum'
export default {
  data () {
    return {
      id: '',
      p_queryModel: {
        companyId: '',
        accObjId: '',
        projectId: ''
      },
      queryModel: {
        companyId: '',
        projectId: '',
        type: '1', // 成本范围
        group: '', // 集团
        company: '', // 公司
        month_end: '12', // 结束月份
        month_start: '1', // 开始月份
        years: ['2019'], // 年份
        accountingObjectId: '',
        pageNum: 1,
        pageSize: 20,
        count: 0

      },
      yearsList: ['2017'],
      costRangeList: [{
        value: '1',
        label: '总成本'
      }, {
        value: '2',
        label: '开发成本'
      }, {
        value: '3',
        label: '工程成本'
      }, {
        value: '4',
        label: '土地成本'
      }]
    }
  },
  components: {
    ConstrctionTargetSelector,
    DynamicCostAnnualSummary,
    ProjectSelector

  },
  mounted () {
    //this.queryModel.years.push(new Date().getFullYear().toString())
    // this.search()
    let date = new Date()
    let year = date.getFullYear()
    let num = year - 2017

    for (let i = 0; i < num; i++) {
      let newYea = 2017 + 1
      this.yearsList.push(newYea)
    }

    //this.search()
  },
  watch: {
    p_queryModel: {
      handler (newValue, oldValue) {
        console.log(' value change')
        this.queryModel.companyId = newValue.companyId
        this.queryModel.projectId = newValue.projectId
        this.queryModel.accObjId = newValue.accObjId
        this.queryModel.stageId = newValue.stageId
      },
      deep: true
    }
  },
  methods: {
    handleExport () { },

    reset () {
      this.queryModel.month_end = ''
      this.queryModel.month_start = ''
      this.queryModel.years = []
      this.queryModel.type = ''
      this.queryModel.group = ''
      this.queryModel.company = ''
      this.queryModel.businessDept = ''
      this.queryModel.accountingObjectId = ''
      this.queryModel.groupNumber = ''
      this.queryModel.companyId = ''
      this.queryModel.projectId = ''
      this.queryModel.contractNumber = ''
      this.queryModel.contractName = ''
      this.queryModel.stageId = ''
      this.p_queryModel.accObjId = ''
      this.p_queryModel.companyId = ''
      this.p_queryModel.projectId = ''
    },

    search () {
      if (this.queryModel.years.length === 0) {
        return this.$showNormalError('必须输入至少一个年份')
      }
      if (!this.queryModel.type) {
        return this.$showNormalError('请输入动态成本范围')
      }
      this.$refs.DynamicCostAnnualSummary.getList()
    }
  }
}

</script>
<style scoped>
</style>
