<template>
  <div>
    <div @click="jump">{{this.$getDictionaryLabel(this.type,this.code)}}</div>
  </div>
</template>
<script>
export default {
  name: "fd-label",
  props: {
    type: String,
    code: String,
    url: String
  },
  // mounted () {
  //   alert(this.$getDictionaryLabel(this.bpmUrl))
  // },
  methods: {
    jump() {
      let bpmUrl = this.url;
      // alert(burl)
      if (bpmUrl != "") {
        window.open(bpmUrl, "_blank");
      }
    }
  }
};
</script>


