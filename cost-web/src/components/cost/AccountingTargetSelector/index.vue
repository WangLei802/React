<!--成本分期多级下拉框组件-->
<template>
    <div>
        <el-form :inline="true"
                 label-width="120px"
                 size="mini"
                 class="demo-form-inline">
            <el-col :span="span.group"
                    v-show="isShowModel">
                <el-form-item label="区域集团："
                              title="区域集团"
                              :label-width="labelWidth.group+'px'">

                    <el-select v-model="queryModel.group"
                               filterable
                               :clearable="clearable.group"
                               :disabled="disabled.group"
                               placeholder="请选择"
                               @change="filtersInfor"
                               @clear="clearMoule(1)">
                        <el-option v-for="(item,index) in selectData.typeList"
                                   :key="index"
                                   :label="item.text"
                                   :value="item">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="span.company"
                    v-show="isShowCompany">
                <el-form-item label="区域公司："
                              title="区域公司"
                              :label-width="labelWidth.company+'px'">
                    <el-select v-model="queryModel.company"
                               filterable
                               :clearable="clearable.company"
                               :disabled="disabled.company"
                               placeholder="请选择"
                               @clear="clearMoule(2)"
                               @change="filtersInfor">
                        <el-option v-for="(item,index)  in selectData.companyIdList"
                                   :key="index"
                                   :label="item.text"
                                   :value="item">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="span.businessDept"
                    v-show="isShowProject">
                <el-form-item label="事业部："
                              title="事业部"
                              :label-width="labelWidth.businessDept+'px'">
                    <el-select v-model="queryModel.businessDept"
                               filterable
                               :clearable="clearable.businessDept"
                               :disabled="disabled.businessDept"
                               placeholder="请选择"
                               @change="filtersInfor"
                               @clear="clearMoule(3)">
                        <el-option v-for="(item,index) in selectData.projectIdList"
                                   :key="index"
                                   :label="item.text"
                                   :value="item">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="span.accountingObject"
                    v-show="isShowGroup">
                <el-form-item label="成本分期："
                              title="成本分期"
                              :label-width="labelWidth.accountingObject+'px'">
                    <el-select v-model="queryModel.accountingObject"
                               filterable
                               :clearable="clearable.accountingObject"
                               :disabled="disabled.accountingObject"
                               placeholder="请选择"
                               @change="filtersInfor">
                        <el-option v-for="(item,index)  in filterData(selectData.groupIdList,'groupIdList')"
                                   :key="index"
                                   :label="item.text"
                                   :value="item">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-col>
        </el-form>

    </div>
