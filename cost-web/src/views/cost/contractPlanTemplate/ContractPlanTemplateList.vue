<template>
    <div class="main">
        <div class="user-manage-content">

            <ContracTree class="contract-tree-content"
                         :searchVal="searchVal"
                         :sbleData="options"
                         :cHeight="tHeight"
                         @changeCheckedNode="changeCheckedNode"></ContracTree>
            <div class="table-right">
                <div>
                    <el-row>
                        <el-col :span="24"
                                class="selectNodeClass">
                            <div style="float:left;"
                                 v-show='selectNode'>
                                <strong>当前选择：</strong>{{selectNode?selectNodeName:''}}</div>
                            <div class="el-form-item">
                                <el-button type="primary"
                                           size="mini"
                                           :disabled="selectNode"
                                           v-if="$checkPersmissionByCode('cost:subjectContractPlanMapping:save')"
                                           class="add"
                                           @click="handleAddRow">{{$l('btn_add')}}</el-button>
                            </div>
                        </el-col>
                    </el-row>
                    <div ref="contractPlanListTable">
                        <el-table :data="tableData"
                                  stripe
                                  border
                                  tooltip-effect="dark"
                                  style="width: 100%"
                                  :height="tHeight"
                                  size="small">
                            <el-table-column fixed
                                             type="index"
                                             :label="$l('lbl_no')"
                                             width="60">

                            </el-table-column>
                            <el-table-column fixed
                                             prop="contractPlanModel"
                                             :label="$l('lbl_contract_planning_name')"
                                             width="150">
                                <template slot-scope="scope">
                                    <div v-if="scope.row.contractPlanModel&&scope.row.contractPlanModel.name">
                                        <span v-show="!scope.row._editStatus">{{scope.row.contractPlanModel.name}}</span>
                                        <div v-if="scope.row._editStatus && scope.row.contractPlanModel.name">
                                            <span v-show="scope.row._editStatus"
                                                  class="selecttIcons"
                                                  @click="isSelectName(scope.$index, scope.row)">{{scope.row.contractPlanModel.name}}</span>
                                        </div>
                                    </div>
                                    <div v-else>
                                        <span v-show="scope.row._editStatus"
                                              class="selecttIcons"
                                              @click="isSelectName(scope.$index,scope.row)">{{$l('lbl_choose')}}</span>
                                    </div>

                                </template>
                            </el-table-column>
                            <el-table-column fixed
                                             prop="splitRate"
                                             :label="$l('lbl_split_proportion_of_cost_subject')"
                                             width="180">
                                <template slot-scope="scope">
                                    <span v-show="!scope.row._editStatus"
                                          :style="{'color':getColor('splitRate')}">{{scope.row.splitRate}}</span>
                                    <span>
                                        <el-input v-model.trim="scope.row.splitRate"
                                                  maxlength="5"
                                                  type="number"
                                                  onmousewheel="return false;"
                                                  placeholder=""
                                                  v-show="scope.row._editStatus "
                                                  :style="{'width':'120px'}"
                                                  size="mini"
                                                  @blur="handleRowChange('splitRate',scope.row.splitRate,scope.row,$event)"></el-input>
                                    </span>
                                    <span :style="{'color':getColor('splitRate')}">%</span>
                                </template>
                            </el-table-column>
                            <el-table-column fixed
                                             prop="reservedChangeRate"
                                             :label="$l('lbl_reserve_change_ratio')"
                                             width="150">
                                <template slot-scope="scope">
                                    <!-- <span v-show="!scope.row._editStatus">{{scope.row.reservedChangeRate}}</span>
                                    <span>
                                        <el-input v-model.trim="scope.row.reservedChangeRate"
                                                  maxlength="3"
                                                  placeholder=""
                                                  v-show="scope.row._editStatus "
                                                  :style="{'width':'80px'}"
                                                  @blur="handleRowChange('reservedChangeRate',scope.row.reservedChangeRate,scope.row,$event)"></el-input>
                                    </span> -->
                                    <span>{{scope.row.contractPlanModel.reservedChangeRate}}%</span>
                                </template>
                            </el-table-column>
                            <el-table-column fixed
                                             prop="remark"
                                             :label="$l('lbl_remark')">
                                <template slot-scope="scope">
                                    <span v-show="!scope.row._editStatus">{{scope.row.remark}}</span>
                                    <el-input v-model.trim="scope.row.remark"
                                              placeholder=""
                                              v-show="scope.row._editStatus"
                                              size="mini"></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column :label="$l('lbl_operation')"
                                             fixed="right"
                                             width="180">
                                <template slot-scope="scope">
                                    <el-button size="mini"
                                               type="text"
                                               icon="el-icon-edit"
                                               :title="$l('btn_edit')"
                                               v-if="$checkPersmissionByCode('cost:subjectContractPlanMapping:save')"
                                               @click="editRow(scope.$index, scope.row)"></el-button>
                                    <!-- 保存 -->
                                    <el-button size="mini"
                                               type="text"
                                               icon="fa fa-floppy-o"
                                               :title="$l('btn_save')"
                                               @click="saveRow(scope.$index, scope.row)"
                                               v-if="$checkPersmissionByCode('cost:subjectContractPlanMapping:save')"
                                               :disabled="!scope.row._editStatus"></el-button>
                                    <!-- 取消 -->
                                    <el-button size="mini"
                                               type="text"
                                               icon="fa fa-undo"
                                               :title="$l('btn_cancel')"
                                               @click="cancelEditRow(scope.$index, scope.row)"
                                               v-if="$checkPersmissionByCode('cost:subjectContractPlanMapping:save')"
                                               :disabled="!scope.row._editStatus"></el-button>

                                    <!-- 删除 -->
                                    <el-button size="mini"
                                               type="text"
                                               icon="el-icon-delete"
                                               :title="$l('btn_delete')"
                                               @click="deleteRow(scope.$index, scope.row)"
                                               v-if="$checkPersmissionByCode('cost:subjectContractPlanMapping:delete')"
                                               :disabled="!scope.row.id"></el-button>

                                    <!-- 禁用 -->
                                    <el-button size="mini"
                                               type="text"
                                               icon="el-icon-circle-check-outline"
                                               :title="$l('btn_enable')"
                                               @click="changeStatusRow(scope.$index, scope.row)"
                                               v-if="$checkPersmissionByCode('cost:subjectContractPlanMapping:changeStatus')"
                                               v-show="!scope.row._editStatus && scope.row.status == '0'"></el-button>

                                    <!-- 启用 -->
                                    <el-button size="mini"
                                               type="text"
                                               icon="el-icon-remove-outline"
                                               :title="$l('btn_disable')"
                                               @click="changeStatusRow(scope.$index, scope.row)"
                                               v-if="$checkPersmissionByCode('cost:subjectContractPlanMapping:changeStatus')"
                                               v-show="!scope.row._editStatus && scope.row.status == '1'"></el-button>

                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                    <SelectPlan v-show="dialogVisible"
                                @closeDialogDialogVisible="closeDialogDialogVisible"
                                :tableDataInfo="tableData"
                                @changeCheckedObj="changeCheckedObj"
                                :dialogVisible="dialogVisible"
                                :contractPlanTree="contractPlanTree"></SelectPlan>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import Vue from 'vue'
