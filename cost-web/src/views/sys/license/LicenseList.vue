<template>
    <div class='app-container'>
            <div class="button-area">
                <el-button  class="ordinary-btn" icon='el-icon-plus' type='primary' @click='add'>{{$l("btn_add")}}</el-button>
            </div>
        <LicenseTable :queryObj_passed_in='licenseQueryModel' ref='licenseTable'></LicenseTable>
    </div>
</template>
<script>
import LicenseTable from '@/views/sys/license/LicenseTable'
export default {
  components: {
    LicenseTable
  },
  data() {
    return {
      licenseQueryModel: {
        pageNum: 1,
        pageSize: 20,
        count: 0
      }
    }
  },
  methods: {
    initVM() {
      this.licenseQueryModel.pageNum = 1
      this.licenseQueryModel.pageSize = 20
      this.licenseQueryModel.count = 0
    },
    add() {
      this.$router.push({
        name: 'NewOrUpdateLicense'
      })
    }
  }
}
</script>
<style scoped>
@import '../../../styles/list.scss';
</style>
