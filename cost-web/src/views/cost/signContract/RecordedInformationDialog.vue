<template>
    <div>
        <el-dialog :close-on-click-modal="false"
                   :close-on-press-escape="false"
                   title="合作记录"
                   :visible.sync="recordedInfor"
                   width="60%"
                   :show-close="false"
                   :before-close="handleClose">
            <div>
                 <el-table :data="tableData"
                              stripe
                              border
                              tooltip-effect="dark"
                              style="width: 100%"
                              size="small">
                        <el-table-column :label="$l('lbl_no')"
                                         width="50"
                                         type="index">
                        </el-table-column>
                        <el-table-column prop="projectName"
                                         label="项目名称"
                                         width="150">
                           
                        </el-table-column>
                        <el-table-column prop="accountingObjectName"
                                         show-overflow-tooltip
                                         label="成本分期"
                                         width="150">
a
                        </el-table-column>
                        <el-table-column prop="contractType"
                                         label="合同类型"
                                         width="150">
                          <template slot-scope="scope">
                            <fd-label :code="scope.row.contractType"
                                      type="cost_contract_type"></fd-label>
                          </template>

                        </el-table-column>
                        <el-table-column width="150"
                                         prop="contractName"
                                         label="合同名称">
                            
                        </el-table-column>
                        <el-table-column width="140"
                                         prop="contractAmountIncludeTax"
                                         label="签约金额(元)">

                        </el-table-column>
                        <el-table-column width="200"
                                         prop="dateOfContract"
                                         label="签约日期"
                                         :formatter='this.$dateFormat("dateOfContract","yyyy-MM-dd")'
                                         >
                        </el-table-column>
                       
                        
                    </el-table>
                
            </div>
            <span slot="footer"
                  class="dialog-footer">
                <el-button size="mini" @click="cancel">取 消</el-button>
                <!--<el-button size="mini" type="primary"
                           @click="submit">确 定</el-button>-->
            </span>
        </el-dialog>
    </div>
</template>
<script>
import { partnerList } from '@/api/cost/signContractAPI'
export default {
  props: {
    partnerName: {
      type: String
    },
    corporateCompanyId: {
      type: String
    },
    recordedInfor: {
      type: Boolean
    },

    partyB: {
      type: String
    },
    partyC: {
      type: String
    }

  },
  data() {
    return {
      tableData: [],
      // 查询model
      queryModel: {
        corporateCompanyId: '',
        partyB: '',
        partyC: ''
      }

    }
  },
  mounted() {
    this.queryModel.corporateCompanyId = this.corporateCompanyId
    if (this.partnerName === '乙方') {
      this.queryModel.partyB = this.partyB
    }

    if (this.partnerName === '丙方') {
      this.queryModel.partyC = this.partyC
    }
    if (this.queryModel.corporateCompanyId != null && this.queryModel.corporateCompanyId !== '') {
      this.getTableList()
    }
  },
  watch: {

  },
  methods: {
    getTableList() {
      partnerList(this.queryModel).then(response => {
        debugger
        this.tableData = response.data ? response.data : []
      }).catch(error => {
        console.log(error)
        this.$showError(error.message ? error.message : 'msg_system_error')
      })
    },
    cancel() {
      this.$emit('closeRecordedInfor')
    },
    handleClose(done) {

    }
  }
}
</script>
<style scoped>
.el-dialog__headerbtn {
  display: none;
}
</style>
