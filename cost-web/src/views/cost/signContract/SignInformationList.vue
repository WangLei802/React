<template>
  <div class="app-container">


    <div ref="contractSignListTable">
      <div class="inlineData modeul">

        <el-form ref="contractSignForm"
                 :model="form"
                 label-width="160px"
                 size="mini"
                 :rules="rules"
        >

          <el-form-item   label="纸质合同编号" prop="contractNumber">
            <el-input :disabled="!signOrEdit" v-model="form.contractNumber"  ></el-input>
          </el-form-item>

          <el-form-item label="签订日期" prop="dateOfContract" >

            <el-date-picker v-model="form.dateOfContract"
                            type="date"
                            placeholder="选择日期时间"
                            :disabled="!signOrEdit"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="经办部门">
            <el-input v-model="form.signHandlingDeptName" disabled></el-input>
          </el-form-item>

          <el-form-item label="经办人">
            <el-input v-model="form.signHandlingPersonName" disabled></el-input>
          </el-form-item>
          <el-form-item label="提交日期">
            <el-date-picker v-model="form.signHandlingDate" disabled type="date">
            </el-date-picker>

          </el-form-item>
        </el-form>
      </div>

      <el-form label-width='150px'>
        <div class="inlineData">

          <el-row>
            <el-col>
              <div class="title"
                   style="margin-bottom:20px">附件列表</div>
            </el-col>
          </el-row>
          
          <!-- <span class="breadcrumb-child" style="float: left;margin-top: 10px" v-if="signOrEdit" :disabled="true"> -->
          <span class="breadcrumb-child" style="float: left;margin-top: 10px">
                          <i></i>上传附件:
          </span>
          <!-- <span style="float: left" v-if="signOrEdit"> -->
          <span style="float: left">
            <CostFileUpload
                style="margin-bottom: 20px"
                v-model="fileList"
                :limit="limit"
                :isShow="isFlag"
                :attachmentData="attachmentData"
                :outerId="''">
            </CostFileUpload>
          </span>
          <DesignAlterationAttachmentTable
            :queryObj_passed_in='queryModel'
            :attaData='attachmentData'
            v-on:changeAttachments="changeAttachments"
            :showDeleteButton="signOrEdit"
            ref='DesignAlterationAttachmentTable'

          >
          </DesignAlterationAttachmentTable>
        </div>
      </el-form>

    </div>
  </div>
</template>

