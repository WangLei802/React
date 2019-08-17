<template>
  <el-breadcrumb class="app-breadcrumb" separator="/">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="(item,index)  in levelList"
                          :key="index"
                          v-if="item.meta.title">
        <span v-if="!item.path||item.redirect==='noredirect'||index==levelList.length-1"
              class="no-redirect">{{$l(item.meta.title)}}</span>
        <span v-else
              v-on:click.native="cleanMenuName()"
              class="no-redirect">{{$l(item.meta.title)}}</span>
      </el-breadcrumb-item>
    </transition-group>
    <div class="full" v-show="!isOpenSlider" @click="fullScreen">
      <i class="fa fa-arrows fa-lg"></i>
    </div>
  </el-breadcrumb>
</template>

<script>
import { getLocalItem, Constants, setLocalItem } from '@/utils/common/cache'
export default {
  props: {
    isOpenSlider: {
      type: Boolean,
      default: false
    }
  },
  created () {
    this.getBreadcrumb()
  },
  data () {
    return {
      levelList: [{ path: '', meta: { title: ' ' } }],
      isFullScreen: false
    }
  },
  watch: {
    '$route' (to, from) {
      let path_value = JSON.parse(getLocalItem(Constants.PATH_VALUE))
      // if (!path_value[to.path]) {
      //     path_value[to.path] = path_value[from.path]
      //     setLocalItem(Constants.PATH_VALUE, JSON.stringify(path_value))
      //     this.getBreadcrumb()
      // }
    },
    getMenuInfo () {
      this.getBreadcrumb()
    }
  },
  methods: {
    getBreadcrumb () {
      let menu = this.getMenuInfo
      let menuName = ''
      let path_value = JSON.parse(getLocalItem(Constants.PATH_VALUE)) || {}
      menuName = path_value[window.location.pathname] || this.getMenuInfo.menu
      if (!menuName) {
        return
      }
      let menuNames = (menuName || '').split(',')
      this.levelList = []
      menuNames.forEach((v, index) => {
        if (v) {
          let path = index === 0 ? menu.path : index + ''
          this.levelList.push({ path: path, meta: { title: v } })
        }
      })
    },
    cleanMenuName () {
      this.$store.dispatch('setCurrentMenu', { currentMenuName: '' })
    },
    fullScreen () {
      if (this.isFullScreen) {
        if (document.exitFullscreen) {
          document.exitFullscreen()
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen()
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen()
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen()
        }
        this.isFullScreen = false
      } else {
        let docElm = document.documentElement
        // W3C
        if (docElm.requestFullscreen) {
          docElm.requestFullscreen()
        } else if (docElm.mozRequestFullScreen) {
          // FireFox
          docElm.mozRequestFullScreen()
        } else if (docElm.webkitRequestFullScreen) {
          // Chrome等
          docElm.webkitRequestFullScreen()
        }
        this.isFullScreen = true
      }
    }

  },
  computed: {
    getMenuInfo () {
      // 初始化进来的菜单
      if (!(this.$store.getters.getCurrentMenuName)) {
        let firstMenu = (this.$store.getters.getLeftMenu[0] && this.$store.getters.getLeftMenu[0].children && this.$store.getters.getLeftMenu[0].children[0]) || []
        // 找到默人页面的menu信息
        let menuName = ''
        let menus = (this.$store.getters.getLeftMenu[0] || []).children || []
        menus.forEach(v => {
          if ((v.clientRouter || {}).path === window.location.pathname) {
            menuName = v.menuNameEn
            console.log(v)
          }
        })
        // 内容为空
        if (!firstMenu.parentName) {
          firstMenu.parentName = this.$store.getters.allMenu && this.$store.getters.allMenu[0] && this.$store.getters.allMenu[0].menuNameEn
        }
        return { menu: (firstMenu.parentName || '') + ',' + (menuName || ''), path: '/' }
      }
      return { menu: this.$store.getters.getCurrentMenuName }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.app-breadcrumb.el-breadcrumb {
  display: inline-block;
  font-size: 12px;
  line-height: 30px;
  margin-left: 5px;
  .no-redirect {
    color: #97a8be;
    cursor: text;
  }
  .el-breadcrumb__item {
    cursor: normal;
  }
}
.full {
  cursor: pointer;
  position: absolute;
  right: 20px;
  top: 0;
}
</style>
