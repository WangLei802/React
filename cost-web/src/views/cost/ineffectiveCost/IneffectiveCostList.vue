<!-- TargetCostCompilationList -->
<template>
  <div class='app-container'>
    <div class="subTitle">
      <div class="breadcrumb-child">
        <i class="fa fa-folder-open-o"></i>无效成本录入
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
             label-width="110px">
      <el-form-item :label="''">
        <ProjectAccountingTargetTreeSelector @updateMessage="updateMessage"
                                  :queryModel='queryModel'></ProjectAccountingTargetTreeSelector>
      </el-form-item>

      <el-form-item :label="'无效成本组编号'" style="margin-left: 276px">
        <el-input style="width:200px" v-model='queryModel.groupNumber' ></el-input>
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

    <IneffectiveCostTable :queryObj_passed_in='queryModel'
                                ref='IneffectiveCostTable'></IneffectiveCostTable>
  </div>
</template>

<script>
  import ProjectAccountingTargetTreeSelector from '@/components/cost/ProjectAccountingTargetTreeSelector'
  import ProjectSelector from '@/components/cost/ProjectSelector/'
  import IneffectiveCostTable from '@/views/cost/ineffectiveCost/IneffectiveCostTable'
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
          groupNumber: '',
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

        }
      }
    },
    components: {
      ProjectAccountingTargetTreeSelector,
      ProjectSelector,
      IneffectiveCostTable
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
          name: 'NewOrUpdateIneffectiveCost',
          query: { id: '', isEdit: true, isAdd: true }
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
        this.queryModel.groupNumber = ''
      },
      search() {
        console.log(this.queryModel.status)
        // this.initVM()
        this.$refs.IneffectiveCostTable.getList()
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
