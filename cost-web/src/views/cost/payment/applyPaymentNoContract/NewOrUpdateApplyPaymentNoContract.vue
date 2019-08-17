<template>
  <div class="app-container">
    <div style="text-align:right; margin:10px 0;">
      <el-button
        size="mini"
        v-if="!$store.state.user.isFromBpm"
        @click="handleBack"
      >{{$l("btn_back")}}</el-button>
      <el-button
        size="mini"
        type="primary"
        :disabled="buttonDisable"
        v-show="isShowAdd"
        @click="createDetail"
      >{{$l('btn_save')}}</el-button>
      <el-button
        size="mini"
        type="primary"
        @click="submitModel"
        v-show="isShowSubmit"
        :disabled="buttonDis"
      >{{$l('lbl_cost_compilation_submit')}}</el-button>
      <el-button size="mini" type="primary" v-if="print" @click="printWeb()">打印</el-button>
      <el-button size="mini" type="primary" v-if="isShowFlag" @click="newSubmit()">提交</el-button>
    </div>
    <div class="form-unit">基本信息</div>
    <el-form
      label-width="150px"
      status-icon
      :model="applyPaymentNoContractModel"
      ref="applyPaymentNoContractModel"
      :rules="rules"
      size="mini"
    >
      <el-row>
        <!--<project-selector    v-model='project' :show="show" :span="{'project':8,'accObj':8}" :labelWidth="{'project':150,'accObj':150}"></project-selector>-->
        <ProjectAccountSelect
          v-model="project"
          :disabled="{'project':allButtonDisable,'accObj':allButtonDisable}"
          :span="{ project: 8, accObj: 8}"
          :show="show"
          :clearable="{ project: false, accObj: false }"
          :labelWidth="{project: 150, accObj: 150}"
        ></ProjectAccountSelect>
        <el-col :span="8">
          <el-form-item label="法人公司：" prop="incorporatedCompany">
            <el-select
              :disabled="allButtonDisable"
              v-model="applyPaymentNoContractModel.incorporatedCompany"
            >
              <el-option
                v-for="item in corporateCompanyList"
                :key="item.id"
                :label="item.name"
                :value="item.name"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <!-- 申请编号 -->
          <el-form-item :label="'申请编号：'" prop="code">
            <el-input v-model="applyPaymentNoContractModel.code" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <!-- 费用名称 -->
          <el-form-item :label="'费用名称：'" prop="name">
            <el-input v-model="applyPaymentNoContractModel.name" :disabled="buttonDisable"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <!-- 费用类型 -->
          <el-form-item :label="'费用类型：'" prop="costTypeCode">
            <fd-select
              v-model="applyPaymentNoContractModel.costTypeCode"
              type="cost_payment_cost_type"
              :disabled="buttonDisable"
            ></fd-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <!-- 合约规划 -->
          <el-form-item :label="'合约规划：'" prop="contractPlanName">
            <el-input
              v-model="applyPaymentNoContractModel.contractPlanName"
              :disabled="buttonDisable"
            >
              <span
                @click="selectContractPlan"
                slot="append"
                v-show="isEdit"
                class="el-icon-search"
                :style="{'cursor':'pointer'}"
              ></span>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <!-- 合约规划金额(元) -->
          <el-form-item :label="'合约规划金额(元)：'" prop="constructionUnit">
            <amount-input v-model="applyPaymentNoContractModel.contractPlanAmt" :disabled="true"></amount-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="是否已提供发票：" title="是否已提供发票" prop="isProvideInvoice">
            <fd-select
              :disabled="!isEdit"
              type="cost_is_provide_invoice"
              @change="handleChange"
              v-model="applyPaymentNoContractModel.isProvideInvoice"
            ></fd-select>
            <!-- <el-select v-model='applyPaymentDetail.isProvideInvoice'
                            @change="handleChange"
                            :disabled="!isEdit || invoicenone">
                                <el-option v-for='item in invoiceData'
                                    :key='item.value'
                                    :label='item.value'
                                    :value='item.value'>
                                </el-option>
            </el-select>-->
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <!-- 开票金额(元) -->
          <el-form-item
            label="本次开票金额(元)："
            title="本次开票金额(元)："
            prop="invoiceAmt"
            :required="isHaveTo"
          >
            <amount-input
              :disabled="!isEdit || invoiceAmtFlag"
              v-model.number="applyPaymentNoContractModel.invoiceAmt"
            ></amount-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <!-- 申请金额(含税）(元) -->
          <el-form-item :label="'申请金额(含税）(元)：'" prop="applyAmt">
            <amount-input v-model="applyPaymentNoContractModel.applyAmt" :disabled="buttonDisable" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <!-- 合约规划余量(元) -->
          <el-form-item :label="'合约规划余量(元)：'" prop="constructionUnit">
            <amount-input v-if="showContractRemain" v-model="contractPlanRemain" :disabled="true" />
            <amount-input
              v-if="showNewContractRemain"
              v-model="contractPlanRemainNew"
              :disabled="true"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <!-- 余量处理 -->
          <el-form-item :label="'余量处理：'" prop="constructionUnit">
            <el-button
              size="mini"
              v-if="showNewContractAndReleased"
              type="text"
              :disabled="isShowFlag"
              @click="createNewContract"
            >生成新合约/释放</el-button>
            <el-button
              size="mini"
              v-if="showNewContract"
              type="text"
              :disabled="isShowFlag"
              @click="createNewContract"
            >生成新合约</el-button>
            <el-button
              size="mini"
              v-if="showReleased"
              type="text"
              :disabled="isShowFlag"
              @click="createNewContract"
            >释放{{applyPaymentNoContractModel.amountReleased}}</el-button>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <!-- 税率 -->
          <el-form-item :label="'税率：'" prop="taxRatio">
            <fd-select
              v-model="applyPaymentNoContractModel.taxRatio"
              type="cost_tax_rate"
              @change="changeTaxRate"
              :disabled="buttonDisable"
            ></fd-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <!-- 申请金额（不含税） -->
          <el-form-item :label="'申请金额(不含税)：'">
            <amount-input :disabled="true" v-model="applyAmtWithOutTax" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <!-- 税额(元) -->
          <el-form-item :label="'税额(元)：'" prop="taxRatio">
            <amount-input
              :disabled="isShowFlag || !isEdit"
              v-model="applyPaymentNoContractModel.taxAmt"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <!-- 是否有无效成本 -->
          <el-form-item :label="'是否有无效成本：'" prop="isHasIneffective">
            <fd-select
              v-model="applyPaymentNoContractModel.isHasIneffective"
              type="cost_ineffective_exist"
              :disabled="buttonDisable"
            ></fd-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <!-- 无效成本金额(元) -->
          <el-form-item :label="'无效成本金额(元)：'">
            <amount-input
              v-model="applyPaymentNoContractModel.ineffectiveAmt"
              :disabled="isShowCost"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <!-- 无效成本类别 -->
          <el-form-item :label="'无效成本类别：'" prop="constructionUnit">
            <DictionarySelect
              type="cost_ineffective_type"
              v-model="applyPaymentNoContractModel.ineffectiveType"
              :disabled="isShowCost"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <!-- 无效成本内容 -->
          <el-form-item :label="'无效成本内容：'" prop="constructionUnit">
            <DictionarySelect
              type="cost_ineffective_type"
              :subType="applyPaymentNoContractModel.ineffectiveType"
              v-model="applyPaymentNoContractModel.ineffectiveContent"
              :disabled="isShowCost"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <!-- 无效成本责任部门 -->
          <el-form-item :label="'无效成本责任部门：'">
            <fd-select
              v-model="applyPaymentNoContractModel.ineffectiveResponsibleDept"
              :disabled="isShowCost"
              type="cost_subject_responsible_dept_code"
            ></fd-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <!-- 成就共享扣款倍数 -->
          <el-form-item :label="'成就共享扣款倍数：'" prop="achieveShareRatio">
            <fd-select
              v-model="applyPaymentNoContractModel.achieveShareRatio"
              :disabled="isShowCost"
              type="cost_achieveshareratio_code"
            ></fd-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <!-- 无效成本描述 -->
          <el-form-item :label="'无效成本描述：'">
            <el-input
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4}"
              :disabled="isShowCost"
              v-model="applyPaymentNoContractModel.ineffectiveDesc"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <!-- *收款单位： -->
          <el-form-item :label="'收款单位：'" prop="payee">
            <!-- 原始代码:disabled="buttonDisable" -->
            <el-input
              style="width: 80% !important;"
              v-model="applyPaymentNoContractModel.payee"
              disabled
            ></el-input>
            <el-button
              style="padding: 5px 10px;"
              icon="el-icon-zoom-in"
              v-if="!allButtonDisable"
              size="mini"
              @click="checkSupplier('1')"
            ></el-button>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <!-- *收款银行： -->
          <el-form-item :label="'收款银行：'" prop="payeeBankName">
            <!--<el-select v-model="applyPaymentNoContractModel.payeeBankName"-->
            <!--:disabled="buttonDisable"-->
            <!--@change="handleSelectBank"-->
            <!--value-key="bankDocId"-->
            <!--filterable>-->
            <!--<el-option-->
            <!--v-for="item in supplierBankInfo"-->
            <!--:key="item.bankDocId"-->
            <!--:label="item.bankName"-->
            <!--:value="item.bankName">-->
            <!--</el-option>-->
            <!--</el-select>-->
            <!--<el-select v-model="applyPaymentNoContractModel.payeeBankName"-->
            <!--@change="handleSelectBank"-->
            <!--value-key="bankDocId"-->
            <!--remote-->
            <!--:remote-method="remoteQueryBankInfo"-->
            <!--:loading="bankInfoLoading"-->
            <!--filterable>-->
            <!--<el-option-->
            <!--v-for="item in bankInfoList"-->
            <!--:key="item.name"-->
            <!--:label="item.name"-->
            <!--:value="item.name">-->
            <!--</el-option>-->
            <!--</el-select>-->
            <el-input
              v-model="applyPaymentNoContractModel.payeeBankName"
              readonly
              :disabled="allButtonDisable"
              :title="applyPaymentNoContractModel.payeeBankName"
              @focus="openBankDialog"
            >
              <i
                class="el-icon-search el-input__icon"
                slot="suffix"
                style="cursor: pointer"
                @click="openBankDialog"
              ></i>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <!-- *收款账号： -->
          <el-form-item :label="'收款账号：'" prop="payeeAccountNo">
            <el-autocomplete
              class="inline-input"
              :disabled="allButtonDisable"
              v-model="applyPaymentNoContractModel.payeeAccountNo"
              :fetch-suggestions="queryBankNumber"
            ></el-autocomplete>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <!-- 经办人 -->
          <el-form-item :label="'经办人：'">
            <el-input
              style="width:200px"
              v-model="applyPaymentNoContractModel.operatorName"
              :disabled="true"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <!-- 提交日期 -->
          <el-form-item :label="'提交日期：'">
            <el-date-picker
              v-model="applyPaymentNoContractModel.operatorDate"
              :disabled="true"
              type="date"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="支付状态：" title="支付状态">
            <el-input disabled v-model="applyPaymentNoContractModel.PaymentStatus"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- <el-row :gutter="12">
        <el-col :span="8">
          <el-form-item label="已付金额：" title="已付金额">
            <amount-input disabled v-model="applyPaymentNoContractModel.AmountPaid"></amount-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="支付状态：" title="支付状态">
            <el-input disabled v-model="applyPaymentNoContractModel.PaymentStatus"></el-input>
          </el-form-item>
        </el-col>
      </el-row> -->
      <el-row v-show="Mrwang">
        <el-col :span="8">
          <!-- 王先森  审批状态 -->
          <el-form-item :label="'审批状态：'">
            <fd-label
              :code="applyPaymentNoContractModel.approveStatus"
              :class="{col:flag}"
              :url="bpmUrl"
              type="cost_flow_status"
              :disabled="true"
            ></fd-label>
            <!-- <el-input style="width:200px"
                                    v-model='applyPaymentNoContractModel.statusCh'
            :disabled="true"></el-input>-->
            <!-- <div>{{applyPaymentNoContractModel.statusCh}}</div> -->
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <!-- 审批日期 -->
          <el-form-item :label="'审批日期：'">
            <el-date-picker
              v-model="applyPaymentNoContractModel.approveDate"
              :disabled="true"
              type="date"
            ></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <div class="form-unit">详细信息</div>
      <el-row>
        <el-col :span="24">
          <el-input
            type="textarea"
            :disabled="allButtonDisable"
            v-model="applyPaymentNoContractModel.detailContent"
          ></el-input>
        </el-col>
      </el-row>
      <div class="form-unit">
        成本拆分
        <span>
          <el-button
            size="mini"
            type="primary"
            @click="checkoutDynamic()"
            :disabled="buttonDisable"
          >执行自动拆分</el-button>
        </span>
      </div>
      <CostSplittingTable
        v-model="applyPaymentNoContractModel.dynacostSplittingList"
        :splittingWay="applyPaymentNoContractModel.splittingWay"
        @saveSplit="saveSplit"
      ></CostSplittingTable>
      <div v-if="applyPaymentNoContractModel.approveStatus === '2'">
        <div class="breadcrumb-child" style="margin-top: 44px;margin-bottom: 20px;">本次实付信息</div>
        <el-row>
          <el-col :span="8">
            <!-- 本次已批金额(元)： -->
            <el-form-item :label="'本次已批金额(元)'">
              <el-input :disabled="true" v-model="applyPaymentNoContractModel.approvedAmt"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <!-- 本次已付金额(元)： -->
            <el-form-item :label="'本次已付金额(元)'">
              <el-input :disabled="true" v-model="applyPaymentNoContractModel.paidAmt"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <!-- 本次未付金额(元)： -->
            <el-form-item :label="'本次未付金额(元)'">
              <el-input :disabled="true" v-model="applyPaymentNoContractModel.noPayAmt"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="newAd" v-if="isSuppFlag">
          <el-col>
            <el-button size="mini" type="primary" @click="newSave()">保存</el-button>
            <el-button size="mini" type="primary" @click="newAdd()">新增</el-button>
          </el-col>
        </el-row>
        <el-table
          :data="applyPaymentNoContractModel.actualPaymentList"
          stripe
          border
          size="small"
          tooltip-effect="dark"
          style="margin-top: 20px"
        >
          <!-- 序号 -->
          <el-table-column
            type="index"
            :index="this.$getTableIndex(this.queryModel)"
            :label="this.$l('lbl_no')"
            width="80"
          ></el-table-column>
          <!-- 付款结算单编号 show-overflow-tooltip-->
          <el-table-column label="付款结算单编号" prop="paymentNo">
            <template slot-scope="scope">
              <span>
                <el-input size="mini" disabled v-model="scope.row.paymentNo" placeholder></el-input>
              </span>
            </template>
          </el-table-column>
          <!-- 实际付款日期 -->
          <el-table-column prop="paymentDate" :label="'实际付款日期'">
            <template slot-scope="scope">
              <span>
                <el-date-picker
                  v-model="scope.row.paymentDate"
                  type="datetime"
                  placeholder="选择日期时间"
                ></el-date-picker>
              </span>
            </template>
          </el-table-column>
          <!-- 实付金额 -->
          <el-table-column label="实付金额（元）" prop="paymentAmt">
            <template slot-scope="scope">
              <el-form-item
                :prop="'actualPaymentList.' + scope.$index + '.paymentAmt'"
                :rules="rules.paymentAmt"
              >
                <amount-input v-model.number="scope.row.paymentAmt" style="margin-top:15px"></amount-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="100">
            <template slot-scope="scope">
              <el-button
                :disabled="!isSuppFlag"
                @click.native.prevent="deleteRow(scope.$index, applyPaymentNoContractModel.actualPaymentList)"
                type="text"
                size="small"
              >移除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <BankSelector
        :showBank="showBank"
        v-on:cancelDialog="cancelBankDialog"
        v-on:closeDialog="closeBankDialog"
        v-on:confirmBank="confirmBank"
      ></BankSelector>

      <SupplierInformationDialog
        v-if="supplierInfor"
        :supplierInfor="supplierInfor"
        @closeSupplierInfor="closeSupplierInfor"
      ></SupplierInformationDialog>

      <SelectContractPlan
        v-if="dialogContractPlan"
        :activeName="1"
        @closeDialogContractPlan="closeDialogContractPlan"
        :dialogContractPlan="dialogContractPlan"
        v-model="project.accObjId"
        :accountingObje="project.accObjId"
      ></SelectContractPlan>
    </el-form>
    <StayHappenAmountDialog
      v-if="stayHappenAmount"
      @closeStayHappenAmount="closeStayHappenAmount"
      :stayHappenAmountData="stayHappenAmountData"
      :contractSigningCpNewList="contractSigningCpNewList"
      :remainedPendingOccurenceAmount="remainedPendingOccurenceAmount"
      :stayHappenAmount="stayHappenAmount"
      :cpName="cpName"
      :accountingObje="project.accObjId"
    ></StayHappenAmountDialog>
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
    ></ContractSelector>
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
import { LoadingUtil } from "@/utils/common/LoadingUtil";
import StayHappenAmountDialog from "@/views/cost/signContract/StayHappenAmountDialog/";
import {
  getSupplierBankInfo,
  getAccountInfo,
  getBankInfo,
  additionalRecordingActualNoPayment,
  billPrinting
} from "@/api/cost/applyPaymentContract";
import {
  createApplyPaymentNoContract,
  dynacostSplittingList,
  createApplyPaymentNoContractCp,
  getApplyPaymentNoContract,
  getCode,
  submitApplyPaymentNoContract,
  NoZfinancialSubmit
} from "@/api/cost/payment";
import { getMeProfile } from "@/api/sys/userAPI";
import COSTENUM from "@/utils/cost/enum";
import DesignAlterationAttachmentTable from "@/views/cost/designAlteration/DesignAlterationAttachmentTable";
import CostSplittingTable from "@/views/cost/payment/applyPaymentNoContract/CostSplittingTable";
import CostFileUpload from "@/components/cost/UploadFile/";
import ProjectSelector from "@/components/cost/ProjectSelector/";
import ProjectAccountSelect from "@/components/cost/ProjectAccountSelect/";
import ContractSelector from "@/components/cost/ContractSelector/";
import AccountSelector from "@/components/cost/AccountSelector/";
import { getCompanylist } from "@/api/cost/signContractAPI";
import SelectContractPlan from "@/views/cost/signContract/SelectContractPlan/";
import DictionarySelect from "@/components/cost/DictionarySelect/";
import DictionaryLabel from "@/components/cost/DictionaryLabel/";
import SupplierInformationDialog from "@/views/cost/signContract/SupplierInformationDialog/";
import AmountInput from "@/components/cost/AmountInput/";
import BankSelector from "@/components/cost/BankSelector/";
import { ptn } from "@/utils/common/validate";
export default {
  components: {
    CostFileUpload,
    AmountInput,
    DesignAlterationAttachmentTable,
    CostSplittingTable,
    ProjectSelector,
    ContractSelector,
    AccountSelector,
    SelectContractPlan,
    StayHappenAmountDialog,
    DictionarySelect,
    DictionaryLabel,
    ProjectAccountSelect,
    SupplierInformationDialog,
    BankSelector
  },
  data() {
    var validateName = (rule, value, callback) => {
      // 当为空值且为必填时，抛出错误，反之通过校验
      if (this.applyPaymentNoContractModel.invoiceAmt === "" && this.isHaveTo) {
        callback(new Error("请输入本次开票金额"));
      } else {
        callback();
      }
    };
    var validateProjectName = (rule, value, callback) => {
      value = this.project.projectId;
      if (value === "") {
        callback(new Error("请选择项目名称"));
      } else {
        callback();
      }
    };
    var validateAccobj = (rule, value, callback) => {
      value = this.project.accObjId;
      if (value === "") {
        callback(new Error("请选择成本分期"));
      } else {
        callback();
      }
    };
    var validateCompanyId = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请选择法人公司"));
      } else {
        callback();
      }
    };
    return {
      buttonDis: true,
      Mrwang: false,
      show: {
        project: true,
        accObj: true
      },
      stayHappenAmount: false,
      showBank: false,
      tableData: [],
      stayHappenAmountData: {},
      contractSigningCpNewList: {},
      remainedPendingOccurenceAmount: "",
      fileList: "",
      moduleCode: COSTENUM.module.CONTRACT_SETTLEMENT,
      limit: 4,
      size: 100,
      outerId: "",
      rules: {
        isProvideInvoice: [
          {
            required: true,
            message: "请选择类型",
            trigger: "blur"
          }
        ],
        paymentAmt: [
          {
            pattern: /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/,
            message: "请输入正确的金额",
            trigger: "change"
          }
        ],
        invoiceAmt: [
          // { required: true, message: "请输入开票金额", trigger: "blur" },
          // { type: "number", message: "开票金额必须为数字值", trigger: "blur" },
          {
            validator: validateName
          }
          // { validator: checkPayAmt, trigger: "blur" }
        ],
        projectId: [
          {
            validator: validateProjectName,
            trigger: "change",
            required: true
          }
        ],
        accObjId: [
          {
            validator: validateAccobj,
            trigger: "change",
            required: true
          }
        ],
        name: [
          {
            required: true,
            message: "请输入费用名称",
            trigger: "blur"
          }
        ],
        costTypeCode: [
          {
            required: true,
            message: "请选择费用类型",
            trigger: "change"
          }
        ],
        incorporatedCompany: [
          {
            validator: validateCompanyId,
            trigger: "change",
            required: true
          }
        ],
        applyAmt: [
          {
            required: true,
            message: "请输入申请含税金额",
            trigger: "blur"
          }
        ],
        taxRatio: [
          {
            required: true,
            message: "请选择税率",
            trigger: "change"
          }
        ],
        contractPlanName: [
          {
            required: true,
            message: "请输入合约规划",
            trigger: "change"
          }
        ],
        isHasIneffective: [
          {
            required: true,
            message: "请选择是否有无效成本",
            trigger: "change"
          }
        ],
        payee: [
          {
            required: true,
            message: "请输入收款单位",
            trigger: "change"
          }
        ],
        payeeBankName: [
          {
            required: true,
            message: "请输入收款银行",
            trigger: "change"
          }
        ],
        payeeAccountNo: [
          {
            required: true,
            message: "请输入收款帐号",
            trigger: "change"
          },
          {
            pattern: ptn.number(1),
            message: "请输入正确的收款帐号",
            trigger: "change"
          }
        ]
      },
      isShowFlag: false,
      print: false,
      attachmentData: [],
      isShowContract: false,
      supplierInfor: false,
      showNewContractAndReleased: false,
      showNewContract: false,
      showReleased: false,
      isEdit: true,
      isShow: false,
      isOrEdit: false,
      showDeleteButton: true,
      isView: true,
      isShowSpan: false,
      isShowAdd: true,
      isShowSubmit: true,
      buttonDisable: false,
      dialogContractPlan: false,
      allButtonDisable: false,
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
      project: {
        projectId: "",
        accObjId: ""
      },
      nonContractCpModel: {},
      corporateCompanyList: [],
      supplierBankInfo: [],
      supplierBankNumberList: [],
      bankInfoLoading: false,
      bankInfoList: [],
      bankNumberList: [],
      isShowCost: false,
      isFirstEdit: true,
      contractPlanRemainNew: 0,
      showContractRemain: true,
      showNewContractRemain: false,
      invoiceAmtFlag: false, // 控制本次开票
      applyPaymentNoContractModel: {
        invoicenone: true, // 控制是否提供发票
        invoiceAmt: "", //本次开票金额
        isProvideInvoice: "", //是否已提供发票
        AmountPaid: "", //已付金额
        PaymentStatus: "", //支付状态
        isSuppStatus: "",
        id: "",
        projectId: "",
        accObjId: "",
        companyId: "",
        incorporatedCompany: "",
        code: "",
        name: "",
        contractPlanId: "",
        contractPlanName: "",
        contractPlanAmt: "",
        contractPlanRemain: "",
        stageId: "",
        stageVersion: "",
        costTypeCode: "",
        operatorName: "",
        operatorDate: "",
        approveDate: "",
        approveStatus: "",
        taxRatio: "",
        taxAmt: "",
        applyAmt: "",
        applyAmtWithOutTax: "",
        payee: "",
        payeeCode: "",
        payeeBankName: "",
        payeeAccountNo: "",
        isHasIneffective: "",
        ineffectiveType: "",
        ineffectiveAmt: "",
        ineffectiveContent: "",
        ineffectiveDesc: "",
        ineffectiveResponsibleDept: "",
        achieveShareRatio: "",
        detailContent: "",
        applyPaymentId: "",
        originCpId: "",
        newCpId: "",
        newCpName: "",
        cpAmount: "",
        amountReleased: "",
        dealingType: "",
        supplierBankNumber: {},
        dynacostSplittingList: [],
        splittingWay: "0",
        moduleDataPK: "",
        statusCh: "草稿",
        actualPaymentList: [],
        approvedAmt: "", // 本次申请已批金额(元)
        paidAmt: "", // 本次申请已付金额(元)
        noPayAmt: "" // 本次申请未付金额(元)
      },
      bpmUrl: "",
      flag: false,
      isSuppFlag: false
    };
  },
  mounted: function() {
    // alert('6666')
    this.init();
  },
  methods: {
    printWeb() {
      let param = {
        billid: this.applyPaymentNoContractModel.id
      };
      billPrinting(param)
        .then(res => {
          if (res.data) {
            window.open(res.data);
          } else {
            this.$showError(res.message);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    changeTaxRate(e) {
      console.log(e);
      let rate = e;
      let tax = 0;
      if (rate) {
        // alert(this.applyPaymentNoContractModel.applyAmtWithOutTax)
        tax =
          (Number(this.applyPaymentNoContractModel.applyAmt) /
            (1 + Number(rate))) *
          Number(rate);
        this.applyPaymentNoContractModel.taxAmt = tax.toFixed(2);
      }
    },
    deleteRow(index, rows) {
      rows.splice(index, 1);
    },
    random() {
      let num = "";
      for (var i = 0; i < 5; i++) {
        num += Math.floor(Math.random() * 10);
      }
      return num;
    },
    newSave() {
      var arr = this.applyPaymentNoContractModel.actualPaymentList;
      var num = 0;
      let flag = true;
      arr.every(function(v) {
        console.log(v);
        if (v.paymentAmt < num) {
          return (flag = false);
        } else {
          return (flag = true);
        }
      });
      console.log(flag);
      this.applyPaymentNoContractModel.applyPaymentType = "2";
      if (flag == true) {
        additionalRecordingActualNoPayment(this.applyPaymentNoContractModel)
          .then(res => {
            if (res.code === "2000") {
              this.$showSuccess(res.message);
            } else {
              this.$showError(res.message);
            }
          })
          .catch(err => {
            console.log(err);
          });
      }
    },
    newAdd() {
      let newData = {
        paymentNo: "",
        paymentDate: "",
        paymentAmt: ""
      };
      // 获取当前年月日 时分秒
      var time = new Date().format();
      // 年月日 时分秒 分割
      let time1 = time.split(" ");
      // 年月日切割
      let time2 = time1[0].split("-");
      // 时分秒切割
      let time3 = time1[1].split(":");
      // 年月日时分秒拼接成字符串
      let arr = time2.concat(time3).join();
      // 年月日及随机数字符串
      newData.paymentNo = "F_" + arr.replace(/,/g, "") + this.random();
      // console.log(str)
      this.applyPaymentNoContractModel.actualPaymentList.push(newData);
    },
    cancelDialog(data) {
      this.isShowContract = data;
    },
    closeDialog(data) {
      this.isShowContract = data;
    },
    saveSplit(val) {
      this.applyPaymentNoContractModel.splittingWay = val;
    },
    checkoutDynamic() {
      this.applyPaymentNoContractModel.splittingWay = "0";
      if (!this.applyPaymentNoContractModel.contractPlanName) {
        return this.$showError("请输入合约规划");
      } else if (!this.applyPaymentNoContractModel.applyAmt) {
        return this.$showError("请输入申请金额(含税）");
      }
      this.applyPaymentNoContractModel.dynacostSplittingList = [];
      this.getSplittingList();
    },
    getSplittingList() {
      LoadingUtil.showLoading();
      if (this.$route.query.id) {
        this.applyPaymentNoContractModel.moduleDataPK = this.$route.query.id;
      }
      if (
        this.nonContractCpModel &&
        this.nonContractCpModel.dynaCostCPModelList &&
        this.nonContractCpModel.dynaCostCPModelList.length > 0
      ) {
        this.nonContractCpModel.dynaCostCPModelList[0].contractTotalAmount = this.applyPaymentNoContractModel.applyAmt;
      }
      dynacostSplittingList({
        moduleType: "7_1",
        dynaCostCPModelList: this.nonContractCpModel.dynaCostCPModelList,
        moduleDataPK: this.applyPaymentNoContractModel.moduleDataPK
      }).then(response => {
        LoadingUtil.hideLoading();
        // this.designAlterationModel.dynacostSplittingList = response.data ? response.data : []
        this.applyPaymentNoContractModel.dynacostSplittingList = response.data
          ? response.data
          : [];
        if (this.applyPaymentNoContractModel.dynacostSplittingList.length > 0) {
          this.applyPaymentNoContractModel.splittingWay = this.applyPaymentNoContractModel.dynacostSplittingList[0].splittingWay;
        }
      });
    },
    openBankDialog() {
      this.showBank = true;
    },
    cancelBankDialog() {
      this.showBank = false;
    },
    closeBankDialog() {
      this.showBank = false;
    },
    confirmBank(data) {
      this.applyPaymentNoContractModel.payeeBankName = data.name;
      this.applyPaymentNoContractModel.supplierBankNumber.bankName = data.name;
      this.applyPaymentNoContractModel.supplierBankNumber.bankdocId =
        data.bankDocId;
      this.getAccountInfoByBankDocId(data.bankDocId);
    },
    // 根据银行档案ID获取银行账号信息
    getAccountInfoByBankDocId(bankDocId) {
      getAccountInfo({
        bankdocId: bankDocId
      }).then(res => {
        this.bankNumberList = res.data.map(obj => {
          return {
            ...obj,
            value: obj.accountNumber
          };
        });
      });
    },
    selectContractPlan() {
      this.dialogContractPlan = true;
    },
    handleSelectBank(v) {
      let chooseBank = this.bankInfoList.filter(item => item.name === v)[0];
      // 添加value属性，值为银行帐号（该组件只识别value属性）
      if (chooseBank) {
        this.applyPaymentNoContractModel.supplierBankNumber.bankdocId =
          chooseBank.bankDocId;
        getAccountInfo({
          bankdocId: chooseBank.bankDocId
        }).then(res => {
          this.bankNumberList = res.data.map(obj => {
            return {
              ...obj,
              value: obj.accountNumber
            };
          });
        });
      }
    },
    remoteQueryBankInfo(queryString) {
      if (queryString !== "") {
        this.bankInfoLoading = true;
        getBankInfo({
          bankName: queryString
        }).then(res => {
          if ((res.code = "2000")) {
            this.bankInfoList = res.data;
            this.bankInfoLoading = false;
          }
        });
      } else {
        this.bankInfoList = [];
      }
    },
    queryBankNumber(queryString, cb) {
      let numberList = this.bankNumberList;
      let results = queryString
        ? numberList.filter(item => item.value.indexOf(queryString) === 0)
        : numberList;
      cb(results);
    },
    checkSupplier(val) {
      this.supplierInfor = true;
    },
    closeSupplierInfor(row) {
      debugger;
      if (row) {
        this.applyPaymentNoContractModel.payee = row.providerName;
        this.applyPaymentNoContractModel.payeeCode = row.providerCode;
        // this.getSupplierBankInfo()
      }
      this.supplierInfor = false;
    },
    handleChange(w) {
      // console.log(w)
      if (w == "0") {
        this.invoiceAmtFlag = true;
        this.applyPaymentNoContractModel.invoiceAmt = "";
      } else {
        this.invoiceAmtFlag = false;
      }
    },
    init() {
      if (this.$route.query.isAdd) {
        // 新增
        this.isEdit = this.$route.query.isEdit.toString() === "true";
        this.applyPaymentNoContractModel.operatorName = this.$getUserInfo()[
          "nickName"
        ];
        this.Mrwang = false;
        this.applyPaymentNoContractModel.operatorDate = new Date();
        this.applyPaymentNoContractModel.approveDate = new Date();
      } else {
        this.isOrEdit = this.$route.query.isOrEdit;
        this.Mrwang = true;
        this.buttonDis = false;
        getApplyPaymentNoContract({
          id: this.$route.query.id
        })
          .then(response => {
            // debugger;
            // 只要不是新增就显示隐藏的余量字段为0
            if (this.$route.query.id) {
              this.showContractRemain = false;
              this.showNewContractRemain = true;
            }
            this.applyPaymentNoContractModel.isSuppStatus =
              response.data.isSuppStatus;
            this.applyPaymentNoContractModel.id = this.$route.query.id;
            this.project.projectId = response.data.projectId;
            this.project.accObjId = response.data.accObjId;
            this.applyPaymentNoContractModel.projectId =
              response.data.projectId;
            this.applyPaymentNoContractModel.companyId =
              response.data.companyId;
            this.applyPaymentNoContractModel.code = response.data.code;
            this.applyPaymentNoContractModel.name = response.data.name;
            this.applyPaymentNoContractModel.payee = response.data.payee;
            this.applyPaymentNoContractModel.payeeCode =
              response.data.payeeCode;
            this.applyPaymentNoContractModel.payeeBankName =
              response.data.payeeBankName;
            this.applyPaymentNoContractModel.payeeAccountNo =
              response.data.payeeAccountNo;
            this.applyPaymentNoContractModel.supplierBankNumber.bankdocId =
              response.data.payeeBankId;
            this.applyPaymentNoContractModel.applyAmt = response.data.applyAmt;
            this.applyPaymentNoContractModel.taxAmt = response.data.taxAmt;
            this.applyPaymentNoContractModel.operatorName =
              response.data.operatorName;
            this.applyPaymentNoContractModel.operatorDate =
              response.data.operatorDate;
            this.applyPaymentNoContractModel.approveDate =
              response.data.approveDate;
            this.applyPaymentNoContractModel.approveStatus =
              response.data.approveStatus;
            this.applyPaymentNoContractModel.accObjId = response.data.accObjId;
            this.applyPaymentNoContractModel.costTypeCode =
              response.data.costTypeCode;
            this.applyPaymentNoContractModel.taxRatio =
              response.data.taxRatio + "";
            this.applyPaymentNoContractModel.contractPlanId =
              response.data.contractPlanId;
            this.applyPaymentNoContractModel.contractPlanName =
              response.data.contractPlanName;
            this.applyPaymentNoContractModel.contractPlanAmt =
              response.data.contractPlanAmt;
            this.applyPaymentNoContractModel.contractPlanRemain =
              response.data.contractPlanRemain;
            this.applyPaymentNoContractModel.stageId = response.data.stageId;
            this.applyPaymentNoContractModel.stageVersion =
              response.data.stageVersion;
            this.applyPaymentNoContractModel.ineffectiveType =
              response.data.ineffectiveType;
            this.applyPaymentNoContractModel.isHasIneffective =
              response.data.isHasIneffective;
            this.applyPaymentNoContractModel.ineffectiveAmt =
              response.data.ineffectiveAmt;
            this.applyPaymentNoContractModel.ineffectiveResponsibleDept =
              response.data.ineffectiveResponsibleDept;
            if (response.data.achieveShareRatio !== null) {
              this.applyPaymentNoContractModel.achieveShareRatio = response.data.achieveShareRatio.toString();
            }
            this.applyPaymentNoContractModel.ineffectiveContent =
              response.data.ineffectiveContent;
            this.applyPaymentNoContractModel.ineffectiveDesc =
              response.data.ineffectiveDesc;
            this.applyPaymentNoContractModel.detailContent =
              response.data.detailContent;
            this.applyPaymentNoContractModel.applyPaymentId =
              response.data.applyPaymentId;
            this.applyPaymentNoContractModel.incorporatedCompany =
              response.data.incorporatedCompany;
            this.applyPaymentNoContractModel.cpAmount = response.data.cpAmount;
            this.applyPaymentNoContractModel.amountReleased =
              response.data.amountReleased;
            this.applyPaymentNoContractModel.newCpName =
              response.data.newCpName;
            this.applyPaymentNoContractModel.dealingType =
              response.data.dealingType;
            this.applyPaymentNoContractModel.originCpId =
              response.data.originCpId;
            this.applyPaymentNoContractModel.dynacostSplittingList =
              response.data.dynacostSplittingList;
            this.applyPaymentNoContractModel.splittingWay =
              response.data.splittingWay;
            this.bpmUrl = response.data.bpmOriginUrl;
            this.applyPaymentNoContractModel.approvedAmt =
              response.data.approvedAmt;
            this.applyPaymentNoContractModel.paidAmt = response.data.paidAmt;
            this.applyPaymentNoContractModel.noPayAmt = response.data.noPayAmt;
            this.applyPaymentNoContractModel.actualPaymentList =
              response.data.actualPaymentList;
            this.applyPaymentNoContractModel.AmountPaid =
              response.data.AmountPaid;
            this.applyPaymentNoContractModel.invoiceAmt =
              response.data.invoiceAmt;
            this.applyPaymentNoContractModel.isProvideInvoice =
              response.data.isProvideInvoice;
            if (this.applyPaymentNoContractModel.isProvideInvoice == "0") {
              this.invoiceAmtFlag = true;
            } else {
              this.invoiceAmtFlag = false;
            }
            if(this.applyPaymentNoContractModel.approveStatus === '2') {
              if(this.applyPaymentNoContractModel.paidAmt < this.applyPaymentNoContractModel.applyAmt){
                this.applyPaymentNoContractModel.PaymentStatus = '部分支付'
              }else if(this.applyPaymentNoContractModel.paidAmt >= this.applyPaymentNoContractModel.applyAmt && this.applyPaymentNoContractModel.paidAmt != '0'){
                this.applyPaymentNoContractModel.PaymentStatus = '全部支付'
              }else if(this.applyPaymentNoContractModel.paidAmt == '0'){
                this.applyPaymentNoContractModel.PaymentStatus = '未支付'
              }
            }else{
              this.applyPaymentNoContractModel.PaymentStatus = '未支付'
            }
            if (this.applyPaymentNoContractModel.dealingType === "0") {
              this.showNewContract = true;
              this.showReleased = false;
              this.showNewContractAndReleased = false;
            } else {
              this.showNewContractAndReleased = false;
              this.showNewContract = false;
              this.showReleased = true;
            }
            this.contractSigningCpNewList.cpAmount = response.data.cpAmount;
            this.contractSigningCpNewList.dealingType =
              response.data.dealingType;
            this.contractSigningCpNewList.amountReleased =
              response.data.amountReleased;
            this.project.accObjId = response.data.accObjId;
            this.attachmentData = response.data.attachments;
            if (this.bpmUrl != "") {
              this.flag = true;
            }
            if (this.applyPaymentNoContractModel.isSuppStatus == "0") {
              this.isSuppFlag = true;
            } else {
              this.isSuppFlag = false;
            }
            if (this.applyPaymentNoContractModel.approveStatus == "2" || this.applyPaymentNoContractModel.approveStatus == "1") {
              this.print = true;
            }
          })
          .catch(error => {
            console.log(error);
            this.$showError(error.message ? error.message : "msg_system_error");
          });
        // debugger;
        this.getSupplierBankInfo();
        this.isEdit = this.$route.query.isEdit.toString() === "true";
        this.isShow = this.$route.query.isShow.toString() === "true";
        // alert(this.isShow)
        if (!this.isEdit) {
          this.isShowSpan = true;
          this.buttonDisable = true;
          this.isShowAdd = false;
          this.isShowSubmit = false;
          this.isShowCost = true;
          this.allButtonDisable = true;
        }
        if (!this.isShow) {
          // alert('666')
          this.isShowFlag = true;
        }
      }
    },
    handleBack() {
      this.$router.push({
        name: "ApplyPaymentNoContractList"
      });
    },
    // 获取收款信息
    getSupplierBankInfo() {
      getBankInfo({
        bankName: this.applyPaymentNoContractModel.payeeBankName
      })
        .then(res => {
          if (res.code === "2000") {
            this.bankInfoList = res.data;
            this.handleSelectBank(
              this.applyPaymentNoContractModel.payeeBankName
            );
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    newSubmit(){
      LoadingUtil.showLoading();
      this.applyPaymentNoContractModel.attachments = this.attachmentData
      NoZfinancialSubmit(this.applyPaymentNoContractModel)
      .then(response => {
        LoadingUtil.hideLoading();
        this.$router.push({
          name: "ApplyPaymentNoContractList"
        });
      })
      .catch(error => {
        console.log(error);
        this.$showError(
          error.message ? error.message : "msg_system_error"
        );
      });
    },
    submitModel() {
      // debugger;
      this.buttonDis = true;
      if (
        this.applyPaymentNoContractModel.dealingType === "" &&
        this.applyPaymentNoContractModel.contractPlanRemain > 0
      ) {
        this.$showError("合约规划余量未处理");
        return;
      }
      if (this.applyPaymentNoContractModel.isProvideInvoice == "1") {
        if (
          this.applyPaymentNoContractModel.applyAmt >
          this.applyPaymentNoContractModel.invoiceAmt
        ) {
          this.$showError("申请金额（含税）应小于等于本次开票金额");
          return;
        }
      }
      this.$refs["applyPaymentNoContractModel"].validate(valid => {
        if (valid) {
          // this.buttonDisable = true;
          LoadingUtil.showLoading();
          // this.applyPaymentNoContractModel.projectId = this.project.projectId
          // this.applyPaymentNoContractModel.accObjId = this.project.accObjId
          this.applyPaymentNoContractModel.approveStatus = "0";
          // if (this.applyPaymentNoContractModel.supplierBankNumber) {
          //   this.applyPaymentNoContractModel.supplierBankNumber.accountNumber = this.applyPaymentNoContractModel.payeeAccountNo
          // }
          this.applyPaymentNoContractModel.supplierBankNumber.accountNumber = this.applyPaymentNoContractModel.payeeAccountNo;
          this.applyPaymentNoContractModel.supplierBankNumber.supplierId = this.applyPaymentNoContractModel.payeeCode;
          this.applyPaymentNoContractModel.supplierBankNumber.accountName = "";
          createApplyPaymentNoContract(this.applyPaymentNoContractModel)
            .then(response => {
              LoadingUtil.hideLoading();
              this.applyPaymentNoContractModel.id = response.data;
              this.submitDetail(this.applyPaymentNoContractModel);
            })
            .catch(error => {
              console.log(error);
              this.buttonDis = false;
              this.$showError(
                error.message ? error.message : "msg_system_error"
              );
            });
        }
      });
    },
    submitDetail(model) {
      LoadingUtil.showLoading();
      submitApplyPaymentNoContract(model)
        .then(response => {
          LoadingUtil.hideLoading();
          // alert(1111)
          if (response.code === "2000") {
            this.$router.push({
              name: "ApplyPaymentNoContractList"
            });
            this.$showSuccess(response.message);
          } else {
            this.buttonDis = false;
            this.$showError(response.message);
          }
        })
        .catch(error => {
          console.log(error);
          this.buttonDis = false;
          this.$showError(error.message ? error.message : "msg_system_error");
        });
    },
    createDetail() {
      debugger;
      if (
        this.applyPaymentNoContractModel.dealingType === "" &&
        this.applyPaymentNoContractModel.contractPlanRemain > 0
      ) {
        if (
          this.applyPaymentNoContractModel.contractPlanAmt -
            this.applyPaymentNoContractModel.applyAmt !==
          0
        ) {
          this.$showError("合约规划余量未处理");
          return;
        }
      }
      if (this.applyPaymentNoContractModel.isProvideInvoice == "1") {
        if (
          this.applyPaymentNoContractModel.applyAmt >
          this.applyPaymentNoContractModel.invoiceAmt
        ) {
          this.$showError("申请金额（含税）应小于等于本次开票金额");
          return;
        }
      }
      this.$refs["applyPaymentNoContractModel"].validate(valid => {
        if (valid) {
          debugger;
          // this.applyPaymentNoContractModel.projectId = this.project.projectId
          // this.applyPaymentNoContractModel.accObjId = this.project.accObjId
          // if (this.applyPaymentNoContractModel.supplierBankNumber) {
          //   this.applyPaymentNoContractModel.supplierBankNumber.accountNumber = this.applyPaymentNoContractModel.payeeAccountNo
          // }
          this.applyPaymentNoContractModel.supplierBankNumber.accountNumber = this.applyPaymentNoContractModel.payeeAccountNo;
          this.applyPaymentNoContractModel.supplierBankNumber.supplierId = this.applyPaymentNoContractModel.payeeCode;
          this.applyPaymentNoContractModel.supplierBankNumber.accountName = "";
          this.applyPaymentNoContractModel.attachments = this.attachmentData;
          LoadingUtil.showLoading();
          this.applyPaymentNoContractModel.approveStatus = "0";
          createApplyPaymentNoContract(this.applyPaymentNoContractModel)
            .then(response => {
              LoadingUtil.hideLoading();
              this.$showSuccess(response.message);
              this.applyPaymentNoContractModel.id = response.data;
              this.buttonDis = false;
            })
            .catch(error => {
              console.log(error);
              this.buttonDis = true;
              this.$showError(
                error.message ? error.message : "msg_system_error"
              );
            });
        }
      });
    },
    changeAttachments(data) {
      this.applyPaymentNoContractModel.attachments = data;
      this.attachmentData = data;
    },
    createNewContract() {
      this.stayHappenAmount = true;
      this.cpName = this.applyPaymentNoContractModel.contractPlanName;
      // this.isIndex = index
      // this.remainedPendingOccurenceAmount = row.remainedPendingOccurenceAmount
      // this.stayHappenAmountData = row
    },
    closeStayHappenAmount(val) {
      // console.log('newblance')
      // console.log(val)
      debugger;
      this.stayHappenAmount = false;
      if (val !== undefined) {
        // alert('484848')
        if (val.dealingType === "生成新合约") {
          val.dealingType = "0";
          this.showNewContract = true;
          this.showReleased = false;
          this.showNewContractAndReleased = false;
        } else {
          val.dealingType = "1";
          this.showNewContract = false;
          this.showReleased = true;
          this.showNewContractAndReleased = false;
        }
        // if(val.cpAmount == '0.00'){
        //   // alert('666')
        //   val.dealingType = "1";
        // }
        this.applyPaymentNoContractModel.applyPaymentId = this.applyPaymentNoContractModel.id;
        if (this.stayHappenAmountData.cpId !== undefined) {
          this.applyPaymentNoContractModel.originCpId = this.stayHappenAmountData.cpId;
        }
        this.applyPaymentNoContractModel.newCpName = val.newCpName;
        this.applyPaymentNoContractModel.cpAmount = val.cpAmount;
        this.applyPaymentNoContractModel.dealingType = val.dealingType;
        this.applyPaymentNoContractModel.amountReleased = val.remainedPending;
        this.contractSigningCpNewList.cpAmount = val.cpAmount;
        this.contractSigningCpNewList.dealingType = val.dealingType;
        this.contractSigningCpNewList.amountReleased = val.remainedPending;
        this.showNewContractRemain = true;
        this.showContractRemain = false;
      }
    },
    generateCode() {
      getCode(this.applyPaymentNoContractModel)
        .then(response => {
          this.applyPaymentNoContractModel.code = response.data;
          this.outerId = this.applyPaymentNoContractModel.code;
        })
        .catch(error => {
          console.log(error);
          this.$showError(error.message ? error.message : "msg_system_error");
        });
    },
    getCompany() {
      // 获取法人公司
      getCompanylist({
        projectId: this.project.projectId
      })
        .then(response => {
          this.corporateCompanyList = response.data ? response.data : "";
        })
        .catch(error => {
          console.log(error);
          this.$showError(error.message ? error.message : "msg_system_error");
        });
    },
    closeDialogContractPlan(val) {
      if (val) {
        // debugger;
        console.log(val);
        this.applyPaymentNoContractModel.contractPlanId = val[0].cpId;
        this.applyPaymentNoContractModel.contractPlanName = val[0].cpName;
        this.applyPaymentNoContractModel.contractPlanAmt = val[0].cpTotalAmount;
        this.applyPaymentNoContractModel.contractPlanRemain =
          val[0].amountPendingOccurence;
        this.applyPaymentNoContractModel.stageId = val[0].stageId;
        this.applyPaymentNoContractModel.stageVersion = val[0].stageVersion;
        this.remainedPendingOccurenceAmount =
          val[0].remainedPendingOccurenceAmount;
        this.nonContractCpModel.dynaCostCPModelList = val;
      }
      this.dialogContractPlan = false;
      this.stayHappenAmountData = val[0];
    }
  },
  watch: {
    project: function(newValue, oldValue) {
      this.applyPaymentNoContractModel.projectId = this.project.projectId;
      this.applyPaymentNoContractModel.accObjId = this.project.accObjId;
      this.applyPaymentNoContractModel.incorporatedCompany = "";
      this.applyPaymentNoContractModel.code = "";
      this.getCompany();
    },
    "applyPaymentNoContractModel.accObjId": function(newValue, oldValue) {
      debugger;
      if (
        oldValue === "" &&
        newValue !== "" &&
        this.applyPaymentNoContractModel.code !== ""
      ) {
        return;
      }
      if (newValue === "") {
        return;
      }
      this.generateCode();
    },
    "applyPaymentNoContractModel.contractPlanName": function(
      newValue,
      oldValue
    ) {
      debugger;
      if (oldValue !== "") {
        this.applyPaymentNoContractModel.newCpName = "";
        this.applyPaymentNoContractModel.cpAmount = "";
        this.applyPaymentNoContractModel.dealingType = "";
        this.applyPaymentNoContractModel.amountReleased = "";
        this.applyPaymentNoContractModel.applyAmt = "";
        this.contractSigningCpNewList = {};
      }
    },
    "applyPaymentNoContractModel.applyAmt": function(newValue, oldValue) {
      debugger;
      if (oldValue !== "") {
        this.showContractRemain = true;
        this.showNewContractRemain = false;
        this.showNewContract = false;
        this.showReleased = false;
        this.showNewContractAndReleased = true;
        this.isOrEdit = false;
        if (this.isEdit && !this.isOrEdit) {
          if (
            (
              this.applyPaymentNoContractModel.contractPlanAmt -
              this.applyPaymentNoContractModel.applyAmt
            ).toFixed(2) > 0
          ) {
            this.showNewContractAndReleased = true;
            this.showNewContract = false;
            this.showReleased = false;
            this.showContractRemain = true;
            this.showNewContractRemain = false;
          } else {
            this.showNewContractAndReleased = false;
            this.showNewContract = false;
            this.showReleased = false;
            this.showContractRemain = false;
            this.showNewContractRemain = true;
          }
        }
      } else {
        if (this.isEdit && !this.isOrEdit) {
          if (
            (
              this.applyPaymentNoContractModel.contractPlanAmt -
              this.applyPaymentNoContractModel.applyAmt
            ).toFixed(2) > 0
          ) {
            this.showNewContractAndReleased = true;
            this.showNewContract = false;
            this.showReleased = false;
            this.showContractRemain = true;
            this.showNewContractRemain = false;
          } else {
            this.showNewContractAndReleased = false;
            this.showNewContract = false;
            this.showReleased = false;
            this.showContractRemain = false;
            this.showNewContractRemain = true;
          }
        }
      }
    },
    "applyPaymentNoContractModel.isHasIneffective": function(
      newValue,
      oldValue
    ) {
      debugger;
      if (newValue === "0") {
        this.isShowCost = true;
        this.applyPaymentNoContractModel.ineffectiveAmt = "";
        this.applyPaymentNoContractModel.ineffectiveType = "";
        this.applyPaymentNoContractModel.ineffectiveContent = "";
        this.applyPaymentNoContractModel.ineffectiveDesc = "";
        this.applyPaymentNoContractModel.ineffectiveResponsibleDept = "";
        this.applyPaymentNoContractModel.achieveShareRatio = "";
      }
      if (newValue === "1" && this.isEdit) {
        this.isShowCost = false;
      }
    }
    // 'applyPaymentNoContractModel.contractPlanRemain': function(newValue, oldValue) {
    //   debugger
    //   if (newValue <= 0) {
    //     this.applyPaymentNoContractModel.contractPlanRemain = 0
    //   } else {
    //     this.showNewContract = false
    //     this.showReleased = false
    //   }
    // },
    // 'applyPaymentNoContractModel.taxRatio': function(newValue, oldValue) {
    //   debugger
    //   if (this.applyPaymentNoContractModel.applyAmt !== '') {
    //     this.applyPaymentNoContractModel.applyAmtWithOutTax = (this.applyPaymentNoContractModel.applyAmt / (1 + Number(newValue))).toFixed(2)
    //     this.applyPaymentNoContractModel.taxAmt = (this.applyPaymentNoContractModel.applyAmtWithOutTax * Number(newValue)).toFixed(2)
    //   }
    // }
  },
  computed: {
    isHaveTo: function() {
      return this.applyPaymentNoContractModel.isProvideInvoice == "1";
    },
    contractPlanRemain() {
      debugger;
      this.applyPaymentNoContractModel.contractPlanRemain = (
        this.applyPaymentNoContractModel.contractPlanAmt -
        this.applyPaymentNoContractModel.applyAmt
      ).toFixed(2);
      this.remainedPendingOccurenceAmount = Number(
        this.applyPaymentNoContractModel.contractPlanRemain
      );
      this.contractSigningCpNewList.cpAmount = 0;
      this.contractSigningCpNewList.amountReleased = this.remainedPendingOccurenceAmount;
      return this.applyPaymentNoContractModel.contractPlanRemain;
    },
    applyAmtWithOutTax() {
      // let rate = this.applyPaymentNoContractModel.taxRatio;
      // if (rate) {
      //   return (this.applyPaymentNoContractModel.applyAmtWithOutTax =
      //     this.applyPaymentNoContractModel.applyAmt /
      //     (1 + Number(rate)).toFixed(2));
      // }
      let applyAmtWithOutTax = (
        Number(this.applyPaymentNoContractModel.applyAmt) -
        Number(this.applyPaymentNoContractModel.taxAmt)
      ).toFixed(2);
      return (this.applyPaymentNoContractModel.applyAmtWithOutTax = applyAmtWithOutTax);
    }
    // taxAmt() {
    //   let rate = this.applyPaymentNoContractModel.taxRatio;
    //   if (rate) {
    //     return (this.applyPaymentNoContractModel.taxAmt = (
    //       this.applyPaymentNoContractModel.applyAmtWithOutTax * Number(rate)
    //     ).toFixed(2));
    //   }
    // }
  }
};
</script>
<style scoped>
.col {
  color: blue;
  text-decoration: underline;
  cursor: pointer;
}
.newAd .el-button {
  float: right;
  /* margin-bottom: 10px; */
  margin-left: 10px;
}
</style>

