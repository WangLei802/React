<template>
  <div class="app-container">
    <div style="text-align:right; margin:10px 0;">
      <el-button
        size="mini"
        v-if="!$store.state.user.isFromBpm"
        @click="handleBack"
      >{{$l('btn_back')}}</el-button>
      <el-button
        size="mini"
        type="primary"
        v-if="$checkPersmissionByCode('cost:paymentContract:createOrUpdate')"
        :disabled="buttonDisable"
        v-show="isShowAdd"
        @click="saveConstruction"
      >{{$l('btn_save')}}</el-button>
      <el-button
        size="mini"
        type="primary"
        v-if="$checkPersmissionByCode('cost:paymentContract:createOrUpdate')"
        @click="submitConstructionCost"
        v-show="isShowSubmit"
        :disabled="buttonDisableSub"
      >{{$l('lbl_cost_compilation_submit')}}</el-button>
    </div>
    <div class="form-unit">基本信息</div>
    <el-form
      label-width="150px"
      status-icon
      :model="ConstructionModel"
      ref="ConstructionModel"
      :rules="rules"
      size="mini"
      :disabled="formDisable"
    >
      <el-row :gutter="12">
        <el-col :span="8">
          <!-- 合同编号 -->
          <el-form-item :label="'合同编号:'" prop="contractNumber">
            <el-input v-model="ConstructionModel.contractNumber" :disabled="buttonDisable">
              <span
                @click="addRowToTableConstract"
                slot="append"
                v-show="isEdit"
                class="el-icon-search"
                :style="{'cursor':'pointer'}"
              ></span>
            </el-input>
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <!-- 合同名称 -->
          <el-form-item :label="'合同名称：'">
            <el-input v-model="ConstructionModel.contractName" :disabled="true"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <!-- 签约日期 -->
          <el-form-item :label="'签约日期：'" prop="contractDate">
            <!--<el-input v-model='ConstructionModel.contractDate'-->
            <!--:disabled="true"></el-input>-->
            <el-date-picker
              v-model="ConstructionModel.contractDate"
              style="width: 100%;"
              :disabled="true"
              type="date"
            ></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="12">
        <el-col :span="8">
          <!-- 项目名称 -->
          <el-form-item :label="'项目名称：'">
            <el-input v-model="ConstructionModel.projectName" :disabled="true"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <!-- 合同金额（元） -->
          <el-form-item :label="'签约金额（元）：'">
            <el-input-number
              v-model="ConstructionModel.contractValue"
              :disabled="true"
              :precision="2"
              :controls="false"
              style="width: 100%;"
            ></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <!-- 补充合同总额（元） -->
          <el-form-item :label="'补充合同总额（元）：'">
            <el-input-number
              v-model="ConstructionModel.additionalMoney"
              :disabled="true"
              :precision="2"
              :controls="false"
              style="width: 100%;"
            ></el-input-number>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="12">
        <el-col :span="8">
          <!-- 合同变更总额（元）： -->
          <el-form-item :label="'合同变更总额（元）：'">
            <el-input-number
              v-model="ConstructionModel.changeMoney"
              :disabled="true"
              :precision="2"
              :controls="false"
              style="width: 100%"
            ></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <!-- 变更签证总额（元） -->
          <el-form-item :label="'变更签证总额（元）：'">
            <el-input-number
              v-model="ConstructionModel.alterationMoney"
              :disabled="true"
              :precision="2"
              :controls="false"
              style="width: 100%"
            ></el-input-number>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="12">
        <el-col :span="8">
          <!-- 转固金额（元） -->
          <el-form-item :label="'转固金额（元）：'">
            <el-input-number
              v-model="ConstructionModel.conveySureMoney"
              :disabled="true"
              :precision="2"
              :controls="false"
              style="width: 100%"
            ></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <!-- 转固后补充合同金额（元）： -->
          <el-form-item :label="'转固后补充合同金额（元）：'" title="转固后补充合同金额（元）：">
            <el-input-number
              v-model="ConstructionModel.additionalMoneyConvey"
              :disabled="true"
              :precision="2"
              :controls="false"
              style="width: 100%"
            ></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <!-- 转固后合同变更金额（元） -->
          <el-form-item :label="'转固后合同变更金额（元）：'" title="转固后合同变更金额（元）：">
            <el-input-number
              v-model="ConstructionModel.changeMoneyConvey"
              :disabled="true"
              :precision="2"
              :controls="false"
              style="width: 100%"
            ></el-input-number>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="12">
        <el-col :span="8">
          <!-- 未转固变更签证金额（元） -->
          <el-form-item :label="'未转固变更签证金额（元）：'" title="未转固变更签证金额（元）：">
            <el-input-number
              v-model="ConstructionModel.alterationMoneyConvey"
              :disabled="true"
              :precision="2"
              :controls="false"
              style="width: 100%"
            ></el-input-number>
          </el-form-item>
        </el-col>
      </el-row>

      <div class="form-unit">结算信息</div>
      <el-row :gutter="12">
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <!-- 结算编号 -->
            <el-form-item :label="'结算编号：'">
              <el-input v-model="ConstructionModel.estimateNo" :disabled="true"></el-input>
            </el-form-item>
          </div>
        </el-col>

        <el-col :span="8">
          <el-form-item :label="'开工日期：'" prop="startDate">
            <el-date-picker
              v-model="ConstructionModel.startDate"
              style="width:100%"
              :picker-options="pickerOptions0"
              type="date"
              placeholder="选择日期"
              :disabled="inputDisable"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="'竣工日期：'" prop="endDate">
            <el-date-picker
              v-model="ConstructionModel.endDate"
              style="width: 100%"
              :picker-options="pickerOptions1"
              type="date"
              placeholder="选择日期"
              :disabled="inputDisable"
            ></el-date-picker>
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <el-form-item :label="'类似项目标准：'" prop="startDate">
            <fd-select
              v-model="ConstructionModel.projectStandard"
              type="project_standard"
              :disabled="inputDisable"
            ></fd-select>
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <!-- 建筑面积 -->
          <el-form-item :label="'建筑面积(㎡)：'">
            <el-input-number
              v-model="ConstructionModel.buildingArea"
              v-on:input="inputFunc"
              :disabled="inputDisable"
              :precision="2"
              :controls="false"
              style="width: 100%"
            ></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <!-- 保修金金额(元) -->
          <el-form-item :label="'质保金金额(元)：'">
            <el-input-number
              v-model="ConstructionModel.repairMoney"
              :disabled="inputDisable"
              :precision="2"
              :controls="false"
              style="width: 100%;"
            ></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <!-- 报审金额(元) -->
          <el-form-item :label="'报审金额(元)：'">
            <el-input-number
              v-model="ConstructionModel.reportMoney"
              :disabled="inputDisable"
              :precision="2"
              :controls="false"
              style="width: 100%;"
            ></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <!-- *结算金额(元) -->
          <el-form-item :label="'结算金额(元)：'" prop="estimatePrice">
            <el-input-number
              v-model="ConstructionModel.estimatePrice"
              v-on:input="inputFunc"
              :disabled="inputDisable"
              :precision="2"
              :controls="false"
              style="width: 100%;"
            ></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <!-- 应付未付金额(元) -->
          <el-form-item :label="'应付未付金额(元)：'">
            <el-input-number
              v-model="ConstructionModel.totalPayableAmt"
              :disabled="true"
              :precision="2"
              :controls="false"
              style="width: 100%;"
            ></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <!-- 目标成本单方造价(元) -->
          <el-form-item :label="'目标成本单方造价(元/㎡)：'">
            <el-input-number
              v-model="ConstructionModel.targetSinglePrice"
              :disabled="inputDisable"
              :precision="2"
              :controls="false"
              style="width: 100%;"
            ></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <!-- 结算单方造价(元)(元) -->
          <el-form-item :label="'结算单方造价(元/㎡)：'">
            <el-input-number
              v-model="ConstructionModel.paymentSinglePrice"
              :disabled="true"
              :precision="2"
              :controls="false"
              style="width: 100%;"
            ></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <!-- 结算审批 -->
          <el-form-item :label="'结算审批：'" prop="startDate">
            <fd-select
              v-model="ConstructionModel.settlementApproval"
              type="cost_settlement_approval"
              :disabled="inputDisable"
            ></fd-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="12">
        <el-col :span="8">
          <!-- 经办人 -->
          <el-form-item :label="'经办人：'" prop="operator">
            <el-input v-model="ConstructionModel.operator" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <!-- 提交日期 -->
          <el-form-item :label="'提交日期：'" prop="operateDate">
            <!--<el-input v-model='ConstructionModel.operateDate'-->
            <!--:disabled="true"></el-input>-->
            <el-date-picker v-model="ConstructionModel.operateDate" :disabled="true" type="date"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <!-- 结算审是否超战略指导价：-->
          <el-form-item :label="'是否超战略指导价：'" prop="startDate">
            <fd-select
              v-model="ConstructionModel.isOverPrice"
              type="cost_settlement_over_price"
              :disabled="inputDisable"
            ></fd-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="12">
        <el-col :span="8">
          <!-- 审批状态 -->
          <el-form-item :label="'审批状态：'">
            <!-- <fd-label :code="ConstructionModel.statusCh"
                        type="cost_flow_status"
            :disabled="fa"></fd-label>-->
            <!-- <div>{{ConstructionModel.statusCh}}</div> -->
            <fd-label
              :code="ConstructionModel.status"
              :class="{col:flag}"
              :url= "bpmUrl"
              type="cost_flow_status"
              :disabled="true"
            ></fd-label>
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <!-- 审批日期： -->
          <el-form-item :label="'审批日期：'" prop="approveDate">
            <!--<el-input v-model='ConstructionModel.approveDate'-->
            <!--:disabled="true"></el-input>-->
            <el-date-picker v-model="ConstructionModel.approveDate" :disabled="true" type="date"></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- disputeContent -->
      <el-row>
        <el-col :span="24">
          <!-- 争议项内容 -->
          <el-form-item :label="'争议项内容：'">
            <el-input
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4}"
              placeholder="请输入内容"
              v-model="ConstructionModel.disputeContent"
              :disabled="buttonDisable"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <!-- 处理结果 -->
          <el-form-item :label="'处理结果：'">
            <el-input
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4}"
              placeholder="请输入内容"
              v-model="ConstructionModel.processResult"
              :disabled="buttonDisable"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <!-- 备注 -->
          <el-form-item :label="'备注：'">
            <el-input
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4}"
              placeholder="请输入内容"
              v-model="ConstructionModel.remark"
              :disabled="buttonDisable"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <div class="form-unit" style="text-align:left; margin:10px 0;">未转固变更签证信息</div>
      <el-table
        :data="getalterationIdListData"
        stripe
        @select="handleSelect"
        @select-all="handleSelectAll"
        border
        tooltip-effect="dark"
        style="width: 100%"
        size="small"
      >
        <!-- 序号 -->
        <el-table-column type="index" :label="this.$l('lbl_no')" width="80"></el-table-column>
        <!-- 变更签证编号 -->
        <el-table-column prop="alterationVisaCode" :label="'变更签证编号'" width="200">
          <template slot-scope="scope">
            <span style="width: 100%;">{{scope.row.alterationVisaCode}}</span>
          </template>
        </el-table-column>

        <!-- 变更签证名称 -->
        <el-table-column prop="alterationVisaName" :label="'变更签证名称'" width="200">
          <template slot-scope="scope">
            <span style="width: 100%;">{{scope.row.alterationVisaName}}</span>
          </template>
        </el-table-column>

        <!-- 变更签证预估金额（元） -->
        <el-table-column prop="costConfirmEstimatedAmt" :label="'预估金额（元）'" width="200">
          <template slot-scope="scope">
            <span style="width: 100%;">{{scope.row.estimatedAmt | NumFormat}}</span>
          </template>
        </el-table-column>

        <!-- 变更签证实际金额（元） -->
        <el-table-column prop="costConfirmEstimatedAmt" :label="'确认金额（元）'" width="200">
          <template slot-scope="scope">
            <span
              style="width: 100%;"
              v-if="scope.row.isRetryCostConfirm === '1' && scope.row.approveStatus === '7' && scope.row.processNode === '4'"
            >{{scope.row.costRetryConfirmAmt | NumFormat}}</span>
            <span
              style="width: 100%;"
              v-else-if=" scope.row.processNode === '4' && scope.row.approveStatus != '7' && scope.row.isRetryCostConfirm === '1'"
            >{{scope.row.costConfirmAmt | NumFormat}}</span>
            <span
              style="width: 100%;"
              v-else-if=" scope.row.processNode === '4' && scope.row.approveStatus === '7' "
            >{{scope.row.costConfirmAmt | NumFormat}}</span>
          </template>
        </el-table-column>

        <!-- 变更原因 -->
        <el-table-column prop="variationContent" :label="'变更原因'">
          <template slot-scope="scope">
            <span style="width: 100%;">{{scope.row.variationContent}}</span>
          </template>
        </el-table-column>

        <!-- 提出部门 -->
        <el-table-column prop="accountabilityUnit" :label="'提出部门'">
          <template slot-scope="scope">
            <!--<span style="width: 100%;">-->
            <!--{{scope.row.accountabilityUnit}}-->
            <!--</span>-->
            <fd-label
              :code="scope.row.accountabilityUnit"
              type="cost_subject_responsible_dept_code"
              :disabled="buttonDisable"
            ></fd-label>
          </template>
        </el-table-column>
      </el-table>

      <!-- <div class="subTitle">
