<!-- WidgetList -->
<template>
  <div class="app-container">
    <mt-searchform>
      <template slot="buttons">
        <el-button  icon='el-icon-plus' type='primary' @click='add'>{{$l("btn_add")}}</el-button>
      </template>

      <template slot="form">
        <el-row>
        <el-col :span="6">
          <el-form-item :label='this.$ls("lbl_widget_name")'>
          <el-input v-model="widgetQueryModel.name" :placeholder="this.$l('lbl_widget_name')"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item :label='this.$ls("lbl_widget_module_type")'>
          <fd-select v-model='widgetQueryModel.moduleType' type="sys_widget_module_type" :placeholder="this.$l('lbl_widget_module_type')" :clearable="true"></fd-select>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item :label='this.$ls("lbl_widget_widget_type")'>
          <fd-select v-model='widgetQueryModel.widgetType' type="sys_widget_type" :placeholder="this.$l('lbl_widget_widget_type')" :clearable="true"></fd-select>
          </el-form-item>
        </el-col>

        <el-col :span="6" class="search-btn">
          <el-form-item>
            <el-button type="info" @click='search'>{{$l("btn_search")}}</el-button>
            <el-button @click='reset'>{{$l("btn_reset")}}</el-button>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item :label='this.$ls("lbl_status")'>
          <fd-select v-model='widgetQueryModel.status' type="sys_widget_status" :placeholder="this.$l('lbl_status')" :clearable="true"></fd-select>
          </el-form-item>
        </el-col>
        </el-row>
      </template>
    </mt-searchform>
    <WidgetTable :queryObj_passed_in='widgetQueryModel' ref='widgetTable'></WidgetTable>
  </div>
</template>

<script>
import WidgetTable from '@/views/sys/widgetManage/WidgetTable'
export default {
  data() {
    return {
      widgetQueryModel: {
        name: '',
        moduleType: '',
        widgetType: '',
        status: '',
        pageNum: 1,
        pageSize: 20,
        sortBy: 'id',
        order: -1
      },
      showForm: false
      // options_1: [
      //   { dictValue: "", dictLabel: "" },
      //   { dictValue: "0", dictLabel: "全局" },
      //   { dictValue: "1", dictLabel: "成本" }
      // ],
      // options_2: [
      //   { dictValue: "", dictLabel: "" },
      //   { dictValue: "0", dictLabel: "pie" },
      //   { dictValue: "1", dictLabel: "line" },
      //   { dictValue: "2", dictLabel: "bar" },
      //   { dictValue: "3", dictLabel: "histogram" },
      //   { dictValue: "4", dictLabel: "table" },
      //   { dictValue: "5", dictLabel: "define" }
      // ],
      // options_3: [
      //   { dictValue: "", dictLabel: "" },
      //   { dictValue: "0", dictLabel: "正常" },
      //   { dictValue: "1", dictLabel: "停用" },
      //   { dictValue: "2", dictLabel: "删除" },
      //   { dictValue: "3", dictLabel: "冻结" }
      // ]
    }
  },

  components: {
    WidgetTable
  },
  methods: {
    initlangQueryModel() {
      this.widgetQueryModel.pageNum = 1
      this.widgetQueryModel.count = 0
      this.widgetQueryModel.sortBy = ''
      this.widgetQueryModel.order = -1
    },
    reset() {
      this.widgetQueryModel.name = ''
      this.widgetQueryModel.moduleType = ''
      this.widgetQueryModel.widgetType = ''
      this.widgetQueryModel.status = ''
    },
    searchBtn() {
      this.showForm = !this.showForm
    },
    search() {
      this.initlangQueryModel()
      this.$refs.widgetTable.getList()
    },
    add() {
      this.$router.push({ name: 'NewOrUpdateWidget' })
    }
  }
}
</script>
