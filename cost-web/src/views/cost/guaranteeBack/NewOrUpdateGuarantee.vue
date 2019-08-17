<template>
    <div class='app-container'>
        <div style="text-align:right; margin:10px 0;">
            <el-button size="mini"
                       @click='handleBack'>{{$l('btn_back')}}
            </el-button>
            <el-button size="mini"
                       type='primary'
                       :disabled="buttonDisable"
                       v-show="isShowAdd"
                       @click='saveConstruction'>{{$l('btn_save')}}
            </el-button>
            <el-button size="mini"
                       type='primary'
                       @click='submitConstructionCost'
                       v-show="isShowSubmit"
                       :disabled="buttonDisableSub">
                {{$l('lbl_cost_compilation_submit')}}
            </el-button>
        </div>
        <el-form label-width='150px'
                 status-icon
                 :model="ConstructionModel"
                 ref="ConstructionModel"
                 :rules="rules"
                 size="mini"
                 :disabled="formDisable">
            <div class="form-unit">基本信息</div>
            <el-row :gutter="12">
                <el-col :span="8">
                    <!-- 单据编号 -->
                    <el-form-item :label="'单据编号：'">
                        <el-input v-model="ConstructionModel.receiptsNo"
                                  :disabled="true"></el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="8">
                    <!-- 单据名称 -->
                    <el-form-item :label="'单据名称：'"
                                  prop="receiptsName">
                        <el-input v-model="ConstructionModel.receiptsName"
                                  :disabled="inputDisable"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row :gutter="12">
                <ProjectSelector v-model='ConstructionModelTest'
                                 :show="show"
                                 :span="{'project':8}"
                                 :label-width="{project:150}"></ProjectSelector>
                <el-col :span="8">
                    <el-form-item :label="'合同编号:'"
                                  prop="contractNumber">
                        <el-input v-model="ConstructionModel.contractNumber"
                                  :disabled="buttonDisable">
                            <span @click="addRowToTableConstract"
                                  slot="append"
                                  v-show="isEdit"
                                  class="el-icon-search"
                                  :style="{'cursor':'pointer'}"></span>
                        </el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <!-- 收款单位名称 -->
                    <el-form-item :label="'收款单位名称：'">
                        <el-input v-model="ConstructionModel.payDept"
                                  :disabled="true"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="12">
                <el-col :span="8">
                    <!-- 开户行 -->
                    <el-form-item :label="'收款单位开户行：'">
                        <el-input v-model="ConstructionModel.bankDeposit"
                                  :disabled="inputDisable"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <!-- 账户-->
                    <el-form-item :label="'收款账号：'">
                        <el-input v-model="ConstructionModel.account"
                                  :disabled="inputDisable"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <!-- 合同结算总价款(元)-->
                    <el-form-item :label="'合同结算总价款(元)：'">
                        <el-input-number v-model="ConstructionModel.totalPrice"
                                  :disabled="true" :precision="2" :controls="false"  style="width: 210px;"></el-input-number>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <!-- 累计支付工程款(元)：-->
                    <el-form-item :label="'累计支付工程款(元)：：'">
                        <el-input-number v-model="ConstructionModel.engineeringFunds"
                                  :disabled="inputDisable" :precision="2" :controls="false" style="width: 210px;"></el-input-number>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <!-- 累计支付工程比例(含本次)(元)：：-->
                    <el-form-item :label="'累计支付工程比例(含本次)(元)：'">
                        <el-input-number v-model="ConstructionModel.engineeringFundsRate"
                                  :disabled="inputDisable" :precision="2" :controls="false" style="width: 210px;"></el-input-number>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <!-- *有无维修事项：：-->
                    <el-form-item :label="'有无维修事项：'"
                                  prop="maintain">
                        <fd-select v-model='ConstructionModel.maintain'
                                   type="maintain"
                                   :clearable="true"
                                   :disabled="inputDisable"></fd-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="12">
                <el-col :span="8">
                    <!-- 本次支付后尚余款(元)：-->
                    <el-form-item :label="'本次支付后尚余款(元)：'">
                        <el-input-number v-model="ConstructionModel.spareCash"
                                  v-on:input="inputFunc1" :precision="2" :controls="false" style="width: 210px;"
                                  :disabled="inputDisable"></el-input-number>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <!-- 本次支付后尚余款(大写)：-->
                    <el-form-item :label="'本次支付后尚余款(大写)：'">
                        <el-input v-model="ConstructionModel.spareCashUpper"
                                  :disabled="true"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="12">
                <el-col :span="8">
                    <!-- 质保金申请金额(元)：-->
                    <el-form-item :label="'质保金申请金额(元)：'">
                        <el-input-number v-model="ConstructionModel.qualityMoney"
                                  v-on:input="inputFunc" :precision="2" :controls="false"  style="width: 210px;"
                                  :disabled="inputDisable"></el-input-number>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <!-- 质保金申请金额(大写)：-->
                    <el-form-item :label="'质保金申请金额(大写)：'">
                        <el-input v-model="ConstructionModel.qualityMoneyUpper"
                                  :disabled="true"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="12">
                <el-col :span="8">
                    <!-- 经办人 -->
                    <el-form-item :label="'经办人：'">
                        <el-input v-model="ConstructionModel.operator"
                                  :disabled="true"></el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="8">
                    <!-- 提交日期 -->
                    <el-form-item :label="'提交日期：'"
                                  prop="createdDate">
                        <el-input v-model='ConstructionModel.operateDate'
                                  :disabled="true"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="12">
                <el-col :span="8">
                    <!-- 审批状态 -->
                    <el-form-item :label="'审批状态：'"
                                  prop="statusCh">
                        <el-input v-model='ConstructionModel.statusCh'
                                  :disabled="true"></el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="8">
                    <!-- 审批日期： -->
                    <el-form-item :label="'审批日期：'"
                                  prop="approveDate">
                        <el-input v-model='ConstructionModel.approveDate'
                                  :disabled="true"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>

            <div class="form-unit">罚款明细</div>
            <el-row :gutter="12">
                <el-col :span="8">
                    <!-- 水费(元)：-->
                    <el-form-item :label="'水费(元)：'">
                        <el-input v-model="ConstructionModel.waterRate"
                                  :disabled="true"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <!-- 电费(元)：-->
                    <el-form-item :label="'电费(元)：'">
                        <el-input v-model="ConstructionModel.lightBill"
                                  :disabled="true"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <!-- 罚款(元)：-->
                    <el-form-item :label="'罚款(元)：'">
                        <el-input v-model="ConstructionModel.fine"
                                  :disabled="inputDisable"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <!-- 其他(元)：-->
                    <el-form-item :label="'其他(元)：'">
                        <el-input v-model="ConstructionModel.other"
                                  :disabled="inputDisable"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <!-- 实际支付金额(元)：-->
                    <el-form-item :label="'实际支付金额(元)：'">
                        <el-input v-model="ConstructionModel.payMoney"
                                  v-on:input="inputFunc2"
                                  :disabled="inputDisable"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <!-- 实际支付金额（大写）：-->
                    <el-form-item :label="'实际支付金额（大写）：'">
                        <el-input v-model="ConstructionModel.payMoneyUpper"
                                  :disabled="true"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>

            <div class="form-unit">备注</div>
            <el-input type="textarea"
                      :autosize="{ minRows: 4, maxRows: 6}"
                      placeholder="备注"
                      v-model="ConstructionModel.remark"
                      :disabled="inputDisable">
            </el-input>

            <div class="subTitle">
                <div class="breadcrumb-child">
                    <i></i>附件列表
                </div>
            </div>
            <span class="breadcrumb-child"
                  style="float: left;margin-top: 10px">
                <i></i>上传附件:
            </span>
            <span style="float: left">
                <CostFileUpload style="margin-bottom: 20px"
                                v-model="fileList"
                                :limit="limit"
                                :attachmentData="attachmentData"
                                :outerId="outerId">
                </CostFileUpload>
            </span>

           

            <ContractSelector :showContract="isShowContract"
                              :projectId="ConstructionModelTest.projectId"
                              :type="'alreadyPayment'"
                              v-on:cancelDialog="cancelDialog"
                              v-on:closeDialog="closeDialog"
                              v-on:confirmContract="confirmContract">
            </ContractSelector>
        </el-form>
         <DesignAlterationAttachmentTable :queryObj_passed_in='queryModel'
                                          :showDeleteButton = "showDeleteButton"                          
                                             :attaData='attachmentData'
                                             v-on:changeAttachments="changeAttachments"
                                             ref='DesignAlterationAttachmentTable'>
            </DesignAlterationAttachmentTable>
    </div>
