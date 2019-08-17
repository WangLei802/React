<template>
    <div>
        <el-form :inline="true"
                 class="demo-form-inline">
            <el-form-item label="区域集团："
                          v-show="show.group">

                <el-select v-model="queryObj.groupId"
                           filterable
                           clearable
                           placeholder="请选择"
                           @change="changeSelect(ENUMTYPE.GROUP)"
                           @clear="clearMoule(1)">
                    <el-option v-for="(item,index) in selectData.groupList"
                               :key="index"
                               :label="item.text"
                               :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="区域公司："
                          v-show="show.company">
                <el-select v-model="queryObj.companyId"
                           filterable
                           clearable
                           placeholder="请选择"
                           @clear="clearMoule(2)"
                           @change="changeSelect(ENUMTYPE.COMPANY)">
                    <el-option v-for="(item,index)  in selectData.companyList"
                               :key="index"
                               :label="item.text"
                               :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="事业部："
                          v-show="show.dept">
                <el-select v-model="queryObj.deptId"
                           filterable
                           clearable
                           placeholder="请选择"
                           @change="changeSelect(ENUMTYPE.DEPT)"
                           @clear="clearMoule(3)">
                    <el-option v-for="(item,index) in selectData.deptList"
                               :key="index"
                               :label="item.text"
                               :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="项目名称："
                          v-show="show.project">
                <el-select v-model="queryObj.projectId"
                           filterable
                           placeholder="请选择"
                           @clear="clearMoule(4)"
                           @change="changeSelect(ENUMTYPE.PROJECT)">
                    <el-option v-for="(item,index)  in selectData.projectList"
                               :key="index"
                               :label="item.text"
                               :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="成本分期："
                          v-show="show.account">
                <el-select v-model="queryObj.accountId"
                           filterable
                           placeholder="请选择"
                           @change="changeSelect(ENUMTYPE.TREE_NODE_ACC_OBJ)">
                    <el-option v-for="(item,index)  in selectData.accountList"
                               :key="index"
                               :label="item.text"
                               :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>

        </el-form>

    </div>
</template>
<script>

