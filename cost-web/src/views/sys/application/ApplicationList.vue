<template>
  <div class='app-container'>
    <div class="subTitle">
      <div class="breadcrumb-child">
        <i class="fa fa-folder-open-o"></i>{{this.$l('lbl_application_list')}}</div>
      <div class="button-area">
        <el-button class="ordinary-btn" icon='el-icon-plus' type='primary' @click='add'>{{$l("btn_add")}}</el-button>
      </div>
    </div>
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item :label='this.$ls("lbl_application_name")'>
        <el-input v-model='applicationQueryModel.name' :maxlength="20" ></el-input>
      </el-form-item>
        <el-form-item :label='this.$ls("lbl_application_code")'>
        <el-input v-model='applicationQueryModel.code' :maxlength="20" ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type='primary' @click='getApplicationList'>{{$l("btn_search")}}</el-button>
        <el-button type='primary' @click='reset'>{{$l("btn_reset")}}</el-button>
      </el-form-item>
    </el-form>
    <ApplicationTable :queryObj_passed_in='applicationQueryModel' ref='applicationTable'></ApplicationTable>
  </div>
</template>
<script>
  import ApplicationTable from '@/views/sys/application/ApplicationTable'
  export default {
    components: {
      ApplicationTable
    },
    data() {
      return {
        applicationQueryModel: {
          name: '',
          code: ''
        },
        externalData: []
      }
    },
    methods: {
      reset() {
        this.applicationQueryModel.name = ''
        this.applicationQueryModel.code = ''
      },
      add() {
        this.$router.push({
          name: 'NewOrUpdateApplication'
        })
      },
      getApplicationList() {
        this.$refs.applicationTable.getList()
      }
    }
  }
</script>
<style scoped>
  @import '../../../styles/list.scss';
</style>
