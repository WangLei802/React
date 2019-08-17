<template>
    <div style="height:auto;overflow:hidden">
        <el-dialog :close-on-click-modal="false"
                   :close-on-press-escape="false"
                   title="供应商"
                   :visible.sync="supplierInfor"
                   width="80%"
                   :show-close="false"
                   :before-close="handleClose">
            <div >
            <mt-searchform style="margin-top: -30px;">
              <template slot="buttons">
                        <el-button size="mini" @click="cancel">取 消</el-button>
                <el-button size="mini" type="primary"
                           @click="submit">确 定</el-button>
                    </template>
              <template slot="form">
                <el-row>
                  <el-col :span="8">
                    <el-form-item label='供应商编号：'>
                      <el-input v-model='queryModel.providerCode'></el-input>
                    </el-form-item>

                  </el-col>

                  <el-col :span="8">
                    <el-form-item label='供应商名称：'>
                      <el-input v-model='queryModel.providerName'></el-input>
                    </el-form-item>
                  </el-col>

                  <el-col :span="8"
                          class="search-btn">
                    <el-form-item>
                      <el-button size="mini"
                                 type="info"
                                 @click='getTableList'>{{$l("btn_search")}}</el-button>
                      <el-button size="mini"
                                 @click='reset'>{{$l("btn_reset")}}</el-button>
                    </el-form-item>
                  </el-col>

                </el-row>
              </template>
            </mt-searchform>
            <el-table :data="tableData"
                        stripe
                        border
                         height="400"
                        tooltip-effect="dark"
                        size="small">
             <el-table-column label="选择"
                              width="80"
                              type="index">
               <template slot-scope="scope">
                 <el-radio v-model="checkedRow"
                           :label="scope.row">&nbsp;</el-radio>
               </template>
             </el-table-column>

                  <!--<el-table-column prop="providerGrade"-->
                                   <!--label="供应商分类"-->
                                   <!--width="150">-->
                     <!---->
                  <!--</el-table-column>-->

             <el-table-column :label="$l('lbl_no')"
                              width="50"
                              type="index">

             </el-table-column>
                  <el-table-column prop="providerCode"
                                   show-overflow-tooltip
                                   label="供应商编号"
                                   >

                  </el-table-column>
                  <el-table-column prop="providerName"
                                   label="供应商名称">

                  </el-table-column>



              </el-table>

            </div>
            <div class='pagination_bar'>
              <mt-pagination @size-change='handleSizeChange'
                             @current-change='handleCurrentChange'
                             :current-page.sync='queryModel.pageNum'
                             :page-sizes='[10, 20, 30, 40]'
                             :page-size='queryModel.pageSize'
                             layout='sizes, prev, pager, next'
                             :total='queryModel.count'>
              </mt-pagination>
            </div>
            <!-- <span slot="footer"
                  class="dialog-footer">
                <el-button size="mini" @click="cancel">取 消</el-button>
                <el-button size="mini" type="primary"
                           @click="submit">确 定</el-button>
            </span> -->
        </el-dialog>
    </div>
</template>
<script>
import { supplierInfo } from '@/api/cost/signContractAPI'
export default {
  props: {
    supplierInfor: {
      type: Boolean

    }
  },
  data() {
    return {
      checkedRow: {},
      tableData: [],
      queryModel: {
        providerCode: '',
        providerName: '',
        pageNum: 1,
        pageSize: 20,
        count: 0
      }

    }
  },
  mounted() {
    this.getTableList()
  },
  watch: {
    'queryModel': {
      handler(newValue, oldValue) {
        debugger
        if (newValue.providerCode !== '' || newValue.providerName !== '') {
          this.queryModel.pageNum = 1
        }
      },
      deep: true
    }
  },
  methods: {
    onSearch() {},
    submit() {
      this.$emit('closeSupplierInfor', this.checkedRow)
      this.$emit('closeSupplierInfor1', this.checkedRow)
    },
    getTableList() {
      supplierInfo(this.queryModel).then(response => {
        this.tableData = response.data.content ? response.data.content : []
        this.queryModel.count = response.data.totalElements
      }).catch(error => {
        console.log(error)
        this.$showError(error.message ? error.message : 'msg_system_error')
      })
    },
    cancel() {
      this.$emit('closeSupplierInfor')
      this.$emit('closeSupplierInfor1')
    },
    handleClose(done) {
    },
    handleSizeChange(val) {
      this.queryModel.pageSize = val
      this.getTableList()
    },
    handleCurrentChange(val) {
      this.queryModel.pageNum = val
      this.getTableList()
    },
    reset() {
      this.queryModel.providerCode = ''
      this.queryModel.providerName = ''
    }

  }
}
</script>
<style scoped>
.el-dialog__headerbtn {
  display: none;
}
</style>
