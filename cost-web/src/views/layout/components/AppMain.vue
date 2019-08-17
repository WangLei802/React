<template>
  <section class="app-main" v-bind:style="{height: screenHeight}">
    <div class="app-main-container">
      <transition name="fade" mode="out-in">
        <router-view></router-view>
      </transition>
    </div>

    <!-- <div class="certificate" v-if="showCertificate">
     <table>
       <tr><td colspan="3" class="title">证书信息</td></tr>
       <tr><td style="width:25%">产品代码</td><td  style="width:20%">用户量</td><td style="width:55%">到期时间</td></tr>
       <tr v-for="i in certificate">
         <td>{{i.productCode}}</td>
         <td>{{i.userCount}}</td>
         <td>{{i.expiredDate}}</td>
       </tr>
     </table>
    </div>-->
  </section>
</template>

<script>
import { getLicese } from '@/api/sys/loginAPI'
export default {
  name: 'AppMain',
  props: {
    isOpenSlider: {
      type: Boolean
    }
  },
  data () {
    return {
      showCertificate: false,
      certificate: [],
      screenHeight: '0',
      fullHeight: document.documentElement.clientHeight
    }
  },
  mounted: function () {
    this.$nextTick(function () {
      this.settingHeight()
    })
    window.onresize = () => {
      return (() => {
        this.fullWidth = document.documentElement.clientWidth
        this.fullHeight = document.documentElement.clientHeight
        this.$store.commit('setFullHeight', this.fullHeight)
        this.$store.commit('setFullWidth', this.fullWidth)
      })()
    }
    getLicese(this.queryObj)
      .then(response => {
        this.certificate = response.data
        this.showCertificate = true
        setTimeout(() => {
          this.showCertificate = false
        }, 3000)
      })
      .catch(error => {
        console.log(error)
      })
  },
  methods: {
    settingHeight: function () {
      let subHeight = this.$store.state.user.isFromBpm ? 70 : 0 //bpm表单显示footer高度
      if (this.isOpenSlider) {
        this.screenHeight = this.fullHeight - 80 + subHeight + 'px'
      } else {
        this.screenHeight = this.fullHeight - 8 + subHeight + 'px'
      }
    }
  },
  watch: {
    isOpenSlider (val) {
      this.settingHeight()
    },
    fullHeight (val) {
      this.settingHeight()
    }
  }
}
</script>
<style scoped lang='scss'>
.app-main {
  box-sizing: border-box;
  height: 100%;
}
.app-main-container {
  height: 100%;
  background: #ffffff;
  border: 1px solid #eaeaea;
  margin: 0 10px;
  overflow: auto;
  & > div {
    height: 100%;
    overflow-y: auto;
  }
}
.app-main .certificate {
  background: #f0f9eb;
  padding: 15px 20px;
  width: 400px;
  position: fixed;
  top: 80px;
  left: 50%;
  transform: translateX(-50%);
  border-radius: 4px;
  z-index: 2001;
  .title {
    font-size: 16px;
    font-weight: bold;
    text-align: center;
  }
}
.certificate table {
  border-collapse: collapse;
}
.certificate td {
  border: 1px solid #ebeef5;
  padding: 5px;
  color: #606266;
}
.certificate * {
  font-size: 14px;
}
</style>
