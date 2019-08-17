<template>
    <div class="main">
        <el-row v-show="true"
                style="margin-top:20px">
            <!-- 成本分期选择级联 -->
            <AccountingTargetSelector @updateMessage="updateMessage"
                                      :valueObjectId='queryModel'
                                      :showTobe=true
                                      :disabled='{
                                                group: false,
                                                company: false,
                                                businessDept: false,
                                                accountingObject: false
                                            }'
                                      :queryModel='queryModel'
                                      :labelWidth="{
                group:80,
                company:80,
                businessDept:80,
                accountingObject:80 
            }"></AccountingTargetSelector>
        </el-row>
        <el-row v-show="true"
                style="margin-top:10px">
            <div class="user-manage-content">

                <ContracTree class="contract-tree-content"
                             :sbleData="treeList"
                             :searchVal="true"
                             :showIcon="true"
                             @changeCheckedNode="changeCheckedNode"></ContracTree>
                <div class="table-right">
                    <div>
                        <el-row>
                            <el-col :span="24"
                                    class="selectNodeClass">
                                <div style="float:left;"
                                     v-show='selectNode'>
                                    <strong>当前选择：</strong>{{selectNode?selectNode.name:''}}</div>

                            </el-col>
                            <!--<el-col :span="10"><span> </span></el-col>-->
                            <!--<el-col :span="14">-->
                            <!---->
                            <!--</el-col>-->
                        </el-row>
                        <div ref="contractPlanListTable">
                            <el-table :data="tableData"
                                      stripe
                                      border
                                      :height="tHeight"
                                      tooltip-effect="dark"
                                      style="width: 100%"
                                      size="small">
                                <!-- <el-table-column :label="$l('lbl_no')"
                                                width="100"
                                                type="index">
                                </el-table-column> -->
                                <el-table-column prop="name"
                                                 :label="$l('lbl_cost_comm_name')"
                                                 show-overflow-tooltip
                                                 width="180">
                                    <template slot-scope="scope">
                                        <span v-show="!scope.row._editStatus"
                                              class="contentTitle">{{scope.row.name}}</span>

                                    </template>
                                </el-table-column>
                                <el-table-column prop="reservedChangeRate"
                                                 :label="$l('lbl_reserve_change_ratio')"
                                                 width="120">
                                    <template slot-scope="scope">
                                        <!-- @modify@20181015 ，默认集成并且可以修改，因为业务上出现 总包合同和其他合同的预留变更比例不一致的需求-->
                                        <!-- && scope.row.type==='1' -->
                                        <span v-show="!scope.row._editStatus">{{scope.row.reservedChangeRate}}</span>
                                        <span>

                                        </span>
                                        <span>%</span>

                                    </template>
                                </el-table-column>
                                <el-table-column prop="type"
                                                 :label="$l('lbl_type')"
                                                 width="100">
                                    <template slot-scope="scope">
                                        <el-row>
                                            <el-col :span="3">
                                                <i :class="[scope.row.type ==='2'?'el-icon-tickets':'el-icon-menu']"></i>
                                            </el-col>
                                            <el-col :span="1">&nbsp;</el-col>
                                            <el-col :span="12">
                                                <fd-label :code="scope.row.type"
                                                          type="cost_dictionary_contract_type"></fd-label>
                                            </el-col>
                                        </el-row>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="status"
                                                 :label="$l('lbl_status')"
                                                 width="120">
                                    <template slot-scope="scope">
                                        <span v-show="!scope.row._editStatus && scope.row.type === '2'">
                                            <fd-label :code="scope.row.status"
                                                      type="cost_dictionary_status"></fd-label>
                                        </span>
                                        <span v-show="scope.row.type === '1' && !scope.row._editStatus">--</span>
                                        <fd-select v-show="scope.row._editStatus"
                                                   v-model='scope.row.status'
                                                   type="cost_dictionary_status"
                                                   :clearable="false"></fd-select>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="remark"
                                                 :label="$l('lbl_remark')">
                                    <template slot-scope="scope">
                                        <span v-show="!scope.row._editStatus">{{scope.row.remark}}</span>
                                        <el-input v-model.trim="scope.row.remark"
                                                  placeholder=""
                                                  v-show="scope.row._editStatus == 1"
                                                  maxlength="50"
                                                  size="mini"></el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column :label="$l('lbl_operation')"
                                                 width="180">
                                    <template slot-scope="scope">
                                        <!--虚拟-->
                                        <el-checkbox true-label="1"
                                                     false-label="0"
                                                     v-model="scope.row.isHidden">虚拟</el-checkbox>
                                        <!-- 保存 -->
                                        <el-button size="mini"
                                                   type="text"
                                                   icon="fa fa-floppy-o"
                                                   :title="$l('btn_save')"
                                                   v-if="$checkPersmissionByCode('cost:contractPlanMgmt:saveOrUpdateCpAccObj')"
                                                   @click="saveRow(scope.$index, scope.row)"
                                                   :disabled="false">保存</el-button>

                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                    </div>
                </div>

            </div>
        </el-row>
    </div>
</template>
<script>
import Vue from 'vue'
import { LoadingUtil } from '@/utils/common/LoadingUtil'
import { getValueByKey } from '@/utils/sys/ParameterUtil.js'
import COSTENUM from '@/utils/cost/enum'
import AccountingTargetSelector from '@/components/cost/AccountingTargetSelector/'
import ContracTree from '@/components/cost/ContractSelectTree/'

