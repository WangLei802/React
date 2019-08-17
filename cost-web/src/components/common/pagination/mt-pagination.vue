<template>
  <div>
    <span class="paginationBar_pre">
      共
      <font class="paginationBar_pre_number">{{this.$attrs.total}}</font>条记录，每页
      <font class="paginationBar_pre_number">
        {{this.$attrs['page-size']
        }}
      </font> 条，当前
      <font class="paginationBar_pre_number">
        {{this.$attrs['current-page']
        }}/{{pageCount}}
      </font> 页
    </span>
    <div class="paginationBar">
      <el-pagination
        v-bind="$attrs"
        v-on="$listeners"
        background
        layout="prev, pager, next, jumper"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: 'fd-pagination',
  data () {
    return {
      
    }
  },
  mounted () {
    console.info(this.$attrs)
  },
  computed: {
    pageCount () {
      let _pc = Math.ceil(this.$attrs.total / (this.$attrs['page-size'] ? this.$attrs['page-size'] : 1))
      if (isNaN(_pc)) {
        return ''
      } else {
        return _pc
      }

    }
  }
};
</script>
<style>
.paginationBar_pre {
  float: left;
  text-align: left;
  color: #606266;
  display: inline-block;
  font-size: 13px;
  font-weight: 80;
  width: 35%;
  height: 28px;
  line-height: 28px;
}
.paginationBar_pre_number {
  color: #0080cb;
  font-weight: bold;
}
.paginationBar {
  float: left;
  width: 65%;
}
</style>
