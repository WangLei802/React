<!--suppress ALL -->
<template>
  <div class="app-container contractBase">
    <div>
      <div class="form-unit">合同基本信息</div>
      <el-form
        ref="contractBaseInfoForm"
        :model="form"
        label-width="150px"
        size="mini"
        :rules="rules"
      >
        <!--补充合同显示ui-->
        <div v-if="form.isPrimary === '0'">
          <el-row>
            <ProjectAccountSelect
              v-model="project"
              :span="{ 'project': 8 , 'accObj': 8}"
              :show="show"
              :clearable="{ project: true, accObj: true }"
              :labelWidth="{'project':150,'accObj':150 }"
              :disabled="{'project':!isOrEdit || form.contractSource === '1'|| form.contractSource === '2', 'accObj':!isOrEdit}"
            ></ProjectAccountSelect>
            <!--原先成本分期控制条件 'accObj':!isOrEdit || form.contractSource === '1' -->
            <el-col :span="8">
              <el-form-item label="法人公司：" prop="corporateCompanyId">
                <el-select
                  v-model="form.corporateCompanyId"
                  :disabled="!isOrEdit || form.isPrimary === '0'"
                  placeholder="请选择"
                  @change="selectCorporateCompany($event)"
                  :clearable="true"
                >
                  <el-option
                    v-for="item in corporateCompanyList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="合同编号：">
                <!--   <el-tooltip class="item" :content="form.contractCode" placement="top-start">

                </el-tooltip>-->
                <el-input v-model="form.contractCode" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="合同名称：" prop="contractName">
                <el-input
                  v-model="form.contractName"
                  :disabled="!isOrEdit || form.contractSource === '2'"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="合同类型：" prop="contractType">
                <el-select
                  v-model="form.contractType"
                  placeholder="请选择活动区域"
                  :disabled="!isOrEdit || form.isPrimary === '0'"
                >
                  <el-option
                    v-for="item in contractTypeList"
                    :key="item.dictValue"
                    :label="item.dictLabelCn"
                    :value="item.dictValue"
                  ></el-option>
                </el-select>

                <!--<fd-select v-model='form.contractType' :disabled="!isOrEdit || form.isPrimary === '0'" type="cost_contract_type"></fd-select>-->
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="是否主合同：" prop="isPrimary">
                <el-select
                  v-model="form.isPrimary"
                  :disabled="!isOrEdit"
                  placeholder="请选择活动区域"
                  @change="changeIsPrimary"
                >
                  <el-option label="主合同" value="1"></el-option>
                  <el-option label="补充合同" value="0"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                label="主合同编码："
                v-if="form.isPrimary === '0'"
                prop="primaryContractNumber"
              >
                <el-input
                  v-model="form.primaryContractNumber"
                  disabled
                  class="primaryContractNumber"
                ></el-input>
                <span
                  @click="handleSelectContract()"
                  v-if="isOrEdit"
                  style="color:blue;overflow:hidden;"
                >选择</span>
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item label="主合同名称：" v-if="form.isPrimary == '0'" prop="primaryContractName">
                <el-input v-model="form.primaryContractName" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="8">
              <el-form-item label="是否按产值付款：" prop="isPaiedByOutputValue">
                <el-select
                  v-model="form.isPaiedByOutputValue"
                  :disabled="!isOrEdit || form.isPrimary === '0'"
                  placeholder="请选择活动区域"
                >
                  <el-option label="是" value="1"></el-option>
                  <el-option label="否" value="0"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="合同来源：">
                <el-select v-model="form.contractSource" disabled placeholder="请选择活动区域">
                  <el-option
                    v-for="item in contractSourceList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8" v-if="form.contractSource === '1'">
              <el-form-item label>
                <a
                  href="javascript:void(0);"
                  style="color: #3784fa; text-decoration:none;"
                  @click="biddingDetail"
                >查看招采系统推送信息</a>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="8">
              <el-form-item label="经办部门：">
                <el-input v-model="form.handlingDeptName" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="经办人：">
                <el-input v-model="form.handlingPersonName" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="提交日期：">
                <el-date-picker v-model="form.handlingDate" type="date" disabled>></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="design">
            <el-col :span="8">
              <el-form-item label="是否主项设计：" prop="isMainPlan">
                <!-- @change="changeIsMainPlan" -->
                <el-select
                  v-model="form.isMainPlan"
                  :disabled="!isOrEdit"
                  placeholder="请选择是否主项设计"
                  :clearable="true"
                  @change="changeIsMainPlan"
                >
                  <el-option label="是" value="是"></el-option>
                  <el-option label="否" value="否"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="设计分支：" prop="planBranch">
                <!-- @change="changePlanBranch" -->
                <el-select
                  v-model="form.planBranch"
                  :disabled="!isOrEdit"
                  placeholder="请选择设计分支"
                  :clearable="true"
                >
                  <el-option
                    v-for="item in option"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="合同状态：" v-if="!isOrEdit">
                <fd-label
                  :code="form.contractStatus"
                  :class="{col:flag}"
                  :url="bpmUrl"
                  type="cost_contract_status"
                  disabled
                ></fd-label>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="审批日期：">
                <el-date-picker v-model="form.handlingDate" type="date" disabled>></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col
              :span="8"
              v-if="form.contractDetails.isSharedByMarketing === '1' && form.contractSource === '1'"
            >
              <el-form-item label="营销经办人：" prop="marketingHandlingPersonName">
                <el-input
                  v-model="form.marketingHandlingPersonName"
                  readonly
                  @focus="handleSelectMarketing"
                  :disabled="!isOrEdit"
                >
                  <i
                    class="el-icon-search el-input__icon"
                    slot="suffix"
                    style="cursor: pointer"
                    @click="handleSelectMarketing"
                    v-if="isOrEdit"
                  ></i>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <!-- 主合同显示ui-->
        <div v-if="form.isPrimary === '1'">
          <el-row>
            <ProjectAccountSelect
              v-model="project"
              :span="{ 'project': 8 , 'accObj': 8}"
              :show="show"
              :clearable="{ project: true, accObj: true }"
              :labelWidth="{'project':150,'accObj':150 }"
              :disabled="{'project':!isOrEdit || form.contractSource === '1' || form.contractSource === '2', 'accObj':!isOrEdit}"
            ></ProjectAccountSelect>

            <el-col :span="8">
              <el-form-item label="法人公司：" prop="corporateCompanyId">
                <el-select
                  v-model="form.corporateCompanyId"
                  :disabled="!isOrEdit || form.isPrimary === '0'"
                  placeholder="请选择"
                  @change="selectCorporateCompany($event)"
                  :clearable="true"
                >
                  <el-option
                    v-for="item in corporateCompanyList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="合同编号：">
                <!--   <el-tooltip class="item" :content="form.contractCode" placement="top-start">

                </el-tooltip>-->
                <el-input v-model="form.contractCode" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="合同名称：" prop="contractName">
                <el-input
                  v-model="form.contractName"
                  :disabled="!isOrEdit || form.contractSource === '2'"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="合同类型：" prop="contractType">
                <el-select
                  v-model="form.contractType"
                  placeholder="请选择活动区域"
                  :disabled="!isOrEdit || form.isPrimary === '0'"
                >
                  <el-option
                    v-for="item in contractTypeList"
                    :key="item.dictValue"
                    :label="item.dictLabelCn"
                    :value="item.dictValue"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="是否主合同：" prop="isPrimary">
                <el-select
                  v-model="form.isPrimary"
                  :disabled="!isOrEdit"
                  placeholder="请选择活动区域"
                  @change="changeIsPrimary"
                >
                  <el-option label="主合同" value="1"></el-option>
                  <el-option label="补充合同" value="0"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="是否按产值付款：" prop="isPaiedByOutputValue">
                <el-select
                  v-model="form.isPaiedByOutputValue"
                  :disabled="!isOrEdit || form.isPrimary === '0'"
                  placeholder="请选择活动区域"
                >
                  <el-option label="是" value="1"></el-option>
                  <el-option label="否" value="0"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="合同来源：">
                <el-select v-model="form.contractSource" disabled placeholder="请选择活动区域">
                  <el-option
                    v-for="item in contractSourceList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="8">
              <el-form-item label="经办部门：">
                <el-input v-model="form.handlingDeptName" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="经办人：">
                <el-input v-model="form.handlingPersonName" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="提交日期：">
                <el-date-picker v-model="form.handlingDate" type="date" disabled>></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="design">
            <el-col :span="8">
              <el-form-item label="是否主项设计：" prop="isMainPlan">
                <!-- @change="changeIsMainPlan" -->
                <el-select
                  v-model="form.isMainPlan"
                  :disabled="!isOrEdit"
                  placeholder="请选择是否主项设计"
                  :clearable="true"
                  @change="changeIsMainPlan"
                >
                  <el-option label="是" value="是"></el-option>
                  <el-option label="否" value="否"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="设计分支：" prop="planBranch">
                <!-- @change="changePlanBranch" -->
                <el-select
                  v-model="form.planBranch"
                  :disabled="!isOrEdit"
                  placeholder="请选择设计分支"
                  :clearable="true"
                >
                  <el-option
                    v-for="item in option"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8" v-if="form.contractSource === '1'">
              <el-form-item label>
                <a
                  href="javascript:void(0);"
                  style="color: #3784fa; text-decoration:none;"
                  @click="biddingDetail"
                >查看招采系统推送信息</a>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="合同状态：" v-if="!isOrEdit">
                <fd-label
                  :code="form.contractStatus"
                  :class="{col:flag}"
                  :url="bpmUrl"
                  type="cost_contract_status"
                  disabled
                ></fd-label>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="审批日期：">
                <el-date-picker v-model="form.handlingDate" type="date" disabled>></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col
              :span="8"
              v-if="form.contractDetails.isSharedByMarketing === '1' && form.contractSource === '1' "
            >
              <el-form-item label="营销经办人：" prop="marketingHandlingPersonName">
                <el-input
                  v-model="form.marketingHandlingPersonName"
                  readonly
                  @focus="handleSelectMarketing"
                  :disabled="!isOrEdit"
                >
                  <i
                    class="el-icon-search el-input__icon"
                    slot="suffix"
                    style="cursor: pointer"
                    @click="handleSelectMarketing"
                    v-if="isOrEdit"
                  ></i>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-form>
    </div>

    <div>
      <div class="form-unit">合同详细内容</div>
      <el-form
        ref="form"
        :model="form.contractDetails"
        label-width="150px"
        class="contractInfo"
        size="mini"
        :rules="rules"
      >
        <el-row>
          <el-col :span="8">
            <el-form-item label="签约金额（含税）(元)：" prop="contractAmountIncludeTax">
              <amount-input
                v-model="form.contractDetails.contractAmountIncludeTax"
                :disabled="!isOrEdit || contractAmountIncludeTaxDisable"
                :width="'200'"
                @blur="calcEstimatedPaymentAmount(1)"
              />
              <!--<el-input v-model="form.contractDetails.contractAmountIncludeTax"-->
              <!--:disabled="!isOrEdit || contractAmountIncludeTaxDisable"></el-input>-->
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="是否分摊营销费用：" prop="isSharedByMarketing">
              <!-- 原先代码 :disabled="!isOrEdit || isSharedByMarketingDisable" -->
              <el-select
                v-model="form.contractDetails.isSharedByMarketing"
                disabled
                placeholder="请选择活动区域"
              >
                <!-- <el-select v-model="form.contractDetails.isSharedByMarketing" placeholder="请选择活动区域"> -->
                <el-option label="是" value="1"></el-option>
                <el-option label="否" value="0"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item
              label="成本分摊金额(元)："
              v-if="form.contractDetails.isSharedByMarketing === '1'"
              prop="sharedAmountByCostSystem"
            >
              <el-input
                v-model="form.contractDetails.sharedAmountByCostSystem"
                :disabled="!isOrEdit || sharedAmountByCostSystemDisable"
                @blur="calcEstimatedPaymentAmount"
              ></el-input>
            </el-form-item>

            <el-form-item label="成本分摊金额(元)：" v-else>
              <el-input
                v-model="form.contractDetails.sharedAmountByCostSystem"
                :disabled="!isOrEdit || sharedAmountByCostSystemDisable"
                @blur="calcEstimatedPaymentAmount"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="税率：" prop="tax">
              <fd-select
                v-model="form.contractDetails.tax"
                :disabled="!isOrEdit"
                type="cost_contract_tax"
              ></fd-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="签约金额（不含税）(元)：" prop="contractAmountExcludeTax">
              <el-input v-model="form.contractDetails.contractAmountExcludeTax" disabled></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="税额：">
              <el-input v-model="form.contractDetails.taxAmount" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="造价性质：">
              <fd-select
                v-model="form.contractDetails.costNature"
                :disabled="!isOrEdit"
                type="cost_nature"
              ></fd-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="招标方式：">
              <fd-select
                v-model="form.contractDetails.biddingWay"
                :disabled="!isOrEdit"
                type="bidding_way"
              ></fd-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="合同性质：" prop="contract_party_type">
              <el-select
                v-model="form.contractDetails.contract_party_type"
                :disabled="!isOrEdit || form.isPrimary === '0'"
                placeholder="请选择活动区域"
              >
                <el-option label="三方合同" value="0"></el-option>
                <el-option label="两方合同" value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="甲方：" prop="partyA">
              <el-input v-model="form.contractDetails.partyA" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="乙方：" prop="partyBName">
              <el-input class="supplier" value v-model="form.contractDetails.partyBName" disabled></el-input>

              <el-button
                style="padding: 5px 10px;"
                v-if="isOrEdit && form.isPrimary === '1' && form.contractSource === '0'"
                icon="el-icon-zoom-in"
                size="mini"
                @click="checkSupplier('1')"
              ></el-button>

              <span @click="checkRecord('乙方')" style="color:blue ;cursor: pointer">合作记录</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="丙方："
              v-if="form.contractDetails.contract_party_type === '0'"
              prop="partyCName"
            >
              <el-input class="supplier" v-model="form.contractDetails.partyCName" disabled></el-input>
              <el-button
                style="padding: 5px 10px;"
                v-if="isOrEdit && form.isPrimary === '1'"
                icon="el-icon-zoom-in"
                size="mini"
                @click="checkSupplier('2')"
              ></el-button>
              <span @click="checkRecord('丙方')" style="color:blue ;cursor: pointer">合作记录</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="质保金比例（%）：" prop="maintenanceFundRate">
              <amount-input
                v-model="form.contractDetails.maintenanceFundRate"
                :width="200"
                :placeholder="'请输入质保金比例'"
                :disabled="!isOrEdit || form.isPrimary === '0'"
              />
              <!--<el-input v-model="form.contractDetails.maintenanceFundRate"-->
              <!--:disabled="!isOrEdit"></el-input>-->
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="预留变更比例（%）：" prop="reservedChangeAmountRate">
              <amount-input
                @blur="changeValue"
                v-model="form.contractDetails.reservedChangeAmountRate"
                :width="200"
                :placeholder="'请输入预留变更比例'"
                :disabled="!isOrEdit || form.isPrimary === '0'"
              />
              <!--<el-input v-model="form.contractDetails.reservedChangeAmountRate"-->
              <!--:disabled="!isOrEdit"></el-input>-->
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="履约保证金比例（%）：">
              <amount-input
                v-model="form.contractDetails.performanceBondAmountRate"
                :width="200"
                disabled
              />
              <!--<el-input v-model="form.contractDetails.performanceBondAmountRate"-->
              <!--:disabled="!isOrEdit"></el-input>-->
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="质保金金额(元)：">
              <amount-input v-model="form.contractDetails.maintenanceFund" disabled />
              <!--<el-input v-model="form.contractDetails.maintenanceFund" disabled></el-input>-->
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="预留变更金额(元)：">
              <amount-input v-model="form.contractDetails.reservedChangeAmount" disabled />
              <!--<el-input v-model="form.contractDetails.reservedChangeAmount" disabled></el-input>-->
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="履约保证金金额(元)：" prop="performanceBondAmount">
              <amount-input
                v-model="form.contractDetails.performanceBondAmount"
                :disabled="!isOrEdit || form.isPrimary === '0'"
              />
              <!--<el-input v-model="form.contractDetails.performanceBondAmount" :disabled="!isOrEdit || form.isPrimary === '0'"></el-input>-->
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="付款提示比例(结算)(%)：" prop="paymentRate" title="付款提示比例(结算)(%)">
              <amount-input
                v-model="form.contractDetails.paymentRate"
                :width="200"
                :placeholder="'请输入付款提示比例'"
                :disabled="!isOrEdit  || form.isPrimary === '0'"
              />
              <!--<el-input v-model="form.contractDetails.paymentRate"-->
              <!--:disabled="!isOrEdit"></el-input>-->
            </el-form-item>
          </el-col>
          <!--   <el-col :span="8">

               <el-form-item label="拆分状态：">
                 <el-select v-model="form.contractDetails.splitStatus" disabled placeholder="请选择活动区域">
                   <el-option label="未拆分" value="0"></el-option>
                   <el-option label="已拆分" value="1"></el-option>
                 </el-select>

               </el-form-item>
          </el-col>-->
          <el-col
            :span="8"
            v-if="isRelax && form.contractDetails.reservedChangeAmountState && form.contractDetails.reservedChangeAmountState === '0'"
          >
            <el-form-item label="预留变更金额状态：">
              <el-button
                size="mini"
                type="primary"
                v-if="false"
                :disabled="!isOrEdit  || form.isPrimary === '0'"
                @click="getReservedChangeAmountState()"
              >{{ReleaseChangeAmount}}</el-button>
            </el-form-item>
          </el-col>

          <el-col
            :span="8"
            v-if="isRelax && form.contractDetails.reservedChangeAmountState && form.contractDetails.reservedChangeAmountState === '1'"
          >
            <el-form-item label="预留变更金额状态：">
              <span>已释放</span>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="是否总包：" prop="isGeneral">
              <el-select
                v-model="form.contractDetails.isGeneral"
                :disabled="!isOrEdit || form.isPrimary === '0'"
                placeholder="请选择活动区域"
              >
                <el-option label="是" value="1"></el-option>
                <el-option label="否" value="0"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="已收取履约保证金金额："
              prop="colPerformanceBondAmount"
            >
              <el-input
                v-model="form.contractDetails.colPerformanceBondAmount"
                disabled
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div v-if="showCp">
      <!-- 原来disabled判断 form.contractType === '6' || form.contractSource === '1' -->
      <div class="form-unit">合同金额</div>
      <el-row>
        <el-col>
          <!-- 原判断 v-if="isOrEdit || additionalRecording  " -->
          <!-- 原 :disabled="form.tableDataList.length!=0" -->
          <el-button
            type="primary"
            size="mini"
            v-if="isOrEdit || additionalRecording  "
            :disabled="form.contractSource == '1' &&form.tableDataList.length!=0"
            style="margin-bottom:10px"
            @click="selectContractPlanning"
          >选择合约规划</el-button>
        </el-col>
      </el-row>
      <el-table
        class="spHeight"
        :data="form.tableDataList"
        stripe
        border
        :cell-style="tableCellClassName"
        tooltip-effect="dark"
        style="width: 100%"
        size="small"
        :row-style="rowHeight"
      >
        <el-table-column :label="$l('lbl_no')" width="60" type="index"></el-table-column>

        <el-table-column prop="accountingObjName" label="成本分期" width="200"></el-table-column>

        <el-table-column width="120" prop="cpName" label="合约规划名称"></el-table-column>
        <el-table-column width="150" prop="cpTotalAmount" label="合约规划总金额(元)（A）" disabled>
          <template slot-scope="scope">{{ scope.row.cpTotalAmount|NumFormat}}</template>
        </el-table-column>
        <el-table-column prop="cpAmountOccurence" label="已发生金额(元)（B）" width="150" disabled>
          <template slot-scope="scope">{{ scope.row.cpAmountOccurence|NumFormat}}</template>
        </el-table-column>
        <el-table-column prop="amountPendingApprove" label="在途金额(元)（C）" width="150" disabled>
          <template slot-scope="scope">{{ scope.row.amountPendingApprove|NumFormat}}</template>
        </el-table-column>
        <el-table-column prop="amountReleased" label="已释放金额(元)（D）" width="150" disabled>
          <template slot-scope="scope">{{ scope.row.amountReleased|NumFormat}}</template>
        </el-table-column>
        <el-table-column
          prop="amountPendingOccurence"
          label="待发生金额(元)（E=A-B-C-D）"
          width="200"
          disabled
        >
          <template slot-scope="scope">{{ scope.row.amountPendingOccurence|NumFormat}}</template>
        </el-table-column>
        <el-table-column prop="contractTotalAmount" label="合同金额(元)（F）" width="150">
          <template slot-scope="scope">
            <span v-if="isOrEdit || additionalRecording">
              <amount-input
                v-model="scope.row.contractTotalAmount"
                @blur="computeContractPlanAmount(scope.row,scope.$index)"
              ></amount-input>
            </span>
            <span v-else>{{scope.row.contractTotalAmount}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="reservedChangeAmountIncludeTax"
          label="预留变更金额(元)（G）"
          width="150"
          disabled
        >
          <template slot-scope="scope">{{ scope.row.reservedChangeAmountIncludeTax|NumFormat}}</template>
        </el-table-column>
        <el-table-column
          prop="remainedPendingOccurenceAmount"
          label="剩余待发生金额(元)（H=E-F-G）"
          width="200"
          disabled
        >
          <template slot-scope="scope">{{ scope.row.remainedPendingOccurenceAmount|NumFormat}}</template>
        </el-table-column>
        <el-table-column prop="surplusToHappenAmount" label="剩余待发生处理" width="150" disabled>
          <template slot-scope="scope">
            <el-button
              size="mini"
              v-if="scope.row.isState && scope.row.contractSigningCpNew && scope.row.contractSigningCpNew.dealingType==='0'"
              type="text"
              @click="createNewContract(scope.$index, scope.row)"
            >生成新合约</el-button>
            <el-button
              size="mini"
              v-else-if="scope.row.isState && scope.row.contractSigningCpNew && scope.row.contractSigningCpNew.dealingType==='1'"
              type="text"
              @click="createNewContract(scope.$index, scope.row)"
            >释放{{scope.row.contractSigningCpNew.amountReleased}}</el-button>
            <el-button
              size="mini"
              v-else-if="!isPending && scope.row.contractSigningCpNew && scope.row.contractSigningCpNew.dealingType==='0'"
              type="text"
              @click="createNewContract(scope.$index, scope.row)"
            >已生成新合约</el-button>
            <el-button
              size="mini"
              v-else-if="!isPending && scope.row.contractSigningCpNew && scope.row.contractSigningCpNew.dealingType==='1'"
              type="text"
              @click="createNewContract(scope.$index, scope.row)"
            >已释放</el-button>
            <el-button
              size="mini"
              v-else-if="scope.row.isPending && scope.row.contractSigningCpNew && scope.row.contractSigningCpNew.dealingType ==='生成新合约/释放'"
              type="text"
              @click="createNewContract(scope.$index, scope.row)"
            >{{scope.row.contractSigningCpNew.dealingType}}</el-button>
          </template>
        </el-table-column>
        <el-table-column label="编辑">
          <template slot-scope="scope">
            <!-- 删除 -->
            <el-button
              size="mini"
              v-if="(isOrEdit || additionalRecording) && form.contractSource !== '1'"
              type="text"
              @click="deleteRow(scope.$index, scope.row)"
            >删除</el-button>
            <el-button
              size="mini"
              v-else
              type="text"
              @click="deleteRow(scope.$index, scope.row)"
              disabled
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div v-if="showVirtualCp">
      <div class="form-unit">虚拟合约规划</div>
      <el-row>
        <el-col>
          <el-button
            type="primary"
            size="mini"
            v-if="isOrEdit"
            style="margin-bottom:10px"
            @click="selectVirtualContractPlanning"
          >选择虚拟合约规划</el-button>
        </el-col>
      </el-row>
      <el-table
        class="spHeight"
        :data="form.virtualCpTableDataList"
        stripe
        border
        :cell-style="tableCellClassName"
        tooltip-effect="dark"
        style="width: 100%"
        size="small"
        :row-style="rowHeight"
      >
        <el-table-column :label="$l('lbl_no')" width="60" type="index"></el-table-column>

        <el-table-column prop="accountingObjectName" label="成本分期" width="500"></el-table-column>

        <el-table-column prop="name" label="合约规划名称"></el-table-column>
      </el-table>
    </div>
    <div>
      <div class="form-unit">付款事项</div>
      <el-form ref="paymentItemsForm" :model="form" label-width="150px" size="mini" :rules="rules">
        <el-row class="newAdd">
          <el-col>
            <el-button size="mini" type="primary" v-if="isOrEdit" @click="addRowPaymentDetails()">新增</el-button>
          </el-col>
        </el-row>
        <el-table
          :data="form.paymentDetails"
          stripe
          border
          tooltip-effect="dark"
          style="width: 100%"
          size="small"
          :header-cell-class-name="rowClassName"
        >
          <el-table-column fixed prop="paymentType" label="付款类型" width="150">
            <template slot-scope="scope">
              <span v-if="isOrEdit">
                <el-form-item
                  label-width="0"
                  style="margin-top: 20px"
                  :prop="'paymentDetails.' + scope.$index + '.paymentType'"
                  :rules="rules.paymentDetails.paymentType"
                >
                  <fd-select
                    type="cost_payment_type"
                    v-model="scope.row.paymentType"
                    :clearable="true"
                  ></fd-select>
                </el-form-item>
              </span>

              <span v-else>
                <fd-select
                  style="width:100%"
                  v-model="scope.row.paymentType"
                  type="cost_payment_type"
                  :disabled="!isOrEdit"
                ></fd-select>
              </span>
            </template>
          </el-table-column>
          <el-table-column fixed prop="paymentCondition" label="付款条件" width="150">
            <template slot-scope="scope">
              <!--<span v-if="!primaryIsAdd">{{scope.row.paymentCondition}}</span>-->
              <span v-if="isOrEdit">
                <el-form-item
                  label-width="0"
                  style="margin-top: 20px"
                  :prop="'paymentDetails.' + scope.$index + '.paymentCondition'"
                  :rules="rules.paymentDetails.paymentCondition"
                >
                  <el-input size="mini" v-model="scope.row.paymentCondition" maxlength="1000"></el-input>
                </el-form-item>
              </span>

              <span v-else>
                <el-input
                  size="mini"
                  v-model.trim="scope.row.paymentCondition"
                  placeholder
                  disabled
                ></el-input>
              </span>
            </template>
          </el-table-column>

          <el-table-column fixed prop="paymentRate" label="付款比例（%）">
            <template slot-scope="scope">
              <span v-if="isOrEdit">
                <el-form-item
                  label-width="0"
                  style="margin-top: 20px"
                  :prop="'paymentDetails.' + scope.$index + '.paymentRate'"
                  :rules="rules.paymentDetails.paymentRate"
                >
                  <el-input
                    size="mini"
                    v-model="scope.row.paymentRate"
                    @blur="changeEstimatedPaymentAmount(scope.$index, scope.row)"
                  ></el-input>
                  <!--<amount-input size="mini"-->
                  <!--v-model="scope.row.paymentRate" @blur="changeEstimatedPaymentAmount(scope.$index, scope.row)">-->
                  <!--</amount-input>-->
                </el-form-item>
              </span>
              <span v-else>
                <el-input size="mini" v-model.trim="scope.row.paymentRate" placeholder disabled></el-input>
              </span>
            </template>
          </el-table-column>
          <el-table-column fixed prop="estimatedPaymentAmount" label="预估付款金额(元)">
            <template slot-scope="scope">
              <!--<span v-if="!primaryIsAdd">{{scope.row.estimatedPaymentAmount}}</span>-->
              <span>
                <el-input
                  size="mini"
                  disabled
                  v-model.trim="scope.row.estimatedPaymentAmount"
                  placeholder
                ></el-input>
              </span>
            </template>
          </el-table-column>
          <el-table-column fixed prop="dateOfEstimatedPayment" label="预计付款日期">
            <!-- :formatter='this.$dateFormat("dateOfContract","yyyy-MM-dd")'-->
            <template slot-scope="scope">
              <!--<span v-if="!primaryIsAdd">{{this.$dateFormat(scope.row.dateOfEstimatedPayment,'yyyy-MM-dd')}}</span>-->
              <span>
                <el-date-picker
                  size="mini"
                  v-model="scope.row.dateOfEstimatedPayment"
                  type="date"
                  style="width:100%"
                  placeholder="选择日期"
                  format="yyyy-MM-dd"
                  :disabled="!isOrEdit"
                ></el-date-picker>
              </span>
            </template>
          </el-table-column>
          <el-table-column fixed prop="remark" label="备注">
            <template slot-scope="scope">
              <!--<span v-if="!primaryIsAdd">{{scope.row.remark}}</span>-->
              <span>
                <el-input
                  :disabled="!isOrEdit"
                  size="mini"
                  v-model.trim="scope.row.remark"
                  placeholder
                ></el-input>
              </span>
            </template>
          </el-table-column>
          <el-table-column fixed label="编辑">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                :disabled="!isOrEdit"
                @click="cancelPrimaryEditRow(scope.$index, scope.row)"
              >取消</el-button>

              <!-- 删除 -->
              <el-button
                size="mini"
                :disabled="!isOrEdit"
                type="text"
                @click="deletePrimaryRow(scope.$index, scope.row)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
    </div>
    <div>
      <div class="form-unit">合同详细内容</div>
      <el-input
        type="textarea"
        style="height:100%"
        maxlength="2048"
        v-model="form.detailContent"
        :disabled="!isOrEdit"
      ></el-input>
    </div>
    <div>
      <div class="form-unit">附件列表</div>
      <el-form label-width="150px" v-if="isOrEdit">
        <el-row>
          <el-col></el-col>
        </el-row>
        <span class="breadcrumb-child" style="float: left;margin-top: 10px">
          <i></i>上传附件:
        </span>
        <span style="float: left">
          <CostFileUpload
            style="margin-bottom: 20px"
            v-model="fileList"
            :limit="limit"
            :attachmentData="attachmentData"
            :outerId="''"
          ></CostFileUpload>
        </span>
      </el-form>
      <DesignAlterationAttachmentTable
        :queryObj_passed_in="queryModel"
        :showDeleteButton="isOrEdit"
        :attaData="attachmentData"
        v-on:changeAttachments="changeAttachments"
        ref="DesignAlterationAttachmentTable"
      ></DesignAlterationAttachmentTable>
    </div>

    <SupplierInformationDialog
      v-if="supplierInfor"
      :supplierInfor="supplierInfor"
      @closeSupplierInfor="closeSupplierInfor"
    ></SupplierInformationDialog>
    <RecordedInformationDialog
      v-if="recordedInfor"
      :recordedInfor="recordedInfor"
      :partyB="form.contractDetails.partyB"
      :partyC="form.contractDetails.partyC"
      :corporateCompanyId="form.corporateCompanyId"
      :partnerName="partnerName"
      @closeRecordedInfor="closeRecordedInfor"
    ></RecordedInformationDialog>
    <StayHappenAmountDialog
      v-if="stayHappenAmount"
      @closeStayHappenAmount="closeStayHappenAmount"
      :stayHappenAmountData="stayHappenAmountData"
      :remainedPendingOccurenceAmount="remainedPendingOccurenceAmount"
      :stayHappenAmount="stayHappenAmount"
      :remainedPending="remainedPending"
      :cpName="cpName"
      :contractSigningCpNewList="contractSigningCpNewList"
      :accountingObje="form.accountingObjectId"
    ></StayHappenAmountDialog>

    <SelectContractPlan
      v-if="dialogContractPlan"
      @closeDialogContractPlan="closeDialogContractPlan"
      :dialogContractPlan="dialogContractPlan"
      v-model="form.accountingObjectId"
      :accountingObje="form.accountingObjectId"
    ></SelectContractPlan>
    <SelectVirtualContractPlan
      v-if="dialogVirtualContractPlan"
      @closeVirtualDialogContractPlan="closeVirtualDialogContractPlan"
      :dialogVirtualContractPlan="dialogVirtualContractPlan"
      :accountingObjectId="form.accountingObjectId"
    ></SelectVirtualContractPlan>
    <ContractSelector
      :showContract="isShowContract"
      v-on:cancelDialog="cancelDialog"
      v-on:closeDialog="closeDialog"
      v-on:confirmContract="confirmContract"
      :accountingObjectId="form.accountingObjectId"
    ></ContractSelector>

    <MarketingOperatorSelector
      :showMarketing="showMarketing"
      v-on:cancelMarketingDialog="cancelMarketingDialog"
      v-on:closeMarketingDialog="closeMarketingDialog"
      v-on:confirmMarketing="confirmMarketing"
    ></MarketingOperatorSelector>
  </div>
</template>
<script>
import { NumFormat, Version } from "@/filters/cost/";
import SupplierInformationDialog from "@/views/cost/signContract/SupplierInformationDialog/";
import RecordedInformationDialog from "@/views/cost/signContract/RecordedInformationDialog/";
import StayHappenAmountDialog from "@/views/cost/signContract/StayHappenAmountDialog/";
import {
  getNewPlanName,
  saveSignInfo,
  supplierInfo,
  getContractSourceBaseInfo,
  getContractDetail,
  submitContractController,
  getContractCode,
  getCompanylist,
  saveContractPaymentItem,
  saveOrUpdateContractController,
  deleteContractController,
  getAccountingCompanylist,
  findCurrentUserOrgList,
  findContractTypeCodeList,
  validIsVirtualCp,
  getReleaseReservedAmount,
  getTargetCostContractPlan
} from "@/api/cost/signContractAPI";
import AccountSelector from "@/components/cost/AccountSelector/";
import CostFileUpload from "@/components/cost/UploadFile/";
import SelectContractPlan from "@/views/cost/signContract/SelectContractPlan/";
import SelectVirtualContractPlan from "@/views/cost/signContract/SelectVirtualContractPlan/";
import DesignAlterationAttachmentTable from "@/views/cost/designAlteration/DesignAlterationAttachmentTable";
import ProjectSelector from "@/components/cost/ProjectSelector/";
import AmountInput from "@/components/cost/AmountInput/";
import ContractSelector from "@/components/cost/ContractSelector/";
import MarketingOperatorSelector from "@/components/cost/MarketingOperatorSelector/";
import ProjectAccountSelect from "@/components/cost/ProjectAccountSelect";
import { getMeProfile } from "@/api/sys/userAPI";
export default {
  props: {
    value: {
      type: Object
    }
  },
  filters: {
    NumFormat,
    Version
  },
  data() {
    var wlAmountIncludeTax = (rule, value, callback) => {
      value = this.form.contractDetails.contractAmountIncludeTax;
      if (value === "") {
        callback(new Error("请输入签约金额"));
      } else if (value < 0) {
        callback(new Error("签约金额不能为负数！"));
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

    return {
      // 主项设计开关
      design: false,
      flag: false,
      bpmUrl: "",
      ReleaseChangeAmount: "释放预留变更金额",
      isRelax: false,
      isShow: false,
      isState: false,
      stayHappenAmountData: {},
      // 控制是否分担营销费用是否禁用
      isSharedByMarketingDisable: false,

      // 控制签约金额(含税) 是否禁用
      contractAmountIncludeTaxDisable: false,

      // 指控成本分摊金额是否禁用
      sharedAmountByCostSystemDisable: false,

      isIndex: "",
      supplierInfor: false,
      recordedInfor: false,
      partnerName: "",
      cpName: "",
      remainedPendingOccurenceAmount: "",
      remainedPending: "",
      stayHappenAmount: false,
      isShowContract: false,
      showMarketing: false,
      isOrEdit: true,
      contractTypeList: [],
      tempCpData: [],
      tempVirtualCpData: [],
      contractSourceList: [
        {
          value: "0",
          label: "成本系统编制 "
        },
        {
          value: "1",
          label: "招采 "
        },
        {
          value: "2",
          label: "费控 "
        }
      ],
      remainedPending: "",

      attachmentData: [],
      rules: {
        projectId: [
          { validator: validateProjectName, trigger: "change", required: true }
        ],
        accObjId: [
          { validator: validateAccobj, trigger: "change", required: true }
        ],
        contractName: [
          { required: true, message: "请输入合同名称", trigger: "blur" }
        ],
        corporateCompanyId: [
          { required: true, message: "请选择法人公司", trigger: "change" }
        ],
        contractType: [
          { required: true, message: "请选择合同类型", trigger: "change" }
        ],
        isPrimary: [
          { required: true, message: "请选择是否主合同", trigger: "change" }
        ],
        isMainPlan: [
          { required: true, message: "请选择是否主项设计", trigger: "change" }
        ],
        planBranch: [
          { required: true, message: "请选择设计分支", trigger: "change" }
        ],
        primaryContractNumber: [
          { required: true, message: "请选择主合同编码", trigger: "change" }
        ],
        primaryContractName: [
          { required: true, message: "请选择主合同名称", trigger: "blur" }
        ],
        isPaiedByOutputValue: [
          { required: true, message: "请选择是否按产值付款", trigger: "change" }
        ],
        isGeneral: [
          { required: true, message: "请选择是否主包", trigger: "change" }
        ],
        // projectId: [
        //   { validator: validateProjectName, trigger: "change", required: true }
        // ],
        contractAmountIncludeTax: [
          { validator: wlAmountIncludeTax, trigger: "blur", required: true }
        ],
        isSharedByMarketing: [
          {
            required: true,
            message: "请选择是否分摊营销费用",
            trigger: "change"
          }
        ],
        sharedAmountByCostSystem: [
          { required: true, message: "请输入成本分摊金额(元)", trigger: "blur" }
        ],
        tax: [{ required: true, message: "请选择税率", trigger: "change" }],
        contract_party_type: [
          { required: true, message: "请选择合同性质", trigger: "change" }
        ],
        partyA: [{ required: true, message: "甲方必填", trigger: "blur" }],
        partyBName: [
          { required: true, message: "请选择乙方", trigger: "change" }
        ],
        partyCName: [
          { required: true, message: "请选择丙方", trigger: "blur" }
        ],
        maintenanceFundRate: [
          { required: true, message: "请输入质保金比例", trigger: "blur" }
        ],
        reservedChangeAmountRate: [
          { required: true, message: "请输入预留变更比例", trigger: "blur" }
        ],
        // performanceBondAmountRate: [
        //   { required: true, message: '请输入履约保证金比例', trigger: 'blur' }
        // ],
        performanceBondAmount: [
          { required: true, message: "请输入履约保证金金额", trigger: "blur" }
        ],
        paymentRate: [
          { required: true, message: "请输入付款提示比例", trigger: "blur" }
        ],
        paymentDetails: {
          paymentType: [
            { required: true, message: "请选择付款类型", trigger: "change" }
          ],
          paymentCondition: [
            { required: true, message: "请输入付款条件", trigger: "blur" }
          ],
          paymentRate: [
            {
              pattern: /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/,
              message: "请输入正确的付款比例",
              trigger: "change"
            },
            { required: true, message: "请输入付款比例", trigger: "blur" }
          ]
        },
        marketingHandlingPersonName: [
          { required: true, message: "请选择营销经办人", trigger: "change" }
        ]
      },
      contractSigningCpNewList: {},
      costBiddingId: "",
      option: [
        { label: "建筑方案设计", value: "建筑方案设计" },
        { label: "景观设计（硬装）", value: "景观设计（硬装）" },
        { label: "景观设计（软装）", value: "景观设计（软装）" },
        { label: "室内设计（硬装）", value: "室内设计（硬装）" },
        { label: "室内设计（软装）", value: "室内设计（软装）" }
      ],
      option1: [
        {
          label: "室内扩初/施工图设计及其他室内非主项",
          value: "室内扩初/施工图设计及其他室内非主项"
        },
        {
          label:
            "其他非主项设计（优化咨询类设计、专项设计、图纸审查、勘察测绘、零星采购等）",
          value:
            "其他非主项设计（优化咨询类设计、专项设计、图纸审查、勘察测绘、零星采购等）"
        },
        { label: "建筑扩初/施工图方案", value: "建筑扩初/施工图方案" }
      ],
      option2: [
        { label: "建筑方案设计", value: "建筑方案设计" },
        { label: "景观设计（硬装）", value: "景观设计（硬装）" },
        { label: "景观设计（软装）", value: "景观设计（软装）" },
        { label: "室内设计（硬装）", value: "室内设计（硬装）" },
        { label: "室内设计（软装）", value: "室内设计（软装）" }
      ],
      form: {
        isPaiedByOutputValue: "",
        corporateCompanyId: "",
        corporateCompanyName: "",
        projectId: "",
        accountingObjectName: "",
        projectName: "",
        handlingDate: new Date(),
        handlingPerson: "",
        handlingPersonName: "",
        department: "",
        calibrationNumber: "",
        contractSource: "",
        isPrimary: "",
        // 是否主项设计：
        isMainPlan: "",
        // 设计分支：
        planBranch: "",
        primaryContractName: "",
        company: "",
        contractStatus: "",
        primaryContractCode: "",
        region: "",
        contractType: "",
        contractName: "",
        contractCode: "",
        handlingDept: "",
        handlingDeptName: "",
        accountingObjectId: "",
        detailContent: "",
        primaryContractNumber: "",
        attachments: [],
        paymentDetails: [],
        tableDataList: [],
        virtualCpTableDataList: [],
        marketingHandlingPerson: "",
        marketingHandlingPersonName: "",
        contractDetails: {
          colPerformanceBondAmount:'',    //已收取履约保证金金额
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
          reservedChangeAmountRate: "",
          isGeneral: ""
        }
      },
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

      size: 100,
      limit: 100,
      fileList: "",
      dialogContractPlan: false,
      dialogVirtualContractPlan: false,

      // 是否展示  虚拟合约规划
      showVirtualCp: false,
      // 是否点击"补录按钮"
      additionalRecording: false,
      // 是否展示合约规划
      showCp: false,

      show: {
        group: false,
        company: false,
        dept: false,
        project: true,
        accObj: true
      },
      project: {
        companyId: "",
        projectId: "",
        accObjId: ""
      },
      ischeck: false,
      corporateCompanyList: [],
      isPending: false,
      layer: "",
      isVirtualCp: ""
    };
  },
  components: {
    SupplierInformationDialog,
    RecordedInformationDialog,
    StayHappenAmountDialog,
    SelectContractPlan,
    CostFileUpload,
    AccountSelector,
    DesignAlterationAttachmentTable,
    ProjectSelector,
    AmountInput,
    ContractSelector,
    ProjectAccountSelect,
    SelectVirtualContractPlan,
    MarketingOperatorSelector
  },
  mounted() {
    // alert('111')
    this.isOrEdit = eval(this.$route.query.isOrEdit);
    if (this.isOrEdit === false) {
      this.design = true;
    }
    this.form.contractSource = this.$route.query.contractSource;
    if (this.form.contractSource === "0") {
      // 控制是否分摊营销费用  是否禁用
      this.isSharedByMarketingDisable = false;
      this.sharedAmountByCostSystemDisable = true;
    }
    this.costBiddingId = this.$route.query.costBiddingId;
    // 获取页面的基础默认设置
    if (this.$route.query.contractStatus === "0") {
      this.getPageDefaultSetting();
    }
    // console.log('contractDetails.isSharedByMarketing')
    // console.log(this.form.contractDetails.isSharedByMarketing)
    if (
      this.$route.query.contractStatus !== "0" &&
      this.$route.query.contractStatus !== "1"
    ) {
      this.isRelax = true;
    }
    // 如果是从已经有合同  查询合同详情  渲染到页面
    if (this.$route.query.contractId) {
      // alert('456456')
      this.getContractInfo();
    }
    // console.log('contractDetails.isSharedByMarketing')
    // console.log(this.form.contractDetails.isSharedByMarketing)
    // 新增合同--查找登陆人信息
    if (!this.$route.query.contractId) {
      this.getUserInfo();
    }
    // 捞取一下 本地缓存的合同类别
    this.getContractTypeList();

    if (
      this.$route.query.additionalRecording &&
      eval(this.$route.query.additionalRecording)
    ) {
      this.additionalRecording = eval(this.$route.query.additionalRecording);
      // this.showCp = true
    }
    // alert(this.form.accountingObjectId)
  },

  watch: {
    "form.primaryContractNumber": {
      handler(newValue, oldValue) {
        this.getDefaultContractCode();
      },
      deep: true
    },
    form: {
      handler(newValue, oldValue) {
        this.form.attachments = this.attachmentData;
        this.$emit("input", this.form);
      },
      deep: true
    },
    "form.accountingObjectId": {
      handler(newValue, oldValue) {
        if (oldValue !== "" && newValue !== oldValue) {
          this.form.corporateCompanyId = "";
        }
      },
      deep: true
    },
    "form.projectId": {
      handler(newValue, oldValue) {
        if (oldValue && newValue !== oldValue) {
          this.form.corporateCompanyId = "";
        }
      },
      deep: true
    },
    project: {
      handler(newValue, oldValue) {
        // alert('1111')
        this.form.projectId = this.project.projectId;
        this.form.accountingObjectId = this.project.accObjId;
        // alert(this.form.accountingObjectId)
        if (this.project.accObjId) {
          // alert('55555')
          // this.form.accountingObjectId = this.project.accObjId
          this.getDefaultContractCode();
          // this.wangSearch();
          // this.validIsVirtualCp()
          this.validShowCpAndshowVirtualCp();
        }
        // 初始化 法人公司
        this.initCompanylist();
      },
      deep: true
    },

    // 合同类型
    "form.contractType": {
      handler(newValue, oldValue) {
        // console.log(newValue)
        // console.log(oldValue)
        if (newValue == "3") {
          this.design = true;
        } else {
          this.design = false;
        }
        if (newValue !== oldValue) {
          this.getDefaultContractCode();
          // this.wangSearch();
          this.validShowCpAndshowVirtualCp();
        }
      }
    },
    // 是否主合同
    // "form.isPrimary":{
    //   handler(newValue, oldValue) {
    //     // console.log(newValue)
    //     // console.log(oldValue)
    //     if(newValue == "0" || this.form.contractType == "3"){
    //       this.design = false
    //     }
    //   }
    // },
    // 是否主项设计
    // "form.isMainPlan":{
    //   handler(newValue, oldValue) {
    //     // console.log(newValue)
    //     // console.log(oldValue)
    //     if(newValue === "否"){
    //       this.form.planBranch = ""
    //       this.option = this.option1
    //     }else{
    //       // this.form.planBranch = ""
    //       this.option = this.option2
    //     }
    //   }
    // },
    // 税率
    "form.contractDetails.tax": function(value) {
      if (
        this.form.contractDetails.tax &&
        !isNaN(this.form.contractDetails.tax) &&
        !isNaN(this.form.contractDetails.contractAmountIncludeTax)
      ) {
        // 签约金额不含税
        let number = (
          Number(this.form.contractDetails.contractAmountIncludeTax) /
          (1 + Number(this.form.contractDetails.tax))
        ).toFixed(2);

        this.form.contractDetails.contractAmountExcludeTax = number;

        this.form.contractDetails.taxAmount = (
          Number(this.form.contractDetails.contractAmountIncludeTax) - number
        ).toFixed(2);
      }
    },
    // 签约金额（含税）
    "form.contractDetails.contractAmountIncludeTax": function(value, old) {
      // console.log(value)
      // console.log(old)
      // if(old!=value){
      //   this.
      // }
      if (!value || isNaN(value) || this.form.isPrimary === "0") {
        return;
      }
      let contractAmountIncludeTax = Number(value);
      // 税率有值
      if (
        this.form.contractDetails.tax &&
        !isNaN(this.form.contractDetails.tax) &&
        !isNaN(contractAmountIncludeTax)
      ) {
        // 签约金额不含税
        let number = (
          contractAmountIncludeTax /
          (1 + Number(this.form.contractDetails.tax))
        ).toFixed(2);

        this.form.contractDetails.contractAmountExcludeTax = number;

        this.form.contractDetails.taxAmount = (
          contractAmountIncludeTax - number
        ).toFixed(2);
      }

      // 保修金比例
      let maintenanceFundRate = this.form.contractDetails.maintenanceFundRate;

      if (maintenanceFundRate && !isNaN(maintenanceFundRate)) {
        this.form.contractDetails.maintenanceFund =
          (contractAmountIncludeTax * Number(maintenanceFundRate)) / 100;
      }
      // 预留变更比例
      let reservedChangeAmountRate = this.form.contractDetails
        .reservedChangeAmountRate;
      if (reservedChangeAmountRate && !isNaN(reservedChangeAmountRate)) {
        this.form.contractDetails.reservedChangeAmount =
          (contractAmountIncludeTax * Number(reservedChangeAmountRate)) / 100;
      }

      // 履约保证金金额
      let performanceBondAmount = this.form.contractDetails
        .performanceBondAmount;
      if (
        performanceBondAmount &&
        !isNaN(performanceBondAmount) &&
        !isNaN(value)
      ) {
        this.form.contractDetails.performanceBondAmountRate =
          (Number(performanceBondAmount) / Number(value)) * 100;
      }
    },
    // 质保金比例
    "form.contractDetails.maintenanceFundRate": function(val) {
      if (this.form.isPrimary === "1") {
        let contractAmountIncludeTax = this.form.contractDetails
          .contractAmountIncludeTax;
        if (
          contractAmountIncludeTax &&
          !isNaN(contractAmountIncludeTax) &&
          !isNaN(val)
        ) {
          this.form.contractDetails.maintenanceFund =
            (Number(contractAmountIncludeTax) * Number(val)) / 100;
        }
      }
    },

    // 预留变更比例
    "form.contractDetails.reservedChangeAmountRate": function(val) {
      if (this.form.isPrimary === "1") {
        let contractAmountIncludeTax = this.form.contractDetails
          .contractAmountIncludeTax;
        if (
          contractAmountIncludeTax &&
          !isNaN(contractAmountIncludeTax) &&
          !isNaN(val)
        ) {
          this.form.contractDetails.reservedChangeAmount =
            (Number(this.form.contractDetails.contractAmountIncludeTax) *
              Number(val)) /
            100;
        }
      }
    },
    // 履约保证金金额
    "form.contractDetails.performanceBondAmount": function(val) {
      if (this.form.isPrimary === "1") {
        let contractAmountIncludeTax = this.form.contractDetails
          .contractAmountIncludeTax;
        if (
          contractAmountIncludeTax &&
          !isNaN(contractAmountIncludeTax) &&
          !isNaN(val)
        ) {
          this.form.contractDetails.performanceBondAmountRate =
            (Number(this.form.contractDetails.performanceBondAmount) /
              Number(contractAmountIncludeTax)) *
            100;
        }
      }
    },

    // 是否分担营销费用
    "form.contractDetails.isSharedByMarketing": function(val) {
      if (this.form.contractDetails.isSharedByMarketing === "1") {
        // 费控已经传过来了  成本分担金额  强控  不能修改
        if (this.form.contractSource === "2") {
          this.sharedAmountByCostSystemDisable = true;
        } else {
          this.sharedAmountByCostSystemDisable = false;
        }
      } else {
        this.sharedAmountByCostSystemDisable = true;
        this.form.contractDetails.sharedAmountByCostSystem = "";
      }
    }
  },
  methods: {
    // wangSearch() {
    //   console.log(this.form.accountingObjectId);
    //   getTargetCostContractPlan({
    //     accountingObjectId: this.form.accountingObjectId
    //   })
    //     .then(response => {
    //       console.log("合约规划数据");
    //       console.log(response);
    //       console.log(response.data);
    //       if (response.data.length == 0) {
    //         // alert('6666')
    //         this.showCp = false;
    //         this.showVirtualCp = true;
    //       } else {
    //         this.showCp = true;
    //         this.showVirtualCp = false;
    //       }
    //     })
    //     .catch(error => {
    //       console.log(error);
    //     });
    // },
    changeIsMainPlan() {
      this.form.planBranch = "";
      if (this.form.isMainPlan === "否") {
        this.option = this.option1;
      } else {
        this.option = this.option2;
      }
    },
    getReservedChangeAmountState() {
      getReleaseReservedAmount({ id: this.$route.query.contractId })
        .then(response => {
          if (response.code === "2000") {
            this.$showSuccess(response.data);
            // this.ReleaseChangeAmount =
            this.form.contractDetails.reservedChangeAmountState = "1";
          } else {
            this.$showError(response.data);
          }
        })
        .catch(error => {
          console.log(error);
          this.$showError(error.message ? error.message : "msg_system_error");
        });
    },
    getContractTypeList() {
      // 本地拉一下合同类型
      let list = this.$getDictionaryListByType("cost_contract_type");
      this.contractTypeList = list;

      if (
        this.$route.query.contractStatus === "0" ||
        this.$route.query.contractStatus === "6"
      ) {
        findContractTypeCodeList()
          .then(response => {
            let permissionContractTypeCodes = response.data;
            if (
              permissionContractTypeCodes == null ||
              permissionContractTypeCodes.length <= 0
            ) {
              this.contractTypeList = [];
              return;
            }
            let permissionContractTypeList = [];
            list.forEach((v, k) => {
              permissionContractTypeCodes.forEach((v1, k1) => {
                if (v.dictValue === v1) {
                  permissionContractTypeList.push(v);
                }
              });
            });
            this.contractTypeList = permissionContractTypeList;
          })
          .catch(error => {
            console.log(error);
            this.$showError(error.message ? error.message : "msg_system_error");
          });
      }
    },

    rowClassName({ row, column, rowIndex, columnIndex }) {
      if (columnIndex >= 0 && columnIndex <= 2) {
        return "cost-table-header-required";
      }
    },

    // 筛选供应商数据
    checkSupplier(val) {
      this.supplierInfor = true;
      if (val === "1") {
        this.layer = "1";
      } else if (val === "2") {
        this.layer = "2";
      }
    },
    closeSupplierInfor(row) {
      if (row && this.layer === "1") {
        this.form.contractDetails.partyB = row.providerCode;
        this.form.contractDetails.partyBName = row.providerName;
      } else if (row && this.layer === "2") {
        this.form.contractDetails.partyC = row.providerCode;
        this.form.contractDetails.partyCName = row.providerName;
      }
      this.supplierInfor = false;
    },
    createNewContract(index, row) {
      // this.isState = true
      // console.log(row);
      // getNewPlanName({ contractPlanName: row.cpName })
      //   .then(response => {
      //     // console.log(response)
      //     if (response.code === "2000") {
      //       // this.$showSuccess(response.data);
      //       this.cpName = response.data;
      //     } else {
      //       this.$showError(response.data);
      //     }
      //   })
      //   .catch(error => {
      //     // console.log(error);
      //     this.$showError(error.message ? error.message : "msg_system_error");
      //   });
      // return;
      this.stayHappenAmount = true;
      this.cpName = row.cpName;
      this.isIndex = index;
      this.contractSigningCpNewList = row.contractSigningCpNew;
      this.remainedPendingOccurenceAmount = row.remainedPendingOccurenceAmount;
      this.remainedPending = row.contractSigningCpNew.remainedPending;
      this.stayHappenAmountData = row;
    },
    closeStayHappenAmount(val) {
      this.stayHappenAmount = false;
      if (val && val.dealingType === "生成新合约") {
        val.dealingType = "0";
        this.remainedPendingOccurenceAmount =
          val.remainedPendingOccurenceAmount;
      } else if (val && val.dealingType === "释放") {
        val.dealingType = "1";
        this.remainedPendingOccurenceAmount =
          val.remainedPendingOccurenceAmount;
      }
      if (val) {
        let newData = [];
        newData = this.form.tableDataList;
        for (let i = 0; i < newData.length; i++) {
          if (i === Number(this.isIndex)) {
            newData[i].contractSigningCpNew.cpAmount = val.cpAmount;
            newData[i].contractSigningCpNew.newCpName = val.newCpName;

            newData[i].contractSigningCpNew.dealingType = val.dealingType;
            newData[i].isState = true;
            if (newData[i].contractSigningCpNew.dealingType === "0") {
              // newData[i].amoutReleased = Number(val.remainedPendingOccurenceAmount) - Number(val.cpAmount)
              newData[i].contractSigningCpNew.amountReleased = (
                Number(val.remainedPendingOccurenceAmount) -
                Number(val.cpAmount)
              ).toFixed(2);
            } else {
              newData[i].contractSigningCpNew.amountReleased =
                val.remainedPending;
            }
            // newData[i].remainedPending = newData[i].remainedPendingOccurenceAmount

            // this.remainedPending = newData[i].remainedPendingOccurenceAmount

            newData[i].remainedPendingOccurenceAmount = "0";
          }
        }
        this.$set(this.form.tableDataList, this.isIndex, newData[this.isIndex]);
      }

      // console.log(this.form.tableDataList)
    },
    checkRecord(partnerName) {
      this.recordedInfor = true;
      this.partnerName = partnerName;
    },
    closeRecordedInfor() {
      this.recordedInfor = false;
    },
    changeValue() {
      this.form.tableDataList = this.form.tableDataList
        ? this.form.tableDataList
        : [];
      console.log(this.form.tableDataList)
      if (this.form.tableDataList.length > 0) {
        this.form.tableDataList.forEach((item, index) => {
          item.reservedChangeAmountIncludeTax =
            (Number(item.contractTotalAmount) *
              Number(this.form.contractDetails.reservedChangeAmountRate)) /
            100;
          item.reservedChangeAmountIncludeTax = Number(
            item.reservedChangeAmountIncludeTax
          ).toFixed(2);
          let reservedAmount = (
            Number(item.amountPendingOccurence) -
            Number(item.contractTotalAmount) -
            Number(item.reservedChangeAmountIncludeTax)
          ).toFixed(2);
          item.remainedPendingOccurenceAmount = reservedAmount;
          if (Number(item.remainedPendingOccurenceAmount) > 0) {
            item.contractSigningCpNew.dealingType = "生成新合约/释放";
            item.isPending = true;
          } else {
            item.contractSigningCpNew.dealingType = "";
            item.remainedPendingOccurenceAmount = 0;
          }
          this.remainedPendingOccurenceAmount =
            item.remainedPendingOccurenceAmount;
          this.$set(this.form.tableDataList, index, item);
        });
      }
    },
    computeContractPlanAmount(rowData, index) {
      rowData.contractSigningCpNew = {};
      
      if (this.form.contractDetails.reservedChangeAmountRate) {
        rowData.reservedChangeAmountIncludeTax =
          (Number(rowData.contractTotalAmount) *
            Number(this.form.contractDetails.reservedChangeAmountRate)) /
          100;
        rowData.reservedChangeAmountIncludeTax = Number(
          rowData.reservedChangeAmountIncludeTax
        ).toFixed(2);
      } else {
        rowData.reservedChangeAmountIncludeTax = (
          Number(rowData.contractTotalAmount) * Number(0)
        ).toFixed(2);
      }

      let reservedAmount = (
        Number(rowData.amountPendingOccurence) -
        Number(rowData.contractTotalAmount) -
        Number(rowData.reservedChangeAmountIncludeTax)
      ).toFixed(2);
      rowData.remainedPendingOccurenceAmount = reservedAmount;
      if (Number(rowData.remainedPendingOccurenceAmount) > 0) {
        rowData.contractSigningCpNew.dealingType = "生成新合约/释放";
        rowData.isPending = true;
      } else {
        rowData.contractSigningCpNew.dealingType = "";
        rowData.remainedPendingOccurenceAmount = 0;
      }
      this.remainedPendingOccurenceAmount =
        rowData.remainedPendingOccurenceAmount;

      this.$set(this.form.tableDataList, index, rowData);
      // console.log(this.form.tableDataList)
    },

    // 计算预估付款金额
    calcEstimatedPaymentAmount(res) {
      this.form.paymentDetails.forEach(e => {
        this.changeEstimatedPaymentAmount("", e);
      });
    },
    // 预付款金额
    changeEstimatedPaymentAmount(index, rowData) {
      if (isNaN(rowData.paymentRate)) {
        rowData.estimatedPaymentAmount = "";
        return;
      }
      // 付款比例/100 保留四位小数
      let paymentRate = (Number(rowData.paymentRate) / 100).toFixed(4);
      let estimatedPaymentAmount;
      if (this.form.contractDetails.isSharedByMarketing === "1") {
        estimatedPaymentAmount = Number(
          Number(this.form.contractDetails.sharedAmountByCostSystem) *
            paymentRate
        ).toFixed(2);
      } else {
        estimatedPaymentAmount = Number(
          Number(this.form.contractDetails.contractAmountIncludeTax) *
            paymentRate
        ).toFixed(2);
      }
      rowData.estimatedPaymentAmount = estimatedPaymentAmount;
    },
    // 获取合同
    getContractInfo() {
      getContractDetail({ contractId: this.$route.query.contractId })
        .then(response => {
          console.log("response");
          console.log(response);
          this.initCommonInfoData(response);
        })
        .catch(error => {
          console.log(error);
          this.$showError(error.message ? error.message : "msg_system_error");
        });
    },

    // 获取合同来源基础信息
    getPageDefaultSetting() {
      getContractSourceBaseInfo({
        contractSource: this.form.contractSource,
        costBiddingId: this.$route.query.costBiddingId,
        costControlId: this.$route.query.costControlId
      })
        .then(response => {
          // console.log('getPageDefaultSetting')
          // console.log(response)
          // 招标方式
          this.form.contractDetails.biddingWay = response.data.biddingWay;
          // alert(this.form.contractDetails.biddingWay)
          // 是否主合同
          this.form.isPrimary = response.data.isPrimary;
          // 拆分状态
          this.form.contractDetails.splitStatus = response.data.splitStatus;
          // 合同来自成本编制系统
          if (this.form.contractSource === "0") {
            console.log("合同来自成本编制系统");
            // this.form.contractDetails.isSharedByMarketing =
            //   response.data.isSharedByMarketing;
          }
          // 合同来自招采合同
          if (this.form.contractSource === "1") {
            console.log("合同来自招采合同");
            // this.form.contractDetails.isSharedByMarketing =
            //   response.data.isSharedByMarketing;
            // console.log(this.form.contractDetails.isSharedByMarketing)
            this.project.projectId = response.data.projectId;
            this.project.accObjId = response.data.accountingObjectId;
            this.form.contractDetails.partyBName = response.data.partyBName;
            this.form.contractDetails.partyB = response.data.partyB;
            this.form.tableDataList = response.data.dynaCostCPModelList;
            console.log(this.form.tableDataList);
            // 王先生 初始化合同录入 合约规划数据处理及状态修改
            this.form.tableDataList.forEach((item,index) => {
              item.isPending = false
              // console.log(index)
              if (item.reservedChangeAmountIncludeTax == null) {
                item.reservedChangeAmountIncludeTax = 0;
              }
              if (item.contractTotalAmount >= item.cpTotalAmount) {
                item.remainedPendingOccurenceAmount = 0;
              } else {
                item.remainedPendingOccurenceAmount =
                  Number(item.cpTotalAmount) -
                  Number(item.contractTotalAmount) -
                  Number(item.reservedChangeAmountIncludeTax);
                item.remainedPendingOccurenceAmount = Number(
                  item.remainedPendingOccurenceAmount
                ).toFixed(2);
                item.contractSigningCpNew = {};
                item.contractSigningCpNew.dealingType = "生成新合约/释放";
                item.isPending = true;
                // console.log(item.remainedPendingOccurenceAmount);
              }
              // console.log(item);
            });
          }
          // 合同来自费控费控
          if (this.form.contractSource === "2") {
            console.log("合同来自费控费控");
            this.project.projectId = response.data.projectId;
            this.form.contractDetails.contractAmountIncludeTax =
              response.data.contractAmountIncludeTax + "";
            this.contractAmountIncludeTaxDisable = true;
            // this.form.contractDetails.isSharedByMarketing = "1";
            this.isSharedByMarketingDisable = true;
            this.sharedAmountByCostSystemDisable = true;
            this.form.contractDetails.sharedAmountByCostSystem =
              response.data.sharedAmountByCostSystem;
            this.form.contractName = response.data.contractName;
            this.form.contractDetails.partyBName = response.data.partyBName;
            this.form.contractDetails.partyB = response.data.partyB;
          }
        })
        .catch(error => {
          console.log(error);
          this.$showError(error.message ? error.message : "msg_system_error");
        });
    },

    // 初始化法人公司
    initCompanylist() {
      let $this = this;
      // 获取法人公司
      if ($this.form.accountingObjectId) {
        getAccountingCompanylist({
          accountingObjectId: $this.form.accountingObjectId
        })
          .then(response => {
            $this.corporateCompanyList = response.data ? response.data : "";
            // console.log('$this.corporateCompanyList')
            // console.log($this.corporateCompanyList)
          })
          .catch(error => {
            console.log(error);
            $this.$showError(
              error.message ? error.message : "msg_system_error"
            );
          });
      } else if ($this.form.projectId) {
        getCompanylist({ projectId: $this.form.projectId })
          .then(response => {
            $this.corporateCompanyList = response.data ? response.data : "";
          })
          .catch(error => {
            console.log(error);
            $this.$showError(
              error.message ? error.message : "msg_system_error"
            );
          });
      } else {
        $this.corporateCompanyList = [];
        $this.form.corporateCompanyId = "";
      }
    },

    // 初始化基本信息
    initCommonInfoData(response) {
      // alert('444444')
      // console.log('initCommonInfoData(response)')
      // console.log(response)
      let _this = this;
      if (!response.data) {
        this.$showNormalError("没有可用数据");
        return;
      }
      this.bpmUrl = response.data.bpmUrl;
      this.isVirtualCp = response.data.isVirtualCp;
      this.signInfo = response.data;
      this.project.accObjId = response.data.accountingObjectId;
      this.project.projectId = response.data.projectId;
      this.form.projectName = response.data.projectName;
      this.form.accountingObjectName = response.data.accountingObjectName;
      this.form.projectId = response.data.projectId;
      this.form.accountingObjectId = response.data.accountingObjectId;
      this.form.corporateCompanyId = response.data.corporateCompanyId;
      this.form.corporateCompanyCode = response.data.corporateCompanyCode;
      this.form.contractCode = response.data.contractCode;
      this.form.contractType = response.data.contractType;
      this.attachmentData = response.data.attachments;
      this.form.contractName = response.data.contractName;
      this.form.isPrimary = response.data.isPrimary;
      (this.form.isMainPlan = response.data.isMainPlan),
        (this.form.planBranch = response.data.planBranch),
        (this.form.primaryContractCode = response.data.primaryContractCode);
      this.form.primaryContractNumber = response.data.primaryContractCode;
      this.form.primaryContractName = response.data.primaryContractName;
      this.form.isPaiedByOutputValue = response.data.isPaiedByOutputValue;
      this.form.contractSource = response.data.contractSource;
      this.form.handlingDept = response.data.handlingDept;
      this.form.handlingDeptName = response.data.handlingDeptName;
      this.form.handlingPerson = response.data.handlingPerson;
      this.form.handlingPersonName = response.data.handlingPersonName;
      this.form.dateOfContract = response.data.dateOfContract;
      // this.form.contractDetails.isSharedByMarketing =
      //   response.data.isSharedByMarketing;
      this.form.contractDetails.contractAmountIncludeTax =
        response.data.contractAmountIncludeTax;
       this.form.contractDetails.colPerformanceBondAmount =  response.data.colPerformanceBondAmount
      this.form.contractDetails.sharedAmountByCostSystem =
        response.data.sharedAmountByCostSystem;
      // this.form.contractDetails.isSharedByMarketing =
      //   response.data.isSharedByMarketing;
      this.form.contractDetails.contractAmountExcludeTax =
        response.data.contractAmountExcludeTax;
      this.form.contractDetails.tax = response.data.tax;
      this.form.contractDetails.taxAmount = response.data.taxAmount;
      this.form.contractDetails.costNature = response.data.costNature;
      this.form.contractDetails.biddingWay = response.data.biddingWay;
      this.form.contractDetails.contract_party_type =
        response.data.contract_party_type;
      this.form.contractDetails.partyA = response.data.partyA;
      this.form.contractDetails.partyB = response.data.partyB;
      this.form.contractDetails.partyBName = response.data.partyBName;
      this.form.contractDetails.partyC = response.data.partyC;
      this.form.contractDetails.partyCName = response.data.partyCName;
      this.form.contractDetails.maintenanceFundRate =
        response.data.maintenanceFundRate;
      this.form.contractDetails.reservedChangeAmountRate =
        response.data.reservedChangeAmountRate;
      this.form.contractDetails.performanceBondAmountRate =
        response.data.performanceBondAmountRate;
      this.form.contractDetails.performanceBondAmount =
        response.data.performanceBondAmount;
      this.form.contractDetails.paymentRate = response.data.paymentRate;
      this.form.contractDetails.splitStatus = response.data.splitStatus;
      this.form.contractDetails.maintenanceFund = response.data.maintenanceFund;
      this.form.contractDetails.reservedChangeAmount =
        response.data.reservedChangeAmount;
      this.form.contractStatus = response.data.contractStatus;
      this.form.contractDetails.reservedChangeAmountState =
        response.data.reservedChangeAmountState;
      this.form.detailContent = response.data.detailContent;
      this.form.paymentDetails = response.data.contractPaymentItemModels;
      this.form.marketingHandlingPersonName =
        response.data.marketingHandlingPersonName;
      this.form.marketingHandlingPerson = response.data.marketingHandlingPerson;
      this.costBiddingId = response.data.costBiddingId;
      this.form.contractDetails.isGeneral = response.data.isGeneral;
      getCompanylist({ projectId: this.form.projectId }).then(response => {
        var list = response.data ? response.data : "";
        if (list instanceof Array) {
          for (let i = 0; i < list.length; i++) {
            if (this.form.corporateCompanyId === list[i].id) {
              this.form.corporateCompanyName = list[i].name;
            }
          }
        }
      });
      if (this.bpmUrl != "") {
        this.flag = true;
      } else {
        this.flag = false;
      }
      this.form.tableDataList = response.data.dynaCostCPModelList;
      this.form.tableDataList = this.form.tableDataList
        ? this.form.tableDataList
        : [];
      if (this.form.tableDataList.length > 0) {
        this.form.tableDataList.forEach((item, index) => {
          item.reservedChangeAmountIncludeTax =
            (Number(item.contractTotalAmount) *
              Number(this.form.contractDetails.reservedChangeAmountRate)) /
            100;
          item.reservedChangeAmountIncludeTax = Number(
            item.reservedChangeAmountIncludeTax
          ).toFixed(2);

          item.remainedPendingOccurenceAmount = 0;

          // let reservedAmount = (Number(item.amountPendingOccurence) - Number(item.contractTotalAmount) - Number(item.reservedChangeAmountIncludeTax)).toFixed(2)
          // item.remainedPendingOccurenceAmount = reservedAmount

          this.$set(this.form.tableDataList, index, item);
        });
      }
      let virtualCps = response.data.contractVirtualCps;
      if (virtualCps.length > 0) {
        for (var i = 0; i < virtualCps.length; i++) {
          var ele = virtualCps[i];
          var obj = {};
          obj.cpId = ele.cpId;
          obj.name = ele.cpName;
          obj.accountingObjectName = ele.accountingObjName;
          this.form.virtualCpTableDataList.push(obj);
        }
        this.showVirtualCp = true;
      }
    },
    tableCellClassName({ row, column, rowIndex, columnIndex }) {
      if (
        columnIndex === 7 ||
        columnIndex === 9 ||
        columnIndex === 6 ||
        columnIndex === 5 ||
        columnIndex === 4 ||
        columnIndex === 10 ||
        columnIndex === 11 ||
        columnIndex === 12
      ) {
        return "background:#ccc";
      } else {
        return "";
      }
    },
    rowHeight({ row, column, rowIndex, columnIndex }) {
      return "height:50px";
    },
    changeAttachments(data) {
      this.form.attachments = data;
      this.attachmentData = data;
    },
    selectCorporateCompany(event) {
      console.log("event");
      console.log(event);
      this.corporateCompanyList.forEach(item => {
        console.log(item);
      });

      for (let i = 0; i < this.corporateCompanyList.length; i++) {
        if (event === this.corporateCompanyList[i].id) {
          this.form.corporateCompanyCode = this.corporateCompanyList[i].code;
        }
        if (this.form.corporateCompanyId === this.corporateCompanyList[i].id) {
          this.form.contractDetails.partyA = this.corporateCompanyList[i].name;
          this.form.corporateCompanyName = this.corporateCompanyList[i].name;
        }
      }
      // console.log('this.form.corporateCompanyCode')
      // console.log(this.form.corporateCompanyCode)
    },
    // 合同金额的删除
    deleteRow(index, rowData) {
      this.form.tableDataList.splice(index, 1);
    },
    addRowPaymentDetails() {
      if (!this.form.paymentDetails) {
        this.form.paymentDetails = [];
      }
      this.form.paymentDetails.push(this.getPaymentDetailDefaultData());
    },
    // 获取默认值
    getPaymentDetailDefaultData() {
      return {
        contractId: "",
        paymentType: "",
        paymentCondition: "",
        paymentRate: "",
        estimatedPaymentAmount: "",
        remark: ""
      };
    },
    cancelPrimaryEditRow(index, rowData) {
      this.form.paymentDetails.splice(index, 1);
    },
    // 选择主合同Start
    handleSelectContract() {
      let accountingObjectId = this.form.accountingObjectId;
      // 必须选择核算对象
      if (
        typeof accountingObjectId !== "undefined" &&
        accountingObjectId != null &&
        accountingObjectId != ""
      ) {
        this.isShowContract = true;
      }
    },
    cancelDialog(data) {
      this.isShowContract = data;
    },
    closeDialog(data) {
      this.isShowContract = data;
    },
    confirmContract(data) {
      // alert('1111')
      console.log(data);
      this.form.primaryContractNumber = data.contractCode;
      this.form.primaryContractName = data.contractName;
      this.form.corporateCompanyId = data.corporateCompanyId;
      this.form.contractType = data.contractType;
      this.form.isPaiedByOutputValue = data.isPaiedByOutputValue;
      this.form.contractDetails.costNature = data.costNature;
      this.form.contractDetails.partyA = data.partyA;
      this.form.contractDetails.partyB = data.partyB;
      this.form.contractDetails.partyBName = data.partyBName;
      this.form.contractDetails.partyC = data.partyC;
      this.form.contractDetails.partyCName = data.partyCName;
      this.form.isPaiedByOutputValue = data.isPaiedByOutputValue;
      this.form.contractDetails.maintenanceFundRate = "0.00";
      this.form.contractDetails.reservedChangeAmountRate = "0.00";
      this.form.contractDetails.performanceBondAmountRate = "0.00";
      this.form.contractDetails.contract_party_type = data.contract_party_type;
      this.form.contractDetails.paymentRate = "0.00";
      this.form.contractDetails.performanceBondAmount = "0.00";
      this.form.contractDetails.maintenanceFund = "0.00";
      this.form.contractDetails.reservedChangeAmount = "0.00";
      this.form.contractDetails.isGeneral = data.isGeneral;
    },
    // 选择主合同End

    // 改变主合同
    changeIsPrimary() {
      if (this.form.isPrimary === "1") {
        this.form.primaryContractNumber = "";
      }
      if (this.form.isPrimary === "1" && this.form.contractType === "3") {
        this.design = true;
      } else {
        this.design = false;
      }
      this.getDefaultContractCode();
    },

    // 默认获取合同编码
    getDefaultContractCode() {
      let _queryObj = {
        accountingObjectId: this.form.accountingObjectId,
        contractType: this.form.contractType,
        isPrimary: this.form.isPrimary,
        contractCode: this.form.contractCode
      };
      if (this.form.isPrimary === "0") {
        _queryObj.primaryContractCode = this.form.primaryContractNumber;
      }

      // 默认获取合同编码
      if (
        !_queryObj.accountingObjectId ||
        !_queryObj.contractType ||
        _queryObj.contractType == null ||
        _queryObj.isPrimary == null ||
        !_queryObj.isPrimary
      ) {
        return;
      } else if (_queryObj.isPrimary === "0") {
        if (!_queryObj.primaryContractCode) {
          return;
        }
      }

      getContractCode(_queryObj)
        .then(response => {
          this.form.contractCode = response.data ? response.data : "";
        })
        .catch(error => {
          console.log(error);
          this.$showError(error.message ? error.message : "msg_system_error");
        });
    },
    deletePrimaryRow(index, rowData) {
      this.form.paymentDetails.splice(index, 1);
    },
    selectContractPlanning() {
      if (!this.project.accObjId) {
        return this.$showNormalError("请先选择成本分期");
      }

      this.dialogContractPlan = true;
    },
    /*
       虚拟合约规划开始
      */

    // 验证是否展示合约规划 和 虚拟合约规划
    validShowCpAndshowVirtualCp() {
      // 补录
      if (this.additionalRecording) {
        this.showCp = true;
        this.showVirtualCp = true;
        return;
      }

      // 合同状态
      let contractType = this.form.contractType;

      // 合同在可编辑状态下
      if (this.isOrEdit) {
        // debugger
        // 选择税筹类合同  不需要关联合约规划和虚拟合约规划
        if (contractType === "6") {
          this.showCp = false;
          this.showVirtualCp = false;
          // 有合约规划
          if (this.form.tableDataList && this.form.tableDataList.length > 0) {
            this.tempCpData = this.form.tableDataList;
            this.form.tableDataList = [];
          }

          // 有虚拟合约规划
          if (
            this.form.virtualCpTableDataList &&
            this.form.virtualCpTableDataList.length > 0
          ) {
            this.tempVirtualCpData = this.form.virtualCpTableDataList;
            this.form.virtualCpTableDataList = [];
          }
        } else {
          // 切换回其他合同类型
          // 必须选择成本分期
          if (!this.project.accObjId) {
            return;
          }
          if (this.tempCpData.length > 0) {
            this.form.tableDataList = this.tempCpData;
          }
          if (this.tempVirtualCpData.length > 0) {
            this.form.virtualCpTableDataList = this.tempVirtualCpData;
          }

          // 合同已经对照虚拟合约规划  提交了真实得合约规划  ---> 不展示虚拟合约规划
          if (this.isVirtualCp && this.isVirtualCp !== "1") {
            this.showVirtualCp = false;
            this.showCp = true;
          } else {
            // 验证 是否需要关联虚拟合约规划
            validIsVirtualCp({ accountingObjectId: this.project.accObjId })
              .then(response => {
                if (response.data === "1") {
                  this.showVirtualCp = true;
                  this.showCp = false;
                } else {
                  this.showVirtualCp = false;
                  this.showCp = true;
                }
              })
              .catch(error => {
                console.log(error);
                this.$showError(
                  error.message ? error.message : "msg_system_error"
                );
              });
          }
        }
      } else {
        // 在页面无法编辑得情况下
        if (this.form.contractType === "6") {
          this.showVirtualCp = false;
          this.showCp = false;
        } else {
          if (this.isVirtualCp === "1") {
            this.showVirtualCp = true;
            this.showCp = false;
          } else {
            this.showVirtualCp = false;
            this.showCp = true;
          }
        }
      }
    },

    // 选择虚拟合约规划
    selectVirtualContractPlanning() {
      if (!this.project.accObjId) {
        return;
      }
      this.dialogVirtualContractPlan = true;
    },

    // 关闭虚拟合约规划窗口
    closeVirtualDialogContractPlan(val) {
      this.dialogVirtualContractPlan = false;
      if (!val || val.length == 0) {
        return;
      }
      this.form.virtualCpTableDataList = val;
    },
    /*
        虚拟合约规划结束
       */

    /*
        营销经办人==>START
       */
    confirmMarketing(data) {
      this.form.marketingHandlingPerson = data.personCode;
      this.form.marketingHandlingPersonName = data.personName;
    },

    cancelMarketingDialog(data) {
      this.showMarketing = data;
    },

    closeMarketingDialog(data) {
      this.showMarketing = data;
    },

    handleSelectMarketing() {
      this.showMarketing = true;
    },
    /*
        营销经办人==>END
       */

    closeDialogContractPlan(val) {
      let newData = [];
      if (val && val.length === 1 && this.form.tableDataList.length === 0) {
        this.form.tableDataList = this.form.tableDataList.concat(val);
        if (this.form.contractDetails.contractAmountIncludeTax) {
          this.form.tableDataList[0].contractTotalAmount = this.form.contractDetails.contractAmountIncludeTax;
        } else if (this.form.contractDetails.sharedAmountByCostSystem) {
          this.form.tableDataList[0].contractTotalAmount = this.form.contractDetails.sharedAmountByCostSystem;
        }
        this.computeContractPlanAmount(this.form.tableDataList[0], 0);
      } else if (val) {
        this.form.tableDataList = this.form.tableDataList
          ? this.form.tableDataList
          : [];
        val.map(item => {
          let _pItem = this.form.tableDataList.find(
            pItem => JSON.stringify(pItem.cpId) === JSON.stringify(item.cpId)
          );
          if (!_pItem) this.form.tableDataList.push(item);
        });
      }

      this.dialogContractPlan = false;
    },
    submitForm() {
      let flag = true;
      // 验证合同基本信息表单
      this.$refs["contractBaseInfoForm"].validate(valid => {
        if (!valid) {
          flag = false;
        }
      });

      // 验证合同详情内容表单
      this.$refs["form"].validate(valid => {
        if (!valid) {
          flag = false;
        }
      });

      // 验证付款事项表单
      this.$refs["paymentItemsForm"].validate(valid => {
        if (!valid) {
          flag = false;
        }
      });
      return flag;
    },
    getUserInfo() {
      this.form.handlingPerson = this.$getUserInfo()["username"];
      this.form.handlingPersonName = this.$getUserInfo()["nickName"];

      findCurrentUserOrgList()
        .then(response => {
          if (response.data != null && response.data.length > 0) {
            this.form.handlingDeptName = response.data[0].orgName;
            this.form.handlingDept = response.data[0].orgCode;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    // 查看定标详情
    biddingDetail() {
      this.$router.push({
        name: "CostBiddingDetail",
        query: {
          contractId: this.costBiddingId,
          routerSource: "detail"
        }
      });
    }
  }
};
</script>
<style>
.custom-4DA1FF .el-input.is-disabled .el-input__inner {
  color: #000000 !important;
}
</style>

<style scoped>
.contractInfo .el-input.supplier {
  width: 50% !important;
}

div.primaryContractNumber.el-input.el-input--mini {
  width: 160px !important;
  margin-bottom: 5px;
}
.newAdd .el-button {
  float: right;
  margin-bottom: 10px;
}
.contractBase .spHeight td {
  padding: 10px 0 !important;
}
.col {
  color: blue;
  text-decoration: underline;
  cursor: pointer;
}
</style>
