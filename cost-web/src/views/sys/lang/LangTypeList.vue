<template>
    <div class='app-container'>
            <div class="button-area">
                <el-button  class="ordinary-btn" icon='el-icon-plus' type='primary' @click='add'>{{$l("btn_add")}}</el-button>
              <el-button  class="ordinary-btn" icon='el-icon-back' type='primary' @click='back'>{{$l("btn_back")}}</el-button>
            </div>
        <LangTypeTable :queryObj_passed_in='langTypeModel' ></LangTypeTable>
    </div>
</template>
<script>
import LangTypeTable from '@/views/sys/lang/LangTypeTable'
export default {
  components: {
    LangTypeTable
  },
  data() {
    return {
      langTypeModel: {
        langTypeCode: '',
        langTypeDesc: '',
        langTypeLocaleDesc: '',
        count: 0,
        pageNum: 1,
        pageSize: 40
      }
    }
  },
  methods: {
    add() {
      this.$router.push({
        name: 'NewOrUpdateLangType'
      })
    },
    back() {
      this.$router.push({
        name: 'LangList'
      })
    }
  },
  mounted: function() {
  }
}
</script>