import { listAllContractPlanAccObjTree, saveOrUpdateCpAccObj } from '@/api/cost/contractPlanAccObjAPI'
import { tableHeight } from '@/utils/common/index'
export default {
    data () {
        return {
            tableHeight: '0',
            fullHeight: document.documentElement.clientHeight,

            queryModel: {
                group: '',
                company: '',
                businessDept: '',
                coprationId: '',
                companyId: '',
                departMentId: '',
                accountingObjectId: null, // 成本分期
                stageId: '',
                stageVersion: '', // 阶段版本
                subjectCode: '',
                subjectName: '',
                subjectCodeOrName: '',//科目编码和名称
                show: {
                    group: true,
                    company: true,
                    dept: true,
                    account: true
                }
            },
            pageStatus: {
                edit: false,
                typeName: ''
            },
            treeList: [],
            selectNode: null,
            selectEidtRow: null,
            tableData: [],
            paramterSetting: {
                cost_contract_root: {
                    key: 'cost.contract.root',
                    value: null
                },
                cost_contractPlan_parent_level: {
                    key: 'cost.contractPlan.parent.level',
                    value: null
                }
            }
        }
    },
    computed: {
        tHeight: function () {
            let options = {
                fullHeight: this.$store.getters.fullHeight,
                opened: this.$store.getters.sidebar.opened,
                showForm: this.$store.getters.showForm,
                obj: this
            }
            return `${tableHeight(options)}px`
        }
    },
    components: {
        ContracTree,
        AccountingTargetSelector
    },
    mounted () {
        // this.initParamter()
        this.$nextTick(function () {
            this.settingTableHeight()
        })
    },
    watch: {
        // 成本分期变化
        'queryModel.accountingObjectId': function (newValue, oldValue) {
            if (newValue !== oldValue) {

                this.initParamter(),
                    this.changeCheckedNode(1)
            }
        },
        fullHeight (val) {
            this.settingTableHeight()
        }
    },
    methods: {
        settingTableHeight: function () {
            const topHeight = this.$refs['contractPlanListTable'].getBoundingClientRect().top
            this.tableHeight = this.fullHeight - topHeight - 80
            this.$refs['contractPlanListTable'].style.Height = this.tableHeight + 'px'
        },
        // 处理参数
        initParamter () {

            try {
                this.paramterSetting.cost_contract_root.value = getValueByKey(this.paramterSetting.cost_contract_root.key)
                this.paramterSetting.cost_contractPlan_parent_level.value = parseInt(getValueByKey(this.paramterSetting.cost_contractPlan_parent_level.key))
                if (!this.paramterSetting.cost_contractPlan_parent_level.value) {
                    this.$showError('msg_cost_paramter_mistake')
                } else {
                    this.getList()
                }
            } catch (error) {
                console.error(error)
                this.$showError('msg_cost_paramter_mistake')
            }
        },
        // 处理数据
        initList (data) {

            data.map(item => {
                item._editStatus = false
                if (!item.reservedChangeRate) item.reservedChangeRate = 0
                item._isNew = false
                item._isValid = true
                if (item.children.length > 0) this.initList(item.children)
            })

        },
        getDefaultDataType (parentLevel) {
            return parentLevel < this.paramterSetting.cost_contractPlan_parent_level.value + 1 ? '1' : '2'

        },
        // 获取默认数据层级
        getDefaultDataLevel (parentLevel) {
            return (parseInt(parentLevel) + 1).toString()
        },

        // 获取列表
        getList () {

            listAllContractPlanAccObjTree({ type: '0', ownerId: this.queryModel.accountingObjectId })
                .then(response => {

                    let _data = response.data ? response.data : []
                    this.treeList = JSON.parse(JSON.stringify(_data))
                    this.initList(this.treeList)

                })
                .catch(error => {
                    console.log(error)
                    this.$showError(error.message ? error.message : 'msg_system_error')
                })
            LoadingUtil.hideLoading()
        },
        // 当前勾选
        changeCheckedNode (obj) {

            if (obj == 1) {
                this.tableData = []
            } else {
                if (obj.type === '2') {
                    // 规划点击return
                    this.tableData = []
                    this.tableData.push(obj)
                } else {
                    this.tableData = JSON.parse(JSON.stringify(obj.children))
                }
            }
            this.selectNode = obj

            let type = this.getDefaultDataType(this.selectNode.level)
            this.pageStatus.typeName = type === '1' ? '类别' : '规划'
            LoadingUtil.hideLoading()
        },
        // 保存行
        saveRow (index, rowData) {
            const _this = this
            saveOrUpdateCpAccObj(rowData)
                .then(response => {
                    LoadingUtil.hideLoading()
                    Vue.set(this.tableData, index, response.data)
                    _this.getList()
                    this.$showSuccess(response.message)
                })
                .catch(error => {
                    console.log(error)
                    this.$showError(error.message ? error.message : 'msg_system_error')
                })

        },
        // 级联改变
        updateMessage (item) {
            if (item.type === COSTENUM.projectTreeType.TREE_NODE_ACC_OBJ) {
                this.queryModel.accountingObjectId = item.accountingObjectId
                this.queryModel.accountingObjectText = item.text
                this.queryModel.companyId = item.companyId
            } else {
                this.queryModel.accountingObjectId = ''
                this.queryModel.accountingObjectText = ''
                this.queryModel.companyId = item.id
            }
        },
    }
}
</script>
<style scoped>
.selectNodeClass {
  color: #1f3d3d;
  height: 30px;
  line-height: 30px;
  font-size: 14px;
  margin-bottom: 10px;
}
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
  margin-top: 20px;
  margin-left: 1rem;
}
.el-form-item {
  float: right;
}
.contentTitle {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
