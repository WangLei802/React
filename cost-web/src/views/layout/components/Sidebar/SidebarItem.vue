<!-- 活动的左侧导航 -->
<template>
  <el-menu unique-opened :default-active="$route.path" class="el-menu-vertical-demo">
    <template v-for="(item,itemIndex) in routes" v-if="!item.hidden&&item.children">
      <el-submenu
        v-if="item.children.length"
        :index="(item.clientRouter&&item.clientRouter.path)||itemIndex+''"
        :key="item.menuNameEn+itemIndex"
      >
        <template slot="title">
          <span
            class="one-line"
            v-if="item.menuNameEn"
            :attr="$l(item.menuNameEn)"
            :title="$l(item.menuNameEn)"
          >● {{$l(item.menuNameEn)}}</span>
        </template>
        <template v-for="(child,childIndex) in item.children" v-if="!child.hidden">
          <sub-sidebar-item
            :is-nest="true"
            v-if="child.children && child.children.length"
            :routes="[child]"
            :key="child.menuHref+childIndex"
          ></sub-sidebar-item>
          <router-link
            v-else
            :to="{name:child.clientRouter ? child.clientRouter.name : '',params:child.params ? JSON.parse(child.params) : {}}"
            :key="child.menuNameEn+childIndex"
            v-on:click.native="send(child.menuNameEn,child)"
          >
            <el-menu-item
              :index="((child.clientRouter&&child.clientRouter.path)||(itemIndex+'-'+childIndex))+(child.params||'')"
            >
              <span
                v-if="child.menuNameEn"
                class="one-line"
                :attr="$l(child.menuNameEn)"
                :title="$l(child.menuNameEn)"
              >
                <!-- <template v-if="childIndex!==item.children.length-1">├─</template>
                <template v-if="childIndex===item.children.length-1">└─</template>-->
                ○ {{$l(child.menuNameEn)}}
              </span>
            </el-menu-item>
          </router-link>
        </template>
      </el-submenu>
      <router-link
        v-else
        :to="{name:item.clientRouter ? item.clientRouter.name : '',params:item.params ? JSON.parse(item.params) : {}}"
        v-on:click.native="send(item.menuNameEn,item)"
      >
        <el-menu-item
          :index="((item.clientRouter&&item.clientRouter.path)||'')+(item.params||'')"
          :class="{'submenu-title-noDropdown':!isNest}"
        >
          <span
            v-if="item.menuNameEn"
            :attr="$l(item.menuNameEn)"
            :title="$l(item.menuNameEn)"
          >{{$l(item.menuNameEn)}}</span>
        </el-menu-item>
      </router-link>
    </template>
  </el-menu>
</template>
<script>
import { Constants, setLocalItem } from '@/utils/common/cache'
import subSidebarItem from './subSidebarItem'
export default {
  name: 'SidebarItem',
  components: {
    subSidebarItem
  },
  props: {
    routes: {
      type: Array
    },
    isNest: {
      type: Boolean,
      default: false
    },
    collapse: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    send (menuName, item) {
      this.$store.commit('setShowForm', false)
      setLocalItem(Constants.CURRENT_PATH, item.clientRouter.path)
      this.$store.dispatch('setCurrentMenu', { currentMenuName: menuName })
    }
  }
}
</script>
<style>
</style>
