<template>
  <div class="app-container">
    <!--<div class="subTitle">
            <div class="breadcrumb-child">
                <i class="fa fa-folder-open-o"></i>新增合同
            </div>
    </div>-->

    <div style="text-align:right; margin:10px 0;">
      <el-button size="mini" @click="goback" v-if="!$store.state.user.isFromBpm">{{$l("btn_back")}}</el-button>
      <el-button
        size="mini"
        type="primary"
        @click="saveInfo()"
        v-if="((activeName === '0' || activeName === '1') && $checkPersmissionByCode('cost:contract:saveOrUpdate')) || (activeName === '2'  && $checkPersmissionByCode('cost:contract:saveSignInfo'))"
        :disabled="saveBtnDisabled"
      >保存</el-button>
      <!-- <el-button
        size="mini"
        type="primary"
        @click="submit"
        :disabled="submitBtnDisabled"
        v-show="(activeName !== '3'&& activeName !== '4')"
      >提交</el-button> -->
      <el-button
        size="mini"
        type="primary"
        @click="submit"
        :disabled="submitBtnDisabled"
        v-show="(activeName !== '3'&& activeName !== '4')">
        {{ $l("lbl_cost_compilation_submit") }}
      </el-button>
      <el-button size="mini" type="primary" v-if="!isFlag" @click="newSubmit()">提交</el-button>
    </div>

    <!--当合同状态是"已签订" 显示全部tab -->
    <div v-if="isShowTable === '5' ">
      <el-tabs type="card" v-model="activeName" @tab-click="handleClick" ref="tabs">
        <el-tab-pane label="基本信息" name="0">
          <div>
            <ContractBasicInformatio v-model="form" ref="contractBasicInformation"></ContractBasicInformatio>
          </div>
        </el-tab-pane>
        <el-tab-pane label="成本拆分" name="1">
          <CostSplitList
            :dynaCostCPModel="dynaCostCPModel"
            :activeName="activeName"
            @saveSplitSignInfo="saveSplitSignInfo"
          ></CostSplitList>
        </el-tab-pane>

        <el-tab-pane label="签订信息" name="2">
          <SignInformationList :activeName="activeName" :signOrEdit="signOrEdit" :isFlag="isFlag"></SignInformationList>
        </el-tab-pane>
        <el-tab-pane label="变更签证" name="3">
          <ContractAlterationVisaInfo
            ref="contractAlterationVisaInfo"
            v-model="activeName"
            :contractCode="form.contractCode"
          ></ContractAlterationVisaInfo>
        </el-tab-pane>

        <el-tab-pane label="付款信息" name="4">
          <GetPaymentInfo
            v-model="activeName"
            ref="getPaymentInfo"
            :contractCode="form.contractCode"
          ></GetPaymentInfo>
        </el-tab-pane>
      </el-tabs>
    </div>

    <!--当合同状态是"已审核"、"签订-草稿"、"签订-审批中" 显示以下tab -->
    <div
      v-else-if="isShowTable === '2' || isShowTable === '3'  || isShowTable === '4' || isShowTable === '7' "
    >
      <el-tabs type="card" v-model="activeName" @tab-click="handleClick" ref="tabs">
        <el-tab-pane label="基本信息" name="0">
          <div>
            <ContractBasicInformatio v-model="form" ref="contractBasicInformation"></ContractBasicInformatio>
          </div>
        </el-tab-pane>

        <!--<el-tab-pane label="成本拆分"
                             name="1"
                             @tab-click="handleClick">
                    <CostSplitList :dynaCostCPModel="dynaCostCPModel"
                                   :activeName="activeName"
        @saveSignInfo="saveSignInfo"> </CostSplitList>-->
        <el-tab-pane label="成本拆分" name="1" @tab-click="handleClick">
          <CostSplitList
            :dynaCostCPModel="dynaCostCPModel"
            :activeName="activeName"
            @saveSplitSignInfo="saveSplitSignInfo"
          ></CostSplitList>
        </el-tab-pane>

        <el-tab-pane label="签订信息" name="2" v-if="signOrEdit">
          <SignInformationList
            ref="signInformationList"
            :activeName="activeName"
            :signOrEdit="signOrEdit"
            @saveSignInfo="saveSignInfo"
          ></SignInformationList>
        </el-tab-pane>
      </el-tabs>
    </div>

    <!--当合同状态是"草稿"、"审批中"、"审批驳回" 显示以下tab-->
    <div v-else-if="isShowTable === '0' || isShowTable === '1' || isShowTable === '6'">
      <el-tabs type="card" size="mini" v-model="activeName" @tab-click="handleClick" ref="tabs">
        <el-tab-pane label="基本信息" name="0">
          <div>
            <ContractBasicInformatio ref="contractBasicInformation" v-model="form"></ContractBasicInformatio>
          </div>
        </el-tab-pane>
        <el-tab-pane label="成本拆分" name="1">
          <!--<CostSplitList :dynaCostCPModel="dynaCostCPModel"
                                   :activeName="activeName"
          @saveSignInfo="saveSignInfo"> </CostSplitList>-->
          <CostSplitList
            :dynaCostCPModel="dynaCostCPModel"
            :activeName="activeName"
            @saveSplitSignInfo="saveSplitSignInfo"
          ></CostSplitList>
        </el-tab-pane>
      </el-tabs>
    </div>
    <SelectProjectNameDialog
      v-if="dialogVisible"
      :dialogVisible="dialogVisible"
      @closeDialogDialogVisible="closeDialogDialogVisible"
      v-model="projectInfo"
      :projectId="this.form.projectId"
    ></SelectProjectNameDialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { getMeProfile } from "@/api/sys/userAPI";
