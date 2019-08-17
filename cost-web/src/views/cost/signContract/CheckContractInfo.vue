<template>
    <div class="app-container">
        <div class="subTitle">
            <div class="breadcrumb-child">
                <i class="fa fa-folder-open-o"></i>合同信息
            </div>

        </div>
        <div ref="contractSignListTable">
            <div class="inlineData">
                <el-row>
                    <el-col>
                        <div class="title"
                                style="margin-bottom:20px">合同基本信息</div>
                    </el-col>
                </el-row>
                <el-form ref="form"
                            :model="form"
                            label-width="120px"
                            class="contractInfo">
                    <el-form-item label="项目名称">
                        <el-input v-model="form.projectName"></el-input>
                        <span @click="changeProjectName(0)"
                                style="color:blue">选择</span>
                    </el-form-item>
                    <el-form-item label="成本分期">
                        <el-input v-model="form.projectName"></el-input>
                        <span @click="changeProjectName(0)"
                                style="color:blue">选择</span>
                    </el-form-item>
                    <el-form-item label="法人公司">
                        <el-input v-model="form.company"></el-input>
                    </el-form-item>
                    <!--<el-form-item label="签约日期">
                        <el-input v-model="form.dateOfContract"></el-input>
                    </el-form-item> -->
                    <el-form-item label="合同编号">
                        <el-input v-model="form.contractNumber" :disabled="true" ></el-input>
                    </el-form-item>
                    <el-form-item label="合同名称">
                        <el-input v-model="form.contractName"></el-input>
                    </el-form-item>
                    <el-form-item label="合同类型">
                            <el-select v-model='form.contractType' placeholder="请选择">
                            <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                            </el-select>
                        
                    </el-form-item>
                    <el-form-item label="是否主合同">
                        <el-select v-model="form.isPrimary"
                                    placeholder="请选择活动区域">
                            <el-option label="主合同"
                                        value="1"></el-option>
                            <el-option label="补充合同"
                                        value="0"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="主合同编号" v-if="form.isPrimary == '0'">
                        <el-input v-model="form.primaryContractCode"></el-input>
                    </el-form-item>
                    <el-form-item label="主合同名称" v-if="form.isPrimary == '0'">
                        <el-input v-model="form.primaryContractName"></el-input>
                            <span @click="changeProjectName(1)"
                                style="color:blue">选择</span>
                    </el-form-item>
                    <el-form-item label="是否按产值付款">
                        <el-select v-model="form.isPaiedByOutputValue"
                                    placeholder="请选择活动区域">
                            <el-option label="是"
                                        value="1"></el-option>
                            <el-option label="否"
                                        value="0"></el-option>
                        </el-select>

                    </el-form-item>
                    <el-form-item label="合同来源">
                        <el-select v-model="form.contractSource"
                                    placeholder="请选择活动区域">
                            <el-option label="成本系统编制"
                                        value="0"></el-option>
                            <el-option label="招财系统推送"
                                        value="1"></el-option>
                            <el-option label="费控"
                                        value="2"></el-option>
                        </el-select>

                    </el-form-item>
                    <el-form-item label="">
                        <router-link to="/signContract/checkContractInfo" tag="div" > 
                                <div class="tab-link">看招采系统推送信息</div>
                            </router-link>
                        
                    </el-form-item>
                    <!-- <el-form-item label="定标编号">
                        <el-input v-model="form.calibrationNumber"></el-input>
                    </el-form-item> -->
                    <el-form-item label="经办部门">
                        <el-input v-model="form.handlingDept" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="经办人">
                        <el-input v-model="form.handlingPerson" :disabled="true"></el-input>
                    </el-form-item>
                    <!-- </el-form-item> -->
                    <el-form-item label="经办日期">
                            <el-date-picker
                            v-model="form.handlingDate"
                            type="date" :disabled="true">                                   >
                            </el-date-picker>
                        
                    </el-form-item>

                </el-form>
            </div>
         </div>
            
           
       
    </div>
</template>

<script>
import SelectContractPlan from '@/views/cost/signContract/SelectContractPlan/'
import SelectProjectNameDialog from '@/views/cost/signContract/SelectProjectNameDialog/'
import CalibrationFeeInfor from '@/views/cost/signContract/CalibrationFeeInfor/'
import CostSplitList from '@/views/cost/signContract/CostSplitList/'
import ProjectSelector from '@/components/cost/ProjectSelector/'
import TargetCostCompilationTable from '@/views/cost/targetCostCompilation/TargetCostCompilationTable'
import COSTENUM from '@/utils/cost/enum'
export default {
  data() {
    return {
      options: [{
        value: '0',
        label: '开发类 '
      }, { value: '1',
        label: '开设计类发类 '
      }],
      dialogContractPlan: false,
      dialogVisible: false,
      desc: '',
      form: {
        projectName: '',
        handlingDate: new Date(),
        handlingPerson: '',
        department: '',
        calibrationNumber: '',
        contractSource: '',
        isPrimary: '0',
        primaryContractName: '',
        company: '',
        primaryContractCode: '',
        region: '',
        contractType: '',
        contractName: '',
        contractNumber: '',
        handlingDept: ''

      },
      contractDetails: {
        contractAmountIncludeTax: '',
        costNature: '',
        biddingWay: '',
        contractAmountExcludeTax: '',
        tax: '',
        taxAmount: '',
        partyA: '',
        partyB: '',
        partyC: '',
        maintenanceFundRate: '',
        reservedChangeAmountState: '0', // 0: 未释放 ，1: 已释放
        reservedChangeAmount: '',
        maintenanceFund: '',
        splitStatus: '',
        reservedChangeRatio: ''
      },
      tableDataList: [

      ],
      paymentDetails: [
        {
          paymentType: '进度款',
          paymentTerm: '完成3层建筑后30日支付',
          paymentRatio: '30%',
          estimatedPaymentAmount: '3000',
          Remarks: ''
        }
      ]

    }
  },
  components: {
    SelectProjectNameDialog,
    CostSplitList,
    CalibrationFeeInfor,
    ProjectSelector,
    TargetCostCompilationTable,
    SelectContractPlan
  },
  mounted() {
    // alert('555')
    this.search()
  },

  methods: {
    selectContractPlan() {
      this.dialogContractPlan = true
    },
    closeDialogContractPlan() {
      this.dialogContractPlan = false
    },
    closeDialogDialogVisible(val) {
      this.dialogVisible = false
    },
    changeProjectName(val) {
      if (val === '0') {
        this.dialogVisible = true
      } else if (val === '1') { // 主合同编号 调用后台API

      }
    },
    handleAddRow() {
      this.$router.push({
        name: 'NewContractInformation',
        query: { id: 0 }
      })
    },

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
        name: 'NewOrUpdateTargetCostCompilation',
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
    }
  }
}

</script>
<style scoped>
.el-select {
  width: 200px;
}
.add {
  margin-bottom: 10px;
}
.el-form-item {
  width: 33%;
  float: left;
}
.contractInfo .el-form-item__label {
  text-align: left;
  padding-left: 10px;
}
.contractInfo .el-input {
  width: 80% !important;
}
.inlineData {
  margin-top: 20px;
  float: left;
  width: 100%;
}
.inlineData .title {
  margin-bottom: 20px;
  border-bottom: 1px solid #ccc;
  padding-bottom: 5px;
}
</style>