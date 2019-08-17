<template>
  <div class="app-container targetCostQuery"
       style="overflow:hidden">
    <el-row style="text-align:right;margin:10px;margin-right:0"
            <el-col
            :span="accountingTargetTreeSelectorSpan"
            style="margin-top:10px">
      <AccountingTargetTreeSelector v-model="page.selectNode"
                                    :cHeight="accountingTargetTreeSelectorHeight" />
      </el-col>
      <el-col :span="24-accountingTargetTreeSelectorSpan"
              :style="{'padding-left':'10px','margin-top':'10px'}">

        <!-- 阶段 -->
        <el-steps :active="parseInt(detailModel.stageId)-1">
          <el-step v-for="(item,index) in page.stepDatas"
                   :description="item.description"
                   :icon="item.icon"
                   :title="item.name"
                   :key="index"
                   :style="{'cursor':page.selectNode?'pointer':'normal'}"
                   @click.native="handleStageClick(item.id)"></el-step>
        </el-steps>

        <!-- 明细信息 -->
        <el-collapse style="margin:0;margin-bottom:5px;">
          <el-collapse-item>
            <template slot="title">
              <strong style="padding-left:10px">明细信息({{page.selectNode? (page.selectNode.text || ''):''}})</strong>
              <i class="header-icon el-icon-info">
              </i>
            </template>
            <div style="line-height:30px;padding-top:10px;">
              <el-row>
                <!-- 第一行 -->
                <el-col :span="8"
                        :offset="1">
                  <div class="detailLabel">合约规划金额(含税)(元)：</div>
                  <div class="detailValue">{{detailModel.targetCostContainTax | NumFormat}}</div>
                </el-col>
                <el-col :span="8">
                  <div class="detailLabel">编制人：</div>
                  <div class="detailValue">{{detailModel.editPerson}}</div>
                </el-col>
                <el-col :span="7">
                  <div class="detailLabel">审批状态：</div>
                  <div class="detailValue">{{detailModel.flowStatus}}</div>
                </el-col>

                <!-- 第二行 -->
                <el-col :span="8"
                        :offset="1">
                  <div class="detailLabel">合约规划金额(不含税)(元)：</div>
                  <div class="detailValue">{{detailModel.targetCostWithoutTax | NumFormat}}</div>
                </el-col>
                <el-col :span="8">
                  <div class="detailLabel"> 编制日期：</div>
                  <div class="detailValue">{{detailModel.eidtDate | dateFormat('yyyy-MM-dd')}}</div>
                </el-col>
                <el-col :span="7">
                  <div class="detailLabel">版本：</div>
                  <div class="detailValue">
                    <div style="float:left;min-width:30px;text-align:left;">
                      <!-- <fd-label :code="detailModel.stageId.toString()"
                                              type="cost_stage_id"></fd-label> -->
                      {{selectData.cost_stage_id[_ToString(detailModel.stageId)]}}
                    </div>
                    <div style="float:left;width:50px;text-align:left;">{{detailModel.stageVersion |Version}}</div>
                  </div>
                </el-col>
              </el-row>
            </div>
          </el-collapse-item>
        </el-collapse>

        <!-- 记录查询 -->
        <el-form size="mini">
          <el-row>
            <el-col :span="4">
              <!-- 科目代码或名称 -->
              <el-input v-model='queryModel.subjectCodeOrName'
                        :placeholder="queryModel.placeHolder"
                        show-overflow-tooltip
                        clearable
                        :maxlength="20"
                        :disabled="pageModelList.length === 0"></el-input>
            </el-col>
            <el-col :span="13">
              <!-- 查询 -->
              <el-button size="mini"
                         class="special-btn"
                         type='primary'
                         @click='handleSearch'
                         :disabled="pageModelList.length === 0">{{$l('btn_search')}}</el-button>
              <!-- 导出 -->
              <el-button size="mini"
                         class="special-btn"
                         type='primary'
                         @click='handleExport'
                         v-if="pageStatus.tableTabsValue === 'BYSB' && pageStatus.flag!=='HISTORY'"
                         :disabled="pageModelList.length === 0">{{$l('lbl_standared_subject_export')}}</el-button>

              <!-- 历史记录 -->
              <el-button size="mini"
                         class="special-btn"
                         type='primary'
                         @click='handleViewHistory'
                         v-if="pageStatus.tableTabsValue === 'BYSB'"
                         :disabled="pageModelList.length === 0">{{$l('lbl_cost_query_history')}}</el-button>

              <el-button size="mini"
                         class="ordinary-btn"
                         :icon="accountingTargetTreeSelectorIsExpand?'el-icon-d-arrow-left':'el-icon-d-arrow-right'"
                         type='primary'
                         @click='expandAccountingTargetTreeSelector'>{{accountingTargetTreeSelectorIsExpand?'收起组织':'展开组织'}}</el-button>

              <el-button size="mini"
                         class="ordinary-btn"
                         @click='handleBack'>{{$l("btn_back")}}</el-button>
            </el-col>
          </el-row>
        </el-form>

        <!-- 项目数据 -->
        <el-row style="margin-bottom:10px;border:none;margin-top:10px"
                v-if="pageModelList.length !== 0 && pageStatus.flag !== 'HISTORY'">

          <el-tabs type="border-card"
                   v-model="pageStatus.tableTabsValue"
                   @tab-click="handleClick">
            <el-tab-pane name="BYSB">
              <span slot="label"><i class="el-icon-date"></i> 按科目查询</span>
              <div>
                <!-- 编制表格 -->
                <el-table :data="pageModelList"
                          :row-style="showRow"
                          align="left"
                          stripe
                          size="small"
                          border
                          tooltip-effect="dark"
                          :height="tHeight"
                          v-if="pageStatus.tableTabsValue === 'BYSB'"
                          style="width: 100%">
                  <!-- 成本科目编码 -->
                  <el-table-column prop="subjectCode"
                                   :label="$l('lbl_standared_subject_code')"
                                   width="180"
                                   align="left"
                                   :fixed="pageModelList.length!==0">
                    <template slot-scope="scope">
                      <div :style="{'width':'100%','text-align':'left','padding-left':(getLevel(scope.row.subjectCode)-1)*5+'px'}">
                        <!-- 展开折叠 -->
                        <i :class="!scope.row._expanded ? 'fa fa-plus-square-o' : 'fa fa-minus-square-o' "
                           class="subjectCodeExpand"
                           v-show="scope.row.dataType === '1'"
                           @click="handleExpandClick(scope.row.subjectCode)"></i>
                        <span v-show="scope.row.dataType === '1'">{{scope.row.subjectCode}}</span>
                      </div>
                    </template>
                  </el-table-column>

                  <!-- 成本科目名称 -->
                  <el-table-column prop="subjectName"
                                   :label="$l('lbl_standared_subject_name')"
                                   width="160"
                                   show-overflow-tooltip
                                   :fixed="pageModelList.length!==0">
                    <template slot-scope="scope">
                      <div style="text-align:left">
                        <span v-show="scope.row.dataType === '1'">{{scope.row.subjectName}}{{scope.row.reserveCostType === '1'?'(预备费)':''}}</span>
                      </div>
                    </template>
                  </el-table-column>

                  <!-- 目标成本金额(含税) -->
                  <el-table-column prop="subjectAmountIncludeTax"
                                   :label="'目标成本金额(含税)(元)'"
                                   show-overflow-tooltip
                                   width="150"
                                   :fixed="pageModelList.length!==0">
                    <template slot-scope="scope">
                      <span v-if="scope.row.dataType === '1'">{{ifNullValue(scope.row.subjectAmountIncludeTax,0) | NumFormat}}</span>
                    </template>
                  </el-table-column>

                  <!-- 合约规划【可编辑】 -->
                  <el-table-column prop="contractPlanName"
                                   :label="'合约规划'"
                                   width="150"
                                   show-overflow-tooltip
                                   :fixed="pageModelList.length!==0">
                    <template slot-scope="scope">
                      <!-- view -->
                      <div style="text-align:left;color:blue"
                           v-show="scope.row.dataType === '2'">
                        {{scope.row.contractPlanName || '--'}}
                      </div>
                    </template>
                  </el-table-column>

                  <!-- 一级分类 -->
                  <!-- <el-table-column prop="level1Name"
                                         :label="'一级分类'"
                                         width="150">
                            <template slot-scope="scope">
                                {{scope.row.level1Name}}
                            </template>
                        </el-table-column> -->

                  <!-- 二级分类 -->
                  <!-- <el-table-column prop="level2Name"
                                         :label="'二级分类'"
                                         width="150">
                            <template slot-scope="scope">
                                {{scope.row.level2Name}}
                            </template>
                        </el-table-column> -->

                  <!-- 责任部门 -->
                  <el-table-column prop="responsibleDeptCode"
                                   :label="'责任部门'"
                                   width="150">
                    <template slot-scope="scope">
                      <!-- <fd-label :code="scope.row.responsibleDeptCode"
                                          type="cost_subject_responsible_dept_code"></fd-label> -->

                      {{selectData.cost_subject_responsible_dept_code[scope.row.responsibleDeptCode]}}
                    </template>
                  </el-table-column>

                  <!-- 成本科目比例【可编辑】 -->
                  <el-table-column prop="splitRate"
                                   :label="'成本科目比例(%)'"
                                   width="150">
                    <template slot-scope="scope">
                      <!-- view -->
                      <span>
                        <span v-show="scope.row.dataType === '2'">
                          {{scope.row.splitRate}}
                        </span>
                        <!-- <span v-show="scope.row.dataType === '1'">
                                        <strong>{{scope.row._sumSplitRate}}%</strong>
                                    </span> -->
                      </span>
                    </template>
                  </el-table-column>

                  <!-- 合约规划金额（含税）【可编辑】 -->
                  <el-table-column prop="contractPlanAmountIncludeTax"
                                   :label="'合约规划金额（含税）(元)'"
                                   width="200">
                    <template slot-scope="scope">
                      <!-- view -->
                      <span>
                        <span v-show="scope.row.dataType === '2'">{{scope.row.contractPlanAmountIncludeTax | NumFormat}}</span>

                        <span v-show="scope.row.dataType === '1' && scope.row.isLeaf">
                          <!-- <strong>{{scope.row.subjectAmountIncludeTax | NumFormat}}</strong>
                                        [{{scope.row._sumContractPlanAmountIncludeTax | NumFormat}}] -->
                          <strong>{{scope.row._sumContractPlanAmountIncludeTax | NumFormat}}</strong>
                        </span>
                      </span>
                    </template>
                  </el-table-column>

                  <!-- 合约规划金额（不含税） -->
                  <el-table-column prop="contractPlanAmountExcludeTax"
                                   :label="'合约规划金额（不含税）(元)'"
                                   width="200">
                    <template slot-scope="scope">
                      <span v-show="scope.row.dataType === '2'">{{scope.row.contractPlanAmountExcludeTax | NumFormat}}</span>
                      <span v-show="scope.row.dataType === '1' && scope.row.isLeaf">
                        <!-- <strong>{{scope.row.subjectAmountExcludeTax | NumFormat}}</strong>
                                    [{{scope.row._sumContractPlanAmountExcludeTax | NumFormat}}] -->
                        <strong>{{scope.row._sumContractPlanAmountExcludeTax | NumFormat}}</strong>
                      </span>
                    </template>
                  </el-table-column>

                  <!-- 税率 -->
                  <el-table-column prop="taxRate"
                                   :label="'税率(%)'"
                                   width="150">
                    <template slot-scope="scope">
                      <span v-show="scope.row.dataType === '2'">{{scope.row.taxRate | rateFormat}}</span>
                    </template>
                  </el-table-column>

                  <!-- 税额 -->
                  <el-table-column prop="tax"
                                   :label="'税额(元)'"
                                   width="140">
                    <template slot-scope="scope">
                      <span v-show="scope.row.dataType === '2'">{{scope.row.tax | NumFormat}}</span>

                      <span v-show="scope.row.dataType === '1' && scope.row.isLeaf">
                        <!-- <strong>{{scope.row.tax | NumFormat}}</strong>
                                    [{{scope.row._sumTax | NumFormat}}] -->
                        <strong>{{scope.row._sumTax | NumFormat}}</strong>
                      </span>
                    </template>
                  </el-table-column>

                  <!-- 预估变更比例 【可编辑】-->
                  <el-table-column prop="reservedChangeRate"
                                   :label="'预估变更比例(%)'"
                                   width="150">
                    <template slot-scope="scope">
                      <!-- view -->
                      <span>
                        <span v-show="scope.row.dataType === '2'">{{scope.row.reservedChangeRate}}</span>

                        <!-- <span v-show="scope.row.dataType === '1'">
                                        <strong>{{scope.row._sumReservedChangeRate}}%</strong>
                                    </span> -->
                      </span>
                    </template>
                  </el-table-column>

                  <!-- 预估变更金额（含税） -->
                  <el-table-column prop="reservedAmountIncludeTax"
                                   :label="'预估变更金额（含税）(元)'"
                                   width="200">
                    <template slot-scope="scope">
                      <span v-show="scope.row.dataType === '2'">{{scope.row.reservedAmountIncludeTax | NumFormat}}</span>

                      <span v-show="scope.row.dataType === '1' && scope.row.isLeaf">
                        <!-- <strong>{{scope.row.reservedAmountIncludeTax | NumFormat}}</strong>
                                    [{{scope.row._sumreservedAmountIncludeTax | NumFormat}}] -->
                        <strong>{{scope.row._sumreservedAmountIncludeTax | NumFormat}}</strong>
                      </span>
                    </template>
                  </el-table-column>

                  <!-- 预估变更金额（不含税） -->
                  <el-table-column prop="reservedAmountExcludeTax"
                                   :label="'预估变更金额（不含税）(元)'"
                                   width="200">
                    <template slot-scope="scope">
                      <span v-show="scope.row.dataType === '2'">{{scope.row.reservedAmountExcludeTax | NumFormat}}</span>

                      <span v-show="scope.row.dataType === '1' && scope.row.isLeaf">
                        <!-- <strong>{{scope.row.reservedAmountExcludeTax | NumFormat}}</strong>
                                    [{{scope.row._sumreservedAmountExcludeTax | NumFormat}}] -->
                        <strong>{{scope.row._sumreservedAmountExcludeTax | NumFormat}}</strong>
                      </span>
                    </template>
                  </el-table-column>

                  <!-- 分摊规则 -->
                  <el-table-column prop="apportionmentRuleCode"
                                   :label="this.$l('lbl_standared_subject_apportionment_rule')"
                                   show-overflow-tooltip
                                   width="150">
                    <template slot-scope="scope">
                      <!-- <fd-label :code="scope.row.apportionmentRuleCode"
                                          type="cost_subject_apportionment_rule_code"></fd-label> -->
                      {{selectData.cost_subject_apportionment_rule_code[scope.row.apportionmentRuleCode]}}
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </el-tab-pane>
            <el-tab-pane label="按合约规划查询"
                         name="BYCP"></el-tab-pane>
            <div>
              <!-- 编制表格 -->
              <el-table :data="pageModelList_CP"
                        :row-style="showRow"
                        align="left"
                        stripe
                        size="small"
                        border
                        tooltip-effect="dark"
                        :height="tHeight"
                        v-if="pageStatus.tableTabsValue === 'BYCP'"
                        style="width: 100%">
                <!-- 合约规划 -->
                <el-table-column prop="name"
                                 label="合约规划"
                                 width="180"
                                 align="left"
                                 :fixed="pageModelList_CP.length!==0">
                  <template slot-scope="scope">
                    <div style="text-align:left">{{scope.row.name}}</div>
                  </template>
                </el-table-column>
                <!-- 一级分类 -->
                <el-table-column prop="level1Name"
                                 label="一级分类"
                                 width="80"
                                 align="left">
                </el-table-column>
                <!-- 二级分类 -->
                <el-table-column prop="level2Name"
                                 label="二级分类"
                                 width="80"
                                 align="left">
                </el-table-column>

                <!-- 成本科目编码 -->
                <el-table-column prop="code"
                                 label="科目编码"
                                 width="180"
                                 align="left">
                </el-table-column>

                <!-- 成本科目名称-->
                <el-table-column prop="subjectName"
                                 label="科目名称"
                                 width="180"
                                 align="left">
                </el-table-column>

                <!-- 合约规划金额（含税）(元) -->
                <el-table-column prop="contractPlanAmountIncludeTax"
                                 label="合约规划金额（含税）(元)"
                                 width="160"
                                 align="left">
                  <template slot-scope="scope">
                    {{scope.row.contractPlanAmountIncludeTax | NumFormat}}
                  </template>
                </el-table-column>

                <!-- 合约规划金额（不含税）(元) -->
                <el-table-column prop="contractPlanAmountExcludeTax"
                                 label="合约规划金额（不含税）(元)"
                                 width="160"
                                 align="left">
                  <template slot-scope="scope">
                    {{scope.row.contractPlanAmountExcludeTax | NumFormat}}
                  </template>
                </el-table-column>

                <!-- 税率(%) -->
                <el-table-column prop="taxRate"
                                 label="税率(%)"
                                 width="80"
                                 align="left">
                  <template slot-scope="scope">
                    {{scope.row.taxRate | NumFormat}}
                  </template>
                </el-table-column>

                <!-- 税额(元) -->
                <el-table-column prop="tax"
                                 label="税额(元)"
                                 width="140"
                                 align="left">
                  <template slot-scope="scope">
                    {{scope.row.tax | NumFormat}}
                  </template>
                </el-table-column>

                <!-- 预估变更比例(%) -->
                <el-table-column prop="reservedChangeRate"
                                 label="预估变更比例"
                                 width="120"
                                 align="left">
                </el-table-column>

                <!-- 预估变更金额（含税）(元) -->
                <el-table-column prop="reservedAmountIncludeTax"
                                 label="预估变更金额（含税）(元)"
                                 width="180"
                                 align="left">
                  <template slot-scope="scope">
                    {{scope.row.reservedAmountIncludeTax | NumFormat}}
                  </template>
                </el-table-column>

                <!-- 预估变更金额（不含税）(元) -->
                <el-table-column prop="reservedAmountExcludeTax"
                                 label="预估变更金额（不含税）(元)"
                                 width="180"
                                 align="left">
                  <template slot-scope="scope">
                    {{scope.row.reservedAmountExcludeTax | NumFormat}}
                  </template>
                </el-table-column>

                <!-- 分摊规则 -->
                <el-table-column prop="apportionmentRuleCode"
                                 label="分摊规则"
                                 width="80"
                                 align="left">
                  <template slot-scope="scope">
                    <!-- <fd-label :code="scope.row.apportionmentRuleCode"
                                          type="cost_subject_apportionment_rule_code"></fd-label> -->
                    {{selectData.cost_subject_apportionment_rule_code[scope.row.apportionmentRuleCode]}}
                  </template>
                </el-table-column>

                <!-- 责任部门 -->
                <el-table-column prop="responsibleDeptCode"
                                 label="责任部门"
                                 width="80"
                                 align="left">
                  <template slot-scope="scope">
                    <!-- <fd-label :code="scope.row.responsibleDeptCode"
                                          type="cost_subject_responsible_dept_code"></fd-label> -->

                    {{selectData.cost_subject_responsible_dept_code[scope.row.responsibleDeptCode]}}
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-tabs>

        </el-row>

        <!-- 历史版本对比HISTORY -->
        <el-row style="margin-bottom:10px;border:none;margin-top:10px"
                v-if="pageModelList.length !== 0 && pageStatus.flag === 'HISTORY'">
          <!-- 编制表格 -->
          <el-table :data="pageModelList"
                    :row-style="showRow"
                    align="left"
                    stripe
                    size="small"
                    border
                    :height="tHeight"
                    tooltip-effect="dark"
                    style="width: 100%">
            <!-- 成本科目级别 -->
            <el-table-column prop="subjectCode"
                             :label="$l('lbl_standared_subject_level')"
                             width="100"
                             fixed>
              <template slot-scope="scope">{{ scope.row.subjectCode | FLevel }}</template>
            </el-table-column>

            <!-- 成本科目编码-->
            <el-table-column prop="subjectCode"
                             :label="$l('lbl_standared_subject_code')"
                             width="180"
                             align="left"
                             fixed>
              <template slot-scope="scope">
                <!-- view -->
                <div :style="{'width':'100%','text-align':'left','padding-left':(getLevel(scope.row.subjectCode)-1)*5+'px'}"
                     v-if="!scope.row.contractName">
                  <i :class="!scope.row._expanded ? 'fa fa-plus-square-o' : 'fa fa-minus-square-o' "
                     style="font-size:14px;font-weight:bold;cursor:pointer"
                     @click="handleExpandClick(scope.row.subjectCode)"></i>&nbsp;&nbsp; {{ scope.row.subjectCode }}
                </div>
              </template>
            </el-table-column>

            <!-- 成本科目名称 -->
            <el-table-column prop="subjectName"
                             :label="$l('lbl_standared_subject_name')"
                             width="300"
                             fixed>
              <template slot-scope="scope">
                <span v-if="!scope.row.contractName">{{scope.row.subjectName}}</span>
              </template>
            </el-table-column>

            <!-- 合约规划名称 -->
            <el-table-column prop="contractName"
                             label="合约规划"
                             width="300"
                             fixed>
              <template slot-scope="scope">
                <span>{{scope.row.contractName}}</span>
              </template>
            </el-table-column>

            <el-table-column v-for="(item,index) in pageStatus.HISTORY_attributes"
                             :key="index"
                             :label="getHISTORYAttributesLabel(item)">
              <template slot-scope="scope">
                <span :style="{'color':getHISTORYAttributesColor(index,scope.row)}">{{scope.row.attributes[item] | NumFormat}}</span>
              </template>
            </el-table-column>

          </el-table>
        </el-row>
      </el-col>
    </el-row>

    <!-- 查看历史 -->
    <el-dialog :title="$l('lbl_cost_query_history')"
               :visible.sync="page.dialog.dialogSelect"
               :modal="true"
               :lock-scroll="true">
      <div>
        <el-form :inline="true"
                 size="mini"
                 class="demo-form-inline">
          <el-row>
            <el-col :span="4">
              <!-- 阶段 -->
              <el-form-item>
                <fd-select v-model='page.dialog.queryModel.stageId'
                           type="cost_stage_id"
                           placeholder="阶段"
                           style="width:100px;"
                           :clearable="true"></fd-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <!-- 修订时间 -->
              <el-form-item>
                <el-date-picker v-model="page.dialog.queryModel.startDate"
                                type="date"
                                style="width:155px;"
                                :picker-options="pickerOptions0"
                                placeholder="选择修订起始日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item>
                <el-date-picker v-model="page.dialog.queryModel.endDate"
                                type="date"
                                style="width:155px;"
                                :picker-options="pickerOptions1"
                                placeholder="选择修订截至日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <!-- 查询 -->
              <el-button size="mini"
                         class="special-btn"
                         type='primary'
                         @click='searchDialogResult'>{{$l('btn_search')}}</el-button>

              <!-- 对比 -->
              <el-button size="mini"
                         class="special-btn"
                         type='primary'
                         @click='compareDialogResult'
                         :disabled="page.dialog.selectRows.length === 0">{{$l('btn_compare_history')}}</el-button>
            </el-col>
          </el-row>
        </el-form>
        <el-table :data="page.dialog.tableData"
                  stripe
                  border
                  size="small"
                  height="200"
                  :row-style="showDialogRow"
                  @selection-change="handleDialogSelectionChange"
                  style="width: 100%">
          <!-- checkbox -->
          <el-table-column type="selection"
                           width="55">
          </el-table-column>
          <!-- 序号 -->
          <el-table-column fixed
                           :label="$l('lbl_no')"
                           width="60"
                           type="index">
          </el-table-column>
          <!-- 版本号 -->
          <el-table-column prop="stageVersion"
                           :label="'版本号'">
            <template slot-scope="scope">
              {{scope.row.stageVersion |Version}}
            </template>
          </el-table-column>
          <!-- 阶段 -->
          <el-table-column prop="projectStageName"
                           :label="'阶段'"></el-table-column>
          <!-- 修订时间 -->
          <el-table-column prop="status"
                           :formatter='this.$dateFormat("updatedDate","yyyy-MM-dd")'
                           width="150"
                           :label="'修订日期'"></el-table-column>

          <!-- 修订人 -->
          <el-table-column prop="createdBy"
                           :label="'修订人'">
            <template slot-scope="scope">
              {{scope.row.createdBy?scope.row.createdBy:scope.row.updatedBy}}
            </template>
          </el-table-column>
          <!-- 操作 -->
          <el-table-column :label="$l('lbl_operation')"
                           width="100">
            <!-- 查看 -->
            <template slot-scope="scope">
              <el-button size="mini"
                         type="text"
                         icon="el-icon-view"
                         :title="$l('btn_detail')"
                         @click="handleSelectOtherProjectTemplate(scope.$index, scope.row)"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
  </div>