import {
  saveSignInfo,
  submitContractController,
  saveOrUpdateContractController,
  saveAdditionalRecordingCp,
  signSubmit
} from "@/api/cost/signContractAPI";
import { calc } from '@/utils/common/calc'
import { deepCopy, ifNull } from '@/utils/cost/objectHelper'
import ContractBasicInformatio from "@/views/cost/signContract/ContractBasicInformatio/";
import GetPaymentInfo from "@/views/cost/signContract/GetPaymentInfo/";
import ContractAlterationVisaInfo from "@/views/cost/signContract/ContractAlterationVisaInfo/";

import SignInformationList from "@/views/cost/signContract/SignInformationList/";

import SelectProjectNameDialog from "@/views/cost/signContract/SelectProjectNameDialog/";
import CalibrationFeeInfor from "@/views/cost/signContract/CalibrationFeeInfor/";
import CostSplitList from "@/views/cost/signContract/CostSplitList/";

import ProjectAccountingTargetTreeSelector from "@/components/cost/ProjectAccountingTargetTreeSelector/";
import TargetCostCompilationTable from "@/views/cost/targetCostCompilation/TargetCostCompilationTable";

import COSTENUM from "@/utils/cost/enum";
export default {
  computed: {
    ...mapGetters(["selectOrg"])
  },
  data() {
    return {
      isFlag:false,
      // 页面是否可以编辑 true ：可以  false：不能编辑
      isOrEdit: false,
      // 保存按钮是否禁用
      saveBtnDisabled: true,
      // 提交按钮是否禁用
      submitBtnDisabled: true,
      // 签订页面是否可以编辑
      signOrEdit: false,

      contractStatus: "",

      // 是否点击"补录按钮"
      additionalRecording: false,

      signInfo: {},
      dynaCostCPModel: {
        moduleType: "1_1",
        dynaCostCPModelList: [],
        moduleDataPK: ""
      },
      attachments: [],

      contractId: "",

      isShow: {
        group: false,
        company: false,
        dept: false,
        project: true,
        accObj: true
      },

      stayHappenAmount: false,

      projectInfo: [],

      dialogVisible: false,

      form: {
        corporateCompanyName: "",
        corporateCompanyId: "",
        projectId: "",
        accountingObjectName: "",
        projectName: "",
        handlingDate: new Date(),
        handlingPerson: "",
        department: "",
        calibrationNumber: "",
        contractSource: "",
        isPrimary: "0",
        // 是否主项设计：
        isMainPlan: "",
        // 设计分支：
        planBranch: "",
        primaryContractName: "",
        company: "",
        primaryContractCode: "",
        region: "",
        contractType: "",
        contractName: "",
        contractCode: "",
        handlingDept: "",
        tableDataList: [],
        accountingObjectId: "",
        detailContent: "",
        attachmentData: [],
        paymentDetails: [],
        contractDetails: {
          contract_party_type: "",
          isSharedByMarketing: "0",
          contractAmountIncludeTax: "",
          costNature: "",
          biddingWay: "1",
          contractAmountExcludeTax: "",
          tax: "",
          taxAmount: "",
          partyA: "",
          partyB: "",
          partyC: "",
          maintenanceFundRate: "",
          reservedChangeAmountState: "0", // 0: 未释放 ，1: 已释放
          reservedChangeAmount: "",
          maintenanceFund: "",
          splitStatus: "1",
          reservedChangeRatio: ""
        }
      },
      activeName: "0",
      active: 0,
      isShowTable: "",
      singData: {},
      singSplitData: {}
    };
  },
  components: {
    ContractBasicInformatio,
    GetPaymentInfo,
    ContractAlterationVisaInfo,
    SignInformationList,
    SelectProjectNameDialog,
    CostSplitList,
    CalibrationFeeInfor,
    TargetCostCompilationTable,
    ProjectAccountingTargetTreeSelector
  },
  mounted() {
    // alert(8888);
    this.form.contractSource = this.$route.query.contractSource;

    this.contractId = this.$route.query.contractId;
    this.dynaCostCPModel.moduleDataPK = this.$route.query.contractId;

    this.contractStatus = this.$route.query.contractStatus;
    if (this.$route.query.isOrEdit === "true") {
      this.$route.query.isOrEdit = true;
    }
    this.isOrEdit = eval(this.$route.query.isOrEdit);

    this.isFlag = eval(this.$route.query.isFlag);
    
    this.signOrEdit = eval(this.$route.query.signOrEdit);

    // 控制展示 显示的Tab内容
    this.isShowTable = this.$route.query.contractStatus;

    this.activeName = this.$route.query.activeName;

    if (
      this.$route.query.additionalRecording &&
      eval(this.$route.query.additionalRecording)
    ) {
      this.additionalRecording = eval(this.$route.query.additionalRecording);
    }

    // 开始控制 保存按钮、提交按钮
    if (this.isOrEdit) {
      // 如果没有合同ID 说明是新增合同、或者来自费控、或者来自招采
      this.submitBtnDisabled = true;
      if (!this.contractId) {
        this.saveBtnDisabled = false;
        // 合同状态 为"草稿"或者"审批拒绝" 提交按钮不禁用
      } else if (this.contractStatus === "0" || this.contractStatus === "6") {
        this.saveBtnDisabled = false;
      }
    } else if (this.additionalRecording) {
      this.saveBtnDisabled = false;
    } else {
      this.saveBtnDisabled = true;
    }

    this.getUserInfo();

    this.search();
  },
  watch: {
    form: {
      handler(newValue, oldValue) {
        this.dynaCostCPModel.dynaCostCPModelList = newValue.tableDataList;
      },
      deep: true
    },

    activeName: {
      handler(newValue, oldValue) {
        debugger;
        if (this.contractId) {
          // 点击 "基本信息" "成本拆分"
          if (this.activeName === "0" || this.activeName === "1") {
            if (this.additionalRecording) {
              this.saveBtnDisabled = false;
              return;
            }
            // 详情页面不可以编辑
            if (!this.isOrEdit) {
              this.saveBtnDisabled = true;
              this.submitBtnDisabled = true;
              return;
            }
            if (this.contractStatus === "0" || this.contractStatus === "6") {
              this.saveBtnDisabled = false;
            } else {
              this.saveBtnDisabled = true;
              this.submitBtnDisabled = true;
            }
          }

          // 点击 "签订信息"
          if (this.activeName === "2") {
            // 签订页面不可以编辑
            if (!this.signOrEdit) {
              this.saveBtnDisabled = true;
              this.submitBtnDisabled = true;
              return;
            }
            // 合同状态 ：签订-草稿  、签订审批驳回 、已审核
            if (
              this.contractStatus === "3" ||
              this.contractStatus === "7" ||
              this.contractStatus === "2"
            ) {
              this.saveBtnDisabled = false;
            } else {
              this.saveBtnDisabled = true;
              this.submitBtnDisabled = true;
            }
          }

          // 点击了变更签证
          if (this.activeName === "3") {
            this.$refs.contractAlterationVisaInfo.getContract();
          }

          // 点击了付款信息
          if (this.activeName === "4") {
            this.$refs.getPaymentInfo.getContract();
          }
        }
      },
      deep: true
    },

    // 税额
    "contractDetails.contractAmountIncludeTax": function(val) {
      this.contractDetails.contractAmountExcludeTax =
        Number(this.contractDetails.contractAmountIncludeTax) *
        Number(this.contractDetails.tax);
      if (this.contractDetails.reservedChangeAmountRate) {
        this.contractDetails.reservedChangeAmount =
          (Number(this.contractDetails.contractAmountIncludeTax) *
            Number(this.contractDetails.reservedChangeAmountRate)) /
          100;
      }

      this.contractDetails.taxAmount =
        Number(this.contractDetails.contractAmountIncludeTax) -
        parseFloat(this.contractDetails.contractAmountExcludeTax);
      this.contractDetails.maintenanceFund =
        (Number(this.contractDetails.contractAmountIncludeTax) *
          Number(this.contractDetails.maintenanceFundRate)) /
        100;
    },
    // 保修金额
    "contractDetails.maintenanceFundRate": function(val) {
      this.contractDetails.maintenanceFund =
        (Number(this.contractDetails.contractAmountIncludeTax) *
          Number(this.contractDetails.maintenanceFundRate)) /
        100;
    },
    // 预留变更金额(元)
    "contractDetails.reservedChangeAmountRate": function(val) {
      this.contractDetails.reservedChangeAmount =
        (Number(this.contractDetails.contractAmountIncludeTax) *
          Number(this.contractDetails.reservedChangeAmountRate)) /
        100;
    }
  },
  methods: {
    newSubmit(){
      this.$showError('亲亲暂无接口信息')
    },
    saveSplitSignInfo(data) {
      this.singSplitData = data;
    },
    saveSignInfo(data) {
      console.log(data);
      this.singData = data;
    },
    handleClick(tab, event) {
      this.activeName = tab.name;
    },

    goback() {
      this.$router.push({
        name: "ContractSignPrimaryList"
      });
    },

    // 获取经办人 经办部门
    getUserInfo() {
      this.form.handlingPerson = this.$getUserInfo()["nickName"];
    },
    closeDialogDialogVisible(val) {
      this.dialogVisible = false;
      if (this.projectInfo.length) {
        let name = this.projectInfo[0];
        let data = name.split("##");
        this.form.projectName = data[1];
        this.form.projectId = data[0];
      }
    },
    changeProjectName(val) {
      if (val === 0) {
        this.dialogVisible = true;
      } else if (val === 1) {
        // 主合同编号 调用后台API
        this.projectInfo = [];
        this.dialogVisible = true;
      }
    },
    handleAddRow() {
      this.$router.push({
        name: "NewContractInformation",
        query: { id: 0 }
      });
    },

    updateMessage(item) {
      if (item.type === COSTENUM.projectTreeType.TREE_NODE_ACC_OBJ) {
        this.queryModel.accountingObjectId = item.accountingObjectId;
        this.queryModel.companyId = item.companyId;
      } else {
        this.queryModel.accountingObjectId = "";
        this.queryModel.companyId = item.id;
      }
    },

    saveInfo() {
      // alert('4444')

      // alert(this.activeName)
      if (this.activeName === "2") {
        let valid = this.$refs.signInformationList.submitForm();
        if (valid === false) {
          return false;
        }
        // console.log(this.singData)
        // return
        let signModule = {
          id: this.$route.query.contractId,
          contractNumber: this.singData.contractNumber,
          dateOfContract: new Date(this.singData.dateOfContract).format(),
          signHandlingDept: this.singData.signHandlingDept,
          signHandlingDeptName: this.singData.signHandlingDeptName,
          signHandlingPersonName: this.singData.signHandlingPersonName,
          signHandlingPerson: this.singData.signHandlingPerson,
          signHandlingDate: new Date(this.singData.signHandlingDate).format(),
          attachments: this.singData.attachments
        };
        saveSignInfo(signModule)
          .then(response => {
            // alert('6666')
            if (response.code !== "2000") {
              // alert(response.message)
              this.$showError(response.message);
            } else {
              this.submitBtnDisabled = false;
              // alert(response.message)
              this.$showSuccess(response.message);
            }
          })
          .catch(error => {
            // alert(error)
            console.log(error);
            this.$showError(error.message ? error.message : "msg_system_error");
          });
        return;
      }
      if (!this.$refs.contractBasicInformation.submitForm()) {
        return false;
      }
      if (!this.form.paymentDetails || this.form.paymentDetails.length === 0) {
        return this.$showError("请添加付款事项");
      }

      for (let i = 0; i < this.form.paymentDetails.length; i++) {
        let paymentRate = this.form.paymentDetails[i].paymentRate;
        if (typeof paymentRate === "number") {
          paymentRate = paymentRate.toString();
        }
      }
      console.log(this.form.isPrimary);
      console.log(this.form.isMainPlan);
      console.log(this.form.planBranch);
      let queryModel = {
        id: this.contractId,
        corporateCompanyCode:this.form.corporateCompanyCode,
        projectId: this.form.projectId,
        accountingObjectId: this.form.accountingObjectId,
        corporateCompanyId: this.form.corporateCompanyId,
        corporateCompanyName: this.form.corporateCompanyName,
        contractCode: this.form.contractCode,
        contractName: this.form.contractName,
        contractType: this.form.contractType,
        isPrimary: this.form.isPrimary,
        isMainPlan: this.form.isMainPlan,
        planBranch: this.form.planBranch,
        primaryContractCode: this.form.primaryContractNumber,
        primaryContractName: this.form.primaryContractName,
        isPaiedByOutputValue: this.form.isPaiedByOutputValue,
        contractSource: this.form.contractSource,
        handlingDept: this.form.handlingDept,
        handlingDeptName: this.form.handlingDeptName,
        handlingPerson: this.form.handlingPerson,
        handlingPersonName: this.form.handlingPersonName,
        marketingHandlingPerson: this.form.marketingHandlingPerson,
        marketingHandlingPersonName: this.form.marketingHandlingPersonName,
        // dateOfContract: this.form.dateOfContract,
        handlingDate: this.form.handlingDate,
        contractAmountIncludeTax: this.form.contractDetails
          .contractAmountIncludeTax, // 签约金额含税
        isSharedByMarketing: this.form.contractDetails.isSharedByMarketing,
        sharedAmountByCostSystem: this.form.contractDetails
          .sharedAmountByCostSystem,
        contractAmountExcludeTax: this.form.contractDetails
          .contractAmountExcludeTax,
        tax: this.form.contractDetails.tax,
        taxAmount: this.form.contractDetails.taxAmount,
        costNature: this.form.contractDetails.costNature,
        biddingWay: this.form.contractDetails.biddingWay,
        contract_party_type: this.form.contractDetails.contract_party_type,
        partyA: this.form.contractDetails.partyA,
        partyB: this.form.contractDetails.partyB,
        partyBName: this.form.contractDetails.partyBName,
        partyC: this.form.contractDetails.partyC,
        partyCName: this.form.contractDetails.partyCName,
        maintenanceFundRate: this.form.contractDetails.maintenanceFundRate,
        reservedChangeAmountRate: this.form.contractDetails
          .reservedChangeAmountRate,
        performanceBondAmountRate: Number(
          this.form.contractDetails.performanceBondAmountRate
        ).toFixed(4),
        performanceBondAmount: this.form.contractDetails.performanceBondAmount,
        splitStatus: this.form.contractDetails.splitStatus,
        paymentRate: this.form.contractDetails.paymentRate,
        maintenanceFund: this.form.contractDetails.maintenanceFund,
        reservedChangeAmount: this.form.contractDetails.reservedChangeAmount,
        //  reservedChangeAmountState: this.contractDetails.reservedChangeAmountState,
        reservedChangeAmountState: "0",
        contractStatus: "0",
        detailContent: this.form.detailContent,
        contractPaymentItemModels: this.form.paymentDetails,
        attachments: this.form.attachments,
        dynaCostCPModelList: this.form.tableDataList,
        splittingWay: this.singSplitData.splittingWay, // 成本拆分
        dynacostSplittingList: this.singSplitData.formatData, // 成本拆分
        costBiddingId: this.$route.query.costBiddingId,
        costControlContractId: this.$route.query.costControlId,
        contractVirtualCps: this.getContractVirtualCp(),
        isGeneral: this.form.contractDetails.isGeneral
      };
      let contractAllTotal = 0;
      let isZero = 0;
      let wang = [
        {num:2792924.74},
        {num:70349279.41}
        ]
      let lei = 0
      // lei = calc.Add(ifNull(item.contractTotalAmount[index], 0), ifNull(item.contractTotalAmount[index], 0))
      // wang.map(item => {
      //         //汇总各业态的数据
      //         lei = calc.Add(
      //           lei,
      //           ifNull(item.num, 0)
      //         ); // 建筑面积
      // });
      // wang.forEach((item, index) => {
      //   console.log('4444')
      //   lei = calc.Add(ifNull(item.num[index], 0), ifNull(item.num[index], 0))
      // });
      // console.log('lei')
      // console.log(lei)
      if (this.form.tableDataList.length > 0) {
        this.form.tableDataList.map((item, index) => {
          contractAllTotal = calc.Add(contractAllTotal, ifNull(item.contractTotalAmount, 0));
            //  contractAllTotal += Number(item.contractTotalAmount);       源代码
          // contractAllTotal = calc.Add(ifNull(item.contractTotalAmount[index], 0), ifNull(item.contractTotalAmount[index], 0))
          if (Number(item.remainedPendingOccurenceAmount) !== 0) {
            isZero = Number(item.remainedPendingOccurenceAmount);
            return isZero;
          }
        });
        console.log(contractAllTotal)
      }
      
      if (isZero !== 0) {
        return this.$showNormalError("合约规划剩余待发生金额必须等于0");
      }

      // committed by wen hao
      console.log('queryModel.contractAmountIncludeTax')
      console.log(queryModel.contractAmountIncludeTax)
      console.log('contractAllTotal')
      console.log(contractAllTotal)
      if (
        this.form.tableDataList.length > 0 &&
        Number(queryModel.contractAmountIncludeTax) !== contractAllTotal
      ) {
        // return this.$showNormalError("合约规划总金额不等于签约金额(含税)");        原先代码
        return this.$showNormalError("合同金额不等于签约金额(含税)");        //王先生代码
      }
      // alert(queryModel.isPrimary);
      // 补录合约规划接口
      if (this.additionalRecording) {
        if (
          queryModel.isPrimary === "1" &&
          queryModel.contractAmountExcludeTax === "0.00"
        ) {
          this.$showError("签约金额不能为0");
          return;
        }
        saveAdditionalRecordingCp(queryModel)
          .then(response => {
            if (response.code !== "2000") {
              this.$showError(response.message);
            } else {
              this.contractId = response.data;
              this.submitBtnDisabled = false;
              this.$showSuccess(response.message);
            }
          })
          .catch(error => {
            console.log(error);
            this.$showError(error.message ? error.message : "msg_system_error");
          });
      } else {
        // console.log(11111 + queryModel)
        // console.log(queryModel)
        // alert(queryModel.contractAmountExcludeTax)
        if (
          queryModel.isPrimary === "1" &&
          queryModel.contractAmountExcludeTax === "0.00"
        ) {
          this.$showError("签约金额不能为0");
          return;
        }
        saveOrUpdateContractController(queryModel)
          .then(response => {
            if (response.code !== "2000") {
              console.log("!=2000");
              console.log(response.message);
              this.$showError(response.message);
            } else {
              console.log("=2000");
              console.log(response.message);
              this.contractId = response.data;
              this.submitBtnDisabled = false;
              this.$showSuccess(response.message);
            }
          })
          .catch(error => {
            console.log("catch");
            console.log(error);
            this.$showError(error.message ? error.message : "msg_system_error");
          });
      }
    },
    submit() {
      this.submitBtnDisabled = true;
      let queryModel = {
        contractId: this.contractId
      };

      if (this.activeName === "0" || this.activeName === "1") {
        queryModel.contractStatus = "1";
        submitContractController(queryModel)
          .then(response => {
            if (response.code !== "2000") {
              this.$showError(response.message);
              this.submitBtnDisabled = false;
            } else {
              this.$showSuccess(response.message);
              // return
              this.$router.push({
                name: "ContractSignPrimaryList"
              });
            }
          })
          .catch(error => {
            console.log(error);
            this.submitBtnDisabled = false;
            this.$showError(error.message ? error.message : "msg_system_error");
          });
      } else {
        signSubmit(queryModel)
          .then(response => {
            if (response.code !== "2000") {
              this.$showError(response.message);
            } else {
              this.$showSuccess(response.message);
              this.$router.push({
                name: "ContractSignPrimaryList"
              });
            }
          })
          .catch(error => {
            console.log(error);
            this.$showError(error.message ? error.message : "msg_system_error");
          });
      }
    },
    add() {
      this.$router.push({
        name: "NewOrUpdateTargetCostCompilation",
        query: { id: 0, isEdit: true }
      });
    },
    initVM() {
      this.queryModel.pageNum = 1;
      this.queryModel.count = 0;
      this.queryModel.pageSize = 20;
    },
    reset() {
      this.queryModel.group = "";
      this.queryModel.company = "";
      this.queryModel.businessDept = "";
      this.queryModel.accountingObjectId = "";
      this.queryModel.status = "";
      this.queryModel.stageId = "";
    },
    search() {},
    getContractVirtualCp() {
      let virtualCpTableDataList = this.form.virtualCpTableDataList;
      let list = [];
      if (!virtualCpTableDataList || virtualCpTableDataList.length === 0) {
        return list;
      }
      for (let i = 0; i < virtualCpTableDataList.length; i++) {
        let obj = {};
        obj.accountingObjName = virtualCpTableDataList[i].accountingObjectName;
        obj.cpId = virtualCpTableDataList[i].cpId;
        obj.status = "0";
        obj.cpName = virtualCpTableDataList[i].name;
        list.push(obj);
      }
      return list;
    }
  }
};
</script>
<style scoped>
.el-select {
  width: 200px;
}
.modeul .el-input {
  width: 200px;
}
.add {
  margin-bottom: 10px;
  text-align: right;
}
.el-form-item {
  width: 33%;
  display: inline-block;
  float: left;
}
.contractInfo .el-form-item__label {
  text-align: left;
  padding-left: 10px;
}
.contractInfo .el-input {
  width: 80% !important;
}
.inlineData {
  margin-top: 20px;
  float: left;
  width: 100%;
}
.inlineData .title {
  margin-bottom: 20px;
  border-bottom: 1px solid #ccc;
  padding-bottom: 5px;
}
.newAdd .el-button {
  float: right;
  margin-bottom: 10px;
}
</style>
