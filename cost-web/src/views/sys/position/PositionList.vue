<template>
  <div class='app-container'>
    <div v-if="type===1">
      <org-position-inner></org-position-inner>
    </div>
    <div v-if="type===2">
      <position-inner></position-inner>
    </div>
  </div>
</template>
<script>
  import { getValueByKey } from '@/utils/sys/ParameterUtil'
  import OrgPositionInner from '@/views/sys/orgPosition/OrgPositionInner'
  import PositionInner from '@/views/sys/position/PositionInner'
  export default {
    components: {
      OrgPositionInner,
      PositionInner
    },
    data() {
      return {
        type: +getValueByKey('user.link.model')
      }
    }
  }
</script>
