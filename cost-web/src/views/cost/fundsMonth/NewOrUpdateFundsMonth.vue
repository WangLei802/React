<template>
    <div class='app-container'>
        <!-- 按钮区域 -->
        <div class="subTitle marginBottom">
            <div class="breadcrumb-child">
                <div style="float: right;">
                    <el-button size="mini"
                               @click='handleBack'>{{$l("btn_back")}}
                    </el-button>
                    <el-button size="mini"
                               type='primary'
                               :disabled="pageStatus.buttonDisable.save"
                               v-if="pageStatus.isEdit"
                               v-show="pageStatus.buttonShow.save"
                               @click='handleSave'>{{$l("btn_save")}}
                    </el-button>
                    <el-button size="mini"
                               type='primary'
                               @click='handleSubmit'
                               v-show="pageStatus.buttonShow.submit"
                               :disabled="pageStatus.buttonDisable.submit"
                               v-if="pageStatus.isEdit">
                        {{$l("lbl_cost_compilation_submit")}}
                    </el-button>
                </div>
            </div>
        </div>
        <!-- 基本信息 :disabled="!pageStatus.isEdit"-->
        <div class="form-unit"
             :title="pageStatus.showBaseInfo?'点击展开':'点击收起'"
             @click="pageStatus.showBaseInfo=!pageStatus.showBaseInfo">基本信息
            <i :class="!pageStatus.showBaseInfo?'el-icon-caret-bottom':'el-icon-caret-top'"></i>
        </div>
        <el-collapse-transition>
            <el-form v-show="pageStatus.showBaseInfo"
                     label-width='150px'
                     status-icon
                     :disabled="!pageStatus.isEdit"
                     size="mini">
                <el-row>
                    <!-- 项目/成本分期 -->
                    <ProjectAccountSelect v-model="page.queryModel.ProjectAccountSelect"
                                          :show="pageStatus.projectAccountSelect.show"
                                          :span="{project: 8,accObj: 8}"
                                          :labelWidth="{project: 150,accObj: 150}"
                                          :disabled="pageStatus.projectAccountSelect.disable"
                                          autoselect="up"
                                          @change="projectAccountSelectChange"/>

                    <el-col :span="8">
                        <el-form-item :label="'资金计划月：'">
                            <el-select v-model='page.queryModel.fundsMonth'
                                       placeholder="请选择"
                                       :clearable="true"
                                       @blur= "buildFundsPlanName"
                                       @change= "fundsMonthSelectChange">
                                <el-option v-for="item in page.selectData.fundsMonthList"
                                           :key="item"
                                           :label="item"
                                           :value="item">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item :label="'资金计划名称：'">
                            {{page.queryModel.fundsPlanName}}
                        </el-form-item>
                    </el-col>

                    <el-col :span="8">
                        <el-form-item :label="'资金计划版本：'">
                            <el-input v-model="page.queryModel.periodVersion"
                                      :disabled="true">
                                <span slot="append"
                                      @click="handleSelectPeridVersion"
                                      v-show="pageStatus.buttonShow.selectPeridVersion"
                                      :style="{cursor:!pageStatus.isEdit?'pointer':'normal'}"
                                      :title="!pageStatus.isEdit?'点击查看历史版本':''">历史版本</span>
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="8">
                        <!-- 经办人 -->
                        <el-form-item :label="'经办人：'">
                            {{page.queryModel.createdBy}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <!-- 提交日期： -->
                        <el-form-item :label="'提交日期：'"
                                      prop="operateDate">
                            {{page.queryModel.operateDate | dateFormat('yyyy-MM-dd')}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <!-- 审批状态 -->
                    <el-col :span="8">
                        <!-- 审批状态： -->
                        <el-form-item :label="'审批状态：'"
                                      prop="status">
                            <fd-label :code="page.queryModel.status"
                                      type="cost_flow_status"></fd-label>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <!-- 审批日期： -->
                        <el-form-item :label="'审批日期：'"
                                      prop="approveDate">
                            {{page.queryModel.approveDate | dateFormat('yyyy-MM-dd')}}
                        </el-form-item>
                    </el-col>
                </el-row>

            </el-form>
        </el-collapse-transition>

        <!-- 详细信息 -->
        <div class="form-unit"
             :title="pageStatus.showBaseInfo?'点击展开':'点击收起'"
             @click="pageStatus.showRemarkInfo=!pageStatus.showRemarkInfo">详细说明
            <i :class="!pageStatus.showRemarkInfo?'el-icon-caret-bottom':'el-icon-caret-top'"></i></div>
        <el-collapse-transition>
            <el-input v-show="pageStatus.showRemarkInfo"
                      type="textarea"
                      :disabled="!pageStatus.isEdit"
                      :autosize="{ minRows: 4, maxRows: 6}"
                      placeholder="请输入内容"
                      v-model="page.queryModel.remark">
            </el-input>
        </el-collapse-transition>

        <!-- 合同付款计划 -->
        <div class="form-unit">合同付款计划</div>
        <el-row :style="{'text-align':'right','font-size':'12px','margin-bottom':'10px'}">
            <label style="margin-left: 10px;"
                   v-if="pageStatus.isEdit">当前选择：<font color="orange">{{pageStatus.selectLevel.name || '--'}}</font></label>
            <el-tooltip class="item"
                        effect="dark"
                        content="点击二级科目行可添加"
                        placement="top-start"><i class="el-icon-info"></i></el-tooltip>
            <el-button style="margin-left: 10px;"
                       :disabled="!(pageStatus.selectLevel.name && pageStatus.selectLevel.rowType===2)"
                       v-if="pageStatus.isEdit"
                       @click="handleSelectContract"
                       title="点击二级科目行可添加">添加已签合同</el-button>
            <el-button style="margin-left: 10px;"
                       :disabled="!(pageStatus.selectLevel.name && pageStatus.selectLevel.rowType===2)"
                       v-if="pageStatus.isEdit"
                       @click="handleSelectContractPlan">添加未签合同</el-button>
            <label style="margin-left: 10px;"> 单位：万元</label>
        </el-row>
        <div>
            <el-table :data="tableData"
                      ref="configurationTable"
                      style="width: 100%;"
                      border
                      @row-click="handleRowClick"
                      height="500px"
                      :row-style="rowStyle"
                      :header-cell-style="headerCellStyle"
                      :class="['configurationTable', {afterRenderClass: showAfterRenderClass}]">
            <!-- =======================蓝色区域======================= -->

            <!-- 序号 -->
            <el-table-column fixed
                             :label="$l('lbl_no')"
                             width="70"
                             prop="seq">
            </el-table-column>

            <!-- 合同编号 -->
           <el-table-column prop="contractNumber"
                            show-overflow-tooltip
                            width="150"
                            fixed
                            :label="'合同编号'">
                <template slot-scope="scope">
                    <i class="el-icon-edit-outline editItem"
                        v-if="scope.row.rowType === 2"
                        title="点击当前行可添加合同/合约"></i>
                    <i class="el-icon-remove deleteItem"
                        v-if="(scope.row.rowType === 4 || scope.row.rowType ===5) && pageStatus.isEdit"
                        @click="deleteContractNumber(scope.$index,scope.row)"
                        title="删除"></i>
                    {{scope.row.contractNumber}}
                    <i class="el-icon-check"
                        v-if="scope.row.isSelect"></i>
                </template>
            </el-table-column>

            <!-- 合同名称 -->
            <el-table-column prop="contractName"
                             show-overflow-tooltip
                             fixed
                             :label="'合同名称'"></el-table-column>

            <!-- 合作单位 -->
            <el-table-column prop="partBName"
                             show-overflow-tooltip
                             :label="'合作单位'"></el-table-column>

            <!-- 签订合同额(A) -->
            <el-table-column prop="contractAmountIncludeTax"
                             show-overflow-tooltip
                             :label="'签订合同额(A)'">

                <template slot-scope="scope">
                    <span :style="{'font-weight':(scope.row.rowType===4 || scope.row.rowType==5)?'normal':'bold'}">
                        {{scope.row.rowType===5?'--':(_ifNull(scope.row.contractAmountIncludeTax,0))}}
                    </span>
                </template>
            </el-table-column>

            <!-- 待签约合约规划额(B) -->
            <el-table-column prop="amountPendingOccurence"
                             show-overflow-tooltip
                             :label="'待签约合约规划额(B)'">
                <template slot-scope="scope">
                    <span :style="{'font-weight':(scope.row.rowType===4 || scope.row.rowType==5)?'normal':'bold'}">
                        {{scope.row.rowType===4?'--':(_ifNull(scope.row.amountPendingOccurence,0)) }}
                    </span>
                </template>
            </el-table-column>

            <!-- 预计结算额(C) -->
            <el-table-column prop="estimatedSettlementAmt"
                             show-overflow-tooltip
                             :label="'预计结算额(C)'">
                <template slot-scope="scope">
                    {{scope.row.estimatedSettlementAmt}}
                </template>
            </el-table-column>

            <!-- =======================绿色区域======================= -->
            <el-table-column prop="toLastMonthAmountsituation"
                             :label="'截止上月末资金计划执行情况'">
                <!-- 上月计划支付额(D) -->
                <el-table-column prop="plannedPaymentOfLastMonth"
                                 show-overflow-tooltip
                                 :label="'上月计划支付额(D)'">
                    <!-- <template slot-scope="scope">{{0 | NumFormat}}</template> -->
                </el-table-column>
                <!-- 上月实际支付额(E) -->
                <el-table-column prop="actualPaymentOfLastMonth"
                                 show-overflow-tooltip
                                 :label="'上月实际支付额(E)'">
                                 <!-- <template slot-scope="scope">{{0 | NumFormat}}</template> -->
                </el-table-column>

                <!-- 上月计划支付率(F=E/D) -->
                <el-table-column prop="plannedPaymentRateOfLastMonth"
                                 show-overflow-tooltip
                                 :label="'上月计划支付率(F=E/D)'">
                                 <!-- <template slot-scope="scope">{{0 | NumFormat}}</template> -->
                </el-table-column>
                <!-- 上月执行情况预警 -->
                <el-table-column prop="totalCheckAmtRateOfLastMonth"
                                 show-overflow-tooltip
                                 :label="'上月执行情况预警'">
                    <!-- <template slot-scope="scope">{{0 | NumFormat}}</template> -->
                </el-table-column>

                <!-- 截止上月末累计产值(G) -->
                <el-table-column prop="totalCheckAmtByEndOfLastMonth"
                                 show-overflow-tooltip
                                 :label="'截止上月末累计产值(G)'">
                                 <!-- <template slot-scope="scope">{{0 | NumFormat}}</template> -->
                </el-table-column>

                <!-- 截止上月末累计已付(H) -->
                <el-table-column prop="accPaymentOfLastMonth"
                                 show-overflow-tooltip
                                 :label="'截止上月末累计已付(H)'">
                                 <!-- <template slot-scope="scope">{{0 | NumFormat}}</template> -->
                </el-table-column>

                <!-- 累计已付占产值比(I=H/G) -->
                <el-table-column prop="totalCheckAmtRateOfLastMonth"
                                 show-overflow-tooltip
                                 :label="'累计已付占产值比(I=H/G)'">
                                 <!-- <template slot-scope="scope">{{0 | NumFormat}}</template> -->
                </el-table-column>

                <!-- 累计已付占合约比(J=H/B) -->
                <el-table-column prop="cumulativeContractRatio"
                                 show-overflow-tooltip
                                 :label="'累计已付占合约比(J=H/B)'">
                                 <!-- <template slot-scope="scope">{{0 | NumFormat}}</template> -->
                </el-table-column>
            </el-table-column>
            <!-- =======================橘色区域======================= -->
            <el-table-column v-for="(monthItem,index) in page.selectData.monthList"
                             :key="index"
                             prop="monthItemAmount"
                             :label="monthItem+'月'">
                <!-- 计划支付金额(J) -->
                <el-table-column prop="payMoney"
                    label="计划支付金额(J)">
                    <template slot-scope="scope">
                        <el-input-number @blur="aa(scope)" v-model="scope.row.month[index].payMoney"></el-input-number>
                        <!-- <el-input type="number" v-model="scope.row.payMoney"/> -->
                    </template>
                </el-table-column>
                <!-- 款项类型 -->
                <el-table-column prop="moneyType"
                    label="款项类型">
                    <template slot-scope="scope">
                        <fd-select v-model='scope.row.month[index].moneyType'
                                   type="cost_payment_type"
                                   :clearable="true"></fd-select>
                    </template>
                </el-table-column>
                <!-- 付款方式 -->
                <el-table-column prop="payType"
                    label="付款方式">
                    <template slot-scope="scope">
                        <fd-select  v-model='scope.row.month[index].payType'
                                    type="cost_payment_method"
                                    :clearable="true"></fd-select>
                    </template>
                </el-table-column>
            </el-table-column>
        </el-table>
        </div>
        <!-- 选择合同[已签订] -->
        <ContractSelector :showContract="pageStatus.isShowContract"
                          :excludeContract="page.excludeContract"
                          :projectId="page.queryModel.ProjectAccountSelect.projectId"
                          :type="'signed'"
                          v-on:cancelDialog="cancelDialog"
                          v-on:closeDialog="closeDialog"
                          v-on:confirmContract="confirmContract">
        </ContractSelector>

        <!-- 选择合约 -->
        <SelectContractPlan v-if="pageStatus.dialogContractPlan"
                            @closeDialogContractPlan="closeDialogContractPlan"
                            :dialogContractPlan='pageStatus.dialogContractPlan'
                            :accountingObje='page.queryModel.ProjectAccountSelect.accObjId'
                            v-model="page.queryModel.ProjectAccountSelect.accObjId"></SelectContractPlan>
    
        <!-- 历史版本 -->
        <el-dialog :title="'历史版本'"
                   :visible.sync="page.historyVersion.show"
                   :modal="true"
                   :lock-scroll="true">
            <div>
                <el-form size="mini"
                         style="margin-bottom:20px;">
                    <el-row>
                        <el-col :span="3"
                                style="width:100px;height:30px;line-height:30px;">资金计划年份：</el-col>
                        <el-col :span="6"
                                style="text-align:left">

                            <!-- v-model="page.historyVersion.selectYear" -->
                            <el-select v-model="page.historyVersion.selectYear"
                                       filterable
                                       clearable
                                       placeholder="请选择">
                                <el-option v-for="(item,index) in page.historyVersion.fundsStageIds"
                                           :key="index"
                                           :label="item.label"
                                           :value="item.value">
                                </el-option>
                            </el-select>
                        </el-col>
                        <el-col :span="1">&nbsp;</el-col>
                        <el-col :span="6">
                            <el-button size="mini"
                                       class="special-btn"
                                       type='primary'
                                       @click='handleSearchHistoryDialog'>{{$l('btn_search')}}</el-button>
                            <el-button size="mini"
                                       class="special-btn"
                                       type='primary'
                                       @click='handleCloseHistoryDialog'>{{$l('btn_close')}}</el-button>
                        </el-col>
                    </el-row>
                </el-form>
                <el-table :data="page.historyVersion.data"
                          stripe
                          border
                          size="small"
                          height="200"
                          style="width: 100%">
                    <!-- 版本号 -->
                    <el-table-column :label="'版本号'"
                                     width="100"
                                     prop="periodVersion">
                    </el-table-column>

                    <!-- 资金计划年份 -->
                    <el-table-column prop="fundsYear"
                                     show-overflow-tooltip
                                     :label="'资金计划年份'"></el-table-column>

                    <!-- 资金计划阶段 -->
                    <!-- <el-table-column prop="fundsStage"
                                     show-overflow-tooltip
                                     :label="'资金计划阶段'"></el-table-column> -->

                    <!-- 提交日期 -->
                    <el-table-column prop="operateDate"
                                     show-overflow-tooltip
                                     :label="'提交日期'">
                        <template slot-scope="scope">
                            {{scope.row.operateDate | dateFormat('yyyy-MM-dd')}}
                        </template>
                    </el-table-column>

                    <!-- 经办人 -->
                    <el-table-column prop="operator"
                                     show-overflow-tooltip
                                     :label="'经办人'"></el-table-column>

                    <!-- 操作 -->
                    <el-table-column :label="$l('lbl_operation')"
                                     width="150">
                        <!-- 查看 -->
                        <template slot-scope="scope">
                            <el-button size="mini"
                                       type="text"
                                       icon="fa fa-hand-o-up"
                                       :title="'查看'"
                                       @click="handleSelectHistory(scope.$index, scope.row)"> 查看</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </el-dialog>
    
    </div>
</template>
<script>
import ProjectAccountSelect from '@/components/cost/ProjectAccountSelect/'
import ContractSelector from '@/components/cost/ContractSelector/'
import SelectContractPlan from '@/views/cost/signContract/SelectContractPlan/'
import {
  NumFormat, // 千位符
  FLevel,
  dateFormat,
  Version
} from '@/filters/cost/'

import { deepCopy, ifNull } from '@/utils/cost/objectHelper'
import { LoadingUtil } from '@/utils/common/LoadingUtil'
import { calc } from '@/utils/common/calc'
import APIDATA from './testData.js'
import {
  check, // 新增月度资金计划选择“成本分期”检查“全周期资金计划”等
  init, // 初始化数据
  checkYearAndStage, // 检查已编制的年份及季度
  create, // 月度资金计划
  getHistoryList, // 历史版本查看
  monthList // 初始化月份列表
} from '@/api/cost/fundsMonthAPI'
export default {
  components: {
    ProjectAccountSelect,
    ContractSelector,
    SelectContractPlan
  },
  data() {
    return {
      showAfterRenderClass: false,
      pageStatus: {
        createBy: null,
        isNew: false,//新增
        isEdit: false, // 是否为编辑 
        isUpVersion: false,//是否为升版
        buttonShow: {
          save: true,
          submit: true,
          selectPeridVersion: false // 默认不显示“历史版本“
        },
        buttonDisable: {
          save: true,
          submit: true
        },
        projectAccountSelect: {
          show: { project: true, accObj: true },
          disable: { project: true, accObj: false }
        },
        fundsStageListDisable: false, // 资金计划阶段是否禁用
        showBaseInfo: true, // 显示基本信息
        showRemarkInfo: true, // 显示详细信息
        pre_fundsStage: null, // 之前的资金计划阶段
        selectLevel: { 
          name: null, 
          rowType: null,
          rowIndex: 0,
          row: null,
          contractParentId: null,//所选二级分类下的 合同id
          contractPlanParentId: null,//所选二级分类下的  合约id
          lastContractSeq: null, //最后一次插入的（合同/合约） 序号seq，例如1.3
          needCalRowProp: [ //需要运算的行属性
             'contractAmountIncludeTax',
             'amountPendingOccurence', 
             'estimatedSettlementAmt', 
             'accPaymentOfLastYear', 
             'plannedPaymentForThisYear', 
             'returnMoney', 
             'month'],
        needCalRowMonthProp: []//需要运算的月属性
        //   needCalRowMonthProp: ['planValues', 'currentValues']//需要运算的月属性
        }, // 当前选中2级分类
        isShowContract: false, // 显示选择合同组件
        dialogContractPlan: false // 显示选择合约组件
      },
      page: {
        excludeContract: [], // 合同数据
        selectData: {
          fundsMonthList: [],
          fundsStageList: [{ label: '年初', value: '0' }, { label: '一季度末', value: '1' }, { label: '二季度末', value: '2' }, { label: '三季度末', value: '3' }],
          monthList: []    // [7, 8, 9]
        },
        queryModel: {
          id: null,//编辑id
          ProjectAccountSelect: {
            projectId: null,
            accObjId: null,
            accObjName: null
          },
          projectAccountSelectItem: null,//选择的成本分期model
          companyId: null,// 公司id
          stageId: null, // 成本分期 阶段ID //1  
          // 资金计划年
          fundsYear: null, //'2018-01',
          // 资金计划月
          fundsMonth:null,
          // 资金计划名称
          fundsPlanName: null,
          // 资金计划阶段(年初12个月都是计划，一季度末前3个月有实际，后面都是计划)
          fundsStage: null, //'0', // 当前默认计划为年初
          // 资金计划版本
          periodVersion: null,
          // 详细信息
          remark: null,
          // 经办人
          createdBy: JSON.parse(JSON.parse(localStorage.getItem('USER_INFO')).val).username,
          // 提交日期
          createdDate: new Date().format(),
          // 审批状态
          status: '草稿',
          // 审批日期
          operateDate: null,
          //全周期资金计划中该年度计划总额
          fundsPeriodPayPlanPayMoneySum: 0
        },
        pageModel: {
          // 行类型(合计0，一级分类1，二级分类2，已签合同/未签合同3,合同4 ,合约5)
          rowType: null,
          // 行选中
          isSelect: false,
          // 序号
          seq: null,
          // id
          id: null,
          // 父id
          parentId: null,
          // 父id列表
          parentIds: '',
          // 蓝色
          contractNumber: null, // 合同编号
          contractName: null, // 合同名称
          partBName: null, // 合作单位
          contractAmountIncludeTax: null, // 签订合同额(A)
          amountPendingOccurence: null, // 待签约合约规划额(B)
          estimatedSettlementAmt: null, // 预计结算额(C)
          // 绿色
          plannedPaymentOfLastMonth: null,// 上月计划支付额(D)
          actualPaymentOfLastMonth: null,// 上月实际支付额(E)
          plannedPaymentRateOfLastMonth: null,// 上月计划支付率(F=E/D)
          totalCheckAmtRateOfLastMonth: null,// 上月执行情况预警
          totalCheckAmtByEndOfLastMonth: null,// 截止上月末累计产值(G)
          accPaymentOfLastMonth: null,// 截止上月末累计已付(H)
          totalCheckAmtRateOfLastMonth: null,// 累计已付占产值比(I=H/G)
          cumulativeContractRatio: null,// 累计已付占合约比(J=H/B)
          // 橘色
          month: [], // 月份
        //   payMoney:null,
        },
        // 历史版本信息
        historyVersionModel: {
          'id': '2c938b4c661902770166190f9da80004',
          'createdBy': '1',
          'createdDate': '2018-09-27T03:08:47.000+0000',
          'updatedBy': 'string',
          'updatedDate': '2018-09-27T03:29:29.000+0000',
          'version': 1,
          'accountingObjectId': '1',
          'accountingObjectName': '1',
          'companyId': '1',
          'companyCode': '1',
          'companyName': '1',
          'projectId': '1',
          'projectCode': '1',
          'projectName': '1',
          'stageId': '1', // 成本分期阶段id
          'periodVersion': 'V0', // 版本号
          'fundsYear': '2018', // 资金计划年
          'fundsPlanCode': '1',
          'fundsPlanName': '1',
          'fundsStage': '1', // 资金计划阶段
          'operator': '1', // 经办人
          'operateDate': '2018-09-27T03:08:47.000+0000', // 提交日期
          'remark': '1',
          'payMoneySum': 110,
          'status': '2',
          'isDeleted': '1'
        },
        historyVersion: {
          show: false,
          selectYear: null, // 当前选择的年
          yearIds: [],
          fundsStageIds:[],
          data: []
        }
      },
      tableData: []
    }
  },
  filters: {
    NumFormat,
    FLevel,
    dateFormat,
    Version
  },
  mounted: function() {
    this.initPageModel()
    // this.initPage()
    // this.monthList()
    // this.initPageStatus()
  },
  updated () {
        /**
         * 用于隐藏固定高度时显示不必要的scrollX的定时器
         * 这是el-table初次渲染时宽度计算的bug，可在渲染后通过重新赋予overflow: auto调整
         */
        const handleScrollX = setInterval(() => {
            // 检测是否已经生成table节点，如果不是就每隔0.5s检测一次
            // 只有生成了真实节点才能够通过修改overflow属性让浏览器重新计算
            if (this.$refs.configurationTable) {
                this.showAfterRenderClass = true
                clearInterval(handleScrollX)
            }
        }, 500)
    },
  methods: {
      aa(q){
        console.log(JSON.stringify(q))
      },
    // 加载数据
    initPage (response) {
        // debugger
        //let response = APIDATA.data
        if (response && response.data) {
            // 基本信息
            this.initBaseInfo(response.data)
            // 加载表格信息
            this.initTableData(response.data)
        }
    },
    initData () {
        let _this = this
        //有id 或者选了成本分期，年，阶段
        if(this.page.queryModel.fundsMonth != ""){
            this.page.queryModel.fundsYear = this.page.queryModel.fundsMonth.split("-")[0]
        }
        
        if (
            (this.page.queryModel.ProjectAccountSelect.accObjId && this.page.queryModel.fundsYear && this.page.queryModel.stageId) || this.page.queryModel.id) {
            LoadingUtil.showLoading()
            let _param = null
            if (this.page.queryModel.id) {
                _param = {
                    id: this.page.queryModel.id
                }
                if(this.$route.query.isUpVersion){
                   _param = {
                        id: this.page.queryModel.id,
                        fundsDate: this.page.queryModel.fundsMonth,
                        flag: true   
                    } 
                }
            } else {
            //   alert(this.page.queryModel.ProjectAccountSelect.accObjId)
                _param = {
                    'accountingObjectId': this.page.queryModel.ProjectAccountSelect.accObjId, // 成本分期id
                    'fundsDate':this.page.queryModel.fundsMonth,
                    'stageId': this.page.queryModel.stageId// 阶段id
                }
            }
            init(_param).then(response => {
            //   console.log(response.data.tree)
                this.page.selectData.monthList = []
                this.page.pageModel.month = []
                if(!this.$route.query.isAdd){
                    this.page.selectData.monthList = []
                    response.data.tree[0].children[0].children[0].children[0].attr.month.map(monthItem => {
                    this.page.selectData.monthList.push(monthItem.month)
                   }) 
                }else{
                    this.page.selectData.monthList = []
                    response.data.tree[0].attr.month.map(monthItem => {
                    this.page.selectData.monthList.push(monthItem.month)
                   }) 
                }
                
                if(this.$route.query.isAdd == false && this.$route.query.isEdit == false){
                   this.page.selectData.monthList = []
                   response.data.tree[0].children[0].children[0].children[0].attr.month.map(monthItem => {
                    this.page.selectData.monthList.push(monthItem.month)
                   })      
                }    
                if(this.$route.query.isUpVersion){
                    this.page.selectData.monthList = []
                    response.data.tree[0].children[0].children[0].children[0].attr.month.map(monthItem => {
                        this.page.selectData.monthList.push(monthItem.month)
                    })   
                }

                for(let i = 0 ; i<this.page.selectData.monthList.length; i++){
                    this.page.pageModel.month.push({
                    'sortNum': i,
                    'month': this.page.selectData.monthList[i],
                    'moneyType':'',
                    'payMoney': '0',
                    'payPeriod':'',
                    'payType':'',

                })
                }
                this.initPage(response)
                this.$nextTick(function () {
                LoadingUtil.hideLoading()
                // _this.calcTableData()
                })
            }).catch(error => {
                console.log(error)
                LoadingUtil.hideLoading()
                this.$showError(error.message ? error.message : '初始化数据失败')
            })
        }
        
        // this.initTableData(response.data)
    },
    // 资金计划名称生成 不可编辑  命名规则：年份+月份+成本分期+月度资金计划，如2019年1月项目一月度资金计划
    buildFundsPlanName () {
      if(this.page.queryModel.fundsMonth != undefined && this.page.queryModel.ProjectAccountSelect.accObjName != null){
        this.page.queryModel.fundsPlanName = this.page.queryModel.fundsMonth + this.page.queryModel.ProjectAccountSelect.accObjName + "月度资金计划"
      }
    },
 
    // 初始化页面状态
    initPageStatus() {
      // 新增可选，编辑禁用
      this.pageStatus.fundsStageListDisable = !this.$route.query.id === 0
      
      if(this.$route.query.isAdd){
         this.page.queryModel.periodVersion = "V0";
      }
    },
    // 初始化pageModel
    initPageModel() {
        
      this._check()
      //是否编辑
      this.pageStatus.isEdit = this._ToString(this.$route.query.isEdit) === 'true'
      //是否升版
      this.pageStatus.isUpVersion = this._ToString(this.$route.query.isUpVersion) === 'true'

        // debugger
    //   if(this.pageStatus.isEdit || this.pageStatus.isUpVersion){
        
    //   }

      if (!this.pageStatus.isEdit) {
          this.pageStatus.buttonShow.selectPeridVersion = true
          // 加载历史记录数据
          this.initHistoryVersion()
      }

      this.pageStatus.isNew = this.$route.query.id === 0
      this.pageStatus.createBy = JSON.parse(JSON.parse(localStorage.getItem('USER_INFO')).val).username
      let paramModel = this.$route.query.paramModel
      if (paramModel && !this.pageStatus.isNew) {
        this.page.queryModel.projectAccountSelectItem = {
              id: paramModel.accountingObjectId,
              text: paramModel.accountingObjectName,
              companyCode: paramModel.companyCode,
              companyId: paramModel.companyId,
              companyName: paramModel.companyName,
              projectCode: paramModel.projectCode,
              projectId: paramModel.projectId,
              projectName: paramModel.projectName
          }
          this.page.queryModel.id = paramModel.id
          this.page.queryModel.ProjectAccountSelect.accObjId = paramModel.accountingObjectId
          this.page.queryModel.ProjectAccountSelect.projectId = paramModel.projectId
          this.page.queryModel.companyId = paramModel.companyId
          this.page.queryModel.stageId = paramModel.stageId
          this.page.queryModel.fundsMonth = paramModel.fundsMonth
          this.page.queryModel.fundsYear = paramModel.fundsYear
          this.page.queryModel.fundsPlanName = paramModel.fundsPlanName
          this.page.queryModel.fundsStage = paramModel.fundsStage
          this.page.queryModel.periodVersion = paramModel.periodVersion
          this.page.queryModel.remark = paramModel.remark
          this.page.queryModel.createdBy = paramModel.operator
          this.page.queryModel.createdDate = paramModel.createdDate
          this.page.queryModel.status = paramModel.status
          this.page.queryModel.operateDate = paramModel.operateDate
          this.page.queryModel.approveDate = paramModel.approveDate || ''
          this.initData()
      }

    },
    // 加载表格信息
    initTableData(response) {
        // debugger
      let _this = this
      // 重置
      this.tableData = []
      // 插入合计行
      let totalRow = deepCopy(this.page.pageModel)
      totalRow.contractName = '合计'
      totalRow.rowType = 0
      totalRow.id = '0'//重要，运算使用
      this.tableData.push(totalRow)
    //   插入一级分类、二级分类、已签合同、未签合同
      if (response.tree) {
        response.tree.map(level1Item => {
          // ============一级分类
          let level_1_ItemRow = deepCopy(_this.page.pageModel)
          level_1_ItemRow.rowType = 1
          level_1_ItemRow.id = level1Item.id
          level_1_ItemRow.parentId = level1Item.parentId
          level_1_ItemRow.seq = level1Item['attr']['seq']
          level_1_ItemRow.contractNumber = level1Item['attr']['name']

          // 插入一级分类
          _this.tableData.push(level_1_ItemRow)

          // ============二级分类
          if (level1Item && level1Item.children) {
            level1Item.children.map(level2Item => {
              let level_2_ItemRow = deepCopy(_this.page.pageModel)
              level_2_ItemRow.rowType = 2
              level_2_ItemRow.id = level2Item.id
              level_2_ItemRow.parentId = level2Item.parentId
              level_2_ItemRow.seq = level2Item['attr']['seq']
              level_2_ItemRow.contractNumber = level2Item['attr']['name']

              // 插入二级分类
              _this.tableData.push(level_2_ItemRow)

              // 插入合同分类
              if (level2Item && level2Item.children) {
                level2Item.children.map(contractTypeItem => {
                  let contractType_ItemRow = deepCopy(_this.page.pageModel)
                  contractType_ItemRow.rowType = 3
                  contractType_ItemRow.id = contractTypeItem.id
                  contractType_ItemRow.parentId = contractTypeItem.parentId
                  contractType_ItemRow.seq = contractTypeItem['attr']['seq']
                  contractType_ItemRow.contractNumber = contractTypeItem['attr']['name']

                  //  插入合同分类
                  _this.tableData.push(contractType_ItemRow)
                  // 插入合同
                //   debugger
                  if (contractTypeItem && contractTypeItem.children) {
                      (contractTypeItem.children).map(contract_or_contractPlan_Item => {
                          let new_contract_or_contractPlan_Item = deepCopy(_this.page.pageModel)
                          new_contract_or_contractPlan_Item = {
                              // 行类型(合计0，一级分类1，二级分类2，已签合同/未签合同3，合同4,合约5)
                              rowType: contract_or_contractPlan_Item['attr']['seq'].includes('1.') ? 4 : 5,
                              // 行选中
                              isSelect: false,
                              // 序号
                              seq: contract_or_contractPlan_Item['attr']['seq'],
                              // id
                              id: contract_or_contractPlan_Item['attr']['businessId'],
                              // 父id
                              parentId: contract_or_contractPlan_Item.parentId,
                              // 父id列表
                              parentIds: '',
                              // 蓝色
                              contractNumber: contract_or_contractPlan_Item['attr']['businessNumber'] || contract_or_contractPlan_Item['attr']['businessId'], // 合同编号
                              contractName: contract_or_contractPlan_Item['attr']['businessName'], // 合同名称
                              partBName: contract_or_contractPlan_Item['attr']['partBName'], // 合作单位
                              contractAmountIncludeTax: ifNull(contract_or_contractPlan_Item['attr']['contractAmountIncludeTax'], 0), // 签订合同额(A)
                              amountPendingOccurence: ifNull(contract_or_contractPlan_Item['attr']['amountPendingOccurence'], 0), // 待签约合约规划额(B)
                              estimatedSettlementAmt: ifNull(contract_or_contractPlan_Item['attr']['estimatedSettlementAmt'], 0), // 预计结算额(C)
                              // 绿色
                            //   plannedPaymentOfLastMonth: ifNull(contract_or_contractPlan_Item['attr'][plannedPaymentOfLastMonth],0), //上月计划支付额(D)
                            //   actualPaymentOfLastMonth: ifNull(contract_or_contractPlan_Item['attr'][actualPaymentOfLastMonth],0), //上月实际支付额(E)
                            //   plannedPaymentRateOfLastMonth: ifNull(contract_or_contractPlan_Item['attr'][plannedPaymentRateOfLastMonth],0),//上月计划支付率(F=E/D)
                            //   plannedPaymentRateOfLastMonth: ifNull(contract_or_contractPlan_Item['attr'][plannedPaymentRateOfLastMonth],0),//上月执行情况预警
                            //   totalCheckAmtByEndOfLastMonth: ifNull(contract_or_contractPlan_Item['attr'][totalCheckAmtByEndOfLastMonth],0),//截止上月末累计产值(G)
                            //   accPaymentOfLastMonth: ifNull(contract_or_contractPlan_Item['attr'][accPaymentOfLastMonth],0),//截止上月末累计已付(H)
                            //   totalCheckAmtRateOfLastMonth: ifNull(contract_or_contractPlan_Item['attr'][totalCheckAmtRateOfLastMonth],0),//累计已付占产值比(I=H/G)
                            //   cumulativeContractRatio: ifNull(contract_or_contractPlan_Item['attr'][cumulativeContractRatio],0),//累计已付占合约比(J=H/B)
                              // 橘色
                              month: contract_or_contractPlan_Item['attr']['month'], // 月份
                            //   payMoney:ifNull(contract_or_contractPlan_Item['attr']['payMoney',0])
                          }

                          //插入合同/合约
                          _this.tableData.push(new_contract_or_contractPlan_Item)
                      })
                  }
                })
              }

            })
          }

        })
      }
    },
    // 加载历史版本信息
    initHistoryVersion (fundsDate) {
        // this.page.historyVersion.yearIds = []
        this.page.historyVersion.fundsStageIds = []
        let _queryObj = ''
        if(this.$route.query.accountingObjectId && this.$route.query.accountingObjectId != ""){
            _queryObj = {
                accountingObjectId: this.$route.query.accountingObjectId, // 成本分期id
                fundsDate: fundsDate ? fundsDate : null, 
                stageId: this.$route.query.stageId // 阶段id
            }
        }else{
            _queryObj = {
                accountingObjectId: this.page.queryModel.ProjectAccountSelect.accObjId, // 成本分期id
                fundsDate: fundsDate ? fundsDate : null, 
                stageId: this.page.queryModel.stageId // 阶段id
            }
        }
        

        getHistoryList(_queryObj)
            .then(response => {
                LoadingUtil.hideLoading()
                debugger
                if (response.data && response.data.fundsStageIds && response.data.fundsStageIds.length > 0) {
                    response.data.fundsStageIds.map(yearItem => {
                        this.page.historyVersion.fundsStageIds.push({ label: yearItem, value: yearItem })
                    })
                }
                this.page.historyVersion.data = []
                if (response.data && response.data.historyVersion) {
                    this.page.historyVersion.data = response.data.historyVersion.filter(item => {
                        return item.periodVersion !== this.page.queryModel.periodVersion
                    })
                }
            })
            .catch(error => {
                console.log(error)
                this.$showError(error.message ? error.message : '加载历史版本信息失败')
            })
    },
    //查询历史版本
    handleSearchHistoryDialog () {
        this.initHistoryVersion(this.page.historyVersion.selectYear)
    },
    // 关闭历史版本
    handleCloseHistoryDialog () {
        this.page.historyVersion.show = false
    },
    // 查看历史版本
    handleSelectHistory (rowIndex, rowData) {
        this.handleCloseHistoryDialog()
        this.page.queryModel.fundsYear = rowData.fundsYear
        this.initData()
    },
    // 历史版本选择
    handleSelectPeridVersion () {
        this.page.historyVersion.show = true
    },
    // 加载基本信息
    initBaseInfo(response) {
      //启用按钮
      this.pageStatus.buttonDisable.save = false
      this.pageStatus.buttonDisable.submit = false

      if (this.pageStatus.isNew) {
          // 资金计划名称
          this.page.queryModel.fundsPlanName = this.buildFundsPlanName()
          // 资金计划版本
          this.page.queryModel.periodVersion = 'V0'
          // 经办人
          this.page.queryModel.createdBy = this.pageStatus.createBy
          // 提交日期
          this.page.queryModel.createdDate = new Date().format()
          // 审批状态
          this.page.queryModel.status = '0'
      } else {
          this.page.queryModel.ProjectAccountSelect.accObjId = response.accountingObjectId
          this.page.queryModel.ProjectAccountSelect.projectId = response.projectId

          // 资金计划年
          this.page.queryModel.fundsYear = response.fundsYear
          // 资金计划名称
          this.page.queryModel.fundsPlanName = response.fundsPlanName
          // 资金计划阶段
          if (!this.pageStatus.isUpVersion) {
              this.page.queryModel.fundsStage = response.fundsStage
              this.pageStatus.pre_fundsStage = this.page.queryModel.fundsStage
          }

          // 资金计划版本
          this.page.queryModel.periodVersion = response.periodVersion
          if (this.pageStatus.isUpVersion) {
              //升版
              this.page.queryModel.periodVersion = this.buildPeriodVersion(this.page.queryModel.periodVersion)
          }
          // 经办人
          this.page.queryModel.createdBy = response.operator
          // 提交日期
          this.page.queryModel.createdDate = response.approveDate || ''
          // 审批状态
          this.page.queryModel.status = response.status
          // 审批日期
          this.page.queryModel.operateDate = response.operateDate

          //全周期资金计划中该年度计划总额
          this.fundsPeriodPayPlanPayMoneySum = ifNull(response.fundsPeriodPayPlanPayMoneySum, 0)
      }
    },
    // 返回
    handleBack() {
      this.$router.push({
        name: 'FundsMonthList'
      })
    },
    // 保存
    handleSave() {
      let actionType = 'save'
      this.handleCreate(actionType)
    },
    // 提交
    handleSubmit() {
      let actionType = 'submit'
      this.handleCreate(actionType)
    },
    // 保存
    // 资金计划名称生成 不可编辑  命名规则：年份+成本分期+年度资金计划，如2019年项目一年度资金计划
    buildFundsPlanName () {
        if (this.page.queryModel.fundsPlanName) return this.page.queryModel.fundsPlanName
        let fundsStageName = this.page.selectData.fundsStageList.find(item => item.value === this.page.queryModel.fundsStage)
        if (fundsStageName) fundsStageName = fundsStageName.label
        let acctObjName = this.page.queryModel.projectAccountSelectItem ? this.page.queryModel.projectAccountSelectItem.text : ''
        return this.page.queryModel.fundsMonth  + acctObjName + "月度资金计划"
    },

    // 升版
    buildPeriodVersion (periodVersion) {
        if (periodVersion) {
            periodVersion = periodVersion.replace('V', '')
        }
        if (periodVersion) periodVersion = parseInt(periodVersion)
        return 'V' + (Number(periodVersion) + 1)
    },
    //检查输入
    checkCreate (actionType) {
        console.log('checkCreate' + actionType)
        //全周期资金计划中该年度计划总额
        //this.page.queryModel.fundsPeriodPayPlanPayMoneySum
        let totalRowItem = this.tableData.find(rowItem => rowItem.rowType === 0)
        if (ifNull(this.page.queryModel.fundsPeriodPayPlanPayMoneySum, 0) !== ifNull(totalRowItem.plannedPaymentForThisYear, 0)) {
            this.$showWarning('本年度计划支付额(F) 不等于 全周期资金计划中该年度的总额！')
        }
        return true
    },
    prepareCreateData (actionType) {
        let paramData = {
            'accountingObjectId': this.page.queryModel.ProjectAccountSelect.accObjId,//'4028b88165f189d10165f18dae43056d', // 成本分期id
            'accountingObjectName': this.page.queryModel.projectAccountSelectItem.text,//'江阴鼎尚花园', // 成本分期
            'businessTree': [], //businessModel
            // 'monthList': [], //monthList
            // "companyCode": "",//事业部code
            'companyId': this.page.queryModel.companyId, // 事业部id(项目的parentid)
            // "companyName": "",//事业部name
            'createdBy': this.pageStatus.createBy,
            'createdDate': new Date().format(),
            'flag': this.pageStatus.isUpVersion, // boolean true为升版 其他为false
            // "fundsPlanCode": "",//资金计划编码
            'fundsPlanName': this.buildFundsPlanName(), // 资金计划名称
            'fundsStage': this.page.queryModel.fundsStage, // 资金计划阶段
            // "fundsStageIds": ["string"],
            'fundsMonth': this.page.queryModel.fundsMonth,  // 月份
            'fundsYear': this.page.queryModel.fundsMonth.split("-")[0], // 年份
            'id': this.page.queryModel.id, // 新增为null，编辑列表带过来
            // "isDeleted": "",//删除标记
            "operator": this.pageStatus.createBy,//经办日期
            "operateDate": new Date().format(),//经办人
            'payMoneySum': '110', // 计划付款总金额(元)(汇总月份)
            'periodVersion': this.page.queryModel.periodVersion,//this.buildPeriodVersion(this.page.queryModel.periodVersion), // 资金计划版本（升版+1）
            // "projectCode": "",//项目code
            'projectId': this.page.queryModel.ProjectAccountSelect.projectId, // 项目id
            // "projectName": "",//项目名称
            'remark': this.page.queryModel.remark, // 备注
            'stageId': this.page.queryModel.stageId, // 项目阶段ID
            'status': actionType !== 'submit' ? 0 : 1 // 审批状态(0,1)
        }
        let businessModel = {
        //     'businessId': '', // 业务表id（合同/合约规划）
        //     'businessName': '', // 业务表名称（合同/合约规划）
        //     'businessNumber': '', // 业务表编号（合同/合约规划）
        //     'businessType': ' ', // 业务类型（0：已签订合同 1：待签订合约规划）
            'monthList': [
                {
                    'businessId': '', // 业务表id（合同/合约规划）
                    'businessName': '', // 业务表名称（合同/合约规划）
                    'businessNumber': '', // 业务表编号（合同/合约规划）
                    'businessType': ' ', // 业务类型（0：已签订合同 1：待签订合约规划）
                    // 'factMoney': '', // 每月实际付款金额
                    'moneyType':'', //款项类型
                    'parentId': '', // 父节点id(已签合同，未签合同)
                    'payMoney':'', // 每月计划付款金额
                    'payPeriod': '', // 付款周期（月份）“1”
                    'payType':'',  //付款方式
                    'seq': '' // 序号 （父序号+0.1）
                }
            ],
            // 'parentId': '', // 父节点id
            // 'payMoney': 10, // 本年度计划支付额(F) = 月度计划汇总
            // 'returnMoney': 10, // 本年度回款计划(I)
            // 'seq': '' // 序号 同 monthList.seq
        }
        
        //汇总payMoneySum 
        let _this = this
        // debugger
        this.tableData.map(rowItem => {
            //合同4,合约5
            // debugger
            if (rowItem.rowType === 4 || rowItem.rowType === 5) {
                //合同/合约 
                let _businessModel = deepCopy(businessModel)

                // 汇总  计划付款总金额(元)(汇总月份)
                if (rowItem.month && rowItem.month.length > 0) {
                    _businessModel.monthList = []
                    // _businessModel = []
                    rowItem.month.map(monthItem => {
                        // 计划付款总金额
                        // paramData.payMoneySum = calc.Add(ifNull(paramData.payMoneySum, 0), ifNull(monthItem['planValues'], 0))

                        //月度
                        _businessModel.monthList.push({
                            businessId: rowItem.id,
                            businessName: rowItem.contractName,
                            businessNumber: rowItem.contractNumber,
                            businessType: rowItem.rowType === 4 ? 0 : 1,
                            // factMoney: monthItem.currentValues,
                            moneyType: monthItem.moneyType,
                            payMoney: monthItem.payMoney,
                            parentId: rowItem.parentId,
                            // payPeriod: monthItem.month ? monthItem.month.replace('month', '') : '',
                             payPeriod: monthItem.month.split("-")[1],
                            payType: monthItem.payType,
                            seq: rowItem.seq
                        })

                    })
                }
                // 本年度计划支付额(F) = 月度计划汇总
                // _businessModel.payMoney = paramData.payMoneySum

                // 业务表id（合同/合约规划）
                // _businessModel.businessId = rowItem.id
                // 业务表名称（合同/合约规划）
                // _businessModel.businessName = rowItem.contractName
                // 业务表编号（合同/合约规划）
                // _businessModel.businessNumber = rowItem.contractNumber
                // 业务类型（0：已签订合同 1：待签订合约规划）
                // _businessModel.businessType = rowItem.rowType === 4 ? 0 : 1

                // 父节点id
                // _businessModel.parentId = rowItem.parentId

                // 本年度回款计划(I)
                // _businessModel.returnMoney = calc.Mul(ifNull(rowItem.returnMoney, 0), 1)
                // 序号
                // _businessModel.seq = rowItem.seq

                // paramData.businessTree.push(_businessModel)
                // paramData.monthList.push(_businessModel)
                paramData.businessTree.push(_businessModel)
            }
        })
        return paramData
    },
    handleCreate (actionType) {
        let _this = this
        let _words = actionType === 'save' ? '保存' : '提交审批'
        if (!this.checkCreate(actionType)) return
        
        let postData = this.prepareCreateData(actionType)
        // debugger
        //console.info(postData)
        //return
        // console.log(JSON.stringify(postData))
        create(postData)
            .then(response => {
                LoadingUtil.hideLoading()
                if (actionType === 'save') {
                    postData.id = response.data
                    // alert(postData.id)
                    setTimeout(function () {
                        _this.$showSuccess('保存成功')
                    }, 2000)
                } else if (actionType === 'submit') {
                    setTimeout(function () {
                        _this.$showSuccess('提交审批成功')
                    }, 2000)
                    this.$router.push({
                        name: 'FundsMonthList'
                    })
                }
            })
            .catch(error => {
                console.log(error)
                this.$showError(error.message ? error.message : _words + '失败')
            })
    },
    // 行点击事件
    handleRowClick (row, event, column) {
        if (row.rowType !== 2) return
        // debugger
        this.pageStatus.selectLevel.row = deepCopy(row)
        this.pageStatus.selectLevel.name = row.contractNumber
        this.pageStatus.selectLevel.rowType = row.rowType

        let selectRowIndex = 0
        this.tableData.map(item => {
            if (row.id === item.id) {
                item.isSelect = true
                // 当前选中行
                this.pageStatus.selectLevel.rowIndex = selectRowIndex
            } else {
                item.isSelect = false
                // 当前选择二级分类下的  已签合同 /未签合同
                if (item.parentId === this.pageStatus.selectLevel.row.id && item.rowType === 3) {
                    if (item.contractNumber === '已签合同') {
                        this.pageStatus.selectLevel.contractParentId = item.id
                    }
                    if (item.contractNumber === '未签合同') {
                        this.pageStatus.selectLevel.contractPlanParentId = item.id
                    }
                }
            }
            selectRowIndex++
        })
    },
    // 表头颜色
    headerCellStyle({ row, column, rowIndex, columnIndex }) {
      let baseFontColor = ';color:#fff'
      let columnData = row[columnIndex]
      // 蓝色区域
      if (rowIndex === 0 && columnIndex < 7) return 'background:RGB(54,147,208)' + baseFontColor
      // 绿色区域
      if (columnData.property !== 'monthItemAmount' && rowIndex === 0 && columnIndex > 7 < 15) return 'background:RGB(0,153,0)' + baseFontColor
      // 橘色区域
      if (columnData.property === 'monthItemAmount' || rowIndex === 1) return 'background:RGB(255,102,0)' + baseFontColor
    },
    // 行颜色
    rowStyle({ row, column, rowIndex, columnIndex }) {
      let _background = null
      let _selectStyle = ''
      switch (row.rowType) {
        case 0:
          // 合计
          _background = 'RGB(244,176,132)'
          break
        case 1:
          // 一级分类
          _background = 'RGB(169,208,142)'
          break
        case 2:
          // 二级分类
          _background = 'RGB(204,204,204)'
          break
        case 3:
          // ow)
          // 插入一级分类1，二级分类2，已签合同/未签合同
          _background = 'RGB(204,204,204)'
          break
        case 4:
          // 合同
          _background = 'RGB(204,204,204)'
          break
        case 5:
          // 合约
          _background = 'RGB(204,204,204)'
          break
        default:
          break
      }
      if (row.isSelect) {
        _background = 'RGB(237,246,255)'
        _selectStyle = ';font-weight:bold;font-size:14px;color:orange'
      }
      return 'background:' + _background + _selectStyle
    },
    // 取人资金计划阶段
    handleChangeFundsStage() {
      this._checkYearAndStage()
    },
    // ============添加已签合同[已签订]============start
    handleSelectContract() {
      this.pageStatus.isShowContract = true
    },
    // 合同选择方法
    cancelDialog(show) {
      this.pageStatus.isShowContract = show
    },
    closeDialog(show) {
      this.pageStatus.isShowContract = show
    },
    confirmContract(selectContract) {
      let _this = this
      let selectContractList = []
        selectContractList.push(selectContract)
        console.log(JSON.stringify(selectContractList))
        // debugger
        // 已经存在的 合同 id
        let filterAllreadyExistContractList = []
        let insertFailCount = 0
        this.tableData.map(item => {
            if (item.rowType === 4) filterAllreadyExistContractList.push(item.id)
      })


        //遍历插入
        selectContractList.map((selectContract, index) => {
            let _bussinessId = selectContract.id
            if (!filterAllreadyExistContractList.includes(_bussinessId)) {
                let _contract = deepCopy(this.page.pageModel)
                let _insertIndex = this.getContractTableInsertIndex() + 1

                //行类型（合同）
                _contract.rowType = 4
                // id
                _contract.id = _bussinessId
                //序号
                _contract.seq = this.pageStatus.selectLevel.lastContractSeq
                //父id（二级分类的合同类型）
                _contract.parentId = this.pageStatus.selectLevel.contractParentId
                // 合同编号
                _contract.contractNumber = selectContract.contractCode
                // 合同名称
                _contract.contractName = selectContract.contractName
                // 合作单位
                _contract.partBName = selectContract.partyBName //-:) partyBName!==partBName
                //预计结算额（c）
                _contract.estimatedSettlementAmt = ifNull(selectContract.estimatedAmountOfSettlement, 0)
                // 签订合同额（A）
                _contract.contractAmountIncludeTax = selectContract.contractAmountIncludeTax

                this.tableData.splice(_insertIndex, 0, _contract)

            } else {
                insertFailCount++
            }

        })
        if (insertFailCount > 0) {
            if (insertFailCount === selectContractList.length) {
                this.$showError('所选合同已存在')
            } else {
                this.$showError('已过滤已存在合同' + insertFailCount + '条，成功添加' + (selectContractList.length - insertFailCount) + "条合同")
            }
        } else {
            this.$showSuccess('成功添加' + selectContractList.length + "条合同")
            }
    },

    // 获取合同插入位置
    getContractTableInsertIndex () {
        let childs = this.tableData.filter(item => item.parentId === this.pageStatus.selectLevel.contractParentId && item.rowType === 4)
        //最后一个序号
        this.pageStatus.selectLevel.lastContractSeq = '1.' + (childs.length + 1) 
        return this.pageStatus.selectLevel.rowIndex + childs.length + 1 //1为合同占位
    },
    // ============添加已签合同============start

    // ============添加未签合同(合约)============start
    handleSelectContractPlan() {
      this.pageStatus.dialogContractPlan = true
    },
    // 合约规划选择方法
    closeDialogContractPlan(selectContractPlanList) {
       //console.log(JSON.stringify(selectContractPlan))
       let _this = this
        let model = {
            'id': 'ff808081665c47b701665cd8c21c3b75',
            'createdBy': 'admin',
            'createdDate': '2018-10-10T07:20:01.308+0000',
            'updatedBy': 'admin',
            'updatedDate': '2018-10-10T07:20:01.308+0000',
            'version': 0,
            'accountingObjId': '4028b881665636e401665640017e31c5',
            'accountingObjName': '丽水青田百悦城（中梁百悦城）',
            'stageId': '2',
            'stageVersion': '0',
            'cpId': '4028b881652c1c0d01652c2c4e290010', // 合约id
            'cpName': '邻近建筑物损坏补偿合同', //
            'cpTotalAmount': 10000,
            'cpAmountOccurence': 0,
            'contractTotalAmount': 0,
            'nonContractTotalAmount': 0,
            'changeVisaTotalAmount': 0,
            'amountPendingApprove': 0,
            'amountReleased': 0,
            'amountPendingOccurence': 10000,//待发生
            'dynamicCost': 10000,
            'isDeleted': '0',
            'moduleType': null,
            'moduleDataPK': null,
            'contractSigningCpNew': {
                'id': null,
                'createdBy': null,
                'createdDate': null,
                'updatedBy': null,
                'updatedDate': null,
                'version': null,
                'contractId': null,
                'originCpId': null,
                'newCpId': null,
                'newCpName': null,
                'cpAmount': null,
                'amountReleased': null,
                'eventId': null,
                'bpmId': null,
                'dealingType': null
            },
            'locked': false,
            'reservedChangeRate': '12',
            'reservedChangeAmount': null,
            'remainedPendingOccurenceAmount': null,
            'dynaCostCPModelList': null
        }
        // debugger
        this.pageStatus.dialogContractPlan = false

        // 已经存在的 合同 id
        let filterAllreadyExistContractPlanList = []
        let insertFailCount = 0
        this.tableData.map(item => {
            if (item.rowType === 5) filterAllreadyExistContractPlanList.push(item.id)
        })
        selectContractPlanList.map((selectContractPlan, index) => {
        let _bussinessId = selectContractPlan.cpId
            if (!filterAllreadyExistContractPlanList.includes(_bussinessId)) {

            let _contractPlan = deepCopy(this.page.pageModel)
            let _insertIndex = this.getContractPlanTableInsertIndex() + 1

            //行类型 合约
            _contractPlan.rowType = 5
            // id
            _contractPlan.id = _bussinessId
            //序号
            _contractPlan.seq = this.pageStatus.selectLevel.lastContractSeq
            //父id 二级分类的 未签合同
            _contractPlan.parentId = this.pageStatus.selectLevel.contractPlanParentId
            // 合同编号
            _contractPlan.contractNumber = selectContractPlan.cpId
            // 合同名称
            _contractPlan.contractName = selectContractPlan.cpName
            // 合作单位（合约无此概念）
            _contractPlan.partBName = null
            // 待签约合约规划额(B)
            _contractPlan.amountPendingOccurence = ifNull(selectContractPlan.amountPendingOccurence, 0)
            // 预计结算额（C） 对应 带发生金额
            _contractPlan.estimatedSettlementAmt = ifNull(selectContractPlan.amountPendingOccurence, 0)

            this.tableData.splice(_insertIndex, 0, _contractPlan)
            } else {
                    insertFailCount++
                }
        })
        if (insertFailCount > 0) {
            if (insertFailCount === selectContractPlanList.length) {
                this.$showError('所选合约已存在')
            } else {
                this.$showError('已过滤已存在合约' + insertFailCount + '条，成功添加' + (selectContractPlanList.length - insertFailCount) + "条合约")
            }
        } else {
            this.$showSuccess('成功添加' + selectContractPlanList.length + "条合约")
        }
    },
    // 获取合约插入位置
     getContractPlanTableInsertIndex () {
            // debugger
            //合同/合约的所有子项
            let childs = this.tableData.filter(item => item.parentId === this.pageStatus.selectLevel.contractParentId || item.parentId === this.pageStatus.selectLevel.contractPlanParentId)
            //最后一个序号
            this.pageStatus.selectLevel.lastContractSeq = '2.' + (childs.length + 1)
            return this.pageStatus.selectLevel.rowIndex + childs.length + 2 //2为合同/合约占两位
        },
    // ============添加未签合同(合约)============end
        // 项目/成本分期选择事件
        projectAccountSelectChange (selectItem) {
            // debugger
            this.page.queryModel.projectAccountSelectItem = selectItem //当前选择的成本分期
            this.page.queryModel.stageId = (selectItem['attr'] && selectItem['attr']['stageId']) ? selectItem['attr']['stageId'] : null
            this.page.queryModel.ProjectAccountSelect.accObjId = selectItem.id
            //"6729,6795,6658,6759,7e473459-92a4-482a-9150-14f95e53de6d"
            //根，集团，公司，事业部，项目
            this.page.queryModel.companyId = null
            if (selectItem.parentIds) {
                let pathArray = selectItem.parentIds.split(',')
                if (pathArray.length === 5) {
                    this.page.queryModel.companyId = pathArray[3] //取事业部ID为公司id
                }
            }
            this._check()
        },
        //资金计划月选择事件
        fundsMonthSelectChange(selectItem){
            debugger
          if (selectItem) this.initData()
        },
        // 新增或者修改初始化页面数据
        _check () {
            // debugger
            let _queryObj = {}
            if(this.$route.query.accountingObjectId && this.$route.query.accountingObjectId != ""){
               _queryObj = {
                    accountingObjectId: this.$route.query.accountingObjectId, // 成本分期id
                    // fundsYear: null, // 月度传年，年度不传
                    stageId: this.$route.query.stageId// 阶段id
               } 
            }else{
                _queryObj = {
                    accountingObjectId: this.page.queryModel.ProjectAccountSelect.accObjId, // 成本分期id
                    // fundsYear: null, // 月度传年，年度不传
                    stageId: this.page.queryModel.stageId// 阶段id
                }
            }
            
            check(_queryObj)
                .then(response => {
                    LoadingUtil.hideLoading()
                    this.page.selectData.fundsMonthList = response.data.monthList
                    // 处理可以维护的资金计划年
                    // if (response.data && response.data.yearList && response.data.yearList.length > 0) {
                    //     // 给到的时['2018','2019']
                    //     this.page.selectData.fundsYearList = [] //重置
                    //     response.data.yearList.map(yearItem => {
                    //         this.page.selectData.fundsYearList.push({ label: yearItem, value: yearItem })
                    //     })
                    // } else {
                    //     this.$showError('本成本分期没有可维护年度资金计划')
                    // }
                })
                .catch(error => {
                    console.log(error)
                    this.$showError(error.message ? error.message : '检查年度资金计划失败')
                })
        },
        // 检查成本分期+资金计划年+阶段是否可以编制
        _checkYearAndStage () {
            if (this.page.queryModel.ProjectAccountSelect.accObjId && this.page.queryModel.fundsYear && this.page.queryModel.stageId) {
                let _this = this
                let _queryObj = {
                    accountingObjectId: this.page.queryModel.ProjectAccountSelect.accObjId, // 成本分期id
                    fundsYear: this.page.queryModel.fundsYear, // 月度传年，年度不传
                    stageId: this.page.queryModel.stageId// 阶段id
                }
                checkYearAndStage(_queryObj)
                    .then(response => {
                        LoadingUtil.hideLoading()
                        // 处理可以维护的资金计划年
                        // debugger
                        if (response.data && response.data.fundsStageIds && response.data.fundsStageIds.length > 0) {
                            // debugger
                            if (response.data.fundsStageIds.includes(_this.pageStatus.pre_fundsStage)) {
                                _this.page.queryModel.fundsStage = null
                                this.$showError('已存在阶段月度计划编制，请转列表页或重新选择')
                            } else {
                                _this.page.queryModel.fundsStage = deepCopy(_this.pageStatus.pre_fundsStage)
                                this.initData()
                            }
                        } else {
                            _this.page.queryModel.fundsStage = deepCopy(_this.pageStatus.pre_fundsStage)
                            _this.initData()
                        }
                    })
                    .catch(error => {
                        console.log(error)
                        this.$showError(error.message ? error.message : '检查资金计划阶段是否可编制失败')
                    })
            }
        },

        // 输入验证
        handleRowChange (fieldType, fieldInputValue, rowData, index, event) {
            if (fieldType === 'returnMoney') {
                // 本年度回款计划(I)
            } else if (fieldType === 'planValues') {
                // 计划

            } else if (fieldType === 'currentValues') {
                // 实际
            }
            //重算行
            this.calcRowData(index, rowData)
            // 重算表格
            this.calcTableData()
        },
        // 删除合同编号
        deleteContractNumber (index, _rowData) {
            // 拿掉当前行数据
            this.tableData.splice(index, 1)
            // 重算行
            this.calcTableData()
        },
        // 行计算
        calcRowData (index, _rowData) {
            // debugger
            //预计结算额(C)
            //plannedPaymentOfLastMonth; //上月计划支付额(元) (D)
            //actualPaymentOfLastMonth; //上月实际支付额(元) (E)
            //plannedPaymentRateOfLastMonth; //上月计划支付率(元) (F=E/D)
            //totalCheckAmtByEndOfLastMonth; //截止上月末累计产值(元) (G)
            //accPaymentOfLastMonth;//截止上月末累计已付(元) (H)
            //totalCheckAmtRateOfLastMonth;//累计已付占产值比(元) (I=H/G)
            //cumulativeContractRatio;//累计已付占合约比(元) (J=H/C)
            //payMoney;//计划支付金额(J)

            //plannedPaymentRateOfLastMonth; //上月计划支付率(元) (F=E/D)
            // _rowData.plannedPaymentRateOfLastMonth = ifNull(calc.Div(ifNull(_rowDat.actualPaymentOfLastMonth,0),ifNull(_rowData.plannedPaymentOfLastMonth, 1)).toFixed(2),0)  

            //totalCheckAmtRateOfLastMonth;//累计已付占产值比(元) (I=H/G)
            // _rowData.totalCheckAmtRateOfLastMonth = ifNull(calc.Div(ifNull(_rowDat.accPaymentOfLastMonth,0),ifNull(_rowData.totalCheckAmtByEndOfLastMonth, 1)).toFixed(2),0)

            //cumulativeContractRatio;//累计已付占合约比(元) (J=H/C)
            // _rowData.cumulativeContractRatio = ifNull(calc.Div(ifNull(_rowDat.accPaymentOfLastMonth,0),ifNull(_rowData.estimatedSettlementAmt,1)).toFixed(2),0)
        
            // 本年度计划支付额(F)=12列计划值之和
            // _rowData.plannedPaymentForThisYear = 0
            // _rowData.month.map(monthItem => {
            //     _rowData.plannedPaymentForThisYear = ifNull(calc.Add(_rowData.plannedPaymentForThisYear, ifNull(monthItem.planValues, 0)), 0)

            // })
         
            // returnMoneyRatioValue 预警(J>40%为红灯)
            // _rowData.returnMoneyRatioValue = ifNull(_rowData.returnMoneyRatio, 0)
        },
        // =================重算表格===================== 
        // 获取子项目

        //重算整个表格
        // 重置
        calcTableData_subFunction_reset (param_rowType) {
            let needCalRowProp = this.pageStatus.selectLevel.needCalRowProp
            let needCalRowMonthProp = this.pageStatus.selectLevel.needCalRowMonthProp
            this.tableData.map(map_Item => {
                if (map_Item.rowType === param_rowType) {
                    this.tableData.map(rowItem => {
                        // 重置
                        for (let propItem of needCalRowProp) {
                            if (propItem === 'month') {
                                //遍历需要计算的月数据
                                for (let monthPropItem of needCalRowMonthProp) {
                                    //遍历12个月
                                    for (let mounthNum = 0; mounthNum < 12; mounthNum++) {
                                        map_Item['month'][mounthNum][monthPropItem] = 0
                                    }
                                }
                            } else {
                                map_Item[propItem] = 0
                            }
                        }
                    })
                }
            })
        },
        // 重算
        calcTableData_subFunction_recalc (param_rowType) {
            let needCalRowProp = this.pageStatus.selectLevel.needCalRowProp
            let needCalRowMonthProp = this.pageStatus.selectLevel.needCalRowMonthProp
            this.tableData.map(map_Item => {
                if (map_Item.rowType === param_rowType) {
                    this.tableData.map(rowItem => {
                        //找到下级合同/合约 合计
                        if (rowItem.parentId === map_Item.id) {
                            //遍历需要计算的行数据
                            for (let propItem of needCalRowProp) {
                                if (propItem === 'month') {
                                    //遍历需要计算的月数据
                                    for (let monthPropItem of needCalRowMonthProp) {
                                        //遍历12个月
                                        for (let mounthNum = 0; mounthNum < 12; mounthNum++) {
                                            map_Item['month'][mounthNum][monthPropItem] = calc.Add(ifNull(map_Item['month'][mounthNum][monthPropItem], 0), ifNull(rowItem['month'][mounthNum][monthPropItem], 0))
                                        }
                                    }
                                } else {
                                    map_Item[propItem] = calc.Add(ifNull(map_Item[propItem], 0), ifNull(rowItem[propItem], 0))
                                }
                                //console.info(map_Item)
                            }
                        }
                    })
                }
            })
        },
        calcTableData () {
            // debugger
            let calcRowProp = {
                contractAmountIncludeTax: null, // 签订合同额(A)
                amountPendingOccurence: null, // 待签约合约规划额(B)
                estimatedSettlementAmt: null, // 预计结算额(C)
                // 绿色
                accPaymentOfLastYear: null, // 上年末累计已付(D)
                accPaymentOfLastYearRatio: null, // 上年末累计已付占比(E=D/B)
                plannedPaymentForThisYear: null, // 本年度计划支付额(F)=12列计划值之和
                plannedPaymentOfLastYearTotal: null, // 累计至本年末计划支付额(G=D+F)
                plannedPaymentOfLastYearRatio: null, // 累计本年末计划支付额占比(H=G/C)
                returnMoney: null, // 本年度回款计划(I)
                returnMoneyRatio: null, // 工程支出占回款比例(J=F/I)
                returnMoneyRatioValue: null, // 预警(J>40%为红灯)
                // 橘色
                month: [
                    // {
                    // sortNum: null,
                    // month: null,
                    // planValues: null,
                    // currentValues: null
                // }
                ] // 月份
            }
            // 行类型(合计0，一级分类1，二级分类2，已签合同/未签合同3，合同4,合约5)

            // 汇总 已签合同/未签合同3
            // step1：重置
            this.calcTableData_subFunction_reset(3)
            // 汇总 已签合同/未签合同3
            this.calcTableData_subFunction_recalc(3)

            // 汇总 二级分类
            // step1：重置
            this.calcTableData_subFunction_reset(2)
            // 汇总 已签合同/未签合同3
            this.calcTableData_subFunction_recalc(2)

            // 汇总 一级分类
            // step1：重置
            this.calcTableData_subFunction_reset(1)
            // 汇总 已签合同/未签合同3
            this.calcTableData_subFunction_recalc(1)

            // 汇总 合计
            // step1：重置
            this.calcTableData_subFunction_reset(0)
            // 汇总 已签合同/未签合同3
            this.calcTableData_subFunction_recalc(0)

            // 所有行以公式进行计算
            // this.tableData.map((rowItem, index) => {
            //     this.calcRowData(index, rowItem)
            // })
        },
        _ifNull (value) {
            return ifNull(value, 0)
        },
        _ToString (value) {
            if (!value) {
                return value
            } else {
                return value.toString()
            }
        },
  },
  watch: {
    'page.queryModel.fundsStage': function (newValue, oldValue) {
        if (this.pageStatus.pre_fundsStage) this.pageStatus.pre_fundsStage = deepCopy(this.page.queryModel.fundsStage)
    }
  }
}
</script>

<style scoped>
.marginBottom {
  margin-bottom: 30px;
}
/*明细的行高*/
.el-form-item--mini .el-form-item__content {
  line-height: 20px;
}
/*可编辑二级分类*/
.editItem {
  font-size: 18px;
  margin-right: 10px;
  vertical-align: top;
  cursor: pointer;
}
/*删除合同编号按钮*/
.deleteItem {
  font-size: 18px;
  color: red;
  margin-right: 10px;
  vertical-align: top;
  cursor: pointer;
}
</style>
<style>
/** style (注意不要设为scoped) */
/** configurationTable和afterRenderClass都是为了标记仅这个组件内修改 */
.configurationTable .el-table__body-wrapper {
  overflow: hidden;
}
.afterRenderClass {
  .el-table__body-wrapper {
    overflow: auto;
  }
}
</style>
