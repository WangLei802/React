/*
金额输入组件，格式化金额为两位小数
<amount-input v-model="myAmount1" :width="200" :placeholder="'请输入金额'" :disabled="true"/>
*/
<template>
    <div style="width:100%">
        <el-input v-model="amount"
                         type="number"
                         onmousewheel="return false;"
                         @change="updateValue"
                         @blur="blurEvent"
                         :placeholder="placeholder"
                         :disabled="disabled"
                         :controls="false"
                         :precision="2"
                         :style="{'vertical-align':'middle','border-radius':'2px','width':'100%'}"></el-input>
    </div>
</template>

<script>
export default {
  name: 'AmountInput',
  props: {
    value: {
      required: true
    },
    placeholder: {
      type: [String],
      required: false
    },
    width: {
      default: 200
    },
    disabled: {
      type: [Boolean],
      default: false
    }
  },
  data: function() {
    return {
      amount: ''
    }
  },
  mounted: function() {
    this.initValue()
  },
  methods: {
    initValue() {
      if (typeof (this.value) !== undefined && this.value != null && this.value !== '') {
        let _inputAmount = Number(this.value)
        if (!isNaN(_inputAmount)) {
          this.amount = _inputAmount.toFixed(2)
        }
      } else {
        this.amount = ''
      }
    },
    updateValue() {
      if (this.amount !== '' && !isNaN(this.amount)) {
        this.amount = Number(this.amount).toFixed(2)
        this.$emit('input', this.amount)
      } else {
        this.amount = ''
        this.$emit('input', '')
      }
      this.$emit('change')
    },
    blurEvent() {
      this.updateValue()
      this.$emit('blur')
    }
  },
  watch: {
    value: function(newValue, oldValue) {
      this.initValue()
    }
  }
}

</script>
<style scoped>
</style>


