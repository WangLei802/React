<template>
  <div class='app-container'>
      <iframe :src='link' style="width:100%;height:800px;"></iframe>
  </div>
</template>


<script>
export default {
  data() {
    return {
      link: ""
    };
  },
  methods: {},
  mounted: function() {
    this.link = "http://" + this.$route.params.link;
  }
};
</script>
