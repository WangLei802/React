<!-- TargetCostCompilationList -->
<template>
    <div class='app-container'>
        <!--<div class="subTitle">-->
            <!--<div class="breadcrumb-child">-->
                <!--<i class="fa fa-folder-open-o"></i>成本确认>跟投成本确认-->
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
          <el-button size="mini" v-if="$checkPersmissionByCode('cost:confirmThrow:create')"
                     icon='el-icon-plus'
                     type='primary'
                     @click='add'>{{$l("btn_add")}}</el-button>
        </template>
        <template slot="form">
          <el-row>
            <el-col :span="6">
              <el-form-item :label="'单据编号：'">
                <el-input style="width:140px" v-model='queryModel.receipisNo'></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
                <el-form-item :label="'经办人：'">
                  <el-input style="width:140px" v-model='queryModel.operator'></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="6">
            <el-form-item label="提交日期：">
              <el-date-picker style="width:160px"
                              v-model="queryModel.operateDate"
                              type="date"
                              placeholder="选择日期时间">
              </el-date-picker>
            </el-form-item>
            </el-col>
              <el-col :span="6" class="search-btn">
                <el-form-item>
                  <el-button size="mini" type="info" @click='search'>{{$l("btn_search")}}</el-button>
                  <el-button size="mini" @click='reset'>{{$l("btn_reset")}}</el-button>
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

        <KeepCostConfirmTable :queryObj_passed_in='queryModel'
                          ref="KeepCostConfirmTable"></KeepCostConfirmTable>
    </div>
</template>

<script>
import ConstrctionTargetSelector from '@/components/cost/ConstrctionTargetSelector/'
import ProjectSelector from '@/components/cost/ProjectSelectorCommon/'
import KeepCostConfirmTable from '@/views/cost/costConfirmation/KeepCostConfirmTable'
import COSTENUM from '@/utils/cost/enum'
import { tableHeight } from '@/utils/common/index'
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
    KeepCostConfirmTable,
    ProjectSelector

  },
  computed: {
    tHeight: function() {
      let options = {
        fullHeight: this.$store.getters.fullHeight,
        opened: this.$store.getters.sidebar.opened,
        showForm: this.$store.getters.showForm,
        obj: this
      }
      return `${tableHeight(options)}px`
    }
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
        name: 'NewOrUpdateCostConfirm',
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
      // this.queryModel.queryModelTest.projectId = ''
      // this.queryModel.queryModelTest.projectName = ''
      this.$refs.KeepCostConfirmTable.getList()
    },

    search() {
      this.$refs.KeepCostConfirmTable.getList()
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
