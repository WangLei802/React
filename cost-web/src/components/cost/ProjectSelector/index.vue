<!--
    集团、公司、部门、项目、成本分期五级下拉级联组件
    【使用场景】：查询列表
    【示例】：
    __________________________________________________________________________________________________
    
        import ProjectSelector from '@/components/cost/ProjectSelector/'
        <ProjectSelector v-model='queryModel' :show="" @change="projectSelector_SelectChange">
            <template slot="before">前置内容</template>
            <template slot="after">后置内容</template>
        </ProjectSelector>
    _________________________________________________________________________________________________

    【参数】：
    _________________________________________________________________________________________________
    
        // 集团，公司，部门为companyId，双向绑定，projectId为项目id
        queryModel: {
            companyId: '',
            projectId: '',
            accObjId：''
        }
    
        //默认显示(成本分期不显示)
        showSetting:{
            group: true, //显示集团
            company: true,//显示公司
            dept: true,//显示部门
            project: true,//显示项目
            accObj:false//显示成本分期
        }
    
        //手动选择下拉值改变事件
        @change="projectSelector_SelectChange"

        // 当前有脏数据
        id: "6940",text: "储备区域公司",和6941/6942同为公司，但有层级关系
    _________________________________________________________________________________________________
-->
<template>
  <div>
    <slot name="before"></slot>
    <el-col :span="span.group"
            v-show="show.group">
      <el-form-item label="区域集团："
                    title="区域集团"
                    :label-width="labelWidth.group+'px'">

        <el-select v-model="queryObj.groupId"
                   filterable
                   :clearable="clearable.group"
                   placeholder="请选择"
                   :disabled="disabled.group"
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
    <el-col :span="span.company"
            v-show="show.company">
      <el-form-item label="区域公司："
                    title="区域公司"
                    :label-width="labelWidth.company+'px'">
        <el-select v-model="queryObj.companyId"
                   filterable
                   :clearable="clearable.company"
                   placeholder="请选择"
                   :disabled="disabled.company"
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
    <el-col :span="span.dept"
            v-show="show.dept">
      <el-form-item label="事业部："
                    title="事业部"
                    :label-width="labelWidth.dept+'px'">
        <el-select v-model="queryObj.deptId"
                   filterable
                   :clearable="clearable.dept"
                   placeholder="请选择"
                   :disabled="disabled.dept"
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
    <slot name="projectSelectorButtons"></slot>
    <el-col :span="span.project"
            v-show="show.project">
      <el-form-item label="项目名称："
                    title="项目名称"
                    :label-width="labelWidth.project+'px'"
                    prop="projectId">
        <el-select v-model="queryObj.projectId"
                   filterable
                   :clearable="clearable.project"
                   placeholder="请选择"
                   :disabled="disabled.project"
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
    <el-col :span="span.accObj"
            v-show="show.accObj">
      <el-form-item label="成本分期："
                    title="成本分期"
                    :label-width="labelWidth.accObj+'px'"
                    prop="accObjId">
        <el-select v-model="queryObj.accObjId"
                   filterable
                   :clearable="clearable.accObj"
                   placeholder="请选择"
                   :disabled="disabled.accObj"
                   @change="changeSelect(ENUMTYPE.ACC_OBJ,$event)"
                   @clear="clearSelect(ENUMTYPE.ACC_OBJ)">
          <el-option v-for="(item,index)  in filterData(selectData.accObjList,'accObjList')"
                     :key="index"
                     :label="item.text"
                     :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
    </el-col>
    <slot name="after"></slot>
  </div>
