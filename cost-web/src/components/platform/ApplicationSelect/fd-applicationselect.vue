<template>
  <el-select v-model="myValue" :disabled="disabled" filterable clearable :multiple="multiple" placeholder="请选择"  @change="handleChange">
    <el-option
      v-for="item in  options"
      :key="item.code"
      :label="item.name+'('+item.code+')'"
      :value="item.code">
    </el-option>
  </el-select>
</template>
<script>
import { searchApplicationList } from '@/api/platform/applicationModuleAPI'
export default {

  name: 'fd-applicationselect',
  data: function() {
    return {
      myValue: this.value,
      options: []
    }
  },
  props: {
    value: {
      required: true
    },
    clearable: Boolean,
    // type: String,
    // placeholder: {
    //   type: String,
    //   default: ''
    // },
    multiple: Boolean,

     disabled: {
      default() {
        return false
      }
     }
  },
  watch: {
    value: function(val) {
      this.myValue = val
      // if (this.options) {
      // let selectItem = this.options.find(item => item.code === val)
      //  this.name = selectItem.name
      // }
    },
    myValue: function(val) {
      this.$emit('input', val) // 触发 input 事件，并传入新值
      // this.$emit('change', selectItem) // 触发 input 事件，并传入新值
    }
  },
  methods: {
    handleChange(val) {
      let selectItem = this.options.find(item => item.code === val)
      this.$emit('change', selectItem)
    }
  },
  mounted: function() {
    searchApplicationList()
      .then(response => {
        this.options = response.data
      })
      .catch(error => {
        console.log(error)
      })
  }
}
</script>



