<template>
    <!-- <scroll-bar ref="sliderbarHeight" v-bind:style="{height: screenHeight}"> -->
    <!-- normal Slidemenu -->
    <el-menu mode="vertical"
             unique-opened
             :collapse="false"
             v-if="isShowExpandSlider"
             :default-active="activeMenuName"
             :collapse-transition="false">
        <sidebar-item :routes="leftMenuData"
                      :collapse="sidebarOpened"></sidebar-item>
    </el-menu>
    <!-- MFX Slidemenu -->
    <el-menu mode="vertical"
             unique-opened
             :collapse="true"
             :collapse-transition="false"
             v-else>
        <div class="user"
             style="width:34px;height:34px;margin:15px auto;border-radius:35px;">
            <img :src="portrait" :onerror="errorAvatar" style="width:100%;height:100%;border-radius: 35px;"></img>
        </div>
        <NavMenu class="slider-wrapper"
                 :routes="routes"></NavMenu>
    </el-menu>

    <!-- </scroll-bar> -->
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'
import ScrollBar from '@/views/layout/components/ScrollBar'
import NavMenu from './NavMenu'

export default {
    props: {
        portrait: {
            type: String,
            default: ''
        }
    },
    components: {
        SidebarItem, ScrollBar,
        NavMenu
    },
    data () {
        return {
            errorAvatar: 'this.src="' + require('@/assets/img/avatar.png') + '"',
            isUseNavMenu: true, // 跟踪用户行为，是否使用过导航
            screenHeight: '0',
            fullHeight: document.documentElement.clientHeight,
            activeMenuName: '', // 活动的菜单
            isShowExpandSlider: false // 是否显示左侧展开的菜单
        }
    },
    computed: {
        ...mapGetters([
            'sidebar',
            'getLeftMenu'
        ]),
        routes () {
            return this.$store.getters.allMenu || []
        },
        sidebarOpened () {
            return this.$store.state.app.sidebar.opened
        },
        firstMenuStatus () {
            return this.$store.getters.getFirstMenu
        },
        leftMenu () {
            return this.$store.getters.getLeftMenu
        },
        leftMenuData () {
            // 成本特殊处理
            let leftMenuList = []
            if (this.$store.getters.getFirstMenu === 'CostManager') {
                this.routes.map(item => {
                    if (item.menuNameEn === 'CostManager') {
                        leftMenuList = item.children
                    }
                })
            } else {
                if (this.leftMenu && this.leftMenu.length) {
                    leftMenuList = this.leftMenu[0].children
                }
            }
            return leftMenuList
        }
    },
    mounted: function () {
        this.settingMenu()
        this.$nextTick(function () {
            this.settingHeight()
        })
        // window.onresize = () => {
        //   return (() => {
        //     this.fullHeight = document.documentElement.clientHeight
        //   })()
        // }
    },
    methods: {
        // 菜单配置
        settingMenu: function () {
            if (this.sidebarOpened) { // 展开状态
                this.activeMenuName = this.$store.getters.getCurrentMenuName // 左侧菜单状态
                this.topMemuId = this.$store.getters.getFirstMenu // 顶部选中状态

                if (this.topMemuId) {
                    // 顶部选中  显示左侧展开菜单  隐藏左侧收起的一级菜单
                    this.isShowExpandSlider = true
                } else {
                    // 左侧展开的菜单隐藏 并显示收起的一级菜单
                    this.isShowExpandSlider = false
                }
                if (this.activeMenuName) {
                    // 显示左侧展开的菜单 并选中
                    this.isShowExpandSlider = true
                }
            } else {
                // 顶部 底部 收起
                // 显示左侧收起的菜单
                this.isShowExpandSlider = false
            }
        },
        settingHeight: function () {
            if (this.sidebarOpened) {
                this.screenHeight = this.fullHeight - 50 + 'px'
            } else {
                this.screenHeight = this.fullHeight + 'px'
            }
        }
    },
    watch: {
        fullHeight (val) {
            this.settingHeight()
        },
        sidebarOpened (val) {
            console.log(val)
            this.settingHeight()
            this.settingMenu()
        },
        firstMenuStatus (val) {
            this.settingMenu()
        }
    }
}
</script>
