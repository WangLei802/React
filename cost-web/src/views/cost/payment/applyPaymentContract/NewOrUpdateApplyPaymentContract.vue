<template>
  <div class="app-container">
    <!-- 按钮 -->
    <div style="margin-top: 15px;text-align:right">
      <!-- 返回 -->
      <el-button
        size="mini"
        class="ordinary-btn"
        v-if="!$store.state.user.isFromBpm"
        @click="goback"
      >{{$l("btn_back")}}</el-button>
      <!-- 保存 -->
      <el-button size="mini" type="primary" @click="save" v-show="isShowSubmit">{{ $l("btn_save") }}</el-button>
      <!-- 提交审核 -->
      <el-button
        size="mini"
        type="primary"
        @click="handleBpmSubmit"
        v-show="isShowSubmit"
        :disabled="submitDisabled"
      >{{ $l("lbl_cost_compilation_submit") }}</el-button>
      <el-button
        size="mini"
        type="primary"
        @click="newSubmit"
        v-show="!isShowSubmit"
        :disabled="submitDisabled"
      >提交</el-button>
      <el-button size="mini" type="primary" v-if="print" @click="printWeb()">打印</el-button>
    </div>
    <!-- :disabled="!showButton" -->
    <el-form
      label-width="150px"
      size="mini"
      status-icon
      :model="applyPaymentDetail"
      ref="applyPaymentDetail"
      :rules="rules"
    >
      <!-- 合同信息 -->
      <div>
        <div class="form-unit">合同信息</div>
        <el-row :gutter="12">
          <el-col :span="8">
            <!-- 合同编号 -->
            <el-form-item label="合同编号：" title="合同编号：" prop="contractCode">
              <el-input
                v-model="applyPaymentDetail.contractCode"
                readonly
                :title="applyPaymentDetail.contractCode"
                @focus="handleSelectContract"
                :disabled="!isEdit || !isShow"
              >
                <i
                  class="el-icon-search el-input__icon"
                  slot="suffix"
                  style="cursor: pointer"
                  v-if="isEdit"
                  @click="handleSelectContract"
                ></i>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <!-- 合同名称 -->
            <el-form-item label="合同名称：" title="合同名称：">
              <el-input disabled v-model="applyPaymentDetail.contractName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <!-- 法人公司 -->
            <el-form-item label="法人公司：" title="法人公司：">
              <el-input disabled v-model="applyPaymentDetail.fCompanyName"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="12">
          <el-col :span="8">
            <!-- 项目名称 -->
            <el-form-item label="项目名称：" title="项目名称：">
              <el-input disabled v-model="applyPaymentDetail.projectName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <!-- 合同金额（元）（A） -->
            <el-form-item label="合同金额（元）（A）：" title="合同金额（元）（A）：">
              <amount-input disabled v-model="applyPaymentDetail.contractAmt"></amount-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <!-- 签约日期 -->
            <el-form-item label="签约日期：" title="签约日期：">
              <el-date-picker disabled v-model="applyPaymentDetail.contractDate" type="date"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="12">
          <el-col :span="8">
            <!-- 补充合同金额（元）（B） -->
            <el-form-item label="补充合同金额（元）（B）：" title="补充合同金额（元）（B）：">
              <amount-input disabled v-model="applyPaymentDetail.supplementalContractAmt"></amount-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <!-- 累计变更签证金额(元)（C） -->
            <el-form-item label="累计变更签证金额（元）（C）：" title="累计变更签证金额（元）（C）：">
              <amount-input disabled v-model="applyPaymentDetail.totalAlterationVisaAmt"></amount-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <!-- 合同状态 -->
            <el-form-item label="合同状态：" title="合同状态：">
              <fd-select
                disabled
                type="cost_contract_status_type"
                v-model="applyPaymentDetail.contractStatus"
              ></fd-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="12">
          <el-col :span="8">
            <!-- 合同变更金额（元）（D）-->
            <el-form-item label="合同变更金额（元）（D）：" title="合同变更金额（元）（D）：">
              <amount-input disabled v-model="applyPaymentDetail.alterationAmt"></amount-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <!--预计结算金额(元)(E=A+B+C+D)-->
            <el-form-item label="预计结算金额（元）（E=A+B+C+D）：" title="预计结算金额（元）（E=A+B+C+D）：">
              <amount-input disabled v-model="estimatedSettlementAmt"></amount-input>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <!-- 付款信息 -->
      <div>
        <div class="form-unit">付款信息</div>
        <el-row :gutter="12">
          <el-col :span="8">
            <!-- 付款申请编号 -->
            <el-form-item label="付款申请编号：" title="付款申请编号：">
              <el-input disabled :title="applyPaymentDetail.code" v-model="applyPaymentDetail.code"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <!-- 付款申请名称 -->
            <el-form-item label="付款申请名称：" title="付款申请名称：" prop="name">
              <el-input :disabled="!isEdit || !isShow" v-model="applyPaymentDetail.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="审批状态：" title="审批状态：">
              <fd-label
                :code="applyPaymentDetail.approveStatus"
                :class="{col:flag}"
                :url="bpmUrl"
                type="cost_flow_status"
                :disabled="true"
              ></fd-label>
              <!-- <el-input v-model="applyPaymentDetail.approveStatus"></el-input> -->
              <!-- <div>{{applyPaymentDetail.statusCh}}</div> -->
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="12">
          <el-col :span="8">
            <!-- 收款单位 -->
            <el-form-item label="实际收款单位：" title="实际收款单位：" prop="name">
              <el-input :disabled="!isEdit || !isShow" v-model="applyPaymentDetail.payee"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <!-- 收款银行 -->
            <el-form-item label="收款银行：" title="收款银行：" prop="payeeBankName">
              <!--<el-input v-model="applyPaymentDetail.payeeBankName"></el-input>-->
              <!--<el-select v-model="applyPaymentDetail.payeeBankName"
                                           @change="handleSelectBank"
                                           value-key="bankDocId"
                                           remote
                                           :remote-method="remoteQueryBankInfo"
                                           :loading="bankInfoLoading"
                                           filterable>
                                    <el-option
                                      v-for="item in bankInfoList"
                                      :key="item.name"
                                      :label="item.name"
                                      :value="item.name">
                                    </el-option>
              </el-select>-->
              <!--<el-autocomplete
                                  class="inline-input"
                                  v-model="applyPaymentDetail.payeeBankName"
                                  :fetch-suggestions="queryBankName"
                                  @select="handleSelectBank"
              ></el-autocomplete>-->
              <el-input
                v-model="applyPaymentDetail.payeeBankName"
                readonly
                :title="applyPaymentDetail.payeeBankName"
                @focus="openBankDialog"
                :disabled="!isEdit || !isShow"
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
            <!-- 收款帐号 -->
            <el-form-item label="收款帐号：" title="收款帐号：" prop="payeeAccountNo">
              <!--<el-input v-model="applyPaymentDetail.payeeAccountNo"></el-input>-->
              <el-autocomplete
                class="inline-input"
                v-model="applyPaymentDetail.payeeAccountNo"
                :disabled="!isEdit || !isShow"
                :fetch-suggestions="queryBankNumber"
              ></el-autocomplete>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <!-- 收款帐号 -->
            <el-form-item label="合同收款单位：" title="合同收款单位：" prop="payeeCopy">
              <!--<el-input v-model="applyPaymentDetail.payeeAccountNo"></el-input>-->
              <el-autocomplete
                class="inline-input"
                :disabled="!isEdit || !isShow"
                v-model="applyPaymentDetail.payeeCopy"
                :fetch-suggestions="queryBankNumber"
              ></el-autocomplete>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <!-- 合同累计付款指标（不含本次） -->
      <div>
        <div class="form-unit">合同累计付款指标（不含本次）</div>
        <el-row :gutter="12">
          <el-col :span="8">
            <!-- 累计已申请金额(元)（F） -->
            <el-form-item label="累计已申请金额(元)（F）：" title="累计已申请金额(元)（F）：">
              <amount-input disabled v-model="applyPaymentDetail.totalApplyAmt"></amount-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <!-- 累计已批金额(元)（G） -->
            <el-form-item label="累计已批金额(元)（G）：" title="累计已批金额(元)（G）：">
              <amount-input disabled v-model="applyPaymentDetail.totalApprovedAmt"></amount-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <!-- 累计开票金额(元)（H） -->
            <el-form-item label="累计开票金额(元)（H）：" title="累计开票金额(元)（H）：">
              <amount-input disabled v-model="applyPaymentDetail.totalInvoiceAmt"></amount-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="12">
          <el-col :span="8">
            <!-- 累计已付金额(元)（I） -->
            <el-form-item label="累计已付金额(元)（I）：" title="累计已付金额(元)（I）：">
              <amount-input disabled v-model="applyPaymentDetail.totalPaidAmt"></amount-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <!-- 累计已批未付金额(元)（J=G-I） -->
            <el-form-item label="累计已批未付金额(元)（J=G-I）：" title="累计已批未付金额(元)（J=G-I）：">
              <amount-input disabled v-model="applyPaymentDetail.totalApprovedNoPayAmt"></amount-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <!-- 累计应付未付金额(元)（K=H-I） -->
            <el-form-item label="累计应付未付金额(元)（K=F-I）：" title="累计应付未付金额(元)（K=F-I）：">
              <amount-input disabled v-model="applyPaymentDetail.totalPayableAmt"></amount-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="12">
          <el-col :span="8">
            <!-- 累计已批比例（%）（G/E） -->
            <el-form-item label="累计已批比例（%）（G/E）：" title="累计已批比例（%）（G/E）：">
              <amount-input disabled v-model="applyPaymentDetail.totalApprovedRatio"></amount-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <!-- 累计已付比例（%）（I/E） -->
            <el-form-item label="累计已付比例（%）（I/E）：" title="累计已付比例（%）（I/E）：">
              <amount-input disabled v-model="applyPaymentDetail.totalPaidRatio"></amount-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="12">
          <el-col :span="8">
            <!-- 累计水费（元） -->
            <el-form-item label="累计水费（元）：" title="累计水费（元）：">
              <amount-input disabled v-model="applyPaymentDetail.totalWaterAmt"></amount-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <!-- 累计电费（元） -->
            <el-form-item label="累计电费（元）：" title="累计电费（元）：">
              <amount-input disabled v-model="applyPaymentDetail.totalElcAmt"></amount-input>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <!-- 本次实付信息 v-if="applyPaymentDetail.approveStatus  === auditStatus.AUDITED.code"-->
      <div v-if="applyPaymentDetail.approveStatus  === this.auditStatus.AUDITED.code">
        <div class="form-unit">本次实付信息</div>
        <el-row :gutter="12">
          <el-col :span="8">
            <!-- 本次申请已批金额(元) -->
            <el-form-item label="本次申请已批金额(元)：" title="本次申请已批金额(元)：">
              <amount-input disabled v-model="applyPaymentDetail.approvedAmt"></amount-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <!-- 本次申请已付金额(元) -->
            <el-form-item label="本次申请已付金额(元)：" title="本次申请已付金额(元)：">
              <amount-input disabled v-model="applyPaymentDetail.paidAmt"></amount-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <!-- 本次申请未付金额(元) -->
            <el-form-item label="本次申请未付金额(元)：" title="本次申请未付金额(元)：">
              <amount-input disabled v-model="applyPaymentDetail.noPayAmt"></amount-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="newAd">
          <el-col>
            <el-button size="mini" type="primary" @click="newSave()">保存</el-button>
            <el-button size="mini" type="primary" @click="newAdd()">新增</el-button>
          </el-col>
        </el-row>
        <el-table
          :data="applyPaymentDetail.actualPaymentList"
          stripe
          border
          tooltip-effect="dark"
          style="margin-top: 20px"
        >
          <!-- 序号 -->
          <el-table-column type="index" :label="this.$l('lbl_no')" width="80"></el-table-column>
          <!-- 付款结算单编号 show-overflow-tooltip-->
          <el-table-column label="付款结算单编号" prop="paymentNo">
            <template slot-scope="scope">
              <span>
                <el-input size="mini" disabled v-model="scope.row.paymentNo" placeholder></el-input>
              </span>
            </template>
          </el-table-column>

          <!-- 实际付款日期 -->
          <!-- <el-table-column label="实际付款日期" prop="paymentDate" :formatter='this.$dateFormat("paymentDate", "yyyy-MM-dd")'> -->
          <el-table-column label="实际付款日期" prop="paymentDate">
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
                @click.native.prevent="deleteRow(scope.$index, applyPaymentDetail.actualPaymentList)"
                type="text"
                size="small"
              >移除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
            <!-- 付款类型：预付款 -->
            <div v-if="applyPaymentDetail.paymentReasonTypeCode === '' || applyPaymentDetail.paymentReasonTypeCode === paymentType.PREPAYMENTS.code"
                 :key="1">
                <!-- 本次付款 -->
                <div class="form-unit">本次付款</div>
                <el-row :gutter="12">
                    <el-col :span="8">
                        <!-- 付款类型 -->
                        <el-form-item label="付款类型："
                                      title="付款类型："
                                      prop="paymentReasonTypeCode">
                            <el-select v-model='applyPaymentDetail.paymentReasonTypeCode'
                                       @change="handleChangePaymentType"
                                       :disabled="!isEdit || !isShow">
                                <el-option v-for='item in paymentTypeData'
                                           :key='item.dictValue'
                                           :label='$checkLocaleIsCn() ? item.dictLabelCn : item.dictLabelEn'
                                           :value='item.dictValue'>
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span = "8" >
                        <el-form-item label="是否已提供发票："
                                      title="是否已提供发票"
                                      prop="isProvideInvoice">
                            <fd-select :disabled="!isEdit || invoicenone || !isShow" type="cost_is_provide_invoice" @change="handleChange"
                               v-model="applyPaymentDetail.isProvideInvoice"></fd-select>          
                            <!-- <el-select v-model='applyPaymentDetail.isProvideInvoice'
                                       @change="handleChange"
                                       :disabled="!isEdit || invoicenone">
                                <el-option v-for='item in invoiceData'
                                           :key='item.value'
                                           :label='item.value'
                                           :value='item.value'>
                                </el-option>
                            </el-select> -->
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <!-- 开票金额(元) -->
                        <el-form-item label="本次开票金额(元)："
                                      title="本次开票金额(元)："
                                      prop="invoiceAmt"
                                      :required="isHaveTo">
                            <amount-input :disabled="!isEdit || invoiceAmtFlag || !isShow" v-model.number="applyPaymentDetail.invoiceAmt"></amount-input>
                        </el-form-item>
                    </el-col>
                    <!-- <el-col :span="8"> -->
                      <!-- 税率 -->
                      <!-- <el-form-item label="税率："
                                    title="税率："
                                    prop="taxRate">
                        <fd-select :disabled="!isEdit" type="cost_payment_tax_rate"
                                   v-model="applyPaymentDetail.taxRate"></fd-select>
                      </el-form-item> -->
                    <!-- </el-col> -->
                </el-row>
                <el-row :gutter="12">
                    <el-col :span="8">
                        <!--本次开票金额(元)(不含税) -->
                        <el-form-item label="本次开票金额(元)(不含税)："
                                      title="本次开票金额(元)(不含税)：">
                            <amount-input disabled
                                          v-model="invoiceAmtExcludeTax"></amount-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <!-- 税额(元) -->
                        <el-form-item label="税额(元)："
                                      title="税额(元)：">
                            <amount-input :disabled="!isEdit || isShow || invoiceAmtFlag" 
                                          v-model="applyPaymentDetail.taxAmt"></amount-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <!-- 税率 -->
                      <el-form-item label="税率："
                                    title="税率："
                                    prop="taxRate"
                                    :required="isHaveTo">
                        <fd-select :disabled="!isEdit || !isShow || invoiceAmtFlag" type="cost_payment_tax_rate" @change="changeTaxRate"
                                   v-model="applyPaymentDetail.taxRate"></fd-select>
                      </el-form-item>
                    </el-col>
                    <!-- <el-col :span="8"> -->
                        <!-- 本次申请金额(元) -->
                        <!-- <el-form-item label="本次申请金额(元)：" -->
                                      <!-- title="本次申请金额(元)："> -->
                            <!-- <amount-input disabled -->
                                      <!-- v-model="applyAmt"></amount-input> -->
                        <!-- </el-form-item> -->
                    <!-- </el-col> -->
                </el-row>
                <el-row :gutter="12">
                    <el-col :span="8">
                        <!-- 付款方式 -->
                        <el-form-item label="付款方式："
                                      title="付款方式："
                                      prop="paymentTypeCode">
                            <fd-select :disabled="!isEdit || !isShow" type="cost_payment_method"  @change="changePayment"
                                       v-model="applyPaymentDetail.paymentTypeCode"></fd-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <!-- 用款部门 -->
                        <el-form-item label="用款部门："
                                      title="用款部门："
                                      prop="paymentApplyDept">
                            <el-input :disabled="!isEdit || !isShow" v-model="applyPaymentDetail.paymentApplyDept"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <!-- 本次申请金额(元) -->
                        <!-- <el-form-item label="本次申请金额(元)："
                                      title="本次申请金额(元)："
                                      prop="applyAmt">
                            <amount-input disabled
                                      v-model="applyAmt"></amount-input>
                        </el-form-item> -->
                         <el-form-item label="本次申请金额(元)："
                                      title="本次申请金额(元)："
                                      prop="applyAmt">
                            <amount-input :disabled="disabState"
                                          v-model="applyAmt"></amount-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="12">
                  <!-- <el-col :span="8">
                      <el-form-item label="已付金额："
                                    title="已付金额"
                                    >
                            <amount-input disabled v-model="applyPaymentDetail.amountPaid"></amount-input>
                      </el-form-item>
                  </el-col> -->
                  <el-col :span="8">
                      <el-form-item label="支付状态："
                                    title="支付状态"
                                    >
                            <!-- <fd-select disabled type="cost_payment_status"
                               v-model="applyPaymentDetail.PaymentStatus"></fd-select> -->
                            <el-input disabled v-model="applyPaymentDetail.PaymentStatus"></el-input>
                      </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="12">
                    <el-col :span="8" v-if="paymentConstruction">
                      <el-form-item label="工程款抵房款："
                                      title="工程款抵房款"
                                      prop="workArrivalAmt"
                                      >
                            <amount-input :disabled="!isEdit || !isShow"
                                      v-model="applyPaymentDetail.workArrivalAmt"></amount-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <!-- 经办人 -->
                        <el-form-item label="经办人："
                                      title="经办人：">
                            <el-input disabled
                                      v-model="applyPaymentDetail.operatorName"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <!-- 提交日期 -->
                        <el-form-item label="提交日期："
                                      title="提交日期：">
                            <el-date-picker disabled
                                            v-model="applyPaymentDetail.operatorDate">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
            </div>

            <!--付款类型：进度款 -->
            <div v-if="applyPaymentDetail.paymentReasonTypeCode === paymentType.PROGRESS.code"
                 :key="2">
                <!-- 本次付款 -->
                <div class="form-unit">本次付款</div>
                <el-row :gutter="12">
                    <el-col :span="8">
                        <!-- 付款类型 -->
                        <el-form-item label="付款类型："
                                      title="付款类型："
                                      prop="paymentReasonTypeCode"
                                      @change="handleChangePaymentType">
                            <el-select :disabled="!isEdit || !isShow" v-model='applyPaymentDetail.paymentReasonTypeCode'>
                                <el-option v-for='item in paymentTypeData'
                                           :key='item.dictValue'
                                           :label='$checkLocaleIsCn() ? item.dictLabelCn : item.dictLabelEn'
                                           :value='item.dictValue'>
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span = "8">
                        <el-form-item label="是否已提供发票："
                                      title="是否已提供发票"
                                      prop="isProvideInvoice"
                                      >
                            <fd-select :disabled="!isEdit || invoicenone || !isShow" type="cost_is_provide_invoice" @change="handleChange"
                               v-model="applyPaymentDetail.isProvideInvoice"></fd-select>   
                            <!-- <el-select v-model='applyPaymentDetail.isProvideInvoice'
                                       @change="handleChange"
                                       :disabled="!isEdit || invoicenone">
                                <el-option v-for='item in invoiceData'
                                           :key='item.value'
                                           :label='item.value'
                                           :value='item.value'>
                                </el-option>
                            </el-select> -->
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <!-- 开票金额(元) -->
                        <el-form-item label="本次开票金额(元)："
                                      title="本次开票金额(元)："
                                      prop="invoiceAmt"
                                      :required="isHaveTo"
                                      >
                                      <!-- prop="invoiceAmt":required="applyPaymentDetail.isProvideInvoice === '是'? true:false" -->
                                      <!-- :rules="applyPaymentDetail.isProvideInvoice == '否'?rules.invoiceAmt:[{ required: true, message: '请输入开票金额', trigger: 'blur' },{ type: 'number', message: '开票金额必须为数字值', trigger: 'blur' }]",{ validator: checkPayAmt, trigger: 'blur'} -->
                            <amount-input :disabled="!isEdit || invoiceAmtFlag || !isShow" v-model.number="applyPaymentDetail.invoiceAmt"></amount-input>
                        </el-form-item>
                    </el-col>
                    <!-- <el-col :span="8"> -->
                        <!-- 税率 -->
                        <!-- <el-form-item label="税率：" -->
                                      <!-- title="税率：" -->
                                      <!-- prop="taxRate"> -->
                            <!-- <fd-select :disabled="!isEdit" type="cost_payment_tax_rate" -->
                                       <!-- v-model="applyPaymentDetail.taxRate"></fd-select> -->
                        <!-- </el-form-item> -->
                    <!-- </el-col> -->
                </el-row>
                <el-row :gutter="12">
                    <el-col :span="8">
                        <!-- 本次开票金额(元)（不含税） -->
                        <el-form-item label="本次开票金额(元)(不含税)："
                                      title="本次开票金额(元)(不含税)：">
                            <amount-input disabled
                                          v-model="invoiceAmtExcludeTax"></amount-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <!-- 税额(元) -->
                        <el-form-item label="税额(元)："
                                      title="税额(元)：">
                            <amount-input :disabled="!isEdit || !isShow || invoiceAmtFlag"
                                          v-model="applyPaymentDetail.taxAmt"></amount-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <!-- 税率 -->
                        <el-form-item label="税率："
                                      title="税率："
                                      prop="taxRate"
                                      :required="isHaveTo">
                            <fd-select :disabled="!isEdit || !isShow || invoiceAmtFlag" type="cost_payment_tax_rate" @change="changeTaxRate"
                                       v-model="applyPaymentDetail.taxRate"></fd-select>
                        </el-form-item>
                    </el-col>
                    <!-- <el-col :span="8"> -->
                        <!-- 本次申请金额(元) -->
                        <!-- <el-form-item label="本次申请金额(元)：" -->
                                      <!-- title="本次申请金额(元)：" -->
                                      <!-- prop="applyAmt"> -->
                            <!-- <el-input disabled -->
                                      <!-- v-if="applyPaymentDetail.paidByOutputValue" -->
                                      <!-- v-model="applyAmt"></el-input> -->
                            <!-- <amount-input v-else -->
                                          <!-- v-model="applyPaymentDetail.applyAmt"></amount-input> -->
                        <!-- </el-form-item> -->
                    <!-- </el-col> -->
                </el-row>
                <el-row :gutter="12">
                    <el-col :span="8">
                        <!-- 本次代垫代扣总额(元) -->
                        <el-form-item label="本次代垫代扣总额(元)："
                                      title="本次代垫代扣总额(元)：">
                            <amount-input disabled  
                                          v-model="applyPaymentDetail.totalPadAmt"></amount-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8" v-if="false">
                        <!-- 本次奖罚总额(元) -->
                        <el-form-item label="本次奖罚总额(元)："
                                      title="本次奖罚总额(元)：">
                            <amount-input disabled
                                          v-model="totalRewardPunishAmt"></amount-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <!-- 本次申请金额(元) -->
                        <el-form-item label="本次申请金额(元)："
                                      title="本次申请金额(元)："
                                      prop="applyAmt">
                            <el-input disabled
                                      v-if="applyPaymentDetail.paidByOutputValue"
                                      v-model="applyAmt"></el-input>
                            <amount-input v-else
                                          v-model="applyPaymentDetail.applyAmt"></amount-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <!-- 本次应付金额(元)（含税） gai rules.payAmt-->
                        <el-form-item label="本次应付金额(元)："
                                      title="本次应付金额(元)："
                                      >
                            <amount-input disabled
                                      v-model="payAmt"></amount-input>
                        </el-form-item>
                    </el-col>
                    <!-- <el-col :span="8"> -->
                        <!-- 本次应付金额(元)（含税） -->
                        <!-- <el-form-item label="本次应付金额(元)：" -->
                                      <!-- title="本次应付金额(元)：" -->
                                      <!-- :rules="rules.payAmt" -->
                                      <!-- prop="payAmt"> -->
                            <!-- <amount-input disabled -->
                                      <!-- v-model="payAmt"></amount-input> -->
                        <!-- </el-form-item> -->
                    <!-- </el-col> -->
                </el-row>
                <el-row :gutter="12">
                  <!-- 原位置 -->
                    <!-- <el-col :span="8"> -->
                        <!-- 付款方式 -->
                        <!-- <el-form-item label="付款方式："
                                      title="付款方式："
                                      prop="paymentTypeCode">
                            <fd-select :disabled="!isEdit" type="cost_payment_method" @change="changePayment"
                                       v-model="applyPaymentDetail.paymentTypeCode"></fd-select>
                        </el-form-item> -->
                    <!-- </el-col> -->
                    <!-- <el-col :span="8"> -->
                        <!-- 本次代垫代扣实际总额 -->
                        <!-- <el-form-item label="本次代垫代扣实际总额：" -->
                                      <!-- title="本次代垫代扣实际总额：" -->
                                      <!-- prop="actualTotalPadAmt"> -->
                            <!-- <amount-input :disabled= "!isEdit" -->
                                      <!-- v-model="applyPaymentDetail.actualTotalPadAmt"></amount-input> -->
                        <!-- </el-form-item> -->
                    <!-- </el-col> -->
                    <el-col :span="8">
                        <!-- 用款部门 -->
                        <el-form-item label="用款部门："
                                      title="用款部门："
                                      prop="paymentApplyDept">
                            <el-input :disabled="!isEdit || !isShow" v-model="applyPaymentDetail.paymentApplyDept"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <!-- 付款方式 -->
                      <el-form-item label="付款方式："
                                    title="付款方式："
                                    prop="paymentTypeCode">
                          <fd-select :disabled="!isEdit || !isShow" type="cost_payment_method" @change="changePayment"
                                      v-model="applyPaymentDetail.paymentTypeCode"></fd-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8" v-if="paymentConstruction">
                      <el-form-item label="工程款抵房款："
                                      title="工程款抵房款"
                                      prop="workArrivalAmt">
                            <amount-input :disabled="!isEdit || !isShow"
                                      v-model="applyPaymentDetail.workArrivalAmt"></amount-input>
                      </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="12">
                  <!-- 付款方式 -->
                  <!-- <el-col :span="8">
                      <el-form-item label="付款方式："
                                    title="付款方式："
                                    prop="paymentTypeCode">
                          <fd-select :disabled="!isEdit" type="cost_payment_method" @change="changePayment"
                                      v-model="applyPaymentDetail.paymentTypeCode"></fd-select>
                      </el-form-item>
                  </el-col> -->
                  <!-- <el-col :span="8">
                      <el-form-item label="已付金额："
                                      title="已付金额"
                                    >
                            <amount-input disabled v-model="applyPaymentDetail.amountPaid"></amount-input>
                      </el-form-item>
                  </el-col> -->
                  
                </el-row>
                <el-row :gutter="12">
                  <el-col :span="8">
                      <el-form-item label="支付状态："
                                    title="支付状态"
                                    >
                            <!-- <fd-select disabled type="cost_payment_status"
                               v-model="applyPaymentDetail.PaymentStatus"></fd-select> -->
                            <el-input disabled v-model="applyPaymentDetail.PaymentStatus"></el-input>
                      </el-form-item>
                  </el-col>
                    <el-col :span="8">
                        <!-- 经办人 -->
                        <el-form-item label="经办人："
                                      title="经办人：">
                            <el-input disabled
                                      v-model="applyPaymentDetail.operatorName"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <!-- 提交日期 -->
                        <el-form-item label="提交日期："
                                      title="提交日期：">
                            <el-date-picker disabled
                                            v-model="applyPaymentDetail.operatorDate">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
            </div>

            <!-- 付款类型：结算款 -->
            <div v-if="applyPaymentDetail.paymentReasonTypeCode === paymentType.SETTLEMENT.code"
                 :key="3">
                <!-- 本次付款 -->
                <div class="form-unit">本次付款</div>
                <el-row :gutter="12">
                    <el-col :span="8">
                        <!-- 付款类型 -->
                        <el-form-item label="付款类型："
                                      title="付款类型："
                                      prop="paymentReasonTypeCode">
                            <el-select :disabled="!isEdit || !isShow" v-model='applyPaymentDetail.paymentReasonTypeCode'
                                       @change="handleChangePaymentType">
                                <el-option v-for='item in paymentTypeData'
                                           :key='item.dictValue'
                                           :label='$checkLocaleIsCn() ? item.dictLabelCn : item.dictLabelEn'
                                           :value='item.dictValue'>
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span = "8">
                        <el-form-item label="是否已提供发票："
                                      title="是否已提供发票"
                                      prop="isProvideInvoice">
                            <fd-select :disabled="!isEdit || invoicenone || !isShow" type="cost_is_provide_invoice" @change="handleChange"
                               v-model="applyPaymentDetail.isProvideInvoice"></fd-select>   
                            <!-- <el-select v-model='applyPaymentDetail.isProvideInvoice'
                                       @change="handleChange"
                                       :disabled="!isEdit || invoicenone">
                                <el-option v-for='item in invoiceData'
                                           :key='item.value'
                                           :label='item.value'
                                           :value='item.value'>
                                </el-option>
                            </el-select> -->
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <!-- 开票金额(元) -->
                        <el-form-item label="本次开票金额(元)："
                                      title="本次开票金额(元)："
                                      prop="invoiceAmt"
                                      :required="isHaveTo">
                            <amount-input :disabled="!isEdit || invoiceAmtFlag || !isShow" v-model.number="applyPaymentDetail.invoiceAmt"></amount-input>
                        </el-form-item>
                    </el-col>
                    <!-- <el-col :span="8"> -->
                        <!-- 税率 -->
                        <!-- <el-form-item label="税率：" -->
                                      <!-- title="税率：" -->
                                      <!-- prop="taxRate"> -->
                            <!-- <fd-select :disabled="!isEdit" type="cost_payment_tax_rate" -->
                                       <!-- v-model="applyPaymentDetail.taxRate"></fd-select> -->
                        <!-- </el-form-item> -->
                    <!-- </el-col> -->
                </el-row>
                <el-row :gutter="12">
                    <el-col :span="8">
                        <!-- 本次开票金额(元)（不含税） -->
                        <el-form-item label="本次开票金额(元)(不含税)："
                                      title="本次开票金额(元)(不含税)：">
                            <amount-input disabled
                                          v-model="invoiceAmtExcludeTax"></amount-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <!-- 税额(元) -->
                        <el-form-item label="税额(元)："
                                      title="税额(元)：">
                            <amount-input :disabled="!isEdit || !isShow || invoiceAmtFlag"
                                          v-model="applyPaymentDetail.taxAmt"></amount-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <!-- 税率 -->
                        <el-form-item label="税率："
                                      title="税率："
                                      prop="taxRate"
                                      :required="isHaveTo">
                            <fd-select :disabled="!isEdit || !isShow || invoiceAmtFlag" type="cost_payment_tax_rate" @change="changeTaxRate"
                                       v-model="applyPaymentDetail.taxRate"></fd-select> 
                        </el-form-item>
                    </el-col>
                    <!-- <el-col :span="8"> -->
                        <!-- 结算金额(元) -->
                        <!-- <el-form-item label="结算金额(元)：" -->
                                      <!-- title="结算金额(元)："> -->
                            <!-- <amount-input disabled -->
                                          <!-- v-model="applyPaymentDetail.settlementAmt"></amount-input> -->
                        <!-- </el-form-item> -->
                    <!-- </el-col> -->
                </el-row>
                <el-row :gutter="12">
                    <el-col :span="8">
                        <!-- 累计已申请产值总额(元) -->
                        <el-form-item label="累计已申请总额(元)："
                                      title="累计已申请总额(元)：">
                            <amount-input disabled
                                          v-model="applyPaymentDetail.totalApplyAmt"></amount-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <!-- 本次申请金额(元) -->
                        <el-form-item label="本次申请金额(元)："
                                      title="本次申请金额(元)："
                                      prop="applyAmt">
                            <amount-input :disabled="!isEdit || !isShow" v-model="applyPaymentDetail.applyAmt"></amount-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <!-- 本次代垫代扣总额(元) -->
                        <el-form-item label="本次代垫代扣总额(元)："
                                      title="本次代垫代扣总额(元)：">
                            <amount-input disabled
                                      v-model="applyPaymentDetail.totalPadAmt"></amount-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="12">
                  <el-col :span="8">
                      <!-- 结算金额(元) -->
                      <el-form-item label="结算金额(元)："
                                    title="结算金额(元)：">
                          <amount-input disabled
                                        v-model="applyPaymentDetail.settlementAmt"></amount-input>
                      </el-form-item>
                  </el-col>
                  <el-col :span="8">
                        <!-- 本次应付金额(元) -->
                        <el-form-item label="本次应付金额(元)："
                                      title="本次应付金额(元)：">
                            <amount-input disabled
                                      v-model="payAmt"></amount-input>
                        </el-form-item>
                  </el-col>
                  <!-- <el-col :span="8">
                      <el-form-item label="已付金额："
                                      title="已付金额"
                                    >
                            <amount-input disabled v-model="applyPaymentDetail.amountPaid"></amount-input>
                      </el-form-item>
                  </el-col> -->
                  <!-- <el-col :span="8"> -->
                      <!-- 本次代垫代扣实际总额 -->
                      <!-- <el-form-item label="本次代垫代扣实际总额：" -->
                                    <!-- title="本次代垫代扣实际总额：" -->
                                    <!-- prop="actualTotalPadAmt"> -->
                          <!-- <amount-input :disabled= "!isEdit" -->
                                    <!-- v-model="applyPaymentDetail.actualTotalPadAmt"></amount-input> -->
                      <!-- </el-form-item> -->
                  <!-- </el-col> -->
                </el-row>
                <el-row :gutter="12">
                    <el-col :span="8" v-if="false">
                        <!-- 本次奖罚总额(元) -->
                        <el-form-item label="本次奖罚总额(元)："
                                      title="本次奖罚总额(元)：">
                            <amount-input disabled
                                          v-model="totalRewardPunishAmt"></amount-input>
                        </el-form-item>
                    </el-col>
                    
                    <el-col :span="8">
                        <!-- 付款方式 -->
                        <el-form-item label="付款方式："
                                      title="付款方式："
                                      prop="paymentTypeCode">
                            <fd-select :disabled="!isEdit || !isShow" type="cost_payment_method" @change="changePayment"
                                       v-model="applyPaymentDetail.paymentTypeCode"></fd-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8" v-if="paymentConstruction">
                      <el-form-item label="工程款抵房款："
                                      title="工程款抵房款"
                                      prop="workArrivalAmt">
                            <amount-input :disabled="!isEdit || !isShow"
                                      v-model="applyPaymentDetail.workArrivalAmt"></amount-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="支付状态："
                                    title="支付状态"
                                    >
                            <!-- <fd-select disabled type="cost_payment_status"
                               v-model="applyPaymentDetail.PaymentStatus"></fd-select> -->
                            <el-input disabled v-model="applyPaymentDetail.PaymentStatus"></el-input>
                      </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="12">
                    <el-col :span="8">
                        <!-- 用款部门 -->
                        <el-form-item label="用款部门："
                                      title="用款部门："
                                      prop="paymentApplyDept">
                            <el-input :disabled="!isEdit || !isShow" v-model="applyPaymentDetail.paymentApplyDept"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <!-- 经办人 -->
                        <el-form-item label="经办人："
                                      title="经办人：">
                            <el-input disabled
                                      v-model="applyPaymentDetail.operatorName"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <!-- 提交日期 -->
                        <el-form-item label="提交日期："
                                      title="提交日期：">
                            <el-date-picker disabled
                                            v-model="applyPaymentDetail.operatorDate">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
            </div>

            <!-- 付款类型：质保金 -->
            <div v-if="applyPaymentDetail.paymentReasonTypeCode === paymentType.WARRANTY.code"
                 :key="4">
                <!-- 本次付款 -->
                <div class="form-unit">本次付款</div>
                <el-row :gutter="12">
                    <el-col :span="8">
                        <!-- 付款类型 -->
                        <el-form-item label="付款类型："
                                      title="付款类型："
                                      prop="paymentReasonTypeCode">
                            <el-select :disabled="!isEdit || !isShow" v-model='applyPaymentDetail.paymentReasonTypeCode'
                                       @change="handleChangePaymentType">
                                <el-option v-for='item in paymentTypeData'
                                           :key='item.dictValue'
                                           :label='$checkLocaleIsCn() ? item.dictLabelCn : item.dictLabelEn'
                                           :value='item.dictValue'>
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <!-- 结算金额(元) -->
                        <el-form-item label="结算金额(元)："
                                      title="结算金额(元)：">
                            <amount-input disabled
                                      v-model="applyPaymentDetail.settlementAmt"></amount-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <!-- 有无维修事项 -->
                        <el-form-item label="有无维修事项："
                                      title="有无维修事项："
                                      prop="maintain">
                            <fd-select :disabled="!isEdit || !isShow" type="maintain"
                                       v-model="applyPaymentDetail.maintain"></fd-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="12">
                  <el-col :span="8">
                    <el-form-item label="是否已提供发票："
                                      title="是否已提供发票"
                                      prop="isProvideInvoice"
                                      >
                            <fd-select :disabled="!isEdit || invoicenone || !isShow" type="cost_is_provide_invoice" @change="handleChange"
                               v-model="applyPaymentDetail.isProvideInvoice"></fd-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                      <!-- 开票金额(元) -->
                      <el-form-item label="本次开票金额(元)："
                                    title="本次开票金额(元)："
                                    prop="invoiceAmt"
                                    :required="isHaveTo"
                                    >
                                    <!-- prop="invoiceAmt":required="applyPaymentDetail.isProvideInvoice === '是'? true:false" -->
                                    <!-- :rules="applyPaymentDetail.isProvideInvoice == '否'?rules.invoiceAmt:[{ required: true, message: '请输入开票金额', trigger: 'blur' },{ type: 'number', message: '开票金额必须为数字值', trigger: 'blur' }]",{ validator: checkPayAmt, trigger: 'blur'} -->
                          <amount-input :disabled="!isEdit || invoiceAmtFlag || !isShow" v-model.number="applyPaymentDetail.invoiceAmt"></amount-input>
                      </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="12">
                    <el-col :span="8">
                        <!-- 本次申请金额(元) -->
                        <el-form-item label="本次申请金额(元)："
                                      title="本次申请金额(元)："
                                      prop="applyAmt">
                            <amount-input :disabled="!isEdit || !isShow" v-model="applyPaymentDetail.applyAmt"></amount-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <!-- 本次申请金额(元) -->
                        <el-form-item label="本次申请金额(大写)："
                                      title="本次申请金额(大写)：">
                            <el-input disabled
                                      v-model="applyAmtCapital"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="12">
                    <el-col :span="8">
                        <!-- 付款方式 -->
                        <el-form-item label="本次支付后尚余款(元)："
                                      title="本次支付后尚余款(元)："
                                      prop="unpaidAmt">
                            <amount-input :disabled="!isEdit || !isShow" v-model="applyPaymentDetail.unpaidAmt"></amount-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <!-- 付款方式 -->
                        <el-form-item label="本次支付后尚余款(大写)："
                                      title="本次支付后尚余款(大写)："
                                      prop="unpaidAmt">
                            <el-input disabled
                                      v-model="unpaidAmt"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="12">
                  <!-- <el-col :span="8">
                      <el-form-item label="已付金额："
                                      title="已付金额"
                                    >
                            <amount-input disabled v-model="applyPaymentDetail.amountPaid"></amount-input>
                      </el-form-item>
                  </el-col> -->
                  
                </el-row>
                <el-row :gutter="12">
                  <el-col :span="8">
                      <el-form-item label="支付状态："
                                    title="支付状态"
                                    >
                            <!-- <fd-select disabled type="cost_payment_status"
                               v-model="applyPaymentDetail.PaymentStatus"></fd-select> -->
                            <el-input disabled v-model="applyPaymentDetail.PaymentStatus"></el-input>
                      </el-form-item>
                  </el-col>
                    <el-col :span="8">
                        <!-- 经办人 -->
                        <el-form-item label="经办人："
                                      title="经办人：">
                            <el-input disabled
                                      v-model="applyPaymentDetail.operatorName"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <!-- 提交日期 -->
                        <el-form-item label="提交日期："
                                      title="提交日期：">
                            <el-date-picker disabled
                                            v-model="applyPaymentDetail.operatorDate">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
            </div>

            <!-- 付款类型：完工验收款 -->
            <div v-if="applyPaymentDetail.paymentReasonTypeCode === paymentType.COMPLETION.code"
               :key="5">
              <!-- 本次付款 -->
              <div class="form-unit">本次付款</div>
              <el-row :gutter="12">
                <el-col :span="8">
                  <!-- 付款类型 -->
                  <el-form-item label="付款类型："
                                title="付款类型："
                                prop="paymentReasonTypeCode"
                                @change="handleChangePaymentType">
                    <el-select :disabled="!isEdit || !isShow" v-model='applyPaymentDetail.paymentReasonTypeCode'>
                      <el-option v-for='item in paymentTypeData'
                                 :key='item.dictValue'
                                 :label='$checkLocaleIsCn() ? item.dictLabelCn : item.dictLabelEn'
                                 :value='item.dictValue'>
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span = "8">
                        <el-form-item label="是否已提供发票："
                                      title="是否已提供发票"
                                      prop="isProvideInvoice">
                            <fd-select :disabled="!isEdit || invoicenone || !isShow" type="cost_is_provide_invoice" @change="handleChange"
                               v-model="applyPaymentDetail.isProvideInvoice"></fd-select>   
                            <!-- <el-select v-model='applyPaymentDetail.isProvideInvoice'
                                       @change="handleChange"
                                       :disabled="!isEdit || invoicenone">
                                <el-option v-for='item in invoiceData'
                                           :key='item.value'
                                           :label='item.value'
                                           :value='item.value'>
                                </el-option>
                            </el-select> -->
                        </el-form-item>
                    </el-col>
                <el-col :span="8">
                  <!-- 开票金额(元) -->
                  <el-form-item label="本次开票金额(元)："
                                title="本次开票金额(元)："
                                prop="invoiceAmt"
                                :required="isHaveTo">
                    <amount-input :disabled="!isEdit || invoiceAmtFlag || !isShow" v-model.number="applyPaymentDetail.invoiceAmt"></amount-input>
                  </el-form-item>
                </el-col>
                
                <!-- <el-col :span="8"> -->
                  <!-- 税率 -->
                  <!-- <el-form-item label="税率：" -->
                                <!-- title="税率：" -->
                                <!-- prop="taxRate"> -->
                    <!-- <fd-select :disabled="!isEdit" type="cost_payment_tax_rate" -->
                               <!-- v-model="applyPaymentDetail.taxRate"></fd-select> -->
                  <!-- </el-form-item> -->
                <!-- </el-col> -->
              </el-row>
              <el-row :gutter="12">
                <el-col :span="8">
                  <!-- 本次开票金额(元)（不含税） -->
                  <el-form-item label="本次开票金额(元)(不含税)："
                                title="本次开票金额(元)(不含税)：">
                    <amount-input disabled
                                  v-model="invoiceAmtExcludeTax"></amount-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <!-- 税额(元) -->
                  <el-form-item label="税额(元)："
                                title="税额(元)：">
                    <amount-input :disabled="!isEdit || !isShow || invoiceAmtFlag"
                                  v-model="applyPaymentDetail.taxAmt"></amount-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <!-- 税率 -->
                  <el-form-item label="税率："
                                title="税率："
                                prop="taxRate"
                                :required="isHaveTo">
                    <fd-select :disabled="!isEdit || !isShow || invoiceAmtFlag" type="cost_payment_tax_rate" @change="changeTaxRate"
                               v-model="applyPaymentDetail.taxRate"></fd-select>
                  </el-form-item>
                </el-col>
                <!-- <el-col :span="8"> -->
                  <!-- 本次申请金额(元) -->
                  <!-- <el-form-item label="本次申请金额(元)：" -->
                                <!-- title="本次申请金额(元)：" -->
                                <!-- prop="applyAmt"> -->
                    <!-- <amount-input :disabled="!isEdit" v-model="applyPaymentDetail.applyAmt"></amount-input> -->
                  <!-- </el-form-item> -->
                <!-- </el-col> -->
              </el-row>
              <el-row :gutter="12">
                <el-col :span="8">
                  <!-- 本次代垫代扣总额(元) -->
                  <el-form-item label="本次代垫代扣总额(元)："
                                title="本次代垫代扣总额(元)：">
                    <amount-input disabled
                                  v-model="applyPaymentDetail.totalPadAmt"></amount-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8" v-if="false">
                  <!-- 本次奖罚总额(元) -->
                  <el-form-item label="本次奖罚总额(元)："
                                title="本次奖罚总额(元)：">
                    <amount-input disabled
                                  v-model="totalRewardPunishAmt"></amount-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <!-- 本次申请金额(元) -->
                  <el-form-item label="本次申请金额(元)："
                                title="本次申请金额(元)："
                                prop="applyAmt">
                    <amount-input :disabled="!isEdit || !isShow" v-model="applyPaymentDetail.applyAmt"></amount-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                      <el-form-item label="支付状态："
                                    title="支付状态"
                                    >
                            <!-- <fd-select disabled type="cost_payment_status"
                               v-model="applyPaymentDetail.PaymentStatus"></fd-select> -->
                            <el-input disabled v-model="applyPaymentDetail.PaymentStatus"></el-input>
                      </el-form-item>
                  </el-col>
                <!-- <el-col :span="8"> -->
                  <!-- 本次应付金额(元)（含税） -->
                  <!-- <el-form-item label="本次应付金额(元)：" -->
                                <!-- title="本次应付金额(元)：" -->
                                <!-- :rules="rules.payAmt" -->
                                <!-- prop="payAmt"> -->
                    <!-- <amount-input disabled -->
                                  <!-- v-model="payAmt"></amount-input> -->
                  <!-- </el-form-item> -->
                <!-- </el-col> -->
              </el-row>
              <el-row :gutter="12">
                <el-col :span="8">
                  <!-- 付款方式 -->
                  <el-form-item label="付款方式："
                                title="付款方式："
                                prop="paymentTypeCode">
                    <fd-select :disabled="!isEdit || !isShow" type="cost_payment_method" @change="changePayment"
                               v-model="applyPaymentDetail.paymentTypeCode"></fd-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <!-- 用款部门 -->
                  <el-form-item label="用款部门："
                                title="用款部门："
                                prop="paymentApplyDept">
                    <el-input :disabled="!isEdit || !isShow" v-model="applyPaymentDetail.paymentApplyDept"></el-input>
                  </el-form-item>
                </el-col>
                 <el-col :span="8">
                  <!-- 本次应付金额(元)（含税） gai:rules="rules.payAmt"-->
                  <el-form-item label="本次应付金额(元)："
                                title="本次应付金额(元)："
                                >
                    <amount-input disabled
                                  v-model="payAmt"></amount-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="12">
                  <!-- <el-col :span="8"> -->
                      <!-- 本次代垫代扣实际总额 -->
                      <!-- <el-form-item label="本次代垫代扣实际总额：" -->
                                    <!-- title="本次代垫代扣实际总额：" -->
                                    <!-- prop="actualTotalPadAmt"> -->
                          <!-- <amount-input :disabled= "!isEdit" -->
                                    <!-- v-model="applyPaymentDetail.actualTotalPadAmt"></amount-input> -->
                      <!-- </el-form-item> -->
                  <!-- </el-col> -->
                  <!-- <el-col :span="8">
                      <el-form-item label="已付金额："
                                    title="已付金额"
                                    >
                            <amount-input disabled v-model="applyPaymentDetail.amountPaid"></amount-input>
                      </el-form-item>
                  </el-col> -->
                  
                </el-row>
              <el-row :gutter="12">
                <el-col :span="8" v-if="paymentConstruction">
                      <el-form-item label="工程款抵房款："
                                      title="工程款抵房款"
                                      prop="workArrivalAmt">
                            <amount-input :disabled="!isEdit || !isShow"
                                      v-model="applyPaymentDetail.workArrivalAmt"></amount-input>
                      </el-form-item>
                    </el-col>
                <el-col :span="8">
                  <!-- 经办人 -->
                  <el-form-item label="经办人："
                                title="经办人：">
                    <el-input disabled
                              v-model="applyPaymentDetail.operatorName"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <!-- 提交日期 -->
                  <el-form-item label="提交日期："
                                title="提交日期：">
                    <el-date-picker disabled
                                    v-model="applyPaymentDetail.operatorDate">
                    </el-date-picker>
                  </el-form-item>
                </el-col>
              </el-row>
          </div>

            <!-- 罚款明细 -->
            <div v-if="applyPaymentDetail.paymentReasonTypeCode === paymentType.WARRANTY.code">
                <!-- 罚款明细 -->
                <div class="form-unit">罚款明细</div>
                <el-row :gutter="12">
                    <el-col :span="8">
                        <el-form-item label="水费(元)："
                                      title="水费(元)：">
                            <amount-input :disabled="!isEdit || !isShow" v-model="applyPaymentDetail.waterAmt"></amount-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="电费(元)："
                                      title="电费(元)：">
                            <amount-input :disabled="!isEdit || !isShow" v-model="applyPaymentDetail.elcAmt"></amount-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="罚款(元)："
                                      title="罚款(元)：">
                            <amount-input :disabled="!isEdit || !isShow" v-model="applyPaymentDetail.punishAmt"></amount-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="12">
                    <el-col :span="8">
                        <el-form-item label="其他(元)："
                                      title="其他(元)：">
                            <amount-input :disabled="!isEdit || !isShow" v-model="applyPaymentDetail.otherAmt"></amount-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="实际支付金额(元)："
                                      title="实际支付金额(元)：">
                            <amount-input :disabled="!isEdit || !isShow" v-model="applyPaymentDetail.payAmt"></amount-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="实际支付金额(大写)："
                                      title="实际支付金额(大写">
                            <el-input  disabled
                                      v-model="payAmtCapital"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </div>

            <el-row :gutter="12">
                <el-col :span="24">
                    <!-- 备注 -->
                    <el-form-item label="备注：">
                      <el-input :disabled="!isEdit || !isShow" type="textarea"
                                :autosize="{ minRows: 4, maxRows: 6}"
                                v-model="applyPaymentDetail.remark">
                      </el-input>
                    </el-form-item>
                </el-col>
            </el-row>

            <!-- 产值核定-->
            <div v-if="applyPaymentDetail.paymentReasonTypeCode === paymentType.PROGRESS.code && applyPaymentDetail.paidByOutputValue">
                <div class="form-unit">产值核定单</div>
                <el-table :data="applyPaymentDetail.applyPaymentOutputValueCheckModelList"
                          :header-cell-class-name="rowClassName"
                          stripe
                          border
                          tooltip-effect="dark"
                          size="small"
                          style="width: 100%">
                    <el-table-column type="index"
                                     :label="this.$l('lbl_no')"
                                     width="80"></el-table-column>

                    <el-table-column label="产值核定编号"
                                     show-overflow-tooltip
                                     prop="outputValueCheckCode"></el-table-column>

                    <el-table-column label="核定金额(元)"
                                     prop="checkAmt"></el-table-column>

                    <el-table-column label="付款比例(%)"
                                     prop="contractualPaymentRatio"></el-table-column>

                    <el-table-column label="已申请付款金额(元)"
                                     prop="appliedAmt"></el-table-column>

                    <el-table-column label="本次申请金额(元)"
                                     width="300"
                                     prop="applyAmt">
