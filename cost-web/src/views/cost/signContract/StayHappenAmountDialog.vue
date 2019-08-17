<template>
  <div>
    <el-dialog :close-on-click-modal="false"
               :close-on-press-escape="false"
               title="待发生金额处理"
               :visible.sync="stayHappenAmount"
               width="40%"
               :show-close="false"
               :before-close="handleClose">
      <div>
        <el-form ref="contractSigningCpNew"  :rules="rules"
                 :model="contractSigningCpNew"
                 label-width="150px"
                 size="mini">
          <el-form-item label="剩余待发生金额(元)">
            <el-input v-model="contractSigningCpNew.remainedPendingOccurenceAmount " disabled></el-input>
          </el-form-item>
          <el-form-item label="待发生处理">
            <el-radio-group v-if="isOrEdit || additionalRecording" v-model="contractSigningCpNew.dealingType" @change="compluteAmountReleased">
              <el-radio label="生成新合约"  ></el-radio>
              <el-radio label="释放"></el-radio>
            </el-radio-group>
            <el-radio-group v-else v-model="contractSigningCpNew.dealingType" @change="compluteAmountReleased">
              <el-radio label="生成新合约"  disabled ></el-radio>
              <el-radio label="释放" disabled ></el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="新合约规划名称" v-if="contractSigningCpNew.dealingType === '生成新合约'">
            <el-input v-model="contractSigningCpNew.newCpName" disabled></el-input>
          </el-form-item>
          <el-form-item label="新合约规划金额(元)"  prop="cpAmount" v-if="contractSigningCpNew.dealingType === '生成新合约'">
            <template slot-scope="scope">
                            <span >
                                 <amount-input v-if="isOrEdit || additionalRecording" v-model="contractSigningCpNew.cpAmount" @change="computeNewContractAmount()"></amount-input>
                                 <el-input v-else v-model="contractSigningCpNew.cpAmount" disabled></el-input>
                            </span>

            </template>

          </el-form-item>
          <el-form-item label="已释放金额(元)" >
            <template slot-scope="scope">
                            <span >
                                <el-input  v-model="contractSigningCpNew.remainedPending" disabled></el-input>
                              <!-- <amount-input  v-model="contractSigningCpNew.remainedPending" disabled></amount-input> -->
                            </span>

            </template>

          </el-form-item>

        </el-form>

      </div>
      <span slot="footer"
            class="dialog-footer">
                <el-button size="mini" @click="cancel">取 消</el-button>
                <el-button size="mini" v-if="isOrEdit || additionalRecording " type="primary"
                            @click="submit('contractSigningCpNew')">确 定</el-button>
            </span>
    </el-dialog>
  </div>
