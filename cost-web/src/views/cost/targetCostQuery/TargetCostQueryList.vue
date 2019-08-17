<template>
  <div class="app-container targetCostQuery">
    <el-row style="text-align:right;margin:5px;margin-right:0"
            <el-col
            :span="accountingTargetTreeSelectorSpan"
            style="margin-top:10px;">
      <AccountingTargetTreeSelector v-model="page.selectNode"
                                    :cHeight="accountingTargetTreeSelectorHeight" />
      </el-col>
      <el-col :span="24-accountingTargetTreeSelectorSpan"
              :style="{'padding-left':'10px','margin-top':'10px'}">
        <el-steps :active="detailModel.stageId">
          <el-step v-for="(item,index) in page.stepDatas"
                   :description="item.description"
                   :icon="item.icon"
                   :title="item.name"
                   :key="index"
                   :style="{'cursor':page.selectNode?'pointer':'normal'}"
                   @click.native="handleStageClick(item.id)"></el-step>
        </el-steps>
        <el-collapse>
          <el-collapse-item>
            <template slot="title">
              <strong style="padding-left:10px">明细信息({{(page.selectNode && page.selectNode.text)? ''+(page.selectNode.text || ''):page.accountingObjectName+''}})</strong>
              <i class="header-icon el-icon-info"></i>
            </template>
            <div style="line-height:30px;padding-top:10px;">
              <el-row>
                <el-col :span="8"
                        :offset="1">
                  <div class="detailLabel">可售面积(㎡)：</div>
                  <div class="detailValue">{{detailModel.canSaleAcreage | NumFormat}}</div>
                </el-col>
                <el-col :span="8">
                  <div class="detailLabel">目标成本(含税)(元)：</div>
                  <div class="detailValue">{{detailModel.targetCostContainTax | NumFormat}}</div>
                </el-col>
                <el-col :span="7">
                  <div class="detailLabel">编制人：</div>
                  <div class="detailValue">{{detailModel.editPerson}}</div>
                </el-col>
                <el-col :span="8"
                        :offset="1">
                  <div class="detailLabel">建筑面积(㎡)：</div>
                  <div class="detailValue">{{detailModel.buildingAcreage | NumFormat}}</div>
                </el-col>
                <el-col :span="8">
                  <div class="detailLabel">目标成本(不含税)(元)：</div>
                  <div class="detailValue">{{detailModel.targetCostWithoutTax | NumFormat}}</div>
                </el-col>
                <el-col :span="7">
                  <div class="detailLabel">编制日期：</div>
                  <div class="detailValue">{{detailModel.eidtDate | dateFormat('yyyy-MM-dd')}}</div>
                </el-col>
                <el-col :span="8"
                        :offset="1">
                  <div class="detailLabel">可售单方(元/㎡)：</div>
                  <div class="detailValue">{{detailModel.canSalePart | NumFormat}}</div>
                </el-col>
                <el-col :span="8">
                  <!-- 适配等级：{{detailModel.adjustLevel}} -->&nbsp;
                </el-col>
                <el-col :span="7">
                  <div class="detailLabel">审批状态：</div>
                  <div class="detailValue">{{detailModel.flowStatus}}</div>
                </el-col>
                <el-col :span="8"
                        :offset="1">
                  <div class="detailLabel">建面单方(元/㎡)：</div>
                  <div class="detailValue">{{detailModel.buildingAcreagePart | NumFormat}}</div>
                </el-col>
                <el-col :span="8">
                  &nbsp;
                </el-col>
                <el-col :span="7">
                  <div class="detailLabel">版本：</div>
                  <div class="detailValue">
                    <div style="float:left;min-width:30px;text-align:left;">
                      {{detailModel.stageId?selectData.cost_stage_id[detailModel.stageId.toString()]:''}}
                    </div>
                    <div style="float:left;width:50px;text-align:left;">{{detailModel.stageVersion |Version}}</div>
                  </div>
                </el-col>
              </el-row>
            </div>
          </el-collapse-item>
        </el-collapse>

        <el-form :inline="true"
                 size="mini"
                 class="demo-form-inline">
          <el-row style="margin-bottom:10px">
            <!-- 科目代码或名称 -->
            <el-input v-model='queryModel.subjectCodeOrName'
                      :placeholder="'科目编码或名称'"
                      style="width:200px;padding-right:5px;"
                      show-overflow-tooltip
                      :maxlength="20"
                      :disabled="pageModelList.length === 0"></el-input>

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
                       v-if="pageModelList.length !== 0 && !pageStatus.ISHISTORY">{{$l('lbl_standared_subject_export')}}</el-button>

            <!-- 历史记录 -->
            <el-button size="mini"
                       class="special-btn"
                       type='primary'
                       @click='handleViewHistory'
                       :disabled="pageModelList.length === 0">{{$l('lbl_cost_query_history')}}</el-button>

            <el-button size="mini"
                       class="ordinary-btn"
                       :icon="accountingTargetTreeSelectorIsExpand?'el-icon-d-arrow-left':'el-icon-d-arrow-right'"
                       type='primary'
                       @click='expandAccountingTargetTreeSelector'>{{accountingTargetTreeSelectorIsExpand?'收起组织':'展开组织'}}</el-button>

            <el-button size="mini"
                       class="ordinary-btn"
                       @click='handleBack'>{{$l("btn_back")}}</el-button>

          </el-row>

        </el-form>

        <!-- 普通带业态PUTONG -->
        <!-- 分期FENQI -->
        <el-row style="margin-bottom:10px;border:none"
                v-if="pageModelList.length !== 0 && (pageStatus.flag === 'PUTONG' || pageStatus.flag === 'FENQI')  && !pageStatus.ISHISTORY">
          <el-tabs type="border-card"
                   @tab-click="tabClick">
            <el-tab-pane v-for="(stadge,index) in pageModelList"
                         :key="index">
              <span slot="label">
                <i class="el-icon-document"></i> {{stadge.name}}</span>
              <div>
                <!-- 编制表格 -->
                <el-table :data="stadge.data"
                          :row-style="showRow"
                          align="left"
                          stripe
                          size="small"
                          border
                          :height="tHeight"
                          tooltip-effect="dark"
                          style="width: 100%">
                  <!-- 成本科目级别 -->
                  <el-table-column prop="subject.level"
                                   :label="$l('lbl_standared_subject_level')"
                                   width="100"
                                   fixed>
                    <template slot-scope="scope">{{ scope.row.subject.code | FLevel }}</template>
                  </el-table-column>

                  <!-- 成本科目编码 -->
                  <el-table-column prop="subject.code"
                                   :label="$l('lbl_standared_subject_code')"
                                   width="180"
                                   align="left"
                                   fixed>
                    <template slot-scope="scope">
                      <!-- view -->
                      <div :style="{'width':'100%','text-align':'left','padding-left':(getLevel(scope.row.subject.code)-1)*5+'px'}">
                        <i :class="!scope.row._expanded ? 'fa fa-plus-square-o' : 'fa fa-minus-square-o' "
                           class="subjectCodeExpand"
                           v-show="!checkSubjectIsLeaf(scope.row)"
                           @click="handleExpandClick(scope.row.subject.code)"></i>&nbsp;{{ scope.row.subject.code }}
                      </div>
                    </template>
                  </el-table-column>

                  <!-- 成本科目名称 -->
                  <el-table-column prop="subject.name"
                                   show-overflow-tooltip
                                   :label="$l('lbl_standared_subject_name')"
                                   width="150"
                                   fixed>
                    <template slot-scope="scope">
                      <div style="text-align:left">{{scope.row.subject.name}}</div>
                    </template>
                  </el-table-column>

                  <!-- 目标成本(含税) -->
                  <el-table-column prop="targetCostIncludeTax"
                                   :label="'目标成本(含税)(元)'"
                                   width="160">
                    <template slot-scope="scope">
                      <!-- view -->
                      <span>{{scope.row.targetCostIncludeTax | NumFormat}}</span>
                    </template>
                  </el-table-column>

                  <!-- 目标成本(不含税) -->
                  <el-table-column prop="targetCostExcludeTax"
                                   :label="'目标成本(不含税)(元)'"
                                   width="160">
                    <template slot-scope="scope">
                      {{scope.row.targetCostExcludeTax | NumFormat}}
                    </template>
                  </el-table-column>

                  <!-- 税率 -->
                  <el-table-column prop="taxRate"
                                   :label="'税率(%)'"
                                   width="150">
                    <template slot-scope="scope">
                      <!-- view -->
                      {{scope.row.taxRate | NumFormat | rateFormat}}
                    </template>
                  </el-table-column>

                  <!-- 税额 -->
                  <el-table-column prop="tax"
                                   :label="'税额(元)'"
                                   width="150">
                    <template slot-scope="scope">
                      {{scope.row.tax | NumFormat}}
                    </template>
                  </el-table-column>

                  <!-- 可售单方(含税) -->
                  <el-table-column prop="saleSmCostIncludeTax"
                                   :label="'可售单方(含税)(元/㎡)'"
                                   width="170">
                    <template slot-scope="scope">
                      {{scope.row.saleSmCostIncludeTax | NumFormat}}
                    </template>
                  </el-table-column>

                  <!-- 可售单方(不含税) -->
                  <el-table-column prop="saleSmCostExcludeTax"
                                   :label="'可售单方(不含税)(元/㎡)'"
                                   width="170">
                    <template slot-scope="scope">
                      {{scope.row.saleSmCostExcludeTax | NumFormat}}
                    </template>
                  </el-table-column>

                  <!-- 建面单方(含税) -->
                  <el-table-column prop="constructSmCostIncludeTax"
                                   :label="'建面单方(含税)(元/㎡)'"
                                   width="170">
                    <template slot-scope="scope">
                      {{scope.row.constructSmCostIncludeTax | NumFormat}}
                    </template>
                  </el-table-column>

                  <!-- 建面单方(不含税) -->
                  <el-table-column prop="constructSmCostExcludeTax"
                                   :label="'建面单方(不含税)(元/㎡)'"
                                   width="170">
                    <template slot-scope="scope">
                      {{scope.row.constructSmCostExcludeTax | NumFormat}}
                    </template>
                  </el-table-column>

                  <!-- 财务科目编码 -->
                  <el-table-column prop="subject.financialSubjectCode"
                                   :label="$l('lbl_standared_subject_financial_subject_code')"
                                   width="150"
                                   v-if="false">
                    <template slot-scope="scope">
                      {{scope.row.subject.financialSubjectCode}}
                    </template>
                  </el-table-column>

                  <!-- 财务科目名称 -->
                  <el-table-column prop="subject.financialSubjectName"
                                   show-overflow-tooltip
                                   :label="$l('lbl_standared_subject_financial_subject_name')"
                                   width="150"
                                   v-if="false">
                    <template slot-scope="scope">
                      <!-- <fd-label :code="scope.row.subject.financialSubjectCode"
                                                      type="cost_subject_financial_subject_name"></fd-label> -->
                      {{selectData.cost_subject_financial_subject_name[scope.row.subject.financialSubjectCode]}}
                      <!-- {{scope.row.subject.financialSubjectName}} -->
                    </template>
                  </el-table-column>

                  <!-- 分摊规则 -->
                  <el-table-column prop="apportionmentRuleCode"
                                   :label="'分摊规则'"
                                   width="100">
                    <template slot-scope="scope">
                      <span v-show="!scope.row._editStatus">
                        <!-- <fd-label :code="scope.row.subject.apportionmentRuleCode"
                                                          type="cost_subject_apportionment_rule_code"></fd-label> -->
                        {{selectData.cost_subject_apportionment_rule_code[scope.row.subject.apportionmentRuleCode]}}
                      </span>
                    </template>
                  </el-table-column>

                  <!-- 责任条线 -->
                  <!-- <el-table-column prop="subject.responsibleLine"
                                                     :label="'责任条线'"
                                                     width="150">
                                        <template slot-scope="scope">
                                            <fd-label :code="scope.row.subject.responsibleLine"
                                                      type="cost_subject_responsible_line"></fd-label>
                                        </template>
                                    </el-table-column> -->

                  <!-- 责任部门 -->
                  <el-table-column prop="subject.responsibleDeptCode"
                                   :label="'责任部门'"
                                   width="100">
                    <template slot-scope="scope">
                      <!-- <fd-label :code="scope.row.subject.responsibleDeptCode"
                                                      type="cost_subject_responsible_dept_code"></fd-label> -->
                      {{selectData.cost_subject_responsible_dept_code[scope.row.subject.responsibleDeptCode]}}
                    </template>
                  </el-table-column>

                  <!-- 备注(编制) -->
                  <el-table-column prop="remark"
                                   :label="$l('lbl_remark')"
                                   width="150">
                    <template slot-scope="scope">
                      {{scope.row.remark}}
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-row>

        <!-- 跨期KUAQI -->
        <el-row v-if="pageStatus.flag === 'KUAQI' && !pageStatus.ISHISTORY"
                style="margin-bottom:5px;border:none">
          <!-- 编制表格 -->
          <el-table :data="KUQQIData()"
                    :row-style="showRow"
                    align="left"
                    stripe
                    size="small"
                    border
                    :height="tHeight"
                    tooltip-effect="dark"
                    style="width: 100%">
            <!-- 成本科目级别 -->
            <el-table-column prop="subject.level"
                             :label="$l('lbl_standared_subject_level')"
                             width="100"
                             fixed>
              <template slot-scope="scope">{{ scope.row.subject.code | FLevel }}</template>
            </el-table-column>

            <!-- 成本科目编码 -->
            <el-table-column prop="subject.code"
                             :label="$l('lbl_standared_subject_code')"
                             width="180"
                             align="left"
                             fixed>
              <template slot-scope="scope">
                <!-- view -->
                <div :style="{'width':'100%','text-align':'left','padding-left':(getLevel(scope.row.subject.code)-1)*5+'px'}">
                  <i :class="!scope.row._expanded ? 'fa fa-plus-square-o' : 'fa fa-minus-square-o' "
                     class="subjectCodeExpand"
                     v-show="getParentChild(scope.row.subject.code).length>0 && !scope.row._editStatus"
                     @click="handleExpandClick(scope.row.subject.code)"></i>{{ scope.row.subject.code }}
                </div>
              </template>
            </el-table-column>

            <!-- 成本科目名称 -->
            <el-table-column prop="subject.name"
                             :label="$l('lbl_standared_subject_name')"
                             width="150"
                             fixed>
              <template slot-scope="scope">
                <!-- view -->
                <div style="text-align:left">{{scope.row.subject.name}}</div>
              </template>
            </el-table-column>

            <!-- 目标成本(含税)-跨期 -->
            <el-table-column prop="targetCostIncludeTax"
                             :label="'目标成本(含税)-跨期(元)'"
                             width="180">
              <template slot-scope="scope">
                <!-- view -->
                <span>{{scope.row.targetCostIncludeTax | NumFormat}}</span>
              </template>
            </el-table-column>

            <!-- 目标成本(不含税)-跨期 -->
            <el-table-column prop="targetCostExcludeTax"
                             :label="'目标成本(不含税)-跨期(元)'"
                             width="190">
              <template slot-scope="scope">
                {{scope.row.targetCostExcludeTax | NumFormat}}
              </template>
            </el-table-column>

            <!-- 税率 -->
            <el-table-column prop="taxRate"
                             :label="'税率(%)'"
                             width="150">
              <template slot-scope="scope">
                <!-- view -->
                <span>
                  <span v-show="scope.row._canEdit">{{scope.row.taxRate | NumFormat | rateFormat}}</span>
                  <span v-show="!scope.row._canEdit">--</span>
                </span>
              </template>
            </el-table-column>

            <!-- 税额-跨期 -->
            <el-table-column prop="tax"
                             :label="'税额-跨期(元)'"
                             width="150">
              <template slot-scope="scope">
                {{scope.row.tax | NumFormat}}
              </template>
            </el-table-column>

            <!-- 动态列 -->
            <div style="float:left"
                 v-for="(item,index) in pageStatus.KUAQI_attributes"
                 :key="index">
              <el-table-column prop="item"
                               width="200"
                               :label="getAttributesLabel(item,0)">
                <template slot-scope="scope">
                  <span>{{scope.row.attributes[item] | NumFormat}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="item"
                               width="200"
                               :label="getAttributesLabel(item,1)">
                <template slot-scope="scope">
                  <span>{{scope.row.attributes[item] | NumFormat}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="item"
                               width="200"
                               :label="getAttributesLabel(item,2)">
                <template slot-scope="scope">
                  <span>{{scope.row.attributes[item] | NumFormat}}</span>
                </template>
              </el-table-column>
            </div>

            <!-- 财务科目编码 -->
            <el-table-column prop="subject.financialSubjectCode"
                             :label="$l('lbl_standared_subject_financial_subject_code')"
                             width="120"
                             v-if="false">
              <template slot-scope="scope">
                {{scope.row.subject.financialSubjectCode}}
              </template>
            </el-table-column>

            <!-- 财务科目名称 -->
            <el-table-column prop="subject.financialSubjectName"
                             show-overflow-tooltip
                             :label="$l('lbl_standared_subject_financial_subject_name')"
                             width="150"
                             v-if="false">
              <template slot-scope="scope">
                <!-- <fd-label :code="scope.row.subject.financialSubjectCode"
                                          type="cost_subject_financial_subject_name"></fd-label> -->
                {{selectData.cost_subject_financial_subject_name[scope.row.subject.financialSubjectCode]}}
              </template>
            </el-table-column>

            <!-- 分摊规则 -->
            <el-table-column prop="apportionmentRuleCode"
                             :label="'分摊规则'"
                             width="100">
              <template slot-scope="scope">
                <!-- <fd-label :code="scope.row.subject.apportionmentRuleCode"
                                          type="cost_subject_apportionment_rule_code"></fd-label> -->
                {{selectData.cost_subject_apportionment_rule_code[scope.row.subject.apportionmentRuleCode]}}
              </template>
            </el-table-column>

            <!-- 责任部门 -->
            <el-table-column prop="subject.responsibleDeptCode"
                             :label="'责任部门'"
                             width="100">
              <template slot-scope="scope">
                <!-- <fd-label :code="scope.row.subject.responsibleDeptCode"
                                          type="cost_subject_responsible_dept_code"></fd-label> -->
                {{selectData.cost_subject_responsible_dept_code[scope.row.subject.responsibleDeptCode]}}
              </template>
            </el-table-column>

            <!-- 备注(编制) -->
            <el-table-column prop="remark"
                             :label="$l('lbl_remark')"
                             width="150">
              <template slot-scope="scope">
                {{scope.row.remark}}
              </template>
            </el-table-column>
          </el-table>
        </el-row>

        <!-- 待分期DAIFENQI -->
        <el-row v-if="pageStatus.flag === 'DAIFENQI'  && !pageStatus.ISHISTORY"
                style="margin-bottom:5px;border:none">
          <!-- 编制表格 -->
          <el-table :data="DAIFENQIData()"
                    :row-style="showRow"
                    align="left"
                    stripe
                    size="small"
                    border
                    :height="tHeight"
                    tooltip-effect="dark"
                    style="width: 100%">
            <!-- 成本科目级别 -->
            <el-table-column prop="subject.level"
                             :label="$l('lbl_standared_subject_level')"
                             width="100"
                             fixed>
              <template slot-scope="scope">{{ scope.row.subject.code | FLevel }}</template>
            </el-table-column>

            <!-- 成本科目编码 -->
            <el-table-column prop="subject.code"
                             :label="$l('lbl_standared_subject_code')"
                             width="180"
                             align="left"
                             fixed>
              <template slot-scope="scope">
                <!-- view -->
                <div :style="{'width':'100%','text-align':'left','padding-left':(getLevel(scope.row.subject.code)-1)*5+'px'}">
                  <i :class="!scope.row._expanded ? 'fa fa-plus-square-o' : 'fa fa-minus-square-o' "
                     class="subjectCodeExpand"
                     v-show="getParentChild(scope.row.subject.code).length>0"
                     @click="handleExpandClick(scope.row.subject.code)"></i>{{ scope.row.subject.code }}
                </div>
              </template>
            </el-table-column>

            <!-- 成本科目名称 -->
            <el-table-column prop="subject.name"
                             show-overflow-tooltip
                             :label="$l('lbl_standared_subject_name')"
                             width="150"
                             fixed>
              <template slot-scope="scope">
                <div style="text-align:left">{{scope.row.subject.name}}</div>
              </template>
            </el-table-column>

            <!-- 目标成本(含税) -->
            <el-table-column prop="targetCostIncludeTax"
                             :label="'目标成本(含税)(元)'"
                             width="160">
              <template slot-scope="scope">
                <!-- view -->
                <span>{{scope.row.targetCostIncludeTax | NumFormat}}</span>
              </template>
            </el-table-column>

            <!-- 目标成本(不含税) -->
            <el-table-column prop="targetCostExcludeTax"
                             :label="'目标成本(不含税)(元)'"
                             width="160">
              <template slot-scope="scope">
                {{scope.row.targetCostExcludeTax | NumFormat}}
              </template>
            </el-table-column>

            <!-- 税率 -->
            <el-table-column prop="taxRate"
                             :label="'税率(%)'"
                             width="150">
              <template slot-scope="scope">
                <!-- view -->
                {{scope.row.taxRate | NumFormat | rateFormat}}
              </template>
            </el-table-column>

            <!-- 税额 -->
            <el-table-column prop="tax"
                             :label="'税额(元)'"
                             width="150">
              <template slot-scope="scope">
                {{scope.row.tax | NumFormat}}
              </template>
            </el-table-column>

            <!-- 可售单方(含税) -->
            <el-table-column prop="saleSmCostIncludeTax"
                             :label="'可售单方(含税)(元/㎡)'"
                             width="170">
              <template slot-scope="scope">
                {{scope.row.saleSmCostIncludeTax | NumFormat}}
              </template>
            </el-table-column>

            <!-- 可售单方(不含税) -->
            <el-table-column prop="saleSmCostExcludeTax"
                             :label="'可售单方(不含税)(元/㎡)'"
                             width="170">
              <template slot-scope="scope">
                {{scope.row.saleSmCostExcludeTax | NumFormat}}
              </template>
            </el-table-column>

            <!-- 建面单方(含税) -->
            <el-table-column prop="constructSmCostIncludeTax"
                             :label="'建面单方(含税)(元/㎡)'"
                             width="170">
              <template slot-scope="scope">
                {{scope.row.constructSmCostIncludeTax | NumFormat}}
              </template>
            </el-table-column>

            <!-- 建面单方(不含税) -->
            <el-table-column prop="constructSmCostExcludeTax"
                             :label="'建面单方(不含税)(元/㎡)'"
                             width="170">
              <template slot-scope="scope">
                {{scope.row.constructSmCostExcludeTax | NumFormat}}
              </template>
            </el-table-column>

            <!-- 财务科目编码 -->
            <el-table-column prop="subject.financialSubjectCode"
                             :label="$l('lbl_standared_subject_financial_subject_code')"
                             width="150"
                             v-if="false">
              <template slot-scope="scope">
                {{scope.row.subject.financialSubjectCode}}
              </template>
            </el-table-column>

            <!-- 财务科目名称 -->
            <el-table-column prop="subject.financialSubjectName"
                             show-overflow-tooltip
                             :label="$l('lbl_standared_subject_financial_subject_name')"
                             width="150"
                             v-if="false">
              <template slot-scope="scope">
                <!-- <fd-label :code="scope.row.subject.financialSubjectCode"
                                          type="cost_subject_financial_subject_name"></fd-label> -->
                {{selectData.cost_subject_financial_subject_name[scope.row.subject.financialSubjectCode]}}
                <!-- {{scope.row.subject.financialSubjectName}} -->
              </template>
            </el-table-column>

            <!-- 分摊规则 -->
            <el-table-column prop="apportionmentRuleCode"
                             :label="'分摊规则'"
                             width="100">
              <template slot-scope="scope">
                <span v-show="!scope.row._editStatus">
                  <!-- <fd-label :code="scope.row.subject.apportionmentRuleCode"
                                              type="cost_subject_apportionment_rule_code"></fd-label> -->
                  {{selectData.cost_subject_apportionment_rule_code[scope.row.subject.apportionmentRuleCode]}}
                </span>
              </template>
            </el-table-column>

            <!-- 责任条线 -->
            <!-- <el-table-column prop="subject.responsibleLine"
                                         :label="'责任条线'"
                                         width="150">
                            <template slot-scope="scope">
                                <fd-label :code="scope.row.subject.responsibleLine"
                                          type="cost_subject_responsible_line"></fd-label>
                            </template>
                        </el-table-column> -->

            <!-- 责任部门 -->
            <el-table-column prop="subject.responsibleDeptCode"
                             :label="'责任部门'"
                             width="100">
              <template slot-scope="scope">
                <!-- <fd-label :code="scope.row.subject.responsibleDeptCode"
                                          type="cost_subject_responsible_dept_code"></fd-label> -->
                {{selectData.cost_subject_responsible_dept_code[scope.row.subject.responsibleDeptCode]}}
              </template>
            </el-table-column>

            <!-- 备注(编制) -->
            <el-table-column prop="remark"
                             :label="$l('lbl_remark')"
                             width="150">
              <template slot-scope="scope">
                {{scope.row.remark}}
              </template>
            </el-table-column>
          </el-table>
        </el-row>

        <!-- 历史版本对比(非跨期)HISTORY -->
        <el-row style="margin-bottom:5px;border:none"
                v-if="pageModelList.length !== 0 && pageStatus.flag !=='KUAQI' && pageStatus.ISHISTORY">
          <el-tabs type="border-card"
                   @tab-click="tabClick">
            <el-tab-pane v-for="(stadge,index) in pageModelList"
                         :key="index">
              <span slot="label">
                <i class="el-icon-document"></i> {{stadge.name}}</span>
              <div>
                <!-- 编制表格 -->
                <el-table :data="stadge.data"
                          align="left"
                          stripe
                          size="small"
                          border
                          :row-style="showRow"
                          :height="tHeight"
                          tooltip-effect="dark"
                          style="width: 100%">
                  <!-- 成本科目级别 -->
                  <el-table-column prop="subject.code"
                                   :label="$l('lbl_standared_subject_level')"
                                   width="100"
                                   fixed>
                    <template slot-scope="scope">{{ scope.row.subject.code | FLevel }}</template>
                  </el-table-column>

                  <!-- 成本科目编码 -->
                  <el-table-column prop="subject.code"
                                   :label="$l('lbl_standared_subject_code')"
                                   width="180"
                                   align="left"
                                   fixed>
                    <template slot-scope="scope">
                      <!-- view -->
                      <div :style="{'width':'100%','text-align':'left','padding-left':(getLevel(scope.row.subject.code)-1)*5+'px'}">
                        <i :class="!scope.row._expanded ? 'fa fa-plus-square-o' : 'fa fa-minus-square-o' "
                           class="subjectCodeExpand"
                           v-show="getParentChild(scope.row.subject.code).length>0"
                           @click="handleExpandClick(scope.row.subject.code)"></i>&nbsp;{{ scope.row.subject.code }}
                      </div>
                    </template>
                  </el-table-column>

                  <!-- 成本科目名称 -->
                  <el-table-column prop="subject.name"
                                   :label="$l('lbl_standared_subject_name')"
                                   show-overflow-tooltip
                                   width="150"
                                   fixed>
                    <template slot-scope="scope">
                      <div style="text-align:left">{{scope.row.subject.name}}</div>
                    </template>
                  </el-table-column>

                  <!-- 动态列 -->
                  <el-table-column v-for="(item,index) in pageStatus.HISTORY_attributes"
                                   align="left"
                                   :key="index"
                                   :label="getHISTORYAttributesLabel(item)">
                    <template slot-scope="scope">
                      <span :style="{'color':getHISTORYAttributesColor(index,scope.row)}">{{getHISTORYAttributesData(scope.row,item) | NumFormat}}</span>
                    </template>
                  </el-table-column>

                </el-table>
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-row>

        <!-- 跨期历史对比 -->
        <el-row style="margin-bottom:5px;border:none"
                v-if="pageModelList.length !== 0 && pageStatus.flag ==='KUAQI' && pageStatus.ISHISTORY">
          <!-- 编制表格 -->
          <el-table :data="getKUAQI_HISTORY_Data()"
                    align="left"
                    stripe
                    size="small"
                    border
                    :height="tHeight"
                    tooltip-effect="dark"
                    :row-style="showRow"
                    style="width: 100%">
            <!-- 成本科目级别 -->
            <el-table-column prop="subject.code"
                             :label="$l('lbl_standared_subject_level')"
                             width="100"
                             fixed>
              <template slot-scope="scope">{{ scope.row.subject.code | FLevel }}</template>
            </el-table-column>

            <!-- 成本科目编码 -->
            <el-table-column prop="subject.code"
                             :label="$l('lbl_standared_subject_code')"
                             width="180"
                             align="left"
                             fixed>
              <template slot-scope="scope">
                <!-- view -->
                <div :style="{'width':'100%','text-align':'left','padding-left':(getLevel(scope.row.subject.code)-1)*5+'px'}">
                  <i :class="!scope.row._expanded ? 'fa fa-plus-square-o' : 'fa fa-minus-square-o' "
                     class="subjectCodeExpand"
                     v-show="getParentChild(scope.row.subject.code).length>0"
                     @click="handleExpandClick(scope.row.subject.code)"></i>&nbsp;{{ scope.row.subject.code }}
                </div>
              </template>
            </el-table-column>

            <!-- 成本科目名称 -->
            <el-table-column prop="subject.name"
                             :label="$l('lbl_standared_subject_name')"
                             show-overflow-tooltip
                             width="150"
                             fixed>
              <template slot-scope="scope">
                <div style="text-align:left">{{scope.row.subject.name}}</div>
              </template>
            </el-table-column>

            <!-- 动态列 -->
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

    <!-- 引用项目模板 -->
    <el-dialog :title="$l('lbl_cost_query_history')"
               :visible.sync="page.dialog.dialogSelect"
               :modal="true"
               :lock-scroll="true">
      <div>
        <div style="margin-bottom:20px;">
          <el-form size="mini">
            <el-row>
              <el-col :span="4">
                <el-form-item>
                  <!-- 阶段 -->
                  <fd-select v-model='page.dialog.queryModel.stageId'
                             placeholder='阶段'
                             type="cost_stage_id"
                             style="width:100px;"
                             :clearable="true"></fd-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item>
                  <!-- 修订时间 -->
                  <el-date-picker v-model="page.dialog.queryModel.startDate"
                                  style="width:155px;"
                                  :picker-options="pickerOptions0"
                                  type="date"
                                  placeholder="选择修订起始日期"></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <!-- 截至日期 -->
                <el-form-item>
                  <el-date-picker v-model="page.dialog.queryModel.endDate"
                                  type="date"
                                  :picker-options="pickerOptions1"
                                  style="width:155px;"
                                  placeholder="选择修订截至日期">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item>
                  <!-- 查询 -->
                  <f-button class="special-btn"
                            type='primary'
                            @click='searchDialogResult'
                            label="btn_search"></f-button>

                  <!-- 对比 -->
                  <f-button class="special-btn"
                            type='primary'
                            @click='compareDialogResult'
                            :disabled="page.dialog.selectRows.length === 0"
                            label="btn_compare_history"></f-button>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
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
import { LoadingUtil } from '@/utils/common/LoadingUtil'
import COSTENUM from '@/utils/cost/enum'
import COSTBUSINESS from '@/utils/cost/business'
import {
  getAccountingObjectProjectTree, // 获取树
  getAccountingObjectCommonInfo, // 获取基本信息
  getTargetCostByAccountingObject, // 获取核算成本信息
  getTargetCostHistory, // 获取历史
  getTargetCostByVersionUUID, // 根据历史获取成本信息
  getTargetCostVersionsByIds // 历史记录多版本对比参数为ids,多个id逗号分隔
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
import { FPhase } from '@/filters/cost/'
import { deepCopy, ifNull } from '@/utils/cost/objectHelper'
import { calc } from '@/utils/common/calc'
import { getLocalItem, setLocalItem, removeLocalItem, Constants } from '@/utils/common/cache'
import sys_config from '@/config/config.js'
export default {
  data () {
    return {
      accountingTargetTreeSelectorHeight: 380,
      calcTableHeight: {
        otherHeight: 380,
        sideCloseHeight: 50
      },
      selectData: {
        cost_stage_id: [],
        cost_subject_financial_subject_name: [],
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
        selectNodeWithNoPhase: null,//当前节点的无分期数据
        stepDatas: COSTENUM.stepType,
        dialog: {
          dialogSelect: false,
          selectRows: [],//选中的历史版本
          queryModel: {
            stageId: '',
            startDate: null,
            endDate: null
          },
          tableData: []
        },
        historyColorArray: [] //历史版本对比颜色
      },
      pageStatus: {
        expandedLevel: sys_config.expandedLevel,//默认展开二级
        maxLevel: 5,
        specialNode: COSTENUM.SPECIAL_SUBJECT_CODE_FLAG,
        hanldeTabIndex: 0,
        KUAQI_attributes: [],//跨期动态列
        HISTORY_attributes: [],// ['1-0', '2-1'],//历史动态列 当前包含的阶段和版本-前为阶段,2后为版本
        flag: 'PUTONG',//PUTONG普通,FENQI是跨期,KUAQI是分期
        ISHISTORY: false // 历史版本对比
      },
      pageModelList: [], // [{ constructType: '1', name: '联排别墅(A)', data: [] }, { constructType: '2', name: '独栋别墅(B)', data: [] }, { constructType: '', name: '项目一(A+B)', data: [] }],
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
        subjectCodeOrName: ''
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
  computed: {
    tHeight: {
      get: function () {
        let _tableHeight = document.body.clientHeight - this.calcTableHeight.otherHeight
        if (!this.$store.getters.sidebar.opened) _tableHeight += this.calcTableHeight.sideCloseHeight

        this.accountingTargetTreeSelectorHeight = _tableHeight + 165

        return _tableHeight + 'px'
      },
      set: function () {
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
  components: {
    AccountingTargetTreeSelector
  },
  methods: {
    //检查是否叶子节点
    checkSubjectIsLeaf (rowData) {
      return rowData.subjectModel ? rowData.subjectModel.isLeaf : this.getParentChild(rowData.subject.code).length === 0
    },
    // 展开收起组织树
    expandAccountingTargetTreeSelector () {
      this.accountingTargetTreeSelectorIsExpand = !this.accountingTargetTreeSelectorIsExpand
      this.accountingTargetTreeSelectorSpan = this.accountingTargetTreeSelectorIsExpand ? 5 : 0
    },
    // 跨期历史版本数据
    getKUAQI_HISTORY_Data () {
      if (this.pageModelList && this.pageModelList.length > 0) {
        return this.pageModelList[0].data
      } else {
        return []
      }
    },
    handleBack () {
      this.$router.push({
        name: 'TargectCostList'
      })
    },
    // 获取数据
    getHISTORYAttributesData (rowData, item) {
      return rowData.attributes[item]
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
      let stadge = { "1": "投前", "2": "投后", "3": "预备会", "4": "预结算", "5": "结算" }
      let stadgeVersionPreChar = "V "
      return stadge[item.split('_')[0]] + " " + stadgeVersionPreChar + item.split('_')[1]
    },
    getAttributesLabel (item, type) {
      let lableArray = ['目标成本（含税）-', '目标成本（不含税）-', '税额-']
      return lableArray[type] + FPhase(item)
    },
    // 待分期数据
    DAIFENQIData () {
      return this.pageModelList.length !== 0 ? this.pageModelList[0].data : []
    },
    // 跨期数据
    KUQQIData () {
      return this.pageModelList.length !== 0 ? this.pageModelList[0].data : []
    },
    // 计算对象获取子节点
    getHistoryParentChild (subjectList, parentCode) {
      let _thisData = deepCopy(subjectList)
      let _ChildRow = []
      _ChildRow = _thisData.filter(item => {
        return item.subject.code && item.subject.code.indexOf(parentCode + '.') > -1 && item.subject.code.replace(parentCode + '.').indexOf('.') === -1
      })
      _thisData = []
      return _ChildRow
    },
    // 计算汇总数据
    calcHistoryTotalData () {
      //重置计数
      for (let j = 0; j < this.pageModelList[this.pageModelList.length - 1].data.length; j++) {
        this.pageStatus.HISTORY_attributes.map(attributeItem => {
          this.pageModelList[this.pageModelList.length - 1].data[j].attributes[attributeItem] = 0
        })
      }

      // 循环业态
      for (let i = 0; i < this.pageModelList.length - 1; i++) {
        let subjectData = this.pageModelList[i].data
        // 循环科目
        for (let j = 0; j < subjectData.length; j++) {
          // 循环历史版本
          this.pageStatus.HISTORY_attributes.map(attributeItem => {
            // 累加各个业态的历史版本到最后的“成本分期”的历史版本
            this.pageModelList[this.pageModelList.length - 1].data[j].attributes[attributeItem] += subjectData[j].attributes[attributeItem]
          })

        }
      }
    },
    // 历史版本对比数据
    initHistoryCompareData (response) {
      //拿掉“公摊成本”
      if (this.pageModelList.length > 2) this.pageModelList.splice(this.pageModelList.length - 2, 1)

      //debugger
      let _this = this
      // 取到所有阶段和版本维度(动态列)
      //exp:data[0].targetCostModelList[0].HISTORY_attributes = {1_0:630,1_1:11212}
      //得到this.pageStatus.HISTORY_attributes=['1_0','1_1'],其中_前的1为当前阶段,后面的为当前版本
      let _compareData = {}
      this.pageStatus.HISTORY_attributes = []
      let _targetCostModelList = []
      let _defineRowData = {}
      let _subjectCodeList = []//{code/level} 
      let totalData = [] //所有汇总数据
      response.data.map(item => {
        _targetCostModelList = []

        // 业态编码和业态名称
        if ((this.pageStatus.flag !== 'KUAQI' && item.businessTypeCode && item.businessTypeName) || this.pageStatus.flag === 'KUAQI') {
          // 重置数据
          _subjectCodeList = []
          // 处理动态列的历史版本数据
          item.targetCostModelList.map(rowData => {
            _defineRowData = {}
            _defineRowData._expanded = true
            _defineRowData._show = true
            _defineRowData.subject = rowData.subject

            //处理默认展开级别
            _defineRowData._expanded = calc.Mul(ifNull(rowData.subject.level, 0), 1) < this.pageStatus.expandedLevel + 1
            _defineRowData._show = _defineRowData._show && (calc.Mul(ifNull(rowData.subject.level, 0), 1) < this.pageStatus.expandedLevel + 2)

            // 多个历史版本列数据的展示
            _defineRowData.attributes = rowData.attributes
            if (rowData.attributes && _this.pageStatus.HISTORY_attributes.length === 0) {
              for (var key in rowData.attributes) {
                if (rowData.attributes.hasOwnProperty(key) && _this.pageStatus.HISTORY_attributes.indexOf(key) < 0) {
                  _this.pageStatus.HISTORY_attributes.push(key)

                  _defineRowData[key] = key //追加行属性 rowData[]
                }
              }

              // 按阶段和版本由小到大排序["2_0","2_0.1"]
              try {
                //debugger
                // 排 阶段
                _this.pageStatus.HISTORY_attributes.sort((stageVersion1, stageVersion2) => {
                  return (stageVersion1.split('_')[0]) * 1 > (stageVersion2.split('_')[0]) * 1
                })
                // 排 版本
                _this.pageStatus.HISTORY_attributes.sort((stageVersion1, stageVersion2) => {
                  return (stageVersion1.split('_')[1]) * 1 > (stageVersion2.split('_')[1]) * 1
                })
              } catch (error) {
                console.log("按阶段的版本有小到大排序" + error.message)
              }
            }

            // 汇总所有科目数据
            if (JSON.stringify(_subjectCodeList).indexOf(JSON.stringify({ code: rowData.subject.code, level: rowData.subject.level })) < 0) {
              _subjectCodeList.push({ code: rowData.subject.code, level: rowData.subject.level, attributes: rowData.attributes })
            }
            // 行数据
            _targetCostModelList.push(_defineRowData)
          })

          // 汇总所有科目数据(按叶子到根重排记录)
          _subjectCodeList.sort((item1, item2) => { return item1.level < item2.level })

          // 重算当前业态金额(从叶子节点汇总到根节点)
          let _maxLevel = _subjectCodeList.length > 0 ? _subjectCodeList[0].level : 0  //最大级别（叶子级别）
          _subjectCodeList.map(subjectItem => {
            // 不是叶子
            if (subjectItem.level !== _maxLevel) {
              // 子节点
              let _childNode = this.getHistoryParentChild(_targetCostModelList, subjectItem.code)
              // 汇总子节点的各个版本
              _this.pageStatus.HISTORY_attributes.map(attributeItem => {
                if (_childNode.length > 0) subjectItem.attributes[attributeItem] = 0

                _childNode.map(childNodeItem => {
                  subjectItem.attributes[attributeItem] += childNodeItem.attributes[attributeItem]
                })
              })
            }
          })
          //console.log(item.businessTypeCode, _subjectCodeList)

          // 赋值
          if (this.pageStatus.flag === 'KUAQI') {
            _compareData['KUAQI_HISTORY'] = _targetCostModelList
          } else {
            _compareData[item.businessTypeCode] = _targetCostModelList
          }


          // 复制一份数据作为科目最后的业态汇总数据的基础运算数据
          if (this.pageStatus.flag !== 'KUAQI' && totalData.length === 0) totalData = deepCopy(_targetCostModelList)
        }
      })

      //处理行数据
      if (this.pageStatus.flag === 'KUAQI') {
        this.pageModelList[0].data = _compareData['KUAQI_HISTORY']
      } else {
        let businessIndex = 0
        let item0constructType = null
        this.pageModelList.map(item => {
          if (businessIndex === this.pageModelList.length - 1) {
            item.data = totalData
          } else {
            item.data = _compareData[item.constructType] || []
          }
          businessIndex++
        })
      }


      //汇总所有数据
      this.calcHistoryTotalData()

      this.pageStatus.ISHISTORY = true
    },
    // 初始化数据
    initTableData (response, isCompare = false) {
      //LoadingUtil.showLoading()
      //debugger
      this.pageModelList.map(item => {
        item.data = []
      })
      if (!response.data) {
        this.$showNormalError('没有可用数据')
        LoadingUtil.hideLoading()
        return
      }
      if (isCompare) {
        console.log("历史版本对比")
        this.initHistoryCompareData(response)
        LoadingUtil.hideLoading()
        return
      }
      let improtData = []
      response.data.map(item => {
        improtData.push(item.targetCostModelList)
      })

      if (this.pageStatus.flag === 'DAIFENQI') {
        response.data.map(item => {
          item._expanded = true
          item._show = true
        })
        this.pageModelList[0].data = response.data
        LoadingUtil.hideLoading()
        return
      }
      debugger

      // if (this.pageStatus.flag !== 'KUAQI' && this.pageStatus.flag !== 'DAIFENQI' && improtData.length - 1 !== this.pageModelList.length - 1) {
      //     this.$showNormalError('数据业态和当前业态数量不一致')
      // }

      try {
        // 增加业务数据
        let itemIndex = 0
        for (let i = 0; i < improtData.length; i++) {
          if (improtData[i] && improtData[i].length > 0) {
            improtData[i].map(item => {
              item._expanded = true
              item._show = true
              item.taxRate = calc.Mul(ifNull(item.taxRate, 0), 100)

              //处理默认展开级别
              item._expanded = calc.Mul(ifNull(item.subject.level, 0), 1) < this.pageStatus.expandedLevel + 1
              item._show = item._show && (calc.Mul(ifNull(item.subject.level, 0), 1) < this.pageStatus.expandedLevel + 2)

              // 跨期数据
              //debugger
              // 0 为待分期，1-10为跨期的分期
              if (this.pageStatus.flag === 'KUAQI' && itemIndex === 0) {
                if (item.attributes) {
                  let i = 1
                  while (i < 10) {
                    if (typeof (item.attributes['project_phase_amount' + i]) !== "undefined" && this.pageStatus.KUAQI_attributes.indexOf(i.toString()) < 0) {
                      //item['project_phase_amount' + i] = item.attributes['project_phase_amount' + i]
                      //item['project_phase_rate' + i] = item.attributes['project_phase_rate' + i]
                      this.pageStatus.KUAQI_attributes.push(i.toString()) //页面存在分期的标识
                    }
                    i++
                  }
                  if (typeof (item.attributes['project_phase_amount_tobe']) !== "undefined" && this.pageStatus.KUAQI_attributes.indexOf(i.toString()) < 0) {
                    //item['project_phase_amount_0'] = item.attributes['project_phase_amount_tobe']
                    //item['project_phase_rate_0'] = item.attributes['project_phase_rate_tobe']
                    this.pageStatus.KUAQI_attributes.push('0') //页面存在待分期的标识
                  }
                }
              }
              itemIndex++
            })
          }
        }
        if (improtData.length === 0) {
          LoadingUtil.showLoading()
          return
        }
        // 页面交互
        // 更新数据
        let _index = 0
        this.pageModelList.map(item => {
          if (_index === this.pageModelList.length - 1) {
            item.data = JSON.parse(JSON.stringify(improtData[0]))
          } else {
            item.data = improtData[_index] ? JSON.parse(JSON.stringify(improtData[_index])) : []
          }
          _index++
        })

        // 汇总最后一个sheet数据
        if (this.pageStatus.flag !== 'KUAQI') setTimeout(function () { this.calcTotalData }, 500)
        setTimeout(function () {
          LoadingUtil.hideLoading()
        }, 3000)
      } catch (error) {
        console.log(error)
        this.$showNormalError('处理数据异常')
        LoadingUtil.hideLoading()
      }
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

      if (response.data.businessTypeList) {
        this.pageModelList = []
        response.data.businessTypeList.map(item => {
          this.pageModelList.push({
            constructType: item.code,
            name: item.name,
            data: []
          })
        })

        //公摊成本
        if (this.pageStatus.flag !== 'KUAQI') {
          this.pageModelList.push({
            constructType: 'GTCB',
            name: '公摊成本',
            data: []
          })
        }


        //成本分期项目
        this.pageModelList.push({
          constructType: '',
          name: _this.page.selectNode.text ? _this.page.selectNode.text : this.page.accountingObjectName,
          data: []
        })
      } else {
        this.$showNormalError('业态数据为空')
      }

      console.info(response)
    },
    // 计算汇总数据
    calcTotalData () {
      if (this.pageStatus.ISHISTORY) return
      let _LastItemIndex = this.pageModelList.length - 1
      // 重置
      for (let m = 0; m < this.pageModelList[this.pageStatus.hanldeTabIndex].data.length; m++) {
        this.pageModelList[_LastItemIndex].data[m].taxRate = 0
        this.pageModelList[_LastItemIndex].data[m].targetCostIncludeTax = 0
        this.pageModelList[_LastItemIndex].data[m].targetCostExcludeTax = 0
        this.pageModelList[_LastItemIndex].data[m].tax = 0
        this.pageModelList[_LastItemIndex].data[m].saleSmCostIncludeTax = 0
        this.pageModelList[_LastItemIndex].data[m].saleSmCostExcludeTax = 0
        this.pageModelList[_LastItemIndex].data[m].constructSmCostIncludeTax = 0
        this.pageModelList[_LastItemIndex].data[m].constructSmCostExcludeTax = 0
      }
      // 汇总（去掉“公摊成本”）
      for (let i = 0; i < _LastItemIndex - 1; i++) {
        for (let j = 0; j < this.pageModelList[this.pageStatus.hanldeTabIndex].data.length; j++) {
          let lastItem = this.pageModelList[_LastItemIndex].data[j]
          let calItem = this.pageModelList[i].data[j]
          lastItem.taxRate = this.pageModelList[i].data[j].taxRate
          lastItem.targetCostIncludeTax = calc.Add(ifNull(lastItem.targetCostIncludeTax, 0), ifNull(calItem.targetCostIncludeTax, 0)).toFixed(2) / 1
          lastItem.targetCostExcludeTax = calc.Add(ifNull(lastItem.targetCostExcludeTax, 0), ifNull(calItem.targetCostExcludeTax, 0)).toFixed(2) / 1
          lastItem.tax = calc.Add(lastItem.tax, calItem.tax).toFixed(2) / 1

          // 税率 = 税额/目标成本不含税
          if (ifNull(lastItem.targetCostExcludeTax, 0) === 0) {
            lastItem.taxRate = 0
          } else {
            if (this.getParentChild(lastItem.subject.code).length === 0) {
              lastItem.taxRate = calc.Mul(calc.Div(ifNull(lastItem.tax, 0), lastItem.targetCostExcludeTax).toFixed(2), 100)
            }
          }

        }
      }
      // 可售单方 建面单方
      for (let m = 0; m < this.pageModelList[this.pageStatus.hanldeTabIndex].data.length; m++) {
        this.pageModelList[_LastItemIndex].data[m].saleSmCostIncludeTax = calc.Div(this.pageModelList[_LastItemIndex].data[m].targetCostIncludeTax, ifNull(this.detailModel.canSaleAcreage, 1)).toFixed(2) / 1
        this.pageModelList[_LastItemIndex].data[m].saleSmCostExcludeTax = calc.Div(this.pageModelList[_LastItemIndex].data[m].targetCostIncludeTax, ifNull(this.detailModel.canSaleAcreage, 1)).toFixed(2) / 1
        this.pageModelList[_LastItemIndex].data[m].constructSmCostIncludeTax = calc.Div(this.pageModelList[_LastItemIndex].data[m].targetCostIncludeTax, ifNull(this.detailModel.buildingAcreage, 1)).toFixed(2) / 1
        this.pageModelList[_LastItemIndex].data[m].constructSmCostExcludeTax = calc.Div(this.pageModelList[_LastItemIndex].data[m].targetCostIncludeTax, ifNull(this.detailModel.buildingAcreage, 1)).toFixed(2) / 1
      }
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
      _ChildRow = _this.pageModelList[this.pageStatus.hanldeTabIndex].data.filter(item => {
        return item.subject.code && item.subject.code.indexOf(parentCode + '.') > -1 && item.subject.code.replace(parentCode + '.').indexOf('.') === -1
      })
      return _ChildRow
    },
    // 获取级别
    getLevel (parentCode) {
      return parentCode.split('.').length
    },
    // 展开收起
    handleExpandClick (parentCode) {
      let parentExpanded
      this.pageModelList[this.pageStatus.hanldeTabIndex].data.map(item => {
        if (item.subject.code === parentCode) {
          item._expanded = !item._expanded
          parentExpanded = item._expanded
        }
        if (item.subject.code.indexOf(parentCode) > -1 && item.subject.code !== parentCode) {
          item._show = parentExpanded
          item._expanded = parentExpanded
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
      let show = row.row._show
      if (row.row.subject && show) {
        show = !COSTBUSINESS.checkIsSpecialCode({ 'nodeSource': row.row.subject.nodeSource, 'code': row.row.subjectCode })
      }
      return show ? 'animation:treeTableShow 1s;-webkit-animation:treeTableShow 1s;' : 'display:none;'
    },
    // 阶段步骤点击
    handleStageClick (stageId) {
      console.log(stageId)

      if (this.page.selectNode) {
        if (stageId <= this.page.stageId) {
          this.page.selectStageId = stageId

          this.handleTreeNodeClick({ id: this.page.selectNode.id }, stageId, null)

          // 重新获取明细
          getAccountingObjectCommonInfo({ accountObjectId: this.page.accountingObjectId, stageId: stageId })
            .then(response => {
              this.initCommonInfoData(response)
            })
            .catch(error => {
              console.log(error)
            })

        } else {
          this.$showNormalError('当前点击阶段无效')
        }
      }
    },
    // 导出
    handleExport () {
      COSTBUSINESS.download(process.env.COST_API + '/targetCost/defineStageVersion/export?editType=0&accountingObjectId=' + this.page.selectNode.id + '&stageId=' + this.detailModel.stageId + '&stageVersion=' + this.detailModel.stageVersion)
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
      this.pageStatus.HISTORY_attributes = []
      this.page.dialog.dialogSelect = false
      // 单条查看
      if (this.page.dialog.selectRows.length === 1) {
        this.handleSelectOtherProjectTemplate(0, this.page.dialog.selectRows[0])
        return
      }
      // 多条对比
      let ids = this.page.dialog.selectRows.map(item => { return item.id }).join(',')
      LoadingUtil.showLoading()
      getTargetCostVersionsByIds({ ids: ids })
        .then(response => {
          this.initTableData(response, true)
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
      getTargetCostHistory({ accountingObjectId: this.page.selectNode.id, stageId: _stageId })
        .then(response => {
          LoadingUtil.hideLoading()
          response.data.map(item => {
            item._show = true
          })

          let _stageVersion = this.detailModel.stageVersion ? this.detailModel.stageVersion.toString() : ''
          debugger
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
    getCommonInfo (node) {
      LoadingUtil.showLoading()
      let paramS = {}
      if (this.page.stageId) {
        paramS = { accountObjectId: node.id, stageId: this.page.stageId, stageVersion: this.page.stageVersion }
      } else {
        paramS = { accountObjectId: node.id }
      }
      getAccountingObjectCommonInfo(paramS)
        .then(response => {
          this.page.selectNode = node
          this.initCommonInfoData(response)
          this.handleTreeNodeClick(node)
        })
        .catch(error => {
          console.log(error)
          LoadingUtil.hideLoading()
          this.$showError(error.message ? error.message : 'msg_system_error')
        })
    },
    getHistoryCommonInfo (paramS, index, rowData) {
      LoadingUtil.showLoading()
      getAccountingObjectCommonInfo(paramS)
        .then(response => {
          LoadingUtil.hideLoading()
          this.initCommonInfoData(response)
          this.handleClickHistoryRow(index, rowData)
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
      this.pageStatus.ISHISTORY = false
      this.page.dialog.dialogSelect = false
      let _param = {
        accountObjectId: this.page.accountingObjectId,
        stageId: rowData.stageId,
        stageVersion: rowData.stageVersion
      }
      this.getHistoryCommonInfo(_param, index, rowData)

    },
    // 点击历史版本
    handleClickHistoryRow (index, rowData) {
      LoadingUtil.showLoading()
      getTargetCostByVersionUUID({ id: rowData.id })
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
    // 点击节点查询
    handleTreeNodeClick (node, stageId, stageVersion) {
      LoadingUtil.showLoading()
      this.page.selectNode = node
      this.pageStatus.ISHISTORY = false
      this.pageStatus.flag = COSTBUSINESS.getAccountingTargetType({ name: this.page.selectNode.text })
      let _stageId = stageId ? stageId : (node.attr ? node.attr["stageId"] : this.detailModel.stageId)
      if (_stageId.toString() === '0') {
        _stageId = null
      }
      let _stageVersion = null
      if (typeof (stageVersion) !== "undefined") {
        _stageVersion = stageVersion
      } else {
        _stageVersion = this.page.stageVersion
      }
      getTargetCostByAccountingObject({ accountingObjectId: node.id, stageId: _stageId, stageVersion: _stageVersion })
        .then(response => {
          if (response.data && response.data.length > 0) {
            this.initTableData(response)
          } else {
            LoadingUtil.hideLoading()
            this.$showError('该项目当前阶段未编制目标成本')
            if (node && node.attr && node.attr['phaseType'] !== '0' && this.page.selectNodeWithNoPhase) {
              this.getCommonInfo(this.page.selectNodeWithNoPhase)
            }
          }
        })
        .catch(error => {
          console.log(error)
          LoadingUtil.hideLoading()
          this.$showError(error.message ? error.message : 'msg_system_error')
        })
    },
    // 树节点点击事件
    handleNodeClick (data) {
      if (data && data.brotherNodeList) {
        let brotherWithNoPhase = data.brotherNodeList.find(item => {
          return item.data.attr['phaseType'] === '0'
        })
        this.page.selectNodeWithNoPhase = brotherWithNoPhase ? brotherWithNoPhase.data : null
        // 成本分期
        this.page.accountingObjectId = this.page.selectNodeWithNoPhase.id
      } else {
        // 成本分期
        this.page.accountingObjectId = data.id
      }

      this.getCommonInfo(data)
    },
    // 科目编码，科目名称查询
    handleSearch () {
      LoadingUtil.showLoading()
      if (!this.queryModel.subjectCodeOrName) {
        this.pageModelList[this.pageStatus.hanldeTabIndex].data.map(item => {
          item._show = true
        })
      } else {
        this.pageModelList[this.pageStatus.hanldeTabIndex].data.map(item => {
          item._show = false
        })
        this.pageModelList[this.pageStatus.hanldeTabIndex].data.map(item => {
          if (item.subject.code.includes(this.queryModel.subjectCodeOrName)
            || item.subject.name.includes(this.queryModel.subjectCodeOrName)) {
            item._show = true
          }
        })
      }
      LoadingUtil.hideLoading()
    }
  },
  mounted () {
    // window.onresize = () => {
    //   return (() => {
    //     let _tableHeight = document.body.clientHeight - this.calcTableHeight.otherHeight
    //     this.tHeight = _tableHeight + 'px'
    //   })()
    // }

    //console.log(COSTBUSINESS.getAccountingTargetType({name:'一期'}))
    this.page.accountingObjectId = this.$route.query.accountingObjectId ? this.$route.query.accountingObjectId : '0'
    this.page.accountingObjectName = this.$route.query.accountingObjectName ? this.$route.query.accountingObjectName : ''
    this.page.stageId = this.$route.query.stageId ? parseInt(this.$route.query.stageId) : 0
    this.page.stageVersion = this.$route.query.stageVersion
    if (!this.selectNode) this.page.selectNode = {}
    this.page.selectNode.id = this.page.accountingObjectId
    this.page.selectNode.stageId = parseInt(this.page.stageId)
    this.page.selectNode.text = this.page.accountingObjectName
    this.page.selectNode.type = COSTENUM.projectTreeType.TREE_NODE_ACC_OBJ
    //this.handleNodeClick(this.page.selectNode)

    this.pageStatus.ISHISTORY = false
    this.pageStatus.flag = COSTBUSINESS.getAccountingTargetType({ name: this.page.accountingObjectName })

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
    allDICTIONARY['cost_subject_financial_subject_name'].map(item => {
      this.selectData.cost_subject_financial_subject_name[item.dictValue] = item.dictLabelCn
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
      if (val.type === COSTENUM.projectTreeType.TREE_NODE_ACC_OBJ) {
        this.handleNodeClick(val)
      }
    }
  }
}
</script>
<style scoped>
.el-collapse {
  margin: 20px 0;
}
.targetCostQuery {
  margin-top: 0px;
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

   