<template slot-scope="scope">
  <el-form-item
    label-width="0"
    style="margin-top: 20px;"
    :prop="'applyPaymentOutputValueCheckModelList.' + scope.$index + '.applyAmt'"
    :rules="rules.outputValueCheck.applyAmt"
  >
    <amount-input v-model.number="scope.row.applyAmt"></amount-input>
  </el-form-item>
</template>
                    </el-table-column>

                </el-table>
            </div>

            <!-- 代垫代扣 -->
            <div v-if="applyPaymentDetail.paymentReasonTypeCode === paymentType.PROGRESS.code || applyPaymentDetail.paymentReasonTypeCode === paymentType.COMPLETION.code">
                <div class="form-unit">代垫代扣</div>
                <el-table :data="applyPaymentDetail.applyPaymentPadList"
                          ref="padTable"
                          stripe
                          border
                          @selection-change="changeSelect"
                          tooltip-effect="dark"
                          style="width: 100%">
                    <el-table-column type="index"
                                     :label="this.$l('lbl_no')"
                                     width="80"></el-table-column>

                    <el-table-column label="代垫代扣编号"
                                     prop="applyPaymentCode"
                                     show-overflow-tooltip></el-table-column>

                    <el-table-column label="扣款单位"
                                     prop="deductionUnit"></el-table-column>

                    <el-table-column label="扣款类型"
                                     prop="deductionType">
                      <template slot-scope="scope">
                        <fd-label :code="scope.row.deductionType" type="cost_withholding_type"></fd-label>
                      </template>
                    </el-table-column>

                    <el-table-column label="扣款事项"
                                     prop="deductionReason">               
                    </el-table-column>

                    <el-table-column label="扣款金额(元)"
                                     prop="deductionAmt">           
                    </el-table-column>

                    <el-table-column label="已付金额(元)"
                                     prop="amountPaidTotal" >
                        <template slot-scope="scope">
                          <div class="cur" @click="payClick(scope.row, scope.$index)">{{scope.row.amountPaidTotal}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column label=" 实际已付总额(元)"
                                     prop="actualPaymentAmount" >
                        <!-- <template slot-scope="scope">
                          <amount-input :disabled="!isEdit || !isShow"
                                        v-model="scope.row.actualPaymentAmount"></amount-input>
                        </template> -->
                    </el-table-column>
                    <el-table-column label="本次实付金额(元)"
                                     prop="remainingPaymentAmount" >
                        <template slot-scope="scope">
                          <amount-input :disabled="!isEdit || !isShow"
                                        v-model="scope.row.remainingPaymentAmount"></amount-input>
                        </template>
                    </el-table-column>
                    
                    <el-table-column label="扣款日期"
                                     prop="deductionDate"
                                     :formatter='this.$dateFormat("deductionDate", "yyyy-MM-dd")'></el-table-column>

                    <el-table-column label="操作"
                                     type="selection"
                                     :checked="true"></el-table-column>

                </el-table>
            </div>
            <el-dialog title="已付金额明细" :visible.sync="dialogFormVisible">
              <el-table :data="dialogForm">
                <el-table-column property="applyPaymentCode" label="代垫代扣编号"></el-table-column>
                
                <el-table-column prop="deductionUnit" label="扣款单位"></el-table-column>
                
                <el-table-column label="扣款类型"
                                     prop="deductionType">
                  <template slot-scope="scope">
                    <fd-label :code="scope.row.deductionType" type="cost_withholding_type"></fd-label>
                  </template>
                </el-table-column>

                <el-table-column label="扣款事项"
                                  prop="deductionReason">             
                </el-table-column>
                
                <el-table-column property="amountPaid" label="已付金额(元)"></el-table-column>
              </el-table>
            </el-dialog>
            
            <!-- 奖罚情况 原判断applyPaymentDetail.paymentReasonTypeCode === paymentType.PROGRESS.code || applyPaymentDetail.paymentReasonTypeCode === paymentType.SETTLEMENT.code || applyPaymentDetail.paymentReasonTypeCode === paymentType.COMPLETION.code-->
            <div v-if="false">

                <div class="form-unit">奖罚情况</div>
                <div>
                    <div style="float: right;margin-right: 20px;margin-bottom: 8px;">
                        <el-button size="mini"
                                   type='primary'
                                   @click="addRow"
                                   v-if="isEdit">新增</el-button>
                        <el-button size="mini"
                                   type='primary'
                                   @click="deleteRows"
                                   v-if="isEdit">删除</el-button>
                    </div>
                </div>
                <el-table :data="applyPaymentDetail.applyPaymentRewardPunishList"
                          :header-cell-class-name="rowClassName2"
                          stripe
                          border
                          size="small"
                          ref="rewardPunishTable"
                          @selection-change="handleSelectionChange"
                          style="width: 100%">
                    <el-table-column
                      v-if="isEdit"
                      type="selection"
                      width="55">
                    </el-table-column>
                    <el-table-column type="index"
                                     :label="this.$l('lbl_no')"
                                     width="80"></el-table-column>

                    <el-table-column label="奖罚类型">
                        <template slot-scope="scope">
                            <span v-if="!isEdit">
                                <fd-label type="cost_reward_punish_type"
                                          :code="scope.row.rewardPunishTypeCode"></fd-label>
                            </span>
                            <span v-else>
                                <el-form-item label-width="0"
                                              :ref="'rewardPunishForm' + scope.$index"
                                              style="margin-top: 20px"
                                              :prop="'applyPaymentRewardPunishList.' + scope.$index + '.rewardPunishTypeCode'"
                                              :rules="rules.rewardPunish.rewardPunishTypeCode">
                                    <fd-select type="cost_reward_punish_type"
                                               v-model="scope.row.rewardPunishTypeCode" ></fd-select>
                                </el-form-item>
                            </span>
                        </template>
                    </el-table-column>

                    <el-table-column label="奖罚单位"
                                     prop="rewardPunishUnit">
                        <template slot-scope="scope">
                            <span v-if="!isEdit">{{scope.row.rewardPunishUnit}}</span>
                            <span v-else>
                                <el-form-item label-width="0"
                                              :ref="'rewardPunishForm' + scope.$index"
                                              style="margin-top: 20px"
                                              :prop="'applyPaymentRewardPunishList.' + scope.$index + '.rewardPunishUnit'"
                                              :rules="rules.rewardPunish.rewardPunishUnit">
                                    <el-input size="mini"
                                              v-model="scope.row.rewardPunishUnit"></el-input>
                                </el-form-item>
                            </span>
                        </template>
                    </el-table-column>

                    <el-table-column label="奖罚事项"
                                     prop="rewardPunishReason">
                        <template slot-scope="scope">
                            <span v-if="!isEdit">{{scope.row.rewardPunishReason}}</span>
                            <span v-else>
                                <el-form-item label-width="0"
                                              :ref="'rewardPunishForm' + scope.$index"
                                              style="margin-top: 20px"
                                              :prop="'applyPaymentRewardPunishList.' + scope.$index + '.rewardPunishReason'"
                                              :rules="rules.rewardPunish.rewardPunishReason">
                                    <el-input size="mini"
                                              v-model="scope.row.rewardPunishReason"></el-input>
                                </el-form-item>
                            </span>
                        </template>
                    </el-table-column>

                    <el-table-column label="申请金额(元)"
                                     prop="applyAmt">
                        <template slot-scope="scope">
                            <span v-if="!isEdit">{{scope.row.applyAmt}}</span>
                            <span v-else>
                                <el-form-item label-width="0"
                                              :ref="'rewardPunishForm' + scope.$index"
                                              style="margin-top: 20px"
                                              :prop="'applyPaymentRewardPunishList.' + scope.$index + '.applyAmt'"
                                              :rules="rules.rewardPunish.applyAmt">
                                    <amount-input size="mini"
                                                  v-model="scope.row.applyAmt"></amount-input>
                                </el-form-item>
                            </span>
                        </template>
                    </el-table-column>

                    <el-table-column label="备注"
                                     prop="remark">
                        <template slot-scope="scope">
                            <span v-if="!isEdit">{{scope.row.remark}}</span>
                            <span v-else>
                                <el-form-item label-width="0"
                                              style="margin-top: 20px"
                                              :prop="'applyPaymentRewardPunishList.' + scope.$index + '.remark'">
                                    <el-input size="mini"
                                              v-model.trim="scope.row.remark"></el-input>
                                </el-form-item>

                            </span>
                        </template>
                    </el-table-column>
                </el-table>
            </div>

            <!-- 附件列表 -->
            <div>
                <div class="form-unit">附件列表</div>
                <div v-if="isEdit">
                    <el-form-item label="上传附件:" style="margin-left: -80px;">
                        <CostFileUpload :limit="4"
                                        :attachmentData="applyPaymentDetail.attachmentList"
                                        :outerId="applyPaymentDetail.id">
                        </CostFileUpload>
                    </el-form-item>
                </div>
            </div>
        </el-form>
        <DesignAlterationAttachmentTable :queryObj_passed_in='queryModel'
                                         :attaData='applyPaymentDetail.attachmentList'
                                         :showDeleteButton="isEdit"
                                         v-on:changeAttachments="changeAttachments">
        </DesignAlterationAttachmentTable>
        <!-- 关联流程 -->
        <div>
          <div class="form-unit">关联流程</div>
          <FlowAdd v-on:flow="flow"
                   :showDeleteButton="isStatus">
          </FlowAdd>
        </div>

        <ContractSelector :showContract="isShowContract"
                          type="signed"
                          :moduleCode="moduleCode"
                          v-on:cancelDialog="cancelDialog"
                          v-on:closeDialog="closeDialog"
                          v-on:confirmContract="confirmContract">
        </ContractSelector>

        <BankSelector :showBank="showBank"
                      v-on:cancelDialog="cancelBankDialog"
                      v-on:closeDialog="closeBankDialog"
                      v-on:confirmBank="confirmBank">
        </BankSelector>
    </div>
    
</template>
<script>
import uuidv1 from "uuid/v1";
import { LoadingUtil } from "@/utils/common/LoadingUtil";
import AmountInput from "@/components/cost/AmountInput/";
import { getMeProfile } from "@/api/sys/userAPI";
import { ptn } from "@/utils/common/validate";
import {
  saveApplyPayment,
  updateApplyPayment,
  getApplyPaymentDetail,
  findByContractCode,
  getApplyPaymentCode,
  updateApplyPaymentStatus,
  submitApplyPayment,
  getBankInfo,
  getAccountInfo,
  getBankInfoByBankdocId,
  additionalRecordingActualPayment,
  billPrinting,
  zfinancialSubmit,
  getApplyPaymentPadDetail
} from "@/api/cost/applyPaymentContract";
import {
  NumFormat, // 千位符
  FLevel,
  dateFormat,
  Version
} from "@/filters/cost/";
import CostFileUpload from "@/components/cost/UploadFile/";
import ContractSelector from "@/components/cost/ContractSelector/";
import BankSelector from "@/components/cost/BankSelector/";
import DesignAlterationAttachmentTable from "@/views/cost/designAlteration/DesignAlterationAttachmentTable";
import FlowAdd from "@/components/cost/FlowAdd/";
import COSTENUM from "@/utils/cost/enum";
import { getDetailByContractCode } from "@/api/cost/signContractAPI";
import { calc } from "@/utils/common/calc";
export default {
  filters: {
    NumFormat,
    FLevel,
    dateFormat,
    Version
  },
  components: {
    CostFileUpload,
    ContractSelector,
    DesignAlterationAttachmentTable,
    AmountInput,
    FlowAdd,
    BankSelector
  },
  data() {
    var validateName = (rule, value, callback) => {
      // 当为空值且为必填时，抛出错误，反之通过校验
      if (this.applyPaymentDetail.invoiceAmt === "" && this.isHaveTo) {
        callback(new Error("请输入本次开票金额"));
      } else {
        callback();
      }
    };
    var valitaxRate = (rule, value, callback) => {
      // 当为空值且为必填时，抛出错误，反之通过校验
      if (this.applyPaymentDetail.taxRate === "" && this.isHaveTo) {
        callback(new Error("请选择税率"));
      } else {
        callback();
      }
    };
    // var validateTotalPadAmt = (rule, value, callback) => {
    //   if(this.applyPaymentDetail.actualTotalPadAmt > this.applyPaymentDetail.totalPadAmt){
    //     callback(new Error("本次代垫代扣实际总额应小于等于本次代垫代扣总额"));
    //   }else{
    //     callback();
    //   }
    // }
    // 校验本次应付金额（含税）
    // var checkPayAmt = (rule, value, callback) => {
    //   // 付款类型：进度款
    //   let add1 = Number(calc.Add(this.payAmt, this.applyPaymentDetail.totalApprovedAmt));
    //   let add2 = Number(calc.Add(this.applyPaymentDetail.invoiceAmt,this.applyPaymentDetail.totalInvoiceAmt));
    //   if (
    //     this.applyPaymentDetail.paymentReasonTypeCode ===
    //       this.paymentType.PROGRESS.code ||
    //     this.applyPaymentDetail.paymentReasonTypeCode ===
    //       this.paymentType.COMPLETION.code ||
    //     this.applyPaymentDetail.paymentReasonTypeCode ===
    //       this.paymentType.SETTLEMENT.code
    //   ) {
    //     if (this.applyPaymentDetail.invoiceAmt != "") {
    //       if (add1 > add2) {
    //         // alert(Number(this.payAmt+this.applyPaymentDetail.totalApprovedAmt))
    //         return callback(
    //           new Error(
    //             "本次应付金额+累计已批金额应小于等于本次开票金额+累计开票金额"
    //           )
    //         );
    //       } else {
    //         callback();
    //       }
    //     } else {
    //       callback();
    //     }
    //   } else {
    //     callback();
    //   }
    // };
    /*// 校验本次申请总额
            var checkThisApplyAmt = (rule, value, callback) => {
                if (this.applyPaymentDetail.paymentReasonTypeCode !== this.paymentType.WARRANTY.code) {
                    if (this.applyPaymentDetail.applyAmt > this.applyPaymentDetail.invoiceAmt) {
                      return callback(new Error('本次申请总额应小于等于开票金额'))
                    } else {
                      callback()
                    }
                } else {
                  callback()
                }
            }*/
    // 校验产值核定申请金额
    var checkOutputValueCheck = (rule, value, callback) => {
      let index = rule.field.split(".")[1];
      let rowData = this.applyPaymentDetail
        .applyPaymentOutputValueCheckModelList[index];
      if (
        (Number(rowData.checkAmt) * Number(rowData.contractualPaymentRatio)) /
          100 -
          Number(rowData.appliedAmt) <
        Number(value)
      ) {
        callback("本次申请金额<=核定金额*付款比例-已申请付款金额");
      } else {
        callback();
      }
    };
    return {
      isStatus: false,
      print: false,
      // 控制是本次开票
      invoiceAmtFlag: false,
      // 控制是否提供发票
      invoicenone: true,
      invoiceFlag: true,
      wangBut: false,
      isShowSubmit: true,
      // 审批状态
      auditStatus: {
        DRAFT: {
          name: "草稿",
          code: "0"
        },
        AUDITING: {
          name: "审批中",
          code: "1"
        },
        AUDITED: {
          name: "已审批",
          code: "2"
        },
        REJECT: {
          name: "已驳回",
          code: "3"
        }
      },
      // 付款类型
      paymentType: {
        PREPAYMENTS: {
          name: "预付款",
          code: "1"
        },
        PROGRESS: {
          name: "进度款",
          code: "2"
        },
        SETTLEMENT: {
          name: "结算款",
          code: "3"
        },
        WARRANTY: {
          name: "质保金",
          code: "4"
        },
        COMPLETION: {
          name: "完工验收款",
          code: "5"
        }
      },
      // 校验规则
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
        contractCode: [
          {
            required: true,
            message: "请选择合同编号",
            trigger: "change"
          }
        ],
        name: [
          {
            required: true,
            message: "请输入付款申请名称",
            trigger: "blur"
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
        ],
        paymentReasonTypeCode: [
          {
            required: true,
            message: "请选择付款类型",
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
        taxRate: [
          // {
          //   required: true,
          //   message: "请选择税率",
          //   trigger: "change"
          // },
          {
            validator: valitaxRate
          }
        ],
        paymentTypeCode: [
          {
            required: true,
            message: "请选择付款方式",
            trigger: "change"
          }
        ],
        workArrivalAmt: [
          {
            required: true,
            message: "请输入工程款抵房款",
            trigger: "change"
          },
          {
            pattern: /^[0-9]+(.[0-9]{2})?$/,
            message: "请输入正确的数值(值应大于等于0)"
          }
        ],
        // actualTotalPadAmt:[
        //   { required: true, message: "请输入本次代垫代扣实际总额", trigger: "change" },
        //   { pattern: /^[0-9]+(.[0-9]{2})?$/, message: '请输入正确的数值(值应大于等于0)'},
        //   { validator: validateTotalPadAmt }
        // ],
        paymentApplyDept: [
          {
            required: true,
            message: "请输入用款部门",
            trigger: "blur"
          }
        ],
        applyAmt: [
          {
            required: true,
            message: "请输入本次申请金额",
            trigger: "blur"
          }
          // { validator: checkApplyAmt, trigger: "blur"}
        ],
        // amountPaid:[
        //   { required: true, message: "请输入已付金额", trigger: "blur" },
        //   { validator: checkApplyAmt, trigger: "blur" }
        // ],
        // payAmt: [
        //   {
        //     validator: checkPayAmt,
        //     trigger: "change"
        //   }
        // ],
        outputValueCheck: {
          applyAmt: [
            {
              required: true,
              message: "请输入本次申请金额",
              trigger: "blur"
            },
            {
              type: "number",
              message: "请输入数字",
              trigger: "blur"
            },
            {
              validator: checkOutputValueCheck,
              trigger: "blur"
            }
          ]
        },
        rewardPunish: {
          rewardPunishTypeCode: [
            {
              required: true,
              message: "请选择奖罚类型",
              trigger: "change"
            }
          ],
          rewardPunishUnit: [
            {
              required: true,
              message: "请输入奖罚单位",
              trigger: "blur"
            }
          ],
          rewardPunishReason: [
            {
              required: true,
              message: "请输入奖罚事项",
              trigger: "blur"
            }
          ],
          applyAmt: [
            {
              required: true,
              message: "请输入申请金额",
              trigger: "blur"
            },
            // 正小数校验
            {
              pattern: /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/,
              message: "请输入正确的申请金额",
              trigger: "change"
            }
          ]
        },
        maintain: [
          {
            required: true,
            message: "请选择有无维修事项",
            trigger: "change"
          }
        ]
      },
      paymentTypeData: this.$getDictionaryListByType("cost_payment_type"),
      invoiceData: [
        {
          label: "0",
          value: "是"
        },
        {
          label: "1",
          value: "否"
        }
      ],
      disabState:true,
      isEdit: false,
      isShow: false,
      dialogFormVisible: false,
      formLabelWidth: '120px',
      dialogForm:[],
      queryModel: {
        companyId: "",
        projectId: "",
        contractCode: "",
        code: "",
        name: "",
        instructionCode: "",
        payee: "",
        pageNum: 1,
        pageSize: 20
      },
      applyPaymentDetail: {
        // actualTotalPadAmt:'',  //本次代垫代扣实际总额
        amountPaid: "", //已付金额
        PaymentStatus: "", //支付状态
        workArrivalAmt: "", //工程款抵房款
        isProvideInvoice: "", //是否已提供发票
        id: "", // 付款申请ID
        statusCh: "0", //  审批状态
        //  合同信息
        contractCode: "", // 合同编号
        contractName: "", // 合同名称
        contractDate: "", // 签约日期
        companyId: "", // 部门id
        projectId: "", // 项目id
        projectName: "", // 项目名称
        contractStatus: "", // 合同状态
        contractAmt: "", // 合同金额(元)（A）
        fCompanyName: "", // 法人公司名称
        supplementalContractAmt: "", // 补充合同金额(元)（B）
        totalAlterationVisaAmt: "", // 累计变更签证金额(元)（C）
        alterationAmt: "", // 合同变更金额(元)（D）
        estimatedSettlementAmt: "", // 预计结算金额(元)(E=A+B+C+D)
        //  付款信息
        code: "", // 付款申请编号
        name: "", // 付款申请名称
        payee: "", // 收款单位
        payeeCode: "", // 收款单位id
        payeeBankName: "", // 收款银行
        payeeBankId: "", // 收款银行Id
        payeeAccountNo: "", // 收款账号
        approveStatus: "0", // 审批状态
        payeeCopy: "", //合同收款单位
        //  合同累计付款指标（不含本次）
        totalApplyAmt: "", // 累计已申请金额(元)（F）
        totalApprovedAmt: "", // 累计已批金额(元)（G）
        totalInvoiceAmt: "", // 累计开票金额(元)（H）
        totalPaidAmt: "", // 累计已付金额(元)（I）
        totalApprovedNoPayAmt: "", // 累计已批未付金额(元)（J=G-I）
        totalPayableAmt: "", // 累计应付未付金额(元)（F-I）
        totalApprovedRatio: "", // 累计已批比例（%）（G/E）
        totalPaidRatio: "", // 累计已付比例（%）（I/E）
        totalWaterAmt: "", // 累计水费（元）
        totalElcAmt: "", // 累计电费（元）
        // 本次实付信息
        approvedAmt: "", // 本次申请已批金额(元)
        paidAmt: "", // 本次申请已付金额(元)
        noPayAmt: "", // 本次申请未付金额(元)
        actualPaymentList: [],
        //  附件列表
        attachmentList: [], // 关联附件列表
        //  本次付款
        //  付款类型=预付款
        paymentReasonTypeCode: "", // 付款类型编码
        paymentReasonTypeName: "", // 付款类型名称
        invoiceAmt: "", // 开票总额(元)
        invoiceAmtExcludeTax: "", // 开票金额（不含税）
        applyAmt: "", // 本次申请金额(元)（含税）
        thisApplyAmt: "", // 本次申请总额
        taxRate: "", // 税率
        taxAmt: "", // 税额(元)
        applyAmtExcludeTax: "", // 本次申请金额(元)（不含税）
        paymentTypeCode: "", // 付款方式编码
        paymentTypeName: "", // 付款方式名称
        paymentApplyDept: "", // 用款部门
        operatorName: "", // 经办人
        operatorDate: "", // 提交日期
        //  付款类型=进度款
        paidByOutputValue: false, // 是否关联产值核定
        totalPadAmt: "", // 本次代垫代扣总额
        totalRewardPunishAmt: "", // 本次奖罚总额
        payAmt: "", // 本次应付金额（含税）
        payAmtExcludeTax: "", // 本次应付金额（不含税）
        //  付款类型=结算款
        settlementAmt: "", // 结算金额
        totalApplyOutputAmt: "", // 累计已申请产值总额(元)
        totalActualPaidAmt: "", // 合同累计实际支付金额（元）
        //  产值核定单
        applyPaymentOutputValueCheckModelList: [],
        // 代垫代扣
        applyPaymentPadList: [],
        // 奖罚情况
        applyPaymentRewardPunishList: [],
        // bpm相关
        contractType: "",
        // 质保金相关
        maintain: "", // 有无维修事项
        unpaidAmt: "", // 本次支付后尚余款项
        waterAmt: "", // 水费
        elcAmt: "", // 电费
        punishAmt: "", // 罚款
        otherAmt: "", // 其他
        // payAmt: "", // 实际支付金额
        supplierBankNumber: {}, // 银行帐号
        costRelateFlowList: [], // 关联流程
        remark: ""
      },
      padList: [], // 代垫代扣列表
      isShowContract: false,
      supplierBankInfo: [],
      supplierBankNumberList: [],
      moduleCode: COSTENUM.module.APPLY_PAYMENT_CONTRACT,
      selectedRows: [],
      bankInfoLoading: false,
      bankInfoList: [],
      bankNumberList: [],
      showBank: false,
      submitDisabled: true,
      flag: false,
      bpmUrl: "",
      wangCode: "",
      paymentConstruction: false
    };
  },
  // applyPaymentDetail
  mounted: function() {
    this.isEdit = this.$route.query.isEdit.toString() === "true";
    this.isShow = this.$route.query.isShow.toString() === "true";
    // alert(this.$route.query.isShow)
    if (!this.isEdit) {
      this.isShowSubmit = false;
      this.isStatus = false;
      this.disabState = false
    } else {
      this.isStatus = true;
      this.disabState = true
    }

    if (!this.isShow) {
      this.isStatus = false;
      this.isShowSubmit = false;
    } else {
      this.isStatus = true;
    }

    if (this.$route.query.id) {
      this.submitDisabled = false;
      LoadingUtil.showLoading();
      getApplyPaymentDetail({
        id: this.$route.query.id
      })
        .then(res => {
          LoadingUtil.hideLoading();
          this.applyPaymentDetail = res.data;
          // 查看页面，只显示已勾选的代垫代扣
          if (!this.isEdit) {
            let padList = this.applyPaymentDetail.applyPaymentPadList;
            if (padList) {
              this.applyPaymentDetail.applyPaymentPadList = padList.filter(
                v => {
                  return v.checked;
                }
              );
            }
          }
          // alert(this.applyPaymentDetail.taxRate)
          if(this.applyPaymentDetail.taxRate == null){
            this.applyPaymentDetail.taxRate = 0
          }
          if(this.applyPaymentDetail.taxAmt == null){
            this.applyPaymentDetail.taxAmt = '0'
          }
          this.applyPaymentDetail.supplierBankNumber = {};
          this.getSupplierBankInfo();
          this.applyPaymentDetail.taxRate = this.applyPaymentDetail.taxRate.toString();
          if (
            this.applyPaymentDetail.paymentReasonTypeCode ===
            this.paymentType.PROGRESS.code
          ) {
            // 付款类型：进度款
            this.$nextTick(() => {
              this.initPadSelection();
            });
          }
          if (this.applyPaymentDetail.applyPaymentRewardPunishList) {
            this.applyPaymentDetail.applyPaymentRewardPunishList.forEach(
              item => {
                this.$set(item, "rowId", uuidv1());
              }
            );
          }
          this.bpmUrl = res.data.bpmUrl;
          if (this.bpmUrl != "") {
            this.flag = true;
          }
          if (this.applyPaymentDetail.paymentTypeCode == "3") {
            this.paymentConstruction = true;
          } else {
            this.paymentConstruction = false;
          }

          let applyPayment = this.applyPaymentDetail;
          if ( applyPayment.contractType == "0" || applyPayment.contractType == "1" || applyPayment.contractType == "5") {
            this.invoicenone = false;
          } else {
            this.invoicenone = true;
          }

          if (applyPayment.isProvideInvoice == "0") {
            this.invoiceAmtFlag = true;
          } else {
            this.invoiceAmtFlag = false;
          }
          if (
            applyPayment.approveStatus == "2" ||
            applyPayment.approveStatus == "1"
          ) {
            this.print = true;
          }
          let newNum = this.applyPaymentDetail.applyAmt - this.applyPaymentDetail.totalPadAmt
          if(this.applyPaymentDetail.approveStatus  === this.auditStatus.AUDITED.code){
            if(this.applyPaymentDetail.paidAmt >= newNum){
              this.applyPaymentDetail.PaymentStatus = '全部支付'
            }else if(this.applyPaymentDetail.paidAmt && this.applyPaymentDetail.paidAmt != '0' < newNum){
              this.applyPaymentDetail.PaymentStatus = '部分支付'
            }else if(this.applyPaymentDetail.paidAmt == '0'){
              this.applyPaymentDetail.PaymentStatus ='未支付'
            }
          }else{
            this.applyPaymentDetail.PaymentStatus = '未支付'
          }
        })
        .catch(err => {
          console.log(err);
        });
    } else {
      // 新增页面
      this.applyPaymentDetail.operatorName = this.$getUserInfo()["nickName"];
      this.applyPaymentDetail.operatorDate = new Date();
    }
  },
  methods: {
    payClick(row,index){
      LoadingUtil.showLoading();
      // console.log(row)
      // console.log(index)
      getApplyPaymentPadDetail({
        padId: row.id
      }).then(res => {
          // console.log(res)
          if(res.data != ''){
            this.dialogFormVisible = true
            this.dialogForm = res.data;
          }else{
            this.$showError('没有明细数据')
          }
          LoadingUtil.hideLoading();
        })
        .catch(err => {
          console.log(err);
      });
    },
    printWeb() {
      let param = {
        billid: this.applyPaymentDetail.id
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
    rule(){
      let add1 = Number(calc.Add(this.applyAmt, this.applyPaymentDetail.totalApplyAmt));
      let add2 = Number(calc.Add(this.applyPaymentDetail.invoiceAmt,this.applyPaymentDetail.totalInvoiceAmt));
      if (
       ( this.applyPaymentDetail.paymentReasonTypeCode ===
          this.paymentType.PROGRESS.code ||
        this.applyPaymentDetail.paymentReasonTypeCode ===
          this.paymentType.COMPLETION.code ||
        this.applyPaymentDetail.paymentReasonTypeCode ===
          this.paymentType.SETTLEMENT.code) && 
          (this.applyPaymentDetail.contractType !== 
                '0' && this.applyPaymentDetail.contractType !== 
                '1' && this.applyPaymentDetail.contractType !== 
                '5')
      ) {
        if (add1 > add2) {
          
          // this.$showError("本次应付金额+累计已批金额应小于等于本次开票金额+累计开票金额")
          this.$showError("本次申请金额+累计已申请金额应小于等于本次开票金额+累计开票金额")
          return
        }
      }
    },
    changeTaxRate(e) {
      this.applyPaymentDetail.taxRate = e;
      let tax = 0;
      if (
        this.applyPaymentDetail.paymentReasonTypeCode !==
        this.paymentType.WARRANTY.code
      ) {
        // 税额=本次开票金额/（1+税率）* 税率；
        tax =
          (Number(this.applyPaymentDetail.invoiceAmt) /
            (1 + Number(this.applyPaymentDetail.taxRate))) *
          Number(this.applyPaymentDetail.taxRate);
      }
      this.applyPaymentDetail.taxAmt = tax.toFixed(2);
    },
    changePayment(e) {
      if (e == "3") {
        this.paymentConstruction = true;
      } else {
        this.paymentConstruction = false;
      }
    },
    random() {
      let num = "";
      for (var i = 0; i < 5; i++) {
        num += Math.floor(Math.random() * 10);
      }
      return num;
    },
    newSave() {
      var arr = this.applyPaymentDetail.actualPaymentList;
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
      // console.log(flag)
      if (flag == true) {
        additionalRecordingActualPayment(this.applyPaymentDetail)
          .then(res => {
            if (res.code === "2000") {
              // alert('111')
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
      this.applyPaymentDetail.actualPaymentList.push(newData);
    },
    deleteRow(index, rows) {
      rows.splice(index, 1);
    },
    // 给列添加class类名，类名为cost-table-header-required，已定义全局样式
    rowClassName({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 5) {
        // 列下标
        return "cost-table-header-required";
      }
    },
    rowClassName2({ row, column, rowIndex, columnIndex }) {
      if (columnIndex >= 2 && columnIndex <= 5) {
        return "cost-table-header-required";
      }
    },
    changeAttachments(data) {
      this.applyPaymentDetail.attachmentList = data;
    },
    // 返回
    goback() {
      this.$router.push({
        name: "ApplyPaymentContractList"
      });
    },
    // 选择合同
    handleSelectContract() {
      this.isShowContract = true;
    },
    // 关闭选择合同弹出框
    cancelDialog(data) {
      this.isShowContract = data;
    },
    // 关闭选择合同弹出框
    closeDialog(data) {
      this.isShowContract = data;
    },
    // 选择合同
    confirmContract(data) {
      this.applyPaymentDetail.contractCode = data.contractCode;
      /*  this.applyPaymentDetail.supplementalContractAmt = data.supplementContractAmountAndAudited
                this.applyPaymentDetail.totalAlterationVisaAmt = data.totalCostAmtIsNotBudgetConveySure
                this.applyPaymentDetail.alterationAmt = data.alterationSumAmt
                this.applyPaymentDetail.contractType = data.contractType // 合同类型
                this.applyPaymentDetail.payee = data.partyBName // 收款单位，取乙方
                this.applyPaymentDetail.payeeCode = data.partyB // 收款单位id
                this.applyPaymentDetail.contractAmt = data.businessContractAmount*/
      this.getContractDetail();
      this.getInfoByContract();
      // 获取合同编码
      this.getApplyPaymentCode();
      // this.remoteQueryBankInfo(this.applyPaymentDetail.payeeBankName)
      // 选择后清空收款银行以及收款帐号信息
      this.applyPaymentDetail.payeeBankName = "";
      this.applyPaymentDetail.payeeAccountNo = "";
    },
    getContractDetail() {
      LoadingUtil.showLoading();
      // 获取合同相关信息
      getDetailByContractCode({
        contractCode: this.applyPaymentDetail.contractCode
      })
        .then(res => {
          // alert(res.data.contractType)
          LoadingUtil.hideLoading();
          this.applyPaymentDetail.supplementalContractAmt =
            res.data.businessSupplementContractAmount;
          this.applyPaymentDetail.totalAlterationVisaAmt =
            res.data.totalCostAmtIsNotBudgetConveySure;
          this.applyPaymentDetail.alterationAmt =
            res.data.alterationSumAmtIsBudgetConveySure;
          this.applyPaymentDetail.contractType = res.data.contractType; // 合同类型
          this.applyPaymentDetail.payee = res.data.partyBName; // 收款单位，取乙方
          this.applyPaymentDetail.payeeCode = res.data.partyB; // 收款单位id
          this.applyPaymentDetail.contractAmt = res.data.businessContractAmount;
          if (
            this.applyPaymentDetail.contractType == "0" ||
            this.applyPaymentDetail.contractType == "1" ||
            this.applyPaymentDetail.contractType == "5"
          ) {
            this.invoicenone = false;
          } else {
            this.invoicenone = true;
            this.applyPaymentDetail.isProvideInvoice = "1";
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 生成合同编码
    getApplyPaymentCode() {
      getApplyPaymentCode({
        contractCode: this.applyPaymentDetail.contractCode
      })
        .then(res => {
          if (res.code === "2000") {
            this.applyPaymentDetail.code = res.data;
          } else {
            this.$showError(res.message);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 获取合同相关信息
    getInfoByContract() {
      LoadingUtil.showLoading();
      // 获取合同相关信息
      findByContractCode({
        contractCode: this.applyPaymentDetail.contractCode,
        paymentReasonTypeCode: this.applyPaymentDetail.paymentReasonTypeCode,
        applyPaymentCode: this.applyPaymentDetail.applyPaymentCode
      })
        .then(res => {
          LoadingUtil.hideLoading();
          // 合同相关信息
          this.applyPaymentDetail.contractName = res.data.contractName;
          this.applyPaymentDetail.contractDate = res.data.contractDate;
          this.applyPaymentDetail.companyId = res.data.companyId;
          this.applyPaymentDetail.projectId = res.data.projectId;
          this.applyPaymentDetail.projectName = res.data.projectName;
          this.applyPaymentDetail.contractStatus = res.data.contractStatus;
          this.applyPaymentDetail.contractAmt = res.data.contractAmt;
          this.applyPaymentDetail.fCompanyName = res.data.fCompanyName;
          this.applyPaymentDetail.settlementAmt = res.data.settlementAmt;
          // 累积付款指标
          this.applyPaymentDetail.totalApplyAmt = res.data.totalApplyAmt;
          this.applyPaymentDetail.totalApprovedAmt = res.data.totalApprovedAmt;
          // this.applyPaymentDetail.totalApprovedAmt = '2000';
          this.applyPaymentDetail.totalInvoiceAmt = res.data.totalInvoiceAmt;
          this.applyPaymentDetail.totalPaidAmt = res.data.totalPaidAmt;
          this.applyPaymentDetail.totalApprovedNoPayAmt =
            res.data.totalApprovedNoPayAmt;
          this.applyPaymentDetail.totalPayableAmt = res.data.totalPayableAmt;
          this.applyPaymentDetail.totalApprovedRatio =
            res.data.totalApprovedRatio;
          this.applyPaymentDetail.totalPaidRatio = res.data.totalPaidRatio;
          this.applyPaymentDetail.totalWaterAmt = res.data.totalWaterAmt;
          this.applyPaymentDetail.totalElcAmt = res.data.totalElcAmt;
          // 付款信息
          this.applyPaymentDetail.supplierBankNumber = {};
          this.applyPaymentDetail.paidByOutputValue =
            res.data.paidByOutputValue;
          this.applyPaymentDetail.applyPaymentPadList =
            res.data.applyPaymentPadList;
          // this.applyPaymentDetail.totalPadAmt = res.data.totalPadAmt;
          if (res.data.applyPaymentOutputValueCheckModelList) {
            this.applyPaymentDetail.applyPaymentOutputValueCheckModelList = res.data.applyPaymentOutputValueCheckModelList.map(
              v => {
                return {
                  ...v,
                  applyAmt: ""
                };
              }
            );
          }
          // 初始化代垫代扣table
          if (
            this.applyPaymentDetail.paymentReasonTypeCode ===
              this.paymentType.PROGRESS.code ||
            this.applyPaymentDetail.paymentReasonTypeCode ===
              this.paymentType.COMPLETION.code
          ) {
            this.$nextTick(() => {
              this.initPadSelection();
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 勾选代垫代扣
    changeSelect(val) {
      this.padList = [];
      console.log('val')
      console.log(val)
      val.forEach(item => {
        this.padList.push({
          applyPaymentId: item.applyPaymentId,
          applyPaymentPadId: item.id,
          contractCode: item.contractCode,
          deductionAmt: item.deductionAmt,
        });
      });
      this.calTotalPadAmt();
    },
    handleChange(w) {
      // console.log(w)
      if (w == "0") {
        // this.invoicenone = true
        this.invoiceAmtFlag = true;
        this.applyPaymentDetail.invoiceAmt = "";
      } else {
        // this.invoicenone = false
        this.invoiceAmtFlag = false;
      }
    },
    // 选择付款类型
    handleChangePaymentType(v) {
      // alert(v)
      this.applyPaymentDetail.invoiceAmt = "";
      this.applyPaymentDetail.applyAmt = "";
      this.wangCode = v;
      if (
        v !== this.paymentType.PREPAYMENTS.code &&
        this.applyPaymentDetail.contractCode
      ) {
        // 非预付款则获取代垫代扣相关信息
        this.getInfoByContract();
      }
      if (
        v === this.paymentType.PROGRESS.code ||
        v === this.paymentType.COMPLETION.code
      ) {
        // 如果是进度款，渲染代垫代扣列表
        this.$nextTick(() => {
          this.initPadSelection();
        });
      }
    },
    // 初始化代垫代扣勾选
    initPadSelection() {
      if (this.applyPaymentDetail.applyPaymentPadList) {
        if (this.applyPaymentDetail.id !== "") {
          // 更新
          this.applyPaymentDetail.applyPaymentPadList.forEach(item => {
            if (item.checked) {
              this.$refs.padTable.toggleRowSelection(item);
            }
          });
        } else {
          // 新增默认全部勾选
          this.applyPaymentDetail.applyPaymentPadList.forEach(item => {
            this.$refs.padTable.toggleRowSelection(item);
          });
        }
      }
    },
    // 保存
    save() {
      // alert(this.applyPaymentDetail.applyAmt)
      let add1 = Number(calc.Add(this.applyPaymentDetail.applyAmt, this.applyPaymentDetail.totalApplyAmt));
      let add2 = Number(calc.Add(this.applyPaymentDetail.invoiceAmt,this.applyPaymentDetail.totalInvoiceAmt));
      this.$refs["applyPaymentDetail"].validate(valid => {
        if (valid) {
          // 组装保存数据
          // 如果是结算款，将剩余的代垫代扣保存
          if (
            this.applyPaymentDetail.paymentReasonTypeCode ===
            this.paymentType.SETTLEMENT.code
          ) {
            this.padList = [];
            this.applyPaymentDetail.applyPaymentPadList.forEach(item => {
              this.padList.push({
                applyPaymentId: item.applyPaymentId,
                applyPaymentPadId: item.id,
                contractCode: item.contractCode,
                deductionAmt: item.deductionAmt,
                actualPadPaymentAmount:item.remainingPaymentAmount
              });
            });
          }
          console.log('55555')
          console.log(this.applyPaymentDetail.applyPaymentPadList)
          this.applyPaymentDetail.applyPaymentContractPadList = this.padList;
          this.applyPaymentDetail.applyPaymentOutputValueCheckList = this.applyPaymentDetail.applyPaymentOutputValueCheckModelList;
          // 收款银行
          this.applyPaymentDetail.supplierBankNumber.accountNumber = this.applyPaymentDetail.payeeAccountNo;
          this.applyPaymentDetail.supplierBankNumber.supplierId = this.applyPaymentDetail.payeeCode;
          this.applyPaymentDetail.supplierBankNumber.accountName = "";
          if(this.applyPaymentDetail.taxRate == null || this.applyPaymentDetail.taxRate == ''){
            this.applyPaymentDetail.taxRate = 0
          }
          
          if (this.applyPaymentDetail.id === "") {
            console.log("*****************1111111111111111111");
            console.log(this.applyPaymentDetail.invoiceAmt);
            if (
              this.applyPaymentDetail.invoiceAmt &&
              this.applyPaymentDetail.invoiceAmt < "0" &&
              this.wangCode !== "4"
            ) {
              this.$showError("本次开票金额不能为负数");
              return;
            }
            // alert(add1)
            // alert(add2)
            if (
            ( this.applyPaymentDetail.paymentReasonTypeCode ===
                this.paymentType.PROGRESS.code ||
              this.applyPaymentDetail.paymentReasonTypeCode ===
                this.paymentType.COMPLETION.code ||
              this.applyPaymentDetail.paymentReasonTypeCode ===
                this.paymentType.SETTLEMENT.code) && 
                (this.applyPaymentDetail.contractType !== 
                      '0' && this.applyPaymentDetail.contractType !== 
                      '1' && this.applyPaymentDetail.contractType !== 
                      '5')
            ) {
              if (add1 > add2) {
                this.$showError("本次申请金额+累计已申请金额应小于等于本次开票金额+累计开票金额")
                return
              }
            }
            LoadingUtil.showLoading();
            saveApplyPayment(this.applyPaymentDetail)
              .then(res => {
                LoadingUtil.hideLoading();
                if (res.code === "2000") {
                  // alert(111)
                  this.$showSuccess(res.message);
                  this.submitDisabled = false;
                  this.applyPaymentDetail.id = res.data.applyPaymentId;
                } else {
                  this.submitDisabled = true;
                  this.$showError(res.message);
                }
              })
              .catch(err => {
                console.log(err);
                this.submitDisabled = true;
              });
          } else {
            console.log("*****************222222222222222222222");
            console.log(this.applyPaymentDetail.invoiceAmt);
            if (
              this.applyPaymentDetail.invoiceAmt &&
              this.applyPaymentDetail.invoiceAmt < "0" &&
              this.wangCode !== "4"
            ) {
              this.$showError("本次开票金额不能为负数");
              return;
            }
            if (
            ( this.applyPaymentDetail.paymentReasonTypeCode ===
                this.paymentType.PROGRESS.code ||
              this.applyPaymentDetail.paymentReasonTypeCode ===
                this.paymentType.COMPLETION.code ||
              this.applyPaymentDetail.paymentReasonTypeCode ===
                this.paymentType.SETTLEMENT.code) && 
                (this.applyPaymentDetail.contractType !== 
                      '0' && this.applyPaymentDetail.contractType !== 
                      '1' && this.applyPaymentDetail.contractType !== 
                      '5')
            ) {
              if (add1 > add2) {
                this.$showError("本次申请金额+累计已申请金额应小于等于本次开票金额+累计开票金额")
                return
              }
            }
            LoadingUtil.hideLoading();
            updateApplyPayment(this.applyPaymentDetail)
              .then(res => {
                if (res.code === "2000") {
                  this.$showSuccess(res.message);
                  this.submitDisabled = false;
                } else {
                  this.$showError(res.message);
                  this.submitDisabled = true;
                }
              })
              .catch(err => {
                console.log(err);
                this.submitDisabled = true;
              });
          }
        }
      });
    },
    // 奖罚情况新增行
    addRow() {
      this.applyPaymentDetail.applyPaymentRewardPunishList.push({
        rowId: uuidv1(),
        rewardPunishTypeCode: "", // 奖罚类型名称
        rewardPunishTypeName: "", // 奖罚类型
        rewardPunishUnit: "", // 奖罚单位
        rewardPunishReason: "", // 奖罚事项
        applyAmt: "", // 申请金额
        remark: "", // 备注
        primaryIsAdd: true
      });
    },
    deleteRows() {
      // 原数组
      let table = this.applyPaymentDetail.applyPaymentRewardPunishList;
      // 勾选的要删除的数组
      let deleteTable = this.selectedRows;
      deleteTable.forEach((deleteItem, deleteIndex) => {
        table.forEach((item, index, array) => {
          if (item.rowId === deleteItem.rowId) {
            array.splice(index, 1);
          }
        });
      });
      this.$refs.rewardPunishTable.clearSelection();
    },
    handleSelectionChange(val) {
      this.selectedRows = val;
    },
    // 计算代垫代扣总额
    calTotalPadAmt() {
      let arr = this.padList;
      let total = 0;
      if (arr && arr.length > 0) {
        arr.forEach(item => {
          total += Number(item.deductionAmt);
        });
      }
      this.applyPaymentDetail.totalPadAmt = total.toFixed(2);
    },
    newSubmit(){
      LoadingUtil.showLoading();
      // this.submitDisabled = false;
      zfinancialSubmit(this.applyPaymentDetail).then(res=>{
        LoadingUtil.hideLoading();
        if (res.code === "2000") {
          this.$showSuccess(res.message);
          this.$router.push({
            name: "ApplyPaymentContractList"
          });
        } else {
          this.$showError(res.message);
        }
      }).catch(err => {
        console.log(err);
      });
    },
    // 提交审核
    handleBpmSubmit() {
      this.submitDisabled = true;
      if (!this.applyPaymentDetail.id) {
        this.submitDisabled = false;
        this.$showError("请先保存");
        return;
      }
      if (
        this.applyPaymentDetail.invoiceAmt &&
        this.applyPaymentDetail.invoiceAmt < "0" &&
        this.wangCode !== "4"
      ) {
        this.$showError("本次开票金额不能为负数");
        return;
      }
      this.applyPaymentDetail.payAmt = this.payAmt;
      if(this.applyPaymentDetail.taxRate == null || this.applyPaymentDetail.taxRate == ''){
        this.applyPaymentDetail.taxRate = 0
      }
      this.$refs["applyPaymentDetail"].validate(valid => {
        if (valid) {
          LoadingUtil.showLoading();
          submitApplyPayment(this.applyPaymentDetail)
            .then(res => {
              LoadingUtil.hideLoading();
              if (res.code === "2000") {
                this.$showSuccess(res.message);
                this.$router.push({
                  name: "ApplyPaymentContractList"
                });
              } else {
                this.$showError(res.message);
              }
            })
            .catch(err => {
              console.log(err);
            });
        } else {
          this.submitDisabled = false;
        }
      });
    },
    flow(data) {
      this.applyPaymentDetail.costRelateFlowList = data;
    },
    // 金额转大写
    changeMoneyToChinese(n) {
      var fraction = ["角", "分"];
      var digit = ["零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖"];
      var unit = [["圆", "万", "亿"], ["", "拾", "佰", "仟"]];
      var head = n < 0 ? "欠" : "";
      n = Math.abs(n);
      var s = "";
      for (var i = 0; i < fraction.length; i++) {
        s += (
          digit[Math.floor(n * 10 * Math.pow(10, i)) % 10] + fraction[i]
        ).replace(/零./, "");
      }
      s = s || "整";
      n = Math.floor(n);
      for (var i = 0; i < unit[0].length && n > 0; i++) {
        var p = "";
        for (var j = 0; j < unit[1].length && n > 0; j++) {
          p = digit[n % 10] + unit[1][j] + p;
          n = Math.floor(n / 10);
        }
        s = p.replace(/(零.)*零$/, "").replace(/^$/, "零") + unit[0][i] + s;
      }
      return (
        head +
        s
          .replace(/(零.)*零元/, "元")
          .replace(/(零.)+/g, "零")
          .replace(/^整$/, "零圆整")
      );
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
      this.applyPaymentDetail.payeeBankName = data.name;
      this.applyPaymentDetail.supplierBankNumber.bankName = data.name;
      this.applyPaymentDetail.supplierBankNumber.bankdocId = data.bankDocId;
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
    // 获取收款信息
    getSupplierBankInfo() {
      getBankInfo({
        bankName: this.applyPaymentDetail.payeeBankName
      })
        .then(res => {
          if (res.code === "2000") {
            let bank = res.data[0];
            this.applyPaymentDetail.supplierBankNumber.bankdocId =
              bank.bankDocId;
            this.getAccountInfoByBankDocId(bank.bankDocId);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    queryBankNumber(queryString, cb) {
      let numberList = this.bankNumberList;
      let results = queryString
        ? numberList.filter(item => item.value.indexOf(queryString) === 0)
        : numberList;
      cb(results);
    }
  },
  computed: {
    isHaveTo: function() {
      return this.applyPaymentDetail.isProvideInvoice == "1";
    },
    // 控制button显隐
    showButto() {
      return (
        this.isEdit &&
        (this.applyPaymentDetail.approveStatus ===
          this.auditStatus.DRAFT.code ||
          this.applyPaymentDetail.approveStatus ===
            this.auditStatus.REJECT.code)
      );
    },
    // 预计结算金额(元)(E=A+B+C+D)
    estimatedSettlementAmt() {
      return (
        Number(this.applyPaymentDetail.contractAmt) +
        Number(this.applyPaymentDetail.supplementalContractAmt) +
        Number(this.applyPaymentDetail.totalAlterationVisaAmt) +
        Number(this.applyPaymentDetail.alterationAmt)
      ).toFixed(2);
    },
    // 税额
    // tax() {
    //   let tax = 0;
    //   if (
    //     this.applyPaymentDetail.paymentReasonTypeCode !==
    //     this.paymentType.WARRANTY.code
    //   ) {
    //     // 税额=本次开票金额/（1+税率）* 税率；
    //     tax =
    //       Number(this.applyPaymentDetail.invoiceAmt) /
    //       (1 + Number(this.applyPaymentDetail.taxRate)) *
    //       Number(this.applyPaymentDetail.taxRate);
    //   }
    //   return (this.applyPaymentDetail.tax = tax.toFixed(2));
    // },
    // 本次开票金额（不含税）
    invoiceAmtExcludeTax() {
      let invoiceAmtExcludeTax = (
        this.applyPaymentDetail.invoiceAmt - this.applyPaymentDetail.taxAmt
      ).toFixed(2);
      return (this.applyPaymentDetail.invoiceAmtExcludeTax = invoiceAmtExcludeTax);
    },
    // 本次申请金额
    applyAmt() {
      if (
        this.applyPaymentDetail.paymentReasonTypeCode ===
        this.paymentType.PREPAYMENTS.code
      ) {
        // 预付款
        // 自动计算=发票金额
        return (this.applyPaymentDetail.applyAmt = Number(
          this.applyPaymentDetail.invoiceAmt
        ).toFixed(2));
      } else if (
        this.applyPaymentDetail.paymentReasonTypeCode ===
        this.paymentType.PROGRESS.code
      ) {
        // 进度款
        if (this.applyPaymentDetail.paidByOutputValue) {
          // 根据产值中填写的本次申请金额汇总得出
          let applyAmt = 0;
          if (this.applyPaymentDetail.applyPaymentOutputValueCheckModelList) {
            this.applyPaymentDetail.applyPaymentOutputValueCheckModelList.forEach(
              item => {
                applyAmt += Number(item.applyAmt) || 0;
              }
            );
          }
          return (this.applyPaymentDetail.applyAmt = applyAmt.toFixed(2));
        }
      } else {
        return this.applyPaymentDetail.applyAmt;
      }
    },
    // 本次应付金额（含税）
    payAmt() {
      let payAmt = 0;
      if (
        this.applyPaymentDetail.paymentReasonTypeCode ===
          this.paymentType.PROGRESS.code ||
        this.applyPaymentDetail.paymentReasonTypeCode ===
          this.paymentType.COMPLETION.code ||
        this.applyPaymentDetail.paymentReasonTypeCode ===
          this.paymentType.SETTLEMENT.code
      ) {
        // 付款类型：进度款 或者 完工验收款 或者 结算款
        // 本次申请总额-本次代垫代扣总额+本次奖罚总额（扣款为负，奖励为正）
        // 原公式
        //   payAmt =
        //     Number(this.applyPaymentDetail.applyAmt) -
        //     Number(this.applyPaymentDetail.totalPadAmt) +
        //     Number(this.applyPaymentDetail.totalRewardPunishAmt);
        // }
        payAmt =
          Number(this.applyPaymentDetail.applyAmt) -
          Number(this.applyPaymentDetail.totalPadAmt);
      }
      payAmt = payAmt.toFixed(2);
      return payAmt;
    },
    applyAmtCapital() {
      return this.changeMoneyToChinese(this.applyPaymentDetail.applyAmt);
    },
    unpaidAmt() {
      return this.changeMoneyToChinese(this.applyPaymentDetail.unpaidAmt);
    },
    payAmtCapital() {
      return this.changeMoneyToChinese(this.applyPaymentDetail.payAmt);
    },
    // 奖罚总额
    totalRewardPunishAmt() {
      let arr = this.applyPaymentDetail.applyPaymentRewardPunishList;
      let total = 0;
      if (arr && arr.length > 0) {
        arr.forEach((item, index, array) => {
          if (item.rewardPunishTypeCode === "0") {
            // 扣款
            total -= Number(item.applyAmt);
          } else if (item.rewardPunishTypeCode === "1") {
            // 奖励
            total += Number(item.applyAmt);
          }
        });
      }
      return (this.applyPaymentDetail.totalRewardPunishAmt = total.toFixed(2));
    }
  },
  watch: {
    "applyPaymentDetail.isProvideInvoice":function(newValue,oldValue){
      if(newValue == "0" && this.applyPaymentDetail.paymentReasonTypeCode == '1' && this.isEdit == true) {
        this.disabState = false
      }else{
        this.disabState = true
      }
    },
    "applyPaymentDetail.paymentReasonTypeCode":function(newValue,oldValue){
      if(newValue == '1' && this.applyPaymentDetail.isProvideInvoice == '0' && this.isEdit == true){
        this.disabState = false
      }else{
        this.disabState = true
      }
    },
    "applyPaymentDetail.contractStatus": function(newValue, oldValue) {
      if (newValue !== "2") {
        // 如果合同状态不是已结算状态，付款类型中的结算款、质保金不可选
        this.paymentTypeData = this.paymentTypeData.filter(
          (item, index, array) => {
            return !(
              item.dictValue === this.paymentType.SETTLEMENT.code ||
              item.dictValue === this.paymentType.WARRANTY.code
            );
          }
        );
        if (
          this.applyPaymentDetail.paymentReasonTypeCode ===
            this.paymentType.SETTLEMENT.code ||
          this.applyPaymentDetail.paymentReasonTypeCode ===
            this.paymentType.WARRANTY.code
        ) {
          // 如果选了结算款、质保金，置空
          this.applyPaymentDetail.paymentReasonTypeCode = "";
        }
      } else {
        this.paymentTypeData = this.$getDictionaryListByType(
          "cost_payment_type"
        );
      }
    }
    /*'applyPaymentDetail.invoiceAmt': function(newValue, oldeValue) {
              if (this.applyPaymentDetail.paymentReasonTypeCode === this.paymentType.PROGRESS.code) {
                  this.$refs['applyPaymentDetail'].validateField('payAmt')
              }
            }*/
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
.cur{
  cursor: pointer;
}
</style>
