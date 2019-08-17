<template>
  <div :class="[fullScreen?'widget_fullscreen':'widget']" :style="{'border-color':selectColor}">
    <div class="widget-head" :style="{'background-color':selectColor}" @dblclick="fullScreen = !fullScreen">
      <div class="widget-head_title">{{title}}</div>
      <div class="widget-head_buttons">
        <el-dropdown @command="handleCommand" v-show="showChartChangeBar" style="color:#000">
          <span class="el-dropdown-link">
            <i class="fa fa-th-large" :title='this.$l("lbl_widget_chart")'></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="line"><i class="fa fa-line-chart" aria-hidden="true"></i>{{this.$l("lbl_widget_chart_line")}}</el-dropdown-item>
            <el-dropdown-item command="pie"><i class="fa fa-pie-chart" aria-hidden="true"></i>{{this.$l("lbl_widget_chart_pie")}}</el-dropdown-item>
            <el-dropdown-item command="bar"><i class="fa fa-bar-chart" aria-hidden="true"></i>{{this.$l("lbl_widget_chart_bar")}}</el-dropdown-item>
            <el-dropdown-item command="histogram"><i class="fa fa-bar-chart" aria-hidden="true"></i>{{this.$l("lbl_widget_chart_histogram")}}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <i class="fa fa-paint-brush" :title='this.$l("lbl_widget_color")' @click="brushClick(id)"></i>
        <i class="widget-head_buttons_colorpicker"  :id="'brush'+id" >
          <el-color-picker v-model="selectColor" @change="colorChange" :predefine="predefineColors">
          </el-color-picker>
        </i>
        <i class="fa fa-undo" :title='this.$l("lbl_widget_refresh")' v-show="refreshButtonEnable" @click="refresh"></i>
        <i class="fa fa-minus" :title='this.$l("lbl_widget_mini")' v-show="miniButtonEnable&&!miniWidgetBody" @click="miniWidgetBody = true"></i>
        <i class="fa fa-plus" :title='this.$l("lbl_widget_noraml")' v-show="miniButtonEnable&&miniWidgetBody" @click="miniWidgetBody = false"></i>
        <i class="fa fa-expand" :title='this.$l("lbl_widget_max")' v-show="fullScreenButtonEnable" @click="fullScreen = !fullScreen"></i>
        <i class="fa fa-times" :title='this.$l("lbl_widget_delete")' v-show="closeButtonEnable" @click="deleteWidget(id)"></i>
      </div>
    </div>
    <div class="widget-body" v-show="!miniWidgetBody" :style="{'overflow-y':styleObject.overflowY}">
      <slot>content</slot>
    </div>
  </div>
</template>
<script>
export default {
  name: 'fd-widgetContainer',
  props: [
    'id',
    'title',
    'color',
    'mini',
    'refreshButtonEnable',
    'miniButtonEnable',
    'fullScreenButtonEnable',
    'closeButtonEnable'
  ],
  data() {
    return {
      selectColor: '',
      showChartChangeBar: false,
      fullScreen: false,
      miniWidgetBody: false,
      predefineColors: [
        '#3C78B5',
        '#d04437',
        '#ea632b',
        '#14892c',
        '#205081',
        '#654982',
        '#707070'
      ],
      styleObject: {
        overflowY: 'scroll'
      }
    }
  },
  methods: {
    handleCommand(command) {
      // this.$message("chang chart to type: " + command);
      this.$emit('change-chart-type', { value: command })
    },
    brushClick(id) {
      console.log(id)
      document.getElementById('brush' + id).childNodes[0].childNodes[1].click()
      // document.getElementsByClassName("el-color-picker__trigger")[id].click();
    },
    colorChange: function(c) {
      this.$emit('change-prop', { key: 'color', value: c })
    },
    deleteWidget: function(id) {
      this.$emit('change-prop', { key: 'status', value: '1' }) // 0正常 1删除 2停用 3冻结
    },
    refresh: function() {
      this.$emit('refresh')
    }
  },
  computed: {
    content: function() {}
  },
  mounted: function() {
    this.selectColor = this.color
    this.miniWidgetBody = this.mini
  },
  watch: {
    miniWidgetBody: function(newValue, oldValue) {
      this.$emit('change-prop', { key: 'mini', value: newValue })
    },
    fullScreen: function(newValue, oldValue) {
      this.$emit('refresh')
    }
  }
}
</script>
<style scoped>
.widget {
  overflow: hidden;
  max-width: 800px;
  min-width: 530px;
  max-height: 400px;
  color: #000;
  border: 1px solid #ccc;
  border-radius: 4px;
  -webkit-box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
  background-color: #fff;
}
.widget_fullscreen {
  position: absolute;
  z-index: 999;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: 1px solid #ccc;
  background-color: #fff;
}
.widget-head {
  background-color: #f5f5f5;
  padding-left: 10px;
  padding-right: 10px;
  border-bottom: 1px solid transparent;
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
  border-color: #ddd;
  height: 36px;
  line-height: 36px;
  cursor: move;
}
.widget-head_title {
  float: left;
  width: 60%;
  height: 36px;
  text-align: left;
  text-indent: 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.widget-head_buttons {
  float: left;
  width: 40%;
  text-align: right;
}
.widget-head_buttons i {
  padding-right: 2px;
  cursor: pointer;
}
.widget-head_buttons_colorpicker {
  display: block;
  float: left;
  overflow: hidden;
  width: 0;
  height: 0;
}
.widget-body {
  background: #fff;
  width: 100%;
  min-height: 100px;
  max-height: 370px;
  clear: both;
  overflow: hidden;
  overflow-y: scroll;
  text-align: center;
}
</style>