</template>
<script>
import { getAccountingTargetTree } from '@/api/cost/selectTargetCostAPI'
import COSTENUM from '@/utils/cost/enum'
export default {
    props: {
        queryModel: {
            type: Object,
            default: function () {
                return {
                    group: false,
                    company: false,
                    dept: false,
                    account: false
                }
            }
        },
        valueObjectId: {
            type: Object,
            default: function () {
                return {
                    companyId: '',
                    accountingObjectId: ''
                }
            }
        },
        // 是否可以清除
        clearable: {
            type: Object,
            default: function () {
                return {
                    group: true,
                    company: true,
                    businessDept: true,
                    accountingObject: true
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
                    businessDept: false,
                    accountingObject: false
                }
            }
        },
        //是否再注册父组件使用
        isUsed: {
            type: Boolean,
            default: true
        },
        // 显示待分期
        showTobe: {
            type: Boolean,
            default: true
        },
        // 显示不分期如果有分期
        showNoPhaseIfHavePhase: {
            type: Boolean,
            default: true
        },
        span: {
            type: Object,
            default: function () {
                return {
                    group: 6,
                    company: 6,
                    businessDept: 6,
                    accountingObject: 6,
                }
            }
        },
        labelWidth: {
            type: Object,
            default: function () {
                return {
                    group: 120,
                    company: 120,
                    businessDept: 120,
                    accountingObject: 120,
                }
            }
        }
    },
    name: 'AccountingTargetSelector',
    data: function () {
        return {
            queryObj: this.queryModel,
            companyId: '',
            isShowModel: true,
            isShowCompany: true,
            isShowProject: true,
            isShowGroup: true,
            selectData: {
                typeList: [],
                companyIdList: [],
                projectIdList: [],
                groupIdList: []
            },

            standaredSubjectQueryModel: {
                typeList: [],
                companyIdList: [],
                projectIdList: [],
                groupIdList: []
            },
            myValue: '',
            ProjectInfo: [],
            input: '',
            lavel: 1,
            accountingTargetTreeData: []
        }
    },

    mounted: function () {
        this.isShowModule()
        debugger
        //父组件不被使用择不拉取数据
        if (this.isUsed) {
            this.getProductAccountingTargetTree()
        }

    },
    methods: {
        // 过滤数据
        filterData (data, selectType) {
            let newData = data
            let lastData = []
            // 目标成本编制不显示“待分期”
            if (selectType === 'groupIdList' && !this.showTobe) {
                newData = data.filter(item => {
                    return item.text.indexOf('待分期') < 0
                })
            }
            // console.info(newData)
            // 同一个项目下的成本分期 显示不分期如果有分期
            if (!this.showNoPhaseIfHavePhase) {
                let havePhaseProjectId = []
                newData.map(item => {
                    // 0:不分期，1：普通分期，2：跨期，3:待分期
                    if (
                        (item.attr['phaseType'] === '1' ||
                            item.attr['phaseType'] === '2' ||
                            item.attr['phaseType'] === '3')
                    ) {
                        if (havePhaseProjectId.length === 0) {
                            havePhaseProjectId.push(item.attr['projectId'])
                        } else {
                            if (havePhaseProjectId.indexOf(item.attr['projectId']) < 0) {
                                havePhaseProjectId.push(item.attr['projectId'])
                            }
                        }
                    }
                })
                // console.info(havePhaseProjectId)
                lastData = newData.filter(item => {
                    return (havePhaseProjectId.indexOf(item.attr['projectId']) > -1 && item.attr['phaseType'] !== '0') || havePhaseProjectId.indexOf(item.attr['projectId']) < 0
                })
            } else {
                lastData = newData
            }

            return lastData
        },
        clearMoule (val) {
            if (val === 1) {
                this.queryModel.company = ''
                this.queryModel.businessDept = ''
                this.queryModel.accountingObject = ''
                this.selectData.companyIdList = this.standaredSubjectQueryModel.companyIdList
                this.selectData.groupIdList = this.standaredSubjectQueryModel.groupIdList
                this.selectData.projectIdList = this.standaredSubjectQueryModel.projectIdList
            } else if (val === 2) {
                this.queryModel.businessDept = ''
                this.queryModel.accountingObject = ''
                this.selectData.groupIdList = this.standaredSubjectQueryModel.groupIdList
                this.selectData.projectIdList = this.standaredSubjectQueryModel.projectIdList
            } else if (val === 3) {
                this.queryModel.accountingObject = ''
                this.selectData.groupIdList = this.standaredSubjectQueryModel.groupIdList
            } else if (val === 4) {
                this.queryModel.accountingObject = ''
            }
        },
        isShowModule () {
            this.isShowModel = this.queryModel.show.group
            this.isShowCompany = this.queryModel.show.company
            this.isShowProject = this.queryModel.show.dept
            this.isShowGroup = this.queryModel.show.account
        },
        emit (item) {
            this.$emit('updateMessage', item)
            console.log('AccountingTargetSelector:' + item)
        },
        filtersInfor (item) {
            if (item.children && item.children.length > 0 && item.type === COSTENUM.projectTreeType.TREE_NODE_GROUP) {
                this.isShowCompany = true
                this.selectData.companyIdList = item.children
                this.queryModel.group = item.text
                this.queryModel.company = ''
                this.queryModel.businessDept = ''
                // this.queryModel.accountingObject = ''

                let projectIdList = []
                let project = []
                let groupIdList = []
                let group = []
                item.children.forEach(function (value, index) {
                    if (value.children && value.children.length > 0 && value.type === 'company') {
                        project = projectIdList.concat(value.children)
                    }
                })

                project.forEach(function (value, index) {
                    if (value.children && value.children.length > 0 && value.type === 'dept') {
                        group = groupIdList.concat(value.children)
                    }
                })

                this.selectData.projectIdList = project
                this.selectData.groupIdList = group

                this.emit(item)
            } else if (item.type === COSTENUM.projectTreeType.TREE_NODE_GROUP && !item.children) {
                this.selectData.companyIdList = []
                this.selectData.projectIdList = []
                this.selectData.groupIdList = []
                this.queryModel.group = item.text
                this.queryModel.company = ''
                this.queryModel.businessDept = ''
                // this.queryModel.accountingObject = ''
                this.isShowCompany = true
                this.isShowProject = true
                this.isShowGroup = true
                this.emit(item)
            } else if (item.children && item.type === COSTENUM.projectTreeType.TREE_NODE_COMPANY && item.children.length > 0) {
                this.queryModel.company = item.text
                this.queryModel.businessDept = ''
                // this.queryModel.accountingObject = ''
                this.isShowProject = true
                this.isShowGroup = true
                this.selectData.projectIdList = item.children
                for (let i = 0; i < this.standaredSubjectQueryModel.typeList.length; i++) {
                    if (this.standaredSubjectQueryModel.typeList[i].id === item.parentId) {
                        this.queryModel.group = this.standaredSubjectQueryModel.typeList[i].text
                    }
                }

                let accountingObjectList = []
                let accountingObject = []
                this.selectData.projectIdList.forEach(function (value, index) {
                    if (value.children && value.children.length > 0 && value.type === 'account') {
                        accountingObject = accountingObjectList.concat(value.children)
                    }
                })
                this.selectData.groupIdList = accountingObject
            } else if (item.type === COSTENUM.projectTreeType.TREE_NODE_COMPANY && !item.children) {
                this.queryModel.company = item.text
                this.queryModel.businessDept = ''
                // this.queryModel.accountingObject = ''
                this.isShowProject = true
                this.isShowGroup = true
                this.selectData.projectIdList = []
                this.selectData.groupIdList = []
                for (let i = 0; i < this.standaredSubjectQueryModel.typeList.length; i++) {
                    if (this.standaredSubjectQueryModel.typeList[i].id === item.parentId) {
                        this.queryModel.group = this.standaredSubjectQueryModel.typeList[i].text
                    }
                }
                this.emit(item)
            } else if (item.children && item.type === COSTENUM.projectTreeType.TREE_NODE_DEPT && item.children.length > 0) {
                this.queryModel.businessDept = item.text
                // this.queryModel.accountingObject = ''
                this.companyId = item.id
                this.isShowGroup = true
                this.selectData.groupIdList = item.children
                for (let i = 0; i < this.standaredSubjectQueryModel.companyIdList.length; i++) {
                    if (this.standaredSubjectQueryModel.companyIdList[i].id === item.parentId) {
                        this.queryModel.company = this.standaredSubjectQueryModel.companyIdList[i].text
                        for (let j = 0; j < this.standaredSubjectQueryModel.typeList.length; j++) {
                            if (this.standaredSubjectQueryModel.typeList[j].id === this.standaredSubjectQueryModel.companyIdList[i].parentId) {
                                this.queryModel.group = this.standaredSubjectQueryModel.typeList[j].text
                            }
                        }
                    }
                }
            } else if (item.type === COSTENUM.projectTreeType.TREE_NODE_DEPT && !item.children) {
                this.isShowGroup = true
                this.queryModel.businessDept = item.text
                this.queryModel.accountingObject = ''
                this.emit(item)
                this.selectData.groupIdList = []
                for (let i = 0; i < this.standaredSubjectQueryModel.companyIdList.length; i++) {
                    if (this.standaredSubjectQueryModel.companyIdList[i].id === item.parentId) {
                        this.queryModel.company = this.standaredSubjectQueryModel.companyIdList[i].text
                        for (let j = 0; j < this.standaredSubjectQueryModel.typeList.length; j++) {
                            if (this.standaredSubjectQueryModel.typeList[j].id === this.standaredSubjectQueryModel.companyIdList[i].parentId) {
                                this.queryModel.group = this.standaredSubjectQueryModel.typeList[j].text
                            }
                        }
                    }
                }
            } else {
                if (!item) return
                this.queryModel.accountingObject = item.text
                item.accountingObjectId = item.id
                item.companyId = this.companyId
                for (let i = 0; i < this.standaredSubjectQueryModel.projectIdList.length; i++) {
                    if (this.standaredSubjectQueryModel.projectIdList[i].id === item.parentId) {
                        this.queryModel.businessDept = this.standaredSubjectQueryModel.projectIdList[i].text
                        item.companyId = this.standaredSubjectQueryModel.projectIdList[i].id
                        for (let j = 0; j < this.standaredSubjectQueryModel.companyIdList.length; j++) {
                            if (this.standaredSubjectQueryModel.companyIdList[j].id === this.standaredSubjectQueryModel.projectIdList[i].parentId) {
                                this.queryModel.company = this.standaredSubjectQueryModel.companyIdList[j].text
                                if (!item.companyId) item.companyId = this.standaredSubjectQueryModel.companyIdList[j].id
                                for (let t = 0; t < this.standaredSubjectQueryModel.typeList.length; t++) {
                                    if (this.standaredSubjectQueryModel.typeList[t].id === this.standaredSubjectQueryModel.companyIdList[j].parentId) {
                                        this.queryModel.group = this.standaredSubjectQueryModel.typeList[t].text
                                        if (!item.companyId) item.companyId = this.standaredSubjectQueryModel.typeList[t].id
                                    }
                                }
                            }
                        }
                    }
                }
                this.emit(item)
            }
            console.log(this.queryModel.accountingObject)
        },
        getProductAccountingTargetTree () {
            console.log(this.queryModel)
            // 获取成本分期树
            const _this = this
            getAccountingTargetTree()
                .then(response => {
                    if (response.code !== '2000') {
                        _this.$showError(response.message)
                    } else {
                        _this.accountingTargetTreeData = response.data[0].children.length > 0 ? response.data[0].children : []

                        if (this.valueObjectId.companyId) {
                            this.getRelevantData()
                        } else if (this.valueObjectId.accountingObjectId) {
                            this.initList(_this.accountingTargetTreeData)
                            this.deassignDropLIst()
                        } else {
                            this.initList(_this.accountingTargetTreeData)
                        }
                    }
                })
                .catch(error => {
                    console.log(error)
                    this.$showError(error.message ? error.message : 'msg_system_error')
                })
        },

        getRelevantData () {
            const _this = this
            getAccountingTargetTree({ companyId: this.valueObjectId.companyId }).then(response => {
                if (response.code !== '2000') {
                    _this.$showError(response.message)
                } else {
                    this.selectData.projectIdList = []
                    this.standaredSubjectQueryModel.projectIdList = []
                    this.accountingTargetTreeData = response.data[0].children.length > 0 ? response.data[0].children : response.data[0]
                    this.initList(this.accountingTargetTreeData)
                    this.queryModel.company = response.data[0].text
                    for (let j = 0; j < this.standaredSubjectQueryModel.projectIdList.length; j++) {
                        if (this.standaredSubjectQueryModel.projectIdList[j].parentId === response.data[0].id) {
                            this.queryModel.businessDept = this.standaredSubjectQueryModel.projectIdList[j].text
                        }
                    }
                }
            })
        },
        // 有成本分期id 重新复制
        deassignDropLIst () {
            for (let m = 0; m < this.standaredSubjectQueryModel.groupIdList.length; m++) {
                if (this.standaredSubjectQueryModel.groupIdList[m].id === this.valueObjectId.accountingObjectId) {
                    this.queryModel.accountingObject = this.standaredSubjectQueryModel.groupIdList[m].text

                    for (let i = 0; i < this.standaredSubjectQueryModel.projectIdList.length; i++) {
                        if (this.standaredSubjectQueryModel.projectIdList[i].id === this.standaredSubjectQueryModel.groupIdList[m].parentId) {
                            this.queryModel.businessDept = this.standaredSubjectQueryModel.projectIdList[i].text
                            this.selectData.groupIdList = this.standaredSubjectQueryModel.projectIdList[i].children
                            for (let j = 0; j < this.standaredSubjectQueryModel.companyIdList.length; j++) {
                                if (this.standaredSubjectQueryModel.companyIdList[j].id === this.standaredSubjectQueryModel.projectIdList[i].parentId) {
                                    this.queryModel.company = this.standaredSubjectQueryModel.companyIdList[j].text
                                    this.selectData.projectIdList = this.standaredSubjectQueryModel.companyIdList[j].children
                                    for (let t = 0; t < this.standaredSubjectQueryModel.typeList.length; t++) {
                                        if (this.standaredSubjectQueryModel.typeList[t].id === this.standaredSubjectQueryModel.companyIdList[j].parentId) {
                                            this.queryModel.group = this.standaredSubjectQueryModel.typeList[t].text
                                            this.selectData.companyIdList = this.standaredSubjectQueryModel.typeList[t].children
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        // 处理数据
        initList (data) {
            data.map(item => {
                if (item.type === COSTENUM.projectTreeType.TREE_NODE_GROUP) {
                    this.selectData.typeList.push(item)
                    this.standaredSubjectQueryModel.typeList.push(item)
                    if (item.children) {
                        this.initList(item.children)
                    }
                } else if (item.type === COSTENUM.projectTreeType.TREE_NODE_COMPANY) {
                    this.selectData.companyIdList.push(item)
                    this.standaredSubjectQueryModel.companyIdList.push(item)
                    if (item.children) {
                        this.initList(item.children)
                    }
                } else if (item.type === COSTENUM.projectTreeType.TREE_NODE_DEPT) {
                    this.selectData.projectIdList.push(item)
                    this.standaredSubjectQueryModel.projectIdList.push(item)
                    if (item.children) {
                        this.initList(item.children)
                    }
                } else if (item.type === COSTENUM.projectTreeType.TREE_NODE_ACC_OBJ) {
                    this.selectData.groupIdList.push(item)
                    this.standaredSubjectQueryModel.groupIdList.push(item)
                }
            })
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
