<template>
  <div class='app-container'>
      <div class="button-area">
        <el-button  class="ordinary-btn" icon='el-icon-plus' type='primary' @click='add'>{{$l("btn_add")}}</el-button>
      </div>
    <EmailServerTable></EmailServerTable>
  </div>
</template>
<script>
  import EmailServerTable from '@/views/sys/emailServer/EmailServerTable'
  export default {
    components: {
      EmailServerTable
    },
    methods: {
      add() {
        this.$router.push({
          name: 'NewOrUpdateEmailServer'
        })
      }
    }
  }
</script>
<style scoped>
  @import '../../../styles/list.scss';
</style>

