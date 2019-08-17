<template>
  <div>
    <div v-if="widgetDataError" class="widgetDataError">{{widgetDataErrorMsg}}</div>
    <component v-if="!widgetDataError" :is="chartType" :data="chartData?chartData:chartAJAXData " :width="chartWidth" :height="chartHeight"></component>
  </div>
</template>
<script>
var CHART_TYPES = {
  line: 'line', // 折线图
  bar: 'bar', // 条形图
  histogram: 'histogram', // 柱状图
  pie: 'pie', // 饼图
  define: 'define', // 自定义
  table: 'table' // 自定义
}
import VeLine from 'v-charts/lib/line'
import VePie from 'v-charts/lib/pie'
import VeBar from 'v-charts/lib/bar'
import VeHistogram from 'v-charts/lib/histogram'
import fdDefine from './fd-define'
import fdTable from './fd-table'
import { get } from '@/utils/sys/http'

export default {
  name: 'fd-widget',
  props: ['type', 'dataType', 'data', 'width', 'height'],
  data() {
    return {
      widgetDataError: false,
      widgetDataErrorMsg: '',
      chartAJAXData: null
    }
  },
  mounted() {
    if (['pie', 'bar', 'line', 'histogram'].indexOf(this.type) > -1) {
      this.$parent.styleObject.overflowY = 'hidden'
    } else {
      this.$parent.styleObject.overflowY = 'auto'
    }
  },
  methods: {
    removeTag(JSONString) {
      if (!JSONString) return JSONString
      return JSONString.replace(/(\/t\/n)|(\/n)|(\/t)/g, '')
    },
    checkChartData(data) {
      let valiable = true
      let _this = this
      if (['pie', 'bar', 'line', 'histogram'].indexOf(this.type) > -1) {
        _this.$parent.showChartChangeBar = true
        // v-charts
        if (!data.hasOwnProperty('columns') || !data.hasOwnProperty('rows')) {
          this.widgetDataError = true
          this.widgetDataErrorMsg = '图表数据异常'
          valiable = false
        }
      } else if (this.type === CHART_TYPES.table) {
        // table
        if (!data.hasOwnProperty('header') || !data.hasOwnProperty('data')) {
          this.widgetDataError = true
          this.widgetDataErrorMsg = '表格数据异常'
          valiable = false
        }
      } else if (this.type === CHART_TYPES.define) {
        // 自定义
      } else {
        this.widgetDataError = true
        this.widgetDataErrorMsg = '该组件数据异常'
        valiable = false
      }
      return valiable
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
    chartWidth: function() {
      let _w = 300
      _w = this.width ? this.width : '100%'
      return _w + 'px'
    },
    chartHeight: function() {
      let _h = 400
      _h = this.height ? this.height : '100%'
      if (['pie', 'bar', 'line', 'histogram'].indexOf(this.type) > -1) _h = 400
      return _h + 'px'
    },
    chartData: function() {
      let _rt
      let _this = this
      if (_this.dataType !== '3') {
        if (_this.dataType === '2') {
          let _removeTag = this.removeTag(_this.data)
          let _pData = JSON.parse(_removeTag)
          if (_this.checkChartData(_pData)) _rt = _pData
        } else {
          if (_this.checkChartData(_this.data)) _rt = _this.data
        }
        return _rt
      } else {
        let _this = this
        get(_this.data, {},'')
          .then(function(d) {
            if (_this.checkChartData(d.data)){
              _rt = d.data
              _this.chartAJAXData =  _rt
            }
          })
          .catch(error => {
            console.log(error)
            _this.widgetDataError = true
            _this.widgetDataErrorMsg = this.$l('msg_widget_interface_err')
          })
      }

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
<style scoped>
.widgetDataError {
  color: brown;
}
</style>


