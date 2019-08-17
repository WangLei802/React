<template>
    <div class='app-container'>
      <mt-searchform>
        <template slot="buttons">
          <el-button icon='el-icon-plus' type='primary' @click='add'>{{$l("btn_add")}}</el-button>
        </template>

        <template slot="form">
          <el-row>
          <el-col :span="6">
            <el-form-item :label='this.$ls("lbl_application_name")'>
            <el-input v-model='appModuleQueryModel.appName' :maxlength='20'></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item :label='this.$ls("lbl_application_code")'>
            <el-input v-model='appModuleQueryModel.appCode' :maxlength='20'></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item :label='this.$ls("lbl_application_module_name")'>
            <el-input v-model='appModuleQueryModel.name' :maxlength='20'></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="6" class="search-btn">
            <el-form-item>
            <el-button type='info' @click='queryAppModuleList'>{{$l("btn_search")}}</el-button>
            <el-button  @click='reset'>{{$l("btn_reset")}}</el-button>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item :label='this.$ls("lbl_application_module_code")'>
            <el-input v-model='appModuleQueryModel.code' :maxlength='20'></el-input>
            </el-form-item>
          </el-col>

            <el-col :span="6">
              <el-form-item :label='$ls("lbl_app_type")'>
                <fd-select v-model="appModuleQueryModel.appType" type="pf_app_type" :placeholder='$l("lbl_app_type")' clearable> </fd-select>
              </el-form-item>
            </el-col>

          </el-row>
        </template>
      </mt-searchform>
        <appModuleTable :queryObj_passed_in='appModuleQueryModel' ref='appModuleTable'></appModuleTable>
    </div>
</template>
<script>
import appModuleTable from '@/views/platform/applicationModule/AppModuleTable'
import FdApplicationSelect from '@/components/platform/ApplicationSelect/fd-applicationselect'
export default {
  components: {
    appModuleTable, FdApplicationSelect
  },
  data() {
    return {
      appModuleQueryModel: {
        appName: '',
        appCode: '',
        name: '',
        code: '',
        remark: '',
        count: 0,
        pageSize: 10,
        pageNum: 1
      }
    }
  },
  methods: {
    getValue(item) {
      this.appModuleQueryModel.appName = item === undefined ? '' : item.name
    },
    reset() {
      this.appModuleQueryModel.appName = ''
      this.appModuleQueryModel.appCode = ''
      this.appModuleQueryModel.name = ''
      this.appModuleQueryModel.code = ''
    },
    initVM() {
      this.appModuleQueryModel.pageNum = 1
      this.appModuleQueryModel.count = 0
      this.appModuleQueryModel.sortBy = ''
      this.appModuleQueryModel.order = -1
    },
    add() {
      this.$router.push({
        name: 'NewOrUpdateAppModule'
      })
    },
    queryAppModuleList() {
      this.$refs.appModuleTable.getList()
    }

  },
  mounted: function() {
  }
}
</script>
<style scoped>
@import '../../../styles/list.scss';
</style>