<div class="breadcrumb-child">
<i></i>付款信息
</div>
      </div>-->
      <div class="form-unit">付款信息</div>
      <el-table
        :data="applyPayments"
        stripe
        @select="handleSelect"
        @select-all="handleSelectAll"
        border
        tooltip-effect="dark"
        style="width: 100%"
        size="small"
      >
        <!-- 序号 -->
        <el-table-column type="index" :label="this.$l('lbl_no')" width="80"></el-table-column>
        <!-- 付款申请编号 -->
        <!-- <el-table-column type="index" width="200" prop="applyPaymentCode" :label="'付款申请编号'"
v-model="constructionDetailModel.applyPaymentCode">
        </el-table-column>-->
        <el-table-column prop="code" :label="'付款申请编号'" width="200" show-overflow-tooltip>
          <template slot-scope="scope">
            <span style="width: 100%;">{{scope.row.code}}</span>
          </template>
        </el-table-column>
        <!-- 付款申请日期 -->
        <el-table-column
          prop="operatorDate"
          :label="'付款申请日期'"
          width="200"
          :formatter="this.$dateFormat("operatorDate","yyyy-MM-dd")"
        >
          <!--<template slot-scope="scope">-->
          <!--<span style="width: 100%;">-->
          <!--{{scope.row.operatorDate}}-->
          <!--</span>-->

          <!--</template>-->
        </el-table-column>

        <!-- 付款类型 -->
        <el-table-column prop="applyPaymentType" :label="'付款类型'" width="200">
          <template slot-scope="scope">
            <!--<span style="width: 100%;">-->
            <!--{{scope.row.name}}-->
            <!--</span>-->
            <fd-label :code="scope.row.paymentReasonTypeCode" type="cost_payment_type"></fd-label>
          </template>
        </el-table-column>

        <!-- 付款申请金额(元) -->
        <el-table-column prop="applyAmt" :label="'付款申请金额(元)'">
          <template slot-scope="scope">
            <span style="width: 100%;">{{scope.row.applyAmt | NumFormat}}</span>
          </template>
        </el-table-column>

        <!-- 已付款金额(元) -->
        <el-table-column prop="totalActualPaymentAmt" :label="'已付款金额(元)'">
          <template slot-scope="scope">
            <span style="width: 100%;">{{scope.row.totalActualPaymentAmt | NumFormat}}</span>
          </template>
        </el-table-column>
      </el-table>

      <div class="form-unit">奖罚情况</div>
      <el-table
        :data="getApplyPaymentRewardPunishByContractCode"
        stripe
        @select="handleSelect"
        @select-all="handleSelectAll"
        border
        tooltip-effect="dark"
        style="width: 100%"
        size="small"
      >
        <!-- 序号 -->
        <el-table-column type="index" :label="this.$l('lbl_no')" width="80"></el-table-column>
        <!-- 奖罚类型 -->
        <!-- <el-table-column type="index" width="200" prop="code" :label="'奖罚类型'"
