<template>
    <div class='app-container'>
      <mt-searchform>
        <template slot="buttons">
          <el-button  icon='el-icon-plus' type='primary' @click='add'>{{$l("btn_add")}}</el-button>
          <el-button  class="ordinary-btn" icon='el-icon-setting' type='primary' @click='manage'>{{$l("btn_manager")}}</el-button>
        </template>

        <template slot="form">
          <el-row>
          <el-col :span="6">
            <el-form-item :label='this.$ls("lbl_application_name")'>
            <fd-applicationselect v-model="langQueryModel.appCode"></fd-applicationselect>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item :label='this.$ls("lbl_lang_code")'>
            <!--<mt-input v-model="langQueryModel.langCode"></mt-input>-->
             <el-input v-model="langQueryModel.langCode"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item :label='this.$ls("lbl_text")'>
            <el-input v-model='langQueryModel.langText'></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="6" class="search-btn">
            <el-form-item>
              <el-button type="info" @click='search'>{{$l("btn_search")}}</el-button>
              <el-button @click='reset'>{{$l("btn_reset")}}</el-button>
            </el-form-item>
          </el-col>
          <el-col :span="6" >
            <el-form-item :label='this.$ls("lbl_lang_type")'>
            <el-select v-model='langQueryModel.langType' :placeholder="this.$l('lbl_type')">
            <el-option v-for='item in options_1' :key='item.langTypeCode' :label='item.langTypeLocaleDesc' :value='item.langTypeCode'>
            </el-option>
            </el-select>
            </el-form-item>
          </el-col>
          </el-row>
        </template>
      </mt-searchform>
        <LangTable :queryObj_passed_in='langQueryModel' ref='langTable'></LangTable>
    </div>
</template>
<script>
import { getLangTypeList } from '@/api/sys/i18nAPI'
import LangTable from '@/views/sys/lang/LangTable'
import { LoadingUtil } from '@/utils/common/LoadingUtil'
import FdApplicationselect from '../../../components/platform/ApplicationSelect/fd-applicationselect'
export default {
  components: {
    FdApplicationselect,
    LangTable
  },
  data() {
    return {
      langQueryModel: {
        langCode: '',
        langText: '',
        langType: '',
        count: 0,
        pageNum: 1,
        pageSize: 20,
        sortBy: 'id',
        order: -1,
        appCode: ''
      },
      options_1: [
        { dictValue: '', dictLabel: '' },
        { dictValue: 'en', dictLabel: 'English' },
        { dictValue: 'cn', dictLabel: '中文' }
      ],
      showForm: false
    }
  },
  mounted: function() {
    LoadingUtil.showLoading()
    getLangTypeList()
      .then(response => {
        LoadingUtil.hideLoading()
        this.options_1 = response.data
      })
      .catch(error => {
        console.log(error)
      })
  },
  methods: {
    searchBtn() {
      this.showForm = !this.showForm
    },
    initlangQueryModel() {
      this.langQueryModel.pageNum = 1
      this.langQueryModel.count = 0
      this.langQueryModel.sortBy = ''
      this.langQueryModel.order = -1
    },
    reset() {
      this.langQueryModel.langCode = ''
      this.langQueryModel.langText = ''
      this.langQueryModel.langType = ''
    },

    search() {
      this.initlangQueryModel()
      this.$refs.langTable.getList()
    },
    add() {
      this.$router.push({ name: 'NewOrUpdateLang' })
    },
    manage() {
      this.$router.push({ name: 'LangTypeList' })
    }
  }
}
</script>

