
<template>
  <div ref="positionTable">
    <el-table :height="tHeight" :data="tableData" stripe  border style="width: 100%"
    @row-click="rowClick">
      <!--<template slot-scope="row" @click="disableOrActivate">-->
        <el-table-column type="index" :index="this.$getTableIndex(this.queryObj)" :label="this.$l('lbl_no')" width="80"></el-table-column>
        <el-table-column prop="name" :label="this.$l('lbl_position_name')" ></el-table-column>
        <el-table-column prop="code" :label="this.$l('lbl_position_code')" ></el-table-column>
        <!--<el-table-column prop="updatedDate" :label="this.$l('lbl_update_date')" width="200" :formatter='this.$dateFormat("updatedDate")'></el-table-column>-->
        <!--<el-table-column  :label="this.$l('lbl_status')">-->
          <!--<template slot-scope="scope">-->
            <!--<fd-label :code="scope.row.status" type="sys_status"></fd-label>-->
          <!--</template>-->
        <!--</el-table-column>-->
      <!--</template>-->


      <!--<el-table-column :label="this.$l('lbl_operation')" width="200">-->
        <!--<template slot-scope="scope">-->
          <!--<el-button type="text" icon="el-icon-edit" :title="$l('btn_edit')" @click="editRow(scope.$index, scope.row)"></el-button>-->
          <!--<el-button v-if="scope.row.status == '1'" type="text" icon="el-icon-remove-outline" :title="$l('btn_disable')" @click="disableOrActivate(scope.$index, scope.row)"></el-button>-->
          <!--<el-button v-else type="text" icon="el-icon-circle-check" :title="$l('btn_enable')" @click="disableOrActivate(scope.$index, scope.row)"></el-button>-->
          <!--<el-button type="text" icon="el-icon-delete" :title="$l('btn_delete')" @click="deleteIndex(scope.$index, scope.row)"></el-button>-->
        <!--</template>-->
      <!--</el-table-column>-->
    </el-table>
    <!--<div class='pagination_bar'>-->
      <!--<mt-pagination @size-change='handleSizeChange' @current-change='handleCurrentChange' :current-page.sync='queryObj.pageNum' :page-sizes='[10, 20, 30, 40]' :page-size='queryObj.pageSize' layout='sizes, prev, pager, next' :total='queryObj.count'>-->
      <!--</mt-pagination>-->
    <!--</div>-->
  </div>
</template>
<script>
  import { getPositionList, positionLifecycle, deletePosition } from '@/api/sys/positionAPI'
  import { positionListAll } from '@/api/sys/orgAPI'
  import { LoadingUtil } from '@/utils/common/LoadingUtil'
  import { tableHeight } from '@/utils/common/index'
  export default {
    props: {
      queryObj_passed_in: {
        type: Object
      },
      externalData: {
        type: Array,
        default: function() {
          return []
        }
      }
    },
    computed: {
      tHeight: function() {
        let options = {
          fullHeight: this.$store.getters.fullHeight,
          opened: this.$store.getters.sidebar.opened,
          showForm: this.$store.getters.showForm,
          obj: this,
          formHeight: 56
        }
        return `${tableHeight(options)}px`
      }
    },
    data() {
      return {
        tableHeight: '0',
        tableData: [],
        queryObj: this.queryObj_passed_in,
        fullHeight: document.documentElement.clientHeight
      }
    },
    methods: {
      editRow(index, rowData) {
        this.$router.push({
          name: 'NewOrUpdatePosition',
          query: { id: rowData.id }
        })
      },
      settingTableHeight: function() {
        const topHeight = this.$refs['positionTable'].getBoundingClientRect().top
        this.tableHeight = this.fullHeight - topHeight - 80
        this.$refs['positionTable'].style.Height = this.tableHeight + 'px'
      },
      getList() {
        LoadingUtil.showLoading()

        positionListAll(this.queryObj)
          .then(response => {
            LoadingUtil.hideLoading()
            this.tableData = response.data
          })
          .catch(error => {
            console.log(error)
          })
      },
      deleteIndex(index, row) {
        this.$confirm(this.$l('msg_delete_confirm'), this.$l('msg_delete_tips'), {
          confirmButtonText: this.$l('btn_confirm'),
          cancelButtonText: this.$l('btn_cancel'),
          type: 'warning'
        }).then(() => {
          LoadingUtil.showLoading()
          deletePosition(row.id).then(response => {
            LoadingUtil.hideLoading()
            this.$showSuccess(response.message)
            this.getList()
          }).catch(error => {
            console.log(error)
          })
        }).catch(() => {})
      },
      handleSizeChange(val) {
        this.queryObj.pageSize = val
        this.getList()
      },
      handleCurrentChange(val) {
        this.queryObj.pageNum = val
        this.getList()
      },
      // disableOrActivate(index, row) {
      //   const params = {
      //     id: row.id,
      //     status: row.status
      //   }
      //   positionLifecycle(params)
      //     .then(response => {
      //       if (response.code === '2000') {
      //         this.$showSuccess(response.message)
      //         this.getList()
      //       } else {
      //         this.$showError(response.message)
      //       }
      //     })
      //     .catch(error => {
      //       console.log(error)
      //     })
      // }
      // disableOrActivate: function() {
      //   alert(1)
      // }
      rowClick: function(row, evt, column) {
        this.$emit('initUser', row)
      }
    },

    mounted: function() {
      this.getList()
      this.$nextTick(function() {
        this.settingTableHeight()
      })
    },
    watch: {
      fullHeight(val) {
        this.settingTableHeight()
      }
    }
  }
</script>