</template>
<script>
import { ptn } from '@/utils/common/validate'
import {
    saveOrUpdateGuarantee,
    getContractList,
    getContractDetail,
    getVisaList,
    getByContractCodeList,
    getPaymentQualityGuaranteeCode
} from '@/api/cost/guaranteeAPI'
import { getMeProfile } from '@/api/sys/userAPI'
import ContractSelector from '@/components/cost/ContractSelector/'
import DesignAlterationAttachmentTable from '@/views/cost/designAlteration/DesignAlterationAttachmentTable'
import CostFileUpload from '@/components/cost/UploadFile/'
import { getAttachment } from '@/api/cost/attachment'
import ProjectSelector from '@/components/cost/AccountSelectorTwo/'
import { getApprove } from '@/api/cost/approve'

export default {
    props: {
        vm_passed_in: {
            default: function () {
                return {
                    id: '',
                    projectId: '',
                    projectName: '',
                    accountObjectId: '',
                    groupNumber: '',
                    agent: '',
                    operateDate: ''
                }
            }
        },
        handleType: ''
    },
    components: {
        ProjectSelector,
        ContractSelector,
        DesignAlterationAttachmentTable,
        CostFileUpload
    },
    data () {
        return {
            radio: 3,
            value: '',
            rules: {
                amount: [{ pattern: ptn.number(1, 2), message: '请输入数字', required: true, trigger: 'blur' }],
                orgName: [{
                    pattern: ptn.all_match(1, 50),
                    message: this.$l('msg_org_text'),
                    required: true,
                    trigger: 'blur'
                }],
                orgType: [{ required: true, message: this.$l('msg_org_type'), trigger: 'blur' }],
                receiptsName: [
                    { required: true, message: '单据名称', trigger: 'blur' }
                ],
                maintain: [
                    { required: true, message: '有无维修事项', trigger: 'blur' }
                ],
                projectName: [{ message: '请输入项目名称', required: true, trigger: 'blur' }]
            },
            show: {
                group: false,
                company: false,
                dept: false,
                project: true,
                accObj: false
            },
            tableData: [],
            isEdit: false,
            isShowSpan: false,
            isShowAdd: true,
            isShowSubmit: true,
            isShowBack: false,
            buttonDisable: false,
            buttonDisableSub: false,
            showDeleteButton: true,
            inputDisable: false,
            formDisable: false,
            selectTable: [],
            fileList: '',
            limit: 4,
            size: 4,
            outerId: '',
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
            attachmentData: [],
            isShowContract: false,
            contractQueryModel: {
                projectId: '',
                projectName: '',
                contractName: '',
                contractType: '',
                contractStatus: '5',
                // contractStatus: '',
                pageNo: 1,
                pageSize: 10,
                count: 0
            },
            queryModuleName: '',
            ConstructionModelTest: {
                projectId: '',
                projectName: ''
            },
            ConstructionModel: {
                id: '',
                receiptsNo: '',
                receiptsName: '',
                projectId: '',
                projectName: '',
                contractId: '',
                contractNumber: '',
                contractName: '',
                payDept: '',
                bankDeposit: '',
                account: '',
                totalPrice: '',
                engineeringFunds: '',
                engineeringFundsRate: '',
                maintain: '',
                spareCash: '',
                spareCashUpper: '',
                qualityMoney: '',
                qualityMoneyUpper: '',
                waterRate: '',
                lightBill: '',
                fine: '',
                other: '',
                payMoney: '',
                payMoneyUpper: '',
                remark: '',
                status: '0',
                createdBy: '',
                statusCh: '草稿',
                approveDate: '',
                operator: '',
                operateDate: ''
            },
            contractInfo: {},
            contractDetail: {},
            visaInfo: [],
            ContractCodeList: [],
            totalElectricity: '',
            totalWater: ''
        }
    },
    mounted: function () {
        this.init()
    },
    methods: {
        init () {
            if (this.$route.query.isAdd) {
                localStorage.setItem('subId', '')
                this.buttonDisableSub = true
                // 新增
                // this.ConstructionModel.projectId = ''
                this.tableData = []
                this.ConstructionModel.operator = this.$getUserInfo()['nickName']
                this.ConstructionModel.operateDate = new Date().format()
            } else {
                this.buttonDisableSub = false
                localStorage.setItem('subId', this.$route.query.id)

                this.tableData = []
                this.ConstructionModel.companyId = this.$route.query.companyId
                this.ConstructionModel.companyName = this.$route.query.companyName
                this.ConstructionModel.receiptsNo = this.$route.query.receiptsNo
                this.ConstructionModel.receiptsName = this.$route.query.receiptsName
                this.ConstructionModelTest.projectId = this.$route.query.projectId
                this.ConstructionModelTest.projectName = this.$route.query.projectName
                this.ConstructionModel.contractId = this.$route.query.contractId
                this.ConstructionModel.contractNumber = this.$route.query.contractNumber
                this.ConstructionModel.contractName = this.$route.query.contractName
                this.ConstructionModel.payDept = this.$route.query.payDept
                this.ConstructionModel.bankDeposit = this.$route.query.bankDeposit
                this.ConstructionModel.account = this.$route.query.account
                this.ConstructionModel.totalPrice = this.$route.query.totalPrice
                this.ConstructionModel.engineeringFunds = this.$route.query.engineeringFunds
                this.ConstructionModel.engineeringFundsRate = this.$route.query.engineeringFundsRate
                this.ConstructionModel.maintain = this.$route.query.maintain
                this.ConstructionModel.spareCash = this.$route.query.spareCash
                this.ConstructionModel.spareCashUpper = this.$route.query.spareCashUpper
                this.ConstructionModel.qualityMoney = this.$route.query.qualityMoney
                this.ConstructionModel.qualityMoneyUpper = this.$route.query.qualityMoneyUpper
                this.ConstructionModel.waterRate = this.$route.query.waterRate
                this.ConstructionModel.lightBill = this.$route.query.lightBill
                this.ConstructionModel.fine = this.$route.query.fine
                this.ConstructionModel.other = this.$route.query.other
                this.ConstructionModel.payMoney = this.$route.query.payMoney
                this.ConstructionModel.payMoneyUpper = this.$route.query.payMoneyUpper
                this.ConstructionModel.remark = this.$route.query.remark
                this.ConstructionModel.operator = this.$route.query.operator
                this.ConstructionModel.operateDate = new Date(this.$route.query.operateDate).format()
                this.ConstructionModel.id = this.$route.query.id
                // this.ConstructionModel.status = this.$route.query.status
                getAttachment({ outerId: this.$route.query.id })
                    .then(response => {
                        debugger
                        this.attachmentData = response.data.attachments
                        this.ConstructionModel.attachments = this.attachmentData
                    })
                    .catch(error => {
                        console.log(error)
                        this.$showError(error.message ? error.message : 'msg_system_error')
                    })
                if (this.$route.query.status == '0') {
                    this.ConstructionModel.statusCh = '草稿'
                } else if (this.$route.query.status == '1') {
                    this.ConstructionModel.statusCh = '审批中'
                } else if (this.$route.query.status == '2') {
                    this.ConstructionModel.statusCh = '已审批'
                } else if (this.$route.query.status == '3') {
                    this.ConstructionModel.statusCh = '已驳回'
                }
                getApprove({ bizTablePkValue: this.$route.query.id })
                    .then(response => {
                        debugger
                        if (response.data != undefined && response.data.approveDate != undefined) {
                            this.ConstructionModel.approveDate = new Date(response.data.approveDate).format()
                        }
                    })
                    .catch(error => {
                        console.log(error)
                        this.$showError(error.message ? error.message : 'msg_system_error')
                    })
            }
            this.ConstructionModel.id = this.$route.query.id
            // this.ConstructionModel.projectId = this.$route.query.projectId
            // this.constructionDetailModel.qualityPriceId = this.$route.query.id
            this.isEdit = this.$route.query.isEdit
            if (!this.isEdit) {
                this.isShowSpan = true
                this.buttonDisable = true
                this.isShowAdd = false
                this.isShowSubmit = false
                this.isShowBack = true
                this.inputDisable = true
                this.formDisable = true
                this.showDeleteButton = false
            }

            this.inputFunc()
            this.inputFunc1()
            this.inputFunc2()
        },
        inputFunc () {
            console.log(this.Arabia_to_Chinese(this.ConstructionModel.qualityMoney))
            var to_Chinese = this.Arabia_to_Chinese(this.ConstructionModel.qualityMoney)
            this.ConstructionModel.qualityMoneyUpper = to_Chinese
        },
        inputFunc1 () {
            console.log(this.Arabia_to_Chinese(this.ConstructionModel.spareCash))
            var to_Chinese = this.Arabia_to_Chinese(this.ConstructionModel.spareCash)
            this.ConstructionModel.spareCashUpper = to_Chinese
        },
        inputFunc2 () {
            console.log(this.Arabia_to_Chinese(this.ConstructionModel.payMoney))
            var to_Chinese = this.Arabia_to_Chinese(this.ConstructionModel.payMoney)
            this.ConstructionModel.payMoneyUpper = to_Chinese
        },
        Arabia_to_Chinese (Num) {
            for (var i = Num.length - 1; i >= 0; i--) {
                Num = Num.replace(',', '')// 替换tomoney()中的“,”
                Num = Num.replace(' ', '')// 替换tomoney()中的空格
            }
            Num = Num.replace('￥', '')// 替换掉可能出现的￥字符
            if (isNaN(Num)) { // 验证输入的字符是否为数字
                alert('请检查小写金额是否正确')
                return
            }
            // 字符处理完毕后开始转换，采用前后两部分分别转换
            var part = String(Num).split('.'),
                newchar = ''
            // 小数点前进行转化
            for (i = part[0].length - 1; i >= 0; i--) {
                if (part[0].length > 10) {
                    alert('位数过大，无法计算')
                    return ''
                }// 若数量超过拾亿单位，提示
                var tmpnewchar = ''
                var perchar = part[0].charAt(i)
                switch (perchar) {
                    case '0':
                        tmpnewchar = '零' + tmpnewchar
                        break
                    case '1':
                        tmpnewchar = '壹' + tmpnewchar
                        break
                    case '2':
                        tmpnewchar = '贰' + tmpnewchar
                        break
                    case '3':
                        tmpnewchar = '叁' + tmpnewchar
                        break
                    case '4':
                        tmpnewchar = '肆' + tmpnewchar
                        break
                    case '5':
                        tmpnewchar = '伍' + tmpnewchar
                        break
                    case '6':
                        tmpnewchar = '陆' + tmpnewchar
                        break
                    case '7':
                        tmpnewchar = '柒' + tmpnewchar
                        break
                    case '8':
                        tmpnewchar = '捌' + tmpnewchar
                        break
                    case '9':
                        tmpnewchar = '玖' + tmpnewchar
                        break
                }
                switch (part[0].length - i - 1) {
                    case 0:
                        tmpnewchar = tmpnewchar + '圆'
                        break
                    case 1:
                        if (perchar != 0) tmpnewchar = tmpnewchar + '拾'
                        break
                    case 2:
                        if (perchar != 0) tmpnewchar = tmpnewchar + '佰'
                        break
                    case 3:
                        if (perchar != 0) tmpnewchar = tmpnewchar + '仟'
                        break
                    case 4:
                        tmpnewchar = tmpnewchar + '万'
                        break
                    case 5:
                        if (perchar != 0) tmpnewchar = tmpnewchar + '拾'
                        break
                    case 6:
                        if (perchar != 0) tmpnewchar = tmpnewchar + '佰'
                        break
                    case 7:
                        if (perchar != 0) tmpnewchar = tmpnewchar + '仟'
                        break
                    case 8:
                        tmpnewchar = tmpnewchar + '亿'
                        break
                    case 9:
                        tmpnewchar = tmpnewchar + '拾'
                        break
                }
                newchar = tmpnewchar + newchar
            }
            // 小数点之后进行转化
            if (Num.indexOf('.') != -1) {
                if (part[1].length > 2) {
                    alert('小数点之后只能保留两位,系统将自动截断')
                    part[1] = part[1].substr(0, 2)
                }
                for (i = 0; i < part[1].length; i++) {
                    tmpnewchar = ''
                    perchar = part[1].charAt(i)
                    switch (perchar) {
                        case '0':
                            tmpnewchar = '零' + tmpnewchar
                            break
                        case '1':
                            tmpnewchar = '壹' + tmpnewchar
                            break
                        case '2':
                            tmpnewchar = '贰' + tmpnewchar
                            break
                        case '3':
                            tmpnewchar = '叁' + tmpnewchar
                            break
                        case '4':
                            tmpnewchar = '肆' + tmpnewchar
                            break
                        case '5':
                            tmpnewchar = '伍' + tmpnewchar
                            break
                        case '6':
                            tmpnewchar = '陆' + tmpnewchar
                            break
                        case '7':
                            tmpnewchar = '柒' + tmpnewchar
                            break
                        case '8':
                            tmpnewchar = '捌' + tmpnewchar
                            break
                        case '9':
                            tmpnewchar = '玖' + tmpnewchar
                            break
                    }
                    if (i == 0) tmpnewchar = tmpnewchar + '角'
                    if (i == 1) tmpnewchar = tmpnewchar + '分'
                    newchar = newchar + tmpnewchar
                }
            }
            // 替换所有无用汉字
            while (newchar.search('零零') != -1) {
                newchar = newchar.replace('零零', '零')
            }
            newchar = newchar.replace('零亿', '亿')
            newchar = newchar.replace('亿万', '亿')
            newchar = newchar.replace('零万', '万')
            newchar = newchar.replace('零圆', '圆')
            newchar = newchar.replace('零角', '')
            newchar = newchar.replace('零分', '')
            if (newchar.charAt(newchar.length - 1) == '圆' || newchar.charAt(newchar.length - 1) == '角') {
                newchar = newchar + '整'
            }
            // alert(newchar)spareCashUpper
            // this.ConstructionModel.qualityMoneyUpper = newchar
            return newchar
        },

        confirmContract (data) {
            this.ConstructionModel.companyId = data.companyId
            this.ConstructionModel.companyName = data.companyName
            this.ConstructionModel.projectId = data.projectId
            this.ConstructionModel.projectName = data.projectName
            this.ConstructionModel.projectCode = data.projectCode
            this.ConstructionModel.contractNumber = data.contractCode
            this.ConstructionModel.contractCode = data.contractCode
            this.ConstructionModel.contractName = data.contractName
            this.ConstructionModel.contractId = data.id
            this.ConstructionModel.totalPrice = data.sharedAmountByCostSystem
            this.ConstructionModel.payDept = data.partyBName
            this.ConstructionModelTest.projectId = data.projectId
            this.ConstructionModelTest.projectName = data.projectName
            this.isShowContract = false
            this.getVisaList()
            this.getByContractCodeData()
            this.getPaymentQualityGuaranteeCode()
        },
        getCurrentRow (contractDetail) {
            this.contractInfo = contractDetail
        },
        cancelDialog (data) {
            this.isShowContract = data
        },
        closeDialog (data) {
            this.isShowContract = data
        },
        addRowToTableConstract () {
            this.isShowContract = true
        },
        handleSelectionChange (val) {
            // debugger
            this.selectContract = val
        },
        getByContractCodeData () {
            let param = {
                contractCode: this.ConstructionModel.contractCode
            }
            getByContractCodeList(param)
                .then(response => {
                    this.ContractCodeList = response.data
                    this.ConstructionModel.waterRate = this.ContractCodeList.totalWater
                    this.ConstructionModel.lightBill = this.ContractCodeList.totalElectricity
                })
                .catch(error => {
                    console.log(error)
                    this.$showError(error.message ? error.message : 'msg_system_error')
                })
        },
        getPaymentQualityGuaranteeCode () {
            let param = {
                contractCode: this.ConstructionModel.contractCode
            }
            getPaymentQualityGuaranteeCode(param)
                .then(response => {
                    this.ConstructionModel.receiptsNo = response.data
                })
                .catch(error => {
                    console.log(error)
                    this.$showError(error.message ? error.message : 'msg_system_error')
                })
        },
        getVisaList () {
            let contractId = ''
            if (this.$route.query.contractId == '' || this.$route.query.contractId == undefined) {
                contractId = this.ConstructionModel.contractId
            } else {
                contractId = this.$route.query.contractId
            }
            let param = {
                contractId: contractId,
                contractCode: this.ConstructionModel.contractCode
            }
            getVisaList(param)
                .then(response => {
                    this.visaInfo = response.data
                    console.log(this.visaInfo)
                })
                .catch(error => {
                    console.log(error)
                    this.$showError(error.message ? error.message : 'msg_system_error')
                })
        },
        getContractDetail () {
            let param = {
                contractId: this.$route.query.contractId
            }
            getContractDetail(param)
                .then(response => {
                    this.contractDetail = response.data
                    this.contractInfo = response.data
                    console.log()
                    this.ConstructionModel.contractId = this.contractInfo.id
                    this.ConstructionModel.contractNumber = this.contractInfo.contractNumber
                    this.ConstructionModel.contractName = this.contractInfo.contractName
                    this.ConstructionModel.contractCode = this.contractInfo.contractCode
                    this.ConstructionModel.contractDate = this.contractInfo.contractDate
                    this.ConstructionModel.projectName = this.contractInfo.projectName
                    this.ConstructionModel.contractValue = this.contractInfo.sharedAmountByCostSystem
                    this.ConstructionModel.buildingSelection = this.contractInfo.partyB
                    if (!this.$route.query.isAdd != 'true') {
                        this.getVisaList()
                    }
                })
                .catch(error => {
                    console.log(error)
                })
        },
        addRowToTableConstract () {
            // debugger
            this.isShowContract = true
            this.contractQueryModel.projectId = this.$route.query.projectId
            // console.log(this.contractQueryModel)
            getContractList(this.contractQueryModel)
                .then(response => {
                    this.selectTable = response.data.content
                })
                .catch(error => {
                    console.log(error)
                })
        },
        handleBack () {
            this.$router.push({
                name: 'GuaranteeList'
            })
        },
        submitConstructionCost () {
            let re = /^[0-9]+.?[0-9]*/
            let isPass = true
            if (this.ConstructionModel.receiptsName == '' || this.ConstructionModel.maintain == '') {
                this.$showError('请输入必填内容')
                isPass = false
            }
            if (!isPass) {
                return
            }
            if (this.$route.query.isAdd) {
                this.ConstructionModel.id = ''
            }
            // this.ConstructionModel.contractId = this.contractInfo.id
            this.ConstructionModel.projectId = this.ConstructionModelTest.projectId
            this.ConstructionModel.projectName = this.ConstructionModelTest.projectName
            this.ConstructionModel.status = '1'
            this.ConstructionModel.attachments = this.attachmentData
            saveOrUpdateGuarantee(this.ConstructionModel)
                .then(response => {
                    this.$showSuccess(response.message)
                    this.handleBack()
                })
                .catch(error => {
                    console.log(error)
                    this.$showError(error.message ? error.message : 'msg_system_error')
                })
        },
        saveConstruction () {
            let re = /^[0-9]+.?[0-9]*/
            let isPass = true
            if (this.ConstructionModel.receiptsName == '' || this.ConstructionModel.maintain == '') {
                this.$showError('请输入必填内容')
                isPass = false
            }
            if (!isPass) {
                return
            }
            if (this.$route.query.isAdd) {
                this.ConstructionModel.id = ''
            }
            // this.ConstructionModel.contractId = this.contractInfo.id
            debugger
            this.ConstructionModel.projectId = this.ConstructionModelTest.projectId
            this.ConstructionModel.projectName = this.ConstructionModelTest.projectName
            this.ConstructionModel.operateDate = new Date(this.ConstructionModel.operateDate).format()
            this.ConstructionModel.status = '0'
            this.ConstructionModel.attachments = this.attachmentData
            saveOrUpdateGuarantee(this.ConstructionModel)
                .then(response => {
                    this.$showSuccess(response.message)
                    localStorage.setItem('subId', response.data)
                    this.isShowAdd = true
                    this.isShowBack = true
                    this.buttonDisableSub = false
                })
                .catch(error => {
                    console.log(error)
                    this.$showError(error.message ? error.message : 'msg_system_error')
                })
        },
        inputAccountObject () {
            this.ConstructionModel.groupNumber = this.ConstructionModel.accountObjectId + '_IC'
        },
        changeAttachments (data) {
            this.ConstructionModel.attachments = data
            this.attachmentData = data
        }
    }
}
</script>
<style>
.custom-00a597 .el-cascader-menu__item--extensible:after {
  content: '\E604';
}
</style>
