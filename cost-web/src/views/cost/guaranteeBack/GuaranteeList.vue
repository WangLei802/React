<!-- TargetCostCompilationList -->
<template>
    <div class='app-container'>

        <mt-searchform>

          <template slot="buttons">
            <el-button icon='el-icon-plus' size="mini"
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
                  <el-button size="mini"type='primary'
                            @click='search'>{{$l("btn_search")}}</el-button>
                  <el-button size="mini" type='primary'
                            @click='reset'>{{$l("btn_reset")}}</el-button>
                </el-form-item>
              </el-col>
              <!-- 项目名称 -->
              <ProjectSelector v-model='queryModel.queryModelTest' :show="show"  :span="{'project':6}" ></ProjectSelector>

              <el-col :span="6">
                <el-form-item :label="'提交日期：'">
                    <el-date-picker v-model="queryModel.operateDate"
                      type="date"
                      placeholder="选择日期" style="width:145px">
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

        <!-- <div class="subTitle">
            <div class="breadcrumb-child">
                <i class="fa fa-folder-open-o"></i>工程结算>质保金返还审批
            </div>
            <div class="button-area">
              <el-button class="ordinary-btn"
                        icon='el-icon-plus'
                        type='primary'
                        @click='add'>{{$l("btn_add")}}</el-button>
            </div>
        </div> -->
        <!-- <el-form :inline="true"
                 class="demo-form-inline"
                 label-width="70px"> -->

            <!-- <el-form-item :label="''">
                <ConstrctionTargetSelector @updateMessage="updateMessage"
                                          :queryModel='queryModel'></ConstrctionTargetSelector> -->
            <!-- </el-form-item> -->
            <!-- <el-form-item :label="'单据编号'" label-width="70px">
              <el-input style="width:140px" v-model='queryModel.receiptsNo'></el-input>
            </el-form-item>

            <el-form-item :label="'单据名称'">
                <el-input style="width:140px" v-model='queryModel.receiptsName'></el-input>
            </el-form-item>

            <el-form-item :label="'发起人'">
                <el-input style="width:140px" v-model='queryModel.createdBy'></el-input>
            </el-form-item>

            <el-form-item :label="''">
              <ProjectSelector @updateMessage="updateMessage" v-model='queryModel.queryModelTest'></ProjectSelector>
            </el-form-item>

             <el-form-item :label="'发起时间'"> -->
                <!-- <el-input style="width:140px" v-model='queryModel.contractName'></el-input> -->
                <!-- <el-date-picker style="width:140px"
                  v-model="queryModel.createDate"
                  type="date"
                  placeholder="选择日期">
                </el-date-picker>
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
        </el-form> -->
        <GuaranteeTable :queryObj_passed_in='queryModel'
                          ref="GuaranteeTable"></GuaranteeTable>
    </div>
</template>

<script>
import ConstrctionTargetSelector from '@/components/cost/ConstrctionTargetSelector/'
import ProjectSelector from '@/components/cost/AccountSelectorTwo/'
import GuaranteeTable from '@/views/cost/guaranteeBack/GuaranteeTable'
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
    GuaranteeTable,
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
        name: 'NewOrUpdateGuarantee',
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
      this.$refs.GuaranteeTable.getList()
    },
    search() {
      this.$refs.GuaranteeTable.getList()
    }
  }
}

</script>
<style scoped>
</style>
