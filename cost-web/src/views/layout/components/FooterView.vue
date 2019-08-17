<template>
  <transition name="el-zoom-in-bottom">
    <div class="footer-component" v-show="isOpenSlider">
      <span v-if='this.$checkLocaleIsCn()'>{{copyrightCn}}</span>
      <span v-else>{{copyrightEn}}</span>
      &nbsp;&nbsp;&nbsp;<span>{{$l("lbl_version")}}： {{versionInf}}</span>
    </div>
  </transition>
</template>

<script>
  export default {
    name: 'FooterView',
    props: {
      copyrightEn: {
        type: String,
        default: '© Movitech 2018'
      },
      copyrightCn: {
        type: String,
        default: '© Movitech 2018'
      },
      versionInf: {
        type: String,
        default: '1.0.0'
      },
      isOpenSlider: {
        type: Boolean,
        default: false
      }
    }
  }
</script>

<style scoped>
  .footer-component{
    text-align: center;
    height: 32px;
    overflow: hidden;
    line-height: 32px;
    font-size: 12px;
    color: #666666;
  }
</style>
