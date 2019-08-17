<template>
  <div>
    <el-row>
      <el-form :model="menuModel" status-icon :rules='rules' ref="menuModel" label-width='150px' >

        <el-col :span="12">
          <el-form-item :label='this.$ls("lbl_last_menu")'>
            <el-input :disabled="true"
                      v-model="menuModel.parentMenuName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label='this.$ls("lbl_menu_name_cn")' prop="menuNameZh">
            <el-input  v-model='menuModel.menuNameZh' :placeholder='this.$l("lbl_menu_name_cn")'></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label='this.$ls("lbl_menu_name_en")' prop="menuNameEn">
            <el-input  v-model='menuModel.menuNameEn' :placeholder='this.$l("lbl_menu_name_en")'></el-input>
          </el-form-item>
        </el-col>


        <el-col :span="12">
          <el-form-item :label="this.$ls('lbl_menu_application')" prop="appCode">
            <fd-applicationselect v-model='menuModel.appCode'
                                  :placeholder="this.$l('lbl_menu_application')">
            </fd-applicationselect>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item :label='this.$ls("lbl_menu_icon")'>
            <el-input  v-model='menuModel.menuIcon' :placeholder='this.$l("lbl_menu_icon")'></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label='this.$ls("lbl_menu_router_name")'>
            <el-input  v-model='menuModel.clientRouter.name' :readonly="true"
                       :placeholder='this.$l("lbl_menu_router_name")' @focus="openDialog">
              <i class="el-icon-circle-close el-input__icon"
                 slot="suffix"
                 @click="handleClearRouter">
              </i>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label='url：'>
            <el-input  v-model='menuModel.clientRouter.path'
                       :disabled="true" :title="menuModel.clientRouter.path"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item :label='this.$ls("lbl_sort")'>
            <el-input  v-model='menuModel.treeSort' :placeholder='this.$l("lbl_sort")'></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label='this.$ls("lbl_menu_params")' prop="params">
            <fd-json  ref='jsonEditor' v-model='menuModel.params'></fd-json>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label='$ls("lbl_menu_weight")' prop="weight">
            <fd-select  v-model="menuModel.weight" :placeholder='this.$l("lbl_menu_weight")' type="sys_menu_weight"></fd-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item :label='this.$ls("lbl_remark")' prop="remark" >
            <el-input type='textarea' v-model='menuModel.remarks' :placeholder='this.$l("lbl_remark")'></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="24" class="detail-button-box">
          <el-button type='primary' @click='onSubmit("menuModel")' v-bind:disabled="disInput" >{{this.$l('btn_save')}}</el-button>
          <el-button @click='cancel' >{{this.$l('btn_back')}}</el-button>
        </el-col>
      </el-form>
    </el-row>
    <el-dialog title='选择路由组件' :visible.sync="dialogVisible" width="80%">
      <div ref="addClientRouter">
        <tree-grid :columns="clientRouterColumns" :tree-structure="true" :data-source="clientRouterData">
          <el-table-column :label="this.$l('lbl_operation')" width="80">
            <template slot-scope="scope">
              <el-button type="text" icon="el-icon-plus" title="选择路由"
                         @click="handleAddClientRouter(scope.$index, scope.row)"></el-button>
            </template>
          </el-table-column>
        </tree-grid>
      </div>
    </el-dialog>
  </div>
