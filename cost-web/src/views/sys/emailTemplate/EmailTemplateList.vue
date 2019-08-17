<template>
    <div class='app-container'>
      <mt-searchform>
        <template slot="buttons">
          <el-button  icon='el-icon-plus' type='primary' @click='add'>{{$l("btn_add")}}</el-button>
        </template>

        <template slot="form">
          <el-row>
          <el-col :span="6">
            <el-form-item :label='this.$ls("lbl_template_code")'>
            <el-input v-model='templateQueryModel.templateCode' :maxlength='20'></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item :label='this.$ls("lbl_template_type")'>
            <el-input v-model='templateQueryModel.templateType' :maxlength='20'></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item :label='this.$ls("lbl_template_name")'>
            <el-input v-model='templateQueryModel.templateName' :maxlength='20'></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="6" class="search-btn">
            <el-form-item>
            <el-button type='info' @click='queryTemplateList'>{{$l("btn_search")}}</el-button>
            <el-button  @click='reset'>{{$l("btn_reset")}}</el-button>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item :label='this.$ls("lbl_template_content")'>
            <el-input v-model='templateQueryModel.templateContent' :maxlength='200'></el-input>
            </el-form-item>
          </el-col>
          </el-row>
        </template>
      </mt-searchform>
        <emailTemplateTable :queryObj_passed_in='templateQueryModel' ref='emailTemplateTable'></emailTemplateTable>
    </div>
</template>
<script>
import emailTemplateTable from '@/views/sys/emailTemplate/EmailTemplateTable'
export default {
  components: {
    emailTemplateTable
  },
  data() {
    return {
      templateQueryModel: {
        templateCode: '',
        templateType: '',
        templateName: '',
        templateDesc: '',
        templateContent: ''
      },
      showForm: false
    }
  },
  methods: {
    searchBtn() {
      this.showForm = !this.showForm
    },
    reset() {
      this.templateQueryModel.templateCode = ''
      this.templateQueryModel.templateType = ''
      this.templateQueryModel.templateName = ''
      this.templateQueryModel.templateDesc = ''
      this.templateQueryModel.templateContent = ''
    },
    initVM() {
      this.templateQueryModel.pageNum = 1
      this.templateQueryModel.count = 0
      this.templateQueryModel.sortBy = ''
      this.templateQueryModel.order = -1
    },
    add() {
      this.$router.push({
        name: 'NewOrUpdateEmailTemplate'
      })
    },
    queryTemplateList() {
      this.initVM()
      this.$refs.emailTemplateTable.getList()
    }
  },
  mounted: function() {
  }
}
</script>
