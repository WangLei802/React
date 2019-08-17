<template>
    <div class='app-container'>
        <div class="subTitle">
            <div class="breadcrumb-child">
                <i class="fa fa-folder-open-o"></i>基本信息
                <div style="float: right;">
                    <el-button size="mini"
                               @click='handleBack'>{{$l("btn_back")}}
                    </el-button>
                    <el-button size="mini"
                               type='primary'
                               :disabled="buttonDisable"
                               v-show="isShowAdd"
                               @click='saveConstruction'>{{$l("btn_save")}}
                    </el-button>
                    <el-button size="mini"
                               type='primary'
                               @click='submitConstructionCost'
                               v-show="isShowSubmit"
                               :disabled="buttonDisableSub">
                        {{$l("lbl_cost_compilation_submit")}}
                    </el-button>
                </div>
                <!--<div style="float: right;margin-right: 20px">-->
                <!--<el-button size="mini"-->
                <!--type='primary'-->
                <!--:disabled="buttonDisable"-->
                <!--v-show="isShowAdd"-->
                <!--@click='saveIneffectiveCost'-->
                <!--label="btn_save"></el-button>-->
                <!--</div>-->

                <!--<div style="float: right;margin-right: 20px">-->
                <!--<el-button size="mini"-->
                <!--icon='el-icon-back'-->
                <!--type='primary'-->
                <!--v-show="isShowBack"-->
                <!--@click='handleBack'>{{$l("btn_back")}}</el-button>-->
                <!--</div>-->
            </div>
        </div>

        <el-form label-width='150px'
                 status-icon
                 :model="ineffectiveCostModel"
                 ref="ineffectiveCostModel"
                 :rules="rules">
            <el-row :gutter="12">
                <el-col :span="8">
                    <div class="grid-content bg-purple">

                        <!-- 项目名称 -->
                        <el-form-item :label="'项目名称:'">
                            <el-input style="width:200px"
                                      v-model="ineffectiveCostModel.projectId"></el-input>
                        </el-form-item>
                    </div>
                </el-col>

                <el-col :span="8">
                    <!-- 成本分期 -->
                    <div class="grid-content bg-purple">
                        <el-form-item :label="'成本分期:'"
                                      prop="accountObjectId">
                            <el-input style="width:200px"
                                      @change="inputAccountObject"
                                      v-model="ineffectiveCostModel.accountObjectId"></el-input>
                        </el-form-item>
                    </div>
                </el-col>

            </el-row>

            <el-row :gutter="12">
                <el-col :span="8">
                    <!-- 无效成本组编号 -->
                    <el-form-item :label="'无效成本组编号:'"
                                  prop="groupNumber">
                        <el-input style="width:200px"
                                  v-model='ineffectiveCostModel.groupNumber'
                                  :disabled="true"></el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="8">
                    <!-- 经办人 -->
                    <el-form-item :label="'经办人:'"
                                  prop="agent">
                        <el-input style="width:200px"
                                  v-model='ineffectiveCostModel.agent'
                                  :disabled="true"></el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="8">
                    <!-- 经办日期 -->
                    <el-form-item :label="'经办日期:'"
                                  prop="agentDate">
                        <el-input style="width:200px"
                                  v-model='ineffectiveCostModel.agentDate'
                                  :disabled="true"></el-input>
                    </el-form-item>
                </el-col>

            </el-row>

            <div class="subTitle">
                <div class="breadcrumb-child">
                    <i></i>无效成本明细
                </div>
            </div>

            <f-button class="special-btn"
                      type='primary'
                      style="float: right;"
                      @click='deleteDetail'
                      :disabled="buttonDisable"
                      label="btn_delete"></f-button>

            <f-button class="special-btn"
                      type='primary'
                      @click="addRowToTable(row)"
                      :disabled="buttonDisable"
                      style="float: right;margin-right: 20px;margin-bottom: 5px"
                      label="btn_add"></f-button>

            <el-table :data="tableData"
                      stripe
                      @select="handleSelect"
                      @select-all="handleSelectAll"
                      border
                      tooltip-effect="dark"
                      style="width: 100%">

                <el-table-column type="selection"
                                 prop='id'
                                 width="55">
                </el-table-column>

                <!-- 无效成本编号 -->
                <el-table-column type="index"
                                 width="50"
                                 :label="'无效成本编号'"
                                 v-model="ineffectiveCostDetailModel.code">
                </el-table-column>

                <!-- 无效成本类别 -->
                <el-table-column prop="type"
                                 :label="'无效成本类别'"
                                 width="200">
                    <template slot-scope="scope">
                        <span v-show="isShowSpan"
                              style="width: 100%;">
                            {{scope.row.type}}
                        </span>
                        <el-input v-model.trim="scope.row.type"
                                  style="width: 100%;"
                                  v-show="isEdit"></el-input>
                    </template>
                </el-table-column>

                <!-- 无效成本金额 -->
                <el-table-column prop="amount"
                                 :label="'无效成本金额'"
                                 width="200">
                    <template slot-scope="scope">
                        <span v-show="isShowSpan"
                              style="width: 100%;">
                            {{scope.row.amount}}
                        </span>
                        <el-input v-model.trim="scope.row.amount"
                                  style="width: 100%;"
                                  v-show="isEdit"></el-input>
                    </template>
                </el-table-column>

                <!-- 无效成本责任部门 -->
                <el-table-column prop="responsibleDeptCode"
                                 :label="'无效成本责任部门'">
                    <template slot-scope="scope">
                        <fd-label :code="scope.row.responsibleDeptCode"
                                  v-show="isShowSpan"
                                  type="cost_subject_responsible_dept_code"></fd-label>
                        <fd-select v-model='scope.row.responsibleDeptCode'
                                   style="width: 100%;"
                                   v-show="isEdit"
                                   type="cost_subject_responsible_dept_code"></fd-select>
                    </template>
                </el-table-column>

                <!-- 无效成本内容 -->
                <el-table-column prop="content"
                                 :label="'无效成本内容'">
                    <template slot-scope="scope">
                        <span v-show="isShowSpan"
                              style="width: 100%;">
                            {{scope.row.content}}
                        </span>
                        <el-input v-model.trim="scope.row.content"
                                  style="width: 100%;"
                                  v-show="isEdit"></el-input>
                    </template>
                </el-table-column>

                <!-- 无效成本描述 -->
                <el-table-column prop="message"
                                 :label="'无效成本描述'">
                    <template slot-scope="scope">
                        <span v-show="isShowSpan"
                              style="width: 100%;">
                            {{scope.row.message}}
                        </span>
                        <el-input v-model.trim="scope.row.message"
                                  style="width: 100%;"
                                  v-show="isEdit"></el-input>
                    </template>
                </el-table-column>

                <!-- 无效成本扣款倍数 -->
                <el-table-column prop="shareCount"
                                 :label="'无效成本扣款倍数'">
                    <template slot-scope="scope">
                        <span v-show="isShowSpan"
                              style="width: 100%;">
                            {{scope.row.shareCount}}
                        </span>
                        <el-input v-model.trim="scope.row.shareCount"
                                  style="width: 100%;"
                                  v-show="isEdit"></el-input>
                    </template>
                </el-table-column>

            </el-table>
        </el-form>
    </div>
