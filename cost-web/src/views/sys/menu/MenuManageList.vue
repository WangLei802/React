<template>
    <div class='app-container'>
            <div class="button-area">
                <el-button  class="ordinary-btn" icon='el-icon-plus' type='primary' @click='addMenuData'>{{$l("btn_add")}}</el-button>
            </div>
        <MenuDataTable></MenuDataTable>
    </div>
</template>
<script>
import MenuDataTable from '@/views/sys/menu/MenuDataTable'
export default {
  components: {
    MenuDataTable
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
    addMenuData() {
      this.$router.push({
        name: 'NewOrUpdateMenuData'
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
