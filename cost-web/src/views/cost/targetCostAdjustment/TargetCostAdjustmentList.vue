<!-- TargetCostCompilationList -->
<template>
    <div class='app-container'>
        <div class="subTitle">
            <div class="breadcrumb-child">
                <i class="fa fa-folder-open-o"></i>目标成本调整
            </div>
            <div class="button-area">
                <el-button size="mini"
                           icon='el-icon-plus'
                           type='primary'
                           @click='add'>{{$l("btn_add")}}</el-button>
            </div>
        </div>

        <el-form :inline="true"
                 class="demo-form-inline"
                 label-width="70px">
            <el-form-item :label="''">
                <AccountingTargetSelector @updateMessage="updateMessage"
                                          :queryModel='queryModel'></AccountingTargetSelector>
            </el-form-item>

            <el-form-item :label="'阶段'">
                <fd-select v-model='queryModel.stageId'
                           type="cost_stage_id"
                           :clearable="true"></fd-select>
            </el-form-item>

            <el-form-item :label="'审批状态'">
                <fd-select v-model='queryModel.status'
                           type="cost_flow_status"
                           :clearable="true"></fd-select>
            </el-form-item>
            <el-form-item>
                <f-button class="special-btn"
                          type='primary'
                          @click='search'
                          label="btn_search"></f-button>
            </el-form-item>
            <el-form-item>
                <f-button class="special-btn"
                          type='primary'
                          @click='reset'
                          label="btn_reset"></f-button>
            </el-form-item>
        </el-form>
        <TargetCostAdjustmentTable :queryObj_passed_in='queryModel'
                                   ref='TargetCostAdjustmentTable'></TargetCostAdjustmentTable>
    </div>
</template>

<script>
import AccountingTargetSelector from '@/components/cost/AccountingTargetSelector/'
import TargetCostAdjustmentTable from '@/views/cost/targetCostAdjustment/TargetCostAdjustmentTable'
import COSTENUM from '@/utils/cost/enum'
export default {
  data() {
    return {
      queryModel: {
        group: '',
        company: '',
        businessDept: '',
        accountingObjectId: '',
        stageId: '',
        status: '',
        pageNum: 1,
        pageSize: 20,
        count: 0,
        companyId: '',
        show: {
          group: true,
          company: true,
          dept: true,
          account: true
        }

      },

      tableData: []
    }
  },
  components: {
    TargetCostAdjustmentTable,
    AccountingTargetSelector
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
        name: 'NewOrUpdateTargetCostAdjustment',
        query: { id: 0, isEdit: true }
      })
    },
    initVM() {
      this.queryModel.pageNum = 1
      this.queryModel.count = 0
      this.queryModel.pageSize = 20
    },
    reset() {
      this.queryModel.group = ''
      this.queryModel.company = ''
      this.queryModel.businessDept = ''
      this.queryModel.accountingObjectId = ''
      this.queryModel.status = ''
      this.queryModel.stageId = ''
    },
    search() {
      this.initVM()
      this.$refs.TargetCostAdjustmentTable.getList()
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
