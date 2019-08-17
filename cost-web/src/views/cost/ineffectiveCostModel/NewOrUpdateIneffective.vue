<template>
  <div class='app-container'>
    <div style="text-align:right; margin:10px 0;">
      <el-button size="mini" v-if="!$store.state.user.isFromBpm"
                 @click='handleBack'>{{$l("btn_back")}}
      </el-button>
      <el-button size="mini" v-if="$checkPersmissionByCode('cost:ineffectiveCostMgmt:saveOrUpdate')"
                 type='primary'
                 :disabled="buttonDisable"
                 v-show="isShowAdd"
                 @click='saveConstruction'>{{$l("btn_save")}}
      </el-button>
      <el-button size="mini" v-if="$checkPersmissionByCode('cost:ineffectiveCostMgmt:saveOrUpdate')"
                 type='primary'
                 @click='submitConstructionCost'
                 v-show="isShowSubmit"
                 :disabled="buttonDisableSub">{{$l("lbl_cost_compilation_submit")}}
      </el-button>
    </div>
    <div class="form-unit">基本信息</div>
    <el-form label-width='150px'
             status-icon
             :model="ConstructionModel"
             ref="ConstructionModel"
             :rules="rules"
             :disabled="!isEdit"
             size="mini">

      

      <el-row :gutter="12">
        <!-- 项目/成本分期 :disabled="pageStatus.projectAccountSelect.disable"-->
        <ProjectAccountSelect v-model="page.queryModel.ProjectAccountSelect"
                              :show="pageStatus.projectAccountSelect.show"
                              :span="{project: 8,accObj: 8}"
                              :labelWidth="{project: 150,accObj: 150}"
                              :clearable="{project: false,accObj: false}"
                              :disabled="pageStatus.projectAccountSelect.disable"
                              autoselect="up"
                              @change="projectAccountSelectChange" 
                              style="margin-left:0px"
                              />
        <!-- <AccountSelector  v-model='project'
                       :show="show" @change="AccountSelectorOnchangeEmit"
                       style="margin-left:-5px"></AccountSelector> -->
        <el-col :span="8">
          <span v-if="this.isShowTable1">
            <el-form-item :label="'类别：'"
                          prop="ineffectiveType" >
              <fd-select v-model='ConstructionModel.ineffectiveType'
                        :disabled="isSelectType"
                        @change="checkTable"
                        type="ineffective_input_type"></fd-select>
            </el-form-item>
          </span>
          <span v-else>
            <el-form-item :label="'类别：'"
                        prop="ineffectiveType"  >
              <fd-select v-model='ConstructionModel.ineffectiveType'
                        :disabled="isSelectType"
                        @change="checkTable"
                        type="ineffective_input_type"></fd-select>
            </el-form-item>
          </span>
          
        </el-col>

        <el-col :span="8">
          <!-- 申请编号 -->
          <span v-if="this.isShowTable1">
            <el-form-item :label="'申请编号：'">
                <el-input v-model="ConstructionModel.applyNo"
                        :disabled="true"></el-input>
            </el-form-item>
          </span>
          <span v-else>
            <el-form-item :label="'申请编号：'"  style="margin-left:6px;">
                <el-input v-model="ConstructionModel.applyNo" 
                        :disabled="true"></el-input>
            </el-form-item>
          </span>
        </el-col>

        <el-col :span="8">
          <!-- 经办人 -->
          <el-form-item :label="'经办人：'"
                        prop="agent">
            <el-input v-model='ConstructionModel.agent'
                      :disabled="true"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <!-- 提交日期 -->
          <el-form-item :label="'提交日期：'"
                        prop="createdDate">
            <!--<el-input v-model="ConstructionModel.createdDate"-->
                      <!--:disabled="true"></el-input>-->
            <el-date-picker v-model='ConstructionModel.createdDate'
                            :disabled="true"
                            type="date">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <!--</el-row>-->
        <!--<el-row :gutter="12">-->
        <el-col :span="8">
          <!-- 审批状态 -->
          <el-form-item :label="'审批状态：'"
                        prop="statusCh">
            <!-- <el-input v-model="ConstructionModel.statusCh"
                      :disabled="true"></el-input> -->
                      <fd-label
              :code="ConstructionModel.status"
              :class="{col:flag}"
              :url= "bpmUrl"
              type="cost_flow_status"
              :disabled="true"
            ></fd-label>
              <!-- <div>{{ConstructionModel.statusCh}}</div> -->
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <!-- 审批日期 -->
          <el-form-item :label="'审批日期：'"
                        prop="createdDate">
            <!--<el-input v-model="ConstructionModel.approveDate"-->
                      <!--:disabled="true"></el-input>-->
            <el-date-picker v-model='ConstructionModel.approveDate'
                            :disabled="true"
                            type="date">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>

      <div class="form-unit">无效成本明细</div>

      
      <ContractSelectorNew :showContract="isShowContract3"
                           :projectId="project.projectId"
                           v-on:cancelDialog="cancelDialog"
                           v-on:closeDialog="closeDialog"
                           v-on:confirmContract2="confirmContract2"
                          >
      </ContractSelectorNew>

     <SelectContractPlan v-if="dialogContractPlan" @closeDialogContractPlan="closeDialogContractPlan" :dialogContractPlan='dialogContractPlan' v-model="form.accountingObjectId" :accountingObje='form.accountingObjectId' :accList="form.tableData"></SelectContractPlan>

      <!--补录-->
      <ContractSelector :showContract="isShowContract2"
                        :excludeContract="excludeContract"
                        v-on:cancelDialog="cancelDialog"
                        v-on:closeDialog="closeDialog"
                        v-on:confirmContract="confirmContract">
      </ContractSelector>
      

    </el-form>
    <StayHappenAmountDialog v-if="stayHappenAmount" @closeStayHappenAmount="closeStayHappenAmount"
      :stayHappenAmountData= stayHappenAmountData :remainedPendingOccurenceAmount='remainedPendingOccurenceAmount' 
      :cpAmount='cpAmount'  :stayHappenAmount='stayHappenAmount' :remainedPending='remainedPending' 
      :cpName='cpName' :ineffectiveSignCpNewList ='ineffectiveSignCpNewList' 
      :accountingObje='form.accountingObjectId'
      :contractId='form.contractId'></StayHappenAmountDialog>
      
    <div v-show="isShowTable1">
        <el-button size="mini"
                   type='primary'
                   style="float: right;"
                   v-show="isShowDel"
                   @click='deleteDetail' 
                   v-if="$checkPersmissionByCode('cost:targetCostMgmt:saveOrUpdate')"
                   :disabled="buttonDisable">{{$l("btn_delete")}}
        </el-button>
        <el-button size="mini"
                   type='primary'
                   @click="addRowToTable()"
                   v-show="isShowDel"
                   :disabled="buttonDisable" 
                   v-if="$checkPersmissionByCode('cost:targetCostMgmt:saveOrUpdate')"
                   style="float: right;margin-right: 20px;margin-bottom: 5px">{{$l("btn_add")}}
        </el-button>

        <el-table :data="form.tableData"
                  stripe
                  :header-cell-class-name="rowClassName"
                  @select="handleSelect"
                  @select-all="handleSelectAll"
                  @selection-change="handleSelectionChange"
                  border
                  tooltip-effect="dark"
                  style="width: 100%"
                  :rules="rules"
                  size="small">

          <el-table-column type="selection"
                           width="55"></el-table-column>
          <!-- 序号 -->
          <el-table-column type="index"
                           :label="this.$l('lbl_no')"
                           width="80"></el-table-column>
          <!-- 无效成本类别 -->
          <el-table-column type="index"
                           width="200"
                           :label="'无效成本类别'"
                           show-overflow-tooltip>
            <template slot-scope="scope">
              <fd-label :code="scope.row.type"
                        v-show="isShowSpan "
                        v-if="$checkPersmissionByCode('cost:targetCostMgmt:saveOrUpdate')"
                        type="cost_ineffective_type"></fd-label>
              <DictionarySelect type="cost_ineffective_type"
                                v-model="scope.row.type"
                                style="width: 100%;"
                                v-show="isEdit"
                                :disabled="isSelectType"
                                />
            </template>
          </el-table-column>
          <!-- 无效成本金额 -->
          <el-table-column prop="money"
                           :label="'无效成本金额（元）'"
                           width="150">
            <template slot-scope="scope">
                            <span v-show="isShowSpan"
                                  style="width: 100%;">
                              {{ scope.row.money | NumFormat }}
                            </span>
              <!--<el-input v-model.trim="scope.row.money"-->
                        <!--style="width: 100%;"-->
                        <!--v-show="isEdit" type="number"></el-input>  @blur="calcAmount"-->
              <amount-input v-model.number="scope.row.money"
                            :precision="2"
                            v-show="isEdit"
                            style="width: 100%;"
                            @blur="computeContractPlanAmount(scope.row,scope.$index)"
                            :disabled="buttonDisable" />
            </template>
          </el-table-column>

          <!-- 无效成本责任部门 -->
          <el-table-column prop="ownerDept"
                           width="110"
                           :label="'无效成本责任部门'">
            <template slot-scope="scope">
              <fd-label :code="scope.row.ownerDept"
                        v-show="isShowSpan"
                        type="cost_subject_responsible_dept_code"></fd-label>
              <fd-select v-model='scope.row.ownerDept'
                         style="width: 100%;"
                         v-show="isEdit"
                         type="cost_subject_responsible_dept_code"
                         :disabled="isSelectType"></fd-select>
            </template>
          </el-table-column>

          <!-- 无效成本内容 -->
          <el-table-column prop="content"
                           :label="'无效成本内容'"
                           width="250px;"
                           show-overflow-tooltip>
            <template slot-scope="scope">
              <DictionaryLabel type="cost_ineffective_type"
                               :subType="scope.row.type"
                               v-show="isShowSpan"
                               :code="scope.row.content"
                               show-overflow-tooltip
                               width="100px"/>
                               
              <DictionarySelect type="cost_ineffective_type"
                                :subType="scope.row.type"
                                v-model="scope.row.content"
                                v-show="isEdit"
                                :disabled="scope.row.type == ''  || isSelectType"
                                />
            </template>
          </el-table-column>
          <!-- 无效成本描述 -->
          <el-table-column prop="description"
                           :label="'无效成本描述'"
                           width="150"
                          show-overflow-tooltip>
            <template slot-scope="scope">
                            <span style="width: 100%;"
                                  v-show="isShowSpan">
                                {{scope.row.description}}
                            </span>
              <el-input v-model.trim="scope.row.description"
                        style="width: 100%;"
                        v-show="isEdit"
                        :disabled="buttonDisable"></el-input>
            </template>
          </el-table-column>

          <!-- 成就共享扣款倍数 -->
          <el-table-column :label="'成就共享扣款倍数'"
                           prop="multiple"
                            width="100">
            <template slot-scope="scope">
              <fd-label :code="scope.row.multiple"
                  v-show="isShowSpan"
                  type="cost_achieveshareratio_code"></fd-label>  
              <fd-select style="width:80px"
                         v-model='scope.row.multiple'
                         type="cost_achieveshareratio_code"
                         :clearable="true"
                         v-show="isEdit"
                         :disabled="isSelectType"></fd-select>
            </template>
          </el-table-column>

          <el-table-column prop="cpName" :label="'合约规划名称'" width="160" :rule="rules.cpName">
            <template slot-scope="scope" :prop="cpName" :rule="rules.cpName">
              <el-input v-model="scope.row.cpName"
                        style="width: 100px;"
                        :disabled="true"
                        @blur="computeContractPlanAmount(scope.row,scope.$index)"></el-input>
              <span @click="selectContractPlanning(scope.row)"
                    v-show="isEdit"
                    v-if="!isSelectType"
                    class="el-icon-search"
                    :style="{'cursor':'pointer'}"></span>
            </template>
            <!-- <template slot-scope="scope">
              <span @click="selectContractPlanning(scope.row)"
                    :style="{'cursor':'pointer'}">选择合约规划</span>
            </template> -->
          </el-table-column>
