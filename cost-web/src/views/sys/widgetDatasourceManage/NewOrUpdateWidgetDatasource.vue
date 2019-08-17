<template>
  <div>
    <el-row>
      <el-form :model="widgetDatasourceModel" status-icon :rules='rules' ref="widgetDatasourceModel" label-width='150px' >

        <el-col :span="12">
        <el-form-item :label='this.$ls("lbl_dashboard_title")' prop="name">
        <el-input v-model='widgetDatasourceModel.name' :placeholder='this.$l("lbl_dashboard_title")'></el-input>
        </el-form-item>
        </el-col>

        <el-col :span="12">
        <el-form-item :label='this.$ls("lbl_widget_module_type")' prop="moduleType">
        <fd-select v-model='widgetDatasourceModel.moduleType' :placeholder="this.$l('lbl_widget_module_type')" type="sys_widget_module_type" :clearable="true"></fd-select>
        </el-form-item>
        </el-col>

        <el-col :span="12">
        <el-form-item :label='this.$ls("lbl_widget_widget_type")' prop="widgetType">
        <fd-select v-model='widgetDatasourceModel.widgetType' :placeholder="this.$l('lbl_widget_widget_type')" type="sys_widget_type" :clearable="true"></fd-select>
        </el-form-item>
        </el-col>
        <el-col :span="12">
        <el-form-item :label='this.$ls("lbl_widget_data_type")' prop='dataType'>
        <fd-select v-model='widgetDatasourceModel.dataType' :placeholder="this.$l('lbl_widget_data_type')" type="sys_widget_data_type" :clearable="true"></fd-select>
        </el-form-item>
        </el-col>
        <el-col :span="12">
        <el-form-item v-show="widgetDatasourceModel.dataType == '3'" :label='this.$ls("lbl_widget_data_type_api")'>
        <el-input v-model='widgetDatasourceModel.apiData' :placeholder='this.$l("lbl_widget_data")'></el-input>
        </el-form-item>
        </el-col>
        <el-col :span="12">
        <el-form-item v-show="widgetDatasourceModel.dataType === '2'" :label='this.$ls("lbl_widget_data")' prop="jsonData" required="">
        <!-- <el-input type='textarea' v-model='widgetDatasourceModel.jsonData' :placeholder='this.$l("lbl_widget_data")'></el-input> -->
        <fd-json v-if="widgetDatasourceModel.dataType === '2'" ref="jsonEditor" v-model="widgetDatasourceModel.jsonData"></fd-json>
        </el-form-item>
        </el-col>
        <el-col :span="12">
        <el-form-item v-show="widgetDatasourceModel.dataType === '1'" :label='this.$ls("lbl_widget_data_type_html")' prop="defineData">
        <quill-editor v-model="widgetDatasourceModel.defineData" ref="myQuillEditor" :options="editorOption" @blur="onEditorBlur($event)" @focus="onEditorFocus($event)" @change="onEditorChange($event)" height="200">
        </quill-editor>
        </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item :label='this.$ls("lbl_widget_description")' prop="des">
            <el-input type='textarea' v-model='widgetDatasourceModel.des' :placeholder='this.$l("lbl_widget_description")'></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <div style="height: 20px;"></div>
        </el-col>
        <el-col :span="24">
        <el-form-item :label='this.$ls("lbl_widget_datasource_extend")' prop="des">
        <el-input type='textarea' v-model='widgetDatasourceModel.extend' :placeholder='this.$l("lbl_widget_datasource_extend")'></el-input>
        </el-form-item>
        </el-col>

        <el-col :span="24" class="detail-button-box">
          <el-button type='primary' @click='onSubmit("widgetDatasourceModel")' v-bind:disabled="disInput">{{this.$l('btn_save')}}</el-button>
          <el-button @click='cancel'>{{this.$l('btn_back')}}</el-button>
        </el-col>
      </el-form>
    </el-row>
  </div>
