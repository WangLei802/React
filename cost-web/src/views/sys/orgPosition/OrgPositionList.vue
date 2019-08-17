<template>
  <div class='app-container'>
    <el-row>
      <el-col :span="5" style='margin-top: 10px;'>
        <el-input placeholder="输入关键字进行过滤" v-model="filterText" style="width: 96%"> </el-input>
        <el-tree style="overflow:scroll; height:450px; overflow-x: hidden;margin-right:10px;" class="filter-tree" check-strictly node-key="id"
                 :data="treeData" highlight-current :props="defaultProps"
                 @node-click="getNodeData"
                 :filter-node-method="filterNode"
                 ref="orgTree" :expand-on-click-node="false" lazy>
        </el-tree>
      </el-col>
      <el-col :span="19" style='margin-top: 10px;'>
        <mt-searchform>
          <template slot="buttons">
            <el-button icon='el-icon-plus' type='primary' @click='add'>{{$l("btn_add")}}</el-button>
          </template>

          <template slot="form">
            <el-row>
              <el-col :span="6">
                <el-form-item :label='this.$ls("lbl_position_code")'>
                  <el-input v-model='positionQueryModel.code' :maxlength="20" ></el-input>
                </el-form-item>
              </el-col>

              <el-col :span="6">
                <el-form-item :label='this.$ls("lbl_position_name")'>
                  <el-input v-model='positionQueryModel.name' :maxlength="20"></el-input>
                </el-form-item>
              </el-col>

              <el-col :span="6">
                <el-form-item :label='this.$ls("lbl_status")'>
                  <fd-select v-model="positionQueryModel.status" type="sys_status" clearable> </fd-select>
                </el-form-item>
              </el-col>

              <el-col :span="6" class="search-btn">
                <el-form-item>
                  <el-button type="info" @click='getPositionList'>{{$l("btn_search")}}</el-button>
                  <el-button @click='reset'>{{$l("btn_reset")}}</el-button>
                </el-form-item>
              </el-col>
            </el-row>
          </template>
        </mt-searchform>
        <PositionTreeTable :queryObj_passed_in='positionQueryModel' ref='PositionTable'></PositionTreeTable>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  import PositionTreeTable from '@/views/sys/orgPosition/PositionTreeTable'
  import { getTopOrgList } from '@/api/sys/orgAPI'
  export default {
    components: {
      PositionTreeTable
    },
    data() {
      return {
        positionQueryModel: {
          code: '',
          name: '',
          status: '',
          pageNum: 1,
          pageSize: 20,
          count: 0
        },
        filterText: '',
        treeData: [],
        externalData: [],
        defaultProps: {
          children: 'children',
          label: 'orgName'
        },
        currentOrg: {}
      }
    },
    created: function() {
      this.initLeftMenuTree()
    },
    watch: {
      filterText(val) {
        this.$refs.orgTree.filter(val)
      },
      multipleSelection: function() {
        this.apiSelected = []
        for (const i in this.multipleSelection) {
          this.apiSelected.push(this.multipleSelection[i])
        }
      }
    },
    methods: {
      initLeftMenuTree() {
        getTopOrgList().then(response => {
          console.log(response.data)
          this.treeData = response.data
        })
      },
      reset() {
        this.positionQueryModel.code = ''
        this.positionQueryModel.name = ''
        this.positionQueryModel.status = ''
      },
      initVM() {
        this.positionQueryModel.pageNum = 1
        this.positionQueryModel.count = 0
        this.positionQueryModel.sortBy = ''
        this.positionQueryModel.order = -1
      },
      add() {
        if (!this.currentOrg || !this.currentOrg.id) {
          this.$showError('lbl_org_first')
          return
        }
        this.$router.push({
          name: 'NewOrUpdatePosition',
          query: { org: this.currentOrg, handleType: '' }
        })
      },
      getPositionList() {
        this.initVM()
        this.$refs.PositionTable.getList()
      },
      filterNode(value, data) {
        if (!value) return true
        return (data.orgName.indexOf(value) !== -1) || (data.orgName.indexOf(value) !== -1)
      },
      getNodeData(data) {
        this.currentOrg = data
        this.$refs.PositionTable.getList(data.orgCode)
      }
    }
  }
</script>