<!-- cpTotalAmount -->
          <el-table-column prop="cpTotalAmount" :label="'合约规划金额（元）'">
              <template slot-scope="scope">
                <span style="width: 100%;">
                  {{ scope.row.cpTotalAmount| NumFormat }}
                </span>
                <!-- <span v-if="isEdit">
                  <amount-input 
                    :precision="2" v-model="scope.row.contractTotalAmount" @blur="computeContractPlanAmount(scope.row,scope.$index)" type="number"></amount-input>
                </span>
                <span v-else>{{ scope.row.contractTotalAmount| NumFormat }}</span> -->
               </template>
          </el-table-column>
          <el-table-column prop="amountPendingOccurence" :label="'待发生金额（元）'">
            <template slot-scope="scope">
                <span style="width: 100%;">
                  {{ scope.row.amountPendingOccurence| NumFormat }}
                </span>
            </template>
          </el-table-column>
          <el-table-column prop="remainedPendingOccurenceAmount" :label="'剩余待发生金额（元）'">
              <template slot-scope="scope">
                  <span style="width: 100%;">
                    {{ scope.row.remainedPendingOccurenceAmount| NumFormat }}
                  </span>
              </template>
          </el-table-column>
          <el-table-column :label="'剩余待发生处理'" width="150">
            <template slot-scope="scope">

              <el-button size="mini" v-if="scope.row.isState && scope.row.ineffectiveSignCpNew && scope.row.ineffectiveSignCpNew.dealingType==='0'" type="text" @click="createNewContract(scope.$index, scope.row)">生成新合约</el-button>
              <el-button size="mini" v-else-if="scope.row.isState && scope.row.ineffectiveSignCpNew && scope.row.ineffectiveSignCpNew.dealingType==='1'" type="text" @click="createNewContract(scope.$index, scope.row)">释放{{scope.row.ineffectiveSignCpNew.amountReleased}}</el-button>
              <el-button size="mini" v-else-if="!isPending && scope.row.ineffectiveSignCpNew && scope.row.ineffectiveSignCpNew.dealingType==='0'" type="text" @click="createNewContract(scope.$index, scope.row)">已生成新合约</el-button>
              <el-button size="mini" v-else-if="!isPending && scope.row.ineffectiveSignCpNew && scope.row.ineffectiveSignCpNew.dealingType==='1'" type="text" @click="createNewContract(scope.$index, scope.row)">已释放</el-button>
              <el-button size="mini" v-else-if="scope.row.isPending && scope.row.ineffectiveSignCpNew && scope.row.ineffectiveSignCpNew.dealingType ==='生成新合约/释放'" type="text" @click="createNewContract(scope.$index, scope.row)">{{scope.row.ineffectiveSignCpNew.dealingType}}</el-button>

            </template>
          </el-table-column>
        </el-table>
      </div>

      <div v-show="isShowTable2">
        <el-button size="mini"
                   type='primary'
                   style="float: right;"
                   v-show="isShowDel"
                   @click='deleteDetail2'
                   :disabled="buttonDisable">{{$l("btn_delete")}}
        </el-button>

        <el-button size="mini"
                   type='primary'
                   v-show="isShowDel"
                   @click="addRowToTable2()"
                   :disabled="buttonDisable"
                   style="float: right;margin-right: 20px;margin-bottom: 5px">{{$l("btn_add")}}
        </el-button>

        <el-table :data="contractTableData"
                  stripe
                  :header-cell-class-name="rowClassName1"
                  @select="handleSelect2"
                  @select-all="handleSelectAll2"
                  @selection-change="handleSelectionChange2"
                  border
                  tooltip-effect="dark"
                  style="width: 100%"
                  :rules="rules"
                  size="small">
          <el-table-column type="selection"
                           width="55"></el-table-column>
          <!-- 序号 -->
          <el-table-column type="index"
                           :label="this.$l('lbl_no')"
                           width="80"></el-table-column>
          <!-- 变更签证编号/无合同编号 -->
          <el-table-column type="index"
                           width="250"
                           :label="'变更签证编号/无合同编号'"
                           
                            show-overflow-tooltip>
            <template slot-scope="scope">
              <el-input v-model.trim="scope.row.businessNumber"
                        style="width: 200px;"
                        :disabled="true"></el-input>
              <span @click="searchContract2(scope.row)"
                    v-show="!isSelectType"
                    class="el-icon-search"
                    :style="{'cursor':'pointer'}"></span>
            </template>
          </el-table-column>

          
          <!-- 合同编号  v-show="isShowNoContract"-->
          <el-table-column type="index"
                           width="200"
                           :label="'合同编号'"
                           :disabled="isShowNoContract"
                            show-overflow-tooltip>
            <template slot-scope="scope">
              <el-input v-model.trim="scope.row.contractNumber"
                        style="width: 150px;float:left;"
                        :disabled="true"></el-input>
              <el-input v-model.trim="scope.row.typeOfSelected"
                      style="width: 0px;float:left;"
                        type="hidden"></el-input>
              <span @click="searchContract(scope.row)"
                    v-if="scope.row.typeOfSelected != '3' && !isSelectType"
                    class="el-icon-search"
                    style="cursor:pointer;float:left;margin-left:5px;margin-top:8px;"></span>
              <span v-else class="zhaPlace" >

              </span>
            </template>
          </el-table-column>
          <!-- <el-table-column type="index">
             <template slot-scope="scope">
                
             </template>
           </el-table-column> -->
          <!-- 合同名称 -->
          <el-table-column prop="type"
                           :label="'合同名称'"
                           width="200"
                            show-overflow-tooltip>
            <template slot-scope="scope">
              <el-input v-model.trim="scope.row.contractName"
                        style="width: 100%;"
                        :disabled="true"></el-input>
            </template>
          </el-table-column>

          <!-- 无效成本类别 -->
          <el-table-column type="index"
                           width="200"
                           :label="'无效成本类别'">

            <template slot-scope="scope">
              <fd-label :code="scope.row.type"
                        v-show="isShowSpan"
                        type="cost_ineffective_type"></fd-label>
              <DictionarySelect type="cost_ineffective_type"
                                v-model="scope.row.type"
                                style="width: 100%;"
                                v-show="isEdit"
                                :disabled="isSelectType"
                                />
            </template>
          </el-table-column>

          <!-- 无效成本金额 -->
          <el-table-column prop="money"
                           :label="'无效成本金额（元）'"
                           width="150">
            <template slot-scope="scope">
                            <span v-show="isShowSpan"
                                  style="width: 100%;">
                              {{ scope.row.money| NumFormat }}
                            </span>
              <!--<el-input v-model.trim="scope.row.money" @blur="calcAmount"-->
                        <!--style="width: 100%;"-->
                        <!--v-show="isEdit" type="number"></el-input>-->
              <amount-input v-model.number="scope.row.money"
                            v-show="isEdit"
                            style="width: 100%;"
                            
                            :disabled="isSelectType" />
            </template>
          </el-table-column>

          <!-- 无效成本责任部门 -->
          <el-table-column prop="ownerDept"
                           width="200"
                           :label="'无效成本责任部门'">
            <template slot-scope="scope">
              <fd-label :code="scope.row.ownerDept"
                        v-show="isShowSpan"
                        type="cost_subject_responsible_dept_code"></fd-label>
              <fd-select v-model='scope.row.ownerDept'
                         style="width: 100%;"
                         v-show="isEdit"
                         type="cost_subject_responsible_dept_code"
                         :disabled="isSelectType"></fd-select>
            </template>
          </el-table-column>

          <!-- 无效成本内容 -->
          <el-table-column prop="content"
                           :label="'无效成本内容'"
                           width="200"
                          show-overflow-tooltip>
            <template slot-scope="scope">
              <DictionaryLabel type="cost_ineffective_type"
                               :subType="scope.row.type"
                               v-show="isShowSpan"
                               :code="scope.row.content"
                               show-overflow-tooltip/>

              <DictionarySelect type="cost_ineffective_type"
                                :subType="scope.row.type"
                                v-model="scope.row.content"
                                style="width: 100%;"
                                v-show="isEdit"
                                :disabled="scope.row.type == '' || isSelectType"/>
            </template>
          </el-table-column>
          <!-- 无效成本描述 -->
          <el-table-column :label="'无效成本描述'"
                           width="200"
                           show-overflow-tooltip>
            <template slot-scope="scope">
                            <span style="width: 100%;"
                                  v-show="isShowSpan">
                                {{scope.row.description}}
                            </span>
              <el-input v-model.trim="scope.row.description"
                        style="width: 100%;"
                        v-show="isEdit"
                        :disabled="isSelectType"></el-input>
            </template>
          </el-table-column>
          <!-- *成就共享扣款倍数 -->
          <el-table-column prop="multiple"
                           :label="'成就共享扣款倍数'"
                           width="150">
            <template slot-scope="scope">
              <fd-label :code="scope.row.multiple"
                        v-show="isShowSpan"
                        type="cost_achieveshareratio_code_new"></fd-label>        
              <fd-select style="width:140px"
                         v-model='scope.row.multiple'
                         type="cost_achieveshareratio_code_new"
                         :clearable="true"
                         v-show="isEdit"
                         :disabled="isSelectType"></fd-select>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="subTitle">
        <div class="breadcrumb-child"
            style="margin-top: 10px">
          <i></i>附件列表
        </div>
      </div>
      <span class="breadcrumb-child"
            style="float: left;margin-top: 10px">
                <i></i>上传附件:
            </span>
      <span style="float: left">
         <CostFileUpload style="margin-top: 5px;margin-bottom: 20px"
                                v-model="fileList"
                                :limit="limit"
                                :attachmentData="attachmentData"
                                :outerId="outerId">
                </CostFileUpload>
            </span>
      <DesignAlterationAttachmentTable :queryObj_passed_in="queryModel"
                                      :showDeleteButton = "showDeleteButton"
                                       :attaData="attachmentData"
                                       v-on:changeAttachments="changeAttachments"
                                       ref='DesignAlterationAttachmentTable'>
      </DesignAlterationAttachmentTable>
  </div>
