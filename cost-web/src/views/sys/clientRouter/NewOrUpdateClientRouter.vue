<template>
  <div>
    <el-row>
      <el-form :model="clientRouter" status-icon :rules='clientRouterRule' ref="clientRouter" label-width='150px'>

        <el-col :span="12">
          <el-form-item :label="this.$ls('lbl_client_router_superior_routing')" prop="parentName">
          <el-input v-model='clientRouter.parentName' :disabled="true" placeholder=''></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item :label="this.$ls('lbl_application_name')" >
          <fd-applicationselect :disabled="appDisabled"  v-model="clientRouter.appCode"></fd-applicationselect>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item :label="this.$ls('lbl_client_router_name')" prop="name">
          <el-input v-model='clientRouter.name' placeholder='' ></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item :label="this.$ls('lbl_client_router_path')" prop="path">
          <el-input v-model='clientRouter.path' placeholder=''></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="this.$ls('lbl_client_router_component')" prop="component">
          <el-input v-model='clientRouter.component' placeholder=''></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="this.$ls('lbl_client_router_props')" prop="props">
          <fd-radio  v-model='clientRouter.props' placeholder='' type="sys_yes_no" ></fd-radio>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="this.$ls('lbl_client_router_redirect')" prop="redirect">
          <el-input v-model='clientRouter.redirect' placeholder=''></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item :label='this.$ls("lbl_remark")' prop="remark">
          <el-input type='textarea' v-model='clientRouter.remark' :placeholder='this.$l("lbl_remark")' :maxlength="200"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="24" class="detail-button-box">
          <el-button type='primary' @click='onSubmit("clientRouter")' v-bind:disabled="disInput">{{this.$l('btn_save')}}</el-button>
          <el-button @click='cancel'>{{this.$l('btn_back')}}</el-button>
        </el-col>
      </el-form>
    </el-row>
  </div>
</template>
<script >
  import { saveClientRouter, getClientRouterDetail, updateClientRouter } from '@/api/platform/clientRouterAPI'
  import { LoadingUtil } from '@/utils/common/LoadingUtil'
  import { ptn } from '@/utils/common/validate'
  import FdApplicationselect from '../../../components/platform/ApplicationSelect/fd-applicationselect'
  export default {
    components: {
      FdApplicationselect
    },
    data() {
      return {
        clientRouter: {
          id: '',
          name: '',
          path: '',
          component: '',
          props: '1',
          redirect: '',
          remark: '',
          version: '',
          appCode: '',
          parentId: '',
          parentName: ''
        },
        disInput: false,
        appDisabled: false,
        clientRouterRule: {
          name: [{ pattern: ptn.en_num(3, 50), message: this.$l('msg_application_code'), required: true, trigger: 'blur' }],
          path: [{ pattern: ptn.en_num_backslash(1, 100), message: this.$l('msg_application_code'), required: true, trigger: 'blur' }],
          component: [{ pattern: ptn.en_num_backslash(1, 100), message: this.$l('msg_application_code'), required: true, trigger: 'blur' }],
          remark: [{ pattern: ptn.all_match(0, 255), message: this.$l('msg_remark'), required: false, trigger: 'blur' }]
        }

      }
  },
    mounted: function() {
      this.clientRouter.id = this.$route.query.id ? this.$route.query.id : ''
      this.clientRouter.parentId = this.$route.query.parentId ? this.$route.query.parentId : ''
      var that = this
      if (this.clientRouter.id !== '') {
        LoadingUtil.showLoading()
        getClientRouterDetail(this.clientRouter.id).then(response => {
          if (response.data.parentId !== '') {
            getClientRouterDetail(response.data.parentId).then(response2 => {
              LoadingUtil.hideLoading()
              that.clientRouter = response.data
              that.clientRouter.parentName = response2.data.name
            }).catch(error => {
              console.log(error)
            })
          } else{
            LoadingUtil.hideLoading()
            that.clientRouter = response.data
            that.clientRouter.parentName = response.data.name
          }
        }).catch(error => {
          console.log(error)
        })
      } else if (this.clientRouter.parentId !== '') {
        getClientRouterDetail(this.clientRouter.parentId).then(response2 => {
          LoadingUtil.hideLoading()
          that.clientRouter.parentName = response2.data.name
          that.clientRouter.appCode = response2.data.appCode
        }).catch(error => {
          console.log(error)
        })
      }else {
        that.appDisabled = false
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
        if (this.clientRouter.id === '') {
          saveClientRouter(this.clientRouter)
            .then(response => {
              LoadingUtil.hideLoading()
              if (response.code === '2000') {
                this.$router.push({
                  name: 'ClientRouterList'
                })
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
        } else {
          updateClientRouter(this.clientRouter)
            .then(response => {
              LoadingUtil.hideLoading()
              if (response.code === '2000') {
                this.$router.push({
                  name: 'ClientRouterList'
                })
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
        this.$router.push({
          name: 'ClientRouterList'
        })
      }
    }
  }
</script>
<style scoped>
    @import '../../../styles/detail.scss';
</style>
