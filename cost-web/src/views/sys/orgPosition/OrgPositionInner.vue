<template>
  <el-row :gutter="10">
    <div style="text-align:right;margin:10px 20px 10px 0;">
      <el-button  icon='el-icon-plus' type='primary' @click='add'>{{$l("btn_add")}}</el-button>
    </div>
    <el-col :span="5" :style="{height: tHeight + 'px'}">
      <el-input placeholder="输入关键字进行过滤" v-model="filterText"> </el-input>
      <el-tree class="filter-tree" check-strictly node-key="id"
               :data="treeData" highlight-current :props="defaultProps"
               @node-click="getNodeData"
               :filter-node-method="filterNode"
               ref="orgTree" default-expand-all :expand-on-click-node="false" 
               :style="{height: (tHeight-30) + 'px'}">
      </el-tree>
    </el-col>
    <el-col :span="19">
      <PositionTreeTable :queryObj_passed_in='positionQueryModel' ref='PositionTreeTable'></PositionTreeTable>
    </el-col>
  </el-row>
</template>
<script>
  import { tableHeight } from '@/utils/common/index'
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
        externalData: [],
        filterText: '',
        treeData: [],
        defaultProps: {
          children: 'children',
          label: 'orgName'
        },
        currentOrg: {}
      }
    },
    computed: {
      tHeight: function() {
        let options = {
          fullHeight: this.$store.getters.fullHeight,
          opened: this.$store.getters.sidebar.opened,
          otherHeight: 150,
          obj: this
        }
        return `${tableHeight(options)}`
      }
    },
    mounted: function() {
      getTopOrgList().then(response => {
        console.log(response.data)
        this.treeData = response.data
      })
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
          query: { org: this.currentOrg, handleType: '', orgName: this.currentOrg.orgCode }
        })
      },
      getPositionList() {
        this.initVM()
        this.$refs.PositionTreeTable.getList()
      },
      filterNode(value, data) {
        if (!value) return true
        return (data.orgName.indexOf(value) !== -1) || (data.orgName.indexOf(value) !== -1)
      },
      getNodeData(data) {
        this.currentOrg = data
        let params = { orgCode: data.orgCode, orgName: data.orgName }
        this.$refs.PositionTreeTable.getList(params)
      }
    }
  }
</script>
