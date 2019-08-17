<template>
  <div>
    {{time}}
  </div>
</template>
<script>
export default {
  name: 'fd-time',
  props: ['title', 'color', 'mini', 'refreshButtonEnable', 'miniButtonEnable', 'fullScreenButtonEnable', 'closeButtonEnable'],
  data() {
    return {
      time: new Date()
    }
  },
  methods: {
    refresh(e) {
      this.time = new Date()
    }
  }

}
</script>
<style scoped>
</style>

