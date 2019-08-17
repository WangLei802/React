<!-- TargetCostCompilationList -->
<template>
    <div class='app-container'>
        <!--<div class="subTitle">-->
            <!--<div class="breadcrumb-child">-->
                <!--<i class="fa fa-folder-open-o"></i>成本确认>成就共享成本确认-->
            <!--</div>-->
            <!--<div class="button-area">-->
              <!--<el-button class="ordinary-btn"-->
                        <!--icon='el-icon-plus'-->
                        <!--type='primary'-->
                        <!--@click='add'>{{$l("btn_add")}}</el-button>-->
            <!--</div>-->
        <!--</div>-->

        <mt-searchform>
          <template slot="buttons">
            <el-button size="mini"  v-if="$checkPersmissionByCode('cost:confirmShare:create')"
                       icon='el-icon-plus'
                       type='primary'
                       @click='add'>{{$l("btn_add")}}</el-button>
          </template>
          <template slot="form">
              <el-row>
                <el-col :span="6">
                  <el-form-item :label="'单据编号：'">
                  <el-input  v-model='queryModel.receiptsNo' style="width:140px"></el-input>
                </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item :label="'经办人：'">
                    <el-input  v-model='queryModel.operator'></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="提交日期：">
                    <el-date-picker
                                    v-model="queryModel.operateDate"
                                    type="date"
                                    placeholder="选择日期时间" style="width:140px">
                    </el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="6" class="search-btn">
                  <el-form-item>
                    <el-button size="mini"
                              type='info'
                              @click='search'
                              label="btn_search">{{$l("btn_search")}}</el-button>
                    <el-button size="mini"
                              type='primary'
                              @click='reset'
                              label="btn_reset">{{$l("btn_reset")}}</el-button>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item :label="'审批状态：'">
                    <fd-select v-model='queryModel.status'
                               type="cost_flow_status"
                               :clearable="true" style="width:140px"></fd-select>
                  </el-form-item>
                </el-col>
              </el-row>
          </template>
        </mt-searchform>
        <CostConfirmTableShare :queryObj_passed_in='queryModel'
                          ref="CostConfirmTableShare"></CostConfirmTableShare>
    </div>
</template>

<script>
import ConstrctionTargetSelector from '@/components/cost/ConstrctionTargetSelector/'
import ProjectSelector from '@/components/cost/ProjectSelectorCommon/'
import CostConfirmTableShare from '@/views/cost/costConfirmationShare/CostConfirmTableShare'
import COSTENUM from '@/utils/cost/enum'
export default {
  data() {
    return {
      queryModel: {
        // planType:'',
        receipisNo: '',
        receiptsName: '',
        operator: '',
        operateDate: '',
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
    CostConfirmTableShare,
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
        name: 'NewOrUpdateCostConfirmShare',
        query: { id: '', isEdit: true, isAdd: true }
      })
    },
    initVM() {
      this.queryModel.pageNum = 1
      this.queryModel.count = 0
      this.queryModel.pageSize = 20
    },
    reset() {
      this.queryModel.receiptsNo = ''
      this.queryModel.receiptsName = ''
      this.queryModel.operator = ''
      this.queryModel.operateDate = ''
      this.queryModel.status = ''
      this.$refs.CostConfirmTableShare.getList()
    },

    search() {
      this.$refs.CostConfirmTableShare.getList()
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
