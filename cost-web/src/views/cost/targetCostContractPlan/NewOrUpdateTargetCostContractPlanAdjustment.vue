<!--合约规划变更-->
<!-- NewOrUpdateTargetCostCompilation -->
<template>
  <div class="app-container">
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
    <el-row v-show="false">
      <!-- 成本分期选择级联 -->
      <AccountingTargetSelector
        @updateMessage="updateMessage"
        :valueObjectId="queryModel"
        :showNoPhaseIfHavePhase="false"
        :showTobe="false"
        :disabled="{
                                            group: true,
                                            company: true,
                                            businessDept: true,
                                            accountingObject: true
                                        }"
        :queryModel="queryModel"
      ></AccountingTargetSelector>
    </el-row>

    <!-- 明细信息 -->
    <el-row style="margin-bottom:5px;border:none">
      <el-collapse v-model="pageStatus.blockDetailActiveName" accordion style="font-size:24px">
        <el-collapse-item name="1">
          <template slot="title">
            <strong style="padding-left:10px">
              明细信息(
              <font color="red">合约规划调整</font>
              {{detailModel.accountingObjectText}} {{page.statusName}})
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
                <div class="detailValue">
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
                <div class="detailValue">{{detailModel.contractPlanNum | NumFormat}}</div>
              </el-col>
              <el-col :span="8">
                <div class="detailLabel">
                  <font color="red">*</font>合约标段划分数量：
                </div>
                <div class="detailValue">
                  <span v-if="!page.isEdit">{{detailModel.segmentationNum | NumFormat}}</span>
                  <el-input-number
                    v-model.trim.number="detailModel.segmentationNum"
                    :placeholder="'请输入'"
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
                    :placeholder="'请输入'"
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
                    :placeholder="'请输入'"
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
                    :placeholder="'请输入'"
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

            <!-- 第五行 -->
            <el-row>
              <el-col :span="8" :offset="1">
                <div class="detailLabel">
                  <font color="red">*</font>合约规划调整范围：
                </div>
                <div class="detailValue">
                  <fd-label
                    :code="detailModel.cpAdjustRange"
                    type="cost_cpAdjustRange"
                    v-if="!page.isEdit"
                  ></fd-label>
                  <fd-select
                    v-model="detailModel.cpAdjustRange"
                    type="cost_cpAdjustRange"
                    :placeholder="'请选择'"
                    :clearable="false"
                    style="width:100px;height:28px"
                    v-if="page.isEdit"
                  ></fd-select>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="detailLabel">
                  <font color="red">*</font>调整涉及金额：
                </div>
                <div class="detailValue">
                  <span v-if="!page.isEdit">{{detailModel.adjustAmt | NumFormat}}</span>
                  <el-input-number
                    v-model.trim.number="detailModel.adjustAmt"
                    :placeholder="'请输入'"
                    clearable
                    :controls="false"
                    :min="0"
                    :precision="2"
                    onmousewheel="return false;"
                    :maxlength="20"
                    v-if="page.isEdit"
                    style="width:100px;"
                  />
                </div>
              </el-col>
              <el-col :span="7">
                <div class="detailLabel">
                  <font color="red">*</font>工程采购份数：
                </div>
                <div class="detailValue">
                  <span v-if="!page.isEdit">{{detailModel.projectBuyNum | NumFormat}}</span>
                  <el-input-number
                    v-model.trim.number="detailModel.projectBuyNum"
                    :placeholder="'请输入'"
                    :controls="false"
                    :min="0"
                    :precision="0"
                    onmousewheel="return false;"
                    clearable
                    :maxlength="20"
                    v-if="page.isEdit"
                    style="width:100px;"
                  />
                </div>
              </el-col>
            </el-row>

            <!-- 第六行 -->
            <el-row>
              <el-col :span="8" :offset="1">
                <div class="detailLabel">调整后合约增减份数：</div>
                <div class="detailValue">{{detailModel.adjustCpChangeNum | NumFormat}}</div>
              </el-col>
              <el-col :span="15">
                <div class="detailLabel">调整涉及科目：</div>
                <div class="detailValue" style="width:500px;height:30px;overflow:hidden">
                  <el-popover
                    placement="top-start"
                    title="调整涉及科目"
                    width="200"
                    trigger="hover"
                    :content="detailModel.adjustSubject"
                  >
                    <el-button
                      slot="reference"
                      style="border:none"
                    >{{detailModel.adjustSubject |cutString(50)}}</el-button>
                  </el-popover>
                </div>
              </el-col>
            </el-row>
            <!-- 第7行 -->
            <el-row>
              <el-col :span="8" :offset="1">
                <div class="detailLabel">其他：</div>
                <div @click="filedialog" class="detailValue col">附件列表</div>
              </el-col>
            </el-row>
          </div>
        </el-collapse-item>
      </el-collapse>
    </el-row>
    <!-- 附件列表弹出层 -->
    <el-dialog title="附件列表" :visible.sync="dialogTableVisible">
      <div class="attachments">
        <!-- <div class="form-unit">附件列表</div> -->
        <el-form label-width="150px" :disabled="!page.isEdit">
          <el-row>
            <el-col></el-col>
          </el-row>
          <span class="breadcrumb-child" v-if="page.isEdit" style="float: left;margin-top: 10px">
            <i></i>上传附件:
          </span>
          <span style="float: left" v-if="page.isEdit">
            <!-- :limit="page.attachment.limit"
            :size="page.attachment.size"-->
            <CostFileUpload
              style="margin-bottom: 20px"
              v-model="page.attachment.fileList"
              :attachmentData="page.attachment.attachmentData"
              :outerId="''"
            ></CostFileUpload>
          </span>
        </el-form>
        <DesignAlterationAttachmentTable
          :queryObj_passed_in="page.attachment.queryModel"
          :attaData="page.attachment.attachmentData"
          v-on:changeAttachments="changeAttachments"
          :showDeleteButton="pageStatus.showDeleteButton"
          ref="DesignAlterationAttachmentTable"
        ></DesignAlterationAttachmentTable>
        <div style="height:20px;">&nbsp;</div>
      </div>
    </el-dialog>
    <!-- 按钮区域 -->
    <el-row style="margin-bottom:20px;border:none">
      <el-form size="mini" :inline="true" @submit.native.prevent>
        <el-row>
          <el-col :span="4">
            <!-- 科目代码或名称 -->
            <el-input
              v-model="queryModel.subjectCodeOrName"
              :placeholder="'科目编码或名称/合约'"
              style="padding-right:5px;"
              show-overflow-tooltip
              clearable
              :maxlength="20"
              @keyup.enter.native="searchEnterFun($event)"
              :disabled="pageModelList.length === 0"
            ></el-input>
          </el-col>

          <el-col :span="9">
            <el-button
              size="mini"
              type="primary"
              :disabled="pageModelList.length === 0"
              @click.enter="handleSearch"
            >{{$l('btn_search')}}</el-button>

            <el-button
              size="mini"
              v-if="!$store.state.user.isFromBpm"
              @click="handleBack"
            >{{$l("btn_back")}}</el-button>
            <el-button
              size="mini"
              type="primary"
              v-if="page.isEdit"
              :disabled="pageModelList.length === 0 || this.pageStatus.finishSubmit || !this.pageStatus.checkSave || this.pageStatus.focus"
              @click="handleSave(false)"
            >{{$l('btn_save')}}</el-button>

            <el-button
              size="mini"
              type="primary"
              v-if="page.isEdit"
              :disabled="pageModelList.length === 0 || this.pageStatus.finishSubmit || !this.pageStatus.checkSave || this.pageStatus.focus || pageStatus.onSubmit"
              @click="handleSave(true)"
            >{{$l('lbl_cost_compilation_submit')}}</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-row>
    <!-- 合约规划编制调整表格 -->
    <div
      style="margin-bottom:10px;border:none"
      v-show="pageModelList.length !== 0"
      ref="adjustTable"
    >
      <!-- 编制表格 -->
      <el-table
        :data="pageModelList"
        :row-style="showRow"
        align="left"
        stripe
        size="small"
        border
        :height="tHeight"
        @row-click="handleRowClick"
        tooltip-effect="dark"
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
          prop="subject.level"
          :label="$l('lbl_standared_subject_level')"
          width="80"
          v-if="false"
          :fixed="pageModelList.length !== 0"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.dataType === '1'">{{ scope.row.subjectCode | FLevel }}</span>
          </template>
        </el-table-column>

        <!-- 成本科目编码-->
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
          width="170"
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
          width="150"
          :fixed="pageModelList.length !== 0"
        >
          <template slot-scope="scope">
            <div style="text-align:left">
              <span v-if="!scope.row._editStatus || !scope.row._isNew || scope.row.lockedBy">
                <i class="fa fa-lock" aria-hidden="true" v-if="scope.row.lockedBy" title="锁定"></i>
                {{scope.row.contractPlanName}}
              </span>
              <span
                v-if="scope.row._editStatus && scope.row.dataType === '2' && scope.row._isNew && !scope.row.lockedBy"
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
          v-if="false"
          width="80"
        >
          <template slot-scope="scope">{{scope.row.level1Name}}</template>
        </el-table-column>

        <!-- 二级分类 -->
        <el-table-column
          prop="level2Name"
          :label="'二级分类'"
          v-if="false"
          show-overflow-tooltip
          width="100"
        >
          <template slot-scope="scope">{{scope.row.level2Name}}</template>
        </el-table-column>

        <!-- 成本科目比例 -->
        <el-table-column prop="splitRate" :label="'成本科目比例(%)'" width="120">
          <template slot-scope="scope">
            <span v-if="scope.row.dataType === '2'">{{scope.row.splitRate}}</span>
          </template>
        </el-table-column>

        <!-- 调整前合约规划金额（含税） -->
        <el-table-column prop="cpAmtIncludeTaxBefore" :label="'合约规划金额(含税)(元)'" width="180">
          <template slot-scope="scope">
            <span v-if="scope.row.dataType === '2'">{{scope.row.cpAmtIncludeTaxBefore | NumFormat}}</span>

            <!-- <span v-if="scope.row.dataType === '1' && scope.row.isLeaf">
                            {{scope.row.cpAmtIncludeTaxBefore | NumFormat}}
            </span>-->
          </template>
        </el-table-column>

        <!-- 调整前合约规划金额（不含税） -->
        <el-table-column prop="cpAmtExcludeTaxBefore" :label="'合约规划金额(不含税)(元)'" width="180">
          <template slot-scope="scope">
            <span v-if="scope.row.dataType === '2'">{{scope.row.cpAmtExcludeTaxBefore | NumFormat}}</span>
            <!-- <span v-if="scope.row.dataType === '1' && scope.row.isLeaf">
                            {{scope.row.cpAmtExcludeTaxBefore | NumFormat}}
            </span>-->
          </template>
        </el-table-column>

        <!-- 税率 -->
        <el-table-column prop="taxRate" :label="'税率(%)'" width="80">
          <template slot-scope="scope">
            <span
              v-if="(scope.row.dataType === '1' && scope.row.isLeaf) || scope.row.dataType === '2'"
            >{{taxRateFilter(scope.row.taxRate) | rateFormat}}</span>
          </template>
        </el-table-column>

        <!-- 税额 -->
        <el-table-column prop="tax" :label="'税额(元)'" width="140">
          <template slot-scope="scope">
            <span v-if="scope.row.dataType === '2'">{{scope.row.tax | NumFormat}}</span>

            <span
              v-if="scope.row.dataType === '1' && scope.row.isLeaf"
            >{{scope.row.tax | NumFormat}}</span>
          </template>
        </el-table-column>

        <!-- 调整前已发生金额（含税）(元)-->
        <el-table-column prop="amountOccurence" :label="'调整前已发生金额(含税)(元)'" width="200">
          <template slot-scope="scope">
            <span
              v-if="(scope.row.dataType === '1' && scope.row.isLeaf) || scope.row.dataType === '2'"
            >{{scope.row.amountOccurence | NumFormat}}</span>
          </template>
        </el-table-column>

        <!-- 调整前在途金额（含税）(元)-->
        <el-table-column prop="amountPendingApprove" :label="'调整前在途金额(含税)(元)'" width="180">
          <template slot-scope="scope">
            <span
              v-if="(scope.row.dataType === '1' && scope.row.isLeaf) || scope.row.dataType === '2'"
            >{{scope.row.amountPendingApprove | NumFormat}}</span>
          </template>
        </el-table-column>

        <!-- 调整前已释放金额（含税）(元)-->
        <el-table-column prop="amtReleasedBefore" :label="'调整前已释放金额(含税)(元)'" width="200">
          <template slot-scope="scope">
            <span
              v-if="scope.row.dataType === '1' && scope.row.isLeaf"
            >合计：{{scope.row._sumAmtReleasedBefore | NumFormat}}</span>
            <span v-if="scope.row.dataType === '2'">{{scope.row.amtReleasedBefore | NumFormat}}</span>
          </template>
        </el-table-column>

        <!-- 调整前待发生金额（含税）(元)-->
        <el-table-column prop="amtPendingOccurenceBefore" :label="'调整前待发生金额(含税)(元)'" width="200">
          <template slot-scope="scope">
            <span
              v-if="(scope.row.dataType === '1' && scope.row.isLeaf) || scope.row.dataType === '2'"
            >{{scope.row.amtPendingOccurenceBefore | NumFormat}}</span>
          </template>
        </el-table-column>
        <!-- 释放金额（含税）【编辑】 -->
        <!-- 调回，调剂，已签合同(调整前已发生金额（含税）(元)amountOccurence，调整前在途金额（含税）(元)amountPendingApprove不为0则会锁定)禁用 -->
        <el-table-column prop="amountRelease" :label="'释放金额(含税)(元)'" width="160">
          <template slot-scope="scope">
            <span
              v-if="(scope.row.dataType === '1' && scope.row.isLeaf) || scope.row.dataType === '2'"
            >
              <span
                v-if="!scope.row._editStatus || scope.row.lockedBy"
              >{{scope.row.amountRelease | NumFormat}}</span>

              <span v-if="scope.row._editStatus && !scope.row.lockedBy">
                <el-input-number
                  v-model.trim.number="scope.row.amountRelease"
                  :placeholder="'释放金额(含税)(元)'"
                  :controls="false"
                  onmousewheel="return false;"
                  :disabled="page.editFlag === 'ADJUST' || page.editFlag === 'JUSTADJUST' || scope.row._isNew"
                  @focus="handleRowFocus"
                  :precision="2"
                  @blur="handleRowChange('amountRelease',scope.row.amountRelease,scope.row,scope.$index,$event)"
                ></el-input-number>
              </span>
            </span>
          </template>
        </el-table-column>
        <!-- 调回金额（含税）【编辑】 -->
        <!-- 释放，【调整前已释放为0（删除此逻辑20181013），新增规划】 调回，已签合同(调整前已发生金额（含税）(元)amountOccurence，调整前在途金额（含税）(元)amountPendingApprove不为0则会锁定)禁用 -->
        <el-table-column prop="amountReturnedBack" :label="'调回金额(含税)(元)'" width="160">
          <template slot-scope="scope">
            <span
              v-if="(scope.row.dataType === '1' && scope.row.isLeaf) || scope.row.dataType === '2'"
            >
              <span
                v-if="!scope.row._editStatus || scope.row.lockedBy"
              >{{scope.row.amountReturnedBack | NumFormat}}</span>

              <span v-if="scope.row._editStatus && !scope.row.lockedBy">
                <!-- <el-tooltip class="item"
                                            effect="dark"
                                            v-if="scope.row.amtReleasedBefore===0"
                                            :content="scope.row.amtReleasedBefore===0?'调整前已释放为0不可做调回':''"
                                            placement="top-start">
                                    <el-input v-model.trim.number="scope.row.amountReturnedBack"
                                              :placeholder="'调回金额(含税)(元)'"
                                              type="number"
                                              onmousewheel="return false;"
                                              :disabled="page.editFlag === 'RELEASE' || page.editFlag === 'JUSTADJUST' || scope.row.amtReleasedBefore===0 || scope.row._isNew" 
                                              @focus="handleRowFocus" 
                                              @blur="handleRowChange('amountReturnedBack',scope.row.amountReturnedBack,scope.row,scope.$index,$event)"></el-input>
                                </el-tooltip>
                                 v-if="scope.row.amtReleasedBefore!==0"
                -->

                <el-input-number
                  v-model.trim.number="scope.row.amountReturnedBack"
                  :placeholder="'调回金额(含税)(元)'"
                  :controls="false"
                  :precision="2"
                  :min="0"
                  onmousewheel="return false;"
                  :disabled="page.editFlag === 'RELEASE' || page.editFlag === 'JUSTADJUST'"
                  @focus="handleRowFocus"
                  @blur="handleRowChange('amountReturnedBack',scope.row.amountReturnedBack,scope.row,scope.$index,$event)"
                ></el-input-number>
              </span>
            </span>
          </template>
        </el-table-column>
        <!-- 调剂金额（含税）【编辑】 -->
        <!-- 释放，已签合同(调整前已发生金额（含税）(元)amountOccurence，调整前在途金额（含税）(元)amountPendingApprove不为0则会锁定)禁用 -->
        <el-table-column prop="amountAdjust" :label="'调剂金额(含税)(元)'" width="260">
          <template slot-scope="scope">
            <span
              v-if="(scope.row.dataType === '1' && scope.row.isLeaf) || scope.row.dataType === '2'"
            >
              <span
                v-if="scope.row.dataType===  '1' && scope.row.isLeaf && scope.row.subjectTcAdjustAmt && scope.row.subjectTcAdjustAmt!==0"
                style="color:orange"
              >目标成本调整金额:{{scope.row.subjectTcAdjustAmt | NumFormat}}</span>
              <span v-if="scope.row.dataType===  '2'">
                <span
                  v-if="!scope.row._editStatus || scope.row.lockedBy"
                >{{scope.row.amountAdjust | NumFormat}}</span>
                <span v-if="scope.row._editStatus && !scope.row.lockedBy">
                  <el-input-number
                    v-model.trim.number="scope.row.amountAdjust"
                    :placeholder="'调剂金额(含税)(元)'"
                    :controls="false"
                    :precision="2"
                    onmousewheel="return false;"
                    :disabled="page.editFlag === 'RELEASE'"
                    @focus="handleRowFocus"
                    @blur="handleRowChange('amountAdjust',scope.row.amountAdjust,scope.row,scope.$index,$event)"
                  ></el-input-number>
                </span>
              </span>
            </span>
          </template>
        </el-table-column>

        <!--  调整后已释放金额(含税)(元) -->
        <el-table-column prop="amountReleased" :label="'调整后已释放金额(含税)(元)'" width="200">
          <template slot-scope="scope">
            <span
              v-if="(scope.row.dataType === '1' && scope.row.isLeaf) || scope.row.dataType === '2'"
            >{{scope.row.amountReleased | NumFormat}}</span>
          </template>
        </el-table-column>

        <!--  调整后待发生金额(含税)(元) -->
        <el-table-column prop="amountPendingOccurence" :label="'调整后待发生金额(含税)(元)'" width="220">
          <template slot-scope="scope">
            <span
              v-if="(scope.row.dataType === '1' && scope.row.isLeaf) || scope.row.dataType === '2'"
            >{{scope.row.amountPendingOccurence | NumFormat}}</span>
          </template>
        </el-table-column>

        <!--  调整后合约规划金额(含税)(元) -->
        <el-table-column
          prop="contractPlanAmountIncludeTax"
          :label="'调整后合约规划金额(含税)(元)'"
          width="240"
        >
          <template slot-scope="scope">
            <span
              v-if="scope.row.dataType === '1' && scope.row.isLeaf"
            >合计：{{scope.row._sumContractPlanAmountIncludeTax | NumFormat}}</span>
            <span
              v-if="scope.row.dataType === '2'"
            >{{scope.row.contractPlanAmountIncludeTax | NumFormat}}</span>
          </template>
        </el-table-column>

        <!--  调整后合约规划金额(不含税)(元) -->
        <el-table-column
          prop="contractPlanAmountExcludeTax"
          :label="'调整后合约规划金额(不含税)(元)'"
          width="240"
        >
          <template slot-scope="scope">
            <span
              v-if="scope.row.dataType === '1' && scope.row.isLeaf"
            >合计：{{scope.row._sumContractPlanAmountExcludeTax | NumFormat}}</span>
            <span
              v-if="scope.row.dataType === '2'"
            >{{scope.row.contractPlanAmountExcludeTax | NumFormat}}</span>
          </template>
        </el-table-column>

        <!-- 预估变更比例-->
        <el-table-column prop="reservedChangeRate" :label="'预估变更比例(%)'" width="120">
          <template slot-scope="scope">
            <span v-if="scope.row.dataType === '2'">{{scope.row.reservedChangeRate | NumFormat}}</span>
          </template>
        </el-table-column>

        <!-- 预估变更金额（含税） -->
        <el-table-column prop="reservedChangeAmountIncludeTax" :label="'预估变更金额(含税)(元)'" width="150">
          <template slot-scope="scope">
            <span
              v-if="scope.row.dataType === '1' && scope.row.isLeaf"
            >合计：{{scope.row._sumReservedChangeAmountIncludeTax | NumFormat}}</span>
            <span
              v-if="scope.row.dataType === '2'"
            >{{scope.row.reservedChangeAmountIncludeTax | NumFormat}}</span>
          </template>
        </el-table-column>

        <!-- 预估变更金额（不含税） -->
        <el-table-column
          prop="reservedChangeAmountExcludeTax"
          :label="'预估变更金额(不含税)(元)'"
          width="160"
        >
          <template slot-scope="scope">
            <span
              v-if="scope.row.dataType === '1' && scope.row.isLeaf"
            >合计：{{scope.row._sumReservedChangeAmountExcludeTax | NumFormat}}</span>
            <span
              v-if="scope.row.dataType === '2'"
            >{{scope.row.reservedChangeAmountExcludeTax | NumFormat}}</span>
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
          <template
            slot-scope="scope"
          >{{selectData.cost_subject_apportionment_rule_code[scope.row.apportionmentRuleCode]}}</template>
        </el-table-column>

        <!-- 操作列 -->
        <el-table-column
          :label="this.$l('lbl_operation')"
          width="100"
          v-if="page.isEdit"
          fixed="right"
        >
          <template slot-scope="scope">
            <div style="text-align:center">
              <!-- 添加规划(科目可添加规划) -->
              <!-- 科目金额为0，预备费类型为1，当前为释放 新增规划不可用 -->
              <el-button
                size="mini"
                type="text"
                icon="el-icon-plus"
                :title="$l('btn_edit')"
                v-if="scope.row.dataType === '1' && scope.row.isLeaf && scope.row.subjectCode.indexOf(page.specialNode) <0 && !scope.row.lockedBy"
                :disabled="scope.row.subjectAmountIncludeTax === 0 || scope.row.reserveCostType === '1' || page.editFlag === 'RELEASE'"
                @click="handleAddClick(scope.$index, scope.row)"
              >新增合约</el-button>

              <!-- 删除规划（规划可删除规划） -->
              <!-- 【金额】都为0、非锁定、合约 可以删除 -->
              <el-button
                size="small"
                type="text"
                icon="el-icon-delete"
                :title="$l('btn_delete')"
                v-if="checkCanDelete(scope.row)"
                @click="handleDeleteClick(scope.$index, scope.row)"
                :style="{'color':'red'}"
                :disabled="!scope.row._editStatus"
              >删除合约</el-button>

              <!-- 撤销当前新增规划（规划可删除规划） -->
              <el-button
                size="mini"
                type="text"
                icon="fa fa-undo"
                :title="$l('btn_delete')"
                v-if="scope.row.dataType === '2' && scope.row._isNew  && !scope.row.lockedBy"
                @click="handleDeleteClick(scope.$index, scope.row)"
                :style="{'color':'orange'}"
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
  getContractPlanDetail, // 查看某个合约规划调整详情,带数据accountingObjectId,stageId,stageVersion
  getAdjustContractPlanDetail, // 调整的明细
  adjustTargetCostContractPlan, // 调整合约规划
  submitTargetCostContractPlanAdjustment, // 提交调整审批
  checkAdjustStageVersion, // 检查是否可以调整accounting_object_id,stage_id
  getAccountingObjectCommonInfo // 获取基本信息
} from "@/api/cost/targetCostContractPlanAPI";
import {
  NumFormat, // 千位符
  FLevel,
  dateFormat,
  Version,
  rateFormat,
  cutString
} from "@/filters/cost/";
import CostFileUpload from "@/components/cost/UploadFile/";
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
import sys_config from "@/config/config.js";
export default {
  data() {
    return {
      dialogTableVisible: false,
      focusTimeOut: null, //定时器
      calcTableHeight: {
        otherHeight: 240,
        sideCloseHeight: 70
      },
      selectData: {
        cost_flow_status: [],
        cost_stage_id: [],
        cost_subject_responsible_dept_code: [],
        cost_subject_apportionment_rule_code: []
      },
      adjustTableHeight: 0,
      page: {
        specialNode: COSTENUM.SPECIAL_SUBJECT_CODE_FLAG,
        id: "", // 编制id
        isEdit: false,
        statusName: "",
        contractPlanSelector: {
          // 合约规划树
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
        editFlag: null
      },
      pageStatus: {
        blockDetailActiveName: "",
        expandedLevel: sys_config.expandedLevel, //默认展开二级
        checkSave: true, // 能否保存
        finishSubmit: false, // 完成审批
        finishSave: false, //完成保存
        isAdjust: false, //默认不是调整，是查看
        focus: false, //输入框focus
        hash: false, //保存数据的hash
        onSubmit: false, //正在审批
        showDeleteButton: true // 附件
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
        status: null, //当前调整状态status=4 目标成本调整自动带出的合约规划调整，目标成本金额和合约规划金额不等的只能做调剂
        // 搜索列表
        level1Name: "",
        level2Name: "",
        subjectCodeOrName: "", //科目编码和名称
        ContractPlanName: "",
        show: {
          group: true,
          company: true,
          dept: true,
          account: true
        }
      },
      detailModel: {
        contractPlanAmountIncludeTax: 0, // 合约规划金额(含税)(元)
        updatedBy: null, // 编制人
        status: null, // 审批状态
        flowStatus: null, //审批状态
        contractPlanAmountExcludeTax: 0, // 合约规划金额(不含税)(元)
        updatedDate: null, // 编制日期：
        stageVersion: null, // 版本
        stageId: "", // 阶段
        ownerId: "",
        canImportOrNot: true, // 能否引入
        // 新增
        contractPlanNum: null, //合约规划份数：计算
        segmentationNum: null, //合约标段划分数量
        groupStrategyBuyNum: null, // 集团战略采购份数
        materEquipBuyNum: null, //材料设备采购份数
        groupCenterBuyNum: null, //集团集中采购份数
        cpAdjustRange: null, //合约规划调整范围
        adjustAmt: null, //调整涉及金额：
        projectBuyNum: null, //工程采购份数：
        adjustCpChangeNum: null, //调整后合约增减份数 计算
        adjustSubject: null, //调整涉及科目：计算
        auditApprovalDate: null //审批通过日期//审批日期
      },
      saveData: null, // 保存和提交的数据结构
      pageModelList: [],
      pageModeEdit: false, // 当前模板编辑状态
      pagePreEditModelList: null,
      pageOriginalModelList: null, // 原始数据
      pageModel: {
        // 行类型1为科目，2为规划
        dataType: null,
        type: 2, // 规划
        subjectId: "", // 科目id
        // 成本科目编码
        subjectCode: "",
        // 成本科目名称
        subjectName: "",
        // 合约规划
        contractPlanName: "",
        // isLeaf : False
        isLeaf: true,
        // 科目规划金额(含税)(元)
        subjectAmountIncludeTax: 0,
        // 科目规划金额(不含税)(元)
        subjectAmountExcludeTax: 0,
        // 一级分类
        level1Name: "",
        // 二级分类
        level2Name: "",
        // 责任部门
        responsibleDeptCode: "",
        // 成本科目比例
        splitRate: 0,
        // 调整后合约规划金额（含税）
        contractPlanAmountIncludeTax: 0,
        // 调整后合约规划金额（不含税)(元)
        contractPlanAmountExcludeTax: 0,
        taxRate: 0, // 税率
        tax: 0, // 税额
        // 预估变更比例
        reservedChangeRate: 0,
        // 预估变更金额（含税）
        reservedChangeAmountIncludeTax: 0,
        // 预估变更金额（不含税）
        reservedChangeAmountExcludeTax: 0,
        // 分摊规则
        apportionmentRuleCode: "",
        // 调剂金额(含税)(元)【编辑】
        amountAdjust: 0,
        // 释放金额(含税)(元)【编辑】
        amountRelease: 0,
        // 调回金额(含税)(元)【编辑】
        amountReturnedBack: 0,
        // 调整前已发生金额（含税）(元)
        amountOccurence: 0,
        // 调整前在途金额（含税）(元)
        amountPendingApprove: 0,
        // 调整前已释放金额（含税）(元)
        amtReleasedBefore: 0,
        // 调整前待发生金额（含税）(元)
        amtPendingOccurenceBefore: 0,
        // 调整后待发生金额（含税）(元)
        amountPendingOccurence: 0,
        // 调整前合约规划金额(不含税)(元)
        cpAmtExcludeTaxBefore: 0,
        // 调整前合约规划金额(含税)(元)
        cpAmtIncludeTaxBefore: 0,
        // 调整后已释放金额(含税)(元)
        amountReleased: 0,
        //借调金额（借出为负，借进为正数）
        //由调回造成的调剂金额新增returnFix字段，自身该字段值为正数，从他人释放获得金额后他人该字段为负数
        returnFix: 0,
        isDeleted: "0",
        // 辅助字段
        _editStatus: false,
        _isNew: false,
        _show: true,
        // 汇总字段
        _sumSplitRate: 0, // 汇总分摊比例
        _sumContractPlanAmountIncludeTax: 0, // 汇总合约规划金额含税
        _sumContractPlanAmountExcludeTax: 0, // 汇总合约规划金额不含税
        _sumReservedChangeRate: 0, // 汇总预估变更比例
        _sumReservedChangeAmountIncludeTax: 0, // 预估变更金额（含税）
        _sumReservedChangeAmountExcludeTax: 0, // 预估变更金额（不含税）
        _sumAmtReleasedBefore: 0 //调整期已释放含税
      },
      rowTemplateData: {
        id: null,
        subjectId: null, // 科目id或所在科目id
        contractPlanId: null,
        type: null,
        stageId: null,
        stageVersion: null,
        baseOnTargetCostStageVersion: null,
        ownerId: null,
        splitRate: null,
        contractPlanAmountIncludeTax: 0, // 调整后合约规划金额(含税)
        contractPlanAmountExcludeTax: 0, // 调整后合约规划金额(不含税)
        tax: 0, // 税额
        taxRate: 0, // 税率
        reservedChangeAmountIncludeTax: 0, // 预估变更金额（含税）(元)
        reservedChangeAmountExcludeTax: 0, // 预估变更金额（不含税）(元)
        remark: "合约规划编制",
        status: "1",
        isDeleted: "0",
        targetCostIncludeTax: null,
        amountPendingApprove: null,
        amountOccurence: null,
        amountReleased: null,
        amountPendingOccurence: null,
        amountRelease: null,
        amountReturnedBack: null,
        amountAdjust: null,
        subjectModelList: null,
        contractPlanModelList: null,
        subjectModel: null,
        contractPlanModel: {
          id: null,
          name: null,
          remark: "",
          type: "2",
          level: null,
          ownerId: null,
          parent: null,
          sort: "0",
          status: "1",
          isDeleted: "0",
          reservedChangeRate: null, // 预估变更比例
          level1Name: "",
          level2Name: ""
        },
        cpAmtIncludeTaxBefore: 0,
        cpAmtExcludeTaxBefore: 0,
        amtReleasedBefore: 0,
        amtPendingOccurenceBefore: 0,
        contractPlanName: null
      }
    };
  },
  filters: {
    NumFormat,
    FLevel,
    dateFormat,
    Version,
    rateFormat,
    cutString
  },
  components: {
    AccountingTargetSelector,
    DesignAlterationAttachmentTable,
    CostFileUpload,
    ContractPlanSelector // 规划树
  },

  computed: {
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

  mounted() {
    // alert('5555')
    // window.onresize = () => {
    //   return (() => {
    //     let _tableHeight = document.body.clientHeight - this.calcTableHeight.otherHeight
    //     this.tHeight = _tableHeight + 'px'
    //   })()
    // }
    if (this.$route.query.accountingObjectId)
      this.queryModel.accountingObjectId = this.$route.query.accountingObjectId
        ? this.$route.query.accountingObjectId
        : "0";
    this.queryModel.status = this.$route.query.status; //状态
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
    this.pageStatus.isAdjust = this.$route.query.isAdjust
      ? this.$route.query.isAdjust
      : false; // 是否为调整
    this.getCommonInfo(
      this.queryModel.accountingObjectId,
      this.queryModel.stageId,
      this.queryModel.stageVersion,
      true
    );
    this.$nextTick(function() {
      this.adjustTableHeight =
        document.documentElement.clientHeight -
        this.$refs.adjustTable.getBoundingClientRect().top -
        310;
      this.$refs.adjustTable.style.Height = this.adjustTableHeight + "px";
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
    // 附件列表展示
    filedialog() {
      this.dialogTableVisible = !this.dialogTableVisible;
    },
    //附件
    changeAttachments(data) {
      // console.log(data);
      this.page.attachment.attachmentData = data;
    },
    //科目左边距
    getSubjectCodePaddingLeft(rowData) {
      return (
        (this.getLevel(rowData.subjectCode) - 1) * 10 +
        (rowData.isLeaf ? (this.getLevel(rowData.subjectCode) - 1) * 1 : 0) +
        "px"
      );
    },
    //检查是否可以删除
    checkCanDelete(rowData) {
      let rowAmount =
        ifNull(rowData.contractPlanAmountIncludeTax, 0) + // 调整后合约规划金额（含税）(元)
        ifNull(rowData.reservedChangeAmountIncludeTax, 0) + // 预估变更金额（含税）(元)
        ifNull(rowData.amountPendingOccurence, 0) + // 调整后待发生金额（含税）(元)
        ifNull(rowData.amountReleased, 0) + //调整后已释放金额(含税)(元)
        ifNull(rowData.amountReturnedBack, 0) + //调回金额(含税)(元)【编辑】
        ifNull(rowData.amountRelease, 0) + // 释放金额(含税)(元)【编辑】
        ifNull(rowData.amountOccurence, 0) + // 调整前已发生金额
        ifNull(rowData.amountPendingApprove, 0); // 调整前在途金额（含税）(元)

      rowAmount = calc.Mul(rowAmount, 1);

      return (
        rowData.dataType === "2" &&
        !rowData.lockedBy &&
        !rowData._isNew &&
        rowAmount === 0
      );
    },
    // 行点击事件
    handleRowClick(row, event, column) {
      return;
      this.pageModelList.map(item => {
        if (row.subjectId === item.subjectId) {
          item._isSelect = true;
        } else {
          item._isSelect = false;
        }
      });
    },
    // toString()
    _ToString(value) {
      if (!value) {
        return value;
      } else {
        return value.toString();
      }
    },
    // 设置页面调剂/调回 和 释放
    setPageEditFlag() {
      this.page.editFlag = null;
      if (this.pageModelList && this.pageModelList.length > 0) {
        if (this.queryModel.status === "4") {
          //目标成本调整自动带出的合约规划调整，目标成本金额和合约规划金额不等的只能做调剂
          this.page.editFlag = "JUSTADJUST";
        } else {
          // 释放
          let releaseSubjectContractItem = this.pageModelList.find(
            subjectItem => {
              return ifNull(subjectItem.amountRelease, 0) !== 0;
            }
          );
          // 调剂
          let adJustSubjectContractItem = this.pageModelList.find(
            subjectItem => {
              return ifNull(subjectItem.amountAdjust, 0) !== 0;
            }
          );
          // 调回
          let returnedBackSubjectContractItem = this.pageModelList.find(
            subjectItem => {
              return ifNull(subjectItem.amountReturnedBack, 0) !== 0;
            }
          );

          // 后端需要的数据标识
          if (this.saveData) {
            this.saveData.amountRelease = releaseSubjectContractItem ? 1 : 0;
            this.saveData.amountReturnedBack = returnedBackSubjectContractItem
              ? 1
              : 0;
            this.saveData.amountAdjust = adJustSubjectContractItem ? 1 : 0;
          }

          if (
            !releaseSubjectContractItem &&
            !adJustSubjectContractItem &&
            !returnedBackSubjectContractItem
          ) {
            this.page.editFlag = null;
          } else if (
            releaseSubjectContractItem &&
            !adJustSubjectContractItem &&
            !returnedBackSubjectContractItem
          ) {
            this.page.editFlag = "RELEASE";
          } else if (
            !releaseSubjectContractItem &&
            (adJustSubjectContractItem || returnedBackSubjectContractItem)
          ) {
            this.page.editFlag = "ADJUST";
          } else {
            this.$showNormalError("异常数据(同时存在“释放”和“调剂/调回”数据");
          }
        }
      }
    },
    // 是否为空
    ifNullValue(value, defaultValue) {
      return ifNull(value, defaultValue);
    },
    // 显示税率
    taxRateFilter(taxRate) {
      return calc.Mul(ifNull(taxRate, 0), 100);
    },
    // 序号
    indexMethod(index) {
      return index + 1;
    },
    // 初始化基本信息
    initCommonInfoData(responseData, isMounted = false) {
      this.detailModel.contractPlanAmountIncludeTax =
        responseData.targetCostIncludeTax; // 合约规划金额(含税)(元)
      this.detailModel.maker = responseData.maker; // 编制人
      this.detailModel.status = responseData.approvalStatus; // 审批状态
      this.detailModel.contractPlanAmountExcludeTax =
        responseData.targetCostExcludeTax || 0; // 合约规划金额(不含税)(元)
      this.detailModel.updatedDate = responseData.makeDate; // 编制日期：
      this.detailModel.stageVersion = responseData.targetCostVersion; // 版本
      this.detailModel.stageId = responseData.stageId || "";
      this.detailModel.ownerId = responseData.ownerId || "";
      this.detailModel.accountingObjectText = responseData.name;
      if (
        this.$route.query.isNewAdjust + "" === "true" &&
        !this.pageStatus.finishSave
      ) {
        this.detailModel.maker = this.$getUserInfo()["nickName"]; // 编制人
        this.detailModel.status = null; // 审批状态
        this.detailModel.updatedDate = null; // 编制日期：
        this.detailModel.stageVersion = null; // 版本
      } else {
        this.detailModel.flowStatus = responseData.approvalStatusName || ""; //审批状态
      }

      isMounted && this.$route.query.isNewAdjust
        ? this.getAdjustDetail()
        : this.getDetail();
    },
    // 获取基本信息
    getCommonInfo(
      accountingObjectId,
      stageId,
      stageVersion,
      isMounted = false
    ) {
      getAccountingObjectCommonInfo({
        accountObjectId: accountingObjectId,
        stageId: stageId,
        stageVersion: stageVersion
      })
        .then(response => {
          this.queryModel.stageVersion = response.data.targetCostVersion;
          this.initCommonInfoData(response.data, isMounted);
        })
        .catch(error => {
          console.log(error);
          this.$showError(error.message ? error.message : "msg_system_error");
        });
    },

    // 初始化保存数据
    initSaveTemplateData(response, editPageModelList) {
      if (!response.data) return;
      if (response) {
        let _temp = deepCopy(response.data);
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
    // 级联改变
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
      this.checkDetail(item.accountingObjectId);
    },
    // 目标成本不含税=目标成本（含税）/（1+税率）
    calcTargetCostIncludeTax(rowData) {
      return (
        calc
          .Div(
            ifNull(rowData.subjectAmountIncludeTax, 0),
            1 + ifNull(rowData.taxRate, 0) / 100
          )
          .toFixed(2) / 1
      );
    },
    // 初始化数据
    initTableData(response) {
      // // console.log("responseinitTableData");
      // console.log(response);
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
      this.saveData = this.initSaveTemplateData(response, null); // 存储保存的数据结构
      this.page.attachment.attachmentData = response.data.attachments;
      // alert(this.page.attachment.attachmentData)
      this.detailModel.stageVersion = response.data.stageVersion; // 版本
      this.detailModel.stageId = response.data.stageId || ""; // 当前阶段
      this.detailModel.ownerId = response.data.ownerId || ""; // 所属id
      this.detailModel.canImportOrNot = response.data.canImportOrNot; // 能否引入

      // 新增
      this.detailModel.contractPlanNum = response.data.contractPlanNum; //合约规划份数：计算
      this.detailModel.segmentationNum = response.data.segmentationNum; //合约标段划分数量
      this.detailModel.groupStrategyBuyNum = response.data.groupStrategyBuyNum; // 集团战略采购份数
      this.detailModel.materEquipBuyNum = response.data.materEquipBuyNum; //材料设备采购份数
      this.detailModel.groupCenterBuyNum = response.data.groupCenterBuyNum; //集团集中采购份数
      this.detailModel.cpAdjustRange = response.data.cpAdjustRange; //合约规划调整范围
      this.detailModel.adjustAmt = response.data.adjustAmt; //调整涉及金额：
      this.detailModel.projectBuyNum = response.data.projectBuyNum; //工程采购份数：
      this.detailModel.adjustCpChangeNum = response.data.adjustCpChangeNum; //调整后合约增减份数 计算
      this.detailModel.adjustSubject = response.data.adjustSubject; //调整涉及科目：计算
      this.detailModel.auditApprovalDate = response.data.auditApprovalDate; //审批通过日期//审批日期
      let newArray = []
      let newStr = ''
      // 清空原有数据
      _this.pageModelList = [];
      console.log("deepCopy(this.pageModel)");
      console.log(deepCopy(this.pageModel));
      console.log("response.data.subjectModelList");
      console.log(response.data.subjectModelList);
      response.data.subjectModelList.map(item => {
        // 遍历科目列表，咱开科目和科目下的规划
        console.log(item)
        // if (item.isLeaf) {
        let _rowSubjectData = deepCopy(this.pageModel);
        _rowSubjectData.dataType = COSTENUM.contractPlanType.SUBJECT; // 类型标识 '1'科目,'2'规划
        _rowSubjectData.subjectId = item.id; // 成本科目id
        _rowSubjectData.subjectCode = item.code; // 成本科目编码
        _rowSubjectData.subjectName = item.name; // 成本科目名称
        // _rowSubjectData.wang = item.name // 成本科目名称
        _rowSubjectData.nodeSource = item.nodeSource;
        _rowSubjectData.responsibleDeptCode = item.responsibleDeptCode; // 责任部门code
        _rowSubjectData.splitRate = 100; // 成本科目比例(科目上没有分摊,这里比例为100)
        _rowSubjectData.apportionmentRuleCode = item.apportionmentRuleCode; // 分摊规则
        _rowSubjectData.subjectAmountIncludeTax = item.subjectAmountIncludeTax
          ? item.subjectAmountIncludeTax / 1
          : 0; // 科目编制金额(含税)(元)
        _rowSubjectData.subjectAmountExcludeTax = item.subjectAmountExcludeTax
          ? item.subjectAmountExcludeTax / 1
          : 0; // 科目编制金额(不含税)(元)
        _rowSubjectData.taxRate = ifNull(item.taxRate, 0);
        _rowSubjectData.tax =
          calc.Sub(
            _rowSubjectData.subjectAmountIncludeTax,
            _rowSubjectData.subjectAmountExcludeTax
          ) / 1; // 税额
        _rowSubjectData.reserveCostType = item.reserveCostType; // 预备费类型('1'不可以挂规划,'0'可以)
        _rowSubjectData.isPublicSubject = false; // 公摊科目(跨期科目输入金额后科目成为公摊科目,在分期中不可维护)
        _rowSubjectData.isLeaf = item.isLeaf;
        _rowSubjectData.returnFix = ifNull(item.returnFix, 0); // 借调金额

        _rowSubjectData.subjectTcAdjustAmt = ifNull(item.subjectTcAdjustAmt, 0); //目标成本调整金额
        // 辅助字段
        _rowSubjectData._expanded = true;
        _rowSubjectData._isSelect = false;
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
        // else {
          // _rowSubjectData.targetCostContractPlanModelList =
            // item.targetCostContractPlanModelList;
        // }
       
        // 是否被锁定，有值就是被锁定
        _rowSubjectData.lockedBy = ifNull(item.lockedBy, "");

        // 插入科目行
        _this.pageModelList.push(_rowSubjectData);

        console.log("_rowSubjectData)");
        console.log(_rowSubjectData);

        // 科目规划行
        if (
          item.targetCostContractPlanModelList &&
          item.isLeaf && // 叶子
          !COSTBUSINESS.checkIsSpecialCode({
            nodeSource: _rowSubjectData.nodeSource,
            code: _rowSubjectData.subjectCode
          }) // 非.99
        ) {
          item.targetCostContractPlanModelList.map(item1 => {
            let _rowContractPlanData = deepCopy(_rowSubjectData);

            _rowContractPlanData._show =
              _rowContractPlanData.subjectCode.split(".").length ===
              this.pageStatus.expandedLevel; //合约不显示 //合约不显示

            _rowContractPlanData.dataType =
              COSTENUM.contractPlanType.CONTRACTPlan; // 类型标识 '1'科目,'2'规划
            // 继承科目的金额，方便运算
            _rowContractPlanData.subjectAmountIncludeTax =
              ifNull(item.subjectAmountIncludeTax, 0) / 1; // 科目编制金额(含税)(元)
            _rowContractPlanData.subjectAmountExcludeTax =
              ifNull(item.subjectAmountExcludeTax, 0) / 1; // 科目编制金额(不含税)(元)
            _rowContractPlanData.isPublicSubject = item.isPublicSubject; // 公摊科目

            _rowContractPlanData.splitRate = ifNull(item1.splitRate, 0) / 1; // 成本科目比例
            _rowContractPlanData.taxRate = ifNull(item1.taxRate, 0) / 1; // 税率
            _rowContractPlanData.tax = ifNull(item1.tax, 0); // 税额(元)

            // 调整前 已发生金额（含税）(元)
            _rowContractPlanData.amountOccurence = ifNull(
              item1.amountOccurence,
              0
            );
            // 调整前 在途金额（含税）(元)
            _rowContractPlanData.amountPendingApprove = ifNull(
              item1.amountPendingApprove,
              0
            );
            // 调整前 已释放金额（含税）(元)
            _rowContractPlanData.amtReleasedBefore = ifNull(
              item1.amtReleasedBefore,
              0
            );
            // 调整前 待发生金额（含税）(元)
            _rowContractPlanData.amtPendingOccurenceBefore = ifNull(
              item1.amtPendingOccurenceBefore,
              0
            );

            // 释放金额
            _rowContractPlanData.amountRelease = ifNull(item1.amountRelease, 0);
            // 调剂金额
            _rowContractPlanData.amountAdjust = ifNull(item1.amountAdjust, 0);
            // 调回金额
            _rowContractPlanData.amountReturnedBack = ifNull(
              item1.amountReturnedBack,
              0
            );
            // 借调金额
            _rowContractPlanData.returnFix = ifNull(item1.returnFix, 0);

            // 调整前合约规划金额（不含税）
            _rowContractPlanData.cpAmtIncludeTaxBefore = ifNull(
              item1.cpAmtIncludeTaxBefore,
              0
            );
            // 调整前合约规划金额（不含税）
            _rowContractPlanData.cpAmtExcludeTaxBefore = ifNull(
              item1.cpAmtExcludeTaxBefore,
              0
            );

            // 调整后已释放金额(含税)(元
            _rowContractPlanData.amountReleased =
              ifNull(item1.amountReleased, 0) / 1;
            // 调整后待发生金额（含税）(元)
            _rowContractPlanData.amountPendingOccurence =
              ifNull(item1.amountPendingOccurence, 0) / 1;
            // 调整后合约规划金额（含税）(元)
            _rowContractPlanData.contractPlanAmountIncludeTax =
              ifNull(item1.contractPlanAmountIncludeTax, 0) / 1;
            // 调整后合约规划金额（不含税）(元)
            _rowContractPlanData.contractPlanAmountExcludeTax = ifNull(
              item1.contractPlanAmountExcludeTax,
              0
            );
            // 预估变更比例
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
                item1.contractPlanModel.name; // 合约规划名称
              _rowContractPlanData.level1Name =
                item1.contractPlanModel.level1Name; // 一级分类
              _rowContractPlanData.level2Name =
                item1.contractPlanModel.level2Name; // 二级分类
              // _rowContractPlanData.wang += item1.contractPlanModel.name
            }

            // 是否被锁定，有值就是被锁定
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
            _rowContractPlanData.splitCpAmtToSbRate = item1.splitCpAmtToSbRate;
            //项目id
            _rowContractPlanData.projectId = item1.projectId;

            _rowContractPlanData.contractPlanModel = item1.contractPlanModel; // 规划类型
            // 插入科目规划行
            _this.pageModelList.push(_rowContractPlanData);
          });
        }
        // }
      });

      // 设置页面调剂/调回 和 释放 状态
      this.setPageEditFlag();

      if (this.pageModelList && this.pageModelList.length === 0) {
        this.$showNormalError("没有可用数据");
        return;
      }

      // 备份数据
      this.pageOriginalModelList = deepCopy(this.pageModelList);

      this.calcSubjectData();

      if (this.page.isEdit) this.handleEdit();

      this.pageStatus.hash = calc.Hash(this.prepareSaveData());
      console.log(this.pageModelList);
      console.log("initTableData:" + this.pageStatus.hash);
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
        _subjectList[rowData.subjectCode]._sumAmtReleasedBefore = 0;
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
            _subjectList[item.subjectCode]._sumAmtReleasedBefore = 0;
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

            _subjectList[item.subjectCode]._sumAmtReleasedBefore = calc.Add(
              ifNull(_subjectList[item.subjectCode]._sumAmtReleasedBefore, 0),
              ifNull(item.amtReleasedBefore, 0)
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
            item._sumAmtReleasedBefore =
              _subjectList[item.subjectCode]._sumAmtReleasedBefore * 1;
          }
        }
      });
      //console.info(this.pageModelList)
    },
    //
    // 计算行数据(根据调整金额计算)
    // modify@20181014
    /* 
        1、新增借调字段（调整后合约规划用）returnFix ，借出为负，借进位正 
        2、去除锁定合约lockedBy不参与运算的逻辑
    */
    calcRowData(
      index,
      rowData,
      fieldType,
      hadCalSubjectContractList = [],
      event
    ) {
      if (rowData.lockedBy) return; // 锁定不可调整
      let _this = this;
      let _rowData = JSON.parse(JSON.stringify(rowData));
      fieldType = this._ToString(fieldType);

      //释放金额必须小于等于“调整前待发生金额(含税)(元)”
      if (
        fieldType === "amountRelease" &&
        _rowData.amountRelease > _rowData.amtPendingOccurenceBefore
      ) {
        _this.$showError(
          "释放金额必须小于等于“调整前待发生金额(含税)(元)”" +
            _rowData.amtPendingOccurenceBefore
        );
        this.$nextTick(() => {
          rowData.amountRelease = 0;
          if (event) event.target.value = "0.00";
          _this.setPageEditFlag();
        });
        return;
      }

      // 释放
      if (fieldType === "amountRelease") {
        // 调整前已释放+本次释放 === amtReleasedBefore +amountRelease
        _rowData.amountReleased =
          calc.Add(
            ifNull(_rowData.amtReleasedBefore, 0),
            ifNull(_rowData.amountRelease, 0)
          ) / 1;
      }

      // 调回小于等于调整前已释放
      if (fieldType === "amountReturnedBack") {
        if (
          ifNull(_rowData.amountReturnedBack, 0) <=
          ifNull(_rowData.amtReleasedBefore, 0)
        ) {
          // 调整后已释放金额(含税)(元
          // 调回
          // 调整前已释放-调回 === amtReleasedBefore - amountReturnedBack
          _rowData.amountReleased =
            calc.Sub(
              ifNull(_rowData.amtReleasedBefore, 0),
              ifNull(_rowData.amountReturnedBack, 0)
            ) / 1;
        } else {
          // 调回大于调整前已释放：不足的金额本科目从其他合约调整后已释放金额扣减

          // 本规划不够调回金额
          let notEnoughAmount =
            ifNull(_rowData.amountReturnedBack, 0) -
            ifNull(_rowData.amountReleased, 0);

          // step1：获取本科目其他合约调整后已释放金额合计
          let _sameSubjectOtherContractListId = [];
          let _sameSubjectOtherContractList = this.pageModelList.filter(
            item => {
              if (hadCalSubjectContractList.length > 0) {
                return (
                  item.subjectId === _rowData.subjectId && // 科目相同的
                  item.dataType === COSTENUM.contractPlanType.CONTRACTPlan && // 类型为规划的
                  item.contractPlanModel && // 存在规划的
                  _rowData.contractPlanModel && // 存在规划的
                  item.contractPlanModel.id !== _rowData.contractPlanModel.id && // 非当前规划的
                  item.amountReleased > 0
                ); // 有钱的
                // && !item.lockedBy && // 非锁定的 // modify@20181014（2、去除锁定合约lockedBy不参与运算的逻辑）
                !hadCalSubjectContractList.includes(item.contractPlanModel.id); // 排除已经算过的
              } else {
                return (
                  item.subjectId === _rowData.subjectId && // 科目相同的
                  item.dataType === COSTENUM.contractPlanType.CONTRACTPlan && // 类型为规划的
                  item.contractPlanModel && // 存在规划的
                  _rowData.contractPlanModel && // 存在规划的
                  item.contractPlanModel.id !== _rowData.contractPlanModel.id && // 非当前规划的
                  item.amountReleased > 0
                ); // 有钱的
                // && !item.lockedBy // 非锁定的 // modify@20181014（2、去除锁定合约lockedBy不参与运算的逻辑）
              }
            }
          );
          // 科目下其他规划合计
          let _sameSubjectOtherContractList_sum_amountReleased = 0;
          _sameSubjectOtherContractList.map(item => {
            _sameSubjectOtherContractList_sum_amountReleased = calc.Add(
              _sameSubjectOtherContractList_sum_amountReleased,
              ifNull(item.amountReleased, 0)
            );

            _sameSubjectOtherContractListId.push(item.contractPlanModel.id);
          });
          debugger;
          if (
            notEnoughAmount > _sameSubjectOtherContractList_sum_amountReleased
          ) {
            _this.$showError("调回金额不足，请修改");
            this.$nextTick(() => {
              rowData.amountReturnedBack = 0;
              if (event) event.target.value = "0.00";
              _this.setPageEditFlag();
            });
            // this.pageStatus.checkSave = false
            return;
          } else {
            _rowData.amountReleased = 0; // 本规划 调整后已释放金额(含税)(元) 清0

            // 拆解本科目其他规划的 调整后已释放this.pageOriginalModelList
            this.pageModelList.map(item => {
              // 检查该规划元素
              if (
                item.dataType === COSTENUM.contractPlanType.CONTRACTPlan &&
                item.contractPlanModel &&
                _sameSubjectOtherContractListId.includes(
                  item.contractPlanModel.id
                )
              ) {
                console.log(
                  "a:" + item.amountReleased + "b:" + notEnoughAmount
                );

                // 检查金额
                if (notEnoughAmount > 0) {
                  if (item.amountReleased <= notEnoughAmount) {
                    //借调金额
                    //借出
                    item.returnFix = calc.Mul(
                      ifNull(item.amountReleased, 0),
                      -1
                    );
                    //借入
                    _rowData.returnFix = calc.Add(
                      rowData.returnFix,
                      ifNull(item.amountReleased, 0)
                    );
                    notEnoughAmount = notEnoughAmount - item.amountReleased; // 减掉已拆解的金额
                    item.amountReleased = 0; // 拆解该规划
                  } else {
                    //借调金额
                    //借出
                    item.returnFix = calc.Mul(ifNull(notEnoughAmount, 0), -1);
                    //借入
                    _rowData.returnFix = calc.Add(
                      rowData.returnFix,
                      ifNull(notEnoughAmount, 0)
                    );
                    item.amountReleased -= notEnoughAmount; // 拆解该规划 并有剩余
                    notEnoughAmount = 0; // 减掉已拆解的金额
                  }

                  // 调整后待发生金额（含税）(元)
                  // 调整前待发生-释放金额+调回+调剂 === amtPendingOccurenceBefore - amountRelease +  amountAdjust + amountReturnedBack
                  item.amountPendingOccurence =
                    calc.Sub(
                      ifNull(item.amtPendingOccurenceBefore, 0),
                      ifNull(item.amountRelease, 0)
                    ) / 1;
                  item.amountPendingOccurence =
                    calc.Add(
                      item.amountPendingOccurence,
                      ifNull(item.amountAdjust, 0)
                    ) / 1;
                  item.amountPendingOccurence =
                    calc.Add(
                      item.amountPendingOccurence,
                      ifNull(item.amountReturnedBack, 0)
                    ) / 1;

                  // 调整后合约规划金额（含税）(元)
                  // 调整前合约规划金额（含税）(元)cpAmtIncludeTaxBefore+调剂金额（含税）(元)[编辑]amountAdjust+借调金额returnFix
                  item.contractPlanAmountIncludeTax = calc.Add(
                    ifNull(item.cpAmtIncludeTaxBefore, 0),
                    ifNull(item.amountAdjust, 0)
                  );
                  item.contractPlanAmountIncludeTax = calc.Add(
                    ifNull(item.contractPlanAmountIncludeTax, 0),
                    ifNull(item.returnFix, 0)
                  );

                  /*注释@20181015
                  // 调整后已释放+调整后待发生 +调整前在途金额（含税）(元)+调整前已释放金额（含税）(元) === amountReleased+amountPendingOccurence+amountPendingApprove+amtReleasedBefore
                  //item.contractPlanAmountIncludeTax = calc.Add(ifNull(item.amountReleased, 0), ifNull(item.amountPendingOccurence, 0)) / 1
                  // item.contractPlanAmountIncludeTax = calc.Add(ifNull(item.contractPlanAmountIncludeTax, 0), ifNull(item.amountPendingApprove, 0)) / 1
                  // item.contractPlanAmountIncludeTax = calc.Add(ifNull(item.contractPlanAmountIncludeTax, 0), ifNull(item.amtReleasedBefore, 0)) / 1
                  */

                  // 成本科目比例
                  item.splitRate =
                    calc
                      .Mul(
                        calc.Div(
                          item.contractPlanAmountIncludeTax,
                          item.subjectAmountIncludeTax
                        ),
                        100
                      )
                      .toFixed(2) / 1;
                }
              }
            });
          }
        }
      }
      // 调整后待发生金额（含税）(元)
      // 调整前待发生-释放金额+调回+调剂 === amtPendingOccurenceBefore - amountRelease +  amountAdjust + amountReturnedBack
      _rowData.amountPendingOccurence =
        calc.Sub(
          ifNull(_rowData.amtPendingOccurenceBefore, 0),
          ifNull(_rowData.amountRelease, 0)
        ) / 1;
      _rowData.amountPendingOccurence =
        calc.Add(
          _rowData.amountPendingOccurence,
          ifNull(_rowData.amountAdjust, 0)
        ) / 1;
      _rowData.amountPendingOccurence =
        calc.Add(
          _rowData.amountPendingOccurence,
          ifNull(_rowData.amountReturnedBack, 0)
        ) / 1;

      // http://jira.movit-tech.com:1024/browse/MCP-770 小于0设置位0
      if (_rowData.amountPendingOccurence < 0) {
        //this.$showNormalError('调整后待发生金额(含税)不能为负数')
        // this.pageStatus.checkSave = false
        //return
        _rowData.amountPendingOccurence = 0;
      }

      // 调整后合约规划金额（含税）(元)
      // 调整前合约规划金额（含税）(元)cpAmtIncludeTaxBefore+调剂金额（含税）(元)[编辑]amountAdjust+借调金额returnFix
      _rowData.contractPlanAmountIncludeTax = calc.Add(
        ifNull(_rowData.cpAmtIncludeTaxBefore, 0),
        ifNull(_rowData.amountAdjust, 0)
      );
      _rowData.contractPlanAmountIncludeTax = calc.Add(
        ifNull(_rowData.contractPlanAmountIncludeTax, 0),
        ifNull(_rowData.returnFix, 0)
      );

      /*注释@20181015
      // 调整后已释放+调整后待发生 +调整前在途金额（含税）(元)+调整前已释放金额（含税）(元) === amountReleased+amountPendingOccurence+amountPendingApprove+amtReleasedBefore
      //_rowData.contractPlanAmountIncludeTax = calc.Add(ifNull(_rowData.amountReleased, 0), ifNull(_rowData.amountPendingOccurence, 0)) / 1
      //_rowData.contractPlanAmountIncludeTax = calc.Add(ifNull(_rowData.contractPlanAmountIncludeTax, 0), ifNull(_rowData.amountPendingApprove, 0)) / 1
      //_rowData.contractPlanAmountIncludeTax = calc.Add(ifNull(_rowData.contractPlanAmountIncludeTax, 0), ifNull(_rowData.amtReleasedBefore, 0)) / 1
      */

      // 合约规划金额(不含税)(元)
      _rowData.contractPlanAmountExcludeTax =
        calc
          .Div(_rowData.contractPlanAmountIncludeTax, 1 + _rowData.taxRate)
          .toFixed(2) / 1;
      // 税额
      _rowData.tax =
        calc
          .Sub(
            _rowData.contractPlanAmountIncludeTax,
            _rowData.contractPlanAmountExcludeTax
          )
          .toFixed(2) / 1;
      // 预估变更金额（含税）
      _rowData.reservedChangeAmountIncludeTax =
        calc
          .Mul(
            _rowData.contractPlanAmountIncludeTax,
            _rowData.reservedChangeRate / 100
          )
          .toFixed(2) / 1;
      // 预估变更金额（不含税）
      _rowData.reservedChangeAmountExcludeTax =
        calc
          .Div(
            _rowData.reservedChangeAmountIncludeTax,
            calc.Add(_rowData.taxRate, 1)
          )
          .toFixed(2) / 1;
      // 成本科目比例
      _rowData.splitRate =
        calc
          .Mul(
            calc.Div(
              _rowData.contractPlanAmountIncludeTax,
              _rowData.subjectAmountIncludeTax
            ),
            100
          )
          .toFixed(2) / 1;

      this.pageModelList[index] = _rowData;
      this.pageStatus.checkSave = true;
      this.calcSubjectData(index, _rowData); // 汇总科目
    },
    // 获取默认行数据
    getDefaultRow(index, rowData) {
      let _newRow = deepCopy(this.pageModel);
      _newRow.id = rowData.id;
      _newRow.subjectId = rowData.subjectId;
      _newRow.subjectCode = rowData.subjectCode;
      _newRow.stageId = rowData.stageId;
      _newRow.stageVersion = rowData.stageVersion;
      _newRow.ownerId = rowData.ownerId;
      _newRow.taxRate = rowData.taxRate;
      _newRow.subjectAmountIncludeTax = ifNull(
        rowData.subjectAmountIncludeTax,
        0
      );
      _newRow.dataType = COSTENUM.contractPlanType.CONTRACTPlan;
      _newRow.apportionmentRuleCode = rowData.apportionmentRuleCode;
      _newRow.responsibleDeptCode = rowData.responsibleDeptCode;
      return _newRow;
    },
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
      debugger;
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
      // 返回的code
      _row._isNew = true;
      _row._show = true;
      _row._editStatus = true;
      _row.taxRate = rowData.taxRate;
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
    },
    // 加载成本分期的规划编制信息
    loadAccountContractDetail(accountingObjectId) {
      if (!this.detailModel.canImportOrNot) {
        this.$showNormalError("当前阶段不可引入模板");
        return;
      }
      this.checkDetail();
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
    handleRowFocus() {
      clearTimeout(this.focusTimeOut);
      this.pageStatus.focus = true;
    },
    // 输入验证
    handleRowChange(fieldType, fieldInputValue, rowData, index, event) {
      this.focusTimeOut = setTimeout(() => {
        this.pageStatus.focus = false;
      }, 500);
      if (!fieldInputValue) {
        fieldInputValue = 0;
        if (
          fieldType === "amountAdjust" ||
          fieldType === "amountRelease" ||
          fieldType === "amountReturnedBack"
        ) {
          rowData[fieldType] = 0;
        }
      }
      let _reg = "";
      let _errmsg = null;
      let fieldValue = fieldInputValue;
      if (fieldValue.length === 0) {
        this.$showError("输入错误！");
        this.pageStatus.checkSave = false;
        // event.currentTarget.focus()
        this.setPageEditFlag();
        return;
      }

      this.pageStatus.checkSave = true;
      // 计算行数据
      if (fieldType === "amountAdjust") {
        // 调剂金额(含税)(元)
        this.setPageEditFlag();
        this.calcRowData(index, rowData, fieldType, [], event);
      } else if (fieldType === "amountRelease") {
        // 释放金额(含税)(元)
        this.setPageEditFlag();
        this.calcRowData(index, rowData, fieldType, [], event);
      } else if (fieldType === "amountReturnedBack") {
        // 调回金额(含税)(元)
        this.setPageEditFlag();
        // 重置当前科目所有规划”调整前已释放金额（含税）(元)	amtReleasedBefore“
        this.pageModelList.map(item => {
          if (
            item.contractPlanModel &&
            rowData.subjectId === item.subjectId &&
            item.dataType === COSTENUM.contractPlanType.CONTRACTPlan &&
            item.contractPlanModel
          ) {
            // 非锁定
            // modify@20181014（2、去除锁定合约lockedBy不参与运算的逻辑）
            //if (!item.lockedBy) item.amountReleased = calc.Mul(item.amtReleasedBefore, 1)
            item.amountReleased = calc.Mul(item.amtReleasedBefore, 1);

            //重置 借调金额
            item.returnFix = 0;
          }
        });
        rowData.amountReleased = calc.Mul(rowData.amtReleasedBefore, 1);

        // 重算当前科目下所有规划的”调回“
        let _index = 0;
        let _hadCalSubjectContractList = []; // 计算过的规划，下次计算需要排查之前的计算过的规划
        this.pageModelList.map(item => {
          if (
            item.subjectId === rowData.subjectId &&
            item.dataType === COSTENUM.contractPlanType.CONTRACTPlan &&
            item.contractPlanModel
            // && !item.lockedBy // 非锁定 // modify@20181014（2、去除锁定合约lockedBy不参与运算的逻辑）
          ) {
            // 逐个运算
            if (item.amountReturnedBack > 0)
              this.calcRowData(
                _index,
                item,
                fieldType,
                _hadCalSubjectContractList,
                event
              );
            // 计算过的规划
            if (item.amountReleased == 0)
              _hadCalSubjectContractList.push(item.contractPlanModel.id);
          }
          _index++;
        });
      }
    },
    // 行显示
    showRow(row) {
      // 行隐藏
      const show = row.row._show;
      let _font =
        row.row.dataType === "1" && row.row.isLeaf ? "font-weight: bold;" : "";
      // if (row._isSelect) {
      //     _font += ';color:red'
      // }
      return show
        ? "animation:treeTableShow 1s;-webkit-animation:treeTableShow 1s;" +
            _font
        : "display:none;" + _font;
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
      console.log("this.pageModelList6666666666");
      console.log(this.pageModelList);
      if (!this.queryModel.subjectCodeOrName) {
        this.pageModelList.map(item => {
          item._show = !COSTBUSINESS.checkIsSpecialCode({
            nodeSource: item.nodeSource,
            code: item.subjectCode
          }); // .99不显示
        });
      } else {
        if (this.queryModel.subjectCodeOrName) this.queryModel.subjectCodeOrName = this.queryModel.subjectCodeOrName.trim();
        console.log("this.pageModelList");
        console.log(this.pageModelList);
        console.log(_this.queryModel.subjectCodeOrName);
        console.log(_this.queryModel.subjectCodeOrName);

        let filterData = this.pageModelList.filter(function(item, index) {
          // console.log('********filter********')
          // console.log(index)
          return (
            item.subjectCode.indexOf(_this.queryModel.subjectCodeOrName) > -1 ||
            item.subjectName.indexOf(_this.queryModel.subjectCodeOrName) > -1 ||
            item.wang.indexOf(_this.queryModel.subjectCodeOrName) > -1
          );
        });
        // || item.contractPlanName.indexOf(_this.queryModel.subjectCodeOrName) > -1
        console.log('filterData')
        console.log(filterData)
        // console.log("filterData");
        // console.log(filterData);
        if (filterData.length === 0) {
          LoadingUtil.hideLoading();
          this.pageModelList.map(item => {
            item._show = false;
          });
          this.$showNormalError("没有符合条件的数据");
          return;
        }

        this.pageModelList.map(item => {
          // console.log('this.pageModelList123132')
          // console.log(this.pageModelList)
          // console.log(_this.queryModel.subjectCodeOrName)
          // console.log(_this.queryModel.subjectCodeOrName)
          // || item.contractPlanName.indexOf(_this.queryModel.subjectCodeOrName) > -1
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
        // console.log("end pageModelList");
        // console.log(this.pageModelList);
      }
      LoadingUtil.hideLoading();
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
    },
    // 获取调整成本分期明细
    getAdjustDetail() {
      LoadingUtil.showLoading();
      if (
        this.queryModel.accountingObjectId &&
        this.queryModel.accountingObjectId !== "0"
      ) {
        getAdjustContractPlanDetail({
          accountingObjectId: this.queryModel.accountingObjectId,
          stageId: this.detailModel.stageId,
          stageVersion: this.queryModel.stageVersion
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
    // 获取保存后分期明细
    getDetail() {
      LoadingUtil.showLoading();
      if (
        this.queryModel.accountingObjectId &&
        this.queryModel.accountingObjectId !== "0"
      ) {
        getContractPlanDetail({
          accountingObjectId: this.queryModel.accountingObjectId,
          stageId: this.detailModel.stageId,
          stageVersion: this.queryModel.stageVersion
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
    // 检查是否可以调整
    checkDetail() {
      if (this.$route.query.accountingObjectId) return;
      LoadingUtil.showLoading();
      if (
        this.queryModel.accountingObjectId &&
        this.queryModel.accountingObjectId !== "0"
      ) {
        checkAdjustStageVersion({
          accountingObjectId: this.queryModel.accountingObjectId,
          stageId: this.queryModel.stageId
        })
          .then(response => {
            // this.$showSuccess(response.message)
            if (response.data) {
              this.initTableData(response);
            } else {
              this.$showError(
                response.message ? response.message : "msg_system_error"
              );
            }
            LoadingUtil.hideLoading();
          })
          .catch(error => {
            console.log(error);
            LoadingUtil.hideLoading();
            this.$showError(error.message ? error.message : "msg_system_error");
          });
      }
      LoadingUtil.hideLoading();
    },
    // 准备保存数据
    prepareSaveData() {
      let _saveData = this.saveData; // rowTemplateData
      _saveData.subjectModelList.map(item => {
        let _targetCostContractPlanModelList = [];
        this.pageModelList.map(item1 => {
          if (item1.subjectId === item.id && item1.dataType === "2") {
            let _contractPlanItem = deepCopy(this.rowTemplateData);
            _contractPlanItem.subjectId = item1.subjectId;
            _contractPlanItem.contractPlanId = item1.contractPlanModel.id;
            _contractPlanItem.type = "2";
            _contractPlanItem.stageId = this.detailModel.stageId;
            _contractPlanItem.stageVersion = this.detailModel.stageVersion;
            _contractPlanItem.ownerId = this.detailModel.ownerId;
            _contractPlanItem.splitRate = item1.splitRate;
            _contractPlanItem.reservedChangeRate = item1.reservedChangeRate;

            _contractPlanItem.cpAmtIncludeTaxBefore =
              item1.cpAmtIncludeTaxBefore;
            _contractPlanItem.cpAmtExcludeTaxBefore =
              item1.cpAmtExcludeTaxBefore;
            _contractPlanItem.amtReleasedBefore = item1.amtReleasedBefore;
            _contractPlanItem.amtPendingOccurenceBefore =
              item1.amtPendingOccurenceBefore;

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
            // 规划
            _contractPlanItem.contractPlanModel = item1.contractPlanModel;

            _contractPlanItem.amountPendingApprove = item1.amountPendingApprove; // 在途金额
            _contractPlanItem.amountOccurence = item1.amountOccurence; // 待发生金额
            _contractPlanItem.amountReleased = item1.amountReleased; // 已发生金额
            _contractPlanItem.amountPendingOccurence =
              item1.amountPendingOccurence; // 释放金额
            _contractPlanItem.amountRelease = item1.amountRelease; // 调剂金额
            _contractPlanItem.amountReturnedBack = item1.amountReturnedBack; // 调回金额
            _contractPlanItem.amountAdjust = item1.amountAdjust; // 已释放金额

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
      //     targetCostContractPlanModelList: _saveData
      // }
      _saveData.stageId = this.detailModel.stageId;
      _saveData.stageVersion = this.detailModel.stageVersion;

      //新增
      _saveData.contractPlanNum = this.detailModel.contractPlanNum; //合约规划份数：计算
      _saveData.segmentationNum = this.detailModel.segmentationNum; //合约标段划分数量
      _saveData.groupStrategyBuyNum = this.detailModel.groupStrategyBuyNum; // 集团战略采购份数
      _saveData.materEquipBuyNum = this.detailModel.materEquipBuyNum; //材料设备采购份数
      _saveData.groupCenterBuyNum = this.detailModel.groupCenterBuyNum; //集团集中采购份数
      _saveData.cpAdjustRange = this.detailModel.cpAdjustRange; //合约规划调整范围
      _saveData.adjustAmt = this.detailModel.adjustAmt; //调整涉及金额：
      _saveData.projectBuyNum = this.detailModel.projectBuyNum; //工程采购份数：
      _saveData.adjustCpChangeNum = this.detailModel.adjustCpChangeNum; //调整后合约增减份数 计算
      _saveData.adjustSubject = this.detailModel.adjustSubject; //调整涉及科目：计算
      _saveData.auditApprovalDate = this.detailModel.auditApprovalDate; //审批通过日期//审批日期
      _saveData.attachments = this.page.attachment.attachmentData;
      let _param = _saveData;
      return _param;
    },
    // 检查输入项目
    checkSaveOrSubmit() {
      let message = "";

      //表头明细
      if (
        (!this.detailModel.segmentationNum &&
          this.detailModel.segmentationNum !== 0) || //合约标段划分数量
        (!this.detailModel.groupStrategyBuyNum &&
          this.detailModel.groupStrategyBuyNum !== 0) || // 集团战略采购份数
        (!this.detailModel.materEquipBuyNum &&
          this.detailModel.materEquipBuyNum !== 0) || //材料设备采购份数
        (!this.detailModel.groupCenterBuyNum &&
          this.detailModel.groupCenterBuyNum !== 0) || //集团集中采购份数
        !this.detailModel.cpAdjustRange || //合约规划调整范围
        (!this.detailModel.adjustAmt && this.detailModel.adjustAmt !== 0) || //调整涉及金额：
        (!this.detailModel.projectBuyNum &&
          this.detailModel.projectBuyNum !== 0) //工程采购份数
      ) {
        this.$showNormalError("请填写明细信息");
        this.pageStatus.blockDetailActiveName = "1";
        message = "请填写明细信息";
        return message;
      }

      for (let i = 0; i < this.pageModelList.length; i++) {
        let item = this.pageModelList[i];
        let check = true;
        // 检查 叶子科目(非.99)下挂规划金额合计是否和 科目金额一致
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
            message = "科目[" + item.subjectName + "]规划分摊未完成(金额)";
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
      LoadingUtil.hideLoading();
      this.$showNormalError(message, 10000);
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
    handleSave(autoSubmit = false) {
      // alert('666')
      debugger;
      if (autoSubmit) this.setSubmitStatus();
      LoadingUtil.showLoading();
      if (!this.pageStatus.checkSave) {
        this.$showNormalError("输入数据错误，请修正！");
        if (autoSubmit) this.resetSubmitStatus();
        LoadingUtil.hideLoading();
        return;
      }
      if (this.checkSaveOrSubmit()) {
        LoadingUtil.hideLoading();
        if (autoSubmit) this.resetSubmitStatus();
        return;
      }

      let _param = this.prepareSaveData();

      //检查数据是否修改
      if (calc.Hash(_param) === this.pageStatus.hash) {
        autoSubmit ? this.handleSubmit() : this.$showSuccess("保存成功"); //数据未修改给出”保存成功信息“
        return;
      }

      adjustTargetCostContractPlan(_param)
        .then(response => {
          this.pageStatus.finishSave = true; //完成保存
          LoadingUtil.hideLoading();

          if (response.data) {
            this.detailModel.stageId = response.data.stageId;
            this.queryModel.stageId = response.data.stageId;
            this.detailModel.stageVersion = response.data.stageVersion;
            this.queryModel.stageVersion = response.data.stageVersion;
            this.getCommonInfo(
              this.queryModel.accountingObjectId,
              this.queryModel.stageId,
              this.detailModel.stageVersion
            );
          } else {
            this.getDetail();
          }

          if (autoSubmit) {
            this.handleSubmit();
          } else {
            this.$showSuccess(response.message);
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
        if (autoSubmit) this.resetSubmitStatus();
        LoadingUtil.hideLoading();
        return;
      }
      if (this.checkSaveOrSubmit()) {
        if (autoSubmit) this.resetSubmitStatus();
        return;
      }

      let _param = this.prepareSaveData();
      submitTargetCostContractPlanAdjustment(_param)
        .then(response => {
          LoadingUtil.hideLoading();
          this.pageStatus.finishSubmit = true;
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
        this.loadAccountContractDetail();
      }
    },
    "page.contractPlanSelector.selectNode": function(newValue, oldValue) {
      this.changeCheckedNode(newValue);
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
.col {
  color: blue;
  text-decoration: underline;
  cursor: pointer;
}
</style>


