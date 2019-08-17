<template>
    <div>
         <div  class="inlineData"> 
                        <el-row>
                            <el-col><div class="title" style="margin-bottom:20px;padding-bottom:10px;border-bottom:1px solid #ccc;">金额分配至科目</div></el-col>
                        </el-row>                       
                        <el-table :data="tableData"
                                  stripe
                                  border
                                  tooltip-effect="dark"
                                  style="width: 100%"
                                 
                                  size="small">
                            
                            <el-table-column fixed
                                             prop="accountingObjName"
                                             label="成本分期"
                                             width="250">
                             
                            </el-table-column>
                            <el-table-column fixed
                                             prop="cpName"
                                             label="合约规划"
                                             width="150">
                              
                            </el-table-column>
                            
                            <el-table-column fixed 
                                             prop="sbName"
                                             label="科目">
                               
                            </el-table-column>
                            
                             <el-table-column fixed
                                             prop="sharingRuleName"
                                             label="分摊规则">
                               
                            </el-table-column>
                           
                            <el-table-column fixed
                                             prop="amount"
                                             label="拆分金额(元)">
                             
                            </el-table-column>
                           
                          
                        </el-table>
                    </div>
           <div  class="inlineData"> 
                        <el-row>
                            <el-col>
                              <div class="title" style="margin-top:20px;margin-bottom:20px;padding-bottom:10px;border-bottom:1px solid #ccc;">业态金额分配调整
                                <span> <el-button v-if="isOrEdit" size="mini" type="primary" @click="checkoutDynamic()" >执行自动拆分</el-button>
                                  
                                </span>
                              </div>
                            </el-col>
                        </el-row>   
                        <el-radio-group v-if="isOrEdit" v-model="form.splittingWay" style="float:right;margin-bottom:20px">
                          <el-radio label="0">自动拆分</el-radio>
                          <el-radio label="1">手动拆分</el-radio>
                          </el-radio-group>  
                          <el-radio-group v-else v-model="form.splittingWay" style="float:right;margin-bottom:20px">
                          <el-radio label="0" disabled>自动拆分</el-radio>
                          <el-radio  label="1" disabled>手动拆分</el-radio>
                          </el-radio-group>                     
                        <el-table :data="form.formatData"
                                  stripe
                                  border
                                  tooltip-effect="dark"
                                  style="width: 100%"                                 
                                  size="small">
                            
                            <el-table-column fixed
                                             prop="accountingObjName"
                                             label="成本分期"
                                             width="250">
                             
                            </el-table-column>
                            <el-table-column fixed
                                             prop="cpName"
                                             label="合约规划"
                                             width="150">
                              
                            </el-table-column>
                            
                            <el-table-column fixed 
                                             prop="sbName"
                                             label="科目">
                               
                            </el-table-column>

                            <el-table-column fixed 
                                             prop="constructTypeName"
                                             label="业态">
                               
                            </el-table-column>
                            
                             <el-table-column fixed
                                             prop="sharingRuleName"
                                             label="分摊规则">
                               
                            </el-table-column>
                           
                            <el-table-column fixed
                                             prop="amount"
                                             label="拆分合同金额(元)">
                             <template slot-scope="scope">
                                <span  v-if="form.splittingWay === '1'" >
                                    <el-input v-model="scope.row.amount" ></el-input>
                                </span>
                                <span v-else>{{scope.row.amount}}</span> 
                              </template>
                            </el-table-column>
                           
                           
                          
                        </el-table>
                    </div>
    </div>
</template>
<script>
import { splittingList, dynacostSplittingList, getContractDetail } from '@/api/cost/signContractAPI'
import { LoadingUtil } from '@/utils/common/LoadingUtil'
export default {
  props: {
    dynaCostCPModel: {
      type: Object
    },
    activeName: {
      type: String
    }
  },

  data() {
    return {
      isOrEdit: true,
      tableData: [],
      form: {
        formatData: [],
        splittingWay: '0'
      }

    }
  },
  mounted() {
    this.isOrEdit = eval(this.$route.query.isOrEdit)
    if (this.$route.query.contractId) {
      this.getContractInfo()
    }

    if (this.$route.query.additionalRecording && !eval(this.$route.query.isOrEdit)) {
      this.isOrEdit = true
    }
  //  if (this.$route.query.contractId && this.activeName === '1') {
    //   this.getContractInfo()
    // } else {
    //   this.getUserInfo()
  //  }
  },
  watch: {
    'dynaCostCPModel': {
      handler(newValue, oldValue) {
        if (newValue) {
        // this.getUserInfo()
        }
      },
      deep: true
    },
    'activeName': {
      handler(newValue, oldValue) {
        if (newValue === '1' && this.dynaCostCPModel.dynaCostCPModelList.length > 0) {
          this.getUserInfo()
        } else if (newValue === '1' && this.dynaCostCPModel.dynaCostCPModelList.length === 0) {
          this.tableData = []
        }
      }
    },
    'form': {
      handler(newValue, oldValue) {
        this.form = newValue
        this.$emit('saveSplitSignInfo', this.form)
      },
      deep: true
    }

  },
  methods: {
    // 初始化基本信息
    initCommonInfoData(response) {
      let _this = this
      if (!response.data) {
        this.$showNormalError('没有可用数据')
        return
      }

      this.tableData = response.data.dynaCostCPModelList ? response.data.dynaCostCPModelList : []
      this.form.formatData = response.data.dynacostSplittingList ? response.data.dynacostSplittingList : []
      this.form.splittingWay = response.data.splittingWay
    },
    getContractInfo() {
      if (this.$route.query.contractId) {
        getContractDetail({ contractId: this.$route.query.contractId })
          .then(response => {
            this.initCommonInfoData(response)
          })
          .catch(error => {
            console.log(error)
            this.$showError(error.message ? error.message : 'msg_system_error')
          })
      }
    },
    checkoutDynamic() {
      this.form.splittingWay = '0'
      this.getSplittingList()
    },
    getSplittingList() {
      LoadingUtil.showLoading()
      dynacostSplittingList({ moduleType: '1_1', dynaCostCPModelList: this.dynaCostCPModel.dynaCostCPModelList, moduleDataPK: this.dynaCostCPModel.moduleDataPK }).then(response => {
        LoadingUtil.hideLoading()
        this.form.formatData = response.data ? response.data : []
      })
    },
    getUserInfo() {
      splittingList({ moduleType: '1_1', dynaCostCPModelList: this.dynaCostCPModel.dynaCostCPModelList, moduleDataPK: this.dynaCostCPModel.moduleDataPK }).then(response => {
        this.tableData = response.data ? response.data : []
      })
    }
  }

}
</script>
