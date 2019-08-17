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
    _________________________________________________________________________________________________
-->
<template>
    <div >
        <el-form :inline="true"
                size="mini"
                :rules="rules"  label-width="130px">

            <!-- <el-row>     -->
            <slot name="before"></slot>
            <el-col :span="8"
                    v-show="show.project">
                <el-form-item label="项目名称："
                              prop="projectName">
                    <el-select v-model="queryObj.projectId"   style="width: 240px"
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

            <el-col v-show="show.fCompany">
                <el-form-item label="法人公司："
                        :label-width="labelWidth.project+'px'">
                    <el-select v-model="queryObj.corporateCompanyId"
                                placeholder="请选择"  >
                        <el-option
                            v-for="item in queryObj.fCompanylist"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                            >
                        </el-option>
                    </el-select>
                    <!-- <el-input v-else  v-model="form.corporateCompanyName" :disabled="true" ></el-input> -->
                </el-form-item>
             </el-col>
            <slot name="after"></slot>
            <!-- </el-row> -->
        </el-form>
    </div>
</template>
<script>
import { getProjectAccountingTargetTree,getCompanylist} from '@/api/cost/selectTargetCostAPI'
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
                    projectId: '',// 项目id
                    accObjId: '', //成本分期id
                    projectName:'',
                    corporateCompanyId:''
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
                    group: 6,
                    company: 6,
                    dept: 6,
                    project: 6,
                    accObj: 6,
                    fCompany:6
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
                    accObj: false,
                    fCompany:false
                }
            }
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
                projectName:'',
                accObjId: '',
                fCompanylist:'',
                corporateCompanyId:'',
                corporateCompanyName:''
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
            rules: {
                projectName: [
                    {required: true, message: '请选择项目', trigger: 'blur'}
                ]
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
            // alert(this.$route.query.projectName)
            this.queryObj.projectId = this.$route.query.projectId
            this.queryObj.projectName = this.$route.query.projectName
            //debugger
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
            this.queryObj.projectId = this.value.projectId
            if (this.queryObj.projectId) {
                this.initAccObjSelect()
            }
            this.queryObj.accObjId = this.value.accObjId
        },
        emitValue (companyId, projectId, objId,projectName) {
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

            // alert(this.queryObj.projectId)
            let param = {
                projectId:this.queryObj.projectId
            }
            getCompanylist(param)
            .then(response => {
                console.log(response.data)
                this.queryObj.fCompanylist = response.data
            })
            .catch(error => {
                console.log(error)
                this.$showError(error.message ? error.message : 'msg_system_error')
            })
            //debugger
            this.$emit('input', {
                companyId: _companyId,
                projectId: projectId ? projectId : this.queryObj.projectId,
                accObjId: objId ? objId : this.queryObj.accObjId,
                projectName : projectName ? projectName :this.queryObj.projectName,
                fCompanylist : this.queryObj.fCompanylist
            })
        },
        initGroupSelect (isInit) {
            // 集团
            this.selectData.groupList = this.data[0].children
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
                //this.queryObj.companyId = ''
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
                //this.queryObj.deptId = ''
                //this.queryObj.projectId = ''
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
                //this.queryObj.projectId = ''
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
                    if (item && item.children && item.children.length > 0) _accObjArray = _accObjArray.concat(item.children)
                })
            } else {
                //this.queryObj.projectId = ''
                if (this.queryObj.projectId) {
                    let _project = this.selectData.projectList.find(item => { return item.id === this.queryObj.projectId })
                    _accObjArray = _project ? _project.children : this.deepCopy(this.totalData.accObjList)
                } else {
                    _accObjArray = this.deepCopy(this.totalData.accObjList)
                }

            }
            this.selectData.accObjList = _accObjArray
            if (isInit) this.totalData.accObjList = this.deepCopy(this.selectData.accObjList)

            // 所有展开数据
            if (isInit) this.totalData.allData = this.totalData.allData.concat(this.totalData.accObjList)
        },
        // 初始化数据
        initData () {
            // debugger
            //初始加载
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
                console.log("ajax request [components_cost_ProjectSelector] data ")
                getProjectAccountingTargetTree()
                    .then(response => {
                        this.data = response.data
                        setLocalItem(storage_key, this.data, 60 * 60)//缓存1个小时
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
            // debugger
            if (event && this.totalData.allData) {
                let selectItem = this.totalData.allData.find(item => { return item.id === event })
                // alert(JSON.stringify(selectItem))
                this.$emit('change', selectItem)
            }

            switch (type) {
                case this.ENUMTYPE.GROUP:
                    this.queryObj.companyId = ''
                    this.queryObj.deptId = ''
                    this.queryObj.projectId = ''
                    this.queryObj.accObjId = ''
                    if (this.queryObj.groupId === '') this.initData()
                    break
                case this.ENUMTYPE.COMPANY:
                    this.queryObj.deptId = ''
                    this.queryObj.projectId = ''
                    this.queryObj.accObjId = ''
                    if (this.queryObj.companyId === '') this.initData()
                    break
                case this.ENUMTYPE.DEPT:
                    this.queryObj.projectId = ''
                    this.queryObj.accObjId = ''
                    if (this.queryObj.deptId === '') this.initData()
                    break
                case this.ENUMTYPE.PROJECT:
                    if (this.queryObj.projectId === '') this.initData()
                    break
                case this.ENUMTYPE.ACC_OBJ:
                    if (this.queryObj.accObjId === '') this.initData()
                    break
            }

            let obj = {};
            obj = this.selectData.projectList.find((item)=>{//这里的userList就是上面遍历的数据源
                return item.id === event;//筛选出匹配数据
            });
            this.queryObj.projectName = obj.text;

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
                //debugger
                let _select = newValue ? newValue : oldValue
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
</style>
