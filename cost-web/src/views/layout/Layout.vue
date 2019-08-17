<template>
  <div
    class="app-wrapper left-side-bar"
    v-bind:class="{ noSidebar:noSidebar, hideSidebar:!sidebar.opened, noFirstSliderBar: noFirstMenu}"
  >
    <div class="left-side-bar" :class="{hideSidebar:!sidebar.opened}">
      <!-- header -->
      <navbar
        :fillCol="fillCol"
        :systemNameEn="systemNameEn"
        :systemNameCn="systemNameCn"
        :nickName="nickName"
        :portrait="portrait"
        :logoUrl="logoUrl"
        :isOpenSlider="sidebar.opened"
        v-if="!isFromBpm"
      ></navbar>

      <!-- left menu -->
      <sidebar
        class="sidebar-container"
        :portrait="portrait"
        :isOpenSlider="sidebar.opened"
        :style="{height:sidebarHeight}"
        v-if="!isFromBpm"
      ></sidebar>

      <!-- main part -->
      <div
        class="main-container"
        :style="{'margin-left':isFromBpm?'0px':(sidebar.opened?'200px':'54px')}"
      >
        <!-- bread crumbs -->
        <div class="breadcrumb-parent" v-if="!isFromBpm">
          <!-- collapsing event-->
          <hamburger
            class="hamburger-container"
            :toggleClick="toggleSideBar"
            :isOpenSlider="sidebar.opened"
          ></hamburger>

          <breadcrumb :isOpenSlider="sidebar.opened"></breadcrumb>
        </div>

        <!-- work area -->
        <app-main :isOpenSlider="sidebar.opened"></app-main>
      </div>
    </div>
  </div>
</template>

<script>
import { Navbar, Sidebar, AppMain } from '@/views/layout/components'
import FooterView from '@/views/layout/components/FooterView'
import ThemeModel from '@/views/layout/components/ThemeModel'
import Breadcrumb from '@/views/layout/components/Breadcrumb'
import { mapGetters } from 'vuex'
import Hamburger from '@/views/layout/components/Hamburger'
import { getPortal } from '@/api/sys/portalAPI'
import { FileUtil } from '@/utils/common/common'

export default {
  name: 'layout',
  components: {
    Navbar,
    Sidebar,
    AppMain,
    FooterView,
    ThemeModel,
    Breadcrumb,
    Hamburger
  },
  data () {
    return {
      nickName: '',
      portrait: '',
      fillCol: '#fff',
      systemNameCn: '',
      systemNameEn: '',
      copyrightCn: '',
      copyrightEn: '',
      versionInf: '1.0.0',
      logoUrl: ''
    }
  },
  computed: {
    sidebarHeight () {
      return this.$store.getters.fullHeight - Number(this.$store.getters.sidebar.opened) * 50 + 'px'
    },
    sidebar () {
      return this.$store.state.app.sidebar
    },
    ...mapGetters(['sidebar', 'avatar']),

    noSidebar () {
      if (this.$store.getters.getFirstMenu === 'CostManager') {
        return false
      } else {
        return this.$store.state.menu.leftMenu.length === 0
      }
    },

    noFirstMenu () {
      return !this.$store.getters.getFirstMenu
    },
    isFromBpm () {
      //let _isFromBpmParamter = this.getUrlParam('isFromBpm')
      let _isFromBpm = false
      _isFromBpm = window.location.href.includes('isFromBpm=true')
      this.$store.dispatch('SETIsBpmFrom', _isFromBpm)
      return _isFromBpm//是否为bpm原单模式
    }
  },
  mounted () {
    let _this = this
    window.updatePortrait = (portrait) => {
      this.portrait = FileUtil.getFileUrlById(portrait)
    }
    getPortal()
      .then(response => {
        let usageInformation = response.data.usageInformation
        let user = response.data.user
        // _this.systemNameCn =
        //   usageInformation.companyNameCn + ' ' + usageInformation.systemNameCn
        // _this.systemNameEn =
        //   usageInformation.companyNameEn + ' ' + usageInformation.systemNameEn

        _this.systemNameCn = usageInformation.systemNameCn
        _this.systemNameEn = usageInformation.systemNameEn
        window.systemNameEn = usageInformation.systemNameEn
        window.systemNameCn = usageInformation.systemNameCn
        window.changeTitle && window.changeTitle(this.$checkLocaleIsCn() ? window.systemNameCn : window.systemNameEn)
        _this.copyrightCn = usageInformation.copyrightCn
        _this.copyrightEn = usageInformation.copyrightEn
        _this.versionInf = usageInformation.systemVersion
        _this.nickName = user.nickName
        // _this.portrait = user.avatar
        _this.logoUrl = FileUtil.getFileUrlById(response.data.logoUrl)
        _this.portrait = FileUtil.getFileUrlById(user.avatar)
      })
      .catch(error => {
        console.log(error)
        this.$showError('msg_system_error')
      })
  },
  methods: {
    toggleSideBar () {
      this.$store.dispatch('ToggleSideBar')
    },
    //获取url参数
    getUrlParam (name) {
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象  
      var r = window.location.search.substr(1).match(reg);  //匹配目标参数  
      if (r != null) {
        return unescape(r[2]);  //返回参数值 
      } else {
        return null;
      }
    }
  }
}
</script>

<style rel='stylesheet/scss' lang='scss' scoped>
@import "src/styles/mixin.scss";
.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;
  background: #ffffff;
  & > div {
    height: 100%;
  }
}
.main-container {
  position: relative;
  height: 100%;
}
.breadcrumb-parent {
  height: 30px;
  background: #f5f7fa;
}
.hamburger-container {
  display: inline-block;
  margin-left: 10px;
  position: relative;
  top: -8px;
}
</style>
