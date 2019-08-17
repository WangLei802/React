<!-- TargetCostCompilationList -->
<template>
    <div class='app-container'>
      <mt-searchform>
        
        <template slot="form">
          <el-row>
             <ProjectSelector @updateMessage="updateMessage" v-model='queryModel.ConstructionModelTest'>
           <!-- <ProjectSelector v-model='p_queryModel' > -->
              <template slot="projectSelectorButtons">
                <el-col :span="6" class="search-btn">
                  <el-form-item>
                      <el-button type='primary' size="mini"
                                @click='search'>{{$l("btn_search")}}</el-button>                  
                      <el-button type='primary' size="mini"
                                @click='reset'>{{$l("btn_reset")}}</el-button>
                  </el-form-item>
                </el-col>
              </template>
            </ProjectSelector>
         <!--   <el-col :span="6">
              <el-form-item :label="'合同名称:'">
                  <el-input v-model='queryModel.contractName'></el-input>
              </el-form-item>
            </el-col> -->
              <el-col :span="6">
              <el-form-item :label="'单据类型：'">
               <el-select v-model="queryModel.billType" placeholder="请选择" clearable >
                  <el-option
                    v-for="item in billList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item :label="'拆分状态：'">
                <el-select v-model="queryModel.splitStatus" placeholder="请选择" clearable >
                  <el-option
                    v-for="item in splitList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
                 
              </el-form-item>
            </el-col>
          </el-row>
        </template>
      </mt-searchform>
        <DynamicCostTable :queryObj_passed_in='queryModel'
                ref="DynamicCostTable"></DynamicCostTable>
    </div>
</template>

<script>
import ConstrctionTargetSelector from '@/components/cost/ConstrctionTargetSelector/'
import ProjectSelector from '@/components/cost/ProjectSelector/'
import DynamicCostTable from '@/views/cost/dynamicCost/DynamicCostTable'
import COSTENUM from '@/utils/cost/enum'
export default {
  data() {
    return {
      id: '',
      p_queryModel: {
        companyId: '', // 可能是groupId ||  companyId || deptId
        projectId: '', // 项目id
        accObjId: '', // 成本分期id
        ConstructionModelTest: {
          companyId: '',
          projectId: ''
        }
      },
      queryModel: {
        companyId: '',
        projectId: '',
        splitStatus: '', // 拆分状态
        group: '', // 集团
        company: '', // 公司
        businessDept: '', // 事业部
        contractName: '', // 合同名称
        billType: '', // 单据类型
        accountingObjectId: '',
        stageId: '',
        pageNum: 1,
        pageSize: 20,
        count: 0,
        ConstructionModelTest: {
          companyId: '',
          projectId: ''
        }

      },
      billList: [{
        value: '1_1',
        label: '合同签订'
      }, {
        value: '2_1',
        label: '设计变更申请'
      }, {
        value: '3_1',
        label: '现场签证申请'
      }, {
        value: '2_1_0',
        label: '设计变更一次造价确认'
      }, {
        value: '2_1_1',
        label: '设计变更二次造价确认'
      }, {
        value: '3_1_0',
        label: '现场签证一次造价确认'
      }, {
        value: '3_1_1',
        label: '现场签证二次造价确认'
      }, {
        value: '4_1',
        label: '合同变更'
      }, {
        value: '5_1',
        label: '合同转固'
      }, {
        value: '6_1',
        label: '合同结算'
      }, {
        value: '7_1',
        label: '无合同付款申请'
      }],
      splitList: [{
        value: '0',
        label: '已拆分'
      }, {
        value: '1',
        label: '未拆分'
      }]
    }
  },
  components: {
    ConstrctionTargetSelector,
    DynamicCostTable,
    ProjectSelector

  },
  mounted() {
    // this.search()
  },
  watch: {
    'p_queryModel': {
      handler(newValue, oldValue) {
        if (newValue.accObjId) {
          this.id = newValue.accObjId
        } else if (newValue.projectId) {
          this.id = newValue.projectId
        } else if (newValue.companyId) {
          this.id = newValue.companyId
        }
        // 根据项目id 或者成本分期id查询合同
      //  this.selectContract(this.id)
      }
    }
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
      // alert(this.queryModel.companyId)
    },
    selectContract(val) {
      getAccountingObject({ id: val })
        .then(response => {
          if (response.code === '2000') {
            this.queryModel.contractName = response.data
          }
        }).catch(error => {
          console.log(error)
          this.$showError(error.message ? error.message : 'msg_system_error')
        })
    },
    reset() {
      this.queryModel.group = ''
      this.queryModel.company = ''
      this.queryModel.businessDept = ''
      this.queryModel.accountingObjectId = ''
      this.queryModel.groupNumber = ''
      this.queryModel.companyId = ''
      this.queryModel.projectId = ''
      this.queryModel.contractNumber = ''
      this.queryModel.contractName = ''
      this.queryModel.splitStatus = ''
      this.queryModel.billType = ''
      this.queryModel.stageId = ''
      // this.p_queryModel.companyId = ''
      // this.p_queryModel.projectId = ''
      //  this.p_queryModel.accObjId = ''
      this.queryModel.ConstructionModelTest = ''
      this.$refs.DynamicCostTable.getList()
    },

    search() {
      this.$refs.DynamicCostTable.getList()
    }
  }
}

</script>
<style scoped>
</style>