</template>
<script >
import uuidv1 from 'uuid/v1'
import { LoadingUtil } from '@/utils/common/LoadingUtil'
import { ptn } from '@/utils/common/validate'
import { saveOrUpdateIneffectiveCost } from '@/api/cost/ineffectiveCost'
import { getMeProfile } from '@/api/sys/userAPI'
export default {
    props: {
        vm_passed_in: {
            default: function () {
                return {
                    id: '',
                    projectId: '',
                    accountObjectId: '',
                    groupNumber: '',
                    agent: '',
                    agentDate: ''
                }
            }
        },
        handleType: ''
    },
    components: {
    },
    data () {
        return {
            rules: {
                amount: [{ pattern: ptn.number(1, 2), message: '请输入数字', required: true, trigger: 'blur' }],
                orgName: [{ pattern: ptn.all_match(1, 50), message: this.$l('msg_org_text'), required: true, trigger: 'blur' }],
                orgType: [{ required: true, message: this.$l('msg_org_type'), trigger: 'blur' }]
            },
            tableData: [],
            isEdit: false,
            isShowSpan: false,
            isShowAdd: true,
            isShowSubmit: true,
            isShowBack: false,
            buttonDisable: false,
            ineffectiveCostModel: {
                id: '',
                projectId: '',
                accountObjectId: '',
                groupNumber: '',
                agent: '',
                agentDate: '',
                details: '',
                status: '0'
            },
            ineffectiveCostDetailModel: {
                id: '',
                code: '',
                type: '',
                amount: '',
                responsibleDeptCode: '',
                content: '',
                message: '',
                shareCount: ''
            }
        }
    },
    mounted: function () {
        this.init()
    },
    methods: {
        init () {
            if (this.$route.query.isAdd) {
                // 新增
                this.tableData = []
                this.ineffectiveCostModel.agent = this.$getUserInfo()['nickName']
                this.ineffectiveCostModel.agentDate = new Date().format()
            } else {
                this.tableData = this.$route.query.details
                this.ineffectiveCostModel.agent = this.$route.query.agent
                this.ineffectiveCostModel.agentDate = new Date(this.$route.query.agentDate).format()
            }
            this.ineffectiveCostModel.id = this.$route.query.id
            this.ineffectiveCostModel.projectId = this.$route.query.projectId
            this.ineffectiveCostModel.accountObjectId = this.$route.query.accountObjectId
            this.ineffectiveCostModel.groupNumber = this.$route.query.groupNumber
            this.ineffectiveCostDetailModel.responsibleDeptCode = this.$route.query.responsibleDeptCode
            this.isEdit = this.$route.query.isEdit
            if (!this.isEdit) {
                this.isShowSpan = true
                this.buttonDisable = true
                this.isShowAdd = false
                this.isShowSubmit = false
                this.isShowBack = true
            }
        },
        onSubmit (formName) {
            var validateResult = true
            this.$refs[formName].validate((valid) => {
                if (!valid) {
                    validateResult = false
                }
            })
            if (!validateResult) {
                return
            }
            LoadingUtil.showLoading()
        },
        addRowToTable (row) {
            this.tableData.push(this.getDefaultRow(row))
        },
        deleteDetail () {
            let newTableData = this.tableData.filter(function (item) {
                return item.checked !== true
            })
            this.tableData = newTableData
        },
        getROwIndex (row) {
            const _index = this.tableData.lastIndexOf(row)
            return _index
        },
        getDefaultRow (row) {
            return {
                id: '',
                number: '',
                type: '',
                amount: '',
                responsibleDeptCode: '',
                content: '',
                message: '',
                shareCount: '',
                index: uuidv1()
            }
        },
        handleSelect (selection, row) {
            for (let i = 0; i < selection.length; i++) {
                if (selection[i].index === row.index) {
                    this.tableData.forEach((item) => {
                        if (item.index === row.index) {
                            item.checked = true
                        }
                    })
                }
            }
        },

        handleSelectAll (selection, row) {
            // 全选/取消全选
            let allChecked = true
            if (selection.length === 0) {
                allChecked = false
            }
            this.tableData.forEach((item) => {
                item.checked = allChecked
            })
        },
        handleBack () {
            this.$router.push({
                name: 'IneffectiveCostList'
            })
        },
        submitIneffectiveCost () {
            this.$router.push({
                name: 'OrgManager'
            })
        },
        saveIneffectiveCost () {
            let re = /^[0-9]+.?[0-9]*/
            let isPass = true
            if (this.tableData.length !== 0) {
                for (let i = 0; i < this.tableData.length; i++) {
                    if (!re.test(this.tableData[i].amount) || !re.test(this.tableData[i].shareCount)) {
                        this.$showError('请输入数字')
                        isPass = false
                        break
                    }
                }
            }
            if (!isPass) {
                return
            }
            this.ineffectiveCostModel.details = this.tableData
            this.ineffectiveCostModel.agentDate = new Date(this.ineffectiveCostModel.agentDate)
            saveOrUpdateIneffectiveCost(this.ineffectiveCostModel)
                .then(response => {
                    this.$showSuccess(response.message)
                    this.isShowAdd = false
                    this.isShowBack = true
                })
                .catch(error => {
                    console.log(error)
                    this.$showError(error.message ? error.message : 'msg_system_error')
                })
        },
        inputAccountObject () {
            this.ineffectiveCostModel.groupNumber = this.ineffectiveCostModel.accountObjectId + '_IC'
        }
    }
}
</script>

<style scoped>
@import '../../../styles/detail.scss';
</style>

<style scoped>
.custom-00a597 .el-cascader-menu__item--extensible:after {
  content: '\E604';
}
</style>
