
<template>
  <div ref="resourceTable">
    <el-table :data="tableData" stripe  border style="width: 100%">
      <el-table-column prop="appName" label="应用名称" ></el-table-column>
      <el-table-column prop="moduleName" label="模块名称" ></el-table-column>
      <el-table-column prop="name" :label="this.$l('lbl_resource_name')" >
        <template slot-scope="scope">
          <span v-if="!scope.row.editFlag">{{ scope.row.name }}</span>
          <span v-if="scope.row.editFlag" class="cell-edit-input">
        <el-input v-model="scope.row.name" placeholder="请输入内容"></el-input></span>
        </template>
      </el-table-column>
      <el-table-column prop="apiCode" :label="this.$l('lbl_resource_code')" ></el-table-column>

      <el-table-column prop="apiEndpoint" :label="this.$l('lbl_resource_address')" ></el-table-column>
      <el-table-column prop="typeName" :label="this.$l('lbl_api_type')" ></el-table-column>

      <el-table-column :label="this.$l('lbl_operation')" width="180">
        <template slot-scope="scope">
          <el-button v-if="scope.row.editFlag" type="primary" :title="$l('btn_edit')" @click="saveRow(scope.$index, scope.row)">{{$l("btn_save")}}</el-button>
          <el-button v-if="!scope.row.editFlag" type="primary" :title="$l('btn_edit')" @click="editRow(scope.$index, scope.row)">{{$l("btn_edit")}}</el-button>
          <el-button type="danger" :title="$l('btn_edit')" @click="handleDelete(scope.$index, scope.row)">{{$l("btn_delete")}}</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
  import Vue from 'vue'
  import { getListByMenuId, deleteResource, saveResource, updateResource, createResource } from '@/api/platform/resourceAPI'
  import { LoadingUtil } from '@/utils/common/LoadingUtil'

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
    data() {
      return {
        tableHeight: '0',
        tableData: [],
        queryObj: this.queryObj_passed_in,
        fullHeight: document.documentElement.clientHeight
      }
    },
    methods: {
      saveRow(index, rowData) {
        // TODO 表单校验

        LoadingUtil.showLoading()
        if (rowData.id) {
          updateResource(rowData) // updateResource(saveData)
            .then(response => {
              LoadingUtil.hideLoading()
              if (response.code === '2000') {
                rowData.editFlag = false
                rowData.version = response.data.version
                Vue.set(this.tableData, index, rowData)
                this.$showSuccess(response.message || '保存成功')
              } else {
                this.$showError(response.message || '保存失败')
              }
            })
            .catch(error => {
              console.log(error)
            })
        } else {
          saveResource(rowData) // updateResource(saveData)
            .then(response => {
              LoadingUtil.hideLoading()
              if (response.code === '2000') {
                rowData.id = response.data.id
                rowData.editFlag = false
                Vue.set(this.tableData, index, rowData)
                this.$showSuccess(response.message || '保存成功')
              } else {
                this.$showError(response.message || '保存失败')
              }
            })
            .catch(error => {
              console.log(error)
            })
        }
      },
      editRow(index, rowData) {
        rowData.editFlag = true
        Vue.set(this.tableData, index, rowData)
      },
      settingTableHeight: function() {
        const topHeight = this.$refs['resourceTable'].getBoundingClientRect().top
        this.tableHeight = this.fullHeight - topHeight - 80
        this.$refs['resourceTable'].style.Height = this.tableHeight + 'px'
      },
      getList() {
        if (this.queryObj.menuId) {
          LoadingUtil.showLoading()
          getListByMenuId(this.queryObj)
            .then(response => {
              LoadingUtil.hideLoading()
              response.data.forEach((v) => { v.typeName = v.type === '1' ? 'api组' : 'api' })

              this.tableData = response.data
            })
            .catch(error => {
              console.log(error)
            })
        }
      },
      handleDelete(index, row) {
        if (row.id) {
          this.$confirm('确定要删除？', '删除提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            deleteResource(row).then(() => {
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '删除成功',
                type: 'success',
                duration: 2000
              })
              // const index = this.tableData.indexOf(row)
              this.tableData.splice(index, 1)
            })
          })
        } else {
          this.tableData.splice(index, 1)
        }
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