</template>
<script>
debugger;
import uuidv1 from "uuid/v1";
import { LoadingUtil } from "@/utils/common/LoadingUtil";
import { ptn } from "@/utils/common/validate";
import AccountSelectorNone from "@/components/cost/AccountSelector/";
import AccountSelector from "@/components/cost/AccountSelectorNew/";
import {
  saveOrUpdateIneffectiveCost,
  getQueryContractList,
  getContractDetail,
  getVisaList,
  getIneffectiveAlteration,
  getContractListByAlterationStatus,
  getIneffectiveCostCode,
  detailIneffectiveCost
} from "@/api/cost/ineffectiveCostModel";
import { getMeProfile } from "@/api/sys/userAPI";
import ContractSelectorNew from "@/components/cost/ContractSelectorNew/";
// import SelectContractPlan from '@/views/cost/signContract/SelectContractPlan/'
import SelectContractPlan from "@/views/cost/ineffectiveCostModel/SelectContractPlan/";
// import StayHappenAmountDialog from '@/views/cost/signContract/StayHappenAmountDialog/'
import StayHappenAmountDialog from "@/views/cost/ineffectiveCostModel/StayHappenAmountDialog/";
import AmountInput from "@/components/cost/AmountInput/";
import DesignAlterationAttachmentTable from "@/views/cost/designAlteration/DesignAlterationAttachmentTable";
//补录
import ContractSelector from "@/components/cost/ContractSelectorIneffective/";
import CostFileUpload from "@/components/cost/UploadFile/";
import DictionarySelect from "@/components/cost/DictionarySelect/";
import DictionaryLabel from "@/components/cost/DictionaryLabel/";
import ProjectAccountSelect from "@/components/cost/ProjectAccountSelect/";
import { getAttachment } from "@/api/cost/attachment";
import { getApprove } from "@/api/cost/approve";
import {
  NumFormat, // 千位符
  FLevel,
  dateFormat,
  Version
} from "@/filters/cost/";

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
          agentDate: ""
        };
      }
    },

    handleType: ""
  },
  show: {},
  components: {
    ProjectAccountSelect,
    AccountSelectorNone,
    AccountSelector,
    ContractSelector,
    CostFileUpload,
    ContractSelectorNew,
    DictionarySelect,
    DictionaryLabel,
    SelectContractPlan,
    StayHappenAmountDialog,
    DesignAlterationAttachmentTable,
    AmountInput
  },
  filters: {
    NumFormat,
    Version
  },
  data() {
    var validateAccountName = (rule, value, callback) => {
      value = this.ConstructionModel.accountingObjectId;
      if (value === "" && this.$route.query.isEdit == "true") {
        callback(new Error("请选择成本分期"));
      } else {
        callback();
      }
    };
    var validateProjectName = (rule, value, callback) => {
      value = this.ConstructionModel.projectId;
      if (value === "" && this.$route.query.isEdit == "true") {
        callback(new Error("请选择项目名称"));
      } else {
        callback();
      }
    };
    return {
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
      showDeleteButton: true,
      attachmentData: [],
      fileList: "",
      size: 4,
      limit: 4,
      outerId: "",
      isOrEdit: true,
      tableDataList: [],
      stayHappenAmount: false,
      stayHappenAmountData: {},
      isPending: false,
      dialogContractPlan: false,
      show: {
        group: false,
        company: false,
        dept: false,
        project: true,
        accObj: true
      },
      rules: {
        projectName: [
          { message: "请输入项目名称", required: true, trigger: "blur" }
        ],
        money: [
          { message: "请输入无效成本金额", required: true, trigger: "blur" }
        ],
        ineffectiveType: [
          { message: "请选择类别", required: true, trigger: "blur" }
        ],
        multiple: [
          { message: "请选择成就共享倍数", required: true, trigger: "change" }
        ],
        cpName: [
          { message: "请选择合约规划", required: true, trigger: "change" }
        ],
        type: [
          { message: "请选择无效成本类别", required: true, trigger: "change" }
        ],
        accObjId: [
          { required: true, validator: validateAccountName, trigger: "change" }
        ],
        projectId: [
          { required: true, validator: validateProjectName, trigger: "change" }
        ]
      },
      accountObject: {
        accObjId: "",
        projectId: ""
      },
      // 单据类型
      invoicveType: [
        {
          value: "1",
          label: "设计变更"
        },
        {
          value: "2",
          label: "现场签证"
        },
        {
          value: "3",
          label: "无合同费用"
        }
      ],
      radio: "",
      project: {
        projectId: "",
        projectName: "",
        accObjId: "",
        companyId: ""
      },
      contentlistInfo: [],
      value: "",
      form: {
        projectId: "",
        accountingObjectId: "",
        tableData: [],
        tableDataList: [],
        contractDetails: {
          contract_party_type: "",
          isSharedByMarketing: "0",
          contractAmountIncludeTax: "",
          costNature: "",
          biddingWay: "0",
          contractAmountExcludeTax: "",
          tax: "",
          taxAmount: "",
          partyA: "",
          partyB: "",
          partyBName: "",
          partyC: "",
          partyCName: "",
          maintenanceFundRate: "",
          reservedChangeAmountState: "0", // 0: 未释放 ，1: 已释放
          reservedChangeAmount: "",
          maintenanceFund: "",
          splitStatus: "1",
          reservedChangeRatio: "",
          performanceBondAmountRate: "",
          performanceBondAmount: "",
          paymentRate: "",
          reservedChangeAmountRate: ""
        }
      },
      contractTableData: [],
      isEdit: false,
      isShow: false,
      isShowSpan: false,
      isShowAdd: true,
      isShowDel: true,
      isShowSubmit: true,
      isShowBack: false,
      buttonDisable: false,
      buttonDisableSub: false,
      isShowNoContract: false,
      isShowTable1: true,
      isShowTable2: false,
      selectTable: [],
      selectTable2: [],
      isShowContract: false,
      isShowContract2: false,
      isShowContract3: false,
      queryModuleName: "",
      ConstructionModelTest: {},
      ConstructionModel: {
        id: "",
        projectId: "",
        projectName: "",
        accountingObjectId: "",

        accountingObjectName: "",
        companyId: "",
        ineffectiveType: "0", // 0手动 1是补录
        applyNo: "",
        agent: "",
        agentDate: "",
        createdBy: JSON.parse(JSON.parse(localStorage.getItem("USER_INFO")).val)
          .username,
        createdDate: "",
        status:'0',
        statusCh: "草稿",
        approveDate: "",
        details: []
      },
      flag:false,
      bpmUrl:'',
      contractQueryModel: {
        // 变更签证编号/无合同编号查询条件
        type: "1", // 1：设计变更 2:现场签证 3：无合同费用
        projectId: "",
        code: "",
        name: ""
      },
      queryModuleName: "",
      contractInfo: {},
      contractDetail: {},
      visaInfo: [],
      ContractListByAlterationStatus: {
        // 合同编号查询
        visaId: "",
        contractName: "",
        contractCode: ""
      },
      tableNum: 0,
      pageStatus: {
        projectAccountSelect: {
          show: { project: true, accObj: true },
          disable: { project: true, accObj: false }
        }
      },
      page: {
        queryModel: {
          ProjectAccountSelect: {
            projectId: null,
            accObjId: null
          }
        }
      },
      excludeContract: [],
      ineffectiveType: "",
      status: "",
      contractId: "",
      isSelectType: false
    };
  },
  mounted: function() {
    this.isOrEdit = eval(this.$route.query.isOrEdit);
    // this.isEdit = eval(this.$route.query.isEdit)

    this.init();
    localStorage.setItem("projectId", "");
    localStorage.setItem("dataList", "");
    // alert(this.isEdit)
  },
  methods: {
    changeAttachments(data) {
      // this.ConstructionModel.attachments = data;
      this.attachmentData = data;
    },
    // 项目/成本分期选择事件
    projectAccountSelectChange(selectItem) {
      // debugger
      // this.page.queryModel.projectAccountSelectItem = selectItem //当前选择的成本分期
      // this.page.queryModel.stageId = (selectItem['attr'] && selectItem['attr']['stageId']) ? selectItem['attr']['stageId'] : null

      this.ConstructionModel.accountingObjectName = selectItem.text;
      debugger;
      if (selectItem.parentId && selectItem.parentId.length > 4) {
        this.ConstructionModel.projectId = selectItem.parentId;
        this.ConstructionModel.accountingObjectId = selectItem.id;
      } else if (selectItem.parentId && selectItem.parentId.length == 4) {
        this.ConstructionModel.projectId = selectItem.children[0].parentId;
        this.ConstructionModel.accountingObjectId = selectItem.children[0].id;
      }

      //"6729,6795,6658,6759,7e473459-92a4-482a-9150-14f95e53de6d"
      //根，集团，公司，事业部，项目
      this.ConstructionModel.companyId = null;
      if (selectItem.parentIds) {
        let pathArray = selectItem.parentIds.split(",");
        if (pathArray.length === 5) {
          this.ConstructionModel.companyId = pathArray[3]; //取事业部ID为公司id
        }
      }

      let that = this;
      localStorage.setItem("projectId", that.ConstructionModel.projectId);

      let param = {
        projectId: that.ConstructionModel.projectId
      };
      getIneffectiveCostCode(param)
        .then(response => {
          // debugger
          that.ConstructionModel.applyNo = response.data;
        })
        .catch(error => {
          console.log(error);
          that.$showError(error.message ? error.message : "msg_system_error");
        });
      // this._check()
    },
    rowClassName({ row, column, rowIndex, columnIndex }) {
      if (
        columnIndex === 2 ||
        columnIndex === 3 ||
        columnIndex === 7 ||
        columnIndex === 8
      ) {
        // 列下标
        return "cost-table-header-required";
      }
    },
    rowClassName1({ row, column, rowIndex, columnIndex }) {
      if (
        columnIndex === 2 ||
        columnIndex === 3 ||
        columnIndex === 5 ||
        columnIndex === 6 ||
        columnIndex === 10
      ) {
        // 列下标
        return "cost-table-header-required";
      }
    },
    init() {
      this.ConstructionModel.createdDate = new Date().format();
      if (this.$route.query.isAdd) {
        localStorage.setItem("applyNo", "");
        localStorage.setItem("subId", "");
        this.buttonDisableSub = true;
        // 新增
        this.form.tableData = [];
        this.contractTableData = [];
        getMeProfile()
          .then(response => {
            this.ConstructionModel.agent = response.data.nickName;
          })
          .catch(error => {
            console.log(error);
          });
        this.ConstructionModel.agentDate = new Date().format();
      } else {
        this.buttonDisableSub = false;
        localStorage.setItem("subId", this.$route.query.id);
        this.ConstructionModel.id = this.$route.query.id;
        // detailIneffectiveCost
        detailIneffectiveCost({ id: this.$route.query.id })
          .then(response => {
            debugger;
            if (
              response.data != undefined &&
              response.data.approveDate != undefined
            ) {
              this.ConstructionModel.approveDate = new Date(
                response.data.approveDate
              ).format();
            }

            this.page.queryModel.ProjectAccountSelect.projectId =
              response.data.projectId;
            this.page.queryModel.ProjectAccountSelect.accObjId =
              response.data.accountingObjectId;
            this.ConstructionModel.companyId == response.data.companyId;
            this.ConstructionModel.accountingObjectId ==
              response.data.accountingObjectId;
            this.project.projectId = response.data.projectId;
            this.project.projectName = response.data.projectName;
            this.project.companyId = response.data.companyId;
            this.project.accObjId = response.data.accountingObjectId;
            this.ConstructionModel.applyNo = response.data.applyNo;
            this.ConstructionModel.agent = response.data.agent;
            this.ConstructionModel.agentDate = response.data.agentDate;
            this.ineffectiveType = response.data.ineffectiveType;
            this.status = response.data.status;
            this.ConstructionModel.status = response.data.status;
            this.bpmUrl = response.data.bpmUrl
            if(this.bpmUrl != ''){
              this.flag = true
            }
            // if (this.status == "0") {
            //   this.ConstructionModel.statusCh = "草稿";
            // } else if (this.status == "1") {
            //   this.ConstructionModel.statusCh = "审批中";
            // } else if (this.status == "2") {
            //   this.ConstructionModel.statusCh = "已审批";
            // } else if (this.status == "3") {
            //   this.ConstructionModel.statusCh = "已驳回";
            // }

            this.ConstructionModel.details = response.data.details;
            this.contractTableData = response.data.details;
            this.contractTableData.forEach(item => {
              item.index = uuidv1();
              item.remainedPendingOccurenceAmount = "0";
            });
            this.form.tableData = response.data.details;
            this.form.tableData.forEach(item => {
              item.index = uuidv1();
            });

            // this.form.tableData = []
            // this.contractTableData = []

            if (this.ineffectiveType == "1") {
              this.ConstructionModel.ineffectiveType = "1";
              this.show.accObj = false;
              this.isShowTable1 = false;
              this.isShowTable2 = true;

              this.pageStatus.projectAccountSelect = {
                show: { project: true, accObj: false },
                disable: { project: false, accObj: false }
              };

              this.contractTableData = response.data.details;
              this.contractTableData.forEach(item => {
                item.index = uuidv1();
                item.remainedPendingOccurenceAmount = "0";
              });
            } else {
              this.ConstructionModel.ineffectiveType = "0";
              this.show.accObj = true;
              this.isShowTable2 = false;
              this.isShowTable1 = true;

              this.pageStatus.projectAccountSelect = {
                show: { project: true, accObj: true },
                disable: { project: true, accObj: false }
              };
            }

            if (this.ineffectiveType == "1" && this.$route.query.isFromBpm) {
              this.pageStatus.projectAccountSelect = {
                show: { project: true, accObj: false },
                disable: { project: true, accObj: true }
              };
            } else if (
              this.ineffectiveType == "0" &&
              this.$route.query.isFromBpm
            ) {
              this.pageStatus.projectAccountSelect = {
                show: { project: true, accObj: true },
                disable: { project: true, accObj: true }
              };
            }
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
            debugger;
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

      this.isEdit = this.$route.query.isEdit.toString() === "true";
      this.isShowNoContract = this.$route.query.isEdit;
      if (!this.isEdit) {
        this.isShowSpan = true;
        this.buttonDisable = true;
        this.isShowAdd = false;
        this.isShowSubmit = false;
        this.isShowBack = true;
        this.isSelectType = true;
        this.isShowDel = false;
        this.showDeleteButton = false;
      } else {
        this.isShowDel = true;
      }

      if (this.$route.query.isFromBpm) {
        this.isSelectType = true;
        this.buttonDisable = true;
        this.isShowAdd = false;
        this.isShowSubmit = false;
        this.isShowDel = true;
      }
      // this.pageStatus.projectAccountSelect.project =
    },
    checkTable(v) {
      this.form.tableData = [];
      this.contractTableData = [];
      this.page.queryModel.ProjectAccountSelect.projectId = "";
      this.page.queryModel.ProjectAccountSelect.accObjId = "";
      this.ConstructionModel.applyNo = "";
      this.ConstructionModel.accountingObjectId = "";
      this.ConstructionModel.accountingObjectName = "";
      this.ConstructionModel.projectId = "";

      if (v == "0") {
        this.isShowTable1 = true;
        this.isShowTable2 = false;
        this.show.accObj = true;

        this.pageStatus.projectAccountSelect = {
          show: { project: true, accObj: true },
          disable: { project: true, accObj: false }
        };
      } else {
        this.isShowTable1 = false;
        this.isShowTable2 = true;
        this.show.accObj = false;
        this.pageStatus.projectAccountSelect = {
          show: { project: true, accObj: false },
          disable: { project: false, accObj: false }
        };
      }
    },
    changeLocationValue(val) {
      // locations是v-for里面的也是datas里面的值
      let obj = {};
      obj = this.typelist.find(item => {
        if (item.label === val) {
          this.contentlistInfo = item.contentList;
        }
      });
    },
    addRowToTable() {
      // console.log(row+1111)
      this.tableNum = Number(this.tableNum) + 1;
      this.form.tableData.push(this.getDefaultRow());
    },
    addRowToTable2() {
      this.tableNum = Number(this.tableNum) + 1;
      this.contractTableData.push(this.getDefaultRow2());
    },
    getDefaultRow2() {
      return {
        id: "",
        serialNumber: this.tableNum,
        businessId: "",
        code: "",
        businessName: "",
        businessCode: "",
        businessNumber: "",
        businessType: "",
        contractId: "",
        contractCode: "",
        contractName: "",
        contractNumber: "",
        supplier: "",
        alterationEstimatedAmt: "",
        alterationContent: "",
        isHasIneffective: "",
        description: "",
        isReprocess: "",
        ineffectiveType: "",
        ineffectiveAmt: "",
        ineffectiveResponsibleDept: "",
        ineffectiveContent: "",
        ineffectiveDesc: "",
        alterationType: "1",
        isBudgetConveySure: "",
        isIncontract: "",
        type: "",
        content: "",
        index: uuidv1()
      };
    },
    deleteDetail() {
      // debugger
      let newTableData = this.form.tableData.filter(function(item) {
        return item.checked !== true;
      });
      this.form.tableData = newTableData;
      this.tableNum = this.form.tableData.length;
    },
    deleteDetail2() {
      // debugger
      let newContractTableData = this.contractTableData.filter(function(item) {
        return item.checked !== true;
      });
      this.contractTableData = newContractTableData;
      this.tableNum = this.contractTableData.length;
    },
    getDefaultRow() {
      return {
        id: "",
        serialNumber: this.tableNum,
        type: "",
        money: "",
        ownerDept: "",
        type: "",
        content: "",
        description: "",
        multiple: "",
        createdDate: "",
        createdBy: JSON.parse(JSON.parse(localStorage.getItem("USER_INFO")).val)
          .username,
        updatedDate: "",
        updatedBy: JSON.parse(JSON.parse(localStorage.getItem("USER_INFO")).val)
          .username,
        index: uuidv1()
      };
    },
    handleSelect(selection, row) {
      // debugger
      for (let i = 0; i < selection.length; i++) {
        if (selection[i].index === row.index) {
          this.form.tableData.forEach(item => {
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
      this.form.tableData.forEach(item => {
        item.checked = allChecked;
      });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleSelect2(selection, row) {
      for (let i = 0; i < selection.length; i++) {
        if (selection[i].index === row.index) {
          this.contractTableData.forEach(item => {
            if (item.index === row.index) {
              item.checked = true;
            }
          });
        }
      }
    },
    handleSelectAll2(selection, row) {
      // 全选/取消全选
      let allChecked = true;
      if (selection.length === 0) {
        allChecked = false;
      }
      this.contractTableData.forEach(item => {
        item.checked = allChecked;
      });
    },

    handleSelectionChange2(val) {
      this.multipleSelection = val;
    },
    handleBack() {
      this.$router.push({
        name: "IneffectiveCostList"
      });
    },
    searchContract(data) {
      if (data.businessId != "") {
        localStorage.setItem("visaId", data.businessId);
        this.isShowContract2 = true;
        this.currentIndex = data.index;
      } else {
        this.$showError("请先选择变更签证编号/无合同编号");
      }
    },

    //无合同编号选择
    searchContract2(data) {
      if (this.ConstructionModel.accountingObjectId == "") {
        this.ConstructionModel.accountingObjectId = this.project.accObjId;
      }
      if (this.ConstructionModel.accountingObjectId == "") {
        this.$showError("请选择项目名称");
        return;
      }
      this.isShowContract3 = true;
      this.currentIndex = data.index;
    },
    cancelDialog(data) {
      // debugger
      this.isShowContract2 = data;
      this.isShowContract3 = data;
    },
    closeDialog(data) {
      // debugger
      this.isShowContract2 = data;
      this.isShowContract3 = data;
    },
    confirmContract(data) {
      // debugger
      this.contractTableData.map(detail => {
        if (detail.index === this.currentIndex) {
          detail.contractNumber = data.contractCode;
          detail.contractId = data.id;
          detail.contractName = data.contractName;
          // detail.businessName = data.contractName
          detail.supplier = data.partyBName;
          // detail.isBudgetConveySure = data.isBudgetConveySure
        }
      });
    },
    confirmContract2(data) {
      debugger;
      // alert(JSON.stringify(data))
      this.contractTableData.map(detail => {
        if (detail.index === this.currentIndex) {
          detail.businessType = data.selectType;
          detail.businessId = data.id;
          detail.businessName = data.name;
          detail.businessCode = data.code;
          detail.businessNumber = data.code;
          detail.typeOfSelected = data.typeOfSelected;
        }
      });
    },

    submitConstructionCost() {
      this.buttonDisableSub = true;
      let re = /^[0-9]+.?[0-9]*/;
      let isPass = true;
      // debugger;

      if (
        this.$route.query.isEdit &&
        this.$route.query.isAdd !== true &&
        this.$route.query.isAdd != "true"
      ) {
        this.ConstructionModel.companyId = this.project.companyId;
        this.ConstructionModel.companyId = this.project.companyId;
        this.ConstructionModel.accountingObjectId = this.project.accObjId;
        this.ConstructionModel.accountingObjectName = this.project.accountingObjectName;
        this.ConstructionModel.projectId = this.project.projectId;
        this.ConstructionModel.projectName = this.project.projectName;
      }
      console.log(this.ConstructionModel.accountingObjectId)
      console.log(this.contractTableData.length)
      if (this.$route.query.isEdit && this.$route.query.isAdd != true) {
        if (
          this.ConstructionModel.accountingObjectId == "" ||
          this.contractTableData.length == 0
        ) {
          this.$showError("请输入必填内容");
          isPass = false;
        }
      } else {
        if (
          this.ConstructionModel.accountingObjectId == "" ||
          this.ConstructionModel.details.length == 0
        ) {
          this.$showError("请输入必填内容");
          isPass = false;
        }
      }

      this.ConstructionModel.details.map(detail => {
        if (detail.money == "" || detail.money == undefined) {
          this.$showError("请输入无效成本金额");
          isPass = false;
        }
        if (detail.multiple == "" || detail.multiple == undefined) {
          this.$showError("请选择成就共享倍数");
          isPass = false;
        }
        if (detail.type == "" || detail.type == undefined) {
          this.$showError("请输入无效成本类别");
          isPass = false;
        }
      });

      if (this.ConstructionModel.ineffectiveType == "1") {
        this.ConstructionModel.details = this.contractTableData;
      } else {
        this.ConstructionModel.details = this.form.tableData;
        this.ConstructionModel.details.map(item => {
          debugger;
          if (
            item.remainedPendingOccurenceAmount &&
            item.remainedPendingOccurenceAmount != 0
          ) {
            this.$showError("请选择剩余待发生处理");
            isPass = false;
          }
          if (item.cpId == undefined || item.cpId == "") {
            this.$showError("请选择合约规划");
            isPass = false;
          }
        });
      }

      if (!isPass) {
        return;
      }
      this.ConstructionModel.id = localStorage.getItem("subId");
      this.ConstructionModel.status = "1";
      this.ConstructionModel.agentDate = new Date(
        this.ConstructionModel.createdDate
      );
      this.ConstructionModel.operateDate = new Date(
        this.ConstructionModel.operateDate
      ).format();
      // console.log(this.ConstructionModel)
      saveOrUpdateIneffectiveCost(this.ConstructionModel)
        .then(response => {
          this.$showSuccess(response.message);
          this.isShowAdd = false;
          this.isShowBack = true;
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

      if (this.ConstructionModel.ineffectiveType == "1") {
        this.ConstructionModel.details = this.contractTableData;
      } else {
        this.ConstructionModel.details = this.form.tableData;
        this.ConstructionModel.details.map(item => {
          // debugger;
          if (
            item.remainedPendingOccurenceAmount &&
            item.remainedPendingOccurenceAmount != 0
          ) {
            this.$showError("请选择剩余待发生处理");
            isPass = false;
          }
          if (item.cpId == undefined || item.cpId == "") {
            this.$showError("请选择合约规划");
            isPass = false;
          }
        });
      }
      // debugger;
      if (
        this.$route.query.isEdit &&
        this.$route.query.isAdd != true &&
        this.$route.query.isAdd != "true"
      ) {
        this.ConstructionModel.companyId = this.project.companyId;
        this.ConstructionModel.accountingObjectId = this.project.accObjId;
        this.ConstructionModel.accountingObjectName = this.project.accountingObjectName;
        this.ConstructionModel.projectId = this.project.projectId;
        this.ConstructionModel.projectName = this.project.projectName;
      }
      console.log(this.ConstructionModel);
      if (
        this.ConstructionModel.accountingObjectId == "" ||
        this.ConstructionModel.details.length == 0
      ) {
        this.$showError("请输入必填内容");
        isPass = false;
      }

      this.ConstructionModel.details.map(detail => {
        if (detail.money == "" || detail.money == undefined) {
          this.$showError("请输入无效成本金额");
          isPass = false;
        }
        if (detail.multiple == "" || detail.multiple == undefined) {
          this.$showError("请选择成就共享倍数");
          isPass = false;
        }
        if (detail.type == "" || detail.type == undefined) {
          this.$showError("请输入无效成本类别");
          isPass = false;
        }
      });

      if (!isPass) {
        return;
      }

      // 取消保存按钮隐藏需要
      if (localStorage.getItem("subId") != "") {
        this.ConstructionModel.id = localStorage.getItem("subId");
      }

      this.ConstructionModel.status = "0";
      this.ConstructionModel.agentDate = new Date(
        this.ConstructionModel.createdDate
      );
      saveOrUpdateIneffectiveCost(this.ConstructionModel)
        .then(response => {
          this.$showSuccess(response.message);
          localStorage.setItem("subId", response.data);
          this.isShowAdd = true;
          this.isShowBack = true;
          this.isShowSubmit = true;
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
    reset() {
      this.contractQueryModel.type = "1";
      this.contractQueryModel.projectId = "";
      this.contractQueryModel.code = "";
      this.contractQueryModel.name = "";

      getIneffectiveAlteration(this.contractQueryModel)
        .then(response => {
          this.selectTable = response.data;
        })
        .catch(error => {
          console.log(error);
        });
    },
    search() {
      getIneffectiveAlteration(this.contractQueryModel)
        .then(response => {
          this.selectTable = response.data;
          this.detail.businessType = this.contractQueryModel.type;
        })
        .catch(error => {
          console.log(error);
        });
    },
    addRowToTableConstract(data) {
      // debugger
      this.currentIndex = data.index;
      this.isShowContract = true;
      // this.contractQueryModel.projectId = this.$route.query.projectId
      this.contractQueryModel.projectId = this.page.queryModel.ProjectAccountSelect.projectId;
      getIneffectiveAlteration(this.contractQueryModel)
        .then(response => {
          console.log(response.data);
          this.selectTable = response.data;
        })
        .catch(error => {
          console.log(error);
        });
    },
    getCurrentRow(contractDetail) {
      this.contracvalue;
    },
    closeDialogContractPlan(val) {
      debugger;
      // alert(JSON.stringify(val))
      console.log(val+11111);
      this.dialogContractPlan = false;

      this.form.tableData.map(detail => {
        // console.log(detail)
        // console.log(detail.index)
        // console.log(this.currentIndex)
        // return
        if (detail.index === this.currentIndex) {
          debugger;
          detail.cpId = val.cpId;
          detail.cpName = val.cpName;
          detail.cpAmount = val.cpAmount;
          detail.contractTotalAmount = val.contractTotalAmount;
          detail.cpTotalAmount = val.cpTotalAmount; //cpTotalAmount 合约规划总金额(元)
          detail.amountPendingOccurence = val.amountPendingOccurence; //amountPendingOccurence 待发生金额
          detail.stageId = val.stageId;
          detail.stageVersion = val.stageVersion;
          // detail.remainedPendingOccurenceAmount = val[0].remainedPendingOccurenceAmount   //remainedPendingOccurenceAmount 剩余待发生金额(元)
        }
        let getIndex = "0";
        for (var i = 0; i < this.form.tableData.length; i++) {
          if (this.form.tableData[i].index == detail.index) {
            getIndex = i;
          }
        }
        // debugger
        this.$set(this.form.tableData, detail.index, detail);

        if (detail.remainedPendingOccurenceAmount != "0") {
          this.computeContractPlanAmount(detail, getIndex);
        }
      });

      let temp = [];
      let index = [];
      let l = this.form.tableData.length;
      for (var i = 0; i < l; i++) {
        for (var j = i + 1; j < l; j++) {
          if (this.form.tableData[i].cpName === this.form.tableData[j].cpName) {
            i++;
            j = i;
          }
        }
        temp.push(this.form.tableData[i]);
        index.push(i);
      }
      this.form.tableData = temp;
    },
    selectContractPlanning(data) {
      debugger;

      this.form.accountingObjectId = this.page.queryModel.ProjectAccountSelect.accObjId;
      if (this.form.accountingObjectId == "") {
        this.$showError("请选择成本分期");
        return;
      }
      localStorage.setItem("dataList", JSON.stringify(this.form.tableData));
      this.currentIndex = data.index;
      this.dialogContractPlan = true;
    },
    createNewContract(index, row) {
      this.currentIndex = index;
      this.stayHappenAmount = true;
      this.cpName = row.cpName;

      // this.cpAmount = row.cpAmount
      debugger;
      this.isIndex = index;
      this.ineffectiveSignCpNewList = row.ineffectiveSignCpNew;
      this.remainedPendingOccurenceAmount = row.remainedPendingOccurenceAmount;
      console.log(row);
      // console.log(row.cpAmount)
      this.cpAmount = row.ineffectiveSignCpNew.cpAmount;
      this.remainedPending = row.ineffectiveSignCpNew.remainedPending;
      this.stayHappenAmountData = row;
      this.contractId = row.ineffectiveSignCpNew.contractId;
    },
    closeStayHappenAmount(val) {
      debugger;
      this.stayHappenAmount = false;
      if (this.$route.query.isAdd) {
        if (val && val.dealingType === "生成新合约") {
          val.dealingType = "0";
        } else if (val && val.dealingType === "释放") {
          val.dealingType = "1";
        }
        debugger;
        this.remainedPendingOccurenceAmount =
          val.remainedPendingOccurenceAmount;
        let newData = [];
        newData = this.form.tableData;
        for (let i = 0; i < newData.length; i++) {
          if (i === Number(this.isIndex)) {
            newData[i].ineffectiveSignCpNew.cpAmount = val.cpAmount;
            newData[i].ineffectiveSignCpNew.newCpName = val.newCpName;

            newData[i].ineffectiveSignCpNew.dealingType = val.dealingType;
            newData[i].isState = true;
            // debugger
            if (newData[i].ineffectiveSignCpNew.dealingType === "0") {
              // newData[i].amoutReleased = Number(val.remainedPendingOccurenceAmount) - Number(val.cpAmount)
              newData[i].ineffectiveSignCpNew.amountReleased =
                Number(val.remainedPendingOccurenceAmount) -
                Number(val.cpAmount);
            } else {
              newData[i].ineffectiveSignCpNew.amountReleased =
                val.remainedPending;
            }

            newData[i].remainedPendingOccurenceAmount = "0";
          }
        }
        this.$set(this.form.tableData, this.isIndex, newData[this.isIndex]);
      } else {
        if (val && val.dealingType === "生成新合约") {
          val.dealingType = "0";
        } else if (val && val.dealingType === "释放") {
          val.dealingType = "1";
        }
        debugger;
        this.remainedPendingOccurenceAmount =
          val.remainedPendingOccurenceAmount;
        let newData = [];
        newData = this.form.tableData;
        for (let i = 0; i < newData.length; i++) {
          if (i === Number(this.isIndex)) {
            newData[i].ineffectiveSignCpNew.cpAmount = val.cpAmount;
            newData[i].ineffectiveSignCpNew.newCpName = val.newCpName;

            newData[i].ineffectiveSignCpNew.dealingType = val.dealingType;
            newData[i].isState = true;
            // debugger
            if (newData[i].ineffectiveSignCpNew.dealingType === "0") {
              // newData[i].amoutReleased = Number(val.remainedPendingOccurenceAmount) - Number(val.cpAmount)
              newData[i].ineffectiveSignCpNew.amountReleased =
                Number(val.remainedPendingOccurenceAmount) -
                Number(val.cpAmount);
            } else {
              newData[i].ineffectiveSignCpNew.amountReleased =
                val.remainedPending;
            }

            newData[i].remainedPendingOccurenceAmount = "0";
          }
        }
        this.$set(this.form.tableData, this.isIndex, newData[this.isIndex]);
      }
      // console.log(this.form.tableDataList)
    },
    computeContractPlanAmount(rowData, index) {
      debugger;
      rowData.ineffectiveSignCpNew = {};

      if (this.form.contractDetails.reservedChangeAmountRate) {
        rowData.reservedChangeAmountIncludeTax =
          Number(rowData.contractTotalAmount) *
          Number(this.form.contractDetails.reservedChangeAmountRate) /
          100;
        rowData.reservedChangeAmountIncludeTax = Number(
          rowData.reservedChangeAmountIncludeTax
        ).toFixed(2);
      } else {
        rowData.reservedChangeAmountIncludeTax =
          Number(rowData.contractTotalAmount) * Number(0) / 100;
      }

      let reservedAmount = (
        Number(rowData.amountPendingOccurence) -
        Number(rowData.contractTotalAmount) -
        Number(rowData.reservedChangeAmountIncludeTax)
      ).toFixed(2);
      rowData.remainedPendingOccurenceAmount = reservedAmount;
      if (Number(rowData.remainedPendingOccurenceAmount) > 0) {
        rowData.ineffectiveSignCpNew.dealingType = "生成新合约/释放";
        rowData.isPending = true;
      } else {
        rowData.remainedPendingOccurenceAmount = 0;
      }

      debugger;
      if (
        rowData.amountPendingOccurence !== undefined &&
        rowData.money !== undefined &&
        rowData.money !== "" &&
        rowData.amountPendingOccurence !== ""
      ) {
        rowData.remainedPendingOccurenceAmount =
          Number(rowData.amountPendingOccurence) - Number(rowData.money);

        if (Number(rowData.remainedPendingOccurenceAmount) > 0) {
          rowData.ineffectiveSignCpNew.dealingType = "生成新合约/释放";
          rowData.isPending = true;
        } else {
          rowData.remainedPendingOccurenceAmount = 0;
          rowData.ineffectiveSignCpNew.dealingType = "";
        }
      } else {
        rowData.remainedPendingOccurenceAmount = rowData.amountPendingOccurence;
      }

      this.$set(this.form.tableData, index, rowData);
      // console.log(this.form.tableDataList)
    }
  },
  watch: {
    "form.accountingObjectId": {
      handler(newValue, oldValue) {
        if (this.project.accObjId) {
          this.form.accountingObjectId = this.project.accObjId;
          // this.getDefaultContractCode()
        }
      },
      deep: true
    }
  }
};
</script>

<style scoped>
@import "../../../styles/detail.scss";
</style>

<style>
.custom-00a597 .el-cascader-menu__item--extensible:after {
  content: "\E604";
}
.Label_overflow {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
}
.zhaPlace {
  display: inline-block;
  width: 15px;
  height: 10px;
  /* background:red; */
}
.col{
color: blue;
text-decoration:underline ;
cursor: pointer;
}
</style>
