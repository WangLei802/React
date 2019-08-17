<template>
  <div>
    <el-row v-if="type===1">
      <new-or-update-org-position-inner></new-or-update-org-position-inner>
    </el-row>
    <el-row v-if="type===2">
      <new-or-update-position-inner></new-or-update-position-inner>
    </el-row>
  </div>
</template>
<script >
  import { getValueByKey } from '@/utils/sys/ParameterUtil'
  import NewOrUpdateOrgPositionInner from '@/views/sys/orgPosition/NewOrUpdateOrgPositionInner'
  import NewOrUpdatePositionInner from '@/views/sys/position/NewOrUpdatePositionInner'
  export default {
    components: {
      NewOrUpdateOrgPositionInner,
      NewOrUpdatePositionInner
    },
    data() {
      return {
        type: +getValueByKey("user.link.model")
      }
    }
  }
</script>
<style scoped>
  @import '../../../styles/detail.scss';
</style>
