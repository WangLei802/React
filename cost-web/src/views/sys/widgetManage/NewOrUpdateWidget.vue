<template>
  <div>
    <el-row>
      <el-form :model="widgetModel" status-icon :rules='rules' ref="widgetModel" label-width='150px' >

        <el-col :span="12">
          <el-form-item :label='this.$ls("lbl_widget_name")' prop="name">
          <el-input v-model='widgetModel.name' :placeholder='this.$l("lbl_widget_name")'></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item :label='this.$ls("lbl_widget_module_type")' prop="moduleType">
          <fd-select v-model='widgetModel.moduleType' type="sys_widget_module_type" :placeholder="this.$l('lbl_widget_module_type')" :clearable="true"></fd-select>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item :label='this.$ls("lbl_widget_widget_type")' prop="widgetType">
          <fd-select v-model="widgetModel.widgetType" :placeholder='this.$l("lbl_widget_widget_type")' type="sys_widget_type"></fd-select>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item :label='this.$ls("lbl_widget_data_type")' prop="dataType">
          <fd-select v-model="widgetModel.dataType" :placeholder='this.$l("lbl_widget_data_type")' type="sys_widget_data_type"></fd-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label='this.$ls("lbl_widget_data")' prop="data">
          <el-select v-model='widgetModel.data' :placeholder='this.$l("lbl_widget_data")'>
          <el-option v-for='item in dataList' :key='item.id' :label='item.name' :value='item.id'>
          </el-option>
          </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item :label='this.$ls("lbl_widget_description")' prop="des">
            <el-input type='textarea' v-model='widgetModel.des' :placeholder='this.$l("lbl_widget_description")'></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24" class="detail-button-box">
          <el-button type='primary' @click='onSubmit("widgetModel")' v-bind:disabled="disInput">{{this.$l('btn_save')}}</el-button>
          <el-button @click='cancel'>{{this.$l('btn_back')}}</el-button>
        </el-col>
      </el-form>
    </el-row>
  </div>
</template>
<script>
import {
  saveWidget,
  updateWidget,
  getWidgetDetail
} from '@/api/sys/widgetManageAPI'
import {
  searchWidgetDatasourceList
} from '@/api/sys/widgetDatasourceManageAPI'
import { LoadingUtil } from '@/utils/common/LoadingUtil'
import { ptn } from '@/utils/common/validate'
export default {
  data() {
    var checkData = (rule, value, callback) => {
      if (value.length > 200 || value.length == 0) {
        callback(new Error(this.$l('msg_widget_data')))
      } else {
        callback()
      }
    }
    return {
      dataList: [], // 数据列表
      widgetModel: {
        id: '',
        name: '',
        des: '',
        moduleType: '',
        widgetType: '',
        dataType: '',
        data: '',
        version: ''
      },
      options_1: [
        { dictValue: '', dictLabel: '' },
        { dictValue: '0', dictLabel: '全局' },
        { dictValue: '1', dictLabel: '成本' }
      ],
      rules: {
        name: [
          {
            pattern: ptn.cn_en_num(5, 35),
            message: this.$l('msg_widget_name'),
            required: true,
            trigger: 'blur'
          }
        ],
        moduleType: [
          {
            message: this.$l('msg_widget_module_type'),
            required: true,
            trigger: 'mouseup'
          }
        ],
        widgetType: [
          {
            message: this.$l('msg_widget_widget_type'),
            required: true,
            trigger: 'mouseup'
          }
        ],
        dataType: [
          {
            message: this.$l('msg_widget_data_type'),
            required: true,
            trigger: 'mouseup'
          }
        ],
        data: [
          {
            required: true,
            validator: checkData,
            trigger: 'blur'
          }
        ]
      },
      editorOption: {
        modules: {
          toolbar: {
            container: [
              ['bold', 'italic', 'underline', 'strike'], // toggled buttons
              ['blockquote', 'code-block'],
              [{ align: [] }],
              ['link', 'image', 'vidio']
            ]
          }
        }
      },
      disInput: false
    }
  },

  components: {},

  computed: {},
  watch: {
    'widgetModel.moduleType': function() {
      this.getDataList()
    },
    'widgetModel.widgetType': function() {
      this.getDataList()
    },
    'widgetModel.dataType': function() {
      this.getDataList()
    }
  },
  mounted: function() {
    this.widgetModel.id = this.$route.query.id ? this.$route.query.id : ''
    if (this.widgetModel.id !== '') {
      getWidgetDetail(this.widgetModel.id)
        .then(response => {
          this.widgetModel = response.data
          this.getDataList()
          console.log(response.data)
        })
        .catch(err => {
          console.log(err)
        })
    }
  },

  methods: {
    onEditorBlur: function() {},
    onEditorFocus: function() {},
    onEditorChange: function() {},
    getDataList() {
      let queryObj = {
        name: '',
        moduleType: this.widgetModel.moduleType,
        widgetType: this.widgetModel.widgetType,
        dataType: this.widgetModel.dataType,
        pageNum: 1,
        pageSize: 1000,
        sortBy: 'id',
        order: -1
      }
      LoadingUtil.showLoading()
      this.dataList = []
      searchWidgetDatasourceList(queryObj)
        .then(response => {
          LoadingUtil.hideLoading()
          response.data.content.map(item => {
            this.dataList.push({
              id: item.id,
              name: item.name
            })
          })
        })
        .catch(error => {
          console.log(error)
        })
    },
    onSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.disInput = true
          if (this.widgetModel.id === '') {
            saveWidget(this.widgetModel)
              .then(response => {
                this.$router.push({
                  name: 'WidgetList'
                })
                this.$showSuccess(response.message)
              })
              .catch(error => {
                this.disInput = false
                console.log(error)
              })
          } else {
            updateWidget(this.widgetModel)
              .then(response => {
                this.$router.push({
                  name: 'WidgetList'
                })
                this.$showSuccess(response.message)
              })
              .catch(error => {
                this.disInput = false
                console.log(error)
              })
          }
        }
      })
    },
    cancel() {
      this.$router.push({
        name: 'WidgetList'
      })
    }
  }
}
</script>
<!--<style lang='scss' scoped>-->
<!--</style>-->
<style scoped>
  @import '../../../styles/detail.scss';
</style>
