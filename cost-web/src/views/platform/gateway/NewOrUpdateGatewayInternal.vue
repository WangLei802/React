<template>
  <div>
    <el-row>
      <el-form :model="gatewayInternalModel" status-icon :rules='rules' ref="gatewayInternalModel" label-width='150px'>

        <el-col :span="12">
          <el-form-item :label="this.$ls('lbl_gateway_internal_application')" prop="appCode">
          <fd-applicationselect v-model='gatewayInternalModel.appCode'
          :placeholder="this.$l('lbl_gateway_internal_application')"
          @change="handleSelectApplication">
          </fd-applicationselect>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label='this.$ls("lbl_app_type")' prop="targetServiceType">
            <fd-radio v-model='gatewayInternalModel.appType'
                      :placeholder='this.$l("lbl_gateway_internal_service_type")'
                      type="pf_app_type"></fd-radio>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label='this.$ls("lbl_gateway_internal_route_prefix")' prop="routePrefix">
          <el-input v-model='gatewayInternalModel.routePrefix'
          :placeholder='this.$l("lbl_gateway_internal_route_prefix")'
          @input="handleInput"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item :label='this.$ls("lbl_gateway_internal_route_path")' prop="routePath">
          <el-input v-model='gatewayInternalModel.routePath' :placeholder='this.$l("lbl_gateway_internal_route_path")'></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item :label='this.$ls("lbl_gateway_internal_service_type")' prop="targetServiceType">
          <fd-radio v-model='gatewayInternalModel.targetServiceType'
          :placeholder='this.$l("lbl_gateway_internal_service_type")'
          type="pf_gateway_internal_service_type"></fd-radio>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item :label='this.$ls("lbl_gateway_internal_target_service")' prop="targetServiceAddress">
          <el-tooltip class="item" effect="light" content="输入示例：url（http://localhost:8080）或者服务名称（service-name）" placement="right">
          <el-input v-model='gatewayInternalModel.targetServiceAddress' :placeholder='this.$l("lbl_gateway_internal_target_service")'></el-input>
          </el-tooltip>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item :label='this.$ls("lbl_remark")' prop="remark" >
          <el-input type='textarea' v-model='gatewayInternalModel.remark' :placeholder='this.$l("lbl_remark")'></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24" class="detail-button-box">
          <el-button type='primary' @click='onSubmit("gatewayInternalModel")' v-bind:disabled="disInput">{{this.$l('btn_save')}}</el-button>
          <el-button @click='cancel'>{{this.$l('btn_back')}}</el-button>
        </el-col>
      </el-form>
    </el-row>
  </div>
</template>
<script >
import { saveGatewayInternal, updateGatewayInternal, getGatewayInternalDetail, refreshGateway} from '@/api/platform/gatewayInternalAPI'
import { LoadingUtil } from '@/utils/common/LoadingUtil'
import { ptn } from '@/utils/common/validate'
export default {
  data() {
    var checkRoutePath = (rule, value, callback) => {
      const pattern = /\/(.+?)\//g
      const prefix = pattern.exec(value)[1]
      if (prefix !== this.internalRoutePrefix) {
        return callback(new Error(this.$l('msg_gateway_internal_prefix')))
      }
      if (value.slice(0, value.indexOf('/**')) !== this.gatewayInternalModel.routePrefix) {
        return callback(new Error(this.$l('msg_gateway_internal_prefix_path')))
      }
    }
    return {
      gatewayInternalModel: {
        id: '',
        routePath: '',
        appCode: '',
        targetServiceType: 'standalone',
        routePrefix: '',
        targetServiceAddress: '',
        status: '1',
        appType: '1',
        remark: '',
        version: ''
      },
      disInput: false,
      internalRoutePrefix: 'inner',
      isInited: false,
      rules: {
        appCode: [{ required: true, message: this.$l('msg_gateway_internal_app_code'), trigger: 'change' }],
        targetServiceType: [{ required: true, message: this.$l('msg_gateway_internal_service_type') }],
        routePrefix: [{ required: true, message: this.$l('msg_gateway_internal_route_prefix'), trigger: 'blur' }],
        routePath: [
          { pattern: ptn.all_match(1, 50), message: this.$l('msg_gateway_internal_route_path'), required: true, trigger: 'blur' },
          // { required: true, validator: checkRoutePath, trigger: 'blur' }
        ],
        targetServiceAddress: [
          { pattern: ptn.all_match(1, 50), message: this.$l('msg_gateway_internal_target_service'), required: true, trigger: 'blur' }
        ],
        remark: [{ pattern: ptn.all_match(0, 255), message: this.$l('msg_remark'), required: false, trigger: 'blur' }]
      }
    }
  },
  mounted: function() {
    this.gatewayInternalModel.id = this.$route.query.id ? this.$route.query.id : ''
    if (this.gatewayInternalModel.id !== '') {
      getGatewayInternalDetail({ 'id': this.gatewayInternalModel.id }).then(response => {
        this.gatewayInternalModel = response.data
      }).catch(error => {
        console.log(error)
      })
    } else {
      this.isInited = true
    }
  },
  methods: {
    onSubmit(formName) {
      var validateResult = true
      this.$refs[formName].validate((valid) => {
        if (!valid) {
          validateResult = false
        }
      })
      if (!validateResult) {
        return
      }
      this.disInput = true
      LoadingUtil.showLoading()
      if (this.gatewayInternalModel.id === '') {
        saveGatewayInternal(this.gatewayInternalModel)
          .then(response => {
            LoadingUtil.hideLoading()
            this.disInput = false
            if (response.code === '2000') {
              this.$router.push({
                name: 'GatewayInternalList'
              })
              this.$showSuccess(response.message)
              this.refreshGatewayInternal()
            } else {
              this.$showError(response.message)
            }
          })
          .catch(error => {
            LoadingUtil.hideLoading()
            this.disInput = false
            console.log(error)
          })
      } else {
        updateGatewayInternal(this.gatewayInternalModel)
          .then(response => {
            LoadingUtil.hideLoading()
            this.disInput = false
            if (response.code === '2000') {
              this.$router.push({
                name: 'GatewayInternalList'
              })
              this.$showSuccess(response.message)
              this.refreshGatewayInternal()
            } else {
              this.$showError(response.message)
            }
          })
          .catch(error => {
            LoadingUtil.hideLoading()
            this.disInput = false
            console.log(error)
          })
      }
    },
    /**
     * 刷新网关路由
     */
    refreshGatewayInternal() {
      refreshGateway().then(response => {
        console.log(response)
      }).catch(error => {
        console.log(error)
      })
    },
    cancel() {
      this.$router.push({
        name: 'GatewayInternalList'
      })
    },
    handleSelectApplication(v) {
      this.gatewayInternalModel.routePrefix = '/' + this.internalRoutePrefix + '/' + v.code
      this.gatewayInternalModel.routePath = this.gatewayInternalModel.routePrefix + '/**'
    },
    handleInput() {
      this.gatewayInternalModel.routePath = this.gatewayInternalModel.routePrefix + '/**'
    }
  }
}
</script>

<style scoped>
  @import '../../../styles/detail.scss';
</style>
<style>
  .el-tooltip__popper[x-placement^=right].is-light {
    border-color: #ddd;
    color: #aaa;
  }
</style>