</template>
<script >
  import { LoadingUtil } from '@/utils/common/LoadingUtil'
  import { ptn } from '@/utils/common/validate'
  import { addMenu, updateTopMenuList, getMenuById, getClientRouterList } from '@/api/sys/menuAPI'
  import TreeGrid from '@/components/sys/treeTable'
  export default {
    components: {
      TreeGrid
    },
    data() {
      var checkJson = (rule, value, callback) => {
        if (typeof value === 'string') {
          try {
            var obj = JSON.parse(value)
            if (typeof obj === 'object' && obj) {
              return true
            } else {
              return callback(new Error('请输入正确的json格式'))
            }
          } catch (e) {
            return callback(new Error('请输入正确的json格式'))
          }
        }
      }
      return {
        rules: {
          menuNameZh: [{ pattern: ptn.all_match(1, 50), message: '请输入1-50个字符', required: true, trigger: 'blur' }],
          menuNameEn: [{ pattern: ptn.all_match(1, 50), message: '请输入1-50个字符', required: true, trigger: 'blur' }],
          appCode: [{ message: '请选择应用', required: true, trigger: 'blur' }],
          remark: [{ pattern: ptn.all_match(0, 255), message: this.$l('msg_remark'), required: false, trigger: 'blur' }]
          // params: [{ validator: checkJson, trigger: 'blur' }]
        },
        dialogVisible: false,
        disInput: false,
        menuModel: {
          id: '',
          parentCode: '',
          parentMenuName: '',
          treeSort: 0,
          treeLevel: 0,
          appCode: '',
          clientRouter: {
            id: '',
            name: '',
            path: ''
          },
          menuNameEn: '',
          menuNameZh: '',
          routerId: '',
          menuIcon: '',
          params: '{}',
          remarks: '',
          weight: '',
          version: ''
        },
        clientRouterData: [],
        clientRouterColumns: [
          {
            text: this.$l('lbl_menu_router_name'),
            dataIndex: 'name'
          },
          {
            text: 'url',
            dataIndex: 'path'
          },
          {
            text: this.$l('lbl_client_router_component'),
            dataIndex: 'component'
          },
          {
            text: this.$l('lbl_application_code'),
            dataIndex: 'appCode',
            width: 120
          },
          {
            text: this.$l('lbl_remark'),
            dataIndex: 'remark',
            width: 100
          }
        ]
      }
    },
    mounted: function() {
      this.init()
    },
    methods: {
      init() {
        // 添加子级
        if (this.$route.query.handleType === 'createSon') {
          this.menuModel.parentCode = this.$route.query.id
          getMenuById({ id: this.$route.query.id })
            .then(response => {
              this.menuModel.appCode = response.data.appCode
              this.menuModel.parentMenuName = response.data.menuNameZh
            })
            .catch(error => {
              console.log(error)
            })
        } else if (this.$route.query.handleType === 'edit') {
          getMenuById({ id: this.$route.query.id })
            .then(response => {
              this.menuModel = response.data
              if (this.menuModel.parentCode !== '-1') {
                getMenuById({ id: this.menuModel.parentCode })
                  .then(response => {
                    this.$set(this.menuModel, 'parentMenuName', response.data.menuNameZh)
                  })
              }
            })
            .catch(error => {
              console.log(error)
            })
        }
      },
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
        if (this.menuModel.id === '') {
          addMenu(this.menuModel)
            .then(response => {
              LoadingUtil.hideLoading()
              if (response.code === '2000') {
                this.$router.push({
                  name: 'MenuManager'
                })
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
          updateTopMenuList(this.menuModel)
            .then(response => {
              LoadingUtil.hideLoading()
              if (response.code === '2000') {
                this.$router.push({
                  name: 'MenuManager'
                })
                this.$showSuccess(response.message)
              } else {
                this.$showError(response.message)
              }
            })
            .catch(error => {
              this.disInput = false
              console.log(error)
            })
        }
      },
      getClientRouterList() {
        getClientRouterList()
          .then(response => {
            this.clientRouterData = response.data
          })
      },
      cancel() {
        this.$router.push({
          name: 'MenuManager'
        })
      },
      openDialog() {
        this.dialogVisible = true
        this.getClientRouterList()
      },
      handleAddClientRouter(index, row) {
        this.menuModel.clientRouter.name = row.name
        this.menuModel.clientRouter.path = row.path
        this.menuModel.routerId = row.id
        this.menuModel.appCode = row.appCode
        this.dialogVisible = false
        this.setParams()
      },
      setParams() {
        let url = this.menuModel.clientRouter.path
        let arr = url.split('/')
        let temp = {}
        arr.forEach(item => {
          if (item.indexOf(':') === 0) {
            this.$set(temp, item.substr(1), '')
          }
        })
        this.menuModel.params = JSON.stringify(temp)
      },
      handleClearRouter() {
        this.menuModel.clientRouter.name = ''
        this.menuModel.clientRouter.path = ''
        this.menuModel.appCode = ''
      }
    }
  }
</script>

<style scoped>
  @import '../../../styles/detail.scss';
</style>
