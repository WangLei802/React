<template>
  <div class='app-container'>

    <mt-searchform>
      <template slot="buttons"> 
        <el-button icon='el-icon-plus' type='primary' @click='add'>{{$l("btn_add")}}</el-button>
      </template>

      <template slot="form">   
        <el-row>   
          <el-col :span="6">
            <el-form-item :label='this.$ls("lbl_application_name")'>
              <fd-applicationselect v-model="dictTypeQueryModel.appCode"></fd-applicationselect>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item :label='this.$ls("lbl_dict_name")'>
              <el-input v-model='dictTypeQueryModel.dictName' :maxlength="20"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item :label='this.$ls("lbl_dict_type")'>
              <el-input v-model='dictTypeQueryModel.dictType' :maxlength="25"></el-input>
            </el-form-item>
          </el-col>

          <!-- The button is fixed at the end of the first line -->
          <el-col :span="6" class="search-btn">
            <el-form-item>
              <el-button type="info" @click='queryDictionaryTypeList'>{{$l("btn_search")}}</el-button>
              <el-button @click='reset'>{{$l("btn_reset")}}</el-button>
            </el-form-item>
          </el-col>
          <!-- end -->

          <el-col :span="6">
            <el-form-item :label='this.$ls("lbl_is_sys")'>
              <fd-select v-model="dictTypeQueryModel.isSys" :placeholder='this.$l("lbl_is_sys")' type="sys_yes_no" clearable></fd-select>
            </el-form-item>
          </el-col>  
        </el-row>            
      </template>

    </mt-searchform>

    <DictionaryTypeTable :queryObj_passed_in='dictTypeQueryModel' ref='dictionaryTypeTable'></DictionaryTypeTable>
  </div>
</template>
<script>
import DictionaryTypeTable from '@/views/sys/dictionary/DictionaryTypeTable'
import FdApplicationselect from '../../../components/platform/ApplicationSelect/fd-applicationselect'
export default {
  components: {
    FdApplicationselect,
    DictionaryTypeTable

  },
  data() {
    return {
      dictTypeQueryModel: {
        dictName: '',
        dictType: '',
        isSys: '',
        pageNum: 1,
        pageSize: 20,
        count: 0,
        appCode: ''
      },
      showForm: false
    }
  },
  methods: {
    searchBtn() {
      this.showForm = !this.showForm
    },
    reset() {
      this.dictTypeQueryModel.dictName = ''
      this.dictTypeQueryModel.dictType = ''
      this.dictTypeQueryModel.isSys = ''
      this.dictTypeQueryModel.status = ''
    },
    initVM() {
      this.dictTypeQueryModel.pageNum = 1
      this.dictTypeQueryModel.count = 0
      this.dictTypeQueryModel.sortBy = ''
      this.dictTypeQueryModel.order = -1
    },
    add() {
      this.$router.push({
        name: 'NewOrUpdateDictionaryType'
      })
    },
    queryDictionaryTypeList() {
      this.initVM()
      this.$refs.dictionaryTypeTable.getList()
    }
  }
}
</script>