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
              <el-col :span="6">
                <el-form-item :label="'成本范围：'">
                  <fd-select
                    v-model="queryModel.costRange"
                    placeholder="请选择"
                    type="cost_report_range"
                    :clearable="false"
                  ></fd-select>
                </el-form-item>
              </el-col>
            </template>
          </ProjectSelector>
        </el-row>
      </template>
    </mt-searchform>
    <DynamicCostListBySubjectTable
      :queryObj_passed_in="queryModel"
      ref="DynamicCostDetailsByContractTable"
    ></DynamicCostListBySubjectTable>
  </div>
</template>

<script>
import ConstrctionTargetSelector from '@/components/cost/ConstrctionTargetSelector/'
import ProjectSelector from '@/components/cost/ProjectSelector/'
import DynamicCostListBySubjectTable from '@/views/cost/dynamicCost/DynamicCostListBySubjectTable'
import COSTENUM from '@/utils/cost/enum'
export default {
  data () {
    return {
      id: '',
      p_queryModel: {
        companyId: '', // 可能是groupId ||  companyId || deptId
        projectId: '', // 项目id
        accObjId: '' // 成本分期id
      },
      queryModel: {
        companyId: '',
        accObjId: '',
        costRange: '1', // 成本范围
      }
    }
  },
  components: {
    ConstrctionTargetSelector,
    DynamicCostListBySubjectTable,
    ProjectSelector
  },
  mounted () {
    // this.search()
  },
  watch: {
    p_queryModel: {
      handler (newValue, oldValue) {
        this.queryModel.companyId = this.p_queryModel.companyId
        this.queryModel.accObjId = this.p_queryModel.accObjId
        this.queryModel.stageId = this.p_queryModel.stageId
      },
      deep: true
    }
  },
  methods: {
    //导出excel
    handleExport () {

    },
    //重置
    reset () {
      this.p_queryModel.companyId = null // 可能是groupId ||  companyId || deptId
      this.p_queryModel.projectId = null // 项目id
      this.p_queryModel.accObjId = null // 成本分期id

      this.queryModel.costRange = '1'

      this.$refs.DynamicCostDetailsByContractTable.getList()
    },
    //查询
    search () {
      if (!this.queryModel.accObjId) {
        this.$showError('请选择成本分期')
        return
      }
      this.$refs.DynamicCostDetailsByContractTable.getList()
    }
  }
}

</script>
<style scoped>
</style>
