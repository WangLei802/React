<template>
  <div class='app-container'>
      <div class="button-area">
        <el-button class="ordinary-btn" icon='el-icon-plus' type='primary' @click='add'>{{$l("btn_add")}}</el-button>
      </div>
    <ClientRouterTable :queryObj_passed_in='roleQueryModel' ref='clientRouterTable'></ClientRouterTable>
  </div>
</template>
<script>
  import ClientRouterTable from '@/views/sys/clientRouter/ClientRouterTable'
  export default {
    components: {
      ClientRouterTable
    },
    data() {
      return {
        roleQueryModel: {
          roleCode: '',
          roleName: '',
          isSys: '',
          status: '',
          pageNum: 1,
          pageSize: 20,
          count: 0
        },
        externalData: []
      }
    },
    methods: {
      reset() {
        this.roleQueryModel.roleCode = ''
        this.roleQueryModel.roleName = ''
        this.roleQueryModel.isSys = ''
        this.roleQueryModel.status = ''
      },
      initVM() {
        this.roleQueryModel.pageNum = 1
        this.roleQueryModel.count = 0
        this.roleQueryModel.sortBy = ''
        this.roleQueryModel.order = -1
      },
      add() {
        this.$router.push({
          name: 'NewOrUpdateClientRouter'
        })
      },
      getRoleList() {
        this.initVM()
        this.$refs.clientRouterTable.getList()
      }
    }
  }
</script>
<style scoped>
  @import '../../../styles/list.scss';
</style>
