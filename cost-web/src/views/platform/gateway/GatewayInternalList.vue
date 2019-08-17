<template>
    <div class='app-container'>
      <mt-searchform>
        <template slot="buttons">
          <el-button icon='el-icon-plus' type='primary' @click='add'>{{$l("btn_add")}}</el-button>
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
        <GatewayInternalTable :queryObj_passed_in='queryModel' ref='gatewayInternalTable'></GatewayInternalTable>
    </div>
</template>
<script>
import GatewayInternalTable from '@/views/platform/gateway/GatewayInternalTable'
export default {
  components: {
    GatewayInternalTable
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
      this.queryModel.routePath = ''
      this.queryModel.status = ''
    },
    search() {
      this.$refs.gatewayInternalTable.getList()
    },
    add() {
      this.$router.push({ name: 'NewOrUpdateGatewayInternal' })
    }
  }
}
</script>
<style scoped>
@import '../../../styles/list.scss';
</style>