import { getAccountingObjectProjectTree } from '@/api/cost/targetCostQueryAPI'
import COSTENUM from '@/utils/cost/enum'
export default {
    props: {
        value: {
            type: String

        },
        projectModel: {
            type: String
        },
        show: {
            type: Object,
            default: function () {
                return {
                    group: true,
                    company: true,
                    dept: true,
                    project: true,
                    account: true
                }
            }
        }

    },
    name: 'ProjectAccountingTargetTreeSelector',
    data: function () {
        return {
            ENUMTYPE: {
                'GROUP': 'GROUP',
                'COMPANY': 'COMPANY',
                'DEPT': 'DEPT',
                'PROJECT': 'PROJECT',
                'TREE_NODE_ACC_OBJ': 'TREE_NODE_ACC_OBJ'
            },
            queryObj: {
                groupId: '',
                companyId: '',
                deptId: '',
                projectId: '',
                accountId: ''
            },
            companyId: '',
            isShowModel: true,
            isShowCompany: true,
            isShowProject: true,
            isShowGroup: true,
            isShowItem: true,
            selectData: {
                groupList: [],
                companyList: [],
                deptList: [],
                projectList: [],
                accountList: []
            },
            totalData: { // 所有展开数据
                allData: [],
                groupList: [],
                companyList: [],
                deptList: [],
                projectList: [],
                accountList: []
            },

            myValue: '',
            ProjectInfo: [],
            input: '',
            lavel: 1,
            accountingTargetTreeData: []
        }
    },

    mounted: function () {
        this.getList()
        this.initValue()
        // this.queryObj.accountId = '7ecfea3f-679c-4499-904a-08b4cc7852f9'
        // this.queryObj.projectId = '7ecfea3f-679c-4499-904a-08b4cc7852f'
    },

    watch: {
        'value': {
            handler (newValue, oldValue) {
                this.initValue()
                debugger
            },
            deep: true
        },
        'projectModel': {
            handler (newValue, oldValue) {
                this.initValue()
                debugger
            },
            deep: true
        }
    },
    methods: {
        deepCopy (data) {
            return JSON.parse(JSON.stringify(data))
        },
        // 获取列表
        getList () {
            getAccountingObjectProjectTree()
                .then(response => {
                    this.initData(response)
                })
                .catch(error => {
                    console.log(error)
                    this.$showError(error.message ? error.message : 'msg_system_error')
                })
        },
        // 初始化数据
        initData (response) {
            this.data = response.data
            this.initGroupSelect(true)
            this.initCompaySelect(true)
            this.initDeptSelect(true)
            this.initProjectSelect(true)
            this.initAccountSelect(true)

            // 所有展开数据
            this.totalData.allData.push(JSON.parse(JSON.stringify(this.totalData.groupList)))
            this.totalData.allData.push(JSON.parse(JSON.stringify(this.totalData.companyList)))
            this.totalData.allData.push(JSON.parse(JSON.stringify(this.totalData.projectList)))
            this.totalData.allData.push(JSON.parse(JSON.stringify(this.totalData.accountList)))
            this.totalData.allData.push(JSON.parse(JSON.stringify(this.totalData.deptList)))

            console.log(this.totalData.allData)
        },
        // 集团
        initGroupSelect (isInit) {
            this.selectData.groupList = this.data[0].children
            if (isInit) this.totalData.groupList = this.deepCopy(this.selectData.groupList)
        },
        initValue () {
            if (this.selectOrg && this.selectOrg.type) {
                switch (this.selectOrg.type) {
                    case COSTENUM.projectTreeType.TREE_NODE_GROUP:
                        this.queryObj.groupId = this.selectOrg.id
                        break
                    case COSTENUM.projectTreeType.TREE_NODE_COMPANY:
                        this.queryObj.companyId = this.selectOrg.id
                        break
                    case COSTENUM.projectTreeType.TREE_NODE_DEPT:
                        this.queryObj.deptId = this.selectOrg.id
                        break
                    case COSTENUM.projectTreeType.TREE_NODE_PROJECT:
                        this.queryObj.projectId = this.selectOrg.id
                        break
                    default:
                        break
                }
            } else if (this.projectModel) {
                let _accountArray = []
                for (let i = 0; i < this.selectData.projectList.length; i++) {
                    if (this.selectData.projectList[i].id === this.projectModel) {
                        _accountArray = this.selectData.projectList[i].children

                        this.queryObj.projectId = this.projectModel
                        this.selectData.accountList = _accountArray
                    }
                }
            } else if (this.value) {
                this.queryObj.accountId = this.value
            } else {
                let _item = this.totalData.allData.find(item => { return item.id === this.queryObj.projectId })
                if (_item) {
                    switch (_item.type) {
                        case COSTENUM.projectTreeType.TREE_NODE_GROUP:
                            this.queryObj.groupId = this.value.companyId
                            break
                        case COSTENUM.projectTreeType.TREE_NODE_COMPANY:
                            this.queryObj.companyId = this.value.companyId
                            break
                        case COSTENUM.projectTreeType.TREE_NODE_DEPT:
                            this.queryObj.deptId = this.value.companyId
                            break
                        case COSTENUM.projectTreeType.PROJECT:
                            this.queryObj.projectId = this.value.companyId
                            break
                        default:
                            break
                    }
                }

                this.queryObj.projectId = this.value.projectId
            }
        },
        clearMoule (val) {
            this.changeSelect(val)
        },

        changeSelect (type) {
            switch (type) {
                case this.ENUMTYPE.GROUP:
                    this.initCompaySelect(false)
                    break
                case this.ENUMTYPE.COMPANY:
                    this.initDeptSelect(false)
                    break
                case this.ENUMTYPE.DEPT:
                    this.initProjectSelect(false)
                    break
                case this.ENUMTYPE.PROJECT:
                    this.initAccountSelect(false)
                    break
                case this.ENUMTYPE.TREE_NODE_ACC_OBJ:
                    break
            }
            this.emitValue()
        },
        // 赋值默认选项
        emitValue () {
            let _companyId = null
            if (this.queryObj.projectId) {
                this.queryObj.projectId = this.queryObj.projectId
            } else if (this.queryObj.deptId) {
                _companyId = this.queryObj.deptId
            } else if (this.queryObj.companyId) {
                _companyId = this.queryObj.companyId
            } else if (this.queryObj.groupId) {
                _companyId = this.queryObj.groupId
            } else {
                this.$emit('input', this.queryObj.accountId)
            }
        },
        // 公司
        initCompaySelect (isInit) {
            console.log(this.queryObj.groupId)
            let _companyArray = []
            if (isInit) {
                this.selectData.groupList.map(item => {
                    if (item && item.children && item.children.length > 0) {
                        _companyArray = _companyArray.concat(item.children)
                    }
                })
            } else {
                this.queryObj.companyId = ''
                if (this.queryObj.groupId) {
                    for (let i = 0; i < this.selectData.groupList.length; i++) {
                        if (this.selectData.groupList[i].id === this.queryObj.groupId) {
                            _companyArray = this.selectData.groupList[i].children
                        }
                    }
                } else {
                    _companyArray = this.deepCopy(this.totalData.companyList)
                    this.initDeptSelect()
                }
            }
            debugger
            this.selectData.companyList = _companyArray
            if (isInit) this.totalData.companyList = this.deepCopy(this.selectData.companyList)
        },
        // 事业部
        initDeptSelect (isInit) {
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
        // 项目
        initProjectSelect (isInit) {
            let _projectArray = []
            if (this.projectModel) {
                this.queryObj.projectId = this.projectModel
            }
            if (isInit) {
                this.selectData.deptList.map(item => {
                    if (item && item.children && item.children.length > 0) _projectArray = _projectArray.concat(item.children)
                })
            } else {
                this.queryObj.projectId = ''
                if (this.queryObj.deptId) {
                    _projectArray = this.selectData.deptList.find(item => { return item.id === this.queryObj.deptId }).children
                } else {
                    _projectArray = this.deepCopy(this.totalData.projectList)
                    this.initAccountSelect()
                }
            }
            this.selectData.projectList = _projectArray
            if (isInit) this.totalData.projectList = this.deepCopy(this.selectData.projectList)
        },
        // 成本分期
        initAccountSelect (isInit) {
            if (this.value) {
                this.queryObj.accountId = this.value
            }
            if (this.projectModel) {
                this.queryObj.projectId = this.projectModel
            }
            let _accountArray = []
            if (isInit) {
                this.selectData.projectList.map(item => {
                    if (item && item.children && item.children.length > 0) _accountArray = _accountArray.concat(item.children)
                })
            } else {
                this.queryObj.account = ''
                if (this.queryObj.projectId) {
                    for (let i = 0; i < this.selectData.projectList.length; i++) {
                        if (this.selectData.projectList[i].id === this.queryObj.groupId) {
                            _accountArray = this.selectData.projectList[i].children
                        }
                    }
                } else {
                    _accountArray = this.deepCopy(this.totalData.accountList)
                }
            }
            this.selectData.accountList = _accountArray
            if (isInit) this.totalData.accountList = this.deepCopy(this.selectData.accountList)
        }
    }

}
</script>
<style scoped>
.el-input {
  width: 200px;
}
.selected {
  background-color: #fff !important;
  color: #48696a !important;
  font-weight: normal !important;
}
</style>
