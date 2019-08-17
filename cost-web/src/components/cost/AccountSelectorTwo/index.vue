<template>
  <div>
    <el-col :span="span.project"
            v-show="show.project">
      <el-form-item label="项目名称："
                    prop="projectName">
        <el-select v-model="queryObj.projectId"
                   :label-width="labelWidth.project+'px'"
                   filterable
                   clearable
                   placeholder="请选择"
                   @change="changeSelect(ENUMTYPE.PROJECT,$event)"
                   @clear="clearSelect(ENUMTYPE.PROJECT)"
                   :disabled="disabled.project">
          <el-option v-for="(item,index)  in selectData.projectList"
                     :key="index"
                     :label="item.text"
                     :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
    </el-col>
    <el-col :span="span.accObj"
            v-show="show.accObj">
      <el-form-item label="成本分期："
                    prop="accountObjectName">
        <el-select v-model="queryObj.accObjId"
                   ref="NewOrUpdateCostConfirm"
                   :label-width="labelWidth.accObj+'px'"
                   filterable
                   clearable
                   placeholder="请选择"
                   @change="changeSelect(ENUMTYPE.ACC_OBJ,$event)"
                   @clear="clearSelect(ENUMTYPE.ACC_OBJ)"
                   :disabled="disabled.accObj">
          <el-option v-for="(item,index)  in selectData.accObjList"
                     :key="index"
                     :label="item.text"
                     :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
    </el-col>
  </div>
</template>
<script>
import { getProjectAccountingTargetTree } from '@/api/cost/selectTargetCostAPI'
import { getThrowDetail } from '@/api/cost/keepCostConfirm'
import { getLocalItem, setLocalItem } from '@/utils/common/cache'
import { mapGetters } from 'vuex'
import NewOrUpdateCostConfirm from '@/views/cost/costConfirmation/NewOrUpdateCostConfirm'
import COSTENUM from '@/utils/cost/enum'

