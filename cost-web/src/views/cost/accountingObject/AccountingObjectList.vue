<template>
    <div class="app-container targetCostQuery"
         :style="{height:tHeight}"
         style="">

        <div class="subTitle"
             style="padding-right:0px">
            <div class="breadcrumb-child">
                <el-col :span="20"><i class="fa fa-folder-open-o"></i>成本分期设置列表 {{this.$route.query.accountingObjectName || ''}} </el-col>
                <el-col :span="4"
                        style="text-align:right">
                    <el-button size="mini"
                               @click='handleBack'>{{$l("btn_back")}}</el-button>
                </el-col>

            </div>
            <div class="button-area">

                <!-- <el-button class="ordinary-btn"
                           :icon="projectTreeSelectorIsExpand?'el-icon-d-arrow-left':'el-icon-d-arrow-right'"
                           type='primary'
                           @click='expandProjectTreeSelect'>{{projectTreeSelectorIsExpand?'收起组织':'展开组织'}}</el-button> -->
            </div>
        </div>

        <el-row>
            <el-form size="mini">
                <ProjectSelector v-model='queryModel'
                                 @change="projectSelector_SelectChange"></ProjectSelector>
            </el-form>
        </el-row>

        <el-row style="text-align:right;margin:10px;margin-right:0"
                <el-col
                :span="projectTreeSelectorSpan">
            <ProjectTreeSelector v-model="page.selectNode"
                                 :text="page.text"></ProjectTreeSelector>
            </el-col>
            <el-col :span="24-projectTreeSelectorSpan"
                    :style="{'padding-left':'10px'}">
                <el-row style="margin-bottom:10px;border:none">
                    <el-tabs type="border-card"
                             v-model="activeName"
                             @tab-click="tabClick">
                        <el-tab-pane label="项目主数据查看">
                            <ProjectInfo :projectId="page.projectId"
                                         :stageId="page.stageId" />
                        </el-tab-pane>
                        <el-tab-pane label="成本分期设置">
                            <!-- 编制表格 -->
                            <div ref="contractPlanListTable">
                                <el-table border
                                          size="small"
                                          :data="pageModelList"
                                          :span-method="arraySpans"
                                          style="width: 100%">
                                    <el-table-column prop="stageName"
                                                     label="阶段"
                                                     width="80">
                                    </el-table-column>
                                    <el-table-column prop="name"
                                                     label="成本分期"
                                                     width="250">
                                    </el-table-column>
                                    <el-table-column prop="phaseNames"
                                                     label="对应主数据分期"
                                                     width="150">
                                    </el-table-column>
                                    <el-table-column prop="fCompanyName"
                                                     label="法人公司"
                                                     width="200">
                                    </el-table-column>
                                    <!-- 总建筑面积 -->
                                    <el-table-column prop="totalBuildingArea"
                                                     label="总建筑面积(㎡)"
                                                     width="130">
                                        <template slot-scope="scope">{{scope.row.totalBuildingArea | NumFormat}}</template>
                                    </el-table-column>

                                    <!-- 总可售面积 -->
                                    <el-table-column prop="totalSellArea"
                                                     label="总可售面积(㎡)"
                                                     width="130">
                                        <template slot-scope="scope">{{scope.row.totalSellArea | NumFormat}}</template>
                                    </el-table-column>
                                    <!-- 操作  -->
                                    <el-table-column label="操作">
                                        <template slot-scope="scope">
                                            <!-- scope.row.isSynchronized位false 且 scope.row.id为空 -->
                                            <span v-if="!scope.row.isSynchronized && !scope.row.id  && scope.row.stageName !=='投前'">
                                                <el-button @click="projectDataListClick(scope.row)"
                                                           type="text"
                                                           v-if="$checkPersmissionByCode('cost:project:save')"
                                                           size="mini">同步基础数据</el-button>
                                            </span>
                                            <!-- 项目的查看 scope.row.isSynchronized位true -->
                                            <span v-if="scope.row.isSynchronized && !scope.row.id ">
                                                <el-button size="mini"
                                                           icon="el-icon-view"
                                                           :title="$l('btn_detail')"
                                                           type="text"
                                                           @click="checkInfoDataRow(scope.$index, scope.row)"></el-button>
                                            </span>
                                            <!-- 成本分期分期业态信息查询 -->
                                            <span v-if="(scope.row.phaseType === '0' || scope.row.phaseType === '1') && scope.row.stageName !=='投前' && scope.row.isSynchronized && scope.row.id  ">
                                                <el-button size="mini"
                                                           type="text"
                                                           icon="el-icon-view"
                                                           :title="$l('btn_detail')"
                                                           @click="checkInfoDataAccounting(scope.$index, scope.row)"></el-button>
                                            </span>
                                            <!-- 项目的修改scope.row.isSynchronized位true -->
                                            <span v-if="showOperationBtn('修改',scope.row) && !scope.row.id">
                                                <el-button size="mini"
                                                           type="text"
                                                           v-if="$checkPersmissionByCode('cost:accountingObjectMgmt:update')"
                                                           icon="el-icon-edit"
                                                           :title="$l('btn_edit')"
                                                           @click="editRow(scope.$index, scope.row)"></el-button>
                                            </span>
                                            <!-- 项目的添加成本分期 scope.row.isSynchronized位true -->

                                            <span v-if="showOperationBtn('添加成本分期',scope.row)">
                                                <el-button size="mini"
                                                           v-if="$checkPersmissionByCode('cost:accountingObjectMgmt:create')"
                                                           type="text"
                                                           @click="addObjectRow(scope.$index, scope.row)">添加成本分期</el-button>
                                            </span>
                                            <!--成本分期的删除根据成本分期已存在目标成本版本isCreatedTargetCost为true 记录ID不为空 待分期和跨期也不能修改删除-->
                                            <span v-if="showOperationBtn('删除',scope.row) && scope.row.id">
                                                <el-button size="mini"
                                                           type="text"
                                                           v-if="$checkPersmissionByCode('cost:accountingObjectMgmt:delete')"
                                                           icon="el-icon-delete"
                                                           :title="$l('btn_delete')"
                                                           @click="deleteObjectRow(scope.$index, scope.row)"></el-button>
                                            </span>
                                            <span v-if="scope.row.definedStageId &&!scope.row.isAuditPassTargetCost && scope.row.definedStageId !== scope.row.id && scope.row.stageName !=='投前' && scope.row.stageName !=='投后' && scope.row.phaseStageId !==scope.row.stageId">
                                                <el-button size="mini"
                                                           type="text"
                                                           @click="updataObjectRow(scope.$index, scope.row)">更新规划指标</el-button>
                                            </span>

                                        </template>
                                    </el-table-column>

                                </el-table>

                            </div>
                            <div style="margin:10px 0px;border:none;text-align:left;font-size:12px;color:red">
                                <div> 注：</div>
                                <div> 成本分期分为投前、投后、预备会、预结算、结算五个阶段，分别对应主数据的投前、投后、预备会、规划竣工、交付五个阶段。</div>
                                <div> 项目成本分期设置的前提条件：</div>
                                <div> 1.项目主数据已经到达该阶段（如：投后、预备会等）。</div>
                                <div> 2.前一阶段的目标成本编制完成审批通过（如投前目标成本编制完成审批通过后，可进行投后阶段的成本分期设置）。</div>
                            </div>
                        </el-tab-pane>

                    </el-tabs>
                </el-row>
            </el-col>
        </el-row>

        <!--项目主数据列表 -->
        <ProjectDataDialog v-if="dialogVisible"
                           :dialogVisible="dialogVisible"
                           @closeDialogDialogVisible="closeDialogDialogVisible"
                           :projectDialogData="projectDialogData"></ProjectDataDialog>

        <el-dialog title="成本分期"
                   :visible.sync="accountObjectDialog"
                   width="65%"
                   top="5%"
                   :show-close="false"
                   :close-on-click-modal="false"
                   :close-on-press-escape="false">
            <el-form ref="form"
                     :model="form"
                     label-width="80px"
                     label-position="left">
                <el-form-item label="是否分期">
                    <el-select v-model="form.isPhase"
                               :disabled="!isAdd || this.editQueryData.currentPhaseState || editQueryNumber"
                               placeholder="">
                        <el-option v-for="item in options"
                                   :key="item.value"
                                   :label="item.label"
                                   :value="item.value">
                        </el-option>

                    </el-select>
                </el-form-item>
                <el-form-item label="分期名称"
                              v-if="form.isPhase"
                              class="phaseName">
                    <el-input v-model="form.name"
                              :disabled="true"></el-input>
                </el-form-item>
                <div>
                    <span style="margin-bottom: 10px;display: inline-block;">项目主数据待分期列表</span>
                    <el-table border
                              :height="300"
                              size="small"
                              :span-method="objectSpanMethod"
                              :data="customProjectData"
                              style="width: 100%;margin-bottom:10px">
                        <el-table-column width="60">
                            <template slot-scope="scope">
                                <!-- <div @click="ppp(scope)">ssssss</div> -->
                                <!-- :checked="(scope.row.accountingObjectId === editQueryData['accountingObjectId']) || (!form.isPhase && (scope.row.projectId === editQueryData['projectId']) )" -->
                                <span v-if="(isEadit || isAdd || stageEdit) && scope.row.id" >
                                    <el-checkbox-group v-model="checkedForm">
                                        <el-checkbox
                                        :disabled="(scope.row.accountingObjectId !== '' && scope.row.accountingObjectId !== null) || !form.isPhase"
                                        :label="scope.row.id">&nbsp;</el-checkbox>
                                    </el-checkbox-group>
                                </span>

                            </template>
                        </el-table-column>
                        <el-table-column prop="parcelPhaseName"
                                         label="分期">
                        </el-table-column>
                        <el-table-column prop="fCompanyName"
                                         label="法人公司"
                                         width="200">
                        </el-table-column>

                        <!-- 总可售面积 -->
                        <el-table-column prop="name3"
                                         width="80"
                                         label="业态">

                        </el-table-column>

                        <el-table-column prop="product_property"
                                         label="产品属性"
                                         width="100">
                            <template slot-scope="scope">
                                <span v-if="scope.row.product_property && scope.row.product_property ==='1' ">
                                    毛坯
                                </span>
                                <span v-else-if="scope.row.product_property && scope.row.product_property ==='2' ">
                                    精装
                                </span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="BuildingArea"
                                         label="建设用地面积"
                                         width="130">
                            <template slot-scope="scope">
                                <span>{{scope.row.buildingArea}}</span>
                            </template>

                        </el-table-column>
                        <el-table-column prop="totalBuildingArea"
                                         label="总建筑面积"
                                         width="120">
                            <template slot-scope="scope">
                                <div>
                                    <span v-if="scope.$index%3==0">{{scope.row.totalBuildingArea}}</span>
                                    <span v-if="scope.$index%3==1 && isEadit">
                                        <el-input v-model="scope.row.roughBuildingArea"
                                                  :disabled="(scope.row.accountingObjectId !== '' && scope.row.accountingObjectId !== null) || (!form.isPhase && scope.row.isCreatedTargetCost)"
                                                  @change="changeTotalArea(scope.$index,scope.row)"></el-input>
                                    </span>
                                    <span v-if="scope.$index%3==1 &&  !isEadit ">{{scope.row.roughBuildingArea}}</span>
                                    <span v-if="scope.$index%3==2 && isEadit">
                                        <el-input v-model="scope.row.hardboundBuildingArea"
                                                  :disabled="(scope.row.accountingObjectId !== '' && scope.row.accountingObjectId !== null) || (!form.isPhase && scope.row.isCreatedTargetCost)"
                                                  @change="changeTotalArea(scope.$index,scope.row)"></el-input>
                                    </span>
                                    <span v-if="scope.$index%3==2 &&  !isEadit">{{scope.row.hardboundBuildingArea}}</span>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="totalSellArea"
                                         label="总可售面积"
                                         width="120">
                            width="120">
                            <template slot-scope="scope">
                                <div>
                                    <span v-if="scope.$index%3==0">{{scope.row.totalSellArea}}</span>
                                    <span v-else-if="scope.$index %3==1 && isEadit">
                                        <el-input :disabled="(scope.row.accountingObjectId !== '' && scope.row.accountingObjectId !== null) || (!form.isPhase && scope.row.isCreatedTargetCost)"
                                                  v-model="scope.row.roughSellArea"></el-input>
                                    </span>
                                    <span v-else-if="scope.$index %3==1 && (!isEadit || !isCheck)">{{scope.row.roughSellArea}}</span>
                                    <span v-else-if="scope.$index%3==2 && isEadit">
                                        <el-input :disabled="(scope.row.accountingObjectId !== '' && scope.row.accountingObjectId !== null) || (!form.isPhase && scope.row.isCreatedTargetCost)"
                                                  v-model="scope.row.hardboundSellArea"></el-input>
                                    </span>
                                    <span v-else-if="scope.$index%3==2 && !isEadit">{{scope.row.hardboundSellArea}}</span>
                                </div>

                            </template>
                        </el-table-column>
                    </el-table>
                </div>

                <span>
                    <el-button size="mini"
                               @click="cancel">取 消</el-button>
                    <el-button size="mini"
                               type="primary"
                               @click="submit"
                               v-if="isEadit || isAdd || stageEdit">确 定</el-button>
                </span>
            </el-form>
        </el-dialog>

    </div>