v-model="scope.row.code">
        </el-table-column>-->
        <!-- 奖罚类型 -->
        <el-table-column prop="rewardPunishTypeCode" :label="'奖罚类型'" width="200">
          <template slot-scope="scope">
            <fd-label :code="scope.row.rewardPunishTypeCode" type="cost_reward_punish_type"></fd-label>
          </template>
        </el-table-column>

        <!-- 奖罚单位 -->
        <el-table-column prop="rewardPunishUnit" :label="'奖罚单位'" width="200" show-overflow-tooltip>
          <template slot-scope="scope">
            <span style="width: 100%;">{{scope.row.rewardPunishUnit}}</span>
          </template>
        </el-table-column>

        <!-- 奖罚事项 -->
        <el-table-column
          prop="rewardPunishReason"
          :label="'奖罚事项'"
          width="200"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span style="width: 100%;">{{scope.row.rewardPunishReason}}</span>
          </template>
        </el-table-column>

        <!-- 申请金额(元) -->
        <el-table-column prop="applyAmt" :label="'申请金额(元)'">
          <template slot-scope="scope">
            <span style="width: 100%;">{{scope.row.applyAmt | NumFormat}}</span>
          </template>
        </el-table-column>

        <!-- 备注 -->
        <el-table-column prop="remark" :label="'备注'" show-overflow-tooltip>
          <template slot-scope="scope">
            <span style="width: 100%;">{{scope.row.remark}}</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="form-unit">
        成本拆分
        <span>
          <el-button size="mini" type="primary" @click="checkoutDynamic()">执行自动拆分</el-button>
        </span>
      </div>
      <CostSplittingTable
        v-model="ConstructionModel.dynacostSplittingList"
        :splittingWay="ConstructionModel.splittingWay"
        @saveSplit="saveSplit"
      ></CostSplittingTable>

      <div class="subTitle">
        <div class="breadcrumb-child">
          <i></i>附件列表
        </div>
      </div>
      <span class="breadcrumb-child" style="float: left;margin-top: 10px">
        <i></i>上传附件:
      </span>
      <span style="float: left">
        <CostFileUpload
          style="margin-bottom: 20px"
          v-model="fileList"
          :limit="limit"
          :attachmentData="attachmentData"
          :outerId="outerId"
        ></CostFileUpload>
      </span>

      <ContractSelector
        :showContract="isShowContract"
        :moduleCode="moduleCode"
        v-on:cancelDialog="cancelDialog"
        v-on:closeDialog="closeDialog"
        v-on:confirmContract="confirmContract"
      ></ContractSelector>
    </el-form>
    <DesignAlterationAttachmentTable
      :queryObj_passed_in="queryModel"
      :showDeleteButton="showDeleteButton"
      :attaData="attachmentData"
      v-on:changeAttachments="changeAttachments"
      ref="DesignAlterationAttachmentTable"
    ></DesignAlterationAttachmentTable>
  </div>
