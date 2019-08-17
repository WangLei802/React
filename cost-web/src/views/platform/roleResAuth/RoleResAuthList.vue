<template>
  <div class='app-container'>
    <div class="subTitle">
      <!--<div class="breadcrumb-child">-->
        <!--<i class="fa fa-folder-open-o"></i>{{$l("lbl_role_auth_mgmt")}}</div>-->
        
      <div class="button-area" style="padding-right:0">
        <el-button @click='cancel'>{{this.$l('btn_back')}}</el-button>
         <el-button type='primary' @click='save'>{{$l("btn_save")}}</el-button>
      </div>
    </div>
    <el-row>
    <el-form :inline="true" label-width="80px">
      <el-form-item :label='this.$ls("lbl_role_name")' style="display: inline-block;">
        <el-input v-model='currentRole.roleName' :disabled="true" ></el-input>
      </el-form-item>
      <el-form-item :label='this.$ls("lbl_role_code")' style="display: inline-block;">
        <el-input v-model='currentRole.roleCode' :disabled="true"></el-input>
      </el-form-item>
    </el-form>
  </el-row>
    <el-row>
      <el-col :span="8" style='margin-top:15px;border: 1px solid #ececec;
    padding: 10px;width: 21%;'>
        <el-input placeholder="输入关键字进行过滤" v-model="filterText"> </el-input>
        <el-tree style="overflow:scroll; height:330px; overflow-x: hidden;"  class="filter-tree"
        :data="treeData"
        node-key="id"
        ref="menuTree"
        show-checkbox
        highlight-current
        :props="defaultProps"
        :filter-node-method="filterNode"
        :default-checked-keys="defaultCheckedKeys"
        @node-click="getNodeData"
        @check-change="getNodeCheckChange"
        default-expand-all :expand-on-click-node="false">
        </el-tree>
      </el-col>
      <el-col :span="16" style="float:right;width:77%">
        {{this.$ls("lbl_relate_menu")}}{{currentMenu.menuNameZh}}</span> 
          <RoleResAuthTable style="margin-top: 10px;" :queryObj_passed_in='roleResAuthModel'  ref='roleResAuthTable'></RoleResAuthTable>
      </el-col>
    </el-row>
  </div>