</template>


<script>
import Vue from 'vue'
import ProjectDataDialog from '@/views/cost/accountingObject/ProjectDataDialog'
import ProjectTreeSelector from '@/components/cost/ProjectTreeSelector/'
import ProjectSelector from '@/components/cost/ProjectSelector/'
import { LoadingUtil } from '@/utils/common/LoadingUtil'
import { getLocalItem, Constants } from '@/utils/common/cache'
import COSTENUM from '@/utils/cost/enum'
import {
    updateSyncList, deleteAccountObject, getAccountingObject, createAccountObject, updateAccountObject, searchAccountObjectList, searchCommonInfoList, getSyncList
} from '@/api/cost/accountObjectAPI'
import {
    NumFormat, // 千位符
    FLevel,
    dateFormat,
    Version
} from '@/filters/cost/'
import ProjectInfo from './ProjectInfo'
import { tableHeight } from '@/utils/common/index'
export default {
    components: {
        ProjectTreeSelector,
        ProjectInfo,
        ProjectSelector,
        ProjectDataDialog
    },
    data () {
        return {
            queryModel: {
                companyId: '',
                projectId: ''
            },
            projectTreeSelectorIsExpand: false, // 默认展开
            projectTreeSelectorSpan: 0, // 树
            tableHeight: '0',
            fullHeight: document.documentElement.clientHeight,
            options: [{
                value: true,
                label: '分期'
            }, {
                value: false,
                label: '不分期'            }
            ],
            checkedForm: [],
            projectDialogData: {
                projectId: '',
                stageId: ''
            },
            stage2TobePhase: {},
            stage3TobePhase: {},
            isAdd: false,
            isEadit: false,
            accountObjectDialog: false,
            dialogVisible: false,
            inputColumn1: '',
            activeName: '0',
            customProjectData: [],
            roughProjectData: {
                'phaseId': '', // 项目主数据分期ID
                'phaseCode': '', // 项目主数据分期编码
                'phaseName': '', // 项目主数据分期名称
                'fCompanyId': '', // 法人公司ID
                'fCompanyName': '', // 法人公司名称
                'businessTypeCode': '', // 业态编号
                'businessTypeName': '', // 业态名称
                'name1': '', // 一级业态
                'name2': '', // 二级业态,产品类型
                'name3': '', // 三级业态,产品类型
                'roughBuildingArea': '', // 毛坯建筑面积
                'roughSellArea': '', // 毛坯可售面积
                'hardboundBuildingArea': '', // 精装建筑面积
                'hardboundSellArea': '', // 精装可售面积
                'buildingArea': '', // 建设用地面积
                'totalBuildingArea': '', // 总建筑面积
                'totalSellArea': '', // 总可售面积
                'product_property': '1',
                'parcelPhaseName': ''
            },
            hardboundProjectData:
                {
                    'phaseId': '', // 项目主数据分期ID
                    'phaseCode': '', // 项目主数据分期编码
                    'phaseName': '', // 项目主数据分期名称
                    'fCompanyId': '', // 法人公司ID
                    'fCompanyName': '', // 法人公司名称
                    'businessTypeCode': '', // 业态编号
                    'businessTypeName': '', // 业态名称
                    'name1': '', // 一级业态
                    'name2': '', // 二级业态,产品类型
                    'name3': '', // 三级业态,产品类型
                    'roughBuildingArea': '', // 毛坯建筑面积
                    'roughSellArea': '', // 毛坯可售面积
                    'hardboundBuildingArea': '', // 精装建筑面积
                    'hardboundSellArea': '', // 精装可售面积
                    'buildingArea': '', // 建设用地面积
                    'totalBuildingArea': '', // 总建筑面积
                    'totalSellArea': '', // 总可售面积
                    'product_property': '2',
                    'parcelPhaseName': ''
                },
            form: {
                isPhase: true,
                phaseName: '',
                parcelPhaseName: ''
            },
            editQueryNumber: false,
            stage1List: [],
            stage2List: [],
            selectProjectData: [],
            editQueryData: {},
            projectData: [],

            page: {
                projectId: '', // 项目id
                text: '',
                selectNode: null
            },
            addObjectRowProjectId: '',
            pageModelList: [],
            stageEdit: false,
            accountObjectId: '',
            accountObjectStageId: '',
            rows: 1,
            spanArr: [],
            objspanArr: [],
            objArr: [],
            isCheck: false,
            pos: 0,
            poosed: 0,
            poos: 0,
            stage3List: [],
            stage12List: [],
            fCompanyArr: [],
            fCompany: 0

        }
    },
    filters: {
        NumFormat,
        FLevel,
        dateFormat,
        Version
    },
    computed: {
        tHeight: function () {
            let options = {
                fullHeight: this.$store.getters.fullHeight,
                opened: this.$store.getters.sidebar.opened,
                // showForm: this.$store.getters.showForm,
                obj: this,
                otherHeight: 92
            }
            return `${tableHeight(options)}px`
        }
    },
    methods: {
        // 项目选择变更事件
        projectSelector_SelectChange (selectProjectInfo) {
            if (selectProjectInfo && selectProjectInfo.type === 'project') {
                let selectProjectId = selectProjectInfo.id
                let selectProjectStadgeId = (selectProjectInfo && selectProjectInfo.attr) ? selectProjectInfo.attr['stageId'] : null
                this.loadData(selectProjectId, selectProjectStadgeId)
            }
        },
        // 重新加载数据
        loadData (newProjectId, newStadgeId) {
            let accountingObjectId = newProjectId || this.$route.query.accountingObjectId
            let stageId = newStadgeId || this.$route.query.stageId
            if (accountingObjectId) {
                this.page.selectNode = {
                    id: accountingObjectId
                }
            }

            // 初始化下拉框默认值
            this.$nextTick(function () {
                this.queryModel.projectId = accountingObjectId
            })
            this.page.projectId = accountingObjectId
            this.page.stageId = stageId
            this.accountObjectList()
            this.$nextTick(function () {
                this.settingTableHeight()
            })
        },
        // 展开收起
        expandProjectTreeSelect () {
            this.projectTreeSelectorIsExpand = !this.projectTreeSelectorIsExpand
            this.projectTreeSelectorSpan = this.projectTreeSelectorIsExpand ? 5 : 0
        },
        handleBack () {
            this.$router.push({
                name: 'ProjectList'
            })
        },
        settingTableHeight: function () {
            const topHeight = this.$refs['contractPlanListTable'].getBoundingClientRect().top
            this.tableHeight = this.fullHeight - topHeight - 80
            this.$refs['contractPlanListTable'].style.Height = this.tableHeight + 'px'
        },
        cancel () {
            this.accountObjectDialog = false
            this.stageEdit = false
            this.isAdd = false
            this.isEadit = false
            this.accountObjectList()
        },
        getSpanArr (data) {
            this.spanArr = []
            this.pos = 0
            for (var i = 0; i < data.length; i++) {
                if (i === 0) {
                    this.spanArr.push(1)
                    this.pos = 0
                } else {
                    // 判断当前元素与上一个元素是否相同
                    if (data[i] && (data[i].stageName === data[i - 1].stageName)) {
                        this.spanArr[this.pos] += 1
                        this.spanArr.push(0)
                    } else {
                        this.spanArr.push(1)
                        this.pos = i
                    }
                }
            }
        },
        objectSpanArr (data) {
            this.objspanArr = []
            this.poosed = 0
            for (var i = 0; i < data.length; i++) {
                if (i === 0) {
                    this.objspanArr.push(1)
                    this.poosed = 0
                } else {
                    // 判断当前元素与上一个元素是否相同
                    if (data[i].parcelPhaseCode === data[i - 1].parcelPhaseCode) {
                        this.objspanArr[this.poosed] += 1
                        this.objspanArr.push(0)
                    } else {
                        this.objspanArr.push(1)
                        this.poosed = i
                    }
                }
            }
            this.objArr = []
            this.poos = 0
            for (var j = 0; j < data.length; j++) {
                if (j === 0) {
                    this.objArr.push(1)
                    this.poos = 0
                } else {
                    // 判断当前元素与上一个元素是否相同
                    if (data[j].parcelPhaseName === data[j - 1].parcelPhaseName) {
                        this.objArr[this.poos] += 1
                        this.objArr.push(0)
                    } else {
                        this.objArr.push(1)
                        this.poos = j
                    }
                }
            }

            this.fCompanyArr = []
            this.fCompany = 0
            for (var k = 0; k < data.length; k++) {
                if (k === 0) {
                    this.fCompanyArr.push(1)
                    this.fCompany = 0
                } else {
                    // 判断当前元素与上一个元素是否相同
                    if (data[k].fCompanyName === data[k - 1].fCompanyName) {
                        this.fCompanyArr[this.fCompany] += 1
                        this.fCompanyArr.push(0)
                    } else {
                        this.fCompanyArr.push(1)
                        this.fCompany = k
                    }
                }
            }
        },

        objectSpanMethod ({ row, column, rowIndex, columnIndex }) {
            if (columnIndex === 0) {
                const _row = this.objspanArr[rowIndex]
                const _col = _row > 0 ? 1 : 0
                return {
                    rowspan: _row,
                    colspan: _col
                }
            }
            if (columnIndex === 1) {
                const _rows = this.objArr[rowIndex]
                const _cols = _rows > 0 ? 1 : 0
                return {
                    rowspan: _rows,
                    colspan: _cols
                }
            }

            if (columnIndex === 2) {
                const _rows = this.fCompanyArr[rowIndex]
                const _cols = _rows > 0 ? 1 : 0
                return {
                    rowspan: _rows,
                    colspan: _cols
                }
            }
        },
        // 合并单元格
        arraySpans ({ row, column, rowIndex, columnIndex }) {
            if (columnIndex === 0) {
                const _row = this.spanArr[rowIndex]
                const _col = _row > 0 ? 1 : 0
                return {
                    rowspan: _row,
                    colspan: _col
                }
            }
        },
        closeDialogDialogVisible (val) {
            this.dialogVisible = false
            if (val) {
                this.accountObjectList()
            }
        },
        getNewPhaseName () {
            var currentPhaseNameMap = new Map()
            if (this.stage12List.length > 1) {
                this.stage12List.forEach((item, index) => {
                    currentPhaseNameMap.set(item.name, true)
                })
            } else if (this.stage3List.length > 1) {
                this.stage3List.forEach((item, index) => {
                    currentPhaseNameMap.set(item.name, true)
                })
            }
            if (!currentPhaseNameMap.has('一期')) {
                return '一期'
            } else if (!currentPhaseNameMap.has('二期')) {
                return '二期'
            } else if (!currentPhaseNameMap.has('三期')) {
                return '三期'
            } else if (!currentPhaseNameMap.has('四期')) {
                return '四期'
            } else if (!currentPhaseNameMap.has('五期')) {
                return '五期'
            } else if (!currentPhaseNameMap.has('六期')) {
                return '六期'
            } else if (!currentPhaseNameMap.has('七期')) {
                return '七期'
            } else if (!currentPhaseNameMap.has('八期')) {
                return '八期'
            } else if (!currentPhaseNameMap.has('九期')) {
                return '九期'
            } else {
                return '十期'
            }
        },
        accountObjectList () {
            // projectId: this.page.projectId
            LoadingUtil.showLoading()
            
            searchAccountObjectList({ projectId: this.page.projectId })
                .then(response => {
                    LoadingUtil.hideLoading()
                    if (response.code !== '2000') {
                        this.$showError(response.message)
                    } else {
                        console.log('init')
                        console.log(response)
                        this.pageModelList = []
                        let ModelList = response.data ? response.data : []
                        let stage1List = ModelList.stage1List
                        let stage2List = ModelList.stage2List
                        let stage3List = ModelList.stage3List
                        let stage4List = ModelList.stage4List
                        let stage5List = ModelList.stage5List
                        this.stage12List = stage2List
                        this.stage2List = stage2List
                        this.stage3List = stage3List
                        if (stage2List) {
                            for (let i = 0; i < stage2List.length; i++) {
                                if (stage2List[i].phaseType === '3') {
                                    this.stage2TobePhase = stage2List[i]
                                    break
                                } else {
                                    this.stage2TobePhase = {}
                                }
                            }
                        }
                        console.log(this.stage3TobePhase)
                        if (stage3List) {
                            for (let i = 0; i < stage3List.length; i++) {
                                if (stage3List[i].phaseType === '3') {
                                    this.stage3TobePhase = stage3List[i]
                                    break
                                } else {
                                    this.stage3TobePhase = {}
                                }
                            }
                        }

                        this.pageModelList = this.pageModelList.concat(stage1List, stage2List, stage3List, stage4List, stage5List)
                        console.log("pageModelList")
                        console.log(this.pageModelList)
                        if (!this.pageModelList[0]) {
                            this.pageModelList = []
                        }
                        this.getSpanArr(this.pageModelList)
                        console.log('eeeee')
                        console.log(this.pageModelList)
                        console.log('点击取消后')
                        console.log(this.checkedForm)
                    }
                }).catch(error => {
                    this.$showError(error.message ? error.message : 'msg_system_error')
                })
        },
        ppp(){
            this.checkedForm = []
            console.log('嘟嘟嘟')
            // console.log(s)
            console.log(this.editQueryData)
            console.log(this.editQueryData['accountingObjectId'])
            console.log(this.editQueryData['projectId'])
            console.log(this.customProjectData) 
            for(var i = 0 ; i<this.customProjectData.length;i++){
                if(this.customProjectData[i].accountingObjectId === this.editQueryData['accountingObjectId'] || this.customProjectData[i].projectId === this.editQueryData['projectId']){
                    this.checkedForm.push(this.customProjectData[i].id)
                }
            }
            
            console.log(this.checkedForm)
        },
        submit () {
            // debugger
            let copy = []
            this.customProjectData.forEach(function (item) {
                if (copy.indexOf(item.phaseId) === -1) {
                    copy.push(item.phaseId)
                }
            })
            if ((this.form.isPhase && this.stage12List.length === 1) || (this.form.isPhase && this.stage3List.length === 1)) {
                if (this.checkedForm.length === copy.length) {
                    return this.$showNormalError('如果你选择分期,则不能勾选所有主数据分期')
                }
            }

            if (this.isEadit) {
                // alert('44444')
                // 项目的修改
                this.editQueryData.businessTypeList = []
                console.log('11111')
                console.log(this.customProjectData)
                console.log('22222')
                console.log(this.checkedForm)
                console.log(typeof(this.checkedForm))
                // return
                for (let i = 0; i < this.customProjectData.length; i++) {
                    for (let j = 0; j < this.checkedForm.length; j++) {
                        if (this.customProjectData[i].id === this.checkedForm[j]) {
                            let newBusinessInfo = {
                                'phaseId': this.customProjectData[i].phaseId,
                                'parcelId': this.customProjectData[i].parcelId,
                                'fCompanyId': this.customProjectData[i].fCompanyId, // 法人公司ID
                                'businessTypeCode': this.customProjectData[i].businessTypeCode,
                                'totalBuildingArea': this.customProjectData[i].totalBuildingArea, // 总建筑面积
                                'totalSellArea': this.customProjectData[i].totalSellArea, // 总可售面积
                                'id': this.customProjectData[i].id, // 主键ID,据此进行查询更新
                                'roughBuildingArea': this.customProjectData[i + 1].roughBuildingArea, // 毛坯建筑面积
                                'roughSellArea': this.customProjectData[i + 1].roughSellArea, // 毛坯可售面积
                                'hardboundBuildingArea': this.customProjectData[i + 2].hardboundBuildingArea, // 精装建筑面积
                                'hardboundSellArea': this.customProjectData[i + 2].hardboundSellArea, // 精装可售面积
                                'parcelPhaseCode':this.customProjectData[i].parcelPhaseCode
                            }
                            this.editQueryData.businessTypeList.push(newBusinessInfo)
                        }
                    }
                }
                console.log(this.editQueryData.businessTypeList)
                // return
                let querObj = {
                    'stageId': this.editQueryData.stageId,
                    'projectId': this.editQueryData.projectId,
                    'businessTypeList': this.editQueryData.businessTypeList
                }

                updateSyncList(querObj)
                    .then(response => {
                        this.$showSuccess(response.message)
                        this.accountObjectList()
                        this.isEadit = false
                    })
                    .catch(error => {
                        this.isEadit = false
                        console.log(error)
                        this.$showError(error.message ? error.message : 'msg_system_error')
                    })
                this.isEadit = false
            } else if (this.isAdd) {
                this.editQueryData.relatedProjectPhaseId = []
                for (let i = 0; i < this.customProjectData.length; i++) {
                    for (let j = 0; j < this.checkedForm.length; j++) {
                        if (this.customProjectData[i].id === this.checkedForm[j]) {
                            this.editQueryData.relatedProjectPhaseId.push(this.customProjectData[i].parcelPhaseCode)
                        }
                    }
                }

                let queryData = {
                    projectId: this.page.projectId,
                    isPhase: this.form.isPhase,
                    name: this.form.name,
                    relatedProjectPhaseId: this.editQueryData.relatedProjectPhaseId.join(',')
                }
                createAccountObject(queryData)
                    .then(response => {
                        this.$showSuccess(response.message)

                        console.log(this.stage3TobePhase)
                        this.accountObjectList()
                        this.isAdd = false
                    })
                    .catch(error => {
                        this.isAdd = false
                        console.log(error)
                        this.$showError(error.message ? error.message : 'msg_system_error')
                    })
                this.isAdd = false
            } else if (this.stageEdit) { // 成本分期的修改
                this.editQueryData.relatedProjectPhaseId = []
                for (let i = 0; i < this.customProjectData.length; i++) {
                    for (let j = 0; j < this.checkedForm.length; j++) {
                        if (this.customProjectData[i].id === this.checkedForm[j]) {
                            this.editQueryData.relatedProjectPhaseId.push(this.customProjectData[i].parcelPhaseCode)
                        }
                    }
                }

                let queryDatas = {
                    id: this.accountObjectId,
                    stageId: this.accountObjectStageId,
                    relatedProjectPhaseId: this.editQueryData.relatedProjectPhaseId.join(',') || this.relatedProjectPhaseId
                }
                updateAccountObject(queryDatas)
                    .then(response => {
                        this.$showSuccess(response.message)
                        this.accountObjectList()
                        this.stageEdit = false
                    })
                    .catch(error => {
                        this.stageEdit = false
                        console.log(error)
                        this.$showError(error.message ? error.message : 'msg_system_error')
                    })
                this.stageEdit = false
            }
            this.accountObjectDialog = false
        },
        changeTotalArea (index, rowData) {
            for (let i = 0; i < this.customProjectData.length; i++) {
                if (index % 3 === 1) {
                    let keys = index + 1
                    let allIndexs = index - 1
                    if (this.customProjectData[keys].hardboundBuildingArea === '') {
                        let allBuildingArea = parseFloat(rowData.roughBuildingArea)
                        if (allBuildingArea !== parseFloat(this.customProjectData[allIndexs].totalBuildingArea)) {
                            return this.$showNormalError('毛坯精装面积之和需等于总建筑面积，请重新输入')
                        }
                    } else {
                        let allBuildingArea = parseFloat(rowData.roughBuildingArea) + parseFloat(this.customProjectData[keys].hardboundBuildingArea)
                        if (allBuildingArea !== parseFloat(this.customProjectData[allIndexs].totalBuildingArea)) {
                            return this.$showNormalError('毛坯精装面积之和需等于总建筑面积，请重新输入')
                        }
                    }
                } else if (index % 3 === 2) {
                    let key = index - 1
                    let allIndex = index - 2
                    if (this.customProjectData[key].roughBuildingArea === '') {
                        let allBuildingArea = parseFloat(rowData.hardboundBuildingArea)
                        if (allBuildingArea !== parseFloat(this.customProjectData[allIndex].totalBuildingArea)) {
                            return this.$showNormalError('毛坯精装面积之和需等于总建筑面积，请重新输入')
                        }
                    } else {
                        let allBuildingArea = parseFloat(rowData.hardboundBuildingArea) + parseFloat(this.customProjectData[key].roughBuildingArea)
                        if (allBuildingArea !== parseFloat(this.customProjectData[allIndex].totalBuildingArea)) {
                            return this.$showNormalError('毛坯精装面积之和需等于总建筑面积，请重新输入')
                        }
                    }
                }
            }
        },
        // 获取新增对象默认值
        getDefaultObjectData () {
            return {
                id: '',
                phaseName: '1期',
                fCompanyName: '',
                businessTypeCode: '住宅',
                total_building_area: '别墅',
                total_sell_area: '',
                product_property: '',
                totalBuildingArea: '',
                BuildingArea: '',
                totalSellArea: '',
                isEadit: true,
                checkedForm: [],
                isPhase: true
            }
        },
        updataObjectRow (index, rowData) {
            this.stageEdit = true
            this.accountObjectId = rowData.id
            this.relatedProjectPhaseId = rowData.relatedProjectPhaseId
            this.accountObjectStageId = rowData.stageId
            this.editQueryData.accountingObjectId = rowData.id
            this.accountObjectDialog = true
            this.form.isPhase = rowData.isPhase
            this.form.name = rowData.name
            this.selectInfoDataAccounting(index, rowData)
        },
        selectInfoDataAccounting (index, rowData) {
            getAccountingObject({ id: rowData.id, stageId: rowData.stageId })
                .then(response => {
                    this.customProjectData = []
                    this.selectProjectData = []
                    this.projectData = response.data
                    console.log('customProjectData赋值')
                    console.log(response.data)
                    for (let i = 0; i < this.projectData.length; i++) {
                        this.customProjectData.push(this.projectData[i])
                        this.roughProjectData.phaseId = this.projectData[i].phaseId
                        this.roughProjectData.parcelId = this.projectData[i].parcelId
                        this.roughProjectData.fCompanyName = this.projectData[i].fCompanyName
                        this.roughProjectData.parcelPhaseCode = this.projectData[i].parcelPhaseCode
                        this.roughProjectData.phaseName = this.projectData[i].phaseName
                        this.roughProjectData.parcelPhaseName = this.projectData[i].parcelPhaseName
                        this.hardboundProjectData.phaseId = this.projectData[i].phaseId
                        this.hardboundProjectData.parcelId = this.projectData[i].parcelId
                        this.hardboundProjectData.fCompanyName = this.projectData[i].fCompanyName
                        this.hardboundProjectData.phaseName = this.projectData[i].phaseName
                        this.hardboundProjectData.parcelPhaseCode = this.projectData[i].parcelPhaseCode
                        this.hardboundProjectData.parcelPhaseName = this.projectData[i].parcelPhaseName
                        this.roughProjectData.roughBuildingArea = this.projectData[i].roughBuildingArea
                        this.roughProjectData.roughSellArea = this.projectData[i].roughSellArea
                        this.hardboundProjectData.hardboundBuildingArea = this.projectData[i].hardboundBuildingArea
                        this.hardboundProjectData.hardboundSellArea = this.projectData[i].hardboundSellArea
                        this.customProjectData.push(JSON.parse(JSON.stringify(this.roughProjectData)))
                        this.customProjectData.push(JSON.parse(JSON.stringify(this.hardboundProjectData)))
                    }
                    this.objectSpanArr(this.customProjectData)
                    // this.objectArr(this.customProjectData)
                }).catch(error => {
                    console.log(error)
                    this.$showError(error.message ? error.message : 'msg_system_error')
                })
        },
        deleteObjectRow (index, rowData) {
            let inforData = {
                'id': rowData.id
            }
            deleteAccountObject(inforData)
                .then(response => {
                    this.$showSuccess(response.message)
                    this.accountObjectList()
                })
                .catch(error => {
                    console.log(error)
                    this.$showError(error.message ? error.message : 'msg_system_error')
                })
        },
        // 成本分期数据修改
        stageEditRow (index, rowData) {
            this.checkedForm = []
            this.stageEdit = true
            this.accountObjectId = rowData.id
            this.accountObjectStageId = rowData.stageId
            this.form.name = rowData.name
            this.form.isPhase = rowData.isPhase
            this.checkInfoDataAccounting(index, rowData)

            this.accountObjectDialog = true
        },
        addObjectRow (index, rowData) {
            this.isAdd = true
            this.accountObjectDialog = true
            this.checkedForm = []
            this.addObjectRowProjectId = rowData.projectId
            this.checkInfoDataRow(index, rowData)
        },
        // 项目修改
        editRow (index, rowData) {
            console.log(rowData)
            // debugger
            
            this.isEadit = true
            this.editQueryData.projectId = this.page.projectId
            this.editQueryData.stageId = rowData.stageId
            if (rowData.id) {
                this.editQueryData.accountingObjectId = rowData.id
            } else {
                this.editQueryData.accountingObjectId = ''
            }

            this.checkInfoDataRow(index, rowData)
            this.accountObjectDialog = true
            console.log('点击编辑checkedForm')
            console.log(this.checkedForm)
        },

        showOperationBtn (btnName, rowData) {
            // 判断按钮是否显示

            if (btnName === '删除') {
                if (rowData.stageName === '投前' || rowData.phaseType === '3') {
                    return false
                }
                if (rowData.isCreatedTargetCost || rowData.isAuditPassTargetCost || !rowData.isSynchronized) {
                    return false
                }
                if (rowData.phaseType === '0') {
                    return false
                }
                if (rowData.phaseStageId === rowData.stageId) {
                    return true
                }
                return false
            } else if (btnName === '修改') {
                if (rowData.stageName === '投前' || rowData.phaseType === '3') {
                    return false
                }

                if (this.stage2List.length > 1 || this.stage3List.length > 1) {
                    // 如果无待分期，则不显示修改按钮
                    if (!this.stage2TobePhase.id && !this.stage3TobePhase.id) {
                        return false
                    }
                }

                if (rowData.isCreatedTargetCost || rowData.isAuditPassTargetCost || !rowData.isSynchronized) {
                    return false
                }
                if (rowData.phaseStageId === rowData.stageId) {
                    return true
                }
                if (rowData.stageName === '投后') {
                    if (rowData.id && rowData.phaseStageId === '3') {
                        return false
                    }

                    if (this.stage2TobePhase.id || (this.stage2List.length === 1)) {
                        return true
                    }
                } else if (rowData.stageName === '预备会') {
                    if (this.stage3TobePhase.id || (this.stage3List.length === 1)) {
                        return true
                    }
                }
                return false
            } else if (btnName === '添加成本分期') {
                if (rowData.stageName === '投前' || rowData.stageName === '预结算' || rowData.stageName === '结算') {
                    return false
                }
                if (rowData.id || !rowData.isSynchronized) {
                    return false
                }

                if (rowData.stageName === '投后') {
                    if (!this.stage2TobePhase.id && this.stage2List.length > 1) {
                        return false
                    }
                    if (this.stage2TobePhase.id || (this.stage2List.length === 1)) {
                        return true
                    }
                } else if (rowData.stageName === '预备会') {
                    if (!this.stage3TobePhase.id && this.stage3List.length > 1) {
                        return false
                    }
                    if (this.stage3TobePhase.id || (this.stage3List.length === 1)) {
                        return true
                    }
                }
                return false
            }
            return false
        },
        // 项目已同步数据
        projectSynchronized () {
            let queryData = {
                projectId: this.projectDialogData.projectId,
                stageId: this.projectDialogData.stageId
            }
            getSyncList(queryData)
                .then(response => {
                    this.$showSuccess(response.message)
                })
                .catch(error => {
                    console.log(error)
                    this.$showError(error.message ? error.message : 'msg_system_error')
                })
        },

        // 成本分期分期业态信息查询
        checkInfoDataAccounting (index, rowData) {
            this.accountObjectDialog = true
            this.form.name = rowData.name
            this.form.isPhase = rowData.isPhase
            var phaseNamesMap = new Map()
            if (rowData.phaseNames) {
                var phaseNamesArr = rowData.phaseNames.split('、')
                phaseNamesArr.forEach((item, index) => {
                    phaseNamesMap.set(item, true)
                })
            }
            getAccountingObject({ id: rowData.id, stageId: rowData.stageId })
                .then(response => {
                    this.customProjectData = []
                    this.selectProjectData = []
                    this.projectData = response.data

                    this.projectData.forEach((item, index) => {
                        if (phaseNamesMap.has(item.parcelPhaseName)) {
                            this.selectProjectData.push(item)
                        }
                    })
                    if (this.selectProjectData.length > 0) {
                        for (let i = 0; i < this.selectProjectData.length; i++) {
                            this.customProjectData.push(this.selectProjectData[i])
                            this.roughProjectData.phaseId = this.selectProjectData[i].phaseId
                            this.roughProjectData.parcelId = this.selectProjectData[i].parcelId
                            this.roughProjectData.fCompanyName = this.selectProjectData[i].fCompanyName
                            this.roughProjectData.phaseName = this.selectProjectData[i].phaseName
                            this.roughProjectData.parcelPhaseCode = this.selectProjectData[i].parcelPhaseCode
                            this.roughProjectData.parcelPhaseName = this.selectProjectData[i].parcelPhaseName
                            this.hardboundProjectData.phaseId = this.selectProjectData[i].phaseId
                            this.hardboundProjectData.parcelId = this.selectProjectData[i].parcelId
                            this.hardboundProjectData.phaseName = this.selectProjectData[i].phaseName
                            this.hardboundProjectData.parcelPhaseName = this.selectProjectData[i].parcelPhaseName
                            this.hardboundProjectData.fCompanyName = this.selectProjectData[i].fCompanyName
                            this.hardboundProjectData.parcelPhaseCode = this.selectProjectData[i].parcelPhaseCode
                            this.roughProjectData.roughBuildingArea = this.selectProjectData[i].roughBuildingArea
                            this.roughProjectData.roughSellArea = this.selectProjectData[i].roughSellArea
                            this.hardboundProjectData.hardboundBuildingArea = this.selectProjectData[i].hardboundBuildingArea
                            this.hardboundProjectData.hardboundSellArea = this.selectProjectData[i].hardboundSellArea
                            this.customProjectData.push(JSON.parse(JSON.stringify(this.roughProjectData)))
                            this.customProjectData.push(JSON.parse(JSON.stringify(this.hardboundProjectData)))
                        }
                    } else {
                        for (let i = 0; i < this.projectData.length; i++) {
                            this.customProjectData.push(this.projectData[i])
                            this.roughProjectData.phaseId = this.projectData[i].phaseId
                            this.roughProjectData.parcelId = this.projectData[i].parcelId
                            this.roughProjectData.fCompanyName = this.projectData[i].fCompanyName
                            this.roughProjectData.phaseName = this.projectData[i].phaseName
                            this.roughProjectData.parcelPhaseCode = this.projectData[i].parcelPhaseCode
                            this.roughProjectData.parcelPhaseName = this.projectData[i].parcelPhaseName
                            this.hardboundProjectData.phaseId = this.projectData[i].phaseId
                            this.hardboundProjectData.parcelId = this.projectData[i].parcelId
                            this.hardboundProjectData.phaseName = this.projectData[i].phaseName
                            this.hardboundProjectData.parcelPhaseName = this.projectData[i].parcelPhaseName
                            this.hardboundProjectData.parcelPhaseCode = this.projectData[i].parcelPhaseCode
                            this.hardboundProjectData.fCompanyName = this.projectData[i].fCompanyName
                            this.roughProjectData.roughBuildingArea = this.projectData[i].roughBuildingArea
                            this.roughProjectData.roughSellArea = this.projectData[i].roughSellArea
                            this.hardboundProjectData.hardboundBuildingArea = this.projectData[i].hardboundBuildingArea
                            this.hardboundProjectData.hardboundSellArea = this.projectData[i].hardboundSellArea
                            this.customProjectData.push(JSON.parse(JSON.stringify(this.roughProjectData)))
                            this.customProjectData.push(JSON.parse(JSON.stringify(this.hardboundProjectData)))
                        }
                    }

                    this.objectSpanArr(this.customProjectData)
                })
                .catch(error => {
                    console.log(error)
                    this.$showError(error.message ? error.message : 'msg_system_error')
                })
        },
        // 项目查看
        checkInfoDataRow (index, rowData) {
            console.log('项目查看')
            console.log(this.checkedForm)
            // debugger
            this.accountObjectDialog = true
            if (this.isAdd) {
                this.form.isPhase = false
                this.form.name = this.getNewPhaseName()
            } else {
                this.form.name = rowData.name
            }
            let queryData = {
                projectId: this.page.projectId,
                stageId: rowData.stageId
            }

            getSyncList(queryData)
                .then(response => {
                    console.log('list')
                    console.log(response)
                    if (rowData.isPhase === 'true') {
                        this.form.isPhase = true
                        this.editQueryData.currentPhaseState = true
                    }

                    this.customProjectData = []
                    this.selectProjectData = []
                    this.projectData = response.data

                    var phaseNamesMap = new Map()
                    if (rowData.phaseNames) {
                        var phaseNamesArr = rowData.phaseNames.split('、')
                        phaseNamesArr.forEach((item, index) => {
                            phaseNamesMap.set(item, true)
                        })
                    }

                    this.projectData.forEach((item, index) => {
                        if (item.phaseType === '1') { // 1普通分期
                            this.form.isPhase = true
                            this.editQueryData.currentPhaseState = true
                        }
                        if (phaseNamesMap.has(item.parcelPhaseName)) {
                            this.selectProjectData.push(item)
                        }
                    })

                    var listData = []
                    var idList = []
                    this.projectData.map(item => {
                        if (idList.length === 0) {
                            idList.push(item.phaseId)
                        } else {
                            if (idList.indexOf(item.phaseId) < 0) {
                                idList.push(item.phaseId)
                            }
                        }
                    })
                    for (let i = 0; i < idList.length; i++) {
                        for (let j = 0; j < this.projectData.length; j++) {
                            if (idList[i] === this.projectData[j].phaseId) {
                                listData.push(this.projectData[j])
                            }
                        }
                    }
                    console.log('listData')
                    console.log(listData)
                    for (let i = 0; i < listData.length; i++) {
                        this.customProjectData.push(listData[i])
                        this.roughProjectData.roughBuildingArea = listData[i].roughBuildingArea
                        this.roughProjectData.phaseName = listData[i].phaseName
                        this.roughProjectData.parcelPhaseName = listData[i].parcelPhaseName
                        this.roughProjectData.accountingObjectId = listData[i].accountingObjectId
                        this.roughProjectData.parcelPhaseCode = listData[i].parcelPhaseCode
                        this.roughProjectData.fCompanyName = listData[i].fCompanyName
                        this.roughProjectData.roughSellArea = listData[i].roughSellArea
                        this.roughProjectData.phaseId = listData[i].phaseId
                        this.roughProjectData.parcelId = listData[i].parcelId
                        this.hardboundProjectData.phaseId = listData[i].phaseId
                        this.hardboundProjectData.parcelId = listData[i].parcelId
                        this.hardboundProjectData.fCompanyName = listData[i].fCompanyName
                        this.hardboundProjectData.accountingObjectId = listData[i].accountingObjectId
                        this.hardboundProjectData.phaseName = listData[i].phaseName
                        this.hardboundProjectData.parcelPhaseName = listData[i].parcelPhaseName
                        this.hardboundProjectData.parcelPhaseCode = listData[i].parcelPhaseCode
                        this.hardboundProjectData.hardboundBuildingArea = listData[i].hardboundBuildingArea
                        this.hardboundProjectData.hardboundSellArea = listData[i].hardboundSellArea
                        this.customProjectData.push(JSON.parse(JSON.stringify(this.roughProjectData)))
                        this.customProjectData.push(JSON.parse(JSON.stringify(this.hardboundProjectData)))
                    }
                    let ListNumber = []
                    this.customProjectData.map(item => {
                        if (ListNumber.length === 0) {
                            ListNumber.push(item.phaseId)
                        } else {
                            if (ListNumber.indexOf(item.phaseId) < 0) {
                                ListNumber.push(item.phaseId)
                            }
                        }
                    })

                    if (ListNumber.length === 1) {
                        this.editQueryNumber = true
                        this.form.isPhase = false
                    } else {
                        this.editQueryNumber = false
                    }
                    console.log('customProjectData66666')
                    console.log(this.customProjectData)
                    this.objectSpanArr(this.customProjectData)
                    this.ppp()
                })
                .catch(error => {
                    console.log(error)
                    this.$showError(error.message ? error.message : 'msg_system_error')
                })
        },

        handleClose (done) {
            this.$confirm('确认关闭？')
                .then(_ => {
                    done()
                })
                .catch(_ => { })
        },
        projectDataListClick (rowData) {
            // alert('1111')
            this.projectDialogData = {
                projectId: rowData.projectId,
                stageId: rowData.stageId
            }

            this.dialogVisible = true
        },

        // 选项卡点击事件
        tabClick (param) {

        },
        // 获取默认值
        getDefaultData () {
            return {
                data: '投前',
                name: '项目',
                created_by: '',
                masterData: '',
                total_building_area: '',
                total_sell_area: ''
            }
        }
    },
    mounted () {
        this.loadData()
        // window.onresize = () => {
        //     return (() => {
        //         this.fullHeight = document.documentElement.clientHeight
        //     })()
        // }
    },
    watch: {
        fullHeight (val) {
            this.settingTableHeight()
        },
        'page.selectNode': function (val) {
            if (val.type === COSTENUM.projectTreeType.TREE_NODE_PROJECT) {
                this.page.projectId = val.id
                this.accountObjectList()
            }
        },
        'page.tree.filterText': function (val) {
            this.$refs.departTree.filter(val)
        }
    }
}
</script>
<style  scoped>
.el-collapse {
  margin: 20px 0;
}
.targetCostQuery .el-select {
  width: 30%;
}
.targetCostQuery .phaseName .el-input {
  width: 30%;
}
.leftMenu {
}
.rightContainer {
}
.el-rightContaineraside {
  float: left;
}
.topSearch {
  height: 40px;
  padding: 5px;
  color: #fff;
  text-align: center;
}
.el-input {
  width: 80%;
}
.resultSet {
  height: 30px;
  margin-top: 10px;
  text-align: center;
  color: #fff;
  line-height: 30px;
}
.el-step__head {
  width: 100% !important;
}
.el-step__icon.is-text {
  line-height: 21px;
}

/* 可以设置不同的进入和离开动画 */
/* 设置持续时间和动画函数 */
.slide-fade-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active for below version 2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}

.el-dialog__headerbtn {
  display: none;
}
</style>
