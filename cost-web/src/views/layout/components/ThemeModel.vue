<template>
  <el-dialog title="切换主题" :visible="isHide" :before-close="closeModel" width="500px">
    <div class="theme-model-p">
      <div class="theme-item-sample" @click="checkedTheme('4DA1FF')">
        <div class="theme-item-pic">
          <div class="theme-item-header" style="background: #409eff"></div>
          <div class="theme-item-sidebar" style="background-color: #e3e7ec"></div>
        </div>
        <div class="theme-item-text">绿</div>
      </div>
      <div class="theme-item-sample" @click="checkedTheme('00a597')">
        <div class="theme-item-pic">
          <div class="theme-item-header" style="background-color: #00a597"></div>
          <div class="theme-item-sidebar" style="background-color: #e3e7ec"></div>
        </div>
        <div class="theme-item-text">墨</div>
      </div>
      <div class="theme-item-sample" @click="checkedTheme('67c23a')">
        <div class="theme-item-pic">
          <div class="theme-item-header" style="background-color: #67c23a"></div>
          <div class="theme-item-sidebar" style="background-color: #e3e7ec"></div>
        </div>
        <div class="theme-item-text">绿</div>
      </div>
      <div class="theme-item-sample" @click="checkedTheme('909399')">
        <div class="theme-item-pic">
          <div class="theme-item-header" style="background-color: #909399"></div>
          <div class="theme-item-sidebar" style="background-color: #e3e7ec"></div>
        </div>
        <div class="theme-item-text">灰</div>
      </div>
      <div class="theme-item-sample" @click="checkedTheme('f56c6c')">
        <div class="theme-item-pic">
          <div class="theme-item-header" style="background-color: #f56c6c"></div>
          <div class="theme-item-sidebar" style="background-color: #e3e7ec"></div>
        </div>
        <div class="theme-item-text">红</div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { setLocalItem, Constants } from '@/utils/common/cache'

export default {
  name: 'ThemeModel',
  data() {
    return {
      selectThemeColor: ''
    }
  },
  props: {
    isHide: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    themecolor: {
      get() {
        return this.$store.state.themecolor
      },
      set(val) {
        this.$store.commit('setThemeColor', val)
      }
    }
  },
  methods: {
    closeModel() {
      this.$emit('on-close-theme', false)
    },
    checkedTheme(val) {
      this.closeModel()
      this.$store.state.themecolor = 'custom-' + val
      setLocalItem(Constants.Theme_Color, 'custom-' + val)
    }
  }
}
</script>

<style scoped>
  .theme-model-p{
    overflow: hidden;
  }
  .theme-model-p .theme-item-sample{
    width: 33.33%;
    box-sizing: border-box;
    padding: 5px;
    float: left;
    cursor: pointer;
  }
  .theme-model-p .theme-item-pic{
    height: 52px;
    background-color: #F4F5F7;
  }
  .theme-model-p .theme-item-text{
    text-align: center;
    padding: 3px;
  }
  .theme-model-p .theme-item-header{
    height: 20%;
  }
  .theme-model-p .theme-item-sidebar{
    height: 80%;
    width: 20%;
  }
</style>
