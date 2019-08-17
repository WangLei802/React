<template>
  <div>
    <el-checkbox-group v-model="myValue"  @change="handleCheckedCitiesChange">
      <el-checkbox  v-for='item in $getDictionaryListByType(type)' :label="item.dictValue" :key="item.dictValue">
        {{$checkLocaleIsCn() ? item.dictLabelCn : item.dictLabelEn }}
      </el-checkbox>
    </el-checkbox-group>

  </div>
</template>
<script>
  export default {
    name: 'fd-checkbox',
    data: function() {
      return {
        myValue: this.value
      }
    },
    props: {
      value: Array,
      type: String,
      placeholder: {
        type: String,
        default: ''
      }
    },
    methods: {
      handleCheckedCitiesChange(value) {
        this.$emit('input', value) // 触发 input 事件，并传入新值
      }
    },
    watch: {
      value: function(val) {
        this.myValue = val
      }
    }
  }
</script>


