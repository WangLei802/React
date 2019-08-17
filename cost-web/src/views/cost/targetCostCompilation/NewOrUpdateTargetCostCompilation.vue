<!-- NewOrUpdateTargetCostCompilation -->
<template>
  <div class='app-container'>
    <!-- 引用其他项目 -->
    <el-dialog :title="'引用其他项目'"
               :visible.sync="page.dialog.dialogSelect"
               :modal="true"
               :lock-scroll="true">
      <div>
        <el-form size="mini"
                 style="margin-bottom:20px;">
          <el-row>
            <el-col :span="3"
                    style="height:30px;line-height:30px;">事业部：</el-col>
            <el-col :span="6"
                    style="text-align:left">

              <el-select v-model="page.dialog.queryModel.filterCompanyId"
                         filterable
                         clearable
                         placeholder="请选择">
                <el-option v-for="(item,index) in page.dialog.deptList"
                           :key="index"
                           :label="item.companyName"
                           :value="item.companyId">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="1">&nbsp;</el-col>
            <el-col :span="6">
              <el-button size="mini"
                         class="special-btn"
                         type='primary'
                         @click='handleCloseOtherProjectTemplate'>{{$l('btn_close')}}</el-button>
            </el-col>
          </el-row>
        </el-form>
        <el-table :data="page.dialog.tableData.filter( item => item.companyId === page.dialog.queryModel.filterCompanyId || !page.dialog.queryModel.filterCompanyId) "
                  stripe
                  border
                  size="small"
                  height="200"
                  style="width: 100%">
          <!-- 序号 -->
          <el-table-column fixed
                           :label="$l('lbl_no')"
                           width="100"
                           type="index">
          </el-table-column>

          <!-- 部门 -->
          <el-table-column prop="companyName"
                           show-overflow-tooltip
                           :label="'部门'"></el-table-column>

          <!-- 项目名称 -->
          <el-table-column prop="projectName"
                           show-overflow-tooltip
                           :label="'项目名称'"></el-table-column>

          <!-- 操作 -->
          <el-table-column :label="$l('lbl_operation')"
                           width="150">
            <!-- 查看 -->
            <template slot-scope="scope">
              <el-button size="mini"
                         type="text"
                         icon="fa fa-hand-o-up"
                         :title="'引入'"
                         @click="handleSelectOtherProjectTemplate(scope.$index, scope.row)"> 引用</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>

    <!-- 成本分期选择级联 -->
    <el-row v-if="AccountingTargetSelectorIsUsed"
            style="margin-top:20px">
      <AccountingTargetSelector @updateMessage="updateMessage"
                                :isUsed="AccountingTargetSelectorIsUsed"
                                :valueObjectId='queryModel'
                                :showNoPhaseIfHavePhase=false
                                :showTobe=false
                                :queryModel='queryModel'
                                :labelWidth="{
                group:80,
                company:80,
                businessDept:80,
                accountingObject:80 
            }"></AccountingTargetSelector>
    </el-row>

    <!-- 明细信息 -->
    <el-row class="blockDetail">
      <el-collapse v-model="pageStatus.blockDetailActiveName"
                   accordion
                   style="font-size:24px">
        <el-collapse-item name='1'>
          <template slot="title">
            <strong style="padding-left:10px">明细信息(
              <font color='red'>目标成本编制</font> {{queryModel.accountingObjectText}} {{page.statusName}})</strong>
            <i class="header-icon el-icon-info"></i>
          </template>
          <div class="detailModelClass">
            <el-form size="mini">
              <el-row>
                <!-- 第一行 -->
                <el-col :span="8"
                        :offset="1">
                  <div class="detailLabel">可售面积(㎡)：</div>
                  <div class="detailValue">{{detailModel.canSaleAcreage | NumFormat}}</div>
                </el-col>
                <el-col :span="7">
                  <div class="detailLabel">
                    <font color='red'>*</font>图纸版本：
                  </div>
                  <div class="detailValue">
                    <fd-label :code="detailModel.drawingVersion"
                              type="cost_drawing_version"
                              v-if="!page.isEdit"></fd-label>
                    <fd-select v-model='detailModel.drawingVersion'
                               type="cost_drawing_version"
                               :placeholder="'请选择'"
                               :clearable="false"
                               style="width:100px;height:28px"
                               v-if="page.isEdit"></fd-select>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="detailLabel">
                    平均售价(含车位)(元)：
                  </div>
                  <div class="detailValue">
                    <span v-if="!page.isEdit">{{detailModel.avgPrice | NumFormat}}</span>
                    <el-input-number v-model.trim.number="detailModel.avgPrice"
                                     clearable
                                     :controls="false"
                                     :min="0"
                                     :placeholder="'请输入'"
                                     :precision="0"
                                     onmousewheel="return false;"
                                     :maxlength="20"
                                     v-if="page.isEdit"
                                     style="width:100px;" />
                  </div>
                </el-col>
              </el-row>
              <el-row>
                <!-- 第二行 -->
                <el-col :span="8"
                        :offset="1">
                  <div class="detailLabel">建筑面积(㎡)：</div>
                  <div class="detailValue">{{detailModel.buildingAcreage | NumFormat}}</div>
                </el-col>
                <el-col :span="7">
                  <div class="detailLabel">
                    <font color='red'>*</font>配置标准：
                  </div>
                  <div class="detailValue">
                    <fd-label :code="detailModel.allocationStandard"
                              type="cost_allocation_standard"
                              v-if="!page.isEdit"></fd-label>
                    <fd-select v-model='detailModel.allocationStandard'
                               :placeholder="'请选择'"
                               type="cost_allocation_standard"
                               :clearable="false"
                               :style="{'width':'100px','height':'28px'}"
                               v-if="page.isEdit"></fd-select>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="detailLabel"
                       v-if="detailModel.stageId>2">预备会召开时间：</div>
                  <div class="detailValue"
                       v-if="detailModel.stageId>2">
                    <span v-if="!page.isEdit || detailModel.stageId!==3">{{detailModel.prepareMeetingTime | dateFormat('yyyy-MM-dd hh:mm:ss')}}</span>
                    <el-date-picker v-model="detailModel.prepareMeetingTime"
                                    type="datetime"
                                    v-if="page.isEdit && detailModel.stageId===3"
                                    :clearable="false"
                                    placeholder="选择日期时间"
                                    style="width:180px;">
                    </el-date-picker>
                  </div>
                </el-col>
              </el-row>
              <el-row>
                <!-- 第三行 -->
                <el-col :span="8"
                        :offset="1">
                  <div class="detailSubTitle">总目标成本</div>
                </el-col>
                <el-col :span="7">
                  <div class="detailSubTitle">工程目标成本(2-8项,4301.02~4301.08)</div>
                </el-col>
                <el-col :span="8">
                  <div class="detailLabel">参考地区：</div>
                  <div class="detailValue">{{detailModel.cityName}}</div>
                </el-col>

                <!-- 第四行 -->
                <el-col :span="8"
                        :offset="1">
                  <div class="detailLabel">总目标成本(含税)(元)：</div>
                  <div class="detailValue">{{detailModel.targetCostContainTax | NumFormat}}</div>
                </el-col>
                <el-col :span="7">
                  <div class="detailLabel">工程目标成本(含税)(元)：</div>
                  <div class="detailValue">{{detailModel.projectTargetCostIncludeTaxAmount | NumFormat}}</div>
                </el-col>
                <el-col :span="8">
                  <div class="detailLabel">版本：</div>
                  <div class="detailValue">
                    <div style="float:left;min-width:30px;text-align:left;">
                      {{detailModel.stageId?selectData.cost_stage_id[detailModel.stageId.toString()]:''}}
                    </div>
                    <div style="float:left;width:50px;text-align:left;">{{detailModel.stageVersion |Version}}</div>
                  </div>
                </el-col>

                <!-- 第无行 -->
                <el-col :span="8"
                        :offset="1">
                  <div class="detailLabel">总可售单方(元/㎡)：</div>
                  <div class="detailValue">{{detailModel.canSalePart | NumFormat}}</div>
                </el-col>
                <el-col :span="7">
                  <div class="detailLabel">工程可售单方(元/㎡)：</div>
                  <div class="detailValue">{{detailModel.projectSaleSmCostIncludeTaxAmount | NumFormat}}</div>
                </el-col>
                <el-col :span="8">
                  <div class="detailLabel">编制人：</div>
                  <div class="detailValue">{{detailModel.editPerson}}</div>
                </el-col>

                <!-- 第六行 -->
                <el-col :span="8"
                        :offset="1">
                  <div class="detailLabel">总目标成本(不含税)(元)：</div>
                  <div class="detailValue">{{detailModel.targetCostWithoutTax | NumFormat}}</div>
                </el-col>
                <el-col :span="7">
                  <div class="detailLabel">工程目标成本(不含税)(元)：</div>
                  <div class="detailValue">{{detailModel.projectTargetCostExcludeTaxAmount | NumFormat}}</div>
                </el-col>
                <el-col :span="8">
                  <div class="detailLabel">编制日期：</div>
                  <div class="detailValue">{{detailModel.eidtDate | dateFormat('yyyy-MM-dd')}}</div>
                </el-col>

                <!-- 第七行 -->
                <el-col :span="8"
                        :offset="1">
                  <div class="detailLabel">总建面单方(元/㎡)：</div>
                  <div class="detailValue">{{detailModel.buildingAcreagePart | NumFormat}}</div>
                </el-col>
                <el-col :span="7">
                  <div class="detailLabel">工程建面单方(元/㎡)：</div>
                  <div class="detailValue">{{detailModel.projectConstructSmCostIncludeTaxAmount | NumFormat}}</div>
                </el-col>
                <el-col :span="8">
                  <div class="detailLabel">审批状态：</div>
                  <div :class="{detailValue:true, col:flag}" @click="jump">{{detailModel.flowStatus}}</div>
                </el-col>

                <!-- 第八行 -->
                <el-col :span="8" :offset="1">
                  <div class="detailLabel">其他：</div>
                  <a @click="filedialog" style="text-decoration: underline;color: blue;">附件列表</a>
                </el-col>
                <el-col :span="7">&nbsp;</el-col>
                <el-col :span="8">
                  <div class="detailLabel">审批日期：</div>
                  <div class="detailValue">{{detailModel.auditApprovalDate | dateFormat('yyyy-MM-dd')}}</div>
                </el-col>
              </el-row>
            </el-form>
          </div>
        </el-collapse-item>
      </el-collapse>
    </el-row>
    <!-- 附件列表弹出层 -->
    <el-dialog title="附件列表" :visible.sync="dialogTableVisible">
      <!-- 附件列表 -->
    <div class="attachments">
      <!-- <div class="form-unit">附件列表</div> -->
      <el-form label-width='150px'
               :disabled="!page.isEdit">
        <el-row>
          <el-col>

          </el-col>
        </el-row>
        <span class="breadcrumb-child"
              v-if="page.isEdit"
              style="float: left;margin-top: 10px">
          <i></i>上传附件:
        </span>
        <span style="float: left"
              v-if="page.isEdit">
          <!-- :limit="page.attachment.limit"
                                    :size="page.attachment.size" -->
          <CostFileUpload style="margin-bottom: 20px"
                          v-model="page.attachment.fileList"
                          :attachmentData="page.attachment.attachmentData"
                          :outerId="''">
          </CostFileUpload>
        </span>

      </el-form>
      <DesignAlterationAttachmentTable :queryObj_passed_in='page.attachment.queryModel'
                                       :attaData='page.attachment.attachmentData'
                                       v-on:changeAttachments="changeAttachments"
                                       :showDeleteButton="pageStatus.showDeleteButton"
                                       ref='DesignAlterationAttachmentTable'>
      </DesignAlterationAttachmentTable>
      <div style="height:20px;">&nbsp;</div>
    </div>
    </el-dialog>
    <!-- 按钮区域 -->
    <el-row class="blockButton"
            style="min-width:1030px;">
      <el-form size="mini"
               :inline="true">
        <el-row>
          <el-col :span="3">
            <!-- 科目代码或名称 -->
            <el-input v-model='queryModel.subjectCodeOrName'
                      :placeholder="'科目编码/名称'"
                      style="padding-right:5px;"
                      show-overflow-tooltip
                      :maxlength="20"
                      clearable
                      :disabled="pageModelList.length === 0"></el-input>
          </el-col>

          <el-col :span="3">
            <el-button size="mini"
                       class="special-btn"
                       type='primary'
                       :disabled="pageModelList.length === 0"
                       @click.enter='handleSearch'>{{$l('btn_search')}}</el-button>

            <el-button size="mini"
                       class="ordinary-btn"
                       v-if="!$store.state.user.isFromBpm"
                       @click='handleBack'>{{$l("btn_back")}}</el-button>
          </el-col>
          <el-col :span="2"
                  style="text-align:right">
            <el-upload name="file"
                       style="padding-right:15px;"
                       v-if="page.isEdit"
                       :action="page.importFileUrl"
                       :show-file-list="false"
                       :disabled="pageModelList.length === 0  || pageStatus.finishSubmit"
                       :before-upload="handleUploadBefore"
                       :on-success="handleUploadSuccess"
                       :data="{accountingObjectId:this.queryModel.accountingObjectId,stageId:this.queryModel.stageId,stageVersion:this.queryModel.stageVersion}"
                       accept="multipart/form-data,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel">
              <el-button size="mini"
                         type="primary"
                         :disabled="pageModelList.length === 0  || pageStatus.finishSubmit">{{$l('lbl_standared_subject_import')}}</el-button>
            </el-upload>
          </el-col>
          <el-col :span="15">

            <el-button size="mini"
                       class="special-btn"
                       v-if="page.isEdit"
                       type='primary'
                       @click='handleExport'
                       :disabled="pageModelList.length === 0 || (pageModelList.length >0 && pageModelList[0].data.length ===0) || pageStatus.finishSubmit">{{$l('lbl_standared_subject_export')}}</el-button>

            <!-- 编辑状态+投前+非跨期 引入集团可用 -->
            <el-button size="mini"
                       class="special-btn"
                       v-if="page.isEdit && detailModel.stageId.toString()==='1'  && pageStatus.flag !== 'KUAQI'"
                       type='primary'
                       :disabled="pageModelList.length === 0 || pageStatus.finishSubmit"
                       @click='handleUseCorporationTemplate'>{{$l('lbl_cost_compilation_group_template')}}</el-button>

            <!-- 编辑状态+投前+非跨期 引入集团可用 -->
            <el-button size="mini"
                       class="special-btn"
                       type='primary'
                       v-if="page.isEdit && detailModel.stageId.toString()==='1' && pageStatus.flag !== 'KUAQI'"
                       :disabled="pageModelList.length === 0 || pageStatus.finishSubmit"
                       @click='handleUseProjectTemplate'>{{$l('lbl_cost_compilation_pro_template')}}</el-button>

            <el-button size="mini"
                       class="special-btn"
                       type='primary'
                       v-if="page.isEdit"
                       :disabled="pageModelList.length === 0 
                              || (pageModelList.length >0 && pageModelList[0].data.length ===0) 
                              || (pageStatus.flag!=='KUAQI' && parseInt(pageStatus.hanldeTabIndex) === pageModelList.length - 1) 
                              || pageStatus.finishSubmit"
                       @click='handleEdit'>{{$l('btn_edit')}}</el-button>

            <el-button size="mini"
                       class="special-btn"
                       type='primary'
                       v-if="page.isEdit"
                       :disabled="pageModelList.length === 0 || (pageStatus.flag!=='KUAQI' && parseInt(pageStatus.hanldeTabIndex) === pageModelList.length - 1)  || pageStatus.finishSubmit"
                       @click='handleUndo'>{{$l('btn_cancel')}}</el-button>

            <el-button size="mini"
                       class="special-btn"
                       type='primary'
                       v-if="page.isEdit"
                       :disabled="pageModelList.length === 0 || pageStatus.finishSubmit"
                       @click='handleSave(false)'>{{$l('btn_save')}}</el-button>

            <el-button size="mini"
                       class="special-btn"
                       type='primary'
                       v-if="page.isEdit"
                       :disabled="pageModelList.length === 0 || pageStatus.finishSubmit || pageStatus.onSubmit"
                       @click='handleSave(true)'>{{$l('lbl_cost_compilation_submit')}}</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-row>

    <!-- 普通成本分期 目标成本编制 -->
    <!-- pageStatus.flag === 'PUTONG' -->
    <div v-if="pageStatus.flag !== 'KUAQI'"
         style="margin-top:-15px;margin-bottom:5px;border:none"
         ref="PUTONG_Table"
         v-show="pageModelList.length !== 0">
      <el-tabs type="border-card"
               :lazy="true"
               @tab-click="tabClick">
        <el-tab-pane v-for="(stadge,index) in pageModelList"
                     :key="index"
                     :label="stadge.name">
          <span slot="label">
            <i :class="stadge.icon?stadge.icon:'el-icon-document'"></i>
            {{stadge.name}}
          </span>
          <div>
            <!-- 编制表格 -->
            <el-table :data="stadge.data"
                      :row-style="showRow"
                      align="left"
                      size="small"
                      border
                      :height="tHeight"
                      tooltip-effect="dark"
                      @cell-mouse-enter="handleMouseEnter"
                      v-if="index.toString() === pageStatus.hanldeTabIndex.toString()"
                      style="width: 100%">
              <!-- 序号 -->
              <el-table-column type="index"
                               :label="$l('lbl_no')"
                               :index="indexMethod"
                               width="50"
                               v-if="false"
                               :fixed="stadge.data.length!==0"></el-table-column>
              <!-- 成本科目级别 -->
              <el-table-column prop="subject.level"
                               :label="$l('lbl_standared_subject_level')"
                               width="80"
                               :fixed="stadge.data.length!==0">
                <template slot-scope="scope">{{ scope.row.subject.code | FLevel }}</template>
              </el-table-column>

              <!-- 成本科目编码:render-header="openAnnotation"
                                             label-class-name="编辑状态叶子节点金额为0的可以新增科目，同步到各业态" -->
              <el-table-column prop="subject.code"
                               :label="$l('lbl_standared_subject_code')"
                               min-width="200"
                               align="left"
                               :fixed="stadge.data.length!==0">
                <template slot-scope="scope">
                  <!-- view -->
                  <div v-if="!scope.row._editStatus || !scope.row._isNew"
                       :style="{'float':'left','text-align':'left','padding-left':getSubjectCodePaddingLeft(scope.row)}">
                    <i :class="!scope.row._expanded ? 'fa fa-plus-square-o' : 'fa fa-minus-square-o' "
                       class="subjectCodeExpand"
                       v-if="!checkIsLeaf(scope.row) && !scope.row._editStatus"
                       @click="handleExpandClick(scope.row.subject.code)"></i>&nbsp;{{ scope.row.subject.code }}
                  </div>

                  <!-- edit -->
                  <div v-if="scope.row._editStatus"
                       style="float:left;width:auto">
                    <code-input v-model.trim="scope.row.subject.code"
                                :placeholder="$l('lbl_standared_subject_code')"
                                v-if="scope.row._editStatus && scope.row._canEdit && scope.row._isNew"
                                @blur="handleRowChange('code',scope.row.subject.code,scope.row,scope.$index,$event)" />
                  </div>

                  <!-- 增删科目 -->
                  <div style="float:left;width:40px;text-align:center"
                       :style="{'padding-top':scope.row._isNew?'5px':'0px'}">
                    <!-- 增加科目 -->
                    <i style="font-size:18px;color:#409eff;cursor:pointer"
                       class="el-icon-plus"
                       title="新增下级科目"
                       @click="handleAddClick(scope.$index,scope.row)"
                       v-if="scope.row._hover?checkCanAddRow(scope.row):false"></i>
                    <!-- 删除科目 -->
                    <i style="font-size:18px;color:red;cursor:pointer"
                       class="el-icon-minus"
                       title="删除该科目"
                       @click="handleDeleteClick(scope.$index,scope.row)"
                       v-if="(!scope.row._editStatus  || scope.row._isNew) && scope.row._hover && checkCanDeleteRow(scope.$index,scope.row)"></i>
                  </div>
                </template>
              </el-table-column>

              <!-- 成本科目名称 -->
              <el-table-column prop="subject.name"
                               :label="$l('lbl_standared_subject_name')"
                               width="120"
                               show-overflow-tooltip
                               :fixed="stadge.data.length!==0">
                <template slot-scope="scope">
                  <div style="text-align:left">
                    <!-- view -->
                    <span v-if="!scope.row._editStatus || !scope.row._isNew">
                      <font color='red'>{{getPublicStallOrNotText(scope.row)}}</font>
                      {{scope.row.subject.name}}
                    </span>

                    <!-- edit -->
                    <el-input v-model.trim="scope.row.subject.name"
                              :placeholder="$l('lbl_standared_subject_name')"
                              v-if="scope.row._editStatus  && scope.row._canEdit && scope.row._isNew"
                              @blur="handleRowChange('name',scope.row.subject.name,scope.row,scope.$index,$event)"></el-input>
                  </div>
                </template>
              </el-table-column>

              <!-- 目标成本(含税) -->
              <el-table-column prop="targetCostIncludeTax"
                               :label="'目标成本(含税)(元)'"
                               width="130">
                <template slot-scope="scope">
                  <!-- view -->
                  <span v-if="!scope.row._editStatus">{{scope.row.targetCostIncludeTax | NumFormat}}</span>

                  <!-- edit -->
                  <el-input-number v-model.trim.number="scope.row.targetCostIncludeTax"
                                   :placeholder="'目标成本(含税)'"
                                   v-if="scope.row._editStatus && scope.row._canEdit"
                                   :controls="false"
                                   :min="0"
                                   style="width:100px;"
                                   onmousewheel="return false;"
                                   @blur="handleRowChange('targetCostIncludeTax',scope.row.targetCostIncludeTax,scope.row,scope.$index,$event)"></el-input-number>
                </template>
              </el-table-column>

              <!-- 目标成本(不含税) -->
              <el-table-column prop="targetCostExcludeTax"
                               :label="'目标成本(不含税)(元)'"
                               width="140">
                <template slot-scope="scope">
                  {{scope.row.targetCostExcludeTax | NumFormat}}
                </template>
              </el-table-column>

              <!-- 税率 -->
              <el-table-column prop="taxRate"
                               :label="'税率(%)'"
                               width="90">
                <template slot-scope="scope">
                  <!-- view -->
                  <span v-if="!scope.row._editStatus">
                    <span v-if="scope.row._isLeaf">{{scope.row.taxRate | NumFormat | rateFormat}}</span>
                    <span v-if="!scope.row._isLeaf">-</span>
                  </span>

                  <!-- edit -->
                  <el-input-number v-model.trim.number="scope.row.taxRate"
                                   :placeholder="'税率%'"
                                   v-if="scope.row._editStatus && scope.row._canEdit"
                                   :controls="false"
                                   :min="0"
                                   :max="100"
                                   style="width:60px;"
                                   onmousewheel="return false;"
                                   @blur="handleRowChange('taxRate',scope.row.taxRate,scope.row,scope.$index,$event)"></el-input-number>
                </template>
              </el-table-column>

              <!-- 税额 -->
              <el-table-column prop="tax"
                               :label="'税额(元)'"
                               width="140">
                <template slot-scope="scope">
                  {{scope.row.tax | NumFormat}}
                </template>
              </el-table-column>

              <!-- 在途金额 -->
              <el-table-column prop="tax"
                               :label="'在途金额(元)'"
                               width="100">
                <template slot-scope="scope">
                  {{ifNullValue(scope.row.amountPendingApprove,0) | NumFormat}}
                </template>
              </el-table-column>

              <!-- 已发生金额 -->
              <el-table-column prop="tax"
                               :label="'已发生金额(元)'"
                               width="110">
                <template slot-scope="scope">
                  {{ifNullValue(scope.row.amountOccurence,0) | NumFormat}}
                </template>
              </el-table-column>

              <!-- 可售单方(含税) -->
              <el-table-column prop="saleSmCostIncludeTax"
                               :label="'可售单方(含税)(元/㎡)'"
                               width="150">
                <template slot-scope="scope">
                  {{scope.row.saleSmCostIncludeTax | NumFormat}}
                </template>
              </el-table-column>

              <!-- 可售单方(不含税) -->
              <el-table-column prop="saleSmCostExcludeTax"
                               :label="'可售单方(不含税)(元/㎡)'"
                               width="150">
                <template slot-scope="scope">
                  {{scope.row.saleSmCostExcludeTax | NumFormat}}
                </template>
              </el-table-column>

              <!-- 建面单方(含税) -->
              <el-table-column prop="constructSmCostIncludeTax"
                               :label="'建面单方(含税)(元/㎡)'"
                               width="150">
                <template slot-scope="scope">
                  {{scope.row.constructSmCostIncludeTax | NumFormat}}
                </template>
              </el-table-column>

              <!-- 建面单方(不含税) -->
              <el-table-column prop="constructSmCostExcludeTax"
                               :label="'建面单方(不含税)(元/㎡)'"
                               width="150">
                <template slot-scope="scope">
                  {{scope.row.constructSmCostExcludeTax | NumFormat}}
                </template>
              </el-table-column>

              <!-- 分摊规则 -->
              <el-table-column prop="subject.apportionmentRuleCode"
                               :label="'分摊规则'"
                               show-overflow-tooltip
                               width="80">
                <template slot-scope="scope">
                  <!-- <fd-label :code="scope.row.subject.apportionmentRuleCode"
                                              type="cost_subject_apportionment_rule_code"></fd-label> -->
                  {{scope.row.subject.apportionmentRuleCode?selectData.cost_subject_apportionment_rule_code[scope.row.subject.apportionmentRuleCode]:'-'}}
                </template>
              </el-table-column>

              <!-- 责任部门 -->
              <el-table-column prop="subject.responsibleDeptCode"
                               :label="'责任部门'"
                               show-overflow-tooltip
                               width="80">
                <template slot-scope="scope">
                  <!-- <fd-label :code="scope.row.subject.responsibleDeptCode"
                                              type="cost_subject_responsible_dept_code"></fd-label> -->
                  {{scope.row.subject.responsibleDeptCode?selectData.cost_subject_responsible_dept_code[scope.row.subject.responsibleDeptCode]:'-'}}
                  <!-- <span v-if="!scope.row._editStatus">
                                        <fd-label :code="scope.row.subject.responsibleDeptCode"
                                                  type="cost_subject_responsible_dept_code"></fd-label>
                                    </span>
                                    <fd-select v-model='scope.row.subject.responsibleDeptCode'
                                               type="cost_subject_responsible_dept_code"
                                               :clearable="false"
                                               v-if="scope.row._editStatus && scope.row._canEdit"></fd-select> -->
                </template>
              </el-table-column>

              <!-- 备注(编制) -->
              <el-table-column prop="remark"
                               show-overflow-tooltip
                               :label="$l('lbl_remark')"
                               width="150">
                <template slot-scope="scope">
                  <!-- view -->
                  <span v-if="!scope.row._editStatus">{{scope.row.remark}}</span>

                  <!-- edit -->
                  <el-input v-model.trim="scope.row.remark"
                            :placeholder="$l('lbl_remark')"
                            v-if="scope.row._editStatus && scope.row._canEdit"
                            @blur="handleRowChange('remark',scope.row.remark,scope.row,scope.$index,$event)"></el-input>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>

    <!-- 跨期 目标成本编制 -->
    <!-- pageStatus.flag === 'KUAQI' -->
    <div v-if="pageStatus.flag === 'KUAQI'"
         ref="KUAQI_Table"
         style="margin-top:-15px;margin-bottom:5px;border:none">
      <!-- 编制表格 -->
      <el-table :data="KUQQIData()"
                :row-style="showRow"
                align="left"
                border
                :height="tHeight"
                size="small"
                tooltip-effect="dark"
                @cell-mouse-enter="handleMouseEnter"
                style="width: 100%">
        <!-- 序号 -->
        <el-table-column type="index"
                         :label="$l('lbl_no')"
                         :index="indexMethod"
                         width="50"
                         v-if="false"
                         :fixed="KUQQIData().length!==0"></el-table-column>
        <!-- 成本科目级别 -->
        <el-table-column prop="subject.level"
                         :label="$l('lbl_standared_subject_level')"
                         width="80"
                         :fixed="KUQQIData().length!==0">
          <template slot-scope="scope">{{ scope.row.subject.code | FLevel }}</template>
        </el-table-column>

        <!-- 成本科目编码 :render-header="openAnnotation"
                                 label-class-name="目标成本编制中：科目叶子节点目标成本金额为0的可以新增下级科目，存在业态的各业态科目同步"-->
        <el-table-column prop="subject.code"
                         :label="$l('lbl_standared_subject_code')"
                         min-width="200"
                         align="left"
                         :fixed="KUQQIData().length!==0">
          <template slot-scope="scope">
            <!-- view -->
            <div v-if="!scope.row._editStatus || !scope.row._isNew"
                 :style="{'float':'left','text-align':'left','padding-left':getSubjectCodePaddingLeft(scope.row)}">
              <i :class="!scope.row._expanded ? 'fa fa-plus-square-o' : 'fa fa-minus-square-o' "
                 class="subjectCodeExpand"
                 v-if="!checkIsLeaf(scope.row) && !scope.row._editStatus"
                 @click="handleExpandClick(scope.row.subject.code)"></i>&nbsp;{{ scope.row.subject.code }}
            </div>

            <!-- edit -->
            <div v-if="scope.row._editStatus"
                 style="float:left;width:auto">
              <code-input v-model.trim="scope.row.subject.code"
                          :placeholder="$l('lbl_standared_subject_code')"
                          v-if="scope.row._editStatus && scope.row._canEdit && scope.row._isNew"
                          @blur="handleRowChange('code',scope.row.subject.code,scope.row,scope.$index,$event)" />
            </div>

            <!-- 删除科目 -->
            <div style="float:left;width:40px;text-align:center"
                 :style="{'padding-top':scope.row._isNew?'5px':'0px'}">
              <!-- 增加科目 -->
              <i style="font-size:18px;color:#409eff;cursor:pointer"
                 class="el-icon-plus"
                 title="新增下级科目"
                 @click="handleAddClick(scope.$index,scope.row)"
                 v-if="checkCanAddRow(scope.row)"></i>

              <!-- 删除科目 -->
              <i style="font-size:18px;color:red;cursor:pointer"
                 class="el-icon-minus"
                 title="删除该科目"
                 @click="handleDeleteClick(scope.$index,scope.row)"
                 v-if="(!scope.row._editStatus || scope.row._isNew) && scope.row._hover && checkCanDeleteRow(scope.$index,scope.row)"></i>
            </div>

          </template>
        </el-table-column>

        <!-- 成本科目名称 -->
        <el-table-column prop="subject.name"
                         show-overflow-tooltip
                         :label="$l('lbl_standared_subject_name')"
                         width="120"
                         :fixed="KUQQIData().length!==0">
          <template slot-scope="scope">
            <div style="text-align:left">
              <!-- view -->
              <span v-if="!scope.row._editStatus || !scope.row._isNew"
                    :title="scope.row.subject.name">
                <font color='red'>{{getPublicStallOrNotText(scope.row)}}</font>
                {{scope.row.subject.name | cutString(16)}}
              </span>

              <!-- edit -->
              <el-input v-model.trim="scope.row.subject.name"
                        :placeholder="$l('lbl_standared_subject_name')"
                        v-if="scope.row._editStatus  && scope.row._canEdit && scope.row._isNew"
                        @blur="handleRowChange('name',scope.row.subject.name,scope.row,scope.$index,$event)"></el-input>
            </div>
          </template>
        </el-table-column>

        <!-- 目标成本(含税)-跨期 -->
        <el-table-column prop="targetCostIncludeTax"
                         :label="'目标成本(含税)-跨期(元)'"
                         width="180">
          <template slot-scope="scope">
            <!-- view -->
            <span v-if="!scope.row._editStatus">{{scope.row.targetCostIncludeTax | NumFormat}}</span>

            <!-- edit -->
            <el-input-number v-model.trim.number="scope.row.targetCostIncludeTax"
                             :placeholder="'目标成本(含税)-跨期'"
                             v-if="scope.row._editStatus && scope.row._canEdit"
                             :controls="false"
                             :min="0"
                             style="width:100px;"
                             onmousewheel="return false;"
                             @blur="handleRowChange('targetCostIncludeTax',scope.row.targetCostIncludeTax,scope.row,scope.$index,$event)"></el-input-number>
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
                         :label="'税率%'"
                         width="90">
          <template slot-scope="scope">
            <!-- view -->
            <span v-if="!scope.row._editStatus">
              <span v-if="scope.row._isLeaf">{{scope.row.taxRate | NumFormat | rateFormat}}</span>
              <span v-if="!scope.row._isLeaf">-</span>
            </span>

            <!-- edit -->
            <span v-if="scope.row._editStatus && scope.row._canEdit">
              <el-input-number v-model.trim.number="scope.row.taxRate"
                               :placeholder="'税率(%)'"
                               :controls="false"
                               :min="0"
                               :max="100"
                               style="width:60px;"
                               onmousewheel="return false;"
                               @blur="handleRowChange('taxRate',scope.row.taxRate,scope.row,scope.$index,$event)"></el-input-number>
            </span>

          </template>
        </el-table-column>

        <!-- 在途金额 -->
        <el-table-column prop="tax"
                         :label="'在途金额(元)'"
                         width="100">
          <template slot-scope="scope">
            {{ifNullValue(scope.row.amountPendingApprove,0) | NumFormat}}
          </template>
        </el-table-column>

        <!-- 已发生金额 -->
        <el-table-column prop="tax"
                         :label="'已发生金额(元)'"
                         width="110">
          <template slot-scope="scope">
            {{ifNullValue(scope.row.amountOccurence,0) | NumFormat}}
          </template>
        </el-table-column>

        <!-- 动态列 -->
        <el-table-column v-for="(item,index) in pageStatus.attributes"
                         :label="getAttributesLabel(item,0)"
                         :key="index">
          <el-table-column width="100"
                           label="不参与跨期">
            <template slot-scope="scope">
              <el-checkbox :disabled="!scope.row._editStatus || !scope.row._canEdit"
                           v-if="checkIsLeaf(scope.row)"
                           :checked="KUAQI_Checkbox(scope.row,item)"
                           @change="checked=>KUAQI_Checkbox_Change(scope.$index,scope.row,item,checked)"></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column width="130"
                           label="目标成本(含税)(元)">
            <template slot-scope="scope">
              <span>{{getKUAQIAmount('IncludeFax',scope.row,item) | NumFormat}}</span>
            </template>
          </el-table-column>
          <el-table-column width="140"
                           label="目标成本(不含税)(元)">
            <template slot-scope="scope">
              <span>{{getKUAQIAmount('ExcludeFax',scope.row,item) | NumFormat}}</span>
            </template>
          </el-table-column>
          <el-table-column width="140"
                           label="税额(元)">
            <template slot-scope="scope">
              <span>{{getKUAQIAmount('Tax',scope.row,item) | NumFormat}}</span>
            </template>
          </el-table-column>
        </el-table-column>

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
                         width="120"
                         v-if="false">
          <template slot-scope="scope">
            <!-- <fd-label :code="scope.row.subject.financialSubjectCode"
                                  type="cost_subject_financial_subject_name"></fd-label> -->
            {{selectData.cost_subject_financial_subject_name[scope.row.subject.financialSubjectCode]}}
            <!-- <span v-if="!scope.row._editStatus">
                            <fd-label :code="scope.row.subject.financialSubjectCode"
                                      type="cost_subject_financial_subject_name"></fd-label>
                        </span>
                        <fd-select v-model='scope.row.subject.financialSubjectCode'
                                   type="cost_subject_financial_subject_name"
                                   :clearable="false"
                                   v-if="scope.row._editStatus"></fd-select> -->
          </template>
        </el-table-column>

        <!-- 分摊规则 -->
        <el-table-column prop="subject.apportionmentRuleCode"
                         :label="'分摊规则'"
                         show-overflow-tooltip
                         width="80">
          <template slot-scope="scope">
            {{scope.row.subject.apportionmentRuleCode?selectData.cost_subject_apportionment_rule_code[scope.row.subject.apportionmentRuleCode]:'-'}}
          </template>
        </el-table-column>

        <!-- 责任部门 -->
        <el-table-column prop="subject.responsibleDeptCode"
                         :label="'责任部门'"
                         show-overflow-tooltip
                         width="80">
          <template slot-scope="scope">
            <!-- <fd-label :code="scope.row.subject.responsibleDeptCode"
                                  type="cost_subject_responsible_dept_code"></fd-label> -->
            {{scope.row.subject.responsibleDeptCode?selectData.cost_subject_responsible_dept_code[scope.row.subject.responsibleDeptCode]:'-'}}
            <!-- <span v-if="!scope.row._editStatus">
                            <fd-label :code="scope.row.subject.responsibleDeptCode"
                                      type="cost_subject_responsible_dept_code"></fd-label>
                        </span>
                        <fd-select v-model='scope.row.subject.responsibleDeptCode'
                                   type="cost_subject_responsible_dept_code"
                                   :clearable="false"
                                   v-if="scope.row._editStatus && scope.row._canEdit"></fd-select> -->
          </template>
        </el-table-column>

        <!-- 备注(编制) -->
        <el-table-column prop="remark"
                         show-overflow-tooltip
                         :label="$l('lbl_remark')"
                         width="150">
          <template slot-scope="scope">
            <!-- view -->
            <span v-if="!scope.row._editStatus || !scope.row._isNew">{{scope.row.remark}}</span>

            <!-- edit -->
            <el-input v-model.trim="scope.row.remark"
                      :placeholder="$l('lbl_remark')"
                      v-if="scope.row._editStatus && scope.row._canEdit && scope.row._isNew"
                      @blur="handleRowChange('remark',scope.row.remark,scope.row,scope.$index,$event)"></el-input>
          </template>
        </el-table-column>

      </el-table>
    </div>

    
  </div>
