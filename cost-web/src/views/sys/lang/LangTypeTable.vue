<template>
  <div ref="langTypeTable">
    <el-table :data="tableData" stripe border  style="width: 100%" >
      <el-table-column type="index" :index="this.$getTableIndex(this.queryObj)" :label="this.$l('lbl_no')" width="80"></el-table-column>
      <el-table-column prop="langTypeCode" :label="this.$l('lbl_lang_type')"></el-table-column>
      <el-table-column prop="langTypeDesc" :label="this.$l('lbl_description')"></el-table-column>
      <el-table-column prop="langTypeLocaleDesc" :label="this.$l('lbl_locale')"></el-table-column>

      <el-table-column prop="status" width="200" :label="this.$l('lbl_status')">
        <template slot-scope="scope">
          <fd-label :code="scope.row.status" type="sys_lang_tye_status"></fd-label>
        </template>
      </el-table-column>
      <el-table-column prop="isDefault" width="200" :label="this.$l('lbl_default')">
        <template slot-scope="scope">
          <fd-label :code="scope.row.isDefault" type="sys_yes_no"></fd-label>
        </template>
      </el-table-column>

      <el-table-column prop="remark" :label="this.$l('lbl_remark')"></el-table-column>

      <el-table-column width="120" :label="this.$l('lbl_operation')">
          <template slot-scope="scope">
              <el-button type="text"  :icon="scope.row.status == '0' ? 'el-icon-remove-outline' : 'el-icon-circle-check'" :title=" scope.row.status == '0' ? $l('btn_disable') : $l('btn_enable')" @click="deActiveHandle(scope.$index, scope.row)"></el-button>

              <el-button type="text"  :icon="scope.row.isDefault == '1' ? 'el-icon-star-on' : 'el-icon-star-off'" :title="scope.row.isDefault == '1' ? $l('btn_default') : $l('btn_set_default')" @click="setDefault(scope.$index, scope.row)"></el-button>
          </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import {
  searchLangTypeList,
  activeLangType,
  deActiveLangType,
  setDefaultLangType
} from '@/api/sys/i18nAPI'

import Vue from 'vue'
export default {
  props: {
    queryObj_passed_in: {
      type: Object
    },
    externalData: {
      type: Array,
      default: function() {
        return []
      }
    }
  },
  data() {
    return {
      tableData: [],
      queryObj: this.queryObj_passed_in,
      tableHeight: '0',
      fullHeight: document.documentElement.clientHeight
    }
  },
  methods: {
    getList() {
      searchLangTypeList(this.queryObj)
        .then(response => {
          this.tableData = response.data
        })
        .catch(error => {
          console.log(error)
        })
    },
    deActiveHandle: function(index, row) {
      const that = this
      console.log(row)
      // 禁用
      if (row.status == '1') {
        deActiveLangType(row.id)
          .then(response => {
            that.getList()
          })
          .catch(error => {
            console.log(error)
          })
      } else {
        activeLangType(row.id)
          .then(response => {
            that.getList()
          })
          .catch(error => {
            console.log(error)
          })
      }
      return
    },
    setDefault(index, row) {
      const that = this
      setDefaultLangType(row.id)
        .then(response => {
          that.getList()
        })
        .catch(error => {
          console.log(error)
        })
    },
    settingTableHeight: function() {
      const topHeight = this.$refs['langTypeTable'].getBoundingClientRect().top
      this.tableHeight = this.fullHeight - topHeight - 80
      this.$refs['langTypeTable'].style.Height = this.tableHeight + 'px'
    }
  },
  mounted: function() {
    this.getList()
    this.$nextTick(function() {
      this.settingTableHeight()
    })
    // window.onresize = () => {
    //   return (() => {
    //     this.fullHeight = document.documentElement.clientHeight
    //   })()
    // }
  },
  watch: {
    fullHeight(val) {
      this.settingTableHeight()
    }
  }
}
</script>
