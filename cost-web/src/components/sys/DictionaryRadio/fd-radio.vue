<template>
  <div>
  <el-radio-group v-model='myValue' v-for='item in $getDictionaryListByType(type)' :key="item.dictValue" @change="handleChange">
    <el-radio :label="item.dictValue" >{{$checkLocaleIsCn() ? item.dictLabelCn : item.dictLabelEn }}</el-radio>
  </el-radio-group>
  </div>
</template>
<script>
  export default {
    name: 'fd-radio',
    data: function() {
      return {
        myValue: this.value
      }
    },
    props: {
      value: String,
      type: String,
      placeholder: {
        type: String,
        default: ''
      }
    },
    watch: {
      value: function(val) {
        this.myValue = val
      },
      myValue: function(val) {
        this.$emit('input', val) // 触发 input 事件，并传入新值
      }
    },
    methods: {
      handleChange(v) {
        this.$emit('change', v)
      }
    }
  }
</script>
<style scoped>
  .el-radio-group{
    margin-right: 10px;
  }
</style>



