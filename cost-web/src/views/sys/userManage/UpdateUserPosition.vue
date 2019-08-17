<template>
  <div class='app-container'>
    <!--<div class="subTitle">-->
      <!--<div class="breadcrumb-child">-->
        <!--<i class="fa fa-folder-open-o"></i>用户分配岗位</div>-->
    <!--</div>-->
      <div v-if="type === 1">
        <user-org-position-inner></user-org-position-inner>
      </div>
      <div v-if="type === 2">
        <user-position-inner></user-position-inner>
      </div>
  </div>
</template>
<script>
  import { getValueByKey } from '@/utils/sys/ParameterUtil'
  import UserOrgPositionInner from '@/views/sys/userManage/UserOrgPositionInner'
  import UserPositionInner from '@/views/sys/userManage/UserPositionInner'
  export default {
    components: {
      UserPositionInner,
      UserOrgPositionInner
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
  @import '../../../styles/list.scss';

</style>