</template>
<script>
import { getProjectAccountingTargetTree } from '@/api/cost/selectTargetCostAPI'
import COSTENUM from '@/utils/cost/enum'
import { getLocalItem, setLocalItem, removeLocalItem } from '@/utils/common/cache'
import { mapGetters } from 'vuex'
import { deepCopy, ifNull } from '@/utils/cost/objectHelper'
export default {
  name: 'ProjectSelector',
  props: {
    // 默认值
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
    // 禁用
    disabled: {
      type: Object,
      default: function () {
        return {
          group: false,
          company: false,
          dept: false,
          project: false,
          accObj: false
        }
      }
    },
    // 是否显示
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
    },
    // 列宽
    span: {
      type: Object,
      default: function () {
        return {
          group: 6,
          company: 6,
          dept: 6,
          project: 6,
          accObj: 6
        }
      }
    },
    // 是否显示清除
    clearable: {
      type: Object,
      default: function () {
        return {
          group: true,
          company: true,
          dept: true,
          project: true,
          accObj: true
        }
      }
    },
    // 显示待分期
    showTobe: {
      type: Boolean,
      default: true
    },
    // 在成本分期前添加项目
    appendProjectToAccount: {
      type: Boolean,
      default: true
    },
    // 自动选择方向up/down/both
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
    // 过滤数据
    filterData (data, selectType) {
      let newData = data
      let lastData = []
      // 目标成本编制不显示“待分期”
      if (selectType === 'accObjList') {
        // 过滤待分期
        if (!this.showTobe) {
          newData = data.filter(item => {
            return item.text.indexOf('待分期') < 0
          })
        }
        lastData = deepCopy(newData)
        // 追加项目名称
        if (this.appendProjectToAccount) {
          let _projectKeyValueList = {}
          this.totalData.projectList.map(item => {
            _projectKeyValueList[item.id] = item.text
          })

          lastData.map(item => {
            if (item.attr['phaseType'] !== '0') {
              if (_projectKeyValueList[item.parentId]) {
                item.text = _projectKeyValueList[item.parentId] + '-' + item.text
              }
            }
          })
        }
      } else {
        lastData = deepCopy(newData)
      }
      return lastData
    },
    initValue (init) {
      if (this.value.companyId && this.value.companyId === this.queryObj.groupId) {
        this.queryObj.groupId = this.value.companyId
        if (!init) {
          this.initCompanySelect()
          this.initDeptSelect()
          this.initProjectSelect()
          this.initAccObjSelect()
        }
        return
      }
      //debugger
      //console.log('initValue' + new Date().getTime())
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
              //modify@20181128 如果项目不显示则不参与运算
              if (this.show.project && this.show.accObj) {
                this.initProjectSelect()
                this.initAccObjSelect()
              }
            }
            break
          default:
            break
        }
      } else {
        this.queryObj.groupId = ''
        this.queryObj.companyId = ''
        this.queryObj.deptId = ''
        this.initGroupSelect()
        this.initCompanySelect()
        this.initDeptSelect()
        if (!this.queryObj.projectId) {
          // 重置当前项目
          this.initProjectSelect()
        }

        if (!this.queryObj.accObjId) {
          this.initAccObjSelect()
        }
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
      this.selectData.groupList = []
      if (this.data && this.data[0] && this.data[0].children) this.selectData.groupList = this.data[0].children
      if (isInit) this.totalData.groupList = deepCopy(this.selectData.groupList)

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
          _companyArray = (_group && _group.children) ? _group.children : deepCopy(this.totalData.companyList)
        } else {
          // 集团有变化
          if (this.selectData.groupList && this.selectData.groupList.length !== this.totalData.groupList.length) {
            this.selectData.groupList.map(item => {
              if (item.children && item.children.length > 0) _companyArray = _companyArray.concat(item.children)
            })
          } else {
            _companyArray = deepCopy(this.totalData.companyList)
          }
          this.initDeptSelect()
        }
      }
      this.selectData.companyList = _companyArray
      if (isInit) this.totalData.companyList = deepCopy(this.selectData.companyList)

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
          _deptArray = (_company && _company.children) ? _company.children : deepCopy(this.totalData.deptList)
        } else {
          if (this.totalData.companyList && this.totalData.companyList.length !== this.selectData.companyList.length) {
            // 公司已经做了筛选,则拿到 筛选公司下的部门
            this.selectData.companyList.map(item => {
              if (item.children && item.children.length > 0) _deptArray = _deptArray.concat(item.children)
            })
          } else {
            _deptArray = deepCopy(this.totalData.deptList)
          }
          this.initProjectSelect()
        }
      }
      this.selectData.deptList = _deptArray
      if (isInit) this.totalData.deptList = deepCopy(this.selectData.deptList)

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
          _projectArray = (_dept && _dept.children) ? _dept.children : deepCopy(this.totalData.projectList)
        } else {
          // 部门有变化
          if (this.selectData.deptList && this.selectData.deptList.length !== this.totalData.deptList.length) {
            this.selectData.deptList.map(item => {
              if (item.children && item.children.length > 0) _projectArray = _projectArray.concat(item.children)
            })
          } else {
            _projectArray = deepCopy(this.totalData.projectList)
          }
          this.initAccObjSelect()
        }
      }
      this.selectData.projectList = _projectArray
      if (isInit) this.totalData.projectList = deepCopy(this.selectData.projectList)

      // 所有展开数据
      if (isInit) this.totalData.allData = this.totalData.allData.concat(this.totalData.projectList)
    },
    initAccObjSelect (isInit) {
      // 成本分期
      let _accObjArray = []
      if (isInit) {
        this.selectData.projectList.map(item => {
          if (item && item.children && item.children.length > 0) _accObjArray = _accObjArray.concat(item.children)
          // debugger
        })
      } else {
        // this.queryObj.projectId = ''
        //modify@20181128 如果项目不显示则不参与运算
        if (this.queryObj.projectId && this.show.project) {
          let _project = null
          if (this.selectData.projectList) {
            _project = this.selectData.projectList.find(item => { return item.id === this.queryObj.projectId })
          }
          _accObjArray = (_project && _project.children) ? _project.children : deepCopy(this.totalData.accObjList)
        } else {
          // 项目 有变化
          if (this.selectData.projectList && this.selectData.projectList.length !== this.totalData.projectList.length) {
            this.selectData.projectList.map(item => {
              if (item.children && item.children.length > 0) _accObjArray = _accObjArray.concat(item.children)
            })
          } else {
            _accObjArray = deepCopy(this.totalData.accObjList)
          }
        }
      }
      this.selectData.accObjList = _accObjArray
      if (isInit) this.totalData.accObjList = deepCopy(this.selectData.accObjList)

      // 所有展开数据
      if (isInit) this.totalData.allData = this.totalData.allData.concat(this.totalData.accObjList)
    },
    // 初始化数据
    initData (isInit) {
      // debugger
      // 初始加载
      this.initGroupSelect(true)
      this.initCompanySelect(true)
      this.initDeptSelect(true)
      this.initProjectSelect(true)
      this.initAccObjSelect(true)

      if (isInit) this.initValue()
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
            setLocalItem(storage_key, this.data, 10)// todo:缓存10秒钟
            this.initData(true)
          })
          .catch(error => {
            console.log(error)
            this.$showError(error.message ? error.message : 'msg_system_error')
          })
      } else {
        this.initData(true)
      }
    },
    // 清除选择
    clearSelect (ENUMTYPE) {
      this.changeSelect(ENUMTYPE, null)
    },
    // 选择改变
    changeSelect (type, event) {
      // debugger
      if (event && this.totalData.allData) {
        let selectItem = this.totalData.allData.find(item => { return item.id === event })
        this.$emit('change', selectItem)
      }

      switch (type) {
        case this.ENUMTYPE.GROUP:
          this.queryObj.companyId = ''
          this.queryObj.deptId = ''
          this.queryObj.projectId = ''
          this.queryObj.accObjId = ''
          if (this.queryObj.groupId === '') {
            this.initData()
          } else {
            // 初始化下级数据源
          }
          break
        case this.ENUMTYPE.COMPANY:
          this.queryObj.deptId = ''
          this.queryObj.projectId = ''
          this.queryObj.accObjId = ''
          if (this.queryObj.companyId === '') {
            this.initData()
          } else {
            // 初始化下级数据源
          }
          break
        case this.ENUMTYPE.DEPT:
          this.queryObj.projectId = ''
          this.queryObj.accObjId = ''
          if (this.queryObj.deptId === '') {
            this.initData()
          } else {
            // 初始化下级数据源
          }
          break
        case this.ENUMTYPE.PROJECT:
          this.queryObj.accObjId = ''
          if (this.queryObj.projectId === '') {
            this.initData()
          } else {
            // 初始化下级数据源
          }
          break
        case this.ENUMTYPE.ACC_OBJ:
          if (this.queryObj.accObjId === '') this.initData()
          break
      }
      this.emitValue()
    }
  },
  watch: {
    'value': {
      handler (newValue, oldValue) {
        console.log('ProjectSelector value change')
        // console.info(newValue)
        this.initValue()
      },
      deep: true
    },
    'selectOrg': {
      handler (newValue, oldValue) {
        // debugger
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
  },
  destroyed: function () {
    // this.data = null
    // this.totalData = null
    // this.selectData = null
  }

}
</script>