</template>
<script>
  import { queryMenuList, updateRoleResAuth } from '@/api/platform/roleResAuthAPI'
  import RoleResAuthTable from '@/views/platform/roleResAuth/RoleResAuthTable'
  import { LoadingUtil } from '@/utils/common/LoadingUtil'
  export default {
    components: {
      RoleResAuthTable
    },
    data() {
      return {
        filterText: '',
        currentMenu: {},
        currentRole: { roleId: '', roleCode: '', roleName: '' },
        listQuery: {
        },
        treeData: [],
        defaultProps: {
          children: 'childrens',
          label: 'menuNameZh'
        },
        defaultCheckedKeys: [],
        multipleSelection: [],
        roleResAuthModel: {
          pageNum: 1,
          pageSize: 20,
          count: 0,
          optMenuList: new Map(),
          optResourceList: new Map()
        },
        externalData: []
      }
    },
    mounted: function() {
      this.currentRole.roleId = this.$route.query.roleId || ''
      this.currentRole.roleCode = this.$route.query.roleCode || ''
      this.currentRole.roleName = this.$route.query.roleName || ''
      this.roleResAuthModel.authorityId = this.$route.query.roleId || ''
      this.initLeftMenuTree(this.roleResAuthModel.authorityId)
    },
    watch: {
      filterText(val) {
        this.$refs.menuTree.filter(val)
      }
    },
    methods: {
      reset() {
        this.roleResAuthModel.authorityId = ''
        this.roleResAuthModel.menuId = ''
        this.roleResAuthModel.optMenuList = new Map()
        this.roleResAuthModel.optResourceList = new Map()
      },
      initVM() {
        this.roleResAuthModel.authorityId = ''
        this.roleResAuthModel.menuId = ''
        this.roleResAuthModel.optMenuList = new Map()
        this.roleResAuthModel.optResourceList = new Map()
      },
      save() {
        // role-menu,role-resource
        var menuAuthorityList = []
        var resourceAuthorityList = []
        var authorityId = this.roleResAuthModel.authorityId

        /* //保存资源时，仅保存相应菜单已勾选的资源
        this.$refs.menuTree.getCheckedKeys().forEach((item, index) => {
          var menuAuthority = { authorityId: authorityId, menuId: item }
          menuAuthorityList.push(menuAuthority)
          var resources = this.roleResAuthModel.optMenuList.get(item)
          if (resources) {
            resources.forEach(function(res_item, res_index) {
              if (res_item.checked) {
                var resourceAuthority = { authorityId: authorityId, menuId: item, resourceId: res_item.id }
                resourceAuthorityList.push(resourceAuthority)
              }
            })
          }
        })
        */

        this.$refs.menuTree.getCheckedKeys().forEach((item, index) => {
          var menuAuthority = { authorityId: authorityId, menuId: item }
          menuAuthorityList.push(menuAuthority)
        })

        this.$refs.menuTree.getHalfCheckedKeys().forEach((item, index) => {
          var menuAuthority = { authorityId: authorityId, menuId: item }
          menuAuthorityList.push(menuAuthority)
        })

        this.roleResAuthModel.optMenuList.forEach(function(value, key, mapObj) {
          value.forEach((item, index) => {
            if (item.checked) {
              var resourceAuthority = { authorityId: authorityId, menuId: key, resourceId: item.id }
              resourceAuthorityList.push(resourceAuthority)
            }
          })
        })
        var roleResAuthModel = {
          authorityId: authorityId,
          menuAuthorityList: menuAuthorityList,
          resourceAuthorityList: resourceAuthorityList
        }
        updateRoleResAuth(roleResAuthModel).then(response => {
          if (response.code === '2000') {
            this.$router.push({
              name: 'RoleList'
            })
            this.$showSuccess(response.message || '保存成功')
          } else {
            this.$showError(response.message || '保存失败')
          }
        })
      },
      getTreeNodeKey(node) {
        return node.id
      },
      filterNode(value, data) {
        if (!value) return true
        return (data.menuNameZh.indexOf(value) !== -1) || (data.menuNameEn.indexOf(value) !== -1)
      },
      // defaultCheckedKeys(value) {
      //   return []
      // },
      getNodeData(data) {
        this.currentMenu = data
        this.roleResAuthModel.menuId = data.id
        this.$refs.roleResAuthTable.getList() // 根据角色ID和菜单ID加载右侧资源列表
        // this.currentId = data.id;
        // this.showElement = true;
      },
      getNodeCheckChange(data, state) {
        this.roleResAuthModel.menuId = data.id
        if (this.roleResAuthModel.optMenuList.has(data.id)) {
          this.roleResAuthModel.optMenuList.get(data.id).forEach((item, index) => {
            item.checked = state
          })

          this.$refs.roleResAuthTable.getList() // 根据角色ID和菜单ID加载右侧资源列表
        }
      },
      handleSelectionChange(val) {
        this.multipleSelection = val
      },
      initLeftMenuTree(authorityId) {
        LoadingUtil.showLoading()
        var queryParam = { authorityId: authorityId }
        queryMenuList(queryParam).then(response => {
          LoadingUtil.hideLoading()
          this.treeData = response.data
          this.treeData.forEach((item, index) => {
            if (item.checked) {
              this.defaultCheckedKeys.push(item.id)
            }
            this.roleResAuthModel.optMenuList.set(item.id, item.resources || [])
            if (item.childrens) {
              item.childrens.forEach((item_c1, index_c1) => {
                if (item_c1.checked) {
                  this.defaultCheckedKeys.push(item_c1.id)
                }
                this.roleResAuthModel.optMenuList.set(item_c1.id, item_c1.resources || [])

                if (item_c1.childrens) {
                  item_c1.childrens.forEach((item_c2, index_c2) => {
                    if (item_c2.checked) {
                      this.defaultCheckedKeys.push(item_c2.id)
                    }
                    this.roleResAuthModel.optMenuList.set(item_c2.id, item_c2.resources || [])
                  })
                }
              })
            }
          })
        })
      },
      cancel() {
        this.$router.push({
          name: 'RoleList'
        })
      }
    }
  }
</script>
<style scoped>
  @import '../../../styles/list.scss';
</style>
