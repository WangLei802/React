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
          <el-input v-model='applicationQueryModel.name'  :maxlength="50" ></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item :label='this.$ls("lbl_application_code")'>
          <el-input v-model='applicationQueryModel.code' :maxlength="50" ></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="6" class="search-btn">
          <el-form-item>
          <el-button type='info' @click='getApplicationList'>{{$l("btn_search")}}</el-button>
          <el-button  @click='reset'>{{$l("btn_reset")}}</el-button>
          </el-form-item>
        </el-col>
        </el-row>
      </template>
    </mt-searchform>
    <ApplicationTable :queryObj_passed_in='applicationQueryModel' ref='applicationTable'></ApplicationTable>
  </div>
</template>
<script>
  import ApplicationTable from '@/views/platform/application/ApplicationTable'
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