import { LoadingUtil } from '@/utils/common/LoadingUtil'
import SelectPlan from '@/components/cost/SelectionPlann/'
import { getValueByKey, getParameterByKey } from '@/utils/sys/ParameterUtil.js'
import ContracTree from '@/components/cost/ContractSelectTree/'
import { listAllContractPlanTree, getSubjectTree, getSubjectContractPlanMappingListBySubjectId, saveOrUpdateSubjectContractPlanMapping, deleteSubjectContractPlanMapping, changeSubjectContractPlanMappingStatus } from '@/api/cost/contractPlanTemplateAPI'
import { tableHeight } from '@/utils/common/index'

export default {
    data () {
        return {
            tableHeight: '0',
            fullHeight: document.documentElement.clientHeight,
            pageStatus: {
                edit: false
            },
            searchIndex: false,
            selectNode: true,
            selectNodeName: '',
            contractPlanId_cher: '',
            ContracPlanningData: false,
            searchVal: true,
            dialogVisible: false,
            status: '1',
            statusTable: [
                {                    value: '1',
                    label: '启用'                },
                {                    value: '0',
                    label: '禁用'                }
            ],
            contractPlanTree: [],
            templateData: {
                contractPlanModel: {
                    name: '',
                    type: ''
                },
                id: '',
                splitRate: '',
                reservedChangeRate: '',
                status: '1',
                subjectId: '',
                _editStatus: false,
                remark: '',
                sort: '',
                contractPlanId: ''
            },
            lave: '',
            isAdd: false,
            options: [],
            merpids: '',
            level: 1,
            selectEidtRow: [],
            tableData: [],
            selectEidtRowData: null,
            checkColorRed: 'checkColorRed',
            checkColor: 'checkColor',
            selectIndex: 0
        }
    },
    computed: {
        tHeight: function () {
            let options = {
                fullHeight: this.$store.getters.fullHeight,
                opened: this.$store.getters.sidebar.opened,
                showForm: this.$store.getters.showForm,
                hasPage: false,
                obj: this,
                otherHeight: 160
            }
            return `${tableHeight(options)}px`
        }
    },
    components: {
        ContracTree,
        SelectPlan
    },
    watch: {
        fullHeight (val) {
            this.settingTableHeight()
        }
    },
    mounted () {
        this.getOrganOptions()
        this.initContractPlanTreeData()
    },
    methods: {
        // 初始化规划库树数据
        initContractPlanTreeData () {
            listAllContractPlanTree({ type: '0', ownerId: '0' }).then(response => {
                this.contractPlanTree = response.data ? response.data : []
                this.initList(this.contractPlanTree)
            }).catch(error => {
                console.error(error)
                this.$showError(error.message ? error.message : 'msg_system_error')
            })
        },
        // 处理数据
        initList (data) {
            data.map(item => {
                if (item.type === '2') {
                    item.disabled = false
                } else {
                    item.disabled = true
                }
                item._editStatus = false
                item._isNew = false
                if (item.children.length > 0) this.initList(item.children)
            })
        },
        getOrganOptions () {
            const _this = this
            new Promise((resolve, reject) => {
                getSubjectTree({ type: '0', ownerId: '0' }).then(response => {
                    _this.options = response.data

                    resolve()
                }).catch(error => {
                    reject(error)
                })
            })
        },
        isSelectName (index, rowData) {
            this.dialogVisible = true
            this.selectIndex = index
            this.selectEidtRowData = rowData
        },
        closeDialogDialogVisible (bool) {
            this.dialogVisible = false
        },
        changeCheckedObj (obj) {
            let _checkRepeat = this.tableData.find(item => { return item.contractPlanModel.id === obj.id })
            if (_checkRepeat && _checkRepeat.id) {
                this.$showNormalError('规划已存在')
                return
            }
            if (obj.status !== '1') {
                this.$showNormalError('规划已禁用')
                return
            }
            this.dialogVisible = false
            // this.selectEidtRowData.contractPlan.name = obj.name

            if (this.isAdd) {
                this.selectIndex = this.tableData.length - 1
                this.templateData.id = ''
                this.templateData.type = '0'
            } else {
                this.templateData = this.tableData[this.selectIndex]
            }
            this.templateData.contractPlanModel.name = obj.name
            this.templateData.contractPlanModel.type = obj.type
            this.templateData.subjectId = this.contractPlanId_cher.id
            this.templateData.contractPlanId = obj.id
            this.templateData.reservedChangeRate = obj.reservedChangeRate || 0
            this.templateData.contractPlanModel = obj

            this.tableData.splice(this.selectIndex, 1, this.templateData)
            this.templateData = this.getDefaultData()
        },
        changeCheckedNode (value) {
            //debugger
            if (this.pageStatus.edit) {
                this.$showError('msg_subject_finish_edit')
                return
            }
            if (value && value.reserveCostType === '1') {
                this.$showError('当前科目为预备费类型，不能新增合约规划！')
                return
            }
            if (value.children.length === 0) {
                this.selectNode = false
            } else {
                this.selectNode = true
                return true
            }
            this.selectNodeName = value.name || ''

            const _this = this
            this.contractPlanId_cher = value
            getSubjectContractPlanMappingListBySubjectId({ type: '0', subjectId: value.id })
                .then(response => {
                    if (response.code !== '2000') {
                        _this.$showError(response.message)
                    } else {
                        console.log(this.tableData)
                        if (response.data) {
                            _this.tableData = response.data
                            this.handleRowChange()
                        }
                    }
                }).catch(error => {
                    console.log(error)
                })
        },
        reloadData () {
            const _this = this
            new Promise((resolve, reject) => {
                getSubjectContractPlanMappingListBySubjectId({ type: '0', subjectId: this.contractPlanId_cher.id }).then(response => {
                    if (response.code !== '2000') {
                        _this.$showError(response.message)
                    } else {
                        console.log(this.tableData)
                        if (response.data) {
                            _this.tableData = response.data
                        }
                    }

                    resolve()
                }).catch(error => {
                    reject(error)
                })
            })
        },
        handleAddRow () {
            if (this.pageStatus.edit) {
                this.$showError('msg_subject_finish_edit')
                return
            }
            this.isAdd = true

            this.templateData._editStatus = true
            this.pageStatus.edit = true
            this.tableData.push(this.getDefaultData())
        },
        getColor (type) {
            let sum = 0
            this.tableData.map(item => {
                sum += parseInt(item[type])
            })
            return sum > 100 ? 'red' : ''
        },
        handleRowChange (fieldType, fieldValue, rowData, event) {
            const allSplitRate = []
            const allReservedCchangeRate = []

            if (fieldValue > 100 || fieldValue <= 0) {
                let _msg = this.$l('msg_only_input') + '0-100'
                this.$showNormalError(_msg)
                if (event) event.currentTarget.focus()
            }
            for (let i = 0; i < this.tableData.length; i++) {
                allSplitRate.push(this.tableData[i].splitRate)
                allReservedCchangeRate.push(this.tableData[i].reservedChangeRate)
            }
            if (this.sumAdd(allSplitRate) > 100) {
                let _msg = this.$l('msg_the_cost_split_ratio_should_not_exceed') + '100%'
                this.$showNormalError(_msg)
                if (event) event.currentTarget.focus()
                this.searchIndex = false
            } else {
                this.searchIndex = true
            }
        },
        sumAdd (list) {
            var sum = 0
            for (let i = 0; i < list.length; i++) {
                sum += parseInt(list[i])
            }

            return sum
            // const total = eval(list.join('+'))
        },
        editRow (index, rowData) {
            this.isAdd = false
            if (this.pageStatus.edit) {
                this.$showError('msg_subject_finish_edit')
                return
            }
            this.pageStatus.edit = true
            const newItem = this.tableData[index]
            newItem._editStatus = !newItem._editStatus
            Vue.set(this.tableData, index, newItem)
        },
        cancelEditRow (index, rowData) {
            if (this.isAdd) {
                this.tableData.splice(index, 1)
                this.pageStatus.edit = false
                this.reloadData()
                this.getDefaultData()
            } else {
                const newItem = this.tableData[index]
                newItem._editStatus = !newItem._editStatus

                Vue.set(this.tableData, index, newItem)
                this.pageStatus.edit = false
                this.reloadData()
            }
        },
        changeStatusRow (index, rowData) {
            changeSubjectContractPlanMappingStatus(rowData).then(response => {
                if (response.code !== '2000') {
                    LoadingUtil.hideLoading()
                    this.$showError(response.message)
                } else {
                    LoadingUtil.hideLoading()
                    Vue.set(this.tableData, index, response.data)
                    this.reloadData()
                    this.$showSuccess(response.message)
                    this.pageStatus.edit = false
                }
            })
        },
        // 获取默认值
        getDefaultData () {
            return {
                contractPlanModel: {
                    name: ''
                },
                splitRate: '',
                reservedChangeRate: 0,
                status: '1',
                subjectId: '',
                _editStatus: true,
                remark: '',
                sort: '',
                contractPlanId: ''
            }
        },
        deleteRow (index, rowData) {
            this.$confirm(this.$l('msg_standared_delete_code'), this.$l('msg_delete_tips'), {
                confirmButtonText: this.$l('btn_confirm'),
                cancelButtonText: this.$l('btn_cancel'),
                type: 'warning'
            }).then(() => {
                deleteSubjectContractPlanMapping(rowData)
                    .then(response => {
                        LoadingUtil.hideLoading()
                        this.$delete(this.tableData, index)

                        this.getDefaultData()
                        this.$showSuccess(response.message)
                    })
                    .catch(error => {
                        console.log(error)
                        this.$showError(error.message ? error.message : 'msg_system_error')
                    })
            }).catch(() => { })
        },
        saveRow (index, rowData) {
            // this.templateData._editStatus = false
            if (rowData.contractPlanModel.name.length === 0 || rowData.contractPlanModel.name.length > 30 || rowData.splitRate.length === 0 ||
                rowData.contractPlanModel.reservedChangeRate.length === 0) {
                this.$showError('msg_standared_empty_data')
                return
            }

            let _param = JSON.parse(JSON.stringify(rowData))
            _param.contractPlanModel = _param.contractPlanModel
            const _this = this
            new Promise((resolve, reject) => {
                saveOrUpdateSubjectContractPlanMapping(_param).then(response => {
                    if (response.code !== '2000') {
                        _this.$showError(response.message)
                    } else {
                        _this.$showSuccess(response.message)
                        this.reloadData()
                        this.pageStatus.edit = false
                        this.merpids = response.data.id
                    }
                }).catch(error => {
                    console.log(error)

                    this.$showError(error.message ? error.message : 'msg_system_error')
                })
            })
        }
    }
}
</script>
<style scoped>
.main {
  text-align: left;
  padding: 15px;
  width: 100%;
  position: relative;
}
.user-manage-content {
  padding-left: 17rem;
}
.contract-tree-content {
  position: absolute;
  top: 15px;
  left: 15px;
  bottom: 15px;
  width: 265px;
  overflow-x: hidden;
  overflow-y: auto;
  border: #e4e4e4 1px solid;
}
.table-right {
  margin-left: 1rem;
}
.el-form-item {
}
h4 {
  float: left;
  font-weight: normal;
}
.add {
  float: right;
}
.selecttIcons {
  color: blue;
  cursor: pointer;
}
.contentTitle {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.custom-00a597 .main .el-input {
  width: 40% !important;
  text-align: right;
}
.checkColorRed {
  color: red;
}
.selectNodeClass {
  color: #1f3d3d;
  height: 30px;
  line-height: 30px;
  font-size: 14px;
  margin-bottom: 10px;
}
</style>
