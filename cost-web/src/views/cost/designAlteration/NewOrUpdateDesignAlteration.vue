<template>
    <div class='app-container'>

        <div style="text-align:right; margin:10px 0;">
            <el-button size="mini"
                       class="ordinary-btn"
                       v-if="!$store.state.user.isFromBpm"
                       @click='handleBack'>{{$l("btn_back")}}</el-button>
            <el-button size="mini"
                       class="special-btn"
                       type='primary'
                       :disabled="buttonDisable"
                       v-show="isShowSubmit"
                       @click='saveDesignAlteration'>{{$l('btn_save')}}</el-button>
            <el-button size="mini"
                       class="special-btn"
                       type='primary'
                       @click='submitModel'
                       v-show="isShowSubmit"
                       :disabled="buttonDis">{{$l('lbl_cost_compilation_submit')}}</el-button>
        </div>
        <el-steps :active="active"
                  :align-center="true"
                  space="70%"
                  style="margin: 15px 0;">
            <el-step title="设计变更申请"
                     :style="{'cursor':'pointer'}"></el-step>
            <el-step title="指令单下发"
                     :style="{'cursor':'pointer'}">

                <template slot='icon'>
                    <div v-show="true">
                        <el-dropdown>
                            <span class="el-dropdown-link">
                                2
                            </span>
                            <el-dropdown-menu slot="dropdown">

                                <el-dropdown-item v-for="(item, index) in instructShows"
                                                  :key="item.id">
                                    <span @click="gotoInstruct(item)">{{item.code}}</span>
                                </el-dropdown-item>
                            </el-dropdown-menu>

                        </el-dropdown>
                    </div>
                    <div v-show="false"
                         style="color: blue">
                        2
                    </div>
                </template>

            </el-step>
            <el-step title="完工确认"
                     :style="{'cursor':'pointer'}">

                <template slot='icon'>
                    <div v-show="true">
                        <el-dropdown>
                            <span class="el-dropdown-link">
                                3
                            </span>
                            <el-dropdown-menu slot="dropdown">

                                <el-dropdown-item v-for="(item, index) in completionShows"
                                                  :key="item.id">
                                    <span @click="gotoCompletion(item)">{{item.code}}</span>
                                </el-dropdown-item>
                            </el-dropdown-menu>

                        </el-dropdown>
                    </div>
                    <div v-show="false"
                         style="color: blue">
                        3
                    </div>
                </template>

            </el-step>
            <el-step title="造价确认"
                     :style="{'cursor':'pointer'}">

                <template slot='icon'>
                    <div v-show="true">
                        <el-dropdown>
                            <span class="el-dropdown-link">
                                4
                            </span>
                            <el-dropdown-menu slot="dropdown">

                                <el-dropdown-item v-for="(item, index) in costShows"
                                                  :key="item.id">
                                    <span @click="gotoCost(item)">{{item.code}}</span>
                                </el-dropdown-item>
                            </el-dropdown-menu>

                        </el-dropdown>
                    </div>
                    <div v-show="false"
                         style="color: blue">
                        4
                    </div>
                </template>

            </el-step>
        </el-steps>

        <div class="form-unit">基本信息</div>

        <el-form label-width='150px'
                 :disabled="allButtonDisable"
                 status-icon
                 :model="designAlterationModel"
                 ref="designAlterationModel"
                 :rules="rules"
                 size="mini">

            <el-row>
                <!-- 项目名称 -->
                <!--<ProjectSelector v-model='project' :show="show" :span="{'project':8}" :labelWidth="{'project':150}"></ProjectSelector>-->

                <ProjectAccountSelect v-model="project"
                                      :span="{ project: 8}"
                                      :show="show"
                                      :clearable="{ project: false, accObj: false }"
                                      :labelWidth="{project: 150}">
                </ProjectAccountSelect>

                <!--<ProjectAccountSelect v-model="project"-->
                <!--:show="show"-->
                <!--:span="{project: 8}"-->
                <!--:labelWidth="{project: 150}"-->
                <!--:disabled="{project: false , accObj:false}"/>-->

                <el-col :span="8">
                    <el-form-item :label="'设计变更编号：'"
                                  prop="code">
                        <el-input v-model="designAlterationModel.code"
                                  :disabled="true"></el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="8">
                    <el-form-item :label="'设计变更名称：'"
                                  prop="name">
                        <el-input v-model="designAlterationModel.name"
                                  :disabled="buttonDisable"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="8">
                    <el-form-item :label="'设计变更原因：'"
                                  prop="reasonTypeCode">
                        <fd-select v-model='designAlterationModel.reasonTypeCode'
                                   type="cost_reasonType_code"
                                   :disabled="buttonDisable"></fd-select>
                    </el-form-item>
                </el-col>

                <el-col :span="8">
                    <el-form-item :label="'专业类型：'"
                                  prop="specialityType">
                        <fd-select v-model='designAlterationModel.specialityType'
                                   type="cost_dal_specialType"
                                   :disabled="buttonDisable"></fd-select>
                    </el-form-item>
                </el-col>

                <el-col :span="8">
                    <el-form-item :label="'预估金额(元)：'"
                                  prop="estimatedAmt">
                        <el-input v-model='designAlterationModel.estimatedAmt'
                                  :disabled="true"></el-input>
                        <!-- <el-input-number v-model='designAlterationModel.estimatedAmt'
                                  :disabled="estima" :precision="2" :controls="false" style="width: 100%;"></el-input-number> -->
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="8">
                    <el-form-item :label="'责任部门：'"
                                  prop="accountabilityUnit">
                        <fd-select v-model='designAlterationModel.accountabilityUnit'
                                   type="cost_subject_responsible_dept_code"
                                   :disabled="buttonDisable"></fd-select>
                    </el-form-item>
                </el-col>

              <el-col :span="8">
                <el-form-item :label="'经办人：'">
                  <el-input v-model='designAlterationModel.operatorName'
                            :disabled="true"></el-input>
                </el-form-item>
              </el-col>

              <el-col :span="8">
                <el-form-item :label="'提交日期：'">
                  <el-date-picker v-model='designAlterationModel.operatorDate'
                                  :disabled="true"
                                  type="date">
                  </el-date-picker>
                </el-form-item>
              </el-col>

                <!--<el-col :span="8">-->
                <!--<el-form-item :label="'供应商名称'" prop="constructionUnit">-->
                <!--<fd-select v-model='designAlterationModel.constructionUnit'-->
                <!--type="cost_dal_construct" :disabled="buttonDisable"></fd-select>-->
                <!--</el-form-item>-->
                <!--</el-col>-->

                <!--<el-col :span="8">-->
                <!--<el-form-item :label="'提出单位'">-->
                <!--<fd-select v-model='designAlterationModel.proposedUnit'-->
                <!--type="cost_dal_construct" :disabled="buttonDisable"></fd-select>-->
                <!--</el-form-item>-->
                <!--</el-col>-->
            </el-row>


            <el-row v-show="isShowAudit">

                <el-col :span="8">
                    <!-- 审批状态 -->
                    <el-form-item :label="'审批状态：'">
                        <fd-label :class="{col:flag}" :code="designAlterationModel.approveStatus"
                                  :url= "bpmUrl"
                                  type="cost_flow_status"
                                  :disabled="true"></fd-label>
                    </el-form-item>
                </el-col>

                <el-col :span="8">
                    <!-- 审批日期 -->
                    <el-form-item :label="'审批日期：'">
                        <el-date-picker v-model='designAlterationModel.approveDate'
                                        :disabled="true"
                                        type="date">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="24">
                    <el-form-item :label="'设计变更详情：'"
                                  prop="variationContent">
                        <el-input type="textarea"
                                  :autosize="{ minRows: 2, maxRows: 4}"
                                  v-model="designAlterationModel.variationContent"
                                  :disabled="buttonDisable">
                        </el-input>
                    </el-form-item>
                </el-col>

            </el-row>

            <div class="form-unit">关联合同详细内容</div>
            <div style="text-align:right; margin:10px 0;">

                <el-button size="mini"
                           class="special-btn"
                           type='primary'
                           @click="addRowToTable"
                           :disabled="buttonDisable">{{$l('btn_add')}}</el-button>
                <el-button size="mini"
                           class="special-btn"
                           type='primary'
                           @click='deleteDetail'
                           :disabled="buttonDisable">{{$l('btn_delete')}}</el-button>
            </div>

            <el-table :data="designAlterationModel.contractTableData"
                      stripe
                      :header-cell-class-name="rowClassName"
                      size="small"
                      @select="handleSelect"
                      @select-all="handleSelectAll"
                      border
                      tooltip-effect="dark"
                      style="width: 100%">

                <el-table-column type="selection"
                                 prop='id'
                                 width="55">
                </el-table-column>

                <!-- 合同编号 -->
                <el-table-column type="index"
                                 width="200"
                                 :label="'合同编号'">
                    <template slot-scope="scope">
                      <el-form-item
                        style="margin-top: 20px"
                        label-width="0"
                        :prop="'contractTableData.' + scope.$index + '.contractCode'"
                        :rules='rules.contractCode'>
                        <el-input v-model.trim="scope.row.contractCode"
                                  style="width: 150px;"
                                  :disabled="true"></el-input>
                        <span @click="searchContract(scope.row)"
                              v-show="isEdit"
                              class="el-icon-search"
                              :style="{'cursor':'pointer'}"></span>
                      </el-form-item>

                    </template>
                </el-table-column>

                <!-- 合同名称 -->
                <el-table-column prop="type"
                                 :label="'合同名称'"
                                 width="200">
                    <template slot-scope="scope">
                        <el-input v-model.trim="scope.row.contractName"
                                  style="width: 100%;"
                                  :disabled="true"></el-input>
                    </template>
                </el-table-column>

                <!-- 供方 -->
                <el-table-column width="200"
                                 :label="'供方'">
                    <template slot-scope="scope">
                        <el-input v-model.trim="scope.row.supplier"
                                  style="width: 100%;"
                                  :disabled="true"></el-input>
                    </template>
                </el-table-column>

                <!-- 设计变更预估金额 -->
                <el-table-column width="120"
                                 :label="'设计变更预估金额'">
                    <template slot-scope="scope">
                        <span v-show="isShowSpan"
                              style="width: 100%;">
                            {{scope.row.alterationEstimatedAmt}}
                        </span>
                        <el-form-item v-show="isEdit"
                                      style="margin-top: 20px"
                                      label-width="0"
                                      :prop="'contractTableData.' + scope.$index + '.alterationEstimatedAmt'"
                                      :rules='rules.alterationEstimatedAmt'>
                            <amount-input v-model.number="scope.row.alterationEstimatedAmt"
                                          style="width: 100%;"
                                          @blur="calcAmount"
                                          :disabled="buttonDisable" />
                        </el-form-item>

                    </template>
                </el-table-column>

                <!-- 设计变更详细内容 -->
                <el-table-column width="200"
                                 :label="'设计变更详细内容'">
                    <template slot-scope="scope">
                        <span v-show="isShowSpan"
                              style="width: 100%;">
                            {{scope.row.alterationContent}}
                        </span>
                        <el-input v-model.trim="scope.row.alterationContent"
                                  style="width: 100%;"
                                  v-show="isEdit"
                                  :disabled="buttonDisable"></el-input>
                    </template>
                </el-table-column>

                <!-- 合同范围内外 -->
                <el-table-column width="135"
                                 :label="'合同范围内外'">
                    <template slot-scope="scope">
                        <fd-label :code="scope.row.isIncontract"
                                  v-show="isShowSpan"
                                  type="cost_in_contract"></fd-label>
                        <el-form-item v-show="isEdit"
                                      style="margin-top: 20px"
                                      label-width="0"
                                      :prop="'contractTableData.' + scope.$index + '.isIncontract'"
                                      :rules='rules.isIncontract'>
                            <fd-select v-model='scope.row.isIncontract'
                                       style="width: 100%;"
                                       :disabled="buttonDisable"
                                       type="cost_in_contract"></fd-select>
                        </el-form-item>

                    </template>
                </el-table-column>

                <!-- 是否设计返工 -->
                <el-table-column width="110"
                                 :label="'是否涉及返工'">
                    <template slot-scope="scope">
                        <fd-label :code="scope.row.isReprocess"
                                  v-show="isShowSpan"
                                  type="cost_ineffective_isReprocess"></fd-label>
                        <fd-select v-model='scope.row.isReprocess'
                                   style="width: 100%;"
                                   v-show="isEdit"
                                   :disabled="buttonDisable"
                                   type="cost_ineffective_isReprocess"></fd-select>
                    </template>
                </el-table-column>

                <!-- 是否有无效成本 -->
                <el-table-column width="110"
                                 :label="'是否有无效成本'">
                    <template slot-scope="scope">
                        <fd-label :code="scope.row.isHasIneffective"
                                  v-show="isShowSpan"
                                  type="cost_ineffective_exist"></fd-label>
                        <el-form-item v-show="isEdit"
                                      style="margin-top: 20px"
                                      label-width="0"
                                      :prop="'contractTableData.' + scope.$index + '.isHasIneffective'"
                                      :rules='rules.ineffectiveExist'>
                            <fd-select v-model='scope.row.isHasIneffective'
                                       style="width: 100%;"
                                       :disabled="buttonDisable"
                                       type="cost_ineffective_exist"
                                       @change="(v) => {changeEffect(v, scope.row, scope.$index)}"></fd-select>
                        </el-form-item>
                    </template>
                </el-table-column>

                <!-- 无效成本类别 -->
                <el-table-column prop="message"
                                 :label="'无效成本类别'"
                                 width="100">
                    <template slot-scope="scope">
                        <fd-label :code="scope.row.ineffectiveType"
                                  v-show="isShowSpan"
                                  type="cost_ineffective_type"></fd-label>
                      <el-form-item v-show="isEdit"
                                    style="margin-top: 20px"
                                    label-width="0"
                                    :prop="'contractTableData.' + scope.$index + '.ineffectiveType'"
                                    :rules='rules.ineffectiveType'>
                        <DictionarySelect type="cost_ineffective_type"
                                          v-model="scope.row.ineffectiveType"
                                          :disabled="scope.row.effectButtonDisable"
                                          style="width: 100%;"
                                          v-show="isEdit" />
                      </el-form-item>
                    </template>
                </el-table-column>

                <!-- 无效成本金额 -->
                <el-table-column prop="amount"
                                 :label="'无效成本金额'"
                                 width="100">
                    <template slot-scope="scope">
                        <span v-show="isShowSpan"
                              style="width: 100%;">
                            {{scope.row.ineffectiveAmt}}
                        </span>
                      <el-form-item v-show="isEdit"
                                    style="margin-top: 20px"
                                    label-width="0"
                                    :prop="'contractTableData.' + scope.$index + '.ineffectiveAmt'"
                                    :rules='rules.ineffectiveAmt'>
                        <amount-input v-model.number="scope.row.ineffectiveAmt"
                                      style="width: 100%;"
                                      v-show="isEdit"
                                      :disabled="scope.row.effectButtonDisable" />
                      </el-form-item>
                    </template>
                </el-table-column>

                <!-- 成就共享扣款倍数 -->
                <el-table-column prop="responsibleDeptCode"
                                 width="110"
                                 :label="'成就共享扣款倍数'">
                    <template slot-scope="scope">
                        <fd-label :code="scope.row.achieveShareRatio"
                                  v-show="isShowSpan"
                                  type="cost_achieveshareratio_code"></fd-label>
                      <el-form-item v-show="isEdit"
                                    style="margin-top: 20px"
                                    label-width="0"
                                    :prop="'contractTableData.' + scope.$index + '.achieveShareRatio'"
                                    :rules='rules.achieveShareRatio'>
                        <fd-select v-model='scope.row.achieveShareRatio'
                                   style="width: 100%;"
                                   v-show="isEdit"
                                   :disabled="scope.row.effectButtonDisable"
                                   type="cost_achieveshareratio_code"></fd-select>
                      </el-form-item>
                    </template>
                </el-table-column>

              <!-- 无效成本责任部门 -->
              <el-table-column prop="responsibleDeptCode"
                               width="110"
                               :label="'无效成本责任部门'">
                <template slot-scope="scope">
                  <fd-label :code="scope.row.ineffectiveResponsibleDept"
                            v-show="isShowSpan"
                            type="cost_subject_responsible_dept_code"></fd-label>
                  <el-form-item v-show="isEdit"
                                style="margin-top: 20px"
                                label-width="0"
                                :prop="'contractTableData.' + scope.$index + '.ineffectiveResponsibleDept'"
                                :rules='rules.ineffectiveResponsibleDept'>
                  <fd-select v-model='scope.row.ineffectiveResponsibleDept'
                             style="width: 100%;"
                             v-show="isEdit"
                             :disabled="scope.row.effectButtonDisable"
                             type="cost_subject_responsible_dept_code"></fd-select>
                  </el-form-item>
                </template>
              </el-table-column>

                <!-- 无效成本内容 -->
                <el-table-column prop="content"
                                 width="150"
                                 :label="'无效成本内容'">
                    <template slot-scope="scope">
                        <!--<span v-show="isShowSpan" style="width: 100%;">-->
                        <!---->
                        <!--</span>-->
                        <DictionaryLabel type="cost_ineffective_type"
                                         :subType="scope.row.ineffectiveType"
                                         v-show="isShowSpan"
                                         :code="scope.row.ineffectiveContent" />

                      <el-form-item v-show="isEdit"
                                    style="margin-top: 20px"
                                    label-width="0"
                                    :prop="'contractTableData.' + scope.$index + '.ineffectiveContent'"
                                    :rules='rules.ineffectiveContent'>
                        <DictionarySelect type="cost_ineffective_type"
                                          :subType="scope.row.ineffectiveType"
                                          v-model="scope.row.ineffectiveContent"
                                          style="width: 100%;"
                                          v-show="isEdit"
                                          :disabled="scope.row.effectButtonDisable || scope.row.ineffectiveType == ''" />
                      </el-form-item>

                    </template>
                </el-table-column>

                <!-- 无效成本描述 -->
                <el-table-column prop="message"
                                 width="150"
                                 :label="'无效成本描述'">
                    <template slot-scope="scope">
                        <span v-show="isShowSpan"
                              style="width: 100%;">
                            {{scope.row.ineffectiveDesc}}
                        </span>
                      <el-form-item v-show="isEdit"
                                    style="margin-top: 20px"
                                    label-width="0"
                                    :prop="'contractTableData.' + scope.$index + '.ineffectiveDesc'"
                                    :rules='rules.ineffectiveDesc'>
                        <el-input v-model.trim="scope.row.ineffectiveDesc"
                                  style="width: 100%;"
                                  v-show="isEdit"
                                  :disabled="scope.row.effectButtonDisable"></el-input>
                      </el-form-item>
                    </template>
                </el-table-column>

                <el-table-column prop="message"
                                 width="80"
                                 :label="'是否作废'">
                    <template slot-scope="scope">
                        <span v-show="isShowSpan"
                              style="width: 100%;"
                              v-if="scope.row.isInvalid === '1'">
                            已作废
                        </span>

                    </template>
                </el-table-column>

            </el-table>

            <div class="form-unit">成本拆分
              <span> <el-button size="mini" type="primary" @click="checkoutDynamic()" >执行自动拆分</el-button></span>
            </div>

            <el-tabs v-model="activeName"
                     type="card"
                      @tab-click="handleClick">

                <el-tab-pane v-for="(item, index) in designAlterationModel.dynacostSplittingList"
                             :key="item.contractName"
                             :label="item.contractName"
                             :name="item.contractName">
                    <costSplittingTable v-model="item.splittingModels_cp2sb2ct" :splittingWay="item.splittingWay"  @saveSplit="saveSplit"
                                        >
                    </costSplittingTable>
                </el-tab-pane>
            </el-tabs>

            <div class="form-unit">附件列表</div>
            <el-form-item label="上传附件:"
                          style="margin-left: -80px;">
                <CostFileUpload v-model="fileList"
                                :limit="limit"
                                :attachmentData="attachmentData"
                                :outerId="outerId">
                </CostFileUpload>
            </el-form-item>

            <!-- <span class="breadcrumb-child" style="float: left;margin-top: 10px">
        <i></i>上传附件:
      </span>
      <span style="float: left">
        <CostFileUpload
        style="margin-bottom: 20px"
        v-model="fileList" :limit="limit" :size="size" :attachmentData="attachmentData" :outerId="outerId">
      </CostFileUpload></span> -->



            <ContractSelector :showContract="isShowContract"
                              :projectId="project.projectId"
                              :excludeContract="excludeContract"
                              :moduleCode="moduleCode"
                              v-on:cancelDialog="cancelDialog"
                              v-on:closeDialog="closeDialog"
                              v-on:confirmContract="confirmContract">

            </ContractSelector>

        </el-form>
      <DesignAlterationAttachmentTable :queryObj_passed_in='queryModel'
                                       :attaData='attachmentData'
                                       :showDeleteButton="showDeleteButton"
                                       v-on:changeAttachments="changeAttachments"
                                       ref='DesignAlterationAttachmentTable'>
      </DesignAlterationAttachmentTable>
    </div>
