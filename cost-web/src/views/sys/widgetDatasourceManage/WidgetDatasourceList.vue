<!-- WidgetDatasourceList -->
<template>
    <div class="app-container">
      <mt-searchform>
        <template slot="buttons">
          <el-button  icon='el-icon-plus' type='primary' @click='add'>{{$l("btn_add")}}</el-button>
        </template>

        <template slot="form">
          <el-row>
          <el-col :span="6">
            <el-form-item :label='this.$ls("lbl_widget_datasource_name")'>
              <el-input v-model="widgetDatasourceQueryModel.name"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item :label='this.$ls("lbl_widget_module_type")'>
            <fd-select v-model='widgetDatasourceQueryModel.moduleType' :placeholder="this.$l('lbl_widget_module_type')" type="sys_widget_module_type" :clearable="true"></fd-select>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item :label='this.$ls("lbl_widget_widget_type")'>
            <fd-select v-model='widgetDatasourceQueryModel.widgetType' :placeholder="this.$l('lbl_widget_widget_type')" type="sys_widget_type" :clearable="true"></fd-select>
            </el-form-item>
          </el-col>

          <el-col :span="6" class="search-btn">
            <el-form-item>
              <el-button type="info" @click='search'>{{$l("btn_search")}}</el-button>
              <el-button @click='reset'>{{$l("btn_reset")}}</el-button>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item :label='this.$ls("lbl_widget_data_type")'>
            <fd-select v-model='widgetDatasourceQueryModel.dataType' :placeholder="this.$l('lbl_widget_data_type')" type="sys_widget_data_type" :clearable="true"></fd-select>
            </el-form-item>
          </el-col>
          </el-row>
        </template>
      </mt-searchform>
        <WidgetDatasourceTable :queryObj_passed_in='widgetDatasourceQueryModel' ref='widgetDatasourceTable'></WidgetDatasourceTable>
    </div>
</template>

<script>
import WidgetDatasourceTable from '@/views/sys/widgetDatasourceManage/WidgetDatasourceTable'
export default {
  data() {
    return {
      widgetDatasourceQueryModel: {
        name: '',
        moduleType: '',
        widgetType: '',
        dataType: '',
        pageNum: 1,
        pageSize: 20,
        sortBy: 'id',
        order: -1
      },
      showForm: false

    }
  },

  components: {
    WidgetDatasourceTable
  },
  methods: {
    searchBtn() {
      this.showForm = !this.showForm
    },
    initlangQueryModel() {
      this.widgetDatasourceQueryModel.pageNum = 1
      this.widgetDatasourceQueryModel.count = 0
      this.widgetDatasourceQueryModel.sortBy = ''
      this.widgetDatasourceQueryModel.order = -1
    },
    reset() {
      this.widgetDatasourceQueryModel.name = ''
      this.widgetDatasourceQueryModel.moduleType = ''
      this.widgetDatasourceQueryModel.widgetType = ''
      this.widgetDatasourceQueryModel.status = ''
      this.widgetDatasourceQueryModel.dataType = ''
    },

    search() {
      this.initlangQueryModel()
      this.$refs.widgetDatasourceTable.getList()
    },
    add() {
      this.$router.push({ name: 'NewOrUpdateWidgetDatasource' })
    }
  }
}
</script>
