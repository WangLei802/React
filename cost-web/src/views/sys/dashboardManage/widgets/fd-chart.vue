<template>
    <div>
        <component :is="chartType" :data="chartData" :width="chartWidth" :height="chartHeight"></component>
    </div>
</template>
<script>
var CHART_TYPES = {
  line: 'line', // 折线图
  bar: 'bar', // 条形图
  histogram: 'histogram', // 柱状图
  pie: 'pie', // 饼图

  define: 'define', // 自定义

  table: 'table'// 自定义
}
import VeLine from 'v-charts/lib/line'
import VePie from 'v-charts/lib/pie'
import VeBar from 'v-charts/lib/bar'
import VeHistogram from 'v-charts/lib/histogram'
import fdDefine from './fd-define'
import fdTable from './fd-table'

export default {
  name: 'fd-chart',
  props: ['type', 'data', 'width', 'height'],
  data() {
    return {

    }
  },
  computed: {
    chartType: function() {
      var _type = ''
      switch (this.type) {
        case CHART_TYPES.line:
          //
          _type = 've-' + CHART_TYPES.line
          break
        case CHART_TYPES.bar:
          //
          _type = 've-' + CHART_TYPES.bar
          break
        case CHART_TYPES.histogram:
          //
          _type = 've-' + CHART_TYPES.histogram
          break
        case CHART_TYPES.pie:
          //
          _type = 've-' + CHART_TYPES.pie
          break
        case CHART_TYPES.define:
          //
          _type = 'fd-define'
          break
        case CHART_TYPES.table:
          //
          _type = 'fd-table'
          break
        default:
          //
          _type = 've-' + CHART_TYPES.line
          break
      }
      return _type
    },
    chartData: function() {
      return this.data
    },
    chartWidth: function() {
      let _w = 300
      _w = this.width ? this.width : 300
      return _w + 'px'
    },
    chartHeight: function() {
      let _h = 400
      _h = this.height ? this.height : 400
      return _h + 'px'
    }
  },
  components: {
    VeLine,
    VePie,
    VeBar,
    VeHistogram,
    fdDefine,
    fdTable
  }
}
</script>

