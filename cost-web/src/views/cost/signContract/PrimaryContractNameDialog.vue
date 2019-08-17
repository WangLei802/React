<template>
    <div>
        <el-dialog title="主合同选择"
                   :close-on-click-modal="false"
                   :close-on-press-escape="false"
                   :visible.sync="primaryContract"
                     :show-close="false"
                   width="60%"
                   :before-close="handleClose">
            <div >
               <!-- <ProjectSelector :queryModel='queryModel'></ProjectSelector> -->
                <el-table :data="tableData"
                          style="width: 100%"
                          size="small"
                          stripe border>
                    <el-table-column label="选择"
                                     width="50">
                        <template slot-scope="scope">

                            <el-radio  v-model="checkedForm"
                                         :label="scope.row.contractCode+'##'+scope.row.contractName ">&nbsp;</el-radio>
                        </template>
                    </el-table-column>
                    <el-table-column label="主合同名称"
                                     prop="primaryContractName"
                                     >
                      <template slot-scope="scope">
                        {{scope.row.contractCode+'##'+scope.row.contractName }}
                      </template>

                    </el-table-column>

                </el-table>
            </div>
           
            <span slot="footer"
                  class="dialog-footer">
                <el-button size="mini" @click="cancel">取 消</el-button>
                <el-button size="mini" type="primary"
                           @click="submit">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import { getPrimaryContracts } from '@/api/cost/signContractAPI'
import ProjectSelector from '@/components/cost/ProjectSelector/'
export default {
  props: {
    primaryContract: {
      type: Boolean
    },
    accountingObjectId: {
      type: String
    },
    value: {
      type: String
    }

  },
  data() {
    return {
      checkedForm: {},
      tableData: []

    }
  },
  mounted: function() {
    this.getList()
  },
  components: {
    ProjectSelector

  },
  watch: {
    // 有项目名称之后 查找法人公司
    // 'form.projectName': function(val) {
    //   if (val) {
    //     this.selectIncorporatCompany()
    //   }
    // }
  },
  methods: {
    deepCopy(data) {
      return JSON.parse(JSON.stringify(data))
    },
    // 获取列表
    getList() {
      let _queryObj = {

        accountingObjectId: this.accountingObjectId
        // accountingObjectId: '7ecfea3f-679c-4499-904a-08b4cc7852f5'
      }
      getPrimaryContracts(_queryObj)
        .then(response => {
          this.tableData = response.data ? response.data : ''
        })
        .catch(error => {
          console.log(error)
          this.$showError(error.message ? error.message : 'msg_system_error')
        })
    },

    submit() {
      this.$emit('closePrimaryContract', this.checkedForm)
    },
    cancel() {
      this.$emit('closePrimaryContract')
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => { })
    }
  }
}
</script>
<style scoped>
.el-dialog__headerbtn {
  display: none;
}
</style>