</template>


<script>
import { calc } from '@/utils/common/calc'
import { LoadingUtil } from '@/utils/common/LoadingUtil'
import COSTENUM from '@/utils/cost/enum'
import COSTBUSINESS from '@/utils/cost/business'
import {
  getTargetCostContractPlanDetails, // 获取核算成本信息
  getTargetCostContractPlanHistory, // 获取历史
  getTargetCostContractPlanById, // 根据历史获取成本信息
  getTargetCostContractPlanVersionsByIds, // 合约规划多个版本对比
  getTargetCostContractPlanByAccountingObject, // 获取基本信息
  getTargetCostContractPlanByContract, //获取基本信息(按合约查看) 
  getAccountingObjectCommonInfo // 获取基本信息
} from '@/api/cost/targetCostContractPlanAPI'
import {
  getAccountingObjectProjectTree, // 获取树
} from '@/api/cost/targetCostQueryAPI'
import {
  NumFormat, // 千位符
  FLevel,
  dateFormat,
  Version,
  rateFormat
} from '@/filters/cost/'
import AccountingTargetTreeSelector from '@/components/cost/AccountingTargetTreeSelector/'
import ProjectTreeSelector from '@/components/cost/ProjectTreeSelector/'
import { deepCopy, ifNull } from '@/utils/cost/objectHelper'
import { getLocalItem, setLocalItem, removeLocalItem, Constants } from '@/utils/common/cache'
import sys_config from '@/config/config.js'
export default {
  data () {
    return {
      accountingTargetTreeSelectorHeight: 380,
      selectData: {
        cost_stage_id: [],
        cost_subject_apportionment_rule_code: [],
        cost_subject_responsible_dept_code: []
      },
      accountingTargetTreeSelectorIsExpand: false,
      accountingTargetTreeSelectorSpan: 0,
      page: {
        stageId: null,
        selectStageId: null,//当前选中阶段
        accountingObjectId: null,
        accountingObjectName: null,
        selectNode: null, // 当前节点
        stepDatas: COSTENUM.contractStepType,
        dialog: {
          dialogSelect: false,
          queryModel: {
            stageId: '',
            startDate: null,
            endDate: null
          },
          tableData: [],
          selectRows: []
        },
        historyColorArray: [] // 历史版本对比颜色
      },
      pageStatus: {
        expandedLevel: sys_config.expandedLevel,//默认展开二级
        tableTabsValue: 'BYSB',
        maxLevel: 5,
        specialNode: COSTENUM.SPECIAL_SUBJECT_CODE_FLAG,
        hanldeTabIndex: 0,
        flag: 'PUTONG', // PUTONG普通,FENQI是跨期,KUAQI是分期
        HISTORY_attributes: [] // ['1-0', '2-1'],//历史动态列 当前包含的阶段和版本-前为阶段,2后为版本
      },
      pageModelList: [],
      pageModelList_CP: [],
      detailModel: {
        stageId: 0,
        canSaleAcreage: null,
        targetCostContainTax: null,
        editPerson: null,
        buildingAcreage: null,
        targetCostWithoutTax: null,
        eidtDate: null,
        canSalePart: null,
        adjustLevel: null,
        flowStatus: null,
        buildingAcreagePart: null,
        stageVersion: null
      },
      queryModel: {
        subjectCode: '',
        subjectName: '',
        subjectCodeOrName: '',
        placeHolder: '科目编码或名称'
      },
      pageModel: {

      },
      pickerOptions0: {
        disabledDate: (time) => {
          if (this.page.dialog.queryModel.endDate !== '' && this.page.dialog.queryModel.endDate !== null) {
            return time.getTime() > this.page.dialog.queryModel.endDate
          } else {
            // return time.getTime() < Date.now() - 8.64e7
          }
        }
      },
      pickerOptions1: {
        disabledDate: (time) => {
          return time.getTime() < this.page.dialog.queryModel.startDate
        }
      }
    }
  },
  filters: {
    NumFormat,
    FLevel,
    dateFormat,
    Version,
    rateFormat
  },
  computed: {
    tHeight: function () {
      let _tableHeight = document.body.clientHeight - 305
      this.accountingTargetTreeSelectorHeight = _tableHeight + 110
      return _tableHeight + 'px'
    }
  },
  components: {
    AccountingTargetTreeSelector
  },
  methods: {
    //点击事件
    handleClick (tab, event) {
      if (tab.name === 'BYSB') {
        this.pageStatus.tableTabsValue = 'BYSB'
        this.queryModel.placeHolder = '科目编码或名称'
      } else if (tab.name === 'BYCP') {
        this.pageStatus.tableTabsValue = 'BYCP'
        this.queryModel.placeHolder = '合约规划'
      }
    },
    // toString()
    _ToString (value) {
      if (!value) {
        return value
      } else {
        return value.toString()
      }
    },
    // 是否为空
    ifNullValue (value, defaultValue) {
      return ifNull(value, defaultValue)
    },
    // 展开收起组织树
    expandAccountingTargetTreeSelector () {
      this.accountingTargetTreeSelectorIsExpand = !this.accountingTargetTreeSelectorIsExpand
      this.accountingTargetTreeSelectorSpan = this.accountingTargetTreeSelectorIsExpand ? 5 : 0
    },
    // 获取attributes 随机颜色
    getHISTORYAttributesColor (index, rowData) {
      let color = ''
      if (index !== 0 && rowData.attributes[this.pageStatus.HISTORY_attributes[index]] !== rowData.attributes[this.pageStatus.HISTORY_attributes[index - 1]]) {
        color = this.page.historyColorArray[index]
      }
      return color
    },
    // 获取attributes
    getHISTORYAttributesLabel (item) {
      console.log(item)
      let stadge = { '1': '投前', '2': '投后', '3': '预备会', '4': '预结算', '5': '结算' }
      let stadgeVersionPreChar = 'V '
      return stadge[item.split('_')[0]] + ' ' + stadgeVersionPreChar + item.split('_')[1]
    },
    handleBack () {
      this.$router.push({
        name: 'TargetCostContractPlanOverview'
      })
    },
    // 历史版本对比数据
    initHistoryCompareData (response) {
      let _this = this
      this.pageModelList = []
      this.pageStatus.HISTORY_attributes = []// ['1-0', '2-1'],//历史动态列 当前包含的阶段和版本-前为阶段,2后为版本
      this.pageStatus.flag = 'HISTORY'
      let _subjectRowData = {} // 科目行数据
      let _contractRowData = {} // 规划行数据
      response.data.map(item => {
        _subjectRowData = {}
        _subjectRowData.dataType = '1'
        _subjectRowData._expanded = true
        _subjectRowData._show = true
        _subjectRowData.subjectCode = item.code
        _subjectRowData.subjectName = item.name
        // 多个历史版本列数据的展示
        _subjectRowData.attributes = item.attributes

        //处理默认展开级别
        _subjectRowData._level = _subjectRowData.subjectCode ? _subjectRowData.subjectCode.split('.').length : 0
        _subjectRowData._expanded = calc.Mul(ifNull(_subjectRowData._level, 0), 1) < this.pageStatus.expandedLevel + 1
        _subjectRowData._show = _subjectRowData._show && (calc.Mul(ifNull(_subjectRowData._level, 0), 1) < this.pageStatus.expandedLevel + 2)



        // 只有运算一次，同一个科目数都一样
        if (item.attributes && this.pageStatus.HISTORY_attributes.length === 0) {
          for (var key in item.attributes) {
            if (item.attributes.hasOwnProperty(key) && _this.pageStatus.HISTORY_attributes.indexOf(key) < 0) {
              _this.pageStatus.HISTORY_attributes.push(key)

              _subjectRowData[key] = key // 追加行属性 item[]
            }
          }

          // 按阶段和版本由小到大排序["2_0","2_0.1"]
          try {
            // 排 阶段
            _this.pageStatus.HISTORY_attributes.sort((stageVersion1, stageVersion2) => {
              return (stageVersion1.split('_')[0]) * 1 > (stageVersion2.split('_')[0]) * 1
            })
            // 排 版本
            _this.pageStatus.HISTORY_attributes.sort((stageVersion1, stageVersion2) => {
              return (stageVersion1.split('_')[1]) * 1 > (stageVersion2.split('_')[1]) * 1
            })
          } catch (error) {
            console.log('按阶段的版本有小到大排序' + error.message)
          }
        }
        // 插入科目行
        this.pageModelList.push(_subjectRowData)

        // 判断科目下是否有规划，并添加规划行
        if (item.contractPlanModelList) {
          item.contractPlanModelList.map(contractItem => {
            _contractRowData = {}
            _contractRowData = deepCopy(_subjectRowData)
            _contractRowData.dataType = '2'
            _contractRowData.contractName = contractItem.name
            _contractRowData.attributes = contractItem.attributes
            _contractRowData._show = _contractRowData.subjectCode.split('.').length === this.pageStatus.expandedLevel //合约不显示 //合约不显示
            // 插入规划行
            this.pageModelList.push(_contractRowData)
          })
        }
      })
    },
    //初始化数据(按合约)
    initCPTableData (response) {
      debugger
      let _this = this
      _this.pageModelList_CP = []
      if (response && response.data && response.data.contractPlanModelList) {
        response.data.contractPlanModelList.map(item => {
          let _contranctPlan = {
            name: item.name,
            level1Name: item.level1Name,
            level2Name: item.level2Name,
            code: '',
            contractPlanAmountIncludeTax: 0,
            contractPlanAmountExcludeTax: 0,
            tax: 0,
            taxRate: 0,
            reservedAmountIncludeTax: 0,
            reservedAmountExcludeTax: 0,
            apportionmentRuleCode: null,
            responsibleDeptCode: null,
            reservedChangeRate: item.reservedChangeRate,
            subjectModel: {},
            _show: true
          }
          _this.pageModelList_CP.push(_contranctPlan)

          if (item.tccpModelList && item.tccpModelList.length > 0) {
            item.tccpModelList.map(subjectItem => {
              let _subject = {
                name: '',//_contranctPlan.name,
                level1Name: '',// _contranctPlan.level1Name,
                level2Name: '',// _contranctPlan.level2Name,
                code: subjectItem.subjectModel.code,
                subjectName: subjectItem.subjectModel.name,
                contractPlanAmountIncludeTax: subjectItem.contractPlanAmountIncludeTax,
                contractPlanAmountExcludeTax: subjectItem.contractPlanAmountExcludeTax,
                tax: subjectItem.tax,
                taxRate: calc.Mul(ifNull(subjectItem.taxRate, 0), 100),
                reservedAmountIncludeTax: subjectItem.reservedAmountIncludeTax,
                reservedAmountExcludeTax: subjectItem.reservedAmountExcludeTax,
                apportionmentRuleCode: subjectItem.subjectModel.apportionmentRuleCode,
                responsibleDeptCode: subjectItem.subjectModel.responsibleDeptCode,
                reservedChangeRate: _contranctPlan.reservedChangeRate,
                subjectModel: subjectItem.subjectModel,
                _show: true
              }
              _this.pageModelList_CP.push(_subject)
            })

          }
        })
      }
    },
    // 初始化数据(按科目)
    initTableData (response, isCompare = false) {
      this.pageModelList = []
      if (!response.data) {
        this.$showNormalError('没有可用数据')
        return
      }
      if (isCompare) {
        console.log('历史版本对比')
        this.initHistoryCompareData(response)
        return
      }
      let _this = this

      this.detailModel.stageVersion = response.data.stageVersion// 版本
      this.detailModel.stageId = response.data.stageId || 1 // 当前阶段
      this.detailModel.ownerId = response.data.ownerId || '' // 所属id
      this.detailModel.canImportOrNot = response.data.canImportOrNot // 能否引入 

      this.getCommonInfoHistory(this.page.accountingObjectId, this.detailModel.stageId, this.detailModel.stageVersion)

      if (!response.data.subjectModelList) {
        this.$showNormalError('没有可用数据')
        return
      }
      response.data.subjectModelList.map(item => {
        // 遍历科目列表，咱开科目和科目下的规划
        // if (item.isLeaf) {
        let _rowSubjectData = deepCopy(this.pageModel)
        _rowSubjectData.dataType = COSTENUM.contractPlanType.SUBJECT
        _rowSubjectData.subjectId = item.id
        _rowSubjectData.subjectCode = item.code
        _rowSubjectData.subjectName = item.name
        _rowSubjectData.responsibleDeptCode = item.responsibleDeptCode
        _rowSubjectData.splitRate = 100
        _rowSubjectData.apportionmentRuleCode = item.apportionmentRuleCode
        _rowSubjectData.subjectAmountIncludeTax = item.subjectAmountIncludeTax ? (item.subjectAmountIncludeTax / 1) : 0// 科目编制金额(含税)
        _rowSubjectData.subjectAmountExcludeTax = item.subjectAmountExcludeTax ? (item.subjectAmountExcludeTax / 1) : 0 // 科目编制金额(不含税)
        _rowSubjectData.reserveCostType = item.reserveCostType // 预备非类型('1'可以挂规划,'0'不可以)
        _rowSubjectData.isLeaf = item.isLeaf

        _rowSubjectData.taxRate = calc.Mul(ifNull(item.taxRate, 0), 100)
        // 辅助字段
        _rowSubjectData._expanded = true
        _rowSubjectData._show = !(item.code.indexOf(this.page.specialNode) > -1) // .99不显示

        //处理默认展开级别
        _rowSubjectData._level = _rowSubjectData.subjectCode ? _rowSubjectData.subjectCode.split('.').length : 0
        _rowSubjectData._expanded = calc.Mul(ifNull(_rowSubjectData._level, 0), 1) < this.pageStatus.expandedLevel + 1
        _rowSubjectData._show = _rowSubjectData._show && (calc.Mul(ifNull(_rowSubjectData._level, 0), 1) < this.pageStatus.expandedLevel + 2)



        // 插入科目行
        _this.pageModelList.push(_rowSubjectData)
        // 科目规划行
        if (item.targetCostContractPlanModelList &&
          item.isLeaf // 叶子
          && item.code.indexOf(this.page.specialNode) < 0 // 非.99
        ) {
          item.targetCostContractPlanModelList.map(item1 => {
            let _rowContractPlanData = deepCopy(_rowSubjectData)
            _rowContractPlanData._show = _rowContractPlanData.subjectCode.split('.').length === this.pageStatus.expandedLevel

            if (item1.contractPlanModel) {
              _rowContractPlanData.dataType = COSTENUM.contractPlanType.CONTRACTPlan

              // 继承科目的金额，方便运算
              _rowContractPlanData.subjectAmountIncludeTax = item.subjectAmountIncludeTax / 1 // 科目编制金额(含税)
              _rowContractPlanData.subjectAmountExcludeTax = item.subjectAmountExcludeTax / 1 // 科目编制金额(不含税)

              _rowContractPlanData.splitRate = item1.splitRate / 1

              _rowContractPlanData.contractPlanAmountIncludeTax = ifNull(item1.contractPlanAmountIncludeTax, 0) / 1
              _rowContractPlanData.contractPlanAmountExcludeTax = ifNull(item1.contractPlanAmountExcludeTax, 0) / 1 //(calc.Div(_rowContractPlanData.contractPlanAmountIncludeTax, (1 + _rowContractPlanData.taxRate)).toFixed(2)) / 1

              _rowContractPlanData.tax = (calc.Sub(_rowContractPlanData.contractPlanAmountIncludeTax, _rowContractPlanData.contractPlanAmountExcludeTax).toFixed(2)) / 1
              _rowContractPlanData.reservedChangeRate = item1.contractPlanModel.reservedChangeRate / 1
              _rowContractPlanData.reservedAmountIncludeTax = item1.reservedAmountIncludeTax / 1
              _rowContractPlanData.reservedAmountExcludeTax = (calc.Mul(_rowContractPlanData.reservedAmountIncludeTax, _rowContractPlanData.reservedChangeRate).toFixed(2)) / 1
              if (item1.contractPlanModel) {
                _rowContractPlanData.contractPlanName = item1.contractPlanModel.name
                _rowContractPlanData.level1Name = item1.contractPlanModel.level1Name
                _rowContractPlanData.level2Name = item1.contractPlanModel.level2Name
              }
              _rowContractPlanData.contractPlanModel = item1.contractPlanModel
              _rowContractPlanData.taxRate = calc.Mul(ifNull(item1.taxRate, 0), 100)
              // 插入科目规划行
              _this.pageModelList.push(_rowContractPlanData)
            }
          })
        }
        // }
      })
      if (this.pageModelList && this.pageModelList.length === 0) {
        this.$showNormalError('没有可用数据')
        return
      }
      this.calcSubjectData()
    },
    // 获取基本信息
    getCommonInfoHistory (accountingObjectId, stageId, stageVersion) {
      LoadingUtil.showLoading()
      let paramS = {}
      paramS = { accountObjectId: accountingObjectId, stageId: stageId, stageVersion: stageVersion }
      getAccountingObjectCommonInfo(paramS)
        .then(response => {
          LoadingUtil.hideLoading()
          this.initCommonInfoData(response)
        })
        .catch(error => {
          console.log(error)
          LoadingUtil.hideLoading()
          this.$showError(error.message ? error.message : 'msg_system_error')
        })
    },
    // 计算科目数据（汇总合约规划行）
    calcSubjectData (index, rowData) {
      let _subjectList = []
      if (index && rowData) {
        console.log('汇总' + rowData.subjectName)
        _subjectList[rowData.subjectCode] = rowData

        _subjectList[rowData.subjectCode]._sumContractPlanAmountIncludeTax = 0
        _subjectList[rowData.subjectCode]._sumSplitRate = 0
        _subjectList[rowData.subjectCode]._sumContractPlanAmountExcludeTax = 0
        _subjectList[rowData.subjectCode]._sumTax = 0
        _subjectList[rowData.subjectCode]._sumreservedAmountIncludeTax = 0
        _subjectList[rowData.subjectCode]._sumreservedAmountExcludeTax = 0
      } else {
        console.log('汇总全部')
        this.pageModelList.map(item => {
          if (item.dataType === COSTENUM.contractPlanType.SUBJECT) {
            _subjectList[item.subjectCode] = item
            _subjectList[item.subjectCode]._sumContractPlanAmountIncludeTax = 0
            _subjectList[item.subjectCode]._sumSplitRate = 0
            _subjectList[item.subjectCode]._sumContractPlanAmountExcludeTax = 0
            _subjectList[item.subjectCode]._sumTax = 0
            _subjectList[item.subjectCode]._sumreservedAmountIncludeTax = 0
            _subjectList[item.subjectCode]._sumreservedAmountExcludeTax = 0
          }
        })
      }
      this.pageModelList.map(item => {
        if (item.dataType === COSTENUM.contractPlanType.CONTRACTPlan) {
          if (_subjectList[item.subjectCode]) {
            _subjectList[item.subjectCode]._sumContractPlanAmountIncludeTax = calc.Add(_subjectList[item.subjectCode]._sumContractPlanAmountIncludeTax, item.contractPlanAmountIncludeTax)
            _subjectList[item.subjectCode]._sumSplitRate = calc.Add(_subjectList[item.subjectCode]._sumSplitRate, item.splitRate)
            _subjectList[item.subjectCode]._sumContractPlanAmountExcludeTax = calc.Add(_subjectList[item.subjectCode]._sumContractPlanAmountExcludeTax, item.contractPlanAmountExcludeTax)
            _subjectList[item.subjectCode]._sumTax = calc.Add(_subjectList[item.subjectCode]._sumTax, item.tax)
            _subjectList[item.subjectCode]._sumreservedAmountIncludeTax = calc.Add(_subjectList[item.subjectCode]._sumreservedAmountIncludeTax, item.reservedAmountIncludeTax)
            _subjectList[item.subjectCode]._sumreservedAmountExcludeTax = calc.Add(_subjectList[item.subjectCode]._sumreservedAmountExcludeTax, item.reservedAmountExcludeTax)
          }
        }
      })
      // console.info(_subjectList)
      this.pageModelList.map(item => {
        if (item.dataType === COSTENUM.contractPlanType.SUBJECT && _subjectList[item.subjectCode]) {
          // console.info(_subjectList[item.subjectCode])
          if (_subjectList[item.subjectCode]) {
            item._sumContractPlanAmountIncludeTax = _subjectList[item.subjectCode]._sumContractPlanAmountIncludeTax * 1
            item._sumSplitRate = _subjectList[item.subjectCode]._sumSplitRate * 1
            item._sumContractPlanAmountExcludeTax = _subjectList[item.subjectCode]._sumContractPlanAmountExcludeTax * 1
            item._sumTax = _subjectList[item.subjectCode]._sumTax * 1
            item._sumreservedAmountIncludeTax = _subjectList[item.subjectCode]._sumreservedAmountIncludeTax * 1
            item._sumreservedAmountExcludeTax = _subjectList[item.subjectCode]._sumreservedAmountExcludeTax * 1
          }
        }
      })
    },
    // 计算行数据(成本科目比例splitRate，合约规划金额contractPlanAmountIncludeTax，预估变更比例reservedChangeRate)
    calcRowData (rowData, fieldType) {
      let _rowData = JSON.parse(JSON.stringify(rowData))
      fieldType = fieldType.toString()
      switch (fieldType) {
        case 'splitRate':
          _rowData.contractPlanAmountIncludeTax = calc.Mul(_rowData.subjectAmountIncludeTax, _rowData.splitRate / 100)// 合约规划金额(含税)
          break
        case 'contractPlanAmountIncludeTax':
          _rowData.splitRate = (calc.Sub(_rowData.contractPlanAmountIncludeTax, _rowData.subjectAmountIncludeTax) * 100).toFixed(2)
          break
        case 'reservedChangeRate':
          break
      }
      _rowData.contractPlanAmountExcludeTax = calc.Div(_rowData.contractPlanAmountIncludeTax, (1 + _rowData.taxRate)).toFixed(2)// 合约规划金额(不含税)
      _rowData.tax = calc.Sub(_rowData.contractPlanAmountIncludeTax - _rowData.contractPlanAmountExcludeTax).toFixed(2) // 税额

      _rowData.reservedAmountIncludeTax = calc.Mul(_rowData.contractPlanAmountIncludeTax, _rowData.reservedChangeRate) // 预估变更金额（含税）
      _rowData.reservedAmountExcludeTax = calc.Mul(_rowData.contractPlanAmountIncludeTax, _rowData.reservedChangeRate)// 预估变更金额（不含税）

      this.pageModelList = _rowData

      this.calcSubjectData(null, _rowData)// 汇总科目
    },
    // 初始化基本信息
    initCommonInfoData (response) {

      let _this = this
      if (!response.data) {
        this.$showNormalError('没有可用数据')
        return
      }
      this.detailModel.stageId = response.data.stageId ? parseInt(response.data.stageId) : 0
      this.detailModel.canSaleAcreage = response.data.totalSellArea
      this.detailModel.targetCostContainTax = response.data.targetCostIncludeTax
      this.detailModel.editPerson = response.data.maker
      this.detailModel.buildingAcreage = response.data.totalBuildingArea
      this.detailModel.targetCostWithoutTax = response.data.targetCostExcludeTax
      this.detailModel.eidtDate = response.data.makeDate
      this.detailModel.canSalePart = response.data.saleSmCostIncludeTax
      this.detailModel.adjustLevel = null
      this.detailModel.flowStatus = response.data.approvalStatusName || ''
      this.detailModel.buildingAcreagePart = response.data.constructSmCostIncludeTax
      this.detailModel.stageVersion = response.data.targetCostVersion

      if (this.page.selectNode) this.page.selectNode.text = response.data.name
      // this.pageModelList.push({
      //     constructType: '',
      //     name: _this.page.selectNode.text,
      //     data: []
      // })

      console.info(response)
    },
    // 计算汇总数据
    calcTotalData () {
    },
    // 选项卡点击事件
    tabClick (param) {
      this.pageStatus.hanldeTabIndex = param.index
      if (parseInt(param.index) === this.pageModelList.length - 1) {
        this.calcTotalData()
      }
    },
    // 获取子节点
    getParentChild (parentCode) {
      const _this = this
      let _ChildRow = []
      _ChildRow = _this.pageModelList.filter(item => {
        return item.subjectCode && item.subjectCode.indexOf(parentCode + '.') > -1 && item.subjectCode.replace(parentCode + '.').indexOf('.') === -1
      })
      return _ChildRow
    },
    // 获取级别
    getLevel (parentCode) {
      return parentCode.split('.').length
    },
    // 展开收起
    handleExpandClick (subjectCode) {
      let parentExpanded
      this.pageModelList.map(item => {
        if (item.subjectCode === subjectCode && item.dataType.toString() === '1') {
          item._expanded = !item._expanded
          parentExpanded = item._expanded
        }
        if (item.subjectCode.indexOf(subjectCode) > -1 && item.subjectCode !== subjectCode) {
          item._show = parentExpanded
          item._expanded = parentExpanded
        }
        if (item.subjectCode === subjectCode && item.dataType.toString() === '2') {
          item._show = parentExpanded
        }
      })
    },
    // 行显示
    showDialogRow (row) {
      // 行隐藏
      const show = row.row._show
      return show ? 'animation:treeTableShow 1s;-webkit-animation:treeTableShow 1s;' : 'display:none;'
    },
    showRow (row) {
      // 行隐藏
      const show = row.row._show
      let background = (row.row.dataType === '1' && row.row.isLeaf) ? 'font-weight: bold;' : ''
      return show ? 'animation:treeTableShow 1s;-webkit-animation:treeTableShow 1s;' + background : 'display:none;' + background
    },
    // 阶段步骤点击
    handleStageClick (stageId) {
      if (this.page.selectNode && this.page.selectNode.type && this.page.selectNode.type !== "acc_obj") return
      let _this = this
      console.log(stageId)
      if (this.page.selectNode) {
        if (stageId <= this.page.stageId) {
          this.page.selectStageId = stageId
          this.page.stageVersion = null
          this.getCommonInfo({ id: _this.page.accountingObjectId, stageId: stageId, stageVersion: null }, function () {
            _this.handleTreeNodeClick({ id: _this.page.selectNode.id, stageId: stageId }, stageId)
          })

        } else {
          this.$showNormalError('当前点击阶段无效')
        }
      }
    },
    // 导出
    handleExport () {
      COSTBUSINESS.download(process.env.COST_API + '/targetCostContractPlan/defineStageVersion/export?editType=0&accountingObjectId=' + this.page.selectNode.id + '&stageId=' + this.detailModel.stageId + '&stageVersion=' + this.detailModel.stageVersion)
    },
    // 搜索历史
    searchDialogResult () {
      let _this = this
      let _endDate = null
      if (_this.page.dialog.queryModel.endDate) {
        _endDate = new Date((_this.page.dialog.queryModel.endDate / 1000 + 86400) * 1000)
      }
      if (_this.page.dialog.queryModel.stageId || _this.page.dialog.queryModel.startDate || _endDate) {

        this.page.dialog.tableData.map(item => {
          if (_this.page.dialog.queryModel.stageId
            && _this.page.dialog.queryModel.startDate
            && _endDate) {
            if (ifNull(item.stageId).indexOf(_this.page.dialog.queryModel.stageId) > -1
              && new Date(item.updatedDate) >= new Date(_this.page.dialog.queryModel.startDate)
              && new Date(item.updatedDate) <= _endDate) {
              item._show = true
            } else {
              item._show = false
            }
          } else if (_this.page.dialog.queryModel.stageId
            && _this.page.dialog.queryModel.startDate) {
            if (ifNull(item.stageId).indexOf(_this.page.dialog.queryModel.stageId) > -1
              && new Date(item.updatedDate) >= _endDate) {
              item._show = true
            } else {
              item._show = false
            }
          } else if (_this.page.dialog.queryModel.startDate
            && _this.page.dialog.queryModel.endDate) {
            if (new Date(item.updatedDate) >= new Date(_this.page.dialog.queryModel.startDate)
              && new Date(item.updatedDate) <= _endDate) {
              item._show = true
            } else {
              item._show = false
            }
          } else if (_this.page.dialog.queryModel.stageId
            && _this.page.dialog.queryModel.endDate) {
            if (ifNull(item.stageId).indexOf(_this.page.dialog.queryModel.stageId) > -1
              && new Date(item.updatedDate) <= _endDate) {
              item._show = true
            } else {
              item._show = false
            }
          } else if (_this.page.dialog.queryModel.stageId) {
            if (ifNull(item.stageId).indexOf(_this.page.dialog.queryModel.stageId) > -1) {
              item._show = true
            } else {
              item._show = false
            }
          } else if (_this.page.dialog.queryModel.startDate) {
            if (new Date(item.updatedDate) >= new Date(_this.page.dialog.queryModel.startDate)) {
              item._show = true
            } else {
              item._show = false
            }

          } else if (_this.page.dialog.queryModel.endDate) {
            if (new Date(item.updatedDate) <= _endDate) {
              item._show = true
            } else {
              item._show = false
            }
          } else {
            item._show = false
          }
        })

      } else {
        this.page.dialog.tableData.map(item => {
          item._show = true
        })
      }
    },
    // 历史列表选中事件
    handleDialogSelectionChange (selection) {
      this.page.dialog.selectRows = selection
    },
    // 对比选中历史
    compareDialogResult () {
      debugger
      this.pageStatus.HISTORY_attributes = []
      this.page.dialog.dialogSelect = false

      // 单条查看
      if (this.page.dialog.selectRows.length === 1) {
        this.pageStatus.flag = "PUTONG"
        this.handleSelectOtherProjectTemplate(0, this.page.dialog.selectRows[0])
        return
      }

      // 多条对比
      let ids = this.page.dialog.selectRows.map(item => { return item.id }).join(',')
      LoadingUtil.showLoading()
      getTargetCostContractPlanVersionsByIds({ ids: ids })
        .then(response => {
          this.initTableData(response, true)
          LoadingUtil.hideLoading()
        })
        .catch(error => {
          console.log(error)
          LoadingUtil.hideLoading()
          this.$showError(error.message ? error.message : 'msg_system_error')
        })
    },
    // 获取历史记录列表（无分页）
    getHistoryList () {
      LoadingUtil.showLoading()
      let _stageId = this.page.selectStageId ? this.page.selectStageId.toString() : (this.page.stageId ? this.page.stageId.toString() : '')
      getTargetCostContractPlanHistory({ accountingObjectId: this.page.selectNode.id, stageId: _stageId })
        .then(response => {
          LoadingUtil.hideLoading()
          response.data.map(item => {
            item._show = true
          })
          let _stageId = this.detailModel.selectStageId ? this.page.selectStageId.toString() : (this.page.stageId ? this.page.stageId.toString() : '')
          let _stageVersion = this.detailModel.stageVersion ? this.detailModel.stageVersion.toString() : this.page.stageVersion.toString()

          this.page.dialog.tableData = response.data.filter(item => {
            //历史
            //debugger
            // 相同阶段，小于当前版本 或者 不同阶段，小于当前阶段
            return (item.stageId === _stageId && calc.Mul(ifNull(item.stageVersion, 0), 1) < calc.Mul(ifNull(_stageVersion, 0), 1))
              || (item.stageId !== _stageId && calc.Mul(ifNull(item.stageId, 0), 1) < calc.Mul(ifNull(_stageId, 0), 1))
          })
        })
        .catch(error => {
          console.log(error)
          LoadingUtil.hideLoading()
          this.$showError(error.message ? error.message : 'msg_system_error')
        })
    },
    // 获取基本信息
    getCommonInfo (node, callbBack) {
      LoadingUtil.showLoading()
      let paramS = {}
      if (this.page.stageId) {
        paramS = { accountObjectId: node.id, stageId: node.stageId ? node.stageId : this.page.stageId, stageVersion: this.page.stageVersion }
      } else {
        paramS = { accountObjectId: node.id }
      }
      getAccountingObjectCommonInfo(paramS)
        .then(response => {
          LoadingUtil.hideLoading()
          this.page.selectNode = node
          this.initCommonInfoData(response)
          if (callbBack) callbBack()
        })
        .catch(error => {
          console.log(error)
          LoadingUtil.hideLoading()
          this.$showError(error.message ? error.message : 'msg_system_error')
        })
    },
    // 查看历史
    handleViewHistory () {
      this.page.dialog.dialogSelect = true
      this.getHistoryList()
    },
    // 历史记录点击
    handleSelectOtherProjectTemplate (index, rowData) {
      this.page.dialog.dialogSelect = false
      this.handleClickHistoryRow(index, rowData)
    },
    // 点击历史版本
    handleClickHistoryRow (index, rowData) {
      LoadingUtil.showLoading()
      getTargetCostContractPlanById({ id: rowData.id })
        .then(response => {
          LoadingUtil.hideLoading()
          this.initTableData(response)
        })
        .catch(error => {
          console.log(error)
          LoadingUtil.hideLoading()
          this.$showError(error.message ? error.message : 'msg_system_error')
        })
    },
    // 获取明细
    getDetail (accountingObjectId, stageId, stageVersion, viewType = 'SB') {
      if (viewType === 'SB') {
        return getTargetCostContractPlanByAccountingObject({ accountingObjectId: accountingObjectId, stageId: stageId, stageVersion: stageVersion })
      } else {
        return getTargetCostContractPlanByContract({ accountingObjectId: accountingObjectId, stageId: stageId, stageVersion: stageVersion })
      }

    },
    // 点击节点查询
    handleTreeNodeClick (node, stageId) {
      LoadingUtil.showLoading()
      let _stageId = stageId || (node.attr ? node.attr["stageId"] : this.detailModel.stageId)
      if (_stageId.toString() === '0') {
        _stageId = null
      }
      if (!_stageId) _stageId = this.page.stageId
      let _stageVersion = this.page.stageVersion

      //按科目
      this.getDetail(node.id, _stageId, _stageVersion)
        .then(response => {
          LoadingUtil.hideLoading()
          this.initTableData(response)
        })
        .catch(error => {
          console.log(error)
          LoadingUtil.hideLoading()
          this.$showError(error.message ? error.message : 'msg_system_error')
        })

      //按合约
      this.getDetail(node.id, _stageId, _stageVersion, 'CP')
        .then(response => {
          LoadingUtil.hideLoading()
          this.initCPTableData(response)
        })
        .catch(error => {
          console.log(error)
          LoadingUtil.hideLoading()
          this.$showError(error.message ? error.message : 'msg_system_error')
        })

    },
    // 树节点点击事件
    handleNodeClick (data) {
      console.log(data)
      // 成本分期
      if (data.type === COSTENUM.projectTreeType.TREE_NODE_ACC_OBJ) {
        this.page.accountingObjectId = data.id
        this.getCommonInfo(data)
        this.handleTreeNodeClick(data)
      }
    },
    // 科目编码，科目名称查询
    handleSearch () {
      if (this.pageStatus.tableTabsValue === 'BYCP') {
        this.handleSearchBYCP()
      } else if (this.pageStatus.tableTabsValue === 'BYSB') {
        this.handleSearchBYSB()
      }
    },
    handleSearchBYCP () {
      let _this = this
      LoadingUtil.showLoading()
      if (!this.queryModel.subjectCodeOrName) {
        this.pageModelList_CP.map(item => {
          item._show = true
        })
      } else {
        if (this.queryModel.subjectCodeOrName) this.queryModel.subjectCodeOrName = this.queryModel.subjectCodeOrName.trim()

        let filterData = this.pageModelList_CP
          .filter(function (item) {
            return item.name.indexOf(_this.queryModel.subjectCodeOrName) > -1
          }
          )

        if (filterData.length === 0) {
          LoadingUtil.hideLoading()
          this.pageModelList_CP.map(item => {
            item._show = false
          })
          this.$showNormalError('没有符合条件的数据')
          return
        }

        this.pageModelList_CP.map(item => {
          if (item.name.indexOf(_this.queryModel.subjectCodeOrName) > -1) {
            item._show = true
          } else {
            item._show = false
          }
        })
      }
      LoadingUtil.hideLoading()
    },
    handleSearchBYSB () {
      let _this = this
      LoadingUtil.showLoading()
      if (!this.queryModel.subjectCodeOrName) {
        this.pageModelList.map(item => {
          item._show = !COSTBUSINESS.checkIsSpecialCode({ 'nodeSource': item.nodeSource, 'code': item.subjectCode }) // .99不显示
        })
      } else {
        if (this.queryModel.subjectCodeOrName) this.queryModel.subjectCodeOrName = this.queryModel.subjectCodeOrName.trim()

        let filterData = this.pageModelList
          .filter(function (item) {
            return item.subjectCode.indexOf(_this.queryModel.subjectCodeOrName) > -1 ||
              item.subjectName.indexOf(_this.queryModel.subjectCodeOrName) > -1
          }
          )

        if (filterData.length === 0) {
          LoadingUtil.hideLoading()
          this.pageModelList.map(item => {
            item._show = false
          })
          this.$showNormalError('没有符合条件的数据')
          return
        }

        this.pageModelList.map(item => {
          if (item.subjectCode.indexOf(_this.queryModel.subjectCodeOrName) > -1 ||
            item.subjectName.indexOf(_this.queryModel.subjectCodeOrName) > -1
          ) {
            item._show = !COSTBUSINESS.checkIsSpecialCode({ 'nodeSource': item.nodeSource, 'code': item.subjectCode }) // .99不显示
          } else {
            item._show = false
          }
        })
      }
      LoadingUtil.hideLoading()
    }
  },
  mounted () {
    console.log(COSTBUSINESS.getAccountingTargetType({ name: '一期' }))
    this.page.accountingObjectId = this.$route.query.accountingObjectId ? this.$route.query.accountingObjectId : '0'
    this.page.accountingObjectName = this.$route.query.accountingObjectName ? this.$route.query.accountingObjectName : ''
    this.page.stageId = this.$route.query.stageId ? this.$route.query.stageId : '0'
    this.page.stageVersion = this.$route.query.stageVersion ? this.$route.query.stageVersion : '0'
    if (!this.selectNode) this.page.selectNode = {}
    this.page.selectNode.id = this.page.accountingObjectId
    this.page.selectNode.stageId = this.page.stageId
    this.page.selectNode.text = this.page.accountingObjectName
    this.page.selectNode.type = COSTENUM.projectTreeType.TREE_NODE_ACC_OBJ
    // this.handleNodeClick(this.page.selectNode)

    // 颜色码
    for (let i = 0; i < 100; i++) {
      let _color = ''
      let standardColor = COSTBUSINESS.colorPool()
      if (i < standardColor.length) {
        _color = standardColor[i]
      } else {
        _color = '#' + ('00000' + (Math.random() * 0x1000000 << 0).toString(16)).substr(-6)
      }
      this.page.historyColorArray.push(_color)
    }

    // 字典
    let allDICTIONARY = getLocalItem("DICTIONARY")
    allDICTIONARY = JSON.parse(allDICTIONARY)
    allDICTIONARY['cost_stage_id'].map(item => {
      this.selectData.cost_stage_id[item.dictValue] = item.dictLabelCn
    })
    allDICTIONARY['cost_subject_apportionment_rule_code'].map(item => {
      this.selectData.cost_subject_apportionment_rule_code[item.dictValue] = item.dictLabelCn
    })
    allDICTIONARY['cost_subject_responsible_dept_code'].map(item => {
      this.selectData.cost_subject_responsible_dept_code[item.dictValue] = item.dictLabelCn
    })
  },
  watch: {
    'page.selectNode': function (val) {
      if (val && val.attr && val.attr['stageId']) val.stageId = parseInt(val.attr['stageId'])
      this.handleNodeClick(val)
    }
  }
}
</script>
<style scoped>
.targetCostQuery {
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

.detailLabel {
  float: left;
  width: 170px;
  text-align: right;
}
.detailValue {
  float: left;
  text-align: left;
}
.subjectCodeExpand {
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  margin-right: 0px;
}
</style>

   
