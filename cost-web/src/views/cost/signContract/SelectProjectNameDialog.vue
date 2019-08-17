<template>
    <div>
        <el-dialog title="项目名称选择"
                   :close-on-click-modal="false"
                   :close-on-press-escape="false"
                   :visible.sync="dialogVisible"
                   width="60%"
                    :show-close="false"
                   :before-close="handleClose">
            <div v-if="!projectId"> 
               <!-- <ProjectSelector :queryModel='queryModel'></ProjectSelector> -->
                <el-table :data="selectData.projectList"
                          style="width: 100%"
                          size="small">
                    <el-table-column label="选择"
                                     width="50">
                        <template slot-scope="scope">
                            <el-checkbox v-model="checkedForm"
                                         :label="scope.row.id+'##'+scope.row.text ">&nbsp;</el-checkbox>
                        </template>
                    </el-table-column>
                    <el-table-column label="项目名称"
                                     prop="text"
                                     >
                    </el-table-column>
                    
                </el-table>
            </div>
            <div v-else> 
               <!-- <ProjectSelector :queryModel='queryModel'></ProjectSelector> -->
                <el-table :data="selectData.accountList"
                          style="width: 100%"
                        size="small">
                    <el-table-column label="选择"
                                     width="50">
                        <template slot-scope="scope">
                            <el-checkbox v-model="checkedForm"
                                         :label="scope.row.id+'##'+scope.row.text ">&nbsp;</el-checkbox>
                        </template>
                    </el-table-column>
                    <el-table-column label="成本分期名称"
                                     prop="text"
                                     >
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
import { getProjectTargetTree } from '@/api/cost/selectTargetCostAPI'
import ProjectSelector from '@/components/cost/ProjectSelector/'
export default {
  props: {
    dialogVisible: {
      type: Boolean
    },
    projectId: {
      type: String
    },
    value: {
      type: Array
    }
  },
  data() {
    return {
      totalData: {
        allData: [], // 所有展开数据
        groupList: [],
        companyList: [],
        deptList: [],
        projectList: [],
        accountList: []
      },
      selectData: {
        groupList: [],
        companyList: [],
        deptList: [],
        projectList: [],
        accountList: []
      },
      checkedForm: [],
      tableData3: [{

      }],
      queryModel: {
        group: '',
        company: '',
        businessDept: '',
        accountingObjectId: '',
        stageId: '',
        status: '',
        pageNum: 1,
        pageSize: 20,
        count: 0,
        companyId: '',
        show: {
          group: true,
          company: true,
          dept: true,
          account: true
        }

      }
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
    'form.projectName': function(val) {
      if (val) {
        this.selectIncorporatCompany()
      }
    }
  },
  methods: {
    deepCopy(data) {
      return JSON.parse(JSON.stringify(data))
    },
    // 获取列表
    getList() {
      getProjectTargetTree()
        .then(response => {
          this.initData(response)
        })
        .catch(error => {
          console.log(error)
          this.$showError(error.message ? error.message : 'msg_system_error')
        })
    },
    // 初始化数据
    initData(response) {
      this.data = response.data
      this.initGroupSelect(true)
      this.initCompaySelect(true)
      this.initDeptSelect(true)
      this.initProjectSelect(true)
      this.initAccountSelect(true)

      // 所有展开数据
      this.totalData.allData.concat(this.totalData.groupList, this.totalData.companyList, this.totalData.deptList, this.totalData.projectList)
    },

    initDeptSelect(isInit) {
      // 事业部
      let _deptArray = []
      if (isInit) {
        this.selectData.companyList.map(item => {
          if (item && item.children && item.children.length > 0) _deptArray = _deptArray.concat(item.children)
        })
      } else {
        this.queryObj.deptId = ''
        if (this.queryObj.companyId) {
          _deptArray = this.selectData.companyList.find(item => { return item.id === this.queryObj.companyId }).children
        } else {
          _deptArray = this.deepCopy(this.totalData.deptList)
          this.initProjectSelect()
        }
      }
      this.selectData.deptList = _deptArray
      if (isInit) this.totalData.deptList = this.deepCopy(this.selectData.deptList)
    },
    initGroupSelect(isInit) {
      // 集团
      this.selectData.groupList = this.data[0].children
      if (isInit) this.totalData.groupList = this.deepCopy(this.selectData.groupList)
    },
    initCompaySelect(isInit) {
      // 公司
      let _companyArray = []
      if (isInit) {
        this.selectData.groupList.map(item => {
          if (item && item.children && item.children.length > 0) _companyArray = _companyArray.concat(item.children)
        })
      } else {
        this.queryObj.companyId = ''
        if (this.queryObj.groupId) {
          _companyArray = this.selectData.groupList.find(item => { return item.id === this.queryObj.groupId }).children
        } else {
          _companyArray = this.deepCopy(this.totalData.companyList)
          this.initDeptSelect()
        }
      }
      this.selectData.companyList = _companyArray
      if (isInit) this.totalData.companyList = this.deepCopy(this.selectData.companyList)
    },
    initProjectSelect(isInit) {
      // 项目
      let _projectArray = []
      if (isInit) {
        this.selectData.deptList.map(item => {
          if (item && item.children && item.children.length > 0) _projectArray = _projectArray.concat(item.children)
        })
      }
      this.selectData.projectList = _projectArray
      if (this.projectId) {
        this.initAccountSelect()
      }
      if (isInit) this.totalData.projectList = this.deepCopy(this.selectData.projectList)
    },
    initAccountSelect(isInit) {
      let _accountArray = []
      if (isInit) {
        this.selectData.projectList.map(item => {
          if (item && item.children && item.children.length > 0) _accountArray = _accountArray.concat(item.children)
        })
      }
      this.selectData.accountList = _accountArray
      if (isInit) this.totalData.accountList = this.deepCopy(this.selectData.accountList)
    },
    // 法人公司赋值
    selectIncorporatCompany() {

    },
    submit() {
      this.$emit('input', this.checkedForm)
      this.cancel()
    },
    cancel() {
      this.$emit('closeDialogDialogVisible')
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
