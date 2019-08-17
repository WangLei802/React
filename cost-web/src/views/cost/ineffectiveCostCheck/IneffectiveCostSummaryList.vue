<!-- TargetCostCompilationList -->
<template>
  <div class='app-container'>
    <mt-searchform>
      <template slot="buttons">
        <el-button size="mini"
                   type='primary'
                   @click='exportExcel'>导出
        </el-button>
      </template>
      <template slot="form">
        <el-row :inline="true">
          <el-col :inline="true"
                  label-width="120px"
                  :span="24">

            <ProjectSelector v-model='queryModel'
                             :show="{group: true,company: true,dept: true, project: true,accObj:false}">
              <template slot="projectSelectorButtons">
                <el-col :span="6"
                        class="search-btn">
                  <el-form-item>
                    <el-button size="mini"
                               type="primary"
                               @click='search'>{{$l("btn_search")}}
                    </el-button>
                    <el-button size="mini"
                               @click='reset'>{{$l("btn_reset")}}
                    </el-button>
                  </el-form-item>
                </el-col>
              </template>
            </ProjectSelector>
          </el-col>
        </el-row>
      </template>
    </mt-searchform>

    <IneffectiveCostSummaryTable :queryObj_passed_in='queryModel'
                                 ref="IneffectiveCostSummaryTable"></IneffectiveCostSummaryTable>
  </div>
</template>

<script>
  import ProjectSelector from '@/components/cost/ProjectSelector/'
  import IneffectiveCostSummaryTable from '@/views/cost/ineffectiveCostCheck/IneffectiveCostSummaryTable'
  import COSTBUSINESS from '@/utils/cost/business'
  export default {
    data() {
      return {
        queryModel: {
          companyId: '',
          projectId: ''
        }
      }
    },
    components: {
      IneffectiveCostSummaryTable,
      ProjectSelector
    },
    mounted() {
      this.search()
    },

    methods: {
      exportExcel() {
        COSTBUSINESS.download(process.env.COST_API + '/ineffectiveCost/exportCostSummaryData?' +
          'companyId=' + this.queryModel.companyId +
          '&projectId=' + this.queryModel.projectId + '&userName=' + this.$getUserInfo()["username"])
      },
      reset() {
        this.queryModel.companyId = ''
        this.queryModel.projectId = ''
      },
      search() {
        this.$refs.IneffectiveCostSummaryTable.getList()
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
