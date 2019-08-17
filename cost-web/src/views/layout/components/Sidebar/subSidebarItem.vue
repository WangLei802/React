<!-- 活动的左侧导航 -->
<template>
  <div>
    <template v-for="(item,itemIndex) in routes" v-if="!item.hidden&&item.children">
      <el-submenu v-if="item.children&&item.children.length"
      :index="uniqueKey+((item.clientRouter&&item.clientRouter.path)||itemIndex+'')"
      :key="item.menuNameEn+itemIndex">
        <template slot="title">
          <span v-if="item.menuNameEn" class="one-line" :attr="$l(item.menuNameEn)">{{$l(item.menuNameEn)}}</span>
        </template>
      <template v-for="(child,childIndex) in item.children" v-if="!child.hidden">
        <router-link v-if="!(child.children && child.children.length)" :to="{name:child.clientRouter ? child.clientRouter.name : '',params:child.params ? JSON.parse(child.params) : {}}" :key="child.menuNameEn+childIndex" v-on:click.native="send(child.menuNameEn,child)">

        <el-menu-item :index="(child.clientRouter&&child.clientRouter.path)||(itemIndex+'-'+childIndex)" >
            <span class="one-line" v-if="child.menuNameEn" :attr="$l(child.menuNameEn)" :title="$l(item.menuNameEn)">{{$l(child.menuNameEn)}}</span>
        </el-menu-item>
        </router-link>

      </template>
      </el-submenu>
      <router-link v-else :to="{name:item.clientRouter ? item.clientRouter.name : '',params:item.params ? JSON.parse(item.params) : {}}" v-on:click.native="send(item.menuNameEn,item)">

      <el-menu-item  :index="(item.clientRouter&&item.clientRouter.path)||''" :class="{'submenu-title-noDropdown':!isNest}">
          <span class="one-line" v-if="item.menuNameEn" :attr="$l(item.menuNameEn)" :title="$l(item.menuNameEn)">{{$l(item.menuNameEn)}}</span>
      </el-menu-item>
      </router-link>

    </template>
  </div>
</template>
<script>
  import { Constants, setLocalItem } from '@/utils/common/cache'
  export default {
    name: 'subSidebarItem',
    props: {
      uniqueKey: {
        type: '',
        default: 'uniqueKey'
      },
      routes: {
        type: Array
      },
      isNest: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      send(menuName, item) {
        this.$store.commit('setShowForm', false)
        setLocalItem(Constants.CURRENT_PATH, item.clientRouter.path)
        this.$store.dispatch('setCurrentMenu', { currentMenuName: menuName })
      }
    }
  }
</script>