export default {
  name: 'ProjectSelector',
  props: {
    value: {
      type: Object,
      default: function () {
        return {
          companyId: '', // 可能是groupId ||  companyId || deptId
          projectId: '', // 项目id
          projectName: '', // 项目名称
          accObjId: '', // 成本分期id
          accObjName: ''
        }
      }
    },
    // 标签宽度
    labelWidth: {
      type: Object,
      default: function () {
        return {
          group: 120,
          company: 120,
          dept: 120,
          project: 120,
          accObj: 120
        }
      }
    },
    // 列宽
    span: {
      type: Object,
      default: function () {
        return {
          group: 8,
          company: 8,
          dept: 8,
          project: 8,
          accObj: 8
        }
      }
    },
    // 禁用
    disabled: {
      type: Object,
      default: function () {
        return {
          project: false,
          accObj: false
        }
      }
    },
    show: {
      type: Object,
      default: function () {
        return {
          group: true,
          company: true,
          dept: true,
          project: true,
          accObj: true,
          costModel: true
        }
      }
    }
  },
  data: function () {
    return {
      rules: {
        projectName: [{ message: '请输入项目名称', required: true, trigger: 'blur' }]
      },
      ENUMTYPE: {
        'GROUP': 'GROUP',
        'COMPANY': 'COMPANY',
        'DEPT': 'DEPT',
        'PROJECT': 'PROJECT',
        'ACC_OBJ': 'ACC_OBJ'
      },
      data: [],
      queryObj: {
        groupId: '',
        companyId: '',
        deptId: '',
        projectId: '',
        accObjId: '',
        accObjName: '',
        throwDetailData: '',
        projectName: '',
      },
      totalData: {
        allData: [], // 所有展开数据
        groupList: [],
        companyList: [],
        deptList: [],
        projectList: [],
        accObjList: []
      },
      selectData: {
        groupList: [],
        companyList: [],
        deptList: [],
        projectList: [],
        accObjList: []
      },
      throwDetailData: ''
    }
  },
  computed: {
    ...mapGetters(['selectOrg'])
  },
  components: {
    NewOrUpdateCostConfirm,
  },
  mounted: function () {
    this.getList()
    this.initValue(true)
  },
  methods: {
    deepCopy (data) {
      return JSON.parse(JSON.stringify(data))
    },
    initValue (init) {
      // debugger
      // parentIds
      let _item = this.totalData.allData.find(item => { return item.id === this.value.companyId })
      if (_item) {
        switch (_item.type) {
          case COSTENUM.projectTreeType.TREE_NODE_GROUP:
            this.queryObj.groupId = this.value.companyId
            if (!init) {
              this.initCompanySelect()
              this.initDeptSelect()
              this.initProjectSelect()
              this.initAccObjSelect()
            }
            break
          case COSTENUM.projectTreeType.TREE_NODE_COMPANY:
            this.queryObj.companyId = this.value.companyId
            if (!init) {
              this.initDeptSelect()
              this.initProjectSelect()
              this.initAccObjSelect()
            }
            break
          case COSTENUM.projectTreeType.TREE_NODE_DEPT:
            this.queryObj.deptId = this.value.companyId
            if (!init) {
              this.initProjectSelect()
              this.initAccObjSelect()
            }
            break
          default:
            break
        }
      }
      // alert(JSON.stringify(this.value))
      this.queryObj.projectId = this.value.projectId

      if (this.queryObj.projectId) {
        this.initAccObjSelect()
      }
      this.queryObj.accObjId = this.value.accObjId

    },
    emitValue (companyId, projectId, objId, projectName) {
      let _companyId = companyId
      if (!_companyId) {
        if (this.queryObj.deptId) {
          _companyId = this.queryObj.deptId
        } else if (this.queryObj.companyId) {
          _companyId = this.queryObj.companyId
        } else if (this.queryObj.groupId) {
          _companyId = this.queryObj.groupId
        } else {
          _companyId = ''
        }
      }
      // debugger
      this.$emit('input', {
        companyId: _companyId,
        projectId: projectId || this.queryObj.projectId,
        accObjId: objId || this.queryObj.accObjId,
        accObjName: objId || this.queryObj.accObjName,
        projectName: projectName || this.queryObj.projectName,
      })
    },
    initGroupSelect (isInit) {
      // 集团
      this.selectData.groupList = this.data && this.data.length > 0 ? this.data[0].children : []
      if (isInit) this.totalData.groupList = this.deepCopy(this.selectData.groupList)

      // 所有展开数据
      if (isInit) this.totalData.allData = this.totalData.allData.concat(this.totalData.groupList)
    },
    initCompanySelect (isInit) {
      // 公司
      let _companyArray = []
      if (isInit) {
        this.selectData.groupList.map(item => {
          if (item && item.children && item.children.length > 0) _companyArray = _companyArray.concat(item.children)
        })
      } else {
        // this.queryObj.companyId = ''
        this.queryObj.deptId = ''
        if (this.queryObj.groupId) {
          let _group = this.selectData.groupList.find(item => { return item.id === this.queryObj.groupId })
          _companyArray = _group ? _group.children : this.deepCopy(this.totalData.companyList)
        } else {
          _companyArray = this.deepCopy(this.totalData.companyList)
          this.initDeptSelect()
        }
      }
      this.selectData.companyList = _companyArray
      if (isInit) this.totalData.companyList = this.deepCopy(this.selectData.companyList)

      // 所有展开数据
      if (isInit) this.totalData.allData = this.totalData.allData.concat(this.totalData.companyList)
    },
    initDeptSelect (isInit) {
      // 事业部
      let _deptArray = []
      if (isInit) {
        this.selectData.companyList.map(item => {
          if (item && item.children && item.children.length > 0) _deptArray = _deptArray.concat(item.children)
        })
      } else {
        // this.queryObj.deptId = ''
        // this.queryObj.projectId = ''
        if (this.queryObj.companyId) {
          let _company = this.selectData.companyList.find(item => { return item.id === this.queryObj.companyId })
          _deptArray = _company ? _company.children : this.deepCopy(this.totalData.deptList)
        } else {
          _deptArray = this.deepCopy(this.totalData.deptList)
          this.initProjectSelect()
        }
      }
      this.selectData.deptList = _deptArray
      if (isInit) this.totalData.deptList = this.deepCopy(this.selectData.deptList)

      // 所有展开数据
      if (isInit) this.totalData.allData = this.totalData.allData.concat(this.totalData.deptList)
    },
    initProjectSelect (isInit) {
      // 项目
      let _projectArray = []
      if (isInit) {
        this.selectData.deptList.map(item => {
          if (item && item.children && item.children.length > 0) _projectArray = _projectArray.concat(item.children)
        })
      } else {
        // this.queryObj.projectId = ''
        if (this.queryObj.deptId) {
          let _dept = this.selectData.deptList.find(item => { return item.id === this.queryObj.deptId })
          _projectArray = _dept ? _dept.children : this.deepCopy(this.totalData.projectList)
        } else {
          _projectArray = this.deepCopy(this.totalData.projectList)
        }
      }
      this.selectData.projectList = _projectArray
      if (isInit) this.totalData.projectList = this.deepCopy(this.selectData.projectList)

      // 所有展开数据
      if (isInit) this.totalData.allData = this.totalData.allData.concat(this.totalData.projectList)
    },
    initAccObjSelect (isInit) {
      // 成本分期

      let _accObjArray = []
      if (isInit) {
        this.selectData.projectList.map(item => {
          if (item && item.children && item.children.length > 0) {
            _accObjArray = _accObjArray.concat(item.children)
          }
        })
      } else {
        // this.queryObj.projectId = ''
        if (this.queryObj.projectId) {
          let _project = this.selectData.projectList.find(item => { return item.id === this.queryObj.projectId })
          _accObjArray = _project ? _project.children : this.deepCopy(this.totalData.accObjList)
        } else {
          _accObjArray = this.deepCopy(this.totalData.accObjList)
        }
      }
      this.selectData.accObjList = _accObjArray
      // alert(JSON.stringify(this.selectData.accObjList))


      if (isInit) this.totalData.accObjList = this.deepCopy(this.selectData.accObjList)

      // 所有展开数据
      if (isInit) this.totalData.allData = this.totalData.allData.concat(this.totalData.accObjList)
    },
    // 初始化数据
    initData () {
      // debugger
      // console.log(this.$emit('refreshList'))

      // 初始加载
      this.initGroupSelect(true)
      this.initCompanySelect(true)
      this.initDeptSelect(true)
      this.initProjectSelect(true)
      this.initAccObjSelect(true)
    },
    // 获取列表
    getList () {
      this.totalData.allData = []
      let storage_key = 'components_cost_ProjectSelector'
      this.data = getLocalItem(storage_key)
      if (!this.data) {
        console.log('ajax request [components_cost_ProjectSelector] data ')
        getProjectAccountingTargetTree()
          .then(response => {
            this.data = response.data
            setLocalItem(storage_key, this.data, 60 * 60)// 缓存1个小时
            this.initData()
          })
          .catch(error => {
            console.log(error)
            this.$showError(error.message ? error.message : 'msg_system_error')
          })
      } else {
        this.initData()
      }
    },
    // 清除选择
    clearSelect (ENUMTYPE) {
      this.changeSelect(ENUMTYPE, null)
    },
    aa () {
      // debugger
    },
    // 选择改变
    changeSelect (type, event) {
      // this.$emit('getThrowListTest',"11");
      // this.$parent.refreshList()
      // this.$emit('getThrowListTest');
      let that = this
      if (event && this.totalData.allData) {
        let selectItem = this.totalData.allData.find(item => { return item.id === event })

        this.queryObj.projectName = selectItem.text
        this.$emit('change', selectItem)
        // alert(JSON.stringify(selectItem))
        this.queryObj.accObjName = selectItem.text;
        localStorage.setItem("accObjId", selectItem.id);
        localStorage.setItem("accObjName", selectItem.text);
        localStorage.setItem("fundsPlanName", selectItem.text + "——全周期资金计划")
        // this.getThrowList(selectItem.id)
        // this.$refs.BidBondTable.getList()
        console.log(this.$refs.NewOrUpdateCostConfirm);
      }

      switch (type) {
        case this.ENUMTYPE.GROUP:
          // this.queryObj.groupId = ''
          this.queryObj.companyId = ''
          this.queryObj.deptId = ''
          this.queryObj.projectId = ''
          this.queryObj.accObjId = ''
          if (this.queryObj.groupId === '') this.initData()
          break
        case this.ENUMTYPE.COMPANY:
          // this.queryObj.groupId = ''
          // this.queryObj.companyId = ''
          this.queryObj.deptId = ''
          this.queryObj.projectId = ''
          this.queryObj.accObjId = ''
          if (this.queryObj.companyId === '') this.initData()
          break
        case this.ENUMTYPE.DEPT:
          // this.queryObj.groupId = ''
          // this.queryObj.companyId = ''
          // this.queryObj.deptId = ''
          this.queryObj.projectId = ''
          this.queryObj.accObjId = ''
          if (this.queryObj.deptId === '') this.initData()
          break
        case this.ENUMTYPE.PROJECT:
          // this.queryObj.groupId = ''
          // this.queryObj.companyId = ''
          // this.queryObj.deptId = ''
          // this.queryObj.projectId = ''
          this.queryObj.accObjId = ''
          if (this.queryObj.projectId === '') this.initData()
          break
        case this.ENUMTYPE.ACC_OBJ:
          // this.queryObj.groupId = ''
          // this.queryObj.companyId = ''
          // this.queryObj.deptId = ''
          // this.queryObj.projectId = ''
          // this.queryObj.accObjId = ''
          if (this.queryObj.accObjId === '') this.initData()
          break
      }

      // this.queryObj.projectId = obj.id
      // this.queryObj.projectName = obj.text
      // alert(JSON.stringify(obj))
      this.emitValue()
    },
    getThrowList (accId) {
      this.aa();
      // 转换参数
      let _queryObj = {
        accountingObjectId: accId
      }
      console.log(_queryObj)
      getThrowDetail(_queryObj)
        .then(response => {
          //   debugger
          // alert(JSON.stringify(response.data))
          this.queryObj.throwDetailData = response.data
          localStorage.setItem("throwDetailData", response.data)
          // this.queryObj.count = response.data.totalElements
        })
        .catch(error => {
          console.log(error)
          this.$showError(error.message ? error.message : 'msg_system_error')
        })
    },
  },
  watch: {
    'value': {
      handler (newValue, oldValue) {
        console.log(' value change')
        this.initValue()
      },
      deep: true
    },
    'selectOrg': {
      handler (newValue, oldValue) {
        // debuggerdebugger
        let _select = newValue || oldValue
        if (_select && _select.type) {
          let companyId = ''
          let projectId = ''
          let accObjId = ''
          switch (_select.type) {
            case COSTENUM.projectTreeType.TREE_NODE_GROUP:
            case COSTENUM.projectTreeType.TREE_NODE_COMPANY:
            case COSTENUM.projectTreeType.TREE_NODE_DEPT:
              companyId = _select.id
              break
            case COSTENUM.projectTreeType.TREE_NODE_PROJECT:
              projectId = _select.id
              break
            default:
              break
          }
          this.emitValue(companyId, projectId, accObjId)
        }
      },
      deep: true
    }
  }

}
</script>
<style scoped>
.el-form-item {
  /*width:33%;*/
}
</style>
