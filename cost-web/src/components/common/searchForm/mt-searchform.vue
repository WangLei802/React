<template>
  <div class="search-form">
    <div class="button-area">      
      <slot name="buttons"></slot>
      <el-button type="info" @click='searchBtn' size="mini"><i class="fa fa-filter"></i>{{showForm ? $l("btn_hide") : $l("btn_search")}}</el-button>
    </div>
<!--去掉动画效果，解决右边两个滚动条-->
    <!-- <el-collapse-transition> -->
      <div class="search-area" v-show="showForm">
        <div class="arrow-top"></div>        
        <el-form v-bind="$attrs" v-on="$listeners" :inline="true" size="mini" style="padding-top:0;padding-bottom:0;" label-width="120px">     
          <slot name="form"></slot>
        </el-form>
      </div>
    <!-- </el-collapse-transition> -->
  </div>
</template>

<script>
export default {
  name: 'searchForm',
  data() {
    return {
    }
  },
  methods: {
    searchBtn() {
      let showForm = this.showForm
      this.$store.commit('setShowForm', !showForm)
    }
  },
  computed: {
    showForm() {
      return this.$store.getters.showForm
    }
  }
}
</script>