</template>
<script>
  import AmountInput from '@/components/cost/AmountInput/'
  export default {
    components: {

      AmountInput

    },
    props: {
      contractSigningCpNewList: {
        type: Object
      },
      cpName: {
        type: String
      },
      stayHappenAmountData: {
        type: Object
      },
      remainedPendingOccurenceAmount: {
        type: Number
      },
      remainedPending: {
        type: String
      },
      stayHappenAmount: {
        type: Boolean

      },
      accountingObjectId: {
        type: String
      }
    },
    data() {
      return {
        // stayHappenAmount: true,
        rules: {
          cpAmount: [
            { required: true, message: '请输入新合约规划金额', trigger: 'change' },
            // {
            //   pattern: /^([1-9]\d*(\.\d*[1-9])?)|(0\.\d*[1-9])$/,
            //   message: "请输入正确的金额",
            //   trigger: "change"
            // }
          ]
        },
        isShow: false,
        isOrEdit: true,
        additionalRecording: false,
        contractSigningCpNew: {
          cpAmount: '',
          newCpName: this.cpName + '-1',
          dealingType: '生成新合约',
          amountReleased: '',
          remainedPending: '',
          remainedPendingOccurenceAmount: this.remainedPendingOccurenceAmount

        }

      }
    },
    mounted() {
      if (this.$route.query.additionalRecording && eval(this.$route.query.additionalRecording)) {
        this.additionalRecording = eval(this.$route.query.additionalRecording)
      }
      this.getNewCpName()
      this.isOrEdit = eval(this.$route.query.isOrEdit)
      if (this.$route.query.contractId) {
        this.checkInfoData()
      }

      if (this.contractSigningCpNewList && this.contractSigningCpNewList.amountReleased || this.contractSigningCpNewList.cpAmount) {
        if (this.contractSigningCpNewList.dealingType === '0') {
          this.contractSigningCpNew.dealingType = '生成新合约'
          this.contractSigningCpNew.cpAmount = Number(this.contractSigningCpNewList.cpAmount).toFixed(2)

          this.contractSigningCpNew.remainedPending = Number(this.contractSigningCpNewList.amountReleased).toFixed(2)
          this.contractSigningCpNew.remainedPendingOccurenceAmount = (Number(this.contractSigningCpNewList.amountReleased) + Number(this.contractSigningCpNewList.cpAmount)).toFixed(2)
        } else if (this.contractSigningCpNewList.dealingType === '1') {
          this.contractSigningCpNew.dealingType = '释放'
          this.contractSigningCpNew.cpAmount = Number(this.contractSigningCpNewList.cpAmount).toFixed(2)

          this.contractSigningCpNew.remainedPending = Number(this.contractSigningCpNewList.amountReleased).toFixed(2)
          this.contractSigningCpNew.remainedPendingOccurenceAmount = (Number(this.contractSigningCpNewList.amountReleased) + Number(this.contractSigningCpNewList.cpAmount)).toFixed(2)
        }
      }
    },
    watch: {
      'contractSigningCpNew.cpAmount': {
        handler(newValue, oldValue) {
          if (newValue && Number(newValue) > Number(this.contractSigningCpNew.remainedPendingOccurenceAmount)) {
            return this.$showNormalError('合约规划金额不能大于剩余待发生')
          }
        },
        deep: true
      },
      'contractSigningCpNewList': {
        handler(newValue, oldValue) {
          if (newValue.cpAmount) {
            // this.contractSigningCpNew.remainedPendingOccurenceAmount = Number(newValue.remainedPending) + Number(newValue.cpAmount)
          }
        },
        deep: true
      },
      'cpName': {
        handler(newValue, oldValue) {
          this.contractSigningCpNew.newCpName = this.cpName + '-1'
        }
      },

      'remainedPendingOccurenceAmount': {
        handler(newValue, oldValue) {
          this.newContractAmount = newValue
          this.contractSigningCpNew.amountReleased = (Number(this.remainedPendingOccurenceAmount) - Number(this.contractSigningCpNew.cpAmount)).toFixed(2)
        },
        deep: true
      }
    },
    methods: {
      getNewCpName() {
        if (this.cpName.indexOf('-') > 0) {
          let currentCpNameMap = []
          currentCpNameMap = this.cpName.split('-')
          this.contractSigningCpNew.newCpName = currentCpNameMap[0] + '-' + (Number(currentCpNameMap[1]) + 1)
        }
      },
      compluteAmountReleased() {
        if (this.contractSigningCpNew.dealingType === '生成新合约') {
          this.contractSigningCpNew.amountReleased = (Number(this.remainedPendingOccurenceAmount) - Number(this.contractSigningCpNew.cpAmount)).toFixed(2)
          this.contractSigningCpNew.cpAmount = ''
          this.contractSigningCpNew.remainedPending = ''
        } else {
          this.contractSigningCpNew.amountReleased = Number(this.remainedPendingOccurenceAmount)
          this.contractSigningCpNew.cpAmount = ''
          this.contractSigningCpNew.remainedPending = (Number(this.contractSigningCpNew.remainedPendingOccurenceAmount) - Number(this.contractSigningCpNew.cpAmount)).toFixed(2)
        }

        if (this.contractSigningCpNew.dealingType === '生成新合约') {
          if (this.contractSigningCpNewList && this.contractSigningCpNewList.amountReleased && this.contractSigningCpNewList.cpAmount) {
            this.contractSigningCpNew.cpAmount = this.contractSigningCpNewList.cpAmount

            this.contractSigningCpNew.remainedPending = this.contractSigningCpNewList.amountReleased
            this.contractSigningCpNew.remainedPendingOccurenceAmount = (Number(this.contractSigningCpNewList.amountReleased) + Number(this.contractSigningCpNewList.cpAmount)).toFixed(2)
          }
        }
      },
      checkInfoData() {
        this.contractSigningCpNew.dealingType = this.stayHappenAmountData.contractSigningCpNew.dealingType
        if (this.contractSigningCpNew.dealingType === '0') {
          this.contractSigningCpNew.dealingType = '生成新合约'
          this.contractSigningCpNew.cpAmount = Number(this.stayHappenAmountData.contractSigningCpNew.cpAmount).toFixed(2)
        } else if (this.contractSigningCpNew.dealingType === '生成新合约/释放') {
          this.contractSigningCpNew.dealingType = '生成新合约'
          this.contractSigningCpNew.cpAmount = ''
        } else if (this.contractSigningCpNew.dealingType === '1') {
          this.contractSigningCpNew.dealingType = '释放'
        }
        // this.contractSigningCpNew.amountReleased = this.stayHappenAmountData.remainedPendingOccurenceAmount

        if (this.contractSigningCpNew.cpAmount) {
          // this.contractSigningCpNew.remainedPendingOccurenceAmount = Number(this.contractSigningCpNew.remainedPending) + Number(this.contractSigningCpNew.cpAmount)
        }
      },
      computeNewContractAmount(rowData, index) {
        if (Number(this.contractSigningCpNew.cpAmount) >= 0 && Number(this.contractSigningCpNew.cpAmount) <= Number(this.contractSigningCpNew.remainedPendingOccurenceAmount)) {
          this.$message('剩余部分金额将释放掉')
          this.isShow = false
        } else if (Number(this.contractSigningCpNew.cpAmount) < 0) {
          this.$showNormalError('合约规划金额不能小于0')
          this.isShow = false
        } else if (Number(this.contractSigningCpNew.cpAmount) > Number(this.contractSigningCpNew.remainedPendingOccurenceAmount)) {
          this.$showNormalError('合约规划金额不能大于剩余待发生')
          this.isShow = true
        }

        if (this.contractSigningCpNew.dealingType === '生成新合约') {
          this.contractSigningCpNew.remainedPending = (Number(this.contractSigningCpNew.remainedPendingOccurenceAmount) - Number(this.contractSigningCpNew.cpAmount)).toFixed(2)
        } else {
          this.contractSigningCpNew.remainedPending = (Number(this.contractSigningCpNew.remainedPendingOccurenceAmount) - Number(this.contractSigningCpNew.cpAmount)).toFixed(2)
        }
      },
      onSearch() {},
      submit(contractSigningCpNew) {
        if (this.contractSigningCpNew.dealingType === '生成新合约' && !this.contractSigningCpNew.cpAmount) {
          return this.$showNormalError('请填写新合约规划金额')
        } else if (Number(this.contractSigningCpNew.cpAmount) > Number(this.contractSigningCpNew.remainedPendingOccurenceAmount)) {
          return this.$showNormalError('合约规划金额不能大于剩余待发生')
        }
        this.$refs[contractSigningCpNew].validate((valid) => {
          if (valid) {
            this.$emit('closeStayHappenAmount', this.contractSigningCpNew)
          } else {
          // console.log('error submit!!')
            return false
          }
        })
  
        // this.$emit('input', this.contractSigningCpNew)
      },

      cancel() {
        this.$emit('closeStayHappenAmount')
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
