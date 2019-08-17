/*
引入：
import ProjectAccountSelect from '@/components/cost/ProjectAccountSelect/'
注册：
components: {  ProjectAccountSelect },
使用：
data:
data:{
    return{
        queryModel: {
        projectId: "2c0d1c75-ab36-4a65-ad95-a88c6e190275",
        accObjId: "4028b88165f189d10165f18b3c3b0049"
        }
    }
}

template:
<el-form>
    <ProjectAccountSelect v-model="queryModel"
                            :show="{project: true,accObj: true}"
                            :span="{project: 6,
    accObj: 6
}"
                            :labelWidth="{
    project: 150,
    accObj: 150
}"
                            :disabled="{
    project: false,
    accObj: false
}"
                            @change="selectChange" />
</el-form>

methods: {
    selectChange (selectItem) {

    }
}

表单验证：
prop="projectId" 
prop="accObjId" 
 
<template>
    <div>
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
    </div>
</template>
<script>
import { getProjectAccountingTargetTree } from '@/api/cost/selectTargetCostAPI'
import COSTENUM from '@/utils/cost/enum'
import { getLocalItem, setLocalItem, removeLocalItem } from '@/utils/common/cache'
import { mapGetters } from 'vuex'
import { arrayToTree, treeToArrayHelper, treeToArray } from '@/utils/cost/treeHelper/'
export default {
    name: 'ProjectAccountSelect',
    props: {
        // 默认值
        value: {
            type: Object,
            default: function () {
                return {
                    projectId: '', // 项目id
                    accObjId: '', // 成本分期id
                    accObjName: ''// 成本分期名称
                }
            }
        },
        // 标签宽度
        labelWidth: {
            type: Object,
            default: function () {
                return {
                    project: 120,
                    accObj: 120
                }
            }
        },
        // 禁用
        disabled: {
            type: Boolean,
            default: function () {
                return {
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
                    project: true,
                    accObj: true
                }
            }
        },
        // 列宽
        span: {
            type: Object,
            default: function () {
                return {
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
        //向上，向下选中up，down，both
        autoselect: {
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
                projectId: '',
                accObjId: '',
                accObjName: ''
            },
            totalData: {
                projectList: [],
                accObjList: []
            },
            selectData: {
                projectList: [],
                accObjList: []
            },
            loading: {
                project: false,
                accObj: false
            }
        }
    },
    computed: {
        ...mapGetters(['selectOrg'])
    },
    mounted: function () {
        this.getList()
        this.initParams()
    },
    methods: {
        initParams () {
            this.queryObj.projectId = this.value.projectId
            this.queryObj.accObjId = this.value.accObjId
        },
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
                lastData = this.deepCopy(newData)
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
                lastData = this.deepCopy(newData)
            }
            return lastData
        },
        deepCopy (data) {
            return JSON.parse(JSON.stringify(data))
        },
        initValue (init) {
            // 下级选项
            this.initAccObjSelect(init)
            // 重置当前项目
            this.initProjectSelect(init)
            this.initParams()
        },
        emitValue (projectId, objId) {
            // debugger
            this.$emit('input', {
                projectId: projectId || this.queryObj.projectId,
                accObjId: objId || this.queryObj.accObjId,
                accObjName: this.queryObj.accObjName
            })
        },
        initProjectSelect (isInit) {
            // 项目
            this.loading.project = true
            let _projectArray = []
            if (isInit) {
                this.selectData.projectList = this.deepCopy(this.totalData.projectList)
            }
            let accobjItem = this.totalData.accObjList.find(item => item.id === this.queryObj.accObjId)
            if (accobjItem && accobjItem.parentId) {
                this.queryObj.projectId = accobjItem.parentId
            }
            this.loading.project = false
        },
        initAccObjSelect (isInit) {
            // 成本分期
            this.loading.accObj = true
            let _accObjArray = []
            if (isInit || !this.queryObj.projectId) {
                this.selectData.accObjList = this.deepCopy(this.totalData.accObjList)
            } else {
                // 向上选中
                if (this.show.project && this.show.accObj) {
                    let parentProjectItem = this.totalData.projectList.find(item => item.id === this.queryObj.projectId)
                    if (parentProjectItem && parentProjectItem.children) {
                        //向下选中
                        if (this.autoselect === 'both' || this.autoselect === 'down') this.selectData.accObjList = parentProjectItem.children
                    }
                    if (this.queryObj.accObjId) {
                        // 成本分期向上选中项目
                        let _accobjItem = this.totalData.allData.find(item => { return item.id === this.queryObj.accObjId })
                        if (this.autoselect === 'both' || this.autoselect === 'up') this.queryObj.projectId = _accobjItem.parentId
                        return
                    }
                }
            }

            this.loading.accObj = false
        },
        // 初始化数据
        initData (isInit) {
            // 初始加载
            this.initTotalData()
        },
        initTotalData () {
            this.totalData.allData = treeToArray(this.data)
            this.totalData.allData.map(item => {
                if (item.children && item.type === 'dept') this.totalData.projectList = this.totalData.projectList.concat(item.children)
                if (item.children && item.type === 'project') this.totalData.accObjList = this.totalData.accObjList.concat(item.children)
            })
            this.initValue(true)
        },
        // 获取列表
        getList () {
            this.totalData.allData = []
            let storage_key = 'components_cost_ProjectAccountSelect'
            this.data = getLocalItem(storage_key)
            if (!this.data) {
                console.log('ajax request [components_cost_ProjectAccountSelect] data ')
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
        // 获取项目列表
        findProjectByParentId (parentItem) {

        },
        // 获取成本分期列表
        findAccobjByProject (projectItem) {

        },
        // 清除选择
        clearSelect (ENUMTYPE) {
            this.changeSelect(ENUMTYPE, null)
        },
        // 选择改变
        changeSelect (type, event) {
            console.log(event)
            // debugger
            if (event && this.totalData.allData) {
                let selectItem = this.totalData.allData.find(item => { return item.id === event })
                this.$emit('change', selectItem)
                //alert(JSON.stringify(selectItem))
                this.queryObj.accObjName = selectItem.text
            }

            switch (type) {
                case this.ENUMTYPE.PROJECT:
                    this.queryObj.accObjId = ''
                    this.initAccObjSelect()
                    break
                case this.ENUMTYPE.ACC_OBJ:
                    this.queryObj.projectId === ''
                    this.initProjectSelect()
                    break
            }
            this.emitValue()
        }
    },
    watch: {
        'value': {
            handler (newValue, oldValue) {
                console.log('ProjectAccountSelect value change')
                console.info(newValue)
                this.initValue()
            },
            deep: true
        },
        'selectOrg': {
            // 右上角选择事件
            handler (newValue, oldValue) {
                // debugger
                let _select = newValue || oldValue
                if (_select && _select.type) {
                    if (this.show.project) {
                        this.loading.project = true
                        this.queryObj.projectId = ''
                        this.selectData.projectList = this.totalData.allData.filter(item => {
                            return item.type === 'project' &&
                                ((',' + item.parentIds + ',').includes(',' + _select.id + ',') || item.id === _select.id)
                        })
                        this.loading.project = false

                        // 右上角选择的 项目，默认选择
                        if (this.selectData.projectList.length === 1 && _select.type === 'project' && _select.id) {
                            this.queryObj.projectId = _select.id
                        }
                    }

                    if (this.show.accObj) {
                        this.loading.accObj = true
                        this.queryObj.accObjId = ''
                        this.selectData.accObjList = this.totalData.allData.filter(item => {
                            return item.type === 'acc_obj' && (',' + item.parentIds + ',').includes(',' + _select.id + ',')
                        })
                        this.loading.accObj = false
                    }
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
<style scoped>
</style>
