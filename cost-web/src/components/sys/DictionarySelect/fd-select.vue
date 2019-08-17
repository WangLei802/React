<template>
  <el-select v-model='myValue' :placeholder="placeholder" :multiple="multiple" :clearable="clearable" :disabled="disabled"
             @change="handleChange" size="mini">
    <el-option v-for='item in $getDictionaryListByType(type)'
               :key='item.dictValue'
               :label='$checkLocaleIsCn() ? item.dictLabelCn : item.dictLabelEn'
               :value='item.dictValue'>
    </el-option>
  </el-select>
</template>
<script>
  export default {
    name: 'fd-select',
    data: function() {
      return {
        myValue: this.value
      }
    },
    props: {
      value: {
        required: true
      },
      type: String,
      placeholder: {
        type: String,
        default: ''
      },
      multiple: Boolean,
      clearable: Boolean,
      disabled: Boolean
    },
    methods: {
      handleChange(event) {
        this.$emit('change', event)
      }
    },
    watch: {
      value: function(val) {
        this.myValue = val
      },
      myValue: function(val) {
        this.$emit('input', val) // 触发 input 事件，并传入新值
      }
    }
  }
</script>



