<!-- TargetCostCompilationList -->
<template>
    <div class='app-container'>

      <mt-searchform>
        <template slot="buttons">
          <el-button icon='el-icon-plus' size="mini" v-if="$checkPersmissionByCode('cost:paymentContract:createOrUpdate')"
                    type='primary'
                    @click='add'>{{$l("btn_add")}}</el-button>
        </template>
        <template slot="form">
          <el-row>
            <ProjectSelector @updateMessage="updateMessage" v-model='queryModel.queryModelTest'>
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

            <el-col :span="6">
              <el-form-item :label="'结算编号：'">
                <el-input v-model='queryModel.estimateNo'></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="6">
              <el-form-item :label="'合同名称：'">
                  <el-input v-model='queryModel.contractName'></el-input>
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
                <i class="fa fa-folder-open-o"></i>工程结算>合同结算
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
                 label-width="70px">
            <el-form-item :label="''"> -->
                <!-- <ConstrctionTargetSelector @updateMessage="updateMessage"
                                          :queryModel='queryModel'></ConstrctionTargetSelector> -->
                <!-- <ProjectSelector @updateMessage="updateMessage" v-model='queryModel.queryModelTest'></ProjectSelector>
            </el-form-item>

            <el-form-item :label="'结算编号'" label-width="70px">
              <el-input style="width:140px" v-model='queryModel.estimateNo'></el-input>
            </el-form-item>


            <el-form-item :label="'合同名称'">
                <el-input style="width:140px" v-model='queryModel.contractName'></el-input>
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
        <ContractTable :queryObj_passed_in='queryModel'
                          ref="ContractTable"></ContractTable>
    </div>
</template>

<script>
import ConstrctionTargetSelector from '@/components/cost/ConstrctionTargetSelector/'
import ProjectSelector from '@/components/cost/ProjectSelector/'
import ContractTable from '@/views/cost/contractSettlement/ContractTable'
import COSTENUM from '@/utils/cost/enum'
export default {
  data() {
    return {
      queryModel: {
        companyId: '',
        projectId: '',
        group: '', // 集团
        company: '', // 公司
        businessDept: '', // 事业部
        contractNumber: '', // 合同编号
        contractName: '', // 合同名称
        estimateNo: '', // 结算编号
        estimateName: '', // 结算名称
        accountingObjectId: '',
        stageId: '',
        status: '',
        pageNum: 1,
        pageSize: 20,
        count: 0,
        queryModelTest: {

          projectId: '',
          projectName: ''
        },
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
    ConstrctionTargetSelector,
    ContractTable,
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
      // alert(this.queryModel.companyId)
    },
    add() {
      this.$router.push({
        name: 'NewOrUpdateContract',
        query: { id: '', isEdit: true, isAdd: true }
      })
    },
    initVM() {
      this.queryModel.pageNum = 1
      this.queryModel.count = 0
      this.queryModel.pageSize = 20
    },
    reset() {
      this.queryModel.queryModelTest = ''
      this.queryModel.group = ''
      this.queryModel.company = ''
      this.queryModel.businessDept = ''
      this.queryModel.accountingObjectId = ''
      this.queryModel.status = ''
      this.queryModel.groupNumber = ''
      this.queryModel.companyId = ''
      this.queryModel.projectId = ''
      this.queryModel.contractNumber = ''
      this.queryModel.contractName = ''
      this.queryModel.queryModelTest.projectId = ''
      this.queryModel.queryModelTest.projectName = ''
      this.$refs.ContractTable.getList()
    },

    search() {
      this.$refs.ContractTable.getList()
    }
  }
}

</script>
<style scoped>
</style>
