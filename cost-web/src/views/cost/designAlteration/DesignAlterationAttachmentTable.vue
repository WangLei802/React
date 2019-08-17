<!-- IneffectiveCostTable -->
<template>
  <div ref="designAlterationAttachmentTable">
    <el-table :data="tableData"
              stripe
              size="small"
              border
              tooltip-effect="dark"
              style="width: 100%">


      <el-table-column type="index"
                       :index="this.$getTableIndex(this.queryObj)"
                       :label="this.$l('lbl_no')"
                       width="80"></el-table-column>

      <!-- 附件名称 -->
      <el-table-column  :label="'附件名称'" prop="name">
      </el-table-column>

      <!-- 上传日期 -->
      <el-table-column width="200px"  :label="'上传日期'" prop="uploadDate">
        <template slot-scope="scope">
          {{ scope.row.uploadDate | dateFormat('yyyy-MM-dd')}}
        </template>
      </el-table-column>

      <!-- 操作 -->
      <el-table-column :label="this.$l('lbl_operation')"
                       width="100px">
        <template slot-scope="scope">

          <!-- 下载 -->
          <el-button size="mini"
                     type="text"
                     icon="el-icon-download"
                     :title="'下载'"
                     @click="downLoad(scope.$index, scope.row)"></el-button>

          <!-- 删除 -->
          <el-button size="mini"
                     type="text"
                     v-if="showDeleteButton"
                     icon="el-icon-delete"
                     :title="$l('btn_delete')"
                     @click="deleteRow(scope.$index, scope.row)"></el-button>
        </template>
      </el-table-column>

    </el-table>
  </div>
</template>

<script>
  import { FileUtil } from '@/utils/common/common'
  import { NumFormat, Version, dateFormat } from '@/filters/cost/'
  export default {
    props: {
      queryObj_passed_in: {
        type: Object
      },
      attaData: {
        type: Array
      },
      showDeleteButton: {
        type: Boolean,
        default: true

      }
    },
    filters: {
      NumFormat,
      Version,
      dateFormat
    },
    data() {
      return {
        tableData: this.attaData,
        designAlterationAttachmentModel: {},
        queryObj: this.queryObj_passed_in,
        tableHeight: '0',
        fullHeight: document.documentElement.clientHeight
      }
    },
    methods: {
      // 下载
      downLoad(index, rowData) {
        window.open(rowData.fileUrl)
      },
      deleteRow(index, rowData) {
        this.$confirm('确认删除该记录', {
          confirmButtonText: this.$l('btn_confirm'),
          cancelButtonText: this.$l('btn_cancel'),
          type: 'warning'
        }).then(() => {
          this.$delete(this.tableData, index)
          // 向父组件传值
          this.$emit('changeAttachments', this.tableData)
        })
          .catch(() => {
          })
      }
    },
    mounted: function() {
      console.log('嘟嘟嘟嘟嘟')
      console.log(this.queryObj_passed_in)
      console.log(this.$getTableIndex(this.queryObj_passed_in))
    },
    watch: {
      'attaData': function(newValue, oldValue) {
        this.tableData = this.attaData
      }
    }
  }
</script>

