<template>
  <div class='app-container'>
    <mt-searchform>
    <template slot="buttons">
    <el-button  icon='el-icon-plus' type='primary' @click='add'>{{$l("btn_add")}}</el-button>
    </template>
    <template slot="form">
      <el-row>
    <el-col :span="6">
    <el-form-item :label='this.$ls("lbl_application_name")'>
    <fd-applicationselect v-model="parameterQueryModel.appCode"></fd-applicationselect>
    </el-form-item>
    </el-col>

    <el-col :span="6">
    <el-form-item :label='this.$ls("lbl_parameter_name")'>
    <el-input v-model='parameterQueryModel.name' :maxlength='20'></el-input>
    </el-form-item>
    </el-col>

    <el-col :span="6">
    <el-form-item :label='this.$ls("lbl_parameter_key")'>
    <el-input v-model='parameterQueryModel.parameterKey' :maxlength='20'></el-input>
    </el-form-item>
    </el-col>

    <el-col :span="6" class="search-btn">
    <el-form-item>
    <el-button type='info' @click='queryParameterList'>{{$l("btn_search")}}</el-button>
    <el-button  @click='reset'>{{$l("btn_reset")}}</el-button>
    </el-form-item>
    </el-col>
      </el-row>
    </template>
    </mt-searchform>
    <ParameterTable :queryObj_passed_in='parameterQueryModel' ref='parameterTable'></ParameterTable>
 </div>
</template>
<script>
  import ParameterTable from '@/views/sys/parameter/ParameterTable'
  import FdApplicationselect from '../../../components/platform/ApplicationSelect/fd-applicationselect'
  export default {
    components: {
      ParameterTable,
      FdApplicationselect
    },
    data() {
      return {
        parameterQueryModel: {
          name: '',
          parameterKey: '',
          pageNum: 1,
          pageSize: 20,
          count: 0,
          appCode: ''
        },
        showForm: false
      }
    },
    methods: {
      searchBtn() {
        this.showForm = !this.showForm
      },
      reset() {
        this.parameterQueryModel.appCode = ''
        this.parameterQueryModel.key = ''
        this.parameterQueryModel.value = ''
        this.parameterQueryModel.isSystem = ''
        this.parameterQueryModel.parameterKey = ''
        this.parameterQueryModel.parameterValue = ''
      },
      initVM() {
        this.parameterQueryModel.pageNum = 1
        this.parameterQueryModel.count = 0
        this.parameterQueryModel.sortBy = ''
        this.parameterQueryModel.order = -1
      },
      add() {
        this.$router.push({
          name: 'NewOrUpdateParameter'
        })
      },
      queryParameterList() {
        this.initVM()
        this.$refs.parameterTable.getList()
      }
    },
    mounted: function() {
    }
  }
</script>
