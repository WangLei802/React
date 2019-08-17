<template>
  <div class='app-container'>
        <div class="button-area">
          <el-button class="ordinary-btn" icon='el-icon-back' type='primary' @click='back'>{{$l("btn_back")}}</el-button>
          <el-button class="ordinary-btn" icon='el-icon-plus' type='primary' @click='addDictionaryData'>{{$l("btn_add")}}</el-button>
        </div>
    <DictionaryDataTable :queryObj_passed_in='dictDataQueryModel' ref="dictionaryDataTable"></DictionaryDataTable>
  </div>
</template>
<script>

import DictionaryDataTable from '@/views/sys/dictionary/DictionaryDataTable'
export default {
  components: {
    DictionaryDataTable
  },
  props: {
  },
  data() {
    return {
      dictDataQueryModel: {
        dictType: '',
        count: 0,
        pageNum: 1,
        pageSize: 20,
        sortBy: '',
        order: -1
      }
    }
  },
  methods: {
    queryDictionaryDataList() {
      this.$refs.dictionaryTypeTable.getList()
    },
    addDictionaryData() {
      this.$router.push({
        name: 'NewOrUpdateDictionaryData',
        query: { dictType: this.dictDataQueryModel.dictType }
      })
    },
    back() {
      this.$router.push({
        name: 'Dictionary'
      })
    }
  },
  mounted: function() {
    this.dictDataQueryModel.dictType = this.$route.query.dictType
  }
}
</script>
<style scoped>
@import '../../../styles/list.scss';
</style>
