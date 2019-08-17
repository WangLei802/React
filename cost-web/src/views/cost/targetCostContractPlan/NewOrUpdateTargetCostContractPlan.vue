<!-- NewOrUpdateTargetCostCompilation -->
<template>
  <div class="app-container">
    <!-- <div class="subTitle">
            <div class="breadcrumb-child">
                <i class="fa fa-folder-open-o"></i>合约规划编制 {{queryModel.accountingObject}} {{page.statusName}}
            </div>
            <div class="button-area">
                <el-button class="ordinary-btn"
                           @click='handleBack'>{{$l("btn_back")}}</el-button>
            </div>
    </div>-->
    <!-- 合约规划树(科目添加规划用) -->
    <ContractPlanSelector
      :dialogVisible="page.contractPlanSelector.show"
      :enableSearch="true"
      @CB-dialogVisible="CB_dialogVisible"
      v-model="page.contractPlanSelector.selectNode"
      :locked="true"
      :params="{'accountingObjectId':this.queryModel.accountingObjectId}"
    />

    <!-- 头部选择部分 -->
    <el-row v-show="page.id === '0' || page.id === ''" style="margin-top:20px">
      <!-- 成本分期选择级联 -->
      <AccountingTargetSelector
        @updateMessage="updateMessage"
        :valueObjectId="queryModel"
        :showNoPhaseIfHavePhase="false"
        :showTobe="false"
        :queryModel="queryModel"
        :labelWidth="{
                group:80,
                company:80,
                businessDept:80,
                accountingObject:80 
            }"
      ></AccountingTargetSelector>
    </el-row>

    <!-- 明细信息 -->
    <el-row style="margin-bottom:5px;border:none">
      <el-collapse v-model="pageStatus.blockDetailActiveName" accordion style="font-size:24px">
        <el-collapse-item name="1">
          <template slot="title">
            <strong style="padding-left:10px">
              明细信息(
              <font color="red">合约规划编制</font>
              {{queryModel.accountingObject}} {{page.statusName}})
            </strong>
            <i class="header-icon el-icon-info"></i>
          </template>
          <div style="line-height:30px;padding-top:10px;">
            <!-- 第一行 -->
            <el-row>
              <el-col :span="8" :offset="1">
                <div class="detailLabel">合约规划金额(含税)(元)：</div>
                <div class="detailValue">{{detailModel.contractPlanAmountIncludeTax | NumFormat}}</div>
              </el-col>
              <el-col :span="8">
                <div class="detailLabel">编制人：</div>
                <div class="detailValue">{{detailModel.maker}}</div>
              </el-col>
              <el-col :span="7">
                <div class="detailLabel">审批状态：</div>
                <div :class="{detailValue:true,col:flag}" @click="jump">
                  <!-- <fd-label :code="detailModel.status"
                  type="cost_flow_status"></fd-label>-->
                  {{detailModel.flowStatus?detailModel.flowStatus:selectData.cost_flow_status[detailModel.status]}}
                </div>
              </el-col>
            </el-row>

            <!-- 第二行 -->
            <el-row>
              <el-col :span="8" :offset="1">
                <div class="detailLabel">合约规划金额(不含税)(元)：</div>
                <div class="detailValue">{{detailModel.contractPlanAmountExcludeTax | NumFormat}}</div>
              </el-col>
              <el-col :span="8">
                <div class="detailLabel">编制日期：</div>
                <div class="detailValue">{{detailModel.updatedDate | dateFormat('yyyy-MM-dd')}}</div>
              </el-col>
              <el-col :span="7">
                <div class="detailLabel">审批日期：</div>
                <div
                  class="detailValue"
                >{{detailModel.auditApprovalDate | dateFormat('yyyy-MM-dd')}}</div>
              </el-col>
            </el-row>

            <!-- 第三行 -->
            <el-row>
              <el-col :span="8" :offset="1">
                <div class="detailLabel">合约规划份数：</div>
                <div class="detailValue">{{detailModel.contractPlanNum}}</div>
              </el-col>
              <el-col :span="8">
                <div class="detailLabel">
                  <font color="red">*</font>合约标段划分数量：
                </div>
                <div class="detailValue">
                  <span v-if="!page.isEdit">{{detailModel.segmentationNum | NumFormat}}</span>
                  <el-input-number
                    v-model.trim.number="detailModel.segmentationNum"
                    :placeholder="''"
                    clearable
                    :controls="false"
                    :min="0"
                    :precision="0"
                    onmousewheel="return false;"
                    :maxlength="20"
                    v-if="page.isEdit"
                    style="width:100px;"
                  />
                </div>
              </el-col>
              <el-col :span="7">
                <div class="detailLabel">版本：</div>
                <div class="detailValue">
                  <div style="float:left;min-width:30px;text-align:left;">
                    <!-- <fd-label :code="detailModel.stageId.toString()"
                    type="cost_stage_id"></fd-label>-->
                    {{selectData.cost_stage_id[_ToString(detailModel.stageId)]}}
                  </div>
                  <div
                    style="float:left;width:50px;text-align:left;"
                  >{{detailModel.stageVersion |Version}}</div>
                </div>
              </el-col>
            </el-row>

            <!-- 第四行 -->
            <el-row>
              <el-col :span="8" :offset="1">
                <div class="detailLabel">
                  <font color="red">*</font>集团战略采购份数：
                </div>
                <div class="detailValue">
                  <span v-if="!page.isEdit">{{detailModel.groupStrategyBuyNum | NumFormat}}</span>
                  <el-input-number
                    v-model.trim.number="detailModel.groupStrategyBuyNum"
                    :placeholder="''"
                    clearable
                    :controls="false"
                    :min="0"
                    :precision="0"
                    onmousewheel="return false;"
                    :maxlength="20"
                    v-if="page.isEdit"
                    style="width:100px;"
                  />
                </div>
              </el-col>

              <el-col :span="8">
                <div class="detailLabel">
                  <font color="red">*</font>材料设备采购份数：
                </div>
                <div class="detailValue">
                  <span v-if="!page.isEdit">{{detailModel.materEquipBuyNum | NumFormat}}</span>
                  <el-input-number
                    v-model.trim.number="detailModel.materEquipBuyNum"
                    :placeholder="''"
                    clearable
                    :controls="false"
                    :min="0"
                    :precision="0"
                    onmousewheel="return false;"
                    :maxlength="20"
                    v-if="page.isEdit"
                    style="width:100px;"
                  />
                </div>
              </el-col>

              <el-col :span="7">
                <div class="detailLabel">
                  <font color="red">*</font>集团集中采购份数：
                </div>
                <div class="detailValue">
                  <span v-if="!page.isEdit">{{detailModel.groupCenterBuyNum | NumFormat}}</span>
                  <el-input-number
                    v-model.trim.number="detailModel.groupCenterBuyNum"
                    :placeholder="''"
                    clearable
                    :controls="false"
                    :min="0"
                    :precision="0"
                    onmousewheel="return false;"
                    :maxlength="20"
                    v-if="page.isEdit"
                    style="width:100px;"
                  />
                </div>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="8" :offset="1">
                <div class="detailLabel">
                  <font color="red">*</font>工程采购份数：
                </div>
                <div class="detailValue">
                  <span v-if="!page.isEdit">{{detailModel.projectBuyNum | NumFormat}}</span>
                  <el-input-number
                    v-model.trim.number="detailModel.projectBuyNum"
                    :placeholder="''"
                    clearable
                    :controls="false"
                    :min="0"
                    :precision="0"
                    onmousewheel="return false;"
                    :maxlength="20"
                    v-if="page.isEdit"
                    style="width:100px;"
                  />
                </div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8" :offset="1">
                <div class="detailLabel">
                  其他：
                </div>
                <div class="detailValue">
                  <a class="file_col" @click="filedialog">附件列表</a>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-collapse-item>
      </el-collapse>
    </el-row>
    <!-- 附件列表弹出层 -->
    <el-dialog title="附件列表" :visible.sync="dialogTableVisible">
      <div class="file">
          <div class="file_font"> 上传附件：</div>
          <upload :attachmentData="page.attachment.attachmentData"></upload>
      </div> 
      <DesignAlterationAttachmentTable :queryObj_passed_in='page.attachment.queryModel' :attaData='page.attachment.attachmentData' :showDeleteButton="showDeleteButton"
                                     v-on:changeAttachments="changeAttachments"
                                     ref='DesignAlterationAttachmentTable'>
    </DesignAlterationAttachmentTable>
    </el-dialog>
    <!-- 按钮区域 -->
    <el-row style="margin-bottom:10px;border:none">
      <el-form size="mini" :inline="true" @submit.native.prevent>
        <el-row>
          <el-col :span="4">
            <!-- 科目代码或名称 -->
            <el-input
              v-model="queryModel.subjectCodeOrName"
              :placeholder="'科目编码或名称/合约'"
              style="padding-right:5px;"
              clearable
              :maxlength="20"
              @keyup.enter.native="searchEnterFun($event)"
              :disabled="pageModelList.length === 0"
            ></el-input>
          </el-col>
          <!-- <el-col :span="4">
                        <el-input v-model='queryModel.contractName'
                                  :placeholder="'合约名称'"
                                  style="padding-right:5px;"
                                  clearable
                                  :maxlength="20"
                                  :disabled="pageModelList.length === 0"></el-input>
          </el-col>-->
          <el-col :span="3">
            <el-button
              class="special-btn"
              type="primary"
              :disabled="pageModelList.length === 0"
              @click="handleSearch"
              label="btn_search"
            >{{$l('btn_search')}}</el-button>

            <el-button
              size="mini"
              class="ordinary-btn"
              v-if="!$store.state.user.isFromBpm"
              @click="handleBack"
            >{{$l("btn_back")}}</el-button>
          </el-col>

          <el-col :span="2" style="text-align:right">
            <el-upload
              name="file"
              style="padding-right:15px;"
              v-if="page.isEdit"
              :action="page.importFileUrl"
              :show-file-list="false"
              :disabled="pageModelList.length === 0"
              :before-upload="handleUploadBefore"
              :on-success="handleUploadSuccess"
              :data="{accountingObjectId:this.queryModel.accountingObjectId,stageId:this.queryModel.stageId,stageVersion:this.queryModel.stageVersion}"
              accept="multipart/form-data, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            >
              <el-button
                size="mini"
                type="primary"
                :disabled="pageModelList.length === 0"
              >{{$l('lbl_standared_subject_import')}}</el-button>
            </el-upload>
          </el-col>

          <el-col :span="10">
            <el-button
              size="mini"
              v-if="page.isEdit"
              class="special-btn"
              type="primary"
              @click="handleExport"
              :disabled="pageModelList.length === 0"
            >{{$l('lbl_standared_subject_export')}}</el-button>

            <!-- <el-button size="mini"
                                   v-if="page.isEdit"
                                   class="special-btn"
                                   type='primary'
                                   :disabled="pageModelList.length === 0"
                                   @click='handleEdit'>{{$l('btn_edit')}}</el-button>

                        <el-button size="mini"
                                   v-if="page.isEdit"
                                   class="special-btn"
                                   type='primary'
                                   :disabled="pageModelList.length === 0"
            @click='handleUndo'>{{$l('btn_cancel')}}</el-button>-->
            <el-button
              size="mini"
              v-if="page.isEdit"
              class="special-btn"
              type="primary"
              :disabled="pageModelList.length === 0"
              @click="handleSave(false)"
            >{{$l('btn_save')}}</el-button>

            <el-button
              size="mini"
              v-if="page.isEdit"
              class="special-btn"
              type="primary"
              :disabled="pageModelList.length === 0 || pageStatus.onSubmit"
              @click="handleSave(true)"
            >{{$l('lbl_cost_compilation_submit')}}</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-row>

    <!-- 合约规划编制表格 :height="tableHeight"-->
    <div
      style="margin-bottom:10px;border:none"
      v-show="pageModelList.length !== 0"
      ref="multipleTable"
    >
      <el-table
        :data="pageModelList"
        :row-style="showRow"
        align="left"
        stripe
        size="small"
        border
        tooltip-effect="dark"
        :height="tHeight"
        style="width: 100%"
      >
        <!-- 序号 -->
        <el-table-column
          type="index"
          :label="$l('lbl_no')"
          :index="indexMethod"
          width="50"
          v-if="false"
          :fixed="pageModelList.length !== 0"
        ></el-table-column>

        <!-- 成本科目级别 -->
        <el-table-column
          prop="subjectLevel"
          :label="$l('lbl_standared_subject_level')"
          width="100"
          v-if="false"
          :fixed="pageModelList.length !== 0"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.dataType === '1'">{{ scope.row.subjectCode | FLevel }}</span>
          </template>
        </el-table-column>
        <!-- 成本科目编码 -->
        <el-table-column
          prop="subjectCode"
          :label="$l('lbl_standared_subject_code')"
          width="180"
          align="left"
          :fixed="pageModelList.length !== 0"
        >
          <template slot-scope="scope">
            <div
              :style="{'width':'100%','text-align':'left','padding-left':getSubjectCodePaddingLeft(scope.row)}"
            >
              <!-- 展开折叠 -->
              <i
                :class="!scope.row._expanded ? 'fa fa-plus-square-o' : 'fa fa-minus-square-o' "
                class="subjectCodeExpand"
                v-if="scope.row.dataType === '1'"
                @click="handleExpandClick(scope.row.subjectCode)"
              ></i>
              <span v-if="scope.row.dataType === '1'">{{scope.row.subjectCode}}</span>
            </div>
          </template>
        </el-table-column>

        <!-- 成本科目名称 -->
        <el-table-column
          prop="subjectName"
          :label="$l('lbl_standared_subject_name')"
          show-overflow-tooltip
          width="120"
          :fixed="pageModelList.length !== 0"
        >
          <template slot-scope="scope">
            <div style="text-align:left" v-if="scope.row.dataType === '1'">
              <i
                class="fa fa-money"
                aria-hidden="true"
                title="预备费类型"
                v-if="scope.row.reserveCostType === '1'"
              ></i>
              {{scope.row.subjectName}}
              <!-- {{scope.row.reserveCostType === '1'?'(预备费)':''}} -->
            </div>
          </template>
        </el-table-column>

        <!-- 目标成本金额(含税) -->
        <el-table-column
          prop="subjectAmountIncludeTax"
          :label="'目标成本金额(含税)(元)'"
          show-overflow-tooltip
          width="150"
          :fixed="pageModelList.length !== 0"
        >
          <template slot-scope="scope">
            <span
              v-if="scope.row.dataType === '1'"
            >{{ifNullValue(scope.row.subjectAmountIncludeTax,0) | NumFormat}}</span>
          </template>
        </el-table-column>

        <!-- 合约规划【可编辑】 -->
        <el-table-column
          prop="contractPlanName"
          :label="'合约规划'"
          show-overflow-tooltip
          width="120"
          :fixed="pageModelList.length !== 0"
        >
          <template slot-scope="scope">
            <div style="text-align:left" v-if="scope.row.dataType === '2'">
              <!-- view -->
              <span v-if="!scope.row._editStatus || scope.row.lockedBy">
                <i class="fa fa-lock" aria-hidden="true" v-if="scope.row.lockedBy" title="锁定"></i>
                {{scope.row.contractPlanName || '--'}}
              </span>
              <span
                v-if="scope.row._editStatus && scope.row.dataType === '2' && !scope.row.lockedBy"
                style="color:blue"
              >
                <a
                  @click="selectContractPlan(scope.$index,scope.row)"
                >{{scope.row.contractPlanName || '选择合约'}}</a>
              </span>
            </div>
          </template>
        </el-table-column>

        <!-- 一级分类 -->
        <el-table-column
          prop="level1Name"
          :label="'一级分类'"
          show-overflow-tooltip
          width="150"
          v-if="false"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.dataType === '2'">{{scope.row.level1Name}}</span>
          </template>
        </el-table-column>

        <!-- 二级分类 -->
        <el-table-column
          prop="level2Name"
          :label="'二级分类'"
          show-overflow-tooltip
          width="150"
          v-if="false"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.dataType === '2'">{{scope.row.level2Name}}</span>
          </template>
        </el-table-column>

        <!-- 成本科目比例【可编辑】 -->
        <el-table-column prop="splitRate" :label="'成本科目比例(%)'" show-overflow-tooltip width="115">
          <template slot-scope="scope">
            <span v-if="scope.row.dataType === '2'">
              <!-- view -->
              <!-- <span v-if="!scope.row._editStatus || scope.row.lockedBy"> -->
              <span>
                <span v-if="scope.row.dataType === '2'">{{scope.row.splitRate}}</span>
                <span v-if="scope.row.dataType === '1' && scope.row.isLeaf">
                  <!-- <strong>{{scope.row.splitRate}}%</strong>
                  <span :style="{'color':scope.row._sumSplitRate<100?'red':'green'}">[{{scope.row._sumSplitRate}}%]</span>-->
                  <!-- <strong>
                                    <span :style="{'color':scope.row._sumSplitRate<100?'red':'green'}">
                                        {{scope.row._sumSplitRate>100?scope.row._sumSplitRate:''}}%
                                    </span>
                  </strong>-->
                </span>
              </span>

              <!-- edit -->
              <!-- <span v-if="scope.row._editStatus && !scope.row.lockedBy">
                                <span>
                                    <el-input v-model.trim.number="scope.row.splitRate"
                                              :placeholder="'成本科目比例'"
                                              type="number"
                                              onmousewheel="return false;"
                                              maxlength="5"
                                              :style="{'width':'120px','vertical-align':'middle'}"
                                              @blur="handleRowChange('splitRate',scope.row.splitRate,scope.row,scope.$index,$event)"></el-input>
                                </span>
                                <span>%</span>
              </span>-->
            </span>
          </template>
        </el-table-column>

        <!-- 合约规划金额（含税）【可编辑】 -->
        <el-table-column prop="contractPlanAmountIncludeTax" :label="'合约规划金额(含税)(元)'" width="150">
          <template slot-scope="scope">
            <!-- view -->
            <span v-if="scope.row.dataType === '2'">
              <span
                v-if="!scope.row._editStatus ||  scope.row.lockedBy"
              >{{scope.row.contractPlanAmountIncludeTax | NumFormat}}</span>
              <!-- edit -->
              <el-input-number
                v-model.trim.number="scope.row.contractPlanAmountIncludeTax"
                :placeholder="'合约规划金额(含税)(元)'"
                v-if="scope.row._editStatus && !scope.row.lockedBy"
                :controls="false"
                :precision="2"
                :min="0"
                onmousewheel="return false;"
                @blur="handleRowChange('contractPlanAmountIncludeTax',scope.row.contractPlanAmountIncludeTax,scope.row,scope.$index,$event)"
              ></el-input-number>
            </span>
            
            <span v-if="scope.row.dataType === '1' && scope.row.isLeaf">
              <!-- <strong>{{scope.row.subjectAmountIncludeTax | NumFormat}}</strong>
              [{{scope.row._sumContractPlanAmountIncludeTax | NumFormat}}]-->
              合计：{{scope.row._sumContractPlanAmountIncludeTax | NumFormat}}
            </span>
          </template>
        </el-table-column>

        <!-- 合约规划金额（不含税） -->
        <el-table-column
          prop="contractPlanAmountExcludeTax"
          :label="'合约规划金额(不含税)(元)'"
          show-overflow-tooltip
          width="160"
        >
          <template slot-scope="scope">
            <span
              v-if="scope.row.dataType === '2'"
            >{{scope.row.contractPlanAmountExcludeTax | NumFormat}}</span>
            <span v-if="scope.row.dataType === '1' && scope.row.isLeaf">
              合计：{{scope.row._sumContractPlanAmountExcludeTax | NumFormat}}
              <!-- [{{scope.row._sumContractPlanAmountExcludeTax | NumFormat}}] -->
            </span>
          </template>
        </el-table-column>

        <!-- 税率 -->
        <el-table-column prop="taxRate" :label="'税率(%)'" show-overflow-tooltip width="75">
          <template slot-scope="scope">
            <span
              v-if="scope.row.dataType === '2' || scope.row.isLeaf"
            >{{taxRateFilter(scope.row.taxRate) | rateFormat}}</span>
          </template>
        </el-table-column>

        <!-- 税额 -->
        <el-table-column prop="tax" :label="'税额(元)'" show-overflow-tooltip width="140">
          <template slot-scope="scope">
            <span v-if="scope.row.dataType === '2'">{{scope.row.tax | NumFormat}}</span>
            
            <span v-if="scope.row.dataType === '1' && scope.row.isLeaf">
              <!-- <strong>{{scope.row.tax | NumFormat}}</strong>
              [{{scope.row._sumTax | NumFormat}}]-->
              合计：{{scope.row._sumTax | NumFormat}}
            </span>
          </template>
        </el-table-column>

        <!-- 预估变更比例 【可编辑】-->
        <el-table-column
          prop="reservedChangeRate"
          :label="'预估变更比例(%)'"
          show-overflow-tooltip
          width="120"
        >
          <template slot-scope="scope">
            <!-- view  v-if="!scope.row._editStatus"-->
            <span>
              <span v-if="scope.row.dataType === '2'">{{scope.row.reservedChangeRate | NumFormat}}</span>

              <!-- <span v-if="scope.row.dataType === '1' && scope.row.isLeaf">
                                
                               <strong>{{scope.row.reservedChangeRate}}%</strong>
                                    [{{scope.row._sumReservedChangeRate}}%] 
              </span>-->
            </span>

            <!-- edit -->
            <!-- <el-input v-model.trim.number="scope.row.reservedChangeRate"
                                  :placeholder="'预估变更比例'"
                                  v-if="scope.row._editStatus"
                                   type="number"  onmousewheel="return false;"   
            @blur="handleRowChange('reservedChangeRate',scope.row.reservedChangeRate,scope.row,scope.$index,$event)"></el-input>-->
          </template>
        </el-table-column>

        <!-- 预估变更金额（含税） -->
        <el-table-column
          prop="reservedChangeAmountIncludeTax"
          :label="'预估变更金额(含税)(元)'"
          show-overflow-tooltip
          width="150"
        >
          <template slot-scope="scope">
            <span
              v-if="scope.row.dataType === '2'"
            >{{scope.row.reservedChangeAmountIncludeTax | NumFormat}}</span>
            
            <span v-if="scope.row.dataType === '1' && scope.row.isLeaf">
              <!-- <strong>{{scope.row.reservedChangeAmountIncludeTax | NumFormat}}</strong>
              [{{scope.row._sumReservedChangeAmountIncludeTax | NumFormat}}]-->
              合计：{{scope.row._sumReservedChangeAmountIncludeTax | NumFormat}}
            </span>
          </template>
        </el-table-column>

        <!-- 预估变更金额（不含税） -->
        <el-table-column
          prop="reservedChangeAmountExcludeTax"
          :label="'预估变更金额(不含税)(元)'"
          show-overflow-tooltip
          width="160"
        >
          <template slot-scope="scope">
            <span
              v-if="scope.row.dataType === '2'"
            >{{scope.row.reservedChangeAmountExcludeTax | NumFormat}}</span>
            
            <span v-if="scope.row.dataType === '1' && scope.row.isLeaf">
              <!-- <strong>{{scope.row.reservedChangeAmountExcludeTax | NumFormat}}</strong>
              [{{scope.row._sumReservedChangeAmountExcludeTax | NumFormat}}]-->
              合计：{{scope.row._sumReservedChangeAmountExcludeTax | NumFormat}}
            </span>
          </template>
        </el-table-column>

        <!-- 责任部门 -->
        <el-table-column
          prop="responsibleDeptCode"
          :label="'责任部门'"
          show-overflow-tooltip
          width="70"
        >
          <template slot-scope="scope">
            <!-- <fd-label :code="scope.row.responsibleDeptCode"
            type="cost_subject_responsible_dept_code"></fd-label>-->
            {{selectData.cost_subject_responsible_dept_code[scope.row.responsibleDeptCode]}}
          </template>
        </el-table-column>

        <!-- 分摊规则 -->
        <el-table-column
          prop="apportionmentRuleCode"
          :label="this.$l('lbl_standared_subject_apportionment_rule')"
          show-overflow-tooltip
          width="70"
        >
          <template slot-scope="scope">
            <!-- <fd-label :code="scope.row.apportionmentRuleCode"
            type="cost_subject_apportionment_rule_code"></fd-label>-->
            {{selectData.cost_subject_apportionment_rule_code[scope.row.apportionmentRuleCode]}}
          </template>
        </el-table-column>

        <!-- 操作列 -->
        <el-table-column
          :label="this.$l('lbl_operation')"
          width="100"
          v-if="page.isEdit"
          fixed="right"
        >
          <template slot-scope="scope">
            <div style="text-align:center" v-if="page.isEdit">
              <!-- 添加规划(科目可添加规划) -->
              <!-- 科目金额为0，或为预备费类型叶子科目禁用 按钮 -->
              <el-button
                size="mini"
                type="text"
                icon="el-icon-plus"
                :title="$l('btn_edit')"
                v-if="scope.row.dataType === '1' && scope.row.isLeaf && scope.row.subjectCode.indexOf(page.specialNode) <0 && !scope.row.lockedBy"
                :disabled="scope.row.subjectAmountIncludeTax === 0 || scope.row.reserveCostType === '1'"
                @click="handleAddClick(scope.$index, scope.row)"
              >新增合约</el-button>

              <!-- 删除规划（规划可删除规划） -->
              <el-button
                size="mini"
                type="text"
                icon="el-icon-delete"
                :title="$l('btn_delete')"
                :style="{'color':'red'}"
                v-if="scope.row.dataType === '2' && !scope.row._isNew && !scope.row.lockedBy"
                @click="handleDeleteClick(scope.$index, scope.row)"
              >删除合约</el-button>

              <!-- 撤销当前新增规划（规划可删除规划） -->
              <el-button
                size="mini"
                type="text"
                icon="fa fa-undo"
                style="color:orange"
                :title="$l('btn_delete')"
                :style="{'color':'orange'}"
                v-if="scope.row.dataType === '2' && scope.row._isNew && !scope.row.lockedBy"
                @click="handleDeleteClick(scope.$index, scope.row)"
                :disabled="!scope.row._editStatus"
              >撤销新增</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { LoadingUtil } from "@/utils/common/LoadingUtil";
