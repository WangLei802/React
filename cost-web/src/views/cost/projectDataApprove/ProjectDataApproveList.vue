<!-- TargetCostCompilationList -->
<template>
    <div class='app-container'>
      <mt-searchform>
        <template slot="buttons">
          <el-button icon='el-icon-plus' size="mini" v-if="$checkPersmissionByCode('cost:paymentProject:create')"
                      type='primary'
                      @click='add'>{{$l("btn_add")}}</el-button>
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
                <el-button type='primary' size="mini"
                          @click='search'>{{$l("btn_search")}}</el-button>
                <el-button type='primary' size="mini"
                          @click='reset'>{{$l("btn_reset")}}</el-button>
              </el-form-item>
            </el-col>

            <ProjectSelector v-model='queryModel.queryModelTest' :show="show"  :span="{'project':6}" ></ProjectSelector>

            <el-col :span="6">
              <el-form-item :label="'提交日期：'">
                <el-date-picker style="width:145px"
                  v-model="queryModel.operateDate"
                  type="date"
                  placeholder="选择日期">
                </el-date-picker>
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
        <ProjectDataApproveTable :queryObj_passed_in='queryModel'
                          ref="ProjectDataApproveTable"></ProjectDataApproveTable>
    </div>
</template>

<script>
import ConstrctionTargetSelector from '@/components/cost/ConstrctionTargetSelector/'
import ProjectSelector from '@/components/cost/AccountSelectorTwo/'
import ProjectDataApproveTable from '@/views/cost/projectDataApprove/ProjectDataApproveTable'
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
      queryModel: {
        // planType:'',
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
    ProjectDataApproveTable,
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
        name: 'NewOrUpdateProjectDataApprove',
        query: { id: '', isEdit: true, isAdd: true }
      })
    },
    initVM() {
      this.queryModel.pageNum = 1
      this.queryModel.count = 0
      this.queryModel.pageSize = 20
    },
    reset() {
      // this.queryModel.planType = ''
      this.queryModel.receiptsNo = ''
      this.queryModel.receiptsName = ''
      this.queryModel.operator = ''
      this.queryModel.operateDate = ''
      this.queryModel.projectId = ''
      this.queryModel.status = ''
      this.queryModel.queryModelTest.projectId = ''
      this.queryModel.queryModelTest.projectName = ''
      this.$refs.ProjectDataApproveTable.getList()
    },
    search() {
      this.$refs.ProjectDataApproveTable.getList()
    }
  }
}

</script>
<style scoped>
</style>