<script>
  import { getContractDetail, getSignInfo, findCurrentUserOrgList } from '@/api/cost/signContractAPI'
  import DesignAlterationAttachmentTable from '@/views/cost/designAlteration/DesignAlterationAttachmentTable'
  import ContractSelector from '@/components/cost/ContractSelector/'
  import { mapGetters } from 'vuex'
  import CostFileUpload from '@/components/cost/UploadFile/'
  import { getMeProfile } from '@/api/sys/userAPI'
  import { approveOutputValue, createOutputValue, getOutputValue, getNewFormOutputValue } from '@/api/cost/outputValueCheckAPI'
  import COSTENUM from '@/utils/cost/enum'
  export default {
    props: {
      activeName: {
        type: String
      },
      signOrEdit: {
        type: Boolean
      },
      isFlag:{
        type: Boolean
      }
    },
    data() {
      return {
        isShowEdit: false,
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
        limit: 100,
        size: 100,
        attachmentData: [],
        fileList: '',
        isOrEdit: false,
        contractId: '',
        projectmode: '',
        show: {
          group: false,
          company: false,
          dept: false,
          project: true,
          accObj: true
        },
        isShow: {
          group: false,
          company: false,
          dept: false,
          project: true,
          accObj: true

        },
        accountProjec: {},
        project: { companyId: null, projectId: null, accObjId: null },
        stayHappenAmount: false,
        primaryIsAdd: false,
        primaryContract: false,
        projectInfo: [],
        corporateCompanyList: [],
        dialogContractPlan: false,
        dialogVisible: false,
        detailContent: '',
        form: {
          contractNumber: '',
          dateOfContract: '',
          signHandlingDept: '',
          signHandlingDeptName: '',
          signHandlingPerson: '',
          signHandlingPersonName: '',
          signHandlingDate: new Date(),
          attachments: []
        },

        tableDataList: [],

        paymentDetails: [],
        rules: {
          contractNumber: [
            { required: true, message: '请输入纸质合同编号', trigger: 'blur' }
          ],
          dateOfContract: [
            { required: true, message: '请选择日期', trigger: 'change' }
          ]
        }
      }
    },
    components: {
      DesignAlterationAttachmentTable,
      CostFileUpload
    },
    mounted() {
      // alert('54646546')
      // 签订过纸质合同才查询签订信息
      if (
        this.$route.query.contractStatus === '3' ||
        this.$route.query.contractStatus === '4' ||
        this.$route.query.contractStatus === '5' ||
        this.$route.query.contractStatus === '7'
      ) {
        // alert('88888888')
        this.getContractSignInfo()
      }

      // 获取用户信息
      // 已审核的时候  需要拉取信息
      if (this.$route.query.contractStatus === '2') {
        // alert('99999999')
        this.getUserInfo()
      }
    },
    watch: {
      'form': {
        handler(newValue, oldValue) {
          this.form.attachments = this.attachmentData
          this.$emit('saveSignInfo', this.form)
        },
        deep: true
      }
    },
    methods: {
      getContractSignInfo() {
        // alert('546456')
        getSignInfo({ 'id': this.$route.query.contractId }).then(response => {
          if (response.data) {
            this.form.contractNumber = response.data.contractNumber
            this.form.signHandlingDate = response.data.signHandlingDate
            this.form.dateOfContract = response.data.dateOfContract
            this.form.attachments = response.data.attachments
            this.attachmentData = response.data.attachments
            this.form.signHandlingDept = response.data.signHandlingDept
            this.form.signHandlingDeptName = response.data.signHandlingDeptName
            this.form.signHandlingPerson = response.data.signHandlingPerson
            this.form.signHandlingPersonName = response.data.signHandlingPersonName
          }
        }).catch(error => {
          console.log(error)
          this.$showError(error.message ? error.message : 'msg_system_error')
        })
      },
      changeAttachments(data) {
        this.form.attachments = data
        this.attachmentData = data
      },
      // 初始化基本信息
      initCommonInfoData(response) {
        let _this = this
        if (!response.data) {
          this.$showNormalError('没有可用数据')
          return
        }
      },
      // 计算金额
      countAmount(value) {
        if (this.contractDetails.contractAmountIncludeTax) {
          this.contractDetails.contractAmountExcludeTax = Number(this.contractDetails.contractAmountIncludeTax) * Number(value)
          this.contractDetails.taxAmount = Number(this.contractDetails.contractAmountIncludeTax) - parseFloat(this.contractDetails.contractAmountExcludeTax)
        }
      },

      handleAddRow() {
        this.$router.push({
          name: 'NewContractInformation',
          query: { id: 0 }
        })
      },

      add() {
        this.$router.push({
          name: 'NewOrUpdateTargetCostCompilation',
          query: { id: 0, isEdit: true }
        })
      },
      submitForm() {
        let flag = false
        this.$refs['contractSignForm'].validate(valid => {
          if (valid) {
            flag = true
          }
        })
        return flag
      },
      getUserInfo() {
        this.form.signHandlingPerson = this.$getUserInfo()['username']
        this.form.signHandlingPersonName = this.$getUserInfo()['nickName']

        findCurrentUserOrgList()
          .then(response => {
            if (response.data != null && response.data.length > 0) {
              this.form.signHandlingDeptName = response.data[0].orgName
              this.form.signHandlingDept = response.data[0].orgCode
            }
          })
          .catch(error => {
            console.log(error)
          })
      }

    }
  }

</script>
<style scoped>
  .el-select {
    width: 200px;
  }
  .modeul .el-input{
    width: 200px;
  }
  .add {
    margin-bottom: 10px;
    text-align:right;
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
  .newAdd .el-button{
    float:right;
    margin-bottom:10px;
  }
</style>
