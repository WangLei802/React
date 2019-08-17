<template>
  <div class="app-container">
    <mt-searchform>
      <template slot="buttons">
      </template>

      <template slot="form">
        <el-row>
        <el-col :span="6">
          <el-form-item :label='this.$ls("lbl_gateway_internal_route_path")'>
          <el-input v-model="queryModel.routePath"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item :label='$ls("lbl_status")'>
          <fd-select v-model="queryModel.status" type="pf_gateway_internal_status" :placeholder='$l("lbl_status")' clearable> </fd-select>
          </el-form-item>
        </el-col>

        <el-col :span="6" class="search-btn">
          <el-form-item>
            <el-button type="info" @click='search'>{{$l("btn_search")}}</el-button>
            <el-button @click='reset'>{{$l("btn_reset")}}</el-button>
          </el-form-item>
        </el-col>
        </el-row>
      </template>
    </mt-searchform>
    <GatewayExternalTable :queryObj_passed_in="queryModel" ref='gatewayExternalTable'></GatewayExternalTable>
  </div>
</template>
<script>
  import GatewayExternalTable from '@/views/platform/gateway/GatewayExternalTable'

  export default {
    components: {
      GatewayExternalTable
    },
    data() {
      return {
        queryModel: {
          routePath: '',
          status: ''
        }
      }
    },
    methods: {
      reset() {
        for (var item in this.queryModel) {
          this.queryModel[item] = ''
        }
      },
      search() {
        this.$refs.gatewayExternalTable.getList()
      }
    }
  }
</script>
<style scoped>
  @import '../../../styles/list.scss';
</style>
