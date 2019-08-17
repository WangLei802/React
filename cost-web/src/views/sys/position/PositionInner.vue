<template>
  <div>
    <mt-searchform>
      <template slot="buttons">
        <el-button  icon='el-icon-plus' type='primary' @click='add'>{{$l("btn_add")}}</el-button>
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
    <PositionTable :queryObj_passed_in='positionQueryModel' ref='PositionTable'></PositionTable>
  </div>
</template>
<script>
  import PositionTable from '@/views/sys/position/PositionTable'
  export default {
    components: {
      PositionTable
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
        this.$router.push({
          name: 'NewOrUpdatePosition'
        })
      },
      getPositionList() {
        this.initVM()
        this.$refs.PositionTable.getList()
      }
    }
  }
</script>
