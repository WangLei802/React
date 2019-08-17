<template>
    <div>
        <transition>
            <div v-show="isOpenSlider">

                <header class="navbar"
                        mode="horizontal">
                    <div class="systemInfo">
                        <div class="logo-container"
                             @click="home">
                            <img style="height:50px"
                                 :src='logoUrl'
                                 :onerror="defaultLogo" />
                        </div>
                        <div :style="{color: fillCol}"
                             class="sys-name">{{this.$checkLocaleIsCn() ? systemNameCn : systemNameEn}}
                        </div>
                    </div>

                    <div class="setting">
                        <div class="mainMenu">
                            <el-tabs type="border-card"
                                     v-model="activeName"
                                     @tab-click="changeMenu"
                                     style="float:right">
                                <el-tab-pane v-for="item in routes"
                                             :key="item.id"
                                             :name="item.menuNameEn">
                                    <span slot="label">
                                        <i class="iconfont"
                                           :class="item.menuIcon||'icon-platformmagt'"></i>
                                        {{$checkLocaleIsCn() ? item.menuNameZh : item.menuNameEn}}</span>
                                </el-tab-pane>
                            </el-tabs>
                        </div>
                        <div class="navbar-operation"
                             :style="{color: fillCol}"
                             @click="fullScreen">
                            <i class="fa fa-arrows fa-lg"></i>
                        </div>

                        <el-dropdown class="avatar-container">

                            <div class="avatar-wrapper"
                                 :style="{color: fillCol}">
                                <img class="user-avatar"
                                     :src="portrait"
                                     :onerror="defaultPortrait" /> {{nickName}}
                            </div>

                            <el-dropdown-menu class="user-dropdown"
                                              slot="dropdown">
                                <!-- 皮肤管理 -->
                                <!-- <el-dropdown-item class="dropdown-item ">
                  <span v-if="themeSwitch" @click="changeTheme" class=""><i
                    class="iconfont icon-ico_pifu"></i>皮肤管理</span>
                </el-dropdown-item> -->

                                <!-- 语言管理 -->
                                <!-- <el-dropdown-item class="dropdown-item" divided v-if="langSwitch">
                  <span v-if="themeSwitch" @click="changeLanguage"><i class="iconfont icon-ico_yuyan"></i>语言管理</span>
                </el-dropdown-item> -->
                                <!-- 个人中心 -->
                                <router-link class="inlineBlock dropdown-item"
                                             :to='{name:"NewOrUpdateUserProfile"}'>
                                    <el-dropdown-item divided>
                                        <i class="iconfont icon-ico_gerenzhongxin"></i>{{$l("lbl_userCenter")}}
                                    </el-dropdown-item>
                                </router-link>
                                <!-- 修改密码 -->
                                <!-- <router-link class="inlineBlock dropdown-item"
                                             :to='{name:"UpdateUserPassword"}'>
                                    <el-dropdown-item divided>
                                        <i class="iconfont icon-ico_xiugaimima"></i>{{$l("lbl_changePwd")}}
                                    </el-dropdown-item>
                                </router-link> -->
                                <!-- 注销 -->
                                <el-dropdown-item divided
                                                  class="dropdown-item">
                                    <span @click="logout"
                                          style="display:block;">
                                        <i class="iconfont icon-ico_zhuxiao"></i>{{$l("btn_logout")}}</span>
                                </el-dropdown-item>

                            </el-dropdown-menu>
                        </el-dropdown>

                        <!-- 我要提问 -->
                        <div class="cctBox">
                            <a :href="href_cct"
                               target="_blank"
                               title="我要提问">
                                <img class="pic-img_cct"
                                     :src="img_cct"
                                     alt="我要提问">
                                我要提问
                            </a>
                        </div>

                        <!-- 组织 -->
                        <el-dropdown ref="orgTreeDD"
                                     trigger="click"
                                     class="selectOrgTree"
                                     v-if="langSwitch">
                            <div :style="{color: fillCol}"
                                 :title="orgTree.selectNode.text">
                                <div class="navbar_org_lable">当前组织：</div>
                                <div class="navbar_org_value"> {{orgTree.selectNode.text |cutString(16) }}</div>
                                <div class="navbar_org_icon">
                                    <i class="el-icon-arrow-down"></i>
                                </div>
                            </div>
                            <el-dropdown-menu class="user-dropdown"
                                              slot="dropdown">
                                <el-dropdown-item>
                                    <div class="orgTreeStyle">
                                        <!--  default-expand-all -->
                                        <el-tree class="filter-tree"
                                                 :data="orgTree.treeData"
                                                 accordion
                                                 node-key="id"
                                                 :props="orgTree.defaultProps"
                                                 :style="{'border':'none'}"
                                                 ref="orgTree"
                                                 default-expand-all
                                                 :default-expanded-keys="orgTree.defaultExpandedKeys"
                                                 @node-click="handleOrgTreeNodeClick">
                                            <span :title="node.label"
                                                  class="custom-tree-node"
                                                  slot-scope="{ node, data }">
                                                {{ node.label |cutString(16) }}
                                            </span>
                                        </el-tree>
                                    </div>
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>

                    </div>
                </header>

                <!-- 语言dialog -->
                <el-dialog title="切换语言"
                           :visible="isShowLanage"
                           :before-close="closeLanagePop"
                           width="500px">
                    <el-radio-group v-model="radioVal"
                                    @change="changeLocale">
                        <el-radio v-for="(item,key) in locales"
                                  :key="key"
                                  :label="item.langTypeCode">
                            {{item.langTypeLocaleDesc}}
                        </el-radio>
                    </el-radio-group>
                </el-dialog>

                <!-- 皮肤 dialog -->
                <theme-model :isHide="showModel"
                             @on-close-theme='closeTheme'></theme-model>
            </div>
        </transition>
    </div>
