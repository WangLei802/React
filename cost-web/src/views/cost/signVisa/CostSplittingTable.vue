<template>
     <div>
        <el-radio-group v-model="splitting">
        <el-radio label="0">自动拆分</el-radio>
        <el-radio label="1">手动拆分</el-radio>
        </el-radio-group>
        <el-table :data="form.retailAmountAdjustmentList"  
                          stripe
                          border                          
                          tooltip-effect="dark"
                          style="width: 100%"
                          size="small">
                    <el-table-column :label="$l('lbl_no')"
                                     width="80"
                                     type="index">
                    </el-table-column>

                    <el-table-column prop="accountingObjName"
                                     label="成本分期"
                                     >

                    </el-table-column>
                   
                    <el-table-column width="150"
                                     prop="cpName"
                                     label="合约规划">

                    </el-table-column>
                    <el-table-column width="150"
                                     prop="sbName"
                                     label="科目"
                                     :disabled="true">

                    </el-table-column>
                    <el-table-column prop="constructTypeName"
                                     label="业态"
                                     width="150"
                                     :disabled="true">

                    </el-table-column>
                    <el-table-column prop="sharingRuleName"
                                     label="分摊规则"
                                     width="150"
                                     :disabled="true">

                    </el-table-column>
                    <el-table-column prop="amount"
                                     label="拆分合同金额(元)"
                                     width="150"
                                       >
                        <template slot-scope="scope">
                          
                         <span v-if="splitting && splitting=== '1'"> <input style="width:80%" v-model="scope.row.amount"></span>
                         <span v-if="splitting && splitting=== '0'">{{scope.row.amount}}</span>
                        </template>
                    </el-table-column>
                    
                    
                  
                </el-table>     
     
    </div>
</template>
<script>
import { LoadingUtil } from '@/utils/common/LoadingUtil'
export default {
  props: {
    value: {
      type: Array
    },
    splittingWay: {
      type: String
    }
  },
  data() {
    return {
      splitting: '0',
      form: {
        retailAmountAdjustmentList: this.value
      }
    }
  },
  mounted: function() {
    debugger
    if (this.value && this.value.length > 0 && this.value[0].splittingWay) {
      this.splitting = this.value[0].splittingWay
    } else if (this.splittingWay) {
      this.splitting = this.splittingWay
    }
    console.log(this.splitting)
  },
  watch: {
    'value': {
      handler(newValue, oldValue) {
        this.form.retailAmountAdjustmentList = newValue
        this.$emit('input', this.form.retailAmountAdjustmentList)
      },
      deep: true
    },

    'splitting': {
      handler(newValue, oldValue) {
        if (this.form.retailAmountAdjustmentList && this.form.retailAmountAdjustmentList.length > 0) {
          this.form.retailAmountAdjustmentList.forEach((item, index) => {
            item.splittingWay = newValue
          })
        }

        this.$emit('saveSplit', this.splitting)
      },
      deep: true
    }
  }
}
</script>
<style scoped>
.el-radio-group{
    width: 100%;
    text-align: right;
    margin-bottom: 10px;
}
</style>