</template>
<script>
  import {
    saveWidgetDatasource,
    updateWidgetDatasource,
    getWidgetdatasourceDetail
  } from '@/api/sys/widgetDatasourceManageAPI'
  import { ptn } from '@/utils/common/validate'
  export default {
    data() {
      return {
        widgetDatasourceModel: {
          id: '',
          name: '',
          des: '',
          moduleType: '',
          widgetType: '',
          dataType: '',
          data: '',
          apiData: '',
          jsonData: '{}',
          defineData: '',
          extend: '',
          version: ''
        },
        disInput: false,
        rules: {
          name: [
            {
              pattern: ptn.cn_en_num(3, 50),
              message: this.$l('msg_widget_name'),
              required: true,
              trigger: 'blur'
            }
          ],
          moduleType: [
            {
              message: this.$l('msg_widget_module_type'),
              required: true,
              trigger: 'change'
            }
          ],
          widgetType: [
            {
              message: this.$l('msg_widget_widget_type'),
              required: true,
              trigger: 'change'
            }
          ],
          dataType: [
            {
              message: this.$l('msg_widget_data'),
              required: true,
              trigger: 'change'
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
        }
      }
    },

    components: {},

    computed: {},
    // watch: {},
    mounted: function() {
      this.widgetDatasourceModel.id = this.$route.query.id
        ? this.$route.query.id
        : ''
      var that = this
      if (this.widgetDatasourceModel.id !== '') {
        getWidgetdatasourceDetail(this.widgetDatasourceModel.id)
          .then(response => {
            that.widgetDatasourceModel = response.data
            if (that.widgetDatasourceModel.dataType === '3') {
              that.widgetDatasourceModel.apiData =
                that.widgetDatasourceModel.data
            } else if (that.widgetDatasourceModel.dataType === '2') {
              that.widgetDatasourceModel.jsonData =
                that.widgetDatasourceModel.data
            } else if (that.widgetDatasourceModel.dataType === '1') {
              that.widgetDatasourceModel.defineData =
                that.widgetDatasourceModel.data
            }
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
      onSubmit(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            let that = this
            if (that.widgetDatasourceModel.dataType === '3') {
              that.widgetDatasourceModel.data =
                that.widgetDatasourceModel.apiData
            } else if (that.widgetDatasourceModel.dataType === '2') {
              that.widgetDatasourceModel.data =
                that.widgetDatasourceModel.jsonData
            } else if (that.widgetDatasourceModel.dataType === '1') {
              that.widgetDatasourceModel.data =
                that.widgetDatasourceModel.defineData
            }
            this.disInput = true
            if (this.widgetDatasourceModel.id === '') {
              saveWidgetDatasource(this.widgetDatasourceModel)
                .then(response => {
                  this.$router.push({
                    name: 'WidgetDatasourceList'
                  })
                  this.$showSuccess(response.message)
                })
                .catch(error => {
                  this.disInput = false
                  console.log(error)
                })
            } else {
              updateWidgetDatasource(this.widgetDatasourceModel)
                .then(response => {
                  this.$router.push({
                    name: 'WidgetDatasourceList'
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
          name: 'WidgetDatasourceList'
        })
      }
    },
    watch: {
      'widgetDatasourceModel.dataType': function(newValue, oldValue) {
        let _this = this
        let dataType = this.widgetDatasourceModel.dataType
        switch (dataType) {
          case '1':
            // html
            this.widgetDatasourceModel.jsonData = '{}'
            this.widgetDatasourceModel.apiData = ''
            this.rules.jsonData = null
            this.rules.apiData = null
            this.rules.defineData = [
              {
                required: true,
                validator: function(rule, value, callback) {
                  if (value.length > 2000 || value.length == 0) {
                    callback(new Error(_this.$l('msg_widget_data')))
                  } else {
                    callback()
                  }
                },
                trigger: 'blur'
              }
            ]
            break
          case '2':
            // json
            this.widgetDatasourceModel.apiData = ''
            this.widgetDatasourceModel.defineData = ''
            this.rules.defineData = null
            this.rules.apiData = null
            this.rules.jsonData = [
              {
                required: true,
                validator: function(rule, value, callback) {
                  if (value.length == 0) {
                    callback(new Error(_this.$l('msg_widget_data')))
                  } else {
                    try {
                      let jsonObj = JSON.parse(value)
                      if (['0', '1', '2', '3'].indexOf(_this.widgetDatasourceModel.widgetType) > -1) {
                        // chart
                        if (!jsonObj.hasOwnProperty('columns') || !jsonObj.hasOwnProperty('rows')) {
                          // callback(new Error("columns,rows缺失"));
                          callback(new Error(_this.$l('msg_widget_data')))
                        } else {
                          callback()
                        }
                      } else if (_this.widgetDatasourceModel.widgetType === '4') {
                        // table
                        if (!jsonObj.hasOwnProperty('header') || !jsonObj.hasOwnProperty('data')) {
                          // callback(new Error("header,data缺失"));
                          callback(new Error(_this.$l('msg_widget_data')))
                        } else {
                          callback()
                        }
                      } else if (_this.widgetDatasourceModel.widgetType === '5') {
                        // define
                        callback(new Error(_this.$l('msg_widget_data')))
                        // callback(new Error("define widget can't use JSON datatype"));
                      }
                    } catch (err) {
                      // callback(new Error("wrong json format"));
                      callback(new Error(_this.$l('msg_widget_data')))
                    }
                  }
                },
                trigger: 'blur'
              }
            ]
            break
          case '3':
            // api
            this.widgetDatasourceModel.jsonData = '{}'
            this.widgetDatasourceModel.defineData = ''
            this.rules.jsonData = null
            this.rules.defineData = null
            this.rules.apiData = [
              {
                required: true,
                validator: function(rule, value, callback) {
                  var reg = /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/
                  if (value.length == 0) {
                    callback(new Error(_this.$l('msg_widget_data')))
                  } else if (!reg.test(value)) {
                    callback(new Error('wrong http format'))
                  } else {
                    callback()
                  }
                },
                trigger: 'blur'
              }
            ]
            break
          default:
            break
        }
      }
    }
  }
</script>
<!--<style lang='scss' scoped>-->
<!--</style>-->
<style scoped>
  @import '../../../styles/detail.scss';
</style>
