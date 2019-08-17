<template>
    <div class='app-container'>
        <div class="subTitle">
            <div class="breadcrumb-child">
                <i class="fa fa-folder-open-o"></i>{{this.$l('lbl_gateway_external_detail')}}</div>
        </div>
        <el-form label-width='150px' :model="model" ref="gatewayInternalModel" :rules="rules">

          <!-- 应用 -->
          <el-form-item :label="this.$ls('lbl_gateway_internal_application')" prop="appCode">
            <fd-applicationselect v-model='model.appCode'
                                  :placeholder="this.$l('lbl_gateway_internal_application')"
                                  @change="handleSelectApplication">
            </fd-applicationselect>
          </el-form-item>


          <!-- 路由路径 -->
          <el-form-item :label='this.$ls("lbl_gateway_internal_route_path")' prop="routePath">
              <el-input v-model='model.routePath' :placeholder='this.$l("lbl_gateway_internal_route_path")'></el-input>
          </el-form-item>

          <!-- url -->
          <el-form-item label='url：' prop="url">
            <el-input v-model='model.url' placeholder='url'></el-input>
          </el-form-item>

          <!-- 认证方式 -->
          <el-form-item :label='this.$ls("lbl_gateway_external_auth_type")' prop="targetServiceType">
            <fd-select v-model='model.authType'
                      :placeholder='this.$l("lbl_gateway_external_auth_type")'
                      type="pf_gateway_external_auth_type"></fd-select>
          </el-form-item>

          <el-form-item label="Token：">
            <el-input value="SDFJLOXJLMSOUJNL"></el-input>
          </el-form-item>

          <!-- 备注信息 -->
          <el-form-item :label='this.$ls("lbl_remark")' prop="remark" >
              <el-input type='textarea' v-model='model.remark' :placeholder='this.$l("lbl_remark")'></el-input>
          </el-form-item>

          <!-- 按钮 -->
          <el-form-item>
              <el-button type='primary' @click='onSubmit("gatewayInternalModel")' v-bind:disabled="disInput">{{this.$l('btn_save')}}</el-button>
              <el-button @click='cancel'>{{this.$l('btn_cancel')}}</el-button>
          </el-form-item>
        </el-form>
    </div>
</template>
<script >
import { create, update, detail } from '@/api/platform/gatewayExternalAPI'
import { LoadingUtil } from '@/utils/common/LoadingUtil'
import { ptn } from '@/utils/common/validate'
export default {
  data() {
    var checkRoutePath = (rule, value, callback) => {
      const pattern = /\/(.+?)\//g
      const prefix = pattern.exec(value)[1]
      if (prefix !== this.externalRoutePrefix) {
        return callback(new Error(this.$l('msg_gateway_external_prefix')))
      }
    }
    return {
      model: {
        id: '',
        routePath: '',
        appCode: '',
        url: '',
        authType: '',
        status: '1',
        remark: '',
        version: ''
      },
      disInput: false,
      externalRoutePrefix: 'outer',
      isInited: false,
      rules: {
        appCode: [{ required: true, message: this.$l('msg_gateway_internal_app_code'), trigger: 'change' }],
        routePath: [
          { pattern: ptn.all_match(1, 50), message: this.$l('msg_gateway_internal_route_path'), required: true, trigger: 'blur' },
          { required: true, validator: checkRoutePath, trigger: 'blur' }
        ],
        url: [{ pattern: ptn.all_match(1, 50), message: this.$l('msg_gateway_external_url'), required: true, trigger: 'blur' }],
        remark: [{ pattern: ptn.all_match(0, 255), message: this.$l('msg_remark'), required: false, trigger: 'blur' }]
      }
    }
  },
  mounted: function() {
    this.model.id = this.$route.query.id ? this.$route.query.id : ''
    if (this.model.id !== '') {
      detail({ 'id': this.model.id }).then(response => {
        this.model = response.data
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
      LoadingUtil.showLoading()
      this.disInput = true
      if (this.model.id === '') {
        create(this.model)
          .then(response => {
            LoadingUtil.hideLoading()
            if (response.code === '2000') {
              this.toListPage()
              this.$showSuccess(response.message)
            } else {
              this.$showError(response.message)
            }
          })
          .catch(error => {
            this.disInput = false
            console.log(error)
          })
      } else {
        update(this.model)
          .then(response => {
            LoadingUtil.hideLoading()
            if (response.code === '2000') {
              this.toListPage()
              this.$showSuccess(response.message)
            } else {
              this.disInput = false
              this.$showError(response.message)
            }
          })
          .catch(error => {
            this.disInput = false
            console.log(error)
          })
      }
    },
    cancel() {
      this.toListPage()
    },
    handleSelectApplication(v) {
      this.model.routePath = '/' + this.externalRoutePrefix + '/' + this.model.appCode + '/**'
    },
    toListPage() {
      this.$router.push({
        name: 'GatewayExternalList'
      })
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
  .input-with-select .el-input-group__prepend {
    background-color: #fff;
  }
</style>