import { calc } from "@/utils/common/calc";
import {
  getCostContractCommonInfo, // 获取基本信息
  saveOrUpdateContractPlan, // 保存或者更新合约规划
  submitContractPlan, // 提交BPM审批
  checkTargetCostVersion, // 检查成本分期是否有合约规划编制 accounting_object_id
  importSubjectContractPlan, // 引入集团或者其他项目合约规划
  importData, // 导入
  getOtherProjectTemplate, // 其他项目合约规划成本分期列表
  getContractPlanDetail, // 获取明细
  getAccountingObjectCommonInfo // 获取基本信息
} from "@/api/cost/targetCostContractPlanAPI";
import {
  NumFormat, // 千位符
  FLevel,
  dateFormat,
  Version,
  rateFormat
} from "@/filters/cost/";
import upload from "@/components/cost/UploadFile/";
import DesignAlterationAttachmentTable from "@/views/cost/designAlteration/DesignAlterationAttachmentTable";
import AccountingTargetSelector from "@/components/cost/AccountingTargetSelector/";
import ContractPlanSelector from "@/components/cost/ContractPlanSelector/";
import COSTENUM from "@/utils/cost/enum";
import { deepCopy, ifNull } from "@/utils/cost/objectHelper";
import { getSubjectTree } from "@/api/cost/contractPlanTemplateAPI";
import COSTBUSINESS from "@/utils/cost/business";
import { tableHeight } from "@/utils/common/index";
import {
  getLocalItem,
  setLocalItem,
  removeLocalItem
} from "@/utils/common/cache";
import { mapGetters } from "vuex";
import sys_config from "@/config/config.js";
export default {
  data() {
    return {
      flag:false,
      bpmUrl:'',
      showDeleteButton: true,
      
      // 附件列表显隐控制变量
      dialogTableVisible: false,
      gridData: [
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        }
      ],
      calcTableHeight: {
        otherHeight: 230,
        sideCloseHeight: 70
      },
      selectData: {
        cost_flow_status: [],
        cost_stage_id: [],
        cost_subject_responsible_dept_code: [],
        cost_subject_apportionment_rule_code: []
      },
      tableHeight: "0",
      page: {
        specialNode: COSTENUM.SPECIAL_SUBJECT_CODE_FLAG,
        id: "", // 编制id
        isEdit: false,
        statusName: "",
        importFileUrl: COSTBUSINESS.upload(
          process.env.COST_API +
            "/targetCostContractPlan/defineStageVersion/import"
        ),
        contractPlanSelector: {
          // 合约规划树
          operateRowIndex: 0, // 当前操作行
          operateRow: null, // 操作行
          show: false,
          selectNode: null // 当前节点{id:"8a80809964a726790164a727ced80001"}
        },
        attachment: {
          size: 4,
          limit: 4,
          fileList: "",
          attachmentData: [],
          queryModel: {
            pageNum: 1,
            pageSize: 20
          }
        },
      },
      pageStatus: {
        blockDetailActiveName: "",
        expandedLevel: sys_config.expandedLevel, //默认展开二级
        checkSave: true, // 能否保存
        hash: null, //保存数据的hash
        onSubmit: false //正在审批
      },
      queryModel: {
        group: "",
        company: "",
        businessDept: "",
        coprationId: "",
        companyId: "",
        departMentId: "",
        accountingObjectId: "", // 成本分期
        accountingObjectText: "", // 成本分期名称
        stageVersion: "", // 阶段版本
        // 搜索列表
        subjectCode: "",
        subjectName: "",
        subjectCodeOrName: "", //科目编码和名称
        contractPlanName: "",
        contractName: "", //合约规划名称
        show: {
          group: true,
          company: true,
          dept: true,
          account: true
        }
      },
      detailModel: {
        contractPlanAmountIncludeTax: 0, // 合约规划金额(含税)
        updatedBy: null, // 编制人
        status: null, // 审批状态
        flowStatus: null, //流程状态
        contractPlanAmountExcludeTax: 0, // 合约规划金额(不含税)
        updatedDate: null, // 编制日期：
        stageVersion: null, // 版本
        stageId: "", // 阶段
        ownerId: "",
        canImportOrNot: true, // 能否引入
        //新增@2018/10/25
        contractPlanNum: null, //合约规划份数：计算
        segmentationNum: null, //合约标段划分数量
        groupStrategyBuyNum: null, // 集团战略采购份数
        materEquipBuyNum: null, //材料设备采购份数
        groupCenterBuyNum: null, //集团集中采购份数
        projectBuyNum: null, //工程采购份数：
        auditApprovalDate: null //审批通过日期//审批日期
      },
      saveData: null, // 保存和提交的数据结构
      pageModelList: [],
      pageModeEdit: false, // 当前模板编辑状态
      pagePreEditModelList: null,
      pageModel: {
        dataType: null, // 行类型1为科目，2为规划
        subjectId: "", // 科目id
        subjectCode: "", // 成本科目编码data[0].subjectModelList.code
        subjectName: "", // 成本科目名称data[0].subjectModelList.name type===1的有新增规划按钮，type===2的有删除和边界规划按钮
        isLeaf: true, // isLeaf : False
        subjectAmountIncludeTax: 0, // 科目规划金额(含税)
        subjectAmountExcludeTax: 0, // 科目规划金额(不含税)
        // data[0].subjectModelList.targetCostContractPlanModelList.length为科目下的规划，科目显示一行，科目下每一个规划显示一行（规划可增删改）
        contractPlanName: "", // 合约规划data[0].subjectModelList.targetCostContractPlanModelList[i].contractPlanModel.name 【可编辑】
        level1Name: "", // 一级分类data[0].subjectModelList.targetCostContractPlanModelList[i].contractPlanModel.level1Name
        level2Name: "", // 二级分类data[0].subjectModelList.targetCostContractPlanModelList[i].contractPlanModel.level2Name
        responsibleDeptCode: "", // 责任部门data[0].subjectModelList.responsibleDeptCode
        splitRate: 0, // 成本科目比例data[0].subjectModelList.targetCostContractPlanModelList[i].splitRate  【可编辑】
        contractPlanAmountIncludeTax: 0, // 合约规划金额（含税） data[0].subjectModelList.targetCostContractPlanModelList[i].contractPlanAmountIncludeTax 【可编辑】
        contractPlanAmountExcludeTax: 0, // 合约规划金额（不含税) data[0].subjectModelList.targetCostContractPlanModelList[i].contractPlanAmountExcludeTax 前端计算 【自动计算 = 合约规划金额（含税）/（1+税率）】
        taxRate: 0, // 税率data[0].subjectModelList.targetCostContractPlanModelList[i].taxRate
        tax: 0, // 税额data[0].subjectModelList.targetCostContractPlanModelList[i].tax 【自动计算 = 合约规划金额（含税）-合约规划金额（不含税） 】
        reservedChangeRate: 0, // 预估变更比例data[0].subjectModelList.targetCostContractPlanModelList[i].reservedChangeRate  【可编辑】
        reservedChangeAmountIncludeTax: 0, // 预估变更金额（含税）data[0].subjectModelList.targetCostContractPlanModelList[i].reservedChangeAmountIncludeTax  【自动计算 = 合约规划金额（含税）*预估变更比例 】
        reservedChangeAmountExcludeTax: 0, // 预估变更金额（不含税）data[0].subjectModelList.targetCostContractPlanModelList[i].reservedChangeAmountExcludeTax  【自行计算 = 合约规划金额（不含税）*预估变更比例 】
        apportionmentRuleCode: "", // 分摊规则 data[0].subjectModelList.apportionmentRuleCode
        // 规划
        contractPlanModel: null,
        // 辅助字段
        _expanded: true,
        _editStatus: false,
        _isNew: false,
        _show: true,
        // 汇总字段
        _sumTax: 0, // 税额
        _sumSplitRate: 0, // 汇总分摊比例
        _sumContractPlanAmountIncludeTax: 0, // 汇总合约规划金额含税
        _sumContractPlanAmountExcludeTax: 0, // 汇总合约规划金额不含税
        _sumReservedChangeRate: 0, // 汇总预估变更比例
        _sumReservedChangeAmountIncludeTax: 0, // 预估变更金额（含税）
        _sumReservedChangeAmountExcludeTax: 0 // 预估变更金额（不含税）
      },
      saveTemplateModelData: null,
      rowTemplateData: {
        id: null,
        subjectId: null,
        contractPlanId: null,
        type: null,
        stageId: null,
        stageVersion: null,
        ownerId: null,
        splitRate: null,
        reservedChangeRate: null,
        contractPlanAmountIncludeTax: 0,
        contractPlanAmountExcludeTax: 0,
        tax: 0,
        taxRate: 0,
        reservedChangeAmountIncludeTax: 0,
        reservedChangeAmountExcludeTax: 0,
        remark: "合约规划编制",
        status: "1",
        isDeleted: "0",
        contractPlanModel: {
          id: null,
          // 选的直接Model全部返回，不选除去ID返回
          name: null,
          remark: "",
          type: "2",
          level: "4",
          ownerId: null,
          parent: null,
          sort: "1",
          status: "1",
          isDeleted: "0"
        }
      }
    };
  },
  computed: {
    ...mapGetters(["fullScreen"]),
    tHeight: {
      get: function() {
        let _tableHeight =
          document.body.clientHeight - this.calcTableHeight.otherHeight;
        if (!this.$store.getters.sidebar.opened)
          _tableHeight += this.calcTableHeight.sideCloseHeight;
        return _tableHeight + "px";
      },
      set: function() {}
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
    AccountingTargetSelector,
    ContractPlanSelector, // 规划树
    upload,
    DesignAlterationAttachmentTable
  },
  mounted() {
    // alert('5555')
    // window.onresize = () => {
    //   return (() => {
    //     let _tableHeight = document.body.clientHeight - this.calcTableHeight.otherHeight
    //     this.tHeight = _tableHeight + 'px'
    //   })()
    // }
    this.page.id = this.$route.query.accountingObjectId
      ? this.$route.query.accountingObjectId
      : "0";
    if (this.$route.query.accountingObjectId)
      this.queryModel.accountingObjectId = this.$route.query.accountingObjectId
        ? this.$route.query.accountingObjectId
        : "0";
    this.queryModel.stageId = this.$route.query.stageId
      ? this.$route.query.stageId
      : "0";
    this.queryModel.stageVersion = this.$route.query.stageVersion
      ? this.$route.query.stageVersion
      : "0";
    if (this.$route.query.isEdit) {
      this.page.isEdit = this._ToString(this.$route.query.isEdit) === "true";
    } else {
      this.page.isEdit = false;
    }

    if (this.queryModel.accountingObjectId === "0") {
      this.page.statusName = "新增";
      this.$showNormalSuccess("请选择‘成本分期’开始合约规划编制'");
    } else {
      this.page.statusName = this.page.isEdit ? "编辑" : "查看";
    }
    this.getCommonInfo(
      this.queryModel.accountingObjectId,
      this.queryModel.stageId,
      this.queryModel.stageVersion
    );
    this.$nextTick(function() {
      this.tableHeight =
        document.documentElement.clientHeight -
        this.$refs.multipleTable.getBoundingClientRect().top -
        310;
      if (this.tableHeight < 300) this.tableHeight = 300;
      this.$refs.multipleTable.style.Height = this.tableHeight + "px";
    });

    // 字典
    let allDICTIONARY = getLocalItem("DICTIONARY");
    allDICTIONARY = JSON.parse(allDICTIONARY);

    allDICTIONARY["cost_stage_id"].map(item => {
      this.selectData.cost_stage_id[item.dictValue] = item.dictLabelCn;
    });
    allDICTIONARY["cost_flow_status"].map(item => {
      this.selectData.cost_flow_status[item.dictValue] = item.dictLabelCn;
    });
    allDICTIONARY["cost_subject_apportionment_rule_code"].map(item => {
      this.selectData.cost_subject_apportionment_rule_code[item.dictValue] =
        item.dictLabelCn;
    });
    allDICTIONARY["cost_subject_responsible_dept_code"].map(item => {
      this.selectData.cost_subject_responsible_dept_code[item.dictValue] =
        item.dictLabelCn;
    });
  },

  methods: {
    searchEnterFun: function(e) {
      // alert('456')
      // return
      var keyCode = window.event ? e.keyCode : e.which;
      //  console.log('回车搜索',keyCode,e);
      if (keyCode == 13 && this.queryModel.subjectCodeOrName) {
        this.handleSearch();
      }
    },
    filedialog(){
      this.dialogTableVisible = !this.dialogTableVisible;
    },
    changeAttachments(data) {
        // debugger
        // this.ConstructionModel.attachments = data
        this.page.attachment.attachmentData = data
      },
    //科目左边距
    getSubjectCodePaddingLeft(rowData) {
      return (
        (this.getLevel(rowData.subjectCode) - 1) * 10 +
        (rowData.isLeaf ? (this.getLevel(rowData.subjectCode) - 1) * 1 : 0) +
        "px"
      );
    },
    // toString()
    _ToString(value) {
      if (!value) {
        return value;
      } else {
        return value.toString();
      }
    },
    // 显示税率
    taxRateFilter(taxRate) {
      return calc.Mul(ifNull(taxRate, 0), 100);
    },
    // 是否为空
    ifNullValue(value, defaultValue) {
      return ifNull(value, defaultValue);
    },
    // 序号
    indexMethod(index) {
      return index + 1;
    },
    jump(){
      if(this.bpmUrl != ""){
        window.open(this.bpmUrl,"_blank")
      }
    },
    // 初始化基本信息
    initCommonInfoData(resposne) {
      let _resposne = resposne;
      this.detailModel.contractPlanAmountIncludeTax = ifNull(
        _resposne.contractPlanAmountIncludeTax,
        0
      )
        ? ifNull(_resposne.contractPlanAmountIncludeTax, 0)
        : this.$route.query.contractPlanAmountIncludeTax ||
          ifNull(_resposne.targetCostIncludeTax, 0); // 合约规划金额(含税)
      this.detailModel.maker = _resposne.maker; // 编制人
      this.detailModel.status = this.$route.query.status || 0; // 审批状态
      this.detailModel.flowStatus = _resposne.approvalStatusName || ""; //审批状态
      this.bpmUrl = _resposne.tccpBpmUrl
      if(this.bpmUrl != ""){
        this.flag = true
      }
      this.detailModel.contractPlanAmountExcludeTax =
        this.$route.query.contractPlanAmountExcludeTax ||
        ifNull(_resposne.targetCostExcludeTax, 0); // 合约规划金额(不含税)
      this.detailModel.updatedDate = _resposne.makeDate
        ? _resposne.makeDate
        : this.$route.query.updatedDate; // 编制日期：
      this.detailModel.stageVersion = _resposne.stageVersion; // 版本
      this.detailModel.stageId = _resposne.stageId || "";
      this.detailModel.ownerId = _resposne.ownerId || "";
      this.page.attachment.attachmentData = _resposne.attachments
    },
    // 获取基本信息
    getCommonInfo(
      accountingObjectId,
      stageId,
      stageVersion,
      needCheck = false
    ) {
      LoadingUtil.showLoading();
      if (accountingObjectId && accountingObjectId !== "0") {
        LoadingUtil.showLoading();
        getAccountingObjectCommonInfo({
          accountObjectId: accountingObjectId,
          stageId: stageId,
          stageVersion: stageVersion
        })
          .then(response => {
            LoadingUtil.hideLoading();
            this.initCommonInfoData(response.data);
            this.queryModel.accountingObjectId = accountingObjectId;
            needCheck ? this.checkDetail() : this.getDetail();
          })
          .catch(error => {
            console.log(error);
            LoadingUtil.hideLoading();
            this.$showError(error.message ? error.message : "msg_system_error");
          });
      } else {
        this.initCommonInfoData(this.$route.query);
        this.getDetail();
      }
    },
    // 初始化保存数据
    initSaveTemplateData(response, editPageModelList) {
      if (!response.data) return;
      if (response) {
        let _temp = deepCopy(response.data);

        _temp.accountingObjectId = this.queryModel.accountingObjectId;
        _temp.stageId = this.detailModel.stageId;
        _temp.stageVersion = this.queryModel.stageVersion;
        _temp.ownerId = this.queryModel.accountingObjectId;

        if (_temp.subjectModelList) {
          _temp.subjectModelList.map(item => {
            item.targetCostContractPlanModelList = []; // 清空科目下的规划信息
          });
        } else {
          _temp.subjectModelList = [{ targetCostContractPlanModelList: [] }];
        }
        return _temp;
      }
    },
    // 规划树回调函数
    CB_dialogVisible(dialogVisible) {
      this.page.contractPlanSelector.show = dialogVisible;
    },
    // 合约规划树数据
    initContracTreeData() {
      this.page.contractPlanSelector.treeData = [];
    },
    // 选择合约
    selectContractPlan(index, rowData) {
      this.page.contractPlanSelector.show = true;
      this.page.contractPlanSelector.operateRowIndex = index;
      this.page.contractPlanSelector.operateRow = rowData;
    },
    // 合约规划选择事件
    changeCheckedNode(node) {
      let _this = this;
      if (node.children.length === 0) {
        let filterThisParentSubjectContract = this.pageModelList.find(item => {
          return (
            item.contractPlanModel &&
            item.subjectId ===
              _this.page.contractPlanSelector.operateRow.subjectId &&
            item.contractPlanModel.id === node.id
          );
        });
        if (filterThisParentSubjectContract) {
          this.$showNormalError("规划‘" + node.name + "’已存在当前科目");
          return;
        }
        this.page.contractPlanSelector.selectNode = node;
        this.page.contractPlanSelector.operateRow.contractPlanName = node.name;
        this.page.contractPlanSelector.operateRow.level1Name = node.level1Name;
        this.page.contractPlanSelector.operateRow.level2Name = node.level2Name;
        this.page.contractPlanSelector.operateRow.reservedChangeRate =
          ifNull(node.reservedChangeRate, 0) * 1;
        this.page.contractPlanSelector.operateRow.contractPlanModel = node;

        // 预估变更金额（含税）
        this.page.contractPlanSelector.operateRow.reservedChangeAmountIncludeTax = calc.Mul(
          this.page.contractPlanSelector.operateRow
            .contractPlanAmountIncludeTax,
          this.page.contractPlanSelector.operateRow.reservedChangeRate / 100
        );

        // 预估变更金额（不含税）
        this.page.contractPlanSelector.operateRow.reservedChangeAmountExcludeTax =
          calc
            .Div(
              this.page.contractPlanSelector.operateRow
                .reservedChangeAmountIncludeTax,
              calc.Add(this.page.contractPlanSelector.operateRow.taxRate, 1)
            )
            .toFixed(2) / 1;

        this.$set(
          this.pageModelList,
          this.page.contractPlanSelector.operateRowIndex,
          this.page.contractPlanSelector.operateRow
        );
      }
    },
    // 成本分期级联改变
    updateMessage(item) {
      if (item.type === COSTENUM.projectTreeType.TREE_NODE_ACC_OBJ) {
        this.queryModel.accountingObjectId = item.accountingObjectId;
        this.queryModel.accountingObjectText = item.text;
        this.queryModel.companyId = item.companyId;
      } else {
        this.queryModel.accountingObjectId = "";
        this.queryModel.accountingObjectText = "";
        this.queryModel.companyId = item.id;
      }
      this.getCommonInfo(
        this.queryModel.accountingObjectId,
        this.queryModel.stageId,
        this.queryModel.stageVersion,
        true
      );
    },
    // 初始化数据
    initTableData(response) {
      this.pageModeEdit = false;
      if (!response.data) {
        this.$showNormalError("数据异常（没有可用数据）", 5000);
        return;
      }

      if (!response.data.subjectModelList) {
        this.$showNormalError("数据异常（没有可用科目数据）", 5000);
        return;
      }

      if (
        response.data.subjectModelList &&
        response.data.subjectModelList.length === 0
      ) {
        this.$showNormalError("数据异常（科目数据为空）", 5000);
        return;
      }

      let _this = this;
      let newArray = []
      let newStr = ''
      _this.pageModelList = [];
      this.saveData = this.initSaveTemplateData(response, null); // 存储保存的数据结构

      this.detailModel.stageVersion = response.data.stageVersion; // 版本
      this.detailModel.stageId = response.data.stageId || ""; // 当前阶段
      this.detailModel.ownerId = response.data.ownerId || ""; // 所属id
      this.detailModel.canImportOrNot = response.data.canImportOrNot; // 能否引入
      this.page.attachment.attachmentData = response.data.attachments;
      //新增@2018/10/25
      this.detailModel.contractPlanNum = response.data.contractPlanNum; //合约规划份数：计算
      this.detailModel.groupStrategyBuyNum = response.data.groupStrategyBuyNum; // 集团战略采购份数
      this.detailModel.projectBuyNum = response.data.projectBuyNum; //工程采购份数：
      this.detailModel.segmentationNum = response.data.segmentationNum; //合约标段划分数量
      this.detailModel.materEquipBuyNum = response.data.materEquipBuyNum; //材料设备采购份数
      this.detailModel.auditApprovalDate = response.data.auditApprovalDate; //审批通过日期//审批日期
      this.detailModel.groupCenterBuyNum = response.data.groupCenterBuyNum; //集团集中采购份数

      response.data.subjectModelList.map(item => {
        // 遍历科目列表，展开科目和科目下的规划
        // if (item.isLeaf) {
        let _rowSubjectData = deepCopy(this.pageModel);
        _rowSubjectData.dataType = COSTENUM.contractPlanType.SUBJECT;
        _rowSubjectData.subjectId = item.id;
        _rowSubjectData.subjectCode = item.code;
        _rowSubjectData.subjectName = item.name;
        _rowSubjectData.nodeSource = item.nodeSource;
        _rowSubjectData.responsibleDeptCode = item.responsibleDeptCode;
        _rowSubjectData.splitRate = 100;
        _rowSubjectData.taxRate = item.taxRate;
        _rowSubjectData.apportionmentRuleCode = item.apportionmentRuleCode;
        _rowSubjectData.subjectAmountIncludeTax = item.subjectAmountIncludeTax
          ? item.subjectAmountIncludeTax / 1
          : 0; // 科目编制金额(含税)
        _rowSubjectData.subjectAmountExcludeTax = item.subjectAmountExcludeTax
          ? item.subjectAmountExcludeTax / 1
          : 0; // 科目编制金额(不含税)
        _rowSubjectData.reserveCostType = item.reserveCostType; // 预备非类型('1'可以挂规划,'0'不可以)
        _rowSubjectData.isLeaf = item.isLeaf;

        // 辅助字段
        _rowSubjectData._expanded = true;

        // .99不显示
        //没钱的不显示
        if (
          !COSTBUSINESS.checkIsSpecialCode({
            nodeSource: _rowSubjectData.nodeSource,
            code: _rowSubjectData.subjectCode
          }) &&
          _rowSubjectData.subjectAmountIncludeTax > 0
        ) {
          _rowSubjectData._show = true;
        } else {
          _rowSubjectData._show = false;
        }

        //处理默认展开级别
        _rowSubjectData._level = _rowSubjectData.subjectCode
          ? _rowSubjectData.subjectCode.split(".").length
          : 0;
        _rowSubjectData._expanded =
          calc.Mul(ifNull(_rowSubjectData._level, 0), 1) <
          this.pageStatus.expandedLevel + 1;
        _rowSubjectData._show =
          _rowSubjectData._show &&
          calc.Mul(ifNull(_rowSubjectData._level, 0), 1) <
            this.pageStatus.expandedLevel + 2;
        if(item.targetCostContractPlanModelList != null){
          // if (item.targetCostContractPlanModelList.length>0) {
            // alert("大于0")
            for (
              var i = 0;
              i < item.targetCostContractPlanModelList.length;
              i++
            ) {
              // _rowSubjectData.wang +=
              //   item.targetCostContractPlanModelList[i].contractPlanModel.name;
              newArray.push(item.targetCostContractPlanModelList[i].contractPlanModel.name)
              newStr = newArray.join().replace(/,/g, "")
              
            }
            _rowSubjectData.wang = newStr
            newArray = []
            // _rowContractPlanData.wang += item.targetCostContractPlanModelList[i].contractPlanModel.name;
            // _rowSubjectData.targetCostContractPlanModelList = [];
          // } 
        }else{
          _rowSubjectData.wang = ''
        }
        // 是否被锁定，有值九是被锁定
        _rowSubjectData.lockedBy = ifNull(item.lockedBy, "");

        // 插入科目行
        _this.pageModelList.push(_rowSubjectData);
        // 科目规划行 叶子非.99
        if (
          item.targetCostContractPlanModelList &&
          item.isLeaf &&
          !COSTBUSINESS.checkIsSpecialCode({
            nodeSource: _rowSubjectData.nodeSource,
            code: _rowSubjectData.subjectCode
          })
        ) {
          item.targetCostContractPlanModelList.map(item1 => {
            let _rowContractPlanData = deepCopy(_rowSubjectData);

            _rowContractPlanData._show =
              _rowContractPlanData.subjectCode.split(".").length ===
              this.pageStatus.expandedLevel; //合约不显示

            if (item1.contractPlanModel) {
              _rowContractPlanData.dataType =
                COSTENUM.contractPlanType.CONTRACTPlan;

              // 继承科目的金额，方便运算
              _rowContractPlanData.subjectAmountIncludeTax =
                item.subjectAmountIncludeTax / 1; // 科目编制金额(含税)
              _rowContractPlanData.subjectAmountExcludeTax =
                item.subjectAmountExcludeTax / 1; // 科目编制金额(不含税)

              _rowContractPlanData.splitRate = item1.splitRate / 1;
              _rowContractPlanData.taxRate = item1.taxRate / 1;
              _rowContractPlanData.contractPlanAmountIncludeTax =
                ifNull(item1.contractPlanAmountIncludeTax, 0) / 1;
              _rowContractPlanData.contractPlanAmountExcludeTax =
                ifNull(item1.contractPlanAmountExcludeTax, 0) / 1;

              _rowContractPlanData.tax = ifNull(item1.tax, 0); // 税额(元)

              _rowContractPlanData.reservedChangeRate =
                ifNull(item1.contractPlanModel.reservedChangeRate, 0) / 1;

              // 预估变更金额（含税）(元)
              _rowContractPlanData.reservedChangeAmountIncludeTax = ifNull(
                item1.reservedAmountIncludeTax
              );
              // 预估变更金额（不含税）(元)
              _rowContractPlanData.reservedChangeAmountExcludeTax = ifNull(
                item1.reservedAmountExcludeTax,
                0
              );

              if (item1.contractPlanModel) {
                _rowContractPlanData.contractPlanName =
                  item1.contractPlanModel.name;
                _rowContractPlanData.level1Name =
                  item1.contractPlanModel.level1Name;
                _rowContractPlanData.level2Name =
                  item1.contractPlanModel.level2Name;
              }
              _rowContractPlanData.contractPlanModel = item1.contractPlanModel;

              // 是否被锁定，有值九是被锁定
              _rowContractPlanData.lockedBy = ifNull(item1.lockedBy, "");

              //设计变更金额
              _rowContractPlanData.designChangeEvisaTotalAmt =
                item1.designChangeEvisaTotalAmt;

              //无合同费用
              _rowContractPlanData.nonContractTotalAmt =
                item1.nonContractTotalAmt;
              //合同金额
              _rowContractPlanData.contractTotalAmt = item1.contractTotalAmt;

              //签订合同时合约金额分配到每个科目的比例
              _rowContractPlanData.splitCpAmtToSbRate =
                item1.splitCpAmtToSbRate;
              //项目id
              _rowContractPlanData.projectId = item1.projectId;

              // 插入科目规划行
              _this.pageModelList.push(_rowContractPlanData);
            }
          });
        } else {
        }
        // }
      });
      this.calcSubjectData();
      if (this.page.isEdit) this.handleEdit();

      this.pageStatus.hash = calc.Hash(this.prepareSaveData());
      console.log("initTableData:" + this.pageStatus.hash);
    },
    // 初始化excel导入数据
    initImportData(response) {
      if (!response.data) {
        this.$showNormalError("没有可用数据");
        LoadingUtil.hideLoading();
        return;
      } else {
        this.initTableData(response);
      }
    },
    // 计算科目数据（汇总合约规划行）
    calcSubjectData(index, rowData) {
      let _subjectList = [];
      if (index && rowData) {
        console.log("汇总" + rowData.subjectName);
        _subjectList[rowData.subjectCode] = rowData;

        _subjectList[rowData.subjectCode]._sumContractPlanAmountIncludeTax = 0;
        _subjectList[rowData.subjectCode]._sumSplitRate = 0;
        _subjectList[rowData.subjectCode]._sumContractPlanAmountExcludeTax = 0;
        _subjectList[rowData.subjectCode]._sumTax = 0;
        _subjectList[
          rowData.subjectCode
        ]._sumReservedChangeAmountIncludeTax = 0;
        _subjectList[
          rowData.subjectCode
        ]._sumReservedChangeAmountExcludeTax = 0;
      } else {
        console.log("汇总全部");
        this.pageModelList.map(item => {
          if (item.dataType === COSTENUM.contractPlanType.SUBJECT) {
            _subjectList[item.subjectCode] = item;
            _subjectList[item.subjectCode]._sumContractPlanAmountIncludeTax = 0;
            _subjectList[item.subjectCode]._sumSplitRate = 0;
            _subjectList[item.subjectCode]._sumContractPlanAmountExcludeTax = 0;
            _subjectList[item.subjectCode]._sumTax = 0;
            _subjectList[
              item.subjectCode
            ]._sumReservedChangeAmountIncludeTax = 0;
            _subjectList[
              item.subjectCode
            ]._sumReservedChangeAmountExcludeTax = 0;
          }
        });
      }
      this.pageModelList.map(item => {
        if (item.dataType === COSTENUM.contractPlanType.CONTRACTPlan) {
          if (_subjectList[item.subjectCode]) {
            _subjectList[
              item.subjectCode
            ]._sumContractPlanAmountIncludeTax = calc.Add(
              ifNull(
                _subjectList[item.subjectCode]._sumContractPlanAmountIncludeTax,
                0
              ),
              ifNull(item.contractPlanAmountIncludeTax, 0)
            );
            _subjectList[item.subjectCode]._sumSplitRate = calc.Add(
              ifNull(_subjectList[item.subjectCode]._sumSplitRate, 0),
              ifNull(item.splitRate, 0)
            );
            _subjectList[
              item.subjectCode
            ]._sumContractPlanAmountExcludeTax = calc.Add(
              ifNull(
                _subjectList[item.subjectCode]._sumContractPlanAmountExcludeTax,
                0
              ),
              ifNull(item.contractPlanAmountExcludeTax, 0)
            );
            _subjectList[item.subjectCode]._sumTax = calc.Add(
              ifNull(_subjectList[item.subjectCode]._sumTax, 0),
              ifNull(item.tax, 0)
            );
            _subjectList[
              item.subjectCode
            ]._sumReservedChangeAmountIncludeTax = calc.Add(
              ifNull(
                _subjectList[item.subjectCode]
                  ._sumReservedChangeAmountIncludeTax,
                0
              ),
              ifNull(item.reservedChangeAmountIncludeTax, 0)
            );
            _subjectList[
              item.subjectCode
            ]._sumReservedChangeAmountExcludeTax = calc.Add(
              ifNull(
                _subjectList[item.subjectCode]
                  ._sumReservedChangeAmountExcludeTax,
                0
              ),
              ifNull(item.reservedChangeAmountExcludeTax, 0)
            );
          }
        }
      });
      // console.info(_subjectList)
      this.pageModelList.map(item => {
        if (
          item.dataType === COSTENUM.contractPlanType.SUBJECT &&
          _subjectList[item.subjectCode]
        ) {
          // console.info(_subjectList[item.subjectCode])
          if (_subjectList[item.subjectCode]) {
            item._sumContractPlanAmountIncludeTax =
              _subjectList[item.subjectCode]._sumContractPlanAmountIncludeTax *
              1;
            item._sumSplitRate =
              _subjectList[item.subjectCode]._sumSplitRate * 1;
            item._sumContractPlanAmountExcludeTax =
              _subjectList[item.subjectCode]._sumContractPlanAmountExcludeTax *
              1;
            item._sumTax = _subjectList[item.subjectCode]._sumTax * 1;
            item._sumReservedChangeAmountIncludeTax =
              _subjectList[item.subjectCode]
                ._sumReservedChangeAmountIncludeTax * 1;
            item._sumReservedChangeAmountExcludeTax =
              _subjectList[item.subjectCode]
                ._sumReservedChangeAmountExcludeTax * 1;
          }
        }
      });
    },
    // 计算行数据(成本科目比例splitRate，合约规划金额contractPlanAmountIncludeTax，预估变更比例reservedChangeRate)
    calcRowData(index, rowData, fieldType) {
      let _rowData = rowData; // JSON.parse(JSON.stringify(rowData))
      fieldType = this._ToString(fieldType);
      switch (fieldType) {
        case "splitRate":
          _rowData.contractPlanAmountIncludeTax =
            calc.Mul(
              _rowData.subjectAmountIncludeTax,
              _rowData.splitRate / 100
            ) / 1; // 合约规划金额(含税)
          break;
        case "contractPlanAmountIncludeTax":
          _rowData.splitRate =
            (
              calc.Div(
                _rowData.contractPlanAmountIncludeTax,
                _rowData.subjectAmountIncludeTax
              ) * 100
            ).toFixed(2) / 1;
          break;
        case "reservedChangeRate":
          break;
      }
      _rowData.contractPlanAmountExcludeTax =
        calc
          .Div(_rowData.contractPlanAmountIncludeTax, 1 + _rowData.taxRate)
          .toFixed(2) / 1; // 合约规划金额(不含税)
      _rowData.tax =
        calc
          .Sub(
            _rowData.contractPlanAmountIncludeTax,
            _rowData.contractPlanAmountExcludeTax
          )
          .toFixed(2) / 1; // 税额

      _rowData.reservedChangeAmountIncludeTax = calc.Mul(
        _rowData.contractPlanAmountIncludeTax,
        _rowData.reservedChangeRate / 100
      ); // 预估变更金额（含税）
      _rowData.reservedChangeAmountExcludeTax =
        calc
          .Div(
            _rowData.reservedChangeAmountIncludeTax,
            calc.Add(_rowData.taxRate, 1)
          )
          .toFixed(2) / 1; // 预估变更金额（不含税）

      // debugger
      // this.pageModelList[index] = _rowData
      this.calcSubjectData(index, _rowData); // 汇总科目
    },
    // 新增规划获取默认行数据
    getDefaultRow(index, rowData) {
      let _newRow = deepCopy(this.pageModel);
      _newRow.subjectId = rowData.subjectId;
      _newRow.subjectAmountIncludeTax = ifNull(
        rowData.subjectAmountIncludeTax,
        0
      );
      _newRow.dataType = COSTENUM.contractPlanType.CONTRACTPlan;
      return _newRow;
    },
    // 回去规划记录插入的行位置
    getInsertRowIndex(parentIndex, parentCode) {
      let _list = this.pageModelList.filter(item => {
        return item.subjectCode === parentCode;
      });
      // 获取待插入的行号
      return parentIndex + _list.length;
    },
    // 在叶子科目下添加规划，添加到当前叶子规划的最后面
    handleAddClick(index, rowData) {
      // if (this.pageModeEdit) {
      //     this.$showNormalError('请完成或撤销当前编辑')
      //     return
      // }
      if (rowData.reserveCostType === "1") {
        this.$showNormalError("预备费类型不可以挂规划");
        return;
      }
      if (rowData.subjectAmountIncludeTax === 0) {
        this.$showNormalError("科目金额为0");
        return;
      }
      // debug
      const _this = this;
      // 获取默认数据
      const _row = this.getDefaultRow(index, rowData);

      // 获取父科目信息
      let _parentSubjectItem = this.pageModelList.find(item => {
        return (
          item.dataType === COSTENUM.contractPlanType.SUBJECT &&
          item.subjectCode === rowData.subjectCode
        );
      });

      // 返回的code
      _row.taxRate = rowData.taxRate;
      _row.subjectCode = rowData.subjectCode;
      _row.apportionmentRuleCode = rowData.apportionmentRuleCode;
      _row.subjectAmountExcludeTax = _parentSubjectItem.subjectAmountExcludeTax;
      _row.subjectAmountIncludeTax = _parentSubjectItem.subjectAmountIncludeTax;
      _row.responsibleDeptCode = _parentSubjectItem.responsibleDeptCode;
      _row._expanded = true;
      _row._isNew = true;
      _row._show = true;
      _row._editStatus = true;
      let _insertIndex = this.getInsertRowIndex(index, rowData.subjectCode);
      // 给当前sheet添加节点
      this.pageModelList.splice(_insertIndex, 0, _row);
    },
    // 在叶子科目下删除规划
    handleDeleteClick(index, rowData) {
      // if (this.pageModeEdit) {
      //     this.$showNormalError('请完成或撤销当前编辑')
      //     return
      // }
      this.pageModelList.splice(index, 1);
      this.calcSubjectData(); // 重算科目汇总
    },

    // 加载成本分期的规划编制信息
    loadAccountContractDetail(accountingObjectId) {
      this.checkDetail();
    },
    // 其他项目模板选中事件
    handleSelectOtherProjectTemplate(index, rowData) {
      this.$confirm("确认引入‘" + rowData.accountingObjectName + "‘模板？", {
        confirmButtonText: this.$l("btn_confirm"),
        cancelButtonText: this.$l("btn_cancel"),
        type: "warning"
      })
        .then(() => {
          LoadingUtil.showLoading();
          importSubjectContractPlan({
            type: "2",
            accountingObjectId: rowData.accountingObjectId,
            currentAccountingObjectId: this.queryModel.accountingObjectId
          })
            .then(response => {
              // this.$showSuccess(response.message)
              this.initTableData(response);
              LoadingUtil.hideLoading();
            })
            .catch(error => {
              LoadingUtil.hideLoading();
              console.log(error);
              this.$showError(
                error.message ? error.message : "msg_system_error"
              );
            });
        })
        .catch(() => {});
    },
    // 获取级别
    getLevel(parentCode) {
      return parentCode.split(".").length;
    },
    // 展开收起
    handleExpandClick(subjectCode) {
      let parentExpanded;
      this.pageModelList.map(item => {
        if (item.subjectCode === subjectCode && item.dataType === "1") {
          item._expanded = !item._expanded;
          parentExpanded = item._expanded;
        }
        if (
          item.subjectCode.indexOf(subjectCode) > -1 &&
          item.subjectCode !== subjectCode
        ) {
          item._show = parentExpanded;
          item._expanded = parentExpanded;
        }
        if (item.subjectCode === subjectCode && item.dataType === "2") {
          item._show = parentExpanded;
        }

        if (
          COSTBUSINESS.checkIsSpecialCode({
            nodeSource: item.nodeSource,
            code: item.subjectCode
          })
        ) {
          item._show = false; // .99不线上
        }
      });
    },
    // 输入验证
    handleRowChange(fieldType, fieldInputValue, rowData, index, event) {
      let _reg = "";
      let _errmsg = null;
      let fieldValue = fieldInputValue;
      if (fieldValue.length === 0) {
        this.$showError("输入错误！");
        this.pageStatus.checkSave = false;
        // event.currentTarget.focus()
        return;
      }
      if (
        [
          "reservedChangeRate",
          "splitRate",
          "reservedChangeRate",
          "contractPlanAmountIncludeTax"
        ].indexOf(fieldType) > -1
      ) {
        debugger;
        switch (fieldType) {
          case "contractPlanAmountIncludeTax":
            if (
              rowData.contractPlanAmountIncludeTax >
              rowData.subjectAmountIncludeTax
            ) {
              _errmsg = "输入错误：规划金额突破";
            }
            break;
          case "splitRate":
            if (rowData.splitRate > 100 || rowData.splitRate < 0) {
              _errmsg = "输入错误：规划比例（0-100）";
            }
            break;
          default:
            break;
        }
        if (_errmsg) {
          // event.currentTarget.focus()
          this.$showNormalError(_errmsg);
          this.pageStatus.checkSave = false;
        }
        this.pageStatus.checkSave = true;
        // 计算行数据(成本科目比例splitRate，合约规划金额reservedChangeAmountIncludeTax，预估变更比例reservedChangeRate
        this.calcRowData(index, rowData, fieldType);
      }
    },
    // 行显示
    showRow(row) {
      // 行隐藏
      const show = row.row._show;
      let background =
        row.row.dataType === "1" && row.row.isLeaf ? "font-weight: bold;" : "";
      return show
        ? "animation:treeTableShow 1s;-webkit-animation:treeTableShow 1s;" +
            background
        : "display:none;" + background;
    },
    // 返回列表页面
    handleBack() {
      this.$router.push({
        name: "TargetCostContractPlanList"
      });
    },
    // 搜索当前科目树
    handleSearch() {
      let _this = this;
      LoadingUtil.showLoading();
      if (!this.queryModel.subjectCodeOrName) {
        this.pageModelList.map(item => {
          item._show = !COSTBUSINESS.checkIsSpecialCode({
            nodeSource: item.nodeSource,
            code: item.subjectCode
          }); // .99不显示
        });
      } else {
        if (this.queryModel.subjectCodeOrName)
          this.queryModel.subjectCodeOrName = this.queryModel.subjectCodeOrName.trim();

        let filterData = this.pageModelList.filter(function(item) {
          return (
            item.subjectCode.indexOf(_this.queryModel.subjectCodeOrName) > -1 ||
            item.subjectName.indexOf(_this.queryModel.subjectCodeOrName) > -1 ||
            item.wang.indexOf(_this.queryModel.subjectCodeOrName) > -1
          );
        });

        if (filterData.length === 0) {
          LoadingUtil.hideLoading();
          this.pageModelList.map(item => {
            item._show = false;
          });
          this.$showNormalError("没有符合条件的数据");
          return;
        }

        this.pageModelList.map(item => {
          if (
            item.subjectCode.indexOf(_this.queryModel.subjectCodeOrName) > -1 ||
            item.subjectName.indexOf(_this.queryModel.subjectCodeOrName) > -1 ||
            item.wang.indexOf(_this.queryModel.subjectCodeOrName) > -1
          ) {
            item._show = !COSTBUSINESS.checkIsSpecialCode({
              nodeSource: item.nodeSource,
              code: item.subjectCode
            }); // .99不显示
          } else {
            item._show = false;
          }
        });
      }
      LoadingUtil.hideLoading();
    },
    // 获取集团科目模板
    handleUseCorporationTemplate() {
      if (!this.detailModel.canImportOrNot) {
        this.$showNormalError("当前阶段不可引入模板");
        return;
      }
      if (!this.queryModel.accountingObjectId) {
        this.$showNormalError("请选择成本分期");
        return;
      }
      this.$confirm("确认引入集团模板？", {
        confirmButtonText: this.$l("btn_confirm"),
        cancelButtonText: this.$l("btn_cancel"),
        type: "warning"
      })
        .then(() => {
          LoadingUtil.showLoading();
          importSubjectContractPlan({
            type: "0",
            accountingObjectId: null,
            currentAccountingObjectId: this.queryModel.accountingObjectId
          })
            .then(response => {
              LoadingUtil.hideLoading();
              // this.$showSuccess(response.message)
              this.initTableData(response);
            })
            .catch(error => {
              LoadingUtil.hideLoading();
              console.log(error);
              this.$showError(
                error.message ? error.message : "msg_system_error"
              );
            });
        })
        .catch(() => {});
    },
    // 上传
    handleUploadBefore(file) {
      this.fileName = file.name;
      var extension =
        file.name.split(".")[1] === "xlsx" || file.name.split(".")[1] === "xls";
      var isLt2M = file.size / 1024 / 1024 / 50 < 1;
      if (!extension) {
        this.$showError("文件扩展名错误");
      }
      if (!isLt2M) {
        this.$showError("excel超出大小");
      }
      return extension && isLt2M;
    },
    // 导入
    handleUploadSuccess(response, file, fileList) {
      const _this = this;
      if (response.code !== "2000") {
        this.$showError(response.message);
      } else {
        if (response.status !== "404" && response && response.data) {
          // todo
          _this.initImportData(response);
          _this.$showNormalSuccess("导入成功");
        }
        this.$showSuccess(response.message);
      }
    },
    // 导出
    handleExport() {
      let _this = this;
      this.handleSave(
        false,
        function() {
          COSTBUSINESS.download(
            process.env.COST_API +
              "/targetCostContractPlan/defineStageVersion/export?editType=1&accountingObjectId=" +
              _this.queryModel.accountingObjectId +
              "&stageId=" +
              _this.queryModel.stageId +
              "&stageVersion=" +
              _this.queryModel.stageVersion
          );
        },
        true
      );
    },
    // 编辑
    handleEdit() {
      this.pagePreEditModelList = deepCopy(this.pageModelList);
      this.pageModeEdit = true;
      this.pageModelList.map(item => {
        if (item.dataType === COSTENUM.contractPlanType.CONTRACTPlan)
          item._editStatus = true;
      });
    },
    // 撤销编辑
    handleUndo() {
      this.pageModelList = deepCopy(this.pagePreEditModelList);
      this.pageModeEdit = false;
      this.pageModelList.map(item => {
        if (item.dataType === COSTENUM.contractPlanType.CONTRACTPlan)
          item._editStatus = false;
      });
      this.pagePreEditModelList = null;
    },
    // 获取成本分期明细
    getDetail() {
      LoadingUtil.showLoading();
      if (
        this.queryModel.accountingObjectId &&
        this.queryModel.accountingObjectId !== "0"
      ) {
        let _stageId = this.queryModel.stageId;
        let _stageVersion = this.queryModel.stageVersion;
        if (this.page.id === "0") {
          _stageId = this.detailModel.stageId
            ? this.detailModel.stageId
            : this.queryModel.stageId;
          _stageVersion = this.detailModel.stageVersion
            ? this.detailModel.stageVersion
            : this.queryModel.stageVersion;
        }
        getContractPlanDetail({
          accountingObjectId: this.queryModel.accountingObjectId,
          stageId: _stageId,
          stageVersion: _stageVersion
        })
          .then(response => {
            // this.$showSuccess(response.message)
            this.initTableData(response);
            LoadingUtil.hideLoading();
          })
          .catch(error => {
            console.log(error);
            LoadingUtil.hideLoading();
            this.$showError(error.message ? error.message : "msg_system_error");
          });
      } else {
        LoadingUtil.hideLoading();
      }
    },
    // 检查成本分期是否有规划
    checkDetail() {
      if (this.$route.query.accountingObjectId) return;
      LoadingUtil.showLoading();
      if (
        this.queryModel.accountingObjectId &&
        this.queryModel.accountingObjectId !== "0"
      ) {
        checkTargetCostVersion({
          accountingObjectId: this.queryModel.accountingObjectId
        })
          .then(response => {
            // this.$showSuccess(response.message)
            if (response.data) {
              this.page.isEdit = true;
              this.initTableData(response);
            } else {
              this.$showNormalError(
                response.message ? response.message : "msg_system_error"
              );
            }
            LoadingUtil.hideLoading();
          })
          .catch(error => {
            this.page.isEdit = false;
            console.log(error);
            LoadingUtil.hideLoading();
            this.$showNormalError(error.message ? error.message : "系统错误");
          });
      }
    },
    // 准备保存数据
    prepareSaveData() {
      try {
        let _saveData = this.saveData; // rowTemplateData
        _saveData.stageId = this.detailModel.stageId;
        _saveData.stageVersion = this.detailModel.stageVersion;
        //新增
        //_saveData.contractPlanNum = this.detailModel.contractPlanNum//合约规划份数：计算
        _saveData.segmentationNum = this.detailModel.segmentationNum; //合约标段划分数量
        _saveData.groupStrategyBuyNum = this.detailModel.groupStrategyBuyNum; // 集团战略采购份数
        _saveData.materEquipBuyNum = this.detailModel.materEquipBuyNum; //材料设备采购份数
        _saveData.groupCenterBuyNum = this.detailModel.groupCenterBuyNum; //集团集中采购份数
        _saveData.projectBuyNum = this.detailModel.projectBuyNum; //工程采购份数：
        _saveData.attachments = this.page.attachment.attachmentData; // 附件

        _saveData.subjectModelList.map(item => {
          let _targetCostContractPlanModelList = [];
          this.pageModelList.map(item1 => {
            if (item1.subjectCode === item.code && item1.dataType === "2") {
              let _contractPlanItem = deepCopy(this.rowTemplateData);

              _contractPlanItem.subjectId = item1.subjectId;
              _contractPlanItem.contractPlanId = item1.contractPlanModel.id;
              _contractPlanItem.type = "2";
              _contractPlanItem.stageId = this.detailModel.stageId;
              _contractPlanItem.stageVersion = this.detailModel.stageVersion;
              _contractPlanItem.ownerId = this.detailModel.ownerId;
              _contractPlanItem.splitRate = item1.splitRate;
              _contractPlanItem.reservedChangeRate = item1.reservedChangeRate;
              _contractPlanItem.contractPlanAmountIncludeTax =
                item1.contractPlanAmountIncludeTax;
              _contractPlanItem.contractPlanAmountExcludeTax =
                item1.contractPlanAmountExcludeTax;
              _contractPlanItem.tax = item1.tax;
              _contractPlanItem.taxRate = item1.taxRate;
              _contractPlanItem.reservedChangeAmountIncludeTax =
                item1.reservedChangeAmountIncludeTax;
              _contractPlanItem.reservedChangeAmountExcludeTax =
                item1.reservedChangeAmountExcludeTax;

              //设计变更金额
              _contractPlanItem.designChangeEvisaTotalAmt =
                item1.designChangeEvisaTotalAmt;
              //无合同费用
              _contractPlanItem.nonContractTotalAmt = item1.nonContractTotalAmt;
              //合同金额
              _contractPlanItem.contractTotalAmt = item1.contractTotalAmt;

              //签订合同时合约金额分配到每个科目的比例
              _contractPlanItem.splitCpAmtToSbRate = item1.splitCpAmtToSbRate;
              //项目id
              _contractPlanItem.projectId = item1.projectId;

              // 规划
              _contractPlanItem.contractPlanModel = item1.contractPlanModel;

              _targetCostContractPlanModelList.push(_contractPlanItem);
            }
          });
          item.targetCostContractPlanModelList = _targetCostContractPlanModelList;
        });
        // let _param = {
        //     // accountingObjectId: this.queryModel.accountingObjectId,
        //     // stageId: this.detailModel.stageId,
        //     // stageVersion: this.queryModel.stageVersion,
        //     // ownerId: this.queryModel.accountingObjectId,
        //     targetCostContractPlanModel: _saveData
        // }
        _saveData.stageId = this.detailModel.stageId;
        _saveData.stageVersion = this.detailModel.stageVersion;
        let _param = _saveData;
        return _param;
      } catch (error) {
        this.$showNormalError("请正确维护成本");
        LoadingUtil.hideLoading();
      }
    },
    // 检查输入项目
    checkSaveOrSubmit(isFromExport = false) {
      let message = "";
      //表头明细
      if (!isFromExport) {
        if (
          (!this.detailModel.segmentationNum &&
            this.detailModel.segmentationNum !== 0) ||
          (!this.detailModel.groupStrategyBuyNum &&
            this.detailModel.groupStrategyBuyNum !== 0) ||
          (!this.detailModel.materEquipBuyNum &&
            this.detailModel.materEquipBuyNum !== 0) ||
          (!this.detailModel.groupCenterBuyNum &&
            this.detailModel.groupCenterBuyNum !== 0) ||
          (!this.detailModel.projectBuyNum &&
            this.detailModel.projectBuyNum !== 0)
        ) {
          this.$showNormalError("请填写明细信息");
          this.pageStatus.blockDetailActiveName = "1";
          message = "请填写明细信息";
          return message;
        }
      }

      for (let i = 0; i < this.pageModelList.length; i++) {
        let item = this.pageModelList[i];
        let check = true;
        // 检查 叶子科目(非.99)下挂规划金额合计是否和 科目金额一致(科目金额必须>0)
        // 检查 叶子科目(非.99)下必须挂一个规划
        // 排除预备费类型
        if (
          item.dataType === COSTENUM.contractPlanType.SUBJECT &&
          item.isLeaf &&
          item.reserveCostType !== "1" &&
          !COSTBUSINESS.checkIsSpecialCode({
            nodeSource: item.nodeSource,
            code: item.subjectCode
          }) &&
          item.subjectAmountIncludeTax > 0
        ) {
          if (
            item._sumContractPlanAmountIncludeTax !==
            item.subjectAmountIncludeTax
          ) {
            message =
              "科目[" +
              item.subjectName +
              "]规划分摊未完成(合约分摊金额合计≠目标成本金额)";
            check = false;
          }
        }

        // 规划必须选择合约
        if (item.dataType === COSTENUM.contractPlanType.CONTRACTPlan) {
          if (!item.contractPlanModel) {
            //message = '第' + (i + 1) + '行没有选择合约规划'
            message =
              item.subjectName +
              "(" +
              item.subjectCode +
              ")" +
              "下存在没有选择合约的记录";
            check = false;
          }
        }
        if (!check) break;
      }
      this.$showNormalError(message);
      return message;
    },
    //设置为提交状态
    setSubmitStatus() {
      this.pageStatus.onSubmit = true; //正在提交
    },
    resetSubmitStatus() {
      this.pageStatus.onSubmit = false; //非提交
    },
    // 保存
    handleSave(autoSubmit = false, callBack, isFromExport = false) {
      //LoadingUtil.showLoading()
      if (autoSubmit) this.setSubmitStatus();
      if (!this.pageStatus.checkSave) {
        this.$showNormalError("输入数据错误，请修正！");
        if (autoSubmit) this.resetSubmitStatus();
        LoadingUtil.hideLoading();
        return;
      }
      if (this.checkSaveOrSubmit(isFromExport)) {
        LoadingUtil.hideLoading();
        if (autoSubmit) this.resetSubmitStatus();
        return;
      }
      let _param = this.prepareSaveData();

      //检查数据是否修改
      if (calc.Hash(_param) === this.pageStatus.hash) {
        autoSubmit
          ? this.handleSubmit()
          : isFromExport ? callBack() : this.$showSuccess("保存成功"); //数据未修改给出”保存成功信息“
        return;
      }

      saveOrUpdateContractPlan(_param)
        .then(response => {
          LoadingUtil.hideLoading();
          // this.getDetail()
          if (response.data) {
            this.detailModel.stageId = response.data.stageId;
            this.detailModel.stageVersion = response.data.stageVersion;
            this.queryModel.stageId = response.data.stageId;
            this.queryModel.stageVersion = response.data.stageVersion;
          }
          this.getCommonInfo(
            this.queryModel.accountingObjectId,
            this.queryModel.stageId,
            this.queryModel.stageVersion
          );
          this.initTableData(response);
          if (autoSubmit) {
            this.handleSubmit();
          } else {
            //有回调不提示信息
            if (!callBack) this.$showSuccess(response.message);
          }
          if (callBack) {
            callBack();
          }
        })
        .catch(error => {
          LoadingUtil.hideLoading();
          console.log(error);
          if (autoSubmit) this.resetSubmitStatus();
          this.$showError(error.message ? error.message : "msg_system_error");
        });
    },
    // 提交
    handleSubmit() {
      LoadingUtil.showLoading();
      if (this.pageModelList && this.pageModelList.length === 0) {
        this.$showNormalError("审批数据不可为空");
        this.resetSubmitStatus();
        LoadingUtil.hideLoading();
        return;
      }
      if (this.checkSaveOrSubmit()) {
        LoadingUtil.hideLoading();
        this.resetSubmitStatus();
        return;
      }

      let _param = this.prepareSaveData();
      submitContractPlan(_param)
        .then(response => {
          LoadingUtil.hideLoading();
          this.$showSuccess(response.message);
          this.handleBack();
        })
        .catch(error => {
          LoadingUtil.hideLoading();
          console.log(error);
          this.$showError(error.message ? error.message : "msg_system_error");
        });
    }
  },
  watch: {
    // 成本分期变化
    "queryModel.accountingObjectId": function(newValue, oldValue) {
      if (newValue && newValue !== "0" && newValue !== oldValue) {
      }
    },
    "page.contractPlanSelector.selectNode": function(newValue, oldValue) {
      this.changeCheckedNode(newValue);
    },
    fullScreen: function(newValue, oldValue) {
      // let _tableHeight = document.body.clientHeight - this.calcTableHeight.otherHeight
      // this.tHeight = _tableHeight + 'px'
    }
  }
};
</script>
<style scoped>
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
.file_col {
  text-decoration: underline;
  color: blue;
}
.file {
  display: flex;
  margin-bottom: 20px;
}
.file_font {
  line-height: 28px;
}
.col{
  color: blue;
  text-decoration: underline;
  cursor: pointer;
}
</style>