</template>
<script>
// debugger;
import uuidv1 from "uuid/v1";
import { LoadingUtil } from "@/utils/common/LoadingUtil";
import { ptn } from "@/utils/common/validate";
import COSTENUM from "@/utils/cost/enum";
// import { saveOrUpdateIneffectiveCost } from '@/api/cost/ineffectiveCost'
import {
  saveOrUpdateContract,
  getQueryContractList,
  getContractDetail,
  getVisaList,
  getApplyPaymentRewardPunishByContractCode,
  getPaymentInfoList,
  getalterationIdList,
  getPaymentContractCode,
  dynacostSplittingList,
  getDynacostSplit,
  getDetailByContractCode,
  detailContract
} from "@/api/cost/contractAPI";
import CostSplittingTable from "@/views/cost/contractSettlement/CostSplittingTable";
import { getMeProfile } from "@/api/sys/userAPI";
import ContractSelector from "@/components/cost/ContractSelector/";
import DesignAlterationAttachmentTable from "@/views/cost/designAlteration/DesignAlterationAttachmentTable";
import CostFileUpload from "@/components/cost/UploadFile/";
import { getAttachment } from "@/api/cost/attachment";
import { getApprove } from "@/api/cost/approve";
import { NumFormat, Version } from "@/filters/cost/";
export default {
  props: {
    vm_passed_in: {
      default: function() {
        return {
          id: "",
          projectId: "",
          accountObjectId: "",
          groupNumber: "",
          agent: "",
          operateDate: ""
        };
      }
    },
    handleType: ""
  },
  filters: {
    NumFormat,
    Version
  },
  components: {
    ContractSelector,
    DesignAlterationAttachmentTable,
    CostFileUpload,
    CostSplittingTable
  },
  data() {
    var validateProjectName = (rule, value, callback) => {
      value = this.ConstructionModel.estimatePrice;
      if (value === 0) {
        callback(new Error("结算金额不能为0"));
      } else {
        callback();
      }
    };
    return {
      // 0：T 1：A 2：B 3：C 4：D 5：E 6：F 7：G
      options: [
        {
          id: "0",
          value: "T"
        },
        {
          id: "1",
          value: "A"
        },
        {
          id: "2",
          value: "B"
        },
        {
          id: "3",
          value: "C"
        },
        {
          id: "4",
          value: "D"
        },
        {
          id: "5",
          value: "E"
        },
        {
          id: "6",
          value: "F"
        },
        {
          id: "7",
          value: "G"
        }
      ],
      radio: "",
      rules: {
        amount: [
          {
            pattern: ptn.number(1, 2),
            message: "请输入数字",
            required: true,
            trigger: "blur"
          }
        ],
        orgName: [
          {
            pattern: ptn.all_match(1, 50),
            message: this.$l("msg_org_text"),
            required: true,
            trigger: "blur"
          }
        ],
        orgType: [
          { required: true, message: this.$l("msg_org_type"), trigger: "blur" }
        ],
        startDate: [
          { required: true, message: "请选择开工日期", trigger: "blur" }
        ],
        endDate: [
          { required: true, message: "请选择竣工日期", trigger: "blur" }
        ],
        estimatePrice: [
          { validator: validateProjectName, required: true, trigger: "blur" }
        ],
        contractNumber: [
          { required: true, message: "请选择合同", trigger: "blur" }
        ]
      },
      getApplyPaymentRewardPunishByContractCode: [],
      getalterationIdListData: [],
      // getPaymentInfoListData: {
      //   applyPayments: ''
      // },
      applyPayments: [],
      value: "",
      tableData: [],
      isEdit: false,
      isShowSpan: false,
      isShowAdd: true,
      isShowSubmit: true,
      isShowBack: false,
      buttonDisable: false,
      buttonDisableSub: false,
      showDeleteButton: true,
      formDisable: false,
      inputDisable: false,
      selectTable: [],
      fileList: "",
      moduleCode: COSTENUM.module.CONTRACT_SETTLEMENT,
      limit: 4,
      size: 4,
      outerId: "",
      queryModel: {
        companyId: "",
        projectId: "",
        contractCode: "",
        code: "",
        name: "",
        instructionCode: "",
        pageNum: 1,
        pageSize: 20
      },
      attachmentData: [],
      isShowContract: false,
      contractQueryModel: {
        projectId: "",
        contractName: "",
        contractType: "",
        contractStatus: "5",
        // contractStatus:'',
        pageNo: 1,
        pageSize: 10,
        count: 0
      },
      queryModuleName: "",
      ConstructionModel: {
        id: "",
        contractNumber: "",
        // 结算审批
        settlementApproval: "",
        // 是否超战略指导价
        isOverPrice: "",
        contractName: "",
        contractId: "",
        companyId: "",
        companyName: "",
        projectId: "",
        projectName: "",
        contractDate: "",
        contractValue: "",
        additionalMoney: "",
        changeMoney: "",
        alterationMoney: "",
        conveySureMoney: "",
        additionalMoneyConvey: "",
        changeMoneyConvey: "",
        alterationMoneyConvey: "",
        startDate: "",
        endDate: "",
        projectStandard: "",
        buildingArea: "",
        repairMoney: "",
        reportMoney: "",
        estimateNo: "",
        osMoney: "",
        targetSinglePrice: "",
        paymentSinglePrice: "",
        estimatePrice: "",
        operator: "",
        operateDate: "",
        disputeContent: "",
        processResult: "",
        remark: "",
        status: "0",
        statusCh: "草稿",
        approveDate: "",
        totalPayableAmt: "",
        dynacostSplittingList: [],
        splittingWay: "0",
        moduleDataPK: ""
      },
      flag:false,
      bpmUrl:'',
      constructionDetailModel: {
        id: "",
        materialName: "",
        spec: "",
        price: "",
        factory: "",
        remark: "",
        qualityPriceId: ""
      },
      contractInfo: {},
      contractDetail: {},
      contractModel: {
        contractCode: ""
      },
      visaInfo: [],
      pickerOptions0: {
        disabledDate: time => {
          if (
            this.ConstructionModel.startDate !== "" &&
            this.ConstructionModel.endDate !== null
          ) {
            return time.getTime() > this.ConstructionModel.endDate;
          } else {
            // return time.getTime() < Date.now() - 8.64e7
          }
        }
      },
      pickerOptions1: {
        disabledDate: time => {
          return time.getTime() < this.ConstructionModel.startDate;
        }
      }
    };
  },
  mounted: function() {
    // debugger;
    this.init();
    console.log(this.getalterationIdListData);
  },
  methods: {
    checkoutDynamic() {
      this.ConstructionModel.splittingWay = "0";
      if (!this.ConstructionModel.contractNumber) {
        return this.$showError("请输入合同编号");
      } else if (!this.ConstructionModel.estimatePrice) {
        return this.$showError("请输入结算金额");
      }
      this.ConstructionModel.dynacostSplittingList = [];
      this.getSplittingList();
    },
    getSplittingList() {
      LoadingUtil.showLoading();
      if (this.$route.query.id) {
        this.ConstructionModel.moduleDataPK = this.$route.query.id;
      }

      dynacostSplittingList({
        moduleType: "6_1",
        paymentContract: this.ConstructionModel,
        moduleDataPK: this.ConstructionModel.moduleDataPK
      }).then(response => {
        LoadingUtil.hideLoading();
        this.ConstructionModel.dynacostSplittingList = response.data
          ? response.data
          : [];
        if (this.ConstructionModel.dynacostSplittingList.length > 0) {
          this.ConstructionModel.splittingWay = this.ConstructionModel.dynacostSplittingList[0].splittingWay;
        }
      });
    },
    saveSplit(val) {
      this.ConstructionModel.splittingWay = val;
    },
    init() {
      if (this.$route.query.isAdd) {
        // alert(666);
        localStorage.setItem("subId", "");
        this.buttonDisableSub = true;
        // 新增
        this.tableData = [];
        this.ConstructionModel.operator = this.$getUserInfo()["nickName"];
        console.log(this.$getUserInfo());
        // this.ConstructionModel.operator = JSON.parse(JSON.parse(localStorage.getItem('USER_INFO')).val).username
        this.ConstructionModel.operateDate = new Date().format();
        this.ConstructionModel.Date = "666666";
      } else {
        this.buttonDisableSub = false;
        localStorage.setItem("subId", this.$route.query.id);

        this.tableData = [];
        this.ConstructionModel.id = this.$route.query.id;

        detailContract({ id: this.$route.query.id })
          .then(response => {
            // alert(11111);
            console.log(response);
            this.ConstructionModel.contractNumber =
              response.data.contractNumber;
            this.ConstructionModel.contractName = response.data.contractName;
            this.ConstructionModel.contractId = response.data.contractId;
            this.ConstructionModel.companyId = response.data.companyId;
            this.ConstructionModel.companyName = response.data.companyName;
            this.ConstructionModel.projectId = response.data.projectId;
            this.ConstructionModel.projectName = response.data.projectName;
            this.ConstructionModel.contractDate = response.data.contractDate;
            this.ConstructionModel.contractValue = response.data.contractValue;
            this.ConstructionModel.contractCode = response.data.contractNumber;
            this.ConstructionModel.additionalMoney =
              response.data.additionalMoney;
            this.ConstructionModel.changeMoney = response.data.changeMoney;
            this.ConstructionModel.alterationMoney =
              response.data.alterationMoney;
            this.ConstructionModel.additionalMoneyConvey =
              response.data.additionalMoneyConvey;
            this.ConstructionModel.conveySureMoney =
              response.data.conveySureMoney;
            this.ConstructionModel.startDate = response.data.startDate;
            this.ConstructionModel.endDate = response.data.endDate;
            this.ConstructionModel.projectStandard =
              response.data.projectStandard;

            this.ConstructionModel.isOverPrice =
              response.data.isOverPrice;
            this.ConstructionModel.settlementApproval =
              response.data.settlementApproval;
            this.ConstructionModel.buildingArea = response.data.buildingArea;
            this.ConstructionModel.repairMoney = response.data.repairMoney;
            this.ConstructionModel.reportMoney = response.data.reportMoney;
            this.ConstructionModel.estimateNo = response.data.estimateNo;
            this.ConstructionModel.osMoney = response.data.osMoney;
            this.ConstructionModel.targetSinglePrice =
              response.data.targetSinglePrice;
            this.ConstructionModel.paymentSinglePrice =
              response.data.paymentSinglePrice;
            this.ConstructionModel.estimatePrice = response.data.estimatePrice;
            this.ConstructionModel.operator = response.data.operator;
            this.ConstructionModel.operateDate = new Date(
              response.data.operateDate
            ).format();
            this.ConstructionModel.disputeContent =
              response.data.disputeContent;
            this.ConstructionModel.processResult = response.data.processResult;
            this.ConstructionModel.remark = response.data.remark;
            this.ConstructionModel.status = response.data.status;
            this.bpmUrl = response.data.bpmUrl
            if(this.bpmUrl != ""){
              this.flag = true
            }
            this.getContractDetail(this.ConstructionModel.contractId);
            this.getalterationIdListTable();
            console.log(this.contractQueryModel.costSettlementApproval);
            console.log(this.contractQueryModel.settlementApproval);
            console.log(this.ConstructionModel.projectStandard);
            this.getApplyPaymentRewardPunishByList();
            this.getPaymentInfoListTable();

            this.getDynacostSplittingList();
            console.log(this.ConstructionModel.status + 6666);
            // if (this.ConstructionModel.status == "0") {
            //   this.ConstructionModel.statusCh = "草稿";
            // } else if (this.ConstructionModel.status == "1") {
            //   this.ConstructionModel.statusCh = "审批中";
            // } else if (this.ConstructionModel.status == "2") {
            //   this.ConstructionModel.statusCh = "已审批";
            // } else if (this.ConstructionModel.status == "3") {
            //   this.ConstructionModel.statusCh = "已驳回";
            // }
          })
          .catch(error => {
            console.log(error);
            this.$showError(error.message ? error.message : "msg_system_error");
          });

        getAttachment({ outerId: this.$route.query.id })
          .then(response => {
            this.attachmentData = response.data.attachments;
            this.ConstructionModel.attachments = this.attachmentData;
          })
          .catch(error => {
            console.log(error);
            this.$showError(error.message ? error.message : "msg_system_error");
          });
        getApprove({ bizTablePkValue: this.$route.query.id })
          .then(response => {
            // debugger;
            if (
              response.data != undefined &&
              response.data.approveDate != undefined
            ) {
              this.ConstructionModel.approveDate = new Date(
                response.data.approveDate
              ).format();
            }
          })
          .catch(error => {
            console.log(error);
            this.$showError(error.message ? error.message : "msg_system_error");
          });
      }
      this.ConstructionModel.id = this.$route.query.id;
      this.constructionDetailModel.qualityPriceId = this.$route.query.id;
      this.constructionDetailModel.responsibleDeptCode = this.ConstructionModel.responsibleDeptCode;
      this.constructionDetailModel.contractId = this.ConstructionModel.contractId;
      this.isEdit = this.$route.query.isEdit.toString() === "true";
      if (!this.isEdit) {
        this.isShowSpan = true;
        this.buttonDisable = true;
        this.isShowAdd = false;
        this.isShowSubmit = false;
        this.isShowBack = true;
        this.inputDisable = true;
        this.formDisable = true;
        this.showDeleteButton = false;
      }

      if (this.$route.query.isAdd == undefined) {
        // this.getPaymentInfoListTable()
      }
    },
    getDynacostSplittingList() {
      getDynacostSplit({ id: this.$route.query.id })
        .then(response => {
          this.ConstructionModel.dynacostSplittingList = response.data;
          if (
            this.ConstructionModel.dynacostSplittingList &&
            this.ConstructionModel.dynacostSplittingList.length > 0
          ) {
            this.ConstructionModel.splittingWay = this.ConstructionModel.dynacostSplittingList[0].splittingWay;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    inputFunc() {
      if (
        this.ConstructionModel.estimatePrice != "" &&
        this.ConstructionModel.buildingArea != ""
      ) {
        this.ConstructionModel.paymentSinglePrice = (
          this.ConstructionModel.estimatePrice /
          this.ConstructionModel.buildingArea
        ).toFixed(2);
      }
    },
    getCurrentRow(contractDetail) {
      this.contractInfo = contractDetail;
    },

    onSubmit(formName) {
      var validateResult = true;
      this.$refs[formName].validate(valid => {
        if (!valid) {
          validateResult = false;
        }
      });
      if (!validateResult) {
        return;
      }
      LoadingUtil.showLoading();
    },
    addRowToTable(row) {
      this.tableData.push(this.getDefaultRow(row));
    },
    handleSelectionChange(val) {
      // debugger
      this.selectContract = val;
    },
    cancelDialog(data) {
      this.isShowContract = data;
    },
    closeDialog(data) {
      this.isShowContract = data;
    },
    addRowToTableConstract() {
      this.isShowContract = true;
    },
    // this.ConstructionModel.repairMoney = data.maintenanceFund
    confirmContract(data) {
      this.ConstructionModel.contractId = data.id;
      this.ConstructionModel.contractNumber = data.contractCode;
      this.ConstructionModel.contractCode = data.contractCode;
      this.ConstructionModel.contractDate = data.dateOfContract;
      this.isShowContract = false;
      // this.getVisaList()
      this.getContractDetailByCode();
      this.getApplyPaymentRewardPunishByList();
      this.getalterationIdListTable();
      this.getPaymentInfoListTable();
      this.getPaymentContractCode();
    },

    getContractDetailByCode() {
      LoadingUtil.showLoading();
      // 获取合同相关信息
      getDetailByContractCode({
        contractCode: this.ConstructionModel.contractNumber
      })
        .then(res => {
          LoadingUtil.hideLoading();

          if (res.data.isSharedByMarketing == "1") {
            this.ConstructionModel.contractValue =
              res.data.sharedAmountByCostSystem;
          } else {
            this.ConstructionModel.contractValue =
              res.data.contractAmountIncludeTax;
          }
          // 转固后合同变更金额（元）
          this.ConstructionModel.changeMoneyConvey =
            res.data.alterationSumAmtIsBudgetConveySure;
          // 转固金额（元）
          this.ConstructionModel.conveySureMoney = res.data.conveySureMoney;
          // 转固后补充合同金额
          this.ConstructionModel.additionalMoneyConvey =
            res.data.supplementContractAmountAndIsBudgetConveySure;
          // 补充合同总额（元）
          this.ConstructionModel.additionalMoney =
            res.data.supplementContractAmountAndAudited;
          // 合同变更总额（元）
          this.ConstructionModel.changeMoney = res.data.alterationSumAmt;
          // 变更签证总额（元）
          this.ConstructionModel.alterationMoney =
            res.data.designAlterationTotalCostAmt;
          // 未转固变更签证金额
          this.ConstructionModel.alterationMoneyConvey =
            res.data.totalCostAmtIsNotBudgetConveySure;

          // 应付未付金额
          this.ConstructionModel.totalPayableAmt = res.data.totalPayableAmt;
          this.ConstructionModel.companyId = res.data.companyId;
          this.ConstructionModel.companyName = res.data.companyName;
          this.ConstructionModel.contractName = res.data.contractName;
          this.ConstructionModel.projectName = res.data.projectName;
          this.ConstructionModel.projectId = res.data.projectId;
          this.ConstructionModel.buildingSelection = res.data.partyBName;
          this.ConstructionModel.contractDate = res.data.dateOfContract;
          // this.applyPaymentDetail.supplementalContractAmt = res.data.supplementContractAmountAndAudited
          // this.applyPaymentDetail.totalAlterationVisaAmt = res.data.totalCostAmtIsNotBudgetConveySure
          // this.applyPaymentDetail.alterationAmt = res.data.alterationSumAmt
          // this.applyPaymentDetail.contractType = res.data.contractType // 合同类型
          // this.applyPaymentDetail.payee = res.data.partyBName // 收款单位，取乙方
          // this.applyPaymentDetail.payeeCode = res.data.partyB // 收款单位id
          // this.applyPaymentDetail.contractAmt = res.data.businessContractAmount
        })
        .catch(err => {
          console.log(err);
        });
    },

    // 获取合同结算编号
    getPaymentContractCode() {
      let param = {
        contractCode: this.ConstructionModel.contractCode
      };
      getPaymentContractCode(param)
        .then(response => {
          this.ConstructionModel.estimateNo = response.data;
        })
        .catch(error => {
          console.log(error);
        });
    },
    // 未转固变更签证信息
    getalterationIdListTable() {
      let contractId = "";
      // if (this.$route.query.contractId == '' || this.$route.query.contractId == undefined) {
      //   contractId = this.ConstructionModel.contractId
      // } else {
      //   contractId = this.$route.query.contractId
      // }
      let param = {
        contractId: this.ConstructionModel.contractId,
        contractCode: this.ConstructionModel.contractCode
      };
      getalterationIdList(param)
        .then(response => {
          // alert(11111);
          // console.log(response);
          this.getalterationIdListData = response.data;
        })
        .catch(error => {
          console.log(error);
        });
    },
    // 获取合同付款信息
    getPaymentInfoListTable() {
      let param = {
        contractCode: this.ConstructionModel.contractNumber
      };
      getPaymentInfoList(param)
        .then(response => {
          this.applyPayments = response.data.applyPayments;
        })
        .catch(error => {
          console.log(error);
        });
    },
    // 奖罚情况
    getApplyPaymentRewardPunishByList() {
      let param = {
        contractCode: this.ConstructionModel.contractNumber
      };
      getApplyPaymentRewardPunishByContractCode(param)
        .then(response => {
          this.getApplyPaymentRewardPunishByContractCode = response.data;
        })
        .catch(error => {
          console.log(error);
        });
    },
    getVisaList() {
      let contractId = "";
      // if (this.$route.query.contractId == '' || this.$route.query.contractId == undefined) {
      //   contractId = this.ConstructionModel.contractId
      // } else {
      //   contractId = this.$route.query.contractId
      // }
      let param = {
        contractId: this.ConstructionModel.contractId,
        contractCode: this.ConstructionModel.contractCode
      };
      getVisaList(param)
        .then(response => {
          this.visaInfo = response.data;
          console.log(this.visaInfo);
        })
        .catch(error => {
          console.log(error);
        });
    },
    getContractDetail(contractId) {
      let param = {
        contractId: contractId
      };
      getContractDetail(param)
        .then(response => {
          this.contractDetail = response.data;
          this.contractInfo = response.data;
          this.ConstructionModel.contractId = this.contractInfo.id;
          this.ConstructionModel.contractNumber = this.contractInfo.contractCode;
          this.ConstructionModel.contractName = this.contractInfo.contractName;
          this.ConstructionModel.contractCode = this.contractInfo.contractCode;
          this.ConstructionModel.contractDate = this.contractInfo.dateOfContract;
          this.ConstructionModel.projectName = this.contractInfo.projectName;
          // this.ConstructionModel.contractValue = this.contractInfo.contractAmountExcludeTax
          if (this.contractInfo.isSharedByMarketing == "1") {
            this.ConstructionModel.contractValue = this.contractInfo.sharedAmountByCostSystem;
          } else {
            this.ConstructionModel.contractValue = this.contractInfo.contractAmountIncludeTax;
          }
          // 新增字段
          this.ConstructionModel.companyId = this.contractInfo.companyId;
          this.ConstructionModel.companyName = this.contractInfo.companyName;
          this.ConstructionModel.projectName = this.contractInfo.projectName;
          this.ConstructionModel.projectId = this.contractInfo.projectId;

          // 转固后合同变更金额（元）
          this.ConstructionModel.changeMoneyConvey = this.contractInfo.alterationSumAmtIsBudgetConveySure;
          // 转固金额（元）
          this.ConstructionModel.conveySureMoney = this.contractInfo.conveySureMoney;
          // 转固后补充合同金额
          this.ConstructionModel.additionalMoneyConvey = this.contractInfo.supplementContractAmountAndIsBudgetConveySure;
          // 补充合同总额（元）
          this.ConstructionModel.additionalMoney = this.contractInfo.supplementContractAmountAndAudited;
          // 合同变更总额（元）
          this.ConstructionModel.changeMoney = this.contractInfo.alterationSumAmt;
          // 变更签证总额（元）
          this.ConstructionModel.alterationMoney = this.contractInfo.designAlterationTotalCostAmt;
          // 未转固变更签证金额
          this.ConstructionModel.alterationMoneyConvey = this.contractInfo.totalCostAmtIsNotBudgetConveySure;
          // 应付未付金额
          this.ConstructionModel.totalPayableAmt = this.contractInfo.totalPayableAmt;

          // this.ConstructionModel.repairMoney = this.contractInfo.maintenanceFund

          // this.ConstructionModel.contractValue = this.contractInfo.sharedAmountByCostSystem
          this.ConstructionModel.buildingSelection = this.contractInfo.partyBName;
          if (!this.$route.query.isAdd != "true") {
            this.getVisaList();
            // this.getalterationIdListTable()
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    addRowToTableConstract() {
      // debugger
      this.isShowContract = true;
      this.contractQueryModel.projectId = this.ConstructionModel.projectId;
      // console.log(this.contractQueryModel)
      getQueryContractList(this.contractQueryModel)
        .then(response => {
          this.selectTable = response.data.content;
        })
        .catch(error => {
          console.log(error);
        });
    },
    deleteDetail() {
      let newTableData = this.tableData.filter(function(item) {
        return item.checked !== true;
      });
      this.tableData = newTableData;
    },
    getROwIndex(row) {
      const _index = this.tableData.lastIndexOf(row);
      return _index;
    },
    getDefaultRow(row) {
      return {
        id: "",
        materialName: "",
        spec: "",
        price: "",
        factory: "",
        remark: ""
        // number: '',
        // type: '',
        // amount: '',
        // responsibleDeptCode: '',
        // content: '',
        // message: '',
        // shareCount: '',
        // index: uuidv1()
      };
    },
    handleSelect(selection, row) {
      for (let i = 0; i < selection.length; i++) {
        if (selection[i].index === row.index) {
          this.tableData.forEach(item => {
            if (item.index === row.index) {
              item.checked = true;
            }
          });
        }
      }
    },

    handleSelectAll(selection, row) {
      // 全选/取消全选
      let allChecked = true;
      if (selection.length === 0) {
        allChecked = false;
      }
      this.tableData.forEach(item => {
        item.checked = allChecked;
      });
    },
    handleBack() {
      this.$router.push({
        name: "ContractList"
      });
    },
    submitConstructionCost() {
      this.buttonDisableSub = true;
      let re = /^[0-9]+.?[0-9]*/;
      let isPass = true;
      if (this.ConstructionModel.contractNumber == "") {
        this.$showError("请选择合同");
        isPass = false;
      }
      if (
        this.ConstructionModel.startDate == "" ||
        this.ConstructionModel.endDate == ""
      ) {
        this.$showError("请选择时间");
        isPass = false;
      }
      if (
        this.ConstructionModel.estimatePrice == "0" ||
        this.ConstructionModel.estimatePrice == 0
      ) {
        this.$showError("结算金额不能为0");
        isPass = false;
      }
      if(this.ConstructionModel.isOverPrice == ''){
         this.$showError("是否超战略指导价不能为空");
         isPass = false
      }
      if(this.ConstructionModel.settlementApproval == ''){
         this.$showError("结算审批不能为空");
         isPass = false
      }
      if(this.ConstructionModel.projectStandard == ''){
         this.$showError("类似项目标准不能为空");
         isPass = false
      }
      if (!isPass) {
        return;
      }

      this.ConstructionModel.status = "1";
      this.ConstructionModel.materialsList = this.tableData;
      // this.ConstructionModel.operateDate = new Date(this.ConstructionModel.operateDate)
      this.ConstructionModel.operateDate = new Date(
        this.ConstructionModel.operateDate
      ).format();
      this.ConstructionModel.attachments = this.attachmentData;
      saveOrUpdateContract(this.ConstructionModel)
        .then(response => {
          // this.$showSuccess()
          this.$showSuccess(response.message);
          this.handleBack();
        })
        .catch(error => {
          this.buttonDisableSub = false;
          console.log(error);
          this.$showError(error.message ? error.message : "msg_system_error");
        });
    },
    saveConstruction() {
      let re = /^[0-9]+.?[0-9]*/;
      let isPass = true;

      if (this.ConstructionModel.contractNumber == "") {
        this.$showError("请选择合同");
        isPass = false;
      }
      if (
        this.ConstructionModel.startDate == "" ||
        this.ConstructionModel.endDate == ""
      ) {
        this.$showError("请选择时间");
        isPass = false;
      }
      if (
        this.ConstructionModel.estimatePrice == "0" ||
        this.ConstructionModel.estimatePrice == 0
      ) {
        this.$showError("结算金额不能为0");
        isPass = false;
      }
      if(this.ConstructionModel.isOverPrice == ''){
         this.$showError("是否超战略指导价不能为空");
         isPass = false
      }
      if(this.ConstructionModel.settlementApproval == ''){
         this.$showError("结算审批不能为空");
         isPass = false
      }
      if(this.ConstructionModel.projectStandard == ''){
         this.$showError("类似项目标准不能为空");
         isPass = false
      }
      if (!isPass) {
        return;
      }
      this.ConstructionModel.status = "0";
      this.ConstructionModel.materialsList = this.tableData;
      this.ConstructionModel.operateDate = new Date(
        this.ConstructionModel.operateDate
      );
      this.ConstructionModel.attachments = this.attachmentData;
      saveOrUpdateContract(this.ConstructionModel)
        .then(response => {
          this.$showSuccess(response.message);
          localStorage.setItem("subId", response.data);
          this.ConstructionModel.id = response.data;
          this.isShowAdd = true;
          this.isShowBack = true;
          this.buttonDisableSub = false;
        })
        .catch(error => {
          console.log(error);
          this.$showError(error.message ? error.message : "msg_system_error");
        });
    },
    inputAccountObject() {
      this.ConstructionModel.groupNumber =
        this.ConstructionModel.accountObjectId + "_IC";
    },
    changeAttachments(data) {
      this.ConstructionModel.attachments = data;
      this.attachmentData = data;
    },
    handleRowChange(fieldType, fieldValue, rowData, event) {
      let _reg = "";
      let _errmsg = null;
      if (fieldValue.length === 0) {
        this.$showError("msg_standared_empty_data");
        event.currentTarget.focus();
        return;
      }
      switch (fieldType) {
        case "code":
          fieldValue = fieldValue.replace(/\./g, "");
          _reg = /^\+?[1-9][0-9]{0,30}$/;
          _errmsg =
            this.$l("lbl_standared_subject_code") +
            this.$l("msg_standared_wrong_data");
          break;

        default:
          break;
      }
      if (!fieldValue.match(_reg) && !this.checkCode(rowData.code)) {
        this.$showNormalError(_errmsg);
        event.currentTarget.focus();
      }
    }
  }
};
</script>

<style>
.custom-00a597 .el-cascader-menu__item--extensible:after {
  content: "\E604";
}
.col{
  color: blue;
  text-decoration: underline;
  cursor: pointer;
}
</style>
