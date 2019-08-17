<template>
    <div class='app-container'>
            <div class="button-area">
              <el-button  icon='el-icon-plus' type='primary' @click='addOrgData'>{{$l("btn_add")}}</el-button>
            </div>
        <OrgDataTable></OrgDataTable>
    </div>
</template>
<script>
import OrgDataTable from '@/views/sys/org/OrgDataTable'
export default {
  components: {
    OrgDataTable
  },
  props: {
    vm_passed_in: {
      type: Object
    }
  },
  data() {
    return {
      expandAll: false,
      isAdd: '', // 新增还是编辑
      menulist: {
        component: '',
        menuHref: '',
        menuIcon: '',
        menuNameEn: '',
        menuNameZh: '',
        menuType: '',
        permission: '',
        remarks: '',
        treeSort: 0,
        weight: 0,
        version: '',
        appCode: ''
      },
      vm: {
        dictName: '',
        dictType: '',
        isSys: '',
        status: '',
        pageInfo: {
          count: 0,
          pageNum: 1,
          pageSize: 40
        }
      },
      trIndex: ''
    }
  },
  methods: {
    addOrgData() {
      this.$router.push({
        name: 'NewOrUpdateOrgData'
      })
    }
  },
  created: function() {
    // this.getList()
    // this.vm.dictType = this.vm_passed_in.dictType
  },
  mounted: function() {
  }
}
</script>
