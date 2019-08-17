<!-- 左侧默认所有导航 -->
<template>
  <div>
    <template v-for="(item,itemIndex) in routes" v-if="!item.hidden&&item.children">

      <router-link v-if="item.children.length===1 && !item.children[0].children" :to="item.menuHref+'/'+item.menuHref" :key="item.menuNameEn+itemIndex">

        <el-menu-item :index="item.menuNameEn" :class="{'submenu-title-noDropdown':!isNest}">
          <div v-if="item.treeLevel == 1" class="iconfont" :class="item.children[0].menuIcon||'icon-platformmagt'"></div>
          <span v-if="item.children[0].menuNameEn">{{$l(item.children[0].menuNameEn)}}</span>
        </el-menu-item>
      </router-link>

      <el-submenu v-else :index="item.menuNameEn">
        <template slot="title">
          <div v-if="item.treeLevel == 1" class="iconfont" :class="item.menuIcon||'icon-platformmagt'"></div>
          <span v-if="item.menuNameEn">{{$l(item.menuNameEn)}}</span>
        </template>

        <template v-for="(child,childIndex) in item.children" v-if="!child.hidden">

          <sidebar-item :is-nest="true"  v-if="child.children&&child.children.length>0" :routes="[child]" :key="child.menuHref+childIndex"></sidebar-item>

          <router-link v-else :to="{name:child.clientRouter ? child.clientRouter.name : '',params:child.params ? {} : {}}" :key="child.menuNameEn+childIndex" v-on:click.native="send(child.menuNameEn)">

            <el-menu-item :index="child.menuNameEn">
              <span v-if="child.menuNameEn">{{$l(child.menuNameEn)}}</span>
            </el-menu-item>
          </router-link>
        </template>
      </el-submenu>

    </template>
  </div>

</template>

<script>
export default {
  name: 'SidebarItem',
  components: {},

  props: {
    routes: {
      type: Array
    },
    isNest: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    send(menuName) {
      this.$store.dispatch('setCurrentMenu', { currentMenuName: menuName })
    }
  }
}

</script>
<style lang='scss' scoped>
.slider-wrapper{
  width: 54px;
}
</style>