</template>

<script>
import { LoadingUtil } from "@/utils/common/LoadingUtil";
import { calc } from "@/utils/common/calc";
import COSTBUSINESS from "@/utils/cost/business";
import {
  checkTargetCostVersion, // 检查成本分期
  getStandaredSubjectList, // 获取集团科目模板
  getAccountingSubjectList, // 获取其他项目编制科目模板
  saveDraftVersion, // 保存编制
  updateDraftVersion, // 更新编制
  submitStageVersionRequest, // 提交编制
  getTargetCostcompilationDetail, // 当前成本分期编制明细
  getOtherProjectTemplate // 其他模板
} from "@/api/cost/targetCostCompilationAPI";
import {
  getAccountingObjectCommonInfo // 获取基本信息
} from "@/api/cost/targetCostQueryAPI";
import {
  NumFormat, // 千位符
  FLevel,
  dateFormat,
  Version,
  cutString,
  rateFormat
} from "@/filters/cost/";
import codeInput from "@/components/cost/CodeInput/";
import AccountingTargetSelector from "@/components/cost/AccountingTargetSelector/";
import COSTENUM from "@/utils/cost/enum";
import { deepCopy, ifNull } from "@/utils/cost/objectHelper";
import { FPhase } from "@/filters/cost/";
import {
  getLocalItem,
  setLocalItem,
  removeLocalItem
} from "@/utils/common/cache";
import { getProjectAccountingTargetTree } from "@/api/cost/selectTargetCostAPI";
import { tableHeight } from "@/utils/common/index";
import CostFileUpload from "@/components/cost/UploadFile/";
import DesignAlterationAttachmentTable from "@/views/cost/designAlteration/DesignAlterationAttachmentTable";
import { setTimeout } from "timers";
import sys_config from "@/config/config.js";
export default {
  data() {
    return {
      flag:false,
      bpmUrl:'',
      dialogTableVisible:false,
      AccountingTargetSelectorIsUsed: false, //是否使用成本分期选择级联
      calcTableHeight: {
        otherHeight: 360,
        sideCloseHeight: 50
      },
      PUTONG_TableHeight: "0",
      KUAQI_TableHeight: "0",
      selectData: {
        cost_stage_id: [],
        cost_subject_financial_subject_name: [],
        cost_subject_apportionment_rule_code: [],
        cost_subject_responsible_dept_code: [],
        cost_drawing_version: [],
        cost_allocation_standard: []
      },
      page: {
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
        dialog: {
          dialogSelect: false,
          queryModel: {
            companyId: "",
            projectId: "",
            accObjId: "",
            filterCompanyId: ""
          },
          showSetting: {
            group: false, // 显示集团
            company: false, // 显示公司
            dept: true, // 显示部门
            project: false, // 显示项目
            accObj: true // 显示成本分期
          },
          clearableSetting: {
            group: false,
            company: false,
            dept: false,
            project: false,
            accObj: false
          },
          deptList: [],
          tableData: []
        },
        id: "", // 编制id
        isEdit: false,
        statusName: "",
        importFileUrl: COSTBUSINESS.upload(
          process.env.COST_API + "/targetCost/defineStageVersion/import"
        )
      },
      pageStatus: {
        blockDetailActiveName: "",
        expandedLevel: sys_config.expandedLevel, //默认展开二级
        maxLevel: 9999,
        specialNode: COSTENUM.SPECIAL_SUBJECT_CODE_FLAG,
        intertemporalFlag: "跨期", // 跨期标识,通过成本分期名称this.queryModel.accountingObjectText
        periodizationFlag: ["一期", "二期", "三期", "四期", "五期", "六期"], // 分期标识
        attributes: [], // 当前包含的分期
        flag: "PUTONG", // PUTONG普通,FENQI是跨期,KUAQI是分期
        hanldeTabIndex: "0",
        containBusinessType: false, // 包含业态
        checkSave: true, // 能否保存
        finishSave: false, // 完成保存
        finishSubmit: false, // 完成审批
        onSubmit: false, //正在审批
        showDeleteButton: true //是否显示删除按钮
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
        subjectCode: "",
        subjectName: "",
        subjectCodeOrName: "", //科目编码和名称
        show: {
          group: true,
          company: true,
          dept: true,
          account: true
        }
      },
      detailModel: {
        canSaleAcreage: 0,
        targetCostContainTax: null,
        editPerson: null,
        buildingAcreage: 0,
        targetCostWithoutTax: null,
        eidtDate: null,
        canSalePart: null,
        adjustLevel: null,
        flowStatus: null,
        buildingAcreagePart: null,
        totalBuildingHoldArea: null,
        stageVersion: null,
        stageId: 0,
        //图纸版本
        drawingVersion: null,
        //配置标准
        allocationStandard: null,
        //参考地区
        cityName: "",
        //审批日期
        auditApprovalDate: null,
        //平均售价含车位(元)
        avgPrice: null,
        //预备会召开时间
        prepareMeetingTime: null
      },
      pageModelList: [], // [{ constructType: '1', name: '联排别墅(A)', data: [] }, { constructType: '2', name: '独栋别墅(B)', data: [] }, { constructType: '', name: '项目一(A+B)', data: [] }],
      pagePreEditModelList: null, // 编辑前的数据，撤销编辑使用
      pageModel: {
        id: null, // cost_target_cost.id
        // 'createdBy': null,
        // 'createdDate': null,
        // 'updatedBy': null,
        // 'updatedDate': null,
        version: null,
        accountingObjectId: null, // 成本分期ID
        stageId: "", //	项目阶段ID
        constructType: null, // 业态
        subjectId: null, // 关联科目表UUID  对应subject.id
        targetCostIncludeTax: 0, // 目标成本(含税) 【页面编辑】，exp：100
        targetCostExcludeTax: 0, //	目标成本(不含税) exp:100*(1-0.17)
        taxRate: 0, // 税率 【页面编辑】exp：0.17
        tax: 0, // 税额 exp:100*0.17
        saleSmCostIncludeTax: 0, // 可售单方（含税）exp: (100/detailModel.canSaleAcreage).toFixed(2)
        saleSmCostExcludeTax: 0, //	可售单方（不含税） exp:((100*(1-0.17))/detailModel.canSaleAcreage).toFixed(2)
        constructSmCostIncludeTax: 0, // 建面单方（含税）exp: (100/detailModel.buildingAcreage).toFixed(2)
        constructSmCostExcludeTax: 0, // 建面单方（不含税）exp:((100*(1-0.17))/detailModel.buildingAcreage).toFixed(2)
        remark: null,
        isDeleted: "0",
        stageVersion: "", // 阶段版本（如投后阶段，1.0为草稿）
        targetCostModelList: null, // ？？？
        subject: {
          id: "",
          // 'createdBy': 'admin',
          // 'createdDate': '2018-07-16T09:11:02.000+0000',
          // 'updatedBy': 'admin',
          // 'updatedDate': '2018-07-16T09:04:58.000+0000',
          version: "0",
          name: "", // 成本科目名称
          code: "", // 成本科目编码
          level: "1", // 成本科目级别
          financialSubjectCode: "", // 财务科目code
          financialSubjectName: "", // 财务科目名称
          categoryCode: "0", // 类别
          apportionmentRuleCode: "0", // 分摊规则
          responsibleDeptCode: "0", // 责任部门
          responsibleLine: "", // 责任条线
          status: "1",
          parent: "0", // 父节点 【逻辑编辑】
          childs: "",
          sort: "0",
          type: "3", // 0：集团科目，1：公司科目， 2: 项目科目 , 3:成本分期
          ownerId: "", // 成本分期id 【逻辑编辑】
          stageId: "", // 阶段ID 【逻辑编辑】
          nodeSource: COSTENUM.subjectNodeSourceType.PROJECT, // 0: 集团科目 ，1: 自建科目
          isDeleted: "0",
          stageVersion: "" // 阶段版本号 【逻辑编辑】
        },
        // 辅助字段
        _isLeaf: true,
        _canEdit: false,
        _editStatus: false,
        _expanded: true,
        _show: true,
        _isNew: false,
        _hover: false
      }
    };
  },
  filters: {
    NumFormat,
    FLevel,
    dateFormat,
    Version,
    cutString,
    rateFormat
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
  components: {
    AccountingTargetSelector,
    "code-input": codeInput,
    CostFileUpload,
    DesignAlterationAttachmentTable
  },
  created() {
    this.initDictionary();
  },
  mounted() {
    this.initPage();
  },

  methods: {
    jump(){
      if(this.bpmUrl != ""){
        window.open(this.bpmUrl,"_blank")
      }
    },
    // 附件列表展示
    filedialog(){
      this.dialogTableVisible = !this.dialogTableVisible;
    },
    //科目左边距
    getSubjectCodePaddingLeft(rowData) {
      return (
        (this.getLevel(rowData.subject.code) - 1) * 10 +
        (this.checkIsLeaf(rowData)
          ? (this.getLevel(rowData.subject.code) - 1) * 5
          : 0) +
        "px"
      );
    },
    // 初始化字典
    initDictionary() {
      // 字典
      let allDICTIONARY = getLocalItem("DICTIONARY");
      allDICTIONARY = JSON.parse(allDICTIONARY);

      allDICTIONARY["cost_stage_id"] &&
        allDICTIONARY["cost_stage_id"].map(item => {
          this.selectData.cost_stage_id[item.dictValue] = item.dictLabelCn;
        });
      allDICTIONARY["cost_subject_financial_subject_name"] &&
        allDICTIONARY["cost_subject_financial_subject_name"].map(item => {
          this.selectData.cost_subject_financial_subject_name[item.dictValue] =
            item.dictLabelCn;
        });
      allDICTIONARY["cost_subject_apportionment_rule_code"] &&
        allDICTIONARY["cost_subject_apportionment_rule_code"].map(item => {
          this.selectData.cost_subject_apportionment_rule_code[item.dictValue] =
            item.dictLabelCn;
        });
      allDICTIONARY["cost_subject_responsible_dept_code"] &&
        allDICTIONARY["cost_subject_responsible_dept_code"].map(item => {
          this.selectData.cost_subject_responsible_dept_code[item.dictValue] =
            item.dictLabelCn;
        });
      allDICTIONARY["cost_drawing_version"] &&
        allDICTIONARY["cost_drawing_version"].map(item => {
          this.selectData.cost_drawing_version[item.dictValue] =
            item.dictLabelCn;
        });
      allDICTIONARY["cost_allocation_standard"] &&
        allDICTIONARY["cost_allocation_standard"].map(item => {
          this.selectData.cost_allocation_standard[item.dictValue] =
            item.dictLabelCn;
        });
    },
    //初始化页面
    initPage() {
      //   window.onresize = () => {
      //     return (() => {
      //       let _tableHeight = document.body.clientHeight - this.calcTableHeight.otherHeight
      //       this.tHeight = _tableHeight + 'px'
      //     })()
      //   }
      this.page.id = this.$route.query.accountingObjectId
        ? this.$route.query.accountingObjectId
        : "0";
      if (this.$route.query.isEdit) {
        this.page.isEdit = this.$route.query.isEdit.toString() === "true";
      } else {
        this.page.isEdit = false;
      }

      if (this.page.id === "0") {
        this.page.statusName = "新增";
        this.$showNormalSuccess("请选择‘成本分期’开始编制调整");
      } else {
        this.page.statusName = this.page.isEdit ? "编辑" : "查看";
      }
      this.queryModel.accountingObjectId = this.$route.query.accountingObjectId
        ? this.$route.query.accountingObjectId
        : "0";
      this.queryModel.accountingObjectText = this.$route.query
        .accountingObjectText
        ? this.$route.query.accountingObjectText
        : "";
      this.queryModel.stageId = this.$route.query.stageId
        ? this.$route.query.stageId
        : "0";
      this.queryModel.stageVersion = this.$route.query.stageVersion
        ? this.$route.query.stageVersion
        : "0";
      this.initPageStatusFlag();

      this.$nextTick(function() {
        this.initTableHeight();
      });

      //是否删除
      this.pageStatus.showDeleteButton = this.page.isEdit === true;

      //是否加载级联select
      if (this.page.id === "0" || this.page.id === "") {
        this.AccountingTargetSelectorIsUsed = true;
      } else {
        this.AccountingTargetSelectorIsUsed = false;
      }
    },
    //附件
    changeAttachments(data) {
      this.page.attachment.attachmentData = data;
    },
    //表格高度
    initTableHeight() {
      if (this.pageStatus.flag !== "KUAQI") {
        this.PUTONG_TableHeight =
          document.documentElement.clientHeight -
          this.$refs.PUTONG_Table.getBoundingClientRect().top -
          340;
        if (this.PUTONG_TableHeight < 300) this.PUTONG_TableHeight = 300;
        this.$refs.PUTONG_Table.style.Height = this.PUTONG_TableHeight + "px";
      } else if (this.pageStatus.flag === "KUAQI") {
        this.KUAQI_TableHeight =
          document.documentElement.clientHeight -
          this.$refs.KUAQI_Table.getBoundingClientRect().top -
          50;
        if (this.KUAQI_TableHeight < 300) this.KUAQI_TableHeight = 300;
        this.$refs.KUAQI_Table.style.Height = this.KUAQI_TableHeight + "px";
      }
    },
    // 是否为空
    ifNullValue(value, defaultValue) {
      return ifNull(value, defaultValue);
    },
    // 科目不跨期 选择状态
    KUAQI_Checkbox(rowData, KUAQI_Item) {
      if (rowData.subject.acrossPhase && KUAQI_Item) {
        return (
          ("_" + rowData.subject.acrossPhase).indexOf(
            KUAQI_Item.toUpperCase()
          ) > -1
        );
      } else {
        return false;
      }
    },
    // 科目不跨期 选择改变状态
    KUAQI_Checkbox_Change(index, rowData, item, checked) {
      let checkAcrossPhase = [];
      let _item = item ? item.replace("_", "") : "";
      _item = _item.toUpperCase();
      checkAcrossPhase = rowData.subject.acrossPhase
        ? rowData.subject.acrossPhase.split(",")
        : [];
      if (checked) {
        if (checkAcrossPhase.indexOf(_item) < 0) checkAcrossPhase.push(_item);
      } else {
        if (checkAcrossPhase.indexOf(_item) > -1)
          checkAcrossPhase.splice(checkAcrossPhase.indexOf(_item), 1); // 删除
      }
      rowData.subject.acrossPhase = checkAcrossPhase.join(",");
      //重算
      this.calcRowData(index, rowData);
    },
    // 目标成本不含税=目标成本（含税）/（1+税率）
    calcTargetCostExcludeTax(rowData) {
      return (
        calc
          .Div(
            ifNull(rowData.targetCostIncludeTax, 0),
            1 + ifNull(rowData.taxRate, 0) / 100
          )
          .toFixed(2) / 1
      );
    },
    getKUAQIAmount(typeName, rowData, item) {
      if (!rowData._isLeaf) return 0;
      // 不跨期的
      if (
        rowData.subject.acrossPhase &&
        rowData.subject.acrossPhase.indexOf(item) > -1
      )
        return 0; //不参与跨期直接返回0

      let _amount = 0;
      let _targetCostIncludeTax = ifNull(rowData.targetCostIncludeTax, 0) || 0;
      let _taxRate = ifNull(rowData.taxRate, 0) / 100 || 0;
      let _kuaiqi = rowData.attributes["project_phase_rate" + item] || 0;

      _amount = ifNull(rowData.attributes["project_phase_amount" + item], 0);
      switch (typeName) {
        case "IncludeFax":
          break;
        case "ExcludeFax":
          if (rowData.attributes["project_phase_amount_excludetax" + item]) {
            _amount =
              rowData.attributes["project_phase_amount_excludetax" + item];
          } else {
            _amount = calc.Mul(_amount, 1 - _taxRate);
          }

          break;
        case "Tax":
          if (rowData.attributes["project_phase_amount_tax" + item]) {
            _amount = rowData.attributes["project_phase_amount_tax" + item];
          } else {
            _amount = calc.Mul(_amount, _taxRate);
          }
          break;
        default:
          break;
      }
      return _amount;
    },
    // 公摊非公摊标识
    getPublicStallOrNotText(rowData) {
      let _showText = "";
      if (!rowData._isNew && rowData._isLeaf) {
        // _canEdit标识为叶子
        if (this.pageStatus.flag === "KUAQI") {
          if (
            rowData.subject.publicStallOrNot === COSTENUM.publicStallType.NO
          ) {
            _showText = "[非公摊]";
          } else {
            _showText = "";
          }
        } else {
          if (
            rowData.subject.publicStallOrNot === COSTENUM.publicStallType.YES
          ) {
            _showText = "[公摊]";
          } else {
            _showText = "";
          }
        }
      }
      return _showText;
    },
    // 动态列表名称
    getAttributesLabel(item, type) {
      return FPhase(item);
    },
    // 序号
    indexMethod(index) {
      return index + 1;
    },
    // 跨期数据
    KUQQIData() {
      return this.pageModelList.length !== 0 ? this.pageModelList[0].data : [];
    },
    // 检查跨期,分期
    initPageStatusFlag() {
      this.pageStatus.flag = "PUTONG";
      this.pageStatus.flag = COSTBUSINESS.getAccountingTargetType({
        name: this.queryModel.accountingObjectText
      });
    },
    // 初始化基本信息
    initCommonInfoData(response) {
      let _this = this;
      if (!response.data) {
        this.$showNormalError("没有可用数据");
        return;
      }
      this.detailModel.stageId = response.data.stageId
        ? parseInt(response.data.stageId)
        : 0;
      this.detailModel.canSaleAcreage = ifNull(response.data.totalSellArea, 0); //可售面积
      this.detailModel.targetCostContainTax = ifNull(
        response.data.targetCostIncludeTax,
        0
      );
      this.detailModel.editPerson = response.data.maker;
      this.detailModel.buildingAcreage = ifNull(
        response.data.totalBuildingArea,
        0
      ); // 建筑面积
      this.detailModel.totalBuildingHoldArea = ifNull(
        response.data.totalBuildingHoldArea,
        0
      ); //占地面积
      this.detailModel.targetCostWithoutTax = ifNull(
        response.data.targetCostExcludeTax,
        0
      );
      this.detailModel.eidtDate = response.data.makeDate; //this.$route.query.updatedDate ? this.$route.query.updatedDate : response.data.makeDate
      this.detailModel.canSalePart = ifNull(
        response.data.saleSmCostIncludeTax,
        0
      );
      this.detailModel.adjustLevel = null;
      this.detailModel.flowStatus = response.data.approvalStatusName || "";
      this.bpmUrl = response.data.tcBpmUrl
      if(this.bpmUrl != ""){
        this.flag = true
      }
      this.detailModel.buildingAcreagePart = ifNull(
        response.data.constructSmCostIncludeTax,
        0
      );
      this.detailModel.stageVersion = response.data.targetCostVersion;
      this.detailModel.cityName = response.data.cityName;

      this.queryModel.accountingObjectText = response.data.name;

      if (
        COSTENUM.accountingTargetCNType.includes(
          this.queryModel.accountingObjectText
        )
      ) {
        this.queryModel.accountingObjectText =
          response.data.projectName + response.data.name;
      }

      if (this.page.id === "0") {
        this.queryModel.stageId = response.data.stageId;
        this.queryModel.stageVersion = response.data.targetCostVersion;
      }

      //设置页面标识
      this.initPageStatusFlag();

      //汇总各业态的数据
      this.detailModel.buildingAcreage_sum = 0; // 建筑面积
      this.detailModel.canSaleAcreage_sum = 0; //可售面积
      this.detailModel.totalBuildingHoldArea_sum = 0; //占地面积

      if (this.page.id !== "0" || this.queryModel.accountingObjectId) {
        if (this.pageStatus.flag !== "KUAQI") {
          if (response.data.businessTypeList) {
            if (response.data.businessTypeList.length !== 0)
              this.pageStatus.containBusinessType = true; // 包含业态
            this.pageModelList = [];
            response.data.businessTypeList.map(item => {
              //汇总各业态的数据
              this.detailModel.buildingAcreage_sum = calc.Add(
                this.detailModel.buildingAcreage_sum,
                ifNull(item.totalBuildingArea, 0)
              ); // 建筑面积
              this.detailModel.canSaleAcreage_sum = calc.Add(
                this.detailModel.canSaleAcreage_sum,
                ifNull(item.totalSellArea, 0)
              ); //可售面积
              this.detailModel.totalBuildingHoldArea_sum = calc.Add(
                this.detailModel.totalBuildingHoldArea_sum,
                ifNull(item.totalBuildingHoldArea, 0)
              ); //占地面积

              this.pageModelList.push({
                constructType: item.code,
                name: item.name,
                totalBuildingArea: ifNull(item.totalBuildingArea, 0), // 建筑面积
                totalSellArea: ifNull(item.totalSellArea, 0), //可售面积
                totalBuildingHoldArea: ifNull(item.totalBuildingHoldArea, 0), //占地面积
                data: []
              });
            });
            //增加“公摊成本”
            this.pageModelList.push({
              constructType: "GTCB",
              icon: "fa fa-sliders",
              name: "公摊成本",
              totalBuildingArea: this.detailModel.buildingAcreage_sum, //为各业态合计
              totalSellArea: this.detailModel.canSaleAcreage_sum, //为各业态合计
              totalBuildingHoldArea: this.detailModel.totalBuildingHoldArea_sum, //为各业态合计
              data: []
            });
            //增加”成本分期“
            this.pageModelList.push({
              constructType: "CBFQ",
              icon: "fa fa-flag",
              name: _this.queryModel.accountingObjectText,
              data: []
            });
          } else {
            this.$showNormalError("业态数据为空");
          }
        } else {
          // 跨期
          this.pageModelList.push({
            constructType: null,
            name: null,
            data: []
          });
        }
      }
      //console.info(response)
    },
    // 获取基本信息
    getCommonInfo(accountingObjectId, stageId, stageVersion) {
      if (accountingObjectId && accountingObjectId !== "0") {
        LoadingUtil.showLoading();
        let _stageId = stageId ? stageId : this.queryModel.stageId;
        let _stageVersion = stageVersion
          ? stageVersion
          : this.queryModel.stageVersion;
        getAccountingObjectCommonInfo({
          accountObjectId: accountingObjectId
            ? accountingObjectId
            : this.queryModel.accountingObjectId,
          stageId: _stageId,
          stageVersion: _stageVersion
        })
          .then(response => {
            LoadingUtil.hideLoading();
            this.initCommonInfoData(response);
            this.queryModel.accountingObjectId = accountingObjectId;
            this.page.statusName !== "新增"
              ? this.getDetail()
              : this.checkDetail();
          })
          .catch(error => {
            console.log(error);
            LoadingUtil.hideLoading();
            this.$showError(error.message ? error.message : "msg_system_error");
          });
      }
    },
    // 获取基本信息
    getCommonInfoAfterSave(accountingObjectId, stageId, stageVersion) {
      LoadingUtil.showLoading();
      getAccountingObjectCommonInfo({
        accountObjectId: accountingObjectId,
        stageId: stageId,
        stageVersion: stageVersion
      })
        .then(response => {
          LoadingUtil.hideLoading();
          this.initCommonInfoData(response);
          this.queryModel.accountingObjectId = accountingObjectId;
          this.getDetailAfterSave(accountingObjectId, stageId, stageVersion);
        })
        .catch(error => {
          console.log(error);
          LoadingUtil.hideLoading();
          this.$showError(error.message ? error.message : "msg_system_error");
        });
    },
    // 获取成本分期明细
    getDetailAfterSave(accountingObjectId, stageId, stageVersion) {
      getTargetCostcompilationDetail({
        accountingObjectId: accountingObjectId,
        stageId: stageId,
        stageVersion: stageVersion
      })
        .then(response => {
          this.initDetailData(response);
          LoadingUtil.hideLoading();
        })
        .catch(error => {
          console.log(error);
          LoadingUtil.hideLoading();
          this.$showError(error.message ? error.message : "msg_system_error");
        });
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
      this.initPageStatusFlag();
      this.$nextTick(function() {
        this.initTableHeight();
      });
    },
    // 设置为编辑状态
    setEditStatus() {
      return; // todo 过度开发状态
      if (
        this.page.isEdit &&
        this.pageModelList.length > 0 &&
        !this.pageStatus.finishSubmit
      ) {
        let _index = 0;
        if (this.pageModelList.length > 1) {
          if (_index < this.pageModelList.length - 1) {
            this.pageModelList.map(item => {
              item.data.map(item1 => {
                item1._editStatus = true;
              });
            });
          }
          _index++;
        } else {
          this.pageModelList.map(item => {
            item.data.map(item1 => {
              item1._editStatus = true;
            });
          });
        }
      }
    },
    // 跨期数据根据”不跨期”是否选择
    calcKUAQITableData() {},
    // 初始化是否叶子可编辑
    initDataEditStatus() {
      for (let i = 0; i < this.pageModelList.length; i++) {
        this.pageModelList[i].data.map(item => {
          //if (this.getParentChild(item.subject.code).length === 0) {
          if (this.checkIsLeaf(item)) {
            item._canEdit = true;
            item._isLeaf = true;
            if (
              this.pageStatus.flag === "KUAQI" &&
              item.subject.publicStallOrNot === COSTENUM.publicStallType.NO
            ) {
              // 跨期非公摊不可编辑
              item._canEdit = false;
            }
            if (
              this.pageStatus.flag !== "KUAQI" &&
              item.subject.publicStallOrNot === COSTENUM.publicStallType.YES
            ) {
              // 非跨期公摊不可编辑
              item._canEdit = false;
            }
          } else {
            item._isLeaf = false;
            item._canEdit = false;
          }
        });
      }
    },
    // 初始化数据
    initTableData(response) {
      if (!response.data) {
        this.$showNormalError("没有可用数据");
        return;
      }
      // project_phase_amount
      // project_phase_rate
      if (response.data.targetCostModelList) {
        let itemIndex = 0;
        response.data.targetCostModelList.map(item => {
          item._editStatus = false;
          item._expanded = true;

          // 集团的.99隐藏
          item._show = !COSTBUSINESS.checkIsSpecialCode(item.subject);

          item._isNew = false;
          item._hover = false;
          item.accountingObjectId = this.queryModel.accountingObjectId;
          item.stageId = this.detailModel.stageId;
          item.stageVersion = this.queryModel.stageVersion;
          item.taxRate = calc.Mul(ifNull(item.taxRate, 0), 100);
          item.targetCostIncludeTax = ifNull(item.targetCostIncludeTax, 0);

          //处理默认展开级别
          item.subject.level = item.subject.code.split(".").length;
          item._expanded =
            calc.Mul(ifNull(item.subject.level, 0), 1) <
            this.pageStatus.expandedLevel + 1;
          item._show =
            item._show &&
            calc.Mul(ifNull(item.subject.level, 0), 1) <
              this.pageStatus.expandedLevel + 2;

          // 跨期数据
          // 0 为待分期，1-10为跨期的分期
          if (this.pageStatus.flag === "KUAQI" && itemIndex === 0) {
            if (item.attributes) {
              let i = 1;
              while (i < 10) {
                if (
                  typeof item.attributes["project_phase_amount" + i] !==
                    "undefined" &&
                  this.pageStatus.attributes.indexOf(i.toString()) < 0
                ) {
                  this.pageStatus.attributes.push(i.toString()); // 页面存在分期的标识
                }
                i++;
              }
              if (
                typeof item.attributes["project_phase_amount_tobe"] !==
                  "undefined" &&
                this.pageStatus.attributes.indexOf(i.toString()) < 0
              ) {
                this.pageStatus.attributes.push("_tobe"); // 页面存在待分期的标识
              }
            }
          }
          itemIndex++;
        });
        this.pageModelList.map(item => {
          item.data = deepCopy(response.data.targetCostModelList);
        });
      } else {
        response.data.map(item => {
          item._editStatus = false;
          item._expanded = true;

          item._show = !COSTBUSINESS.checkIsSpecialCode(item.subject);

          item._isNew = false;
          item._hover = false;
          item.accountingObjectId = this.queryModel.accountingObjectId;
          item.stageId = this.detailModel.stageId;
          item.stageVersion = this.queryModel.stageVersion;
          item.taxRate = calc.Mul(ifNull(item.taxRate, 0), 100);
          item.targetCostIncludeTax = ifNull(item.targetCostIncludeTax, 0);

          //处理默认展开级别
          item.subject.level = item.subject.code.split(".").length;
          item._expanded =
            calc.Mul(ifNull(item.subject.level, 0), 1) <
            this.pageStatus.expandedLevel + 1;
          item._show =
            item._show &&
            calc.Mul(ifNull(item.subject.level, 0), 1) <
              this.pageStatus.expandedLevel + 2;
        });
        this.pageModelList.map(item => {
          item.data = deepCopy(response.data);
        });
      }

      // 处理业态
      if (this.pageStatus.flag !== "KUAQI") {
        this.pageModelList.map(item => {
          item.data.map(d => {
            d.businessTypeCode = item.constructType;
            d.constructType = item.constructType;
            d.businessTypeName = item.name;
          });
        });
      } else {
        this.pageModelList.map(item => {
          item.businessTypeCode = this.pageStatus.flag;
          item.constructType = this.pageStatus.flag;
          item.businessTypeName = "跨期";
        });
      }
      this.calcKUAQITableData();

      this.initDataEditStatus();

      this.setEditStatus();
    },
    // 初始化查看编辑数据
    //跨期
    initKUAQIData(response) {
      this.pageStatus.attributes = [];
      if (
        response.data &&
        response.data.targetCostModelList &&
        response.data.targetCostModelList.length > 0
      ) {
        if (response.data.targetCostModelList[0].targetCostModelList) {
          response.data.targetCostModelList[0].targetCostModelList.map(item => {
            item._editStatus = false;
            item._expanded = true;
            item._show = !COSTBUSINESS.checkIsSpecialCode(item.subject);
            item._isNew = false;
            item._hover = false;
            item.taxRate = calc.Mul(ifNull(item.taxRate, 0), 100);
          });
          this.pageModelList[0].data =
            response.data.targetCostModelList[0].targetCostModelList;
        }
      } else {
        if (response.data && response.data[0].targetCostModelList) {
          response.data[0].targetCostModelList.map(item => {
            item._editStatus = false;
            item._expanded = true;
            item._show = !COSTBUSINESS.checkIsSpecialCode(item.subject);
            item._isNew = false;
            item._hover = false;
            item.taxRate = calc.Mul(ifNull(item.taxRate, 0), 100);
          });
          this.pageModelList[0].data = response.data[0].targetCostModelList;
        } else {
          this.pageModelList[0].data = [];
        }
        this.initCommonDetail(response.data[0]);
      }
      this.pageModelList[0].data.map(item => {
        //处理默认展开级别
        item.subject.level = item.subject.code.split(".").length;
        item._expanded =
          calc.Mul(ifNull(item.subject.level, 0), 1) <
          this.pageStatus.expandedLevel + 1;
        item._show =
          item._show &&
          calc.Mul(ifNull(item.subject.level, 0), 1) <
            this.pageStatus.expandedLevel + 2;

        if (item.subjectModel.isLeaf) {
          item._canEdit = true;
          item._isLeaf = true;
          if (
            this.pageStatus.flag === "KUAQI" &&
            item.subject.publicStallOrNot === COSTENUM.publicStallType.NO
          ) {
            // 跨期非公摊不可编辑
            item._canEdit = false;
          }
          if (
            this.pageStatus.flag !== "KUAQI" &&
            item.subject.publicStallOrNot === COSTENUM.publicStallType.YES
          ) {
            // 非跨期公摊不可编辑
            item._canEdit = false;
          }
        } else {
          item._isLeaf = false;
          item._canEdit = false;
        }
        item.subjectModel = { isLeaf: item.subjectModel.isLeaf };

        // 0 为待分期，1-10为跨期的分期
        if (item.attributes) {
          let i = 1;
          while (i < 10) {
            if (
              typeof item.attributes["project_phase_amount" + i] !==
                "undefined" &&
              !this.pageStatus.attributes.includes(i.toString())
            ) {
              this.pageStatus.attributes.push(i.toString()); // 页面存在分期的标识

              let key = i;
              item.attributes[
                "project_phase_amount_excludetax" + key
              ] = calc.Mul(
                item.attributes["project_phase_amount" + key],
                1 - calc.Div(ifNull(item.taxRate, 0), 100)
              );

              item.attributes["project_phase_amount_tax" + key] = calc.Mul(
                item.attributes["project_phase_amount" + key],
                calc.Div(ifNull(item.taxRate, 0), 100)
              );
            }
            i++;
          }
          if (
            typeof item.attributes["project_phase_amount_tobe"] !==
              "undefined" &&
            !this.pageStatus.attributes.includes("_tobe")
          ) {
            this.pageStatus.attributes.push("_tobe"); // 页面存在待分期的标识

            let key = "_tobe";
            item.attributes["project_phase_amount_excludetax" + key] = calc.Mul(
              item.attributes["project_phase_amount" + key],
              1 - calc.Div(ifNull(item.taxRate, 0), 100)
            );

            item.attributes["project_phase_amount_tax" + key] = calc.Mul(
              item.attributes["project_phase_amount" + key],
              calc.Div(ifNull(item.taxRate, 0), 100)
            );
          }
        }
      });

      this.pageModelList[0].constructType = this.pageStatus.flag;
      this.pageModelList[0].name = "跨期";
      this.pageModelList[0].businessTypeCode = this.pageStatus.flag;
    },
    //getDetail里的初始化明细信息
    initCommonDetail(item) {
      // 审批日期
      this.detailModel.auditApprovalDate = item.auditApprovalDate;
      //图纸版本
      this.detailModel.drawingVersion = item.drawingVersion;
      //配置标准
      this.detailModel.allocationStandard = item.allocationStandard;
      //附件
      this.page.attachment.attachmentData = item.attachments || [];
      //平均售价（含车位）
      this.detailModel.avgPrice = item.avgPrice;
      //预备会召开时间
      this.detailModel.prepareMeetingTime = item.prepareMeetingTime;

      //工程目标成本含税(总)
      this.detailModel.projectTargetCostIncludeTaxAmount =
        item.projectTargetCostIncludeTaxAmount;
      //工程可售单方(含税)(总)
      this.detailModel.projectSaleSmCostIncludeTaxAmount =
        item.projectSaleSmCostIncludeTaxAmount;
      //工程目标成本不含税(总)
      this.detailModel.projectTargetCostExcludeTaxAmount =
        item.projectTargetCostExcludeTaxAmount;
      //工程建面单方(含税)(总)
      this.detailModel.projectConstructSmCostIncludeTaxAmount =
        item.projectConstructSmCostIncludeTaxAmount;
    },
    //普通
    initDetailData(response) {
      if (!response.data) {
        this.$showNormalError("没有可用数据");
        LoadingUtil.hideLoading();
        return;
      }
      if (this.pageStatus.flag === "KUAQI") {
        this.initKUAQIData(response);
        return;
      }
      let _this = this;

      let improtData = {};

      // checkDetail()返回的数据结构是response.data.targetCostModelList[businessTypeCode:'',targetCostModelList:[]]
      if (response.data.targetCostModelList) {
        response.data.targetCostModelList.map(item => {
          if (item.targetCostModelList) {
            item.targetCostModelList.map(item1 => {
              item1.businessTypeCode = item.businessTypeCode;
              item1.constructType = item.businessTypeCode;
              item1.businessTypeName = item.businessTypeName;

              item1._editStatus = false;
              item1._expanded = true;
              item1._show = !COSTBUSINESS.checkIsSpecialCode(item1.subject);
              item1._isNew = false;
              item1._hover = false;
              item1.accountingObjectId = this.queryModel.accountingObjectId;
              item1.stageId = this.detailModel.stageId;
              item1.stageVersion = this.queryModel.stageVersion;
              item1.taxRate = calc.Mul(ifNull(item1.taxRate, 0), 100);
              item1.targetCostIncludeTax = ifNull(
                item1.targetCostIncludeTax,
                0
              );

              //处理默认展开级别
              item1.subject.level = item1.subject.code.split(".").length;
              item1._expanded =
                calc.Mul(ifNull(item1.subject.level, 0), 1) <
                this.pageStatus.expandedLevel + 1;
              item1._show =
                item1._show &&
                calc.Mul(ifNull(item1.subject.level, 0), 1) <
                  this.pageStatus.expandedLevel + 2;
            });
          }
          improtData[item.businessTypeCode] = item.targetCostModelList || [];
        });
      } else {
        response.data.map((item, index) => {
          if (index === 0) {
            this.initCommonDetail(item);
          }

          item.targetCostModelList.map(item1 => {
            item1.businessTypeCode = item.businessTypeCode;
            item1.constructType = item.businessTypeCode;
            item1.businessTypeName = item.businessTypeName;

            item1._editStatus = false;
            item1._expanded = true;
            item1._show = !COSTBUSINESS.checkIsSpecialCode(item1.subject);
            item1._isNew = false;
            item1._hover = false;
            item1.accountingObjectId = this.queryModel.accountingObjectId;
            item1.stageId = this.detailModel.stageId;
            item1.stageVersion = this.queryModel.stageVersion;
            item1.taxRate = calc.Mul(ifNull(item1.taxRate, 0), 100);
            item1.targetCostIncludeTax = ifNull(item1.targetCostIncludeTax, 0);

            //处理默认展开级别
            item1.subject.level = item1.subject.code.split(".").length;
            item1._expanded =
              calc.Mul(ifNull(item1.subject.level, 0), 1) <
              this.pageStatus.expandedLevel + 1;
            item1._show =
              item1._show &&
              calc.Mul(ifNull(item1.subject.level, 0), 1) <
                this.pageStatus.expandedLevel + 2;
          });
          improtData[item.businessTypeCode] = item.targetCostModelList || [];
        });
      }

      try {
        if (improtData.length === 0) return;
        // 页面交互
        LoadingUtil.showLoading();

        // 更新数
        if (this.pageModelList.length > 0) {
          this.pageModelList.map(item => {
            item.data = improtData[item.constructType];
          });
        } else {
          this.$showNormalError("暂无明细数据");
        }
        //公摊成本（获取明细会给到汇总号的“公摊成本”）
        if (
          !this.pageModelList[this.pageModelList.length - 2].data ||
          (this.pageModelList[this.pageModelList.length - 2].data &&
            this.pageModelList[this.pageModelList.length - 2].data.length === 0)
        ) {
          this.pageModelList[this.pageModelList.length - 2].data =
            deepCopy(this.pageModelList[0].data) || [];
        }
        //成本分期
        this.pageModelList[this.pageModelList.length - 1].data =
          deepCopy(this.pageModelList[0].data) || [];
        // 汇总最后一个sheet数据
        setTimeout(function() {
          _this.initDataEditStatus();
          _this.calcTotalData();
        }, 300);
        LoadingUtil.hideLoading();
      } catch (error) {
        console.error(error);
        LoadingUtil.hideLoading();
        this.$showError("处理明细数据异常");
      }

      improtData = null;

      this.setEditStatus();
    },
    // 初始化excel导入数据
    initImportData(response) {
      if (!response.data) {
        this.$showNormalError("没有可用数据");
        LoadingUtil.hideLoading();
        return;
      }
      let _this = this;
      debugger;
      let improtData = [];
      let businessCount = 0;
      response.data.map(importItem => {
        if (importItem.businessTypeCode && importItem.targetCostModelList) {
          // 增加业务数据
          importItem.targetCostModelList.map(item => {
            item.taxRate = calc.Mul(ifNull(item.taxRate, 0), 100);
            item._editStatus = false;
            item._expanded = true;
            item._show = item.subject
              ? !COSTBUSINESS.checkIsSpecialCode(item.subject)
              : true;
            item._isNew = false;
            item._hover = false;
            item.accountingObjectId = _this.queryModel.accountingObjectId;
            item.stageId = _this.detailModel.stageId;
            item.stageVersion = _this.queryModel.stageVersion;
            item.constructType =
              importItem.constructType === "公摊成本"
                ? "GTCB"
                : importItem.constructType;

            //处理默认展开级别
            item.subject.level = item.subject.code.split(".").length;
            item._expanded =
              calc.Mul(ifNull(item.subject.level, 0), 1) <
              this.pageStatus.expandedLevel + 1;
            item._show =
              item._show &&
              calc.Mul(ifNull(item.subject.level, 0), 1) <
                this.pageStatus.expandedLevel + 2;
          });
          //按业态编码赋值
          improtData[
            importItem.businessTypeCode === "公摊成本"
              ? "GTCB"
              : importItem.businessTypeCode
          ] =
            importItem.targetCostModelList;
          //累计业态数量
          businessCount++;
        }
      });

      if (
        this.pageStatus.flag !== "KUAQI" &&
        businessCount !== this.pageModelList.length - 1
      ) {
        this.$showNormalError("导入数据业态和当前业态数量不一致");
        return;
      }

      try {
        // 页面交互
        this.$confirm("确认使用导入数据覆盖？", {
          confirmButtonText: this.$l("btn_confirm"),
          cancelButtonText: this.$l("btn_cancel"),
          type: "warning"
        })
          .then(() => {
            LoadingUtil.showLoading();
            // 更新数据
            this.pageModelList.map(item => {
              item.data = improtData[item.constructType]
                ? improtData[item.constructType]
                : [];
            });

            //公摊成本(在excel导入中就有)
            //成本分期
            this.pageModelList[this.pageModelList.length - 1].data = deepCopy(
              this.pageModelList[0].data
            );

            // 处理业态
            this.pageModelList.map(item => {
              item.data.map(d => {
                d.businessTypeCode = item.constructType;
                d.constructType = item.constructType;
                d.businessTypeName = item.name
                  ? item.name
                  : item.businessTypeName;
              });
            });

            // 汇总最后一个sheet数据
            this.initDataEditStatus();
            if (this.pageStatus.flag !== "KUAQI") {
              this.calcTotalData();
            }
            //公摊成本
            //this.pageModelList[this.pageModelList.length - 2].data = deepCopy(this.pageModelList[this.pageModelList.length - 1].data)
            LoadingUtil.hideLoading();
          })
          .catch(() => {
            LoadingUtil.hideLoading();
          });
      } catch (error) {
        this.$showError("处理导入数据异常");
      }

      this.setEditStatus();
    },
    // 检查code
    checkCode(code) {
      const _this = this;
      let _checkResult = true;
      const _filter = _this.pageModelList[
        this.pageStatus.hanldeTabIndex
      ].data.filter(item => {
        return item.subject.code === code;
      });
      if (_filter && _filter.length > 1) _checkResult = false; // 已经存在
      return _checkResult;
    },
    // 计算path tree数据
    sumChildNum(parentCode, calcHanldeTabIndex) {
      if (typeof calcHanldeTabIndex === "undefined")
        calcHanldeTabIndex = this.pageStatus.hanldeTabIndex;
      let childArray = this.getParentChild(parentCode, calcHanldeTabIndex);
      console.log(
        "calcHanldeTabIndex[" +
          calcHanldeTabIndex +
          "],parentCode:" +
          parentCode
      );
      //console.info(childArray)
      let calData = {
        taxRate: 0,
        targetCostIncludeTax: 0,
        targetCostExcludeTax: 0,
        tax: 0,
        saleSmCostIncludeTax: 0,
        saleSmCostExcludeTax: 0,
        constructSmCostIncludeTax: 0,
        constructSmCostExcludeTax: 0,
        attributes: {}
      };
      this.pageStatus.attributes.map(item => {
        calData.attributes["project_phase_amount" + item] = 0;
        calData.attributes["project_phase_amount_excludetax" + item] = 0;
        calData.attributes["project_phase_amount_tax" + item] = 0;
      });

      // 汇总
      if (childArray.length > 0) {
        childArray.map(item => {
          calData.taxRate = 0; // item.taxRate
          calData.targetCostIncludeTax = calc.Add(
            ifNull(calData.targetCostIncludeTax, 0),
            ifNull(item.targetCostIncludeTax, 0)
          );
          calData.targetCostExcludeTax = calc.Add(
            ifNull(calData.targetCostExcludeTax, 0),
            ifNull(item.targetCostExcludeTax, 0)
          );
          calData.tax = calc.Add(ifNull(calData.tax, 0), ifNull(item.tax, 0));
          calData.saleSmCostIncludeTax = calc.Add(
            ifNull(calData.saleSmCostIncludeTax, 0),
            ifNull(item.saleSmCostIncludeTax, 0)
          );
          calData.saleSmCostExcludeTax = calc.Add(
            ifNull(calData.saleSmCostExcludeTax, 0),
            ifNull(item.saleSmCostExcludeTax, 0)
          );
          calData.constructSmCostIncludeTax = calc.Add(
            ifNull(calData.constructSmCostIncludeTax, 0),
            ifNull(item.constructSmCostIncludeTax, 0)
          );
          calData.constructSmCostExcludeTax = calc.Add(
            ifNull(calData.constructSmCostExcludeTax, 0),
            ifNull(item.constructSmCostExcludeTax, 0)
          );

          this.pageStatus.attributes.map(attributeItem => {
            calData.attributes[
              "project_phase_amount" + attributeItem
            ] = calc.Add(
              ifNull(
                calData.attributes["project_phase_amount" + attributeItem],
                0
              ),
              ifNull(item.attributes["project_phase_amount" + attributeItem], 0)
            );

            calData.attributes[
              "project_phase_amount_excludetax" + attributeItem
            ] = calc.Add(
              ifNull(
                calData.attributes[
                  "project_phase_amount_excludetax" + attributeItem
                ],
                0
              ),
              ifNull(
                item.attributes[
                  "project_phase_amount_excludetax" + attributeItem
                ],
                0
              )
            );

            calData.attributes[
              "project_phase_amount_tax" + attributeItem
            ] = calc.Add(
              ifNull(
                calData.attributes["project_phase_amount_tax" + attributeItem],
                0
              ),
              ifNull(
                item.attributes["project_phase_amount_tax" + attributeItem],
                0
              )
            );
          });
        });
      }
      // 赋值
      this.pageModelList[calcHanldeTabIndex].data.map(item => {
        if (item.subject.code === parentCode) {
          item.taxRate = calData.taxRate;
          item.targetCostIncludeTax = calData.targetCostIncludeTax;
          item.targetCostExcludeTax = calData.targetCostExcludeTax;
          item.tax = calData.tax;
          item.saleSmCostIncludeTax = calData.saleSmCostIncludeTax;
          item.saleSmCostExcludeTax = calData.saleSmCostExcludeTax;
          item.constructSmCostIncludeTax = calData.constructSmCostIncludeTax;
          item.constructSmCostExcludeTax = calData.constructSmCostExcludeTax;
          item.attributes = calData.attributes;
        }
      });
    },
    // 汇总节点父路径
    calcTreeData(childCode, isStart, calcHanldeTabIndex) {
      if (typeof calcHanldeTabIndex === "undefined")
        calcHanldeTabIndex = this.pageStatus.hanldeTabIndex;
      if (isStart)
        console.log("calcTreeData[" + calcHanldeTabIndex + "] start");
      let array = childCode.split(".");
      array.length = array.length - 1 >= 0 ? array.length - 1 : 1;
      let parentCode = array.join(".");
      if (!parentCode) {
        console.log("calcTreeData[" + calcHanldeTabIndex + "] finish");
        return;
      }
      this.sumChildNum(parentCode, calcHanldeTabIndex);
      this.calcTreeData(parentCode, false, calcHanldeTabIndex);
    },
    // 计算汇总数据
    calcTotalData() {
      let _LastItemIndex = this.pageModelList.length - 1;
      // 重置
      for (
        let m = 0;
        m < this.pageModelList[this.pageStatus.hanldeTabIndex].data.length;
        m++
      ) {
        this.pageModelList[_LastItemIndex].data[m].taxRate = 0;
        this.pageModelList[_LastItemIndex].data[m].targetCostIncludeTax = 0;
        this.pageModelList[_LastItemIndex].data[m].targetCostExcludeTax = 0;
        this.pageModelList[_LastItemIndex].data[m].tax = 0;
        this.pageModelList[_LastItemIndex].data[m].saleSmCostIncludeTax = 0;
        this.pageModelList[_LastItemIndex].data[m].saleSmCostExcludeTax = 0;
        this.pageModelList[_LastItemIndex].data[
          m
        ].constructSmCostIncludeTax = 0;
        this.pageModelList[_LastItemIndex].data[
          m
        ].constructSmCostExcludeTax = 0;
        this.pageModelList[_LastItemIndex].data[m].amountPendingApprove = 0;
        this.pageModelList[_LastItemIndex].data[m].amountOccurence = 0;
      }
      // 汇总（去掉“公摊成本”）
      for (let i = 0; i < _LastItemIndex - 1; i++) {
        for (
          let j = 0;
          j < this.pageModelList[this.pageStatus.hanldeTabIndex].data.length;
          j++
        ) {
          this.pageModelList[_LastItemIndex].data[
            j
          ].targetCostIncludeTax = calc.Add(
            ifNull(
              this.pageModelList[_LastItemIndex].data[j].targetCostIncludeTax,
              0
            ),
            ifNull(this.pageModelList[i].data[j].targetCostIncludeTax, 0)
          );
          this.pageModelList[_LastItemIndex].data[
            j
          ].targetCostExcludeTax = calc.Add(
            ifNull(
              this.pageModelList[_LastItemIndex].data[j].targetCostExcludeTax,
              0
            ),
            ifNull(this.pageModelList[i].data[j].targetCostExcludeTax, 0)
          );
          this.pageModelList[_LastItemIndex].data[j].tax = calc.Add(
            ifNull(this.pageModelList[_LastItemIndex].data[j].tax, 0),
            ifNull(this.pageModelList[i].data[j].tax, 0)
          );

          // 税率 = 税额/目标成本不含税
          if (
            ifNull(
              this.pageModelList[this.pageModelList.length - 1].data[j]
                .targetCostExcludeTax,
              0
            ) === 0
          ) {
            this.pageModelList[this.pageModelList.length - 1].data[
              j
            ].taxRate = 0;
          } else {
            this.pageModelList[this.pageModelList.length - 1].data[
              j
            ].taxRate = calc.Mul(
              calc
                .Div(
                  ifNull(
                    this.pageModelList[this.pageModelList.length - 1].data[j]
                      .tax,
                    0
                  ),
                  this.pageModelList[this.pageModelList.length - 1].data[j]
                    .targetCostExcludeTax
                )
                .toFixed(2),
              100
            );
          }

          this.pageModelList[_LastItemIndex].data[
            j
          ].amountPendingApprove = calc.Add(
            ifNull(
              this.pageModelList[_LastItemIndex].data[j].amountPendingApprove,
              0
            ),
            ifNull(this.pageModelList[i].data[j].amountPendingApprove, 0)
          );
          this.pageModelList[_LastItemIndex].data[j].amountOccurence = calc.Add(
            ifNull(
              this.pageModelList[_LastItemIndex].data[j].amountOccurence,
              0
            ),
            ifNull(this.pageModelList[i].data[j].amountOccurence, 0)
          );
        }
      }

      // 可售单方 建面单方
      for (
        let m = 0;
        m < this.pageModelList[this.pageStatus.hanldeTabIndex].data.length;
        m++
      ) {
        this.pageModelList[_LastItemIndex].data[m].saleSmCostIncludeTax =
          calc
            .Div(
              this.pageModelList[_LastItemIndex].data[m].targetCostIncludeTax,
              ifNull(this.detailModel.canSaleAcreage, 1)
            )
            .toFixed(2) / 1;

        this.pageModelList[_LastItemIndex].data[m].saleSmCostExcludeTax =
          calc
            .Div(
              this.pageModelList[_LastItemIndex].data[m].targetCostExcludeTax,
              ifNull(this.detailModel.canSaleAcreage, 1)
            )
            .toFixed(2) / 1;

        this.pageModelList[_LastItemIndex].data[m].constructSmCostIncludeTax =
          calc
            .Div(
              this.pageModelList[_LastItemIndex].data[m].targetCostIncludeTax,
              ifNull(this.detailModel.buildingAcreage, 1)
            )
            .toFixed(2) / 1;

        this.pageModelList[_LastItemIndex].data[m].constructSmCostExcludeTax =
          calc
            .Div(
              this.pageModelList[_LastItemIndex].data[m].targetCostExcludeTax,
              ifNull(this.detailModel.buildingAcreage, 1)
            )
            .toFixed(2) / 1;
      }
    },
    // 计算行数据
    calcRowData(index, _rowData, calcHanldeTabIndex, isFrom_GTCB = false) {
      if (typeof calcHanldeTabIndex === "undefined")
        calcHanldeTabIndex = this.pageStatus.hanldeTabIndex;
      _rowData.taxRate = ifNull(_rowData.taxRate, 0);
      _rowData.targetCostIncludeTax = ifNull(_rowData.targetCostIncludeTax, 0);
      //来自公摊 不含税也公摊而不是计算
      _rowData.targetCostExcludeTax = isFrom_GTCB
        ? ifNull(_rowData.targetCostExcludeTax, 0)
        : this.calcTargetCostExcludeTax(_rowData); //	目标成本(不含税)
      _rowData.tax = calc.Sub(
        _rowData.targetCostIncludeTax,
        _rowData.targetCostExcludeTax
      ); // 税额

      if (this.pageStatus.flag === "KUAQI") {
        // 动态计算分期,待分期
        this.pageStatus.attributes.map(item => {
          let key;
          key = item === 0 ? "_tobe" : item;
          _rowData.attributes["project_phase_amount" + key] =
            _rowData.subject.acrossPhase.indexOf(key) > -1
              ? 0
              : calc.Mul(
                  _rowData.targetCostIncludeTax,
                  _rowData.attributes["project_phase_rate" + key]
                );

          _rowData.attributes[
            "project_phase_amount_excludetax" + key
          ] = calc.Mul(
            _rowData.attributes["project_phase_amount" + key],
            1 - calc.Div(_rowData.taxRate, 100)
          );

          _rowData.attributes["project_phase_amount_tax" + key] = calc.Mul(
            _rowData.attributes["project_phase_amount" + key],
            calc.Div(_rowData.taxRate, 100)
          );
        });
      } else {
        // if (rowData.taxRate && rowData.targetCostIncludeTax) {
        let _totalBuildingArea = this.pageModelList[calcHanldeTabIndex]
          ? this.pageModelList[calcHanldeTabIndex].totalBuildingArea
          : 0;

        let _totalSellArea = this.pageModelList[calcHanldeTabIndex]
          ? this.pageModelList[calcHanldeTabIndex].totalSellArea
          : 0;

        _rowData.saleSmCostIncludeTax =
          _totalSellArea !== 0
            ? calc
                .Div(_rowData.targetCostIncludeTax, ifNull(_totalSellArea, 1))
                .toFixed(2) / 1
            : 0; // 可售单方（含税）
        _rowData.saleSmCostExcludeTax =
          _totalSellArea !== 0
            ? calc
                .Div(_rowData.targetCostExcludeTax, ifNull(_totalSellArea, 1))
                .toFixed(2) / 1
            : 0; //	可售单方（不含税）
        _rowData.constructSmCostIncludeTax =
          _totalBuildingArea !== 0
            ? calc
                .Div(
                  _rowData.targetCostIncludeTax,
                  ifNull(_totalBuildingArea, 1)
                )
                .toFixed(2) / 1
            : 0; // 建面单方（含税）
        _rowData.constructSmCostExcludeTax =
          _totalBuildingArea !== 0
            ? calc
                .Div(
                  _rowData.targetCostExcludeTax,
                  ifNull(_totalBuildingArea, 1)
                )
                .toFixed(2) / 1
            : 0; //	建面单方（不含税）

        // }
      }
      //this.pageModelList[calcHanldeTabIndex].data[index] = _rowData
      this.$set(this.pageModelList[calcHanldeTabIndex].data, index, _rowData);
      this.calcTreeData(_rowData.subject.code, true, calcHanldeTabIndex);
    },
    // 选项卡点击事件
    tabClick(param) {
      LoadingUtil.showLoading();
      this.pageStatus.hanldeTabIndex = param.index;
      if (parseInt(param.index) === this.pageModelList.length - 1) {
        this.calcTotalData();
      }
      LoadingUtil.hideLoading();
    },
    //检查是否为叶子节点
    checkIsLeaf(rowData) {
      if (rowData.subjectModel) {
        return rowData.subjectModel.isLeaf;
      } else {
        let _ChildRow = [];
        _ChildRow = this.getParentChild(rowData.subject.code);
        return _ChildRow.length === 0;
      }
    },
    // 获取子节点
    getParentChild(parentCode, calcHanldeTabIndex) {
      console.log("getParentChild");
      if (typeof calcHanldeTabIndex === "undefined")
        calcHanldeTabIndex = this.pageStatus.hanldeTabIndex;
      const _this = this;
      let _ChildRow = [];
      _ChildRow = _this.pageModelList[calcHanldeTabIndex].data.filter(item => {
        return (
          item.subject.code &&
          item.subject.code.indexOf(parentCode + ".") > -1 &&
          item.subject.code.replace(parentCode + ".").indexOf(".") === -1 &&
          ((item.subject.nodeSource ===
            COSTENUM.subjectNodeSourceType.COMPANY &&
            item.subject.code.indexOf(this.pageStatus.specialNode) < 0) ||
            item.subject.nodeSource !== COSTENUM.subjectNodeSourceType.COMPANY)
        );
      });
      return _ChildRow;
    },
    // 获取级别
    getLevel(parentCode) {
      return parentCode.split(".").length;
    },
    // 展开收起
    handleExpandClick(parentCode) {
      let parentExpanded;
      this.pageModelList[this.pageStatus.hanldeTabIndex].data.map(item => {
        if (item.subject.code === parentCode) {
          item._expanded = !item._expanded;
          parentExpanded = item._expanded;
        }
        if (
          item.subject.code.indexOf(parentCode) > -1 &&
          item.subject.code !== parentCode
        ) {
          item._show = parentExpanded;
          item._expanded = parentExpanded;
        }
        if (COSTBUSINESS.checkIsSpecialCode(item.subject)) {
          item._show = false; // .99隐藏
        }
      });
    },
    // 鼠标经过row显示新增
    handleMouseEnter(row, column, cell, event) {
      if (!this.page.isEdit) return;
      if (!this.pageModelList) return;
      this.pageModelList[this.pageStatus.hanldeTabIndex].data.map(item => {
        if (item.subject.code === row.subject.code) {
          item._hover = true;
        } else {
          item._hover = false;
        }
      });
    },
    // 检查是否可以删除
    checkCanDeleteRow: function(index, rowData) {
      // 自建节点，叶子节点，没有目标成本金额节点
      let _check = false;
      if (!this.page.isEdit) return _check;
      if (
        rowData &&
        rowData.subject &&
        rowData.subject.nodeSource === COSTENUM.subjectNodeSourceType.PROJECT
        // && rowData.targetCostIncludeTax === 0 //有钱也显示，在做删除时提示http://jira.movit-tech.com:1024/browse/MCP-659
      ) {
        let _child = this.getParentChild(rowData.subject.code);
        if (_child && _child.length === 0) _check = true;
      }
      // 公摊成本
      if (
        this.pageStatus.flag !== "KUAQI" &&
        this.pageStatus.hanldeTabIndex !==
          (this.pageModelList.length - 1).toString()
      ) {
        if (
          this.pageModelList[this.pageStatus.hanldeTabIndex].constructType ===
          "GTCB"
        ) {
          if (
            rowData.subject.code.includes("4301.03") ||
            rowData.subject.code.includes("4301.04")
          ) {
            _check = false;
          }
        } else {
          if (
            rowData.subject.code.includes("4301.03") ||
            rowData.subject.code.includes("4301.04")
          ) {
          } else {
            _check = false;
          }
        }
      }
      return _check;
    },
    // 添加科目子节点检查
    getAddParentChild(parentCode) {
      const _this = this;
      let _ChildRow = [];
      _ChildRow = _this.pageModelList[
        this.pageStatus.hanldeTabIndex
      ].data.filter(item => {
        return (
          item.subject.code &&
          item.subject.code.indexOf(parentCode + ".") > -1 &&
          item.subject.code.replace(parentCode + ".").indexOf(".") === -1 &&
          ((item.subject.nodeSource ===
            COSTENUM.subjectNodeSourceType.COMPANY &&
            item.subject.code.indexOf(this.pageStatus.specialNode) < 0) ||
            item.subject.nodeSource !==
              COSTENUM.subjectNodeSourceType.COMPANY) &&
          !item._isNew
        );
      });
      return _ChildRow;
    },

    // 检查是否可以新增
    // 可以加科目的条件：
    // 1、末级科目金额为0的科目
    // 2、集团科目.99的父科目
    // 3、集团科目末级有子的可以加
    // 4、自建科目的有子的可以加
    checkCanAddRow: function(row) {
      // 新增行
      if (row._hover && row._isNew && ifNull(row.targetCostIncludeTax, 0) === 0)
        return true;
      // 非编辑表格状态不可新增
      if (row._editStatus) return false;
      // 非鼠标经过不可新增
      if (!row._hover) return false;
      // 非编辑界面不可新增
      if (!this.page.isEdit) return false;
      // 非跨期最后一级的汇总栏没有新增功能
      if (
        this.pageStatus.flag !== "KUAQI" &&
        parseInt(this.pageStatus.hanldeTabIndex) ===
          this.pageModelList.length - 1
      )
        return false;
      // 检查是否显示增加子节点按钮（控制到最大层级）
      let checkMaxLevel =
        row.subject.code.split(".").length < this.pageStatus.maxLevel;
      let checkEditFlag = false;
      if (checkMaxLevel) {
        let childs = this.getAddParentChild(row.subject.code);

        // 1、末级科目目标成本金额为0
        if (childs.length === 0 && ifNull(row.targetCostIncludeTax, 0) === 0) {
          checkEditFlag = true;
        }

        // 2、集团科目含有.99子科目的科目
        let filterContainEditFlagData = [];
        filterContainEditFlagData = childs.filter(item => {
          return item.subject.code.indexOf(this.pageStatus.specialNode) > -1;
        });
        if (
          row.subject.nodeSource === COSTENUM.subjectNodeSourceType.COMPANY &&
          filterContainEditFlagData.length > 0
        ) {
          // .99父级节点可增加.99兄弟节点
          checkEditFlag = true;
        }

        // 3、集团科目末级有子的可以加
        if (
          childs.length > 0 &&
          row.subject.nodeSource === COSTENUM.subjectNodeSourceType.COMPANYLEAF
        ) {
          checkEditFlag = true;
        }

        // 4、自建科目的有子的可以加
        if (
          childs.length > 0 &&
          row.subject.nodeSource === COSTENUM.subjectNodeSourceType.PROJECT
        ) {
          checkEditFlag = true;
        }
      }
      // 公摊成本
      if (
        this.pageStatus.flag !== "KUAQI" &&
        this.pageStatus.hanldeTabIndex !==
          (this.pageModelList.length - 1).toString()
      ) {
        if (
          this.pageModelList[this.pageStatus.hanldeTabIndex].constructType ===
          "GTCB"
        ) {
          if (
            row.subject.code.includes("4301.03") ||
            row.subject.code.includes("4301.04")
          ) {
            checkEditFlag = false;
          }
        } else {
          if (
            row.subject.code.includes("4301.03") ||
            row.subject.code.includes("4301.04")
          ) {
          } else {
            checkEditFlag = false;
          }
        }
      }
      return checkEditFlag;
    },
    // 获取默认行数据
    getDefaultRow(index, parentRow) {
      let _newRow = JSON.parse(JSON.stringify(this.pageModel));
      _newRow.constructType = this.pageModelList[
        this.pageStatus.hanldeTabIndex
      ].constructType; // 业态
      _newRow.accountingObjectId = this.queryModel.accountingObjectId;
      _newRow.stageId = this.detailModel.stageId;
      _newRow.stageVersion = this.queryModel.stageVersion;
      _newRow.targetCostIncludeTax = 0;
      _newRow.subject.parent = parentRow.subject.code;
      _newRow.subject.financialSubjectCode =
        parentRow.subject.financialSubjectCode;
      _newRow.subject.financialSubjectName =
        parentRow.subject.financialSubjectName;
      _newRow.subject.apportionmentRuleCode =
        parentRow.subject.apportionmentRuleCode; // 分摊规则和父节点一致
      _newRow.subject.ownerId = this.queryModel.accountingObjectId;
      _newRow.subject.stageId = this.detailModel.stageId;
      _newRow.subject.stageVersion = this.queryModel.stageVersion;
      return _newRow;
    },
    getInsertRowIndex(parentIndex, parentCode) {
      // 获取待插入的行号
      let _insertIndex = 0;
      const _ChildRowArray = this.pageModelList[
        this.pageStatus.hanldeTabIndex
      ].data.filter(item => {
        return (
          item.subject.code.substr(0, parentCode.length + 1) ===
          parentCode + "."
        );
      });
      _insertIndex = parentIndex + _ChildRowArray.length + 1;
      return _insertIndex;
    },
    // 检查科目在每个业态是否金额
    checkSubjectHaveAmount(index) {
      let checkResult = false;
      if (this.pageModelList.length > 1) {
        for (let i = 0; i < this.pageModelList.length; i++) {
          if (
            this.pageModelList[i].data &&
            this.pageModelList[i].data[index].targetCostIncludeTax > 0
          ) {
            checkResult = this.pageModelList[i].name; // 业态名称
            break;
          }
        }
      }
      return checkResult;
    },
    // 删除自建叶子金额0节点
    handleDeleteClick(index, childRow) {
      if (!childRow._isNew) {
        if (
          this.pageStatus.flag === "KUAQI" &&
          childRow.subject.publicStallOrNot === COSTENUM.publicStallType.NO
        ) {
          this.$showNormalError("”跨期“ ”非公摊科目“ 不可删除子级科目");
          return;
        }
        if (
          this.pageStatus.flag !== "KUAQI" &&
          childRow.subject.publicStallOrNot === COSTENUM.publicStallType.YES
        ) {
          this.$showNormalError("”非跨期“ ”公摊科目“ 不可删除子级科目");
          return;
        }
      }

      if (childRow.targetCostIncludeTax !== 0) {
        this.$showNormalError(
          "当前科目已经维护金额，不可删除，请重置金额并保存后再删除！"
        );
        return;
      }

      let _checkOtherSubjectHaveAmount = this.checkSubjectHaveAmount(index);
      if (_checkOtherSubjectHaveAmount) {
        this.$showNormalError(
          " ”" +
            childRow.subject.name +
            "“ 在 ”" +
            _checkOtherSubjectHaveAmount +
            "“ 已经维护金额"
        );
        return;
      }
      for (let i = 0; i < this.pageModelList.length; i++) {
        this.pageModelList[i].data.splice(index, 1);
      }
      // 找到父节点并把父节的_isLeaf设置未true（在父节点没有子的情况下）
      let parentCodeArray = childRow.subject.code.split(".");
      parentCodeArray = parentCodeArray.slice(0, parentCodeArray.length - 2);
      let parentCode = parentCodeArray.join(".");
      let parentHaveChild = this.getParentChild(parentCode).length > 0;
      if (parentCode) {
        this.pageModelList.map(businessItem => {
          if (businessItem.data) {
            businessItem.data.map(subjectItem => {
              if (subjectItem.subject.code === parentCode)
                subjectItem._isLeaf = !parentHaveChild;
            });
          }
        });
      }
    },
    // 添加99兄弟节点
    handleAddClick(index, parentRow) {
      if (
        this.pageStatus.flag === "KUAQI" &&
        parentRow.subject.publicStallOrNot === COSTENUM.publicStallType.NO
      ) {
        this.$showNormalError("”跨期“ ”非公摊科目“ 不可新增子级科目");
        return;
      }
      if (
        this.pageStatus.flag !== "KUAQI" &&
        parentRow.subject.publicStallOrNot === COSTENUM.publicStallType.YES
      ) {
        this.$showNormalError("”非跨期“ ”公摊科目“ 不可新增子级科目");
        return;
      }

      let _childs = this.getParentChild(parentRow.subject.code);

      // 没有子的检查
      if (_childs.length === 0) {
        let _checkOtherSubjectHaveAmount = this.checkSubjectHaveAmount(index);
        if (_checkOtherSubjectHaveAmount) {
          this.$showNormalError(
            " ”" +
              parentRow.subject.name +
              "“ 在 ”" +
              _checkOtherSubjectHaveAmount +
              "“ 已经维护金额"
          );
          return;
        }
      }

      let _parentLastChildSubjectCode = ""; // 父节点最后一个子节点,没有则值设置为父节点
      _parentLastChildSubjectCode =
        _childs.length > 0
          ? _childs[_childs.length - 1].subject.code
          : parentRow.subject.code + ".00";
      // 如果最后一个是.99则倒查第二个，如果没有第二个则为00
      if (_parentLastChildSubjectCode.includes(this.pageStatus.specialNode)) {
        if (_childs.length > 1) {
          _parentLastChildSubjectCode =
            _childs[_childs.length - 2].subject.code;
        } else {
          _parentLastChildSubjectCode = parentRow.subject.code + ".00";
        }
      }

      // debug
      const _this = this;
      // 备份数据以便撤销
      this.pagePreEditModelList = deepCopy(this.pageModelList);
      // 获取默认数据
      const _row = this.getDefaultRow(index, parentRow);
      // 返回的code
      _row.subject.code = COSTBUSINESS.generateCodeLocal(
        _parentLastChildSubjectCode
      ); // '001.01.1002.02'
      _row.subject.responsibleDeptCode = parentRow.subject.responsibleDeptCode; // 继承父节点科目 可修改
      _row.subject.level = _row.subject.code
        ? _row.subject.code.split(".").length
        : null; // 当前级别
      _row._isNew = true;
      _row._editStatus = true;
      _row._canEdit = true;
      if (this.pageStatus.flag === "KUAQI") {
        _row.attributes = deepCopy(parentRow.attributes);
      }
      let _insertIndex = this.getInsertRowIndex(index, parentRow.subject.code);
      // _insertIndex -= 1 // 放到99之前
      // 给当前sheet添加节点
      this.pageModelList[this.pageStatus.hanldeTabIndex].data.splice(
        _insertIndex,
        0,
        _row
      );

      // 给其他sheet都添加节点
      for (let n = 0; n < this.pageModelList.length; n++) {
        let _r = JSON.parse(JSON.stringify(_row));
        if (n.toString() !== this.pageStatus.hanldeTabIndex) {
          // 汇总sheet不是编辑状态
          _r._isNew = true;
          _r._editStatus = false;
          _r._canEdit = true;
          _r.constructType = this.pageModelList[n].constructType;
          this.pageModelList[n].data.splice(_insertIndex, 0, _r);
        }
      }

      // 找到父节点并把父节点的_isLeaf设置为false
      this.pageModelList.map(businessItem => {
        if (businessItem.data) {
          businessItem.data.map(subjectItem => {
            if (subjectItem.subject.code === parentRow.subject.code) {
              subjectItem._isLeaf = false;
            }
          });
        }
      });
    },
    // 同步业态科目
    syncAllBusinessSubject(rowData, index) {
      // 给其他sheet都添加节点
      for (let n = 0; n < this.pageModelList.length; n++) {
        if (n.toString() !== this.pageStatus.hanldeTabIndex) {
          let _r = deepCopy(rowData);
          // 汇总sheet不是编辑状态
          _r._isNew = n !== this.pageModelList.length - 1;
          _r._editStatus = false; //n !== this.pageModelList.length - 1
          _r._canEdit = n !== this.pageModelList.length - 1;
          _r.constructType = deepCopy(this.pageModelList[n].constructType);
          _r["targetCostIncludeTax"] = 0; //目标成本含税
          _r["targetCostExcludeTax"] = 0; // 目标成本不含税
          _r["tax"] = 0;
          _r["amountPendingApprove"] = 0; //在途金额
          _r["amountOccurence"] = 0; //已发生金额(元)
          _r["saleSmCostIncludeTax"] = 0; //可售单方(含税)(元/㎡)
          _r["saleSmCostExcludeTax"] = 0; //可售单方(不含税)(元/㎡)
          _r["constructSmCostIncludeTax"] = 0; //建面单方(含税)
          _r["constructSmCostExcludeTax"] = 0; //建面单方(不含税)(元/㎡)
          this.pageModelList[n].data[index] = _r;
        }
      }
    },
    //同步公摊到各个业态
    syncOtherBusinessSubject(rowData, rowIndex) {
      //debugger
      let _this = this;
      if (this.pageStatus.flag !== "KUAQI") {
        //非公摊tab不处理⭐
        if (
          _this.pageStatus.hanldeTabIndex !==
          (_this.pageModelList.length - 2).toString()
        )
          return;

        let _TotalDispathTargetCostIncludeTax = 0; //已经分配给除去最后一个业态的其他业态的金额合计
        let _TotalDispathTargetCostExcludeTax = 0; // 不含税也分摊，而不是行内计算

        let _numerator = ""; //分子
        let _denominator = ""; //分母
        this.pageModelList.map((businessItem, tabIndex) => {
          if (
            businessItem.constructType !== "GTCB" &&
            businessItem.constructType !== "CBFQ" &&
            businessItem.data &&
            businessItem.data.length > 0
          ) {
            let _newTheSameSubjectOtherBizRowData = deepCopy(
              businessItem.data[rowIndex]
            );
            //分摊规则【apportionmentRuleCode】
            // 0：可售面积detailModel.canSaleAcreage,businessItem.totalSellArea
            // 1：建筑面积detailModel.buildingAcreage,businessItem.totalBuildingArea
            // 2：占地面积detailModel.totalBuildingHoldArea,businessItem.totalBuildingHoldArea
            _numerator = ""; //分子
            _denominator = ""; //分母
            switch (_newTheSameSubjectOtherBizRowData.subject
              .apportionmentRuleCode) {
              case "0":
                _numerator = "totalSellArea";
                _denominator = "canSaleAcreage_sum";
                break;
              case "1":
                _numerator = "totalBuildingArea";
                _denominator = "buildingAcreage_sum";
                break;
              case "2":
                _numerator = "totalBuildingHoldArea";
                _denominator = "totalBuildingHoldArea_sum";
                break;
            }
            //最后一个业态(用已分配的剩余金额，排除比例误差)
            if (tabIndex === this.pageModelList.length - 3) {
              _newTheSameSubjectOtherBizRowData.targetCostIncludeTax = calc.Sub(
                ifNull(rowData.targetCostIncludeTax, 0),
                ifNull(_TotalDispathTargetCostIncludeTax, 0)
              );

              _newTheSameSubjectOtherBizRowData.targetCostExcludeTax = calc.Sub(
                ifNull(rowData.targetCostExcludeTax, 0),
                ifNull(_TotalDispathTargetCostExcludeTax, 0)
              );

              //console.log('the last business type')
              //console.log(_newTheSameSubjectOtherBizRowData.targetCostIncludeTax)
            } else {
              let _dispathAmount =
                calc
                  .Div(
                    calc.Mul(
                      ifNull(rowData.targetCostIncludeTax, 0),
                      ifNull(businessItem[_numerator], 0)
                    ),
                    ifNull(_this.detailModel[_denominator], 1)
                  )
                  .toFixed(2) / 1;
              _TotalDispathTargetCostIncludeTax = calc.Add(
                _TotalDispathTargetCostIncludeTax,
                _dispathAmount
              );
              _newTheSameSubjectOtherBizRowData.targetCostIncludeTax = _dispathAmount;

              //不含税
              let _dispathExcludeTaxAmount =
                calc
                  .Div(
                    calc.Mul(
                      ifNull(rowData.targetCostExcludeTax, 0),
                      ifNull(businessItem[_numerator], 0)
                    ),
                    ifNull(_this.detailModel[_denominator], 1)
                  )
                  .toFixed(2) / 1;
              _TotalDispathTargetCostExcludeTax = calc.Add(
                _TotalDispathTargetCostExcludeTax,
                _dispathExcludeTaxAmount
              );
              _newTheSameSubjectOtherBizRowData.targetCostExcludeTax = _dispathExcludeTaxAmount;

              //console.log('the pre business type')
              //console.log(_dispathAmount)
            }

            _newTheSameSubjectOtherBizRowData.taxRate = rowData.taxRate;
            //科目重新赋值
            _this.$set(
              businessItem.data,
              rowIndex,
              _newTheSameSubjectOtherBizRowData
            );
            //计算各业态行，科目树
            setTimeout(() => {
              console.log(
                "rowIndex:" +
                  rowIndex +
                  ",tabIndex:" +
                  tabIndex +
                  ",_newTheSameSubjectOtherBizRowData:" +
                  JSON.stringify(_newTheSameSubjectOtherBizRowData)
              );
              _this.calcRowData(
                rowIndex,
                _newTheSameSubjectOtherBizRowData,
                tabIndex,
                true
              );
            }, 200 * tabIndex);
          }
        });
      }
    },
    // 打开选中其他项目选框
    handleUseProjectTemplate() {
      this.page.dialog.dialogSelect = true;
      this.page.dialog.queryModel.filterCompanyId = "";
      this.page.dialog.tableData = [];
      this.handleSearchOtherProjectTemplate();
    },
    // 加载其他项目模板中的公司ID
    handleUserProjectTemplateCompanyId() {
      this.page.dialog.queryModel.companyId = this.queryModel.companyId;
    },
    // 其他项目模板选中事件
    handleSelectOtherProjectTemplate(index, rowData) {
      this.page.dialog.dialogSelect = false;
      LoadingUtil.showLoading();

      getAccountingSubjectList({
        projectId: rowData.projectId
      })
        .then(response => {
          LoadingUtil.hideLoading();
          if (response && response.data) {
            this.initTableData(response);
          }
        })
        .catch(error => {
          console.log(error);
          this.$showError(error.message ? error.message : "msg_system_error");
        });
    },
    // 关闭模板
    handleCloseOtherProjectTemplate() {
      this.page.dialog.dialogSelect = false;
    },
    // 其他项目模板搜索事件
    handleSearchOtherProjectTemplate() {
      let _this = this;
      this.page.dialog.deptList = [];
      let _accountingObjectId = this.queryModel.accountingObjectId;
      if (_accountingObjectId) {
        LoadingUtil.showLoading();
        getOtherProjectTemplate({
          accountingObjectId: _accountingObjectId
        })
          .then(response => {
            LoadingUtil.hideLoading();
            if (response.data && JSON.stringify(response.data) !== "[null]") {
              this.page.dialog.tableData = response.data;
              let allCompanyId = [];
              this.page.dialog.tableData.map(item => {
                if (allCompanyId.indexOf(item.companyId) < 0) {
                  allCompanyId.push(item.companyId);
                  let deptInfo = {
                    companyId: item.companyId || "0",
                    companyName: item.companyName || "未知部门"
                  };
                  this.page.dialog.deptList.push(deptInfo);
                }
              });
              allCompanyId = null;
            }
            LoadingUtil.hideLoading();
          })
          .catch(error => {
            console.log(error);
            this.$showError(error.message ? error.message : "msg_system_error");
            LoadingUtil.hideLoading();
          });
      }
    },
    // 输入验证
    handleRowChange(fieldType, fieldInputValue, rowData, index, event) {
      let _reg = "";
      let _errmsg = null;
      let fieldValue = fieldInputValue;
      if (
        (fieldValue === null || fieldValue.toString().length === 0) &&
        fieldType !== "remark"
      ) {
        this.$showError("输入错误！");
        this.pageStatus.checkSave = false;
        // if (event) event.currentTarget.focus()
        return;
      }
      fieldValue = fieldValue.toString();
      switch (fieldType) {
        case "code":
          fieldValue = fieldValue.replace(/\./g, "");
          _reg = /^\+?[1-9][0-9]{0,30}$/;
          _errmsg =
            this.$l("lbl_standared_subject_code") +
            this.$l("msg_standared_wrong_data");
          this.syncAllBusinessSubject(rowData, index); // 同步科目数据
          break;
        case "name":
          _reg = /^.{0,30}$/;
          _errmsg =
            this.$l("lbl_standared_subject_name") +
            this.$l("msg_standared_wrong_data");
          this.syncAllBusinessSubject(rowData, index); // 同步科目数据
          break;
        case "financialSubjectCode":
          fieldValue = fieldValue.replace(/\./g, "");
          _reg = /^\+?[1-9][0-9]{0,30}$/;
          _errmsg =
            this.$l("lbl_standared_subject_financial_subject_code") +
            this.$l("msg_standared_wrong_data");
          break;
        case "financialSubjectName":
          _reg = /^.{0,30}$/;
          _errmsg =
            this.$l("lbl_standared_subject_financial_subject_name") +
            this.$l("msg_standared_wrong_data");
          break;
        case "taxRate":
          _reg = /^(((\d|[1-9]\d)(\.\d{1,2})?)|100|100.0|100.00)$/;
          _errmsg = "税率输入错误(税率最多只能输入2位小数)";
          break;
        case "targetCostIncludeTax":
          _reg = /^\d{1,18}(\.\d{1,2})?$/;
          _errmsg = "金额输入错误(小数前最多14位，小数后最多2位)";
          break;
        default:
          break;
      }
      // 编制目标成本含税金额>= 在途金额+已发生金额
      if (
        ifNull(fieldInputValue, 0) <
        ifNull(rowData.amountPendingApprove, 0) +
          ifNull(rowData.amountOccurence, 0)
      ) {
        this.pageStatus.checkSave = false;
        this.$showNormalError(
          "错误，不符合逻辑：编制目标成本含税金额≥ 在途金额+已发生金额"
        );
        return;
      }
      if (fieldType === "name") {
        // 检查科目名称是否重复
        let findSubjectItem = this.pageModelList[
          this.pageStatus.hanldeTabIndex
        ].data.find(item => {
          return (
            item.subject.name === fieldInputValue &&
            item.subject.code !== rowData.subject.code
          );
        });
        if (findSubjectItem) {
          this.pageStatus.checkSave = false;
          this.$showNormalError("科目名称已存在");
          // if (event) event.currentTarget.focus()
          return;
        }
      }
      if (
        fieldType === "code" &&
        rowData.subject.code &&
        rowData.subject.code.includes("99")
      ) {
        this.pageStatus.checkSave = false;
        this.$showNormalError("科目编码错误(不允许创建99科目)");
        if (rowData.subject.code) {
          let _codeArray = rowData.subject.code.split(".");
          _codeArray.pop();
          rowData.subject.code = _codeArray.join(".") + ".xx";
        }
        return;
      }
      if (fieldType === "code" && !this.checkCode(rowData.subject.code)) {
        this.pageStatus.checkSave = false;
        this.$showNormalError("科目编码错误(已存在)");
        if (rowData.subject.code) {
          let _codeArray = rowData.subject.code.split(".");
          _codeArray.pop();
          rowData.subject.code = _codeArray.join(".") + ".xx";
        }
        // if (event) event.currentTarget.focus()
        return;
      }
      if (!fieldValue.match(_reg)) {
        this.$showNormalError(_errmsg);
        this.pageStatus.checkSave = false;

        if (fieldType === "code") {
          if (rowData.subject.code) {
            let _codeArray = rowData.subject.code.split(".");
            _codeArray.pop();
            rowData.subject.code = _codeArray.join(".") + ".xx";
          }
        }

        // if (event) event.currentTarget.focus()
        return;
      } else {
        this.pageStatus.checkSave = true;
        if (fieldType === "targetCostIncludeTax" || fieldType === "taxRate") {
          this.calcRowData(index, rowData);
          // 同步科目金额到其他业态科目
          this.syncOtherBusinessSubject(rowData, index);
        }
      }
    },
    // 行显示/颜色
    showRow({ row, column, rowIndex, columnIndex }) {
      // 行隐藏
      let _background = "";
      let _cursor = "";
      const show = row._show;
      // 普通的才处理
      if (this.pageStatus.flag !== "KUAQI") {
        if (
          this.pageStatus.hanldeTabIndex ===
          (this.pageModelList.length - 1).toString()
        ) {
          _background = ";background:RGB(204,204,204)";
          _cursor = ";cursor:not-allowed;";
        } else {
          if (
            row.subject.code.includes("4301.03") ||
            row.subject.code.includes("4301.04")
          ) {
            if (
              this.pageModelList[this.pageStatus.hanldeTabIndex]
                .constructType === "GTCB"
            ) {
              _background = ";background:RGB(204,204,204)";
              _cursor = ";cursor:not-allowed;";
            } else {
              _background = "";
              _cursor = "";
            }
          } else {
            if (
              this.pageModelList[this.pageStatus.hanldeTabIndex]
                .constructType === "GTCB"
            ) {
              _background = "";
              _cursor = "";
            } else {
              _background = ";background:RGB(204,204,204)";
              _cursor = ";cursor:not-allowed;";
            }
          }
        }
      }
      return (
        (show
          ? "animation:treeTableShow 1s;-webkit-animation:treeTableShow 1s;"
          : "display:none;") +
        _background +
        _cursor
      );
    },
    // 返回列表页面
    handleBack() {
      this.$router.push({
        name: "TargetCostCompilationList"
      });
    },
    // 搜索当前科目树
    handleSearch() {
      let _this = this;
      LoadingUtil.showLoading();
      if (!this.queryModel.subjectCodeOrName) {
        this.pageModelList[this.pageStatus.hanldeTabIndex].data.map(item => {
          item._show = !COSTBUSINESS.checkIsSpecialCode(item.subject);
        });
      } else {
        this.queryModel.subjectCodeOrName = this.queryModel.subjectCodeOrName.trim();
        let filterData = this.pageModelList[
          this.pageStatus.hanldeTabIndex
        ].data.filter(function(item) {
          return (
            item.subject.code.indexOf(_this.queryModel.subjectCodeOrName) >
              -1 ||
            item.subject.name.indexOf(_this.queryModel.subjectCodeOrName) > -1
          );
        });

        if (filterData.length === 0) {
          LoadingUtil.hideLoading();
          this.pageModelList[this.pageStatus.hanldeTabIndex].data.map(item => {
            item._show = false;
          });
          this.$showNormalError("没有符合条件的数据");
          return;
        }

        this.pageModelList[this.pageStatus.hanldeTabIndex].data.map(item => {
          if (_this.queryModel.subjectCodeOrName) {
            if (
              item.subject.code.indexOf(this.queryModel.subjectCodeOrName) >
                -1 ||
              item.subject.name.indexOf(this.queryModel.subjectCodeOrName) > -1
            ) {
              item._show = !COSTBUSINESS.checkIsSpecialCode(item.subject);
            } else {
              item._show = false;
            }
          }
        });
      }
      LoadingUtil.hideLoading();
    },
    // 获取集团科目模板
    handleUseCorporationTemplate() {
      this.$confirm("确认引入集团科目模板？", {
        confirmButtonText: this.$l("btn_confirm"),
        cancelButtonText: this.$l("btn_cancel"),
        type: "warning"
      })
        .then(() => {
          LoadingUtil.showLoading();
          getStandaredSubjectList({ type: "0", ownerId: "0" })
            .then(response => {
              LoadingUtil.hideLoading();
              // this.$showSuccess(response.message)
              // 将targetCostModelList[index].subject改为targetCostModelList[index].subjectModel
              if (
                response &&
                response.data &&
                response.data.targetCostModelList
              ) {
                response.data.targetCostModelList.map(item => {
                  item["subject"] = item["subjectModel"];
                });
              }
              this.initTableData(response);
            })
            .catch(error => {
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
          _this.initImportData(response);
        }
        //this.$showSuccess(response.message)
      }
    },
    // 导出
    handleExport() {
      //保存后导出
      let _this = this;
      this.handleSave(
        false,
        function() {
          let _accountingObjectId = _this.queryModel.accountingObjectId;
          let _stageId = _this.queryModel.stageId;
          let _stageVersion = _this.queryModel.stageVersion
            ? _this.queryModel.stageVersion
            : 0;
          COSTBUSINESS.download(
            process.env.COST_API +
              "/targetCost/defineStageVersion/export?editType=1&accountingObjectId=" +
              _accountingObjectId +
              "&stageId=" +
              _stageId +
              "&stageVersion=" +
              _stageVersion
          );
        },
        true
      );
    },
    // 撤销编辑
    handleUndo() {
      if (
        this.pageStatus.hanldeTabIndex === this.pageModelList.length.toString()
      )
        return;
      if (!this.pagePreEditModelList) {
        this.getCommonInfo(this.queryModel.accountingObjectId);
        return;
      }
      this.pageModelList = deepCopy(this.pagePreEditModelList);
      this.pagePreEditModelList = "";
    },
    // 编辑
    handleEdit() {
      LoadingUtil.showLoading();
      if (
        this.pageStatus.flag !== "KUAQI" &&
        this.pageStatus.hanldeTabIndex === this.pageModelList.length.toString()
      )
        return;
      this.pagePreEditModelList = deepCopy(this.pageModelList);
      this.pageModelList[this.pageStatus.hanldeTabIndex].data.map(item => {
        //if (this.getParentChild(item.subject.code).length === 0) {
        let isLeaf = item._isNew
          ? this.getParentChild(item.subject.code).length === 0
          : item._isLeaf;
        if (isLeaf) {
          item._editStatus = true;
          if (
            this.pageStatus.flag === "KUAQI" &&
            item.subject.publicStallOrNot === COSTENUM.publicStallType.NO
          ) {
            // 跨期非公摊不可编辑
            item._editStatus = false;
          }
          if (
            this.pageStatus.flag !== "KUAQI" &&
            item.subject.publicStallOrNot === COSTENUM.publicStallType.YES
          ) {
            // 非跨期公摊不可编辑
            item._editStatus = false;
          }
          if (
            item.subject.publicStallOrNot !== COSTENUM.publicStallType.NO &&
            item.subject.publicStallOrNot !== COSTENUM.publicStallType.YES
          ) {
            item._editStatus = true;
          }
        } else {
          item._editStatus = false;
        }

        //公摊成本
        if (this.pageStatus.flag !== "KUAQI") {
          if (
            this.pageStatus.hanldeTabIndex ===
            (this.pageModelList.length - 1).toString()
          ) {
            item._editStatus = false;
          } else {
            if (
              item.subject.code.includes("4301.03") ||
              item.subject.code.includes("4301.04")
            ) {
              if (
                this.pageModelList[this.pageStatus.hanldeTabIndex]
                  .constructType === "GTCB"
              ) {
                item._editStatus = false;
              } else {
              }
            } else {
              if (
                this.pageModelList[this.pageStatus.hanldeTabIndex]
                  .constructType === "GTCB"
              ) {
              } else {
                item._editStatus = false;
              }
            }
          }
        }
      });
      setTimeout(function() {
        LoadingUtil.hideLoading();
      }, 2000);
    },
    // 检查成本分期
    checkDetail() {
      LoadingUtil.showLoading();
      if (this.$route.query.isEdit) {
        this.page.isEdit = this.$route.query.isEdit.toString() === "true";
      } else {
        this.page.isEdit = false;
      }

      let _param = {
        accountingObjectId: this.queryModel.accountingObjectId,
        stageId: this.detailModel.stageId
          ? this.detailModel.stageId
          : this.queryModel.stageId
      };
      checkTargetCostVersion(_param)
        .then(response => {
          // this.$showSuccess(response.message)
          if (response.data) {
            this.initDetailData(response);
          } else {
            if (this.detailModel.stageId.toString() != "1") {
              this.page.isEdit = false;
              this.$showNormalError(
                response.message ? response.message : "系统错误"
              );
            } else if (response.message) {
              this.page.isEdit = false;
              this.$showNormalError(response.message);
            }
          }

          LoadingUtil.hideLoading();
        })
        .catch(error => {
          console.log(error);
          this.pageModelList = [];
          LoadingUtil.hideLoading();
          this.$showError(error.message ? error.message : "msg_system_error");
        });
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
        if (_stageVersion === null) _stageVersion = 0;
        getTargetCostcompilationDetail({
          accountingObjectId: this.queryModel.accountingObjectId,
          stageId: _stageId,
          stageVersion: _stageVersion
        })
          .then(response => {
            // this.$showSuccess(response.message)
            this.initDetailData(response);
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
    //设置为提交状态
    setSubmitStatus() {
      this.pageStatus.onSubmit = true; //正在提交
    },
    resetSubmitStatus() {
      this.pageStatus.onSubmit = false; //非提交
    },
    // 保存
    handleSave(autoSubmit = false, callBack, isFromExport = false) {
      // alert('5555')
      if (autoSubmit) this.setSubmitStatus();
      LoadingUtil.showLoading();
      if (!this.pageStatus.checkSave) {
        this.$showNormalError("输入数据错误，请修正！");
        if (autoSubmit) this.resetSubmitStatus();
        LoadingUtil.hideLoading();
        return;
      }

      if (!isFromExport) {
        if (
          this.detailModel.allocationStandard === null ||
          this.detailModel.allocationStandard === null
        ) {
          this.$showNormalError("请填写明细信息中”图纸版本“、“配置标准”");
          this.pageStatus.blockDetailActiveName = "1";
          if (autoSubmit) this.resetSubmitStatus();
          LoadingUtil.hideLoading();
          return;
        }
      }

      // 检查必输项目
      let checkData = true;
      this.pageModelList.map(businessItem => {
        businessItem.data.map(subjectItem => {
          if (!subjectItem.subject.name) {
            checkData = false;
          }
        });
      });
      if (!checkData) {
        this.$showNormalError("请正确填写项目");
        if (autoSubmit) this.resetSubmitStatus();
        LoadingUtil.hideLoading();
        return;
      }
      // 检查各业态的同一个科目税率是否一致
      let subjectTaxRate = {}; // {'4301.01.01.02.01':"#0#,#10#"}
      let errorSubjectList = [];
      let pageModelListIndex = 0;
      if (this.pageStatus.flag !== "KUAQI") {
        // 有多个业态才检查
        // if (this.pageModelList.length > 2) {
        //     this.pageModelList.map(businessItem => {
        //         // 最后一个不处理
        //         if (pageModelListIndex !== this.pageModelList.length - 1) {
        //             businessItem.data.map(subjectItem => {
        //                 if (subjectItem._isLeaf) {
        //                     // 叶子节点
        //                     if (subjectTaxRate[subjectItem.subject.code] &&
        //                         subjectTaxRate[subjectItem.subject.code].indexOf('#' + subjectItem.taxRate + '#') < 0 &&
        //                         ifNull(subjectItem.taxRate, 0) !== 0 // 0不参数比较，即税率可以未null，0或具体数字，值对比具体数字是否一致
        //                     ) {
        //                         subjectTaxRate[subjectItem.subject.code] += ',#' + subjectItem.taxRate + '#'

        //                         // 问题科目名称
        //                         if (errorSubjectList.indexOf(subjectItem.subject.name) < 0) errorSubjectList.push(subjectItem.subject.name)
        //                     } else {
        //                         subjectTaxRate[subjectItem.subject.code] = '#' + subjectItem.taxRate + '#'
        //                     }
        //                 }
        //             })
        //         }
        //         pageModelListIndex++
        //     })
        //     if (errorSubjectList.length > 0) {
        //         this.$showNormalError('业态下科目税率不一致，问题科目：' + errorSubjectList.join('，'), 6000)
        //     } else {
        //         this.handleSaveAction()
        //     }
        // } else {
        //     this.handleSaveAction()
        // }
        this.handleSaveAction(autoSubmit, callBack, isFromExport);
      } else {
        // 跨期必须要有一个分摊，即不分摊的分期个数不能等于分期个数
        let _KUAQIData = this.KUQQIData();
        let _tips = "";
        if (_KUAQIData.length > 0) {
          for (let i = 0; i < _KUAQIData.length; i++) {
            let item = _KUAQIData[i];
            if (
              item.subject.acrossPhase &&
              (item.subject.acrossPhase + ",").split(",").length - 1 ===
                this.pageStatus.attributes.length
            ) {
              _tips = "叶子科目参与分摊的分期必须大于1个"; //item.subject.name+'('+item.subject.code+')'
              break;
            }
          }
        }
        if (_tips) {
          LoadingUtil.hideLoading();
          this.$showError(_tips);
          if (autoSubmit) this.resetSubmitStatus();
        } else {
          this.handleSaveAction(autoSubmit, callBack, isFromExport);
        }
      }
    },
    //准备保存数据
    prepareSaveData() {
      let _saveData = [];
      this.pageModelList.map(item => {
        _saveData.push({
          name: item.name,
          targetCostModelList: deepCopy(item.data)
        });
      });
      // 税率换算成小数
      _saveData.map(item => {
        item.targetCostModelList.map(subjectItem => {
          subjectItem.taxRate = subjectItem.taxRate / 100;
        });
      });
      //排除“公摊成本”“成本分期”
      if (
        this.pageStatus.flag !== "KUAQI" &&
        this.pageStatus.containBusinessType
      )
        _saveData.length = _saveData.length - 2;
      if (this.pageStatus.flag === "KUAQI" && _saveData.length > 1)
        _saveData.length = 1;
      let _param = {
        accountingObjectId: this.queryModel.accountingObjectId,
        stageId: this.detailModel.stageId,
        stageVersion: this.queryModel.stageVersion,
        //参考地区
        cityName: this.detailModel.cityName,
        //图纸版本
        drawingVersion: this.detailModel.drawingVersion,
        //配置标准
        allocationStandard: this.detailModel.allocationStandard,
        //附件
        attachments: this.page.attachment.attachmentData,
        //平均售价（含车位）
        avgPrice: this.detailModel.avgPrice,
        //预备会召开时间
        prepareMeetingTime: this.detailModel.prepareMeetingTime,
        //数据
        targetCostModelList: _saveData
      };
      return _param;
    },
    handleSaveAction(autoSubmit = false, callBack, isFromExport = false) {
      let _param = this.prepareSaveData();
      if (
        _param.targetCostModelList &&
        _param.targetCostModelList[0].targetCostModelList.length === 0
      ) {
        //this.$showNormalError('没有维护任何科目')
        if (autoSubmit) this.resetSubmitStatus();
        LoadingUtil.hideLoading();
        return;
      }

      if (!this.page.id) {
        updateDraftVersion(_param)
          .then(response => {
            this.pageStatus.finishSave = true; // 完成保存
            if (response.data) {
              this.detailModel.stageId = response.data.stageId;
              this.queryModel.stageId = response.data.stageId;
              this.detailModel.stageVersion = response.data.stageVersion;
              this.queryModel.stageVersion = response.data.stageVersion;
              this.page.statusName = "编辑";
              if (autoSubmit) {
                this.handleSubmit();
              } else {
                this.getCommonInfoAfterSave(
                  this.queryModel.accountingObjectId,
                  this.queryModel.stageId,
                  this.queryModel.stageVersion
                );
                LoadingUtil.hideLoading();
                //有回调不提示信息
                if (!callBack) this.$showSuccess(response.message);
              }
              if (callBack) {
                callBack();
              }
            } else {
              LoadingUtil.hideLoading();
            }
          })
          .catch(error => {
            console.log(error);
            LoadingUtil.hideLoading();
            if (autoSubmit) this.resetSubmitStatus();
            this.$showError(error.message ? error.message : "msg_system_error");
          });
      } else {
        saveDraftVersion(_param)
          .then(response => {
            this.pageStatus.finishSave = true; // 完成保存
            if (response.data) {
              this.detailModel.stageId = response.data.stageId;
              this.queryModel.stageId = response.data.stageId;
              this.detailModel.stageVersion = response.data.stageVersion;
              this.queryModel.stageVersion = response.data.stageVersion;
              this.page.statusName = "编辑";
              if (autoSubmit) {
                this.handleSubmit();
              } else {
                this.getCommonInfoAfterSave(
                  this.queryModel.accountingObjectId,
                  this.queryModel.stageId,
                  this.queryModel.stageVersion
                );
                LoadingUtil.hideLoading();
                //有回调不提示信息
                if (!callBack) this.$showSuccess(response.message);
              }
              if (callBack) {
                callBack();
              }
            } else {
              LoadingUtil.hideLoading();
            }
          })
          .catch(error => {
            console.log(error);
            LoadingUtil.hideLoading();
            if (autoSubmit) this.resetSubmitStatus();
            this.$showError(error.message ? error.message : "msg_system_error");
          });
      }
    },
    // 提交
    handleSubmit() {
      LoadingUtil.hideLoading();
      if (this.pageModelList && this.pageModelList[0].data.length === 0) {
        this.$showNormalError("审批数据不可为空");
        this.resetSubmitStatus();
        return;
      }
      // if (!this.pageStatus.finishSave) {
      //     this.$showNormalError('请先保存数据')
      //     return
      // }

      // 汇总最后一级
      this.calcTotalData();

      // 检查叶子是否为0
      let tips = "";
      let checkTargetData = [];
      if (this.pageModelList && this.pageModelList.length > 0) {
        checkTargetData =
          this.pageStatus.flag === "KUAQI"
            ? deepCopy(this.pageModelList[0].data)
            : deepCopy(this.pageModelList[this.pageModelList.length - 1].data);
      }
      for (let i = 0; i < checkTargetData.length; i++) {
        if (
          checkTargetData[i]._isLeaf &&
          ifNull(checkTargetData[i].targetCostIncludeTax, 0) <= 0 &&
          !COSTBUSINESS.checkIsSpecialCode(checkTargetData[i].subject)
        ) {
          // tips = "科目[" + checkTargetData[i].subject.name + "]未维护目标成本，确认要提交审批吗？"
          tips = "当前存在未编辑目标成本金额的科目，确认要提交审批吗？";
          break;
        }
      }
      checkTargetData = null;
      if (tips !== "") {
        this.$confirm(tips, "提交审批", {
          confirmButtonText: this.$l("btn_confirm"),
          cancelButtonText: this.$l("btn_cancel"),
          type: "warning"
        })
          .then(() => {
            this.handleSubmitAction();
          })
          .catch(() => {
            this.resetSubmitStatus();
          });
      } else {
        this.handleSubmitAction();
      }
    },
    handleSubmitAction() {
      LoadingUtil.showLoading();
      let _saveData = [];
      this.pageModelList.map(item => {
        _saveData.push({
          name: item.name,
          targetCostModelList: deepCopy(item.data)
        });
      });
      // 税率换算成小数
      _saveData.map(item => {
        item.targetCostModelList.map(subjectItem => {
          subjectItem.taxRate = subjectItem.taxRate / 100;
        });
      });
      if (
        this.pageStatus.flag !== "KUAQI" &&
        this.pageStatus.containBusinessType
      )
        _saveData.length = _saveData.length - 2;
      let _param = {
        accountingObjectId: this.queryModel.accountingObjectId,
        stageId: this.detailModel.stageId,
        stageVersion: this.queryModel.stageVersion,
        //参考地区
        cityName: this.detailModel.cityName,
        //图纸版本
        drawingVersion: this.detailModel.drawingVersion,
        //配置标准
        allocationStandard: this.detailModel.allocationStandard,
        //附件
        attachments: this.page.attachment.attachmentData,
        targetCostModelList: _saveData
      };
      submitStageVersionRequest(_param)
        .then(response => {
          console.log(response)
          this.pageStatus.finishSubmit = true;
          LoadingUtil.hideLoading();
          this.$showSuccess(response.message);
          // this.handleUndo()
          this.handleBack();
        })
        .catch(error => {
          LoadingUtil.hideLoading();
          console.log(error);
          this.$showError(error.message ? error.message : "msg_system_error");
        });
    },
    // 提示信息
    openAnnotation: function(h, { column, $index }) {
      return (
        <el-tooltip effect="dark" placement="bottom">
          <template slot="content">
            <div style="width:200px">{column.labelClassName}</div>
          </template>
          <span>
            {column.label} <i class="el-icon-warning" />
          </span>
        </el-tooltip>
      );
    }
  },
  watch: {
    // 成本分期变化
    "queryModel.accountingObjectId": function(newValue, oldValue) {
      if (newValue !== oldValue) {
        if (oldValue) {
          this.queryModel.stageId = null;
          this.queryModel.stageVersion = null;
        }

        this.handleUserProjectTemplateCompanyId(); // 当前companyID
        this.getCommonInfo(newValue);
      }
    }
  }
};
</script>
<style  scoped>
.attachments {
  margin-bottom: 20px;
}
.detailSubTitle {
  width: 90%;
  border-bottom: 1px gray dashed;
  color: blue;
  font-weight: bold;
  text-align: center;
}
.blockDetail {
  margin-bottom: 5px;
  border: none;
}
.blockButton {
  margin-bottom: 20px;
  border: none;
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
.col{
  color: blue;
  text-decoration: underline;
  cursor: pointer;
}
</style>