</template>

<script>
import { getLangTypeList } from "@/api/sys/i18nAPI";
import { getProjectTargetTree } from "@/api/cost/selectTargetCostAPI";
import { mapGetters } from "vuex";
import ThemeModel from "./ThemeModel.vue";
import {
  Constants,
  setLocalItem,
  getLocalItem,
  removeLocalItem
} from "@/utils/common/cache";
import "@/assets/css/theme/index.scss";
import "@/assets/css/theme/base.scss";
import "@/styles/iconfont/iconfont.css";
import {
  cutString // 字符截取
} from "@/filters/cost/";
import { getSSO } from "@/utils/common/sso";
import { getRootPath } from "@/utils/common/utils";
import img_cct from "@/assets/img/cct.png";
import sys_config from "@/config/config.js";
export default {
  props: {
    fillCol: {
      type: String,
      default: "#fff"
    },
    systemNameCn: {
      type: String,
      default: "系统名称"
    },
    systemNameEn: {
      type: String,
      default: "System Name"
    },
    nickName: {
      type: String,
      default: ""
    },
    portrait: {
      type: String,
      default: ""
    },
    logoUrl: {
      type: String,
      default: ""
    },
    isOpenSlider: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      img_cct: img_cct,
      href_cct: sys_config.href_cct,
      defaultLogo:
        'this.src="' + require("@/assets/img/movitech_m_blue.png") + '"',
      defaultPortrait: 'this.src="' + require("@/assets/img/avatar.png") + '"',
      showMenu: true,
      showModel: false,
      isFullScreen: false,
      locales: [],
      langSwitch: getLocalItem(Constants.LANGSWITCH) === "1",
      themeSwitch: getLocalItem(Constants.THEMESWITCH) === "1",
      isShowLanage: false,
      radioVal: getLocalItem(Constants.LOCALE) || "cn",
      activeName: getLocalItem(Constants.CURRENT_MENUID),
      orgTree: {
        treeData: [], // 组织树数据
        // 组织树配置
        defaultProps: {
          children: "children",
          label: "text"
        },
        selectNode: { text: "中梁控股" },
        defaultExpandedKeys: [] // 默认展开的当前用户orgid
      }
    };
  },
  components: {
    ThemeModel
  },
  filters: {
    cutString
  },
  computed: {
    ...mapGetters(["sidebar", "avatar", "roles"]), // todo 拿到当前登录人的角色中的部门信息
    routes() {
      try {
        return this.$store.getters.allMenu.filter(item => {
          return (
            ["数据中心", "数据交换", "经营测算"].indexOf(item.menuNameZh) < 0 &&
            item.menuNameZh !== null
          );
        });
      } catch (err) {
        return this.$store.getters.allMenu ? this.$store.getters.allMenu : [];
      }
    }
  },
  mounted: function() {
    // 初始化dashboard默认第一个
    window.initOriginPage = () => {
      let firstMenu = this.$store.getters.allMenu[0];
      if (firstMenu && firstMenu.id) {
        this.setMenu(firstMenu.id, "id");
      }
    };

    setLocalItem(Constants.CURRENT_MENUID, "CostManager");
    this.$store.dispatch("getFirstMenu");
    this.activeName = "CostManager";

    getLangTypeList()
      .then(response => {
        this.locales = response.data;
      })
      .catch(error => {
        console.log(error);
      });

    // 获取组织列表
    this.getOrgList();
    // 默认展开的当前用户部门
    // if (this.roles && this.roles.deptId) {
    //     this.orgTree.defaultExpandedKeys.push(this.roles.deptId)
    //     let node = this.$refs.orgTree.getNode(this.roles.deptId)
    //     if (node) this.selectNode = node
    // }
  },
  methods: {
    home() {
      this.$router.push({
        name: "Dashboard"
      });
    },
    logout() {
      this.$store.dispatch("LogOut").then(() => {
        window.location.href = JSON.parse(getSSO()).logoutUrl;
        // location.reload()
      });
      // 退出时清空左侧菜单缓存
      // removeLocalItem(Constants.CURRENT_MENUID)
      // removeLocalItem(Constants.LEFT_MENU)
      // // 退出清空路由缓存
      // removeLocalItem(Constants.CLIENT_ROUTERS)
      // // 清除面包屑缓存
      // removeLocalItem(Constants.CURRENT_MENUNAME)
      window.localStorage.clear();
    },
    changeLocale(locale) {
      this.$i18n.locale = locale;
      setLocalItem(Constants.LOCALE, locale);
      this.isShowLanage = false;
      window.changeTitle &&
        window.changeTitle(
          this.$checkLocaleIsCn() ? window.systemNameCn : window.systemNameEn
        );
    },
    fullScreen() {
      if (this.isFullScreen) {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
        this.isFullScreen = false;
      } else {
        let docElm = document.documentElement;
        // W3C
        if (docElm.requestFullscreen) {
          docElm.requestFullscreen();
        } else if (docElm.mozRequestFullScreen) {
          // FireFox
          docElm.mozRequestFullScreen();
        } else if (docElm.webkitRequestFullScreen) {
          // Chrome等
          docElm.webkitRequestFullScreen();
        }
        this.isFullScreen = true;
      }
    },
    changeTheme() {
      this.showModel = true;
    },
    closeTheme(isShow) {
      this.showModel = isShow;
    },
    changeLanguage() {
      this.isShowLanage = !this.isShowLanage;
    },
    closeLanagePop() {
      this.isShowLanage = !this.isShowLanage;
    },
    changeMenu(tab, event) {
      if (!tab.name) return;
      this.$store.getters.allMenu.forEach(item => {
        if (item.menuNameEn === tab.name) {
          setLocalItem(Constants.CURRENT_MENUID, tab.name);
          this.$store.dispatch("getFirstMenu");
          setLocalItem(Constants.LEFT_MENU, JSON.stringify(item));
          this.$store.dispatch("setLeftMenuObj");
        }
      });
    },
    // 获取组织结构列表
    getOrgList() {
      getProjectTargetTree()
        .then(response => {
          this.orgTree.treeData = response.data;
        })
        .catch(error => {
          console.log(error);
          this.$showError(error.message ? error.message : "msg_system_error");
        });
    },
    // 组织结构列表点击事件
    handleOrgTreeNodeClick(data) {
      console.log(data);
      this.orgTree.selectNode = data;
      this.$store.commit("SET_SELECT_ORG", data || { id: null, text: null }); // 更新状态
      this.$refs.orgTreeDD.hide(); // hide orgtree dropdown
    },
    selectModule(selectItem) {
      this.$store.getters.allMenu.forEach(item => {
        if (item.id === selectItem.id) {
          setLocalItem(Constants.LEFT_MENU, JSON.stringify(item));
          this.$store.dispatch("setLeftMenuObj");
          setLocalItem(
            Constants.CURRENT_MODULE,
            this.$checkLocaleIsCn() ? item.menuNameZh : item.menuNameEn
          );
          this.$store.dispatch("setCurrentModule", {
            currentModule: this.$checkLocaleIsCn()
              ? item.menuNameZh
              : item.menuNameEn
          });
        }
      });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "../../../assets/css/theme/base.scss";
.logo-container {
  float: left;
  border-radius: 10px;
  margin: 0 13px 0 20px;
  & > img {
    vertical-align: middle;
  }
}

.sys-name {
  font-size: 18px;
  overflow: hidden;
  white-space: nowrap;
  font-weight: bold;
}

.navbar {
  width: 100%;
  transition: height 0.28s;
  height: 50px;
  line-height: 50px;
  overflow: hidden;

  .hamburger-container {
    height: 50px;
    float: left;
    padding: 0 10px;
  }
  .screenfull {
    position: absolute;
    right: 90px;
    top: 16px;
    color: red;
  }
  .navbar-operation {
    height: 50px;
    float: right;
    width: 40px;
    margin-right: 18px;
    text-align: center;
    font-size: 14px;
    cursor: pointer;
  }
  .navbar-operation-icon {
    display: inline-block;
    width: 20px;
    padding-top: 5px;
  }
  .navbar-operation-icon .fa {
    font-size: 18px;
  }
  .dropdown-container {
    height: 50px;
    float: right;
    margin-right: 18px;
    .navbar-operation-item {
      width: 40px;
      margin-right: 8px;
      text-align: center;
      cursor: pointer;
    }
  }
  .head-portrait {
    width: 20px;
    height: 20px;
    border-radius: 10px;
    margin-top: 26px;
  }
  .avatar-container {
    float: right;
    height: 50px;
    margin-right: 20px;
    .avatar-wrapper {
      cursor: pointer;
      position: relative;
      .user-avatar {
        width: 20px;
        height: 20px;
        border-radius: 10px;
        position: relative;
        top: 5px;
      }
      .el-icon-caret-bottom {
        position: absolute;
        right: -20px;
        top: 25px;
        font-size: 12px;
      }
    }
  }
}

.inlineBlock {
  line-height: 36px;
  i {
    padding-left: 0px;
  }
}

.mainMenu {
  /*width: 500px;*/
  max-width: 840px;
  margin-right: 65px;
  float: left;
}

.systemInfo {
  width: 370px;
  overflow: hidden;
  float: left;
}

.setting {
  float: right;
}

.dropdown-item {
  overflow: hidden;
  padding-left: 0;
  padding-right: 0;
  padding-top: 0;
  border-border: 1px solid grey;
}

.dropdown-item span {
  padding-left: 0px;
  display: block;
}

i.iconfont {
  padding-right: 10px;
}

.icon-ico_gerenzhongxin {
  color: $--success-color;
}
.icon-ico_xiugaimima {
  color: $--warning-color;
}
.icon-ico_zhuxiao {
  color: $--danger-color;
}
.icon-ico_yuyan {
  color: $--blue-color;
}
.icon-ico_pifu {
  color: $--warning-color;
}

/*组织树*/
.selectOrgTree {
  float: right;
  max-width: 240px;
  margin-right: 10px;
  top: 0;
  height: 50px;
  line-height: 50px;
}
.navbar_org_lable {
  float: left;
  width: 70px;
}
.navbar_org_value {
  float: left;
  max-width: 140px;
  text-align: left;
  cursor: pointer;
}
.navbar_org_icon {
  float: left;
  width: 30px;
  text-align: center;
  cursor: pointer;
}
.orgTreeStyle {
  overflow-y: auto;
  overflow-x: scroll;
  min-width: 150px;
  height: 500px;
  background-color: #ffffff;
}
.el-tree {
  min-width: 100%;
  font-size: 14px;
  display: inline-block !important;
}
.el-dropdown-menu__item:hover {
  background: none;
}

.cctBox {
  float: right;
  color: #ffffff;
  font-size: 14px;
  margin-right: 10px;
}
.pic-img_cct {
  vertical-align: middle;
  border: none;
}
</style>

