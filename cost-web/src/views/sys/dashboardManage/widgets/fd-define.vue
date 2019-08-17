<template>
  <div  class="content">
    <div v-html="content">
    </div>
  </div>
</template>
<script>
export default {
  name: 'fd-define',
  props: ['data'],
  data() {
    return {}
  },
  computed: {
    content: function() {
      return this.data ? this.data : '-:)'
    }
  }
}
</script>
<style scoped>
.content {
  padding: 10px;
  height: 100%;
  overflow: auto
}
</style>