</template>
<script >
import uuidv1 from 'uuid/v1'
import { LoadingUtil } from '@/utils/common/LoadingUtil'
import { ptn } from '@/utils/common/validate'
import { getDesignAlterationDetail, getContractList, createDesignAlterationDetail, getByAlterationId, getCode, submit, dynacostSplittingList } from '@/api/cost/designAlteration'
import { getMeProfile } from '@/api/sys/userAPI'
import DesignAlterationAttachmentTable from '@/views/cost/designAlteration/DesignAlterationAttachmentTable'
import CostSplittingTable from '@/views/cost/designAlteration/CostSplittingTable'
import CostFileUpload from '@/components/cost/UploadFile/'
import ProjectAccountSelect from '@/components/cost/ProjectAccountSelect'
import ContractSelector from '@/components/cost/ContractSelector/'
import DictionarySelect from '@/components/cost/DictionarySelect/'
import DictionaryLabel from '@/components/cost/DictionaryLabel/'
import ProjectSelector from '@/components/cost/ProjectSelector/'
import AmountInput from '@/components/cost/AmountInput/'
import COSTENUM from '@/utils/cost/enum'
export default {
  components: {
    CostFileUpload,
    AmountInput,
    DesignAlterationAttachmentTable,
    CostSplittingTable,
    ProjectAccountSelect,
    ContractSelector,
    DictionarySelect,
    DictionaryLabel,
    ProjectSelector
  },
  data() {
    let validateProjectName = (rule, value, callback) => {
      value = this.project.projectId
      if (value === '') {
        callback(new Error('请选择项目名称'))
      } else {
        callback()
      }
    }
    let ineffectiveTypeValidator = (rule, value, callback) => {
      let index = rule.field.split('.')[1]
      let rowData = this.designAlterationModel.contractTableData[index]
      if ((value === '' || value === null) && rowData.isHasIneffective === '1') {
        callback(new Error('请选择无效成本类别'))
      } else {
        callback()
      }
    }
    let ineffectiveAmtValidator = (rule, value, callback) => {
      let index = rule.field.split('.')[1]
      let rowData = this.designAlterationModel.contractTableData[index]
      if ((value === '' || value === null) && rowData.isHasIneffective === '1') {
        callback(new Error('请输入无效成本金额'))
      } else {
        callback()
      }
    }
    let achieveShareRatioValidator = (rule, value, callback) => {
      let index = rule.field.split('.')[1]
      let rowData = this.designAlterationModel.contractTableData[index]
      if ((value === '' || value === null) && rowData.isHasIneffective === '1') {
        callback(new Error('请选择成就共享扣款倍数'))
      } else {
        callback()
      }
    }
    let ineffectiveResponsibleDeptValidator = (rule, value, callback) => {
      let index = rule.field.split('.')[1]
      let rowData = this.designAlterationModel.contractTableData[index]
      if ((value === '' || value === null) && rowData.isHasIneffective === '1') {
        callback(new Error('请选择无效成本责任部门'))
      } else {
        callback()
      }
    }
    let ineffectiveContentValidator = (rule, value, callback) => {
      let index = rule.field.split('.')[1]
      let rowData = this.designAlterationModel.contractTableData[index]
      if ((value === '' || value === null) && rowData.isHasIneffective === '1') {
        callback(new Error('请选择无效成本内容'))
      } else {
        callback()
      }
    }
    let ineffectiveDescValidator = (rule, value, callback) => {
      let index = rule.field.split('.')[1]
      let rowData = this.designAlterationModel.contractTableData[index]
      if ((value === '' || value === null) && rowData.isHasIneffective === '1') {
        callback(new Error('请输入无效成本描述'))
      } else {
        callback()
      }
    }

    // var validateAccobj = (rule, value, callback) => {
    //   if (value === '') {
    //     callback(new Error('请选择项目分期'))
    //   } else {
    //     callback()
    //   }
    // }

    return {
      activeName: '',
      show: { project: true, accObj: false },
      selectTable: [],
      queryModuleName: '',
      editableTabsValue2: '',
      tabIndex: 0,
      editableTabs2: [],
      instructShows: [],
      completionShows: [],
      costShows: [],
      fileList: '',
      limit: 4,
      size: 4,
      outerId: '',
      rules: {
        projectId: [{ validator: validateProjectName, trigger: 'change', required: true }],
        // accObjId: [{ validator: validateAccobj, trigger: 'change' }],
        isIncontract: [
          { required: true, message: '请选择', trigger: 'change' }
        ],
        alterationEstimatedAmt: [
          { required: true, message: '请输入预估金额', trigger: 'blur' },
          { type: 'number', message: '请输入数字' }
        ],
        contractCode: [
          { required: true, message: '请输入合同编号', trigger: 'change' }
        ],
        ineffectiveAmt: [{ validator: ineffectiveAmtValidator, required: true, trigger: 'blur' }],
        ineffectiveExist: [
          { required: true, message: '请选择', trigger: 'change' }
        ],
        ineffectiveType: [{ validator: ineffectiveTypeValidator, required: true, trigger: 'change' }],
        achieveShareRatio: [{ validator: achieveShareRatioValidator, required: true, trigger: 'change' }],
        ineffectiveResponsibleDept: [{ validator: ineffectiveResponsibleDeptValidator, required: true, trigger: 'change' }],
        ineffectiveContent: [{ validator: ineffectiveContentValidator, required: true, trigger: 'change' }],
        ineffectiveDesc: [{ validator: ineffectiveDescValidator, required: true, trigger: 'blur' }],
        name: [
          { required: true, message: '请输入设计变更名称', trigger: 'blur' }
        ],
        reasonTypeCode: [
          { required: true, message: '请选择设计变更原因', trigger: 'change' }
        ],
        specialityType: [
          { required: true, message: '请选择专业类型', trigger: 'change' }
        ],
        accountabilityUnit: [
          { required: true, message: '请选择责任部门', trigger: 'change' }
        ],
        constructionUnit: [
          { required: true, message: '请选择供应商', trigger: 'change' }
        ]
      },
      active: 1,
      attachmentData: [],
      excludeContract: [],
      moduleCode: COSTENUM.module.DESIGN_ALTERATION,
      currentIndex: '',
      isShowContract: false,
      isEdit: false,
      isShowSpan: false,
      isShowAdd: true,
      isShowSubmit: true,
      allButtonDisable: false,
      isShowAudit: false,
      buttonDisable: false,
      buttonDis:true,
      showDeleteButton: true,
      queryModel: {
        companyId: '',
        projectId: '',
        contractCode: '',
        code: '',
        name: '',
        instructionCode: '',
        pageNum: 1,
        pageSize: 20
      },
      project: {
        accObjId: '',
        projectId: ''
      },
      designAlterationModel: {
        id: '',
        projectId: '',
        companyId: '',
        code: '',
        name: '',
        reasonTypeCode: '',
        specialityType: '',
        estimatedAmt: '',
        accountabilityUnit: '',
        proposedUnit: '',
        constructionUnit: '',
        operatorName: '',
        operatorDate: '',
        variationContent: '',
        alterationType: '1',
        approveStatus: '0',
        approveDate: '',
        attachments: [],
        contractTableData: [],
        dynacostSplittingList: [],
        contractModels_splitting_cp2sb2ct: [],
        splittingWay: '0',
        moduleDataPK: ''
      },
      daContractModel: {
        id: '',
        alterationVisaId: '',
        alterationVisaCode: '',
        contractCode: '',
        contractName: '',
        supplier: '',
        alterationEstimatedAmt: '',
        alterationContent: '',
        isHasIneffective: '',
        isReprocess: '',
        ineffectiveType: '',
        ineffectiveAmt: '',
        ineffectiveResponsibleDept: '',
        ineffectiveContent: '',
        ineffectiveDesc: '',
        alterationType: '1'
      },
      contractQueryModel: {
        projectId: '',
        contractName: '',
        contractType: '',
        contractStatus: '5',
        pageNum: 1,
        pageSize: 10,
        count: 0
      },
      selectContract: [],
      flag:false,
      bpmUrl:''
    }
  },
  mounted: function() {
    this.init()
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event)
    },
    saveSplit(val) {
      this.designAlterationModel.splittingWay = val
      this.designAlterationModel.dynacostSplittingList.forEach((item, index) => {
        this.designAlterationModel.dynacostSplittingList[index].splittingWay = val
      })
    },
    checkoutDynamic() {
      this.designAlterationModel.splittingWay = '0'
      if (this.designAlterationModel.contractTableData.length > 0) {
        this.designAlterationModel.dynacostSplittingList = []
        this.getSplittingList()
      }
    },
    getSplittingList() {
      LoadingUtil.showLoading()
      if (this.$route.query.id) {
        this.designAlterationModel.moduleDataPK = this.$route.query.id
      }
      // this.designAlterationModel.contractTableData = [{ 'id': '', 'contractId': 'ff808081667b54f601667c2eee477dce', 'contractCode': 'PRJ0003201-HT-GCJA-2018-0001', 'contractName': '总承包', 'supplier': '四川成梁置业有限公司', 'alterationEstimatedAmt': 2000, 'alterationContent': '23', 'isHasIneffective': '1', 'isReprocess': '1', 'ineffectiveType': '5', 'ineffectiveAmt': '34550.00', 'ineffectiveResponsibleDept': '5', 'ineffectiveContent': '1', 'ineffectiveDesc': '132', 'alterationType': '1', 'isBudgetConveySure': null, 'isIncontract': '1', 'index': '73ef1160-d372-11e8-ace3-7ddc67a31934', 'effectButtonDisable': false }]
      dynacostSplittingList({ moduleType: '2_1', designAlterationContractList: this.designAlterationModel.contractTableData, moduleDataPK: this.designAlterationModel.moduleDataPK }).then(response => {
        LoadingUtil.hideLoading()
        // this.designAlterationModel.dynacostSplittingList = response.data ? response.data : []
        let newDynacostSplittingList = response.data ? response.data : []
        if (newDynacostSplittingList && newDynacostSplittingList.length > 0) {
          newDynacostSplittingList.map((item, index) => {
            this.designAlterationModel.dynacostSplittingList.push(item.contractModel)
          })
        }

        console.log(this.designAlterationModel.dynacostSplittingList)
        if (this.designAlterationModel.dynacostSplittingList.length > 0) {
          this.activeName = this.designAlterationModel.dynacostSplittingList[0].contractName
        }
      })
    },
    removeTab(targetName) {
      let tabs = this.editableTabs2
      let activeName = this.editableTabsValue2
      if (activeName === targetName) {
        tabs.forEach((tab, index) => {
          if (tab.name === targetName) {
            let nextTab = tabs[index + 1] || tabs[index - 1]
            if (nextTab) {
              activeName = nextTab.name
            }
          }
        })
      }

      this.editableTabsValue2 = activeName
      this.editableTabs2 = tabs.filter(tab => tab.name !== targetName)
    },
    handleCurrentChange(val) {
      this.contractQueryModel.pageNum = val
      this.queryContract()
    },
    handleSizeChange(val) {
      this.contractQueryModel.pageSize = val
      this.queryContract()
    },
    searchContract(data) {
      this.excludeContract = []
      this.designAlterationModel.contractTableData.map(data => {
        if (data.contractCode) {
          this.excludeContract.push(data.contractCode)
        }
      })
      this.isShowContract = true
      this.currentIndex = data.index
    },
    gotoInstruct(item) {
      let redirectPath = {}
      redirectPath.query = { id: item.id, isView: true }
      redirectPath.name = 'InstructionDistribute'
      this.$router.push(redirectPath)
    },
    gotoCompletion(item) {
      let redirectPath = {}
      redirectPath.query = { id: item.id, isView: true }
      redirectPath.name = 'InstructionCompletionConfirm'
      this.$router.push(redirectPath)
    },
    gotoCost(item) {
      let redirectPath = {}
      redirectPath.query = { id: item.id, isView: true }
      redirectPath.name = 'InstructionCostConfirm'
      this.$router.push(redirectPath)
    },
    // handleClose() {
    //   this.isShowContract = false
    // },
    queryContract() {
      getContractList(this.contractQueryModel)
        .then(response => {
          this.selectTable = response.data
        })
        .catch(error => {
          console.log(error)
        })
    },
    cancelDialog(data) {
      this.isShowContract = data
    },
    closeDialog(data) {
      this.isShowContract = data
    },
    confirmContract(data) {
      this.designAlterationModel.contractTableData.map(detail => {
        if (detail.index === this.currentIndex) {
          detail.contractCode = data.contractCode
          detail.contractId = data.id
          this.project.projectId = data.projectId
          detail.contractName = data.contractName
          detail.supplier = data.partyBName
          detail.isBudgetConveySure = data.isBudgetConveySure
        }
      })
      // this.applyPaymentPadModel.contractCode = data.contractCode
      // this.applyPaymentPadModel.contractName = data.contractName
    },
    addTab(targetName) {
      let newTabName = ++this.tabIndex + ''
      let costData = [{ businessTypeName: 'sasa' }, { businessTypeName: 'bbb' }]
      this.editableTabs2.push({
        title: 'New Tab',
        name: newTabName,
        data: costData
      })
      this.editableTabsValue2 = newTabName
    },
    calcAmount() {
      let total = 0
      for (const i in this.designAlterationModel.contractTableData) {
        total += Number(this.designAlterationModel.contractTableData[i].alterationEstimatedAmt)
      }
      this.designAlterationModel.estimatedAmt = total
    },
    rowClassName({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 1 || columnIndex === 4 || columnIndex === 6 || columnIndex === 8 ||
        columnIndex === 9 || columnIndex === 10 || columnIndex === 11 || columnIndex === 12 || columnIndex === 13 || columnIndex === 14) { // 列下标
        return 'cost-table-header-required'
      }
    },
    init() {
      this.isEdit = this.$route.query.isEdit.toString() === 'true'
      if (this.$route.query.isAdd) {
        // 新增
        this.designAlterationModel.contractTableData = []
        this.designAlterationModel.operatorName = this.$getUserInfo()['nickName']
        this.designAlterationModel.operatorDate = new Date()
      } else {
        this.buttonDis = false
        if (!this.isEdit) {
          debugger
          this.isShowSpan = true
          this.buttonDisable = true
          this.isShowAdd = false
          this.isShowSubmit = false
          this.allButtonDisable = true
          this.isShowAudit = true
          this.showDeleteButton = false
        }
        getDesignAlterationDetail({ id: this.$route.query.id })
          .then(response => {
            debugger
            this.designAlterationModel.contractTableData = response.data.daContractList
            this.attachmentData = response.data.attachments
            this.designAlterationModel.daContractList = this.designAlterationModel.contractTableData

            this.designAlterationModel.id = response.data.id
            this.outerId = response.data.code
            this.project.projectId = response.data.projectId
            this.designAlterationModel.code = response.data.code
            this.designAlterationModel.name = response.data.name
            this.designAlterationModel.reasonTypeCode = response.data.reasonTypeCode
            this.designAlterationModel.specialityType = response.data.specialityType
            this.designAlterationModel.estimatedAmt = response.data.estimatedAmt
            this.designAlterationModel.accountabilityUnit = response.data.accountabilityUnit
            this.designAlterationModel.constructionUnit = response.data.constructionUnit
            this.designAlterationModel.proposedUnit = response.data.proposedUnit
            this.designAlterationModel.operatorName = response.data.operatorName
            this.designAlterationModel.operatorDate = response.data.operatorDate
            this.designAlterationModel.approveStatus = response.data.approveStatus
            this.designAlterationModel.approveDate = response.data.approveDate
            this.designAlterationModel.variationContent = response.data.variationContent
            this.bpmUrl = response.data.bpmOriginUrl
            if(this.bpmUrl != ''){
              this.flag = true
            }
            this.designAlterationModel.daContractList.forEach(function(item) {
              debugger
              item.index = uuidv1()
              if (item.achieveShareRatio !== null) {
                item.achieveShareRatio = item.achieveShareRatio.toString()
              }
              if (item.isHasIneffective === '0') {
                item.effectButtonDisable = true
              } else {
                item.effectButtonDisable = false
              }
            })
            this.designAlterationModel.attachments = this.attachmentData
            // this.designAlterationModel.splittingWay = response.data.splittingWay // 成本拆分
            this.designAlterationModel.dynacostSplittingList = response.data.contractModels_splitting_cp2sb2ct // 成本拆分

            if (this.designAlterationModel.dynacostSplittingList && this.designAlterationModel.dynacostSplittingList.length > 0) {
              this.activeName = this.designAlterationModel.dynacostSplittingList[0].contractName
              this.designAlterationModel.splittingWay = this.designAlterationModel.dynacostSplittingList[0].splittingWay
            }

            // 加载轨道图下拉菜单
            getByAlterationId({ id: this.designAlterationModel.id })
              .then(response => {
                debugger
                this.instructShows = response.data
                this.completionShows = response.data.filter(function(item) {
                  return item.processNode === '3'
                })
                this.costShows = response.data.filter(function(item) {
                  return item.processNode === '4'
                })
                this.active = this.getActiveIndex()
              })
              .catch(error => {
                console.log(error)
              })
          })
          .catch(error => {
            console.log(error)
            this.$showError(error.message ? error.message : 'msg_system_error')
          })
      }
    },
    getActiveIndex() {
      debugger
      if (this.costShows.length !== 0) {
        return 4
      }
      if (this.completionShows.length !== 0) {
        return 3
      }
      if (this.instructShows.length !== 0) {
        return 2
      }
      return 1
    },
    handleSelectionChange(val) {
      this.selectContract = val
    },
    addRowToTable() {
      // this.contractQueryModel.projectId = this.project.projectId
      // getContractList(this.contractQueryModel)
      //   .then(response => {
      //     this.selectTable = response.data
      //   })
      //   .catch(error => {
      //     console.log(error)
      //   })
      // this.isShowContract = true
      this.designAlterationModel.contractTableData.push(this.getDefaultRow())
    },
    getDefaultRow() {
      return {
        id: '',
        contractId: '',
        contractCode: '',
        contractName: '',
        supplier: '',
        alterationEstimatedAmt: '',
        alterationContent: '',
        isHasIneffective: '',
        isReprocess: '',
        ineffectiveType: '',
        ineffectiveAmt: '',
        ineffectiveResponsibleDept: '',
        achieveShareRatio: '',
        ineffectiveContent: '',
        ineffectiveDesc: '',
        alterationType: '1',
        isInvalid: '0',
        isBudgetConveySure: '',
        isIncontract: '',
        index: uuidv1(),
        effectButtonDisable: false
      }
    },
    deleteDetail() {
      let newTableData = this.designAlterationModel.contractTableData.filter(function(item) {
        return item.checked !== true
      })
      this.designAlterationModel.contractTableData = newTableData
    },
    handleSelect(selection, row) {
      for (let i = 0; i < selection.length; i++) {
        if (selection[i].index === row.index) {
          this.designAlterationModel.contractTableData.forEach((item) => {
            if (item.index === row.index) {
              item.checked = true
            }
          })
        }
      }
    },

    handleSelectAll(selection, row) {
      // 全选/取消全选
      let allChecked = true
      if (selection.length === 0) {
        allChecked = false
      }
      this.designAlterationModel.contractTableData.forEach((item) => {
        item.checked = allChecked
      })
    },
    handleBack() {
      this.$router.push({
        name: 'DesignAlterationList'
      })
    },
    changeEffect(value, row) {
      debugger
      if (value === '0') {
        row.effectButtonDisable = true
        row.ineffectiveAmt = ''
        row.ineffectiveType = ''
        row.ineffectiveResponsibleDept = ''
        row.achieveShareRatio = ''
        row.ineffectiveContent = ''
        row.ineffectiveDesc = ''
      } else {
        row.effectButtonDisable = false
      }
    },
    submitModel() {
      this.buttonDis = true
      this.$refs['designAlterationModel'].validate((valid) => {
        if (valid) {
          this.designAlterationModel.daContractList = this.designAlterationModel.contractTableData
          this.designAlterationModel.attachments = this.attachmentData
          this.designAlterationModel.projectId = this.project.projectId
          this.outerId = this.designAlterationModel.code
          LoadingUtil.showLoading()
          this.designAlterationModel.approveStatus = '0'
          createDesignAlterationDetail(this.designAlterationModel)
            .then(response => {
              this.designAlterationModel.id = response.data
              submit(this.designAlterationModel)
                .then(response => {
                  LoadingUtil.hideLoading()
                  if (response.code === '2000') {
                    this.$router.push({
                      name: 'DesignAlterationList'
                    })
                    this.$showSuccess(response.message)
                  } else {
                    this.$showError(response.message)
                    this.buttonDis = false
                  }
                })
                .catch(error => {
                  console.log(error)
                  // this.buttonDis = false
                  this.$showError(error.message ? error.message : 'msg_system_error')
                })
            })
            .catch(error => {
              console.log(error)
              this.$showError(error.message ? error.message : 'msg_system_error')
            })
        }
      })
    },
    saveDesignAlteration() {
      // debugger
      console.log(this.designAlterationModel.dynacostSplittingList)
      this.$refs['designAlterationModel'].validate((valid) => {
        if (valid) {
          this.designAlterationModel.daContractList = this.designAlterationModel.contractTableData
          this.designAlterationModel.attachments = this.attachmentData
          this.designAlterationModel.projectId = this.project.projectId
          this.outerId = this.designAlterationModel.code
          this.designAlterationModel.splittingWay = this.designAlterationModel.splittingWay // 成本拆分
          this.designAlterationModel.contractModels_splitting_cp2sb2ct = this.designAlterationModel.dynacostSplittingList // 成本拆分

          // debugger
          LoadingUtil.showLoading()
          this.designAlterationModel.approveStatus = '0'
          createDesignAlterationDetail(this.designAlterationModel)
            .then(response => {
              LoadingUtil.hideLoading()
              this.$showSuccess(response.message)
              this.designAlterationModel.id = response.data
              this.buttonDis = false
            })
            .catch(error => {
              console.log(error)
              LoadingUtil.hideLoading()
              this.buttonDis = true
              this.$showError(error.message ? error.message : 'msg_system_error')
            })
        }
      })
    },
    generateCode() {
      getCode(this.designAlterationModel)
        .then(response => {
          this.designAlterationModel.code = response.data
        })
        .catch(error => {
          console.log(error)
          this.$showError(error.message ? error.message : 'msg_system_error')
        })
    },
    changeAttachments(data) {
      this.designAlterationModel.attachments = data
      this.attachmentData = data
    }
  },
  watch: {
    'project': function(newValue, oldValue) {
      this.designAlterationModel.projectId = this.project.projectId
      this.designAlterationModel.companyId = this.project.companyId
      this.generateCode()
      this.designAlterationModel.contractTableData = []
    },
    'designAlterationModel.contractTableData': function(newValue, oldValue) {
      debugger
      if (newValue.length < oldValue.length) {
        // 删除合同
        this.calcAmount()
        if (this.designAlterationModel.estimatedAmt === 0) {
          this.designAlterationModel.estimatedAmt = ''
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  .col{
    color: blue;
    text-decoration: underline;
    cursor: pointer;
  }
</style>





