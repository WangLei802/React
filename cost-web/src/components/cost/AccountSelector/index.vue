
<template>
  <div style="display:inline-block">
    <el-form :inline="true"
             size="mini"
             label-width="120px">
      <el-row>
        <slot name="before"></slot>
        <el-col :span="8">
          <el-form-item label="区域集团："
                        label-width="120px"
                        v-show="show.group">

            <el-select v-model="queryObj.groupId"
                       filterable
                       clearable
                       placeholder="请选择"
                       @change="changeSelect(ENUMTYPE.GROUP,$event)"
                       @clear="clearSelect(ENUMTYPE.GROUP)">
              <el-option v-for="(item,index) in selectData.groupList"
                         :key="index"
                         :label="item.text"
                         :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="区域公司："
                        v-show="show.company">
            <el-select v-model="queryObj.companyId"
                       filterable
                       clearable
                       placeholder="请选择"
                       @change="changeSelect(ENUMTYPE.COMPANY,$event)"
                       @clear="clearSelect(ENUMTYPE.COMPANY)">
              <el-option v-for="(item,index)  in selectData.companyList"
                         :key="index"
                         :label="item.text"
                         :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="事业部："
                        v-show="show.dept">
            <el-select v-model="queryObj.deptId"
                       filterable
                       clearable
                       placeholder="请选择"
                       @change="changeSelect(ENUMTYPE.DEPT,$event)"
                       @clear="clearSelect(ENUMTYPE.DEPT)">
              <el-option v-for="(item,index) in selectData.deptList"
                         :key="index"
                         :label="item.text"
                         :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="项目名称："
                        v-show="show.project">
            <el-select v-model="queryObj.projectId"
                       filterable
                       clearable
                       placeholder="请选择"
                       @change="changeSelect(ENUMTYPE.PROJECT,$event)"
                       @clear="clearSelect(ENUMTYPE.PROJECT)">
              <el-option v-for="(item,index)  in selectData.projectList"
                         :key="index"
                         :label="item.text"
                         :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">

          <el-form-item label="成本分期："
                        v-show="show.accObj">
            <el-select v-model="queryObj.accObjId"
                       filterable
                       clearable
                       placeholder="请选择"
                       @change="changeSelect(ENUMTYPE.ACC_OBJ,$event)"
                       @clear="clearSelect(ENUMTYPE.ACC_OBJ)">
              <el-option v-for="(item,index)  in selectData.accObjList"
                         :key="index"
                         :label="item.text"
                         :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <slot name="after"></slot>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import { getProjectAccountingTargetTree } from '@/api/cost/selectTargetCostAPI'
import COSTENUM from '@/utils/cost/enum'
import { getLocalItem, setLocalItem, removeLocalItem } from '@/utils/common/cache'
import { mapGetters } from 'vuex'
export default {
  name: 'ProjectSelector',
  props: {
    value: {
      type: Object,
      default: function () {
        return {
          companyId: '', // 可能是groupId ||  companyId || deptId
          projectId: '', // 项目id
          accObjId: '' // 成本分期id
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
          accObj: false
        }
      }
    }, // 自动选择方向up/down/both
    autoSelect: {
      type: String,
      default: 'both'
    }
  },
  data: function () {
    return {
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
        accObjId: ''
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
      }
    }
  },
  computed: {
    ...mapGetters(['selectOrg'])
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
      console.log('initValue' + new Date().getTime())
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
      } else {
        this.queryObj.groupId = ''
        this.queryObj.companyId = ''
        this.queryObj.deptId = ''
      }
      this.queryObj.projectId = this.value.projectId || ''
      if (this.queryObj.projectId) {
        // 下级选项
        this.initAccObjSelect()
      } else {
        // 重置当前项目
        this.initProjectSelect()
      }
      this.queryObj.accObjId = this.value.accObjId || ''

      // 向上选中
      if (!init && (this.autoSelect.toLowerCase() === 'both' || this.autoSelect.toLowerCase() === 'up')) {
        // debugger
        let _parentsArray = []
        if (this.queryObj.accObjId) {
          // 成本分期向上选中到集团
          let _accobjItem = this.totalData.allData.find(item => { return item.id === this.queryObj.accObjId })
          _parentsArray = _accobjItem.parentIds ? _accobjItem.parentIds.split(',') : []

          if (_parentsArray.length >= 5) {
            this.queryObj.groupId = _parentsArray[1]
            this.queryObj.companyId = _parentsArray[2]
            this.queryObj.deptId = _parentsArray[3]
            this.queryObj.projectId = _parentsArray[4]
          }

          return
        }
        if (this.queryObj.projectId) {
          // 项目向上选中到集团
          let _projectItem = this.totalData.allData.find(item => { return item.id === this.queryObj.projectId })
          _parentsArray = (_projectItem && _projectItem.parentIds) ? _projectItem.parentIds.split(',') : []

          if (_parentsArray.length >= 4) {
            this.queryObj.groupId = _parentsArray[1]
            this.queryObj.companyId = _parentsArray[2]
            this.queryObj.deptId = _parentsArray[3]
          }
          return
        }

        // companyid
        if (_item) {
          if (this.queryObj.deptId) {
            // 部门向上选中到集团
            _parentsArray = _item.parentIds ? _item.parentIds.split(',') : []

            if (_parentsArray.length >= 3) {
              this.queryObj.groupId = _parentsArray[1]
              this.queryObj.companyId = _parentsArray[2]
            }
            return
          }
          if (this.queryObj.companyId) {
            // 公司向上选中到集团
            _parentsArray = _item.parentIds ? _item.parentIds.split(',') : []

            if (_parentsArray.length >= 2) {
              this.queryObj.groupId = _parentsArray[1]
            }
            return
          }
        }
      }
    },
    emitValue (companyId, projectId, objId) {
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
        accObjId: objId || this.queryObj.accObjId
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
      // this.selectData.accObjList = []
      // for (let i = 0; i < _accObjArray.length; i++) {
      //   if (_accObjArray[i].attr.stageId !== '1' && _accObjArray[i].attr.phaseType !== '3') {
      //    this.selectData.accObjList.push(_accObjArray[i])
      //  }
      // }

      if (isInit) this.totalData.accObjList = this.deepCopy(this.selectData.accObjList)

      // 所有展开数据
      if (isInit) this.totalData.allData = this.totalData.allData.concat(this.totalData.accObjList)
    },
    // 初始化数据
    initData () {
      // debugger
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
    // 选择改变
    changeSelect (type, event) {
      debugger
      if (event && this.totalData.allData) {
        let selectItem = this.totalData.allData.find(item => { return item.id === event })
        this.$emit('change', selectItem)
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
      this.emitValue()
    }
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
